import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type JointId =
  | "cervical"
  | "shoulders"
  | "elbows"
  | "wrists"
  | "knees"
  | "hips"
  | "ankles"
  | "spine";

type Hotspot = { id: JointId; cx: number; cy: number; mirror?: number };

// Front view: limb joints. Side view: spine + cervical.
const FRONT_HOTSPOTS: Hotspot[] = [
  { id: "shoulders", cx: 70, cy: 96, mirror: 130 },
  { id: "elbows", cx: 50, cy: 165, mirror: 150 },
  { id: "wrists", cx: 34, cy: 235, mirror: 166 },
  { id: "hips", cx: 84, cy: 222, mirror: 116 },
  { id: "knees", cx: 82, cy: 295, mirror: 118 },
  { id: "ankles", cx: 80, cy: 380, mirror: 120 },
];

const SIDE_HOTSPOTS: Hotspot[] = [
  { id: "cervical", cx: 105, cy: 70 },
  { id: "spine", cx: 108, cy: 145 },
  { id: "shoulders", cx: 110, cy: 96 },
  { id: "elbows", cx: 118, cy: 165 },
  { id: "wrists", cx: 124, cy: 235 },
];

interface Props {
  active: JointId;
  onSelect: (j: JointId) => void;
  labels: Record<JointId, string>;
  counts: Record<string, number>;
}

// Realistic silhouette (front) with arms, forearms and hands
const FRONT_SILHOUETTE =
  "M100,18 C112,18 120,28 120,42 C120,53 115,61 109,66 C112,71 114,76 115,82 L138,90 C144,92 148,97 148,104 L150,150 C150,158 147,164 142,168 L135,200 L138,225 L136,250 L132,300 L128,360 L126,395 C126,402 122,406 116,406 L110,406 C105,406 102,403 102,398 L100,330 L98,398 C98,403 95,406 90,406 L84,406 C78,406 74,402 74,395 L72,360 L68,300 L64,250 L62,225 L65,200 L58,168 C53,164 50,158 50,150 L52,104 C52,97 56,92 62,90 L85,82 C86,76 88,71 91,66 C85,61 80,53 80,42 C80,28 88,18 100,18 Z " +
  // Right arm (viewer's right = anatomical left): shoulder -> elbow -> wrist -> hand
  "M148,104 C156,108 160,120 158,135 L154,170 C153,178 152,184 150,192 L146,225 C145,232 144,240 142,246 C146,250 148,254 148,258 C148,262 145,265 141,265 C140,268 137,270 134,270 C131,270 128,268 127,265 C124,265 121,262 121,258 C121,253 124,248 128,244 L132,225 L134,195 L136,170 L138,135 C139,122 142,110 148,104 Z " +
  // Left arm (viewer's left)
  "M52,104 C44,108 40,120 42,135 L46,170 C47,178 48,184 50,192 L54,225 C55,232 56,240 58,246 C54,250 52,254 52,258 C52,262 55,265 59,265 C60,268 63,270 66,270 C69,270 72,268 73,265 C76,265 79,262 79,258 C79,253 76,248 72,244 L68,225 L66,195 L64,170 L62,135 C61,122 58,110 52,104 Z";

// Side silhouette with arm extending down with hand
const SIDE_SILHOUETTE =
  "M110,22 C122,22 130,32 130,46 C130,57 124,64 118,68 L120,80 L130,95 L138,120 L138,150 L132,170 L128,195 L132,220 L138,240 L138,265 L132,300 L128,360 L130,395 C130,402 126,406 120,406 L114,406 C109,406 106,403 106,398 L102,360 L98,300 L92,265 L92,240 L88,220 L86,195 L82,170 L78,150 L80,120 L88,95 L96,80 L98,68 C92,64 86,57 86,46 C86,32 94,22 106,22 Z " +
  // Arm hanging down on the side
  "M112,100 C120,104 124,116 122,130 L118,168 L116,205 L118,235 C118,240 120,244 122,248 C125,250 126,253 126,256 C126,260 123,262 120,262 C117,262 114,260 113,257 C111,257 109,255 109,252 C109,248 110,244 112,240 L110,210 L108,170 L108,135 C108,120 108,108 112,100 Z";

const FigureHotspots = ({
  hotspots,
  active,
  onSelect,
  labels,
  counts,
}: {
  hotspots: Hotspot[];
} & Props) => {
  const points: { id: JointId; cx: number; cy: number }[] = [];
  for (const h of hotspots) {
    points.push({ id: h.id, cx: h.cx, cy: h.cy });
    if (h.mirror !== undefined) points.push({ id: h.id, cx: h.mirror, cy: h.cy });
  }
  return (
    <>
      {points.map((p, i) => {
        const isActive = p.id === active;
        const count = counts[p.id] ?? 0;
        return (
          <TooltipProvider key={i} delayDuration={80}>
            <Tooltip>
              <TooltipTrigger asChild>
                <g
                  onClick={() => onSelect(p.id)}
                  className="cursor-pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={labels[p.id]}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect(p.id);
                  }}
                >
                  {isActive && (
                    <circle cx={p.cx} cy={p.cy} r="16" fill="url(#hotspotGlow)">
                      <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={p.cx}
                    cy={p.cy}
                    r="6.5"
                    fill="hsl(var(--background))"
                    stroke="hsl(var(--primary))"
                    strokeWidth={isActive ? 1.8 : 1.1}
                  />
                  <circle cx={p.cx} cy={p.cy} r="2.6" fill="hsl(var(--primary))" />
                  {count > 0 && (
                    <text
                      x={p.cx}
                      y={p.cy - 9}
                      textAnchor="middle"
                      fontSize="5.5"
                      fontFamily="monospace"
                      fontWeight="700"
                      fill="hsl(var(--primary))"
                    >
                      {count}
                    </text>
                  )}
                </g>
              </TooltipTrigger>
              <TooltipContent side="top">{labels[p.id]}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </>
  );
};

const Figure = ({
  silhouette,
  label,
  hotspots,
  ...rest
}: { silhouette: string; label: string; hotspots: Hotspot[] } & Props) => (
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1 px-1">
      <span className="text-[9px] font-mono tracking-widest uppercase text-primary/70">{label}</span>
      <span className="text-[9px] font-mono text-muted-foreground">/ map</span>
    </div>
    <svg viewBox="0 0 200 420" className="w-full h-auto" role="img" aria-label={label}>
      <defs>
        <pattern id={`grid-${label}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--primary) / 0.07)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="silhouetteFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.18)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="200" height="420" fill={`url(#grid-${label})`} />
      <line x1="100" y1="0" x2="100" y2="420" stroke="hsl(var(--primary) / 0.18)" strokeWidth="0.4" strokeDasharray="2 3" />

      <path
        d={silhouette}
        fill="url(#silhouetteFill)"
        stroke="hsl(var(--primary))"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      <FigureHotspots hotspots={hotspots} {...rest} />
    </svg>
  </div>
);

export const AnatomyMap = (props: Props) => (
  <div className="w-full">
    <div className="flex gap-2 sm:gap-4">
      <Figure silhouette={FRONT_SILHOUETTE} label="FRONT" hotspots={FRONT_HOTSPOTS} {...props} />
      <Figure silhouette={SIDE_SILHOUETTE} label="SIDE" hotspots={SIDE_HOTSPOTS} {...props} />
    </div>
  </div>
);

export default AnatomyMap;
