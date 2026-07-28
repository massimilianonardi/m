# RumiAI Plugin System Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Plugin System fornisce a RumiAI un meccanismo standardizzato per estendere le funzionalità del sistema senza modificare il Core.

Il sistema permette di aggiungere:

* nuovi Tool;
* nuovi provider LLM;
* nuovi storage;
* nuovi agenti;
* nuovi connettori;
* nuove capability.

---

# 2. Principio fondamentale

## Extension over Modification

Il comportamento del sistema deve essere esteso tramite plugin.

Principio:

```text
Core stabile

+

Plugin dinamici

=

Sistema evolutivo
```

---

# 3. Obiettivi

Il Plugin System deve fornire:

* discovery plugin;
* caricamento;
* registrazione;
* versionamento;
* configurazione;
* isolamento;
* lifecycle management.

---

# 4. Non responsabilità

Il Plugin System NON deve:

* implementare la logica dei plugin;
* sostituire il Security Subsystem;
* autorizzare automaticamente capability;
* gestire workflow.

---

# 5. Architettura interna

Struttura prevista:

```text
plugins/

├── contracts/

├── manager/

├── registry/

├── loader/

├── metadata/

├── sandbox/

└── tests/
```

---

# 6. Tipologie di Plugin

RumiAI prevede diverse categorie.

---

## 6.1 Tool Plugin

Implementa capability operative.

Esempi:

```text
filesystem-plugin

terminal-plugin

browser-plugin

computer-plugin
```

---

## 6.2 LLM Plugin

Implementa provider linguistici.

Esempi:

```text
ollama-plugin

openai-plugin

llamacpp-plugin

vllm-plugin
```

---

## 6.3 Storage Plugin

Implementa persistenza dati.

Esempi:

```text
sqlite-plugin

lancedb-plugin

filesystem-plugin
```

---

## 6.4 Agent Plugin

Fornisce agenti specializzati.

Esempi:

```text
research-agent

coding-agent

analysis-agent
```

---

## 6.5 Integration Plugin

Collega servizi esterni.

Esempi:

```text
github-plugin

calendar-plugin

notification-plugin
```

---

# 7. Plugin Manifest

Ogni plugin deve dichiarare un manifesto.

Esempio:

```yaml
plugin:

  name: terminal-plugin

  version: 0.1

  type: tool

  capabilities:

    - execute_command

  requirements:

    - python >=3.12
```

---

# 8. Plugin Identity

Ogni plugin deve possedere:

```text
Plugin Identity

id

name

version

author

signature

capabilities
```

---

# 9. Plugin Lifecycle

Il ciclo di vita:

```text
Discovered

↓

Validated

↓

Installed

↓

Loaded

↓

Initialized

↓

Active

↓

Disabled

↓

Removed
```

---

# 10. Plugin Manager

Il Plugin Manager coordina:

* ricerca plugin;
* caricamento;
* configurazione;
* stato.

Interfaccia:

```python
class PluginManager:

    discover()

    install()

    load()

    unload()

    status()
```

---

# 11. Plugin Registry

Il Registry mantiene l'elenco dei plugin disponibili.

Esempio:

```yaml
plugins:

  terminal:

    version: 0.1

    status: active


  browser:

    version: 0.1

    status: disabled
```

---

# 12. Discovery

Il sistema deve poter trovare plugin tramite:

* directory locale;
* package Python;
* repository interno;
* configurazione manuale.

Esempio:

```text
plugins/

├── terminal/

├── browser/

└── lancedb/
```

---

# 13. Plugin Interface

Ogni plugin deve implementare un contratto comune.

Esempio:

```python
class Plugin:

    metadata()

    initialize(context)

    start()

    stop()

    health()
```

---

# 14. Context Injection

I plugin ricevono un contesto controllato.

Esempio:

```text
PluginContext

configuration

logger

event_bus

security_context
```

Il plugin non deve accedere direttamente al sistema.

---

# 15. Security Model

Ogni plugin deve essere valutato.

Controlli:

* origine;
* firma;
* permessi;
* capability richieste;
* dipendenze.

Flusso:

```text
Plugin Install

↓

Security Check

↓

Approval

↓

Load
```

---

# 16. Versionamento

Ogni plugin deve dichiarare compatibilità.

Esempio:

```yaml
plugin:

  requires:

    rumiai_core: ">=0.1,<1.0"
```

---

# 17. Configurazione

File:

```text
configs/plugins.yaml
```

Esempio:

```yaml
plugins:

  enabled:

    - terminal-plugin

    - ollama-plugin


  disabled:

    - experimental-plugin
```

---

# 18. Eventi prodotti

Eventi previsti:

```text
PluginDiscovered

PluginInstalled

PluginLoaded

PluginStarted

PluginStopped

PluginFailed
```

---

# 19. Isolamento

Plugin ad alto rischio devono poter essere eseguiti isolati.

Possibili tecnologie:

* container Podman;
* process isolation;
* sandbox Python;
* microservizi.

---

# 20. Integrazione con Podman

L'architettura prevista è coerente con il deployment attuale.

Esempio:

```text
Pod RumiAI Core

|

Plugin Container

|

Capability Provider
```

Possibili plugin futuri:

```text
rumiai-plugin-browser

rumiai-plugin-lancedb

rumiai-plugin-computeruse
```

---

# 21. Test richiesti

## Unit Test

Testare:

* manifest parsing;
* lifecycle;
* registry.

---

## Integration Test

Verificare:

* installazione plugin;
* caricamento;
* comunicazione con Core.

---

## Security Test

Verificare:

* plugin non autorizzati;
* permessi insufficienti;
* isolamento.

---

## Scenario Test

Esempio:

```text
Installare un nuovo LLM Provider.

Il sistema deve:

- riconoscere il plugin;
- validarlo;
- registrarlo;
- renderlo disponibile agli agenti.
```

---

# 22. Evoluzione futura

Possibili estensioni:

* marketplace plugin;
* firma digitale;
* aggiornamento automatico;
* repository comunitario;
* plugin distribuiti;
* gestione dipendenze avanzata.

---

# 23. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Communication/Event Bus Subsystem.
