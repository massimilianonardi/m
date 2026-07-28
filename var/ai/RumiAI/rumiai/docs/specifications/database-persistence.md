# RumiAI Database & Persistence Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Database & Persistence Subsystem definisce la strategia di archiviazione persistente di RumiAI.

Il sottosistema gestisce:

* database relazionali;
* storage vettoriale;
* storage documentale;
* persistenza memoria;
* migrazioni;
* backup;
* integrità dati.

---

# 2. Principio fondamentale

## Polyglot Persistence

RumiAI utilizza sistemi di persistenza specializzati.

Modello non corretto:

```text
Tutti i dati

↓

Un unico database
```

Modello RumiAI:

```text
Tipo di dato

↓

Storage appropriato
```

---

# 3. Obiettivi

Il sistema deve garantire:

* affidabilità;
* scalabilità;
* semplicità manutenzione;
* portabilità;
* possibilità di evoluzione.

---

# 4. Storage Strategy

Architettura:

```text
Persistence Layer

|

├── Relational Store

├── Vector Store

├── Graph Store

├── Object Storage

└── Cache Layer
```

---

# 5. Relational Database

Utilizzato per dati strutturati.

Responsabilità:

* utenti;
* configurazioni;
* metadata;
* stato workflow;
* autorizzazioni.

---

# 6. Database Foundation

Prima implementazione:

```text
SQLite
```

Motivazioni:

* locale;
* zero configurazione;
* portabile;
* adatto alla Foundation Release.

---

# 7. Evoluzione Enterprise

Possibile migrazione:

```text
SQLite

↓

PostgreSQL
```

senza modificare i livelli superiori.

---

# 8. Schema Principale

Esempio:

```text
users

id

name

created_at
```

---

```text
sessions

id

user_id

started_at

ended_at
```

---

```text
documents

id

owner

source

created_at

version
```

---

```text
tasks

id

agent

status

created_at
```

---

# 9. ORM Layer

L'accesso ai dati deve passare da un livello astratto.

Esempio:

```text
Application

↓

Repository Layer

↓

ORM

↓

Database
```

Vantaggi:

* indipendenza database;
* testabilità;
* migrazioni.

---

# 10. Migration System

Gli schemi devono evolvere tramite migrazioni.

Esempio:

```text
Version 1

↓

Migration

↓

Version 2
```

Mai modificare direttamente database in produzione.

---

# 11. Vector Database

Il Vector Store gestisce:

* embedding;
* ricerca semantica;
* RAG.

---

# 12. LanceDB Integration

LanceDB è il candidato principale.

Architettura:

```text
Document

↓

Chunk

↓

Embedding

↓

LanceDB Table

↓

Similarity Search
```

---

# 13. Vector Data Model

Ogni embedding mantiene:

```text
VectorRecord

id

vector

text_reference

metadata

source

created_at
```

---

# 14. Embedding Lifecycle

Flusso:

```text
Document Added

↓

Chunking

↓

Embedding Generation

↓

Vector Storage

↓

Index Update
```

---

# 15. Vector Metadata

Ogni vettore deve mantenere:

* origine;
* documento;
* versione;
* timestamp;
* permessi.

---

# 16. Graph Persistence

Il Knowledge Graph necessita di persistenza separata.

Gestisce:

* entità;
* relazioni;
* ontologie.

---

# 17. Graph Storage Evolution

Foundation:

```text
Relational Graph Model
```

Evoluzione:

```text
Dedicated Graph Database
```

---

# 18. Document Storage

I documenti originali non devono essere memorizzati nel database.

Strategia:

```text
Filesystem/Object Storage

+

Metadata Database
```

---

# 19. File Organization

Esempio:

```text
data/

├── documents/

├── uploads/

├── media/

└── exports/
```

---

# 20. Memory Persistence

La memoria utilizza più livelli.

Schema:

```text
Conversation

↓

Short Term Memory

↓

Long Term Memory

↓

Knowledge Layer
```

---

# 21. Cache Layer

La cache contiene dati temporanei.

Esempi:

* risposte recenti;
* risultati retrieval;
* session state.

La cache può essere eliminata senza perdita dati.

---

# 22. Transaction Management

Le operazioni critiche devono essere atomiche.

Esempio:

```text
Document Import

↓

Metadata Save

↓

Vector Insert

↓

Graph Update
```

---

# 23. Consistency Model

RumiAI utilizza consistenza controllata.

Esempio:

```text
Primary Data

↓

Derived Data

↓

Indexes
```

Gli indici possono essere rigenerati.

---

# 24. Backup Strategy

Backup separati:

```text
Database Backup

+

Vector Backup

+

Documents Backup

+

Configuration Backup
```

---

# 25. Restore Strategy

Ripristino:

```text
Backup Archive

↓

Database Restore

↓

Vector Restore

↓

Integrity Check

↓

System Start
```

---

# 26. Encryption

Devono essere protetti:

* database;
* backup;
* documenti sensibili.

---

# 27. Access Control

Ogni storage deve rispettare:

* identity;
* permission;
* privacy policy.

---

# 28. Performance Optimization

Tecniche:

* indexing;
* caching;
* batching;
* lazy loading.

---

# 29. Data Cleanup

Processi automatici:

* rimozione cache;
* archiviazione;
* compattazione database.

---

# 30. Configuration

File:

```text
config/storage.yaml
```

Esempio:

```yaml
database:

  engine: sqlite


vector_store:

  engine: lancedb


backup:

  enabled: true
```

---

# 31. API Integration

Endpoint previsti:

```text
GET /storage/status

POST /storage/backup

POST /storage/restore

GET /database/schema
```

---

# 32. Implementazione Foundation

Prima versione:

```text
SQLite

+

Repository Layer

+

LanceDB Adapter

+

Filesystem Storage

+

Migration System
```

---

# 33. Test richiesti

## Persistence Test

Verificare:

* scrittura;
* lettura;
* aggiornamento.

---

## Migration Test

Verificare:

* upgrade schema;
* rollback.

---

## Recovery Test

Verificare:

* backup;
* ripristino completo.

---

# 34. Scenario operativo

Importazione documento:

```text
User Upload

↓

Filesystem Storage

↓

Metadata DB

↓

Embedding

↓

LanceDB

↓

Knowledge Graph
```

---

# 35. Evoluzione futura

Possibili estensioni:

* PostgreSQL cluster;
* distributed vector storage;
* database federati;
* automatic storage optimization;
* encrypted user vault.

---

# 36. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Search & Retrieval Engine Subsystem.
