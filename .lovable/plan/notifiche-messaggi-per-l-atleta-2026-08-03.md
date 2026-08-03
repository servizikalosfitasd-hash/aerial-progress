# Notifiche messaggi per l'atleta

Oggi, quando l'admin scrive, l'atleta vede un pallino rosso in sidebar e un toast solo se ha l'app aperta. Aggiungiamo due livelli: notifica push sul telefono (anche ad app chiusa) e un avviso in-app più evidente.

## 1. Notifica push del telefono/browser

- Al primo accesso (e da un pulsante "Attiva notifiche" nella pagina Messaggi) l'atleta riceve la richiesta di permesso del browser. Se rifiuta, non viene più disturbato ma può riattivarla dal pulsante.
- Quando l'admin invia un messaggio, il telefono mostra una notifica di sistema "Kalos Fit — Nuovo messaggio" con l'anteprima del testo; toccandola si apre direttamente la chat.
- Funziona su Android/desktop sempre; su iPhone solo se l'app è stata aggiunta alla schermata Home (limite di Apple). Lo comunichiamo con una nota nell'interfaccia.

## 2. Avviso in-app più evidente

- All'apertura dell'app, se ci sono messaggi non letti dall'admin, compare un banner fisso in alto ("Hai N nuovi messaggi dal coach — Leggi") con link diretto alla chat, che scompare appena i messaggi vengono letti.
- Il badge in sidebar resta, ma con il numero visibile invece del solo pallino.

## Dettagli tecnici

**Database**
- Nuova tabella `push_subscriptions` (user_id, endpoint univoco, chiavi p256dh/auth, user_agent) con RLS: ogni utente gestisce solo le proprie, service_role accesso pieno.

**Chiavi**
- Generazione coppia VAPID salvata nei secret del backend (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`). La chiave pubblica viene esposta al client tramite una piccola edge function `push-public-key`.

**Service worker**
- Nuovo file `public/push-sw.js` dedicato solo alle push (registrato con scope proprio, non tocca il manifest PWA esistente e non introduce caching offline): gestisce gli eventi `push` e `notificationclick` (apre `/messaggi`).

**Frontend**
- `src/hooks/usePushNotifications.ts`: registra il service worker, chiede il permesso, crea la `PushSubscription` e la salva/rimuove in `push_subscriptions`.
- Pulsante "Attiva notifiche" in `src/pages/Messages.tsx` con stato (attive / bloccate / non supportate) e nota per iOS.
- `src/components/UnreadMessagesBanner.tsx` montato nel layout principale, alimentato da `useUnreadMessages`.
- `src/hooks/useUnreadMessages.ts`: espone anche il conteggio per il banner e per il badge numerico in `AppSidebar.tsx`.

**Invio push**
- Edge function `send-message-push`: valida il JWT del mittente, verifica che sia admin, e invia la notifica web-push (libreria `npm:web-push`) a tutte le subscription dell'atleta destinatario, eliminando quelle scadute (404/410).
- `MessagesThread.tsx` (lato admin) e `AdminMessagesPanel.tsx` invocano la function subito dopo l'inserimento del messaggio.

## Fuori scope
- Notifiche push verso l'admin quando scrive l'atleta (si può aggiungere dopo con la stessa infrastruttura).
- Notifiche via email.
