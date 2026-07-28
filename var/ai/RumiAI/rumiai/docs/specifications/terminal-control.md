# RumiAI Terminal & System Control Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Terminal & System Control Subsystem permette agli agenti RumiAI di eseguire operazioni sul sistema operativo attraverso un livello controllato e sicuro.

Il sottosistema gestisce:

* esecuzione comandi;
* gestione processi;
* accesso filesystem;
* script automation;
* controllo ambiente Podman;
* raccolta output.

---

# 2. Principio fondamentale

## Controlled Execution

Gli agenti non eseguono comandi direttamente.

Modello errato:

```text
Agent

↓

Shell
```

Modello corretto:

```text
Agent

↓

Tool Manager

↓

Security Policy

↓

Terminal Controller

↓

Execution Environment
```

---

# 3. Obiettivi

Il sistema deve fornire:

* esecuzione controllata;
* isolamento;
* autorizzazioni;
* audit;
* gestione errori;
* recupero risultati.

---

# 4. Non responsabilità

Il Terminal Subsystem NON deve:

* decidere gli obiettivi dell'agente;
* bypassare sicurezza;
* concedere privilegi automaticamente;
* modificare policy.

---

# 5. Architettura interna

Struttura prevista:

```text
terminal/

├── executor/

├── sandbox/

├── permissions/

├── commands/

├── filesystem/

├── process/

├── audit/

└── tests/
```

---

# 6. Execution Environments

RumiAI distingue diversi ambienti.

---

## 6.1 Sandbox Environment

Ambiente predefinito.

Utilizzo:

* test;
* analisi;
* script non privilegiati.

Esempio:

```text
Agent

↓

Container isolato

↓

Command Execution
```

---

## 6.2 Container Environment

Utilizzato per operazioni applicative.

Esempio:

```text
Agent

↓

Podman Container

↓

Command
```

---

## 6.3 Host Environment

Accesso diretto alla macchina.

Deve essere:

* limitato;
* tracciato;
* generalmente soggetto ad approvazione.

---

# 7. Command Request Model

Ogni comando deve essere rappresentato come richiesta.

Modello:

```text
CommandRequest

id

agent

command

arguments

environment

permissions

timestamp
```

---

# 8. Command Execution Flow

Flusso completo:

```text
Command Request

↓

Validation

↓

Security Policy Check

↓

Approval Check

↓

Execution

↓

Output Capture

↓

Audit
```

---

# 9. Command Whitelist

Il sistema deve supportare liste di comandi autorizzati.

Esempio:

```yaml
terminal:

  allowed_commands:

    - ls

    - cat

    - grep

    - python
```

---

# 10. Command Blacklist

Alcuni comandi possono essere vietati.

Esempio:

```yaml
terminal:

  blocked_commands:

    - rm -rf /

    - mkfs

    - shutdown
```

---

# 11. Permission Model

Ogni agente possiede capability.

Esempio:

```text
Agent

↓

Capabilities

↓

Allowed Operations
```

Esempio:

```yaml
agent:

  filesystem:

    read: true

    write: false


  terminal:

    execute: limited
```

---

# 12. Human Approval Flow

Le operazioni critiche richiedono conferma.

Esempio:

```text
Agent

↓

Request Command

↓

Risk Analysis

↓

User Approval

↓

Execution
```

---

# 13. Risk Classification

I comandi possono avere livelli di rischio.

Esempio:

```text
LOW

lettura file

analisi log


MEDIUM

modifica configurazioni


HIGH

installazioni

cancellazioni

modifica sistema
```

---

# 14. Output Handling

Ogni comando produce:

```text
CommandResult

id

exit_code

stdout

stderr

duration

timestamp
```

---

# 15. Process Management

Il sistema deve gestire:

* avvio processi;
* terminazione;
* timeout;
* monitoraggio.

Stati:

```text
created

running

completed

failed

terminated
```

---

# 16. Timeout e Resource Limit

Ogni esecuzione deve avere limiti:

* tempo massimo;
* memoria;
* CPU;
* spazio disco.

Esempio:

```yaml
execution:

  timeout: 60

  memory_limit: 512MB
```

---

# 17. Filesystem Access

L'accesso ai file deve essere controllato.

Modalità:

```text
READ ONLY

READ WRITE

NO ACCESS
```

---

# 18. Podman Integration

Il sottosistema deve poter gestire:

* container;
* immagini;
* pod;
* volumi.

Esempio:

```text
Agent

↓

Podman Tool

↓

Podman API

↓

Container
```

---

# 19. Script Execution

Gli agenti possono eseguire script.

Supporto iniziale:

```text
Shell

Python

POSIX Scripts
```

Ogni script deve essere:

* identificabile;
* versionabile;
* registrato.

---

# 20. Security Integration

Ogni operazione deve passare dal Security Layer.

Schema:

```text
Tool Request

↓

Security

↓

Terminal Controller

↓

Execution
```

---

# 21. Observability Integration

Devono essere registrati:

* agente richiedente;
* comando;
* risultato;
* durata;
* errori.

Eventi:

```text
CommandRequested

CommandApproved

CommandExecuted

CommandFailed
```

---

# 22. API Integration

Interfaccia prevista:

```text
POST /tools/terminal/execute

GET /tools/terminal/jobs/{id}

POST /tools/terminal/cancel/{id}
```

---

# 23. Configuration

File:

```text
configs/terminal.yaml
```

Esempio:

```yaml
terminal:

  enabled: true


  default_environment:

    sandbox


  approval_required:

    high_risk: true
```

---

# 24. Implementazione Foundation

Prima versione:

```text
Python subprocess

+

Docker/Podman sandbox

+

Permission Manager

+

Audit Logging
```

---

# 25. Test richiesti

## Unit Test

Verificare:

* parsing comandi;
* policy;
* autorizzazioni;
* timeout.

---

## Integration Test

Scenario:

```text
Agent

↓

Terminal Tool

↓

Sandbox

↓

Command

↓

Result
```

---

## Security Test

Verificare:

* comando bloccato;
* escalation privilegi;
* accesso file non autorizzato.

---

# 26. Scenario operativo

Esempio:

Richiesta:

```text
"Analizza i log di Ollama"
```

Flusso:

```text
Agent

↓

Richiede lettura log

↓

Security Check

↓

Terminal Execution

↓

Risultato

↓

Analisi LLM
```

---

# 27. Evoluzione futura

Possibili estensioni:

* ComputerUse integration;
* shell intelligente;
* pianificazione operazioni;
* gestione remota;
* automazione DevOps;
* agenti amministratori specializzati.

---

# 28. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Browser Automation & Web Interaction Subsystem.
