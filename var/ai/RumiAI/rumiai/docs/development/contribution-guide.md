# RumiAI Contribution Guide

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Questo documento definisce il processo di contribuzione al progetto RumiAI.

Gli obiettivi sono:

* mantenere qualità del codice;
* facilitare collaborazione;
* proteggere l'architettura;
* garantire evoluzione controllata.

---

# 2. Filosofia contributiva

RumiAI incoraggia contributi che migliorano:

* funzionalità;
* affidabilità;
* sicurezza;
* documentazione;
* esperienza sviluppatori.

---

# 3. Tipologie di contributo

Sono accettati:

```text
Feature

Bug Fix

Documentation

Testing

Security Improvement

Performance Improvement

Plugin

Integration
```

---

# 4. Prima di iniziare

Prima di sviluppare:

1. verificare issue esistenti;
2. comprendere architettura coinvolta;
3. controllare documentazione;
4. valutare impatto modifica.

---

# 5. Issue Management

Ogni modifica significativa deve partire da una issue.

Una issue deve contenere:

```text
Problem

Context

Expected Behavior

Possible Solution

Impact
```

---

# 6. Feature Proposal

Le nuove funzionalità importanti richiedono una proposta.

La proposta deve descrivere:

* motivazione;
* architettura coinvolta;
* vantaggi;
* rischi;
* alternative considerate.

---

# 7. Architectural Decision

Le modifiche che impattano architettura richiedono una decisione documentata.

Formato:

```text
Decision

Context

Alternatives

Chosen Solution

Consequences
```

---

# 8. Repository Workflow

Il flusso standard:

```text
main

↓

feature branch

↓

development

↓

review

↓

merge
```

---

# 9. Branch Naming

Convenzioni:

```text
feature/nome-funzionalità

fix/nome-correzione

docs/nome-documento

security/nome-intervento
```

---

# 10. Commit Standards

Ogni commit deve essere chiaro.

Formato:

```text
type: description
```

Esempi:

```text
feat: add agent registry

fix: resolve memory timeout

docs: update API guide

security: restrict tool permissions
```

---

# 11. Pull Request

Ogni modifica passa tramite Pull Request.

Una PR deve contenere:

```text
Summary

Changes

Tests

Security Impact

Documentation Update
```

---

# 12. Code Review

La revisione verifica:

* correttezza;
* leggibilità;
* sicurezza;
* test;
* compatibilità.

---

# 13. Review Checklist

Prima dell'approvazione:

```text
□ Code follows standards

□ Tests included

□ Documentation updated

□ No secrets exposed

□ Security impact evaluated
```

---

# 14. Modifiche al Core

Le modifiche a:

* kernel;
* runtime;
* sicurezza;
* memoria;

richiedono revisione aggiuntiva.

---

# 15. Contributi AI

Le modifiche relative agli agenti devono specificare:

* modello utilizzato;
* comportamento atteso;
* limiti;
* valutazione qualità.

---

# 16. Nuovi Agenti

Un nuovo agente deve definire:

```text
Agent Name

Purpose

Capabilities

Permissions

Tools

Evaluation Criteria
```

---

# 17. Nuovi Tool

Ogni nuovo strumento deve includere:

```text
Manifest

Input Schema

Output Schema

Permissions

Risk Level

Tests
```

---

# 18. Nuovi Plugin

Un plugin deve fornire:

```text
plugin.yaml

Source Code

Documentation

Tests

Security Declaration
```

---

# 19. Documentazione

Ogni contributo deve aggiornare la documentazione relativa.

Esempi:

* nuova API → aggiornare API docs;
* nuovo servizio → aggiornare architettura;
* nuova configurazione → aggiornare configuration docs.

---

# 20. Testing Requirements

Una modifica non può essere integrata senza:

* test automatici;
* verifica regressioni;
* validazione funzionale.

---

# 21. Security Review

Richiede revisione sicurezza se modifica:

* autenticazione;
* autorizzazioni;
* dati personali;
* strumenti esterni;
* esecuzione codice.

---

# 22. Performance Review

Necessaria per modifiche che riguardano:

* LLM;
* database;
* retrieval;
* workflow complessi.

---

# 23. Backward Compatibility

Quando possibile:

* mantenere compatibilità;
* documentare breaking changes;
* fornire migrazione.

---

# 24. Deprecation Process

Una funzionalità rimossa deve:

1. essere dichiarata deprecated;
2. avere documentazione;
3. avere periodo di transizione.

---

# 25. Community Guidelines

I contributi devono rispettare:

* comunicazione costruttiva;
* rispetto tecnico;
* collaborazione.

---

# 26. Issue Labels

Categorie previste:

```text
bug

feature

security

documentation

performance

architecture

question
```

---

# 27. Release Contribution Flow

Schema:

```text
Contribution

↓

Review

↓

Integration

↓

Testing

↓

Release Candidate

↓

Release
```

---

# 28. Contributor Recognition

I contributori possono essere riconosciuti tramite:

* changelog;
* release notes;
* documentazione progetto.

---

# 29. Foundation Requirements

Prima versione:

```text
Issue Process

+

Pull Request Workflow

+

Code Review

+

Testing Rules

+

Security Review
```

---

# 30. Evoluzione futura

Possibili estensioni:

* governance community;
* maintainer program;
* plugin marketplace;
* contributor automation.

---

# 31. Stato documento

Versione:

0.1

Status:

Processo contributivo definito.

Prossimo passo:

Definizione della documentazione API completa di RumiAI.
