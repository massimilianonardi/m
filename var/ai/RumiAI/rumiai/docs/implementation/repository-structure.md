# RumiAI Repository Structure

Versione: 0.1
Stato: Implementation Phase Draft

---

# 1. Scopo

Questo documento definisce la struttura standard del repository RumiAI.

Obiettivi:

* organizzare il codice;
* separare responsabilità;
* facilitare sviluppo;
* supportare crescita del progetto.

---

# 2. Principi Organizzativi

Il repository deve garantire:

* modularità;
* chiarezza;
* scalabilità;
* manutenzione semplice.

---

# 3. Root Repository

Struttura principale:

```text id="v6m2qx"
rumiai/
```

Contiene tutti i componenti del sistema.

---

# 4. Directory Core

Percorso:

```text id="p8m4qv"
core/
```

Contiene:

* runtime principale;
* logica fondamentale;
* componenti condivisi.

Esempio:

```text id="x4m7mq"
core/

├── runtime/

├── execution/

├── orchestration/

└── common/
```

---

# 5. Directory Agents

Percorso:

```text id="n7q3mx"
agents/
```

Contiene:

* definizioni agenti;
* configurazioni;
* capacità;
* workflow.

Esempio:

```text id="k5m8qx"
agents/

├── base/

├── system/

├── specialized/

└── examples/
```

---

# 6. Directory Services

Percorso:

```text id="r4m9kv"
services/
```

Contiene servizi applicativi:

* API;
* memoria;
* knowledge;
* gestione utenti.

---

# 7. Directory Tools

Percorso:

```text id="c8m2qx"
tools/
```

Contiene integrazioni esterne:

* connector;
* utility;
* adapter.

---

# 8. Directory Models

Percorso:

```text id="w7m3qp"
models/
```

Contiene:

* configurazioni modelli;
* metadata;
* registry.

---

# 9. Directory Memory

Percorso:

```text id="z6m8mv"
memory/
```

Contiene:

* gestione memoria;
* storage adapter;
* strategie recupero.

---

# 10. Directory Configuration

Percorso:

```text id="h5m9qx"
configs/
```

Contiene:

* configurazioni ambiente;
* parametri sistema;
* policy.

---

# 11. Directory Documentation

Percorso:

```text id="u4m7kp"
docs/
```

Contiene:

* architettura;
* guide;
* decisioni ADR;
* specifiche.

---

# 12. Directory Tests

Percorso:

```text id="s8m3qx"
tests/
```

Contiene:

* unit test;
* integration test;
* evaluation test.

---

# 13. Directory Scripts

Percorso:

```text id="a5m8qv"
scripts/
```

Contiene:

* automazioni;
* setup;
* manutenzione.

---

# 14. Directory Deployment

Percorso:

```text id="b7m4qx"
deployment/
```

Contiene:

* container;
* infrastruttura;
* configurazioni produzione.

---

# 15. Separazione Ambienti

Gli ambienti devono essere distinti:

```text id="m3q8vx"
development

testing

staging

production
```

---

# 16. Naming Convention

Regole:

* nomi descrittivi;
* minuscolo;
* separazione tramite trattino o underscore;
* evitare abbreviazioni non documentate.

---

# 17. Version Control

Il repository utilizza:

* branch development;
* revisioni;
* pull request;
* tag release.

---

# 18. Documentazione Obbligatoria

Ogni modulo deve includere:

```text id="q9m4kx"
README

Purpose

Configuration

Usage

Tests
```

---

# 19. Moduli Sperimentali

Gli esperimenti devono essere isolati:

```text id="e6m8qv"
experiments/
```

Non devono influenzare il codice stabile.

---

# 20. Repository Quality Rules

Ogni contributo deve rispettare:

* struttura;
* test;
* documentazione;
* standard codice.

---

# 21. Foundation → Implementation Transition

Questa struttura permette il passaggio da:

```text id="n4m7qx"
Architecture Documents
```

a:

```text id="x9m3kv"
Executable System
```

---

# 22. Stato documento

Versione:

0.1

Status:

Struttura repository definita.

Prossimo passo:

Bootstrap del Core Runtime RumiAI.
