// Production d'une vidéo du jour : voix déjà générée -> index -> rendu -> dossier du jour + description.
//   node scripts/produce.mjs <AAAA-MM-JJ> <n° du jour 1-5> <NNN>
// Résultat : a-poster/<date>/<n>-carreia-<NNN>.mp4 + .txt (description), et out/check-<NNN>.png (planche de contrôle)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEEP_DAYS = 7;
const [date, slot, id] = process.argv.slice(2);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || !slot || !/^\d{3}$/.test(id || "")) {
  throw new Error("usage : node scripts/produce.mjs <AAAA-MM-JJ> <1-5> <NNN>");
}
const ep = JSON.parse(fs.readFileSync(path.join(ROOT, "episodes", `${id}.json`), "utf8"));
if (!ep.description) throw new Error(`episodes/${id}.json : champ "description" manquant`);
if (!fs.existsSync(path.join(ROOT, "src", "data", `${id}.timing.json`))) throw new Error(`voix manquante : node scripts/voice.mjs ${id}`);

const run = (cmd, args) => execFileSync(cmd, args, { cwd: ROOT, stdio: "inherit", env: browserEnv() });
function browserEnv() {
  const env = { ...process.env };
  const shell = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
  if (!env.REMOTION_BROWSER && fs.existsSync(shell)) env.REMOTION_BROWSER = shell;
  return env;
}

run("node", ["scripts/index-episodes.mjs"]);
const dir = path.join(ROOT, "a-poster", date);
fs.mkdirSync(dir, { recursive: true });
const base = path.join(dir, `${slot}-carreia-${id}`);
run("npx", ["remotion", "render", `carreia-${id}`, `${base}.mp4`, "--codec=h264", "--crf=20", "--audio-codec=aac", "--audio-bitrate=160k", "--log=error"]);
fs.writeFileSync(`${base}.txt`, ep.description.trim() + "\n");

// planche de contrôle (2 images/s) à regarder avant de valider
fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });
run("ffmpeg", ["-v", "error", "-y", "-i", `${base}.mp4`, "-vf", "fps=2,scale=150:-1,tile=12x5", "-frames:v", "1", path.join(ROOT, "out", `check-${id}.png`)]);

// on ne garde que les KEEP_DAYS derniers jours dans a-poster/
const days = fs.readdirSync(path.join(ROOT, "a-poster")).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
for (const old of days.slice(0, Math.max(0, days.length - KEEP_DAYS))) {
  fs.rmSync(path.join(ROOT, "a-poster", old), { recursive: true, force: true });
  console.log("supprimé :", old);
}
const dur = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `${base}.mp4`]).toString().trim();
console.log(`OK : a-poster/${date}/${slot}-carreia-${id}.mp4 (${Number(dur).toFixed(1)} s)`);
