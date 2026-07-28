# RumiAI Identity, User & Permission Management Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Identity, User & Permission Management Subsystem definisce il sistema di gestione delle identità, dei ruoli e delle autorizzazioni all'interno di RumiAI.

Il sottosistema gestisce:

* utenti;
* agenti;
* servizi;
* autenticazione;
* autorizzazione;
* ruoli;
* policy di accesso.

---

# 2. Principio fondamentale

## Explicit Identity and Permission

Ogni operazione deve essere associata a:

* chi la richiede;
* quale entità la esegue;
* quali permessi possiede.

Modello:

```text
Request

↓

Identity

↓

Permission Check

↓

Execution
```

---

# 3. Obiettivi

Il sistema deve fornire:

* autenticazione sicura;
* autorizzazioni granulari;
* isolamento utenti;
* controllo accesso risorse;
* audit completo.

---

# 4. Non responsabilità

Identity Layer NON deve:

* eseguire operazioni;
* decidere strategie agente;
* modificare autonomamente permessi;
* sostituire Security Policy Engine.

---

# 5. Architettura interna

Struttura prevista:

```text
identity/

├── authentication/

├── authorization/

├── users/

├── roles/

├── policies/

├── sessions/

├── audit/

└── tests/
```

---

# 6. Identity Model

Ogni entità possiede una identità.

Modello:

```text
Identity

id

type

name

credentials

status

metadata
```

---

# 7. Tipologie di Identità

RumiAI distingue:

## Human Identity

Utenti umani.

Esempi:

* amministratore;
* operatore;
* utente finale.

---

## Agent Identity

Agenti autonomi.

Esempi:

* Supervisor Agent;
* Coding Agent;
* Research Agent.

---

## Service Identity

Servizi interni.

Esempi:

* Scheduler;
* Event Bus;
* Knowledge Pipeline.

---

## External Identity

Sistemi esterni.

Esempi:

* MCP Server;
* API esterne;
* database.

---

# 8. Authentication Layer

Responsabile della verifica identità.

Metodi supportati:

```text
Password

Token

Certificate

API Key

Local Identity

SSO
```

---

# 9. Session Management

Una sessione rappresenta un'interazione autenticata.

Modello:

```text
Session

id

identity

created_at

expires_at

permissions

status
```

---

# 10. Authorization Model

RumiAI utilizza un modello combinato:

```text
RBAC

+

Policy Based Access Control
```

---

# 11. Role Based Access Control

I ruoli raggruppano permessi.

Esempio:

```yaml
role:

  name: developer


  permissions:

    - code.read

    - code.write

    - terminal.execute
```

---

# 12. Permission Model

Ogni permesso rappresenta una capacità.

Formato:

```text
resource.action
```

Esempi:

```text
knowledge.read

knowledge.write

tool.execute

agent.create

system.admin
```

---

# 13. Policy Engine

Le policy permettono regole dinamiche.

Esempio:

```yaml
policy:

  condition:

    user_role: developer


  allow:

    terminal.execute
```

---

# 14. Resource Protection

Le risorse protette includono:

* documenti;
* memoria;
* agenti;
* tool;
* configurazioni;
* sistemi esterni.

---

# 15. Agent Permissions

Ogni agente possiede un profilo sicurezza.

Esempio:

```yaml
agent:

  name: research_agent


  permissions:

    - knowledge.read

    - browser.search


  denied:

    - terminal.execute
```

---

# 16. Tool Access Control

Gli agenti non accedono direttamente ai tool.

Flusso:

```text
Agent

↓

Permission Check

↓

Tool Manager

↓

Tool Execution
```

---

# 17. Knowledge Access Control

La conoscenza può avere livelli diversi.

Esempio:

```text
PUBLIC

INTERNAL

CONFIDENTIAL

RESTRICTED
```

---

# 18. Multi User Isolation

Gli utenti devono avere separazione dei dati.

Schema:

```text
User A

|

Private Memory

Private Knowledge


User B

|

Private Memory

Private Knowledge
```

---

# 19. Shared Resources

Le risorse condivise devono avere policy dedicate.

Esempio:

```text
Shared Project

|

Members

|

Permissions
```

---

# 20. Privilege Escalation Protection

Il sistema deve impedire:

* aumento privilegi non autorizzato;
* modifica ruoli propria;
* accesso indiretto a risorse protette.

---

# 21. Approval Workflow

Operazioni sensibili possono richiedere approvazione.

Esempio:

```text
Request

↓

Permission Engine

↓

Approval Required

↓

Human Confirmation

↓

Execution
```

---

# 22. Audit Logging

Ogni accesso deve essere registrato.

Eventi:

```text
Login

Logout

PermissionGranted

PermissionDenied

ResourceAccessed

RoleChanged
```

---

# 23. Integration con Security Layer

Identity fornisce:

* chi è il soggetto;
* cosa può fare.

Security decide:

* come proteggere il sistema.

---

# 24. Integration con Multi-Agent

Gli agenti ereditano identità e policy.

Schema:

```text
Supervisor Agent

|

Delegated Identity

|

Specialized Agent
```

---

# 25. Configuration

File:

```text
configs/identity.yaml
```

Esempio:

```yaml
identity:

  local_auth:

    enabled: true


  session:

    timeout_minutes: 60
```

---

# 26. API Integration

Endpoint previsti:

```text
POST /identity/login

POST /identity/logout

GET /identity/profile

GET /permissions

POST /roles
```

---

# 27. Implementazione Foundation

Prima versione:

```text
Local Identity Provider

+

User Database

+

RBAC Engine

+

Permission Middleware

+

Audit Logging
```

---

# 28. Test richiesti

## Unit Test

Verificare:

* autenticazione;
* ruoli;
* permessi.

---

## Integration Test

Scenario:

```text
User

↓

Login

↓

Permission Check

↓

Agent Usage

↓

Audit Event
```

---

## Security Test

Verificare:

* accesso negato;
* privilege escalation;
* session expiration.

---

# 29. Scenario operativo

Un utente richiede:

```text
"Esegui analisi sul repository"
```

Flusso:

```text
User Identity

↓

Permission Check

↓

Coding Agent

↓

MCP Git Tool

↓

Result

↓

Audit
```

---

# 30. Evoluzione futura

Possibili estensioni:

* autenticazione biometrica locale;
* identity federation;
* zero trust architecture;
* gestione organizzazioni;
* multi-tenant enterprise.

---

# 31. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Backup, Recovery & Disaster Management Subsystem.
