import { useState } from "react";
import { Layers, RotateCcw } from "lucide-react";

interface Props {
  total?: number;
  className?: string;
}

/** Tap to advance the set counter. Long-press (or double-click) to reset. */
export const SetCounter = ({ total = 4, className = "" }: Props) => {
  const [current, setCurrent] = useState(0);

  const advance = () => setCurrent((c) => (c >= total ? 0 : c + 1));
  const reset = () => setCurrent(0);

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={advance}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
          current >= total
            ? "bg-primary text-primary-foreground border-primary shadow-glow"
            : current > 0
            ? "bg-primary/15 text-primary border-primary/40"
            : "bg-secondary/60 text-foreground border-border hover:border-primary/40"
        }`}
      >
        <Layers className="h-3.5 w-3.5" />
        Set {current} / {total}
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
