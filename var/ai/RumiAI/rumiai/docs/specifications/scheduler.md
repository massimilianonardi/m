# RumiAI Scheduler & Automation Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Lo Scheduler & Automation Subsystem gestisce l'esecuzione automatica di attività all'interno di RumiAI.

Il sottosistema permette di definire:

* task pianificati;
* job periodici;
* trigger basati su eventi;
* esecuzioni background;
* automazioni agentiche.

---

# 2. Principio fondamentale

## Event Driven Automation

Le attività automatiche devono essere attivate da eventi o pianificazioni definite.

Modello:

```text
Trigger

↓

Scheduler

↓

Task Definition

↓

Agent Runtime

↓

Execution
```

---

# 3. Obiettivi

Il sistema deve fornire:

* scheduling temporale;
* gestione job;
* esecuzione asincrona;
* retry;
* gestione errori;
* storico esecuzioni.

---

# 4. Non responsabilità

Lo Scheduler NON deve:

* decidere obiettivi degli agenti;
* generare contenuti;
* sostituire Workflow Engine;
* bypassare Security Layer.

---

# 5. Architettura interna

Struttura prevista:

```text
scheduler/

├── engine/

├── jobs/

├── triggers/

├── queue/

├── executor/

├── policies/

├── history/

└── tests/
```

---

# 6. Tipologie di Trigger

RumiAI supporta diversi tipi di attivazione.

---

## 6.1 Time Trigger

Attivazione basata sul tempo.

Esempi:

```text
Ogni ora

Ogni giorno

Ogni settimana
```

---

## 6.2 Event Trigger

Attivazione causata da eventi interni.

Esempio:

```text
DocumentImported

↓

Aggiorna Knowledge Base
```

---

## 6.3 Condition Trigger

Attivazione basata su condizioni.

Esempio:

```text
Se spazio disco < 10%

↓

Esegui manutenzione
```

---

# 7. Job Model

Ogni attività automatica è rappresentata da un Job.

Modello:

```text
Job

id

name

description

trigger

action

status

created_at

last_execution

next_execution
```

---

# 8. Task Model

Un Task rappresenta il lavoro da eseguire.

Esempio:

```text
Task

id

agent

input

parameters

priority

timeout
```

---

# 9. Scheduler Engine

Il motore principale gestisce:

* rilevamento trigger;
* creazione task;
* inserimento coda;
* monitoraggio esecuzione.

Schema:

```text
Scheduler Engine

        |

        v

Task Queue

        |

        v

Executor
```

---

# 10. Task Queue

Le attività devono essere gestite tramite una coda.

Funzioni:

* ordinamento priorità;
* retry;
* controllo stato;
* cancellazione.

Stati:

```text
pending

running

completed

failed

cancelled
```

---

# 11. Executor

L'Executor esegue il task.

Flusso:

```text
Task

↓

Executor

↓

Agent Runtime

↓

Result

↓

History
```

---

# 12. Agent Integration

Lo Scheduler non esegue direttamente ragionamento.

Esempio:

```text
Scheduler

↓

"Controlla nuovi documenti"

↓

Agent Runtime

↓

Knowledge Agent
```

---

# 13. Workflow Integration

Task complessi possono avviare workflow.

Esempio:

```text
Scheduler

↓

Workflow Start

↓

Multiple Agents

↓

Final Result
```

---

# 14. Retry Policy

Ogni job può definire strategie di recupero.

Esempio:

```yaml
retry:

  enabled: true

  max_attempts: 3

  delay: 60
```

---

# 15. Timeout Management

Ogni esecuzione deve avere limiti.

Esempio:

```text
Task Start

↓

Timeout Timer

↓

Success

oppure

Abort
```

---

# 16. Job Persistence

Lo stato dei job deve essere persistente.

Memorizzare:

* definizione;
* cronologia;
* errori;
* risultati.

Storage previsto:

```text
SQLite

+

Storage Abstraction Layer
```

---

# 17. Scheduler Configuration

File:

```text
configs/scheduler.yaml
```

Esempio:

```yaml
scheduler:

  enabled: true


  workers:

    count: 2


  default_timeout:

    seconds: 300
```

---

# 18. Esempi di Automazioni

## Knowledge Update Agent

```text
Ogni notte

↓

Scansiona documenti

↓

Aggiorna indice RAG
```

---

## System Monitor Agent

```text
Ogni ora

↓

Controlla sistema

↓

Genera report
```

---

## Personal Assistant Agent

```text
Ogni mattina

↓

Prepara riepilogo attività
```

---

# 19. Security Integration

Ogni job deve rispettare:

* permessi agente;
* autorizzazioni tool;
* policy operative.

Flusso:

```text
Job

↓

Security Check

↓

Execution
```

---

# 20. Observability Integration

Devono essere registrati:

* job creati;
* esecuzioni;
* durata;
* errori;
* retry.

Eventi:

```text
JobCreated

JobStarted

JobCompleted

JobFailed

JobCancelled
```

---

# 21. API Integration

Lo Scheduler deve essere controllabile tramite API.

Esempi:

```text
POST /scheduler/jobs

GET /scheduler/jobs

POST /scheduler/jobs/{id}/run

DELETE /scheduler/jobs/{id}
```

---

# 22. CLI Integration

Comandi previsti:

```text
rumiai scheduler list

rumiai scheduler run <job>

rumiai scheduler status
```

---

# 23. Human Approval

Alcune automazioni richiedono conferma.

Esempio:

```text
Scheduler

↓

Agent

↓

Richiesta approvazione

↓

Utente

↓

Execution
```

---

# 24. Implementazione Foundation

Prima versione:

```text
Python Scheduler

+

SQLite Job Store

+

Event Bus Integration

+

Agent Runtime Integration
```

Possibili librerie:

* APScheduler;
* Celery;
* asyncio based scheduler.

---

# 25. Test richiesti

## Unit Test

Verificare:

* trigger;
* scheduling;
* retry;
* timeout.

---

## Integration Test

Scenario:

```text
Scheduler

↓

Task

↓

Agent

↓

Result Saved
```

---

## Reliability Test

Verificare:

* crash durante esecuzione;
* ripartenza;
* recupero task.

---

# 26. Evoluzione futura

Possibili estensioni:

* pianificazione intelligente tramite LLM;
* agenti sempre attivi;
* distributed scheduler;
* workflow temporali complessi;
* automazioni vocali;
* integrazione calendario.

---

# 27. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Terminal & System Control Subsystem.
