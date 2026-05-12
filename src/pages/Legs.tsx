import { useEffect, useState } from "react";
import { Footprints, Check } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { HamburgerButton } from "@/components/HamburgerButton";
import { LoadEditor } from "@/components/LoadEditor";
import { SetCounter } from "@/components/SetCounter";
import { CountdownTimer } from "@/components/CountdownTimer";
import { getSkillById } from "@/data/skills";
import { useLoad } from "@/hooks/useLoad";
import { useI18n } from "@/i18n/I18nProvider";

const STORAGE_KEY = "legs-selected-exercises";

const Legs = () => {
  const { lang } = useI18n();
  const { getLoad, setLoad } = useLoad();
  const skill = getSkillById("legs");

  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {
      /* ignore */
    }
  }, [selected]);

  if (!skill) return null;

  const toggle = (key: string) =>
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));

  // Flatten all exercises into a single list (no levels / no groups)
  const allExercises = skill.groups.flatMap((g) =>
    g.progressions.map((name, i) => ({ groupId: g.id, name, index: i })),
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <HamburgerButton />
          <LanguageSwitcher />
        </div>
      </header>

      <section className="bg-gradient-hero">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Footprints className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-primary">
              Gambe
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-[0.95] mb-3">
            {skill.name[lang]}
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            {skill.description[lang]} Tocca un esercizio per selezionarlo e personalizza
            serie, ripetizioni e recupero senza vincoli.
          </p>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allExercises.map(({ groupId, name, index }) => {
            const key = `${groupId}-${index}`;
            const entry = getLoad(skill.id, groupId, index);
            const isSelected = !!selected[key];
            return (
              <div
                key={key}
                className={`rounded-2xl border shadow-elevated p-4 flex flex-col gap-3 transition ${
                  isSelected
                    ? "bg-primary/5 border-primary/60 shadow-glow"
                    : "bg-gradient-card border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className="flex items-start gap-2 text-left"
                  aria-pressed={isSelected}
                >
                  <span
                    className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 transition ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-primary/15 border-primary/30 text-primary"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      <span className="text-xs font-bold">{String(index + 1).padStart(2, "0")}</span>
                    )}
                  </span>
                  <h3 className="font-semibold text-base flex-1 break-words min-w-0 leading-snug">
                    {name}
                  </h3>
                </button>
                <LoadEditor
                  value={entry}
                  onChange={(next) => setLoad(skill.id, groupId, index, next)}
                />
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <SetCounter total={entry.sets ?? 4} />
                  <CountdownTimer initialSeconds={entry.rest ?? 60} compact />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Legs;
