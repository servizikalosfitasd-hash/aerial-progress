import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Dumbbell, Flame, Sparkles } from "lucide-react";
import {
  getWeeklySchedule,
  todayDayKey,
  type DayKey,
} from "@/lib/weeklySchedule";
import { getISOWeek } from "@/lib/periodization";
import { skills } from "@/data/skills";
import { Button } from "@/components/ui/button";

interface Props {
  onOpenSkill?: (skillId: string) => void;
}

export const WeeklyScheduleCard = ({ onOpenSkill }: Props) => {
  const now = new Date();
  const current = getISOWeek(now);
  const [week, setWeek] = useState<number>(current.week);
  const today: DayKey | null = week === current.week ? todayDayKey(now) : null;

  const schedule = useMemo(() => getWeeklySchedule(week), [week]);
  const availableSkillIds = useMemo(() => new Set(skills.map((s) => s.id)), []);

  const goPrev = () => setWeek((w) => Math.max(1, w - 1));
  const goNext = () => setWeek((w) => Math.min(53, w + 1));
  const goToday = () => setWeek(current.week);

  return (
    <section>
      <div className="rounded-md bg-card border border-border overflow-hidden">
        {/* Header + Focus */}
        <div className="p-4 sm:p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary">
                  Programmazione settimanale
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight">
                  Settimana {week}
                  <span className="text-muted-foreground font-normal text-sm ml-2">
                    · ciclo {schedule.cyclePosition}/5
                  </span>
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button type="button" variant="outline" size="icon"
                onClick={goPrev}
                className="h-9 w-9"
                aria-label="Settimana precedente"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {week !== current.week && (
                <Button type="button" variant="outline" size="sm"
                  onClick={goToday}
                  className="h-9"
                >
                  Oggi
                </Button>
              )}
              <Button type="button" variant="outline" size="icon"
                onClick={goNext}
                className="h-9 w-9"
                aria-label="Settimana successiva"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 border-l-2 border-primary bg-primary/10 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">
                Focus di questa settimana
              </p>
            </div>
            <p className="text-sm sm:text-base font-semibold leading-snug">
              {schedule.focus}
            </p>
          </div>
        </div>

        {/* Griglia giorni */}
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2">
            {schedule.days.map((d) => {
              const isToday = today === d.day;
              return (
                <div
                  key={d.day}
                   className={`rounded-md border p-3 flex flex-col gap-2 transition ${
                    isToday
                      ? "border-primary/60 bg-primary/5 shadow-glow"
                      : "border-border/60 bg-background/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                        isToday ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {d.dayLabel}
                    </p>
                    {isToday && (
                      <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                        Oggi
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {d.isFreeCircuitDay ? (
                      <>
                        <SkillChip label="Circuito / Potenziamento" icon="circuit" />
                        <SkillChip label="Skill a piacere" icon="star" />
                      </>
                    ) : (
                      d.skills.map((s) => {
                        const linkable = s.skillId && availableSkillIds.has(s.skillId);
                        return (
                          <SkillChip
                            key={s.label}
                            label={s.label}
                            icon="skill"
                            onClick={
                              linkable && onOpenSkill
                                ? () => onOpenSkill(s.skillId!)
                                : undefined
                            }
                          />
                        );
                      })
                    )}
                    {d.hasCoreLegsCircuit && (
                      <SkillChip label="Circuito Addome/Gambe 5/7'" icon="circuit" muted />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillChip = ({
  label,
  icon,
  onClick,
  muted,
}: {
  label: string;
  icon: "skill" | "circuit" | "star";
  onClick?: () => void;
  muted?: boolean;
}) => {
  const Icon = icon === "skill" ? Dumbbell : icon === "star" ? Sparkles : Flame;
  const base =
    "group flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-[11px] font-medium border transition text-left";
  const style = muted
    ? "border-border/50 bg-background/50 text-muted-foreground"
    : onClick
      ? "border-primary/30 bg-primary/10 text-foreground hover:bg-primary/20 hover:border-primary/50 cursor-pointer"
      : "border-border/60 bg-background/60 text-foreground";
  const Comp: any = onClick ? "button" : "div";
  return (
    <Comp className={`${base} ${style}`} onClick={onClick}>
      <Icon className={`h-3 w-3 shrink-0 ${muted ? "" : "text-primary"}`} />
      <span className="truncate">{label}</span>
    </Comp>
  );
};
