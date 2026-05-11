import { useState } from "react";
import { Layers, RotateCcw, Check, Pencil } from "lucide-react";

interface Props {
  total?: number;
  className?: string;
  onTotalChange?: (n: number) => void;
}

/** Tap to advance the set counter. The total is editable inline. */
export const SetCounter = ({ total = 4, className = "", onTotalChange }: Props) => {
  const [current, setCurrent] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(total));
  const [localTotal, setLocalTotal] = useState(total);

  const effectiveTotal = onTotalChange ? total : localTotal;

  const advance = () => setCurrent((c) => (c >= effectiveTotal ? 0 : c + 1));
  const reset = () => setCurrent(0);

  const commit = () => {
    const n = Math.max(1, Math.min(99, Number(draft) || 1));
    if (onTotalChange) onTotalChange(n);
    else setLocalTotal(n);
    setEditing(false);
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {editing ? (
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/60 border border-primary/40">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-bold">Set {current} /</span>
          <input
            type="number"
            inputMode="numeric"
            value={draft}
            min={1}
            max={99}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-10 h-6 bg-background border border-border rounded text-xs text-center font-bold"
          />
          <button
            type="button"
            onClick={commit}
            aria-label="Conferma"
            className="h-6 w-6 inline-flex items-center justify-center rounded text-primary hover:bg-primary/15"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={advance}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
            current >= effectiveTotal && effectiveTotal > 0
              ? "bg-primary text-primary-foreground border-primary shadow-glow"
              : current > 0
              ? "bg-primary/15 text-primary border-primary/40"
              : "bg-secondary/60 text-foreground border-border hover:border-primary/40"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Set {current} / {effectiveTotal}
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          setDraft(String(effectiveTotal));
          setEditing((v) => !v);
        }}
        aria-label="Modifica totale set"
        className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-secondary/60 border border-border text-muted-foreground hover:text-primary hover:border-primary/40"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      {current > 0 && (
        <button
          type="button"
          onClick={reset}
          aria-label="Reset set"
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-secondary/60 border border-border text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default SetCounter;
