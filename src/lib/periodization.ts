// ISO 8601 week calculation + Kalos 5-week periodization cycle (calendar 2026)

export type Phase = "strength" | "hypertrophy" | "endurance" | "deload";

export interface PhaseInfo {
  week: number;
  year: number;
  phase: Phase;
  label: string;
  suggested: { sets: number; reps: number; rest: number; note?: string };
}

const PHASE_LABEL: Record<Phase, string> = {
  strength: "FORZA",
  hypertrophy: "IPERTROFIA",
  endurance: "RESISTENZA",
  deload: "SCARICO",
};

const PHASE_SUGGESTED: Record<Phase, PhaseInfo["suggested"]> = {
  strength: { sets: 5, reps: 3, rest: 180 },
  hypertrophy: { sets: 4, reps: 8, rest: 90 },
  endurance: { sets: 3, reps: 15, rest: 60 },
  deload: { sets: 2, reps: 6, rest: 120, note: "al 50%" },
};

/** ISO 8601 week number (Mon-Sun, week 1 contains the first Thursday) */
export function getISOWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

/** Map a week number into the 5-week cycle phase */
export function getPhase(week: number): Phase {
  const pos = ((week - 1) % 5) + 1; // 1..5
  if (pos === 1 || pos === 2) return "strength";
  if (pos === 3) return "hypertrophy";
  if (pos === 4) return "endurance";
  return "deload";
}

export function getPhaseLabel(phase: Phase): string {
  return PHASE_LABEL[phase];
}

export function getPhaseSuggested(phase: Phase) {
  return PHASE_SUGGESTED[phase];
}

export function getCurrentPhase(now: Date = new Date()): PhaseInfo {
  const { year, week } = getISOWeek(now);
  const phase = getPhase(week);
  return {
    year,
    week,
    phase,
    label: PHASE_LABEL[phase],
    suggested: PHASE_SUGGESTED[phase],
  };
}
