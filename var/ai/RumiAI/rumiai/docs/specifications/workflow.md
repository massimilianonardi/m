# RumiAI Workflow Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Workflow Subsystem fornisce a RumiAI la capacità di definire, pianificare, eseguire e monitorare processi composti da più attività.

Il suo obiettivo è permettere agli agenti di gestire:

* attività multi-step;
* processi con dipendenze;
* operazioni lunghe;
* recupero dagli errori;
* esecuzioni ripetibili.

---

# 2. Principio fondamentale

## Piano ed esecuzione sono separati

RumiAI distingue:

```text
Planning

↓

Execution
```

Il Planner decide:

* cosa deve essere fatto;
* in quale ordine;
* quali strumenti utilizzare.

L'Executor esegue:

* i singoli passi;
* controlla risultati;
* aggiorna lo stato.

---

# 3. Obiettivi

Il Workflow Subsystem deve fornire:

* rappresentazione dei workflow;
* gestione degli step;
* stato dell'esecuzione;
* scheduling;
* retry;
* gestione errori;
* persistenza;
* osservabilità.

---

# 4. Non responsabilità

Il Workflow Subsystem NON deve:

* generare direttamente testo;
* eseguire tool senza autorizzazione;
* sostituire il Planner;
* gestire direttamente memoria;
* implementare la logica specifica dei plugin.

---

# 5. Architettura interna

Struttura prevista:

```text
workflow/

├── contracts/

├── planner/

├── executor/

├── scheduler/

├── state/

├── persistence/

├── events/

└── tests/
```

---

# 6. Concetti principali

## Workflow

Rappresenta un processo completo.

Esempio:

```text
Analizzare documentazione tecnica

Step 1:
acquisire documenti

Step 2:
indicizzare contenuti

Step 3:
creare rapporto

Step 4:
salvare risultato
```

---

## Task

Rappresenta un obiettivo da raggiungere.

Esempio:

```text
Task:

"Analizzare configurazione Podman"
```

---

## Step

Rappresenta una singola unità eseguibile.

Esempio:

```text
Step:

execute_command

input:

podman ps

output:

lista container
```

---

## Plan

Rappresenta la strategia per completare un task.

Esempio:

```text
Goal

↓

Plan

↓

Step 1

↓

Step 2

↓

Step 3
```

---

# 7. Modello Workflow

Un workflow contiene:

```text
Workflow

id

name

description

steps

dependencies

state

metadata
```

---

# 8. Stato del Workflow

Gli stati previsti:

```text
Created

↓

Planned

↓

Running

↓

Paused

↓

Completed

↓

Failed

↓

Cancelled
```

---

# 9. Stato degli Step

Ogni step può essere:

```text
Pending

↓

Ready

↓

Running

↓

Completed

↓

Failed

↓

Skipped
```

---

# 10. Executor

L'Executor è responsabile dell'esecuzione.

Responsabilità:

* selezionare step pronti;
* invocare capability;
* raccogliere risultati;
* aggiornare stato.

Flusso:

```text
Workflow

↓

Executor

↓

Step

↓

Capability

↓

Tool

↓

Result
```

---

# 11. Planner

Il Planner crea un piano operativo.

Può utilizzare:

* LLM Subsystem;
* Knowledge Subsystem;
* Memory Subsystem.

Esempio:

Input:

```text
"Crea un backup del progetto"
```

Output:

```text
Step 1:
analizza directory

Step 2:
crea archivio

Step 3:
verifica integrità

Step 4:
notifica risultato
```

---

# 12. Interfacce principali

## WorkflowEngine

```python
create(workflow)

start(id)

pause(id)

resume(id)

cancel(id)

status(id)
```

---

## Planner Interface

```python
create_plan(goal, context)
```

---

## Executor Interface

```python
execute(plan)
```

---

## Step Interface

```python
run(input)
```

---

# 13. Dipendenze tra step

I workflow devono supportare grafi di esecuzione.

Esempio:

```text
        Step A

       /     \

   Step B   Step C

       \     /

        Step D
```

Questo permette:

* parallelizzazione futura;
* ottimizzazione;
* gestione complessità.

---

# 14. Retry e Recovery

Gli step possono definire:

```yaml
retry:

  enabled: true

  max_attempts: 3

  strategy: exponential_backoff
```

---

# 15. Human Approval

Per operazioni sensibili deve essere possibile inserire un controllo umano.

Esempio:

```text
Step

↓

Approval Required

↓

User Confirmation

↓

Execution
```

Utilizzabile per:

* cancellazione dati;
* esecuzione comandi critici;
* operazioni esterne.

---

# 16. Eventi prodotti

Eventi previsti:

```text
WorkflowCreated

WorkflowStarted

StepStarted

StepCompleted

StepFailed

WorkflowCompleted

WorkflowCancelled
```

---

# 17. Persistenza dello stato

I workflow devono poter sopravvivere a:

* riavvio sistema;
* arresto container;
* errori runtime.

Lo stato deve essere persistito.

Possibili backend:

* SQLite;
* database locale;
* storage futuro distribuito.

---

# 18. Configurazione

File:

```text
configs/workflow.yaml
```

Esempio:

```yaml
workflow:

  max_parallel_steps: 4

  retry_enabled: true

  persistence: sqlite
```

---

# 19. Integrazione con altri sottosistemi

## Agent Runtime

Crea e avvia workflow.

---

## Tool Subsystem

Esegue gli step operativi.

---

## Memory Subsystem

Memorizza:

* risultati importanti;
* esperienze;
* errori ricorrenti.

---

## LLM Subsystem

Supporta:

* pianificazione;
* analisi;
* valutazione risultati.

---

# 20. Test richiesti

## Unit Test

Testare:

* stato workflow;
* transizioni;
* gestione errori;
* retry.

---

## Integration Test

Verificare:

* creazione piano;
* esecuzione step;
* uso capability.

---

## Scenario Test

Esempio:

```text
L'agente riceve:

"Analizza una cartella di documenti e crea un rapporto"

Il sistema deve:

- creare un piano;
- eseguire gli step;
- gestire eventuali errori;
- produrre il risultato finale.
```

---

# 21. Evoluzione futura

Possibili estensioni:

* workflow visuali;
* workflow schedulati;
* agenti cooperanti;
* esecuzione distribuita;
* ottimizzazione automatica dei piani;
* apprendimento dai workflow precedenti.

---

# 22. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Browser Subsystem.
