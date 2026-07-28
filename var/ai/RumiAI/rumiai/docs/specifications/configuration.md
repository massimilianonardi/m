# RumiAI Configuration Management Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Configuration Management Subsystem gestisce la definizione, il caricamento e la validazione delle configurazioni utilizzate da RumiAI.

Il sistema permette di configurare:

* componenti core;
* agenti;
* modelli LLM;
* plugin;
* strumenti;
* sicurezza;
* storage;
* ambienti operativi.

---

# 2. Principio fondamentale

## Configuration as Code

La configurazione deve essere:

* versionabile;
* riproducibile;
* verificabile;
* separata dal codice.

Esempio:

```text id="v6g3bx"
Repository

├── src/

├── configs/

│   ├── development/

│   ├── testing/

│   └── production/

└── docs/
```

---

# 3. Obiettivi

Il sistema deve fornire:

* caricamento configurazioni;
* validazione schema;
* gestione ambienti;
* override;
* configurazione dinamica;
* sicurezza dei parametri sensibili.

---

# 4. Non responsabilità

Il Configuration Subsystem NON deve:

* modificare automaticamente configurazioni critiche;
* gestire segreti in chiaro;
* decidere policy operative;
* sostituire il Security Subsystem.

---

# 5. Architettura interna

Struttura prevista:

```text id="k9v4qm"
configuration/

├── loader/

├── schema/

├── validator/

├── providers/

├── secrets/

├── environment/

└── tests/
```

---

# 6. Configuration Sources

RumiAI può ottenere configurazioni da diverse fonti.

Priorità prevista:

```text id="6r8p1x"
1. Runtime Environment Variables

↓

2. Secret Provider

↓

3. Configuration Files

↓

4. Default Values
```

---

# 7. Configuration Files

Struttura prevista:

```text id="a7f2nq"
configs/

├── rumiai.yaml

├── agents.yaml

├── llm.yaml

├── tools.yaml

├── security.yaml

├── plugins.yaml

└── observability.yaml
```

---

# 8. Main Configuration

File principale:

```text id="m5x8q1"
configs/rumiai.yaml
```

Esempio:

```yaml id="7p3v5m"
rumiai:

  environment: development


  components:

    agent_runtime: enabled

    workflow: enabled

    browser: disabled


  observability:

    enabled: true
```

---

# 9. Environment Management

RumiAI supporta ambienti separati.

Esempio:

```text id="8d4q9z"
development

↓

testing

↓

production
```

Ogni ambiente può avere:

* configurazione propria;
* livelli log diversi;
* policy diverse;
* modelli diversi.

---

# 10. Configuration Override

Le configurazioni possono essere sovrascritte.

Esempio:

Base:

```yaml id="z6n2pm"
llm:

  temperature: 0.7
```

Override:

```yaml id="w8q5kx"
llm:

  temperature: 0.2
```

---

# 11. Schema Validation

Ogni configurazione deve essere validata.

Esempio:

```text id="4t8m2q"
Load Config

↓

Validate Schema

↓

Accept

or

Reject
```

Possibili tecnologie:

* JSON Schema;
* Pydantic;
* YAML Schema.

---

# 12. Configuration Model

Ogni componente espone un proprio modello.

Esempio:

```python id="m7q3zs"
class LLMConfig:

    provider

    model

    temperature

    timeout
```

---

# 13. Secret Management

I dati sensibili non devono stare nei file.

Esempio errato:

```yaml id="z2m6hx"
api_key:

  value: "secret123"
```

Esempio corretto:

```yaml id="n5r8kc"
api_key:

  reference:

    secret://llm/provider/key
```

---

# 14. Configurazione Podman

La configurazione deve integrarsi con i container.

Esempio:

```text id="4x8q9m"
Host

|

configs/

|

Container Volume Mount

|

/app/config
```

---

# 15. Reload Configuration

Alcuni parametri possono essere aggiornati dinamicamente.

Esempi:

* livello log;
* feature flag;
* plugin attivi.

Altri richiedono riavvio:

* modello LLM;
* database;
* rete.

---

# 16. Feature Flags

RumiAI supporta funzionalità sperimentali.

Esempio:

```yaml id="w4s7zn"
features:

  experimental_computeruse:

    enabled: false
```

---

# 17. Configuration API

Interfaccia prevista:

```python id="j8m4vy"
class ConfigurationManager:

    load()

    validate()

    get()

    reload()

    update()
```

---

# 18. Eventi prodotti

Eventi previsti:

```text id="s5v8nx"
ConfigurationLoaded

ConfigurationValidated

ConfigurationChanged

ConfigurationReloaded

ConfigurationError
```

---

# 19. Integrazione con altri sottosistemi

## Agent Runtime

Riceve:

* agent configuration;
* capability;
* memoria associata.

---

## LLM Subsystem

Riceve:

* provider;
* modello;
* parametri.

---

## Plugin System

Riceve:

* plugin abilitati;
* configurazioni plugin.

---

## Security

Riceve:

* policy;
* permessi;
* restrizioni.

---

# 20. Configurazione minima Foundation

La prima versione deve supportare:

```text id="7c2m5p"
YAML Files

+

Environment Variables

+

Schema Validation
```

---

# 21. Test richiesti

## Unit Test

Testare:

* parsing YAML;
* validazione;
* override.

---

## Integration Test

Verificare:

* caricamento configurazione completa;
* avvio sistema.

---

## Scenario Test

Esempio:

```text id="q8n4mz"
Cambiare modello LLM.

Il sistema deve:

- leggere nuova configurazione;
- validarla;
- aggiornare provider;
- registrare evento.
```

---

# 22. Evoluzione futura

Possibili estensioni:

* configurazione tramite UI;
* configuration registry;
* gestione cluster;
* sincronizzazione distribuita;
* GitOps;
* gestione segreti avanzata.

---

# 23. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Data Storage Subsystem.
