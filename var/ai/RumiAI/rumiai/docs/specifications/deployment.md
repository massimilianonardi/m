# RumiAI Deployment & Operations Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Deployment & Operations Subsystem definisce le modalità con cui RumiAI viene installato, configurato, avviato, aggiornato e mantenuto operativo.

Il sottosistema gestisce:

* containerizzazione;
* orchestrazione Podman;
* networking;
* volumi persistenti;
* lifecycle operativo;
* backup;
* aggiornamenti.

---

# 2. Principio fondamentale

## Reproducible Deployment

Un ambiente RumiAI deve essere ricostruibile.

Il risultato deve dipendere da:

* codice;
* immagini container;
* configurazioni;
* dati persistenti.

Non devono esistere configurazioni manuali non documentate.

---

# 3. Obiettivi

Il sistema deve fornire:

* installazione automatizzata;
* avvio controllato;
* isolamento componenti;
* gestione risorse;
* monitoraggio operativo;
* procedure recovery.

---

# 4. Non responsabilità

Il Deployment Subsystem NON deve:

* modificare logica applicativa;
* gestire decisioni degli agenti;
* sostituire il Configuration Subsystem;
* gestire dati applicativi direttamente.

---

# 5. Architettura Podman

La distribuzione iniziale utilizza Podman.

Struttura prevista:

```text id="9d5zq1"
RumiAI Host

|

Podman

|

------------------------------------------------

|                 |                 |

rumiai-core       rumiai-llm        rumiai-ui

|                 |                 |

Agent Runtime     Ollama            Open-WebUI

Workflow          Models            Interface
```

---

# 6. Componenti principali

## 6.1 Core Pod

Contiene:

* Agent Runtime;
* Workflow Engine;
* Event Bus;
* Plugin Manager;
* Configuration Manager;
* Observability.

---

## 6.2 LLM Pod

Responsabile dei modelli linguistici.

Implementazione iniziale:

```text id="u5v7kc"
Ollama
```

Gestisce:

* modelli;
* inferenza;
* embedding eventualmente supportati.

---

## 6.3 UI Pod

Interfaccia utente.

Implementazione iniziale:

```text id="4x9f2a"
Open-WebUI
```

Funzioni:

* chat;
* gestione sessioni;
* accesso utenti.

---

# 7. Networking

I componenti comunicano tramite rete privata Podman.

Schema:

```text id="7b3kq8"
rumiai-network

        |

-------------------------

core

ollama

open-webui
```

I servizi devono utilizzare:

* hostname container;
* porte dichiarate;
* configurazione esplicita.

---

# 8. Container Lifecycle

Ogni componente deve supportare:

```text id="z3g8vh"
Create

↓

Start

↓

Health Check

↓

Running

↓

Stop

↓

Remove
```

---

# 9. Health Check

Ogni servizio deve esporre stato operativo.

Esempio:

```text id="k8w4q2"
healthy

degraded

failed
```

---

# 10. Persistent Storage

I dati persistenti devono essere separati dai container.

Struttura:

```text id="v5m8q0"
rumiai-data/

├── models/

├── database/

├── vectors/

├── documents/

├── logs/

└── backups/
```

---

# 11. Volume Management

Regola:

```text id="j9n3vf"
Container

≠

Data
```

La cancellazione di un container non deve eliminare dati.

---

# 12. Configuration Deployment

Le configurazioni vengono montate nei container.

Schema:

```text id="g4p7nk"
Host

|

configs/

|

Container

|

/app/config
```

---

# 13. Environment Management

Supporto previsto:

```text id="m2k7zc"
development

testing

production
```

Ogni ambiente può avere:

* configurazioni;
* modelli;
* log level;
* policy.

---

# 14. Startup Sequence

Ordine di avvio:

```text id="n8x5ps"
1. Network

↓

2. Storage

↓

3. Ollama

↓

4. Core

↓

5. Plugins

↓

6. Open-WebUI
```

---

# 15. Shutdown Sequence

Ordine controllato:

```text id="a6w9mz"
1. UI

↓

2. Agents

↓

3. Workflow

↓

4. Core

↓

5. LLM

```

Obiettivo:

evitare perdita di stato.

---

# 16. Update Strategy

Gli aggiornamenti devono essere controllati.

Flusso:

```text id="r3k8vb"
Backup

↓

Pull immagini

↓

Stop servizi

↓

Update

↓

Migration

↓

Start

↓

Test
```

---

# 17. Backup Strategy

Devono essere salvati:

* configurazioni;
* database;
* documenti;
* embeddings;
* plugin.

Esempio:

```text id="x7c2nm"
Backup Archive

|

Restore Procedure
```

---

# 18. Resource Management

Configurazione risorse:

* CPU;
* RAM;
* GPU;
* storage.

Esempio:

```yaml id="h5q9ks"
resources:

  llm:

    memory: 16GB


  core:

    memory: 4GB
```

---

# 19. GPU Support

Il sistema deve poter supportare accelerazione hardware.

Possibili backend:

* NVIDIA Container Toolkit;
* GPU passthrough;
* CPU only mode.

---

# 20. Logging Operations

I log devono essere centralizzati.

Fonti:

```text id="m8x1qf"
Container Logs

↓

Observability Layer

↓

Storage Logs
```

---

# 21. Monitoring

Il sistema deve permettere controllo:

* stato container;
* utilizzo risorse;
* errori;
* performance.

---

# 22. Script Operativi

Il progetto deve fornire script POSIX compliant.

Esempi:

```text id="w2k7pn"
install.sh

start.sh

stop.sh

status.sh

backup.sh

update.sh
```

---

# 23. Disaster Recovery

Procedure previste:

Scenario:

```text id="s4q9mb"
Host failure

↓

Nuova installazione

↓

Restore backup

↓

Ripristino RumiAI
```

---

# 24. Sicurezza Deployment

Misure:

* container non privilegiati;
* network isolata;
* volumi controllati;
* minimo privilegio;
* aggiornamento immagini.

---

# 25. Test richiesti

## Installation Test

Verificare:

* creazione ambiente;
* avvio servizi;
* comunicazione.

---

## Recovery Test

Verificare:

* backup;
* restore;
* ripresa attività.

---

## Upgrade Test

Verificare:

* aggiornamento versione;
* compatibilità dati.

---

# 26. Implementazione Foundation

Prima versione:

```text id="c6v9mw"
Podman

+

podman-compose

+

POSIX Shell Scripts

+

YAML Configuration
```

---

# 27. Evoluzione futura

Possibili estensioni:

* Kubernetes;
* distribuzione multi-host;
* cluster locale;
* gestione remota;
* aggiornamenti automatici;
* monitoring avanzato.

---

# 28. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del User Interface & Interaction Subsystem.
