import { useCallback, useEffect, useState } from "react";
import type { Skill } from "@/data/skills";

const KEY = (skillId: string) => `selected-exercises:${skillId}`;

type SelMap = Record<string, boolean>;

function read(skillId: string): SelMap {
  try {
    const raw = localStorage.getItem(KEY(skillId));
    return raw ? (JSON.parse(raw) as SelMap) : {};
  } catch {
    return {};
  }
}

export interface SelectedExercise {
  groupId: string;
  groupLabel: string;
  index: number;
  name: string;
}

export function useSelectedExercises(skillId: string) {
  const [map, setMap] = useState<SelMap>(() => read(skillId));

  useEffect(() => {
    setMap(read(skillId));
  }, [skillId]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY(skillId)) setMap(read(skillId));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [skillId]);

  const persist = useCallback(
    (next: SelMap) => {
      setMap(next);
      try {
        localStorage.setItem(KEY(skillId), JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [skillId],
  );

  const isSelected = useCallback(
    (groupId: string, index: number) => !!map[`${groupId}-${index}`],
    [map],
  );

  const toggle = useCallback(
    (groupId: string, index: number) => {
      const k = `${groupId}-${index}`;
      const next = { ...map, [k]: !map[k] };
      if (!next[k]) delete next[k];
      persist(next);
    },
    [map, persist],
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
