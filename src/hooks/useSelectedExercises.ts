import { useCallback } from "react";
import type { Skill } from "@/data/skills";
import { useSyncedState } from "@/hooks/useSyncedState";

const KEY = (skillId: string) => `selected-exercises:${skillId}`;

type SelMap = Record<string, boolean>;

export interface SelectedExercise {
  groupId: string;
  groupLabel: string;
  index: number;
  name: string;
}

export function useSelectedExercises(skillId: string) {
  const [map, setMap] = useSyncedState<SelMap>(KEY(skillId), {});

  const isSelected = useCallback(
    (groupId: string, index: number) => !!map[`${groupId}-${index}`],
    [map],
  );

  const toggle = useCallback(
    (groupId: string, index: number) => {
      setMap((prev) => {
        const k = `${groupId}-${index}`;
        const next = { ...prev, [k]: !prev[k] };
        if (!next[k]) delete next[k];
        return next;
      });
    },
    [setMap],
  );

  const getSelectedList = useCallback(
    (skill: Skill, lang: "it" | "en" | "es"): SelectedExercise[] => {
      const out: SelectedExercise[] = [];
      for (const g of skill.groups) {
        g.progressions.forEach((name, i) => {
          if (map[`${g.id}-${i}`]) {
            out.push({ groupId: g.id, groupLabel: g.label[lang], index: i, name });
          }
        });
      }
      return out;
    },
    [map],
  );

  return { isSelected, toggle, getSelectedList, map };
}
