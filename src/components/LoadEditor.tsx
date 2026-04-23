import { useState } from "react";
import { Dumbbell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BAND_COLORS, type BandColor, type LoadEntry, type LoadType } from "@/hooks/useLoad";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  value: LoadEntry;
  onChange: (entry: LoadEntry) => void;
}

export const LoadEditor = ({ value, onChange }: Props) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [draftType, setDraftType] = useState<LoadType>(value.type);
  const [draftKg, setDraftKg] = useState<string>(value.kg != null ? String(value.kg) : "");
  const [draftBand, setDraftBand] = useState<BandColor | undefined>(value.band);

  const summary = (() => {
    if (value.type === "weight" && value.kg != null) {
      return `${value.kg > 0 ? "+" : ""}${value.kg} kg`;
    }
    if (value.type === "band" && value.band) {
      return t.load.bands[value.band];
    }
    return t.load.none;
  })();

  const summaryColor = value.type === "band" && value.band
    ? BAND_COLORS.find((b) => b.id === value.band)?.hex
    : undefined;

  const handleOpen = () => {
    setDraftType(value.type);
    setDraftKg(value.kg != null ? String(value.kg) : "");
    setDraftBand(value.band);
    setOpen(true);
  };

  const handleSave = () => {
    if (draftType === "weight") {
      const num = parseFloat(draftKg.replace(",", "."));
      onChange({ type: "weight", kg: Number.isFinite(num) ? num : 0 });
    } else if (draftType === "band" && draftBand) {
      onChange({ type: "band", band: draftBand });
    } else {
      onChange({ type: "none" });
    }
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleOpen();
        }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-[11px] font-semibold hover:border-primary/50 transition"
      >
        {summaryColor && (
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: summaryColor }}
          />
        )}
        <Dumbbell className="h-3 w-3 text-muted-foreground" />
        <span className={value.type === "none" ? "text-muted-foreground" : "text-foreground"}>
          {summary}
        </span>
      </button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="mt-3 rounded-2xl bg-background/80 border border-border p-4 space-y-3"
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
