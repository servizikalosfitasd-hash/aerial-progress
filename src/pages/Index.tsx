import { useMemo } from "react";
import { TrendingUp, LayoutGrid, Grid3x3 } from "lucide-react";
import { skills, totalProgressions, isSkillFullyCompleted, getSkillById } from "@/data/skills";
import { useProgress } from "@/hooks/useProgress";
import { SkillCard } from "@/components/SkillCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { useSyncedState } from "@/hooks/useSyncedState";

const Index = () => {
  const { lang, t } = useI18n();
  const { progress, getSkillCompletedCount, getGroupIndex } = useProgress();
  const [compact, setCompact] = useSyncedState<boolean>("skills_view_compact", false);

  const stats = useMemo(() => {
    const total = skills.length;
    const started = skills.filter((s) => getSkillCompletedCount(s.id) > 0).length;
    const completed = skills.filter((s) => getSkillCompletedCount(s.id) >= totalProgressions(s)).length;
    return { started, total, completed };
  }, [progress, getSkillCompletedCount]);

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="app-header-inner max-w-7xl pl-14 sm:pl-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="min-w-0">
              <p className="font-display text-2xl leading-none text-left truncate">
                Kalos Fit App
              </p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground tracking-widest uppercase mt-1 truncate">
                {t.app.tagline}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-card/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 mb-4">
              <span className="text-xs font-medium tracking-wider uppercase text-primary">{t.app.heroBadge}</span>
            </div>
            <h1
              className="font-display text-5xl sm:text-7xl leading-none mb-3 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              {t.app.heroTitle1}
              <br />
              <span className="text-gradient">{t.app.heroTitle2}</span>
            </h1>
            <p
              className="text-lg text-muted-foreground max-w-xl leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              {t.app.heroSubtitle}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-7 max-w-lg animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <StatCard label={t.app.statsSkills} value={stats.total} />
              <StatCard label={t.app.statsActive} value={stats.started} highlight />
              <StatCard label={t.app.statsMastered} value={stats.completed} />
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-2">
              {t.app.sectionEyebrow}
            </p>
            <h2 className="app-section-heading">{t.app.sectionTitle}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>{t.app.sectionHint}</span>
            </div>
            <div className="inline-flex rounded-md border border-border bg-secondary/40 p-1">
              <button
                type="button"
                onClick={() => setCompact(false)}
                aria-label="Vista comoda"
                title="Vista comoda"
                className={`p-1.5 rounded-lg transition ${!compact ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setCompact(true)}
                aria-label="Vista compatta"
                title="Vista compatta"
                className={`p-1.5 rounded-lg transition ${compact ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className={`grid ${compact ? "gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6" : "gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"}`}>
          {skills.filter((s) => s.id !== "legs").map((skill, i) => {
            const completedCount = getSkillCompletedCount(skill.id);
            const skillProgress = progress[skill.id] ?? {};
            let latestName: string | null = null;
            for (const group of skill.groups) {
              const idx = skillProgress[group.id];
              if (typeof idx === "number" && idx >= 0) {
                latestName = group.progressions[idx];
              }
            }
            const requires = skill.requires ?? [];
            const locked = requires.some((rid) => !isSkillFullyCompleted(rid, getGroupIndex));
            const requiresNames = requires.map((rid) => getSkillById(rid)?.name[lang] ?? rid);
            return (
              <SkillCard
                key={skill.id}
                skill={skill}
                currentProgressionName={latestName}
                completedCount={completedCount}
                index={i}
                locked={locked}
                requiresNames={requiresNames}
                compact={compact}
              />
            );
          })}
        </div>
      </section>

      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="container max-w-7xl mx-auto px-6 text-center text-xs text-muted-foreground tracking-wider uppercase">
          {t.app.footer}
        </div>
      </footer>
    </div>
  );
};

const StatCard = ({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) => (
  <div className={`p-3 sm:p-4 rounded-md border-l-2 ${highlight ? "bg-primary/10 border-primary" : "bg-card border-border"}`}>
    <p className={`font-display text-4xl text-center ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    <p className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">{label}</p>
  </div>
);


export default Index;
