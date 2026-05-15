# Scheda Allenamento — Salvataggio indipendente per Skill

La logica esiste già in gran parte (`saveSession` salva una skill alla volta, `isDoneThisWeek` mostra la spunta, `WorkoutHistoryDrawer` espone lo storico, `getCurrentPhase` gestisce la periodizzazione 2026). Servono tre rifiniture mirate per allinearsi alla richiesta.

## Modifiche

### 1. Card Skill (Level 1) — mostra orario salvataggio
File: `src/pages/WorkoutPlan.tsx` (`SkillListView`) + `src/hooks/useWorkoutSessions.ts`

- Aggiungere helper `getLastSessionThisWeek(skillId, year, week)` in `useWorkoutSessions` che ritorna la sessione più recente della settimana corrente (con `completed_at`).
- In `SkillListView`, sostituire il testo statico "Done questa settimana" con `Salvato alle HH:mm` (formato 24h, locale `it-IT`) quando la skill è completata.
- Mantenere bordo `primary` + spunta verde già presenti.

### 2. Detail (Level 2) — etichette e azione per-skill
File: `src/pages/WorkoutPlan.tsx` (`SkillSessionDetail`)

- Rinominare CTA principale da **"Fine Allenamento"** → **"Salva Allenamento Skill"**.
- Rinominare CTA secondaria da **"Resetta Sessione"** → **"Resetta Skill"**.
- Toast di salvataggio: aggiornare descrizione in `Skill salvata · Settimana N · HH:mm`.
- Dopo `saveSession`, se la skill era già "done" nella settimana corrente, mostrare comunque conferma (il refresh del hook aggiorna `isDoneThisWeek` e l'orario).
- Nessun cambio alla logica di salvataggio: già atomica per `skill_id`.

### 3. Storico (`WorkoutHistoryDrawer`) — filtro fase
File: `src/components/WorkoutHistoryDrawer.tsx`

- Aggiungere un piccolo `Select` in cima al drawer per filtrare per fase (`TUTTE | FORZA | IPERTROFIA | RESISTENZA | SCARICO`).
- Mantenere il raggruppamento per settimana già esistente.
- (Filtro per data già implicito tramite ordinamento decrescente per `completed_at`; nessun date-picker aggiuntivo.)

## Fuori scope (già implementato, nessuna modifica)
- Periodizzazione 2026 / `PhaseBadge` / `PhaseSuggestedHint`
- Tabella `workout_sessions` + RLS
- Navigazione two-level via query param `?skill=`
- SetCounter / CountdownTimer / Stopwatch
- Badge "Previous" sotto ogni esercizio

## Note tecniche
- Nessuna migrazione DB necessaria.
- Nessun cambio a `useLoad` o ai dati inseriti in input.
- Tutto lato presentazione + un helper nel hook esistente.
