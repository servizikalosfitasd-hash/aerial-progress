import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "calis-track-maxes-v1";

export interface MaxEntry {
  /** seconds for static holds */
  seconds?: number;
  /** maximum reps */
  reps?: number;
  /** kg added (positive) or assistance (negative) */
  kg?: number;
  /** optional note */
  note?: string;
  /** ISO date when set */
  updatedAt: string;
}

export type MaxesMap = Record<string, MaxEntry>;

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

export function useMaxes() {
  const [maxes, setMaxes] = useState<MaxesMap>({});

  useEffect(() => {
    setMaxes(safeRead<MaxesMap>(STORAGE_KEY, {}));
  }, []);

  const setMax = useCallback((skillId: string, entry: Partial<MaxEntry> | null) => {
    setMaxes((prev) => {
      const next = { ...prev };
      if (!entry) {
        delete next[skillId];
      } else {
        const cleaned: MaxEntry = {
          updatedAt: new Date().toISOString(),
          ...(entry.seconds != null && entry.seconds !== 0 ? { seconds: entry.seconds } : {}),
          ...(entry.reps != null && entry.reps !== 0 ? { reps: entry.reps } : {}),
          ...(entry.kg != null && entry.kg !== 0 ? { kg: entry.kg } : {}),
          ...(entry.note ? { note: entry.note } : {}),
        };
        // if all metric fields empty and no note, treat as removal
        if (cleaned.seconds == null && cleaned.reps == null && cleaned.kg == null && !cleaned.note) {
          delete next[skillId];
        } else {
          next[skillId] = cleaned;
        }
      }
      safeWrite(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const getMax = useCallback(
    (skillId: string): MaxEntry | undefined => maxes[skillId],
    [maxes],
  );

  return { maxes, setMax, getMax };
}
