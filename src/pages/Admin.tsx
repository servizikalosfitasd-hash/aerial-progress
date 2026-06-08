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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ShieldCheck, Plus } from "lucide-react";
import { UserPlanEditor } from "@/components/admin/UserPlanEditor";
import { UserCustomExercisesEditor } from "@/components/admin/UserCustomExercisesEditor";
import { UserManagementPanel } from "@/components/admin/UserManagementPanel";

type AdminUser = {
  id: string;
  email: string;
  nickname: string | null;
  first_name: string | null;
  last_name: string | null;
};

const CATEGORIES = ["Dinamico", "Isometria", "Potenziamento", "Zavorre", "Elastici"];

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [search, setSearch] = useState("");

  // Global exercise form state
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [globalForm, setGlobalForm] = useState({
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
  });

  const loadUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase.rpc("admin_list_users" as any);
    setUsers((data as AdminUser[]) ?? []);
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin]);

  const userLabel = (u: AdminUser) =>
    u.nickname || [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email;

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.email, u.nickname, u.first_name, u.last_name]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }, [users, search]);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const num = (v: string) => (v === "" ? null : Number(v));

  const submitGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalForm.name.trim()) {
      toast.error("Inserisci un nome");
      return;
    }
    setSavingGlobal(true);
    const payload = {
      created_by: user.id,
      target_user_id: null,
      is_global: true,
      name: globalForm.name.trim(),
      description: globalForm.description.trim() || null,
      skill_id: globalForm.skill_id || null,
      category: globalForm.category || null,
      sets: num(globalForm.sets),
      reps: num(globalForm.reps),
      seconds: num(globalForm.seconds),
      recovery: num(globalForm.recovery),
      load_kg: num(globalForm.load_kg),
      load_band: globalForm.load_band.trim() || null,
      notes: globalForm.notes.trim() || null,
      video_url: globalForm.video_url.trim() || null,
    };
    const { error } = await (supabase as any).from("custom_exercises").insert(payload);
    setSavingGlobal(false);
    if (error) return toast.error("Errore: " + error.message);
    toast.success("Esercizio globale creato");
    setGlobalForm({
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
    });
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
        {/* User picker */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Seleziona utente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Cerca per nome, nickname o email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {loadingUsers ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Scegli un utente" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {userLabel(u)}
                      <span className="text-muted-foreground ml-2 text-xs">{u.email}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedUser && (
              <p className="text-xs text-muted-foreground">
                Utente selezionato: <span className="font-medium">{userLabel(selectedUser)}</span> ({selectedUser.email})
              </p>
            )}
          </CardContent>
        </Card>

        {selectedUserId && selectedUser ? (
          <Tabs defaultValue="manage" className="space-y-4">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="manage">Gestione utente</TabsTrigger>
              <TabsTrigger value="plan">Scheda allenamento</TabsTrigger>
              <TabsTrigger value="exercises">Esercizi personalizzati</TabsTrigger>
              <TabsTrigger value="global">Esercizio globale</TabsTrigger>
            </TabsList>

            <TabsContent value="manage">
              <UserManagementPanel
                key={selectedUserId}
                userId={selectedUserId}
                initialEmail={selectedUser.email}
                initialNickname={selectedUser.nickname}
                initialFirstName={selectedUser.first_name}
                initialLastName={selectedUser.last_name}
                onUserDeleted={() => {
                  setSelectedUserId("");
                  loadUsers();
                }}
              />
            </TabsContent>

            <TabsContent value="plan">
              <UserPlanEditor userId={selectedUserId} />
            </TabsContent>

            <TabsContent value="exercises">
              <UserCustomExercisesEditor userId={selectedUserId} />
            </TabsContent>

            <TabsContent value="global">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Nuovo esercizio globale (visibile a tutti)</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitGlobal} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Nome *</Label>
                      <Input
                        value={globalForm.name}
                        onChange={(e) => setGlobalForm({ ...globalForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Skill</Label>
                      <Select
                        value={globalForm.skill_id || "none"}
                        onValueChange={(v) => setGlobalForm({ ...globalForm, skill_id: v === "none" ? "" : v })}
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
                        value={globalForm.category || "none"}
                        onValueChange={(v) => setGlobalForm({ ...globalForm, category: v === "none" ? "" : v })}
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
                      <Input type="number" value={globalForm.sets} onChange={(e) => setGlobalForm({ ...globalForm, sets: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Reps</Label>
                      <Input type="number" value={globalForm.reps} onChange={(e) => setGlobalForm({ ...globalForm, reps: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Secondi</Label>
                      <Input type="number" value={globalForm.seconds} onChange={(e) => setGlobalForm({ ...globalForm, seconds: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Recupero (s)</Label>
                      <Input type="number" value={globalForm.recovery} onChange={(e) => setGlobalForm({ ...globalForm, recovery: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Carico (kg)</Label>
                      <Input type="number" step="0.5" value={globalForm.load_kg} onChange={(e) => setGlobalForm({ ...globalForm, load_kg: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Elastico</Label>
                      <Input value={globalForm.load_band} onChange={(e) => setGlobalForm({ ...globalForm, load_band: e.target.value })} />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Descrizione</Label>
                      <Textarea rows={2} value={globalForm.description} onChange={(e) => setGlobalForm({ ...globalForm, description: e.target.value })} />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Note</Label>
                      <Textarea rows={2} value={globalForm.notes} onChange={(e) => setGlobalForm({ ...globalForm, notes: e.target.value })} />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Video URL</Label>
                      <Input type="url" value={globalForm.video_url} onChange={(e) => setGlobalForm({ ...globalForm, video_url: e.target.value })} />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button type="submit" disabled={savingGlobal}>
                        {savingGlobal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        Crea esercizio globale
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Seleziona un utente per modificarne scheda ed esercizi.
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
