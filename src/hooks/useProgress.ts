import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "calis-track-progress-v2";
const NOTES_KEY = "calis-track-notes-v1";

/** progress: { [skillId]: { [groupId]: progressionIndex } } — index is 0-based, -1 = not started */
export type ProgressMap = Record<string, Record<string, number>>;
export type NotesMap = Record<string, string>;

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

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(safeRead<ProgressMap>(STORAGE_KEY, {}));
  }, []);

  const setGroupProgress = useCallback((skillId: string, groupId: string, index: number) => {
    setProgress((prev) => {
      const skill = { ...(prev[skillId] ?? {}) };
      if (index < 0) {
        delete skill[groupId];
      } else {
        skill[groupId] = index;
      }
      const next = { ...prev, [skillId]: skill };
      if (Object.keys(skill).length === 0) delete next[skillId];
      safeWrite(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const resetSkill = useCallback((skillId: string) => {
    setProgress((prev) => {
      const next = { ...prev };
      delete next[skillId];
      safeWrite(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const getGroupIndex = useCallback(
    (skillId: string, groupId: string): number => progress[skillId]?.[groupId] ?? -1,
    [progress],
  );

  /** Returns total completed progressions across all groups for a skill */
  const getSkillCompletedCount = useCallback(
    (skillId: string): number => {
      const skill = progress[skillId];
      if (!skill) return 0;
      return Object.values(skill).reduce((acc, idx) => acc + (idx >= 0 ? idx + 1 : 0), 0);
    },
    [progress],
  );

  return { progress, setGroupProgress, resetSkill, getGroupIndex, getSkillCompletedCount };
}

export function useNotes() {
  const [notes, setNotes] = useState<NotesMap>({});

  useEffect(() => {
    setNotes(safeRead<NotesMap>(NOTES_KEY, {}));
  }, []);

  const setNote = useCallback((skillId: string, value: string) => {
    setNotes((prev) => {
      const next = { ...prev, [skillId]: value };
      safeWrite(NOTES_KEY, next);
      return next;
    });
  }, []);

  const getNote = useCallback((skillId: string) => notes[skillId] ?? "", [notes]);

  return { notes, setNote, getNote };
}
