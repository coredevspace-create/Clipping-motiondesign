import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Charte Carreia (cf. BRAND.md)
export const C = {
  bg: "#09090B",
  bg2: "#141417",
  card: "#18181C",
  line: "rgba(255,255,255,0.10)",
  white: "#FFFFFF",
  grey: "#A1A1AA",
  red: "#E3261B",
  redGlow: "rgba(227,38,27,0.55)",
  yellow: "#FFD43B",
  green: "#22E07A",
  greenGlow: "rgba(34,224,122,0.55)",
};

export const TITLE = "Montserrat";
export const UI = "Inter";

const fonts: [string, string, number][] = [
  [TITLE, "montserrat-latin-600-normal.woff2", 600],
  [TITLE, "montserrat-latin-700-normal.woff2", 700],
  [TITLE, "montserrat-latin-800-normal.woff2", 800],
  [TITLE, "montserrat-latin-900-normal.woff2", 900],
  [UI, "inter-latin-500-normal.woff2", 500],
  [UI, "inter-latin-600-normal.woff2", 600],
  [UI, "inter-latin-700-normal.woff2", 700],
  [UI, "inter-latin-800-normal.woff2", 800],
];
for (const [family, file, weight] of fonts) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight: String(weight) });
}

export const FPS = 30;
export const W = 1080;
export const H = 1920;
