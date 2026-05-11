import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { skills, totalProgressions, isSkillFullyCompleted, getSkillById } from "@/data/skills";
import { useProgress } from "@/hooks/useProgress";
import { SkillCard } from "@/components/SkillCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import kalosLogo from "@/assets/kalos-logo.jpeg";

const Index = () => {
  const { lang, t } = useI18n();
  const { progress, getSkillCompletedCount, getGroupIndex } = useProgress();

  const stats = useMemo(() => {
    const total = skills.length;
    const started = skills.filter((s) => getSkillCompletedCount(s.id) > 0).length;
    const completed = skills.filter((s) => getSkillCompletedCount(s.id) >= totalProgressions(s)).length;
    return { started, total, completed };
  }, [progress, getSkillCompletedCount]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-7xl mx-auto pl-14 pr-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl overflow-hidden bg-black flex items-center justify-center flex-shrink-0">
              <img src={kalosLogo} alt="Kalos Fit logo" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-lg leading-none text-left">
                Kalos Fit App
              </p>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5 truncate">
                {t.app.tagline}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="container max-w-7xl mx-auto px-6 py-16 sm:py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in-up">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-glow-pulse" />
              <span className="text-xs font-medium tracking-wider uppercase text-primary">{t.app.heroBadge}</span>
            </div>
            <h1
              className="font-display text-5xl sm:text-7xl font-bold tracking-tight leading-[0.95] mb-6 animate-fade-in-up"
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

            <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <StatCard label={t.app.statsSkills} value={stats.total} />
              <StatCard label={t.app.statsActive} value={stats.started} highlight />
              <StatCard label={t.app.statsMastered} value={stats.completed} />
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-2">
              {t.app.sectionEyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">{t.app.sectionTitle}</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{t.app.sectionHint}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  <div className={`p-4 rounded-2xl border ${highlight ? "bg-primary/10 border-primary/30" : "bg-secondary/40 border-border"}`}>
    <p className={`font-display text-3xl font-bold text-center ${highlight ? "text-lime-400" : "text-foreground"}`}>{value}</p>
    <p className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">{label}</p>
  </div>
);


export default Index;
