import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, ExternalLink } from "lucide-react";

type CustomExercise = {
  id: string;
  target_user_id: string | null;
  is_global: boolean;
  skill_id: string | null;
  category: string | null;
  name: string;
  description: string | null;
  sets: number | null;
  reps: number | null;
  seconds: number | null;
  recovery: number | null;
  load_kg: number | null;
  load_band: string | null;
  notes: string | null;
  video_url: string | null;
};

export function CustomExercisesSection() {
  const [items, setItems] = useState<CustomExercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (supabase as any)
      .from("custom_exercises")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }: { data: CustomExercise[] | null }) => {
        if (!active) return;
        setItems(data ?? []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (items.length === 0) return null;

  return (
    <section className="container max-w-5xl mx-auto px-4 sm:px-6 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold tracking-wide uppercase">Esercizi personalizzati</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((e) => {
          const meta = [
            e.sets && `${e.sets} serie`,
            e.reps && `${e.reps} rip`,
            e.seconds && `${e.seconds}s`,
            e.recovery && `rec ${e.recovery}s`,
            e.load_kg && `${e.load_kg}kg`,
            e.load_band,
          ].filter(Boolean).join(" · ");
          return (
            <Card key={e.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold leading-tight">{e.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {e.is_global && <Badge variant="secondary">Globale</Badge>}
                    {e.category && <Badge variant="outline">{e.category}</Badge>}
                    {e.skill_id && <Badge variant="outline">{e.skill_id}</Badge>}
                  </div>
                  {meta && <p className="text-xs text-muted-foreground mt-2">{meta}</p>}
                  {e.description && <p className="text-sm mt-2">{e.description}</p>}
                  {e.notes && <p className="text-xs text-muted-foreground mt-1 italic">{e.notes}</p>}
                </div>
                {e.video_url && (
                  <a
                    href={e.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline shrink-0"
                    aria-label="Apri video"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
