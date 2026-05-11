import { Lock, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import type { Skill } from "@/data/skills";
import { totalProgressions, getSkillById } from "@/data/skills";
import { useI18n } from "@/i18n/I18nProvider";

interface SkillCardProps {
  skill: Skill;
  currentProgressionName?: string | null;
  completedCount: number;
  index?: number;
  locked?: boolean;
  requiresNames?: string[];
}

const difficultyColor: Record<string, string> = {
  TIRATA: "bg-success text-secondary border-primary",
  SPINTA: "bg-success text-secondary border-primary",
  "TIRATA/SPINTA": "bg-success text-secondary border-primary",
  GAMBE: "bg-success text-secondary border-primary",
};

export const SkillCard = ({
  skill,
  currentProgressionName,
  completedCount,
  index = 0,
  locked = false,
  requiresNames = [],
}: SkillCardProps) => {
  const { lang, t } = useI18n();
  const total = totalProgressions(skill);
  const percent = total > 0 ? (completedCount / total) * 100 : 0;

  const inner = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        <img
          src={skill.image}
          alt={skill.name[lang]}
          loading="lazy"
          className={`h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 ${
            locked ? "grayscale opacity-50" : ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border backdrop-blur-md ${
              difficultyColor[skill.difficulty] ?? "bg-success text-secondary border-primary"
            }`}
          >
            {skill.difficulty}
          </span>
          {locked && (
            <div className="h-9 w-9 rounded-full bg-background/40 backdrop-blur-md border border-border/50 flex items-center justify-center">
              <Lock className="h-4 w-4 text-foreground" strokeWidth={2.5} />
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 space-y-3">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-1">
              {skill.category[lang]}
            </p>
            <h3 className="font-display text-2xl font-bold leading-tight text-foreground">
              {skill.name[lang]}
            </h3>
          </div>

          {locked ? (
            <div className="rounded-xl bg-background/70 border border-border/60 px-3 py-2 backdrop-blur-md">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3 w-3" />
                {t.card.lockedTitle}
              </p>
              <p className="text-xs text-foreground/80 mt-1 leading-snug">
                {t.card.lockedHint} {requiresNames.join(", ")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                {currentProgressionName ? (
                  <>
                    <Trophy className="h-3.5 w-3.5 text-primary" />
                    <span className="text-foreground/90 font-medium truncate">{currentProgressionName}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground italic">{t.card.notStarted}</span>
                )}
              </div>

              <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const className = `group relative overflow-hidden rounded-3xl bg-gradient-card border border-border shadow-card transition-all duration-500 animate-fade-in-up block ${
    locked
      ? "cursor-not-allowed"
      : "hover:shadow-glow hover:-translate-y-1 hover:border-primary/40"
  }`;

  if (locked) {
    return (
      <div
        aria-disabled="true"
        className={className}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      to={`/skill/${skill.id}`}
      className={className}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {inner}
    </Link>
  );
};
