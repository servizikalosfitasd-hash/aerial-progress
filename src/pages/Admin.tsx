import { useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Trash2, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  nickname: string | null;
  first_name: string | null;
  last_name: string | null;
};

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
  created_at: string;
};

const CATEGORIES = ["Dinamico", "Isometria", "Potenziamento", "Zavorre", "Elastici"];

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [exercises, setExercises] = useState<CustomExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    skill_id: "",
    category: "",
    is_global: false,
    target_user_id: "",
    sets: "",
    reps: "",
    seconds: "",
    recovery: "",
    load_kg: "",
    load_band: "",
    notes: "",
    video_url: "",
  });

  const refresh = async () => {
    setLoading(true);
    const [{ data: usersData }, { data: exData }] = await Promise.all([
      supabase.rpc("admin_list_users" as any),
      (supabase as any)
        .from("custom_exercises")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    setUsers((usersData as AdminUser[]) ?? []);
    setExercises((exData as CustomExercise[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin]);

  const userMap = useMemo(() => {
    const m = new Map<string, AdminUser>();
    users.forEach((u) => m.set(u.id, u));
    return m;
  }, [users]);

  const userLabel = (u?: AdminUser) =>
    u ? u.nickname || [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email : "—";

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const reset = () =>
    setForm({
      name: "",
      description: "",
      skill_id: "",
      category: "",
      is_global: false,
      target_user_id: "",
      sets: "",
      reps: "",
      seconds: "",
      recovery: "",
      load_kg: "",
      load_band: "",
      notes: "",
      video_url: "",
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Inserisci un nome per l'esercizio");
      return;
    }
    if (!form.is_global && !form.target_user_id) {
      toast.error("Seleziona un utente o spunta 'Globale'");
      return;
    }
    setSaving(true);
    const num = (v: string) => (v === "" ? null : Number(v));
    const payload = {
      created_by: user.id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      skill_id: form.skill_id || null,
      category: form.category || null,
      is_global: form.is_global,
      target_user_id: form.is_global ? null : form.target_user_id || null,
      sets: num(form.sets),
      reps: num(form.reps),
      seconds: num(form.seconds),
      recovery: num(form.recovery),
      load_kg: num(form.load_kg),
      load_band: form.load_band.trim() || null,
      notes: form.notes.trim() || null,
      video_url: form.video_url.trim() || null,
    };
    const { error } = await (supabase as any).from("custom_exercises").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Errore: " + error.message);
      return;
    }
    toast.success("Esercizio creato");
    reset();
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo esercizio?")) return;
    const { error } = await (supabase as any).from("custom_exercises").delete().eq("id", id);
    if (error) {
      toast.error("Errore: " + error.message);
      return;
    }
    setExercises((prev) => prev.filter((e) => e.id !== id));
    toast.success("Esercizio eliminato");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="h-4 w-4" /> Home</Link>
          </Button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="h-4 w-4 text-primary" /> Admin
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nuovo esercizio personalizzato</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label>Nome esercizio *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Es. Front Lever Tuck Hold"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Skill di riferimento</Label>
                <Select
                  value={form.skill_id || "none"}
                  onValueChange={(v) => setForm({ ...form, skill_id: v === "none" ? "" : v })}
                >
                  <SelectTrigger><SelectValue placeholder="Nessuna" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nessuna</SelectItem>
                    {skills.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name?.it ?? s.id}</SelectItem>
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

              <div className="md:col-span-2 flex items-center gap-3 p-3 rounded-md border border-border/60 bg-muted/30">
                <Checkbox
                  id="is_global"
                  checked={form.is_global}
                  onCheckedChange={(v) => setForm({ ...form, is_global: !!v })}
                />
                <Label htmlFor="is_global" className="cursor-pointer">
                  Globale (visibile a tutti gli utenti)
                </Label>
              </div>

              {!form.is_global && (
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Assegna a utente *</Label>
                  <Select
                    value={form.target_user_id}
                    onValueChange={(v) => setForm({ ...form, target_user_id: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Seleziona utente" /></SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {userLabel(u)} <span className="text-muted-foreground ml-2 text-xs">{u.email}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Serie</Label>
                <Input type="number" inputMode="numeric" value={form.sets}
                  onChange={(e) => setForm({ ...form, sets: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Ripetizioni</Label>
                <Input type="number" inputMode="numeric" value={form.reps}
                  onChange={(e) => setForm({ ...form, reps: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Secondi (isometria)</Label>
                <Input type="number" inputMode="numeric" value={form.seconds}
                  onChange={(e) => setForm({ ...form, seconds: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Recupero (s)</Label>
                <Input type="number" inputMode="numeric" value={form.recovery}
                  onChange={(e) => setForm({ ...form, recovery: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Carico (kg)</Label>
                <Input type="number" inputMode="decimal" step="0.5" value={form.load_kg}
                  onChange={(e) => setForm({ ...form, load_kg: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Elastico / banda</Label>
                <Input value={form.load_band}
                  onChange={(e) => setForm({ ...form, load_band: e.target.value })}
                  placeholder="Es. Rosso medio" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label>Descrizione</Label>
                <Textarea rows={2} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Note</Label>
                <Textarea rows={2} value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Video URL</Label>
                <Input type="url" value={form.video_url}
                  onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                  placeholder="https://..." />
              </div>

              <div className="md:col-span-2 flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={reset}>Reset</Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />} Crea esercizio
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Esercizi creati ({exercises.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : exercises.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun esercizio personalizzato ancora.</p>
            ) : (
              <ul className="space-y-3">
                {exercises.map((e) => {
                  const target = e.target_user_id ? userMap.get(e.target_user_id) : undefined;
                  return (
                    <li key={e.id} className="flex items-start justify-between gap-3 p-3 rounded-md border border-border/60">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{e.name}</span>
                          {e.is_global ? (
                            <Badge variant="secondary">Globale</Badge>
                          ) : (
                            <Badge variant="outline">{userLabel(target)}</Badge>
                          )}
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
                      <Button size="icon" variant="ghost" onClick={() => remove(e.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
