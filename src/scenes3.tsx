// Scènes des vidéos 005+ : site web barré, « elles en ont déjà un », focus configurable, teaser 3 secteurs
import React from "react";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { CheckIcon, Chip, ScreenCard, Stamp, Title, clamp, usePop } from "./components";
import type { SceneProps } from "./scenes";
import { atWord } from "./scenes2";
import { C, TITLE } from "./theme";

const Box: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
);

/** Maquette générique de site vitrine, dessinée en code. */
const SiteMock: React.FC<{ width: number; delay?: number; tint?: string }> = ({ width, delay = 0, tint = "#3A3A46" }) => {
  const p = usePop(delay, 13, 190);
  const s = width / 600;
  const bar = (w: number, h = 14, c = "#2E2E38") => <div style={{ width: w * s, height: h * s, borderRadius: 7 * s, background: c }} />;
  return (
    <div style={{ width, borderRadius: 26 * s, overflow: "hidden", background: "#17171D", border: `1px solid ${C.line}`, boxShadow: "0 30px 70px rgba(0,0,0,0.55)", transform: `scale(${0.7 + 0.3 * p})`, opacity: p }}>
      <div style={{ display: "flex", gap: 8 * s, padding: `${14 * s}px ${18 * s}px`, background: "#1F1F27" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14 * s, height: 14 * s, borderRadius: 7 * s, background: c }} />)}
        <div style={{ flex: 1, marginLeft: 12 * s, height: 14 * s, borderRadius: 7 * s, background: "#2A2A33" }} />
      </div>
      <div style={{ padding: 26 * s, display: "flex", flexDirection: "column", gap: 16 * s }}>
        <div style={{ height: 150 * s, borderRadius: 16 * s, background: `linear-gradient(135deg, ${tint}, #22222A)` }} />
        {bar(380, 22, "#3A3A46")}
        {bar(500)}
        {bar(440)}
        <div style={{ display: "flex", gap: 14 * s }}>{[0, 1, 2].map((i) => <div key={i} style={{ flex: 1, height: 70 * s, borderRadius: 12 * s, background: "#24242D" }} />)}</div>
      </div>
    </div>
  );
};

/* 005 · 1. Arrête de vendre des sites web */
export const SitesWeb: React.FC<SceneProps> = ({ words, dur }) => {
  const f = useCurrentFrame();
  const tX = atWord(words, "sites", 12);
  const x = interpolate(f - tX, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shake = f > tX + 5 && f < tX + 12 ? Math.sin(f * 3) * 12 : 0;
  return (
    <>
      <Title lines={[[{ t: "Arrête de vendre" }], [{ t: "des sites web", color: C.red, glow: C.redGlow, size: 104 }]]} top={210} />
      <Box top={540}>
        <div style={{ position: "relative", transform: `translateX(${shake}px)` }}>
          <SiteMock width={780} />
          <svg width={780} height={700} style={{ position: "absolute", left: 0, top: -20 }}>
            <line x1={60} y1={60} x2={60 + 660 * x} y2={60 + 580 * x} stroke={C.red} strokeWidth={34} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 18px ${C.red})` }} />
            <line x1={720} y1={60} x2={720 - 660 * Math.max(0, x * 1.4 - 0.4)} y2={60 + 580 * Math.max(0, x * 1.4 - 0.4)} stroke={C.red} strokeWidth={34} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 18px ${C.red})` }} />
          </svg>
        </div>
      </Box>
      <div style={{ position: "absolute", top: 1130, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {f > dur - 22 && <Stamp text="Stop" delay={dur - 22} size={80} />}
      </div>
    </>
  );
};

/* 005 · 2. Toutes les entreprises en ont déjà un */
export const DejaSites: React.FC<SceneProps> = () => {
  const tints = ["#5B3A3A", "#2E4A5B", "#3E5B2E", "#5B4E2E", "#4A2E5B", "#2E5B52"];
  return (
    <>
      <Title lines={[[{ t: "Elles en ont" }], [{ t: "déjà un", color: C.grey, size: 104 }]]} top={210} />
      <div style={{ position: "absolute", top: 520, left: 70, right: 70, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 26 }}>
        {tints.map((t, i) => (
          <div key={i} style={{ position: "relative" }}>
            <SiteMock width={292} delay={i * 3} tint={t} />
            <div style={{ position: "absolute", right: -8, top: -14, transform: `scale(${usePop(8 + i * 3, 9, 240)})` }}>
              <CheckIcon size={58} color={C.grey} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

/* Focus configurable : sur-titre (POV, N°1…), titre 2 lignes, capture, puces synchronisées sur la voix */
type FocusOpts = { kicker?: string; title: [string, string]; image: string; zoom?: boolean; chips?: { t: string; w: string }[] };
export const Focus: React.FC<SceneProps & { opts?: { focus?: FocusOpts } }> = ({ words, dur, opts }) => {
  const f = useCurrentFrame();
  const o = opts?.focus ?? { title: ["", ""], image: "images/restaurant.png" };
  const k = usePop(0, 9, 230);
  const zoom = o.zoom ? interpolate(f, [0, dur], [1, 1.25], { ...clamp, easing: Easing.inOut(Easing.quad) }) : 1;
  const big = o.kicker?.startsWith("N°");
  return (
    <>
      {o.kicker && (
        <div style={{ position: "absolute", top: big ? 170 : 200, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{
            transform: `scale(${k}) rotate(${big ? -4 : 0}deg)`, fontFamily: TITLE, fontWeight: 900, fontSize: big ? 120 : 44, color: big ? C.red : "#111",
            background: big ? "transparent" : C.yellow, padding: big ? 0 : "10px 30px", borderRadius: 16, letterSpacing: big ? -2 : 2,
            textShadow: big ? `0 0 40px ${C.redGlow}` : "none", textTransform: "uppercase",
          }}>{o.kicker}</div>
        </div>
      )}
      <Title lines={[[{ t: o.title[0], size: fit(o.title[0], 76) }], [{ t: o.title[1], color: big ? C.white : C.red, glow: big ? undefined : C.redGlow, size: fit(o.title[1], 100) }]]} top={o.kicker ? (big ? 320 : 290) : 210} delay={o.kicker ? 4 : 0} />
      <Box top={o.kicker ? (big ? 600 : 580) : 540}>
        {o.zoom ? (
          <div style={{ width: 980, height: 620, borderRadius: 40, overflow: "hidden", border: "10px solid #fff", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>
            <Img src={staticFile(o.image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: "40% 45%" }} />
          </div>
        ) : (
          <ScreenCard src={o.image} width={big ? 900 : 960} rotate={big ? 1.5 : -1.5} delay={o.kicker ? 6 : 0} />
        )}
      </Box>
      {!!o.chips?.length && (
        <Box top={o.kicker ? 1210 : 1170}>
          <div style={{ display: "flex", gap: 20 }}>
            {o.chips.map((c) => (
              <Chip key={c.t} text={c.t} delay={atWord(words, c.w, 20)} size={36} color="rgba(227,38,27,0.16)" icon={c.t.includes("direct") ? <LiveDot /> : <CheckIcon size={34} />} />
            ))}
          </div>
        </Box>
      )}
    </>
  );
};

/** taille de police pour qu'une ligne en capitales tienne sur ~980 px */
const fit = (t: string, max: number) => Math.min(max, Math.floor(1300 / Math.max(1, t.length)));

const LiveDot = () => {
  const f = useCurrentFrame();
  return <div style={{ width: 22, height: 22, borderRadius: 11, background: C.red, boxShadow: `0 0 ${10 + 8 * Math.sin(f / 4)}px ${C.red}` }} />;
};

/* 007 · 1. Teaser : 3 cartes mystère qui se retournent */
export const Teaser: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const imgs = ["images/carrosserie.png", "images/restaurant.png", "images/immobilier.png"];
  return (
    <>
      <Title lines={[[{ t: "3 secteurs" }], [{ t: "vont s'arracher ça", color: C.red, glow: C.redGlow, size: 76 }]]} top={210} />
      <div style={{ position: "absolute", top: 560, left: 50, right: 50, display: "flex", gap: 26, justifyContent: "center" }}>
        {imgs.map((src, i) => {
          const p = spring({ frame: f - i * 4, fps: 30, config: { damping: 12, stiffness: 180 } });
          const flip = interpolate(f, [dur - 26 + i * 5, dur - 16 + i * 5], [0, 180], clamp);
          const showBack = flip < 90;
          return (
            <div key={i} style={{ width: 300, height: 440, perspective: 1200, transform: `translateY(${(1 - p) * 150}px)`, opacity: p }}>
              <div style={{ width: "100%", height: "100%", position: "relative", transform: `rotateY(${flip}deg)`, transformStyle: "preserve-3d" }}>
                {showBack ? (
                  <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: "linear-gradient(160deg,#25252D,#141418)", border: `2px solid ${C.red}`, boxShadow: `0 0 50px rgba(227,38,27,0.25)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 140, color: C.red, textShadow: `0 0 30px ${C.redGlow}` }}>{i + 1}</div>
                    <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 80, color: C.white, opacity: 0.85 }}>?</div>
                  </div>
                ) : (
                  <div style={{ position: "absolute", inset: 0, borderRadius: 34, overflow: "hidden", border: "8px solid #fff", transform: "rotateY(180deg)" }}>
                    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const SCENES3 = { sitesWeb: SitesWeb, dejaSites: DejaSites, focus: Focus, teaser: Teaser };

