import { useState } from "react";
import { colors, radius } from "../utils/theme";

// ─── Symptom definitions ──────────────────────────────────────────────────────

const CONCUSSION_SYMPTOMS = [
  { key: "headache",        label: "Headache",           icon: "🤕", desc: "Pressure, throbbing, or pain in the head" },
  { key: "nausea",          label: "Nausea / Vomiting",  icon: "🤢", desc: "Feeling sick to your stomach or throwing up" },
  { key: "confusion",       label: "Confusion / Fog",    icon: "🌫️", desc: "Feeling slowed down, mentally foggy, or confused" },
  { key: "lightSensitivity",label: "Light Sensitivity",  icon: "💡", desc: "Bothered by bright lights more than usual" },
  { key: "noise",           label: "Noise Sensitivity",  icon: "🔊", desc: "Bothered by sounds more than usual" },
  { key: "memory",          label: "Memory Issues",      icon: "🧠", desc: "Trouble remembering or concentrating" },
  { key: "balance",         label: "Balance / Dizziness",icon: "⚖️", desc: "Feeling unsteady, dizzy, or off-balance" },
  { key: "sleep",           label: "Sleep Changes",      icon: "😴", desc: "Trouble sleeping, or sleeping much more than usual" },
];

const WHIPLASH_SYMPTOMS = [
  { key: "neckPain",      label: "Neck Pain",            icon: "🦴", desc: "Soreness or pain in the neck" },
  { key: "neckMobility",  label: "Neck Stiffness",       icon: "↔️", desc: "Difficulty turning or moving your neck" },
  { key: "shoulderPain",  label: "Shoulder Pain",        icon: "💪", desc: "Pain or tension in your shoulders" },
  { key: "jawPain",       label: "Jaw Pain",             icon: "😬", desc: "Tenderness or aching in the jaw" },
  { key: "tingling",      label: "Arm Tingling",         icon: "⚡", desc: "Numbness or tingling running into arms or hands" },
];

const SCALE_LABELS = ["None", "Very mild", "Mild", "Moderate", "Fairly severe", "Severe", "Most severe"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SymptomSlider({ symptom, value, onChange }) {
  const filled = value > 0;
  const dotColor =
    value === 0 ? colors.textFaint
    : value <= 2 ? colors.success
    : value <= 4 ? colors.warning
    : colors.danger;

  return (
    <div style={st.sliderRow}>
      <div style={st.sliderMeta}>
        <div style={st.sliderLeft}>
          <span style={st.sliderIcon}>{symptom.icon}</span>
          <div>
            <p style={{ ...st.sliderLabel, color: filled ? colors.textPrimary : colors.textMuted }}>
              {symptom.label}
            </p>
            <p style={st.sliderDesc}>{symptom.desc}</p>
          </div>
        </div>
        <span style={{ ...st.sliderValue, color: dotColor }}>
          {value}
        </span>
      </div>

      {/* Custom slider track */}
      <div style={st.trackWrapper}>
        <input
          type="range"
          min={0}
          max={6}
          step={1}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={st.rangeInput}
        />
        {/* Visual tick marks */}
        <div style={st.ticks}>
          {SCALE_LABELS.map((_, i) => (
            <div
              key={i}
              style={{
                ...st.tick,
                background: i <= value ? dotColor : colors.border,
              }}
            />
          ))}
        </div>
      </div>

      <div style={st.scaleEnds}>
        <span style={st.scaleEnd}>None</span>
        <span style={{ ...st.scaleLabel, color: dotColor }}>{SCALE_LABELS[value]}</span>
        <span style={st.scaleEnd}>Most severe</span>
      </div>
    </div>
  );
}

function SectionHeader({ emoji, title, subtitle, color }) {
  return (
    <div style={{ ...st.sectionHeader, borderLeft: `3px solid ${color}` }}>
      <span style={st.sectionEmoji}>{emoji}</span>
      <div>
        <p style={{ ...st.sectionTitle, color }}>{title}</p>
        <p style={st.sectionSub}>{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SymptomQuiz({ onDone }) {
  const [phase, setPhase] = useState("intro"); // intro | quiz | review
  const [scores, setScores] = useState(() => {
    const init = {};
    [...CONCUSSION_SYMPTOMS, ...WHIPLASH_SYMPTOMS].forEach(s => { init[s.key] = 0; });
    return init;
  });

  const setScore = (key, val) => setScores(prev => ({ ...prev, [key]: val }));

  const totalSymptomScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const anySymptoms = totalSymptomScore > 0;

  function handleSubmit() {
    onDone({ symptoms: scores });
  }

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={st.page}>
        <div style={st.topBar}>
          <span style={st.logo}>peace of mind</span>
          <span style={st.step}>Symptom Quiz</span>
        </div>
        <div style={st.card}>
          <span style={st.cardIcon}>📋</span>
          <h2 style={st.cardTitle}>How are you feeling?</h2>
          <p style={st.cardBody}>
            Rate each symptom from <strong>0 (none)</strong> to <strong>6 (most severe)</strong> based
            on how you feel <em>right now</em>, compared to how you normally feel.
          </p>
          <div style={st.infoRow}>
            <div style={st.infoPill}>
              <span>🧠</span>
              <span>{CONCUSSION_SYMPTOMS.length} concussion symptoms</span>
            </div>
            <div style={st.infoPill}>
              <span>🦴</span>
              <span>{WHIPLASH_SYMPTOMS.length} neck / whiplash symptoms</span>
            </div>
          </div>
          <p style={st.cardNote}>Takes about 2 minutes. Be honest — this helps accuracy.</p>
          <button onClick={() => setPhase("quiz")} style={st.primaryBtn}>
            Start Symptom Check →
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────────────────
  if (phase === "quiz") {
    return (
      <div style={st.page}>
        <div style={st.topBar}>
          <span style={st.logo}>peace of mind</span>
          <span style={st.step}>Symptom Quiz</span>
        </div>

        <div style={st.quizWrapper}>

          {/* Concussion section */}
          <SectionHeader
            emoji="🧠"
            title="Concussion Symptoms"
            subtitle="Rate how you feel right now on a 0–6 scale"
            color={colors.primary}
          />

          <div style={st.symptomList}>
            {CONCUSSION_SYMPTOMS.map(s => (
              <SymptomSlider
                key={s.key}
                symptom={s}
                value={scores[s.key]}
                onChange={val => setScore(s.key, val)}
              />
            ))}
          </div>

          {/* Whiplash section */}
          <SectionHeader
            emoji="🦴"
            title="Neck & Whiplash Symptoms"
            subtitle="These help identify cervical spine involvement"
            color={colors.warning}
          />

          <div style={st.symptomList}>
            {WHIPLASH_SYMPTOMS.map(s => (
              <SymptomSlider
                key={s.key}
                symptom={s}
                value={scores[s.key]}
                onChange={val => setScore(s.key, val)}
              />
            ))}
          </div>

          {/* Summary bar */}
          <div style={st.summaryBar}>
            <div>
              <p style={st.summaryLabel}>Total symptom score</p>
              <p style={st.summaryValue}>
                {totalSymptomScore}
                <span style={st.summaryMax}> / {(CONCUSSION_SYMPTOMS.length + WHIPLASH_SYMPTOMS.length) * 6}</span>
              </p>
            </div>
            <button onClick={handleSubmit} style={st.primaryBtn}>
              {anySymptoms ? "Submit & Continue →" : "No Symptoms — Continue →"}
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const st = {
  page: {
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
    background: colors.bg,
    color: colors.textPrimary,
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 16px 80px",
    boxSizing: "border-box",
  },
  topBar: {
    width: "100%",
    maxWidth: 680,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    boxSizing: "border-box",
  },
  logo: { fontSize: 15, fontWeight: 600, letterSpacing: 1, color: colors.primary },
  step: { fontSize: 13, color: colors.textFaint },

  // Intro card
  card: {
    width: "100%",
    maxWidth: 640,
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: "40px 28px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18,
    boxSizing: "border-box",
  },
  cardIcon: { fontSize: 52 },
  cardTitle: { fontSize: 28, fontWeight: 800, margin: 0 },
  cardBody: { fontSize: 16, color: colors.textMuted, lineHeight: 1.8, maxWidth: 460, margin: 0 },
  cardNote: { fontSize: 13, color: colors.textFaint, margin: 0 },
  infoRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  infoPill: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 99,
    padding: "8px 16px",
    fontSize: 13,
    color: colors.textMuted,
  },

  // Quiz layout
  quizWrapper: {
    width: "100%",
    maxWidth: 680,
    display: "flex",
    flexDirection: "column",
    gap: 0,
    boxSizing: "border-box",
  },

  // Section header
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "20px 20px",
    marginBottom: 4,
    marginTop: 24,
    background: colors.card,
    borderRadius: `${radius.md}px ${radius.md}px 0 0`,
    border: `1px solid ${colors.border}`,
    borderBottom: "none",
    boxSizing: "border-box",
  },
  sectionEmoji: { fontSize: 28 },
  sectionTitle: { fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: 0.5 },
  sectionSub: { fontSize: 12, color: colors.textFaint, margin: 0, marginTop: 3 },

  // Symptom list
  symptomList: {
    display: "flex",
    flexDirection: "column",
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderTop: "none",
    borderRadius: `0 0 ${radius.md}px ${radius.md}px`,
    overflow: "hidden",
    marginBottom: 4,
  },

  // Individual slider row
  sliderRow: {
    padding: "20px 20px 16px",
    borderBottom: `1px solid ${colors.bg}`,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxSizing: "border-box",
  },
  sliderMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  sliderIcon: { fontSize: 22, width: 28, textAlign: "center", flexShrink: 0 },
  sliderLabel: { fontSize: 15, fontWeight: 700, margin: 0, transition: "color 0.2s" },
  sliderDesc: { fontSize: 12, color: colors.textFaint, margin: 0, marginTop: 2 },
  sliderValue: {
    fontSize: 26,
    fontWeight: 900,
    minWidth: 32,
    textAlign: "right",
    transition: "color 0.2s",
  },

  // Slider track
  trackWrapper: {
    position: "relative",
    padding: "4px 0",
  },
  rangeInput: {
    width: "100%",
    appearance: "none",
    WebkitAppearance: "none",
    height: 4,
    borderRadius: 2,
    background: "transparent",
    outline: "none",
    cursor: "pointer",
    position: "relative",
    zIndex: 2,
    margin: 0,
  },
  ticks: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    transform: "translateY(-50%)",
    display: "flex",
    justifyContent: "space-between",
    pointerEvents: "none",
    zIndex: 1,
  },
  tick: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    transition: "background 0.2s",
    flexShrink: 0,
  },

  scaleEnds: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scaleEnd: { fontSize: 11, color: colors.textFaint },
  scaleLabel: { fontSize: 12, fontWeight: 700, transition: "color 0.2s" },

  // Bottom summary bar
  summaryBar: {
    marginTop: 32,
    padding: "24px 20px",
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.md,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    boxSizing: "border-box",
  },
  summaryLabel: { fontSize: 11, letterSpacing: 2, color: colors.textFaint, margin: 0, textTransform: "uppercase" },
  summaryValue: { fontSize: 32, fontWeight: 900, margin: 0, color: colors.textPrimary, marginTop: 4 },
  summaryMax: { fontSize: 16, color: colors.textFaint, fontWeight: 400 },

  primaryBtn: {
    padding: "16px 28px",
    background: colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: radius.md,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  },
};