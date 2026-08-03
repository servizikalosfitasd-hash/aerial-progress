# Notifiche anche per l'admin

Oggi le notifiche push partono solo in una direzione: quando l'admin scrive, l'atleta riceve la push. Se è l'atleta a scrivere, l'admin vede solo il badge rosso in sidebar (e un toast se ha l'app aperta). Aggiungiamo la direzione mancante.

## Cosa cambia

1. **Push all'admin**: quando un atleta invia un messaggio, tutti gli admin iscritti alle notifiche ricevono una push sul telefono/browser con nome dell'atleta e anteprima del testo. Tocco sulla notifica -> si apre l'area messaggi dell'admin.
2. **Attivazione notifiche per l'admin**: anche l'admin può attivare le notifiche sul proprio dispositivo (oggi il pannello di attivazione è nascosto agli admin).
3. **Banner in-app per l'admin**: il banner in alto "hai N nuovi messaggi" viene mostrato anche all'admin, con testo dedicato ("Hai N nuovi messaggi dagli atleti") e pulsante che porta all'area messaggi dell'admin.

## Dettagli tecnici

- `supabase/functions/send-message-push/index.ts`: la funzione oggi accetta solo chiamate da admin verso un utente. Estenderla:
  - se il mittente è admin -> comportamento attuale (push al `userId` indicato);
  - se il mittente NON è admin -> ignora `userId` dal body, ricava i destinatari da `user_roles` (role = admin) escludendo il mittente, e invia a tutte le loro `push_subscriptions`;
  - payload differenziato: titolo/anteprima con il nickname o nome dell'atleta (letto da `profiles`) e `url: "/admin"` per gli admin, `"/messaggi"` per l'atleta.
- `src/components/MessagesThread.tsx`: invocare `send-message-push` anche quando `isAdminView === false` (attualmente solo se admin).
- `src/components/PushNotificationsToggle.tsx` va reso raggiungibile dall'admin: aggiungerlo nella scheda "Messaggi" del pannello admin (`src/pages/Admin.tsx`).
- `src/components/UnreadMessagesBanner.tsx`: rimuovere l'esclusione `!isAdmin` dal prompt push, e usare testo/destinazione diversi per l'admin (`/admin`).
- Nessuna modifica al database: `push_subscriptions` è già per-utente e vale anche per gli account admin.

## Note

- Su iPhone le push funzionano solo con l'app aggiunta alla schermata Home, come già indicato all'atleta.
- Il badge rosso e il toast in tempo reale per l'admin restano invariati.
