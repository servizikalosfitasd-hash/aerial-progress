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
    nav: { skills: string; records: string; circuits: string; stability: string };
  };
  card: {
    notStarted: string;
    lockedTitle: string;
    lockedHint: string;
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
    accessoriesTitle: string;
    accessoriesSubtitle: string;
    selectableTitle: string;
    selectableHint: string;
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
    addMaxHint: string;
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
  circuits: {
    eyebrow: string;
    title: string;
    subtitle: string;
    newCircuit: string;
    empty: string;
    emptyHint: string;
    namePlaceholder: string;
    delete: string;
    removed: string;
    exercises: string;
    addExercise: string;
    noExercises: string;
    exerciseName: string;
    reps: string;
    seconds: string;
    rest: string;
    workSec: string;
    restSec: string;
    cycles: string;
    totalMinutes: string;
    rounds: string;
    timer: string;
    work: string;
    done: string;
    cycle: string;
    tabataDone: string;
    types: { HIIT: string; EMOM: string; AMRAP: string; TABATA: string; LEGS: string; ABS: string };
  };
  stability: {
    eyebrow: string;
    title: string;
    subtitle: string;
    addPlaceholder: string;
    add: string;
    empty: string;
    saved: string;
    seconds: string;
    reps: string;
    sets: string;
    notes: string;
    notesPlaceholder: string;
    joints: {
      cervical: string;
      shoulders: string;
      elbows: string;
      wrists: string;
      knees: string;
      hips: string;
      ankles: string;
      spine: string;
    };
  };
};

export const dict: Record<Lang, Dict> = {
  it: {
    app: {
      tagline: "TRACCIA. EVOLVI. SUPERATI.",
      heroBadge: "TRACCIA I TUOI PROGRESSI",
      heroTitle1: "SFIDA",
      heroTitle2: "LA GRAVITA'",
      heroSubtitle:
        "Il tuo percorso personale di Calisthenics. Traccia ogni progressione, dal primo pull-up alla planche.",
      statsSkills: "Skill",
      statsActive: "Attive",
      statsMastered: "INIZIATE",
      sectionEyebrow: "SKILLS",
      sectionTitle: "Scegli la tua skill",
      sectionHint: "Tocca una skill per tracciare i progressi",
      inProgress: "in corso",
      notStarted: "Non iniziata",
      footer: "COSTRUITO PER CHI VUOLE IL MEGLIO",
      nav: { skills: "Skill", records: "Massimali", circuits: "Circuiti", stability: "Stability" },
    },
    card: { notStarted: "Non iniziata", lockedTitle: "Bloccata", lockedHint: "Completa:" },
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
      accessoriesTitle: "Esercizi accessori",
      accessoriesSubtitle: "Skill",
      selectableTitle: "Seleziona esercizi per la scheda",
      selectableHint: "Tocca un esercizio per aggiungerlo alla tua scheda di allenamento. Personalizza serie, ripetizioni e recupero senza vincoli.",
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
      addMax: "Aggiorna progresso",
      addMaxHint: "Inserisci reps, secondi, serie, zavorra etc.",
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
    circuits: {
      eyebrow: "Allenamento",
      title: "Circuiti",
      subtitle: "Crea HIIT, EMOM, AMRAP, Tabata e circuiti gambe/addome con timer integrato.",
      newCircuit: "Nuovo circuito",
      empty: "Nessun circuito",
      emptyHint: "Aggiungi un circuito qui sopra per iniziare.",
      namePlaceholder: "Nome del circuito",
      delete: "Elimina",
      removed: "Circuito eliminato",
      exercises: "Esercizi",
      addExercise: "Aggiungi esercizio",
      noExercises: "Nessun esercizio. Aggiungine uno.",
      exerciseName: "Nome esercizio",
      reps: "Reps",
      seconds: "Secondi",
      rest: "Recupero",
      workSec: "Lavoro (s)",
      restSec: "Recupero (s)",
      cycles: "Cicli",
      totalMinutes: "Minuti totali",
      rounds: "Round",
      timer: "Cronometro",
      work: "Lavoro",
      done: "Fine",
      cycle: "Ciclo",
      tabataDone: "Tabata completato!",
      types: { HIIT: "HIIT", EMOM: "EMOM", AMRAP: "AMRAP", TABATA: "TABATA", LEGS: "Circuito gambe", ABS: "Circuito addome" },
    },
    stability: {
      eyebrow: "Mobilità & Forza",
      title: "Stability",
      subtitle: "Esercizi di rinforzo articolare. Tocca un'articolazione per gestire i tuoi esercizi.",
      addPlaceholder: "Nome esercizio",
      add: "Aggiungi",
      empty: "Nessun esercizio. Aggiungine uno qui sotto.",
      saved: "Salvato",
      seconds: "Secondi",
      reps: "Ripetizioni",
      sets: "Serie",
      notes: "Note",
      notesPlaceholder: "Note (opzionale)",
      joints: {
        cervical: "Cervicale",
        shoulders: "Spalle",
        elbows: "Gomiti",
        wrists: "Polsi",
        knees: "Ginocchia",
        hips: "Anche",
        ankles: "Caviglie",
        spine: "Colonna Vertebrale",
      },
    },
  },
  en: {
    app: {
      tagline: "OUR APP FOR YOU",
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
      nav: { skills: "Skills", records: "Records", circuits: "Circuits", stability: "Stability" },
    },
    card: { notStarted: "Not started", lockedTitle: "Locked", lockedHint: "Complete:" },
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
      accessoriesTitle: "Accessory exercises",
      accessoriesSubtitle: "Skill",
      selectableTitle: "Select exercises for your plan",
      selectableHint: "Tap an exercise to add it to your training plan. Customize sets, reps and recovery freely.",
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
      addMax: "Update progress",
      addMaxHint: "Enter reps, seconds, sets, load, etc.",
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
    circuits: {
      eyebrow: "Training",
      title: "Circuits",
      subtitle: "Build HIIT, EMOM, AMRAP, Tabata and leg/ab circuits with an integrated timer.",
      newCircuit: "New circuit",
      empty: "No circuits yet",
      emptyHint: "Add a circuit above to get started.",
      namePlaceholder: "Circuit name",
      delete: "Delete",
      removed: "Circuit removed",
      exercises: "Exercises",
      addExercise: "Add exercise",
      noExercises: "No exercises yet. Add one.",
      exerciseName: "Exercise name",
      reps: "Reps",
      seconds: "Seconds",
      rest: "Rest",
      workSec: "Work (s)",
      restSec: "Rest (s)",
      cycles: "Cycles",
      totalMinutes: "Total minutes",
      rounds: "Rounds",
      timer: "Timer",
      work: "Work",
      done: "Done",
      cycle: "Cycle",
      tabataDone: "Tabata complete!",
      types: { HIIT: "HIIT", EMOM: "EMOM", AMRAP: "AMRAP", TABATA: "TABATA", LEGS: "Leg circuit", ABS: "Ab circuit" },
    },
    stability: {
      eyebrow: "Mobility & Strength",
      title: "Stability",
      subtitle: "Joint reinforcement exercises. Tap a joint to manage your exercises.",
      addPlaceholder: "Exercise name",
      add: "Add",
      empty: "No exercises yet. Add one below.",
      saved: "Saved",
      seconds: "Seconds",
      reps: "Reps",
      sets: "Sets",
      notes: "Notes",
      notesPlaceholder: "Notes (optional)",
      joints: {
        cervical: "Cervical",
        shoulders: "Shoulders",
        elbows: "Elbows",
        wrists: "Wrists",
        knees: "Knees",
        hips: "Hips",
        ankles: "Ankles",
        spine: "Spine",
      },
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
      nav: { skills: "Skills", records: "Récords", circuits: "Circuitos", stability: "Stability" },
    },
    card: { notStarted: "Sin iniciar", lockedTitle: "Bloqueada", lockedHint: "Completa:" },
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
      accessoriesTitle: "Ejercicios accesorios",
      accessoriesSubtitle: "Skill",
      selectableTitle: "Selecciona ejercicios para tu plan",
      selectableHint: "Toca un ejercicio para añadirlo a tu plan de entrenamiento. Personaliza series, repeticiones y descanso libremente.",
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
      addMax: "Actualizar progreso",
      addMaxHint: "Introduce reps, segundos, series, lastre, etc.",
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
    circuits: {
      eyebrow: "Entrenamiento",
      title: "Circuitos",
      subtitle: "Crea HIIT, EMOM, AMRAP, Tabata y circuitos de piernas/abdomen con temporizador integrado.",
      newCircuit: "Nuevo circuito",
      empty: "Sin circuitos",
      emptyHint: "Añade un circuito arriba para empezar.",
      namePlaceholder: "Nombre del circuito",
      delete: "Eliminar",
      removed: "Circuito eliminado",
      exercises: "Ejercicios",
      addExercise: "Añadir ejercicio",
      noExercises: "Sin ejercicios. Añade uno.",
      exerciseName: "Nombre del ejercicio",
      reps: "Reps",
      seconds: "Segundos",
      rest: "Descanso",
      workSec: "Trabajo (s)",
      restSec: "Descanso (s)",
      cycles: "Ciclos",
      totalMinutes: "Minutos totales",
      rounds: "Rondas",
      timer: "Cronómetro",
      work: "Trabajo",
      done: "Fin",
      cycle: "Ciclo",
      tabataDone: "¡Tabata completado!",
      types: { HIIT: "HIIT", EMOM: "EMOM", AMRAP: "AMRAP", TABATA: "TABATA", LEGS: "Circuito piernas", ABS: "Circuito abdomen" },
    },
    stability: {
      eyebrow: "Movilidad y Fuerza",
      title: "Stability",
      subtitle: "Ejercicios de refuerzo articular. Toca una articulación para gestionar tus ejercicios.",
      addPlaceholder: "Nombre del ejercicio",
      add: "Añadir",
      empty: "Sin ejercicios. Añade uno abajo.",
      saved: "Guardado",
      seconds: "Segundos",
      reps: "Repeticiones",
      sets: "Series",
      notes: "Notas",
      notesPlaceholder: "Notas (opcional)",
      joints: {
        cervical: "Cervical",
        shoulders: "Hombros",
        elbows: "Codos",
        wrists: "Muñecas",
        knees: "Rodillas",
        hips: "Caderas",
        ankles: "Tobillos",
        spine: "Columna",
      },
    },
  },
};
