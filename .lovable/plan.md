## Obiettivo

Trasformare la pagina **Scheda Allenamento** in un sistema di programmazione annuale periodizzata (calendario 2026), con navigazione deep-dive per skill, parametri tecnici completi (reps/sec, kg, elastici), salvataggio sessione su Lovable Cloud, reset con riferimento "Previous", e storico settimanale.

## 1. Periodizzazione annuale fissa (ciclo 5 settimane)

Nuovo helper `src/lib/periodization.ts`:

- `getISOWeek(date)` calcola il numero di settimana ISO 8601 (settimane lunedì→domenica) per il calendario 2026 (1 Gen → 31 Dic).
- `getPhase(weekNumber)` mappa la settimana sul ciclo:

| Posizione nel ciclo (week % 5) | Fase | Sigla | Parametri suggeriti |
|---|---|---|---|
| 1 | FORZA | `strength` | 5×3 reps · recupero 180s |
| 2 | FORZA | `strength` | 5×3 reps · recupero 180s |
| 3 | IPERTROFIA | `hypertrophy` | 4×8 reps · recupero 90s |
| 4 | RESISTENZA | `endurance` | 3×15 reps · recupero 60s |
| 0 (5° settimana) | SCARICO | `deload` | 2×6 reps al 50% · recupero 120s |

Esposto come `getCurrentPhase()` → `{ week, phase, label, suggested: { sets, reps, rest } }`.

Badge dinamico in cima alla scheda: `"Settimana 14 · IPERTROFIA"` con accento `--primary` verde neon e icona Calendar.

I parametri suggeriti compaiono come placeholder/ghost negli input vuoti e in un mini hint sotto al badge ("Suggerito: 4×8 · 90s rec"). Non sovrascrivono valori già inseriti.

## 2. Navigazione Deep-Dive (Lista → Dettaglio)

`WorkoutPlan.tsx` adotta un pattern a due livelli con stato locale `selectedSkillId`:

- **Livello 1 — Lista compatta**: griglia di card (riuso stile `SkillCard` compact) con tutte le skill che hanno almeno una progressione attiva o selezionata. Ogni card mostra: immagine, nome, badge fase, e check verde "Done" se la sessione della settimana corrente è già stata completata (vedi §4).
- **Livello 2 — Dettaglio**: solo gli esercizi della skill selezionata, raggruppati per i tre macroblocchi standard del progetto: **Dinamico** (`dynamic`), **Isometria** (`iso`), **Potenziamento** (`power`). Skill con un solo gruppo (`main`) vengono mostrate sotto un'unica sezione "Progressione". In testa al dettaglio: pulsante `← Indietro` ben visibile (Button variant ghost con freccia), titolo skill, badge fase corrente.

Lo stato `selectedSkillId` è sincronizzato in URL via query string (`?skill=front-lever`) per supportare deep-link, refresh e tasto "indietro" del browser.

## 3. Campi tecnici per esercizio

Ogni riga esercizio nel livello 2 espone (riusando i pattern di `LoadEditor`):

- **Reps / Secondi** (numerici, mutuamente esclusivi a seconda che `group.hasTimer` sia true)
- **Zavorra (kg)** — input numerico decimale
- **Tipologia Elastico** — select con i `BAND_COLORS` esistenti (giallo/rosso/nero/viola/verde) + opzione "Nessuno"
- **Serie** e **Recupero (s)** — già presenti

Tutti i valori sono salvati su `user_workouts` (campo `load_band` per l'elastico, `load_kg` per la zavorra, `reps`/`seconds`/`sets`/`recovery` invariati). Nessuna modifica di schema.

## 4. Sessioni: Fine allenamento, Reset, Previous, Storico

### Nuova tabella `workout_sessions`

```text
workout_sessions
├─ id uuid pk
├─ user_id uuid (RLS: own)
├─ skill_id text
├─ year int          -- 2026
├─ iso_week int      -- 1..53
├─ phase text        -- 'strength' | 'hypertrophy' | 'endurance' | 'deload'
├─ completed_at timestamptz
├─ entries jsonb     -- snapshot completo: [{groupId, index, name, sets, reps, seconds, kg, band, recovery}]
└─ created_at / updated_at
```

RLS: solo proprietario può select/insert/update/delete. Indice su `(user_id, year, iso_week)`.

### Comportamenti

- **Fine Allenamento** (per skill, nel livello 2): salva snapshot corrente in `workout_sessions` con `iso_week` e `phase` correnti. Marca la skill come "Done" per la settimana corrente → spunta verde nella card livello 1. Toast di conferma.
- **Resetta Sessione**: svuota gli input attivi della skill ma carica l'ultima sessione completata come `previous` e la mostra in grigio sotto ogni input (es. `Previous: 4×8 · 12kg · elastico nero`). Nessuna scrittura distruttiva su `workout_sessions`.
- **Storico**: nuovo pulsante `History` apre un drawer/modale con le sessioni passate raggruppate per **anno → settimana → fase**. Ogni voce è espandibile per vedere il dettaglio degli `entries` salvati. Filtro implicito su `year=2026`.

## 5. Estetica

Mantenere il tema Dark Tech esistente: sfondo nero, accenti `--primary` verde neon, bordi `border-primary/30`, glow esistenti. Badge fase con stesso stile dei badge "current". Nessun colore custom — tutti i token da `index.css`/`tailwind.config.ts`.

## 6. Traduzioni

In `src/i18n/dictionary.ts` (it/en/es) aggiungere namespace `plan`:
- `weekBadge`, `phaseStrength`, `phaseHypertrophy`, `phaseEndurance`, `phaseDeload`
- `suggestedParams`, `back`, `finishWorkout`, `resetSession`, `history`, `previous`
- `sectionDynamic`, `sectionIso`, `sectionPower`
- `band`, `bandNone`, `loadKg`
- `done`, `noSessions`, `historyTitle`, `weekLabel`

## Dettagli tecnici

### Nuovi file
- `src/lib/periodization.ts` — calcolo settimana ISO + fase + parametri suggeriti
- `src/hooks/useWorkoutSessions.ts` — CRUD su `workout_sessions` (select per skill/anno, insert "fine allenamento", select "previous" = ultima per skill)
- `src/components/PhaseBadge.tsx` — badge dinamico settimana+fase
- `src/components/WorkoutHistoryDrawer.tsx` — drawer storico raggruppato per settimana/fase
- `src/components/SkillSessionDetail.tsx` — vista livello 2 con back, sezioni Dinamico/Isometria/Potenziamento, righe esercizio estese

### File modificati
- `src/pages/WorkoutPlan.tsx` — riscrittura: livello 1 (lista card) + livello 2 (dettaglio) controllati da `?skill=` in URL. Badge fase in header. Pulsante History in toolbar.
- `src/i18n/dictionary.ts` — chiavi nuove

### Migrazione DB
Solo creazione tabella `workout_sessions` con RLS. Nessuna modifica a `user_workouts`, `user_skills`, `profiles`.

### Logica "Done della settimana"
Skill ha spunta verde nella card livello 1 ⇔ esiste un record in `workout_sessions` con `user_id=auth.uid()`, `skill_id=<id>`, `year=2026`, `iso_week=<corrente>`. La query è già coperta dalla select di tutte le sessioni del 2026 in `useWorkoutSessions`.

### "Previous" reference
`useWorkoutSessions.getPrevious(skillId)` → ultima `workout_sessions` per la skill (ordine `completed_at desc limit 1`). Il dettaglio livello 2 la usa per popolare il subtesto grigio sotto ogni input.

### Selezione esercizi
Resta invariata la logica esistente: gli esercizi mostrati nel dettaglio sono quelli con `progress_index >= 0` (skill non selezionabili) o quelli `selected` per push/pull/legs (`useSelectedExercises`). Lo snapshot `entries` salvato in `workout_sessions` cattura solo gli esercizi presenti al momento di "Fine Allenamento".

### Compatibilità
Le sessioni live continuano a scrivere su `user_workouts` (non si tocca quel flusso). `workout_sessions` è la fotografia storica al momento del completamento e non interferisce con la scheda live, la classifica Kalos o i massimali.
