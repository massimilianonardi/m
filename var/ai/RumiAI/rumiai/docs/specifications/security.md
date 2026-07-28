# RumiAI Security Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Security Subsystem fornisce a RumiAI i meccanismi necessari per controllare, autorizzare e monitorare tutte le operazioni eseguite dal sistema.

Il suo obiettivo è garantire che:

* gli agenti operino entro limiti definiti;
* gli strumenti siano utilizzati in modo controllato;
* le azioni critiche richiedano approvazione;
* ogni operazione sia tracciabile.

---

# 2. Principio fondamentale

## Security by Architecture

La sicurezza non deve essere aggiunta successivamente.

Ogni componente deve essere progettato per operare attraverso:

```text id="7m2kq8"
Identity

↓

Permission

↓

Policy

↓

Execution

↓

Audit
```

---

# 3. Obiettivi

Il Security Subsystem deve fornire:

* autenticazione;
* autorizzazione;
* gestione permessi;
* policy engine;
* sandbox;
* approvazioni;
* audit;
* controllo rischio.

---

# 4. Non responsabilità

Il Security Subsystem NON deve:

* decidere gli obiettivi dell'agente;
* sostituire il Workflow Engine;
* eseguire direttamente strumenti;
* generare risposte linguistiche;
* modificare autonomamente i dati.

---

# 5. Architettura interna

Struttura prevista:

```text id="g8q1z4"
security/

├── identity/

├── authorization/

├── policies/

├── sandbox/

├── approvals/

├── audit/

└── tests/
```

---

# 6. Identità

Ogni entità operante in RumiAI deve avere una identità.

Possibili identità:

```text id="v4r8m6"
User

Agent

Workflow

Tool

Plugin

Service
```

---

# 7. Security Context

Ogni operazione deve essere accompagnata da un contesto di sicurezza.

Esempio:

```text id="k5m9s2"
SecurityContext

actor

identity

permissions

environment

request_id

timestamp
```

---

# 8. Permission Model

RumiAI utilizza un modello basato su capability.

Esempio:

```text id="p8q3n7"
Permission:

execute_command

read_private_file

access_network

control_browser

control_desktop
```

---

# 9. Policy Engine

Il Policy Engine decide se una richiesta può essere eseguita.

Input:

```text id="r6t2w9"
Request

+

Security Context

+

Policies
```

Output:

```text id="h4k7m1"
ALLOW

DENY

REQUIRE_APPROVAL
```

---

# 10. Policy

Una policy definisce una regola.

Esempio:

```yaml id="q7n3x5"
policy:

  capability:
    execute_command

  condition:

    requires_approval:
      true
```

---

# 11. Livelli di rischio

Ogni capability può avere un livello di rischio.

Esempio:

```text id="m9w4k6"
LOW

read_file


MEDIUM

write_file


HIGH

execute_command


CRITICAL

delete_system_data
```

---

# 12. Approval System

Le operazioni sensibili possono richiedere approvazione umana.

Flusso:

```text id="b5r8q2"
Request

↓

Risk Analysis

↓

Approval Required

↓

User Decision

↓

Execution / Denial
```

---

# 13. Sandbox

Le operazioni ad alto rischio devono poter essere isolate.

Possibili ambienti:

```text id="z6m2p8"
Container

Virtual Machine

Restricted Process

Temporary Workspace
```

---

# 14. Filesystem Security

L'accesso ai file deve essere controllato.

Esempio:

Permesso:

```yaml id="n7x3c5"
filesystem:

  allowed_paths:

    - /workspace/project
```

Bloccato:

```text id="s4m8k1"
/etc/
/home/user/private/
```

---

# 15. Command Execution Security

L'esecuzione terminale richiede controlli aggiuntivi.

Devono essere supportati:

* whitelist comandi;
* timeout;
* limite risorse;
* ambiente isolato;
* logging.

Esempio:

```text id="w5q9r3"
execute_command

↓

Security Check

↓

Sandbox

↓

Command Execution

↓

Audit
```

---

# 16. Network Security

L'accesso alla rete deve essere configurabile.

Controlli:

* domini consentiti;
* porte consentite;
* protocolli ammessi.

---

# 17. Secret Management

Le informazioni sensibili non devono essere memorizzate direttamente.

Esempi:

* password;
* token;
* API key;
* certificati.

Devono essere gestite tramite:

* secret store;
* variabili protette;
* vault locali.

---

# 18. Audit System

Ogni operazione significativa deve produrre un evento.

Esempio:

```text id="c8p2m7"
AuditEvent

timestamp

actor

action

resource

decision

result
```

---

# 19. Eventi prodotti

Eventi previsti:

```text id="j4m8q6"
AuthenticationSucceeded

AuthenticationFailed

PermissionGranted

PermissionDenied

ApprovalRequested

ApprovalGranted

ApprovalRejected

SecurityViolation
```

---

# 20. Integrazione con Tool Subsystem

Ogni Tool deve passare dal Security Layer.

Flusso:

```text id="d6r3k9"
Tool Request

↓

Security Validation

↓

Policy Check

↓

Execution
```

---

# 21. Integrazione con ComputerUse

ComputerUse richiede controlli elevati.

Esempi:

* conferma prima di inviare dati;
* conferma prima di modificare configurazioni;
* registrazione delle azioni.

---

# 22. Configurazione

File:

```text id="t8q4m2"
configs/security.yaml
```

Esempio:

```yaml id="x5k9p3"
security:

  require_approval:

    high_risk_actions: true


  sandbox:

    enabled: true


  audit:

    enabled: true
```

---

# 23. Test richiesti

## Unit Test

Testare:

* policy evaluation;
* permission handling;
* risk classification.

---

## Integration Test

Verificare:

* richiesta capability;
* autorizzazione;
* audit.

---

## Security Test

Verificare:

* isolamento;
* blocco accessi;
* escalation tentate.

---

## Scenario Test

Esempio:

```text id="m3q7z8"
Un agente tenta di eseguire
un comando sul sistema.

Il sistema deve:

- classificare il rischio;
- verificare permessi;
- richiedere approvazione se necessario;
- registrare l'evento.
```

---

# 24. Evoluzione futura

Possibili estensioni:

* zero trust architecture;
* policy dinamiche;
* analisi comportamentale;
* firma digitale dei plugin;
* sandbox avanzate;
* multi-user security.

---

# 25. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione dell'Observability Subsystem.
