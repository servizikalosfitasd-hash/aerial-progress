## Obiettivo
Correggere il bug grafico nella "Progress summary" della pagina skill (es. `/skill/front-lever`) dove i nomi delle progressioni (Isometria/Dinamico/Potenziamento) vengono troncati con `...`, e migliorare leggibilità e posizione del tasto Reset.

## Modifiche in `src/pages/SkillDetail.tsx` (blocco Progress summary, ~linee 113-150)

### 1. Nomi esercizi su 1-2 righe (no troncamento)
Nel chip di ogni gruppo:
- Rimuovere `truncate` dal `<p>` con il nome della progressione.
- Aggiungere wrapping su massimo 2 righe con clamp + word-break:
  - classi: `font-display text-sm font-bold leading-snug line-clamp-2 break-words`
- Far sì che il chip si espanda in altezza invece che restare schiacciato:
  - container chip: rimuovere min-width restrittivi, usare `items-start`, `gap-3`, `px-4 py-3`.
- Su mobile (390px) i chip diventano full-width per dare spazio al testo:
  - wrapper esterno: `grid grid-cols-1 sm:flex sm:flex-wrap gap-3` invece di `flex flex-wrap gap-2`.

### 2. Interlinea e spaziature
- Card esterna: aumentare padding `p-7 sm:p-9` (da `p-6 sm:p-8`).
- Aumentare gap fra header chips e progress bar: `mb-6` → `mb-7`, e `space-y-2` → `space-y-3` nel blocco mastery.
- Interlinea testo nei chip: `leading-snug` sul nome, `mt-0.5` fra eyebrow e nome.
- Eyebrow (`ISOMETRIA` ecc.): `tracking-[0.25em]` (meno stretto) + `mb-1`.

### 3. Riposizionamento del tasto Reset
Attualmente il bottone Reset è inline con i chip e su mobile finisce affiancato in modo sbilanciato.
- Spostarlo in alto a destra della card, come azione secondaria allineata all'header:
  - Wrapper della card diventa `relative`.
  - Reset posizionato `absolute top-4 right-4` su desktop; su mobile resta in flow ma su una riga propria sotto i chip, allineato a destra (`flex justify-end mt-2`).
- Stile pulito: `variant="ghost" size="sm"` con `rounded-full` e padding `px-3`, icona `RotateCcw` `h-3.5 w-3.5`, testo `text-xs font-semibold tracking-wide`.
- Mostrato solo se `completed > 0` (comportamento invariato).

### 4. Coerenza con viewport mobile (390px)
- Verificato che con `grid-cols-1` i tre chip Isometria/Dinamico/Potenziamento si impilino verticalmente, mostrando i nomi completi su 1-2 righe senza troncamento.
- Nessuna modifica alle progressioni nella lista sotto, alla logica, ai dati o ad altre pagine.

## File toccati
- `src/pages/SkillDetail.tsx` — solo il blocco "Progress summary" (jsx + classi Tailwind).

Nessuna modifica a logica, hook, dati skill, o altre pagine.
