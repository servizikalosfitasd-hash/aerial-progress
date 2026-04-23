import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "calisthenics-progress-v1";

export type ProgressMap = Record<string, string | null>;

const read = (): ProgressMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
};

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(read());
  }, []);

  const setSkillProgress = useCallback((skillId: string, progressionId: string | null) => {
    setProgress((prev) => {
      const next = { ...prev, [skillId]: progressionId };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const getSkillProgress = useCallback(
    (skillId: string): string | null => progress[skillId] ?? null,
    [progress]
  );

  return { progress, setSkillProgress, getSkillProgress };
}
