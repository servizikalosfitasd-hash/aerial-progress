import { useMemo } from "react";
import { ClipboardList } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { skills, type Skill } from "@/data/skills";
import { useProgress } from "@/hooks/useProgress";
import { useLoad, type LoadEntry } from "@/hooks/useLoad";
import { Input } from "@/components/ui/input";
import { SetCounter } from "@/components/SetCounter";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useI18n } from "@/i18n/I18nProvider";

interface PlanItem {
  groupId: string;
  groupLabel: string;
  index: number;
  name: string;
}

const WorkoutPlan = () => {
  const { lang } = useI18n();
  const { progress } = useProgress();
  const { loads, setLoad, getLoad } = useLoad();

  const grouped = useMemo(() => {
    return skills
      .map((skill) => {
        const items: PlanItem[] = [];
        const sp = progress[skill.id] ?? {};
        for (const g of skill.groups) {
          const idx = sp[g.id];
          if (typeof idx === "number" && idx >= 0) {
            items.push({
              groupId: g.id,
              groupLabel: g.label[lang],
              index: idx,
              name: g.progressions[idx],
            });
          }
        }
        // Add load-only entries (entries with metrics but no current selection)
        const sl = loads[skill.id] ?? {};
        for (const g of skill.groups) {
          const groupData = sl[g.id] ?? {};
          for (const idxStr of Object.keys(groupData)) {
            const i = Number(idxStr);
            if (!items.some((it) => it.groupId === g.id && it.index === i)) {
              items.push({
                groupId: g.id,
                groupLabel: g.label[lang],
                index: i,
                name: g.progressions[i] ?? `#${i + 1}`,
              });
            }
          }
        }
        items.sort((a, b) =>
          a.groupId === b.groupId ? a.index - b.index : a.groupId.localeCompare(b.groupId),
        );
        return { skill, items };
      })
      .filter((s) => s.items.length > 0);
  }, [progress, loads, lang]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-5xl mx-auto pl-14 pr-4 sm:px-6 py-4 flex items-center justify-end gap-3">
          <LanguageSwitcher />
        </div>
      </header>

      <section className="bg-gradient-hero">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <ClipboardList className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-primary">
              Allenamento
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-[0.95] mb-3">
            Scheda Allenamento
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Tutti gli esercizi correntemente selezionati per ogni skill. Modifica serie, secondi,
            ripetizioni e recupero in tempo reale.
          </p>
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {grouped.length === 0 && (
          <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated p-8 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-base font-semibold mb-1">Nessun esercizio in scheda</p>
            <p className="text-sm text-muted-foreground">
              Apri una skill e seleziona la propedeutica corrente per aggiungerla qui.
            </p>
          </div>
        )}

        {grouped.map(({ skill, items }) => (
          <SkillBlock
            key={skill.id}
            skill={skill}
            items={items}
            getLoad={getLoad}
            setLoad={setLoad}
          />
        ))}
      </section>
    </div>
  );
};

const SkillBlock = ({
  skill,
  items,
  getLoad,
  setLoad,
}: {
  skill: Skill;
  items: PlanItem[];
  getLoad: ReturnType<typeof useLoad>["getLoad"];
  setLoad: ReturnType<typeof useLoad>["setLoad"];
}) => {
  const { lang } = useI18n();
  return (
    <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated overflow-hidden">
      <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-border/50">
        <img
          src={skill.image}
          alt={skill.name[lang]}
          className="h-12 w-12 rounded-xl object-cover border border-border flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-[10px] tracking-widest uppercase text-primary">{skill.difficulty}</p>
          <h3 className="font-display text-lg font-bold truncate">{skill.name[lang]}</h3>
        </div>
      </div>

      <ul className="divide-y divide-border/40">
        {items.map((it) => (
          <ExerciseRow
            key={`${skill.id}-${it.groupId}-${it.index}`}
            skillId={skill.id}
            item={it}
            entry={getLoad(skill.id, it.groupId, it.index)}
            onChange={(patch) => {
              const current = getLoad(skill.id, it.groupId, it.index);
              setLoad(skill.id, it.groupId, it.index, { ...current, ...patch });
            }}
          />
        ))}
      </ul>
    </div>
  );
};

const ExerciseRow = ({
  item,
  entry,
  onChange,
}: {
  skillId: string;
  item: PlanItem;
  entry: LoadEntry;
  onChange: (patch: Partial<LoadEntry>) => void;
}) => {
  const setNum = (key: "sets" | "seconds" | "reps" | "rest") => (v: string) => {
    if (v === "") return onChange({ [key]: undefined } as any);
    const n = Number(v);
    if (Number.isFinite(n)) onChange({ [key]: n } as any);
  };

  return (
    <li className="p-4 sm:p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex-shrink-0 mt-0.5">
          {item.groupLabel}
        </span>
        <p className="font-semibold text-sm flex-1 min-w-0 break-words">{item.name}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <Field label="Serie" value={entry.sets} onChange={setNum("sets")} />
        <Field label="Sec" value={entry.seconds} onChange={setNum("seconds")} />
        <Field label="Rip" value={entry.reps} onChange={setNum("reps")} />
        <Field label="Recupero (s)" value={entry.rest} onChange={setNum("rest")} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SetCounter total={entry.sets ?? 4} />
        <CountdownTimer initialSeconds={entry.rest ?? entry.seconds ?? 60} compact />
      </div>
    </li>
  );
};

const Field = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: string) => void;
}) => (
  <label className="block min-w-0">
    <span className="text-[10px] tracking-widest uppercase text-muted-foreground">{label}</span>
    <Input
      type="number"
      inputMode="numeric"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 bg-background h-9"
      placeholder="0"
    />
  </label>
);

export default WorkoutPlan;
