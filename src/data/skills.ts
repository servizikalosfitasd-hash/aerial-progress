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

export type Difficulty = string;
export type Lang = "it" | "en" | "es";

export interface ProgressionGroup {
  /** stable id within the skill (e.g. "iso", "dynamic", "main") */
  id: string;
  /** translated labels for the group */
  label: Record<Lang, string>;
  /** ordered progression names (technical names, kept in original form) */
  progressions: string[];
  /** true if this group benefits from a static-hold timer */
  hasTimer?: boolean;
}

export interface Skill {
  id: string;
  /** translated display name */
  name: Record<Lang, string>;
  /** translated category label */
  category: Record<Lang, string>;
  difficulty: Difficulty;
  image: string;
  /** translated short description */
  description: Record<Lang, string>;
  groups: ProgressionGroup[];
}

const t = (it: string, en: string, es: string): Record<Lang, string> => ({ it, en, es });

const labelIso = t("Iso", "Iso", "Iso");
const labelDyn = t("Dinamico", "Dynamic", "Dinámico");
const labelMain = t("Progressione", "Progression", "Progresión");

export const skills: Skill[] = [
  {
    id: "front-lever",
    name: t("Front Lever", "Front Lever", "Front Lever"),
    category: t("\n", "\n", "\n"),
    difficulty: " TIRATA",
    image: frontLever,
    description: t(
      "Tenuta orizzontale con il corpo rivolto verso l'alto, sospesi alla sbarra.",
      "Horizontal hold facing up, suspended from the bar.",
      "Mantenimiento horizontal mirando hacia arriba, suspendido de la barra.",
    ),
    groups: [
      {
        id: "iso",
        label: labelIso,
        hasTimer: true,
        progressions: [
          "Barchetta Tuck",
          "Barchetta one Leg",
          "Barchetta gambe divaricate",
          "Barchetta gambe distese",
          "Tuck Dragon Flag",
          "Dragon Flag one leg",
          "Dragon Flag Straddle",
          "Dragon Flag",
          "Tuck front Verticale",
          "Tuck front 70°",
          "Tuck Front 50°",
          "Tuck Front 30°",
          "Tuck Front",
          "Tuck Front Straddle",
          "Tuck Front Advanced",
          "Front One leg",
          "Front One leg Advanced",
          "Front Halflay one leg",
          "Front Halflay Divaricato",
          "Front Halflay",
          "Front Straddle",
          "Front Lever",
        ],
      },
      {
        id: "dynamic",
        label: labelDyn,
        progressions: [
          "Barchetta tuck rock",
          "Barchetta one Leg rock",
          "Barchetta gambe divaricate rock",
          "Barchetta gambe distese rock",
          "Australian pull up",
          "Tuck Front Verticale pull up",
          "Tuck Front 70° pull up",
          "Tuck Front 50° pull up",
          "Tuck Front 30° pull up",
          "Tuck Front pull up",
          "Tuck Front Divaricato pull up",
          "Tuck Front Advanced pull up",
          "Front One leg facile pull up",
          "Front One leg Advanced pull up",
          "Front One leg pull up",
          "Front Halflay Divaricato pull up",
          "Front Halflay pull up",
          "Front Lever straddle pull up",
          "Front Lever pull up",
        ],
      },
    ],
  },
  {
    id: "planche",
    name: t("Planche", "Planche", "Planche"),
    category: t("\n", "\n", "\n"),
    difficulty: "SPINTA",
    image: planche,
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
          "Plank",
          "Plank Sbilanciato",
          "Plank sbilanciato rialzo",
          "Frog Stand",
          "Frog Stand Advanced",
          "Tuck Planche",
          "Tuck Planche Divaricato",
          "Tuck Planche Advanced",
          "Planche One leg facile",
          "Planche One leg Advanced",
          "Planche Halflay one leg",
          "Planche Halflay Divaricato",
          "Planche Halflay",
          "Planche straddle",
          "Planche",
        ],
      },
      {
        id: "dynamic",
        label: labelDyn,
        progressions: [
          "Planck push up",
          "Planck Sbilanciato push up",
          "Plank sbilanciato rialzo push up",
          "Tuck Planche push up",
          "Tuck Planche Divaricato push up",
          "Tuck Planche Advanced push up",
          "Planche One leg facile push up",
          "Planche One leg Advanced push up",
          "Planche Halflay one leg push up",
          "Planche Halflay Divaricato push up",
          "Planche Halflay push up",
          "Planche straddle push up",
          "Planche push up",
        ],
      },
    ],
  },
  {
    id: "handstand",
    name: t("Handstand", "Handstand", "Handstand"),
    category: t("\n", "\n", "\n"),
    difficulty: "SPINTA",
    image: handstand,
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
          "Tripod 1",
          "Tripod 2",
          "Tripod 3",
          "Forearm Headstand",
          "1/2 HS Spalliera",
          "Wall Hs obliquo",
          "Wall Hs",
          "Run Wall Hs",
          "Hs Shrug",
          "Wall Hs Scissor",
          "Hs",
        ],
      },
      {
        id: "dynamic",
        label: labelDyn,
        progressions: [
          "V-Push up",
          "V-Push up rialzo",
          "V-Push up anelli",
          "V-Push up anelli rialzo",
          "Hs push Up negativi Muro",
          "Hs Push up Muro",
          "Hs Push up rialzo",
          "Hs Push up Negativi Liberi",
          "Hs Push up solo Salire",
          "Hs Push up",
        ],
      },
    ],
  },
  {
    id: "back-lever",
    name: t("Back Lever", "Back Lever", "Back Lever"),
    category: t("\n", "\n", "\n"),
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
          "Assisted German Hang",
          "German Hang",
          "German Hang anelli",
          "Tuck Back",
          "Tuck Back Divaricato",
          "Tuck Back Advanced",
          "Back One leg facile",
          "Back One leg Advanced",
          "Back Halflay one leg",
          "Back Halflay Divaricato",
          "Back Halflay",
          "Back Lever straddle",
          "Back Lever",
        ],
      },
      {
        id: "dynamic",
        label: labelDyn,
        progressions: [
          "German Hang a terra",
          "Skin the cat",
          "Pulse Tuck Back",
          "Pulse Tuck Back Divaricato",
          "Pulse Tuck Back Advanced",
          "Pulse Back One leg facile",
          "Pulse Back One leg Advanced",
          "Pulse Back Halflay one leg",
          "Pulse Back Halflay Divaricato",
          "Pulse Back Halflay",
          "Pulse Back Lever straddle",
          "Pulse Back Lever",
        ],
      },
    ],
  },
  {
    id: "human-flag",
    name: t("Human Flag", "Human Flag", "Human Flag"),
    category: t("\n", "\n", "\n"),
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
          "Side Plank",
          "Side Plank Star",
          "Blocco frontale",
          "Blocco Laterale",
          "Blocco Inverso",
          "HF Tuck",
          "HF One leg",
          "HF Divaricato",
          "Human Flag",
        ],
      },
    ],
  },
  {
    id: "press-handstand",
    name: t("Press to Handstand", "Press to Handstand", "Press to Handstand"),
    category: t("\n", "\n", "\n"),
    difficulty: "SPINTA",
    image: pressHandstand,
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
          "Plank Press",
          "Vertical Press 1",
          "Vertical Press 2",
          "Vertical Press 3",
          "Press Walk",
          "1/2 Press 1",
          "1/2 Press 2",
          "1/2 Press 3",
          "1/2 Press 4",
          "Negative Tuck press",
          "Negative Straddle press",
          "Negative Pike press",
          "Press Tuck",
          "Press Straddle",
          "Press Pike",
          "Press L-sit",
          "Press to HS",
        ],
      },
    ],
  },
  {
    id: "manna",
    name: t("Manna", "Manna", "Manna"),
    category: t("\n", "\n", "\n"),
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
          "Tuck up",
          "Straddle up",
          "v-up",
          "Half-Tuck",
          "Half hanging leg lift",
          "Negative Hanging leg lit",
          "Half l-sit",
          "Half double extension",
          "l-sit scissor",
          "l-ist",
          "1/2 straddle",
          "1/2 straddle l-single extension",
          "1/2 straddle l-double extension",
          "straddle l",
          "middle split hold",
          "Manna",
        ],
      },
    ],
  },
  {
    id: "iron-cross",
    name: t("Iron Cross", "Iron Cross", "Iron Cross"),
    category: t("\n", "\n", "\n"),
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
          "Iron Cross 180°",
          "Iron Cross 170°",
          "Iron Cross 160°",
          "Iron Cross 150°",
          "Iron Cross 140°",
          "Iron Cross 130°",
          "Iron Cross 120°",
          "Iron Cross 110°",
          "Iron Cross 100°",
          "Iron Cross",
        ],
      },
    ],
  },
  {
    id: "impossible-dips",
    name: t("Impossible Dips", "Impossible Dips", "Impossible Dips"),
    category: t("\n", "\n", "\n"),
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
          "Estensione tricipiti spalliera 1",
          "Estensione tricipiti spalliera 2",
          "Estensione tricipiti spalliera 3",
          "Estensione tricipiti spalliera 4",
          "Impossible Dips",
        ],
      },
    ],
  },
  {
    id: "muscle-up-rings",
    name: t("Muscle Up Anelli", "Ring Muscle Up", "Muscle Up Anillas"),
    category: t("\n", "\n", "\n"),
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
          "False Grip 2 mani 1 anello",
          "False Grip 2 anelli braccia piegate",
          "False Grip 2 anelli braccia distese",
          "False Grip Row",
          "False Grip Pull up",
          "Standing muscle up",
          "Muscle up negativo",
          "Muscle up",
        ],
      },
    ],
  },
  {
    id: "muscle-up-bar",
    name: t("Muscle Up Sbarra", "Bar Muscle Up", "Muscle Up Barra"),
    category: t("\n", "\n", "\n"),
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
          "Pull up Esplosivi",
          "Pull up Exp False Grip",
          "Muscle up Negativo",
          "Muscle up",
        ],
      },
    ],
  },
  {
    id: "hefesto",
    name: t("Hefesto", "Hefesto", "Hefesto"),
    category: t("\n", "\n", "\n"),
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
        progressions: ["Hefesto"],
      },
    ],
  },
  {
    id: "pull",
    name: t("Pull", "Pull", "Pull"),
    category: t("Fondamentali", "Foundational", "Fundamentales"),
    difficulty: "Beginner",
    image: pull,
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
          "Hinge Row",
          "Incline Row",
          "Ground Row",
          "Elevated Row",
          "Bent Arm chin Hang",
          "Negative Pull-up",
          "Pull up",
          "L-Chin up",
          "L Pull up",
          "Bulgarian Pull up",
          "Wide Grip Pull up",
          "Pull over",
          "Nalvers",
          "Tops pull",
          "1/2 Front pull",
          "Circle Front Lever",
          "Rope Climb",
        ],
      },
    ],
  },
  {
    id: "push",
    name: t("Push", "Push", "Push"),
    category: t("Fondamentali", "Foundational", "Fundamentales"),
    difficulty: "Beginner",
    image: push,
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
          "Incline Push up",
          "Push up",
          "Pseudo planche push up",
          "Bench Dip",
          "Negative Parallele Bar Dip",
          "Parallel Bar dip",
          "Single Bar dip",
          "Undergrip Single bar dip",
          "Korean Dip",
          "Ring dips",
          "Box Hs Push up",
          "Negative Head push up",
          "Hand stand push up",
          "Elevated hand stand push up",
          "Chest Roll",
          "1/2 Hollow back press",
          "90° push up",
        ],
      },
    ],
  },
];

export const getSkillById = (id: string) => skills.find((s) => s.id === id);

/** total number of progressions across all groups for a skill */
export const totalProgressions = (s: Skill) =>
  s.groups.reduce((acc, g) => acc + g.progressions.length, 0);
