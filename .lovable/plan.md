## Obiettivo

Sostituire il link "Tutte le skill" (con icona `ArrowLeft`) nell'header di `src/pages/Records.tsx` con il componente `HamburgerButton` già creato, in modo coerente con la home.

## Modifiche

### 1. `src/pages/Records.tsx`
- Importare `HamburgerButton` da `@/components/HamburgerButton`.
- Rimuovere `<Link to="/">…<ArrowLeft />…</Link>` (righe 74–80) e sostituirlo con `<HamburgerButton />`.
- Rimuovere import non più usati: `Link` da `react-router-dom` e `ArrowLeft` da `lucide-react`.
- Togliere il padding `pl-14` dal container dell'header (riga 73), che era riservato al trigger fluttuante; lasciare `px-4 sm:px-6`.

### 2. `src/components/AppLayout.tsx`
- Nascondere il `SidebarTrigger` fluttuante anche sulla pagina `/records`, perché ora l'hamburger vive dentro l'header della pagina ed eviteremmo doppioni.
- Aggiornare `showFloating` da `pathname !== "/"` a `!["/", "/records"].includes(pathname)`.

## Fuori scope
- Le altre pagine (`/circuits`, `/stability`, ecc.) restano com'è: continuano a usare il trigger fluttuante. Possiamo replicare lo stesso pattern in seguito se richiesto.
