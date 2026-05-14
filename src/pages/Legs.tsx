import { Footprints } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { HamburgerButton } from "@/components/HamburgerButton";
import { SelectableExerciseList } from "@/components/SelectableExerciseList";
import { getSkillById } from "@/data/skills";
import { useI18n } from "@/i18n/I18nProvider";

const Legs = () => {
  const { lang } = useI18n();
  const skill = getSkillById("legs");

  if (!skill) return null;

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
        <SelectableExerciseList skill={skill} />
      </section>
    </div>
  );
};

export default Legs;
