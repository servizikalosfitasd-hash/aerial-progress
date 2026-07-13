import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlanNotes, type PlanNoteSection } from "@/hooks/usePlanNotes";
import { useAuth } from "@/hooks/useAuth";
import { LucideIcon } from "lucide-react";

interface Props {
  section: PlanNoteSection;
  skillId?: string;
  title: string;
  icon?: LucideIcon;
  emptyText?: string;
}

export function PlanNoteView({ section, skillId, title, icon: Icon, emptyText }: Props) {
  const { user } = useAuth();
  const { content, loading } = usePlanNotes(user?.id, section, skillId);

  if (loading) return null;

  return (
    <Card className="bg-gradient-card border-border shadow-elevated">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-display flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content.trim() ? (
          <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">{content}</p>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            {emptyText ?? "Nessuna indicazione dal coach."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
