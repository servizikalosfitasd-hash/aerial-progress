import { ArrowUpRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import type { Skill } from "@/data/skills";
import { totalProgressions } from "@/data/skills";
import { useI18n } from "@/i18n/I18nProvider";

interface SkillCardProps {
  skill: Skill;
  currentProgressionName?: string | null;
  completedCount: number;
  index?: number;
}

const difficultyColor: Record<Skill["difficulty"], string> = {
  Beginner: "bg-success/15 text-success border-success/30",
  Intermediate: "bg-primary/15 text-primary border-primary/30",
  Advanced: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Elite: "bg-destructive/15 text-destructive border-destructive/30",
};

export const SkillCard = ({ skill, currentProgressionName, completedCount, index = 0 }: SkillCardProps) => {
  const { lang, t } = useI18n();
  const total = totalProgressions(skill);
  const percent = total > 0 ? (completedCount / total) * 100 : 0;

  return (
    <Link
      to={`/skill/${skill.id}`}
      className="group relative overflow-hidden rounded-3xl bg-gradient-card border border-border shadow-card transition-all duration-500 hover:shadow-glow hover:-translate-y-1 hover:border-primary/40 animate-fade-in-up block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={skill.image}
          alt={skill.name[lang]}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border backdrop-blur-md ${difficultyColor[skill.difficulty]}`}
          >
            {skill.difficulty}
          </span>
          <div className="h-9 w-9 rounded-full bg-background/40 backdrop-blur-md border border-border/50 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:rotate-45">
            <ArrowUpRight
              className="h-4 w-4 text-foreground transition-colors group-hover:text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
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
        </div>
      </div>
    </Link>
  );
};
