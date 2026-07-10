// Programmazione ciclica 5 settimane (Lun-Ven)

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri";

export interface ScheduleSkill {
  /** id di src/data/skills.ts se linkabile */
  skillId?: string;
  label: string;
}

export interface DaySchedule {
  day: DayKey;
  dayLabel: string;
  skills: ScheduleSkill[];
  /** true = mostra chip "Circuito Addome/Gambe 5/7 min" */
  hasCoreLegsCircuit: boolean;
  /** true = giorno "Circuito/Potenziamento + Skill Piacere" */
  isFreeCircuitDay: boolean;
}

export interface WeekSchedule {
  cyclePosition: 1 | 2 | 3 | 4 | 5;
  focus: string;
  focusShort: string;
  days: DaySchedule[];
}

export const DAY_LABELS: Record<DayKey, string> = {
  mon: "Lunedì",
  tue: "Martedì",
  wed: "Mercoledì",
  thu: "Giovedì",
  fri: "Venerdì",
};

const S = {
  handstand: { skillId: "handstand", label: "Handstand" },
  frontLever: { skillId: "front-lever", label: "Front Lever" },
  manna: { skillId: "manna", label: "Manna" },
  muscleUp: { skillId: "muscle-up-bar", label: "Muscle Up" },
  planche: { skillId: "planche", label: "Planche" },
  impossibleDips: { skillId: "impossible-dips", label: "Impossible Dips" },
  pressHS: { skillId: "press-handstand", label: "Press to HS" },
  backLever: { skillId: "back-lever", label: "Back Lever" },
  humanFlag: { skillId: "human-flag", label: "Human Flag" },
  ironCross: { skillId: "iron-cross", label: "Iron Cross" },
} satisfies Record<string, ScheduleSkill>;

// Blocchi di allenamento riutilizzati nei 5 pattern
const BLOCKS = {
  A: [S.handstand, S.frontLever, S.manna],
  B: [S.muscleUp, S.planche, S.impossibleDips],
  C: [S.pressHS, S.backLever, S.humanFlag],
  D: [S.planche, S.frontLever, S.ironCross],
  FREE: [] as ScheduleSkill[], // giorno circuito/skill piacere
} as const;

type Slot = keyof typeof BLOCKS; // A | B | C | D | FREE

// Ordine giornaliero (Lun-Ven) per ciascuna posizione del ciclo
const CYCLE: Record<1 | 2 | 3 | 4 | 5, Slot[]> = {
  1: ["A", "B", "FREE", "C", "D"],
  2: ["B", "FREE", "C", "D", "A"],
  3: ["FREE", "C", "D", "A", "B"],
  4: ["C", "D", "A", "B", "FREE"],
  5: ["D", "A", "B", "FREE", "C"],
};

const FOCUS: Record<1 | 2 | 3 | 4 | 5, { long: string; short: string }> = {
  1: {
    long: "Potenziamento — max 5 reps e massimo 30 secondi di isometria",
    short: "Potenziamento · 5 reps / 30s iso",
  },
  2: {
    long: "Potenziamento — max 5 reps e massimo 30 secondi di isometria",
    short: "Potenziamento · 5 reps / 30s iso",
  },
  3: {
    long: "Ipertrofia — max 10/12 reps e massimo 60 secondi di isometria",
    short: "Ipertrofia · 10-12 reps / 60s iso",
  },
  4: {
    long: "Resistenza — max 20 reps e massimo 60 secondi di isometria",
    short: "Resistenza · 20 reps / 60s iso",
  },
  5: {
    long: "Scarico — max 2/3 reps e massimo 15 secondi di isometria",
    short: "Scarico · 2-3 reps / 15s iso",
  },
};

const DAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri"];

export function getCyclePosition(week: number): 1 | 2 | 3 | 4 | 5 {
  const pos = (((week - 1) % 5) + 5) % 5;
  return (pos + 1) as 1 | 2 | 3 | 4 | 5;
}

export function getWeeklySchedule(week: number): WeekSchedule {
  const cyclePosition = getCyclePosition(week);
  const slots = CYCLE[cyclePosition];
  const days: DaySchedule[] = DAYS.map((day, i) => {
    const slot = slots[i];
    const isFree = slot === "FREE";
    return {
      day,
      dayLabel: DAY_LABELS[day],
      skills: [...BLOCKS[slot]],
      hasCoreLegsCircuit: !isFree,
      isFreeCircuitDay: isFree,
    };
  });
  return {
    cyclePosition,
    focus: FOCUS[cyclePosition].long,
    focusShort: FOCUS[cyclePosition].short,
    days,
  };
}

/** Lun=0 ... Dom=6, restituisce DayKey se in Lun-Ven, altrimenti null */
export function todayDayKey(now: Date = new Date()): DayKey | null {
  const js = now.getDay(); // 0 dom .. 6 sab
  const map: Record<number, DayKey | null> = {
    0: null,
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: null,
  };
  return map[js];
}
