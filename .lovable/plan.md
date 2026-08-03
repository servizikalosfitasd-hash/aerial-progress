# Ristrutturazione UX del pannello Admin

## Obiettivo
Rendere il pannello admin più pulito, scansionabile e diviso in aree logiche, riducendo il sovraccarico di informazioni e separando nettamente le operazioni sugli utenti da quelle di sistema.

## Stato attuale
`Admin.tsx` raccoglie in un'unica colonna verticale:

- Selettore utente con ricerca.
- Una card "Messaggi" che non richiede un utente selezionato ma occupa spazio sempre.
- Due card affiancate (Report sicurezza / Audit log) tra il selettore e i tab.
- 4 tab che mescolano azioni utente e azioni globali: "Gestione utente", "Scheda allenamento", "Esercizi personalizzati", "Esercizio globale".

I componenti figli sono molto densi:

- `UserManagementPanel` ha 4 card verticali (Statistiche, Profilo, Permessi, Zona pericolosa).
- `UserPlanEditor` elenca ogni skill in una card piena di campi, senza collassamento.
- `UserCustomExercisesEditor` mostra form + lista in sequenza senza distinzione tra creazione e modifica.

## Proposte di riorganizzazione

### 1. Navigazione a due livelli in Admin
Aggiungere nella parte alta della pagina una navigazione primaria a tab con 3 macro aree:

- **Utenti** — selettore utente + sotto-tab.
- **Messaggi** — AdminMessagesPanel, senza selettore obbligatorio.
- **Sistema** — azioni globali, con i propri sotto-tab.

Dentro l'area **Utenti**, una volta scelto un utente, mostrare sotto-tab orizzontali:

- Panoramica
- Scheda allenamento
- Esercizi personalizzati
- Messaggi

Dentro l'area **Sistema**, mostrare sotto-tab:

- Esercizi globali
- Report sicurezza
- Audit log

Questo elimina il problema per cui "Esercizio globale" appare tra le azioni di un singolo utente e toglie le card Messaggi/Report/Audit dal flusso utente.

### 2. Sottopagine con breadcrumb
In ogni area mostrare un header locale con:

- Titolo dell'area.
- Quando si opera su un utente, un breadcrumb: `Admin / Utenti / [Nome o email] / [Sottosezione]`.

### 3. Refactoring di UserManagementPanel
Consolidare le 4 card in una vista a due colonne (su desktop) e sezioni chiare:

- Colonna sinistra: **Profilo** (nickname, nome, cognome) e **Permessi** (toggle admin + reset password).
- Colonna destra: **Statistiche** (data registrazione, ultimo accesso, sessioni, skill, esercizi) e **Zona pericolosa** (reset dati ed eliminazione, evidenziata con bordo e sfondo destruct).

### 4. Refactoring di UserPlanEditor
Dividere la pagina in 3 blocchi distinti:

- **Note sessione** (card singola a 2 colonne): Riscaldamento e Stretching.
- **Skill in scheda**: ogni skill diventa un item collassabile tramite `<Accordion>`, con all'interno i gruppi propedeutici e la mobilità specifica. Di default tutte chiuse, aperta solo quella attualmente in modifica.
- Mantenere il salvataggio per singolo gruppo come già oggi.

### 5. Refactoring di UserCustomExercisesEditor
Separare chiaramente:

- Un pulsante "Aggiungi esercizio" che espande il form di creazione.
- La lista degli esercizi assegnati in card separate con azioni più visibili.
- Quando si modifica un esercizio, il form si apre inline o in una dialog per non confondere con la creazione.

### 6. Stati vuoti e spaziatura
Aggiungere illustrazioni testuali/stati vuoti consistenti per ogni lista vuota, aumentare il respiro verticale tra le sezioni e usare titoli di sezione con `text-sm font-semibold` per scansionare meglio.

## File coinvolti

- `src/pages/Admin.tsx` — nuova struttura a macro aree e sotto-tab.
- `src/components/admin/UserManagementPanel.tsx` — layout a 2 colonne, card consolidate.
- `src/components/admin/UserPlanEditor.tsx` — accordion per skill, sezioni note distinte.
- `src/components/admin/UserCustomExercisesEditor.tsx` — form espandibile/modale, lista separata.
- `src/components/admin/AdminMessagesPanel.tsx` — eventuali adattamenti di padding e titoli.
- `src/components/ui/accordion.tsx` — già disponibile, da usare per `UserPlanEditor`.

## Milestone

1. **Struttura di navigazione** — riorganizzare `Admin.tsx` in aree + sotto-tab e spostare Esercizio globale, Sicurezza e Audit log in "Sistema".
2. **Pannelli utente** — semplificare `UserManagementPanel`, `UserPlanEditor` e `UserCustomExercisesEditor`.
3. **Pulizia estetica** — breadcrumb, stati vuoti, spaziatura uniforme e revisione titoli.

## Note
Non sono previste modifiche al database né ai ruoli/permessi: il lavoro è puramente frontend e riguarda l'organizzazione e la presentazione delle sezioni esistenti.
