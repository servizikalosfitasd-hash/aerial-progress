import { ReactNode } from "react";
import { Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSectionAccess, SectionKey, SECTION_LABELS } from "@/hooks/useSectionAccess";

const WHATSAPP = "393465337431";

export function SectionGate({ section, children }: { section: SectionKey; children: ReactNode }) {
  const { loading, isAllowed, expired, expiresAt } = useSectionAccess();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAllowed(section)) return <>{children}</>;

  return (
    <div className="container max-w-lg mx-auto px-4 py-16">
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-lg font-display font-bold">
            {expired ? "Abbonamento scaduto" : "Sezione non attiva"}
          </h1>
          <p className="text-sm text-muted-foreground">
            La sezione <span className="font-semibold">{SECTION_LABELS[section]}</span>{" "}
            {expired
              ? `non è più accessibile: il tuo abbonamento è scaduto${
                  expiresAt ? ` il ${new Date(expiresAt).toLocaleDateString("it-IT")}` : ""
                }.`
              : "è stata disattivata dal tuo coach."}
            <br />
            Rinnova per riattivarla.
          </p>
          <Button asChild>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                "Ciao Kalos Fit, vorrei rinnovare il mio abbonamento.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> Rinnova su WhatsApp
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
