
# Espansione pop-up "Scheda Premium"

Modifico `src/components/LeadModal.tsx` aggiungendo una selezione iniziale tra due flussi e i prezzi soci. Stile dark + verde LED invariato. Invio finale: Formspree per la scheda, WhatsApp per il merchandising.

## 1. Selettore iniziale (Step 0)

All'apertura, due card grandi cliccabili:
- **Scheda Personalizzata Premium** → flusso esistente (3 step).
- **Merchandising Kalos Fit** → nuovo flusso merch (1 step).

"Indietro" dal primo step di ciascun flusso riporta alla scelta iniziale.

## 2. Flusso Scheda Personalizzata (aggiornamento)

Nello Step 1 aggiungo:
- Toggle `Sei un socio ASD Kalos Fit?` (Switch shadcn).
- Se ON → input codice. Validazione client-side: `KALOS_MEMBER_2026` (case-sensitive). `isMember` true solo se codice corretto, con feedback inline (verde/rosso).
- Selettore **Durata abbonamento** (chip): Mensile / Trimestrale / Semestrale / Annuale.
- Prezzo dinamico:

| Durata | Socio | Esterno |
|---|---|---|
| Mensile | €15 | €30 |
| Trimestrale | €35 | €75 |
| Semestrale | €60 | €130 |
| Annuale | €100 | €220 |

Payload Formspree esteso con: `socio`, `durata`, `prezzo_eur`, `tipo_richiesta: "scheda_personalizzata"`. Endpoint invariato (`mrejlgyv`).

## 3. Flusso Merchandising (nuovo)

Schermata singola:
- Catalogo gadget (cards selezionabili, multi-select con quantità):
  - **T-shirt Kalos Fit** — €20 *(prezzo soci da verificare al momento dell'ordine)*
  - **Felpa Kalos Fit** — €40 *(prezzo soci da verificare al momento dell'ordine)*
  - Struttura ad array facilmente estendibile.
- Per ogni item selezionato: **Taglia** (S, M, L, XL, XXL) via Select shadcn + quantità (+/−).
- Nota visibile sotto il catalogo: "Prezzi soci da verificare al momento dell'ordine".
- Campi nome/cognome obbligatori (email opzionale qui).
- Textarea **"Vorresti altro?"** per suggerimenti accessori (polsini, cinture, ecc.).

**Invio**: apre `https://wa.me/393465337431?text=...` con `encodeURIComponent`. Esempio:

```text
Ciao Kalos Fit! Vorrei ordinare:
- T-shirt taglia M x1 — €20
- Felpa taglia L x1 — €40
Totale indicativo: €60
(prezzi soci da verificare al momento dell'ordine)

Suggerimenti: polsini neri

Nome: Mario Rossi
```

Dopo l'apertura WA, mostra schermata di successo e marca `localStorage` per non riproporre il timer.

## 4. UX & Design

- Mantengo `cyberInput`, gradient verde LED, glow `shadow-[0_0_*_hsl(var(--primary)/*)]`.
- Stepper: 3 step nel flusso scheda, nascosto nel flusso merch.
- Schermata di successo unificata:
  > La tua richiesta è stata inviata con successo, ti risponderemo entro 24/48h lavorative.

## 5. Dettagli tecnici

- Nuovo state: `flow: "choose" | "scheda" | "merch"`, `isMember`, `memberCodeInput`, `duration`, `merchItems: { id, qty, size }[]`, `merchSuggestion`.
- Calcolo prezzo memoizzato.
- Validazione zod estesa per merch (almeno un item con taglia selezionata).
- Numero WhatsApp normalizzato `393465337431`.
- Nessuna modifica ad altri file.

## File toccati

- `src/components/LeadModal.tsx` (unica modifica)
