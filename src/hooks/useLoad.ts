import { useCallback, useMemo } from "react";
import { useUserData } from "./UserDataProvider";

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
  kg?: number;
  band?: BandColor;
  seconds?: number;
  sets?: number;
  reps?: number;
  rest?: number;
  updatedAt?: string;
}

export type LoadMap = Record<string, Record<string, Record<number, LoadEntry>>>;

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
  const { workouts, upsertWorkout, deleteWorkout } = useUserData();

  const loads = useMemo<LoadMap>(() => {
    const map: LoadMap = {};
    for (const w of workouts) {
      const skill = (map[w.skill_id] ||= {});
      const group = (skill[w.group_id] ||= {});
      group[w.progression_index] = {
        type: (w.load_type as LoadType) ?? "none",
        kg: w.load_kg != null ? Number(w.load_kg) : undefined,
        band: (w.load_band as BandColor) ?? undefined,
        seconds: w.seconds ?? undefined,
        sets: w.sets ?? undefined,
        reps: w.reps ?? undefined,
        rest: w.recovery ?? undefined,
      };
    }
    return map;
  }, [workouts]);

  const setLoad = useCallback(
    (skillId: string, groupId: string, progressionIndex: number, entry: LoadEntry | null) => {
      const isEmpty =
        !entry ||
        (entry.type === "none" &&
          entry.seconds == null &&
          entry.sets == null &&
          entry.reps == null &&
          entry.rest == null &&
          entry.kg == null &&
          !entry.band);
      if (isEmpty) {
        deleteWorkout({ skill_id: skillId, group_id: groupId, progression_index: progressionIndex });
        return;
      }
      upsertWorkout(
        { skill_id: skillId, group_id: groupId, progression_index: progressionIndex },
        {
          exercise_name: `${groupId} #${progressionIndex + 1}`,
          load_type: entry!.type ?? null,
          load_kg: entry!.kg ?? null,
          load_band: entry!.band ?? null,
          seconds: entry!.seconds ?? null,
          sets: entry!.sets ?? null,
          reps: entry!.reps ?? null,
          recovery: entry!.rest ?? null,
        },
      );
    },
    [upsertWorkout, deleteWorkout],
  );

  const getLoad = useCallback(
    (skillId: string, groupId: string, progressionIndex: number): LoadEntry =>
      loads[skillId]?.[groupId]?.[progressionIndex] ?? { type: "none" },
    [loads],
  );

  return { loads, setLoad, getLoad };
}
