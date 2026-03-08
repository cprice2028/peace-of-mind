import { useEffect, useState } from "react";
import { calculateRisk, levelColor, levelEmoji } from "../utils/scoring";
import { colors, radius, MAX_W } from "../utils/theme";

export default function ResultsPage({ results, onRestart }) {
  const [risk, setRisk] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const r = calculateRisk(results);
    setRisk(r);
    setTimeout(() => setRevealed(true), 300);
  }, []);

  if (!risk) return null;

  const color = levelColor(risk.level);
  const emoji = levelEmoji(risk.level);

  return (
    <div style={st.page}>
      <div style={st.topBar}>
        <span style={st.logo}>peace of mind</span>
        <button onClick={onRestart} style={st.restartBtn}>Start New Assessment</button>
      </div>

      <div style={st.layout}>
        {/* Left col */}
        <div style={st.leftCol}>
          <div style={{
            ...st.badge,
            borderColor: color,
            opacity: revealed ? 1 : 0,
            transform: revealed ? "scale(1)" : "scale(0.85)",
            transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <span style={{ ...st.badgeEmoji, color }}>{emoji}</span>
            <span style={{ ...st.badgeLevel, color }}>{risk.level.toUpperCase()}</span>
          </div>

          <p style={st.summary}>{risk.summary}</p>

          {risk.flags.length > 0 && (
            <div style={st.flagsCard}>
              <p style={st.cardLabel}>FACTORS DETECTED</p>
              {risk.flags.map((f, i) => (
                <div key={i} style={st.flagRow}>
                  <span style={{ ...st.flagDot, background: colors.danger }} />
                  <span style={st.flagText}>{f}</span>
                </div>
              ))}
            </div>
          )}

          <p style={st.disclaimer}>
            This tool is a screening aid only and does not replace professional
            medical evaluation. When in doubt, sit out.
          </p>
        </div>

        {/* Right col */}
        <div style={st.rightCol}>
          <div style={st.card}>
            <p style={st.cardLabel}>RECOMMENDED ACTIONS</p>
            {risk.actions.map((a, i) => (
              <div key={i} style={st.actionRow}>
                <span style={{ ...st.actionNum, color }}>{i + 1}</span>
                <span style={st.actionText}>{a}</span>
              </div>
            ))}
          </div>

          <div style={st.statsRow}>
            {[
              {
                label: "Reaction Time",
                value: results.avgReaction ? `${results.avgReaction}ms` : "—",
                sub: risk.details?.reaction || "not tested",
                color: risk.details?.reaction === "good" ? colors.success
                  : risk.details?.reaction === "moderate" ? colors.warning
                  : colors.danger,
              },
              {
                label: "Eye Tracking",
                value: results.eyeTracking
                  ? `${results.eyeTracking.smoothness}/100`
                  : results.eyeSkipped ? "Skipped" : "—",
                sub: results.eyeTracking?.label || "not tested",
                color: risk.details?.eyes === "good" ? colors.success
                  : risk.details?.eyes === "moderate" ? colors.warning
                  : colors.danger,
              },
              {
                label: "Symptom Load",
                value: results.symptoms
                  ? Object.values(results.symptoms).reduce((a, b) => a + b, 0)
                  : "—",
                sub: "total score / 110",
                color: colors.textMuted,
              },
            ].map((s, i) => (
              <div key={i} style={st.statCard}>
                <p style={st.statLabel}>{s.label}</p>
                <p style={{ ...st.statValue, color: s.color }}>{s.value}</p>
                <p style={st.statSub}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const st = {
  page: {
    minHeight: "100vh",
    background: colors.bg,
    color: colors.textPrimary,
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
  },
  topBar: {
    maxWidth: MAX_W,
    margin: "0 auto",
    padding: "28px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { fontSize: 15, fontWeight: 600, letterSpacing: 1, color: colors.primary },
  restartBtn: {
    padding: "10px 22px",
    background: "transparent",
    color: colors.textFaint,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.sm,
    fontSize: 14,
    cursor: "pointer",
  },
  layout: {
    maxWidth: MAX_W,
    margin: "0 auto",
    padding: "20px 40px 80px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 60,
    alignItems: "start",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 28,
  },
  badge: {
    width: 240,
    height: 240,
    borderRadius: "50%",
    border: "5px solid",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeEmoji: { fontSize: 64, lineHeight: 1 },
  badgeLevel: { fontSize: 26, fontWeight: 900, letterSpacing: 4, marginTop: 10 },
  summary: {
    fontSize: 20,
    color: colors.textMuted,
    lineHeight: 1.8,
    maxWidth: 480,
  },
  flagsCard: {
    width: "100%",
    background: colors.card,
    borderRadius: radius.lg,
    padding: "28px 32px",
    border: `1px solid ${colors.border}`,
  },
  cardLabel: {
    fontSize: 11,
    letterSpacing: 3,
    color: colors.textFaint,
    marginBottom: 20,
    textTransform: "uppercase",
  },
  flagRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  flagDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  flagText: { fontSize: 16, color: colors.textMuted },
  disclaimer: {
    fontSize: 13,
    color: colors.textFaint,
    lineHeight: 1.7,
    maxWidth: 400,
  },
  rightCol: { display: "flex", flexDirection: "column", gap: 20 },
  card: {
    background: colors.card,
    borderRadius: radius.lg,
    padding: "32px 40px",
    border: `1px solid ${colors.border}`,
  },
  actionRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 20,
  },
  actionNum: { fontSize: 18, fontWeight: 800, minWidth: 26, paddingTop: 1 },
  actionText: { fontSize: 17, color: colors.textMuted, lineHeight: 1.7 },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 16,
  },
  statCard: {
    background: colors.card,
    borderRadius: radius.md,
    padding: "24px 20px",
    border: `1px solid ${colors.border}`,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.textFaint,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  statValue: { fontSize: 32, fontWeight: 900, marginBottom: 8 },
  statSub: { fontSize: 12, color: colors.textFaint },
};