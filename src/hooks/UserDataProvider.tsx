import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// ========= types =========
export interface UserSkillRow {
  id: string;
  skill_id: string;
  group_id: string;
  progression_index: number;
  done: { groupId: string; index: number; date: string; name: string }[];
  max_seconds: number | null;
  max_reps: number | null;
  max_kg: number | null;
  max_note: string | null;
  note: string | null;
}

export interface UserWorkoutRow {
  id: string;
  skill_id: string;
  group_id: string;
  progression_index: number;
  exercise_name: string;
  sets: number | null;
  reps: number | null;
  seconds: number | null;
  recovery: number | null;
  load_type: string | null;
  load_kg: number | null;
  load_band: string | null;
}

interface CtxValue {
  skills: UserSkillRow[];
  workouts: UserWorkoutRow[];
  ready: boolean;
  upsertSkill: (key: { skill_id: string; group_id: string }, patch: Partial<UserSkillRow>) => Promise<void>;
  deleteSkill: (key: { skill_id: string; group_id: string }) => Promise<void>;
  upsertWorkout: (
    key: { skill_id: string; group_id: string; progression_index: number },
    patch: Partial<UserWorkoutRow>,
  ) => Promise<void>;
  deleteWorkout: (key: { skill_id: string; group_id: string; progression_index: number }) => Promise<void>;
}

const Ctx = createContext<CtxValue | undefined>(undefined);

const emptySkill = (skill_id: string, group_id: string): UserSkillRow => ({
  id: "",
  skill_id,
  group_id,
  progression_index: -1,
  done: [],
  max_seconds: null,
  max_reps: null,
  max_kg: null,
  max_note: null,
  note: null,
});

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [skills, setSkills] = useState<UserSkillRow[]>([]);
  const [workouts, setWorkouts] = useState<UserWorkoutRow[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      setSkills([]);
      setWorkouts([]);
      setReady(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const [s, w] = await Promise.all([
        supabase.from("user_skills").select("*").eq("user_id", user.id),
        supabase.from("user_workouts").select("*").eq("user_id", user.id),
      ]);
      if (cancelled) return;
      setSkills(((s.data ?? []) as any[]).map(normalizeSkill));
      setWorkouts(((w.data ?? []) as any[]).map(normalizeWorkout));
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const upsertSkill = useCallback<CtxValue["upsertSkill"]>(
    async (key, patch) => {
      if (!user) return;
      const existing = skills.find((r) => r.skill_id === key.skill_id && r.group_id === key.group_id);
      const merged = { ...(existing ?? emptySkill(key.skill_id, key.group_id)), ...patch };
      // optimistic
      setSkills((prev) => {
        const others = prev.filter((r) => !(r.skill_id === key.skill_id && r.group_id === key.group_id));
        return [...others, merged];
      });
      const { data, error } = await supabase
        .from("user_skills")
        .upsert(
          {
            user_id: user.id,
            skill_id: key.skill_id,
            group_id: key.group_id,
            progression_index: merged.progression_index,
            done: merged.done as any,
            max_seconds: merged.max_seconds,
            max_reps: merged.max_reps,
            max_kg: merged.max_kg,
            max_note: merged.max_note,
            note: merged.note,
          },
          { onConflict: "user_id,skill_id,group_id" },
        )
        .select()
        .single();
      if (!error && data) {
        setSkills((prev) =>
          prev.map((r) =>
            r.skill_id === key.skill_id && r.group_id === key.group_id ? normalizeSkill(data) : r,
          ),
        );
      }
    },
    [user, skills],
  );

  const deleteSkill = useCallback<CtxValue["deleteSkill"]>(
    async (key) => {
      if (!user) return;
      setSkills((prev) =>
        prev.filter((r) => !(r.skill_id === key.skill_id && r.group_id === key.group_id)),
      );
      await supabase
        .from("user_skills")
        .delete()
        .eq("user_id", user.id)
        .eq("skill_id", key.skill_id)
        .eq("group_id", key.group_id);
    },
    [user],
  );

  const upsertWorkout = useCallback<CtxValue["upsertWorkout"]>(
    async (key, patch) => {
      if (!user) return;
      const existing = workouts.find(
        (r) =>
          r.skill_id === key.skill_id &&
          r.group_id === key.group_id &&
          r.progression_index === key.progression_index,
      );
      const merged: UserWorkoutRow = {
        ...(existing ?? {
          id: "",
          skill_id: key.skill_id,
          group_id: key.group_id,
          progression_index: key.progression_index,
          exercise_name: patch.exercise_name ?? "",
          sets: null,
          reps: null,
          seconds: null,
          recovery: null,
          load_type: null,
          load_kg: null,
          load_band: null,
        }),
        ...patch,
      };
      setWorkouts((prev) => {
        const others = prev.filter(
          (r) =>
            !(
              r.skill_id === key.skill_id &&
              r.group_id === key.group_id &&
              r.progression_index === key.progression_index
            ),
        );
        return [...others, merged];
      });
      const { data, error } = await supabase
        .from("user_workouts")
        .upsert(
          {
            user_id: user.id,
            skill_id: key.skill_id,
            group_id: key.group_id,
            progression_index: key.progression_index,
            exercise_name: merged.exercise_name || `${key.group_id} #${key.progression_index + 1}`,
            sets: merged.sets,
            reps: merged.reps,
            seconds: merged.seconds,
            recovery: merged.recovery,
            load_type: merged.load_type,
            load_kg: merged.load_kg,
            load_band: merged.load_band,
          },
          { onConflict: "user_id,skill_id,group_id,progression_index" },
        )
        .select()
        .single();
      if (!error && data) {
        setWorkouts((prev) =>
          prev.map((r) =>
            r.skill_id === key.skill_id &&
            r.group_id === key.group_id &&
            r.progression_index === key.progression_index
              ? normalizeWorkout(data)
              : r,
          ),
        );
      }
    },
    [user, workouts],
  );

  const deleteWorkout = useCallback<CtxValue["deleteWorkout"]>(
    async (key) => {
      if (!user) return;
      setWorkouts((prev) =>
        prev.filter(
          (r) =>
            !(
              r.skill_id === key.skill_id &&
              r.group_id === key.group_id &&
              r.progression_index === key.progression_index
            ),
        ),
      );
      await supabase
        .from("user_workouts")
        .delete()
        .eq("user_id", user.id)
        .eq("skill_id", key.skill_id)
        .eq("group_id", key.group_id)
        .eq("progression_index", key.progression_index);
    },
    [user],
  );

  return (
    <Ctx.Provider value={{ skills, workouts, ready, upsertSkill, deleteSkill, upsertWorkout, deleteWorkout }}>
      {children}
    </Ctx.Provider>
  );
}

function normalizeSkill(row: any): UserSkillRow {
  return {
    id: row.id,
    skill_id: row.skill_id,
    group_id: row.group_id,
    progression_index: row.progression_index ?? -1,
    done: Array.isArray(row.done) ? row.done : [],
    max_seconds: row.max_seconds,
    max_reps: row.max_reps,
    max_kg: row.max_kg,
    max_note: row.max_note,
    note: row.note,
  };
}

function normalizeWorkout(row: any): UserWorkoutRow {
  return {
    id: row.id,
    skill_id: row.skill_id,
    group_id: row.group_id,
    progression_index: row.progression_index,
    exercise_name: row.exercise_name,
    sets: row.sets,
    reps: row.reps,
    seconds: row.seconds,
    recovery: row.recovery,
    load_type: row.load_type,
    load_kg: row.load_kg,
    load_band: row.load_band,
  };
}

export function useUserData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUserData must be used inside UserDataProvider");
  return ctx;
}
