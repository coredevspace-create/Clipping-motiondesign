import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, TITLE, UI } from "./theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Ressort standard des apparitions (« pop »). */
export const usePop = (delay = 0, damping = 13, stiffness = 170) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, stiffness, mass: 0.8 } });
};

/** Fond noir avec halo rouge discret et grain de lumière. */
export const Background: React.FC<{ glow?: string }> = ({ glow = C.redGlow }) => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 40) * 40;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at ${540 + drift}px 820px, ${glow.replace("0.55", "0.16")}, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(1400px 1100px at 540px 900px, rgba(255,255,255,0.05), transparent 70%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(700px 900px at 540px 900px, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(700px 900px at 540px 900px, black, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Petite étiquette de marque en haut. */
export const BrandTag: React.FC = () => (
  <div
    style={{
      position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center",
    }}
  >
    <div
      style={{
        fontFamily: UI, fontWeight: 700, fontSize: 30, color: C.white, letterSpacing: 1,
        padding: "10px 26px", borderRadius: 999, background: "rgba(255,255,255,0.06)",
        border: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 12,
      }}
    >
      <div style={{ width: 14, height: 14, borderRadius: 7, background: C.red, boxShadow: `0 0 16px ${C.red}` }} />
      carreia.store
    </div>
  </div>
);

type Part = { t: string; color?: string; glow?: string; size?: number };

/** Titre du haut : lignes en Montserrat Black, mots clés colorés avec halo. */
export const Title: React.FC<{ lines: Part[][]; top?: number; delay?: number }> = ({ lines, top = 230, delay = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top, left: 40, right: 40, textAlign: "center" }}>
      {lines.map((line, i) => {
        const p = spring({ frame: f - delay - i * 4, fps: 30, config: { damping: 12, stiffness: 180 } });
        return (
          <div
            key={i}
            style={{
              transform: `translateY(${(1 - p) * 40}px) scale(${0.85 + 0.15 * p})`,
              opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
              lineHeight: 1.04,
            }}
          >
            {line.map((part, k) => (
              <span
                key={k}
                style={{
                  fontFamily: TITLE, fontWeight: 900, fontSize: part.size ?? 76, color: part.color ?? C.white,
                  letterSpacing: -1, textTransform: "uppercase",
                  textShadow: part.glow ? `0 0 28px ${part.glow}, 0 0 60px ${part.glow}` : "0 6px 30px rgba(0,0,0,0.6)",
                }}
              >
                {part.t}
                {k < line.length - 1 ? " " : ""}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** Capture d'écran d'un logiciel, dans une carte arrondie, avec reflet qui passe. */
export const ScreenCard: React.FC<{
  src: string; width?: number; delay?: number; rotate?: number; label?: string; shine?: boolean; style?: React.CSSProperties;
}> = ({ src, width = 940, delay = 0, rotate = 0, label, shine = true, style }) => {
  const f = useCurrentFrame();
  const p = usePop(delay, 14, 140);
  const shineX = interpolate(f - delay, [8, 38], [-120, 220], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <div
      style={{
        width, transform: `perspective(1600px) rotateX(${(1 - p) * 18}deg) rotateZ(${rotate}deg) scale(${0.7 + 0.3 * p})`,
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp), ...style,
      }}
    >
      <div
        style={{
          position: "relative", borderRadius: 34, overflow: "hidden", background: "#fff", padding: 10,
          boxShadow: `0 40px 90px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.15), 0 0 80px ${C.redGlow.replace("0.55", "0.18")}`,
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", display: "block", borderRadius: 26 }} />
        {shine && (
          <div
            style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(105deg, transparent ${shineX - 20}%, rgba(255,255,255,0.45) ${shineX}%, transparent ${shineX + 20}%)`,
              mixBlendMode: "overlay",
            }}
          />
        )}
      </div>
      {label && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
          <Chip text={label} delay={delay + 8} />
        </div>
      )}
    </div>
  );
};

export const Chip: React.FC<{ text: string; delay?: number; color?: string; textColor?: string; icon?: React.ReactNode; size?: number }> = ({
  text, delay = 0, color = "rgba(255,255,255,0.08)", textColor = C.white, icon, size = 34,
}) => {
  const p = usePop(delay, 11, 220);
  return (
    <div
      style={{
        transform: `scale(${p})`, display: "inline-flex", alignItems: "center", gap: 14,
        padding: `${size * 0.42}px ${size * 0.8}px`, borderRadius: 999, background: color,
        border: `1px solid ${C.line}`, fontFamily: UI, fontWeight: 700, fontSize: size, color: textColor,
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)", whiteSpace: "nowrap",
      }}
    >
      {icon}
      {text}
    </div>
  );
};

/** Tampon qui s'écrase (DÉPASSÉ, PAYÉ…). */
export const Stamp: React.FC<{ text: string; delay?: number; color?: string; rotate?: number; size?: number }> = ({
  text, delay = 0, color = C.red, rotate = -12, size = 92,
}) => {
  const f = useCurrentFrame();
  const p = spring({ frame: f - delay, fps: 30, config: { damping: 9, stiffness: 260, mass: 0.7 } });
  const scale = interpolate(p, [0, 1], [2.6, 1]);
  return (
    <div
      style={{
        transform: `rotate(${rotate}deg) scale(${scale})`, opacity: interpolate(f - delay, [0, 3], [0, 1], clamp),
        border: `10px solid ${color}`, color, borderRadius: 22, padding: "8px 34px",
        fontFamily: TITLE, fontWeight: 900, fontSize: size, letterSpacing: 4, textTransform: "uppercase",
        background: "rgba(9,9,11,0.55)", boxShadow: `0 0 40px ${color}66, inset 0 0 30px ${color}33`,
      }}
    >
      {text}
    </div>
  );
};

/** Nombre qui monte de `from` à `to`. */
export const Counter: React.FC<{ to: number; from?: number; delay?: number; dur?: number; suffix?: string; style?: React.CSSProperties }> = ({
  to, from = 0, delay = 0, dur = 22, suffix = "", style,
}) => {
  const f = useCurrentFrame();
  const v = interpolate(f - delay, [0, dur], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) });
  const txt = Math.round(v).toLocaleString("fr-FR").replace(/ | /g, " ");
  return <span style={style}>{txt}{suffix}</span>;
};

export const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 44, color = C.red }) => (
  <div
    style={{
      width: size, height: size, borderRadius: size / 2, background: color, display: "flex",
      alignItems: "center", justifyContent: "center", boxShadow: `0 0 18px ${color}88`, flexShrink: 0,
    }}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/** Logo Claude simplifié (étoile orange). */
export const Spark: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    {[0, 30, 60, 90, 120, 150].map((a) => (
      <rect key={a} x={11} y={2} width={2} height={20} rx={1} fill="#D97757" transform={`rotate(${a} 12 12)`} />
    ))}
  </svg>
);
