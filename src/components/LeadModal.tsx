import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Target,
  User,
  Dumbbell,
  Sparkles,
  ShoppingBag,
  Shirt,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { z } from "zod";

const STORAGE_KEY = "customPlanRequested";
const DISMISS_KEY = "customPlanDismissed";
const FORMSPREE = "https://formspree.io/f/mrejlgyv";
const WA_NUMBER = "393465337431";
const MEMBER_CODE = "KALOS_MEMBER_2026";

type Goal = "forza_skill" | "ipertrofia" | "dimagrimento";
type Level = "principiante" | "intermedio" | "avanzato";
type Flow = "choose" | "scheda" | "merch";
type Duration = "mensile" | "trimestrale" | "semestrale" | "annuale";
type Size = "S" | "M" | "L" | "XL" | "XXL";

const PRICES: Record<Duration, { socio: number; esterno: number; label: string }> = {
  mensile: { socio: 15, esterno: 30, label: "Mensile" },
  trimestrale: { socio: 35, esterno: 75, label: "Trimestrale" },
  semestrale: { socio: 60, esterno: 130, label: "Semestrale" },
  annuale: { socio: 100, esterno: 220, label: "Annuale" },
};

type MerchProduct = { id: string; name: string; price: number; icon: typeof Shirt };
const MERCH_CATALOG: MerchProduct[] = [
  { id: "tshirt", name: "T-shirt Kalos Fit", price: 20, icon: Shirt },
  { id: "felpa", name: "Felpa Kalos Fit", price: 40, icon: Shirt },
];

type MerchItem = { id: string; qty: number; size: Size | "" };

const schema = z.object({
  firstName: z.string().trim().min(1, "Nome richiesto").max(60),
  lastName: z.string().trim().min(1, "Cognome richiesto").max(60),
  email: z.string().trim().email("Email non valida").max(120),
});

const merchSchema = z.object({
  firstName: z.string().trim().min(1, "Nome richiesto").max(60),
  lastName: z.string().trim().min(1, "Cognome richiesto").max(60),
});

const cyberInput =
  "bg-black/40 border-primary/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-0";

export const LeadModal = () => {
  const [open, setOpen] = useState(false);
  const [flow, setFlow] = useState<Flow>("choose");
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // scheda
  const [goals, setGoals] = useState<Goal[]>([]);
  const [level, setLevel] = useState<Level | "">("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [days, setDays] = useState("");
  const [equipment, setEquipment] = useState("");
  const [notes, setNotes] = useState("");
  const [memberToggle, setMemberToggle] = useState(false);
  const [memberCodeInput, setMemberCodeInput] = useState("");
  const [duration, setDuration] = useState<Duration | "">("");

  // merch
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [merchSuggestion, setMerchSuggestion] = useState("");
  const [mFirstName, setMFirstName] = useState("");
  const [mLastName, setMLastName] = useState("");

  const isMember = memberToggle && memberCodeInput === MEMBER_CODE;
  const codeStatus: "idle" | "ok" | "ko" = !memberToggle
    ? "idle"
    : memberCodeInput.length === 0
      ? "idle"
      : memberCodeInput === MEMBER_CODE
        ? "ok"
        : "ko";

  const currentPrice = useMemo(() => {
    if (!duration) return null;
    return isMember ? PRICES[duration].socio : PRICES[duration].esterno;
  }, [duration, isMember]);

  const merchTotal = useMemo(
    () =>
      merchItems.reduce((sum, it) => {
        const p = MERCH_CATALOG.find((m) => m.id === it.id);
        return sum + (p ? p.price * it.qty : 0);
      }, 0),
    [merchItems],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onForceOpen = () => {
      resetAll();
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

  const resetAll = () => {
    setSuccess(false);
    setStep(1);
    setFlow("choose");
    setErrors({});
  };

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {}
  };

  const toggleGoal = (g: Goal) =>
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const toggleMerchItem = (id: string) => {
    setMerchItems((prev) =>
      prev.find((p) => p.id === id)
        ? prev.filter((p) => p.id !== id)
        : [...prev, { id, qty: 1, size: "" }],
    );
  };

  const updateMerchItem = (id: string, patch: Partial<MerchItem>) => {
    setMerchItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const next = () => {
    if (step === 1) {
      if (goals.length === 0 || !level) {
        setErrors({ step1: "Seleziona almeno un obiettivo e il tuo livello" });
        return;
      }
      if (!duration) {
        setErrors({ step1: "Seleziona la durata dell'abbonamento" });
        return;
      }
    }
    if (step === 2) {
      const r = schema.safeParse({ firstName, lastName, email });
      if (!r.success) {
        const errs: Record<string, string> = {};
        r.error.issues.forEach((i) => {
          errs[String(i.path[0])] = i.message;
        });
        setErrors(errs);
        return;
      }
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const prev = () => {
    setErrors({});
    if (step === 1) {
      setFlow("choose");
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_richiesta: "scheda_personalizzata",
          obiettivi: goals.join(", "),
          livello: level,
          nome: firstName,
          cognome: lastName,
          email,
          giorni_allenamento: days,
          attrezzatura: equipment,
          note_infortuni: notes,
          socio: isMember ? "Sì" : "No",
          durata: duration ? PRICES[duration].label : "",
          prezzo_eur: currentPrice ?? "",
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

  const submitMerch = () => {
    const r = merchSchema.safeParse({ firstName: mFirstName, lastName: mLastName });
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    if (merchItems.length === 0) {
      setErrors({ merch: "Seleziona almeno un articolo" });
      return;
    }
    const missingSize = merchItems.find((m) => !m.size);
    if (missingSize) {
      setErrors({ merch: "Seleziona la taglia per ogni articolo" });
      return;
    }
    setErrors({});

    const lines = merchItems.map((it) => {
      const p = MERCH_CATALOG.find((m) => m.id === it.id)!;
      return `- ${p.name} taglia ${it.size} x${it.qty} — €${p.price * it.qty}`;
    });
    const msg =
      `Ciao Kalos Fit! Vorrei ordinare:\n` +
      `${lines.join("\n")}\n` +
      `Totale indicativo: €${merchTotal}\n` +
      `(prezzi soci da verificare al momento dell'ordine)\n\n` +
      (merchSuggestion.trim() ? `Suggerimenti: ${merchSuggestion.trim()}\n\n` : "") +
      `Nome: ${mFirstName} ${mLastName}`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSuccess(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {}
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
            ? "bg-primary/20 border-primary text-foreground shadow-[0_0_16px_-4px_hsl(var(--primary)/0.6)]"
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

  const durationChip = (d: Duration) => {
    const active = duration === d;
    const price = isMember ? PRICES[d].socio : PRICES[d].esterno;
    return (
      <button
        key={d}
        type="button"
        onClick={() => setDuration(d)}
        className={`px-3 py-2 rounded-lg text-sm font-medium border transition flex flex-col items-start ${
          active
            ? "bg-primary/20 border-primary text-foreground shadow-[0_0_16px_-4px_hsl(var(--primary)/0.6)]"
            : "bg-black/40 border-primary/20 text-foreground/70 hover:border-primary/60"
        }`}
      >
        <span>{PRICES[d].label}</span>
        <span className="text-[11px] text-primary font-mono">€{price}</span>
      </button>
    );
  };

  const showStepper = flow === "scheda" && !success;

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-primary/40 bg-card text-foreground shadow-[0_0_60px_-10px_hsl(var(--primary)/0.55)] max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative p-6 sm:p-7">
          <DialogHeader>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 w-fit mb-3">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-primary">
                {flow === "merch" ? "Merchandising" : "Richiesta scheda personalizzata"}
              </span>
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground">
              {success
                ? "Richiesta inviata!"
                : flow === "choose"
                  ? "Servizi Personalizzati"
                  : flow === "merch"
                    ? "Merch Kalos Fit"
                    : "Costruisci la tua scheda"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {success
                ? "La tua richiesta è stata inviata con successo, ti risponderemo entro 24/48h lavorative."
                : flow === "choose"
                  ? "Scegli il servizio personalizzato che preferisci."
                  : flow === "merch"
                    ? "Seleziona i tuoi articoli e completa l'ordine via WhatsApp."
                    : "Compila i 3 step: obiettivi, dati, logistica."}
            </DialogDescription>
          </DialogHeader>

          {!success && flow === "choose" && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFlow("scheda");
                  setStep(1);
                }}
                className="text-left p-4 rounded-xl border border-primary/30 bg-black/40 hover:border-primary hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.6)] transition"
              >
                <Dumbbell className="h-6 w-6 text-primary mb-2" />
                <div className="font-semibold text-foreground">Richiesta scheda personalizzata</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Programma su misura per i tuoi obiettivi.
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFlow("merch");
                  setStep(1);
                }}
                className="text-left p-4 rounded-xl border border-primary/30 bg-black/40 hover:border-primary hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.6)] transition"
              >
                <ShoppingBag className="h-6 w-6 text-primary mb-2" />
                <div className="font-semibold text-foreground">Merchandising Kalos Fit</div>
                <div className="text-xs text-muted-foreground mt-1">
                  T-shirt, felpe e gadget ufficiali.
                </div>
              </button>
            </div>
          )}

          {!success && flow !== "choose" && (
            <>
              {showStepper && (
                <div className="mt-5 flex items-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 flex items-center gap-2">
                      <div
                        className={`h-7 w-7 shrink-0 rounded-md border flex items-center justify-center text-xs font-bold ${
                          step >= s
                            ? "bg-primary/20 border-primary text-muted-foreground shadow-[0_0_12px_-2px_hsl(var(--primary)/0.6)]"
                            : "bg-black/40 border-primary/20 text-foreground/40"
                        }`}
                      >
                        {s === 1 ? (
                          <Target className="h-3.5 w-3.5" />
                        ) : s === 2 ? (
                          <User className="h-3.5 w-3.5" />
                        ) : (
                          <Dumbbell className="h-3.5 w-3.5" />
                        )}
                      </div>
                      {s < 3 && <div className={`h-px flex-1 ${step > s ? "bg-primary" : "bg-primary/20"}`} />}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 space-y-4">
                {flow === "scheda" && step === 1 && (
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

                    <div className="rounded-lg border border-primary/20 bg-black/30 p-3 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <Label htmlFor="member-toggle" className="text-foreground text-sm">
                          Sei un socio ASD Kalos Fit?
                        </Label>
                        <Switch
                          id="member-toggle"
                          checked={memberToggle}
                          onCheckedChange={(v) => {
                            setMemberToggle(v);
                            if (!v) setMemberCodeInput("");
                          }}
                        />
                      </div>
                      {memberToggle && (
                        <div>
                          <Label className="text-muted-foreground text-xs">Codice socio</Label>
                          <Input
                            type="password"
                            value={memberCodeInput}
                            onChange={(e) => setMemberCodeInput(e.target.value)}
                            placeholder="inserisci il codice sconto"
                            className={cyberInput}
                          />
                          {codeStatus === "ok" && (
                            <p className="text-[11px] text-primary mt-1 flex items-center gap-1">
                              <Check className="h-3 w-3" /> Codice valido — prezzi soci attivi
                            </p>
                          )}
                          {codeStatus === "ko" && (
                            <p className="text-[11px] text-red-400 mt-1">il codice sconto verrà conferito in palestra</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                        Durata abbonamento {isMember ? "(prezzi soci)" : "(prezzi standard)"}
                      </Label>
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(Object.keys(PRICES) as Duration[]).map(durationChip)}
                      </div>
                    </div>

                    {errors.step1 && <p className="text-xs text-red-400">{errors.step1}</p>}
                  </div>
                )}

                {flow === "scheda" && step === 2 && (
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

                {flow === "scheda" && step === 3 && (
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
                    {duration && (
                      <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {PRICES[duration].label} {isMember ? "(socio)" : "(esterno)"}
                        </span>
                        <span className="text-primary font-mono font-bold">€{currentPrice}</span>
                      </div>
                    )}
                    {errors.submit && <p className="text-xs text-red-400">{errors.submit}</p>}
                  </div>
                )}

                {flow === "merch" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {MERCH_CATALOG.map((p) => {
                        const item = merchItems.find((m) => m.id === p.id);
                        const selected = !!item;
                        const Icon = p.icon;
                        return (
                          <div
                            key={p.id}
                            className={`rounded-lg border p-3 transition ${
                              selected
                                ? "border-primary bg-primary/10 shadow-[0_0_16px_-4px_hsl(var(--primary)/0.5)]"
                                : "border-primary/20 bg-black/30"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleMerchItem(p.id)}
                              className="w-full flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-9 w-9 rounded-md flex items-center justify-center border ${selected ? "border-primary text-primary" : "border-primary/30 text-foreground/60"}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                  <div className="font-semibold text-foreground text-sm">{p.name}</div>
                                  <div className="text-[11px] text-muted-foreground">€{p.price}</div>
                                </div>
                              </div>
                              <div className={`h-5 w-5 rounded border flex items-center justify-center ${selected ? "border-primary bg-primary text-primary-foreground" : "border-primary/30"}`}>
                                {selected && <Check className="h-3.5 w-3.5" />}
                              </div>
                            </button>
                            {selected && item && (
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-[10px] text-muted-foreground uppercase">Taglia</Label>
                                  <Select
                                    value={item.size}
                                    onValueChange={(v) => updateMerchItem(p.id, { size: v as Size })}
                                  >
                                    <SelectTrigger className={cyberInput}>
                                      <SelectValue placeholder="Seleziona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {(["S", "M", "L", "XL", "XXL"] as Size[]).map((s) => (
                                        <SelectItem key={s} value={s}>
                                          {s}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-muted-foreground uppercase">Quantità</Label>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-9 w-9 border-primary/30"
                                      onClick={() =>
                                        updateMerchItem(p.id, { qty: Math.max(1, item.qty - 1) })
                                      }
                                    >
                                      <Minus className="h-3.5 w-3.5" />
                                    </Button>
                                    <span className="flex-1 text-center font-mono text-foreground">{item.qty}</span>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-9 w-9 border-primary/30"
                                      onClick={() => updateMerchItem(p.id, { qty: item.qty + 1 })}
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-muted-foreground italic">
                      Prezzi soci da verificare al momento dell'ordine.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-muted-foreground text-xs">Nome *</Label>
                        <Input value={mFirstName} onChange={(e) => setMFirstName(e.target.value)} className={cyberInput} />
                        {errors.firstName && <p className="text-[11px] text-red-400 mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Cognome *</Label>
                        <Input value={mLastName} onChange={(e) => setMLastName(e.target.value)} className={cyberInput} />
                        {errors.lastName && <p className="text-[11px] text-red-400 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-xs">Vorresti altro?</Label>
                      <Textarea
                        value={merchSuggestion}
                        onChange={(e) => setMerchSuggestion(e.target.value)}
                        placeholder="Es. polsini, cinture, cappellini…"
                        rows={3}
                        className={cyberInput}
                      />
                    </div>

                    {merchItems.length > 0 && (
                      <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm flex items-center justify-between">
                        <span className="text-muted-foreground">Totale indicativo</span>
                        <span className="text-primary font-mono font-bold">€{merchTotal}</span>
                      </div>
                    )}

                    {errors.merch && <p className="text-xs text-red-400">{errors.merch}</p>}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  onClick={prev}
                  disabled={submitting}
                  className="text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Indietro
                </Button>

                {flow === "scheda" && step < 3 && (
                  <Button
                    onClick={next}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)]"
                  >
                    Avanti <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}

                {flow === "scheda" && step === 3 && (
                  <Button
                    onClick={submit}
                    disabled={submitting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Invio…
                      </>
                    ) : (
                      "Invia richiesta"
                    )}
                  </Button>
                )}

                {flow === "merch" && (
                  <Button
                    onClick={submitMerch}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)]"
                  >
                    Invia su WhatsApp
                  </Button>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-primary/15 space-y-1.5">
                <p className="text-[11px] text-muted-foreground">
                  I tuoi dati verranno trattati solo per l'elaborazione della richiesta.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Ti risponderemo entro 24/48 ore lavorative.
                </p>
              </div>
            </>
          )}

          {success && (
            <div className="mt-6 flex flex-col items-center text-center gap-3 py-4">
              <div className="h-14 w-14 rounded-full bg-primary/20 border border-primary flex items-center justify-center shadow-[0_0_30px_-4px_hsl(var(--primary)/0.7)]">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                La tua richiesta è stata inviata con successo, ti risponderemo entro 24/48h lavorative.
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
