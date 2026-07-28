# RumiAI Operator Manual

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Questo documento descrive le procedure operative per amministrare un'istanza RumiAI.

Il manuale è destinato a:

* amministratori;
* sviluppatori;
* operatori tecnici;
* manutentori del sistema.

---

# 2. Principi operativi

L'amministrazione di RumiAI deve seguire:

* sicurezza;
* tracciabilità;
* minima modifica manuale;
* automazione quando possibile.

---

# 3. Modello operativo

L'operatore interagisce con:

```text
Operator

↓

Management Interface

↓

RumiAI OS

↓

Runtime Services
```

---

# 4. Struttura installazione

Installazione standard:

```text
/opt/rumiai
```

Struttura:

```text
rumiai/

├── app/

├── config/

├── data/

├── logs/

├── models/

├── scripts/

├── storage/

└── backups/
```

---

# 5. Comandi principali

Directory:

```text
scripts/
```

Comandi previsti:

```text
start.sh

stop.sh

restart.sh

status.sh

healthcheck.sh

backup.sh

restore.sh

update.sh
```

---

# 6. Avvio sistema

Procedura:

```text
start.sh
```

Flusso:

```text
Load Configuration

↓

Start Services

↓

Check Health

↓

Enable Runtime
```

---

# 7. Arresto sistema

Procedura:

```text
stop.sh
```

Il sistema:

* blocca nuove richieste;
* completa attività attive;
* salva stato;
* termina servizi.

---

# 8. Riavvio controllato

Procedura:

```text
restart.sh
```

Utilizzata dopo:

* modifiche configurazione;
* aggiornamenti;
* manutenzione.

---

# 9. Verifica stato

Comando:

```text
status.sh
```

Mostra:

* servizi attivi;
* versione;
* stato runtime;
* modelli caricati.

Esempio:

```text
RumiAI Status

Core: RUNNING

Memory: READY

Knowledge: READY

Agents: ACTIVE
```

---

# 10. Health Check

Comando:

```text
healthcheck.sh
```

Controlla:

* database;
* storage;
* Ollama;
* API;
* agent runtime.

---

# 11. Gestione servizi

Servizi principali:

```text
Kernel

Agent Runtime

Memory Service

Knowledge Service

Search Service

Automation Service

API Gateway
```

---

# 12. Lettura log

Directory:

```text
logs/
```

Struttura:

```text
system.log

runtime.log

error.log

audit.log

bootstrap.log
```

---

# 13. Livelli log

Livelli supportati:

```text
DEBUG

INFO

WARNING

ERROR

CRITICAL
```

---

# 14. Diagnostica base

Procedura:

```text
1. Verificare stato sistema

2. Controllare health check

3. Analizzare error log

4. Verificare risorse

5. Riavviare servizio interessato
```

---

# 15. Gestione modelli LLM

Controlli:

* modelli disponibili;
* spazio occupato;
* compatibilità;
* caricamento runtime.

---

# 16. Diagnostica Ollama

Verificare:

* servizio attivo;
* modello disponibile;
* memoria sufficiente;
* risposta API.

---

# 17. Gestione memoria RumiAI

Operazioni:

* verifica database memoria;
* esportazione;
* pulizia selettiva;
* controllo spazio.

---

# 18. Gestione Knowledge Base

Operazioni:

* import documenti;
* aggiornamento indice;
* ricostruzione embedding;
* verifica fonti.

---

# 19. Gestione Vector Store

Controlli:

* integrità LanceDB;
* numero vettori;
* spazio occupato;
* indice.

---

# 20. Backup

Comando:

```text
backup.sh
```

Backup inclusi:

```text
Database

+

Knowledge

+

Memory

+

Configuration

+

Documents
```

---

# 21. Restore

Comando:

```text
restore.sh
```

Procedura:

```text
Stop Services

↓

Restore Data

↓

Validate Integrity

↓

Restart
```

---

# 22. Aggiornamento sistema

Comando:

```text
update.sh
```

Procedura:

```text
Backup

↓

Download Version

↓

Compatibility Check

↓

Update

↓

Validation
```

---

# 23. Modalità manutenzione

Attivazione:

```text
maintenance mode
```

Durante questa modalità:

* nuove automazioni sospese;
* aggiornamenti consentiti;
* diagnostica attiva.

---

# 24. Gestione errori comuni

## Database non disponibile

Controlli:

* file database;
* permessi;
* spazio disco.

---

## Modello LLM non disponibile

Controlli:

* Ollama;
* modello installato;
* configurazione.

---

## Ricerca non funzionante

Controlli:

* indice;
* LanceDB;
* embedding pipeline.

---

# 25. Monitoraggio risorse

Controllare:

* CPU;
* RAM;
* GPU;
* disco;
* processi.

---

# 26. Sicurezza operativa

L'operatore deve:

* usare account dedicati;
* evitare modifiche dirette ai dati;
* proteggere configurazioni;
* mantenere audit.

---

# 27. Audit operativo

Ogni attività amministrativa deve essere registrata.

Esempi:

```text
ServiceRestarted

BackupCreated

ConfigurationChanged

UpdateApplied
```

---

# 28. Procedure emergenza

Scenario:

Sistema non raggiungibile.

Sequenza:

```text
Check Host

↓

Check Services

↓

Check Logs

↓

Health Test

↓

Recovery Procedure
```

---

# 29. Disaster Recovery

In caso di perdita sistema:

```text
Install Clean Host

↓

Restore Backup

↓

Validate Data

↓

Restart RumiAI
```

---

# 30. Checklist giornaliera

Verificare:

* stato servizi;
* spazio disco;
* errori critici;
* backup;
* utilizzo risorse.

---

# 31. Checklist periodica

Eseguire:

* aggiornamenti;
* test restore;
* pulizia cache;
* verifica sicurezza.

---

# 32. Automazione amministrativa

Le procedure frequenti devono diventare:

* script;
* workflow;
* automazioni RumiAI.

---

# 33. Implementazione Foundation

Prima versione:

```text
Command Scripts

+

Status Interface

+

Health Checks

+

Backup Procedures

+

Troubleshooting Guide
```

---

# 34. Evoluzione futura

Possibili estensioni:

* dashboard amministrativa;
* gestione remota;
* auto-diagnosi;
* suggerimenti manutenzione generati da AI;
* self-healing operations.

---

# 35. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Threat Model di sicurezza.
