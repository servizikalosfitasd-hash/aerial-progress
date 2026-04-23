import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Trophy } from "lucide-react";
import { skills, type Skill } from "@/data/skills";
import { useMaxes, type MaxEntry } from "@/hooks/useMaxes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";

const Records = () => {
  const { lang, t } = useI18n();
  const { maxes, setMax, getMax } = useMaxes();

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "it" ? "it-IT" : lang === "es" ? "es-ES" : "en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const setCount = useMemo(() => Object.keys(maxes).length, [maxes]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.detail.back}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container max-w-5xl mx-auto px-6 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-primary">
              {t.records.eyebrow}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[0.95] mb-4">
            {t.records.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">{t.records.subtitle}</p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border">
            <span className="text-sm font-semibold text-primary">{setCount}</span>
            <span className="text-xs text-muted-foreground">/ {skills.length}</span>
          </div>
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-6 py-10 space-y-4">
        {skills.map((skill) => (
          <RecordRow
            key={skill.id}
            skill={skill}
            entry={getMax(skill.id)}
            onSave={(e) => {
              setMax(skill.id, e);
              toast.success(t.toast.maxSaved, { description: skill.name[lang] });
            }}
            onClear={() => {
              setMax(skill.id, null);
              toast(t.toast.maxCleared, { description: skill.name[lang] });
            }}
            fmt={fmt}
          />
        ))}
      </section>
    </div>
  );
};

const RecordRow = ({
  skill,
  entry,
  onSave,
  onClear,
  fmt,
}: {
  skill: Skill;
  entry: MaxEntry | undefined;
  onSave: (e: Partial<MaxEntry>) => void;
  onClear: () => void;
  fmt: (iso: string) => string;
}) => {
  const { lang, t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [seconds, setSeconds] = useState<string>(entry?.seconds != null ? String(entry.seconds) : "");
  const [reps, setReps] = useState<string>(entry?.reps != null ? String(entry.reps) : "");
  const [kg, setKg] = useState<string>(entry?.kg != null ? String(entry.kg) : "");
  const [note, setNote] = useState<string>(entry?.note ?? "");

  const start = () => {
    setSeconds(entry?.seconds != null ? String(entry.seconds) : "");
    setReps(entry?.reps != null ? String(entry.reps) : "");
    setKg(entry?.kg != null ? String(entry.kg) : "");
    setNote(entry?.note ?? "");
    setEditing(true);
  };

  const handleSave = () => {
    onSave({
      seconds: seconds ? parseFloat(seconds.replace(",", ".")) : undefined,
      reps: reps ? parseInt(reps, 10) : undefined,
      kg: kg ? parseFloat(kg.replace(",", ".")) : undefined,
      note: note.trim() || undefined,
    });
    setEditing(false);
  };

  return (
    <div className="rounded-2xl bg-gradient-card border border-border shadow-elevated overflow-hidden">
      <div className="flex items-center gap-4 p-4 sm:p-5">
        <img
          src={skill.image}
          alt={skill.name[lang]}
          className="h-14 w-14 rounded-xl object-cover border border-border flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground">
            {skill.category[lang]}
          </p>
          <h3 className="font-display text-lg font-bold truncate">{skill.name[lang]}</h3>
          {entry ? (
            <div className="flex items-center gap-2 flex-wrap mt-1.5">
              {entry.seconds != null && (
                <Pill label={`${entry.seconds}s`} sublabel={t.records.seconds} />
              )}
              {entry.reps != null && (
                <Pill label={`${entry.reps}`} sublabel={t.records.reps} />
              )}
              {entry.kg != null && (
                <Pill label={`${entry.kg > 0 ? "+" : ""}${entry.kg} kg`} sublabel={t.records.kg} />
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">{t.records.empty}</p>
          )}
        </div>
        <Button size="sm" variant={entry ? "outline" : "default"} onClick={start}>
          {entry ? t.records.edit : t.records.save}
        </Button>
      </div>

      {entry?.note && !editing && (
        <p className="px-5 pb-3 text-sm text-muted-foreground italic">"{entry.note}"</p>
      )}
      {entry && !editing && (
        <p className="px-5 pb-4 text-[10px] tracking-widest uppercase text-muted-foreground">
          {t.records.updatedAt} {fmt(entry.updatedAt)}
        </p>
      )}

      {editing && (
        <div className="px-4 sm:px-5 pb-5 space-y-3 border-t border-border/60 pt-4">
          <div className="grid grid-cols-3 gap-2">
            <Field label={t.records.seconds} value={seconds} onChange={setSeconds} placeholder="0" />
            <Field label={t.records.reps} value={reps} onChange={setReps} placeholder="0" />
            <Field label={t.records.kg} value={kg} onChange={setKg} placeholder="0" />
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase text-muted-foreground">
              {t.records.note}
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.records.notePlaceholder}
              className="mt-1 min-h-[70px] bg-background/60"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1 gap-2">
              <Save className="h-3.5 w-3.5" />
              {t.records.save}
            </Button>
            {entry && (
              <Button
                onClick={() => {
                  onClear();
                  setEditing(false);
                }}
                size="sm"
                variant="ghost"
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t.records.clear}
              </Button>
            )}
            <Button onClick={() => setEditing(false)} size="sm" variant="outline">
              {t.load.cancel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const Pill = ({ label, sublabel }: { label: string; sublabel: string }) => (
  <span className="inline-flex items-baseline gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30">
    <span className="text-sm font-bold text-primary">{label}</span>
    <span className="text-[9px] tracking-widest uppercase text-muted-foreground">{sublabel}</span>
  </span>
);

const Field = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => (
  <div>
    <label className="text-[10px] tracking-widest uppercase text-muted-foreground">{label}</label>
    <Input
      type="number"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 bg-background/60"
    />
  </div>
);

export default Records;
