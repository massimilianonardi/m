# RumiAI ComputerUse Runtime Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il ComputerUse Runtime Subsystem permette agli agenti RumiAI di interagire con ambienti grafici attraverso percezione visiva e azioni simulate.

Il sottosistema gestisce:

* acquisizione schermo;
* analisi visuale;
* controllo mouse;
* controllo tastiera;
* interazione applicazioni GUI;
* verifica risultati.

---

# 2. Principio fondamentale

## Perception-Action Loop

ComputerUse segue un ciclo continuo:

```text id="h6z9qv"
Observe

↓

Interpret

↓

Plan

↓

Execute

↓

Verify
```

L'agente non deve eseguire azioni alla cieca.

---

# 3. Obiettivi

Il sistema deve fornire:

* controllo applicazioni GUI;
* interazione visuale;
* automazione task complessi;
* recupero da errori;
* tracciamento azioni.

---

# 4. Non responsabilità

Il ComputerUse Subsystem NON deve:

* operare senza autorizzazione su ambienti critici;
* bypassare sistemi di sicurezza;
* sostituire strumenti API quando disponibili;
* eseguire azioni distruttive senza controllo.

---

# 5. Architettura interna

Struttura prevista:

```text id="5hj7pm"
computeruse/

├── perception/

├── vision/

├── planner/

├── actions/

├── controller/

├── safety/

├── state/

└── tests/
```

---

# 6. Componenti principali

## Perception Layer

Responsabile della raccolta informazioni.

Input:

```text id="9p4y3s"
Screenshot

Window State

Cursor Position

Application State
```

Output:

```text id="7y4t9k"
Visual State
```

---

## Vision Layer

Analizza il contenuto dello schermo.

Funzioni:

* riconoscimento elementi;
* localizzazione oggetti;
* lettura testo;
* identificazione finestre.

---

## Planning Layer

Determina le azioni necessarie.

Esempio:

Obiettivo:

```text id="p8b4lm"
Aprire documento
```

Piano:

```text
1. Trova applicazione

2. Clicca menu

3. Inserisci percorso

4. Verifica apertura
```

---

## Action Controller

Esegue azioni.

Azioni supportate:

```text id="t7s4qm"
Mouse Move

Click

Double Click

Keyboard Input

Scroll

Drag & Drop
```

---

# 7. Computer State Model

Lo stato corrente viene rappresentato come:

```text id="h9j2nc"
ComputerState

screen

windows

applications

cursor

focused_element

timestamp
```

---

# 8. Screenshot Management

Gli screenshot devono essere gestiti come dati osservabili.

Funzioni:

* acquisizione;
* compressione;
* confronto;
* archiviazione temporanea.

---

# 9. Vision Provider

Il sistema deve supportare modelli sostituibili.

Possibili implementazioni:

```text id="6v2d9r"
Vision Language Model locale

OpenCV

OCR Engine
```

---

# 10. Action Model

Ogni azione deve essere rappresentata.

Esempio:

```text id="6c9v2x"
ComputerAction

id

type

target

coordinates

parameters

timestamp
```

---

# 11. Action Verification

Ogni azione deve essere verificata.

Esempio:

```text id="9m7s3k"
Click Button

↓

Screenshot

↓

Controllo cambiamento

↓

Conferma successo
```

---

# 12. Safety Layer

Il livello sicurezza controlla:

* applicazione target;
* area dello schermo;
* tipo azione;
* rischio.

---

# 13. Risk Classification

Esempio:

```text id="1q6x8a"
LOW

scroll

lettura


MEDIUM

modifica testo


HIGH

invio dati

cancellazione

acquisti
```

---

# 14. Human Approval

Le azioni ad alto rischio richiedono conferma.

Flusso:

```text id="3h7q1m"
Agent

↓

Computer Action

↓

Risk Evaluation

↓

Human Approval

↓

Execution
```

---

# 15. Integration Browser Automation

ComputerUse completa Browser Automation.

Schema:

```text id="5e2b8z"
Browser Automation

        |

DOM disponibile

        |

ComputerUse

        |

Interazione visuale
```

Strategia:

1. usare API/DOM quando possibile;
2. usare ComputerUse quando necessario.

---

# 16. Integration Terminal Control

ComputerUse può interagire con:

* terminali;
* IDE;
* applicazioni grafiche.

Esempio:

```text id="8p3d7k"
ComputerUse

↓

Terminal Window

↓

Visual Interaction
```

---

# 17. Configuration

File:

```text id="c4x9mz"
configs/computeruse.yaml
```

Esempio:

```yaml id="m2r8va"
computeruse:

  enabled: false


  approval:

    high_risk: true


  screenshot:

    interval: 2
```

---

# 18. Podman Integration

Il runtime può essere isolato.

Schema:

```text id="w5j7na"
RumiAI Core

|

ComputerUse Container

|

Virtual Display

|

Applications
```

Possibili tecnologie:

* Xvfb;
* Wayland virtual session;
* VNC controllato.

---

# 19. Observability

Devono essere registrati:

* screenshot;
* azioni;
* decisioni;
* errori;
* tempi.

Eventi:

```text id="4z8k2m"
ScreenCaptured

ActionPlanned

ActionExecuted

ActionVerified

ActionFailed
```

---

# 20. API Integration

Interfacce previste:

```text id="9m1q5v"
POST /computeruse/session

POST /computeruse/action

GET /computeruse/state

POST /computeruse/approve
```

---

# 21. Implementazione Foundation

Prima versione:

```text id="d7s4yp"
Screenshot Capture

+

Mouse Keyboard Controller

+

Basic Vision

+

Safety Layer

+

Audit Log
```

---

# 22. Test richiesti

## Unit Test

Verificare:

* action model;
* safety rules;
* state management.

---

## Integration Test

Scenario:

```text id="6q1z8h"
Agent

↓

ComputerUse

↓

Open Application

↓

Perform Action

↓

Verify Result
```

---

## Safety Test

Verificare:

* blocco azioni rischiose;
* richiesta approvazione;
* recupero errore.

---

# 23. Scenario operativo

Richiesta:

```text id="1h5x9v"
"Apri il browser e cerca informazioni"
```

Flusso:

```text id="0v8k2s"
Agent

↓

ComputerUse Request

↓

Screenshot

↓

Vision Analysis

↓

Mouse/Keyboard Actions

↓

Verification

↓

Result
```

---

# 24. Evoluzione futura

Possibili estensioni:

* Vision Language Model locali;
* agenti desktop autonomi;
* apprendimento procedure;
* memoria delle interazioni GUI;
* computer agent specializzati.

---

# 25. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Multi-Agent Orchestration Subsystem.
