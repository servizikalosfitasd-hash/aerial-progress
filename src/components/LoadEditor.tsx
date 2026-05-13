import { useState } from "react";
import { Dumbbell, X, Clock, Repeat, Layers, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BAND_COLORS, type BandColor, type LoadEntry, type LoadType } from "@/hooks/useLoad";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  value: LoadEntry;
  onChange: (entry: LoadEntry) => void;
  hint?: string;
}

export const LoadEditor = ({ value, onChange, hint }: Props) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [draftType, setDraftType] = useState<LoadType>(value.type);
  const [draftKg, setDraftKg] = useState<string>(value.kg != null ? String(value.kg) : "");
  const [draftBand, setDraftBand] = useState<BandColor | undefined>(value.band);
  const [draftSeconds, setDraftSeconds] = useState<string>(
    value.seconds != null ? String(value.seconds) : "",
  );
  const [draftSets, setDraftSets] = useState<string>(value.sets != null ? String(value.sets) : "");
  const [draftReps, setDraftReps] = useState<string>(value.reps != null ? String(value.reps) : "");

  const hasAnyMetric =
    value.seconds != null || value.sets != null || value.reps != null;
  const hasLoad =
    (value.type === "weight" && value.kg != null) ||
    (value.type === "band" && value.band);

  const loadSummary = (() => {
    if (value.type === "weight" && value.kg != null) {
      return `${value.kg > 0 ? "+" : ""}${value.kg} kg`;
    }
    if (value.type === "band" && value.band) {
      return t.load.bands[value.band];
    }
    return null;
  })();

  const summaryColor = value.type === "band" && value.band
    ? BAND_COLORS.find((b) => b.id === value.band)?.hex
    : undefined;

  const handleOpen = () => {
    setDraftType(value.type);
    setDraftKg(value.kg != null ? String(value.kg) : "");
    setDraftBand(value.band);
    setDraftSeconds(value.seconds != null ? String(value.seconds) : "");
    setDraftSets(value.sets != null ? String(value.sets) : "");
    setDraftReps(value.reps != null ? String(value.reps) : "");
    setOpen(true);
  };

  const parseNum = (s: string): number | undefined => {
    if (!s.trim()) return undefined;
    const n = parseFloat(s.replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  };

  const parseInt10 = (s: string): number | undefined => {
    if (!s.trim()) return undefined;
    const n = parseInt(s, 10);
    return Number.isFinite(n) ? n : undefined;
  };

  const handleSave = () => {
    const seconds = parseNum(draftSeconds);
    const sets = parseInt10(draftSets);
    const reps = parseInt10(draftReps);

    const base: LoadEntry = {
      type: draftType,
      ...(seconds != null ? { seconds } : {}),
      ...(sets != null ? { sets } : {}),
      ...(reps != null ? { reps } : {}),
    };

    if (draftType === "weight") {
      const kg = parseNum(draftKg);
      onChange({ ...base, kg: kg ?? 0 });
    } else if (draftType === "band" && draftBand) {
      onChange({ ...base, band: draftBand });
    } else {
      onChange({ ...base, type: "none" });
    }
    setOpen(false);
  };

  if (!open) {
    const isEmpty = !hasAnyMetric && !hasLoad;
    return (
      <div>
        {isEmpty && hint && (
          <p className="text-[11px] text-muted-foreground mb-1.5">{hint}</p>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="inline-flex flex-wrap items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-[11px] font-semibold hover:border-primary/50 transition"
        >
          {value.seconds != null && (
            <span className="inline-flex items-center gap-1 text-foreground">
              <Clock className="h-3 w-3 text-primary" />
              {value.seconds}s
            </span>
          )}
          {value.sets != null && (
            <span className="inline-flex items-center gap-1 text-foreground">
              <Layers className="h-3 w-3 text-primary" />
              {value.sets}
            </span>
          )}
          {value.reps != null && (
            <span className="inline-flex items-center gap-1 text-foreground">
              <Repeat className="h-3 w-3 text-primary" />
              {value.reps}
            </span>
          )}
          {hasLoad && (
            <span className="inline-flex items-center gap-1">
              {summaryColor && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: summaryColor }}
                />
              )}
              <Dumbbell className="h-3 w-3 text-muted-foreground" />
              <span className="text-foreground">{loadSummary}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <ClipboardList className="h-3 w-3" />
            <span>{t.load.addMax}</span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="mt-3 rounded-2xl bg-background/80 border border-border p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-widest uppercase text-muted-foreground">
          {t.load.title}
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground"
          aria-label={t.load.cancel}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Performance metrics */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
          {t.load.performance}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <MetricField
            icon={<Clock className="h-3 w-3" />}
            label={t.records.seconds}
            value={draftSeconds}
            onChange={setDraftSeconds}
            placeholder="0"
            decimal
          />
          <MetricField
            icon={<Layers className="h-3 w-3" />}
            label={t.load.sets}
            value={draftSets}
            onChange={setDraftSets}
            placeholder="0"
          />
          <MetricField
            icon={<Repeat className="h-3 w-3" />}
            label={t.records.reps}
            value={draftReps}
            onChange={setDraftReps}
            placeholder="0"
          />
        </div>
      </div>

      {/* Load type */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
          {t.load.loadType}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(["none", "weight", "band"] as LoadType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setDraftType(type)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                draftType === type
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/40 text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {type === "none" ? t.load.none : type === "weight" ? t.load.weight : t.load.band}
            </button>
          ))}
        </div>
      </div>

      {draftType === "weight" && (
        <Input
          type="number"
          inputMode="decimal"
          step="0.5"
          value={draftKg}
          onChange={(e) => setDraftKg(e.target.value)}
          placeholder={t.load.kgPlaceholder}
          className="bg-background/60"
        />
      )}

      {draftType === "band" && (
        <div>
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
            {t.load.selectBand}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {BAND_COLORS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setDraftBand(b.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  draftBand === b.id
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-secondary/40 border-border hover:border-primary/40"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full border border-border/60"
                  style={{ backgroundColor: b.hex }}
                />
                <span className="truncate">{t.load.bands[b.id]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1" size="sm">
          {t.load.save}
        </Button>
        <Button onClick={() => setOpen(false)} variant="outline" size="sm">
          {t.load.cancel}
        </Button>
      </div>
    </div>
  );
};

const MetricField = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  decimal,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  decimal?: boolean;
}) => (
  <div>
    <label className="flex items-center gap-1 text-[10px] tracking-widest uppercase text-muted-foreground mb-1">
      <span className="text-primary">{icon}</span>
      {label}
    </label>
    <Input
      type="number"
      inputMode={decimal ? "decimal" : "numeric"}
      step={decimal ? "0.1" : "1"}
      min="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-background/60 h-9"
    />
  </div>
);
