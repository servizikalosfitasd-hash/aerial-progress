import { useCallback, useMemo } from "react";
import { useUserData } from "./UserDataProvider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type ProgressMap = Record<string, Record<string, number>>;
export type NotesMap = Record<string, string>;

export function useProgress() {
  const { skills, upsertSkill, deleteSkill } = useUserData();
  const { user } = useAuth();

  const progress = useMemo<ProgressMap>(() => {
    const map: ProgressMap = {};
    for (const r of skills) {
      if (r.progression_index < 0) continue;
      (map[r.skill_id] ||= {})[r.group_id] = r.progression_index;
    }
    return map;
  }, [skills]);

  const setGroupProgress = useCallback(
    (skillId: string, groupId: string, index: number) => {
      if (index < 0) {
        const row = skills.find((r) => r.skill_id === skillId && r.group_id === groupId);
        if (row && row.max_seconds == null && row.max_reps == null && row.max_kg == null && !row.max_note && !row.note && (!row.done || row.done.length === 0)) {
          deleteSkill({ skill_id: skillId, group_id: groupId });
        } else {
          upsertSkill({ skill_id: skillId, group_id: groupId }, { progression_index: -1 });
        }
      } else {
        upsertSkill({ skill_id: skillId, group_id: groupId }, { progression_index: index });
      }
    },
    [skills, upsertSkill, deleteSkill],
  );

  const resetSkill = useCallback(
    async (skillId: string) => {
      if (!user) return;
      await supabase.from("user_skills").delete().eq("user_id", user.id).eq("skill_id", skillId);
      // optimistic local refresh handled on next provider mount; trigger via reload
      window.location.reload();
    },
    [user],
  );

  const getGroupIndex = useCallback(
    (skillId: string, groupId: string) => progress[skillId]?.[groupId] ?? -1,
    [progress],
  );

  const getSkillCompletedCount = useCallback(
    (skillId: string) => {
      const s = progress[skillId];
      if (!s) return 0;
      return Object.values(s).reduce((a, i) => a + (i >= 0 ? i + 1 : 0), 0);
    },
    [progress],
  );

  return { progress, setGroupProgress, resetSkill, getGroupIndex, getSkillCompletedCount };
}

export function useNotes() {
  const { skills, upsertSkill } = useUserData();

  const notes = useMemo<NotesMap>(() => {
    const map: NotesMap = {};
    for (const r of skills) {
      if (r.note) map[r.skill_id] = r.note;
    }
    return map;
  }, [skills]);

  // notes are per-skill; we store on a synthetic group "_notes_"
  const setNote = useCallback(
    (skillId: string, value: string) => {
      upsertSkill({ skill_id: skillId, group_id: "_notes_" }, { note: value });
    },
    [upsertSkill],
  );

  const getNote = useCallback(
    (skillId: string) => {
      const r = skills.find((x) => x.skill_id === skillId && x.group_id === "_notes_");
      return r?.note ?? "";
    },
    [skills],
  );

  return { notes, setNote, getNote };
}
