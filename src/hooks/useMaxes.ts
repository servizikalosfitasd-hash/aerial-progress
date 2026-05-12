import { useCallback, useMemo } from "react";
import { useUserData } from "./UserDataProvider";

export interface MaxEntry {
  seconds?: number;
  reps?: number;
  kg?: number;
  note?: string;
  updatedAt: string;
}

export type MaxesMap = Record<string, MaxEntry>;

const MAX_GROUP = "_max_";

export function useMaxes() {
  const { skills, upsertSkill, deleteSkill } = useUserData();

  const maxes = useMemo<MaxesMap>(() => {
    const map: MaxesMap = {};
    for (const r of skills) {
      if (r.group_id !== MAX_GROUP) continue;
      const e: MaxEntry = { updatedAt: new Date().toISOString() };
      if (r.max_seconds != null) e.seconds = r.max_seconds;
      if (r.max_reps != null) e.reps = r.max_reps;
      if (r.max_kg != null) e.kg = Number(r.max_kg);
      if (r.max_note) e.note = r.max_note;
      if (e.seconds != null || e.reps != null || e.kg != null || e.note) map[r.skill_id] = e;
    }
    return map;
  }, [skills]);

  const setMax = useCallback(
    (skillId: string, entry: Partial<MaxEntry> | null) => {
      if (!entry) {
        deleteSkill({ skill_id: skillId, group_id: MAX_GROUP });
        return;
      }
      const isEmpty =
        (entry.seconds == null || entry.seconds === 0) &&
        (entry.reps == null || entry.reps === 0) &&
        (entry.kg == null || entry.kg === 0) &&
        !entry.note;
      if (isEmpty) {
        deleteSkill({ skill_id: skillId, group_id: MAX_GROUP });
        return;
      }
      upsertSkill(
        { skill_id: skillId, group_id: MAX_GROUP },
        {
          max_seconds: entry.seconds && entry.seconds !== 0 ? entry.seconds : null,
          max_reps: entry.reps && entry.reps !== 0 ? entry.reps : null,
          max_kg: entry.kg && entry.kg !== 0 ? entry.kg : null,
          max_note: entry.note ?? null,
        },
      );
    },
    [upsertSkill, deleteSkill],
  );

  const getMax = useCallback((skillId: string) => maxes[skillId], [maxes]);

  return { maxes, setMax, getMax };
}
