import React from "react";
import { Composition } from "remotion";
import { CarreiaVideo, totalFrames, type Episode, type Timing } from "./Video";
import { FPS, H, W } from "./theme";
import timing001 from "./data/001.timing.json";
import episode001 from "../episodes/001.json";

const EPISODES: { id: string; timing: Timing; episode: Episode }[] = [
  { id: "001", timing: timing001 as Timing, episode: episode001 as Episode },
];

export const Root: React.FC = () => (
  <>
    {EPISODES.map((e) => (
      <Composition
        key={e.id}
        id={`carreia-${e.id}`}
        component={CarreiaVideo}
        durationInFrames={totalFrames(e.timing)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ timing: e.timing, episode: e.episode }}
      />
    ))}
  </>
);
