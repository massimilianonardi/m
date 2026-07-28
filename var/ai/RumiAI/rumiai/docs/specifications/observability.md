# RumiAI Observability Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

L'Observability Subsystem fornisce a RumiAI strumenti per raccogliere, correlare e analizzare informazioni sul comportamento del sistema.

Il sottosistema permette di osservare:

* esecuzione degli agenti;
* chiamate ai modelli LLM;
* utilizzo dei tool;
* workflow;
* retrieval RAG;
* errori;
* performance.

---

# 2. Principio fondamentale

## Everything Observable

Ogni componente importante deve produrre informazioni osservabili.

Esempio:

```text
Agent Decision

↓

Workflow Execution

↓

Tool Call

↓

LLM Request

↓

Result
```

Ogni passaggio deve essere tracciabile.

---

# 3. Obiettivi

Il sistema deve fornire:

* logging strutturato;
* metriche operative;
* tracing distribuito;
* diagnostica;
* analisi errori;
* audit tecnico.

---

# 4. Non responsabilità

L'Observability Subsystem NON deve:

* modificare il comportamento degli agenti;
* prendere decisioni;
* sostituire il Security Audit;
* conservare dati applicativi senza policy.

---

# 5. Architettura interna

Struttura prevista:

```text
observability/

├── logging/

├── metrics/

├── tracing/

├── events/

├── exporters/

├── diagnostics/

└── tests/
```

---

# 6. Tipi di osservabilità

RumiAI utilizza tre livelli principali.

---

# 6.1 Logging

Registra eventi puntuali.

Esempio:

```text
2026-07-28 12:00:00

Agent started workflow analysis_task
```

Utilizzato per:

* debugging;
* analisi errori;
* audit tecnico.

---

# 6.2 Metrics

Misura valori numerici.

Esempi:

```text
llm_requests_total

tool_execution_time_seconds

workflow_completed_total

retrieval_latency_ms
```

---

# 6.3 Tracing

Ricostruisce il percorso completo di una richiesta.

Esempio:

```text
User Request

|

Agent

|

Planner

|

LLM

|

Tool

|

Response
```

---

# 7. Event Model

Tutti gli eventi devono avere una struttura comune.

Esempio:

```json
{
  "event_id": "12345",
  "timestamp": "...",
  "source": "workflow",
  "type": "step_completed",
  "metadata": {}
}
```

---

# 8. Correlation ID

Ogni operazione complessa deve avere un identificativo comune.

Esempio:

```text
Request ID:

rumiai-task-001
```

Questo permette di correlare:

* log;
* metriche;
* trace;
* eventi.

---

# 9. Logging System

Interfaccia prevista:

```python
class Logger:

    debug()

    info()

    warning()

    error()
```

---

# 10. Structured Logging

I log devono essere dati strutturati.

Esempio:

```json
{
 "level": "ERROR",
 "component": "tool",
 "operation": "execute_command",
 "error": "timeout"
}
```

Non devono essere solamente stringhe libere.

---

# 11. Metrics System

Interfaccia:

```python
class Metrics:

    counter()

    gauge()

    histogram()
```

---

# 12. Metriche principali

## LLM

Esempi:

```text
llm_request_duration

llm_tokens_generated

llm_errors
```

---

## Knowledge

Esempi:

```text
documents_indexed

retrieval_count

embedding_duration
```

---

## Tools

Esempi:

```text
tool_calls

tool_failures

tool_latency
```

---

## Workflow

Esempi:

```text
workflow_started

workflow_completed

workflow_failed
```

---

# 13. Tracing

Il tracing rappresenta una richiesta come una sequenza di span.

Esempio:

```text
Trace:

User Query

 |
 +-- Agent Planning

 |
 +-- Retrieval

 |
 +-- LLM Generation

 |
 +-- Tool Execution

 |
 +-- Final Response
```

---

# 14. Span Model

Ogni span contiene:

```text
span_id

parent_id

operation

start_time

end_time

metadata
```

---

# 15. Error Management

Gli errori devono essere classificati.

Categorie:

```text
Configuration Error

Network Error

Provider Error

Tool Error

Security Error

Agent Error
```

---

# 16. Diagnostic Mode

RumiAI deve supportare modalità diagnostica.

Esempio:

```yaml
observability:

  debug_mode: true
```

In questa modalità:

* maggiore dettaglio log;
* tracing completo;
* informazioni aggiuntive.

---

# 17. Privacy

L'osservabilità deve rispettare la protezione dei dati.

Devono poter essere filtrati:

* prompt sensibili;
* documenti privati;
* credenziali;
* contenuti personali.

---

# 18. Exporters

Il sottosistema deve supportare diversi backend.

Possibili destinazioni:

```text
Console

File

SQLite

Prometheus

OpenTelemetry

Dashboard
```

---

# 19. Integrazione con altri sottosistemi

## LLM

Registra:

* richieste;
* tempi;
* errori;
* token.

---

## Knowledge

Registra:

* ingestion;
* retrieval;
* embedding.

---

## Tool

Registra:

* capability utilizzata;
* durata;
* risultato.

---

## Security

Registra:

* decisioni policy;
* approvazioni;
* violazioni.

---

# 20. Configurazione

File:

```text
configs/observability.yaml
```

Esempio:

```yaml
observability:

  logging:

    level: INFO


  tracing:

    enabled: true


  metrics:

    enabled: true
```

---

# 21. Eventi prodotti

Eventi previsti:

```text
LogCreated

MetricRecorded

TraceStarted

TraceCompleted

DiagnosticGenerated
```

---

# 22. Test richiesti

## Unit Test

Testare:

* creazione eventi;
* serializzazione;
* filtri.

---

## Integration Test

Verificare:

* raccolta log;
* metriche;
* tracing completo.

---

## Scenario Test

Esempio:

Un utente invia una richiesta complessa.

Il sistema deve permettere di ricostruire:

```text
richiesta

↓

decisione agente

↓

workflow

↓

tool utilizzati

↓

risultato finale
```

---

# 23. Evoluzione futura

Possibili estensioni:

* dashboard dedicata RumiAI;
* analisi automatica anomalie;
* valutazione qualità agenti;
* benchmarking modelli;
* replay completo delle esecuzioni.

---

# 24. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione dell'Agent Runtime Subsystem.
