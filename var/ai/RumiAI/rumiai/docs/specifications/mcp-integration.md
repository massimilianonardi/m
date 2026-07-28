# RumiAI Model Context Protocol & External Tool Integration Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Model Context Protocol & External Tool Integration Subsystem definisce il sistema standard per collegare RumiAI a strumenti e servizi esterni.

Il sottosistema gestisce:

* discovery strumenti;
* connessione MCP;
* gestione capability;
* esecuzione tool;
* sicurezza integrazioni esterne.

---

# 2. Principio fondamentale

## Capability Based Integration

Gli strumenti devono essere esposti come capability dichiarate.

Modello non corretto:

```text id="4sw2v8"
Agent

↓

Codice specifico

↓

Servizio esterno
```

Modello RumiAI:

```text id="h6m0rq"
Agent

↓

Capability Request

↓

MCP Tool

↓

Execution
```

---

# 3. Obiettivi

Il sistema deve fornire:

* integrazione standard;
* estensibilità;
* isolamento strumenti;
* controllo permessi;
* riutilizzo componenti.

---

# 4. Non responsabilità

Il MCP Layer NON deve:

* decidere strategie agente;
* sostituire Tool Manager;
* concedere permessi automaticamente;
* ignorare Security Policy.

---

# 5. Architettura interna

Struttura prevista:

```text id="2s5t9w"
mcp/

├── client/

├── servers/

├── discovery/

├── registry/

├── schemas/

├── security/

├── adapters/

└── tests/
```

---

# 6. MCP Client

Il client MCP è il componente che comunica con server esterni.

Responsabilità:

* connessione;
* handshake;
* discovery;
* invocazione tool.

---

# 7. MCP Server

Un MCP Server espone capacità.

Esempi:

```text id="v3d6l9"
Filesystem Server

Database Server

Git Server

Browser Server

Knowledge Server
```

---

# 8. Tool Discovery

RumiAI deve poter scoprire automaticamente strumenti disponibili.

Flusso:

```text id="h9g3fp"
MCP Client

↓

Server Discovery

↓

Capabilities List

↓

Tool Registry
```

---

# 9. Capability Model

Ogni tool dichiara capacità.

Esempio:

```json id="r4w0as"
{
 "name": "filesystem",
 "capabilities": [
   "read_file",
   "list_directory"
 ]
}
```

---

# 10. Tool Registry

Il sistema mantiene un catalogo degli strumenti.

Modello:

```text id="5fz1s9"
Tool

id

name

provider

capabilities

permissions

status
```

---

# 11. Tool Invocation

Una chiamata tool segue il flusso:

```text id="8f3v5c"
Agent

↓

Tool Request

↓

Tool Manager

↓

MCP Client

↓

MCP Server

↓

Result
```

---

# 12. Request Model

Ogni richiesta deve contenere:

```text id="j2j6qk"
ToolRequest

id

agent

tool

action

parameters

timestamp
```

---

# 13. Response Model

Risultato standard:

```text id="c8v0hx"
ToolResponse

id

status

data

error

metadata
```

---

# 14. Security Model

Ogni tool deve avere policy dedicate.

Esempio:

```yaml id="9a3l2m"
tool:

  filesystem:

    permissions:

      read: true

      write: false
```

---

# 15. External Tool Isolation

Gli strumenti esterni devono essere isolabili.

Possibili modalità:

```text id="6a0zq3"
Container

Network Isolation

Restricted User

Sandbox
```

---

# 16. Approval Flow

Alcuni tool richiedono approvazione.

Esempio:

```text id="q7f8kx"
Agent

↓

Tool Request

↓

Risk Analysis

↓

Human Approval

↓

Execution
```

---

# 17. Integration con Agent Runtime

Gli agenti vedono solo capability disponibili.

Esempio:

```text id="8f3s0q"
Agent

"Mi serve cercare documenti"

↓

Knowledge Capability

↓

MCP Tool
```

---

# 18. Integration con Multi-Agent

Gli agenti possono condividere strumenti.

Controllo:

```text id="4n7h0p"
Agent A

|

Permissions

|

Tool Access
```

---

# 19. Integration con Knowledge System

Esempio:

```text id="6w4z8k"
MCP Document Server

↓

Knowledge Pipeline

↓

RAG Storage
```

---

# 20. Integration con Terminal

Possibile MCP Server:

```text id="3x8v1q"
Terminal MCP Server

↓

Controlled Command Execution
```

Sempre attraverso Security Layer.

---

# 21. Integration con Browser

Possibile MCP Server:

```text id="0m9k4f"
Browser MCP Server

↓

Navigation

Extraction

Actions
```

---

# 22. Observability

Ogni chiamata deve produrre eventi.

Eventi:

```text id="4t9x2p"
ToolDiscovered

ToolRequested

ToolExecuted

ToolFailed
```

---

# 23. Configuration

File:

```text id="8w2j7m"
configs/mcp.yaml
```

Esempio:

```yaml id="1m5q8v"
mcp:

  enabled: true


  servers:

    filesystem:

      enabled: true
```

---

# 24. API Integration

Endpoint previsti:

```text id="p5y8s2"
/mcp/tools

/mcp/tools/{id}

/mcp/discover

/mcp/execute
```

---

# 25. Implementazione Foundation

Prima versione:

```text id="k7q2az"
MCP Client

+

Tool Registry

+

Capability Discovery

+

Security Integration
```

---

# 26. Test richiesti

## Unit Test

Verificare:

* discovery;
* schema validation;
* permissions.

---

## Integration Test

Scenario:

```text id="8p2k5m"
Agent

↓

MCP Client

↓

External Tool

↓

Result
```

---

## Security Test

Verificare:

* tool non autorizzato;
* parametri invalidi;
* escalation privilegi.

---

# 27. Scenario operativo

Richiesta:

```text id="6c5m8q"
"Analizza il repository del progetto"
```

Flusso:

```text id="3s7n0x"
Supervisor Agent

↓

Coding Agent

↓

MCP Git Server

↓

Repository Data

↓

Analysis

↓

Response
```

---

# 28. Evoluzione futura

Possibili estensioni:

* marketplace MCP;
* discovery dinamica;
* tool federation;
* strumenti distribuiti;
* agenti che pubblicano capability.

---

# 29. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Voice & Multimodal Interaction Subsystem.
