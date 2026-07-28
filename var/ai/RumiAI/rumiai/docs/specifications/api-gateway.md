# RumiAI API Gateway & External Integration Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

L'API Gateway Subsystem fornisce un'interfaccia standardizzata per permettere a sistemi esterni di comunicare con RumiAI.

Il sottosistema gestisce:

* API HTTP;
* autenticazione;
* autorizzazione;
* routing richieste;
* compatibilità protocolli;
* integrazioni esterne.

---

# 2. Principio fondamentale

## Controlled External Access

Le componenti esterne non devono accedere direttamente ai servizi interni.

Modello non corretto:

```text
External Client

↓

Agent Runtime
```

Modello corretto:

```text
External Client

↓

API Gateway

↓

Internal Services
```

---

# 3. Obiettivi

Il sistema deve fornire:

* API uniformi;
* sicurezza;
* isolamento;
* logging;
* gestione errori;
* compatibilità futura.

---

# 4. Non responsabilità

L'API Gateway NON deve:

* eseguire ragionamento;
* gestire memoria;
* eseguire tool direttamente;
* sostituire il Security Subsystem.

---

# 5. Architettura interna

Struttura prevista:

```text
api_gateway/

├── routes/

├── middleware/

├── authentication/

├── authorization/

├── schemas/

├── adapters/

├── rate_limit/

└── tests/
```

---

# 6. Protocolli supportati

Foundation Release:

```text
HTTP REST API
```

Possibili evoluzioni:

```text
WebSocket

gRPC

Message Queue
```

---

# 7. API Design

Le API devono essere orientate alle capacità RumiAI.

Categorie:

```text
/session

/agent

/workflow

/knowledge

/tool

/system
```

---

# 8. Session API

Gestisce conversazioni.

Esempio:

```text
POST /sessions
```

Crea una nuova sessione.

---

```text
GET /sessions/{id}
```

Recupera stato sessione.

---

```text
POST /sessions/{id}/messages
```

Invia un messaggio.

---

# 9. Agent API

Permette interazione con agenti.

Esempi:

```text
GET /agents
```

Lista agenti disponibili.

---

```text
POST /agents/{id}/execute
```

Avvia un task.

---

```text
GET /agents/{id}/status
```

Recupera stato agente.

---

# 10. Workflow API

Permette gestione workflow.

Esempi:

```text
POST /workflows
```

Crea workflow.

---

```text
GET /workflows/{id}
```

Stato workflow.

---

```text
POST /workflows/{id}/cancel
```

Interrompe workflow.

---

# 11. Knowledge API

Espone funzionalità RAG.

Esempi:

```text
POST /knowledge/documents
```

Caricamento documento.

---

```text
POST /knowledge/search
```

Ricerca semantica.

---

# 12. Tool API

L'accesso ai tool deve essere controllato.

Esempio:

```text
POST /tools/request
```

Richiede esecuzione tool.

Flusso:

```text
API

↓

Security

↓

Tool Manager

↓

Execution
```

---

# 13. OpenAI Compatible API

RumiAI deve prevedere compatibilità con client esistenti.

Interfaccia prevista:

```text
/v1/chat/completions
```

Obiettivo:

permettere utilizzo con:

* librerie compatibili OpenAI;
* strumenti locali;
* applicazioni esistenti.

---

# 14. Request Model

Ogni richiesta deve contenere:

```json
{
 "request_id": "uuid",
 "timestamp": "",
 "client": "",
 "payload": {}
}
```

---

# 15. Response Model

Formato comune:

```json
{
 "request_id": "uuid",
 "status": "success",
 "data": {}
}
```

---

# 16. Middleware Layer

Ogni richiesta passa attraverso middleware.

Ordine previsto:

```text
Request

↓

Logging

↓

Authentication

↓

Authorization

↓

Validation

↓

Routing

↓

Response
```

---

# 17. Authentication

Metodi previsti:

Foundation:

```text
Local Token
```

Future:

```text
OAuth2

OIDC

Certificate Authentication
```

---

# 18. Authorization

Ogni richiesta viene valutata.

Esempio:

```text
User

↓

Role

↓

Permissions

↓

Allowed Operations
```

---

# 19. Rate Limiting

Protezione da uso eccessivo.

Parametri:

* richieste/minuto;
* dimensione payload;
* timeout.

---

# 20. Error Handling

Gli errori devono avere formato uniforme.

Esempio:

```json
{
 "error": {
   "code": "AGENT_TIMEOUT",
   "message": "Execution timeout"
 }
}
```

---

# 21. Streaming API

Per risposte lunghe deve essere supportato streaming.

Esempio:

```text
Request

↓

Partial Responses

↓

Final Response
```

Utilizzo:

* chat;
* generazione codice;
* workflow lunghi.

---

# 22. Event Bus Integration

Ogni richiesta genera eventi.

Esempio:

```text
API Request Received

↓

Event Bus

↓

Agent Execution

↓

Response Generated
```

---

# 23. Observability Integration

Devono essere registrati:

* endpoint;
* durata;
* errori;
* client;
* correlation ID.

---

# 24. Configuration

File:

```text
configs/api_gateway.yaml
```

Esempio:

```yaml
api:

  host: 0.0.0.0

  port: 8000


  authentication:

    enabled: true


  streaming:

    enabled: true
```

---

# 25. Podman Integration

Il Gateway può essere eseguito:

```text
rumiai-core container

|

API Gateway Service
```

oppure separato:

```text
api-gateway container

|

rumiai-core container
```

La seconda opzione è preferibile per scalabilità futura.

---

# 26. Implementazione Foundation

Prima versione:

```text
FastAPI

+

Pydantic Models

+

Token Authentication

+

OpenAI Compatible Endpoint
```

---

# 27. Test richiesti

## Unit Test

Testare:

* routing;
* validazione;
* autenticazione;
* error handling.

---

## Integration Test

Verificare:

```text
Client

↓

API Gateway

↓

Agent

↓

LLM

↓

Response
```

---

## Security Test

Verificare:

* token invalidi;
* accessi non autorizzati;
* payload malevoli.

---

# 28. Scenario Test

Esempio:

Un'applicazione esterna invia:

```text
POST /v1/chat/completions
```

RumiAI deve:

1. autenticare client;
2. creare sessione;
3. inviare richiesta agente;
4. produrre risposta;
5. registrare eventi.

---

# 29. Evoluzione futura

Possibili estensioni:

* API GraphQL;
* federazione agenti;
* API marketplace;
* accesso remoto sicuro;
* multi-user deployment.

---

# 30. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Scheduler & Automation Subsystem.
