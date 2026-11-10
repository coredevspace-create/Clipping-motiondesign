// Rend une vidéo :  node scripts/render.mjs 001   ->  videos/carreia-001.mp4
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const id = process.argv[2];
if (!id) throw new Error("usage : node scripts/render.mjs <id>");
const env = { ...process.env };
// navigateur déjà présent dans l'environnement cloud Claude
const shell = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (!env.REMOTION_BROWSER && fs.existsSync(shell)) env.REMOTION_BROWSER = shell;
execFileSync("node", ["scripts/index-episodes.mjs"], { stdio: "inherit" });
fs.mkdirSync("videos", { recursive: true });
execFileSync("npx", ["remotion", "render", `carreia-${id}`, `videos/carreia-${id}.mp4`, "--codec=h264", "--crf=18",
  "--audio-codec=aac", "--audio-bitrate=192k"], { stdio: "inherit", env });
