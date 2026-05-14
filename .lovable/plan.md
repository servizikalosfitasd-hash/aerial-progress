## Pulsante flottante WhatsApp

Aggiungere un pulsante fisso in basso a destra, visibile su tutte le pagine dell'app, che apre una chat WhatsApp con il numero **+39 3465337431**.

### Comportamento
- Posizione: `fixed bottom-4 right-4`, sopra ogni contenuto (`z-50`).
- Icona: logo ufficiale WhatsApp (SVG inline, colori brand WhatsApp `#25D366` su sfondo bianco/scuro coerente col tema).
- Click: apre `https://wa.me/393465337431` in nuova scheda.
- Hover: appare a sinistra del pulsante un'etichetta "Scrivici per info o assistenza" con animazione fluida (fade + slide da destra, ~250ms, easing morbido). Su mobile (touch), l'etichetta non viene mostrata.
- Accessibilità: `aria-label`, focus ring usando `--primary`, tooltip visibile anche su focus da tastiera.
- Stile: pillola/cerchio con leggera ombra (`shadow-elevated`), micro-animazione "pulse" tenue per attirare l'attenzione senza essere invadente.

### Implementazione
1. Nuovo componente `src/components/WhatsAppFab.tsx` — pulsante + etichetta hover, completamente autonomo, usa token del design system (no colori hardcoded eccetto il verde brand WhatsApp dell'icona).
2. Montarlo in `src/App.tsx` accanto a `<LeadModal />`, così appare su tutte le route (auth incluse). In alternativa solo dentro `AppLayout` se preferisci escluderlo dalle pagine di login/reset — da confermare se serve.
3. Animazione via classi Tailwind esistenti (`transition-all`, `opacity`, `translate-x`) — nessuna dipendenza nuova.

Nessuna modifica a logica, dati o backend.
