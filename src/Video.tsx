import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Captions, type Word } from "./Captions";
import { Background, BrandTag, clamp } from "./components";
import { SCENES } from "./scenes";
import { FPS } from "./theme";

export type Timing = { id: string; scenes: { type: string; file: string; duration: number; words: Word[] }[] };
export type Episode = { scenes: { type: string; highlight?: string[] }[] };

export const GAP = 0.12; // respiration entre deux scènes (s)
export const OUTRO_HOLD = 1.6; // la dernière scène reste à l'écran après la voix (s)

export const layout = (timing: Timing) => {
  let t = 0;
  return timing.scenes.map((s, i) => {
    const last = i === timing.scenes.length - 1;
    const from = Math.round(t * FPS);
    const len = Math.round((s.duration + (last ? OUTRO_HOLD : GAP)) * FPS);
    t += s.duration + GAP;
    return { ...s, from, len };
  });
};

export const totalFrames = (timing: Timing) => {
  const l = layout(timing);
  return l[l.length - 1].from + l[l.length - 1].len;
};

/** Entrée de scène : léger zoom + flou qui se dissipe. */
const SceneIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const blur = interpolate(f, [0, 5], [10, 0], clamp);
  const s = interpolate(f, [0, 6], [1.06, 1], clamp);
  return <AbsoluteFill style={{ filter: `blur(${blur}px)`, transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

export const CarreiaVideo: React.FC<{ timing: Timing; episode: Episode }> = ({ timing, episode }) => {
  const scenes = layout(timing);
  return (
    <AbsoluteFill>
      <Background />
      {scenes.map((s, i) => {
        const Scene = SCENES[s.type];
        return (
          <Sequence key={i} from={s.from} durationInFrames={s.len} name={`${i + 1}. ${s.type}`}>
            <Audio src={staticFile(s.file)} />
            <SceneIn>
              <Scene words={s.words} dur={s.len} />
            </SceneIn>
            <Captions words={s.words} highlight={episode.scenes[i]?.highlight} />
          </Sequence>
        );
      })}
      <BrandTag />
    </AbsoluteFill>
  );
};
