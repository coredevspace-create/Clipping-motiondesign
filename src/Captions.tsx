import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, TITLE } from "./theme";

export type Word = { text: string; start: number; end: number };

const chunk = (words: Word[]) => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    const len = cur.map((x) => x.text).join(" ").length;
    if (cur.length >= 3 || len > 16 || /[,.:;!?…]$/.test(w.text)) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  return out;
};

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}%€]/gu, "");

/** Sous-titres karaoké : 3 mots max, le mot prononcé est surligné en jaune. */
export const Captions: React.FC<{ words: Word[]; highlight?: string[]; top?: number }> = ({ words, highlight = [], top = 1400 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const groups = chunk(words);
  let gi = groups.findIndex((g) => t < g[g.length - 1].end);
  if (gi === -1) gi = groups.length - 1;
  const g = groups[gi];
  const gStart = Math.round(g[0].start * fps);
  const p = spring({ frame: f - gStart, fps, config: { damping: 14, stiffness: 260 } });
  const hl = highlight.map(norm);
  return (
    <div style={{ position: "absolute", top, left: 50, right: 50, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 18px",
          transform: `scale(${0.88 + 0.12 * p})`, opacity: interpolate(p, [0, 0.5], [0, 1]),
        }}
      >
        {g.map((w, i) => {
          const active = t >= w.start && t < w.end + 0.02;
          const isKey = hl.includes(norm(w.text));
          return (
            <span
              key={i}
              style={{
                fontFamily: TITLE, fontWeight: 800, fontSize: 64, lineHeight: 1.15,
                padding: "2px 14px", borderRadius: 14,
                color: active ? "#111" : isKey ? C.yellow : C.white,
                background: active ? C.yellow : "transparent",
                boxShadow: active ? `0 0 30px ${C.yellow}66` : "none",
                textShadow: active ? "none" : "0 4px 18px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)",
                transform: active ? "scale(1.06)" : "scale(1)",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
