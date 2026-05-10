# Piano di trasformazione Mobile-First + Cyber-Medical

Lavoro grosso e multi-area. Lo divido in 7 blocchi consegnati in un'unica iterazione, ma chiaramente separati per facilità di revisione.

## 1. Shell App + Sidebar (Navigation Drawer)

- Aggiungo `AppLayout` con `SidebarProvider` di shadcn (`components/ui/sidebar`).
- Nuovo file `src/components/AppSidebar.tsx` con voci: Dashboard, Skills, Massimali, Circuiti, Stability, Stretching, Legs, **Scheda Allenamento**, **Richiedi Scheda Custom**.
- Header sticky mobile con icona hamburger (`Menu` di lucide) → `SidebarTrigger`.
- "Richiedi Scheda Custom" non è una route: dispatcha un `CustomEvent("open-lead-modal")` ascoltato dal `LeadModal`, che si apre **anche se già dismesso/inviato** (bypassa storage).
- Aggiorno `LeadModal` con prop/event listener per apertura forzata.
- Routing in `App.tsx`: tutte le pagine wrappate in `AppLayout` con `<Outlet />`.

## 2. Mobile responsive pass

- Container: `px-4 sm:px-6`, titoli `text-3xl sm:text-5xl`.
- `min-w-0` + `truncate`/`break-words` dove serve, `overflow-x-hidden` sul body.
- Griglie: tutti i `md:grid-cols-[300px_1fr]` testati a 360px.

## 3. Nuova sezione "Scheda Allenamento" (`/scheda`)

- Pagina `src/pages/WorkoutPlan.tsx`.
- Aggrega da localStorage tutti gli esercizi selezionati per ogni Skill (legge gli stessi key già usati da `SkillDetail`/`Stability`/`Legs`).
- Raggruppati per Skill (Front Lever, Planche, Stability/articolazione, Legs…).
- Ogni riga: campi inline editabili **Serie / Sec / Rip / Recupero** (Input controllati, salvataggio debounced su localStorage).
- Per ogni esercizio: **Set counter** ("Set 1 di N", click per avanzare, reset a fine) + **Countdown Timer** (mm:ss, Start/Pause/Reset) usato sia per isometrie sia per recupero.

## 4. Performance Tools riusabili

- `src/components/SetCounter.tsx`: tap per avanzare, badge "Set k / N", long-press reset.
- `src/components/CountdownTimer.tsx`: input secondi, Start/Pause/Reset, beep a 0 (Web Audio).
- Inseriti anche dentro `SkillDetail` per ogni propedeutica e in Stability.

## 5. Sezione Stretching (`/stretching`)

- Pagina `src/pages/Stretching.tsx`, dati statici raggruppati: Pettorali, Dorsali, Spalle, Gambe, Braccia, Flessori dell'anca, Glutei, Core.
- Card per esercizio: nome, descrizione breve, immagine placeholder (`/placeholder.svg`), durata consigliata.
- Tabs/Accordion per gruppo muscolare.

## 6. Revisione Legs

- Rimosso il sistema a livelli bloccati: griglia libera di esercizi (Squat, Affondi, Bulgarian Split, RDL, Hip Thrust, Calf Raise, Pistol, Nordic Curl, Sissy Squat…).
- Per ogni card: campi modificabili Serie/Rip/Carico/Note + Set counter + Timer.
- Persistenza in `kalos-legs-v2`.

## 7. Stability — Anatomical Dashboard "Cyber-Medical"

Riscrittura completa di `AnatomyMap.tsx`:

- Sfondo `#0a0a0a`, griglia millimetrata sottile grigio scuro (#1f1f1f), accento verde `#22c55e` / `#deff9a`.
- Due figure (FRONT, SIDE): outline verde neon + skeleton interno stilizzato (gabbia toracica con coste, colonna a segmenti, bacino), tutto in trasparenza.
- Braccia complete di avambracci e mani.
- Glow dots pulsanti su articolazioni con linea callout verso label esterna ("Spalla dx", "Gomito sx", ecc.).
- SIDE: solo Cervicale, Thoracic Spine, Colonna Vertebrale (Lombare).
- Sotto le mappe: griglia di pulsanti rettangolari arrotondati per articolazione; quello attivo bordo verde brillante + testo verde.
- Sincronizzazione bidirezionale dot ↔ button (già passa `active`/`onSelect`); aumento intensità glow quando attivato dal pannello.
- Font monospace (`font-mono`) per tag "ANAT-MAP / 01" e "v1.0".
- Mobile: `flex-col` (sagome impilate); desktop: `flex-row`.

## Dettagli tecnici

```text
src/
├── components/
│   ├── AppSidebar.tsx          [new]
│   ├── AppLayout.tsx           [new]
│   ├── SetCounter.tsx          [new]
│   ├── CountdownTimer.tsx      [new]
│   ├── AnatomyMap.tsx          [rewrite, cyber-medical]
│   └── LeadModal.tsx           [+ event listener "open-lead-modal"]
├── pages/
│   ├── WorkoutPlan.tsx         [new]
│   ├── Stretching.tsx          [new]
│   └── Legs.tsx                [rewrite, no lock system]
├── App.tsx                     [routes wrapped in AppLayout]
└── i18n/dictionary.ts          [+ keys per nuove sezioni]
```

Persistenza: tutto su `localStorage` (no backend richiesto). LeadModal mantiene `customPlanRequested` ma la voce di menu forza l'apertura ignorando il flag.

## Note

- Non tocco la logica di `Records` / `Circuits` se non per wrappare nel layout.
- Esiste già `src/pages/Index.tsx` come Dashboard: resta come home, accessibile anche dalla sidebar.
- Se non trovo una pagina `Legs.tsx` nel progetto, la creo nuova e aggiungo la rotta.

Confermi e procedo?
