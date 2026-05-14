## Allinea tutto il verde alla tonalità del logo

Verde del logo Kalos: **#98FE2E ≈ hsl(89 99% 59%)**. Aggiorno i token globali e sostituisco i verdi hardcoded in `HamburgerButton`, `AnatomyMap` (Stability) e `LeadModal`.

### 1) Token globali — `src/index.css`

Aggiorno le variabili HSL nel `:root`:

- `--primary: 89 99% 59%`
- `--primary-glow: 89 100% 70%`
- `--accent: 89 99% 59%`
- `--success: 89 99% 59%`
- `--ring: 89 99% 59%`
- `--gradient-primary: linear-gradient(135deg, hsl(89 99% 59%), hsl(95 100% 65%))`
- `--shadow-glow: 0 0 40px hsl(89 99% 59% / 0.25)`

Tutti i componenti che usano i token semantici (`bg-primary`, `text-primary`, `ring-ring`, `bg-accent`, `text-success`, `shadow-glow`, `bg-gradient-primary`) si allineeranno automaticamente.

### 2) Pulsante hamburger — `src/components/HamburgerButton.tsx`

Sostituisco tutte le `#4ade80` hardcoded con `hsl(var(--primary))`:

- `backgroundColor` e `boxShadow` inline
- `focus-visible:ring-[#4ade80]` → `focus-visible:ring-primary`
- Le tre `group-hover:[box-shadow:...#4ade80...]` con lo stesso colore ma da token

### 3) Sezione Stability — `src/components/AnatomyMap.tsx`

Sostituisco le classi `emerald-*` con varianti basate sul token `primary`:

- `border-emerald-500/30` → `border-primary/30`
- `bg-emerald-500/10` → `bg-primary/10`
- `border-emerald-400` → `border-primary`
- `text-emerald-300`, `text-emerald-400/…` → `text-primary`, `text-primary/…`
- testi neutri `text-emerald-100/60`, `text-emerald-200` → `text-foreground/60`, `text-foreground`
- shadow `rgba(34,197,94,…)` → `hsl(var(--primary)/…)`
- `bg-[#0a0a0a]` resta (nero, non verde)

### 4) LeadModal — `src/components/LeadModal.tsx`

Sostituisco l'intera palette `emerald-*` con i token del design system:

- Bordi/anelli: `border-emerald-500/xx`, `border-emerald-400`, `focus-visible:ring-emerald-400` → `border-primary/xx`, `border-primary`, `focus-visible:ring-primary`
- Sfondi: `bg-emerald-500/xx` → `bg-primary/xx`; `bg-emerald-500` (CTA) → `bg-primary`; `hover:bg-emerald-400` → `hover:bg-primary/90`; `bg-emerald-400` (separator) → `bg-primary`
- Testi accent: `text-emerald-300`, `text-emerald-400` → `text-primary`
- Testi neutri (label, descrizione, placeholder): `text-emerald-50`, `text-emerald-100/xx`, `text-emerald-200/xx` → `text-foreground` e `text-muted-foreground` (con opacità dove serviva)
- Sfondo dialog `bg-[#06120c]` → `bg-card` (rimane scuro coerente con il tema)
- Shadow `hsl(150 90% 45% / …)` → `hsl(var(--primary) / …)`
- CTA `bg-emerald-500 text-black` → `bg-primary text-primary-foreground` (il token `--primary-foreground` è già scuro, quindi resta leggibile)

### Fuori scope

- Nessuna modifica al logo o alle immagini.
- Nessuna modifica funzionale al modale o alla mappa anatomica.