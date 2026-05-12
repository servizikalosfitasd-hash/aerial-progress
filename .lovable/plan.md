## Problema

Nell'header di `src/pages/Index.tsx` viene usato `SidebarTrigger` (da `src/components/ui/sidebar.tsx`), che renderizza internamente un `<Button>` contenente l'icona Lucide `PanelLeft` (le "due colonne" che si vedono) **più** gli `<span>` passati come children. Per questo le linee verdi convivono con l'icona standard.

## Soluzione

### 1. Nuovo componente `src/components/HamburgerButton.tsx`

Un `<button>` puro (no `Button` shadcn, no `SidebarTrigger`, no icone Lucide/Radix) che:

- Usa `useSidebar()` per leggere `openMobile`/`open` e chiamare `toggleSidebar()` al click.
- Contiene esattamente 3 `<span>`, ciascuno: `height: 2px`, `width: 24px`, `background: #4ade80`, `border-radius: 9999px`, `box-shadow: 0 0 10px #4ade80, 0 0 5px #4ade80`.
- Wrapper button: nessuno sfondo, nessun bordo, nessuna shadow, padding minimo per area cliccabile, `aria-label="Apri menù"`, `aria-expanded`.
- Animazione di apertura → "X":
  - linea 1: `translateY(8px) rotate(45deg)`
  - linea 2: `opacity: 0`
  - linea 3: `translateY(-8px) rotate(-45deg)`
  - `transition: transform .3s ease, opacity .2s ease`
  - Le linee mantengono il `box-shadow` LED in entrambi gli stati.
- Hover: leggero rinforzo del glow (`box-shadow: 0 0 14px #4ade80, 0 0 6px #4ade80`).

### 2. Modifica `src/pages/Index.tsx`

- Rimuovere l'import e l'uso di `SidebarTrigger`.
- Importare e usare `<HamburgerButton />` a sinistra del titolo "Kalos Fit App", senza wrapper con sfondo.

### 3. Nessuna modifica a

- `src/components/ui/sidebar.tsx` (resta com'è per il trigger fluttuante in altre pagine).
- `src/components/AppLayout.tsx` (continua a usare il proprio trigger sulle pagine non-home; volendo possiamo sostituirlo anche lì con `HamburgerButton`, ma fuori scope).

## Dettagli tecnici

- Stato aperto rilevato con: `const { openMobile, open, isMobile, toggleSidebar } = useSidebar(); const isOpen = isMobile ? openMobile : open;`
- Dimensione bottone: `h-6 w-6` con flex column + `gap` per allineare le 3 linee centralmente; oppure container `h-5 w-6 relative` con linee in `absolute` per gestire pulitamente la trasformazione in X (preferibile per l'animazione).
