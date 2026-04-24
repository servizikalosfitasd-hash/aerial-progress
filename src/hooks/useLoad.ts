import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "calis-track-loads-v1";

export type LoadType = "none" | "weight" | "band";
export type BandColor =
  | "microband"
  | "red-thin"
  | "yellow"
  | "orange"
  | "red"
  | "purple"
  | "blue";

export interface LoadEntry {
  type: LoadType;
  /** kg used (negative = weight removed via assistance, positive = added load). 0 if unset */
  kg?: number;
  band?: BandColor;
  /** seconds held (for static skills) */
  seconds?: number;
  /** number of sets */
  sets?: number;
  /** reps per set */
  reps?: number;
  /** ISO timestamp of last update */
  updatedAt?: string;
}

/** loads: { [skillId]: { [groupId]: { [progressionIndex]: LoadEntry } } } */
export type LoadMap = Record<string, Record<string, Record<number, LoadEntry>>>;

const safeRead = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

export const BAND_COLORS: { id: BandColor; hex: string }[] = [
  { id: "microband", hex: "#9CA3AF" },
  { id: "red-thin", hex: "#FCA5A5" },
  { id: "yellow", hex: "#FACC15" },
  { id: "orange", hex: "#FB923C" },
  { id: "red", hex: "#EF4444" },
  { id: "purple", hex: "#A855F7" },
  { id: "blue", hex: "#3B82F6" },
];

export function useLoad() {
  const [loads, setLoads] = useState<LoadMap>({});

  useEffect(() => {
    setLoads(safeRead<LoadMap>(STORAGE_KEY, {}));
  }, []);

  const setLoad = useCallback(
    (skillId: string, groupId: string, progressionIndex: number, entry: LoadEntry | null) => {
      setLoads((prev) => {
        const skill = { ...(prev[skillId] ?? {}) };
        const group = { ...(skill[groupId] ?? {}) };
        const isEmpty =
          !entry ||
          (entry.type === "none" &&
            entry.seconds == null &&
            entry.sets == null &&
            entry.reps == null);
        if (isEmpty) {
          delete group[progressionIndex];
        } else {
          group[progressionIndex] = { ...entry!, updatedAt: new Date().toISOString() };
        }
        skill[groupId] = group;
        if (Object.keys(group).length === 0) delete skill[groupId];
        const next = { ...prev, [skillId]: skill };
        if (Object.keys(skill).length === 0) delete next[skillId];
        safeWrite(STORAGE_KEY, next);
        return next;
      });
    },
    [],
  );

  const getLoad = useCallback(
    (skillId: string, groupId: string, progressionIndex: number): LoadEntry => {
      return (
        loads[skillId]?.[groupId]?.[progressionIndex] ?? { type: "none" }
      );
    },
    [loads],
  );

  return { loads, setLoad, getLoad };
}
