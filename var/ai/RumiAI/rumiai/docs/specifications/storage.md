# RumiAI Data Storage Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Data Storage Subsystem fornisce a RumiAI un livello astratto per la gestione persistente dei dati.

Il sottosistema gestisce:

* stato degli agenti;
* configurazioni persistenti;
* workflow;
* memoria;
* documenti;
* embeddings;
* metadata;
* risultati delle elaborazioni.

---

# 2. Principio fondamentale

## Storage Abstraction

I componenti RumiAI non devono dipendere direttamente da un database specifico.

Approccio non corretto:

```text
Agent

↓

SQLite API
```

Approccio corretto:

```text
Agent

↓

Storage Interface

↓

Storage Provider

↓

Database
```

---

# 3. Obiettivi

Il sistema deve fornire:

* persistenza uniforme;
* provider intercambiabili;
* gestione transazioni;
* backup;
* migrazione dati;
* isolamento dati;
* supporto dati vettoriali.

---

# 4. Non responsabilità

Il Data Storage Subsystem NON deve:

* decidere cosa memorizzare;
* interpretare contenuti;
* generare embeddings;
* gestire autorizzazioni applicative.

La sicurezza dei dati è responsabilità condivisa con il Security Subsystem.

---

# 5. Architettura interna

Struttura prevista:

```text
storage/

├── contracts/

├── providers/

├── relational/

├── vector/

├── filesystem/

├── migrations/

├── backup/

└── tests/
```

---

# 6. Tipologie di Storage

RumiAI distingue tre categorie principali.

---

# 6.1 Relational Storage

Utilizzato per dati strutturati.

Esempi:

* utenti;
* agenti;
* workflow;
* configurazioni;
* eventi.

Provider iniziale:

```text
SQLite
```

Possibili evoluzioni:

```text
PostgreSQL

MariaDB
```

---

# 6.2 Vector Storage

Utilizzato per ricerca semantica.

Gestisce:

* embeddings;
* similarity search;
* document chunks;
* metadata associati.

Provider futuri:

```text
LanceDB

Chroma

FAISS
```

---

# 6.3 File Storage

Utilizzato per contenuti binari.

Esempi:

* documenti;
* immagini;
* screenshot;
* allegati.

Provider:

```text
Filesystem locale

Object Storage futuro
```

---

# 7. Storage Provider Interface

Ogni provider deve implementare un contratto comune.

Esempio:

```python
class StorageProvider:

    connect()

    disconnect()

    save()

    get()

    delete()

    health()
```

---

# 8. Entity Storage

Le entità principali RumiAI devono avere persistenza.

Esempi:

```text
Agent

Workflow

Task

Memory

Document

Embedding

Event
```

---

# 9. Agent Persistence

Lo stato degli agenti deve poter essere salvato.

Esempio:

```text
Agent State

id

status

context

last_activity

configuration
```

Permette:

* ripresa dopo riavvio;
* analisi storica;
* debugging.

---

# 10. Workflow Persistence

Ogni workflow deve poter essere recuperato.

Memorizzare:

```text
Workflow

id

definition

steps

state

execution_history
```

---

# 11. Memory Storage

La memoria utilizza più livelli.

Architettura:

```text
Memory System

        |

 ---------------------

 |                   |

Short Term       Long Term

 |                   |

SQLite          Vector DB
```

---

# 12. Document Storage

I documenti vengono gestiti separando:

## Contenuto

Esempio:

```text
PDF

TXT

Markdown
```

## Metadata

Esempio:

```json
{
 "filename": "manuale.pdf",
 "source": "filesystem",
 "created": "2026-07-28"
}
```

---

# 13. Vector Storage Model

Un elemento vettoriale contiene:

```text
Vector Record

id

embedding

text

metadata

source
```

Esempio:

```text
Documento

↓

Chunk

↓

Embedding

↓

Vector Database
```

---

# 14. Storage Migration

Il sistema deve supportare migrazioni.

Esempio:

```text
Schema v1

↓

Migration

↓

Schema v2
```

Necessario per:

* evoluzione progetto;
* compatibilità dati.

---

# 15. Backup

Il sistema deve supportare:

* backup manuali;
* backup automatici;
* esportazione dati.

Esempio:

```text
RumiAI Data

↓

Backup Archive

↓

Restore
```

---

# 16. Data Isolation

I dati devono essere separabili.

Possibili livelli:

```text
User

Agent

Workspace

Project
```

---

# 17. Storage Configuration

File:

```text
configs/storage.yaml
```

Esempio:

```yaml
storage:

  relational:

    provider: sqlite

    path: /data/rumiai.db


  vector:

    provider: lancedb

    path: /data/vector
```

---

# 18. Podman Integration

Il modello previsto:

```text
Host

|

Persistent Volumes

|

Containers

|

Storage Providers
```

Esempio:

```text
rumiai-data/

├── sqlite/

├── vectors/

├── documents/

└── backups/
```

---

# 19. Eventi prodotti

Eventi previsti:

```text
StorageConnected

StorageDisconnected

EntityCreated

EntityUpdated

EntityDeleted

MigrationCompleted

BackupCreated
```

---

# 20. Integrazione con altri sottosistemi

## Memory

Utilizza storage relazionale e vettoriale.

---

## Knowledge

Utilizza:

* document storage;
* vector storage.

---

## Agent Runtime

Persiste:

* stato;
* configurazione;
* cronologia.

---

## Observability

Registra:

* accessi;
* errori;
* performance.

---

# 21. Implementazione Foundation

La prima versione prevista:

```text
SQLite

+

Filesystem locale

+

Interfaccia Vector Storage preparata
```

Il supporto LanceDB viene mantenuto come provider futuro senza modificare il Core.

---

# 22. Test richiesti

## Unit Test

Testare:

* provider interface;
* CRUD;
* serializzazione.

---

## Integration Test

Verificare:

* persistenza agenti;
* recupero workflow;
* storage documenti.

---

## Migration Test

Verificare:

* aggiornamento schema;
* compatibilità dati.

---

## Scenario Test

Esempio:

Un agente viene arrestato durante un workflow.

Al riavvio:

```text
Caricamento stato

↓

Ripristino workflow

↓

Ripresa esecuzione
```

---

# 23. Evoluzione futura

Possibili estensioni:

* LanceDB come vector store principale;
* storage distribuito;
* replica dati;
* cifratura database;
* backup remoto;
* data lineage.

---

# 24. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Knowledge Pipeline Subsystem.
