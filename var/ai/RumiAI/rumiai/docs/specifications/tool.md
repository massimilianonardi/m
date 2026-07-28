# RumiAI Tool Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Tool Subsystem fornisce a RumiAI un meccanismo standardizzato per interagire con risorse esterne alla logica dell'agente.

Un Tool rappresenta una capacità operativa che permette al sistema di:

* leggere informazioni;
* modificare dati;
* eseguire operazioni;
* interagire con servizi;
* controllare applicazioni.

Il sottosistema permette agli agenti di utilizzare strumenti mantenendo separati:

* ragionamento;
* autorizzazione;
* esecuzione;
* controllo sicurezza.

---

# 2. Principio fondamentale

## Capability First Design

RumiAI non ragiona direttamente in termini di strumenti.

Il concetto principale è la Capability.

Esempio:

Non:

```text
usa terminale Linux
```

ma:

```text
richiedo:

execute_command
```

Il Kernel decide quale implementazione utilizzare.

---

# 3. Obiettivi

Il Tool Subsystem deve fornire:

* discovery degli strumenti;
* registrazione capability;
* validazione input;
* esecuzione controllata;
* gestione errori;
* logging;
* audit.

---

# 4. Non responsabilità

Il Tool Subsystem NON deve:

* decidere quando usare uno strumento;
* pianificare attività;
* generare testo;
* gestire memoria;
* sostituire il Security Subsystem.

---

# 5. Architettura interna

Struttura prevista:

```text
tools/

├── contracts/

├── registry/

├── execution/

├── validation/

├── permissions/

├── adapters/

└── tests/
```

---

# 6. Concetti principali

## Capability

Rappresenta una capacità astratta.

Esempi:

```text
read_file

write_file

execute_command

search_web

open_browser

take_screenshot

send_notification
```

Una capability descrive cosa può essere fatto, non come.

---

## Tool

È l'implementazione concreta di una capability.

Esempi:

```text
FilesystemTool

TerminalTool

BrowserTool

GitTool

HttpTool
```

---

## Tool Manifest

Ogni tool deve dichiarare le proprie caratteristiche.

Esempio:

```yaml
name: terminal-tool

version: 0.1

capabilities:

  - execute_command

permissions:

  - shell_access
```

---

# 7. Tool Lifecycle

Ogni tool segue un ciclo di vita standard:

```text
Discovered

↓

Validated

↓

Registered

↓

Available

↓

Executing

↓

Stopped
```

---

# 8. Tool Registry

Il Registry mantiene l'elenco delle capability disponibili.

Esempio:

```yaml
capabilities:

  execute_command:

    provider:
      terminal-tool


  read_file:

    provider:
      filesystem-tool
```

Il Registry permette:

* ricerca capability;
* sostituzione implementazioni;
* controllo versioni.

---

# 9. Interfacce principali

## Tool Interface

Contratto base:

```python
class Tool:

    metadata()

    capabilities()

    execute(request)

    health()
```

---

## Capability Interface

```python
class Capability:

    name()

    description()

    schema()
```

---

## Tool Request

Descrive una richiesta.

Contiene:

```text
id

capability

parameters

requester

security_context
```

---

## Tool Response

Contiene:

```text
id

status

result

metadata

execution_time
```

---

# 10. Processo di esecuzione

Flusso completo:

```text
Agent

↓

Capability Request

↓

Kernel

↓

Capability Registry

↓

Security Check

↓

Tool Selection

↓

Input Validation

↓

Tool Execution

↓

Result

↓

Audit Event
```

---

# 11. Validazione degli input

Ogni tool deve definire uno schema.

Esempio:

Capability:

```text
execute_command
```

Schema:

```yaml
parameters:

  command:
    type: string

  timeout:
    type: integer
```

Input non valido:

```text
comando mancante
```

deve essere rifiutato prima dell'esecuzione.

---

# 12. Sicurezza

Il Tool Subsystem deve integrarsi con Security Subsystem.

Ogni esecuzione deve avere:

```text
Authentication

↓

Authorization

↓

Execution Policy

↓

Audit
```

---

# 13. Tool iniziali previsti

## Filesystem Tool

Capability:

```text
read_file

write_file

list_directory
```

---

## Terminal Tool

Capability:

```text
execute_command
```

Deve supportare:

* timeout;
* working directory;
* ambiente isolato;
* logging.

---

## HTTP Tool

Capability:

```text
http_request
```

---

## Git Tool

Capability:

```text
git_operation
```

---

## Browser Tool

Capability:

```text
browse

extract_page

screenshot
```

---

# 14. ComputerUse

Il Tool Subsystem sarà la base per ComputerUse.

Capability future:

```text
move_mouse

click

type_text

press_key

capture_screen
```

Implementazione prevista:

```text
ComputerUse Plugin

↓

Tool Interface

↓

Kernel
```

---

# 15. Configurazione

File:

```text
configs/tools.yaml
```

Esempio:

```yaml
tools:

  terminal:

    enabled: true

    timeout: 30


  filesystem:

    allowed_paths:

      - workspace/
```

---

# 16. Eventi prodotti

Eventi previsti:

```text
ToolRegistered

CapabilityAvailable

ToolExecutionStarted

ToolExecutionCompleted

ToolExecutionFailed

PermissionDenied
```

---

# 17. Logging

Ogni esecuzione deve registrare:

```text
timestamp

tool

capability

request_id

user/agent

parameters_hash

result_status

duration
```

I dati sensibili devono poter essere esclusi.

---

# 18. Test richiesti

## Unit Test

Testare:

* registry;
* validation;
* schema handling;
* lifecycle.

---

## Integration Test

Verificare:

* caricamento plugin;
* registrazione capability;
* esecuzione tool.

---

## Security Test

Verificare:

* rifiuto operazioni non autorizzate;
* isolamento risorse;
* audit corretto.

---

## Scenario Test

Esempio:

```text
L'agente deve leggere un file
nella directory workspace.

Il sistema deve:

- autorizzare l'azione;
- usare il tool corretto;
- produrre audit.
```

---

# 19. Evoluzione futura

Possibili estensioni:

* marketplace plugin;
* tool remoti;
* tool distribuiti;
* human approval workflow;
* sandbox avanzata;
* capability dinamiche.

---

# 20. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Memory Subsystem.
