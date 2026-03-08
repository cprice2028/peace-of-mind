
// React and theme imports
import { useState } from "react";
import { colors, radius } from "../utils/theme";


// MemoryRecall component: handles the memory recall test UI and logic
export default function MemoryRecall({ memory, onDone }) {
  // State to track selected words
  const [selected, setSelected] = useState(new Set());

  // Toggle selection of a word, max 6 allowed
  function toggle(word) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(word)) {
        next.delete(word);
      } else {
        if (next.size >= 6) return prev; // Prevent selecting more than 6
        next.add(word);
      }
      return next;
    });
  }

  // Submit selected words and calculate score
  function submit() {
    const score = memory.wordTargets.filter(w => selected.has(w)).length;
    onDone({
      memory: {
        ...memory,
        delayedWordScore: score
      }
    });
  }

  // Render the memory recall UI
  return (
    <div style={st.page}>
      {/* Top bar with logo and step name */}
      <div style={st.topBar}>
        <span style={st.logo}>peace of mind</span>
        <span style={st.step}>Memory Recall</span>
      </div>

      {/* Main card with instructions and word grid */}
      <div style={st.card}>
        <h2 style={st.title}>
          Which words did you see earlier?
        </h2>
        <p style={st.body}>
          Select all words you remember.
        </p>

        {/* Grid of selectable word buttons (always 12 in a 3x4 grid) */}
        <div style={st.grid}>
          {Array.from({ length: 12 }).map((_, i) => {
            const w = memory.wordOptions[i];
            if (w) {
              const active = selected.has(w);
              return (
                <button
                  key={i}
                  onClick={() => toggle(w)}
                  style={{
                    ...st.wordBtn,
                    background: active
                      ? colors.primary
                      : colors.card,
                    color: active
                      ? "#fff"
                      : colors.textMuted,
                    border: `1px solid ${
                      active
                        ? colors.primary
                        : colors.border
                    }`
                  }}
                >
                  {w}
                </button>
              );
            } else {
              // Render an empty, disabled button for missing words
              return (
                <button
                  key={i}
                  disabled
                  style={{
                    ...st.wordBtn,
                    background: colors.card,
                    color: colors.textMuted,
                    border: `1px solid ${colors.border}`,
                    opacity: 0.5,
                    cursor: "default"
                  }}
                >
                  {/* empty slot */}
                </button>
              );
            }
          })}
        </div>

        {/* Submit button */}
        <button
          onClick={submit}
          style={st.primaryBtn}
        >
          See Results →
        </button>
      </div>
    </div>
  );
}

// Inline style object for component styling
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
    padding: "32px 16px 64px",
    boxSizing: "border-box",
  },
  topBar: {
    width: "100%",
    maxWidth: 640,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 40,
    boxSizing: "border-box",
  },
  logo: { fontSize: 15, fontWeight: 600, letterSpacing: 1, color: colors.primary },
  step: { fontSize: 13, color: colors.textFaint },
  card: {
    width: "100%",
    maxWidth: 640,
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.md,
    padding: "32px 20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    boxSizing: "border-box",
  },
  title: { fontSize: 24, fontWeight: 800 },
  body: { fontSize: 15, color: colors.textMuted },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    width: "100%",
    boxSizing: "border-box",
  },
  wordBtn: {
    padding: "14px 8px",
    borderRadius: radius.sm,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxSizing: "border-box",
  },
  primaryBtn: {
    marginTop: 12,
    padding: "16px",
    background: colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: radius.md,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
  },
};