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
  "bg-black/40 border-emerald-500/30 text-emerald-50 placeholder:text-emerald-200/30 focus-visible:ring-emerald-400 focus-visible:ring-offset-0";

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
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") return;
      if (localStorage.getItem(DISMISS_KEY) === "true") return;
    } catch {}
    const t = setTimeout(() => setOpen(true), 15000);
    return () => clearTimeout(t);
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
            ? "bg-emerald-500/20 border-emerald-400 text-emerald-100 shadow-[0_0_16px_-4px_hsl(150_80%_45%/0.6)]"
            : "bg-black/40 border-emerald-500/20 text-emerald-100/70 hover:border-emerald-400/60"
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
            ? "bg-emerald-500/20 border-emerald-400 text-emerald-100"
            : "bg-black/40 border-emerald-500/20 text-emerald-100/70 hover:border-emerald-400/60"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden border-emerald-500/40 bg-[#06120c] text-emerald-50 shadow-[0_0_60px_-10px_hsl(150_90%_45%/0.55)]"
      >
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative p-6 sm:p-7">
          <DialogHeader>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 w-fit mb-3">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-300">
                Scheda personalizzata
              </span>
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-emerald-50">
              {success ? "Richiesta inviata!" : "Costruisci la tua scheda"}
            </DialogTitle>
            <DialogDescription className="text-emerald-200/70">
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
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_-2px_hsl(150_90%_45%/0.6)]"
                          : "bg-black/40 border-emerald-500/20 text-emerald-100/40"
                      }`}
                    >
                      {s === 1 ? <Target className="h-3.5 w-3.5" /> : s === 2 ? <User className="h-3.5 w-3.5" /> : <Dumbbell className="h-3.5 w-3.5" />}
                    </div>
                    {s < 3 && <div className={`h-px flex-1 ${step > s ? "bg-emerald-400" : "bg-emerald-500/20"}`} />}
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-emerald-200/80 text-xs uppercase tracking-wider">Obiettivi</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {goalChip("forza_skill", "Forza / Skill")}
                        {goalChip("ipertrofia", "Ipertrofia")}
                        {goalChip("dimagrimento", "Dimagrimento")}
                      </div>
                    </div>
                    <div>
                      <Label className="text-emerald-200/80 text-xs uppercase tracking-wider">Livello attuale</Label>
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
                        <Label className="text-emerald-200/80 text-xs">Nome *</Label>
                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={cyberInput} />
                        {errors.firstName && <p className="text-[11px] text-red-400 mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Label className="text-emerald-200/80 text-xs">Cognome *</Label>
                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className={cyberInput} />
                        {errors.lastName && <p className="text-[11px] text-red-400 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <Label className="text-emerald-200/80 text-xs">Email *</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={cyberInput} />
                      {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-emerald-200/80 text-xs">Giorni di allenamento a settimana</Label>
                      <Input value={days} onChange={(e) => setDays(e.target.value)} placeholder="es. 3-4" className={cyberInput} />
                    </div>
                    <div>
                      <Label className="text-emerald-200/80 text-xs">Attrezzatura disponibile</Label>
                      <Input value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="es. sbarra, anelli, parallele" className={cyberInput} />
                    </div>
                    <div>
                      <Label className="text-emerald-200/80 text-xs">Note / Infortuni</Label>
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
                  className="text-emerald-200/80 hover:bg-emerald-500/10 hover:text-emerald-100"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Indietro
                </Button>
                {step < 3 ? (
                  <Button
                    onClick={next}
                    className="bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_24px_-4px_hsl(150_90%_45%/0.7)]"
                  >
                    Avanti <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={submit}
                    disabled={submitting}
                    className="bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_24px_-4px_hsl(150_90%_45%/0.7)]"
                  >
                    {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Invio…</>) : "Invia richiesta"}
                  </Button>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-emerald-500/15 space-y-1.5">
                <p className="text-[11px] text-emerald-200/60">
                  I tuoi dati verranno trattati solo per l'elaborazione della scheda.
                </p>
                <p className="text-[11px] text-emerald-200/60">
                  Ti risponderemo via email entro 24/48 ore dal momento della richiesta.
                </p>
              </div>
            </>
          )}

          {success && (
            <div className="mt-6 flex flex-col items-center text-center gap-3 py-4">
              <div className="h-14 w-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shadow-[0_0_30px_-4px_hsl(150_90%_45%/0.7)]">
                <CheckCircle2 className="h-7 w-7 text-emerald-300" />
              </div>
              <p className="text-sm text-emerald-200/80 max-w-sm">
                Abbiamo ricevuto la tua richiesta. Ti risponderemo via email entro 24/48 ore.
              </p>
              <Button onClick={close} className="bg-emerald-500 text-black hover:bg-emerald-400 mt-2">
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
