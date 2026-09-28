# Riordino visivo Kalos Fit — atleta e admin

## Direzione approvata
“Performance Tactical Hub”: nero e grafite `#141517` / `#202226`, verde Kalos `#98FE2E`, testo chiaro `#F4F6F2`; titoli Bebas Neue e testo Barlow. Navigazione laterale su schermi ampi, apribile e richiudibile su telefono. La composizione scelta è un riferimento di gerarchia e densità, non una fonte di dati o nuove funzioni: niente statistiche, esercizi, coach o pulsanti fittizi mostrati nel prototipo.

## Ridondanze individuate e accorpamenti

### Lato Utente
- Le intestazioni e i comandi del menu sono ripetuti nelle pagine principali e in parte compensati da un pulsante fluttuante: unificare la struttura visiva mantenendo sempre accessibile il menu.
- Home e allenamento usano più contenitori e indicatori con stili diversi: uniformare titoli, stati, progressi, spazi e densità, preservando le immagini delle skill e la scelta già esistente tra vista comoda e compatta.
- La scheda mostra fase, programmazione settimanale, riscaldamento/stretching, skill e storico in blocchi separati: comporre una gerarchia più chiara, con programmazione e skill al centro e note contestuali a lato su desktop; su mobile tutto in ordine lineare. Nessun cambiamento a settimana, selezione, timer, serie, salvataggio o reset.

### Lato Admin
- “Messaggi” compare sia come area principale sia tra le schede del singolo utente e ci sono due modalità per scegliere un atleta: rendere unica e comprensibile la porta d’ingresso alle conversazioni, conservando l’accesso al thread dell’atleta selezionato.
- I pannelli profilo, permessi, statistiche, accessi, scheda ed esercizi usano molte cornici e gruppi di campi simili: creare un’intestazione contestuale con ricerca atleta e raggruppare le azioni per Gestione atleta, Allenamento, Comunicazioni e Sistema, evitando contenitori annidati superflui.
- I campi numerici degli esercizi ricorrono in più moduli: uniformarne presentazione e allineamento, senza modificare formati, controlli, valori o invio.

## Intervento previsto
1. Applicare la palette scelta tramite i token globali e la tipografia Bebas Neue/Barlow; usare gli stessi token per stati, bordi e superfici, con leggibilità e contrasto su desktop e mobile.
2. Consolidare la navigazione laterale esistente e le intestazioni ripetute senza eliminare voci, link, banner, notifiche, lingua, accessibilità o controlli di accesso.
3. Riordinare le schermate atleta esistenti — home/skill, scheda e dettaglio, massimali/classifica, circuiti, stability, stretching, gambe, messaggi — usando una gerarchia comune e mantenendo visibili tutti i comandi e gli stati attuali.
4. Riordinare il pannello admin: selettore atleta persistente nel contesto Utenti, comandi affini raccolti in gruppi chiari, conversazioni con accesso unico ma compatibile con i collegamenti contestuali, strumenti globali e report separati dai dati individuali. Mantenere le conferme delle azioni distruttive e tutti i flussi esistenti.
5. Verificare su desktop e telefono: apertura/chiusura menu, navigazione, alternanza viste skill, consultazione scheda e storico, scelta atleta e schede admin, messaggi, form e salvataggi; confrontare gli stati visivi prima/dopo. Se l’account di verifica non è admin, usare un account admin autorizzato prima di dichiarare verificato quel percorso.

## Vincoli tecnici
Solo presentazione e organizzazione dei componenti React/CSS. Nessuna modifica a database, autenticazione, policy, funzioni cloud, integrazioni, formule, periodizzazione o payload. Conservare nomi/identificativi di esercizi, dati e traduzioni già presenti. Il codice condiviso riguarda solo elementi di interfaccia, non motori di timer o calcoli. Commenti brevi solo dove spiegano una scelta non ovvia.
