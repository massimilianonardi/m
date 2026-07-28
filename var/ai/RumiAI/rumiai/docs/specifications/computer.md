# RumiAI ComputerUse Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il ComputerUse Subsystem fornisce a RumiAI la capacità di interagire con un ambiente informatico tramite interfacce grafiche e dispositivi virtuali.

Il sottosistema permette agli agenti di:

* osservare lo schermo;
* identificare elementi visivi;
* controllare mouse;
* simulare tastiera;
* interagire con applicazioni desktop;
* eseguire attività prive di API strutturate.

---

# 2. Principio fondamentale

## ComputerUse come ultima interfaccia

RumiAI deve preferire sempre interfacce più strutturate quando disponibili.

Ordine preferenziale:

```text id="f2h8qy"
API strutturata

↓

Browser DOM

↓

Command Line

↓

ComputerUse GUI
```

ComputerUse deve essere utilizzato quando:

* non esistono API disponibili;
* l'applicazione è esclusivamente grafica;
* è necessario replicare un'interazione umana.

---

# 3. Obiettivi

Il ComputerUse Subsystem deve fornire:

* acquisizione dello stato visivo;
* controllo input;
* riconoscimento elementi;
* gestione coordinate;
* automazione GUI;
* isolamento ambiente;
* sicurezza operativa.

---

# 4. Non responsabilità

Il ComputerUse Subsystem NON deve:

* decidere gli obiettivi dell'agente;
* pianificare workflow;
* autorizzare operazioni;
* sostituire il Browser Subsystem;
* bypassare meccanismi di sicurezza.

---

# 5. Architettura interna

Struttura prevista:

```text id="2k7q8z"
computer/

├── contracts/

├── perception/

├── vision/

├── input/

├── automation/

├── environment/

├── security/

└── tests/
```

---

# 6. Concetti principali

## Computer Environment

Rappresenta l'ambiente operativo.

Può essere:

* desktop Linux;
* macchina virtuale;
* container grafico;
* sessione remota.

Attributi:

```text id="9k0v4s"
id

type

resolution

status

permissions
```

---

# 7. Perception Layer

Il livello di percezione acquisisce informazioni sull'ambiente.

Responsabilità:

* screenshot;
* analisi immagini;
* riconoscimento elementi;
* OCR.

Input:

```text id="h8w5x0"
Schermo
```

Output:

```text id="r7s3qn"
Elementi riconosciuti

Coordinate

Testo

Metadata
```

---

# 8. Vision System

Il Vision System permette di comprendere lo stato grafico.

Possibili capacità:

```text id="3x5b7m"
detect_objects

detect_text

locate_element

compare_images
```

Tecnologie future possibili:

* modelli vision locali;
* OCR;
* computer vision classica.

---

# 9. Input Controller

Gestisce dispositivi virtuali.

Capability previste:

```text id="c5n8aa"
move_mouse

click

double_click

drag

type_text

press_key
```

---

# 10. Modello Action

Ogni azione deve essere rappresentata esplicitamente.

Esempio:

```json id="a4s9s1"
{
  "action": "click",
  "target": {
    "x": 450,
    "y": 300
  }
}
```

Le azioni non devono essere eseguite direttamente dall'agente.

---

# 11. Computer Session

Ogni interazione deve appartenere a una sessione.

Modello:

```text id="8z5kq1"
ComputerSession

id

owner

environment

created_at

permissions

status
```

---

# 12. Interfacce principali

## ComputerProvider

```python id="b9f2mw"
class ComputerProvider:

    screenshot()

    mouse_move(x,y)

    click()

    type_text(text)

    press_key(key)
```

---

## VisionProvider

```python id="k5j8rx"
class VisionProvider:

    analyze(image)

    locate(element)

    extract_text(image)
```

---

## ActionExecutor

```python id="7h2p4n"
class ActionExecutor:

    execute(action)
```

---

# 13. Flusso operativo

Esempio:

Richiesta:

```text id="s8j4q3"
"Apri l'applicazione e configura il parametro X"
```

Flusso:

```text id="4f9q8m"
Agent

↓

Workflow

↓

Computer Capability

↓

Security Check

↓

Screenshot

↓

Vision Analysis

↓

Action Planning

↓

User/Input Action

↓

Verification

↓

Result
```

---

# 14. Verifica delle azioni

Ogni azione deve essere verificata.

Esempio:

```text id="m5v7k9"
Click richiesto

↓

Esecuzione click

↓

Nuovo screenshot

↓

Verifica cambiamento
```

Questo evita automazioni cieche.

---

# 15. Sicurezza

ComputerUse è una capability ad alto rischio.

Deve supportare:

* sandbox;
* conferma utente;
* limiti operativi;
* registrazione completa;
* isolamento ambiente.

---

# 16. Human Approval

Operazioni sensibili richiedono approvazione.

Esempi:

* cancellazione file;
* invio messaggi;
* modifiche configurazione;
* installazione software.

Flusso:

```text id="f9x3w7"
Action Proposed

↓

Approval Required

↓

User Confirmation

↓

Execution
```

---

# 17. Integrazione con Tool Subsystem

ComputerUse viene esposto come capability.

Esempio:

```yaml id="w8c5v2"
capability:

  computer_click:

    provider:
      computer-plugin
```

---

# 18. Integrazione con Browser Subsystem

Browser e ComputerUse possono collaborare.

Esempio:

```text id="n3s6qa"
Browser:

trova elemento DOM


ComputerUse:

interagisce visivamente
```

Il Browser rimane preferibile quando possibile.

---

# 19. Configurazione

File:

```text id="r6z9km"
configs/computer.yaml
```

Esempio:

```yaml id="p4m7x8"
computer:

  enabled: false

  require_confirmation: true

  max_actions_per_task: 100
```

---

# 20. Eventi prodotti

Eventi previsti:

```text id="q2v8mz"
ComputerSessionCreated

ScreenshotCaptured

VisionAnalysisCompleted

ActionStarted

ActionCompleted

ActionFailed

ApprovalRequired
```

---

# 21. Logging

Ogni azione deve registrare:

```text id="w4n6pt"
timestamp

session

action

target

result

duration
```

Gli screenshot devono essere gestiti secondo policy privacy.

---

# 22. Test richiesti

## Unit Test

Testare:

* action model;
* validation;
* permission handling.

---

## Integration Test

Verificare:

* acquisizione screenshot;
* simulazione input;
* verifica risultato.

---

## Security Test

Verificare:

* blocco azioni non autorizzate;
* richiesta approvazione;
* isolamento ambiente.

---

## Scenario Test

Esempio:

```text id="j8s2vk"
L'agente deve compilare
un'applicazione grafica.

Il sistema deve:

- osservare lo schermo;
- identificare elementi;
- eseguire azioni;
- verificare risultato.
```

---

# 23. Evoluzione futura

Possibili estensioni:

* agenti multimodali;
* modelli vision locali;
* apprendimento delle procedure;
* desktop remoto;
* ambienti virtualizzati dedicati;
* registrazione e riproduzione workflow.

---

# 24. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Security Subsystem.
