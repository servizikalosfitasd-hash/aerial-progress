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
import maltese from "@/assets/skill-maltese.jpg";
import victorian from "@/assets/skill-victorian.jpg";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Elite";

export interface Progression {
  id: string;
  name: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  difficulty: Difficulty;
  image: string;
  description: string;
  progressions: Progression[];
}

export const skills: Skill[] = [
  {
    id: "front-lever",
    name: "Front Lever",
    category: "Static Hold",
    difficulty: "Advanced",
    image: frontLever,
    description: "A static pulling strength hold with the body horizontal and facing up.",
    progressions: [
      { id: "tuck", name: "Tuck Front Lever", description: "Knees tucked tight to chest, back parallel to floor." },
      { id: "adv-tuck", name: "Advanced Tuck Front Lever", description: "Hips open, back flat and parallel to floor." },
      { id: "single-leg", name: "Single Leg Front Lever", description: "One leg extended, the other tucked." },
      { id: "straddle", name: "Straddle Front Lever", description: "Legs spread wide, body horizontal." },
      { id: "half-lay", name: "Half Lay Front Lever", description: "Legs partially extended, knees slightly bent." },
      { id: "full", name: "Full Front Lever", description: "Body fully straight and horizontal." },
      { id: "full-pull", name: "Front Lever Pull-ups", description: "Pulling reps while maintaining the lever." },
    ],
  },
  {
    id: "planche",
    name: "Planche",
    category: "Static Hold",
    difficulty: "Elite",
    image: planche,
    description: "Body held parallel to the ground, supported only by straight arms.",
    progressions: [
      { id: "frog", name: "Frog Stand", description: "Knees resting on elbows, balance on hands." },
      { id: "tuck", name: "Tuck Planche", description: "Tight tuck, knees off elbows." },
      { id: "adv-tuck", name: "Advanced Tuck Planche", description: "Open hips, flat back parallel to floor." },
      { id: "single-leg", name: "Single Leg Planche", description: "One leg extended back, the other tucked." },
      { id: "straddle", name: "Straddle Planche", description: "Legs wide, body horizontal." },
      { id: "half-lay", name: "Half Lay Planche", description: "Legs slightly bent, almost full." },
      { id: "full", name: "Full Planche", description: "Body fully straight, parallel to ground." },
    ],
  },
  {
    id: "human-flag",
    name: "Human Flag",
    category: "Static Hold",
    difficulty: "Advanced",
    image: humanFlag,
    description: "Body held sideways and parallel to the ground, gripping a vertical pole.",
    progressions: [
      { id: "vertical", name: "Vertical Flag", description: "Body vertical, building grip strength." },
      { id: "chamber", name: "Chamber Hold", description: "Knees tucked toward chest, body angled." },
      { id: "single-leg", name: "Single Leg Flag", description: "One leg extended, one tucked." },
      { id: "straddle", name: "Straddle Flag", description: "Legs split wide horizontally." },
      { id: "full", name: "Full Human Flag", description: "Body fully horizontal, legs together." },
      { id: "pull-ups", name: "Flag Pull-ups", description: "Reps while maintaining the flag." },
    ],
  },
  {
    id: "iron-cross",
    name: "Iron Cross",
    category: "Rings",
    difficulty: "Elite",
    image: ironCross,
    description: "Classic ring strength hold with arms straight out to the sides.",
    progressions: [
      { id: "support", name: "Ring Support Hold", description: "Stable hold above rings, turned out." },
      { id: "rto", name: "RTO Support", description: "Rings turned out 45–90 degrees." },
      { id: "negatives", name: "Iron Cross Negatives", description: "Slow controlled lowering with bands." },
      { id: "band-assisted", name: "Band Assisted Iron Cross", description: "Light band assistance at full position." },
      { id: "partial", name: "Partial Iron Cross", description: "Hold with arms slightly above horizontal." },
      { id: "full", name: "Full Iron Cross", description: "Arms perfectly horizontal, no assistance." },
    ],
  },
  {
    id: "impossible-dips",
    name: "Impossible Dips",
    category: "Rings",
    difficulty: "Elite",
    image: impossibleDips,
    description: "Dips with body angled forward and arms behind the body.",
    progressions: [
      { id: "rto-dips", name: "RTO Dips", description: "Ring dips turned out throughout." },
      { id: "bulgarian", name: "Bulgarian Dips", description: "Wide ring dips at bottom of dip." },
      { id: "deep-rto", name: "Deep RTO Dips", description: "Below parallel ring dips, turned out." },
      { id: "pseudo", name: "Pseudo Planche Dips", description: "Forward lean dips on rings." },
      { id: "negatives", name: "Impossible Negatives", description: "Slow lowering with band assistance." },
      { id: "full", name: "Full Impossible Dip", description: "Full ROM unassisted." },
    ],
  },
  {
    id: "hefesto",
    name: "Hefesto",
    category: "Pull",
    difficulty: "Elite",
    image: hefesto,
    description: "A pull-up performed with arms behind the back, hands gripping a bar overhead.",
    progressions: [
      { id: "bicep-curls", name: "Heavy Bicep Curls", description: "Build elbow flexion strength." },
      { id: "rev-grip", name: "Reverse Grip Pull-ups", description: "Supinated grip pull-ups." },
      { id: "scap-prep", name: "Shoulder Mobility Prep", description: "Prepare shoulders for extreme position." },
      { id: "band-hefesto", name: "Band Assisted Hefesto", description: "Hefesto with band support." },
      { id: "negatives", name: "Hefesto Negatives", description: "Slow controlled lowering." },
      { id: "full", name: "Full Hefesto", description: "Unassisted full range Hefesto." },
    ],
  },
  {
    id: "pull",
    name: "Pull",
    category: "Foundational",
    difficulty: "Beginner",
    image: pull,
    description: "Build foundational vertical and horizontal pulling strength.",
    progressions: [
      { id: "dead-hang", name: "Dead Hang", description: "Passive hang from bar for time." },
      { id: "scap-pulls", name: "Scapular Pull-ups", description: "Activate scapula, no elbow bend." },
      { id: "negatives", name: "Pull-up Negatives", description: "Slow lowering from top." },
      { id: "full", name: "Strict Pull-ups", description: "Full range strict pull-ups." },
      { id: "weighted", name: "Weighted Pull-ups", description: "Add load progressively." },
      { id: "archer", name: "Archer Pull-ups", description: "One arm bent, the other extended." },
      { id: "ouap", name: "One Arm Pull-up", description: "Single arm pull-up, no assistance." },
    ],
  },
  {
    id: "push",
    name: "Push",
    category: "Foundational",
    difficulty: "Beginner",
    image: push,
    description: "Develop horizontal and vertical pressing strength.",
    progressions: [
      { id: "incline", name: "Incline Push-ups", description: "Hands elevated, easier angle." },
      { id: "standard", name: "Standard Push-ups", description: "Strict full ROM push-ups." },
      { id: "diamond", name: "Diamond Push-ups", description: "Hands close, triceps focused." },
      { id: "dips", name: "Parallel Bar Dips", description: "Strict dips on parallel bars." },
      { id: "ring-dips", name: "Ring Dips", description: "Dips on unstable rings." },
      { id: "archer", name: "Archer Push-ups", description: "Asymmetric loaded push-up." },
      { id: "oapu", name: "One Arm Push-up", description: "Single arm full push-up." },
    ],
  },
  {
    id: "manna",
    name: "Manna",
    category: "Static Hold",
    difficulty: "Elite",
    image: manna,
    description: "Extreme V-sit variation with legs reaching over the head.",
    progressions: [
      { id: "l-sit", name: "L-Sit", description: "Legs straight out, parallel to floor." },
      { id: "v-sit", name: "V-Sit", description: "Legs raised at 45 degrees or higher." },
      { id: "high-v", name: "High V-Sit", description: "Legs raised near vertical." },
      { id: "manna-prep", name: "Manna Prep", description: "Hips shifting backward over hands." },
      { id: "partial", name: "Partial Manna", description: "Toes above head, body inverted partially." },
      { id: "full", name: "Full Manna", description: "Toes near floor behind head." },
    ],
  },
  {
    id: "handstand",
    name: "Handstand",
    category: "Balance",
    difficulty: "Intermediate",
    image: handstand,
    description: "Inverted balance on hands with body fully extended.",
    progressions: [
      { id: "wall-chest", name: "Chest-to-Wall Hold", description: "Belly facing wall, alignment work." },
      { id: "wall-back", name: "Back-to-Wall Hold", description: "Kick up and rest heels on wall." },
      { id: "hops", name: "Handstand Hops", description: "Brief unsupported balance attempts." },
      { id: "freestand", name: "Freestanding Hold", description: "30+ seconds unsupported." },
      { id: "shapes", name: "Shape Variations", description: "Straddle, tuck, half lay handstands." },
      { id: "ohs", name: "One Arm Handstand Prep", description: "Side leans and weight shifts." },
    ],
  },
  {
    id: "press-handstand",
    name: "Press to Handstand",
    category: "Balance",
    difficulty: "Advanced",
    image: pressHandstand,
    description: "Pressing into a handstand from a standing or seated position with control.",
    progressions: [
      { id: "pike-flex", name: "Pike Flexibility", description: "Develop straight-leg pike compression." },
      { id: "pancake", name: "Pancake Stretch", description: "Straddle compression flexibility." },
      { id: "tuck-press", name: "Tuck Press", description: "Press up from tuck position." },
      { id: "straddle-press", name: "Straddle Press", description: "Press from straddle stand." },
      { id: "pike-press", name: "Pike Press", description: "Legs together press to handstand." },
      { id: "stalder", name: "Stalder Press", description: "Straddle press with straight arms only." },
    ],
  },
  {
    id: "maltese",
    name: "Maltese",
    category: "Rings",
    difficulty: "Elite",
    image: maltese,
    description: "Body held horizontal on rings with arms straight out in front.",
    progressions: [
      { id: "planche-full", name: "Full Planche", description: "Solid planche on floor required." },
      { id: "rto-planche", name: "RTO Planche on Rings", description: "Planche on turned out rings." },
      { id: "maltese-negatives", name: "Maltese Negatives", description: "Slow lower from support to maltese." },
      { id: "band-maltese", name: "Band Assisted Maltese", description: "Maltese with band support." },
      { id: "partial", name: "Partial Maltese", description: "Hold slightly above horizontal." },
      { id: "full", name: "Full Maltese", description: "Body and arms perfectly horizontal." },
    ],
  },
  {
    id: "victorian",
    name: "Victorian",
    category: "Rings",
    difficulty: "Elite",
    image: victorian,
    description: "Body horizontal on rings with arms straight out behind, the rarest static.",
    progressions: [
      { id: "back-lever", name: "Full Back Lever", description: "Solid back lever on bar required." },
      { id: "rings-bl", name: "Back Lever on Rings RTO", description: "Back lever turned out on rings." },
      { id: "rev-planche", name: "Reverse Planche", description: "Build straight arm pulling strength." },
      { id: "negatives", name: "Victorian Negatives", description: "Lower slowly from inverted hang." },
      { id: "band-victorian", name: "Band Assisted Victorian", description: "With heavy band assistance." },
      { id: "partial", name: "Partial Victorian", description: "Slightly above horizontal hold." },
      { id: "full", name: "Full Victorian", description: "Perfect horizontal Victorian hold." },
    ],
  },
];

export const getSkillById = (id: string) => skills.find((s) => s.id === id);
