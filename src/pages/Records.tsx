import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Clock, Repeat, Layers, Dumbbell } from "lucide-react";
import { skills, type Skill } from "@/data/skills";
import { useLoad, BAND_COLORS, type LoadEntry } from "@/hooks/useLoad";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";

interface PRRecord {
  groupId: string;
  groupLabel: string;
  progressionIndex: number;
  progressionName: string;
  entry: LoadEntry;
}

const Records = () => {
  const { lang, t } = useI18n();
  const { loads } = useLoad();

  const fmt = (iso?: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString(
      lang === "it" ? "it-IT" : lang === "es" ? "es-ES" : "en-GB",
      { day: "2-digit", month: "2-digit", year: "numeric" },
    );
  };

  const skillRecords = useMemo(() => {
    return skills.map((skill) => {
      const records: PRRecord[] = [];
      const skillData = loads[skill.id] ?? {};
      for (const group of skill.groups) {
        const groupData = skillData[group.id] ?? {};
        for (const [idxStr, entry] of Object.entries(groupData)) {
          const idx = Number(idxStr);
          // include only entries that have at least one metric or load info
          const hasContent =
            entry.seconds != null ||
            entry.sets != null ||
            entry.reps != null ||
            (entry.type === "weight" && entry.kg != null && entry.kg !== 0) ||
            (entry.type === "band" && entry.band);
          if (!hasContent) continue;
          records.push({
            groupId: group.id,
            groupLabel: group.label[lang],
            progressionIndex: idx,
            progressionName: group.progressions[idx] ?? `#${idx + 1}`,
            entry,
          });
        }
      }
      // sort: by group order then by progression index desc (latest first)
      records.sort((a, b) => {
        if (a.groupId !== b.groupId) {
          const ai = skill.groups.findIndex((g) => g.id === a.groupId);
          const bi = skill.groups.findIndex((g) => g.id === b.groupId);
          return ai - bi;
        }
        return b.progressionIndex - a.progressionIndex;
      });
      return { skill, records };
    });
  }, [loads, lang]);

  const totalRecords = skillRecords.reduce((sum, s) => sum + s.records.length, 0);
  const skillsWithRecords = skillRecords.filter((s) => s.records.length > 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-5xl mx-auto pl-14 pr-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.detail.back}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container max-w-5xl mx-auto px-6 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-primary">
              {t.records.eyebrow}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[0.95] mb-4">
            {t.records.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            {t.records.viewOnlyHint}
          </p>
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border">
              <span className="text-sm font-bold text-primary">{totalRecords}</span>
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground">
                {t.records.totalPRs}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border">
              <span className="text-sm font-bold text-primary">{skillsWithRecords.length}</span>
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground">
                / {skills.length} skill
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-6 py-10 space-y-5">
        {totalRecords === 0 && (
          <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated p-10 text-center">
            <Trophy className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-base font-semibold mb-1">{t.records.empty}</p>
            <p className="text-sm text-muted-foreground">{t.records.emptyHint}</p>
          </div>
        )}

        {skillsWithRecords.map(({ skill, records }) => (
          <SkillRecordCard
            key={skill.id}
            skill={skill}
            records={records}
            fmt={fmt}
          />
        ))}
      </section>
    </div>
  );
};

const SkillRecordCard = ({
  skill,
  records,
  fmt,
}: {
  skill: Skill;
  records: PRRecord[];
  fmt: (iso?: string) => string;
}) => {
  const { lang, t } = useI18n();

  return (
    <div className="rounded-2xl bg-gradient-card border border-border shadow-elevated overflow-hidden">
      <Link
        to={`/skill/${skill.id}`}
        state={{ from: "/records" }}
        className="flex items-center gap-4 p-4 sm:p-5 hover:bg-secondary/30 transition"
      >
        <img
          src={skill.image}
          alt={skill.name[lang]}
          className="h-14 w-14 rounded-xl object-cover border border-border flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground">
            {skill.category[lang]}
          </p>
          <h3 className="font-display text-lg font-bold truncate">{skill.name[lang]}</h3>
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase text-primary flex-shrink-0">
          {records.length} PR
        </span>
      </Link>

      <div className="border-t border-border/60 divide-y divide-border/40">
        {records.map((r) => (
          <RecordRow key={`${r.groupId}-${r.progressionIndex}`} record={r} fmt={fmt} />
        ))}
      </div>
    </div>
  );
};

const RecordRow = ({ record, fmt }: { record: PRRecord; fmt: (iso?: string) => string }) => {
  const { t } = useI18n();
  const { entry } = record;
  const bandHex =
    entry.type === "band" && entry.band
      ? BAND_COLORS.find((b) => b.id === entry.band)?.hex
      : undefined;

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary">
            {record.groupLabel} · #{String(record.progressionIndex + 1).padStart(2, "0")}
          </p>
          <p className="font-semibold text-sm mt-0.5 truncate">{record.progressionName}</p>
        </div>
        {entry.updatedAt && (
          <span className="text-[10px] tracking-widest uppercase text-muted-foreground flex-shrink-0">
            {fmt(entry.updatedAt)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {entry.seconds != null && (
          <Pill icon={<Clock className="h-3 w-3" />} value={`${entry.seconds}s`} label={t.records.seconds} />
        )}
        {entry.sets != null && (
          <Pill icon={<Layers className="h-3 w-3" />} value={`${entry.sets}`} label={t.load.sets} />
        )}
        {entry.reps != null && (
          <Pill icon={<Repeat className="h-3 w-3" />} value={`${entry.reps}`} label={t.records.reps} />
        )}
        {entry.type === "weight" && entry.kg != null && entry.kg !== 0 && (
          <Pill
            icon={<Dumbbell className="h-3 w-3" />}
            value={`${entry.kg > 0 ? "+" : ""}${entry.kg} kg`}
            label={t.records.kg}
          />
        )}
        {entry.type === "band" && entry.band && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/60 border border-border">
            {bandHex && (
              <span
                className="h-2.5 w-2.5 rounded-full border border-border/60"
                style={{ backgroundColor: bandHex }}
              />
            )}
            <span className="text-xs font-bold text-foreground">{t.load.bands[entry.band]}</span>
          </span>
        )}
      </div>
    </div>
  );
};

const Pill = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30">
    <span className="text-primary">{icon}</span>
    <span className="text-xs font-bold text-primary">{value}</span>
    <span className="text-[9px] tracking-widest uppercase text-muted-foreground">{label}</span>
  </span>
);

export default Records;
