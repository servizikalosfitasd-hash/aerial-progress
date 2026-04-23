import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "calis-track-history-v1";

export interface HistoryEntry {
  /** ISO date string */
  date: string;
  skillId: string;
  groupId: string;
  progressionIndex: number;
  progressionName: string;
}

export type HistoryMap = Record<string, HistoryEntry[]>;

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

export function useHistory() {
  const [history, setHistory] = useState<HistoryMap>({});

  useEffect(() => {
    setHistory(safeRead<HistoryMap>(STORAGE_KEY, {}));
  }, []);

  const addEntry = useCallback(
    (entry: Omit<HistoryEntry, "date"> & { date?: string }) => {
      setHistory((prev) => {
        const list = prev[entry.skillId] ?? [];
        // dedupe: same group + index already logged
        if (
          list.some(
            (e) =>
              e.groupId === entry.groupId &&
              e.progressionIndex === entry.progressionIndex,
          )
        ) {
          return prev;
        }
        const newEntry: HistoryEntry = {
          date: entry.date ?? new Date().toISOString(),
          skillId: entry.skillId,
          groupId: entry.groupId,
          progressionIndex: entry.progressionIndex,
          progressionName: entry.progressionName,
        };
        const next = { ...prev, [entry.skillId]: [...list, newEntry] };
        safeWrite(STORAGE_KEY, next);
        return next;
      });
    },
    [],
  );

  const removeEntry = useCallback(
    (skillId: string, groupId: string, progressionIndex: number) => {
      setHistory((prev) => {
        const list = prev[skillId] ?? [];
        const filtered = list.filter(
          (e) => !(e.groupId === groupId && e.progressionIndex === progressionIndex),
        );
        const next = { ...prev };
        if (filtered.length === 0) delete next[skillId];
        else next[skillId] = filtered;
        safeWrite(STORAGE_KEY, next);
        return next;
      });
    },
    [],
  );

  const getSkillHistory = useCallback(
    (skillId: string): HistoryEntry[] =>
      [...(history[skillId] ?? [])].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [history],
  );

  const getAllSorted = useCallback((): HistoryEntry[] => {
    const all: HistoryEntry[] = [];
    Object.values(history).forEach((list) => all.push(...list));
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [history]);

  return { history, addEntry, removeEntry, getSkillHistory, getAllSorted };
}
