# RumiAI Event Bus Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

L'Event Bus Subsystem fornisce un meccanismo standardizzato di comunicazione asincrona tra i componenti RumiAI.

Il sistema permette ai sottosistemi di:

* pubblicare eventi;
* sottoscriversi a eventi;
* reagire a cambiamenti;
* propagare informazioni;
* mantenere disaccoppiamento architetturale.

---

# 2. Principio fondamentale

## Event Driven Architecture

I componenti non devono invocarsi direttamente quando possibile.

Approccio tradizionale:

```text
Agent

↓

Workflow

↓

Tool

↓

Memory
```

Approccio RumiAI:

```text
Agent

↓

Event Bus

↓

Workflow

↓

Event Bus

↓

Memory
```

---

# 3. Obiettivi

L'Event Bus deve fornire:

* pubblicazione eventi;
* sottoscrizione;
* routing;
* persistenza opzionale;
* gestione errori;
* correlazione eventi;
* integrazione con observability.

---

# 4. Non responsabilità

L'Event Bus NON deve:

* eseguire business logic;
* prendere decisioni;
* modificare dati;
* sostituire il Workflow Engine.

---

# 5. Architettura interna

Struttura prevista:

```text
event_bus/

├── contracts/

├── publisher/

├── subscriber/

├── router/

├── storage/

├── handlers/

└── tests/
```

---

# 6. Event Model

Ogni evento deve avere una struttura comune.

Modello:

```json
{
  "event_id": "uuid",
  "event_type": "workflow.started",
  "timestamp": "2026-07-28T12:00:00",
  "source": "workflow-engine",
  "correlation_id": "task-001",
  "payload": {}
}
```

---

# 7. Event Type

Gli eventi devono utilizzare nomi standardizzati.

Formato:

```text
<domain>.<action>
```

Esempi:

```text
agent.created

agent.started

workflow.completed

tool.executed

memory.updated

security.denied
```

---

# 8. Event Publisher

Un componente può pubblicare eventi.

Interfaccia:

```python
class EventPublisher:

    publish(event)

```

Esempio:

```python
event_bus.publish(
    "agent.started",
    data
)
```

---

# 9. Event Subscriber

Un componente può ascoltare eventi.

Interfaccia:

```python
class EventSubscriber:

    subscribe(
        event_type,
        handler
    )
```

Esempio:

```python
subscribe(
    "tool.completed",
    process_result
)
```

---

# 10. Event Router

Il Router decide quali subscriber riceveranno un evento.

Responsabilità:

* matching eventi;
* filtraggio;
* gestione priorità.

Schema:

```text
Event

↓

Router

↓

Handlers
```

---

# 11. Event Handler

Un handler reagisce a un evento.

Esempio:

```python
def on_document_added(event):

    update_memory(event)
```

Gli handler devono essere:

* piccoli;
* indipendenti;
* idempotenti quando possibile.

---

# 12. Event Categories

Categorie principali:

## Agent Events

```text
agent.created

agent.started

agent.completed

agent.failed
```

---

## Workflow Events

```text
workflow.created

workflow.started

workflow.step.completed

workflow.failed
```

---

## Tool Events

```text
tool.requested

tool.started

tool.completed

tool.failed
```

---

## Memory Events

```text
memory.created

memory.updated

memory.deleted
```

---

## Security Events

```text
security.check

security.denied

security.approval.required
```

---

# 13. Event Persistence

L'Event Bus deve supportare modalità:

## Ephemeral

Eventi temporanei.

Utilizzo:

* comunicazioni interne veloci.

---

## Persistent

Eventi salvati.

Utilizzo:

* audit;
* recovery;
* analisi.

Possibili backend:

* SQLite;
* database locale;
* message queue.

---

# 14. Event Ordering

Alcuni domini richiedono ordine garantito.

Esempio:

```text
workflow.started

↓

workflow.step.started

↓

workflow.step.completed
```

Il sistema deve supportare:

* timestamp;
* sequence number;
* correlation ID.

---

# 15. Error Handling

Gli errori degli handler devono essere gestiti.

Strategie:

* retry;
* dead letter queue;
* logging;
* escalation.

Flusso:

```text
Event

↓

Handler

↓

Error

↓

Retry

↓

Failure Event
```

---

# 16. Integrazione con Workflow

Il Workflow Engine utilizza eventi per comunicare stato.

Esempio:

```text
Step Completed

↓

event:
workflow.step.completed

↓

Next Step Trigger
```

---

# 17. Integrazione con Agent Runtime

L'agente riceve informazioni tramite eventi.

Esempio:

```text
Tool Completed

↓

Event Bus

↓

Agent Reflection
```

---

# 18. Integrazione con Observability

Ogni evento deve poter generare:

* log;
* metriche;
* trace.

Esempio:

```text
Event Published

↓

Trace Span

↓

Metric Counter
```

---

# 19. Integrazione con Plugin System

I plugin possono:

* pubblicare eventi;
* ascoltare eventi;
* estendere comportamenti.

Esempio:

```text
New Plugin Installed

↓

plugin.installed

↓

Observability Update
```

---

# 20. Configurazione

File:

```text
configs/event_bus.yaml
```

Esempio:

```yaml
event_bus:

  mode: local

  persistence:

    enabled: true

  retry:

    max_attempts: 3
```

---

# 21. Implementazione Foundation

La prima implementazione prevista:

```text
Local In-Process Event Bus
```

Caratteristiche:

* Python native;
* semplice;
* nessuna dipendenza esterna.

---

# 22. Evoluzione futura

Possibili backend:

```text
Redis Streams

RabbitMQ

NATS

Apache Kafka
```

senza modificare i contratti evento.

---

# 23. Test richiesti

## Unit Test

Testare:

* creazione eventi;
* routing;
* subscription;
* handler.

---

## Integration Test

Verificare:

* comunicazione tra sottosistemi;
* persistenza;
* recovery.

---

## Scenario Test

Esempio:

```text
Un tool completa un'attività.

Il sistema deve:

- pubblicare evento;
- aggiornare workflow;
- notificare agente;
- registrare osservabilità.
```

---

# 24. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Configuration Management Subsystem.
