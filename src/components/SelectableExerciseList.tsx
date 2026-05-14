import { Check } from "lucide-react";
import { LoadEditor } from "@/components/LoadEditor";
import { SetCounter } from "@/components/SetCounter";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useLoad } from "@/hooks/useLoad";
import { useSelectedExercises } from "@/hooks/useSelectedExercises";
import { useI18n } from "@/i18n/I18nProvider";
import type { Skill } from "@/data/skills";

interface Props {
  skill: Skill;
}

export const SelectableExerciseList = ({ skill }: Props) => {
  const { t } = useI18n();
  const { getLoad, setLoad } = useLoad();
  const { isSelected, toggle } = useSelectedExercises(skill.id);

  const allExercises = skill.groups.flatMap((g) =>
    g.progressions.map((name, i) => ({ groupId: g.id, name, index: i })),
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {allExercises.map(({ groupId, name, index }) => {
        const selected = isSelected(groupId, index);
        const entry = getLoad(skill.id, groupId, index);
        return (
          <div
            key={`${groupId}-${index}`}
            className={`rounded-2xl border shadow-elevated p-4 flex flex-col gap-3 transition ${
              selected
                ? "bg-primary/5 border-primary/60 shadow-glow"
                : "bg-gradient-card border-border"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(groupId, index)}
              className="flex items-start gap-2 text-left"
              aria-pressed={selected}
            >
              <span
                className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 transition ${
                  selected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-primary/15 border-primary/30 text-primary"
                }`}
              >
                {selected ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <span className="text-xs font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </span>
              <h3 className="font-semibold text-base flex-1 break-words min-w-0 leading-snug">
                {name}
              </h3>
            </button>
            <LoadEditor
              value={entry}
              onChange={(next) => setLoad(skill.id, groupId, index, next)}
            />
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <SetCounter total={entry.sets ?? 4} />
              <CountdownTimer initialSeconds={entry.rest ?? 60} compact />
            </div>
          </div>
        );
      })}
    </div>
  );
};
