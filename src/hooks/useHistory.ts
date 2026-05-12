import { useCallback, useMemo } from "react";
import { useUserData } from "./UserDataProvider";

export interface HistoryEntry {
  date: string;
  skillId: string;
  groupId: string;
  progressionIndex: number;
  progressionName: string;
}

export type HistoryMap = Record<string, HistoryEntry[]>;

export function useHistory() {
  const { skills, upsertSkill } = useUserData();

  const history = useMemo<HistoryMap>(() => {
    const map: HistoryMap = {};
    for (const r of skills) {
      for (const d of r.done ?? []) {
        (map[r.skill_id] ||= []).push({
          skillId: r.skill_id,
          groupId: d.groupId ?? r.group_id,
          progressionIndex: d.index,
          progressionName: d.name,
          date: d.date,
        });
      }
    }
    return map;
  }, [skills]);

  const addEntry = useCallback(
    (entry: Omit<HistoryEntry, "date"> & { date?: string }) => {
      const row = skills.find((r) => r.skill_id === entry.skillId && r.group_id === entry.groupId);
      const done = row?.done ?? [];
      if (done.some((d) => d.index === entry.progressionIndex && (d.groupId ?? entry.groupId) === entry.groupId)) {
        return;
      }
      const next = [
        ...done,
        {
          groupId: entry.groupId,
          index: entry.progressionIndex,
          name: entry.progressionName,
          date: entry.date ?? new Date().toISOString(),
        },
      ];
      upsertSkill({ skill_id: entry.skillId, group_id: entry.groupId }, { done: next });
    },
    [skills, upsertSkill],
  );

  const removeEntry = useCallback(
    (skillId: string, groupId: string, progressionIndex: number) => {
      const row = skills.find((r) => r.skill_id === skillId && r.group_id === groupId);
      if (!row) return;
      const next = (row.done ?? []).filter(
        (d) => !((d.groupId ?? groupId) === groupId && d.index === progressionIndex),
      );
      upsertSkill({ skill_id: skillId, group_id: groupId }, { done: next });
    },
    [skills, upsertSkill],
  );

  const getSkillHistory = useCallback(
    (skillId: string) =>
      [...(history[skillId] ?? [])].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [history],
  );

  const getAllSorted = useCallback((): HistoryEntry[] => {
    const all: HistoryEntry[] = [];
    Object.values(history).forEach((l) => all.push(...l));
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [history]);

  return { history, addEntry, removeEntry, getSkillHistory, getAllSorted };
}
