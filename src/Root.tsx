import React from "react";
import { Composition } from "remotion";
import { CarreiaVideo, totalFrames } from "./Video";
import { EPISODES } from "./episodes.gen";
import { FPS, H, W } from "./theme";

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
