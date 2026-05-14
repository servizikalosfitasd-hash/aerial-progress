import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Target, User, Dumbbell, Sparkles } from "lucide-react";
import { z } from "zod";

const STORAGE_KEY = "customPlanRequested";
const DISMISS_KEY = "customPlanDismissed";
const FORMSPREE = "https://formspree.io/f/mrejlgyv";

type Goal = "forza_skill" | "ipertrofia" | "dimagrimento";
type Level = "principiante" | "intermedio" | "avanzato";

const schema = z.object({
  firstName: z.string().trim().min(1, "Nome richiesto").max(60),
  lastName: z.string().trim().min(1, "Cognome richiesto").max(60),
  email: z.string().trim().email("Email non valida").max(120),
});

const cyberInput =
  "bg-black/40 border-primary/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-0";

export const LeadModal = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [goals, setGoals] = useState<Goal[]>([]);
  const [level, setLevel] = useState<Level | "">("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [days, setDays] = useState("");
  const [equipment, setEquipment] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onForceOpen = () => {
      setSuccess(false);
      setStep(1);
      setErrors({});
      setOpen(true);
    };
    window.addEventListener("open-lead-modal", onForceOpen as EventListener);

    let timer: number | undefined;
    try {
      const submitted = localStorage.getItem(STORAGE_KEY) === "true";
      const dismissed = localStorage.getItem(DISMISS_KEY) === "true";
      if (!submitted && !dismissed) {
        timer = window.setTimeout(() => setOpen(true), 15000);
      }
    } catch {}

    return () => {
      window.removeEventListener("open-lead-modal", onForceOpen as EventListener);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const close = () => {
    setOpen(false);
    // User dismissed without submitting → never show again on this browser
    try { localStorage.setItem(DISMISS_KEY, "true"); } catch {}
  };

  const toggleGoal = (g: Goal) =>
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const next = () => {
    if (step === 1) {
      if (goals.length === 0 || !level) {
        setErrors({ step1: "Seleziona almeno un obiettivo e il tuo livello" });
        return;
      }
    }
    if (step === 2) {
      const r = schema.safeParse({ firstName, lastName, email });
      if (!r.success) {
        const errs: Record<string, string> = {};
        r.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
        setErrors(errs);
        return;
      }
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const prev = () => { setErrors({}); setStep((s) => Math.max(1, s - 1)); };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          obiettivi: goals.join(", "),
          livello: level,
          nome: firstName,
          cognome: lastName,
          email,
          giorni_allenamento: days,
          attrezzatura: equipment,
          note_infortuni: notes,
        }),
      });
      if (!res.ok) throw new Error("Errore invio");
      setSuccess(true);
      try {
        localStorage.setItem(STORAGE_KEY, "true");
        localStorage.setItem(DISMISS_KEY, "true");
      } catch {}
    } catch {
      setErrors({ submit: "Invio fallito. Riprova più tardi." });
    } finally {
      setSubmitting(false);
    }
  };

  const goalChip = (g: Goal, label: string) => {
    const active = goals.includes(g);
    return (
      <button
        key={g}
        type="button"
        onClick={() => toggleGoal(g)}
        className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
          active
            ? "bg-primary/20 border-primary text-foreground shadow-[0_0_16px_-4px_hsl(150_80%_45%/0.6)]"
            : "bg-black/40 border-primary/20 text-foreground/70 hover:border-primary/60"
        }`}
      >
        {label}
      </button>
    );
  };

  const levelChip = (l: Level, label: string) => {
    const active = level === l;
    return (
      <button
        key={l}
        type="button"
        onClick={() => setLevel(l)}
        className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
          active
            ? "bg-primary/20 border-primary text-foreground"
            : "bg-black/40 border-primary/20 text-foreground/70 hover:border-primary/60"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden border-primary/40 bg-card text-foreground shadow-[0_0_60px_-10px_hsl(150_90%_45%/0.55)]"
      >
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative p-6 sm:p-7">
          <DialogHeader>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 w-fit mb-3">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-primary">
                Scheda personalizzata
              </span>
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground">
              {success ? "Richiesta inviata!" : "Costruisci la tua scheda"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {success
                ? "Ti contatteremo via email entro 24/48 ore."
                : "Compila i 3 step: obiettivi, dati, logistica."}
            </DialogDescription>
          </DialogHeader>

          {!success && (
            <>
              {/* Stepper */}
              <div className="mt-5 flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 flex items-center gap-2">
                    <div
                      className={`h-7 w-7 shrink-0 rounded-md border flex items-center justify-center text-xs font-bold ${
                        step >= s
                          ? "bg-primary/20 border-primary text-muted-foreground shadow-[0_0_12px_-2px_hsl(150_90%_45%/0.6)]"
                          : "bg-black/40 border-primary/20 text-foreground/40"
                      }`}
                    >
                      {s === 1 ? <Target className="h-3.5 w-3.5" /> : s === 2 ? <User className="h-3.5 w-3.5" /> : <Dumbbell className="h-3.5 w-3.5" />}
                    </div>
                    {s < 3 && <div className={`h-px flex-1 ${step > s ? "bg-primary" : "bg-primary/20"}`} />}
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider">Obiettivi</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {goalChip("forza_skill", "Forza / Skill")}
                        {goalChip("ipertrofia", "Ipertrofia")}
                        {goalChip("dimagrimento", "Dimagrimento")}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider">Livello attuale</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {levelChip("principiante", "Principiante")}
                        {levelChip("intermedio", "Intermedio")}
                        {levelChip("avanzato", "Avanzato")}
                      </div>
                    </div>
                    {errors.step1 && <p className="text-xs text-red-400">{errors.step1}</p>}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-muted-foreground text-xs">Nome *</Label>
                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={cyberInput} />
                        {errors.firstName && <p className="text-[11px] text-red-400 mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Cognome *</Label>
                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className={cyberInput} />
                        {errors.lastName && <p className="text-[11px] text-red-400 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Email *</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={cyberInput} />
                      {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground text-xs">Giorni di allenamento a settimana</Label>
                      <Input value={days} onChange={(e) => setDays(e.target.value)} placeholder="es. 3-4" className={cyberInput} />
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Attrezzatura disponibile</Label>
                      <Input value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="es. sbarra, anelli, parallele" className={cyberInput} />
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Note / Infortuni</Label>
                      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={cyberInput} />
                    </div>
                    {errors.submit && <p className="text-xs text-red-400">{errors.submit}</p>}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  onClick={prev}
                  disabled={step === 1 || submitting}
                  className="text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Indietro
                </Button>
                {step < 3 ? (
                  <Button
                    onClick={next}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_-4px_hsl(150_90%_45%/0.7)]"
                  >
                    Avanti <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={submit}
                    disabled={submitting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_-4px_hsl(150_90%_45%/0.7)]"
                  >
                    {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Invio…</>) : "Invia richiesta"}
                  </Button>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-primary/15 space-y-1.5">
                <p className="text-[11px] text-muted-foreground">
                  I tuoi dati verranno trattati solo per l'elaborazione della scheda.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Ti risponderemo via email entro 24/48 ore dal momento della richiesta.
                </p>
              </div>
            </>
          )}

          {success && (
            <div className="mt-6 flex flex-col items-center text-center gap-3 py-4">
              <div className="h-14 w-14 rounded-full bg-primary/20 border border-primary flex items-center justify-center shadow-[0_0_30px_-4px_hsl(150_90%_45%/0.7)]">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Abbiamo ricevuto la tua richiesta. Ti risponderemo via email entro 24/48 ore.
              </p>
              <Button onClick={close} className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                Chiudi
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadModal;
