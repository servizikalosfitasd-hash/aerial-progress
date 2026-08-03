import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Save, KeyRound, Trash2, RotateCcw, ShieldCheck, User, Clock, Calendar, Mail } from "lucide-react";

type Overview = {
  email: string;
  email_confirmed_at: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
  sessions_count: number;
  skills_count: number;
  custom_exercises_count: number;
};

type Props = {
  userId: string;
  initialEmail: string;
  initialNickname: string | null;
  initialFirstName: string | null;
  initialLastName: string | null;
  onUserDeleted: () => void;
};

const fmtDate = (s: string | null) =>
  s ? new Date(s).toLocaleString("it-IT", { dateStyle: "medium", timeStyle: "short" }) : "—";

export function UserManagementPanel({
  userId,
  initialEmail,
  initialNickname,
  initialFirstName,
  initialLastName,
  onUserDeleted,
}: Props) {
  const { user: currentUser } = useAuth();
  const isSelf = currentUser?.id === userId;

  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [nickname, setNickname] = useState(initialNickname ?? "");
  const [firstName, setFirstName] = useState(initialFirstName ?? "");
  const [lastName, setLastName] = useState(initialLastName ?? "");

  const loadOverview = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_get_user_overview" as any, {
      _user_id: userId,
    });
    if (error) toast.error("Errore: " + error.message);
    const row = Array.isArray(data) ? (data[0] as Overview) : (data as Overview | null);
    setOverview(row ?? null);
    setLoading(false);
  };

  useEffect(() => {
    setNickname(initialNickname ?? "");
    setFirstName(initialFirstName ?? "");
    setLastName(initialLastName ?? "");
    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const saveProfile = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("admin_update_profile" as any, {
      _user_id: userId,
      _nickname: nickname.trim() || null,
      _first_name: firstName.trim() || null,
      _last_name: lastName.trim() || null,
    });
    setBusy(false);
    if (error) return toast.error("Errore: " + error.message);
    toast.success("Profilo aggiornato");
  };

  const toggleAdmin = async (next: boolean) => {
    setBusy(true);
    const { error } = await supabase.rpc("admin_set_role" as any, {
      _user_id: userId,
      _role: "admin",
      _grant: next,
    });
    setBusy(false);
    if (error) return toast.error("Errore: " + error.message);
    toast.success(next ? "Ruolo admin assegnato" : "Ruolo admin rimosso");
    loadOverview();
  };

  const sendReset = async () => {
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(initialEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error("Errore: " + error.message);
    toast.success("Email di reset inviata a " + initialEmail);
  };

  const resetData = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("admin_reset_user_data" as any, { _user_id: userId });
    setBusy(false);
    if (error) return toast.error("Errore: " + error.message);
    toast.success("Dati di allenamento azzerati");
    loadOverview();
  };

  const deleteUser = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("admin_delete_user" as any, { _user_id: userId });
    setBusy(false);
    if (error) return toast.error("Errore: " + error.message);
    toast.success("Utente eliminato");
    onUserDeleted();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column: Profile + Permissions */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Profilo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nickname</Label>
                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Nickname utente" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Nome</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nome" />
                </div>
                <div className="space-y-1.5">
                  <Label>Cognome</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Cognome" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={saveProfile} disabled={busy} size="sm">
                  <Save className="h-4 w-4" /> Salva profilo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Permessi e accesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3 p-3 rounded-md border border-border/60">
                <div>
                  <p className="text-sm font-medium">Ruolo amministratore</p>
                  <p className="text-xs text-muted-foreground">
                    Concede accesso completo al pannello admin.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {overview?.is_admin && <Badge variant="secondary">Admin</Badge>}
                  <Switch
                    checked={!!overview?.is_admin}
                    onCheckedChange={toggleAdmin}
                    disabled={busy || loading || (isSelf && overview?.is_admin)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-md border border-border/60">
                <div>
                  <p className="text-sm font-medium">Reset password</p>
                  <p className="text-xs text-muted-foreground">
                    Invia un'email all'utente con il link per impostare una nuova password.
                  </p>
                </div>
                <Button variant="outline" onClick={sendReset} disabled={busy} size="sm">
                  <KeyRound className="h-4 w-4" /> Invia email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Stats + Danger zone */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Statistiche
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : overview ? (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Stat icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={overview.email} />
                  <Stat icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Email confermata" value={overview.email_confirmed_at ? "Sì" : "No"} />
                  <Stat icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Ruolo" value={overview.is_admin ? "Admin" : "Utente"} />
                  <Stat icon={<Calendar className="h-3.5 w-3.5" />} label="Registrato" value={fmtDate(overview.created_at)} />
                  <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Ultimo accesso" value={fmtDate(overview.last_sign_in_at)} />
                  <Stat label="Sessioni" value={String(overview.sessions_count)} />
                  <Stat label="Skill in scheda" value={String(overview.skills_count)} />
                  <Stat label="Esercizi personalizzati" value={String(overview.custom_exercises_count)} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Dati non disponibili.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-destructive/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-destructive">Zona pericolosa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3 p-3 rounded-md border border-border/60">
                <div>
                  <p className="text-sm font-medium">Azzera dati di allenamento</p>
                  <p className="text-xs text-muted-foreground">
                    Cancella scheda, parametri, sessioni e stato app. Profilo e account restano.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" disabled={busy} size="sm">
                      <RotateCcw className="h-4 w-4" /> Azzera
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Azzerare tutti i dati di allenamento?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Verranno cancellate scheda, parametri, sessioni e stato app dell'utente.
                        Questa azione non può essere annullata.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annulla</AlertDialogCancel>
                      <AlertDialogAction onClick={resetData}>Azzera</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-md border border-destructive/40 bg-destructive/5">
                <div>
                  <p className="text-sm font-medium text-destructive">Elimina account utente</p>
                  <p className="text-xs text-muted-foreground">
                    Rimuove l'account e tutti i dati associati. Operazione irreversibile.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={busy || isSelf} size="sm">
                      <Trash2 className="h-4 w-4" /> Elimina utente
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Eliminare definitivamente {initialEmail}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        L'account e tutti i dati associati (scheda, sessioni, esercizi personalizzati,
                        profilo, ruoli) verranno cancellati. Non si può annullare.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annulla</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deleteUser}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Elimina definitivamente
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {isSelf && (
                <p className="text-xs text-muted-foreground">
                  Non puoi eliminare il tuo stesso account né rimuovere il tuo ruolo admin.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border/60 p-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium break-all">{value}</p>
    </div>
  );
}
