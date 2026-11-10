// Régénère src/episodes.gen.ts à partir de tous les épisodes qui ont une voix (src/data/NNN.timing.json).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ids = fs.readdirSync(path.join(ROOT, "src", "data"))
  .map((f) => /^(\d{3})\.timing\.json$/.exec(f)?.[1])
  .filter((id) => id && fs.existsSync(path.join(ROOT, "episodes", `${id}.json`)))
  .sort();
const lines = [
  "// Fichier généré par scripts/index-episodes.mjs — ne pas modifier à la main.",
  'import type { Episode, Timing } from "./Video";',
  ...ids.flatMap((id) => [`import t${id} from "./data/${id}.timing.json";`, `import e${id} from "../episodes/${id}.json";`]),
  "",
  "export const EPISODES: { id: string; timing: Timing; episode: Episode }[] = [",
  ...ids.map((id) => `  { id: "${id}", timing: t${id} as unknown as Timing, episode: e${id} as unknown as Episode },`),
  "];",
  "",
];
fs.writeFileSync(path.join(ROOT, "src", "episodes.gen.ts"), lines.join("\n"));
console.log(`${ids.length} épisodes indexés`);
