// Fichier généré par scripts/index-episodes.mjs — ne pas modifier à la main.
import type { Episode, Timing } from "./Video";
import t001 from "./data/001.timing.json";
import e001 from "../episodes/001.json";
import t002 from "./data/002.timing.json";
import e002 from "../episodes/002.json";
import t003 from "./data/003.timing.json";
import e003 from "../episodes/003.json";
import t004 from "./data/004.timing.json";
import e004 from "../episodes/004.json";
import t005 from "./data/005.timing.json";
import e005 from "../episodes/005.json";
import t006 from "./data/006.timing.json";
import e006 from "../episodes/006.json";
import t007 from "./data/007.timing.json";
import e007 from "../episodes/007.json";

export const EPISODES: { id: string; timing: Timing; episode: Episode }[] = [
  { id: "001", timing: t001 as unknown as Timing, episode: e001 as unknown as Episode },
  { id: "002", timing: t002 as unknown as Timing, episode: e002 as unknown as Episode },
  { id: "003", timing: t003 as unknown as Timing, episode: e003 as unknown as Episode },
  { id: "004", timing: t004 as unknown as Timing, episode: e004 as unknown as Episode },
  { id: "005", timing: t005 as unknown as Timing, episode: e005 as unknown as Episode },
  { id: "006", timing: t006 as unknown as Timing, episode: e006 as unknown as Episode },
  { id: "007", timing: t007 as unknown as Timing, episode: e007 as unknown as Episode },
];
