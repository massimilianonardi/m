# RumiAI Data Architecture Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Data Architecture Subsystem definisce l'architettura generale dei dati utilizzati da RumiAI.

Il sottosistema stabilisce:

* categorie dati;
* flussi informativi;
* modelli di persistenza;
* metadata;
* lifecycle;
* ownership.

---

# 2. Principio fondamentale

## Data-Centric Architecture

RumiAI deve trattare i dati come risorse governate.

Modello tradizionale:

```text
Application

↓

Database
```

Modello RumiAI:

```text
Data

↓

Governance

↓

Processing

↓

Application
```

---

# 3. Obiettivi

Il sistema deve garantire:

* tracciabilità;
* separazione;
* sicurezza;
* evoluzione;
* interoperabilità.

---

# 4. Categorie principali dei dati

RumiAI divide i dati in quattro categorie principali:

```text
1. User Data

2. Knowledge Data

3. System Data

4. Operational Data
```

---

# 5. User Data

Comprende informazioni appartenenti all'utente.

Esempi:

* conversazioni;
* preferenze;
* memoria personale;
* documenti privati;
* obiettivi personali.

Proprietà:

```text
Owner:

User
```

---

# 6. Knowledge Data

Comprende conoscenza utilizzata dal sistema.

Esempi:

* documentazione;
* fonti;
* embedding;
* entità;
* relazioni semantiche.

Proprietà:

```text
Owner:

Knowledge System
```

---

# 7. System Data

Comprende dati necessari al funzionamento.

Esempi:

* configurazioni;
* stato componenti;
* registry;
* cache tecnica.

Proprietà:

```text
Owner:

System
```

---

# 8. Operational Data

Comprende dati generati durante l'esecuzione.

Esempi:

* log;
* metriche;
* eventi;
* statistiche utilizzo.

---

# 9. Data Flow Architecture

Flusso generale:

```text
Source

↓

Ingestion

↓

Processing

↓

Storage

↓

Indexing

↓

Consumption
```

---

# 10. Data Object Model

Ogni oggetto dati deve avere metadata comuni.

Modello:

```text
DataObject

id

type

owner

source

created_at

updated_at

classification

version

policy
```

---

# 11. Data Provenance

Ogni informazione deve mantenere origine.

Esempio:

```text
Answer

↓

Knowledge Fragment

↓

Document

↓

Original Source
```

---

# 12. Metadata Layer

I metadata descrivono il dato.

Categorie:

```text
Technical Metadata

Business Metadata

Security Metadata

Semantic Metadata
```

---

# 13. Versioning

I dati importanti devono essere versionabili.

Esempio:

```text
Document v1

↓

Document v2

↓

Document v3
```

Il sistema mantiene:

* storico;
* autore modifica;
* timestamp.

---

# 14. Lifecycle Management

Ogni dato segue un ciclo:

```text
Creation

↓

Processing

↓

Usage

↓

Archive

↓

Deletion
```

---

# 15. Data Ownership

Ogni dato deve avere responsabilità chiara.

Esempio:

```text
Conversation

Owner:

User


Model Cache

Owner:

System
```

---

# 16. Data Access Model

L'accesso è controllato da:

* identità;
* permessi;
* policy.

Schema:

```text
Request

↓

Identity

↓

Authorization

↓

Data Access
```

---

# 17. Storage Architecture

RumiAI utilizza storage specializzati.

Schema:

```text
Data Layer

|

├── Relational Storage

├── Vector Storage

├── Graph Storage

├── File Storage

└── Cache
```

---

# 18. Relational Storage

Utilizzato per:

* configurazioni;
* utenti;
* metadata;
* stato sistema.

Possibili tecnologie:

* SQLite;
* PostgreSQL.

---

# 19. Vector Storage

Utilizzato per:

* embedding;
* semantic retrieval;
* RAG.

Preparato per:

* LanceDB;
* database vettoriali compatibili.

---

# 20. Graph Storage

Utilizzato per:

* entità;
* relazioni;
* conoscenza semantica.

---

# 21. File Storage

Utilizzato per:

* documenti;
* allegati;
* media;
* backup.

---

# 22. Cache Layer

Utilizzato per:

* risultati temporanei;
* embedding recenti;
* risposte frequenti.

La cache non deve contenere dati critici senza policy.

---

# 23. Data Synchronization

Il sistema deve gestire sincronizzazione tra componenti.

Esempio:

```text
Document Added

↓

Embedding Created

↓

Graph Updated

↓

Knowledge Indexed
```

---

# 24. Event Driven Data Updates

Gli aggiornamenti possono propagarsi tramite Event Bus.

Esempio:

```text
DocumentChanged

↓

Knowledge Pipeline

↓

Index Update
```

---

# 25. Data Validation

Ogni ingresso dati deve essere verificato.

Controlli:

* formato;
* integrità;
* origine;
* permessi.

---

# 26. Data Transformation

Le trasformazioni devono essere tracciabili.

Esempio:

```text
Raw Document

↓

Parsed Document

↓

Chunks

↓

Embeddings
```

---

# 27. Backup Strategy

Il backup deve rispettare categorie dati.

Esempio:

```text
User Data

↓

Encrypted Backup


System Data

↓

Configuration Backup
```

---

# 28. Data Export

L'utente deve poter esportare i propri dati.

Formati possibili:

* JSON;
* Markdown;
* CSV;
* archivi strutturati.

---

# 29. Data Deletion

La cancellazione deve propagarsi.

Esempio:

```text
Delete User Memory

↓

Remove Index

↓

Remove Graph Links

↓

Audit Event
```

---

# 30. Integration con LanceDB

L'architettura prepara l'integrazione futura.

Possibile struttura:

```text
Knowledge Data

↓

Embedding Pipeline

↓

LanceDB Tables

↓

Semantic Retrieval
```

---

# 31. Configuration

File:

```text
config/data-architecture.yaml
```

Esempio:

```yaml
data:

  user_isolation: true

  versioning: true

  provenance: true

  vector_store: lancedb
```

---

# 32. API Integration

Endpoint previsti:

```text
GET /data/object/{id}

GET /data/provenance/{id}

POST /data/export

DELETE /data/object/{id}
```

---

# 33. Implementazione Foundation

Prima versione:

```text
Metadata Layer

+

Storage Abstraction

+

Lifecycle Manager

+

Data Classification

+

Backup Integration
```

---

# 34. Test richiesti

## Data Integrity Test

Verificare:

* consistenza;
* versioning;
* recuperabilità.

---

## Privacy Test

Verificare:

* isolamento dati;
* cancellazione;
* controllo accessi.

---

## Migration Test

Verificare:

* evoluzione schema;
* compatibilità versioni.

---

# 35. Scenario operativo

Inserimento documento:

```text
User Upload

↓

Document Storage

↓

Metadata Creation

↓

Chunking

↓

Embedding

↓

Vector Storage

↓

Knowledge Graph Update
```

---

# 36. Evoluzione futura

Possibili estensioni:

* data lake locale;
* federated knowledge;
* distributed storage;
* automatic data governance;
* intelligent data lifecycle.

---

# 37. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Database & Persistence Subsystem.
