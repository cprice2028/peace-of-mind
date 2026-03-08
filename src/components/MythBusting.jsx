import { useState } from "react";
import { colors, radius } from "../utils/theme";

const MYTHS = [
  {
    myth: "There's a magic number of concussions that ends your career",
    fact: "There is no universal number. Every concussion is different, and the decision to retire from sport is made individually by a doctor based on symptoms, recovery time, and overall health history. The \"3 strikes\" rule has no medical basis.",
    source: "CDC Heads Up Program",
  },
  {
    myth: "If you didn't black out, it's not a concussion",
    fact: "Loss of consciousness occurs in fewer than 10% of concussions. Most concussions do not involve blacking out at all. Symptoms like headache, confusion, and feeling \"foggy\" are far more common indicators.",
    source: "NHS / British Journal of Sports Medicine",
  },
  {
    myth: "You should stay awake all night after a concussion",
    fact: "Sleep is actually essential for brain recovery. The old advice to keep someone awake was based on fear of missing a rare brain bleed — which would show other serious warning signs. Normal sleep after a concussion is safe and helpful.",
    source: "CDC Concussion Guidelines",
  },
  {
    myth: "You need a hit to the head to get a concussion",
    fact: "A concussion can result from any jolt or force that causes the brain to move rapidly inside the skull — including a hit to the body that whips the head. You don't need to hit your head directly.",
    source: "American Academy of Neurology",
  },
  {
    myth: "Once symptoms are gone, you're fully recovered",
    fact: "Symptom resolution does not mean the brain has fully healed. Return-to-play must follow a gradual, stepwise protocol supervised by a medical professional — even after you feel normal.",
    source: "Concussion in Sport Group (CISG)",
  },
  {
    myth: "Helmets prevent concussions",
    fact: "Helmets are critical for preventing skull fractures and severe head injuries, but they do not prevent concussions. Concussion results from brain movement inside the skull, which helmets cannot stop.",
    source: "CDC / NATA",
  },
];

const COMPARISON = [
  { symptom: "Headache",              concussion: true,  whiplash: true  },
  { symptom: "Dizziness",             concussion: true,  whiplash: true  },
  { symptom: "Confusion / Fogginess", concussion: true,  whiplash: false },
  { symptom: "Light Sensitivity",     concussion: true,  whiplash: false },
  { symptom: "Noise Sensitivity",     concussion: true,  whiplash: false },
  { symptom: "Memory Problems",       concussion: true,  whiplash: false },
  { symptom: "Neck Pain / Stiffness", concussion: false, whiplash: true  },
  { symptom: "Neck Muscle Tension",   concussion: false, whiplash: true  },
  { symptom: "Visual Disturbances",   concussion: true,  whiplash: true  },
  { symptom: "Balance Issues",        concussion: true,  whiplash: true  },
];

export default function MythBusting({ onBack }) {
  const [tab, setTab] = useState("myths");

  return (
    <div style={st.wrapper}>
      <div style={st.header}>
        <button onClick={onBack} style={st.backBtn}>← Back</button>
        <span style={st.logo}>peace of mind</span>
        <span style={{ width: 60 }} />
      </div>

      <h1 style={st.h1}>Know the Facts</h1>
      <p style={st.sub}>Dangerous misinformation puts athletes at risk every day.</p>

      <div style={st.tabRow}>
        <button onClick={() => setTab("myths")} style={{ ...st.tab, ...(tab === "myths" ? st.tabActive : {}) }}>
          Myth Busting
        </button>
        <button onClick={() => setTab("whiplash")} style={{ ...st.tab, ...(tab === "whiplash" ? st.tabActive : {}) }}>
          Concussion vs. Whiplash
        </button>
      </div>

      {tab === "myths" && (
        <div style={st.list}>
          {MYTHS.map((m, i) => (
            <div key={i} style={st.card}>
              <div style={st.mythRow}>
                <span style={st.xBadge}>✕</span>
                <p style={st.mythText}>{m.myth}</p>
              </div>
              <div style={st.divider} />
              <div style={st.factRow}>
                <span style={st.checkBadge}>✓</span>
                <p style={st.factText}>{m.fact}</p>
              </div>
              <p style={st.source}>Source: {m.source}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "whiplash" && (
        <div style={st.list}>
          <div style={st.card}>
            <h2 style={st.sectionTitle}>What's the Difference?</h2>
            <div style={st.mechRow}>
              <div style={st.mechCol}>
                <span style={st.mechEmoji}>🧠</span>
                <p style={st.mechLabel}>Concussion</p>
                <p style={st.mechDesc}>The brain moves rapidly inside the skull due to direct or indirect force, causing cellular disruption and metabolic changes.</p>
              </div>
              <div style={st.mechDivider} />
              <div style={st.mechCol}>
                <span style={st.mechEmoji}>🦴</span>
                <p style={st.mechLabel}>Whiplash</p>
                <p style={st.mechDesc}>Rapid back-and-forth neck motion strains cervical spine muscles, ligaments, and discs — no brain disruption required.</p>
              </div>
            </div>
          </div>

          <div style={st.card}>
            <h2 style={st.sectionTitle}>Symptom Comparison</h2>
            <p style={st.cardSubtext}>Many symptoms overlap — this is what makes diagnosis tricky.</p>
            <div style={st.tableHeader}>
              <span style={st.tableCol}>Symptom</span>
              <span style={{ ...st.tableColCenter, color: colors.primary }}>Concussion</span>
              <span style={{ ...st.tableColCenter, color: colors.textMuted }}>Whiplash</span>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} style={{ ...st.tableRow, background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <span style={st.tableCol}>{row.symptom}</span>
                <span style={st.tableColCenter}>
                  {row.concussion ? <span style={{ color: colors.primary, fontWeight: 700 }}>✓</span> : <span style={{ color: colors.textFaint }}>—</span>}
                </span>
                <span style={st.tableColCenter}>
                  {row.whiplash ? <span style={{ color: colors.textMuted, fontWeight: 700 }}>✓</span> : <span style={{ color: colors.textFaint }}>—</span>}
                </span>
              </div>
            ))}
          </div>

          <div style={{ ...st.card, borderLeft: `4px solid ${colors.warning}` }}>
            <div style={st.warnRow}>
              <span style={{ fontSize: 26 }}>⚠️</span>
              <div>
                <p style={{ ...st.mechLabel, color: colors.warning, marginBottom: 6 }}>You can have both at the same time</p>
                <p style={st.mechDesc}>High-impact collisions often cause both simultaneously. Cervical spine involvement can extend recovery times significantly. When in doubt, get evaluated for both.</p>
              </div>
            </div>
          </div>

          <div style={st.card}>
            <h2 style={st.sectionTitle}>How Doctors Tell Them Apart</h2>
            <div style={st.diffRow}>
              <div style={st.diffCol}>
                <p style={{ ...st.diffHeader, color: colors.primary }}>🧠 Concussion Tests</p>
                <p style={st.diffItem}>• Cognitive & memory exams</p>
                <p style={st.diffItem}>• Eye tracking (oculomotor)</p>
                <p style={st.diffItem}>• Balance & vestibular function</p>
                <p style={st.diffItem}>• MRI / CT if symptoms persist</p>
              </div>
              <div style={st.diffCol}>
                <p style={{ ...st.diffHeader, color: colors.textMuted }}>🦴 Whiplash Tests</p>
                <p style={st.diffItem}>• Neck mobility exam</p>
                <p style={st.diffItem}>• Muscle tenderness check</p>
                <p style={st.diffItem}>• Cervical imaging (X-ray/MRI)</p>
                <p style={st.diffItem}>• Head repositioning accuracy</p>
              </div>
            </div>
          </div>

          <p style={st.sourceNote}>
            Sources: CDC, Amsterdam Consensus Statement on Concussion in Sport (2022), NHS, American Academy of Neurology, CISG
          </p>
        </div>
      )}

      <div style={st.cta}>
        <p style={{ fontSize: 16, color: colors.textFaint, marginBottom: 16 }}>Think you may have a concussion?</p>
        <button onClick={onBack} style={st.primaryBtn}>Take the Assessment</button>
      </div>
    </div>
  );
}

const st = {
  wrapper: {
    minHeight: "100vh", background: colors.bg, color: colors.textPrimary,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "32px 24px 80px", boxSizing: "border-box",
  },
  header: {
    width: "100%", maxWidth: 640,
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36,
  },
  backBtn: { background: "none", border: "none", color: colors.textFaint, fontSize: 15, cursor: "pointer", width: 60 },
  logo: { fontSize: 15, fontWeight: 600, letterSpacing: 1, color: colors.primary },
  h1: { fontSize: 34, fontWeight: 900, marginBottom: 10, textAlign: "center" },
  sub: { fontSize: 16, color: colors.textMuted, marginBottom: 28, textAlign: "center", maxWidth: 400 },
  tabRow: {
    display: "flex", gap: 6, marginBottom: 36,
    background: colors.card, borderRadius: radius.md,
    padding: 5, border: `1px solid ${colors.border}`,
  },
  tab: {
    padding: "10px 22px", borderRadius: 12, border: "none",
    background: "transparent", color: colors.textFaint,
    fontSize: 14, cursor: "pointer", fontWeight: 600,
  },
  tabActive: { background: colors.primary, color: "#fff" },
  list: { width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", gap: 16 },
  card: {
    background: colors.card, borderRadius: radius.lg,
    padding: "28px 32px", border: `1px solid ${colors.border}`,
  },
  mythRow: { display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 },
  xBadge: { color: colors.danger, fontSize: 16, fontWeight: 900, minWidth: 20, paddingTop: 2 },
  mythText: { fontSize: 16, fontWeight: 700, color: colors.danger, lineHeight: 1.5, margin: 0 },
  divider: { height: 1, background: colors.border, marginBottom: 18 },
  factRow: { display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 },
  checkBadge: { color: colors.success, fontSize: 16, fontWeight: 900, minWidth: 20, paddingTop: 2 },
  factText: { fontSize: 15, color: colors.textMuted, lineHeight: 1.7, margin: 0 },
  source: { fontSize: 12, color: colors.textFaint, marginTop: 6, marginLeft: 34 },
  sectionTitle: { fontSize: 20, fontWeight: 800, marginBottom: 20, marginTop: 0 },
  cardSubtext: { fontSize: 14, color: colors.textFaint, marginBottom: 18, marginTop: -12 },
  mechRow: { display: "flex", gap: 0, alignItems: "stretch" },
  mechCol: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10, padding: "0 16px" },
  mechEmoji: { fontSize: 34 },
  mechLabel: { fontSize: 16, fontWeight: 800, margin: 0, color: colors.textPrimary },
  mechDesc: { fontSize: 14, color: colors.textMuted, lineHeight: 1.7, margin: 0 },
  mechDivider: { width: 1, background: colors.border, margin: "0 8px" },
  tableHeader: {
    display: "flex", padding: "10px 0",
    borderBottom: `1px solid ${colors.border}`, marginBottom: 6,
  },
  tableRow: { display: "flex", padding: "11px 10px", borderRadius: 8 },
  tableCol: { flex: 2, fontSize: 14, color: colors.textMuted },
  tableColCenter: { flex: 1, fontSize: 15, textAlign: "center" },
  warnRow: { display: "flex", gap: 16, alignItems: "flex-start" },
  diffRow: { display: "flex", gap: 20 },
  diffCol: { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
  diffHeader: { fontSize: 15, fontWeight: 800, marginBottom: 4 },
  diffItem: { fontSize: 14, color: colors.textMuted, lineHeight: 1.6 },
  sourceNote: { fontSize: 12, color: colors.textFaint, textAlign: "center", padding: "0 16px" },
  cta: { marginTop: 52, textAlign: "center", width: "100%", maxWidth: 640 },
  primaryBtn: {
    width: "100%", padding: "18px", background: colors.primary,
    color: "#fff", border: "none", borderRadius: radius.md,
    fontSize: 17, fontWeight: 700, cursor: "pointer",
  },
};