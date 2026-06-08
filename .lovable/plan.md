# Editor admin per la scheda di un utente

Obiettivo: nella pagina `/admin`, dopo aver selezionato un utente dall'elenco, l'admin può:
1. Modificare la **scheda di allenamento** dell'utente (skill scelte, propedeutica corrente, carichi/serie/ripetizioni/recupero per ogni esercizio).
2. Creare, modificare ed eliminare **esercizi personalizzati** assegnati a quell'utente, senza dover passare dal form generico.

## UX

Nuova struttura della pagina `/admin`:

```
[ Header Admin ]
[ Selettore utente (search + dropdown con email/nickname) ]
   │
   ▼ (quando un utente è selezionato)
[ Tabs ]
  ├─ Scheda allenamento
  │   • Per ogni skill (Legs, Push, Pull, Core, Stretching, …):
  │       - Stato (in scheda / non in scheda)
  │       - Selezione propedeutica corrente (dropdown delle progressions)
  │       - Per ogni gruppo/esercizio in scheda: serie, reps, secondi,
  │         recupero, kg, elastico, note → salvataggio inline
  │       - Pulsante "Rimuovi dalla scheda"
  │   • Pulsante "Aggiungi skill alla scheda"
  │
  ├─ Esercizi personalizzati
  │   • Lista degli esercizi già assegnati a questo utente + globali
  │   • Form "Nuovo esercizio" già pre-compilato con target = utente
  │   • Edit inline + delete per ogni riga
  │
  └─ Anteprima / riepilogo (solo lettura: come l'utente vedrà la scheda)
```

Il form generico attuale resta disponibile come "Globale" tramite un toggle nel tab esercizi.

## Modifiche backend

Le tabelle `user_skills` e `user_workouts` oggi hanno solo policy `auth.uid() = user_id`: l'admin non può leggerle/modificarle per altri utenti. Aggiungere policy admin:

- `user_skills`: SELECT/INSERT/UPDATE/DELETE consentiti se `has_role(auth.uid(),'admin')`.
- `user_workouts`: idem.
- `custom_exercises`: aggiungere policy SELECT admin esplicita (oggi gli admin la leggono solo per `is_global`/`target_user_id=self`); l'admin deve poter leggere TUTTI gli esercizi per qualsiasi utente target.

RPC nuove (SECURITY DEFINER, ristrette a `has_role(... ,'admin')`):
- `admin_get_user_plan(_user_id uuid)` → restituisce righe di `user_skills` + `user_workouts` dell'utente.
- `admin_upsert_user_skill(_user_id, _skill_id, _group_id, _progression_index, …)`.
- `admin_upsert_user_workout(_user_id, _skill_id, _group_id, _progression_index, sets, reps, seconds, recovery, kg, band, …)`.
- `admin_delete_user_skill(_user_id, _skill_id, _group_id)`.

In alternativa, niente RPC: solo nuove policy admin + scrittura diretta da client. Più semplice e coerente con le altre tabelle. **Scelta: solo policy admin, no RPC**.

## Modifiche frontend

- `src/pages/Admin.tsx`: refactor in 3 parti (selettore utente, tab Scheda, tab Esercizi). Il form esistente viene incapsulato nel tab esercizi, pre-compilato con `target_user_id` dell'utente selezionato.
- Nuovo `src/components/admin/UserPlanEditor.tsx`: editor della scheda; usa `skills` da `src/data/skills.ts` per elencare gruppi e propedeutiche, scrive su `user_skills`/`user_workouts` filtrando per `user_id` dell'utente selezionato.
- Nuovo `src/components/admin/UserCustomExercisesEditor.tsx`: lista + edit inline degli esercizi `custom_exercises` filtrati per `target_user_id = utente`, più form di creazione e (nuovo) edit.
- Riuso dei componenti UI esistenti (`Card`, `Select`, `Input`, `Tabs`).

## Dettagli tecnici

- I tab usano `@/components/ui/tabs`.
- Lo stato dell'utente selezionato vive in `Admin.tsx`; gli editor lo ricevono via prop e ricaricano i dati quando cambia.
- `useIsAdmin` continua a gateway-are l'accesso alla pagina.
- Nessuna modifica a `useAuth`, `ProtectedRoute`, o al flusso utente.
- I tipi TS per `custom_exercises`/`user_skills`/`user_workouts` sono già in `src/integrations/supabase/types.ts`; usare cast `as any` solo dove già presente.

## Fuori scope

- Nessun cambiamento alla UI lato utente (`/workout-plan` legge già `user_skills`/`user_workouts` filtrati per `auth.uid()`).
- Nessun cambiamento al sistema di ruoli.
- Nessuna gestione di permessi più granulari (es. "trainer" diverso da admin).
