// Génère la voix off d'un épisode avec Gemini TTS, en UNE seule requête pour toute la vidéo
// (le quota gratuit est d'environ 10 requêtes par jour et par modèle), puis la découpe en scènes.
//   node scripts/voice.mjs 001             -> régénère seulement si le texte a changé
//   node scripts/voice.mjs 001 --force     -> régénère quoi qu'il arrive
//   GEMINI_TTS_MODEL=gemini-3.8-flash-lite-tts node scripts/voice.mjs 001   -> autre modèle
// Clé : secret réseau de l'environnement (header x-goog-api-key) ou variable GEMINI_API_KEY.
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODELS = (process.env.GEMINI_TTS_MODEL || "gemini-3.8-flash-tts,gemini-3.8-flash-lite-tts,gemini-3.1-flash-tts-preview").split(",");
const [id, flag] = process.argv.slice(2);
if (!id) throw new Error("usage : node scripts/voice.mjs <id> [--force]");

const ep = JSON.parse(fs.readFileSync(path.join(ROOT, "episodes", `${id}.json`), "utf8"));
const outDir = path.join(ROOT, "public", "audio", id);
const timingFile = path.join(ROOT, "src", "data", `${id}.timing.json`);
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(timingFile), { recursive: true });
const fullWav = path.join(outDir, "voix.wav");
const metaFile = path.join(outDir, "voix.json");

// Consigne au format « notes du réalisateur + transcript » : seul le TRANSCRIPT est lu à voix haute.
const transcript = ep.scenes.map((s) => s.say).join("\n\n");
const prompt = `${ep.direction}\n\n#### TRANSCRIPT\n${transcript}`;
const hash = crypto.createHash("sha1").update(ep.voix + prompt).digest("hex").slice(0, 12);

function sleep(s) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, s * 1000); }

function tts(model) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: ep.voix } } },
    },
  });
  const args = ["-sS", "-X", "POST", "-H", "Content-Type: application/json", "--data-binary", "@-",
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`];
  if (process.env.GEMINI_API_KEY) args.push("-H", `x-goog-api-key: ${process.env.GEMINI_API_KEY}`);
  for (let attempt = 1; attempt <= 5; attempt++) {
    const raw = execFileSync("curl", args, { input: body, maxBuffer: 1 << 28 }).toString();
    let res;
    try { res = JSON.parse(raw); } catch { res = { error: { code: 503, status: "réponse invalide", message: raw.slice(0, 120) } }; }
    if (!res.error) {
      const part = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
      if (!part) throw new Error("Pas d'audio dans la réponse : " + JSON.stringify(res).slice(0, 300));
      return { mime: part.inlineData.mimeType, buf: Buffer.from(part.inlineData.data, "base64") };
    }
    const msg = res.error.message || "";
    if (/per day/i.test(msg)) return { error: `quota du jour épuisé pour ${model}` };
    const wait = /retry in ([\d.]+)s/i.exec(msg);
    if (res.error.code === 503 || wait) {
      const s = wait ? Math.ceil(Number(wait[1])) + 2 : 10 * attempt;
      console.log(`  ${model} : ${res.error.status}, nouvel essai dans ${s} s…`);
      sleep(s);
      continue;
    }
    return { error: `${model} : ${msg.slice(0, 200)}` };
  }
  return { error: `${model} : indisponible` };
}

// Gemini renvoie soit un WAV complet (en-tête RIFF + éventuels blocs de métadonnées en fin de fichier),
// soit du PCM brut. On n'extrait QUE les échantillons du bloc « data » : c'est ce qui supprime
// le clic du début et le grésillement de la fin.
function toPcm({ mime, buf }) {
  if (buf.toString("ascii", 0, 4) === "RIFF") {
    let off = 12, rate = 24000, channels = 1, bits = 16;
    while (off + 8 <= buf.length) {
      const idc = buf.toString("ascii", off, off + 4);
      const size = buf.readUInt32LE(off + 4);
      if (idc === "fmt ") {
        channels = buf.readUInt16LE(off + 10);
        rate = buf.readUInt32LE(off + 12);
        bits = buf.readUInt16LE(off + 22);
      } else if (idc === "data") {
        const len = Math.min(size, buf.length - off - 8);
        return { pcm: buf.subarray(off + 8, off + 8 + len), rate, channels, bits };
      }
      off += 8 + size + (size % 2);
    }
    throw new Error("WAV sans bloc data");
  }
  const rate = Number(/rate=(\d+)/.exec(mime)?.[1] || 24000);
  return { pcm: buf, rate, channels: 1, bits: 16 };
}

function ffmpeg(...args) { return execFileSync("ffmpeg", ["-v", "error", "-y", ...args]); }
function duration(f) {
  return Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
}

// ---------- 1. génération (une requête) ----------
const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, "utf8")) : null;
if (flag === "--force" || meta?.hash !== hash || !fs.existsSync(fullWav)) {
  let audio, model;
  for (model of MODELS) {
    audio = tts(model);
    if (!audio.error) break;
    console.log("  " + audio.error);
  }
  if (audio.error) throw new Error("Aucun modèle TTS disponible (quota gratuit épuisé ?) — réessaie demain.");
  const p = toPcm(audio);
  const raw = fullWav + ".raw";
  fs.writeFileSync(raw, p.pcm);
  ffmpeg("-f", `s${p.bits}le`, "-ar", String(p.rate), "-ac", String(p.channels), "-i", raw,
    "-af", [
      "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03",
      "areverse", "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05", "areverse",
      "afade=t=in:d=0.015", "areverse,afade=t=in:d=0.08,areverse",
      "loudnorm=I=-15:TP=-1.5:LRA=9", "aresample=48000",
    ].join(","), "-ac", "1", fullWav);
  fs.rmSync(raw);
  fs.writeFileSync(metaFile, JSON.stringify({ hash, model }));
  console.log(`voix générée avec ${model} (${ep.voix}) : ${duration(fullWav).toFixed(2)} s`);
} else {
  console.log("voix inchangée");
}

// ---------- 2. découpage en scènes sur les silences ----------
const total = duration(fullWav);
const sdOut = execFileSync("sh", ["-c", `ffmpeg -hide_banner -i "${fullWav}" -af silencedetect=noise=-38dB:d=0.12 -f null - 2>&1`]).toString();
const silences = [];
let cur = null;
for (const line of sdOut.split("\n")) {
  const a = /silence_start: ([\d.]+)/.exec(line);
  const b = /silence_end: ([\d.]+)/.exec(line);
  if (a) cur = Number(a[1]);
  if (b && cur !== null) { silences.push({ start: cur, end: Number(b[1]) }); cur = null; }
}

// Poids d'un mot à l'oral (syllabes approx.), pour estimer où tombe chaque coupure.
function weight(word) {
  const w = word.toLowerCase();
  let v;
  if (/\d/.test(w)) {
    v = w.replace(/\D/g, "").length * 1.6 + (w.includes("€") ? 1.5 : 0) + (w.includes("%") ? 2.5 : 0);
  } else {
    v = (w.match(/[aeiouyàâäéèêëîïôöùûü]+/g) || []).length;
    if (/es?$/.test(w.replace(/[^a-zà-ü]/g, "")) && v > 1) v -= 0.5;
  }
  return Math.max(v, 0.6);
}
const pauseAfter = (word) => (/[.!?…]$/.test(word) ? 1.6 : /[,:;]$/.test(word) ? 0.8 : 0);
const sceneWeights = ep.scenes.map((s) => s.sub.split(/ +/).filter(Boolean).reduce((a, w) => a + weight(w) + pauseAfter(w), 0) + 1.5);
const sw = sceneWeights.reduce((a, b) => a + b, 0);
const expected = [];
{ let acc = 0; for (let i = 0; i < sceneWeights.length - 1; i++) { acc += sceneWeights[i]; expected.push((acc / sw) * total); } }

// programmation dynamique : choisir, dans l'ordre, un silence pour chaque coupure attendue
const cand = silences.map((s) => ({ ...s, mid: (s.start + s.end) / 2, len: s.end - s.start }));
const N = expected.length, M = cand.length;
let cuts;
if (M >= N && N > 0) {
  const INF = 1e9;
  const dp = Array.from({ length: N + 1 }, () => new Array(M + 1).fill(INF));
  const from = Array.from({ length: N + 1 }, () => new Array(M + 1).fill(-1));
  for (let j = 0; j <= M; j++) dp[0][j] = 0;
  for (let i = 1; i <= N; i++) {
    for (let j = i; j <= M; j++) {
      // soit on n'utilise pas le silence j, soit on l'utilise pour la coupure i
      if (dp[i][j - 1] < dp[i][j]) { dp[i][j] = dp[i][j - 1]; from[i][j] = from[i][j - 1]; }
      const c = cand[j - 1];
      const cost = dp[i - 1][j - 1] + (c.mid - expected[i - 1]) ** 2 - 0.6 * Math.min(c.len, 0.8);
      if (cost < dp[i][j]) { dp[i][j] = cost; from[i][j] = j - 1; }
    }
  }
  cuts = [];
  let j = M;
  for (let i = N; i >= 1; i--) {
    const k = from[i][j];
    cuts.unshift(cand[k].mid);
    j = k;
  }
} else {
  cuts = expected;
  console.log("  pas assez de silences détectés : découpage estimé");
}

// Correction manuelle possible, valable seulement pour CETTE prise de voix :
// public/audio/<id>/coupes.json = { "hash": "<hash de voix.json>", "apresScene": { "3": 10.95 } }
const coupesFile = path.join(outDir, "coupes.json");
if (fs.existsSync(coupesFile)) {
  const c = JSON.parse(fs.readFileSync(coupesFile, "utf8"));
  if (c.hash === hash) {
    for (const [scene, t] of Object.entries(c.apresScene)) cuts[Number(scene) - 1] = t;
    console.log("  coupes manuelles appliquées");
  }
}

// ---------- 3. un fichier par scène + timing des mots ----------
const bounds = [0, ...cuts, total];
const scenes = ep.scenes.map((s, i) => {
  const n = String(i + 1).padStart(2, "0");
  const file = `audio/${id}/${n}.wav`;
  const a = bounds[i], b = bounds[i + 1];
  ffmpeg("-i", fullWav, "-ss", a.toFixed(3), "-to", b.toFixed(3),
    "-af", "silenceremove=start_periods=1:start_threshold=-42dB,areverse,silenceremove=start_periods=1:start_threshold=-42dB,areverse,afade=t=in:d=0.01,areverse,afade=t=in:d=0.04,areverse",
    path.join(ROOT, "public", file));
  const d = duration(path.join(ROOT, "public", file));
  const words = s.sub.split(/ +/).filter(Boolean).reduce((acc, w) => {
    // la ponctuation isolée (« ça : ») reste collée au mot précédent
    if (/^[^\p{L}\p{N}]+$/u.test(w) && acc.length) acc[acc.length - 1] += "\u00a0" + w;
    else acc.push(w);
    return acc;
  }, []);
  // silences à l'intérieur de la scène -> on aligne les virgules dessus
  const inner = cand.filter((c) => c.mid > a + 0.15 && c.mid < b - 0.15).map((c) => c.mid - a);
  const ws = words.map((w) => weight(w) + pauseAfter(w) * 0.5);
  const tot = ws.reduce((x, y) => x + y, 0);
  let t = 0;
  const timed = words.map((text, k) => {
    const start = t;
    t += (ws[k] / tot) * d;
    return { text, start, end: t };
  });
  // recale la fin d'un mot ponctué sur le silence intérieur le plus proche (si proche)
  for (const w of timed) {
    if (!/[,:;.…!?]$/.test(w.text)) continue;
    const near = inner.find((m) => Math.abs(m - w.end) < 0.45);
    if (near !== undefined) w.end = near;
  }
  for (let k = 1; k < timed.length; k++) timed[k].start = timed[k - 1].end;
  return {
    type: s.type, file, duration: +d.toFixed(3),
    words: timed.map((w) => ({ text: w.text, start: +w.start.toFixed(3), end: +Math.min(w.end, d).toFixed(3) })),
  };
});

fs.writeFileSync(timingFile, JSON.stringify({ id, voice: ep.voix, scenes }, null, 2));
for (const [i, s] of scenes.entries()) console.log(`scène ${String(i + 1).padStart(2, "0")} ${s.type.padEnd(16)} ${s.duration.toFixed(2)} s`);
console.log(`OK → ${path.relative(ROOT, timingFile)}`);
