# RumiAI User Interface & Interaction Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Lo User Interface & Interaction Subsystem definisce i meccanismi attraverso cui utenti e sistemi esterni interagiscono con RumiAI.

Il sottosistema gestisce:

* conversazioni;
* sessioni;
* richieste utente;
* visualizzazione risultati;
* API;
* comandi amministrativi.

---

# 2. Principio fondamentale

## Interface Separation

L'interfaccia deve essere separata dalla logica interna.

Modello:

```text
User Interface

↓

Interaction Layer

↓

RumiAI Core
```

La UI non deve:

* contenere logica agente;
* accedere direttamente ai database;
* bypassare sicurezza;
* eseguire tool direttamente.

---

# 3. Obiettivi

Il sistema deve fornire:

* esperienza conversazionale;
* gestione sessioni;
* accesso agenti;
* streaming risultati;
* integrazione API;
* supporto strumenti amministrativi.

---

# 4. Non responsabilità

Lo User Interface Subsystem NON deve:

* decidere quale agente usare;
* generare risposte autonomamente;
* gestire memoria;
* eseguire operazioni privilegiate.

---

# 5. Architettura interna

Struttura prevista:

```text
interface/

├── web/

├── api/

├── cli/

├── sessions/

├── messages/

├── streaming/

└── tests/
```

---

# 6. Modalità di interazione

RumiAI supporta inizialmente:

## Conversational UI

Interazione tramite chat.

Implementazione iniziale:

```text
Open-WebUI
```

---

## API Interface

Permette integrazioni esterne.

Esempi:

* applicazioni;
* automazioni;
* altri agenti.

---

## CLI Interface

Interfaccia amministrativa locale.

Esempi:

```text
rumiai status

rumiai agents

rumiai logs
```

---

# 7. Session Management

Ogni conversazione deve essere rappresentata da una sessione.

Modello:

```text
Session

id

user

created_at

agent

context

status
```

---

# 8. Conversation Model

Una conversazione contiene messaggi ordinati.

Esempio:

```text
Conversation

|

├── User Message

├── Agent Message

├── Tool Result

└── System Event
```

---

# 9. Message Model

Ogni messaggio deve avere:

```text
Message

id

role

content

timestamp

metadata
```

Ruoli previsti:

```text
user

assistant

system

tool
```

---

# 10. Streaming Response

RumiAI deve supportare risposte progressive.

Esempio:

```text
User Request

↓

Agent Processing

↓

Token Stream

↓

Final Response
```

Utile per:

* modelli locali;
* risposte lunghe;
* workflow complessi.

---

# 11. Interaction Gateway

Tra UI e Core è presente un livello intermedio.

Schema:

```text
UI

↓

Interaction Gateway

↓

Agent Runtime
```

Responsabilità:

* validazione richieste;
* creazione sessione;
* routing;
* autorizzazione.

---

# 12. API Design

L'API deve esporre funzionalità controllate.

Esempi:

```text
POST /sessions

GET /sessions/{id}

POST /messages

GET /agents

GET /status
```

---

# 13. Open-WebUI Integration

Open-WebUI viene considerato un frontend.

Architettura:

```text
Open-WebUI

↓

Ollama Compatible API

↓

RumiAI Gateway

↓

Agent Runtime
```

L'obiettivo è mantenere compatibilità con strumenti esistenti.

---

# 14. Authentication

Il sistema deve supportare autenticazione.

Possibili modalità:

* locale;
* token;
* account multipli.

---

# 15. Authorization

Gli utenti possono avere permessi differenti.

Esempio:

```text
User

↓

Capabilities

↓

Allowed Actions
```

---

# 16. Command Interface

La CLI deve permettere amministrazione.

Comandi previsti:

```text
rumiai start

rumiai stop

rumiai status

rumiai agents

rumiai plugins

rumiai backup
```

---

# 17. Agent Selection

La selezione agente può avvenire tramite:

* configurazione;
* routing automatico;
* scelta utente.

Esempio:

```text
User

↓

Request

↓

Agent Router

↓

Specialized Agent
```

---

# 18. Tool Interaction Display

Quando un agente usa strumenti, l'interfaccia deve poter mostrare:

* tool utilizzato;
* stato;
* risultato;
* eventuali richieste approvazione.

Esempio:

```text
Agent

↓

Using browser tool

↓

Waiting approval

↓

Completed
```

---

# 19. Human Approval Flow

Operazioni sensibili possono richiedere conferma.

Esempio:

```text
Agent Request

↓

Approval Required

↓

User Decision

↓

Execution
```

---

# 20. Integration con Observability

L'interazione utente deve produrre eventi:

```text
SessionCreated

MessageReceived

ResponseGenerated

UserApprovalGiven
```

---

# 21. Integration con Memory

La UI non gestisce direttamente memoria.

Flusso:

```text
Conversation

↓

Agent Runtime

↓

Memory System
```

---

# 22. Configuration

File:

```text
configs/interface.yaml
```

Esempio:

```yaml
interface:

  default_frontend: open-webui


  streaming:

    enabled: true


  sessions:

    persistence: true
```

---

# 23. Privacy

Il sistema deve permettere:

* cancellazione sessioni;
* esportazione dati;
* controllo storico;
* gestione retention.

---

# 24. Implementazione Foundation

Prima versione:

```text
Open-WebUI

+

API Gateway

+

Session Manager

+

CLI amministrativa
```

---

# 25. Test richiesti

## Unit Test

Testare:

* session management;
* message handling;
* API validation.

---

## Integration Test

Verificare:

```text
Open-WebUI

↓

RumiAI

↓

Ollama

↓

Response
```

---

## Scenario Test

Esempio:

```text
Utente apre una chat.

↓

Invia richiesta.

↓

Agente elabora.

↓

Risposta restituita.

↓

Sessione salvata.
```

---

# 26. Evoluzione futura

Possibili estensioni:

* applicazione desktop;
* mobile client;
* voice interface;
* multimodal UI;
* gestione team;
* collaborazione uomo-agente.

---

# 27. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del API Gateway & External Integration Subsystem.
