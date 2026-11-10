import React from "react";
import { Composition } from "remotion";
import { CarreiaVideo, totalFrames, type Episode, type Timing } from "./Video";
import { FPS, H, W } from "./theme";
import timing001 from "./data/001.timing.json";
import episode001 from "../episodes/001.json";
import timing002 from "./data/002.timing.json";
import episode002 from "../episodes/002.json";
import timing003 from "./data/003.timing.json";
import episode003 from "../episodes/003.json";
import timing004 from "./data/004.timing.json";
import episode004 from "../episodes/004.json";

const EPISODES: { id: string; timing: Timing; episode: Episode }[] = [
  { id: "001", timing: timing001 as Timing, episode: episode001 as Episode },
  { id: "002", timing: timing002 as Timing, episode: episode002 as Episode },
  { id: "003", timing: timing003 as Timing, episode: episode003 as Episode },
  { id: "004", timing: timing004 as Timing, episode: episode004 as Episode },
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
