// Scènes « motion design » des vidéos 002+ (moins d'images, plus d'animation)
import React from "react";
import { Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame } from "remotion";
import { Chip, Counter, ScreenCard, Spark, Title, clamp, usePop } from "./components";
import type { SceneProps } from "./scenes";
import { C, TITLE, UI } from "./theme";

const at = (words: SceneProps["words"], i: number) => Math.round((words[Math.min(i, words.length - 1)]?.start ?? 0) * 30);
export const atWord = (words: SceneProps["words"], txt: string, fallback = 0) => {
  const i = words.findIndex((w) => w.text.toLowerCase().includes(txt.toLowerCase()));
  return i === -1 ? fallback : at(words, i);
};

const Box: React.FC<{ top: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ top, children, style }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
    {children}
  </div>
);

/* ---------- icônes ---------- */
const stroke = { fill: "none", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
export const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({ name, size = 64, color = C.white }) => {
  const p = { ...stroke, stroke: color };
  const paths: Record<string, React.ReactNode> = {
    car: (<><path {...p} d="M3 15l2-5.5A2 2 0 0 1 6.9 8h10.2a2 2 0 0 1 1.9 1.5L21 15v3h-2.5M3 15v3h2.5M3 15h18" /><circle {...p} cx="7.5" cy="17.5" r="1.8" /><circle {...p} cx="16.5" cy="17.5" r="1.8" /></>),
    food: (<><path {...p} d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M9 3v6" /><path {...p} d="M17 21V3c-2 1.5-3 4-3 7v3h3" /></>),
    house: (<><path {...p} d="M3 11l9-7 9 7" /><path {...p} d="M5 10v10h14V10" /><path {...p} d="M10 20v-6h4v6" /></>),
    calendar: (<><rect {...p} x="3.5" y="5" width="17" height="15" rx="2.5" /><path {...p} d="M3.5 10h17M8 3v4M16 3v4" /></>),
    team: (<><circle {...p} cx="9" cy="8" r="3" /><path {...p} d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" /><circle {...p} cx="17" cy="9" r="2.4" /><path {...p} d="M16 14c2.6 0 4.2 1.8 4.6 4.5" /></>),
    doc: (<><path {...p} d="M7 3h7l5 5v13H7z" /><path {...p} d="M14 3v5h5M10 13h6M10 17h6" /></>),
    book: (<><path {...p} d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path {...p} d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /></>),
    phone: (<><path {...p} d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></>),
    send: (<><path {...p} d="M21 3L10 14M21 3l-7 18-4-7-7-4z" /></>),
    heart: (<path d="M12 20s-7-4.4-9-8.8C1.6 7.8 3.6 4 7.2 4c2 0 3.6 1.2 4.8 3 1.2-1.8 2.8-3 4.8-3 3.6 0 5.6 3.8 4.2 7.2C19 15.6 12 20 12 20z" fill={color} />),
    arrowDown: (<path {...p} d="M12 4v15M6 13l6 6 6-6" />),
    chat: (<><path {...p} d="M4 5h16v11H9l-5 4z" /></>),
  };
  return <svg width={size} height={size} viewBox="0 0 24 24">{paths[name]}</svg>;
};

/* ========== 002 · 1. Sois le premier de ta ville ========== */
export const Premier: React.FC<SceneProps> = ({ words, dur }) => {
  const f = useCurrentFrame();
  const map = usePop(0, 14, 150);
  const pins = [
    { x: 190, y: 170, label: "Garage", icon: "car" },
    { x: 690, y: 140, label: "Restaurant", icon: "food" },
    { x: 160, y: 520, label: "Agence immo", icon: "house" },
    { x: 700, y: 500, label: "Agence", icon: "team" },
  ];
  const tCa = atWord(words, "ça", dur - 15);
  const flip = interpolate(f - tCa, [0, 6], [0, 1], clamp);
  return (
    <>
      <Title lines={[[{ t: "Sois le premier" }], [{ t: "de ta ville", color: C.red, glow: C.redGlow, size: 100 }]]} top={210} />
      <Box top={500}>
        <div
          style={{
            position: "relative", width: 940, height: 720, borderRadius: 40, overflow: "hidden",
            background: "#101016", border: `1px solid ${C.line}`, boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
            transform: `scale(${0.85 + 0.15 * map})`, opacity: map,
          }}
        >
          <svg width={940} height={720} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const horiz = i % 2 === 0;
              const v = 40 + random(`r${i}`) * 860;
              const len = interpolate(f, [0, 18 + i], [0, 1], clamp);
              return horiz ? (
                <line key={i} x1={0} y1={(v * 720) / 940} x2={940 * len} y2={(v * 720) / 940 + 40 * (random(`s${i}`) - 0.5)} stroke="#2A2A35" strokeWidth={6 + random(`w${i}`) * 10} />
              ) : (
                <line key={i} x1={v} y1={0} x2={v + 60 * (random(`s${i}`) - 0.5)} y2={720 * len} stroke="#2A2A35" strokeWidth={6 + random(`w${i}`) * 10} />
              );
            })}
          </svg>
          {/* radar autour de « toi » */}
          {[0, 1, 2].map((k) => {
            const r = ((f + k * 15) % 45) / 45;
            return (
              <div key={k} style={{
                position: "absolute", left: 470 - 260 * r, top: 360 - 260 * r, width: 520 * r, height: 520 * r, borderRadius: "50%",
                border: `3px solid ${C.red}`, opacity: 1 - r,
              }} />
            );
          })}
          <div style={{ position: "absolute", left: 470 - 60, top: 360 - 60, width: 120, height: 120, borderRadius: 60, background: C.red, boxShadow: `0 0 50px ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TITLE, fontWeight: 900, fontSize: 34, color: "#fff", transform: `scale(${usePop(4, 9, 220)})` }}>
            TOI
          </div>
          {pins.map((p, i) => {
            const s = spring({ frame: f - 6 - i * 3, fps: 30, config: { damping: 10, stiffness: 200 } });
            return (
              <div key={p.label} style={{ position: "absolute", left: p.x - 20, top: p.y - 20, transform: `scale(${s})`, display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", borderRadius: 999, background: flip > 0.5 ? "rgba(34,224,122,0.15)" : "#1E1E26", border: `1px solid ${flip > 0.5 ? C.green : C.line}` }}>
                <Icon name={p.icon} size={40} color={flip > 0.5 ? C.green : C.grey} />
                <span style={{ fontFamily: UI, fontWeight: 700, fontSize: 30, color: C.white }}>{p.label}</span>
              </div>
            );
          })}
        </div>
      </Box>
    </>
  );
};

/* ========== 002 · 2. Les métiers ont besoin d'un logiciel ========== */
export const Metiers: React.FC<SceneProps> = ({ words }) => {
  const items = [
    { icon: "car", label: "Garage", w: "garage" },
    { icon: "food", label: "Restaurant", w: "restaurant" },
    { icon: "house", label: "Agence", w: "agence" },
  ];
  return (
    <>
      <Title lines={[[{ t: "Ils ont tous besoin" }], [{ t: "d'un logiciel", color: C.red, glow: C.redGlow, size: 100 }]]} top={210} />
      <div style={{ position: "absolute", top: 560, left: 60, right: 60, display: "flex", gap: 30, justifyContent: "center" }}>
        {items.map((it) => <MetierCard key={it.label} {...it} delay={Math.max(0, atWord(words, it.w) - 3)} />)}
      </div>
      <Box top={1060}>
        <Chip text="Pour gérer leurs clients" delay={atWord(words, "besoin", 60)} size={40} color="rgba(227,38,27,0.18)" icon={<Icon name="team" size={40} color={C.red} />} />
      </Box>
    </>
  );
};

const MetierCard: React.FC<{ icon: string; label: string; delay: number }> = ({ icon, label, delay }) => {
  const f = useCurrentFrame();
  const p = usePop(delay, 11, 200);
  const float = Math.sin((f + delay) / 12) * 8;
  return (
    <div style={{
      width: 290, height: 380, borderRadius: 40, background: C.card, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 30, transform: `translateY(${(1 - p) * 120 + float}px) scale(${0.7 + 0.3 * p})`, opacity: p,
      boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
    }}>
      <div style={{ width: 150, height: 150, borderRadius: 75, background: "rgba(227,38,27,0.14)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px rgba(227,38,27,0.25)` }}>
        <Icon name={icon} size={90} color={C.white} />
      </div>
      <div style={{ fontFamily: TITLE, fontWeight: 800, fontSize: 40, color: C.white }}>{label}</div>
    </div>
  );
};

/* ========== 002 · 5. Avant / Aujourd'hui ========== */
export const AvantApres: React.FC<SceneProps> = ({ words }) => {
  const f = useCurrentFrame();
  const tNow = atWord(words, "aujourd", 70);
  const dim = interpolate(f - tNow, [0, 8], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", top: 210, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 40 }}>
        <Panel title="Avant" color={C.grey} delay={0} style={{ opacity: 1 - dim * 0.55, filter: `grayscale(${dim})` }} strike={dim}>
          <Row icon="calendar" text="Des mois de travail" delay={atWord(words, "mois")} />
          <Row icon="team" text="Une équipe de développeurs" delay={atWord(words, "équipe")} />
        </Panel>
        <Panel title="Aujourd'hui" color={C.yellow} delay={tNow} glow>
          <Row icon="doc" text="1 prompt" delay={atWord(words, "prompt", tNow + 6)} accent />
          <Row spark text="Claude" delay={atWord(words, "claude", tNow + 12)} accent />
        </Panel>
      </div>
    </>
  );
};

const Panel: React.FC<{ title: string; color: string; delay: number; glow?: boolean; strike?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ title, color, delay, glow, strike = 0, style, children }) => {
  const p = usePop(delay, 13, 170);
  return (
    <div style={{
      position: "relative", padding: "40px 46px", borderRadius: 40, background: glow ? "rgba(255,212,59,0.07)" : C.card,
      border: `2px solid ${glow ? C.yellow : C.line}`, boxShadow: glow ? `0 0 70px rgba(255,212,59,0.22)` : "0 30px 70px rgba(0,0,0,0.5)",
      transform: `scale(${0.85 + 0.15 * p})`, opacity: p, ...style,
    }}>
      <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 64, color, textTransform: "uppercase", marginBottom: 26, textShadow: glow ? `0 0 30px ${color}88` : "none" }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>{children}</div>
      {strike > 0 && (
        <div style={{ position: "absolute", left: 30, top: "52%", height: 12, width: `${strike * 88}%`, background: C.red, borderRadius: 6, transform: "rotate(-6deg)", boxShadow: `0 0 20px ${C.red}` }} />
      )}
    </div>
  );
};

const Row: React.FC<{ icon?: string; spark?: boolean; text: string; delay: number; accent?: boolean }> = ({ icon, spark, text, delay, accent }) => {
  const p = usePop(delay, 13, 210);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
      {spark ? <Spark size={56} /> : <Icon name={icon!} size={56} color={accent ? C.yellow : C.grey} />}
      <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 46, color: C.white }}>{text}</div>
    </div>
  );
};

/* ========== jusqu'à 7 500 € (002, 003, 004) ========== */
export const PrixVente: React.FC<SceneProps> = ({ words }) => {
  const f = useCurrentFrame();
  const t = atWord(words, "7", 10);
  const money = spring({ frame: f - t, fps: 30, config: { damping: 10, stiffness: 160 } });
  const rays = (f * 0.6) % 360;
  return (
    <>
      <Title lines={[[{ t: "Un seul logiciel" }], [{ t: "jusqu'à", size: 64, color: C.grey }]]} top={210} />
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute", width: 900, height: 900, borderRadius: "50%", opacity: 0.25 * money,
          background: `repeating-conic-gradient(from ${rays}deg, rgba(34,224,122,0.35) 0deg 8deg, transparent 8deg 24deg)`,
          maskImage: "radial-gradient(circle, black 20%, transparent 65%)", WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 65%)",
        }} />
        <div style={{ transform: `scale(${0.3 + 0.7 * money})`, opacity: interpolate(money, [0, 0.3], [0, 1], clamp) }}>
          <Counter to={7500} delay={t} dur={24} suffix=" €" style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 210, color: C.green, letterSpacing: -5, textShadow: `0 0 40px ${C.greenGlow}, 0 0 100px ${C.greenGlow}` }} />
        </div>
      </div>
      <Box top={820}>
        <ScreenCard src="images/marketing.png" width={760} rotate={2} delay={4} />
      </Box>
    </>
  );
};

/* ========== CTA · Commente « CRM » ========== */
export const CommenteCRM: React.FC<SceneProps> = ({ words }) => {
  const f = useCurrentFrame();
  const typed = "CRM".slice(0, Math.max(0, Math.floor((f - 6) / 4)));
  const posted = f > 22;
  const tReply = atWord(words, "envoie", 30);
  const post = usePop(22, 12, 200);
  const reply = usePop(tReply, 12, 200);
  const heart = spring({ frame: f - 30, fps: 30, config: { damping: 7, stiffness: 260 } });
  const bounce = Math.abs(Math.sin(f / 6)) * 22;
  return (
    <>
      <Title lines={[[{ t: "Commente" }], [{ t: "« CRM »", color: C.yellow, glow: "rgba(255,212,59,0.6)", size: 170 }]]} top={190} />
      <Box top={590}>
        <div style={{ width: 920, borderRadius: 40, background: C.card, border: `1px solid ${C.line}`, padding: "36px 40px", boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: UI, fontWeight: 700, fontSize: 30, color: C.grey, marginBottom: 30 }}>
            <Icon name="chat" size={36} color={C.grey} /> Commentaires
          </div>
          {posted && (
            <div style={{ display: "flex", gap: 22, alignItems: "flex-start", transform: `translateY(${(1 - post) * 30}px)`, opacity: post }}>
              <div style={{ width: 76, height: 76, borderRadius: 38, background: "linear-gradient(135deg,#6D5BFF,#22C1FF)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 28, color: C.grey }}>toi · à l'instant</div>
                <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 56, color: C.white }}>CRM</div>
              </div>
              <div style={{ transform: `scale(${0.6 + 0.4 * heart})`, marginTop: 14 }}><Icon name="heart" size={50} color={C.red} /></div>
            </div>
          )}
          {f > tReply && (
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginTop: 30, marginLeft: 98, transform: `translateY(${(1 - reply) * 30}px)`, opacity: reply }}>
              <div style={{ width: 62, height: 62, borderRadius: 31, background: C.red, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TITLE, fontWeight: 900, fontSize: 30, color: "#fff" }}>C</div>
              <div>
                <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 26, color: C.grey }}>carreia.store · créateur</div>
                <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 38, color: C.white, display: "flex", alignItems: "center", gap: 14 }}>
                  Je t'envoie le lien en privé <Icon name="send" size={38} color={C.yellow} />
                </div>
              </div>
            </div>
          )}
          <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 16, padding: "20px 28px", borderRadius: 999, background: "#24242B", border: `2px solid ${posted ? C.line : C.yellow}` }}>
            <div style={{ flex: 1, fontFamily: UI, fontWeight: 700, fontSize: 36, color: typed ? C.white : C.grey }}>
              {posted ? "Ajouter un commentaire…" : typed || "Ajouter un commentaire…"}
              {!posted && <span style={{ opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: C.yellow }}>|</span>}
            </div>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="send" size={34} color="#fff" />
            </div>
          </div>
        </div>
      </Box>
      <div style={{ position: "absolute", top: 1250 + bounce, right: 90 }}>
        <Icon name="arrowDown" size={90} color={C.yellow} />
      </div>
    </>
  );
};

/* ========== 003 · 1. 29 € → 7 500 € ========== */
export const Equation: React.FC<SceneProps> = ({ words }) => {
  const f = useCurrentFrame();
  const a = usePop(atWord(words, "29", 6) - 2, 10, 200);
  const t2 = atWord(words, "7", 40);
  const arrow = interpolate(f - (t2 - 8), [0, 8], [0, 1], clamp);
  const b = spring({ frame: f - t2, fps: 30, config: { damping: 9, stiffness: 170 } });
  const q = usePop(t2 + 18, 8, 220);
  return (
    <>
      <Title lines={[[{ t: "Comment transformer" }]]} top={230} />
      <Box top={400}>
        <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 200, color: C.white, transform: `scale(${a})`, lineHeight: 1 }}>29 €</div>
        <svg width={120} height={200} viewBox="0 0 24 40" style={{ margin: "10px 0", opacity: arrow }}>
          <path d={`M12 2 V${2 + 32 * arrow}`} stroke={C.yellow} strokeWidth={3} strokeLinecap="round" />
          {arrow > 0.9 && <path d="M4 28 L12 37 L20 28" stroke={C.yellow} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
        <div style={{ position: "relative", transform: `scale(${b})` }}>
          <Counter to={7500} from={29} delay={t2} dur={22} suffix=" €" style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 210, color: C.green, letterSpacing: -5, lineHeight: 1, textShadow: `0 0 40px ${C.greenGlow}, 0 0 100px ${C.greenGlow}` }} />
          <div style={{ position: "absolute", right: -70, top: -50, fontFamily: TITLE, fontWeight: 900, fontSize: 150, color: C.yellow, transform: `scale(${q}) rotate(12deg)`, textShadow: "0 0 30px rgba(255,212,59,0.6)" }}>?</div>
        </div>
      </Box>
    </>
  );
};

/* ========== 003 · 2. L'offre à 29 € ========== */
export const Offre: React.FC<SceneProps> = ({ words }) => {
  const f = useCurrentFrame();
  const box = usePop(0, 13, 150);
  const tag = spring({ frame: f - atWord(words, "prix", 20), fps: 30, config: { damping: 8, stiffness: 200 } });
  return (
    <>
      <Title lines={[[{ t: "Mon prompt" }], [{ t: "+ le guide complet", color: C.red, glow: C.redGlow, size: 72 }]]} top={210} />
      <Box top={540}>
        <div style={{ position: "relative", width: 860, padding: "54px 56px", borderRadius: 44, background: "linear-gradient(160deg,#1E1E25,#121216)", border: `1px solid ${C.line}`, boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(227,38,27,0.18)`, transform: `rotateX(${(1 - box) * 20}deg) scale(${0.85 + 0.15 * box})`, opacity: box }}>
          {[
            { icon: "doc", t: "Le prompt ultra complet", w: "prompt" },
            { icon: "book", t: "Le guide complet", w: "guide" },
            { icon: "phone", t: "Le script d'appel", w: "guide" },
          ].map((r, i) => (
            <Row key={r.t} icon={r.icon} text={r.t} delay={Math.max(4 + i * 4, atWord(words, r.w) - 2 + (i === 2 ? 10 : 0))} accent />
          ))}
          <div style={{ position: "absolute", right: -30, top: -70, transform: `rotate(10deg) scale(${tag})`, background: C.green, color: "#05140B", borderRadius: 30, padding: "18px 34px", fontFamily: TITLE, fontWeight: 900, fontSize: 84, boxShadow: `0 0 50px ${C.greenGlow}` }}>
            29 €
          </div>
        </div>
      </Box>
      <Box top={1110}>
        <Chip text="au lieu de 199 €" delay={atWord(words, "complet", 40)} size={36} color="rgba(255,255,255,0.06)" textColor={C.grey} />
      </Box>
    </>
  );
};

/* ========== 003 · 6. Trouver ses clients : script + relances ========== */
export const Script: React.FC<SceneProps> = ({ words }) => {
  const f = useCurrentFrame();
  const phone = usePop(0, 13, 150);
  const msgs = [
    { me: true, t: "Bonjour, je vous ai préparé une démo de votre logiciel 3D", w: "script" },
    { me: false, t: "Super, on s'appelle demain ?", w: "relances" },
    { me: true, t: "Parfait, 10 h ça vous va ?", w: "whatsapp" },
  ];
  return (
    <>
      <Title lines={[[{ t: "Trouve tes" }], [{ t: "clients", color: C.red, glow: C.redGlow, size: 110 }]]} top={200} />
      <Box top={520}>
        <div style={{ width: 620, height: 760, borderRadius: 70, background: "#0E0E12", border: "10px solid #2A2A32", padding: "40px 28px", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", transform: `translateY(${(1 - phone) * 200}px)`, opacity: phone, display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18, borderBottom: `1px solid ${C.line}` }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, background: "#3A3A44", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="car" size={36} color={C.white} /></div>
            <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 30, color: C.white }}>Carrosserie Martin</div>
          </div>
          {msgs.map((m, i) => {
            const d = Math.max(6 + i * 10, atWord(words, m.w, 6 + i * 12) - 4);
            const p = usePop(d, 12, 220);
            return (
              <div key={i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: 440, background: m.me ? "#1F7A4A" : "#2A2A32", color: "#fff", fontFamily: UI, fontWeight: 600, fontSize: 28, lineHeight: 1.3, padding: "18px 24px", borderRadius: 26, transform: `scale(${p})`, transformOrigin: m.me ? "right bottom" : "left bottom", opacity: p }}>
                {m.t}
                {m.me && <span style={{ color: "#7FE3B0", fontSize: 22, marginLeft: 10 }}>✓✓</span>}
              </div>
            );
          })}
        </div>
      </Box>
      <div style={{ position: "absolute", top: 640, left: 40 }}>
        <Chip text="Script d'appel" delay={atWord(words, "script", 20)} size={32} color="rgba(227,38,27,0.85)" icon={<Icon name="phone" size={32} color="#fff" />} />
      </div>
      <div style={{ position: "absolute", top: 1120, right: 40 }}>
        <Chip text="Relances WhatsApp" delay={atWord(words, "relances", 40)} size={32} color="rgba(31,122,74,0.9)" icon={<Icon name="chat" size={32} color="#fff" />} />
      </div>
    </>
  );
};

/* ========== 004 · 1. Le prompt tapé, puis la révélation ========== */
export const PromptReveal: React.FC<SceneProps> = ({ words, dur }) => {
  const f = useCurrentFrame();
  const prompt = "Crée un logiciel 3D pour mon restaurant";
  const typed = prompt.slice(0, Math.floor(interpolate(f, [4, 42], [0, prompt.length], clamp)));
  const tLook = atWord(words, "regarde", Math.round(dur * 0.55));
  const flash = interpolate(f - tLook, [0, 2, 10], [0, 0.85, 0], clamp);
  const bar = usePop(0, 13, 180);
  return (
    <>
      <Title lines={f < tLook ? [[{ t: "J'ai demandé" }], [{ t: "à Claude", color: C.red, glow: C.redGlow, size: 110 }]] : [[{ t: "Regarde ce qu'il" }], [{ t: "m'a sorti", color: C.yellow, glow: "rgba(255,212,59,0.55)", size: 110 }]]} top={210} delay={f < tLook ? 0 : tLook} />
      {f >= tLook && (
        <Box top={530}>
          <ScreenCard src="images/restaurant.png" width={960} rotate={-1.5} delay={tLook} />
        </Box>
      )}
      <Box top={f < tLook ? 760 : 1150} style={{ transition: "none" }}>
        <div style={{ width: 940, display: "flex", alignItems: "center", gap: 20, padding: "28px 30px", borderRadius: 999, background: "#1C1C22", border: `2px solid ${C.red}`, boxShadow: `0 0 50px rgba(227,38,27,0.3)`, transform: `scale(${0.8 + 0.2 * bar})`, opacity: bar }}>
          <Spark size={48} />
          <div style={{ flex: 1, fontFamily: UI, fontWeight: 700, fontSize: 36, color: C.white, whiteSpace: "nowrap", overflow: "hidden" }}>
            {typed}
            {typed.length < prompt.length && <span style={{ color: C.red, opacity: Math.floor(f / 6) % 2 ? 0 : 1 }}>|</span>}
          </div>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width={34} height={34} viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </Box>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
    </>
  );
};

/* ========== 004 · 2. Visite du logiciel avec points d'intérêt ========== */
export const Visite: React.FC<SceneProps> = ({ words, dur }) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, dur], [1.05, 1.35], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const pan = interpolate(f, [0, dur], [0, -60], clamp);
  const spots = [
    { x: 0.45, y: 0.48, t: "Tables", w: "tables", c: C.white },
    { x: 0.7, y: 0.3, t: "Réservations", w: "réservations", c: C.yellow },
    { x: 0.28, y: 0.72, t: "En direct", w: "direct", c: C.red },
  ];
  return (
    <>
      <Title lines={[[{ t: "Tout ton resto" }], [{ t: "en 3D", color: C.red, glow: C.redGlow, size: 120 }]]} top={200} />
      <Box top={540}>
        <div style={{ position: "relative", width: 980, height: 640, borderRadius: 40, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.15)" }}>
          <Img src={staticFile("images/restaurant.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom}) translateX(${pan}px)` }} />
          {spots.map((s) => {
            const d = atWord(words, s.w, 20);
            const p = spring({ frame: f - d, fps: 30, config: { damping: 9, stiffness: 220 } });
            const pulse = ((f - d) % 30) / 30;
            return (
              <div key={s.t} style={{ position: "absolute", left: `${s.x * 100}%`, top: `${s.y * 100}%`, transform: `translate(-50%,-50%) scale(${p})` }}>
                <div style={{ position: "absolute", left: -30, top: -30, width: 60, height: 60, borderRadius: 30, border: `4px solid ${s.c}`, opacity: 1 - pulse, transform: `scale(${1 + pulse * 1.6})` }} />
                <div style={{ position: "absolute", left: -14, top: -14, width: 28, height: 28, borderRadius: 14, background: s.c, boxShadow: `0 0 20px ${s.c}` }} />
                <div style={{ position: "absolute", left: 30, top: -34, whiteSpace: "nowrap", padding: "12px 22px", borderRadius: 999, background: "rgba(9,9,11,0.85)", border: `2px solid ${s.c}`, fontFamily: UI, fontWeight: 800, fontSize: 32, color: "#fff" }}>
                  {s.t === "En direct" && <span style={{ color: C.red, marginRight: 8 }}>●</span>}{s.t}
                </div>
              </div>
            );
          })}
        </div>
      </Box>
    </>
  );
};

export const SCENES2 = {
  premier: Premier,
  metiers: Metiers,
  avantApres: AvantApres,
  prixVente: PrixVente,
  commenteCRM: CommenteCRM,
  equation: Equation,
  offre: Offre,
  script: Script,
  promptReveal: PromptReveal,
  visite: Visite,
};

