/**
 * Peace of Mind — Scoring Algorithm
 * Takes all test results and returns a risk level + plain English recommendation
 */

// Reaction time benchmarks (ms)
const REACTION = {
  GOOD: 280,
  MODERATE: 380,
};

// Eye tracking smoothness score (0-100)
const EYE = {
  GOOD: 70,
  MODERATE: 45,
};

// Symptom severity thresholds (0-10 scale per symptom)
const SYMPTOM_SEVERE = 6;
const SYMPTOM_MODERATE = 3;

/**
 * Main scoring function
 * @param {Object} results - Combined results from all tests
 * @param {number[]} results.reactionTimes - Array of reaction times in ms
 * @param {number} results.avgReaction - Average reaction time
 * @param {Object|null} results.eyeTracking - Eye tracking result {smoothness, label}
 * @param {boolean} results.eyeSkipped - Whether eye test was skipped
 * @param {Object} results.symptoms - Symptom quiz answers {headache, nausea, confusion, lightSensitivity, memory, balance}
 * @returns {Object} { level: 'green'|'yellow'|'red', score: number, summary: string, actions: string[], details: Object }
 */
export function calculateRisk(results) {
  const flags = [];
  let riskPoints = 0;
  const details = {};

  // ── Reaction Time ──────────────────────────────────────────
  if (results.avgReaction != null) {
    if (results.avgReaction > REACTION.MODERATE) {
      riskPoints += 3;
      flags.push("significantly slowed reaction time");
      details.reaction = "poor";
    } else if (results.avgReaction > REACTION.GOOD) {
      riskPoints += 1.5;
      flags.push("mildly slowed reaction time");
      details.reaction = "moderate";
    } else {
      details.reaction = "good";
    }
  }

  // ── Eye Tracking ───────────────────────────────────────────
  if (results.eyeTracking && !results.eyeSkipped) {
    const s = results.eyeTracking.smoothness;
    if (s < EYE.MODERATE) {
      riskPoints += 3;
      flags.push("significant eye tracking irregularity");
      details.eyes = "poor";
    } else if (s < EYE.GOOD) {
      riskPoints += 1.5;
      flags.push("mild eye tracking irregularity");
      details.eyes = "moderate";
    } else {
      details.eyes = "good";
    }
  } else if (results.eyeSkipped) {
    details.eyes = "skipped";
  }

  // ── Symptom Quiz ───────────────────────────────────────────
  if (results.symptoms) {
    const symptomKeys = Object.keys(results.symptoms);
    const severeSymptoms = [];
    const moderateSymptoms = [];

    symptomKeys.forEach((key) => {
      const val = results.symptoms[key];
      if (val >= SYMPTOM_SEVERE) {
        riskPoints += 2;
        severeSymptoms.push(formatSymptomName(key));
      } else if (val >= SYMPTOM_MODERATE) {
        riskPoints += 1;
        moderateSymptoms.push(formatSymptomName(key));
      }
    });

    if (severeSymptoms.length) flags.push(`severe ${severeSymptoms.join(", ")}`);
    if (moderateSymptoms.length) flags.push(`mild ${moderateSymptoms.join(", ")}`);

    details.symptoms = { severe: severeSymptoms, moderate: moderateSymptoms };
  }

  // ── Compute Risk Level ─────────────────────────────────────
  let level;
  if (riskPoints >= 5) {
    level = "red";
  } else if (riskPoints >= 2) {
    level = "yellow";
  } else {
    level = "green";
  }

  const { summary, actions } = buildOutput(level, flags, results);

  return { level, riskPoints, summary, actions, flags, details };
}

function buildOutput(level, flags, results) {
  if (level === "red") {
    return {
      summary:
        "Your results suggest possible concussion-related impairment. You should not return to play today.",
      actions: [
        "Do not return to play or practice today",
        "Show this result to your coach or athletic trainer immediately",
        "Contact a doctor or visit urgent care within 24 hours",
        "Do not drive until evaluated by a medical professional",
        "Rest in a quiet, low-light environment",
      ],
    };
  }

  if (level === "yellow") {
    return {
      summary:
        "Some of your results were outside normal range. You should sit out and be monitored.",
      actions: [
        "Sit out for the remainder of this session",
        "Inform your coach or athletic trainer of your symptoms",
        "Monitor symptoms over the next few hours",
        "If symptoms worsen, seek medical attention immediately",
        "Re-test tomorrow before returning to play",
      ],
    };
  }

  return {
    summary:
      "Your results look normal. No signs of significant impairment detected.",
    actions: [
      "You may return to play",
      "Continue to monitor how you feel",
      "If symptoms develop later, stop activity and re-test",
      "Stay hydrated and avoid overexertion",
    ],
  };
}

function formatSymptomName(key) {
  const map = {
    headache: "headache",
    nausea: "nausea",
    confusion: "confusion",
    lightSensitivity: "light sensitivity",
    memory: "memory issues",
    balance: "balance problems",
    noise: "noise sensitivity",
    sleep: "sleep issues",
  };
  return map[key] || key;
}

/**
 * Returns color hex for a given risk level
 */
export function levelColor(level) {
  return { green: "#00e676", yellow: "#ffeb3b", red: "#ff5252" }[level] || "#aaa";
}

/**
 * Returns emoji for a given risk level
 */
export function levelEmoji(level) {
  return { green: "✓", yellow: "⚠", red: "✕" }[level] || "?";
}