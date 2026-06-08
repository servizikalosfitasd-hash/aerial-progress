import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { skills } from "@/data/skills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";

type CustomExercise = {
  id: string;
  created_by: string;
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

const CATEGORIES = ["Dinamico", "Isometria", "Potenziamento", "Zavorre", "Elastici"];

const emptyForm = {
  name: "",
  description: "",
  skill_id: "",
  category: "",
  sets: "",
  reps: "",
  seconds: "",
  recovery: "",
  load_kg: "",
  load_band: "",
  notes: "",
  video_url: "",
};

export function UserCustomExercisesEditor({ userId }: { userId: string }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CustomExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("custom_exercises")
      .select("*")
      .eq("target_user_id", userId)
      .order("created_at", { ascending: false });
    setItems((data as CustomExercise[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const num = (v: string) => (v === "" ? null : Number(v));

  const startEdit = (e: CustomExercise) => {
    setEditingId(e.id);
    setForm({
      name: e.name,
      description: e.description ?? "",
      skill_id: e.skill_id ?? "",
      category: e.category ?? "",
      sets: e.sets?.toString() ?? "",
      reps: e.reps?.toString() ?? "",
      seconds: e.seconds?.toString() ?? "",
      recovery: e.recovery?.toString() ?? "",
      load_kg: e.load_kg?.toString() ?? "",
      load_band: e.load_band ?? "",
      notes: e.notes ?? "",
      video_url: e.video_url ?? "",
    });
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.name.trim()) {
      toast.error("Inserisci un nome");
      return;
    }
    setSaving(true);
    const payload = {
      created_by: user.id,
      target_user_id: userId,
      is_global: false,
      name: form.name.trim(),
      description: form.description.trim() || null,
      skill_id: form.skill_id || null,
      category: form.category || null,
      sets: num(form.sets),
      reps: num(form.reps),
      seconds: num(form.seconds),
      recovery: num(form.recovery),
      load_kg: num(form.load_kg),
      load_band: form.load_band.trim() || null,
      notes: form.notes.trim() || null,
      video_url: form.video_url.trim() || null,
    };
    const { error } = editingId
      ? await (supabase as any).from("custom_exercises").update(payload).eq("id", editingId)
      : await (supabase as any).from("custom_exercises").insert(payload);
    setSaving(false);
    if (error) return toast.error("Errore: " + error.message);
    toast.success(editingId ? "Esercizio aggiornato" : "Esercizio creato");
    reset();
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo esercizio?")) return;
    const { error } = await (supabase as any).from("custom_exercises").delete().eq("id", id);
    if (error) return toast.error("Errore: " + error.message);
    setItems((prev) => prev.filter((e) => e.id !== id));
    toast.success("Eliminato");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>{editingId ? "Modifica esercizio" : "Nuovo esercizio per questo utente"}</span>
            {editingId && (
              <Button size="sm" variant="ghost" onClick={reset}>
                <X className="h-4 w-4" /> Annulla
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5 md:col-span-2">
              <Label>Nome *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Es. Front Lever Tuck Hold"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Skill</Label>
              <Select
                value={form.skill_id || "none"}
                onValueChange={(v) => setForm({ ...form, skill_id: v === "none" ? "" : v })}
              >
                <SelectTrigger><SelectValue placeholder="Nessuna" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nessuna</SelectItem>
                  {skills.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name.it}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select
                value={form.category || "none"}
                onValueChange={(v) => setForm({ ...form, category: v === "none" ? "" : v })}
              >
                <SelectTrigger><SelectValue placeholder="Nessuna" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nessuna</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Serie</Label>
              <Input type="number" value={form.sets} onChange={(e) => setForm({ ...form, sets: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Reps</Label>
              <Input type="number" value={form.reps} onChange={(e) => setForm({ ...form, reps: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Secondi</Label>
              <Input type="number" value={form.seconds} onChange={(e) => setForm({ ...form, seconds: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Recupero (s)</Label>
              <Input type="number" value={form.recovery} onChange={(e) => setForm({ ...form, recovery: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Carico (kg)</Label>
              <Input type="number" step="0.5" value={form.load_kg} onChange={(e) => setForm({ ...form, load_kg: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Elastico</Label>
              <Input value={form.load_band} onChange={(e) => setForm({ ...form, load_band: e.target.value })} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Descrizione</Label>
              <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Note</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Video URL</Label>
              <Input type="url" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingId ? "Salva modifiche" : "Crea esercizio"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Esercizi assegnati ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessun esercizio personalizzato per questo utente.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-2 p-3 rounded-md border border-border/60">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{e.name}</span>
                      {e.category && <Badge variant="outline">{e.category}</Badge>}
                      {e.skill_id && <Badge variant="outline">{e.skill_id}</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {[
                        e.sets && `${e.sets} serie`,
                        e.reps && `${e.reps} rip`,
                        e.seconds && `${e.seconds}s`,
                        e.recovery && `rec ${e.recovery}s`,
                        e.load_kg && `${e.load_kg}kg`,
                        e.load_band,
                      ].filter(Boolean).join(" · ")}
                    </div>
                    {e.description && <p className="text-xs mt-1">{e.description}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(e)}>Modifica</Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(e.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
