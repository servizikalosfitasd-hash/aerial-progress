import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PushNotificationsToggle } from "@/components/PushNotificationsToggle";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ShieldCheck, Plus, Check, ChevronsUpDown, Users, MessageSquare, Settings2 } from "lucide-react";
import { UserPlanEditor } from "@/components/admin/UserPlanEditor";
import { UserCustomExercisesEditor } from "@/components/admin/UserCustomExercisesEditor";
import { UserManagementPanel } from "@/components/admin/UserManagementPanel";
import { UserAccessPanel } from "@/components/admin/UserAccessPanel";
import { AdminMessagesPanel } from "@/components/admin/AdminMessagesPanel";
import { AdminAuditLogPanel } from "@/components/admin/AdminAuditLogPanel";
import { AdminSecurityReportPanel } from "@/components/admin/AdminSecurityReportPanel";

type AdminUser = {
  id: string;
  email: string;
  nickname: string | null;
  first_name: string | null;
  last_name: string | null;
};

const CATEGORIES = ["Dinamico", "Isometria", "Potenziamento", "Zavorre", "Elastici"];

const AREAS = [
  { value: "users", label: "Utenti", icon: Users },
  { value: "messages", label: "Messaggi", icon: MessageSquare },
  { value: "system", label: "Sistema", icon: Settings2 },
];

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [openUserPicker, setOpenUserPicker] = useState(false);

  const [area, setArea] = useState("users");
  const [userTab, setUserTab] = useState("manage");
  const [systemTab, setSystemTab] = useState("global");

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

  const breadcrumb = selectedUser
    ? `Admin / Utenti / ${userLabel(selectedUser)}`
    : "Admin / Utenti";

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
        <Tabs value={area} onValueChange={setArea} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex h-auto">
            {AREAS.map((a) => (
              <TabsTrigger key={a.value} value={a.value} className="gap-2">
                <a.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{a.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Seleziona utente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingUsers ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Popover open={openUserPicker} onOpenChange={setOpenUserPicker}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openUserPicker}
                        className="w-full justify-between"
                      >
                        {selectedUser ? userLabel(selectedUser) : "Scegli un utente"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
                      <Command>
                        <CommandInput placeholder="Cerca per nome, nickname o email…" />
                        <CommandList>
                          <CommandEmpty>Nessun utente trovato</CommandEmpty>
                          <CommandGroup>
                            {users.map((u) => (
                              <CommandItem
                                key={u.id}
                                value={`${userLabel(u)} ${u.email}`}
                                onSelect={() => {
                                  setSelectedUserId(u.id);
                                  setOpenUserPicker(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedUserId === u.id ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <div className="flex flex-col items-start">
                                  <span>{userLabel(u)}</span>
                                  <span className="text-xs text-muted-foreground">{u.email}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
                {selectedUser && (
                  <p className="text-xs text-muted-foreground">
                    {breadcrumb} — <span className="font-medium">{selectedUser.email}</span>
                  </p>
                )}
              </CardContent>
            </Card>

            {selectedUser ? (
              <Tabs value={userTab} onValueChange={setUserTab} className="space-y-4">
                <TabsList className="flex-wrap h-auto">
                  <TabsTrigger value="manage">Panoramica</TabsTrigger>
                  <TabsTrigger value="plan">Scheda allenamento</TabsTrigger>
                  <TabsTrigger value="exercises">Esercizi personalizzati</TabsTrigger>
                  <TabsTrigger value="access">Accessi</TabsTrigger>
                  <TabsTrigger value="messages">Messaggi</TabsTrigger>
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

                <TabsContent value="access">
                  <UserAccessPanel key={selectedUserId} userId={selectedUserId} />
                </TabsContent>

                <TabsContent value="messages">
                  <AdminMessagesPanel selectedUserId={selectedUserId} onSelectUser={setSelectedUserId} />
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="py-12 text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Seleziona un utente per gestirne profilo, scheda ed esercizi personalizzati.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Centro messaggi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PushNotificationsToggle />
                <AdminMessagesPanel
                  selectedUserId={selectedUserId}
                  onSelectUser={(id) => {
                    setSelectedUserId(id);
                    setArea("users");
                    setUserTab("messages");
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Tabs value={systemTab} onValueChange={setSystemTab} className="space-y-4">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="global">Esercizi globali</TabsTrigger>
                <TabsTrigger value="security">Report sicurezza</TabsTrigger>
                <TabsTrigger value="audit">Audit log</TabsTrigger>
              </TabsList>

              <TabsContent value="global">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Nuovo esercizio globale (visibile a tutti)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={submitGlobal} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5 md:col-span-2">
                        <Label>Nome *</Label>
                        <Input
                          value={globalForm.name}
                          onChange={(e) => setGlobalForm({ ...globalForm, name: e.target.value })}
                          placeholder="Es. Plank hold"
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

              <TabsContent value="security">
                <AdminSecurityReportPanel />
              </TabsContent>

              <TabsContent value="audit">
                <AdminAuditLogPanel />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
