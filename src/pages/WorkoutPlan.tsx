import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, ClipboardList, Flag, RotateCcw } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { HamburgerButton } from "@/components/HamburgerButton";
import { PhaseBadge, PhaseSuggestedHint } from "@/components/PhaseBadge";
import { WorkoutHistoryDrawer } from "@/components/WorkoutHistoryDrawer";
import { skills, type Skill } from "@/data/skills";
import { useProgress } from "@/hooks/useProgress";
import { useLoad, BAND_COLORS, type LoadEntry, type BandColor } from "@/hooks/useLoad";
import { useSelectedExercises } from "@/hooks/useSelectedExercises";
import { useWorkoutSessions, type SessionEntry } from "@/hooks/useWorkoutSessions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SetCounter } from "@/components/SetCounter";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Stopwatch } from "@/components/Stopwatch";
import { useI18n } from "@/i18n/I18nProvider";
import { getCurrentPhase } from "@/lib/periodization";
import { toast } from "sonner";

interface PlanItem {
  groupId: string;
  groupLabel: string;
  index: number;
  name: string;
  hasTimer?: boolean;
}

const SELECTABLE_SKILLS = new Set(["legs", "push", "pull"]);

const SECTION_ORDER: { id: string; label: string }[] = [
  { id: "dynamic", label: "Dinamico" },
  { id: "iso", label: "Isometria" },
  { id: "power", label: "Potenziamento" },
  { id: "main", label: "Progressione" },
];

function buildSkillItems(
  skill: Skill,
  lang: "it" | "en" | "es",
  progress: Record<string, Record<string, number>>,
  selectedListBySkill: Record<string, ReturnType<ReturnType<typeof useSelectedExercises>["getSelectedList"]>>,
): PlanItem[] {
  const items: PlanItem[] = [];
  if (SELECTABLE_SKILLS.has(skill.id)) {
    for (const sel of selectedListBySkill[skill.id] ?? []) {
      const g = skill.groups.find((gg) => gg.id === sel.groupId);
      items.push({ ...sel, hasTimer: g?.hasTimer });
    }
  } else {
    const sp = progress[skill.id] ?? {};
    for (const g of skill.groups) {
      const idx = sp[g.id];
      if (typeof idx === "number" && idx >= 0) {
        items.push({
          groupId: g.id,
          groupLabel: g.label[lang],
          index: idx,
          name: g.progressions[idx],
          hasTimer: g.hasTimer,
        });
      }
    }
  }
  items.sort((a, b) => a.groupId.localeCompare(b.groupId) || a.index - b.index);
  return items;
}

const WorkoutPlan = () => {
  const { lang } = useI18n();
  const { progress } = useProgress();
  const { getLoad, setLoad } = useLoad();
  const legsSel = useSelectedExercises("legs");
  const pushSel = useSelectedExercises("push");
  const pullSel = useSelectedExercises("pull");
  const { saveSession, getPrevious, isDoneThisWeek, getLastSessionThisWeek } = useWorkoutSessions();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSkillId = searchParams.get("skill");

  const selectedListBySkill = useMemo(
    () => ({
      legs: legsSel.getSelectedList(skills.find((s) => s.id === "legs")!, lang),
      push: pushSel.getSelectedList(skills.find((s) => s.id === "push")!, lang),
      pull: pullSel.getSelectedList(skills.find((s) => s.id === "pull")!, lang),
    }),
    [legsSel, pushSel, pullSel, lang],
  );

  const grouped = useMemo(
    () =>
      skills
        .map((skill) => ({
          skill,
          items: buildSkillItems(skill, lang, progress, selectedListBySkill),
        }))
        .filter((s) => s.items.length > 0),
    [progress, lang, selectedListBySkill],
  );

  const phaseInfo = getCurrentPhase();
  const selected = selectedSkillId ? grouped.find((g) => g.skill.id === selectedSkillId) : null;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [selectedSkillId]);

  const openSkill = (id: string) => {
    setSearchParams({ skill: id });
  };
  const closeSkill = () => {
    searchParams.delete("skill");
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <HamburgerButton />
          <div className="flex items-center gap-2">
            <WorkoutHistoryDrawer />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {!selected ? (
        <SkillListView
          phaseInfo={phaseInfo}
          grouped={grouped}
          isDoneThisWeek={isDoneThisWeek}
          getLastSessionThisWeek={getLastSessionThisWeek}
          onOpen={openSkill}
        />
      ) : (
        <SkillSessionDetail
          skill={selected.skill}
          items={selected.items}
          getLoad={getLoad}
          setLoad={setLoad}
          getPrevious={getPrevious}
          saveSession={saveSession}
          phaseInfo={phaseInfo}
          isDoneThisWeek={isDoneThisWeek}
          getLastSessionThisWeek={getLastSessionThisWeek}
          onBack={closeSkill}
        />
      )}
          skill={selected.skill}
          items={selected.items}
          getLoad={getLoad}
          setLoad={setLoad}
          getPrevious={getPrevious}
          saveSession={saveSession}
          phaseInfo={phaseInfo}
          isDoneThisWeek={isDoneThisWeek}
          onBack={closeSkill}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────── Level 1: list ───────────────────────────────────────────

const SkillListView = ({
  phaseInfo,
  grouped,
  isDoneThisWeek,
  onOpen,
}: {
  phaseInfo: ReturnType<typeof getCurrentPhase>;
  grouped: { skill: Skill; items: PlanItem[] }[];
  isDoneThisWeek: (skillId: string, year: number, week: number) => boolean;
  onOpen: (id: string) => void;
}) => {
  const { lang } = useI18n();
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <ClipboardList className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-primary">
              Allenamento 2026
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-[0.95] mb-4">
            Scheda Allenamento
          </h1>
          <div className="flex flex-col gap-2">
            <PhaseBadge />
            <PhaseSuggestedHint />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mt-4">
            Seleziona una skill per gestire la sessione di allenamento. I parametri suggeriti si
            adattano automaticamente alla fase del ciclo.
          </p>
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {grouped.length === 0 ? (
          <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated p-8 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-base font-semibold mb-1">Nessuna skill in scheda</p>
            <p className="text-sm text-muted-foreground">
              Apri una skill e seleziona la propedeutica corrente per aggiungerla qui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {grouped.map(({ skill, items }) => {
              const done = isDoneThisWeek(skill.id, phaseInfo.year, phaseInfo.week);
              return (
                <button
                  key={skill.id}
                  onClick={() => onOpen(skill.id)}
                  className={`group relative rounded-2xl overflow-hidden text-left bg-gradient-card border transition-all shadow-elevated ${
                    done
                      ? "border-primary/60 shadow-glow"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-black overflow-hidden">
                    <img
                      src={skill.image}
                      alt={skill.name[lang]}
                      className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition"
                    />
                    {done && (
                      <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground border border-primary flex items-center justify-center shadow-glow">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-primary font-semibold mb-1">
                      {skill.difficulty}
                    </p>
                    <h3 className="font-display font-bold text-sm leading-tight line-clamp-2">
                      {skill.name[lang]}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {items.length} esercizi · {done ? "Done questa settimana" : "Da completare"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

// ─────────────────────────────────────────── Level 2: detail ───────────────────────────────────────────

const SkillSessionDetail = ({
  skill,
  items,
  getLoad,
  setLoad,
  getPrevious,
  saveSession,
  phaseInfo,
  isDoneThisWeek,
  onBack,
}: {
  skill: Skill;
  items: PlanItem[];
  getLoad: ReturnType<typeof useLoad>["getLoad"];
  setLoad: ReturnType<typeof useLoad>["setLoad"];
  getPrevious: ReturnType<typeof useWorkoutSessions>["getPrevious"];
  saveSession: ReturnType<typeof useWorkoutSessions>["saveSession"];
  phaseInfo: ReturnType<typeof getCurrentPhase>;
  isDoneThisWeek: (skillId: string, year: number, week: number) => boolean;
  onBack: () => void;
}) => {
  const { lang } = useI18n();
  const previous = getPrevious(skill.id);
  const done = isDoneThisWeek(skill.id, phaseInfo.year, phaseInfo.week);

  const sections = useMemo(() => {
    const map = new Map<string, PlanItem[]>();
    for (const it of items) {
      if (!map.has(it.groupId)) map.set(it.groupId, []);
      map.get(it.groupId)!.push(it);
    }
    return SECTION_ORDER.flatMap((s) => {
      const list = map.get(s.id);
      if (!list || list.length === 0) return [];
      return [{ ...s, items: list }];
    });
  }, [items]);

  const handleFinish = async () => {
    const entries: SessionEntry[] = items.map((it) => {
      const load = getLoad(skill.id, it.groupId, it.index);
      return {
        groupId: it.groupId,
        groupLabel: it.groupLabel,
        index: it.index,
        name: it.name,
        sets: load.sets ?? null,
        reps: load.reps ?? null,
        seconds: load.seconds ?? null,
        recovery: load.rest ?? null,
        kg: load.kg ?? null,
        band: load.band ?? null,
      };
    });
    await saveSession({
      skill_id: skill.id,
      year: phaseInfo.year,
      iso_week: phaseInfo.week,
      phase: phaseInfo.phase,
      entries,
    });
    toast.success("Allenamento salvato", {
      description: `${skill.name[lang]} · Settimana ${phaseInfo.week}`,
    });
  };

  const handleReset = () => {
    for (const it of items) {
      setLoad(skill.id, it.groupId, it.index, null);
    }
    toast("Sessione resettata", {
      description: previous ? "Sotto ogni input vedi i valori della sessione precedente." : undefined,
    });
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden bg-black">
        <img src={skill.image} alt={skill.name[lang]} className="h-full w-full object-contain" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute top-4 left-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="gap-2 backdrop-blur bg-background/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Indietro
          </Button>
        </div>
        <div className="absolute bottom-0 inset-x-0">
          <div className="container max-w-5xl mx-auto px-6 pb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <PhaseBadge compact />
              {done && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase">
                  <Check className="h-3 w-3" strokeWidth={3} />
                  Done
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-[0.95]">
              {skill.name[lang]}
            </h1>
          </div>
        </div>
      </div>

      {/* Sections */}
      <section className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {items.some((i) => i.hasTimer) && <Stopwatch />}
        {sections.map((sec) => (
          <div key={sec.id}>
            <div className="mb-4">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-1">
                Sezione
              </p>
              <h2 className="font-display text-2xl font-bold">{sec.label}</h2>
            </div>
            <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated overflow-hidden">
              <ul className="divide-y divide-border/40">
                {sec.items.map((it) => (
                  <ExerciseRow
                    key={`${it.groupId}-${it.index}`}
                    item={it}
                    entry={getLoad(skill.id, it.groupId, it.index)}
                    previousEntries={previous?.entries}
                    suggested={phaseInfo.suggested}
                    onChange={(patch) => {
                      const current = getLoad(skill.id, it.groupId, it.index);
                      setLoad(skill.id, it.groupId, it.index, {
                        ...current,
                        ...patch,
                        type: patch.kg != null ? "weight" : patch.band ? "band" : current.type,
                      });
                    }}
                  />
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Actions */}
        <div className="sticky bottom-4 z-20 flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleFinish}
            className="flex-1 gap-2 h-12 text-base font-bold shadow-glow"
          >
            <Flag className="h-5 w-5" />
            Fine Allenamento
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="gap-2 h-12 sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Resetta Sessione
          </Button>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────── Exercise Row ───────────────────────────────────────────

const formatPrev = (
  prev: SessionEntry | undefined,
): string | null => {
  if (!prev) return null;
  const parts: string[] = [];
  if (prev.sets) parts.push(`${prev.sets}×`);
  if (prev.reps != null) parts.push(`${prev.reps} reps`);
  else if (prev.seconds != null) parts.push(`${prev.seconds}s`);
  if (prev.kg != null) parts.push(`${prev.kg}kg`);
  if (prev.band) parts.push(`elastico ${prev.band}`);
  return parts.length ? parts.join(" · ") : null;
};

const ExerciseRow = ({
  item,
  entry,
  previousEntries,
  suggested,
  onChange,
}: {
  item: PlanItem;
  entry: LoadEntry;
  previousEntries?: SessionEntry[];
  suggested: { sets: number; reps: number; rest: number };
  onChange: (patch: Partial<LoadEntry>) => void;
}) => {
  const prev = previousEntries?.find(
    (e) => e.groupId === item.groupId && e.index === item.index,
  );
  const prevText = formatPrev(prev);

  const setNum =
    (key: "sets" | "seconds" | "reps" | "rest" | "kg") => (v: string) => {
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

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <Field
          label="Serie"
          value={entry.sets}
          placeholder={String(suggested.sets)}
          onChange={setNum("sets")}
        />
        {item.hasTimer ? (
          <Field
            label="Sec"
            value={entry.seconds}
            placeholder="30"
            onChange={setNum("seconds")}
          />
        ) : (
          <Field
            label="Rip"
            value={entry.reps}
            placeholder={String(suggested.reps)}
            onChange={setNum("reps")}
          />
        )}
        <Field
          label="Recupero (s)"
          value={entry.rest}
          placeholder={String(suggested.rest)}
          onChange={setNum("rest")}
        />
        <Field
          label="Zavorra (kg)"
          value={entry.kg}
          placeholder="0"
          onChange={setNum("kg")}
          step="0.5"
        />
        <BandSelect
          value={entry.band}
          onChange={(b) =>
            onChange({ band: b ?? undefined, type: b ? "band" : entry.kg != null ? "weight" : "none" })
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <SetCounter
          total={entry.sets ?? suggested.sets}
          onTotalChange={(n) => onChange({ sets: n })}
        />
        {item.hasTimer && (
          <CountdownTimer
            key={`work-${entry.seconds ?? 30}`}
            initialSeconds={entry.seconds ?? 30}
            label="Lavoro"
            compact
            onTargetChange={(n) => onChange({ seconds: n })}
          />
        )}
        <CountdownTimer
          key={`rest-${entry.rest ?? suggested.rest}`}
          initialSeconds={entry.rest ?? suggested.rest}
          label="Recupero"
          compact
          onTargetChange={(n) => onChange({ rest: n })}
        />
      </div>

      {prevText && (
        <p className="mt-2 text-[11px] text-muted-foreground italic">
          Previous: {prevText}
        </p>
      )}
    </li>
  );
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  step,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  step?: string;
}) => (
  <label className="block min-w-0">
    <span className="text-[10px] tracking-widest uppercase text-muted-foreground">{label}</span>
    <Input
      type="number"
      inputMode="decimal"
      step={step}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 bg-background h-9"
      placeholder={placeholder ?? "0"}
    />
  </label>
);

const BandSelect = ({
  value,
  onChange,
}: {
  value: BandColor | undefined;
  onChange: (v: BandColor | null) => void;
}) => (
  <label className="block min-w-0">
    <span className="text-[10px] tracking-widest uppercase text-muted-foreground">Elastico</span>
    <Select
      value={value ?? "__none"}
      onValueChange={(v) => onChange(v === "__none" ? null : (v as BandColor))}
    >
      <SelectTrigger className="mt-1 h-9 bg-background">
        <SelectValue placeholder="Nessuno" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__none">Nessuno</SelectItem>
        {BAND_COLORS.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full border border-border"
                style={{ background: b.hex }}
              />
              {b.id}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </label>
);

export default WorkoutPlan;
