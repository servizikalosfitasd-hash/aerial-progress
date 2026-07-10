## Obiettivo

Aggiungere in cima a "Scheda Allenamento" un pannello che mostra il **Focus della settimana corrente** e la **programmazione giornaliera** (Lun–Ven) basata sul ciclo di 5 settimane.

## Comportamento

- La settimana ISO corrente viene mappata sul ciclo con `((week - 1) % 5) + 1` (riuso di `src/lib/periodization.ts`).
- Il pannello si aggiorna automaticamente al cambio di settimana; è possibile navigare avanti/indietro tra le settimane con due frecce (default: settimana corrente evidenziata come "Oggi").
- Il giorno odierno (Lun–Ven) viene evidenziato. Sabato/Domenica non compaiono.
- Per ogni giorno vengono mostrate le skill programmate come badge cliccabili: se la skill è presente in scheda, il tap apre la sessione (`?skill=...`), altrimenti resta informativo.
- Se un giorno non prevede il "Circuito Addome/Gambe", la riga si adatta senza spazi vuoti (nessun placeholder).
- Il "Focus" è mostrato in una card evidenziata sopra la griglia dei giorni, con badge fase (Forza/Ipertrofia/Resistenza/Scarico) coerente con `PhaseBadge`.

## File

**Nuovi**
- `src/lib/weeklySchedule.ts` — tabella dei 5 pattern settimanali + funzione `getWeeklySchedule(week)` che ritorna `{ focus, phaseHint, days: [{ day, skills: [{id?, label, isCircuit?}] }] }`.
- `src/components/WeeklyScheduleCard.tsx` — UI del pannello (Focus + griglia giorni + navigazione settimana).

**Modificati**
- `src/pages/WorkoutPlan.tsx` — inserire `<WeeklyScheduleCard />` nella `SkillListView` sotto la hero, prima della griglia skill. Click su una skill programmata → `onOpen(skillId)` se in scheda.

## Dati (mapping skill → id interno)

- Handstand → `handstand`
- Front Lever → `front-lever`
- Manna → `manna`
- Muscle Up → `muscle-up-bar` (etichetta "Muscle Up")
- Planche → `planche`
- Impossible Dips → `impossible-dips`
- Press to HS → `press-handstand`
- Back Lever → `back-lever`
- Human Flag → `human-flag`
- Iron Cross → `iron-cross`
- "Circuito Addome/Gambe 5/7 min" e "Circuito/Potenziamento + Skill Piacere" → chip informativi (non linkati)

## Focus per posizione ciclo

1. Potenziamento — max 5 reps / 30s isometria
2. Potenziamento — max 5 reps / 30s isometria
3. Ipertrofia — max 10/12 reps / 60s isometria
4. Resistenza — max 20 reps / 60s isometria
5. Scarico — max 2/3 reps / 15s isometria

## Note UI

- Card con `bg-gradient-card`, bordo `border-border`, coerente con lo stile esistente.
- Giorni in griglia responsive (5 col desktop, scroll orizzontale/stack mobile).
- Focus enfatizzato con accent primary; giorno odierno con `border-primary/60 shadow-glow`.
- Solo cambiamenti front-end/presentazione; nessuna modifica a DB o logica di sessione.