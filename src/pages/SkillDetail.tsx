import { ArrowLeft, Check, History, NotebookPen, RotateCcw, Trophy } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSkillById, totalProgressions, type ProgressionGroup, type Skill } from "@/data/skills";
import { useNotes, useProgress } from "@/hooks/useProgress";
import { useLoad, BAND_COLORS } from "@/hooks/useLoad";
import { useHistory } from "@/hooks/useHistory";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Stopwatch } from "@/components/Stopwatch";
import { LoadEditor } from "@/components/LoadEditor";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const SkillDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, t } = useI18n();
  const skill = id ? getSkillById(id) : undefined;
  const { getGroupIndex, setGroupProgress, resetSkill, getSkillCompletedCount } = useProgress();
  const { getNote, setNote } = useNotes();
  const { getLoad, setLoad } = useLoad();
  const { addEntry, removeEntry, getSkillHistory } = useHistory();

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">{t.detail.skillNotFound}</p>
          <Button onClick={() => navigate("/")}>{t.detail.backHome}</Button>
        </div>
      </div>
    );
  }

  const total = totalProgressions(skill);
  const completed = getSkillCompletedCount(skill.id);
  const percent = total > 0 ? (completed / total) * 100 : 0;
  const hasAnyTimer = skill.groups.some((g) => g.hasTimer);

  let latestName: string | null = null;
  for (const group of skill.groups) {
    const idx = getGroupIndex(skill.id, group.id);
    if (idx >= 0) latestName = group.progressions[idx];
  }

  const handleSelect = (group: ProgressionGroup, index: number) => {
    const current = getGroupIndex(skill.id, group.id);
    if (current === index) {
      setGroupProgress(skill.id, group.id, -1);
      removeEntry(skill.id, group.id, index);
      toast(t.toast.progressionCleared, { description: skill.name[lang] });
    } else {
      setGroupProgress(skill.id, group.id, index);
      // log every progression up to and including current index
      for (let i = 0; i <= index; i++) {
        addEntry({
          skillId: skill.id,
          groupId: group.id,
          progressionIndex: i,
          progressionName: group.progressions[i],
        });
      }
      toast.success(t.toast.progressSaved, { description: group.progressions[index] });
    }
  };

  const handleReset = () => {
    resetSkill(skill.id);
    toast(t.toast.progressReset, { description: skill.name[lang] });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
        <img src={skill.image} alt={skill.name[lang]} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />

        <div className="absolute top-0 inset-x-0">
          <div className="container max-w-5xl mx-auto px-6 py-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/40 backdrop-blur-md border border-border/50 text-sm font-medium hover:bg-background/60 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.detail.back}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0">
          <div className="container max-w-5xl mx-auto px-6 pb-10">
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
              {skill.category[lang]} · {skill.difficulty}
            </p>
            <h1 className="font-display text-5xl sm:text-7xl font-bold leading-[0.95] mb-4 max-w-3xl">
              {skill.name[lang]}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">{skill.description[lang]}</p>
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
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground">{t.detail.currentLevel}</p>
                <p className="font-display text-xl font-bold">{latestName ?? t.detail.notStarted}</p>
              </div>
            </div>
            {completed > 0 && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-3.5 w-3.5" />
                {t.detail.reset}
              </Button>
            )}
          </div>

          {/* Per-group current levels */}
          {skill.groups.length > 1 && (
            <div className="grid sm:grid-cols-2 gap-2 mb-5">
              {skill.groups.map((group) => {
                const idx = getGroupIndex(skill.id, group.id);
                const name = idx >= 0 ? group.progressions[idx] : null;
                return (
                  <div
                    key={group.id}
                    className="rounded-2xl bg-background/40 border border-border/60 p-3"
                  >
                    <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary">
                      {group.label[lang]}
                    </p>
                    <p className="font-semibold text-sm mt-1 truncate">
                      {name ?? (
                        <span className="text-muted-foreground font-normal">
                          {t.detail.notStarted}
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground tracking-wider uppercase">{t.detail.mastery}</span>
              <span className="font-semibold text-primary">
                {completed} / {total}
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

      {/* Timer */}
      {hasAnyTimer && (
        <section className="container max-w-5xl mx-auto px-6 mt-8">
          <Stopwatch />
        </section>
      )}

      {/* Progressions per group */}
      <section className="container max-w-5xl mx-auto px-6 mt-12 space-y-12">
        {skill.groups.map((group) => (
          <ProgressionGroupBlock
            key={group.id}
            skill={skill}
            group={group}
            onSelect={handleSelect}
            getLoad={getLoad}
            setLoad={setLoad}
          />
        ))}
      </section>

      {/* History */}
      <HistoryBlock entries={getSkillHistory(skill.id)} skill={skill} onRemove={removeEntry} />

      {/* Notes */}
      <NotesBlock skillId={skill.id} initial={getNote(skill.id)} onSave={setNote} />
    </div>
  );
};

const ProgressionGroupBlock = ({
  skill,
  group,
  onSelect,
  getLoad,
  setLoad,
}: {
  skill: Skill;
  group: ProgressionGroup;
  onSelect: (group: ProgressionGroup, index: number) => void;
  getLoad: ReturnType<typeof useLoad>["getLoad"];
  setLoad: ReturnType<typeof useLoad>["setLoad"];
}) => {
  const { lang, t } = useI18n();
  const { getGroupIndex } = useProgress();
  const currentIndex = getGroupIndex(skill.id, group.id);

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-2">
            {t.detail.pathEyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold">{group.label[lang]}</h2>
          <p className="text-sm text-muted-foreground mt-2">{t.detail.pathSubtitle}</p>
        </div>
        <span className="text-xs font-semibold text-primary">
          {currentIndex >= 0 ? currentIndex + 1 : 0} / {group.progressions.length}
        </span>
      </div>

      <ol className="space-y-3">
        {group.progressions.map((name, i) => {
          const isCurrent = i === currentIndex;
          const isCompleted = currentIndex >= 0 && i < currentIndex;
          const load = getLoad(skill.id, group.id, i);
          return (
            <li key={`${group.id}-${i}`}>
              <div
                className={`group w-full text-left rounded-2xl border transition-all duration-300 ${
                  isCurrent
                    ? "bg-primary/10 border-primary shadow-glow"
                    : isCompleted
                    ? "bg-secondary/40 border-border/70"
                    : "bg-card border-border hover:border-primary/40"
                }`}
              >
                <button
                  onClick={() => onSelect(group, i)}
                  className="w-full text-left flex items-center gap-4 p-5"
                >
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

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}>{name}</h3>
                      {isCurrent && (
                        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                          {t.detail.current}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">
                          {t.detail.completed}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition ${
                      isCurrent ? "bg-primary border-primary" : "border-border group-hover:border-primary/60"
                    }`}
                  >
                    {isCurrent && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
                  </div>
                </button>

                <div className="px-5 pb-4 -mt-1">
                  <LoadEditor
                    value={load}
                    onChange={(entry) => {
                      setLoad(skill.id, group.id, i, entry);
                      toast.success(t.toast.loadSaved, { description: name });
                    }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const HistoryBlock = ({
  entries,
  skill,
  onRemove,
}: {
  entries: ReturnType<ReturnType<typeof useHistory>["getSkillHistory"]>;
  skill: Skill;
  onRemove: (skillId: string, groupId: string, progressionIndex: number) => void;
}) => {
  const { lang, t } = useI18n();

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "it" ? "it-IT" : lang === "es" ? "es-ES" : "en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const groupLabelOf = (groupId: string) =>
    skill.groups.find((g) => g.id === groupId)?.label[lang] ?? groupId;

  return (
    <section className="container max-w-5xl mx-auto px-6 mt-12">
      <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-12 w-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground">
              {t.history.subtitle}
            </p>
            <p className="font-display text-xl font-bold">{t.history.title}</p>
          </div>
        </div>

        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">{t.history.empty}</p>
        ) : (
          <ol className="relative border-l border-border/60 ml-3 space-y-4">
            {entries.map((e) => (
              <li key={`${e.groupId}-${e.progressionIndex}-${e.date}`} className="pl-6 relative">
                <span className="absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-primary border-2 border-background" />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-primary">
                      {groupLabelOf(e.groupId)} · {t.history.achieved} {fmt(e.date)}
                    </p>
                    <p className="font-semibold mt-1">{e.progressionName}</p>
                  </div>
                  <button
                    onClick={() => onRemove(e.skillId, e.groupId, e.progressionIndex)}
                    className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:text-destructive transition"
                  >
                    {t.history.remove}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};

const NotesBlock = ({
  skillId,
  initial,
  onSave,
}: {
  skillId: string;
  initial: string;
  onSave: (skillId: string, value: string) => void;
}) => {
  const { t } = useI18n();
  const [value, setValue] = useState(initial);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setValue(initial);
  }, [initial, skillId]);

  useEffect(() => {
    if (value === initial) return;
    const handle = setTimeout(() => {
      onSave(skillId, value);
      setSavedFlash(true);
      const tid = setTimeout(() => setSavedFlash(false), 1500);
      return () => clearTimeout(tid);
    }, 500);
    return () => clearTimeout(handle);
  }, [value, initial, skillId, onSave]);

  return (
    <section className="container max-w-5xl mx-auto px-6 mt-12">
      <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
              <NotebookPen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Skill</p>
              <p className="font-display text-xl font-bold">{t.detail.notesTitle}</p>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full transition-opacity ${
              savedFlash ? "opacity-100 bg-success/15 text-success border border-success/30" : "opacity-0"
            }`}
          >
            ✓ {t.detail.notesSaved}
          </span>
        </div>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.detail.notesPlaceholder}
          className="min-h-[160px] bg-background/60 resize-y leading-relaxed"
        />
      </div>
    </section>
  );
};

// re-export so BAND_COLORS isn't tree-shaken if needed
export { BAND_COLORS };
export default SkillDetail;
