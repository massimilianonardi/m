# RumiAI Secrets Management Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Secrets Management Subsystem definisce il modello con cui RumiAI gestisce informazioni sensibili necessarie al funzionamento del sistema.

Il sottosistema controlla:

* creazione segreti;
* archiviazione;
* accesso;
* rotazione;
* revoca;
* auditing.

---

# 2. Principio fondamentale

## Secrets Never in Code

I segreti non devono essere presenti in:

* codice sorgente;
* repository Git;
* immagini container pubbliche;
* file di configurazione versionati.

---

# 3. Obiettivi

Il sistema deve garantire:

* riservatezza;
* controllo accessi;
* tracciabilità;
* rotazione periodica;
* separazione ambienti.

---

# 4. Tipologie di segreti

RumiAI gestisce:

```text
Secret

├── API Key

├── Access Token

├── Database Credential

├── Certificate

├── Encryption Key

├── Plugin Credential

└── Service Credential
```

---

# 5. Secret Lifecycle

Ogni segreto segue un ciclo di vita:

```text
Created

↓

Stored

↓

Used

↓

Rotated

↓

Revoked

↓

Destroyed
```

---

# 6. Secret Object Model

Ogni segreto è rappresentato da:

```text
Secret

id

name

owner

type

scope

created_at

expiration

status
```

---

# 7. Secret Storage

Il sistema separa:

```text
Application Data

≠

Secrets
```

I segreti risiedono in uno storage dedicato.

---

# 8. Foundation Storage

Nella prima versione:

```text
Encrypted Local Secret Store
```

Caratteristiche:

* cifratura;
* permessi filesystem;
* accesso controllato.

---

# 9. Evoluzione Enterprise

Possibili integrazioni:

```text
Local Secret Store

↓

Dedicated Vault

↓

Hardware Security Module
```

---

# 10. Access Model

Un componente non legge direttamente il database dei segreti.

Flusso:

```text
Service

↓

Secret Request

↓

Authorization Check

↓

Secret Delivery
```

---

# 11. Least Privilege

Ogni servizio riceve solo i segreti necessari.

Esempio:

```text
Search Service

Allowed:

Embedding API Key


Denied:

Database Admin Password
```

---

# 12. Secret Scope

I segreti possono avere ambito:

```text
System

Service

User

Plugin

Temporary
```

---

# 13. Temporary Secrets

Per operazioni brevi:

```text
Request

↓

Generate Temporary Credential

↓

Execute

↓

Expire
```

---

# 14. Environment Separation

Gli ambienti devono avere segreti separati:

```text
Development

≠

Testing

≠

Production
```

Mai riutilizzare credenziali di produzione nello sviluppo.

---

# 15. Configuration Integration

Le configurazioni pubbliche possono contenere riferimenti:

Esempio:

```yaml
database:

  password: ${DB_PASSWORD}
```

Il valore reale viene fornito dal Secret Manager.

---

# 16. Environment Variables

Supporto previsto:

```text
Environment

↓

Runtime Injection

↓

Application
```

Le variabili devono essere protette dal sistema operativo.

---

# 17. Secret Rotation

La rotazione permette di sostituire periodicamente i segreti.

Schema:

```text
Old Secret

↓

Generate New Secret

↓

Update Consumers

↓

Disable Old Secret
```

---

# 18. Rotation Policy

Ogni segreto può avere:

* durata massima;
* scadenza;
* rinnovo automatico.

---

# 19. Secret Revocation

In caso di compromissione:

```text
Detect

↓

Disable Secret

↓

Replace Credential

↓

Audit Event
```

---

# 20. Audit

Ogni accesso ai segreti viene registrato.

Esempio:

```text
SecretRequested

SecretGranted

SecretDenied

SecretRotated
```

---

# 21. Secret Access Record

Formato:

```text
SecretAccess

timestamp

actor

secret_id

action

result
```

---

# 22. Protection Against Leakage

Misure:

* mascheramento log;
* filtro output;
* controllo errori;
* scansione repository.

---

# 23. Logging Rules

Mai registrare:

```text
password=value

token=value

apikey=value
```

Nei log deve comparire:

```text
secret_access=true
```

---

# 24. Plugin Secret Isolation

Ogni plugin deve avere credenziali separate.

Esempio:

```text
Plugin A

↓

Credential A


Plugin B

↓

Credential B
```

---

# 25. Agent Secret Access

Gli agenti non ricevono automaticamente segreti.

Schema:

```text
Agent Request

↓

Policy Evaluation

↓

Limited Secret Access
```

---

# 26. Backup Secrets

I backup dei segreti richiedono protezione speciale.

Devono essere:

* cifrati;
* separati;
* accessibili solo agli amministratori autorizzati.

---

# 27. Disaster Recovery

Procedura:

```text
Restore Secret Store

↓

Verify Integrity

↓

Restore Access Policies

↓

Restart Services
```

---

# 28. Security Monitoring

Monitoraggio:

* accessi anomali;
* richieste ripetute;
* tentativi negati.

---

# 29. API

Endpoint previsti:

```text
POST /secrets/create

GET /secrets/status

POST /secrets/rotate

POST /secrets/revoke

GET /secrets/audit
```

---

# 30. Configuration

File:

```text
config/secrets.yaml
```

Esempio:

```yaml
secrets:

  provider: local

  encryption: enabled

  rotation: enabled
```

---

# 31. Testing

Test richiesti:

## Access Test

Verifica permessi.

---

## Leakage Test

Verifica assenza segreti nei log.

---

## Rotation Test

Verifica rinnovo credenziali.

---

## Recovery Test

Verifica ripristino.

---

# 32. Foundation Implementation

Prima versione:

```text
Encrypted Secret Store

+

Access Policy

+

Audit Logging

+

Environment Separation
```

---

# 33. Scenario operativo

Configurazione servizio:

```text
Service Start

↓

Request Credential

↓

Policy Check

↓

Secret Injection

↓

Connection Established
```

---

# 34. Evoluzione futura

Possibili estensioni:

* integrazione HashiCorp Vault;
* AWS Secrets Manager;
* Azure Key Vault;
* HSM;
* secret rotation intelligente.

---

# 35. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione della strategia completa di testing.
