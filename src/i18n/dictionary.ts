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
    nav: { skills: string; records: string };
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
  load: {
    title: string;
    none: string;
    weight: string;
    band: string;
    kgPlaceholder: string;
    selectBand: string;
    bands: {
      microband: string;
      "red-thin": string;
      yellow: string;
      orange: string;
      red: string;
      purple: string;
      blue: string;
    };
    saved: string;
    edit: string;
    cancel: string;
    save: string;
    performance: string;
    loadType: string;
    sets: string;
    addMax: string;
  };
  history: {
    title: string;
    subtitle: string;
    empty: string;
    achieved: string;
    remove: string;
  };
  records: {
    title: string;
    subtitle: string;
    eyebrow: string;
    seconds: string;
    reps: string;
    kg: string;
    note: string;
    notePlaceholder: string;
    save: string;
    saved: string;
    clear: string;
    empty: string;
    updatedAt: string;
    edit: string;
    viewOnlyHint: string;
    totalPRs: string;
    emptyHint: string;
  };
  toast: {
    progressSaved: string;
    progressionCleared: string;
    progressReset: string;
    languageChanged: string;
    loadSaved: string;
    historyAdded: string;
    historyRemoved: string;
    maxSaved: string;
    maxCleared: string;
  };
};

export const dict: Record<Lang, Dict> = {
  it: {
    app: {
      tagline: "LA NOSTRA APP PER LE TUE PROGRESSIONI",
      heroBadge: "TRACCIA I TUOI PROGRESSI",
      heroTitle1: "Padroneggia",
      heroTitle2: "l'impossibile.",
      heroSubtitle:
        "Il tuo percorso personale di Calisthenics. Traccia ogni progressione, dal primo pull-up alla planche.",
      statsSkills: "Skill",
      statsActive: "Attive",
      statsMastered: "Padroneggiate",
      sectionEyebrow: "SKILLS",
      sectionTitle: "Scegli la tua skill",
      sectionHint: "Tocca una skill per tracciare i progressi",
      inProgress: "in corso",
      notStarted: "Non iniziata",
      footer: "COSTRUITO PER CHI VUOLE IL MEGLIO",
      nav: { skills: "Skill", records: "Massimali" },
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
    load: {
      title: "Carico",
      none: "Nessuno",
      weight: "Zavorra (kg)",
      band: "Elastico",
      kgPlaceholder: "es. 10 (oppure -10 se assistito)",
      selectBand: "Scegli l'elastico",
      bands: {
        microband: "Microband",
        "red-thin": "Rossa fine",
        yellow: "Gialla",
        orange: "Arancione",
        red: "Rossa",
        purple: "Viola",
        blue: "Blu",
      },
      saved: "Carico salvato",
      edit: "Carico",
      cancel: "Annulla",
      save: "Salva",
      performance: "Performance",
      loadType: "Tipo di carico",
      sets: "Serie",
      addMax: "Aggiungi massimale",
    },
    history: {
      title: "Storico progressioni",
      subtitle: "Le date in cui hai sbloccato ogni step.",
      empty: "Nessuna progressione raggiunta ancora.",
      achieved: "Raggiunta il",
      remove: "Rimuovi",
    },
    records: {
      title: "Massimali",
      subtitle: "I tuoi PR per ogni skill: secondi, ripetizioni, kg.",
      eyebrow: "Personal Records",
      seconds: "Secondi",
      reps: "Ripetizioni",
      kg: "Kg",
      note: "Nota",
      notePlaceholder: "es. Front lever straddle, presa stretta...",
      save: "Salva PR",
      saved: "PR salvato",
      clear: "Cancella",
      empty: "Nessun massimale registrato",
      updatedAt: "Aggiornato il",
      edit: "Modifica",
      viewOnlyHint:
        "Questi sono i tuoi PR salvati per ogni propedeutica. Per aggiungerne o modificarli, vai sulla skill specifica.",
      totalPRs: "PR totali",
      emptyHint: "Apri una skill e tocca una propedeutica per salvare secondi, serie, ripetizioni o carico.",
    },
    toast: {
      progressSaved: "Progresso salvato",
      progressionCleared: "Progressione azzerata",
      progressReset: "Progresso resettato",
      languageChanged: "Lingua aggiornata",
      loadSaved: "Carico aggiornato",
      historyAdded: "Aggiunto allo storico",
      historyRemoved: "Rimosso dallo storico",
      maxSaved: "Massimale salvato",
      maxCleared: "Massimale rimosso",
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
      nav: { skills: "Skills", records: "Records" },
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
    load: {
      title: "Load",
      none: "None",
      weight: "Weight (kg)",
      band: "Band",
      kgPlaceholder: "e.g. 10 (or -10 if assisted)",
      selectBand: "Choose band",
      bands: {
        microband: "Microband",
        "red-thin": "Thin red",
        yellow: "Yellow",
        orange: "Orange",
        red: "Red",
        purple: "Purple",
        blue: "Blue",
      },
      saved: "Load saved",
      edit: "Load",
      cancel: "Cancel",
      save: "Save",
      performance: "Performance",
      loadType: "Load type",
      sets: "Sets",
      addMax: "Add max",
    },
    history: {
      title: "Progression history",
      subtitle: "Dates you unlocked each step.",
      empty: "No progression reached yet.",
      achieved: "Achieved on",
      remove: "Remove",
    },
    records: {
      title: "Personal Records",
      subtitle: "Your PRs for every skill: seconds, reps, kg.",
      eyebrow: "Personal Records",
      seconds: "Seconds",
      reps: "Reps",
      kg: "Kg",
      note: "Note",
      notePlaceholder: "e.g. Front lever straddle, narrow grip...",
      save: "Save PR",
      saved: "PR saved",
      clear: "Clear",
      empty: "No records logged yet",
      updatedAt: "Updated on",
      edit: "Edit",
      viewOnlyHint:
        "These are your saved PRs for each progression. To add or edit them, open the specific skill.",
      totalPRs: "Total PRs",
      emptyHint: "Open a skill and tap a progression to log seconds, sets, reps or load.",
    },
    toast: {
      progressSaved: "Progress saved",
      progressionCleared: "Progression cleared",
      progressReset: "Progress reset",
      languageChanged: "Language updated",
      loadSaved: "Load updated",
      historyAdded: "Added to history",
      historyRemoved: "Removed from history",
      maxSaved: "PR saved",
      maxCleared: "PR cleared",
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
      nav: { skills: "Skills", records: "Récords" },
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
    load: {
      title: "Carga",
      none: "Ninguna",
      weight: "Lastre (kg)",
      band: "Banda elástica",
      kgPlaceholder: "ej. 10 (o -10 si asistido)",
      selectBand: "Elige la banda",
      bands: {
        microband: "Microband",
        "red-thin": "Roja fina",
        yellow: "Amarilla",
        orange: "Naranja",
        red: "Roja",
        purple: "Morada",
        blue: "Azul",
      },
      saved: "Carga guardada",
      edit: "Carga",
      cancel: "Cancelar",
      save: "Guardar",
      performance: "Rendimiento",
      loadType: "Tipo de carga",
      sets: "Series",
      addMax: "Añadir máximo",
    },
    history: {
      title: "Historial de progresiones",
      subtitle: "Fechas en que desbloqueaste cada paso.",
      empty: "Aún no has alcanzado ninguna progresión.",
      achieved: "Conseguida el",
      remove: "Quitar",
    },
    records: {
      title: "Récords personales",
      subtitle: "Tus PRs por cada skill: segundos, reps, kg.",
      eyebrow: "Personal Records",
      seconds: "Segundos",
      reps: "Reps",
      kg: "Kg",
      note: "Nota",
      notePlaceholder: "ej. Front lever straddle, agarre cerrado...",
      save: "Guardar PR",
      saved: "PR guardado",
      clear: "Borrar",
      empty: "Sin récords registrados",
      updatedAt: "Actualizado el",
      edit: "Editar",
      viewOnlyHint:
        "Estos son tus PRs guardados por cada progresión. Para añadirlos o editarlos, abre la skill específica.",
      totalPRs: "PRs totales",
      emptyHint: "Abre una skill y toca una progresión para guardar segundos, series, reps o carga.",
    },
    toast: {
      progressSaved: "Progreso guardado",
      progressionCleared: "Progresión borrada",
      progressReset: "Progreso reiniciado",
      languageChanged: "Idioma actualizado",
      loadSaved: "Carga actualizada",
      historyAdded: "Añadido al historial",
      historyRemoved: "Quitado del historial",
      maxSaved: "Récord guardado",
      maxCleared: "Récord eliminado",
    },
  },
};
