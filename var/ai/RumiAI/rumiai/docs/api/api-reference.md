# RumiAI API Reference Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Questo documento definisce le API ufficiali di RumiAI.

Gli obiettivi sono:

* fornire accesso controllato alle funzionalità;
* permettere integrazioni esterne;
* mantenere compatibilità nel tempo.

---

# 2. Principi API

Le API RumiAI seguono:

* REST standard;
* JSON come formato principale;
* autenticazione obbligatoria;
* versionamento esplicito;
* error handling uniforme.

---

# 3. Versionamento API

Tutte le API pubbliche includono una versione.

Formato:

```text
/api/v1/
```

Esempio:

```text
/api/v1/agents
```

---

# 4. API Gateway

Tutte le richieste passano attraverso:

```text
Client

↓

API Gateway

↓

Authentication

↓

Authorization

↓

Service
```

Responsabilità:

* routing;
* sicurezza;
* rate limiting;
* logging.

---

# 5. Autenticazione

Metodi supportati:

```text
API Token

OAuth2

Session Token

Service Credential
```

---

# 6. Authorization

Ogni richiesta viene verificata.

Modello:

```text
Identity

+

Permission

+

Resource

+

Action

=

Decision
```

---

# 7. Base URL

Formato:

```text
https://host/api/v1/
```

La configurazione reale dipende dall'ambiente.

---

# 8. Health API

## GET /health

Verifica stato sistema.

Risposta:

```json
{
  "status": "ok",
  "version": "0.1"
}
```

---

# 9. System Information API

## GET /system

Restituisce informazioni generali.

Esempio:

```json
{
  "name": "RumiAI",
  "status": "running"
}
```

---

# 10. Agent API

Gestione agenti.

Endpoint:

```text
GET    /agents

GET    /agents/{id}

POST   /agents/{id}/execute

GET    /agents/{id}/status
```

---

# 11. Agent Execution Request

Esempio:

```json
{
  "task": "analizza documento",
  "context": {}
}
```

---

# 12. Agent Execution Response

Esempio:

```json
{
  "task_id": "12345",
  "status": "completed",
  "result": {}
}
```

---

# 13. Memory API

Gestione memoria.

Endpoint:

```text
GET    /memory

POST   /memory

DELETE /memory/{id}
```

---

# 14. Memory Object

Formato:

```json
{
  "id": "memory01",
  "content": "...",
  "owner": "user"
}
```

---

# 15. Knowledge API

Gestione conoscenza.

Endpoint:

```text
POST /knowledge/documents

GET  /knowledge/search

GET  /knowledge/documents/{id}
```

---

# 16. Document Upload

Richiesta:

```text
POST /knowledge/documents
```

Contiene:

* documento;
* metadati;
* permessi.

---

# 17. Search API

Esempio:

```json
{
  "query": "informazioni progetto",
  "limit": 5
}
```

Risposta:

```json
{
  "results": []
}
```

---

# 18. Tool API

Gestione strumenti.

Endpoint:

```text
GET /tools

GET /tools/{id}

POST /tools/{id}/execute
```

---

# 19. Tool Execution

Ogni esecuzione richiede:

```text
Tool

+

Input

+

Permission

+

Risk Check
```

---

# 20. Workflow API

Gestione processi complessi.

Endpoint:

```text
POST /workflows

GET  /workflows/{id}

POST /workflows/{id}/cancel
```

---

# 21. Event API

Accesso agli eventi.

Endpoint:

```text
GET /events
```

Eventi esempio:

```text
agent.completed

memory.updated

tool.executed
```

---

# 22. WebSocket API

Per comunicazioni in tempo reale:

```text
/ws/v1/
```

Utilizzo:

* streaming risposta;
* stato agenti;
* notifiche.

---

# 23. Streaming Response

Esempio:

```text
request

↓

token stream

↓

completion event
```

---

# 24. Error Model

Tutti gli errori seguono formato comune:

```json
{
  "error": {
    "code": "AUTH_FAILED",
    "message": "Access denied"
  }
}
```

---

# 25. Error Codes

Categorie:

```text
AUTH_*

PERMISSION_*

VALIDATION_*

RESOURCE_*

SYSTEM_*
```

---

# 26. Rate Limiting

Le API supportano:

* limiti richieste;
* quote utenti;
* protezione abuso.

---

# 27. Audit API

Accesso agli eventi di audit:

```text
GET /audit
```

Permesso solo ad utenti autorizzati.

---

# 28. API Security Rules

Le API devono:

* validare input;
* controllare permessi;
* registrare eventi;
* proteggere dati sensibili.

---

# 29. API Documentation

La documentazione deve essere generata tramite:

* OpenAPI;
* esempi;
* schema JSON.

---

# 30. Compatibility Policy

Modifiche compatibili:

* aggiunta campi;
* nuovi endpoint.

Breaking changes:

* nuova versione API.

---

# 31. Internal API

I servizi interni possono utilizzare interfacce dedicate.

Non devono essere esposte pubblicamente.

---

# 32. Testing API

Ogni endpoint richiede:

* test funzionale;
* test sicurezza;
* test errori;
* test carico.

---

# 33. Foundation API Set

Prima versione:

```text
Health

System

Agents

Memory

Knowledge

Tools

Workflows

Events
```

---

# 34. Evoluzione futura

Possibili estensioni:

* GraphQL;
* SDK ufficiali;
* API marketplace;
* integrazione applicazioni terze.

---

# 35. Stato documento

Versione:

0.1

Status:

API pubbliche definite.

Prossimo passo:

Definizione del modello dati e degli schemi JSON di RumiAI.
