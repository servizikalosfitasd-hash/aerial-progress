export type Lang = "it" | "en" | "es";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

type Dict = {
  app: {
    tagline: string;
    heroBadge: string;
    heroTitle1: string;
    heroTitle2: string;
    heroSubtitle: string;
    statsSkills: string;
    statsActive: string;
    statsMastered: string;
    sectionEyebrow: string;
    sectionTitle: string;
    sectionHint: string;
    inProgress: string;
    notStarted: string;
    footer: string;
  };
  card: {
    notStarted: string;
  };
  detail: {
    back: string;
    currentLevel: string;
    notStarted: string;
    reset: string;
    mastery: string;
    pathEyebrow: string;
    pathTitle: string;
    pathSubtitle: string;
    current: string;
    completed: string;
    timerTitle: string;
    timerSubtitle: string;
    start: string;
    pause: string;
    resume: string;
    resetTimer: string;
    notesTitle: string;
    notesPlaceholder: string;
    notesSaved: string;
    skillNotFound: string;
    backHome: string;
  };
  toast: {
    progressSaved: string;
    progressionCleared: string;
    progressReset: string;
    languageChanged: string;
  };
};

export const dict: Record<Lang, Dict> = {
  it: {
    app: {
      tagline: "Maestria Skill",
      heroBadge: "Traccia ogni rep",
      heroTitle1: "Padroneggia",
      heroTitle2: "l'impossibile.",
      heroSubtitle:
        "Il tuo percorso personale di calisthenics. Traccia ogni progressione, dal primo pull-up alla croce di ferro.",
      statsSkills: "Skill",
      statsActive: "Attive",
      statsMastered: "Padroneggiate",
      sectionEyebrow: "L'arsenale",
      sectionTitle: "Scegli la tua skill",
      sectionHint: "Tocca una skill per tracciare i progressi",
      inProgress: "in corso",
      notStarted: "Non iniziata",
      footer: "Costruito per chi non molla · CALIS.TRACK",
    },
    card: { notStarted: "Non iniziata" },
    detail: {
      back: "Tutte le skill",
      currentLevel: "Livello attuale",
      notStarted: "Non iniziata",
      reset: "Reset",
      mastery: "Padronanza",
      pathEyebrow: "Propedeutiche",
      pathTitle: "Il percorso",
      pathSubtitle: "Tocca il tuo livello attuale. I progressi vengono salvati automaticamente.",
      current: "Attuale",
      completed: "Completata",
      timerTitle: "Cronometro hold",
      timerSubtitle: "Misura le tue tenute statiche.",
      start: "Avvia",
      pause: "Pausa",
      resume: "Riprendi",
      resetTimer: "Azzera",
      notesTitle: "Note personali",
      notesPlaceholder: "Scrivi qui i tuoi appunti, sensazioni, programmazione...",
      notesSaved: "Note salvate",
      skillNotFound: "Skill non trovata.",
      backHome: "Torna alla home",
    },
    toast: {
      progressSaved: "Progresso salvato",
      progressionCleared: "Progressione azzerata",
      progressReset: "Progresso resettato",
      languageChanged: "Lingua aggiornata",
    },
  },
  en: {
    app: {
      tagline: "Skill Mastery",
      heroBadge: "Track every rep",
      heroTitle1: "Master the",
      heroTitle2: "impossible.",
      heroSubtitle:
        "Your personal calisthenics journey. Track every progression from your first pull-up to the Iron Cross.",
      statsSkills: "Skills",
      statsActive: "Active",
      statsMastered: "Mastered",
      sectionEyebrow: "The Arsenal",
      sectionTitle: "Choose your skill",
      sectionHint: "Tap a skill to track progress",
      inProgress: "in progress",
      notStarted: "Not started",
      footer: "Built for the relentless · CALIS.TRACK",
    },
    card: { notStarted: "Not started" },
    detail: {
      back: "All skills",
      currentLevel: "Current level",
      notStarted: "Not started",
      reset: "Reset",
      mastery: "Mastery",
      pathEyebrow: "Progressions",
      pathTitle: "The Path",
      pathSubtitle: "Tap your current level. Your progress is saved automatically.",
      current: "Current",
      completed: "Completed",
      timerTitle: "Hold timer",
      timerSubtitle: "Time your static holds.",
      start: "Start",
      pause: "Pause",
      resume: "Resume",
      resetTimer: "Reset",
      notesTitle: "Personal notes",
      notesPlaceholder: "Write your notes, sensations, programming...",
      notesSaved: "Notes saved",
      skillNotFound: "Skill not found.",
      backHome: "Back home",
    },
    toast: {
      progressSaved: "Progress saved",
      progressionCleared: "Progression cleared",
      progressReset: "Progress reset",
      languageChanged: "Language updated",
    },
  },
  es: {
    app: {
      tagline: "Maestría de Skills",
      heroBadge: "Registra cada rep",
      heroTitle1: "Domina lo",
      heroTitle2: "imposible.",
      heroSubtitle:
        "Tu viaje personal de calistenia. Registra cada progresión, desde tu primer pull-up hasta la cruz de hierro.",
      statsSkills: "Skills",
      statsActive: "Activas",
      statsMastered: "Dominadas",
      sectionEyebrow: "El arsenal",
      sectionTitle: "Elige tu skill",
      sectionHint: "Toca una skill para registrar el progreso",
      inProgress: "en curso",
      notStarted: "Sin iniciar",
      footer: "Hecho para los incansables · CALIS.TRACK",
    },
    card: { notStarted: "Sin iniciar" },
    detail: {
      back: "Todas las skills",
      currentLevel: "Nivel actual",
      notStarted: "Sin iniciar",
      reset: "Reset",
      mastery: "Maestría",
      pathEyebrow: "Progresiones",
      pathTitle: "El camino",
      pathSubtitle: "Toca tu nivel actual. Tu progreso se guarda automáticamente.",
      current: "Actual",
      completed: "Completada",
      timerTitle: "Cronómetro de hold",
      timerSubtitle: "Mide tus mantenimientos estáticos.",
      start: "Iniciar",
      pause: "Pausa",
      resume: "Reanudar",
      resetTimer: "Reset",
      notesTitle: "Notas personales",
      notesPlaceholder: "Escribe tus notas, sensaciones, planificación...",
      notesSaved: "Notas guardadas",
      skillNotFound: "Skill no encontrada.",
      backHome: "Volver al inicio",
    },
    toast: {
      progressSaved: "Progreso guardado",
      progressionCleared: "Progresión borrada",
      progressReset: "Progreso reiniciado",
      languageChanged: "Idioma actualizado",
    },
  },
};
