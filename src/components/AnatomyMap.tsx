import anatBlueprint from "@/assets/anat-map-blueprint.png";

export type JointId = "cervical" | "shoulders" | "elbows" | "wrists" | "knees" | "hips" | "ankles" | "spine";

interface Props {
  active: JointId;
  onSelect: (j: JointId) => void;
  labels: Record<JointId, string>;
  counts: Record<string, number>;
}

type Hotspot = { id: JointId; x: number; y: number };

// Coordinates are percentages of the underlying reference image
// (FRONT silhouette occupies the left half, SIDE the right half).
const HOTSPOTS: Hotspot[] = [
  // FRONT
  { id: "cervical", x: 30.0, y: 28.0 },
  { id: "shoulders", x: 22.0, y: 31.0 }, // dx
  { id: "shoulders", x: 41.8, y: 31.0 }, // sx
  { id: "elbows", x: 14.0, y: 46.0 }, // dx
  { id: "elbows", x: 49.0, y: 46.0 }, // sx
  { id: "wrists", x: 9.0, y: 58.0 }, // dx
  { id: "wrists", x: 52.5, y: 58.0 }, // sx
  { id: "hips", x: 27.5, y: 60.0 }, // dx
  { id: "hips", x: 36.5, y: 60.0 }, // sx
  { id: "knees", x: 25.0, y: 76.0 }, // dx
  { id: "knees", x: 38.5, y: 76.0 }, // sx
  { id: "ankles", x: 26.0, y: 93.0 }, // dx
  { id: "ankles", x: 37.0, y: 93.0 }, // sx
  // SIDE
  { id: "cervical", x: 81.5, y: 28.0 },
  { id: "spine", x: 81.5, y: 39.0 }, // thoracic
  { id: "spine", x: 79.5, y: 48.5 }, // lombare
  { id: "hips", x: 80.0, y: 58.5 },
  { id: "knees", x: 82.0, y: 76.5 },
  { id: "ankles", x: 84.0, y: 94.0 },
];

const Hotspot = ({
  spot,
  active,
  onClick,
  label,
}: {
  spot: Hotspot;
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    aria-pressed={active}
    className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none group"
    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
  >
    {/* Click target */}
    <span className="block w-6 h-6 sm:w-7 sm:h-7 rounded-full" />
    {/* Pulsing glow ring (only when active) */}
    {active && (
      <>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full animate-ping"
          style={{
            boxShadow: "0 0 18px 6px hsl(var(--primary) / 0.85)",
            backgroundColor: "hsl(var(--primary) / 0.35)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "0 0 14px 3px hsl(var(--primary) / 0.95), 0 0 28px 10px hsl(var(--primary) / 0.45)",
            border: "1.5px solid hsl(var(--primary-glow))",
          }}
        />
      </>
    )}
    {/* Hover affordance */}
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition"
      style={{
        boxShadow: "0 0 10px 2px hsl(var(--primary) / 0.6)",
        border: "1px solid hsl(var(--primary) / 0.7)",
      }}
    />
  </button>
);

const PANEL: { id: JointId; short: string }[] = [
  { id: "cervical", short: "Cervicale" },
  { id: "shoulders", short: "Spalle" },
  { id: "elbows", short: "Gomiti" },
  { id: "wrists", short: "Polsi" },
  { id: "hips", short: "Anca" },
  { id: "knees", short: "Ginocchia" },
  { id: "ankles", short: "Caviglie" },
  { id: "spine", short: "Colonna V." },
];

export const AnatomyMap = ({ active, onSelect, labels, counts }: Props) => {
  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-primary/30 bg-[#0a0a0a] shadow-[0_0_40px_-15px_hsl(var(--primary)/0.4)]"
        style={{ aspectRatio: "704 / 1004" }}
      >
        <img
          src={anatBlueprint}
          alt="Mappa anatomica - vista frontale e laterale"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />
        {HOTSPOTS.map((h, i) => (
          <Hotspot
            key={i}
            spot={h}
            active={h.id === active}
            onClick={() => onSelect(h.id)}
            label={labels[h.id] ?? h.id}
          />
        ))}
      </div>

      {/* Bottom data panel */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PANEL.map(({ id, short }) => {
          const isActive = active === id;
          const count = counts[id] ?? 0;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`text-left px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider border transition ${
                isActive
                  ? "bg-emerald-500/10 border-emerald-400 text-emerald-300 shadow-[0_0_18px_-4px_rgba(34,197,94,0.7)]"
                  : "bg-[#0a0a0a] border-emerald-500/15 text-emerald-100/60 hover:border-emerald-400/50 hover:text-emerald-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate">
                  {short}
                  {isActive && <span className="ml-1 text-[10px] text-emerald-400/90 normal-case">(Active)</span>}
                </span>
                <span className="text-[10px] text-emerald-400/80">{count}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AnatomyMap;
