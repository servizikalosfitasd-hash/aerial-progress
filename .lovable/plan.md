## Obiettivo
Aggiungere una pagina "Classifica" (Kalos Games) che osserva automaticamente i record inseriti dagli utenti nelle proprie schede e mostra ranking pubblico (tra utenti loggati) per Pull Up, Push Up, Squat e Stacco.

## 1. Database

### Migrazione: nickname sul profilo
- Aggiungere colonna `nickname text unique` (case-insensitive via `lower(nickname)` index) a `public.profiles`.
- Validazione lato client: 3–20 char, `[a-zA-Z0-9_.-]`.

### Vista pubblica per la classifica (security_invoker off, SECURITY DEFINER function)
Gli utenti possono vedere SOLO i record degli altri tramite una funzione SQL che restituisce esclusivamente: `nickname`, `load_kg`, `reps`, `updated_at`. Nessun accesso diretto alle righe altrui.

```sql
create or replace function public.leaderboard(_skill text, _group text, _idx int)
returns table(nickname text, kg numeric, reps int, updated_at timestamptz)
language sql stable security definer set search_path = public as $$
  select p.nickname,
         w.load_kg,
         w.reps,
         w.updated_at
  from public.user_workouts w
  join public.profiles p on p.id = w.user_id
  where w.skill_id = _skill
    and w.group_id = _group
    and w.progression_index = _idx
    and p.nickname is not null
    and (w.load_kg is not null or w.reps is not null);
$$;
grant execute on function public.leaderboard(text,text,int) to authenticated;
```

Le RLS esistenti su `user_workouts` e `profiles` restano invariate (nessuno legge righe altrui direttamente).

### Mapping esercizi → progressioni
| Esercizio | skill_id | group_id | progression_index |
|---|---|---|---|
| Pull up | `pull` | `main` | 6 |
| Push up | `push` | `main` | 1 |
| Back squat bilanciere | `legs` | `weights` | 1 |
| Stacco da terra | `legs` | `weights` | 5 |

## 2. Frontend

### Sidebar
Aggiungere voce "Classifica" con icona `Crown` subito sotto "Massimali", route `/classifica`.

### Pagina `/classifica` (`src/pages/Leaderboard.tsx`)
- Tema dark tech: sfondo `bg-background` (già scuro), accenti `text-primary` (verde neon) — usare token esistenti, no colori hardcoded.
- 4 tab Shadcn: **PULL UP**, **PUSH UP**, **SQUAT**, **STACCO**.
- Pull Up e Push Up → due sotto-classifiche affiancate/stacked:
  - **Power**: filtra `kg > 0`, ordina per `kg desc`, tie-break `reps desc`.
  - **Endurance**: filtra `kg = 0 || null`, ordina per `reps desc`.
- Squat e Stacco → singola tabella ordinata per `kg desc`, tie-break `reps desc`.
- Tabella Shadcn con colonne: `#`, `Nickname`, `KG` (o `Reps`).
- Top 3: riga con bordo `border-primary` luminoso + medaglia (🥇/🥈/🥉) o badge "GOLD/SILVER/BRONZE" colorati con varianti del primary token.
- Caricamento via `supabase.rpc('leaderboard', { _skill, _group, _idx })` dentro `useQuery` (react-query).
- **Realtime**: canale `postgres_changes` su `public.user_workouts` → su evento INSERT/UPDATE/DELETE filtrato per skill/group/idx fa `queryClient.invalidateQueries`. (Richiede `ALTER PUBLICATION supabase_realtime ADD TABLE public.user_workouts;` nella migrazione).

### UI nickname
Piccola card "Imposta nickname" mostrata in cima alla pagina Classifica se `profiles.nickname is null`, con input + bottone Save (upsert su profiles). Toast di conferma. Banner: "Senza nickname non comparirai in classifica".

## 3. File toccati
- **Migrazione**: `nickname` su profiles + funzione `leaderboard` + realtime publication.
- **Nuovo**: `src/pages/Leaderboard.tsx`.
- **Modificato**: `src/App.tsx` (route), `src/components/AppSidebar.tsx` (voce menu).
- **Eventuale hook**: `src/hooks/useNickname.ts` per get/set sul profilo.

## 4. Privacy
Nessun dato sensibile esposto: la function ritorna solo nickname/kg/reps/data. Le RLS dirette sulle tabelle restano "solo proprie righe".

## Note tecniche
- Tie-break: Postgres `order by load_kg desc nulls last, reps desc nulls last`.
- Endurance Push/Pull: `where (load_kg is null or load_kg = 0) and reps is not null`.
- Power: `where load_kg > 0`.
- Le 4 categorie usano la stessa funzione RPC con parametri diversi; il filtro Power/Endurance è applicato lato client sui risultati.
