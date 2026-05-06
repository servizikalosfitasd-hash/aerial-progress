import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type JointId = "cervical" | "shoulders" | "elbows" | "wrists" | "knees" | "hips" | "ankles" | "spine";

type Hotspot = { id: JointId; cx: number; cy: number; mirror?: number };

// Coordinates on a 200x420 viewBox
const HOTSPOTS: Hotspot[] = [
  { id: "cervical", cx: 100, cy: 60 },
  { id: "shoulders", cx: 70, cy: 95, mirror: 130 },
  { id: "spine", cx: 100, cy: 160 },
  { id: "elbows", cx: 55, cy: 150, mirror: 145 },
  { id: "wrists", cx: 45, cy: 205, mirror: 155 },
  { id: "hips", cx: 82, cy: 215, mirror: 118 },
  { id: "knees", cx: 80, cy: 290, mirror: 120 },
  { id: "ankles", cx: 78, cy: 380, mirror: 122 },
];

interface Props {
  active: JointId;
  onSelect: (j: JointId) => void;
  labels: Record<JointId, string>;
  counts: Record<string, number>;
}

export const AnatomyMap = ({ active, onSelect, labels, counts }: Props) => {
  const points: { id: JointId; cx: number; cy: number }[] = [];
  for (const h of HOTSPOTS) {
    points.push({ id: h.id, cx: h.cx, cy: h.cy });
    if (h.mirror !== undefined) points.push({ id: h.id, cx: h.mirror, cy: h.cy });
  }

  return (
    <div className="relative w-full max-w-[280px] mx-auto select-none">
      <svg
        viewBox="0 0 200 420"
        className="w-full h-auto"
        role="img"
        aria-label="Anatomy map"
      >
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--primary) / 0.08)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Blueprint background */}
        <rect x="0" y="0" width="200" height="420" fill="url(#grid)" />

        {/* Crosshair / technical guides */}
        <line x1="100" y1="0" x2="100" y2="420" stroke="hsl(var(--primary) / 0.18)" strokeWidth="0.4" strokeDasharray="2 3" />
        <line x1="0" y1="160" x2="200" y2="160" stroke="hsl(var(--primary) / 0.12)" strokeWidth="0.4" strokeDasharray="2 3" />

        {/* Wireframe figure */}
        <g
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        >
          {/* Head */}
          <circle cx="100" cy="35" r="22" />
          <line x1="100" y1="13" x2="100" y2="57" strokeDasharray="1 2" opacity="0.5" />
          {/* Neck */}
          <line x1="100" y1="57" x2="100" y2="72" />
          {/* Torso outline */}
          <path d="M70,95 L130,95 L135,200 L100,215 L65,200 Z" />
          {/* Spine */}
          <line x1="100" y1="72" x2="100" y2="215" strokeDasharray="2 2" opacity="0.6" />
          {/* Shoulders cross */}
          <line x1="60" y1="95" x2="140" y2="95" />
          {/* Arms */}
          <line x1="70" y1="95" x2="55" y2="150" />
          <line x1="55" y1="150" x2="45" y2="205" />
          <line x1="130" y1="95" x2="145" y2="150" />
          <line x1="145" y1="150" x2="155" y2="205" />
          {/* Hands */}
          <circle cx="45" cy="212" r="6" />
          <circle cx="155" cy="212" r="6" />
          {/* Hips line */}
          <line x1="65" y1="215" x2="135" y2="215" />
          {/* Legs */}
          <line x1="82" y1="215" x2="80" y2="290" />
          <line x1="80" y1="290" x2="78" y2="380" />
          <line x1="118" y1="215" x2="120" y2="290" />
          <line x1="120" y1="290" x2="122" y2="380" />
          {/* Feet */}
          <path d="M70,385 L88,385 L86,395 L72,395 Z" />
          <path d="M112,385 L130,385 L128,395 L114,395 Z" />
        </g>

        {/* Reference ticks */}
        <g fill="hsl(var(--primary) / 0.55)" fontSize="5" fontFamily="monospace">
          <text x="4" y="40">A1</text>
          <text x="4" y="100">B2</text>
          <text x="4" y="220">C3</text>
          <text x="4" y="300">D4</text>
          <text x="180" y="40">R</text>
          <text x="180" y="220">L</text>
        </g>

        {/* Hotspots */}
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
                    {isActive && <circle cx={p.cx} cy={p.cy} r="14" fill="url(#hotspotGlow)" />}
                    <circle
                      cx={p.cx}
                      cy={p.cy}
                      r="7"
                      fill="hsl(var(--background))"
                      stroke="hsl(var(--primary))"
                      strokeWidth={isActive ? 1.6 : 1}
                      opacity={isActive ? 1 : 0.85}
                    />
                    <circle
                      cx={p.cx}
                      cy={p.cy}
                      r="2.4"
                      fill="hsl(var(--primary))"
                    />
                    {count > 0 && (
                      <text
                        x={p.cx}
                        y={p.cy - 9}
                        textAnchor="middle"
                        fontSize="5"
                        fontFamily="monospace"
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
      </svg>
    </div>
  );
};

export default AnatomyMap;
