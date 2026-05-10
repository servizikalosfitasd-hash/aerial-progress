import { Footprints } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LoadEditor } from "@/components/LoadEditor";
import { SetCounter } from "@/components/SetCounter";
import { CountdownTimer } from "@/components/CountdownTimer";
import { getSkillById } from "@/data/skills";
import { useLoad } from "@/hooks/useLoad";
import { useI18n } from "@/i18n/I18nProvider";

const Legs = () => {
  const { lang } = useI18n();
  const { getLoad, setLoad } = useLoad();
  const skill = getSkillById("legs");

  if (!skill) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-6xl mx-auto pl-14 pr-4 sm:px-6 py-4 flex items-center justify-end gap-3">
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
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            {skill.description[lang]} Scegli liberamente gli esercizi e modifica serie, ripetizioni
            e carichi senza vincoli.
          </p>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {skill.groups.map((g) => (
          <div key={g.id}>
            <h2 className="font-display text-2xl font-bold mb-4">{g.label[lang]}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.progressions.map((name, i) => {
                const entry = getLoad(skill.id, g.id, i);
                return (
                  <div
                    key={`${g.id}-${i}`}
                    className="rounded-2xl bg-gradient-card border border-border shadow-elevated p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="h-7 w-7 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-semibold text-sm flex-1 break-words min-w-0">{name}</h3>
                    </div>
                    <LoadEditor
                      value={entry}
                      onChange={(next) => setLoad(skill.id, g.id, i, next)}
                    />
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <SetCounter total={entry.sets ?? 4} />
                      <CountdownTimer initialSeconds={entry.rest ?? 60} compact />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Legs;
