import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import kalosLogo from "@/assets/kalos-logo.jpeg";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Email non valida").max(255),
  password: z.string().min(6, "Minimo 6 caratteri").max(72),
});

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.7-5.5 3.7-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.9 3 14.7 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c6.9 0 9.4-4.8 9.4-7.4 0-.5 0-.9-.1-1.3H12z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.365 1.43c0 1.14-.42 2.22-1.18 3.02-.81.85-2.13 1.51-3.21 1.43-.13-1.13.43-2.31 1.16-3.07.83-.86 2.24-1.49 3.23-1.38zM20.5 17.04c-.55 1.27-.81 1.84-1.52 2.96-.99 1.56-2.39 3.5-4.12 3.51-1.54.02-1.93-1.01-4.02-1-2.09.01-2.52 1.02-4.06 1-1.73-.02-3.05-1.78-4.04-3.34-2.78-4.36-3.07-9.48-1.36-12.21 1.21-1.94 3.13-3.08 4.93-3.08 1.83 0 2.98 1 4.5 1 1.47 0 2.37-1 4.49-1 1.6 0 3.3.87 4.51 2.38-3.96 2.17-3.32 7.83.69 9.78z"/>
  </svg>
);

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.string().email().safeParse(forgotEmail);
    if (!parsed.success) {
      toast.error("Email non valida");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Email di reset inviata! Controlla la tua casella.");
    setForgotOpen(false);
    setForgotEmail("");
  };

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const validate = () => {
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return false;
    }
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Credenziali non valide" : error.message);
      return;
    }
    toast.success("Bentornato!");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("already") ? "Email già registrata" : error.message);
      return;
    }
    toast.success("Account creato!");
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Accesso Google fallito");
      return;
    }
    if (result.redirected) return;
  };

  const handleApple = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Accesso Apple fallito");
      return;
    }
    if (result.redirected) return;
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

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogle}
            disabled={busy}
          >
            <GoogleIcon />
            Continua con Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleApple}
            disabled={busy}
          >
            <AppleIcon />
            Continua con Apple
          </Button>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] tracking-widest uppercase text-muted-foreground">oppure</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Accedi</TabsTrigger>
            <TabsTrigger value="signup">Registrati</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-3 mt-4">
              <EmailField email={email} setEmail={setEmail} />
              <PasswordField password={password} setPassword={setPassword} />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotOpen(true);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Password dimenticata?
                </button>
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accedi"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-3 mt-4">
              <EmailField email={email} setEmail={setEmail} />
              <PasswordField password={password} setPassword={setPassword} />
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crea account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recupera password</DialogTitle>
            <DialogDescription>
              Inserisci la tua email: ti invieremo un link per reimpostare la password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgot} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="pl-9"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Invia link di reset"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EmailField = ({ email, setEmail }: { email: string; setEmail: (v: string) => void }) => (
  <div className="space-y-1.5">
    <Label htmlFor="email">Email</Label>
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="pl-9"
        placeholder="tu@email.com"
        required
      />
    </div>
  </div>
);

const PasswordField = ({ password, setPassword }: { password: string; setPassword: (v: string) => void }) => (
  <div className="space-y-1.5">
    <Label htmlFor="password">Password</Label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="pl-9"
        placeholder="••••••••"
        required
      />
    </div>
  </div>
);

export default Auth;
