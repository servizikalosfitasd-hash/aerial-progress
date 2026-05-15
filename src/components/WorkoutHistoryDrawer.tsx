import { History as HistoryIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkoutSessions, type WorkoutSession } from "@/hooks/useWorkoutSessions";
import { getPhaseLabel, type Phase } from "@/lib/periodization";
import { getSkillById } from "@/data/skills";
import { useI18n } from "@/i18n/I18nProvider";
import { useMemo, useState } from "react";

const PHASES: Phase[] = ["strength", "hypertrophy", "endurance", "deload"];

const formatEntry = (e: WorkoutSession["entries"][number]) => {
  const parts: string[] = [];
  if (e.sets) parts.push(`${e.sets}×`);
  if (e.reps != null) parts.push(`${e.reps} reps`);
  else if (e.seconds != null) parts.push(`${e.seconds}s`);
  if (e.kg != null) parts.push(`${e.kg}kg`);
  if (e.band) parts.push(`elastico ${e.band}`);
  if (e.recovery != null) parts.push(`rec ${e.recovery}s`);
  return parts.join(" · ");
};

export const WorkoutHistoryDrawer = () => {
  const { lang } = useI18n();
  const { sessions } = useWorkoutSessions();

  const grouped = useMemo(() => {
    const map = new Map<string, WorkoutSession[]>();
    for (const s of sessions) {
      const key = `${s.year}-W${String(s.iso_week).padStart(2, "0")}-${s.phase}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return Array.from(map.entries());
  }, [sessions]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HistoryIcon className="h-4 w-4" />
          Storico
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-background">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Storico allenamenti</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-5">
          {grouped.length === 0 && (
            <p className="text-sm text-muted-foreground">Nessuna sessione completata.</p>
          )}
          {grouped.map(([key, items]) => {
            const first = items[0];
            return (
              <div
                key={key}
                className="rounded-2xl border border-border bg-gradient-card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">
                    Settimana {first.iso_week} · {first.year}
                  </p>
                  <span className="text-[10px] font-semibold tracking-widest uppercase rounded-full px-2 py-0.5 bg-primary/15 text-primary border border-primary/30">
                    {getPhaseLabel(first.phase)}
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((s) => {
                    const skill = getSkillById(s.skill_id);
                    return (
                      <div key={s.id} className="rounded-xl bg-secondary/40 border border-border/50 p-3">
                        <p className="font-semibold text-sm mb-2">
                          {skill?.name[lang] ?? s.skill_id}
                          <span className="ml-2 text-[10px] text-muted-foreground font-normal">
                            {new Date(s.completed_at).toLocaleDateString()}
                          </span>
                        </p>
                        <ul className="space-y-1">
                          {s.entries.map((e, i) => (
                            <li key={i} className="text-xs text-muted-foreground">
                              <span className="text-foreground font-medium">{e.name}</span>
                              {" — "}
                              {formatEntry(e) || "–"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
