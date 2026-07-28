# RumiAI Kernel Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Kernel rappresenta il nucleo runtime della piattaforma RumiAI.

Il suo compito è fornire i servizi fondamentali necessari al funzionamento dei sottosistemi senza conoscere le implementazioni specifiche delle capacità offerte.

Il Kernel è responsabile dell'orchestrazione della piattaforma, non dell'intelligenza dell'agente.

---

# 2. Principi fondamentali

Il Kernel deve rispettare questi principi:

## Minimalità

Il Kernel deve contenere solo funzionalità fondamentali.

Non deve contenere:

* logica specifica dei tool;
* logica RAG;
* logica LLM;
* logica browser;
* logica memoria.

---

## Indipendenza

Il Kernel non deve dipendere direttamente da:

* Ollama;
* Gemma;
* LanceDB;
* Playwright;
* browser specifici;
* database specifici.

---

## Estendibilità

Nuove capacità devono poter essere aggiunte tramite plugin senza modificare il Kernel.

---

## Osservabilità

Ogni componente deve poter comunicare stato e attività attraverso eventi.

---

# 3. Responsabilità del Kernel

Il Kernel fornisce i seguenti servizi fondamentali:

---

# 3.1 Lifecycle Management

Gestisce il ciclo di vita dei componenti.

Fasi previste:

```text
Created

↓

Initialized

↓

Loaded

↓

Running

↓

Stopping

↓

Stopped
```

Ogni componente deve dichiarare:

* nome;
* versione;
* dipendenze;
* capacità;
* stato.

---

# 3.2 Component Registry

Il Registry mantiene l'elenco dei componenti disponibili.

Esempio:

```yaml
components:

  - name: ollama-provider
    type: llm

  - name: lancedb-store
    type: knowledge

  - name: terminal-tool
    type: capability
```

Il Registry permette:

* discovery;
* risoluzione delle dipendenze;
* sostituzione implementazioni.

---

# 3.3 Dependency Injection

Il Kernel deve fornire implementazioni concrete alle interfacce richieste.

Esempio:

Il dominio richiede:

```python
KnowledgeStore
```

Il Kernel fornisce:

```python
LanceDBKnowledgeStore
```

Il dominio non deve conoscere questa scelta.

---

# 3.4 Event Bus

Il Kernel fornisce un sistema di comunicazione basato su eventi.

Esempi:

```text
ComponentLoaded

CapabilityRegistered

TaskCreated

ToolStarted

ToolCompleted

MemoryUpdated

ErrorOccurred
```

---

# 3.5 Configuration Management

Il Kernel carica configurazioni esterne.

Struttura prevista:

```text
configs/

kernel.yaml

llm.yaml

knowledge.yaml

memory.yaml

security.yaml
```

La configurazione deve essere:

* leggibile;
* versionabile;
* separata dal codice.

---

# 3.6 Plugin Loading

Il Kernel deve poter caricare plugin esterni.

Processo:

```text
Discover Plugin

↓

Validate Manifest

↓

Resolve Dependencies

↓

Initialize

↓

Register Capabilities

↓

Start
```

---

# 3.7 Security Enforcement Point

Il Kernel rappresenta il primo punto di controllo sicurezza.

Prima di eseguire una capability:

```text
Request

↓

Policy Check

↓

Authorization

↓

Execution

↓

Audit Event
```

---

# 4. Componenti interni del Kernel

Struttura prevista:

```text
kernel/

├── lifecycle/

├── registry/

├── events/

├── config/

├── plugins/

├── security/

└── runtime/
```

---

# 5. Modelli principali

## Component

Rappresenta un modulo runtime.

Attributi:

```text
id

name

version

type

status

dependencies
```

---

## Capability

Rappresenta una capacità disponibile.

Esempio:

```text
name:

execute_command


provider:

terminal-plugin
```

---

## Event

Rappresenta un evento interno.

Attributi:

```text
id

timestamp

type

source

payload
```

---

## Plugin Manifest

Descrive un plugin.

Esempio:

```yaml
name: terminal-plugin

version: 0.1

capabilities:

  - execute_command
```

---

# 6. Interfacce principali

## Component Interface

Responsabilità minima comune.

Esempio concettuale:

```python
class Component:

    initialize()

    start()

    stop()

    health()
```

---

## Event Bus Interface

```python
publish(event)

subscribe(event_type, handler)
```

---

## Registry Interface

```python
register(component)

find(name)

list()
```

---

## Plugin Interface

```python
load()

unload()

metadata()
```

---

# 7. Flusso di avvio

Sequenza prevista:

```text
Application Start

↓

Kernel Initialize

↓

Load Configuration

↓

Initialize Event Bus

↓

Initialize Registry

↓

Discover Plugins

↓

Load Components

↓

Register Capabilities

↓

Start Runtime

↓

Ready
```

---

# 8. Flusso di esecuzione di una capability

Esempio:

L'agente richiede:

```text
execute_command
```

Flusso:

```text
Agent

↓

Kernel

↓

Security Check

↓

Capability Registry

↓

Terminal Plugin

↓

Execution

↓

Result

↓

Event Publication
```

---

# 9. Error Handling

Gli errori devono essere:

* classificati;
* registrati;
* osservabili.

Categorie previste:

```text
ConfigurationError

PluginError

SecurityError

ExecutionError

DependencyError

RuntimeError
```

---

# 10. Logging

Il Kernel deve fornire logging strutturato.

Ogni evento significativo deve includere:

```text
timestamp

component

operation

status

duration

correlation_id
```

---

# 11. Test richiesti

Prima dell'implementazione completa:

## Unit Test

Testare:

* Registry;
* Event Bus;
* Configuration;
* Lifecycle.

---

## Integration Test

Verificare:

* caricamento plugin;
* registrazione capability;
* comunicazione eventi.

---

## Scenario Test

Esempio:

"Avvio della piattaforma con un plugin LLM e un plugin Knowledge."

Risultato atteso:

* componenti caricati;
* capability registrate;
* eventi prodotti correttamente.

---

# 12. Cosa il Kernel NON deve fare

Il Kernel non deve:

* generare testo;
* creare embedding;
* fare retrieval;
* aprire browser;
* eseguire comandi direttamente;
* decidere autonomamente obiettivi dell'agente.

Queste responsabilità appartengono ai sottosistemi.

---

# 13. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione dei contratti dei sottosistemi RumiAI.

```
```
