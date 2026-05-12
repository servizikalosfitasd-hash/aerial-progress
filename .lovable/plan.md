## Obiettivo
Aggiungere autenticazione (email/password + Google) e persistenza cloud tramite Lovable Cloud, proteggere le rotte e migrare i dati attualmente in `localStorage` su database con RLS.

## 1. Abilitazione Lovable Cloud
- Attivare Lovable Cloud (provisioning automatico di Auth + Postgres + `src/integrations/supabase/client.ts`).
- Conferma email disattivata in dev per accelerare i test.
- **Google sign-in**: abilitato come provider managed in Lovable Cloud (nessuna configurazione manuale OAuth richiesta).

## 2. Schema database (migrazione SQL)

### `profiles`
- `id uuid PK REFERENCES auth.users(id) ON DELETE CASCADE`
- `first_name text`, `last_name text`
- `preferences jsonb NOT NULL DEFAULT '{}'::jsonb`
- `created_at`, `updated_at` timestamptz
- Trigger `handle_new_user` su `auth.users` per creare il profilo al signup (popola `first_name`/`last_name` da `raw_user_meta_data` quando disponibile, es. da Google)
- Trigger `update_updated_at` su update

### `user_workouts`
- `id uuid PK DEFAULT gen_random_uuid()`
- `user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
- `skill_id text`, `group_id text`, `progression_index int`
- `exercise_name text NOT NULL`
- `sets int`, `reps int`, `seconds int`, `recovery int`
- `created_at`, `updated_at` timestamptz
- `UNIQUE(user_id, skill_id, group_id, progression_index)` per upsert

### `user_skills` (sostituisce `useProgress`/`useHistory`/`useMaxes`/`useNotes`)
- `id uuid PK`
- `user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
- `skill_id text NOT NULL`, `group_id text NOT NULL`
- `progression_index int NOT NULL DEFAULT -1`
- `done jsonb NOT NULL DEFAULT '[]'::jsonb` (storico)
- `max_seconds int`, `max_reps int`, `max_kg numeric`, `max_note text`
- `note text`
- `updated_at timestamptz`
- `UNIQUE(user_id, skill_id, group_id)`

### RLS
Abilitata su tutte e tre le tabelle, 4 policy per tabella (`select`/`insert`/`update`/`delete`) basate su `user_id = auth.uid()` (per `profiles`: `id = auth.uid()`).

## 3. Autenticazione

### Pagina `/auth` (dark mode, coerente con design system)
- Tab Login / Registrazione con email + password
- **Bottone "Continua con Google"** in cima, separatore, poi form email
- Validazione Zod, toast errore/successo
- `signUp` con `emailRedirectTo: window.location.origin`
- `signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })`
- Su sessione attiva → redirect a `/`

### Provider sessione
- `src/hooks/useAuth.tsx` con context: `onAuthStateChange` registrato PRIMA di `getSession()`, espone `user`, `session`, `loading`, `signOut`
- `<App />` avvolta in `AuthProvider`

### Route protette
- `<ProtectedRoute>` reindirizza a `/auth` se non autenticato
- Avvolge tutte le rotte sotto `<AppLayout />`; `/auth` resta pubblica
- Voce "Esci" nella `AppSidebar`

## 4. Persistenza dati
Riscrivere gli hook mantenendo la stessa API pubblica:
- `useProgress`, `useHistory`, `useMaxes`, `useNotes` → `user_skills` (un record per skill+group)
- `useLoad` → `user_workouts` (mappa `rest` ↔ `recovery`)
- Caricamento iniziale: `select` filtrato per `user_id` al login, conservato in stato React
- Ogni mutazione → `upsert` immediato con `onConflict` sulle colonne unique
- Refetch su `onAuthStateChange`

## 5. Pulizia
- Rimosse le `STORAGE_KEY` dei vecchi hook (i dati locali NON vengono migrati al primo login)
- Lingua selezionata dal `LanguageSwitcher` salvata anche in `profiles.preferences.lang`

## File toccati
- Nuovi: `src/pages/Auth.tsx`, `src/hooks/useAuth.tsx`, `src/components/ProtectedRoute.tsx`
- Modificati: `src/App.tsx`, `src/components/AppSidebar.tsx`, `src/hooks/useProgress.ts`, `src/hooks/useHistory.ts`, `src/hooks/useMaxes.ts`, `src/hooks/useLoad.ts`
- Migrazione SQL: tre tabelle + trigger + policy RLS

## Nota
I dati attualmente in `localStorage` saranno persi al primo login (no migrazione automatica in questa iterazione).