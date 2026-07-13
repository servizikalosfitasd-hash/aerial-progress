import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { usePlanNotes, type PlanNoteSection } from "@/hooks/usePlanNotes";

interface Props {
  userId: string;
  section: PlanNoteSection;
  skillId?: string;
  label: string;
  placeholder?: string;
  rows?: number;
}

export function PlanNoteEditor({ userId, section, skillId, label, placeholder, rows = 4 }: Props) {
  const { content, save, loading } = usePlanNotes(userId, section, skillId);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(content);
  }, [content]);

  const onSave = async () => {
    if (value.length > 4000) {
      toast.error("Massimo 4000 caratteri");
      return;
    }
    setSaving(true);
    const { error } = await save(value);
    setSaving(false);
    if (error) toast.error("Errore: " + (error as any).message);
    else toast.success("Salvato");
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {loading ? (
        <div className="flex justify-center py-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <Textarea
            rows={rows}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            maxLength={4000}
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={onSave} disabled={saving || value === content}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salva
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
