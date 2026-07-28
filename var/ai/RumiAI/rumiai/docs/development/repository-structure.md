# RumiAI Repository Structure Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Questo documento definisce la struttura ufficiale del repository RumiAI.

Gli obiettivi sono:

* organizzazione coerente del codice;
* separazione dei componenti;
* facilitazione dello sviluppo;
* supporto a deployment futuri.

---

# 2. Principi organizzativi

Il repository deve garantire:

* chiarezza;
* modularità;
* indipendenza dei componenti;
* scalabilità.

---

# 3. Root Repository

Struttura principale:

```text
rumiai/

├── src/

├── agents/

├── core/

├── memory/

├── knowledge/

├── tools/

├── models/

├── api/

├── infrastructure/

├── scripts/

├── configs/

├── tests/

├── docs/

├── examples/

└── README.md
```

---

# 4. Directory src

Contiene codice applicativo condiviso.

Struttura:

```text
src/

├── runtime/

├── services/

├── common/

└── utilities/
```

---

# 5. Core Module

Responsabilità:

* kernel;
* orchestrazione;
* eventi;
* configurazione runtime.

Struttura:

```text
core/

├── kernel/

├── event_bus/

├── scheduler/

└── runtime/
```

---

# 6. Agent Module

Contiene il sistema agentico.

Struttura:

```text
agents/

├── base/

├── planner/

├── executor/

├── specialist/

└── registry/
```

---

# 7. Memory Module

Gestisce memoria persistente.

Struttura:

```text
memory/

├── storage/

├── retrieval/

├── policies/

└── tests/
```

---

# 8. Knowledge Module

Gestisce conoscenza e RAG.

Struttura:

```text
knowledge/

├── ingestion/

├── embeddings/

├── retrieval/

├── graph/

└── governance/
```

---

# 9. Tools Module

Contiene strumenti utilizzabili dagli agenti.

Struttura:

```text
tools/

├── browser/

├── terminal/

├── filesystem/

├── automation/

└── registry/
```

---

# 10. Models Module

Gestisce modelli AI.

Struttura:

```text
models/

├── adapters/

├── providers/

├── configuration/

└── evaluation/
```

---

# 11. API Module

Espone interfacce esterne.

Struttura:

```text
api/

├── http/

├── websocket/

├── schemas/

└── authentication/
```

---

# 12. Infrastructure Directory

Contiene automazione infrastrutturale.

Struttura:

```text
infrastructure/

├── docker/

├── deployment/

├── environments/

└── provisioning/
```

---

# 13. Scripts Directory

Contiene script POSIX.

Struttura:

```text
scripts/

├── install.sh

├── configure.sh

├── start.sh

├── stop.sh

├── backup.sh

└── healthcheck.sh
```

---

# 14. Configuration Directory

Contiene configurazioni non sensibili.

Struttura:

```text
configs/

├── development/

├── testing/

└── production/
```

---

# 15. Secrets Separation

I segreti non devono trovarsi in:

```text
configs/
```

Devono essere forniti tramite:

* Secret Manager;
* environment variables;
* vault.

---

# 16. Tests Directory

Struttura:

```text
tests/

├── unit/

├── integration/

├── system/

├── security/

├── performance/

└── evaluation/
```

---

# 17. Documentation Directory

Struttura:

```text
docs/

├── architecture/

├── specifications/

├── security/

├── operations/

├── development/

└── roadmap/
```

---

# 18. Examples Directory

Contiene esempi:

```text
examples/

├── agents/

├── workflows/

├── plugins/

└── integrations/
```

---

# 19. Plugin Structure

I plugin esterni seguono:

```text
plugins/

plugin_name/

├── manifest.yaml

├── src/

├── tests/

└── README.md
```

---

# 20. File obbligatori

Ogni modulo deve contenere:

```text
README.md

LICENSE

tests/

documentation reference
```

---

# 21. Dependency Management

Le dipendenze sono definite centralmente.

Esempio:

```text
requirements/

├── base.txt

├── development.txt

└── production.txt
```

---

# 22. Version Management

Repository:

```text
VERSION

CHANGELOG.md

RELEASE_NOTES.md
```

---

# 23. Development Workflow

Flusso:

```text
Feature Branch

↓

Implementation

↓

Tests

↓

Review

↓

Merge
```

---

# 24. Build Artifacts

Gli artefatti generati non devono essere versionati.

Esempi:

```text
build/

dist/

cache/

temporary files
```

---

# 25. Repository Security

Il repository deve utilizzare:

* scansione segreti;
* controllo dipendenze;
* firma release.

---

# 26. Documentation Rules

Ogni nuova funzionalità deve aggiornare:

* codice;
* test;
* documentazione.

---

# 27. Future Scalability

La struttura deve supportare:

* installazione locale;
* server dedicato;
* container;
* cluster distribuiti.

---

# 28. Foundation Repository Layout

Versione iniziale:

```text
rumiai/

├── core/

├── agents/

├── memory/

├── knowledge/

├── tools/

├── api/

├── scripts/

├── configs/

├── tests/

└── docs/
```

---

# 29. Stato documento

Versione:

0.1

Status:

Struttura repository definita.

Prossimo passo:

Definizione della guida per contributori RumiAI.
