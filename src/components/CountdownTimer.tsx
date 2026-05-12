import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  initialSeconds?: number;
  compact?: boolean;
  label?: string;
  onTargetChange?: (n: number) => void;
}

const beep = () => {
  try {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    o.start();
    o.stop(ctx.currentTime + 0.6);
    setTimeout(() => ctx.close(), 800);
  } catch {}
};

export const CountdownTimer = ({ initialSeconds = 60, compact, label, onTargetChange }: Props) => {
  const [target, setTarget] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intRef = useRef<number>();

  // Sync with external initialSeconds when not running
  useEffect(() => {
    if (running) return;
    setTarget(initialSeconds);
    setRemaining(initialSeconds);
  }, [initialSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!running) return;
    intRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          beep();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intRef.current) window.clearInterval(intRef.current);
    };
  }, [running]);

  const start = () => {
    if (remaining === 0) setRemaining(target);
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setRemaining(target);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5">
        {label && (
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary/80">
            {label}
          </span>
        )}
        {running || remaining !== target ? (
          <span className="font-mono text-sm tabular-nums font-bold text-primary min-w-[44px] text-center">
            {mm}:{ss}
          </span>
        ) : (
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={target}
            onChange={(e) => {
              const v = Math.max(0, Number(e.target.value) || 0);
              setTarget(v);
              setRemaining(v);
              onTargetChange?.(v);
            }}
            aria-label="Secondi"
            className="w-14 h-7 bg-background border border-primary/40 rounded-md text-center font-mono text-sm font-bold text-primary"
          />
        )}
        <button
          type="button"
          onClick={running ? pause : start}
          aria-label={running ? "Pausa" : "Avvia"}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset"
          className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-secondary/60 border border-border text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-background/60 border border-border/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="h-4 w-4 text-primary" />
        <p className="text-[10px] font-bold tracking-widest uppercase text-primary">
          {label ?? "Countdown"}
        </p>
      </div>
      <div className="flex items-center justify-center py-2">
        <span className="font-display text-4xl font-bold tabular-nums tracking-tight">
          {mm}:{ss}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Input
          type="number"
          inputMode="numeric"
          value={target}
          onChange={(e) => {
            const v = Math.max(0, Number(e.target.value) || 0);
            setTarget(v);
            if (!running) setRemaining(v);
            onTargetChange?.(v);
          }}
          className="w-20 h-9"
          aria-label="Secondi"
        />
        <Button onClick={running ? pause : start} className="flex-1 gap-2" size="sm">
          {running ? <><Pause className="h-4 w-4" /> Pausa</> : <><Play className="h-4 w-4" /> Start</>}
        </Button>
        <Button variant="outline" size="sm" onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CountdownTimer;
