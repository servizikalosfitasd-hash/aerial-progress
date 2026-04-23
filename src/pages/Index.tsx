import { useMemo } from "react";
import { Dumbbell, Flame, TrendingUp } from "lucide-react";
import { skills } from "@/data/skills";
import { useProgress } from "@/hooks/useProgress";
import { SkillCard } from "@/components/SkillCard";

const Index = () => {
  const { progress } = useProgress();

  const stats = useMemo(() => {
    const started = Object.values(progress).filter(Boolean).length;
    const total = skills.length;
    const completed = skills.filter((s) => {
      const p = progress[s.id];
      return p && s.progressions[s.progressions.length - 1].id === p;
    }).length;
    return { started, total, completed };
  }, [progress]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
              <Dumbbell className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-display font-bold text-lg leading-none">CALIS<span className="text-primary">.</span>TRACK</p>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">Skill Mastery</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{stats.started}/{stats.total}</span>
            <span className="text-xs text-muted-foreground">in progress</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="container max-w-7xl mx-auto px-6 py-16 sm:py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in-up">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-glow-pulse" />
              <span className="text-xs font-medium tracking-wider uppercase text-primary">Track Every Rep</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight leading-[0.95] mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Master the
              <br />
              <span className="text-gradient">impossible.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              Your personal calisthenics journey. Track every progression from your first pull-up to the Iron Cross.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <StatCard label="Skills" value={stats.total} />
              <StatCard label="Active" value={stats.started} highlight />
              <StatCard label="Mastered" value={stats.completed} />
            </div>
          </div>
        </div>
      </section>

      {/* Skills gallery */}
      <section className="container max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-2">The Arsenal</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Choose your skill</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Tap a skill to track progress</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skills.map((skill, i) => {
            const currentId = progress[skill.id];
            const current = skill.progressions.find((p) => p.id === currentId);
            const idx = currentId ? skill.progressions.findIndex((p) => p.id === currentId) + 1 : 0;
            const percent = (idx / skill.progressions.length) * 100;
            return (
              <SkillCard
                key={skill.id}
                skill={skill}
                currentProgressionName={current?.name}
                progressPercent={percent}
                index={i}
              />
            );
          })}
        </div>
      </section>

      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="container max-w-7xl mx-auto px-6 text-center text-xs text-muted-foreground tracking-wider uppercase">
          Built for the relentless · CALIS.TRACK
        </div>
      </footer>
    </div>
  );
};

const StatCard = ({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) => (
  <div className={`p-4 rounded-2xl border ${highlight ? "bg-primary/10 border-primary/30" : "bg-secondary/40 border-border"}`}>
    <p className={`font-display text-3xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    <p className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">{label}</p>
  </div>
);

export default Index;
