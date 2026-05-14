# Selezione multipla per Push e Pull

Replicare il sistema di selezione esercizi della pagina Gambe dentro la pagina skill di Push e Pull, e farlo confluire nella Scheda Allenamento sostituendo la logica della singola "propedeutica corrente" per queste tre skill.

## Cosa cambia per l'utente

- Aprendo la skill **Push** o **Pull**, sotto la sezione esistente delle propedeutiche compare un nuovo blocco **"Seleziona esercizi per la scheda"**: una lista piatta di tutti gli esercizi (nessun lock, nessun vincolo di progressione) con checkbox, editor di carico, contatore serie e timer di recupero — esattamente come in Gambe.
- Le selezioni sono indipendenti dalla "propedeutica corrente": puoi continuare a marcare i progressi nelle card sopra, ma quello che entra in scheda viene dalla nuova lista.
- La **Scheda Allenamento** mostra, per Push, Pull e Gambe, gli esercizi selezionati (oggi Gambe non appariva affatto). Per le altre skill resta la logica attuale (propedeutica corrente).

## Implementazione tecnica

### 1. Hook condiviso `useSelectedExercises`
Nuovo file `src/hooks/useSelectedExercises.ts` che incapsula la logica già presente in `Legs.tsx`:
- Storage in `localStorage` con chiave `selected-exercises:{skillId}` (oggetto `Record<string, boolean>` con chiavi `{groupId}-{index}`).
- API: `isSelected(groupId, index)`, `toggle(groupId, index)`, `getSelectedList(skill)` che ritorna `{ groupId, name, index }[]` ordinato.
- Subscribe a `storage` events così che la Scheda si aggiorni se cambi la selezione in un'altra tab/finestra.

### 2. Refactor `src/pages/Legs.tsx`
Sostituire lo state locale + `STORAGE_KEY` con il nuovo hook. Nessun cambio visivo.

### 3. `src/pages/SkillDetail.tsx`
Dopo la `<section>` delle progressioni per gruppo, se `skill.id === "push" || skill.id === "pull"`, renderizzare un nuovo componente `<SelectableExerciseList skill={skill} />` con stesso layout della pagina Gambe:
- Header con titolo localizzato e descrizione breve.
- Grid responsive di card selezionabili identiche a Legs (checkbox/numero, nome, `LoadEditor`, `SetCounter`, `CountdownTimer`).
- Riusa `useLoad` (già persistente in DB tramite `user_workouts`) e `useSelectedExercises`.

Estrarre il rendering della singola card in un piccolo componente condiviso `src/components/SelectableExerciseList.tsx` riutilizzato sia da Legs sia da SkillDetail (DRY).

### 4. `src/pages/WorkoutPlan.tsx`
Modificare `grouped`:
- Per `skill.id ∈ {"legs","push","pull"}`: leggere `useSelectedExercises(skill.id).getSelectedList(skill)` e mappare in `PlanItem[]`.
- Per le altre skill: comportamento attuale (propedeutica corrente per gruppo).
- Aggiornare lo stato vuoto per menzionare anche la selezione dalle pagine.

### 5. i18n
Aggiungere in `src/i18n/dictionary.ts` le stringhe:
- `detail.selectableTitle` ("Seleziona esercizi per la scheda" / "Select exercises for your plan" / "Selecciona ejercicios para tu plan")
- `detail.selectableHint` (breve descrizione)

## File toccati

```text
new   src/hooks/useSelectedExercises.ts
new   src/components/SelectableExerciseList.tsx
edit  src/pages/Legs.tsx
edit  src/pages/SkillDetail.tsx
edit  src/pages/WorkoutPlan.tsx
edit  src/i18n/dictionary.ts
```

## Note

- Nessuna modifica al database: la selezione vive in `localStorage` (come già fa Gambe), mentre carichi/serie/recupero continuano a salvarsi in `user_workouts` via `useLoad`.
- Nessun vincolo di progressione applicato (richiesta esplicita: lista piatta).
