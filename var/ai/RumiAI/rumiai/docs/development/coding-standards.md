# RumiAI Coding Standards Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Questo documento definisce gli standard di sviluppo software per RumiAI.

Gli obiettivi sono:

* mantenere qualità del codice;
* facilitare collaborazione;
* ridurre errori;
* garantire manutenibilità.

---

# 2. Principi fondamentali

Il codice RumiAI deve essere:

## Semplice

La soluzione più semplice compatibile con i requisiti è preferibile.

---

## Esplicito

Il comportamento deve essere facilmente comprensibile.

---

## Modulare

Ogni componente deve avere responsabilità chiare.

---

## Testabile

Ogni funzionalità significativa deve poter essere verificata.

---

# 3. Linguaggi ufficiali

La Foundation Release prevede:

## Python

Utilizzo:

* AI runtime;
* agenti;
* pipeline dati;
* backend;
* automazioni.

---

## Shell POSIX

Utilizzo:

* bootstrap;
* installazione;
* manutenzione;
* deployment.

---

## YAML

Utilizzo:

* configurazioni;
* workflow;
* definizione servizi.

---

## Markdown

Utilizzo:

* documentazione;
* specifiche;
* decisioni architetturali.

---

# 4. Struttura del codice

Ogni modulo deve avere responsabilità singola.

Esempio:

```text
component/

├── __init__.py

├── service.py

├── models.py

├── config.py

├── tests/

└── README.md
```

---

# 5. Naming Convention

## File

Utilizzare:

```text
snake_case
```

Esempio:

```text
memory_manager.py
```

---

## Classi

Utilizzare:

```text
PascalCase
```

Esempio:

```python
MemoryManager
```

---

## Funzioni

Utilizzare:

```text
snake_case
```

Esempio:

```python
load_memory()
```

---

## Costanti

Utilizzare:

```text
UPPER_CASE
```

Esempio:

```python
MAX_CONTEXT_SIZE
```

---

# 6. Modularità

Evitare:

* file troppo grandi;
* dipendenze circolari;
* logica duplicata.

Preferire:

```text
Small Modules

↓

Clear Interfaces

↓

Easy Testing
```

---

# 7. Separazione responsabilità

Separare:

```text
Business Logic

≠

Infrastructure

≠

Configuration

≠

User Interface
```

---

# 8. Gestione configurazioni

Mai inserire configurazioni operative nel codice.

Errato:

```python
API_KEY="secret"
```

Corretto:

```python
config.get_secret()
```

---

# 9. Gestione errori

Gli errori devono:

* essere espliciti;
* essere registrati;
* non nascondere problemi.

Esempio:

```python
try:
    execute_task()
except TaskError as error:
    logger.error(error)
    raise
```

---

# 10. Logging

Il logging deve essere strutturato.

Livelli:

```text
DEBUG

INFO

WARNING

ERROR

CRITICAL
```

Mai utilizzare:

```python
print()
```

per diagnostica permanente.

---

# 11. Type Hints

Il codice Python deve utilizzare annotazioni di tipo.

Esempio:

```python
def load_memory(
    user_id: str
) -> Memory:
    ...
```

---

# 12. Documentazione codice

Ogni modulo pubblico deve avere documentazione.

Esempio:

```python
def search_documents(query):
    """
    Recupera documenti rilevanti.
    """
```

---

# 13. Commenti

I commenti devono spiegare:

* perché una scelta esiste;
* vincoli particolari;
* decisioni architetturali.

Non devono descrivere semplicemente il codice.

---

# 14. Dipendenze

Le dipendenze devono essere:

* dichiarate;
* versionate;
* periodicamente aggiornate.

---

# 15. Gestione versioni

Ogni componente importante deve avere:

* versione;
* changelog;
* compatibilità dichiarata.

---

# 16. Git Workflow

Il progetto utilizza:

```text
main

↓

feature branch

↓

review

↓

merge
```

---

# 17. Commit Standards

I commit devono essere descrittivi.

Formato:

```text
type: description
```

Esempi:

```text
feat: add memory indexing

fix: repair agent timeout

docs: update architecture
```

---

# 18. Code Review

Ogni modifica significativa deve essere verificata.

Controlli:

* qualità;
* sicurezza;
* test;
* compatibilità.

---

# 19. AI-Specific Coding Rules

Il codice che gestisce AI deve esplicitare:

* modello utilizzato;
* parametri;
* limiti;
* comportamento atteso.

---

# 20. Agent Code Standards

Gli agenti devono separare:

```text
Reasoning

↓

Planning

↓

Execution

↓

Validation
```

---

# 21. Tool Integration Standards

Ogni tool deve definire:

```text
Name

Description

Input Schema

Output Schema

Permissions

Risk Level
```

---

# 22. Memory Code Standards

Ogni accesso memoria deve rispettare:

* ownership;
* privacy;
* retention policy.

---

# 23. Async Programming

Quando necessario utilizzare:

* task asincroni;
* code;
* event loop.

Evitare blocchi inutili.

---

# 24. Security Coding Rules

Il codice deve evitare:

* segreti hardcoded;
* input non validati;
* privilegi eccessivi.

---

# 25. Testing Requirements

Ogni nuova funzionalità deve includere:

* unit test;
* test integrazione quando necessario;
* documentazione.

---

# 26. Performance Guidelines

Ottimizzare solo dopo misurazione.

Evitare:

* premature optimization;
* complessità inutile.

---

# 27. Compatibility

Le modifiche devono considerare:

* versioni precedenti;
* dati esistenti;
* configurazioni.

---

# 28. Deprecation Policy

Le funzionalità obsolete devono essere:

1. marcate deprecated;
2. documentate;
3. rimosse dopo periodo definito.

---

# 29. Quality Checklist

Prima del merge:

```text
Code Review

+

Tests Passed

+

Documentation Updated

+

Security Checked
```

---

# 30. Foundation Implementation

Prima versione:

```text
Python Standards

+

POSIX Shell Rules

+

Git Workflow

+

Review Process

+

Testing Requirements
```

---

# 31. Evoluzione futura

Possibili estensioni:

* static analysis automatica;
* AI code reviewer;
* generazione documentazione automatica;
* policy enforcement nel repository.

---

# 32. Stato documento

Versione:

0.1

Status:

Standard sviluppo definiti.

Prossimo passo:

Definizione della struttura ufficiale del repository RumiAI.
