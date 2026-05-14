import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus, Trash2, Play, Pause, RotateCcw, Save, Dumbbell, Timer, ChevronRight,
} from "lucide-react";
import { HamburgerButton } from "@/components/HamburgerButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { useSyncedState } from "@/hooks/useSyncedState";
import { toast } from "sonner";

type CircuitType = "HIIT" | "EMOM" | "AMRAP" | "TABATA" | "LEGS" | "ABS";

interface CircuitExercise {
  id: string;
  name: string;
  reps?: number;
  seconds?: number;
  rest?: number;
}

interface Circuit {
  id: string;
  type: CircuitType;
  name: string;
  rounds?: number;
  /** Tabata work seconds */
  workSec?: number;
  /** Tabata rest seconds */
  restSec?: number;
  /** Tabata cycles */
  cycles?: number;
  /** AMRAP/EMOM total minutes */
  totalMinutes?: number;
  exercises: CircuitExercise[];
}

const STORAGE_KEY = "kalos-circuits-v1";
const uid = () => Math.random().toString(36).slice(2, 10);

const DEFAULTS: Record<CircuitType, Partial<Circuit>> = {
  HIIT: { rounds: 4 },
  EMOM: { totalMinutes: 10 },
  AMRAP: { totalMinutes: 12 },
  TABATA: { workSec: 20, restSec: 10, cycles: 8 },
  LEGS: { rounds: 3 },
  ABS: { rounds: 3 },
};

const Circuits = () => {
  const { t } = useI18n();
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCircuits(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
    } catch { /* ignore */ }
  }, [circuits]);

  const addCircuit = (type: CircuitType) => {
    const c: Circuit = {
      id: uid(),
      type,
      name: type,
      exercises: [],
      ...DEFAULTS[type],
    };
    setCircuits((p) => [c, ...p]);
    setActiveId(c.id);
  };

  const updateCircuit = (id: string, patch: Partial<Circuit>) =>
    setCircuits((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const removeCircuit = (id: string) => {
    setCircuits((p) => p.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
    toast(t.circuits.removed);
  };

  const active = circuits.find((c) => c.id === activeId) ?? null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <HamburgerButton />
          <LanguageSwitcher />
        </div>
      </header>

      <section className="bg-gradient-hero">
        <div className="container max-w-6xl mx-auto px-6 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Dumbbell className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-primary">
              {t.circuits.eyebrow}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[0.95] mb-4">
            {t.circuits.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            {t.circuits.subtitle}
          </p>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-6 py-8">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary mb-3">
          {t.circuits.newCircuit}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {(["HIIT", "EMOM", "AMRAP", "TABATA", "LEGS", "ABS"] as CircuitType[]).map((type) => (
            <Button key={type} variant="outline" size="sm" onClick={() => addCircuit(type)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              {t.circuits.types[type]}
            </Button>
          ))}
        </div>

        {circuits.length === 0 && (
          <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated p-10 text-center">
            <Dumbbell className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-base font-semibold mb-1">{t.circuits.empty}</p>
            <p className="text-sm text-muted-foreground">{t.circuits.emptyHint}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {circuits.length > 0 && (
            <div className="space-y-2">
              {circuits.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition ${
                    activeId === c.id
                      ? "bg-primary/10 border-primary"
                      : "bg-gradient-card border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-primary">
                        {t.circuits.types[c.type]}
                      </p>
                      <p className="font-display font-bold truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c.exercises.length} {t.circuits.exercises}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {active && (
            <CircuitEditor
              circuit={active}
              onUpdate={(patch) => updateCircuit(active.id, patch)}
              onRemove={() => removeCircuit(active.id)}
            />
          )}
        </div>
      </section>
    </div>
  );
};

const CircuitEditor = ({
  circuit,
  onUpdate,
  onRemove,
}: {
  circuit: Circuit;
  onUpdate: (patch: Partial<Circuit>) => void;
  onRemove: () => void;
}) => {
  const { t } = useI18n();

  const addExercise = () =>
    onUpdate({
      exercises: [...circuit.exercises, { id: uid(), name: "", reps: undefined, seconds: undefined, rest: 30 }],
    });

  const updateExercise = (id: string, patch: Partial<CircuitExercise>) =>
    onUpdate({ exercises: circuit.exercises.map((e) => (e.id === id ? { ...e, ...patch } : e)) });

  const removeExercise = (id: string) =>
    onUpdate({ exercises: circuit.exercises.filter((e) => e.id !== id) });

  return (
    <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated p-5 sm:p-7 space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">
            {t.circuits.types[circuit.type]}
          </p>
          <Input
            value={circuit.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder={t.circuits.namePlaceholder}
            className="font-display text-2xl font-bold border-0 bg-transparent px-0 h-auto focus-visible:ring-0"
          />
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive gap-1.5">
          <Trash2 className="h-3.5 w-3.5" />
          {t.circuits.delete}
        </Button>
      </div>

      {/* Type-specific config */}
      <CircuitConfig circuit={circuit} onUpdate={onUpdate} />

      {/* Integrated timer */}
      <CircuitTimer circuit={circuit} />

      {/* Exercises */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-primary">
            {t.circuits.exercises}
          </p>
          <Button size="sm" variant="outline" onClick={addExercise} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            {t.circuits.addExercise}
          </Button>
        </div>

        {circuit.exercises.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">{t.circuits.noExercises}</p>
        ) : (
          <ul className="space-y-2">
            {circuit.exercises.map((ex, i) => (
              <li key={ex.id} className="rounded-2xl bg-secondary/40 border border-border p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-7 w-7 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <Input
                    value={ex.name}
                    onChange={(e) => updateExercise(ex.id, { name: e.target.value })}
                    placeholder={t.circuits.exerciseName}
                    className="bg-background"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeExercise(ex.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 ml-9">
                  <NumField
                    label={t.circuits.reps}
                    value={ex.reps}
                    onChange={(v) => updateExercise(ex.id, { reps: v })}
                  />
                  <NumField
                    label={t.circuits.seconds}
                    value={ex.seconds}
                    onChange={(v) => updateExercise(ex.id, { seconds: v })}
                  />
                  <NumField
                    label={t.circuits.rest}
                    value={ex.rest}
                    onChange={(v) => updateExercise(ex.id, { rest: v })}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const NumField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) => (
  <label className="block">
    <span className="text-[10px] tracking-widest uppercase text-muted-foreground">{label}</span>
    <Input
      type="number"
      inputMode="numeric"
      value={value ?? ""}
      onChange={(e) => {
        const n = e.target.value === "" ? undefined : Number(e.target.value);
        onChange(Number.isFinite(n as number) ? (n as number) : undefined);
      }}
      className="mt-1 bg-background h-9"
    />
  </label>
);

const CircuitConfig = ({
  circuit,
  onUpdate,
}: {
  circuit: Circuit;
  onUpdate: (patch: Partial<Circuit>) => void;
}) => {
  const { t } = useI18n();

  if (circuit.type === "TABATA") {
    return (
      <div className="grid grid-cols-3 gap-3">
        <NumField label={t.circuits.workSec} value={circuit.workSec} onChange={(v) => onUpdate({ workSec: v })} />
        <NumField label={t.circuits.restSec} value={circuit.restSec} onChange={(v) => onUpdate({ restSec: v })} />
        <NumField label={t.circuits.cycles} value={circuit.cycles} onChange={(v) => onUpdate({ cycles: v })} />
      </div>
    );
  }

  if (circuit.type === "EMOM" || circuit.type === "AMRAP") {
    return (
      <div className="grid grid-cols-2 gap-3 max-w-xs">
        <NumField
          label={t.circuits.totalMinutes}
          value={circuit.totalMinutes}
          onChange={(v) => onUpdate({ totalMinutes: v })}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 max-w-xs">
      <NumField label={t.circuits.rounds} value={circuit.rounds} onChange={(v) => onUpdate({ rounds: v })} />
    </div>
  );
};

/** Integrated timer. Tabata mode auto-cycles work/rest. Other modes count up. */
const CircuitTimer = ({ circuit }: { circuit: Circuit }) => {
  const { t } = useI18n();
  const isTabata = circuit.type === "TABATA";
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // ms
  const baseRef = useRef(0);
  const startRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    const tick = () => {
      setElapsed(baseRef.current + (performance.now() - startRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const handleToggle = () => {
    if (running) {
      baseRef.current = elapsed;
      setRunning(false);
    } else {
      setRunning(true);
    }
  };
  const handleReset = () => {
    setRunning(false);
    baseRef.current = 0;
    setElapsed(0);
  };

  // Tabata phase calculation
  const tabataPhase = useMemo(() => {
    if (!isTabata) return null;
    const work = circuit.workSec ?? 20;
    const rest = circuit.restSec ?? 10;
    const cycles = circuit.cycles ?? 8;
    const total = (work + rest) * cycles;
    const sec = Math.floor(elapsed / 1000);
    if (sec >= total) {
      return { phase: "done" as const, remaining: 0, cycle: cycles, total };
    }
    const cycleLen = work + rest;
    const cycle = Math.floor(sec / cycleLen) + 1;
    const inCycle = sec % cycleLen;
    const phase: "work" | "rest" = inCycle < work ? "work" : "rest";
    const remaining = phase === "work" ? work - inCycle : cycleLen - inCycle;
    return { phase, remaining, cycle, total };
  }, [isTabata, elapsed, circuit.workSec, circuit.restSec, circuit.cycles]);

  // Auto-stop tabata at end
  useEffect(() => {
    if (tabataPhase?.phase === "done" && running) {
      setRunning(false);
      baseRef.current = elapsed;
      toast.success(t.circuits.tabataDone);
    }
  }, [tabataPhase, running, elapsed, t.circuits.tabataDone]);

  const totalSec = Math.floor(elapsed / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  return (
    <div className="rounded-2xl bg-background/60 border border-border/60 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="h-4 w-4 text-primary" />
        <p className="text-[10px] font-bold tracking-widest uppercase text-primary">
          {t.circuits.timer}
        </p>
      </div>

      {isTabata && tabataPhase && (
        <div className="mb-3 flex items-center gap-3 flex-wrap">
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${
              tabataPhase.phase === "work"
                ? "bg-primary text-primary-foreground border-primary"
                : tabataPhase.phase === "rest"
                ? "bg-secondary text-foreground border-border"
                : "bg-success text-success-foreground border-success"
            }`}
          >
            {tabataPhase.phase === "work"
              ? t.circuits.work
              : tabataPhase.phase === "rest"
              ? t.circuits.rest
              : t.circuits.done}
          </span>
          <span className="text-xs text-muted-foreground">
            {t.circuits.cycle} {tabataPhase.cycle}/{circuit.cycles ?? 8}
          </span>
          {tabataPhase.phase !== "done" && (
            <span className="text-xs font-bold text-foreground">
              {tabataPhase.remaining}s
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-center py-4">
        <span className="font-display text-5xl font-bold tabular-nums tracking-tight">
          {mm}:{ss}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={handleToggle} className="flex-1 gap-2" size="lg">
          {running ? <><Pause className="h-4 w-4" />{t.detail.pause}</> : <><Play className="h-4 w-4" />{t.detail.start}</>}
        </Button>
        <Button variant="outline" size="lg" onClick={handleReset} disabled={elapsed === 0 && !running} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          {t.detail.resetTimer}
        </Button>
      </div>
    </div>
  );
};

export default Circuits;
