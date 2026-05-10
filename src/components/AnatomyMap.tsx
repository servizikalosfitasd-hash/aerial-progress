export type JointId =
  | "cervical"
  | "shoulders"
  | "elbows"
  | "wrists"
  | "knees"
  | "hips"
  | "ankles"
  | "spine";

interface Props {
  active: JointId;
  onSelect: (j: JointId) => void;
  labels: Record<JointId, string>;
  counts: Record<string, number>;
}

const NEON = "#22c55e";
const NEON_SOFT = "#deff9a";
const SKEL = "#22c55e";

/* -------------------- FRONT VIEW -------------------- */
// Outline silhouette (front), arms with forearms + hands
const FRONT_OUTLINE =
  "M100 18 C112 18 120 28 120 42 C120 53 115 61 109 66 " +
  "C112 71 114 76 115 82 L138 90 C144 92 148 97 148 104 " +
  "L150 150 C150 158 147 164 142 168 L135 200 L138 225 L136 250 " +
  "L132 300 L128 360 L126 395 C126 402 122 406 116 406 L110 406 " +
  "C105 406 102 403 102 398 L100 330 L98 398 C98 403 95 406 90 406 " +
  "L84 406 C78 406 74 402 74 395 L72 360 L68 300 L64 250 L62 225 " +
  "L65 200 L58 168 C53 164 50 158 50 150 L52 104 C52 97 56 92 62 90 " +
  "L85 82 C86 76 88 71 91 66 C85 61 80 53 80 42 C80 28 88 18 100 18 Z " +
  // Right arm (viewer right)
  "M148 104 C156 108 160 120 158 135 L154 170 C153 178 152 184 150 192 " +
  "L146 225 C145 232 144 240 142 246 C146 250 148 254 148 258 " +
  "C148 262 145 265 141 265 C140 268 137 270 134 270 " +
  "C131 270 128 268 127 265 C124 265 121 262 121 258 " +
  "C121 253 124 248 128 244 L132 225 L134 195 L136 170 L138 135 " +
  "C139 122 142 110 148 104 Z " +
  // Left arm
  "M52 104 C44 108 40 120 42 135 L46 170 C47 178 48 184 50 192 " +
  "L54 225 C55 232 56 240 58 246 C54 250 52 254 52 258 " +
  "C52 262 55 265 59 265 C60 268 63 270 66 270 " +
  "C69 270 72 268 73 265 C76 265 79 262 79 258 " +
  "C79 253 76 248 72 244 L68 225 L66 195 L64 170 L62 135 " +
  "C61 122 58 110 52 104 Z";

const FRONT_HOTSPOTS: { id: JointId; cx: number; cy: number; mirror?: number; side?: "L" | "R" }[] = [
  { id: "shoulders", cx: 70, cy: 96, mirror: 130 },
  { id: "elbows", cx: 50, cy: 165, mirror: 150 },
  { id: "wrists", cx: 34, cy: 235, mirror: 166 },
  { id: "hips", cx: 84, cy: 222, mirror: 116 },
  { id: "knees", cx: 82, cy: 295, mirror: 118 },
  { id: "ankles", cx: 80, cy: 380, mirror: 120 },
];

/* -------------------- SIDE VIEW -------------------- */
const SIDE_OUTLINE =
  "M110 22 C122 22 130 32 130 46 C130 57 124 64 118 68 " +
  "L120 80 L130 95 L138 120 L138 150 L132 170 L128 195 " +
  "L132 220 L138 240 L138 265 L132 300 L128 360 L130 395 " +
  "C130 402 126 406 120 406 L114 406 C109 406 106 403 106 398 " +
  "L102 360 L98 300 L92 265 L92 240 L88 220 L86 195 L82 170 " +
  "L78 150 L80 120 L88 95 L96 80 L98 68 " +
  "C92 64 86 57 86 46 C86 32 94 22 106 22 Z " +
  "M112 100 C120 104 124 116 122 130 L118 168 L116 205 L118 235 " +
  "C118 240 120 244 122 248 C125 250 126 253 126 256 " +
  "C126 260 123 262 120 262 C117 262 114 260 113 257 " +
  "C111 257 109 255 109 252 C109 248 110 244 112 240 " +
  "L110 210 L108 170 L108 135 C108 120 108 108 112 100 Z";

const SIDE_HOTSPOTS: { id: JointId; cx: number; cy: number; label?: string }[] = [
  { id: "cervical", cx: 118, cy: 75 },
  { id: "spine", cx: 120, cy: 130, label: "Thoracic" },
  { id: "spine", cx: 112, cy: 200, label: "Lumbar" },
];

const GlowDot = ({
  cx,
  cy,
  active,
  highlighted,
  count,
  onClick,
  ariaLabel,
}: {
  cx: number;
  cy: number;
  active: boolean;
  highlighted?: boolean;
  count: number;
  onClick: () => void;
  ariaLabel: string;
}) => (
  <g
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") onClick();
    }}
    tabIndex={0}
    role="button"
    aria-label={ariaLabel}
    className="cursor-pointer focus:outline-none"
  >
    {active && (
      <circle cx={cx} cy={cy} r={highlighted ? 18 : 14} fill="url(#dotGlow)">
        <animate attributeName="r" values="10;18;10" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.6s" repeatCount="indefinite" />
      </circle>
    )}
    <circle
      cx={cx}
      cy={cy}
      r="5.5"
      fill="#0a0a0a"
      stroke={NEON}
      strokeWidth={active ? 1.8 : 1.2}
    />
    <circle cx={cx} cy={cy} r="2.4" fill={active ? NEON_SOFT : NEON}>
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
    {count > 0 && (
      <text
        x={cx}
        y={cy - 9}
        textAnchor="middle"
        fontSize="5"
        fontFamily="ui-monospace, 'JetBrains Mono', monospace"
        fontWeight="700"
        fill={NEON_SOFT}
      >
        {count}
      </text>
    )}
  </g>
);

/* Callout: short line from dot to external label */
const Callout = ({
  fromX,
  fromY,
  toX,
  toY,
  text,
  align,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  text: string;
  align: "start" | "end";
}) => (
  <g>
    <polyline
      points={`${fromX},${fromY} ${(fromX + toX) / 2},${fromY} ${toX},${toY}`}
      fill="none"
      stroke={NEON}
      strokeOpacity="0.55"
      strokeWidth="0.5"
      strokeDasharray="2 2"
    />
    <text
      x={toX + (align === "start" ? 2 : -2)}
      y={toY + 1.5}
      textAnchor={align}
      fontSize="5"
      fontFamily="ui-monospace, 'JetBrains Mono', monospace"
      fill={NEON_SOFT}
      letterSpacing="0.08em"
    >
      {text.toUpperCase()}
    </text>
  </g>
);

/* Internal stylized skeleton (front): ribcage, spine, pelvis */
const FrontSkeleton = () => (
  <g stroke={SKEL} strokeOpacity="0.35" fill="none" strokeWidth="0.6">
    {/* Spine */}
    <line x1="100" y1="80" x2="100" y2="225" strokeDasharray="2 2" />
    {[95, 110, 125, 140, 155, 170, 185, 200, 215].map((y) => (
      <line key={y} x1="96" y1={y} x2="104" y2={y} strokeOpacity="0.45" />
    ))}
    {/* Ribcage */}
    <path d="M72 110 Q100 100 128 110 Q132 140 128 175 Q100 192 72 175 Q68 140 72 110 Z" />
    <path d="M76 130 Q100 122 124 130" />
    <path d="M76 145 Q100 140 124 145" />
    <path d="M78 160 Q100 156 122 160" />
    {/* Clavicles */}
    <path d="M70 96 Q100 90 130 96" strokeOpacity="0.6" />
    {/* Pelvis */}
    <path d="M76 220 Q100 215 124 220 L120 245 Q100 252 80 245 Z" />
  </g>
);

const SideSkeleton = () => (
  <g stroke={SKEL} strokeOpacity="0.4" fill="none" strokeWidth="0.6">
    {/* Curved spine: cervical, thoracic, lumbar */}
    <path d="M118 70 C120 90 124 130 116 175 C112 200 116 225 118 245" strokeWidth="0.9" />
    {[80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230].map((y, idx) => (
      <line
        key={y}
        x1={117 + Math.sin(idx) * 1.5 - 4}
        y1={y}
        x2={117 + Math.sin(idx) * 1.5 + 4}
        y2={y}
        strokeOpacity="0.5"
      />
    ))}
    {/* Ribs (lateral) */}
    {[115, 130, 145, 160, 175].map((y) => (
      <path key={y} d={`M120 ${y} Q105 ${y + 2} 95 ${y + 4}`} strokeOpacity="0.35" />
    ))}
    {/* Pelvis side */}
    <path d="M118 245 Q100 248 92 260 L100 270 Q120 268 122 255 Z" />
  </g>
);

const Figure = ({
  view,
  outline,
  skeleton,
  children,
}: {
  view: "FRONT" | "SIDE";
  outline: string;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1.5 px-1">
      <span className="text-[9px] font-mono tracking-[0.25em] text-primary/80">
        ANAT-MAP / 0{view === "FRONT" ? "1" : "2"} · {view}
      </span>
      <span className="text-[9px] font-mono text-muted-foreground">v1.0</span>
    </div>
    <div className="rounded-xl border border-primary/20 bg-[#0a0a0a] overflow-hidden">
      <svg viewBox="0 0 200 420" className="w-full h-auto block" role="img" aria-label={view}>
        <defs>
          <pattern id={`grid-${view}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#1f1f1f" strokeWidth="0.4" />
          </pattern>
          <pattern id={`grid-major-${view}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#262626" strokeWidth="0.6" />
          </pattern>
          <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={NEON} stopOpacity="0.85" />
            <stop offset="100%" stopColor={NEON} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`fill-${view}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NEON} stopOpacity="0.06" />
            <stop offset="100%" stopColor={NEON} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="200" height="420" fill={`url(#grid-${view})`} />
        <rect x="0" y="0" width="200" height="420" fill={`url(#grid-major-${view})`} />
        {/* Center axis */}
        <line
          x1="100"
          y1="0"
          x2="100"
          y2="420"
          stroke={NEON}
          strokeOpacity="0.12"
          strokeWidth="0.4"
          strokeDasharray="2 4"
        />

        {/* Outline silhouette */}
        <path
          d={outline}
          fill={`url(#fill-${view})`}
          stroke={NEON}
          strokeWidth="1.2"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 3px ${NEON})` }}
        />

        {/* Internal skeleton */}
        {skeleton}

        {children}
      </svg>
    </div>
  </div>
);

const FrontView = ({ active, onSelect, labels, counts }: Props) => {
  const points: { id: JointId; cx: number; cy: number; side: "L" | "R" }[] = [];
  for (const h of FRONT_HOTSPOTS) {
    points.push({ id: h.id, cx: h.cx, cy: h.cy, side: "L" });
    if (h.mirror !== undefined) points.push({ id: h.id, cx: h.mirror, cy: h.cy, side: "R" });
  }
  return (
    <Figure view="FRONT" outline={FRONT_OUTLINE} skeleton={<FrontSkeleton />}>
      {points.map((p, i) => {
        const isActive = p.id === active;
        const labelBase = labels[p.id];
        const text = `${labelBase} ${p.side === "L" ? "sx" : "dx"}`;
        const isLeftSide = p.cx < 100;
        const labelX = isLeftSide ? 6 : 194;
        const align: "start" | "end" = isLeftSide ? "start" : "end";
        return (
          <g key={i}>
            <Callout
              fromX={p.cx}
              fromY={p.cy}
              toX={labelX}
              toY={p.cy}
              text={text}
              align={align}
            />
            <GlowDot
              cx={p.cx}
              cy={p.cy}
              active={isActive}
              highlighted
              count={counts[p.id] ?? 0}
              onClick={() => onSelect(p.id)}
              ariaLabel={text}
            />
          </g>
        );
      })}
    </Figure>
  );
};

const SideView = ({ active, onSelect, labels, counts }: Props) => (
  <Figure view="SIDE" outline={SIDE_OUTLINE} skeleton={<SideSkeleton />}>
    {SIDE_HOTSPOTS.map((p, i) => {
      const isActive = p.id === active;
      const text = p.label ?? labels[p.id];
      return (
        <g key={i}>
          <Callout fromX={p.cx} fromY={p.cy} toX={194} toY={p.cy} text={text} align="end" />
          <GlowDot
            cx={p.cx}
            cy={p.cy}
            active={isActive}
            highlighted
            count={i === 0 ? counts[p.id] ?? 0 : 0}
            onClick={() => onSelect(p.id)}
            ariaLabel={text}
          />
        </g>
      );
    })}
  </Figure>
);

const ALL_JOINTS: JointId[] = [
  "cervical",
  "shoulders",
  "elbows",
  "wrists",
  "hips",
  "knees",
  "ankles",
  "spine",
];

const ControlPanel = ({ active, onSelect, labels, counts }: Props) => (
  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
    {ALL_JOINTS.map((j) => {
      const isActive = active === j;
      return (
        <button
          key={j}
          onClick={() => onSelect(j)}
          className={`text-left px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider border transition ${
            isActive
              ? "bg-emerald-500/10 border-emerald-400 text-emerald-300 shadow-[0_0_18px_-4px_rgba(34,197,94,0.7)]"
              : "bg-[#0a0a0a] border-emerald-500/15 text-emerald-100/60 hover:border-emerald-400/50 hover:text-emerald-200"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="truncate">{labels[j]}</span>
            <span className="text-[10px] text-emerald-400/80">{counts[j] ?? 0}</span>
          </div>
        </button>
      );
    })}
  </div>
);

export const AnatomyMap = (props: Props) => (
  <div className="w-full">
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <FrontView {...props} />
      <SideView {...props} />
    </div>
    <ControlPanel {...props} />
  </div>
);

export default AnatomyMap;
