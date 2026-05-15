import { useEffect, useState } from "react";
import { Crown, Dumbbell, Zap, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserData } from "@/hooks/UserDataProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";

export type KalosMaxMode = "power-endurance" | "power-only";

interface Item {
  skillId: string;
  idx: number;
  label: string;
}

interface Props {
  items: Item[];
  mode: KalosMaxMode;
}

type Txt = {
  eyebrow: string;
  title: string;
  hint: string;
  power: string;
  powerHint: string;
  endurance: string;
  enduranceHint: string;
  kg: string;
  reps: string;
  save: string;
  clear: string;
  saved: string;
  cleared: string;
};

const TXT: Record<"it" | "en" | "es", Txt> = {
  it: {
    eyebrow: "KALOS GAMES",
    title: "Massimali ufficiali",
    hint: "Questi valori alimentano la classifica. Sono indipendenti dalle serie della tua scheda.",
    power: "Power · Zavorra",
    powerHint: "Carico massimo eseguito con sovraccarico.",
    endurance: "Endurance · Bodyweight",
    enduranceHint: "Ripetizioni massime a corpo libero.",
    kg: "KG",
    reps: "Reps",
    save: "Salva",
    clear: "Rimuovi",
    saved: "Massimale salvato",
    cleared: "Massimale rimosso",
  },
  en: {
    eyebrow: "KALOS GAMES",
    title: "Official maxes",
    hint: "These values feed the leaderboard. They're independent from your training sets.",
    power: "Power · Weighted",
    powerHint: "Maximum load lifted with added weight.",
    endurance: "Endurance · Bodyweight",
    enduranceHint: "Maximum reps without added weight.",
    kg: "KG",
    reps: "Reps",
    save: "Save",
    clear: "Remove",
    saved: "Max saved",
    cleared: "Max removed",
  },
  es: {
    eyebrow: "KALOS GAMES",
    title: "Máximos oficiales",
    hint: "Estos valores alimentan la clasificación. Son independientes de las series de tu plan.",
    power: "Power · Lastre",
    powerHint: "Carga máxima con peso añadido.",
    endurance: "Endurance · Peso corporal",
    enduranceHint: "Repeticiones máximas sin lastre.",
    kg: "KG",
    reps: "Reps",
    save: "Guardar",
    clear: "Quitar",
    saved: "Máximo guardado",
    cleared: "Máximo eliminado",
  },
};

const POWER_GROUP = "kalos_power";
const ENDURANCE_GROUP = "kalos_endurance";

export const KalosMaxEditor = ({ items, mode }: Props) => {
  const { lang } = useI18n();
  const txt = TXT[lang];

  return (
    <section className="container max-w-5xl mx-auto px-6 mt-12">
      <div className="rounded-3xl bg-card/60 border border-primary/30 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.45)] overflow-hidden">
        <div className="px-6 py-5 border-b border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-transparent flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">
              {txt.eyebrow}
            </p>
            <p className="font-display text-xl font-bold">{txt.title}</p>
          </div>
        </div>
        <p className="px-6 pt-4 text-xs text-muted-foreground">{txt.hint}</p>
        <div className="p-6 grid gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <div key={`${it.skillId}-${it.idx}`} className="space-y-3">
              <p className="text-xs font-bold tracking-wider uppercase text-foreground">
                {it.label}
              </p>
              <PowerCard skillId={it.skillId} idx={it.idx} txt={txt} />
              {mode === "power-endurance" && (
                <EnduranceCard skillId={it.skillId} idx={it.idx} txt={txt} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PowerCard = ({
  skillId,
  idx,
  txt,
}: {
  skillId: string;
  idx: number;
  txt: Txt;
}) => {
  const { workouts, upsertWorkout, deleteWorkout } = useUserData();
  const row = workouts.find(
    (w) =>
      w.skill_id === skillId &&
      w.group_id === POWER_GROUP &&
      w.progression_index === idx,
  );
  const [kg, setKg] = useState("");
  const [reps, setReps] = useState("");

  useEffect(() => {
    setKg(row?.load_kg != null ? String(row.load_kg) : "");
    setReps(row?.reps != null ? String(row.reps) : "");
  }, [row?.load_kg, row?.reps]);

  const save = () => {
    const kgN = parseFloat(kg.replace(",", "."));
    const repsN = parseInt(reps, 10);
    if (!Number.isFinite(kgN) || kgN <= 0) {
      toast.error(txt.kg + " ?");
      return;
    }
    upsertWorkout(
      { skill_id: skillId, group_id: POWER_GROUP, progression_index: idx },
      {
        exercise_name: `Kalos Power ${skillId} #${idx + 1}`,
        load_type: "weight",
        load_kg: kgN,
        reps: Number.isFinite(repsN) ? repsN : null,
      },
    );
    toast.success(txt.saved);
  };

  const clear = () => {
    deleteWorkout({ skill_id: skillId, group_id: POWER_GROUP, progression_index: idx });
    toast(txt.cleared);
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-4 space-y-3">
      <div className="flex items-center gap-2 text-primary">
        <Dumbbell className="h-4 w-4" />
        <p className="text-[11px] font-bold tracking-widest uppercase">{txt.power}</p>
      </div>
      <p className="text-[11px] text-muted-foreground">{txt.powerHint}</p>
      <div className="grid grid-cols-2 gap-2">
        <Field label={txt.kg} value={kg} onChange={setKg} decimal />
        <Field label={txt.reps} value={reps} onChange={setReps} />
      </div>
      <div className="flex gap-2">
        <Button onClick={save} size="sm" className="flex-1">
          <Save className="h-3.5 w-3.5 mr-1.5" />
          {txt.save}
        </Button>
        {row && (
          <Button onClick={clear} size="sm" variant="outline">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

const EnduranceCard = ({
  skillId,
  idx,
  txt,
}: {
  skillId: string;
  idx: number;
  txt: Txt;
}) => {
  const { workouts, upsertWorkout, deleteWorkout } = useUserData();
  const row = workouts.find(
    (w) =>
      w.skill_id === skillId &&
      w.group_id === ENDURANCE_GROUP &&
      w.progression_index === idx,
  );
  const [reps, setReps] = useState("");

  useEffect(() => {
    setReps(row?.reps != null ? String(row.reps) : "");
  }, [row?.reps]);

  const save = () => {
    const repsN = parseInt(reps, 10);
    if (!Number.isFinite(repsN) || repsN <= 0) {
      toast.error(txt.reps + " ?");
      return;
    }
    upsertWorkout(
      { skill_id: skillId, group_id: ENDURANCE_GROUP, progression_index: idx },
      {
        exercise_name: `Kalos Endurance ${skillId} #${idx + 1}`,
        load_type: "none",
        load_kg: null,
        reps: repsN,
      },
    );
    toast.success(txt.saved);
  };

  const clear = () => {
    deleteWorkout({ skill_id: skillId, group_id: ENDURANCE_GROUP, progression_index: idx });
    toast(txt.cleared);
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-4 space-y-3">
      <div className="flex items-center gap-2 text-primary">
        <Zap className="h-4 w-4" />
        <p className="text-[11px] font-bold tracking-widest uppercase">{txt.endurance}</p>
      </div>
      <p className="text-[11px] text-muted-foreground">{txt.enduranceHint}</p>
      <div className="grid grid-cols-2 gap-2">
        <Field label={txt.reps} value={reps} onChange={setReps} />
        <div />
      </div>
      <div className="flex gap-2">
        <Button onClick={save} size="sm" className="flex-1">
          <Save className="h-3.5 w-3.5 mr-1.5" />
          {txt.save}
        </Button>
        {row && (
          <Button onClick={clear} size="sm" variant="outline">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  decimal,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  decimal?: boolean;
}) => (
  <div>
    <label className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-1">
      {label}
    </label>
    <Input
      type="number"
      inputMode={decimal ? "decimal" : "numeric"}
      step={decimal ? "0.5" : "1"}
      min="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-background/60 h-9"
      placeholder="0"
    />
  </div>
);
