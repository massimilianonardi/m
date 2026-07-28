# RumiAI OpenAPI Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Questo documento definisce la specifica OpenAPI delle interfacce pubbliche RumiAI.

Gli obiettivi sono:

* descrivere formalmente le API;
* permettere generazione automatica client;
* garantire compatibilità;
* facilitare integrazioni.

---

# 2. Standard utilizzato

RumiAI utilizza:

```text
OpenAPI Specification 3.x
```

Formato principale:

```text
YAML
```

---

# 3. API Root

Struttura:

```text
/api/{version}/
```

Esempio:

```text
/api/v1/
```

---

# 4. Metadata API

Esempio:

```yaml
info:
  title: RumiAI API
  version: 1.0.0
  description: Artificial Intelligence Operating System API
```

---

# 5. Server Definition

Esempio:

```yaml
servers:

  - url: https://localhost/api/v1
    description: Local instance
```

---

# 6. Authentication Schema

Metodo principale:

```text
Bearer Token
```

Schema:

```yaml
securitySchemes:

  bearerAuth:

    type: http

    scheme: bearer
```

---

# 7. Common Response Format

Tutte le risposte seguono:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

---

# 8. Error Response

Formato standard:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource unavailable"
  }
}
```

---

# 9. Health Endpoint

## GET /health

Descrizione:

Verifica stato sistema.

Response:

```json
{
  "status": "ok",
  "version": "0.1"
}
```

---

# 10. System Endpoint

## GET /system

Restituisce informazioni sistema.

Response:

```json
{
  "name": "RumiAI",
  "environment": "production"
}
```

---

# 11. Agent Endpoints

## GET /agents

Lista agenti disponibili.

Response:

```json
{
  "agents": []
}
```

---

## GET /agents/{agent_id}

Recupera agente.

Parametro:

```text
agent_id
```

---

## POST /agents/{agent_id}/execute

Esegue un'attività.

Request:

```json
{
  "task": "string",
  "context": {}
}
```

Response:

```json
{
  "task_id": "123",
  "status": "running"
}
```

---

# 12. Memory Endpoints

## GET /memory

Recupera memorie autorizzate.

---

## POST /memory

Crea memoria.

Request:

```json
{
  "content": {},
  "classification": "private"
}
```

---

## DELETE /memory/{id}

Cancella memoria.

---

# 13. Knowledge Endpoints

## POST /knowledge/documents

Inserisce documento.

Request:

```json
{
  "content": {},
  "metadata": {}
}
```

---

## GET /knowledge/search

Ricerca semantica.

Request:

```json
{
  "query": "text",
  "limit": 10
}
```

---

# 14. Tool Endpoints

## GET /tools

Lista strumenti disponibili.

---

## POST /tools/{tool_id}/execute

Esecuzione tool.

Request:

```json
{
  "input": {}
}
```

---

# 15. Workflow Endpoints

## POST /workflows

Crea workflow.

Request:

```json
{
  "goal": "string"
}
```

---

## GET /workflows/{id}

Stato workflow.

---

## POST /workflows/{id}/cancel

Annulla workflow.

---

# 16. Event Stream

Endpoint:

```text
/ws/v1/events
```

Utilizzo:

* aggiornamenti tempo reale;
* stato agenti;
* notifiche.

---

# 17. Schema User

```yaml
User:

  id:
    type: string

  type:
    type: string

  permissions:
    type: array
```

---

# 18. Schema Agent

```yaml
Agent:

  id:
    type: string

  name:
    type: string

  capabilities:
    type: array
```

---

# 19. Schema Memory

```yaml
Memory:

  id:
    type: string

  owner:
    type: string

  content:
    type: object
```

---

# 20. Schema Knowledge Item

```yaml
KnowledgeItem:

  id:
    type: string

  metadata:
    type: object
```

---

# 21. Schema Tool

```yaml
Tool:

  id:
    type: string

  risk_level:
    type: string
```

---

# 22. Schema Workflow

```yaml
Workflow:

  id:
    type: string

  status:
    type: string
```

---

# 23. Pagination

Le API che restituiscono liste supportano:

```json
{
  "page": 1,
  "limit": 20,
  "total": 100
}
```

---

# 24. Filtering

Supportato tramite query parameters.

Esempio:

```text
GET /agents?status=active
```

---

# 25. Sorting

Supportato tramite:

```text
sort=
```

Esempio:

```text
GET /events?sort=date
```

---

# 26. Rate Limiting Headers

Le risposte possono includere:

```text
X-RateLimit-Limit

X-RateLimit-Remaining
```

---

# 27. API Versioning Policy

Modifiche incompatibili richiedono nuova versione.

Esempio:

```text
/api/v1

/api/v2
```

---

# 28. Deprecation Policy

Endpoint obsoleti:

* vengono marcati deprecated;
* rimangono disponibili per periodo definito;
* vengono successivamente rimossi.

---

# 29. SDK Generation

La specifica permette generazione futura di:

* Python SDK;
* JavaScript SDK;
* CLI client.

---

# 30. Testing OpenAPI

La specifica deve essere validata tramite:

* schema validation;
* endpoint testing;
* security testing.

---

# 31. Documentazione automatica

Supporto previsto per:

* Swagger UI;
* API reference;
* esempi interattivi.

---

# 32. Foundation API Contract

La prima versione include:

```text
Health

System

Agents

Memory

Knowledge

Tools

Workflow

Events
```

---

# 33. Evoluzione futura

Possibili estensioni:

* GraphQL gateway;
* SDK ufficiali;
* API marketplace;
* integrazioni enterprise.

---

# 34. Stato documento

Versione:

0.1

Status:

Contratto API definito.

Prossimo passo:

Definizione dell'architettura di deployment di RumiAI.
