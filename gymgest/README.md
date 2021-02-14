# GymGest
## Porgetto per il corso di Applicazioni e Servizi Web

### Descriptions
L’idea per questo progetto, nasce dalle nostre esperienze pregresse con il mondo della palestra e dal desiderio di poter disporre di un’applicazione che faciliti 
l’organizzazione e la gestione degli allenamenti, che fornisca determinate funzionalità, da noi ritenute indispensabili e dalla possibilità di sfruttare le tecnologie viste
e le conoscenze impartite durante la frequenza del corso di Applicazione e Servizi Web.  
Lo scopo del nostro progetto, appunto, è quello di realizzare una applicazione web gestionale per palestre, la quale oltre alla normale gestione di una palestra,
introduca concetti come:

- Gestione dei corsi tenuti in palestra.
+ Chat private tra utenti e coach.
* Aggiunta di training all’aperto con visualizzazione percorsi attraverso GPS.

### Deployment
Abbiamo quindi deciso di inserire all’interno del repository una cartella collections che contiene tutte le collections esportate ed un file mongo.txt contenente i comandi
per importarle facilmente nel database. Ovviamente è necessario cambiare i percorsi delle collections. 
Per avviare l’applicazione è necessario:
- da una prima shell, avviare il server, posizionandosi sulla cartella /gymgest/servere lanciare il comandonode index.js
+ da una seconda shell, posizionarsi in /gymgest/gymgested eseguire il comando npm run build per creare una build ottimizzata dell’applicazione
* usare il package serve per lanciarla
- se non si dispone diserve è necessario installarlo con npm install serve -g
+ avviare l’applicazione con serve -s buil dall’interno della cartella /gymgest/gymgest
