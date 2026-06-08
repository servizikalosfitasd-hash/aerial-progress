# Strumenti admin avanzati

Aggiungo nuove funzioni nella pagina `/admin`, dentro un nuovo tab **Gestione utente** accanto a quelli già presenti, attivo dopo aver selezionato un utente.

## Funzioni incluse

1. **Elimina utente** (con doppia conferma)
   - Rimuove l'utente da `auth.users` e a cascata `profiles`, `user_skills`, `user_workouts`, `workout_sessions`, `user_app_state`, `user_roles`, `custom_exercises` con `target_user_id` = utente.
   - Protezione: non si può eliminare se stessi.

2. **Gestione ruolo admin**
   - Toggle "Rendi admin / Rimuovi admin".
   - Protezione: non si può rimuovere il proprio ruolo admin (per non perdere accesso).

3. **Modifica profilo**
   - Nickname, nome, cognome (scrive su `profiles`).

4. **Invio email reset password**
   - Bottone che invia all'utente l'email di recupero password.

5. **Statistiche utente** (sola lettura)
   - Email confermata / non confermata, data registrazione, ultimo login.
   - Numero di sessioni completate, skill in scheda, esercizi personalizzati.

6. **Reset dati allenamento**
   - Bottone (con conferma) che cancella tutte le righe `user_skills`, `user_workouts`, `workout_sessions` dell'utente, lasciando intatti profilo e account.

## Modifiche backend

Nuove funzioni Postgres `SECURITY DEFINER` con check `has_role(auth.uid(),'admin')`:

- `admin_delete_user(_user_id uuid)` — elimina riga in `auth.users` (cascade via FK già presenti su `profiles`). Vieta `_user_id = auth.uid()`.
- `admin_set_role(_user_id uuid, _role app_role, _grant boolean)` — inserisce/rimuove da `user_roles`. Vieta togliere admin a se stessi.
- `admin_update_profile(_user_id uuid, _nickname text, _first_name text, _last_name text)`.
- `admin_reset_user_data(_user_id uuid)` — delete su `user_skills`, `user_workouts`, `workout_sessions`, `user_app_state` per quell'utente.
- `admin_get_user_overview(_user_id uuid)` — torna email_confirmed_at, created_at, last_sign_in_at, e i conteggi (sessions, skills, custom_exercises).

L'email di reset password viene inviata dal client con `supabase.auth.resetPasswordForEmail(email, { redirectTo: ... })`, riutilizzando il flusso esistente.

## Modifiche frontend

- `src/pages/Admin.tsx`: nuovo `<TabsTrigger value="manage">Gestione utente</TabsTrigger>` con il pannello.
- Nuovo `src/components/admin/UserManagementPanel.tsx`: contiene profilo, ruolo, statistiche, reset, delete. Usa `AlertDialog` per le conferme distruttive.
- Riuso UI esistente (`Card`, `Button`, `Input`, `Switch`, `AlertDialog`).

## Fuori scope

- Niente impersonation/login as user.
- Niente audit log delle azioni admin (può essere aggiunto in seguito).
- Niente editor avanzato dello storico sessioni: solo cancellazione bulk.
