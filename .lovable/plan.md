## Modifiche al pulsante "Aggiungi massimale"

### 1. Testo del pulsante
In `src/i18n/dictionary.ts`, aggiornare la chiave `load.addMax` nelle 3 lingue:
- IT: "Aggiungi massimale" → "Aggiorna progresso"
- EN: "Add max" → "Update progress"
- ES: "Añadir máximo" → "Actualizar progreso"

### 2. Icona del pulsante
In `src/components/LoadEditor.tsx` (riga 132), sostituire l'icona `Dumbbell` (che visivamente nel pulsante compatto può sembrare un trifoglio) con `ClipboardList` di lucide-react, per richiamare l'idea di inserimento dati / lista. L'icona `Dumbbell` resterà solo dove rappresenta il riepilogo del carico (riga 126).

### 3. Sottotitolo / micro-didascalia
In `src/pages/SkillDetail.tsx`, dentro il `ProgressionGroupBlock`, all'interno di ogni riga di progressione che è `isCurrent`, aggiungere — sopra il `LoadEditor` (sezione `px-5 pb-4`) e sotto il badge "ATTUALE" — una piccola didascalia grigia visibile **solo** quando il pulsante è in stato compatto (cioè non è ancora stato inserito alcun dato, equivalente al caso `!hasAnyMetric && !hasLoad`).

Per evitare di duplicare la logica di stato fra i due componenti, la didascalia verrà esposta come prop opzionale `hint` di `LoadEditor` e renderizzata sopra il pulsante compatto soltanto quando il pulsante mostra il testo "Aggiorna progresso" (stato vuoto). Testo aggiunto al dizionario come `load.addMaxHint`:
- IT: "Inserisci reps, secondi, serie, zavorra etc."
- EN: "Enter reps, seconds, sets, load, etc."
- ES: "Introduce reps, segundos, series, lastre, etc."

Stile: `text-[11px] text-muted-foreground mb-1.5`.

In `SkillDetail.tsx` il `LoadEditor` riceverà `hint={isCurrent ? t.load.addMaxHint : undefined}` per mostrarla solo nella riga ATTUALE.

### File modificati
- `src/i18n/dictionary.ts` — aggiornare `addMax`, aggiungere `addMaxHint` (IT/EN/ES + tipo).
- `src/components/LoadEditor.tsx` — nuova prop `hint`, sostituzione icona del pulsante compatto con `ClipboardList`, render della didascalia sopra il pulsante.
- `src/pages/SkillDetail.tsx` — passare `hint` a `LoadEditor` solo per la progressione corrente.

Nessuna modifica a logica dati, stato o backend.