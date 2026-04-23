import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";

const formatTime = (ms: number) => {
  const totalCs = Math.floor(ms / 10);
  const minutes = Math.floor(totalCs / 6000);
  const seconds = Math.floor((totalCs % 6000) / 100);
  const cs = totalCs % 100;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
};

export const Stopwatch = () => {
  const { t } = useI18n();
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef<number>(0);
  const baseRef = useRef<number>(0);
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

  const isFresh = elapsed === 0 && !running;

  return (
    <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-12 w-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
          <Timer className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground">{t.detail.timerTitle}</p>
          <p className="text-sm text-muted-foreground">{t.detail.timerSubtitle}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-background/60 border border-border/60 py-8 flex items-center justify-center mb-5">
        <span
          className={`font-display text-5xl sm:text-6xl font-bold tabular-nums tracking-tight transition-colors ${
            running ? "text-primary" : "text-foreground"
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          {formatTime(elapsed)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleToggle} className="flex-1 gap-2" size="lg">
          {running ? (
            <>
              <Pause className="h-4 w-4" />
              {t.detail.pause}
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              {isFresh ? t.detail.start : t.detail.resume}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleReset}
          disabled={isFresh}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {t.detail.resetTimer}
        </Button>
      </div>
    </div>
  );
};
