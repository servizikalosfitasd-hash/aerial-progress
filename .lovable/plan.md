# Countdown Sec + Recupero nella Scheda Allenamento

## Obiettivo
Nella pagina `/scheda` (WorkoutPlan), per ogni esercizio mostrare **due countdown distinti**:
1. **Countdown "Sec"** — basato sul campo `Sec` (durata della tenuta/lavoro)
2. **Countdown "Recupero"** — basato sul campo `Recupero (s)`

Entrambi devono essere **modificabili direttamente dal countdown** (oltre che dagli input numerici già presenti) e restare sincronizzati con i valori salvati in `useLoad`.

## Modifiche

### `src/pages/WorkoutPlan.tsx` (`ExerciseRow`)
Sostituire l'unico `CountdownTimer` attuale con due countdown affiancati ed etichettati:

```text
[ SetCounter ]   [⏱ Lavoro: 00:30 ▶ ↻]   [⏱ Recupero: 01:00 ▶ ↻]
```

- Countdown "Lavoro" → `initialSeconds={entry.seconds ?? 30}`, `label="Lavoro"`, on change → `onChange({ seconds: n })`
- Countdown "Recupero" → `initialSeconds={entry.rest ?? 60}`, `label="Recupero"`, on change → `onChange({ rest: n })`
- Mostrare il countdown "Lavoro" solo quando ha senso (sempre, default 30s se non impostato — coerente con gli input).

### `src/components/CountdownTimer.tsx`
Il componente già espone `onTargetChange` e in modalità `compact` permette di modificare i secondi via `<input type="number">` quando il timer è fermo. Aggiunte minime:
- Aggiungere prop opzionale `label?: string` visibile anche in modalità `compact` (chip piccola a sinistra: "Lavoro" / "Recupero") per distinguere i due timer.
- Quando cambia `initialSeconds` dall'esterno (es. l'utente modifica l'input "Sec" o "Recupero"), risincronizzare `target` e `remaining` se il timer non sta girando. Attualmente il valore iniziale viene catturato solo al mount.

Nessun'altra pagina viene toccata; nessuna logica di business modificata oltre alla persistenza già esistente di `seconds` e `rest` via `useLoad`.
