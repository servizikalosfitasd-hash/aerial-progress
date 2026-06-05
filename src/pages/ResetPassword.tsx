import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import kalosLogo from "@/assets/kalos-logo.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z
  .object({
    password: z.string().min(6, "Minimo 6 caratteri").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Le password non coincidono",
    path: ["confirm"],
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const prepareRecoverySession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const queryParams = new URLSearchParams(window.location.search);
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const code = queryParams.get("code");
      const tokenHash = queryParams.get("token_hash") ?? hashParams.get("token_hash");
      const type = queryParams.get("type") ?? hashParams.get("type");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (cancelled) return;
        if (error) {
          setRecoveryError("Link non valido o scaduto. Richiedi un nuovo reset password.");
          return;
        }
        window.history.replaceState({}, document.title, "/reset-password");
        setReady(true);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          setRecoveryError("Link non valido o scaduto. Richiedi un nuovo reset password.");
          return;
        }
        window.history.replaceState({}, document.title, "/reset-password");
        setReady(true);
        return;
      }

      if (tokenHash && type === "recovery") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (cancelled) return;
        if (error) {
          setRecoveryError("Link non valido o scaduto. Richiedi un nuovo reset password.");
          return;
        }
        window.history.replaceState({}, document.title, "/reset-password");
        setReady(true);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!cancelled && data.session) setReady(true);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || session) {
        setReady(true);
      }
    });
    prepareRecoverySession();
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setBusy(false);
      setRecoveryError("Sessione di recupero non trovata. Apri il link ricevuto via email o richiedine uno nuovo.");
      toast.error("Apri il link più recente ricevuto via email, poi imposta la nuova password.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message === "Auth session missing!" ? "Apri il link ricevuto via email per impostare la password." : error.message);
      return;
    }
    toast.success("Password aggiornata!");
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 bg-gradient-hero">
      <div className="w-full max-w-md rounded-3xl bg-gradient-card border border-border shadow-elevated p-6 sm:p-8">
        <div className="flex justify-center mb-6">
          <img
            src={kalosLogo}
            alt="A.S.D Kalos Fit"
            className="w-full max-w-[260px] h-auto rounded-2xl bg-background border border-border shadow-elevated"
          />
        </div>

        <h1 className="text-xl font-semibold text-center mb-2">Imposta nuova password</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {ready
            ? "Inserisci e conferma la tua nuova password."
            : "Apri questa pagina dal link ricevuto via email per continuare."}
        </p>

        {recoveryError && (
          <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{recoveryError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="password">Nuova password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                placeholder="••••••••"
                required
                disabled={!ready}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Conferma password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="pl-9"
                placeholder="••••••••"
                required
                disabled={!ready}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={busy || !ready}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aggiorna password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
