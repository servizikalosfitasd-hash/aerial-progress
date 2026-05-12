## Obiettivo

Estendere il pattern `HamburgerButton` (già usato in `/` e `/records`) a tutte le altre pagine sezione: `/circuits`, `/stability`, `/stretching`, `/legs`, `/scheda`. Eliminare il trigger fluttuante e i link "Indietro" ridondanti, lasciando l'hamburger come unico punto di apertura del menù.

## Modifiche

### 1. Pagine con link "← Indietro" da sostituire

**`src/pages/Circuits.tsx`** e **`src/pages/Stability.tsx`**
- Importare `HamburgerButton` da `@/components/HamburgerButton`.
- Nell'header, sostituire `<Link to="/">…<ArrowLeft />…{t.detail.back}</Link>` con `<HamburgerButton />`.
- Rimuovere il padding `pl-14` dal container (lasciare `px-4 sm:px-6`).
- Ripulire gli import: togliere `Link` da `react-router-dom` (se non più usato) e `ArrowLeft` da `lucide-react`.

### 2. Pagine con solo `LanguageSwitcher` nell'header

**`src/pages/Legs.tsx`**, **`src/pages/Stretching.tsx`**, **`src/pages/WorkoutPlan.tsx`**
- Importare `HamburgerButton`.
- Cambiare il container header da `justify-end` a `justify-between` e togliere `pl-14`.
- Aggiungere `<HamburgerButton />` come primo figlio, prima di `<LanguageSwitcher />`.

### 3. `src/components/AppLayout.tsx`
- Aggiornare `showFloating` per nascondere il trigger fluttuante su tutte le pagine che ora ospitano l'hamburger nell'header:
  ```ts
  const showFloating = !["/", "/records", "/circuits", "/stability", "/stretching", "/legs", "/scheda"].includes(pathname);
  ```
- Di fatto resta attivo solo per `/skill/:id` (vedi sotto).

## Fuori scope

- **`src/pages/SkillDetail.tsx`**: è una pagina di dettaglio (non una "sezione") e il suo pulsante "Indietro" è contestuale — torna a `/` o a `/records` a seconda della provenienza (`backTo`). Va lasciato com'è e continuerà ad usare il trigger fluttuante per aprire il menù.
- Nessuna modifica a stile, animazione o LED dell'`HamburgerButton`.
