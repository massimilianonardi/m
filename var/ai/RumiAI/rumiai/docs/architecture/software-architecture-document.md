# RumiAI Software Architecture Document (SAD)

## Obiettivo del documento

Definire l'architettura di riferimento della piattaforma RumiAI, stabilendo:

* livelli software;
* responsabilità dei componenti;
* regole di dipendenza;
* flussi di comunicazione;
* contratti tra sottosistemi;
* principi di evoluzione.

Il documento rappresenta la guida tecnica principale del progetto.

---

# 1. Vista generale del sistema

RumiAI è una piattaforma AI composta da un Kernel centrale e da sottosistemi modulari.

Vista logica:

```text
                         USER

                          |

              +-----------------------+
              |    Interaction Layer  |
              +-----------------------+

                          |

              +-----------------------+
              |     Application Layer |
              +-----------------------+

                          |

              +-----------------------+
              |      Agent Runtime    |
              +-----------------------+

                          |

              +-----------------------+
              |        Kernel         |
              +-----------------------+

        ------------------------------------------------

        |          |          |          |             |

    Knowledge    Memory     Tools      LLM       Workflow

        |          |          |          |             |

    LanceDB    Storage    Browser    Ollama       Planner

                         Terminal

                         Computer
```

---

# 2. Principio architetturale principale

## Kernel-centric architecture

Il Kernel rappresenta il punto centrale della piattaforma.

Tutti i sottosistemi comunicano attraverso contratti definiti.

Un sottosistema non deve conoscere direttamente l'implementazione di un altro sottosistema.

Esempio vietato:

```python
from knowledge.lancedb import LanceDBStore
```

Esempio corretto:

```python
from contracts.knowledge import KnowledgeStore
```

---

# 3. Architettura a livelli

RumiAI sarà organizzato secondo quattro livelli principali.

---

## Layer 1 — Domain Layer

Contiene i concetti fondamentali del sistema.

Non conosce:

* database;
* rete;
* filesystem;
* container;
* modelli AI.

Esempi:

```text
Agent

Task

Plan

Step

Capability

Event

MemoryEntry

Document
```

---

## Layer 2 — Application Layer

Coordina i casi d'uso.

Responsabilità:

* orchestrazione;
* gestione workflow;
* coordinamento agenti;
* gestione richieste utente.

Esempi:

```text
Agent Runtime

Planner

Executor

Conversation Manager
```

---

## Layer 3 — Infrastructure Layer

Contiene implementazioni concrete.

Esempi:

```text
Ollama Client

LanceDB Adapter

Playwright Browser

Filesystem Tool

Podman Runtime
```

---

## Layer 4 — Interface Layer

Gestisce l'interazione esterna.

Esempi:

```text
CLI

REST API

Web UI

Open WebUI integration

Future Desktop UI
```

---

# 4. Il Kernel

Il Kernel è volutamente minimale.

Responsabilità:

## Lifecycle Management

Gestione:

* avvio;
* caricamento;
* arresto;
* stato dei componenti.

---

## Dependency Injection

Il Kernel collega:

```text
Interface

↓

Implementation
```

senza creare dipendenze rigide.

---

## Registry

Mantiene l'elenco delle capacità disponibili.

Esempio:

```yaml
capability:
  - name: execute_command
    provider: terminal_plugin

  - name: search_knowledge
    provider: lancedb_plugin
```

---

## Event Bus

Permette comunicazione asincrona.

Esempio:

```text
DocumentIndexed

ToolExecuted

MemoryUpdated

TaskCompleted
```

---

## Plugin Loader

Carica dinamicamente estensioni.

---

## Configuration Manager

Gestisce configurazioni separate:

```text
llm.yaml

knowledge.yaml

security.yaml

memory.yaml
```

---

# 5. Concetto di Capability

Una decisione fondamentale.

RumiAI non ragiona direttamente in termini di tool.

Ragiona in termini di capacità.

Esempio:

L'agente richiede:

```text
Capability:
execute_command
```

Il Kernel individua:

```text
Terminal Plugin
```

che fornisce quella capability.

Questo permette:

* sostituzione implementazioni;
* controllo sicurezza;
* composizione dinamica.

---

# 6. Comunicazione tra componenti

Il sistema userà due modalità.

---

## Comunicazione sincrona

Per richieste immediate:

```text
Agent

↓

Knowledge Interface

↓

Result
```

---

## Comunicazione tramite eventi

Per attività lunghe:

```text
TaskCreated

↓

PlannerStarted

↓

ToolExecuted

↓

TaskCompleted
```

---

# 7. Modello Plugin

Ogni plugin deve fornire:

```text
Metadata

Capabilities

Configuration

Lifecycle

Implementation

Tests
```

Struttura prevista:

```text
plugin-name/

├── manifest.yaml

├── contracts/

├── implementation/

├── tests/

└── README.md
```

---

# 8. Sottosistemi principali

## Knowledge Subsystem

Gestisce:

* acquisizione documenti;
* parsing;
* chunking;
* embedding;
* indicizzazione;
* retrieval.

Prima implementazione:

LanceDB.

---

## LLM Subsystem

Astrarre il modello linguistico.

Interfaccia:

```text
generate()

stream()

embed()
```

Prima implementazione:

Ollama + Gemma.

---

## Tool Subsystem

Gestisce strumenti operativi:

* filesystem;
* terminale;
* API;
* applicazioni.

---

## Memory Subsystem

Gestisce:

* memoria temporanea;
* conversazioni;
* conoscenza persistente;
* esperienze.

---

## Workflow Subsystem

Gestisce:

* pianificazione;
* esecuzione;
* dipendenze;
* retry;
* stato.

---

## Browser Subsystem

Gestisce:

* navigazione;
* pagine;
* DOM;
* sessioni;
* download.

---

## Computer Subsystem

Gestisce:

* mouse;
* tastiera;
* screenshot;
* OCR;
* GUI automation.

---

## Security Subsystem

Gestisce:

* autorizzazioni;
* policy;
* sandbox;
* audit.

---

# 9. Deployment Architecture

Ambiente previsto:

```text
Host

|

Podman

|

-------------------------

Ollama Pod

OpenWebUI Pod

RumiAI Runtime Pod

Database Pod

-------------------------
```

Il deployment non deve influenzare il codice applicativo.

---

# 10. Evoluzione futura

L'architettura deve permettere:

* più agenti contemporanei;
* distribuzione su più nodi;
* nuovi modelli AI;
* nuovi database;
* nuove interfacce.
