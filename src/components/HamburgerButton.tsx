import { useSidebar } from "@/components/ui/sidebar";

interface HamburgerButtonProps {
  className?: string;
}

export function HamburgerButton({ className = "" }: HamburgerButtonProps) {
  const { openMobile, open, isMobile, toggleSidebar } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  const lineBase: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    height: "2px",
    width: "24px",
    marginLeft: "-12px",
    borderRadius: "9999px",
    backgroundColor: "hsl(var(--primary))",
    boxShadow: "0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary))",
    transition: "transform 0.3s ease, opacity 0.2s ease",
  };

  const hoverGlow =
    "group-hover:[box-shadow:0_0_14px_hsl(var(--primary)),0_0_6px_hsl(var(--primary))]";

  return (
    <button
      type="button"
      aria-label={isOpen ? "Chiudi menù" : "Apri menù"}
      aria-expanded={isOpen}
      onClick={toggleSidebar}
      className={`group relative h-10 w-10 bg-transparent border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md ${className}`}
    >
      <span
        style={{
          ...lineBase,
          transform: isOpen
            ? "translate(-0%, -50%) rotate(45deg)"
            : "translate(-0%, calc(-50% - 8px))",
        }}
        className={hoverGlow}
      />
      <span
        style={{
          ...lineBase,
          transform: "translate(-0%, -50%)",
          opacity: isOpen ? 0 : 1,
        }}
        className={hoverGlow}
      />
      <span
        style={{
          ...lineBase,
          transform: isOpen
            ? "translate(-0%, -50%) rotate(-45deg)"
            : "translate(-0%, calc(-50% + 8px))",
        }}
        className={hoverGlow}
      />
    </button>
  );
}
