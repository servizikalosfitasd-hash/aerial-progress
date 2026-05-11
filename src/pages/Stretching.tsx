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
    id: "neck",
    label: "Collo",
    items: [
      { name: "Inclinazione laterale", desc: "Seduto, inclina la testa verso la spalla aiutandoti con la mano.", seconds: 30 },
      { name: "Rotazione cervicale", desc: "Ruota lentamente la testa a destra e sinistra mantenendo le spalle rilassate.", seconds: 30 },
      { name: "Flessione anteriore", desc: "Mento al petto, mani dietro la nuca per leggera trazione.", seconds: 25 },
      { name: "Levator scapulae stretch", desc: "Guarda verso l'ascella opposta, tira la testa con la mano.", seconds: 30 },
      { name: "Sternocleidomastoideo", desc: "Estendi il collo indietro e ruota lateralmente per allungare il lato del collo.", seconds: 25 },
      { name: "Chin tucks", desc: "Spingi il mento indietro mantenendo lo sguardo orizzontale.", seconds: 20 },
    ],
  },
  {
    id: "chest",
    label: "Pettorali",
    items: [
      { name: "Doorway stretch", desc: "Mano e avambraccio sullo stipite, ruota il busto in direzione opposta.", seconds: 30 },
      { name: "Stretch al muro a 90°", desc: "Braccio teso al muro, ruota il torso allungando il pettorale.", seconds: 30 },
      { name: "Foam roller toracico", desc: "Disteso con foam roller sotto la colonna, apri le braccia a croce.", seconds: 45 },
      { name: "Pec stretch alle parallele basse", desc: "Mani su due appoggi, lascia scendere il petto fra le braccia.", seconds: 30 },
      { name: "Cobra con apertura", desc: "Cobra con braccia larghe per aprire i pettorali alti.", seconds: 30 },
      { name: "Stretch supino con bastone", desc: "Sdraiato, bastone tra le mani, porta le braccia oltre la testa.", seconds: 40 },
      { name: "Camel pose modificata", desc: "In ginocchio, mani ai talloni, spingi torace e bacino in avanti.", seconds: 30 },
    ],
  },
  {
    id: "back",
    label: "Dorsali",
    items: [
      { name: "Child pose con allungo laterale", desc: "Posizione del bambino, mani spostate a destra/sinistra.", seconds: 40 },
      { name: "Lat hang alla sbarra", desc: "Sospeso passivo, lascia rilassare scapole e dorsali.", seconds: 30 },
      { name: "Cat-cow", desc: "A 4 zampe, alterna gobba e lordosia con respiro lento.", seconds: 40 },
      { name: "Prayer stretch", desc: "In ginocchio, mani lontane su un rialzo, petto verso il pavimento.", seconds: 45 },
      { name: "Lat stretch al muro", desc: "Mani al muro, scendi col busto fino a 90° e spingi indietro le anche.", seconds: 40 },
      { name: "Side bend in piedi", desc: "Braccio sopra la testa, inclina il busto lateralmente.", seconds: 30 },
      { name: "Thread the needle", desc: "A 4 zampe, infila un braccio sotto l'altro ruotando il torace.", seconds: 30 },
    ],
  },
  {
    id: "shoulders",
    label: "Spalle",
    items: [
      { name: "Cross body stretch", desc: "Braccio teso davanti al petto, tira con la mano opposta.", seconds: 30 },
      { name: "Sleeper stretch", desc: "Disteso sul fianco, gomito a 90°, spingi l'avambraccio verso il basso.", seconds: 30 },
      { name: "Band dislocates", desc: "Elastico tra le mani, passaggio sopra la testa avanti/indietro.", seconds: 60 },
      { name: "Behind-the-back stretch", desc: "Mani intrecciate dietro la schiena, solleva le braccia.", seconds: 30 },
      { name: "Posa dell'aquila (braccia)", desc: "Avvolgi un braccio sopra l'altro davanti al petto e solleva.", seconds: 30 },
      { name: "Wall slides", desc: "Schiena al muro, fai scorrere le braccia su e giù mantenendo il contatto.", seconds: 45 },
      { name: "German hang", desc: "Sospeso a sbarra in posizione di skin-the-cat, allunga deltoidi e petto.", seconds: 30 },
    ],
  },
  {
    id: "arms",
    label: "Braccia",
    items: [
      { name: "Tricipiti dietro la testa", desc: "Gomito alto, mano dietro la nuca, spingi col braccio opposto.", seconds: 30 },
      { name: "Bicipiti al muro", desc: "Mano al muro indietro a 90°, ruota il torso lontano.", seconds: 30 },
      { name: "Allungo flessori del polso", desc: "Braccio teso, palmo verso l'alto, tira la mano verso il basso.", seconds: 25 },
      { name: "Allungo estensori del polso", desc: "Braccio teso, palmo in giù, tira il dorso della mano verso il corpo.", seconds: 25 },
      { name: "Prayer stretch polsi", desc: "Mani giunte davanti al petto, abbassa i polsi mantenendo il contatto.", seconds: 30 },
      { name: "Reverse prayer (dorsi)", desc: "Mani giunte con dorso contro dorso, alza i polsi.", seconds: 25 },
      { name: "Tabletop stretch", desc: "A terra, mani indietro con palmi a terra, sposta il bacino in avanti.", seconds: 30 },
    ],
  },
  {
    id: "forearms",
    label: "Avambracci & Mani",
    items: [
      { name: "Quadruped flessori", desc: "A 4 zampe, palmi a terra dita verso le ginocchia, siedi indietro.", seconds: 40 },
      { name: "Quadruped estensori", desc: "A 4 zampe, dorso delle mani a terra dita verso le ginocchia.", seconds: 30 },
      { name: "Allungamento dita una a una", desc: "Tira indietro ogni dito singolarmente per 5 secondi.", seconds: 30 },
      { name: "Apertura/chiusura pugno", desc: "Apri e chiudi le mani con forza per attivare e rilassare.", seconds: 30 },
      { name: "Pronazione/supinazione", desc: "Avambraccio appoggiato, ruota lentamente il polso.", seconds: 30 },
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
      { name: "Soleo (ginocchio piegato)", desc: "Come il calf stretch ma piega il ginocchio posteriore.", seconds: 30 },
      { name: "Butterfly stretch", desc: "Seduto, piante dei piedi unite, ginocchia verso il pavimento.", seconds: 45 },
      { name: "Straddle laterale", desc: "Seduto a gambe larghe, busto sopra una gamba alla volta.", seconds: 45 },
      { name: "Middle split assistito", desc: "Apertura laterale delle gambe in piedi con appoggio.", seconds: 60 },
      { name: "Front split progression", desc: "Affondo profondo con appoggi, scendi gradualmente verso lo split.", seconds: 60 },
      { name: "Adduttori al muro", desc: "Sdraiato, glutei al muro, gambe aperte a V.", seconds: 60 },
      { name: "Quadricipiti supino (lying quad)", desc: "Sdraiato sul fianco, afferra il piede e tira verso il gluteo.", seconds: 30 },
      { name: "Tibiale anteriore", desc: "In ginocchio sui dorsi dei piedi, siedi sui talloni.", seconds: 30 },
    ],
  },
  {
    id: "hipflex",
    label: "Flessori dell'anca",
    items: [
      { name: "Affondo basso", desc: "Ginocchio a terra, anca avanti, busto eretto.", seconds: 45 },
      { name: "Couch stretch", desc: "Piede sul divano dietro, ginocchio a terra: spingi anca avanti.", seconds: 60 },
      { name: "Pigeon pose", desc: "Posizione del piccione: stira gluteo e flessore dell'anca.", seconds: 60 },
      { name: "Sphinx + sollevamento gamba", desc: "In sfinge, solleva alternativamente le gambe per attivare flessori.", seconds: 30 },
      { name: "Lizard pose", desc: "Affondo profondo con entrambe le mani all'interno del piede.", seconds: 45 },
      { name: "Half kneeling stretch dinamico", desc: "Affondo a terra, oscilla avanti e indietro lentamente.", seconds: 40 },
    ],
  },
  {
    id: "glutes",
    label: "Glutei & Piriforme",
    items: [
      { name: "Figure 4 a terra", desc: "Schiena a terra, caviglia sul ginocchio opposto, tira la coscia.", seconds: 45 },
      { name: "Seated cross stretch", desc: "Seduto, gamba accavallata, ruota il busto verso il ginocchio.", seconds: 30 },
      { name: "Pigeon a terra", desc: "Gamba davanti piegata a 90°, gamba dietro distesa, busto in avanti.", seconds: 60 },
      { name: "Happy baby pose", desc: "Schiena a terra, afferra i piedi con ginocchia verso le ascelle.", seconds: 40 },
      { name: "Deep squat hold", desc: "Squat profondo a piedi piatti con gomiti a spingere le ginocchia.", seconds: 60 },
      { name: "Standing figure 4", desc: "In piedi, caviglia sopra il ginocchio opposto e siedi indietro.", seconds: 30 },
    ],
  },
  {
    id: "core",
    label: "Core & Colonna",
    items: [
      { name: "Cobra", desc: "Prono, mani sotto le spalle, spingi il torace in alto.", seconds: 30 },
      { name: "Spinal twist supino", desc: "Schiena a terra, ginocchia piegate, ruotale a destra/sinistra.", seconds: 40 },
      { name: "Thread the needle", desc: "A 4 zampe, infila un braccio sotto l'altro per ruotare il torace.", seconds: 30 },
      { name: "Seated spinal twist", desc: "Seduto, una gamba accavallata, ruota il busto verso il ginocchio alto.", seconds: 40 },
      { name: "Posa del bambino", desc: "Glutei sui talloni, braccia distese in avanti, fronte a terra.", seconds: 60 },
      { name: "Bridge pose", desc: "Schiena a terra, solleva il bacino contraendo glutei.", seconds: 30 },
      { name: "Side plank stretch", desc: "Plank laterale con braccio teso verso l'alto per allungare il fianco.", seconds: 30 },
      { name: "Standing side bend", desc: "In piedi, mani intrecciate sopra la testa, inclina il busto.", seconds: 30 },
    ],
  },
  {
    id: "ankles",
    label: "Caviglie & Piedi",
    items: [
      { name: "Ankle circles", desc: "Solleva un piede e ruota la caviglia in entrambi i sensi.", seconds: 30 },
      { name: "Deep squat con dorsiflex", desc: "Squat profondo, sposta il peso avanti per allungare le caviglie.", seconds: 45 },
      { name: "Wall ankle mobility", desc: "In affondo davanti al muro, spingi il ginocchio oltre le dita del piede.", seconds: 30 },
      { name: "Toe stretch a terra", desc: "In ginocchio sui talloni con dita dei piedi flesse, siedi indietro.", seconds: 30 },
      { name: "Fascia plantare", desc: "Rotola una pallina sotto la pianta del piede.", seconds: 60 },
      { name: "Heel raises lente", desc: "In piedi, sali sulle punte e scendi lentamente per mobilità.", seconds: 40 },
    ],
  },
];

const Stretching = () => {
  const [active, setActive] = useState(GROUPS[0].id);
  const group = GROUPS.find((g) => g.id === active)!;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-5xl mx-auto pl-14 pr-4 sm:px-6 py-4 flex items-center justify-end gap-3">
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
            Libreria completa di esercizi divisi per gruppo muscolare. Tieni ogni
            allungo respirando lentamente e senza forzare.
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
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl font-bold">{group.label}</h2>
          <span className="text-xs text-muted-foreground">{group.items.length} esercizi</span>
        </div>
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
