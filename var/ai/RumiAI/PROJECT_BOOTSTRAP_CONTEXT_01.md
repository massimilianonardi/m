# PROJECT BOOTSTRAP CONTEXT

## Local AI Platform Project

Versione documento: 0.1
Stato: Architettura approvata, implementazione Foundation Release non ancora iniziata

---

# 1. Scopo del documento

Questo documento contiene tutte le decisioni architetturali e progettuali prese durante la fase iniziale del progetto.

Il suo scopo è permettere la ripresa del lavoro in una nuova sessione mantenendo:

* visione del progetto;
* obiettivi;
* principi architetturali;
* decisioni già prese;
* roadmap;
* metodo di sviluppo.

Questo documento deve essere considerato il punto di partenza ufficiale del progetto.

---

# 2. Visione del progetto

Il progetto non è un semplice agente AI.

L'obiettivo è creare una piattaforma AI locale, modulare ed estendibile sulla quale possano vivere diversi agenti specializzati.

La piattaforma deve permettere la costruzione di:

* assistenti personali;
* agenti per sviluppo software;
* agenti di ricerca;
* agenti amministrativi;
* agenti per automazione;
* futuri sistemi multi-agente.

Il progetto deve essere:

* local-first;
* open source;
* modulare;
* estendibile;
* sicuro;
* osservabile;
* indipendente dalle tecnologie sottostanti.

---

# 3. Stato iniziale del sistema

Attualmente esiste un ambiente Podman funzionante composto da:

* un pod Ollama;
* modello Gemma configurato;
* un pod Open WebUI;
* un pod Python 3.12;
* test iniziali di comunicazione Python → Ollama.

È stato verificato che:

* il container Python comunica correttamente con Ollama;
* la struttura iniziale dei test funziona;
* il logging è operativo;
* il progetto non è ancora trasformato in package Python installabile.

Decisione presa:

Non procedere subito alla trasformazione in package Python.

Prima verrà definita la nuova architettura.

---

# 4. Cambio di paradigma progettuale

Il progetto evolve da:

"Local AI Agent"

a:

"Local AI Platform"

La piattaforma è il prodotto principale.

Gli agenti diventano applicazioni costruite sopra la piattaforma.

Modello concettuale:

```
Platform

↓

Application

↓

Agent
```

---

# 5. Architettura generale

Visione ad alto livello:

```
                    AI PLATFORM

                 Agent Kernel

                      |
 ------------------------------------------------

 Knowledge    Tools    Memory    Workflow    LLM

                      |
 ------------------------------------------------

 LanceDB   Browser   Terminal   Ollama   ComputerUse
```

---

# 6. Principio architetturale principale

Il progetto deve rispettare:

"Il dominio non conosce l'infrastruttura."

Il codice core non deve dipendere direttamente da:

* Ollama;
* Gemma;
* LanceDB;
* Playwright;
* Podman;
* database specifici.

Tutte le dipendenze devono passare attraverso interfacce.

---

# 7. Architettura a livelli

Il sistema sarà organizzato secondo Clean Architecture:

```
Presentation Layer

        |

Application Layer

        |

Domain Layer

        |

Infrastructure Layer
```

---

# 8. Agent Kernel

Il Kernel è il cuore della piattaforma.

Responsabilità:

* lifecycle management;
* registry;
* dependency injection;
* plugin loading;
* configurazione;
* event bus;
* scheduling;
* gestione permessi.

Il Kernel NON deve conoscere:

* modelli LLM;
* database;
* browser;
* tool specifici.

---

# 9. Sottosistemi principali

## LLM Subsystem

Responsabilità:

* generazione testo;
* streaming;
* embeddings.

Interfaccia prevista:

```
LLMProvider

generate()

stream()

embedding()
```

Implementazioni future:

* Ollama;
* llama.cpp;
* altri provider.

---

## Knowledge Subsystem

Responsabilità:

Pipeline:

```
Document

↓

Loader

↓

Parser

↓

Preprocessor

↓

Chunker

↓

Embedding

↓

Indexer

↓

Retriever

↓

Context Builder
```

Tecnologie previste:

* inizialmente LanceDB;
* architettura pronta per altri vector store.

Possibili future implementazioni:

* Qdrant;
* FAISS;
* altri database vettoriali.

---

## Tool Subsystem

Il sistema non ragiona direttamente in termini di tool.

Introduce il concetto di:

Capability

Esempi:

```
ReadDocument

ExecuteCommand

Browse

Screenshot

SearchKnowledge
```

Il Kernel risolve la capability verso il plugin corretto.

---

## Memory Subsystem

La memoria sarà divisa in:

```
Working Memory

Conversation Memory

Semantic Memory

Episodic Memory

Long Term Memory
```

La memoria non è considerata equivalente al RAG.

---

## Workflow Subsystem

Gestirà:

* piani;
* step;
* workflow complessi;
* esecuzione DAG;
* processi multi-step.

---

## Browser Subsystem

Responsabilità:

* navigazione;
* sessioni;
* tab;
* DOM;
* download;
* screenshot;
* autenticazioni.

Possibile implementazione:

* Playwright.

---

## Computer Subsystem

Responsabilità:

* mouse;
* tastiera;
* clipboard;
* OCR;
* screenshot;
* interazione GUI.

Obiettivo:

supportare funzionalità ComputerUse.

---

## Security Subsystem

Responsabilità:

* policy;
* permessi;
* approvazioni;
* audit;
* sandbox.

Ogni azione deve essere:

```
Validated

↓

Authorized

↓

Executed

↓

Audited
```

---

# 10. Event Driven Architecture

La comunicazione interna sarà basata su eventi.

Esempi:

```
UserMessageReceived

PlanCreated

ToolStarted

ToolCompleted

DocumentIndexed

SearchCompleted

MemoryUpdated

LLMCompleted
```

Gli eventi permetteranno:

* debugging;
* auditing;
* statistiche;
* replay;
* osservabilità.

---

# 11. Plugin Architecture

Ogni componente importante deve poter essere un plugin.

Possibili plugin:

* LLM;
* Knowledge Store;
* Tool;
* Browser;
* Memory;
* Vision;
* OCR;
* Speech.

Struttura prevista:

```
plugins/

    plugin-name/

        contracts/

        implementation/

        tests/
```

---

# 12. Organizzazione repository prevista

```
local-ai-platform/

app/

docs/

tests/

scripts/

configs/

plugins/

examples/

data/

workspace/

README.md

LICENSE

CHANGELOG.md
```

---

# 13. Documentazione prevista

Directory:

```
docs/

architecture/

decisions/

specifications/

security/

roadmap/
```

Documenti iniziali:

```
00-project-manifesto.md

01-software-architecture-document.md

02-kernel.md

03-knowledge.md

04-tool.md

05-llm.md

06-memory.md

07-workflow.md

08-browser.md

09-computer.md

10-security.md

development-standards.md
testing-strategy.md
```

---

# 14. Architecture Decision Records previste

ADR iniziali:

```
ADR-0001-local-first

ADR-0002-podman-runtime

ADR-0003-plugin-architecture

ADR-0004-event-driven

ADR-0005-knowledge-abstraction

ADR-0006-lancedb-initial-store

ADR-0007-llm-provider-abstraction
```

---

# 15. Metodo di sviluppo deciso

Ogni funzionalità seguirà:

```
Requirements

↓

Architecture Design

↓

Specification

↓

Tests

↓

Implementation

↓

Refactoring
```

Il codice è conseguenza dell'architettura.

---

# 16. Strategia di test

Livelli previsti:

```
Unit Test

Integration Test

End-to-End Test

Agent Scenario Test
```

Gli scenario test simuleranno casi reali.

Esempio:

"L'agente deve analizzare una cartella, indicizzare documenti e rispondere a domande."

---

# 17. Configurazione prevista

Non utilizzare un singolo file .env enorme.

Configurazione prevista:

```
configs/

llm.yaml

knowledge.yaml

browser.yaml

security.yaml

memory.yaml

agent.yaml
```

Possibilità di profili:

```
development

testing

production

offline

gpu

cpu
```

---

# 18. Deployment

Obiettivo:

supportare:

* Podman;
* Docker;
* installazione bare metal.

Principio:

il codice non deve dipendere dal metodo di deployment.

---

# 19. Roadmap approvata

## Foundation Release v0.1

Documentazione e principi.

## Kernel v0.2

* Kernel;
* Event Bus;
* Registry;
* Plugin Loader;
* Configuration.

## Knowledge v0.3

* RAG;
* LanceDB;
* Retrieval.

## Tools v0.4

* Terminal;
* Filesystem;
* Tool Registry.

## Memory v0.5

Memoria persistente.

## Agent Runtime v0.6

Planner ed Executor.

## Browser v0.7

Browser automation.

## ComputerUse v0.8

Interazione GUI.

## Plugin Ecosystem v0.9

Sistema estensioni.

## Platform v1.0

Piattaforma completa.

---

# 20. Prossima attività

La prossima attività prevista è:

Creazione del documento:

```
docs/00-project-manifesto.md
```

Il Manifesto definirà:

* identità del progetto;
* visione;
* missione;
* valori;
* principi;
* obiettivi;
* limiti.

Dopo il Manifesto verrà creato il Software Architecture Document.

---

# 21. Istruzioni per una nuova sessione

Quando si apre una nuova sessione, fornire questo documento e chiedere:

"Continuiamo il progetto Local AI Platform partendo dal PROJECT_BOOTSTRAP_CONTEXT. Mantieni tutte le decisioni architetturali definite nel documento."

La nuova sessione dovrà assumere il ruolo di co-progettista architetturale e mantenere:

* approccio platform-first;
* modularità;
* local-first;
* plugin architecture;
* event-driven design;
* separazione dominio/infrastruttura.
