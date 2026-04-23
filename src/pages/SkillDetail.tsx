import { ArrowLeft, Check, RotateCcw, Trophy } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSkillById } from "@/data/skills";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SkillDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const skill = id ? getSkillById(id) : undefined;
  const { getSkillProgress, setSkillProgress } = useProgress();

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Skill not found.</p>
          <Button onClick={() => navigate("/")}>Back home</Button>
        </div>
      </div>
    );
  }

  const currentId = getSkillProgress(skill.id);
  const currentIndex = currentId ? skill.progressions.findIndex((p) => p.id === currentId) : -1;
  const percent = currentIndex >= 0 ? ((currentIndex + 1) / skill.progressions.length) * 100 : 0;

  const handleSelect = (progressionId: string) => {
    if (currentId === progressionId) {
      setSkillProgress(skill.id, null);
      toast("Progression cleared", { description: skill.name });
    } else {
      const prog = skill.progressions.find((p) => p.id === progressionId);
      setSkillProgress(skill.id, progressionId);
      toast.success("Progress saved", { description: prog?.name });
    }
  };

  const handleReset = () => {
    setSkillProgress(skill.id, null);
    toast("Progress reset", { description: skill.name });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
        <img src={skill.image} alt={skill.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />

        {/* Back button */}
        <div className="absolute top-0 inset-x-0">
          <div className="container max-w-5xl mx-auto px-6 py-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/40 backdrop-blur-md border border-border/50 text-sm font-medium hover:bg-background/60 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              All Skills
            </Link>
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 inset-x-0">
          <div className="container max-w-5xl mx-auto px-6 pb-10">
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
              {skill.category} · {skill.difficulty}
            </p>
            <h1 className="font-display text-5xl sm:text-7xl font-bold leading-[0.95] mb-4 max-w-3xl">
              {skill.name}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">{skill.description}</p>
          </div>
        </div>
      </div>

      {/* Progress summary */}
      <div className="container max-w-5xl mx-auto px-6 -mt-6 relative z-10">
        <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Current Level</p>
                <p className="font-display text-xl font-bold">
                  {currentIndex >= 0 ? skill.progressions[currentIndex].name : "Not started"}
                </p>
              </div>
            </div>
            {currentId && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground tracking-wider uppercase">Mastery</span>
              <span className="font-semibold text-primary">
                {currentIndex >= 0 ? currentIndex + 1 : 0} / {skill.progressions.length}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progressions */}
      <section className="container max-w-5xl mx-auto px-6 mt-12">
        <div className="mb-8">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-2">Propedeutiche</p>
          <h2 className="font-display text-3xl font-bold">The Path</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Tap your current level. Your progress is saved automatically.
          </p>
        </div>

        <ol className="space-y-3">
          {skill.progressions.map((p, i) => {
            const isCurrent = p.id === currentId;
            const isCompleted = currentIndex >= 0 && i < currentIndex;
            return (
              <li key={p.id}>
                <button
                  onClick={() => handleSelect(p.id)}
                  className={`group w-full text-left flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                    isCurrent
                      ? "bg-primary/10 border-primary shadow-glow"
                      : isCompleted
                      ? "bg-secondary/40 border-border/70"
                      : "bg-card border-border hover:border-primary/40 hover:bg-secondary/30"
                  }`}
                >
                  {/* Step indicator */}
                  <div
                    className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center font-display font-bold border transition ${
                      isCurrent
                        ? "bg-primary text-primary-foreground border-primary"
                        : isCompleted
                        ? "bg-success/15 text-success border-success/40"
                        : "bg-secondary text-muted-foreground border-border group-hover:border-primary/40 group-hover:text-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" strokeWidth={3} /> : String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}>
                        {p.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                  </div>

                  {/* Check circle */}
                  <div
                    className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition ${
                      isCurrent
                        ? "bg-primary border-primary"
                        : "border-border group-hover:border-primary/60"
                    }`}
                  >
                    {isCurrent && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
};

export default SkillDetail;
