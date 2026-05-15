import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Phase } from "@/lib/periodization";

export interface SessionEntry {
  groupId: string;
  groupLabel?: string;
  index: number;
  name: string;
  sets?: number | null;
  reps?: number | null;
  seconds?: number | null;
  recovery?: number | null;
  kg?: number | null;
  band?: string | null;
}

export interface WorkoutSession {
  id: string;
  skill_id: string;
  year: number;
  iso_week: number;
  phase: Phase;
  completed_at: string;
  entries: SessionEntry[];
}

export function useWorkoutSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setSessions([]);
      setReady(false);
      return;
    }
    const { data } = await supabase
      .from("workout_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });
    setSessions(
      ((data ?? []) as any[]).map((r) => ({
        id: r.id,
        skill_id: r.skill_id,
        year: r.year,
        iso_week: r.iso_week,
        phase: r.phase,
        completed_at: r.completed_at,
        entries: Array.isArray(r.entries) ? r.entries : [],
      })),
    );
    setReady(true);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveSession = useCallback(
    async (params: {
      skill_id: string;
      year: number;
      iso_week: number;
      phase: Phase;
      entries: SessionEntry[];
    }) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("workout_sessions")
        .insert({
          user_id: user.id,
          skill_id: params.skill_id,
          year: params.year,
          iso_week: params.iso_week,
          phase: params.phase,
          entries: params.entries as any,
        })
        .select()
        .single();
      if (!error && data) {
        await refresh();
      }
      return data;
    },
    [user, refresh],
  );

  const getPrevious = useCallback(
    (skillId: string): WorkoutSession | undefined =>
      sessions.find((s) => s.skill_id === skillId),
    [sessions],
  );

  const isDoneThisWeek = useCallback(
    (skillId: string, year: number, week: number) =>
      sessions.some(
        (s) => s.skill_id === skillId && s.year === year && s.iso_week === week,
      ),
    [sessions],
  );

  const getLastSessionThisWeek = useCallback(
    (skillId: string, year: number, week: number): WorkoutSession | undefined =>
      sessions.find(
        (s) => s.skill_id === skillId && s.year === year && s.iso_week === week,
      ),
    [sessions],
  );

  return {
    sessions,
    ready,
    refresh,
    saveSession,
    getPrevious,
    isDoneThisWeek,
    getLastSessionThisWeek,
  };
}
