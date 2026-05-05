import frontLever from "@/assets/skill-front-lever.jpg";
import planche from "@/assets/skill-planche.jpg";
import humanFlag from "@/assets/skill-human-flag.jpg";
import ironCross from "@/assets/skill-iron-cross.jpg";
import impossibleDips from "@/assets/skill-impossible-dips.jpg";
import hefesto from "@/assets/skill-hefesto.jpg";
import pull from "@/assets/skill-pull.jpg";
import push from "@/assets/skill-push.jpg";
import manna from "@/assets/skill-manna.jpg";
import handstand from "@/assets/skill-handstand.jpg";
import pressHandstand from "@/assets/skill-press-handstand.jpg";
import backLever from "@/assets/skill-back-lever.jpg";
import muscleUpRings from "@/assets/skill-muscle-up-rings.jpg";
import muscleUpBar from "@/assets/skill-muscle-up-bar.jpg";
import victorian from "@/assets/skill-victorian.jpg";
import maltese from "@/assets/skill-maltese.jpg";
import handstandOneArm from "@/assets/skill-handstand-one-arm.jpg";
import pelican from "@/assets/skill-pelican.jpg";
import reverseMuscleUp from "@/assets/skill-reverse-muscle-up.jpg";
import legs from "@/assets/skill-legs.jpg";

export type Difficulty = string;
export type Lang = "it" | "en" | "es";

export interface ProgressionGroup {
  id: string;
  label: Record<Lang, string>;
  progressions: string[];
  hasTimer?: boolean;
}

export interface AccessoryExercise {
  name: string;
}

export interface LockRequirement {
  /** Skill must be fully completed (all groups, last progression reached) */
  skillId: string;
}

export interface Skill {
  id: string;
  name: Record<Lang, string>;
  category: Record<Lang, string>;
  difficulty: Difficulty;
  image: string;
  description: Record<Lang, string>;
  groups: ProgressionGroup[];
  accessories?: string[];
  /** All listed skills must be fully completed to unlock this skill */
  requires?: string[];
}

const t = (it: string, en: string, es: string): Record<Lang, string> => ({ it, en, es });

const labelIso = t("Isometria", "Isometric", "Isometría");
const labelDyn = t("Dinamico", "Dynamic", "Dinámico");
const labelPow = t("Potenziamento", "Strength", "Potenciación");
const labelMain = t("Progressione", "Progression", "Progresión");
const emptyCat = t("\n", "\n", "\n");

export const skills: Skill[] = [
  {
    id: "front-lever",
    name: t("Front Lever", "Front Lever", "Front Lever"),
    category: emptyCat,
    difficulty: "TIRATA",
    image: frontLever,
    description: t(
      "Tenuta orizzontale con il corpo rivolto verso l'alto, sospesi alla sbarra.",
      "Horizontal hold facing up, suspended from the bar.",
      "Mantenimiento horizontal mirando hacia arriba, suspendido de la barra.",
    ),
    accessories: ["Tirata con manubri o elastici"],
    groups: [
      {
        id: "iso",
        label: labelIso,
        hasTimer: true,
        progressions: [
          "Barchetta Tuck", "Barchetta one Leg", "Barchetta gambe divaricate", "Barchetta gambe distese",
          "Tuck Dragon Flag", "Dragon Flag one leg", "Dragon Flag Straddle", "Dragon Flag",
          "Tuck front Verticale", "Tuck front 70°", "Tuck Front 50°", "Tuck Front 30°",
          "Tuck Front", "Tuck Front Straddle", "Tuck Front Advanced",
          "Front One leg", "Front One leg Advanced", "Front Halflay one leg",
          "Front Halflay Divaricato", "Front Halflay", "Front Straddle", "Front Lever",
        ],
      },
      {
        id: "dynamic",
        label: labelDyn,
        progressions: [
          "Barchetta tuck rock", "Barchetta one Leg rock", "Barchetta gambe divaricate rock", "Barchetta gambe distese rock",
          "Tuck Front Pulse/Rise", "Tuck Front Divaricato Pulse/Rise", "Tuck Front Advanced Pulse/Rise",
          "Front One leg facile Pulse/Rise", "Front One leg Advanced Pulse/Rise", "Front One leg Pulse/Rise",
          "Front Halflay Divaricato Pulse/Rise", "Front Halflay Pulse/Rise",
          "Front Lever straddle Pulse/Rise", "Front Lever Pulse/Rise",
        ],
      },
      {
        id: "power",
        label: labelPow,
        progressions: [
          "Tuck Front Pull up", "Tuck Front Divaricato pull up", "Tuck Front Advanced pull up",
          "Front One leg facile pull up", "Front One leg Advanced pull up", "Front One leg pull up",
          "Front Halflay Divaricato pull up", "Front Halflay pull up",
          "Front Lever straddle pull up", "Front Lever pull up",
        ],
      },
    ],
  },
  {
    id: "victorian",
    name: t("Victorian", "Victorian", "Victorian"),
    category: emptyCat,
    difficulty: "TIRATA",
    image: victorian,
    requires: ["front-lever"],
    description: t(
      "Tenuta estrema alle parallele/dream machine, corpo orizzontale verso l'alto con braccia tese ai lati.",
      "Extreme hold on parallel bars/dream machine, body horizontal facing up with arms extended at sides.",
      "Mantenimiento extremo en paralelas/dream machine, cuerpo horizontal mirando arriba con brazos extendidos a los lados.",
    ),
    groups: [
      {
        id: "iso",
        label: labelIso,
        hasTimer: true,
        progressions: [
          "Tuck Victorian parallele", "Tuck Victorian Straddle parallele", "Tuck Victorian Advanced parallele",
          "Victorian One leg parallele", "Victorian One leg Advanced parallele",
          "Victorian Halflay one leg parallele", "Victorian Halflay Divaricato parallele",
          "Victorian Halflay parallele", "Victorian Straddle parallele", "Victorian Parallele",
          "Victorian Tuck Dream Machine", "Tuck Victorian Straddle dream machine", "Tuck Victorian Advanced dream machine",
          "Victorian One leg dream machine", "Victorian One leg Advanced dream machine",
          "Victorian Halflay one leg dream machine", "Victorian Halflay Divaricato dream machine",
          "Victorian Halflay dream machine", "Victorian Straddle dream machine", "Victorian Dream machine",
        ],
      },
      {
        id: "dynamic",
        label: labelDyn,
        progressions: [
          "Tuck Victorian rise parallele", "Tuck Victorian Straddle rise parallele", "Tuck Victorian Advanced rise parallele",
          "Victorian One leg rise parallele", "Victorian One leg Advanced rise parallele",
          "Victorian Halflay one leg rise parallele", "Victorian Halflay Divaricato rise parallele",
          "Victorian Halflay rise parallele", "Victorian Straddle rise parallele", "Victorian Rise parallele",
          "Victorian Tuck Dinamico dream machine", "Tuck Victorian Straddle dinamico dream machine",
          "Tuck Victorian Advanced dinamico dream machine", "Victorian One leg dinamico dream machine",
          "Victorian One leg Advanced dinamico dream machine", "Victorian Halflay one leg dinamico dream machine",
          "Victorian Halflay Divaricato dinamico dream machine", "Victorian Halflay dinamico dream machine",
          "Victorian Straddle dinamico dream machine", "Victorian Dinamico dream machine",
        ],
      },
    ],
  },
  {
    id: "planche",
    name: t("Planche", "Planche", "Planche"),
    category: emptyCat,
    difficulty: "SPINTA",
    image: planche,
    accessories: ["Spinte con manubri o elastici"],
    description: t(
      "Corpo orizzontale parallelo al suolo, sostenuto solo dalle braccia tese.",
      "Body parallel to the ground, supported only by straight arms.",
      "Cuerpo paralelo al suelo, sostenido solo por brazos rectos.",
    ),
    groups: [
      {
        id: "iso",
        label: labelIso,
        hasTimer: true,
        progressions: [
          "Plank", "Plank Sbilanciato", "Plank sbilanciato rialzo",
          "Frog Stand", "Frog Stand Advanced",
          "Tuck Planche", "Tuck Planche Divaricato", "Tuck Planche Advanced",
          "Planche One leg facile", "Planche One leg Advanced",
          "Planche Halflay one leg", "Planche Halflay Divaricato", "Planche Halflay",
          "Planche straddle", "Planche",
        ],
      },
      {
        id: "dynamic",
        label: labelDyn,
        progressions: [
          "Plank lean", "Plank Sbilanciato lean", "Plank sbilanciato rialzo lean",
          "Tuck Planche lean", "Tuck Planche Divaricato lean", "Tuck Planche Advanced lean",
          "Planche One leg facile lean", "Planche One leg Advanced lean",
          "Planche Halflay one leg lean", "Planche Halflay Divaricato lean", "Planche Halflay lean",
          "Planche straddle lean", "Planche lean",
        ],
      },
      {
        id: "power",
        label: labelPow,
        progressions: [
          "Planck push up", "Planck Sbilanciato push up", "Plank sbilanciato rialzo push up",
          "Tuck Planche push up", "Tuck Planche Divaricato push up", "Tuck Planche Advanced push up",
          "Planche One leg facile push up", "Planche One leg Advanced push up",
          "Planche Halflay one leg push up", "Planche Halflay Divaricato push up", "Planche Halflay push up",
          "Planche straddle push up", "Planche push up",
        ],
      },
    ],
  },
  {
    id: "maltese",
    name: t("Maltese", "Maltese", "Maltese"),
    category: emptyCat,
    difficulty: "SPINTA",
    image: maltese,
    requires: ["planche"],
    description: t(
      "Tenuta estrema con corpo orizzontale verso il basso e braccia tese ai lati.",
      "Extreme hold with body horizontal facing down and arms extended at sides.",
      "Mantenimiento extremo con cuerpo horizontal hacia abajo y brazos extendidos a los lados.",
    ),
    groups: [
      {
        id: "iso",
        label: labelIso,
        hasTimer: true,
        progressions: [
          "Tuck Maltese parallele", "Tuck Maltese Straddle parallele", "Tuck Maltese Advanced parallele",
          "Maltese One leg parallele", "Maltese One leg Advanced parallele",
          "Maltese Halflay one leg parallele", "Maltese Halflay Divaricato parallele",
          "Maltese Halflay parallele", "Maltese Straddle parallele", "Maltese Parallele",
          "Maltese Tuck Dream Machine", "Tuck Maltese Straddle dream machine", "Tuck Maltese Advanced dream machine",
          "Maltese One leg dream machine", "Maltese One leg Advanced dream machine",
          "Maltese Halflay one leg dream machine", "Maltese Halflay Divaricato dream machine",
          "Maltese Halflay dream machine", "Maltese Straddle dream machine", "Maltese Dream machine",
        ],
      },
      {
        id: "dynamic",
        label: labelDyn,
        progressions: [
          "Tuck Maltese rise parallele", "Tuck Maltese Straddle rise parallele", "Tuck Maltese Advanced rise parallele",
          "Maltese One leg rise parallele", "Maltese One leg Advanced rise parallele",
          "Maltese Halflay one leg rise parallele", "Maltese Halflay Divaricato rise parallele",
          "Maltese Halflay rise parallele", "Maltese Straddle rise parallele", "Maltese Rise parallele",
          "Maltese Tuck Dinamico dream machine", "Tuck Maltese Straddle dinamico dream machine",
          "Tuck Maltese Advanced dinamico dream machine", "Maltese One leg dinamico dream machine",
          "Maltese One leg Advanced dinamico dream machine", "Maltese Halflay one leg dinamico dream machine",
          "Maltese Halflay Divaricato dinamico dream machine", "Maltese Halflay dinamico dream machine",
          "Maltese Straddle dinamico dream machine", "Maltese Dinamico dream machine",
        ],
      },
    ],
  },
  {
    id: "handstand",
    name: t("Handstand", "Handstand", "Handstand"),
    category: emptyCat,
    difficulty: "SPINTA",
    image: handstand,
    accessories: [
      "Spinte indietro con elastico",
      "Sbilanciamenti",
      "Potenziamento dita in Half lay",
    ],
    description: t(
      "Equilibrio invertito sulle mani con il corpo allineato.",
      "Inverted balance on the hands with the body aligned.",
      "Equilibrio invertido sobre las manos con el cuerpo alineado.",
    ),
    groups: [
      {
        id: "iso",
        label: labelIso,
        hasTimer: true,
        progressions: [
          "Tripod 1", "Tripod 2", "Tripod 3", "Forearm Headstand",
          "1/2 HS Spalliera", "Wall Hs obliquo", "Wall Hs", "Run Wall Hs",
          "Hs Shrug", "Wall Hs Scissor", "Hs",
        ],
      },
      {
        id: "power",
        label: labelPow,
        progressions: [
          "V-Push up", "V-Push up rialzo", "V-Push up anelli", "V-Push up anelli rialzo",
          "Hs push Up negativi Muro", "Hs Push up Muro", "Hs Push up rialzo",
          "Hs Push up Negativi Liberi", "Hs Push up solo Salire", "Hs Push up",
        ],
      },
    ],
  },
  {
    id: "handstand-one-arm",
    name: t("Handstand One Arm", "One Arm Handstand", "Pino a un brazo"),
    category: emptyCat,
    difficulty: "SPINTA",
    image: handstandOneArm,
    requires: ["handstand"],
    description: t(
      "Equilibrio invertito su un solo braccio.",
      "Inverted balance on a single arm.",
      "Equilibrio invertido sobre un solo brazo.",
    ),
    groups: [
      {
        id: "iso",
        label: labelIso,
        hasTimer: true,
        progressions: [
          "Hs Shift parziale", "Hs Shift completo", "Hs One Arm fingertip",
          "Hs One Arm spotted", "Hs One Arm tuck", "Hs One Arm straddle",
          "Hs One Arm",
        ],
      },
    ],
  },
  {
    id: "press-handstand",
    name: t("Press to Handstand", "Press to Handstand", "Press to Handstand"),
    category: emptyCat,
    difficulty: "SPINTA",
    image: pressHandstand,
    accessories: [
      "Scivolini gambe tese",
      "Sit leg Raise con cubetti yoga",
      "Dischi",
      "Pike Bended Leg to L-sit",
      "Salite sulle Parallele",
    ],
    description: t(
      "Salita controllata in verticale dalle gambe.",
      "Controlled press into a handstand from the legs.",
      "Subida controlada al pino desde las piernas.",
    ),
    groups: [
      {
        id: "main",
        label: labelMain,
        progressions: [
          "Plank Press", "Vertical Press 1", "Vertical Press 2", "Vertical Press 3", "Press Walk",
          "1/2 Press 1", "1/2 Press 2", "1/2 Press 3", "1/2 Press 4",
          "Negative Tuck press", "Negative Straddle press", "Negative Pike press",
          "Press Tuck", "Press Straddle", "Press Pike", "Press L-sit", "Press to HS",
        ],
      },
    ],
  },
  {
    id: "back-lever",
    name: t("Back Lever", "Back Lever", "Back Lever"),
    category: emptyCat,
    difficulty: "SPINTA",
    image: backLever,
    description: t(
      "Tenuta orizzontale con il corpo rivolto verso il basso.",
      "Horizontal hold with the body facing down.",
      "Mantenimiento horizontal con el cuerpo mirando hacia abajo.",
    ),
    groups: [
      {
        id: "iso",
        label: labelIso,
        hasTimer: true,
        progressions: [
          "Assisted German Hang", "German Hang", "German Hang anelli",
          "Tuck Back", "Tuck Back Divaricato", "Tuck Back Advanced",
          "Back One leg facile", "Back One leg Advanced",
          "Back Halflay one leg", "Back Halflay Divaricato", "Back Halflay",
          "Back Lever straddle", "Back Lever",
        ],
      },
      {
        id: "dynamic",
        label: labelDyn,
        progressions: [
          "German Hang a terra", "Skin the cat",
          "Pulse/Rise Tuck Back", "Pulse/Rise Tuck Back Divaricato", "Pulse/Rise Tuck Back Advanced",
          "Pulse/Rise Back One leg facile", "Pulse/Rise Back One leg Advanced",
          "Pulse/Rise Back Halflay one leg", "Pulse/Rise Back Halflay Divaricato", "Pulse/Rise Back Halflay",
          "Pulse/Rise Back Lever straddle", "Pulse/Rise Back Lever",
        ],
      },
    ],
  },
  {
    id: "manna",
    name: t("Manna", "Manna", "Manna"),
    category: emptyCat,
    difficulty: "SPINTA",
    image: manna,
    description: t(
      "Tenuta estrema in compressione con i piedi sopra la testa.",
      "Extreme compression hold with feet above the head.",
      "Mantenimiento extremo en compresión con los pies sobre la cabeza.",
    ),
    groups: [
      {
        id: "main",
        label: labelMain,
        hasTimer: true,
        progressions: [
          "Tuck up", "Straddle up", "v-up", "Half-Tuck", "Half hanging leg lift",
          "Negative Hanging leg lit", "Half l-sit", "Half double extension",
          "l-sit scissor", "l-ist", "1/2 straddle", "1/2 straddle l-single extension",
          "1/2 straddle l-double extension", "straddle l", "middle split hold", "Manna",
        ],
      },
    ],
  },
  {
    id: "impossible-dips",
    name: t("Impossible Dips", "Impossible Dips", "Impossible Dips"),
    category: emptyCat,
    difficulty: "SPINTA",
    image: impossibleDips,
    description: t(
      "Dip estremi con braccia dietro al corpo.",
      "Extreme dips with arms behind the body.",
      "Fondos extremos con brazos detrás del cuerpo.",
    ),
    groups: [
      {
        id: "main",
        label: labelMain,
        progressions: [
          "Estensione tricipiti spalliera 1", "Estensione tricipiti spalliera 2",
          "Estensione tricipiti spalliera 3", "Estensione tricipiti spalliera 4",
          "Impossible Dips",
        ],
      },
    ],
  },
  {
    id: "human-flag",
    name: t("Human Flag", "Human Flag", "Human Flag"),
    category: emptyCat,
    difficulty: "TIRATA/SPINTA",
    image: humanFlag,
    description: t(
      "Corpo orizzontale aggrappato a un palo verticale.",
      "Body horizontal gripping a vertical pole.",
      "Cuerpo horizontal agarrado a una barra vertical.",
    ),
    groups: [
      {
        id: "iso",
        label: labelIso,
        hasTimer: true,
        progressions: [
          "Side Plank", "Side Plank Star", "Blocco frontale", "Blocco Laterale", "Blocco Inverso",
          "HF Tuck", "HF One leg", "HF Divaricato", "Human Flag",
        ],
      },
      {
        id: "dynamic",
        label: labelDyn,
        progressions: [
          "Side Plank rotazioni", "Side Plank Star rotazioni", "Blocco frontale",
          "Blocco Laterale rotazioni", "Blocco Inverso tuck", "Blocco Inverso tuck to blocco inverso",
          "Blocco frontale to HF Tuck", "Blocco frontale to HF One leg",
          "Blocco frontale to HF Divaricato", "Blocco frontale to Human Flag",
          "Blocco inverso to Human Flag rise",
        ],
      },
    ],
  },
  {
    id: "hefesto",
    name: t("Hefesto", "Hefesto", "Hefesto"),
    category: emptyCat,
    difficulty: "SPINTA",
    image: hefesto,
    description: t(
      "Trazione con le braccia dietro la schiena.",
      "Pull-up performed with the arms behind the back.",
      "Tracción con los brazos detrás de la espalda.",
    ),
    groups: [
      {
        id: "main",
        label: labelMain,
        progressions: ["Hefesto anelli piedi a terra", "Hefesto"],
      },
    ],
  },
  {
    id: "pelican",
    name: t("Pelican", "Pelican", "Pelican"),
    category: emptyCat,
    difficulty: "SPINTA",
    image: pelican,
    requires: ["hefesto", "planche"],
    description: t(
      "Tenuta avanzata di forza alla dream machine.",
      "Advanced strength hold on the dream machine.",
      "Mantenimiento avanzado de fuerza en la dream machine.",
    ),
    groups: [
      {
        id: "main",
        label: labelMain,
        hasTimer: true,
        progressions: ["Pellican Dream Machine"],
      },
    ],
  },
  {
    id: "reverse-muscle-up",
    name: t("Reverse Muscle Up", "Reverse Muscle Up", "Reverse Muscle Up"),
    category: emptyCat,
    difficulty: "TIRATA/SPINTA",
    image: reverseMuscleUp,
    description: t(
      "Muscle up al contrario, transizione invertita.",
      "Reverse muscle up, inverted transition.",
      "Muscle up al revés, transición invertida.",
    ),
    groups: [
      {
        id: "main",
        label: labelMain,
        progressions: ["Reverse muscle up"],
      },
    ],
  },
  {
    id: "iron-cross",
    name: t("Iron Cross", "Iron Cross", "Iron Cross"),
    category: emptyCat,
    difficulty: "TIRATA",
    image: ironCross,
    description: t(
      "Tenuta agli anelli con braccia tese a croce.",
      "Ring hold with arms straight out to the sides.",
      "Mantenimiento en anillas con brazos extendidos en cruz.",
    ),
    groups: [
      {
        id: "main",
        label: labelMain,
        hasTimer: true,
        progressions: [
          "Iron Cross 180°", "Iron Cross 170°", "Iron Cross 160°", "Iron Cross 150°",
          "Iron Cross 140°", "Iron Cross 130°", "Iron Cross 120°", "Iron Cross 110°",
          "Iron Cross 100°", "Iron Cross",
        ],
      },
    ],
  },
  {
    id: "muscle-up-rings",
    name: t("Muscle Up Anelli", "Ring Muscle Up", "Muscle Up Anillas"),
    category: emptyCat,
    difficulty: "TIRATA/SPINTA",
    image: muscleUpRings,
    description: t(
      "Transizione esplosiva da sospensione a sostegno sugli anelli.",
      "Explosive transition from hang to support on the rings.",
      "Transición explosiva de suspensión a apoyo en las anillas.",
    ),
    groups: [
      {
        id: "main",
        label: labelMain,
        progressions: [
          "False Grip 2 mani 1 anello", "False Grip 2 anelli braccia piegate",
          "False Grip 2 anelli braccia distese", "False Grip Row", "False Grip Pull up",
          "Standing muscle up", "Muscle up negativo", "Muscle up",
        ],
      },
    ],
  },
  {
    id: "muscle-up-bar",
    name: t("Muscle Up Sbarra", "Bar Muscle Up", "Muscle Up Barra"),
    category: emptyCat,
    difficulty: "TIRATA/SPINTA",
    image: muscleUpBar,
    description: t(
      "Transizione esplosiva da sospensione a sostegno sulla sbarra.",
      "Explosive transition from hang to support on the bar.",
      "Transición explosiva de suspensión a apoyo en la barra.",
    ),
    groups: [
      {
        id: "main",
        label: labelMain,
        progressions: [
          "Pull up Esplosivi", "Pull up Exp False Grip", "Muscle up Negativo", "Muscle up",
        ],
      },
    ],
  },
  {
    id: "pull",
    name: t("Pull", "Pull", "Pull"),
    category: emptyCat,
    difficulty: "TIRATA",
    image: pull,
    accessories: ["Pull up"],
    description: t(
      "Costruisci la base della forza in trazione.",
      "Build foundational pulling strength.",
      "Construye la fuerza base de tracción.",
    ),
    groups: [
      {
        id: "main",
        label: labelMain,
        progressions: [
          "Hinge Row", "Incline Row", "Ground Row", "Elevated Row",
          "Bent Arm chin Hang", "Negative Pull-up", "Pull up",
          "L-Chin up", "L Pull up", "Bulgarian Pull up", "Wide Grip Pull up",
          "Pull over", "Nalvers", "Tops pull", "1/2 Front pull", "Circle Front Lever", "Rope Climb",
        ],
      },
    ],
  },
  {
    id: "push",
    name: t("Push", "Push", "Push"),
    category: emptyCat,
    difficulty: "SPINTA",
    image: push,
    accessories: ["Dips"],
    description: t(
      "Costruisci la base della forza in spinta.",
      "Build foundational pushing strength.",
      "Construye la fuerza base de empuje.",
    ),
    groups: [
      {
        id: "main",
        label: labelMain,
        progressions: [
          "Incline Push up", "Push up", "Pseudo planche push up",
          "Bench Dip", "Negative Parallele Bar Dip", "Parallel Bar dip",
          "Single Bar dip", "Undergrip Single bar dip", "Korean Dip", "Ring dips",
          "Box Hs Push up", "Negative Head push up", "Hand stand push up",
          "Elevated hand stand push up", "Chest Roll", "1/2 Hollow back press", "90° push up",
        ],
      },
    ],
  },
  {
    id: "legs",
    name: t("Gambe", "Legs", "Piernas"),
    category: emptyCat,
    difficulty: "GAMBE",
    image: legs,
    description: t(
      "Allenamento gambe a corpo libero o con pesi liberi, senza macchinari.",
      "Leg training with bodyweight or free weights, no machines.",
      "Entrenamiento de piernas con peso corporal o pesas libres, sin máquinas.",
    ),
    groups: [
      {
        id: "bw",
        label: t("Corpo libero", "Bodyweight", "Peso corporal"),
        progressions: [
          "Squat a corpo libero", "Squat sumo", "Squat jump", "Affondi statici",
          "Affondi camminati", "Affondi laterali", "Affondi indietro", "Bulgarian split squat",
          "Step up", "Pistol squat assistito", "Pistol squat", "Shrimp squat assistito",
          "Shrimp squat", "Cossack squat", "Sissy squat", "Wall sit",
          "Glute bridge", "Single leg glute bridge", "Hip thrust a corpo libero",
          "Nordic curl negativo", "Nordic curl", "Calf raise", "Single leg calf raise",
          "Box jump", "Broad jump", "Skater jump",
        ],
      },
      {
        id: "weights",
        label: t("Pesi liberi", "Free weights", "Pesas libres"),
        progressions: [
          "Goblet squat", "Back squat bilanciere", "Front squat bilanciere",
          "Overhead squat", "Zercher squat", "Stacco da terra", "Stacco rumeno",
          "Stacco sumo", "Stacco a una gamba", "Affondi con manubri",
          "Affondi con bilanciere", "Walking lunge con manubri", "Bulgarian split squat con manubri",
          "Step up con manubri", "Hip thrust con bilanciere", "Glute bridge con bilanciere",
          "Good morning", "Calf raise con manubri", "Calf raise con bilanciere",
          "Farmer walk", "Suitcase carry", "Kettlebell swing", "Kettlebell goblet squat",
          "Kettlebell snatch", "Clean & jerk", "Snatch",
        ],
      },
    ],
  },
];

export const getSkillById = (id: string) => skills.find((s) => s.id === id);

export const totalProgressions = (s: Skill) =>
  s.groups.reduce((acc, g) => acc + g.progressions.length, 0);

/** True if every group has reached the last progression */
export const isSkillFullyCompleted = (
  skillId: string,
  getGroupIndex: (skillId: string, groupId: string) => number,
): boolean => {
  const s = getSkillById(skillId);
  if (!s) return false;
  return s.groups.every((g) => getGroupIndex(s.id, g.id) === g.progressions.length - 1);
};
