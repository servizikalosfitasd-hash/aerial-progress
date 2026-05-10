import { useState } from "react";
import { StretchHorizontal, Clock } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CountdownTimer } from "@/components/CountdownTimer";

interface Stretch {
  name: string;
  desc: string;
  seconds: number;
}
interface Group {
  id: string;
  label: string;
  items: Stretch[];
}

const GROUPS: Group[] = [
  {
    id: "chest",
    label: "Pettorali",
    items: [
      { name: "Doorway stretch", desc: "Mano e avambraccio sullo stipite, ruota il busto in direzione opposta.", seconds: 30 },
      { name: "Stretch al muro a 90°", desc: "Braccio teso al muro, ruota il torso allungando il pettorale.", seconds: 30 },
      { name: "Foam roller toracico", desc: "Disteso con foam roller sotto la colonna, apri le braccia a croce.", seconds: 45 },
    ],
  },
  {
    id: "back",
    label: "Dorsali",
    items: [
      { name: "Child pose con allungo laterale", desc: "Posizione del bambino, mani spostate a destra/sinistra.", seconds: 40 },
      { name: "Lat hang alla sbarra", desc: "Sospeso passivo, lascia rilassare scapole e dorsali.", seconds: 30 },
      { name: "Cat-cow", desc: "A 4 zampe, alterna gobba e lordosia con respiro lento.", seconds: 40 },
    ],
  },
  {
    id: "shoulders",
    label: "Spalle",
    items: [
      { name: "Cross body stretch", desc: "Braccio teso davanti al petto, tira con la mano opposta.", seconds: 30 },
      { name: "Sleeper stretch", desc: "Disteso sul fianco, gomito a 90°, spingi l'avambraccio verso il basso.", seconds: 30 },
      { name: "Band dislocates", desc: "Elastico tra le mani, passaggio sopra la testa avanti/indietro.", seconds: 60 },
    ],
  },
  {
    id: "arms",
    label: "Braccia",
    items: [
      { name: "Tricipiti dietro la testa", desc: "Gomito alto, mano dietro la nuca, spingi col braccio opposto.", seconds: 30 },
      { name: "Bicipiti al muro", desc: "Mano al muro indietro a 90°, ruota il torso lontano.", seconds: 30 },
      { name: "Allungo flessori del polso", desc: "Braccio teso, palmo verso l'alto, tira la mano verso il basso.", seconds: 25 },
    ],
  },
  {
    id: "legs",
    label: "Gambe",
    items: [
      { name: "Pancake / Pike forward fold", desc: "Seduto, gambe tese in avanti, busto verso le ginocchia.", seconds: 60 },
      { name: "Standing hamstring stretch", desc: "In piedi, una gamba sollevata, scendi col busto avanti.", seconds: 30 },
      { name: "Quadricipiti in piedi", desc: "Afferra il piede dietro avvicinando il tallone al gluteo.", seconds: 30 },
      { name: "Calf stretch al muro", desc: "Mani al muro, tallone a terra, gamba dietro tesa.", seconds: 30 },
    ],
  },
  {
    id: "hipflex",
    label: "Flessori dell'anca",
    items: [
      { name: "Affondo basso", desc: "Ginocchio a terra, anca avanti, busto eretto.", seconds: 45 },
      { name: "Couch stretch", desc: "Piede sul divano dietro, ginocchio a terra: spingi anca avanti.", seconds: 60 },
      { name: "Pigeon pose", desc: "Posizione del piccione: stira gluteo e flessore dell'anca.", seconds: 60 },
    ],
  },
  {
    id: "glutes",
    label: "Glutei",
    items: [
      { name: "Figure 4 a terra", desc: "Schiena a terra, caviglia sul ginocchio opposto, tira la coscia.", seconds: 45 },
      { name: "Seated cross stretch", desc: "Seduto, gamba accavallata, ruota il busto verso il ginocchio.", seconds: 30 },
    ],
  },
  {
    id: "core",
    label: "Core & Colonna",
    items: [
      { name: "Cobra", desc: "Prono, mani sotto le spalle, spingi il torace in alto.", seconds: 30 },
      { name: "Spinal twist supino", desc: "Schiena a terra, ginocchia piegate, ruotale a destra/sinistra.", seconds: 40 },
      { name: "Thread the needle", desc: "A 4 zampe, infila un braccio sotto l'altro per ruotare il torace.", seconds: 30 },
    ],
  },
];

const Stretching = () => {
  const [active, setActive] = useState(GROUPS[0].id);
  const group = GROUPS.find((g) => g.id === active)!;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-end gap-3">
          <LanguageSwitcher />
        </div>
      </header>

      <section className="bg-gradient-hero">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <StretchHorizontal className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-primary">
              Mobilità
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-[0.95] mb-3">
            Stretching
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Esercizi divisi per gruppo muscolare. Tieni ogni allungo respirando lentamente.
          </p>
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setActive(g.id)}
              className={`shrink-0 snap-start px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                active === g.id
                  ? "bg-primary text-primary-foreground border-primary shadow-glow"
                  : "bg-secondary/40 text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <h2 className="font-display text-2xl font-bold mb-4">{group.label}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {group.items.map((it, i) => (
            <article
              key={i}
              className="rounded-2xl bg-gradient-card border border-border shadow-elevated overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/9] bg-secondary/40 border-b border-border/50 flex items-center justify-center">
                <img src="/placeholder.svg" alt={it.name} className="h-16 w-16 opacity-50" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-sm mb-1">{it.name}</h3>
                <p className="text-xs text-muted-foreground flex-1">{it.desc}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                    <Clock className="h-3 w-3" />
                    {it.seconds}s
                  </span>
                  <CountdownTimer initialSeconds={it.seconds} compact />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Stretching;
