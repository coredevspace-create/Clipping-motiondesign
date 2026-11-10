import React from "react";
import { Easing, interpolate, spring, useCurrentFrame } from "remotion";
import { CheckIcon, Chip, Counter, ScreenCard, Spark, Stamp, Title, clamp, usePop } from "./components";
import type { Word } from "./Captions";
import { C, TITLE, UI } from "./theme";
import { SCENES2 } from "./scenes2";
import { SCENES3 } from "./scenes3";

export type SceneProps = { words: Word[]; dur: number; opts?: { prompt?: string; [k: string]: unknown } };

/** frame où commence le mot n° i de la scène */
const at = (words: Word[], i: number) => Math.round((words[Math.min(i, words.length - 1)]?.start ?? 0) * 30);
/** frame où commence le premier mot qui contient `txt` */
const atWord = (words: Word[], txt: string, fallback = 0) => {
  const i = words.findIndex((w) => w.text.toLowerCase().includes(txt.toLowerCase()));
  return i === -1 ? fallback : at(words, i);
};

const Center: React.FC<{ top?: number; children: React.ReactNode }> = ({ top = 560, children }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
    {children}
  </div>
);

// 1. ACCROCHE : le logiciel 3D + compteur jusqu'à 7 500 €
export const Hook: React.FC<SceneProps> = ({ words }) => {
  const f = useCurrentFrame();
  const tMoney = atWord(words, "jusqu");
  const zoom = interpolate(f, [0, 100], [1.0, 1.08], clamp);
  const money = spring({ frame: f - tMoney, fps: 30, config: { damping: 10, stiffness: 160 } });
  return (
    <>
      <Title lines={[[{ t: "Ce logiciel 3D" }], [{ t: "se vend jusqu'à", size: 64, color: C.grey }]]} top={210} />
      <div
        style={{
          position: "absolute", top: 420, left: 0, right: 0, textAlign: "center",
          transform: `scale(${0.4 + 0.6 * money})`, opacity: interpolate(money, [0, 0.3], [0, 1], clamp),
        }}
      >
        <Counter
          to={7500} delay={tMoney} dur={26} suffix=" €"
          style={{
            fontFamily: TITLE, fontWeight: 900, fontSize: 190, color: C.green, letterSpacing: -4,
            textShadow: `0 0 40px ${C.greenGlow}, 0 0 90px ${C.greenGlow}`,
          }}
        />
      </div>
      <Center top={690}>
        <div style={{ transform: `scale(${zoom})` }}>
          <ScreenCard src="images/restaurant.png" width={880} rotate={-2} />
        </div>
      </Center>
    </>
  );
};

// 2. CRÉÉ EN 20 MIN, sans coder : faux chat Claude
export const VingtMinutes: React.FC<SceneProps> = ({ words, dur, opts }) => {
  const f = useCurrentFrame();
  const card = usePop(0, 14, 160);
  const prog = interpolate(f, [8, dur - 22], [0, 100], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const done = f > dur - 22;
  const tCode = atWord(words, "sans");
  return (
    <>
      <Title lines={[[{ t: "Créé en" }, { t: "20 min", color: C.yellow, glow: "rgba(255,212,59,0.5)" }]]} top={230} />
      <Center top={430}>
        <div
          style={{
            width: 900, borderRadius: 36, background: C.card, border: `1px solid ${C.line}`, padding: 40,
            boxShadow: "0 40px 90px rgba(0,0,0,0.6)", transform: `scale(${0.8 + 0.2 * card})`, opacity: card,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 30 }}>
            <Spark size={46} />
            <div style={{ fontFamily: UI, fontWeight: 800, fontSize: 38, color: C.white }}>Claude</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                fontFamily: UI, fontWeight: 600, fontSize: 34, color: C.white, background: "#26262C",
                padding: "22px 30px", borderRadius: 26, maxWidth: 700, lineHeight: 1.3,
              }}
            >
              {opts?.prompt ?? "Crée-moi un logiciel 3D pour ma carrosserie"}
            </div>
          </div>
          <div style={{ marginTop: 34, fontFamily: UI, fontWeight: 600, fontSize: 32, color: C.grey }}>
            {done ? "Ton logiciel est prêt :" : `Génération… ${Math.round(prog)} %`}
          </div>
          <div style={{ marginTop: 18, height: 16, borderRadius: 8, background: "#2A2A30", overflow: "hidden" }}>
            <div
              style={{
                width: `${prog}%`, height: "100%", borderRadius: 8,
                background: `linear-gradient(90deg, #FF8A65, ${C.red})`, boxShadow: `0 0 20px ${C.red}`,
              }}
            />
          </div>
          <div style={{ marginTop: 26, height: 64 }}>
            {done && <Chip text="Version 1 prête" delay={dur - 22} color="rgba(34,224,122,0.15)" textColor={C.green} icon={<CheckIcon size={36} color={C.green} />} />}
          </div>
        </div>
      </Center>
      <Center top={1030}>
        <div style={{ display: "flex", gap: 24 }}>
          <Chip text="20 min" delay={6} size={40} icon={<ClockIcon />} />
          <Chip text="0 ligne de code" delay={tCode} size={40} color="rgba(227,38,27,0.18)" />
        </div>
      </Center>
    </>
  );
};

const ClockIcon = () => (
  <svg width={34} height={34} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={C.yellow} strokeWidth="2.4" />
    <path d="M12 7v5l3 2" stroke={C.yellow} strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

// 3. 90 % des entreprises utilisent encore ÇA (vieux logiciel barré)
export const VieuxLogiciel: React.FC<SceneProps> = ({ words }) => {
  const f = useCurrentFrame();
  const tCa = atWord(words, "encore");
  const shake = f > tCa && f < tCa + 8 ? Math.sin(f * 3) * 10 : 0;
  return (
    <>
      <Title
        lines={[
          [{ t: "90 %", color: C.red, glow: C.redGlow, size: 120 }],
          [{ t: "des entreprises", size: 66 }],
          [{ t: "utilisent encore ça", size: 54, color: C.grey }],
        ]}
        top={190}
      />
      <Center top={700}>
        <div style={{ transform: `translateX(${shake}px)`, filter: "saturate(0.6)" }}>
          <ScreenCard src="images/vieux-logiciel.png" width={820} rotate={2} shine={false} />
        </div>
      </Center>
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Stamp text="Dépassé" delay={tCa} />
      </div>
    </>
  );
};

// 4. Toi, tu arrives avec ÇA : logiciels 3D qui défilent
export const NouveauLogiciel: React.FC<SceneProps> = ({ words, dur }) => {
  const f = useCurrentFrame();
  const t1 = atWord(words, "carte");
  const imgs = ["images/carrosserie.png", "images/marketing.png", "images/immobilier.png"];
  const span = Math.max(1, (dur - t1) / imgs.length);
  const idx = f < t1 ? 0 : Math.min(imgs.length - 1, Math.floor((f - t1) / span));
  const chips = [
    { t: "Carte 3D", w: "3D" },
    { t: "Animée", w: "animée" },
    { t: "Sur mesure", w: "mesure" },
  ];
  return (
    <>
      <Title lines={[[{ t: "Toi, tu arrives" }], [{ t: "avec ça", color: C.red, glow: C.redGlow, size: 110 }]]} top={210} />
      <Center top={540}>
        <div key={idx}>
          <ScreenCard src={imgs[idx]} width={940} rotate={idx % 2 ? 1.5 : -1.5} delay={idx === 0 ? 0 : Math.round(t1 + idx * span)} />
        </div>
      </Center>
      <Center top={1170}>
        <div style={{ display: "flex", gap: 20 }}>
          {chips.map((c) => (
            <Chip key={c.t} text={c.t} delay={atWord(words, c.w)} size={36} color="rgba(227,38,27,0.16)" icon={<CheckIcon size={34} />} />
          ))}
        </div>
      </Center>
    </>
  );
};

// 5. N'importe quel secteur : grille 2×2
export const Secteurs: React.FC<SceneProps> = ({ words }) => {
  const items = [
    { src: "images/carrosserie.png", label: "Carrosserie", w: "carrosserie" },
    { src: "images/restaurant.png", label: "Restaurant", w: "restaurant" },
    { src: "images/immobilier.png", label: "Agence immo", w: "agence" },
    { src: "images/marketing.png", label: "Agence marketing", w: "prompt" },
  ];
  return (
    <>
      <Title lines={[[{ t: "N'importe quel" }], [{ t: "secteur", color: C.red, glow: C.redGlow, size: 110 }]]} top={210} />
      <div style={{ position: "absolute", top: 520, left: 50, right: 50, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 30px" }}>
        {items.map((it, i) => (
          <ScreenCard key={it.label} src={it.src} width={475} delay={Math.max(0, atWord(words, it.w) - 4 + (i === 3 ? 6 : 0))} label={it.label} shine={false} />
        ))}
      </div>
    </>
  );
};

// 6. Les étapes
export const Etapes: React.FC<SceneProps> = ({ words }) => {
  const steps = [
    { n: "01", t: "Tu donnes le prompt à Claude", w: "donnes" },
    { n: "02", t: "Tu réponds à ses questions", w: "réponds" },
    { n: "03", t: "Ton logiciel est prêt", w: "prêt" },
  ];
  return (
    <>
      <Title lines={[[{ t: "Zéro code." }], [{ t: "3 étapes", color: C.yellow, glow: "rgba(255,212,59,0.5)", size: 110 }]]} top={210} />
      <div style={{ position: "absolute", top: 600, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 34 }}>
        {steps.map((s, i) => (
          <Step key={s.n} {...s} delay={Math.max(0, atWord(words, s.w) - 3)} last={i === 2} />
        ))}
      </div>
    </>
  );
};

const Step: React.FC<{ n: string; t: string; delay: number; last: boolean }> = ({ n, t, delay, last }) => {
  const p = usePop(delay, 14, 200);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 30, padding: "34px 40px", borderRadius: 30,
        background: last ? "rgba(34,224,122,0.10)" : C.card, border: `1px solid ${last ? "rgba(34,224,122,0.4)" : C.line}`,
        transform: `translateX(${(1 - p) * -120}px)`, opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 56, color: C.red }}>{n}</div>
      <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 44, color: C.white, flex: 1 }}>{t}</div>
      {last && <CheckIcon size={58} color={C.green} />}
    </div>
  );
};

// 7. Se connecte à Outlook, Teams, Excel
export const Outils: React.FC<SceneProps> = ({ words }) => {
  const f = useCurrentFrame();
  const tools = [
    { name: "Outlook", letter: "O", color: "#0A64D6", w: "outlook" },
    { name: "Teams", letter: "T", color: "#5B5FC7", w: "teams" },
    { name: "Excel", letter: "X", color: "#1D7A45", w: "excel" },
  ];
  const hub = usePop(0, 12, 160);
  return (
    <>
      <Title lines={[[{ t: "Se connecte" }], [{ t: "à leurs outils", color: C.red, glow: C.redGlow }]]} top={220} />
      <svg style={{ position: "absolute", top: 0, left: 0 }} width={1080} height={1920}>
        {tools.map((t, i) => {
          const x = 220 + i * 320;
          const d = atWord(words, t.w);
          const len = interpolate(f - d, [0, 10], [0, 1], clamp);
          return (
            <line key={t.name} x1={540} y1={720} x2={540 + (x - 540) * len} y2={720 + (1060 - 720) * len}
              stroke={C.red} strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={-f * 2} opacity={0.8} />
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${hub})`, width: 300, height: 240, borderRadius: 40, background: C.card,
            border: `2px solid ${C.red}`, boxShadow: `0 0 60px ${C.redGlow}`, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
          }}
        >
          <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 64, color: C.white }}>3D</div>
          <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 30, color: C.grey }}>Ton logiciel</div>
        </div>
      </div>
      {tools.map((t, i) => (
        <ToolBadge key={t.name} {...t} x={220 + i * 320} delay={atWord(words, t.w)} />
      ))}
    </>
  );
};

const ToolBadge: React.FC<{ name: string; letter: string; color: string; x: number; delay: number }> = ({ name, letter, color, x, delay }) => {
  const p = usePop(delay + 6, 10, 220);
  return (
    <div style={{ position: "absolute", top: 1000, left: x - 140, width: 280, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, transform: `scale(${p})` }}>
      <div
        style={{
          width: 150, height: 150, borderRadius: 36, background: "#fff", display: "flex", alignItems: "center",
          justifyContent: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ width: 96, height: 96, borderRadius: 22, background: color, color: "#fff", fontFamily: TITLE, fontWeight: 900, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {letter}
        </div>
      </div>
      <div style={{ fontFamily: UI, fontWeight: 800, fontSize: 40, color: C.white }}>{name}</div>
    </div>
  );
};

// 8. Tout est inclus
export const Inclus: React.FC<SceneProps> = ({ words }) => {
  const items = [
    { t: "Le prompt ultra complet", w: "prompt" },
    { t: "Le guide complet", w: "guide" },
    { t: "Le script d'appel", w: "script" },
    { t: "Communauté + support", w: "premiers" },
  ];
  const tAll = atWord(words, "tout", at(words, words.length - 2));
  return (
    <>
      <Title lines={[[{ t: "Tout est" }], [{ t: "inclus", color: C.red, glow: C.redGlow, size: 120 }]]} top={210} />
      <div
        style={{
          position: "absolute", top: 580, left: 70, right: 70, padding: "46px 46px", borderRadius: 40,
          background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          display: "flex", flexDirection: "column", gap: 34,
        }}
      >
        {items.map((it) => (
          <IncludedRow key={it.t} text={it.t} delay={Math.max(0, atWord(words, it.w, atWord(words, "script") + 8) - 2)} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 1170, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Stamp text="Inclus" delay={tAll} color={C.green} rotate={-6} size={70} />
      </div>
    </>
  );
};

const IncludedRow: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const p = usePop(delay, 13, 210);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `translateY(${(1 - p) * 30}px)` }}>
      <CheckIcon size={54} />
      <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 44, color: C.white }}>{text}</div>
    </div>
  );
};

// 9. Prix de lancement : 199 € barré → 29 €
export const Prix: React.FC<SceneProps> = ({ words }) => {
  const f = useCurrentFrame();
  const t29 = atWord(words, "29");
  const t199 = atWord(words, "199");
  const strike = interpolate(f - t199 - 4, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const big = spring({ frame: f - t29, fps: 30, config: { damping: 9, stiffness: 170 } });
  return (
    <>
      <Title lines={[[{ t: "Offre de" }], [{ t: "lancement", color: C.red, glow: C.redGlow, size: 110 }]]} top={210} />
      <Center top={560}>
        <div style={{ position: "relative", fontFamily: TITLE, fontWeight: 900, fontSize: 120, color: C.grey, opacity: 0.85 }}>
          199 €
          <div
            style={{
              position: "absolute", left: -10, top: "52%", height: 14, width: `${strike * 110}%`, background: C.red,
              borderRadius: 7, transform: "rotate(-8deg)", boxShadow: `0 0 20px ${C.red}`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: TITLE, fontWeight: 900, fontSize: 260, color: C.green, letterSpacing: -6, lineHeight: 1,
            transform: `scale(${big})`, textShadow: `0 0 50px ${C.greenGlow}, 0 0 110px ${C.greenGlow}`,
          }}
        >
          29 €
        </div>
      </Center>
      <Center top={1110}>
        <Chip text="Ensuite, le prix repasse à 199 €" delay={atWord(words, "mais")} size={36} color="rgba(227,38,27,0.18)" icon={<ClockIcon />} />
      </Center>
    </>
  );
};

// 10. CTA : le lien est en bio
export const Cta: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const arrow = Math.sin(f / 4) * 18;
  const btn = usePop(6, 12, 180);
  const pulse = 1 + Math.sin(f / 5) * 0.03;
  return (
    <>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateY(${arrow}px)` }}>
        <svg width={150} height={150} viewBox="0 0 24 24" fill="none" style={{ overflow: "visible", filter: `drop-shadow(0 0 14px ${C.yellow})` }}>
          <path d="M12 20V5M5.5 11.5L12 5l6.5 6.5" stroke={C.yellow} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <Title lines={[[{ t: "Le lien est" }], [{ t: "en bio", color: C.yellow, glow: "rgba(255,212,59,0.55)", size: 150 }]]} top={500} />
      <Center top={900}>
        <div
          style={{
            transform: `scale(${btn * pulse})`, background: C.red, color: "#fff", fontFamily: UI, fontWeight: 800,
            fontSize: 46, padding: "38px 60px", borderRadius: 999, boxShadow: `0 20px 60px ${C.redGlow}`,
          }}
        >
          Mon prompt + le guide complet
        </div>
        <div style={{ marginTop: 34, fontFamily: UI, fontWeight: 700, fontSize: 40, color: C.grey, opacity: btn }}>
          carreia.store · <span style={{ color: C.green }}>29 €</span>
        </div>
      </Center>
    </>
  );
};

export const SCENES: Record<string, React.FC<SceneProps>> = {
  hook: Hook,
  vingtMinutes: VingtMinutes,
  vieuxLogiciel: VieuxLogiciel,
  nouveauLogiciel: NouveauLogiciel,
  secteurs: Secteurs,
  etapes: Etapes,
  outils: Outils,
  inclus: Inclus,
  prix: Prix,
  cta: Cta,
  ...SCENES2,
  ...SCENES3,
} as Record<string, React.FC<SceneProps>>;
