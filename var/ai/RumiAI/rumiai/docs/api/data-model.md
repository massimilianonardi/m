# RumiAI Data Model Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Questo documento definisce il modello dati principale di RumiAI.

Gli obiettivi sono:

* uniformare le entità del sistema;
* definire relazioni;
* garantire compatibilità futura;
* supportare API e persistenza.

---

# 2. Principi del modello dati

Il modello segue:

* identificatori univoci;
* versionamento;
* validazione schema;
* separazione dati/configurazioni;
* auditabilità.

---

# 3. Entità principali

Le entità fondamentali sono:

```text
User

Agent

Memory

KnowledgeItem

Tool

Workflow

Task

Event

AuditRecord

Configuration
```

---

# 4. Identificatori

Ogni entità possiede:

```json
{
  "id": "unique_identifier",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "version": 1
}
```

---

# 5. User Entity

Rappresenta un utilizzatore del sistema.

Schema:

```json
{
  "id": "user_001",
  "type": "human",
  "name": "User",
  "permissions": []
}
```

Campi:

* id;
* tipo;
* profilo;
* permessi;
* stato.

---

# 6. Agent Entity

Rappresenta un agente RumiAI.

Schema:

```json
{
  "id": "agent_research",
  "name": "Research Agent",
  "purpose": "information retrieval",
  "permissions": [],
  "tools": []
}
```

Campi:

* identificativo;
* nome;
* scopo;
* capacità;
* strumenti;
* policy.

---

# 7. Agent Capability Model

Ogni agente espone capacità dichiarate.

Esempio:

```json
{
  "capabilities": [
    "search",
    "summarize",
    "analyze"
  ]
}
```

---

# 8. Memory Entity

Rappresenta una memoria persistente.

Schema:

```json
{
  "id": "memory_001",
  "owner": "user_001",
  "content": {},
  "classification": "private"
}
```

Campi:

* proprietario;
* contenuto;
* classificazione;
* retention.

---

# 9. Memory Classification

Livelli:

```text
Public

Internal

Private

Restricted
```

---

# 10. Knowledge Item Entity

Rappresenta un elemento della knowledge base.

Schema:

```json
{
  "id": "doc_001",
  "source": "document",
  "content": {},
  "metadata": {}
}
```

Campi:

* origine;
* contenuto;
* metadati;
* embedding;
* permessi.

---

# 11. Knowledge Metadata

Ogni documento può contenere:

```json
{
  "author": "",
  "created": "",
  "tags": [],
  "trust_score": 0
}
```

---

# 12. Tool Entity

Rappresenta uno strumento utilizzabile dagli agenti.

Schema:

```json
{
  "id": "browser",
  "name": "Browser Tool",
  "risk_level": "medium",
  "permissions": []
}
```

---

# 13. Tool Properties

Un tool definisce:

* nome;
* descrizione;
* input;
* output;
* permessi;
* livello rischio.

---

# 14. Workflow Entity

Rappresenta un processo composto da più attività.

Schema:

```json
{
  "id": "workflow_001",
  "status": "running",
  "steps": []
}
```

---

# 15. Workflow Status

Stati:

```text
created

running

paused

completed

failed

cancelled
```

---

# 16. Task Entity

Rappresenta una singola attività.

Schema:

```json
{
  "id": "task_001",
  "workflow": "workflow_001",
  "status": "pending"
}
```

---

# 17. Event Entity

Rappresenta un evento del sistema.

Schema:

```json
{
  "id": "event_001",
  "type": "agent.completed",
  "timestamp": ""
}
```

---

# 18. Event Types

Esempi:

```text
agent.created

agent.executed

memory.updated

tool.executed

workflow.completed
```

---

# 19. Audit Record

Registra azioni importanti.

Schema:

```json
{
  "actor": "",
  "action": "",
  "resource": "",
  "result": ""
}
```

---

# 20. Relationship Model

Relazioni principali:

```text
User

1:N

Agent


User

1:N

Memory


Agent

N:N

Tool


Workflow

1:N

Task
```

---

# 21. Ownership Model

Ogni risorsa deve avere un proprietario.

Esempio:

```text
Memory

owner = user_id
```

---

# 22. Permission Model

Le entità supportano:

```json
{
  "permissions": [
    "read",
    "write",
    "execute"
  ]
}
```

---

# 23. Versioning

Gli oggetti devono supportare evoluzione:

```json
{
  "schema_version": 1
}
```

---

# 24. Serialization

Formato principale:

```text
JSON
```

Supporto futuro:

* YAML;
* MessagePack;
* database nativo.

---

# 25. Validation

Ogni oggetto deve essere validato prima dell'utilizzo.

Controlli:

* campi obbligatori;
* tipi;
* permessi;
* integrità.

---

# 26. Data Lifecycle

Ogni dato segue:

```text
Create

↓

Use

↓

Update

↓

Archive

↓

Delete
```

---

# 27. Privacy Model

I dati devono rispettare:

* ownership;
* consenso;
* retention;
* cancellazione.

---

# 28. Database Mapping

Il modello può essere implementato su:

* database relazionale;
* document database;
* vector database.

---

# 29. Compatibility Rules

Le modifiche devono evitare:

* perdita dati;
* incompatibilità API;
* migrazioni non documentate.

---

# 30. Foundation Data Model

Entità minime:

```text
User

Agent

Memory

KnowledgeItem

Tool

Workflow

Event

AuditRecord
```

---

# 31. Evoluzione futura

Possibili estensioni:

* Knowledge Graph avanzato;
* ontologie;
* modelli semantici;
* versionamento storico completo.

---

# 32. Stato documento

Versione:

0.1

Status:

Modello dati definito.

Prossimo passo:

Definizione della specifica OpenAPI completa.
