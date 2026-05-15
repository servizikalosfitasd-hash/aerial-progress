import { Calendar } from "lucide-react";
import { getCurrentPhase } from "@/lib/periodization";

export const PhaseBadge = ({ compact = false }: { compact?: boolean }) => {
  const info = getCurrentPhase();
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 ${
        compact ? "px-2.5 py-1" : "px-3 py-1.5"
      }`}
    >
      <Calendar className={`text-primary ${compact ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
      <span
        className={`font-semibold tracking-wider uppercase text-primary ${
          compact ? "text-[10px]" : "text-xs"
        }`}
      >
        Settimana {info.week} · {info.label}
      </span>
    </div>
  );
};

export const PhaseSuggestedHint = () => {
  const { suggested } = getCurrentPhase();
  return (
    <p className="text-[11px] text-muted-foreground tracking-wide">
      Suggerito: {suggested.sets}×{suggested.reps} · recupero {suggested.rest}s
      {suggested.note ? ` · ${suggested.note}` : ""}
    </p>
  );
};
