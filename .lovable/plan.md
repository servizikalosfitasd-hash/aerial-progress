# Blocco sezioni per scadenza abbonamento

Permettere all'admin di bloccare/sbloccare per ogni utente le sezioni: Scheda allenamento, Gambe, Stretching, Stability, Circuiti — sia manualmente sia in automatico alla scadenza del rinnovo.

## Come funziona

- Ogni utente ha una **data di scadenza abbonamento** (opzionale) e un interruttore per ogni sezione.
- Una sezione è accessibile se: l'interruttore è attivo **e** la scadenza non è passata (se impostata).
- Al superamento della data, le sezioni si bloccano da sole senza intervento dell'admin. L'admin sblocca spostando la data in avanti (rinnovo) o riattivando l'interruttore.
- Le sezioni sempre libere: Home/Skill, Massimali, Classifica, Messaggi (così l'utente può contattare l'ASD per rinnovare).

## Esperienza utente

- Se una sezione è bloccata, la voce nella sidebar appare con un lucchetto e non è cliccabile.
- Aprendo comunque l'URL, l'utente vede una schermata "Abbonamento scaduto / sezione non attiva" con invito a rinnovare e pulsante WhatsApp.

## Pannello admin

Nuova scheda "Accessi" dentro l'area utente selezionato:
- Campo data di scadenza abbonamento (con indicazione "scaduto da X giorni" / "attivo fino al …").
- Cinque interruttori (Scheda, Gambe, Stretching, Stability, Circuiti) + azioni rapide "Blocca tutto" / "Sblocca tutto".
- Scorciatoie di rinnovo: +1 mese, +3 mesi, +12 mesi.

## Dettagli tecnici

- Nuova tabella `public.user_access` (una riga per utente): `user_id`, `expires_at`, cinque booleani per sezione, timestamp standard. GRANT per `authenticated` e `service_role`; RLS: l'utente legge solo la propria riga, l'admin (`has_role`) legge e scrive tutte le righe. Nessuna scrittura consentita all'utente.
- Hook `useSectionAccess()` che carica la riga dell'utente corrente e calcola lo stato effettivo di ogni sezione (default: tutto sbloccato se la riga non esiste).
- Componente `SectionGate` che avvolge le route `/scheda`, `/legs`, `/stretching`, `/stability`, `/circuits` in `App.tsx` e mostra la schermata di blocco.
- `AppSidebar.tsx`: lucchetto e disabilitazione delle voci bloccate.
- Nuovo pannello `src/components/admin/UserAccessPanel.tsx` collegato come tab in `src/pages/Admin.tsx`.
- Le modifiche dell'admin vengono registrate nell'audit log esistente.
