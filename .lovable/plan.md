## Obiettivo

Integrare la gestione della **zavorra** per Pull Up e Dips, e separare i **massimali Kalos Games** dalle serie della scheda di allenamento anche per **Squat** e **Stacco**, in modo che i record della classifica non vengano sovrascritti dalle sessioni di workout.

## 1. Riquadro "Massimali Kalos Games" nella scheda atleta

Nella pagina `SkillDetail`, mostrare un nuovo blocco dedicato per:

- **Pull** (progressione "Pull up", indice 6)
- **Push** (progressione "Parallel Bar dip", indice 5) → Dips
- **Legs** (progressioni "Squat" indice 1 e "Stacco" indice 5)

### Campi
- **Pull / Dips**:
  - Massimale Reps (Endurance, bodyweight)
  - Massimale Zavorra: KG + Reps con quel carico (Power)
- **Squat / Stacco**:
  - Massimale Carico: KG + Reps (Power) — unico campo, niente endurance

L'utente può compilare uno, l'altro o entrambi. I valori sono **completamente indipendenti** dalle serie inserite nella scheda di allenamento.

## 2. Storage separato dalla scheda

Per evitare sovrascritture con i workout pianificati, i massimali Kalos vanno su un `group_id` virtuale dedicato (`kalos_power` per la zavorra, `kalos_endurance` per il bodyweight) sulla tabella esistente `user_workouts`. Nessuna migrazione DB richiesta — schema, RLS e funzione `leaderboard(_skill, _group, _idx)` già lo supportano.

Mappa storage:

| Esercizio | Endurance | Power |
|---|---|---|
| Pull Up | `pull` / `kalos_endurance` / 6 → `reps` | `pull` / `kalos_power` / 6 → `kg`+`reps` |
| Dips | `push` / `kalos_endurance` / 5 → `reps` | `push` / `kalos_power` / 5 → `kg`+`reps` |
| Squat | — | `legs` / `kalos_power` / 1 → `kg`+`reps` |
| Stacco | — | `legs` / `kalos_power` / 5 → `kg`+`reps` |

Le righe esistenti su `legs` / `weights` restano intoccate e continuano a servire la scheda di allenamento.

## 3. Pagina Classifica Kalos Games

In `src/pages/Leaderboard.tsx`:

- Sostituire il tab **PUSH UP** con **DIPS** (skill `push`, idx 5).
- **Pull Up** e **Dips**: due tabelle affiancate
  - **Power** → `leaderboard(skill, "kalos_power", idx)` ordinata per `kg` desc, tiebreak `reps` desc
  - **Endurance** → `leaderboard(skill, "kalos_endurance", idx)` ordinata per `reps` desc
- **Squat** e **Stacco**: solo tabella **Power** → `leaderboard("legs", "kalos_power", idx)` (non più `weights`)
- Etichette righe:
  - Power: `Nickname — 45 KG × 3`
  - Endurance: `Nickname — 25 Reps`
- Icone: `Dumbbell` (verde neon) per Power, `Zap` per Endurance.

## 4. Estetica

Mantenere il tema Dark Tech esistente (sfondo nero, accenti `--primary` verde neon, bordi `border-primary/30`, glow). Nessun colore custom.

## 5. Traduzioni

Aggiungere a `src/i18n/dictionary.ts` (it/en/es):
- `kalosMaxTitle`, `kalosMaxHint`
- `enduranceMax`, `enduranceMaxHint`
- `weightedMax`, `weightedMaxKg`, `weightedMaxReps`, `weightedMaxHint`
- Tab `DIPS`
- Sottotitoli `Power` / `Endurance` localizzati

## Dettagli tecnici

- Nuovo componente `KalosMaxEditor` in `src/components/` con due varianti:
  - `mode="power-endurance"` (Pull/Dips): card Endurance (1 input reps) + card Power (kg + reps)
  - `mode="power-only"` (Squat/Stacco): solo card Power
  - Salvataggio: `upsertWorkout` con il `group_id` virtuale; campo svuotato → `deleteWorkout`.
- In `SkillDetail.tsx`, dopo la lista progressioni, renderizzare condizionalmente `KalosMaxEditor` per:
  - `skill.id === "pull"` → idx 6, mode power-endurance
  - `skill.id === "push"` → idx 5, mode power-endurance
  - `skill.id === "legs"` → due editor: idx 1 (Squat) e idx 5 (Stacco), mode power-only
- In `Leaderboard.tsx`:
  - `EXERCISES` aggiornato: pull/dips usano due gruppi (`kalos_power` + `kalos_endurance`); squat/stacco usano `kalos_power`.
  - `useLeaderboard` accetta gruppo come parametro; `ExerciseBoards` lancia uno o due hook in base alla modalità.
- Subscription realtime esistente su `user_workouts` copre automaticamente i nuovi gruppi.

Nessun cambio a dati esistenti né alle altre skill.