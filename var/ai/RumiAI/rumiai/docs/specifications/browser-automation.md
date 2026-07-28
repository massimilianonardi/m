# RumiAI Browser Automation & Web Interaction Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Browser Automation & Web Interaction Subsystem permette agli agenti RumiAI di interagire con applicazioni web e contenuti online attraverso un browser controllato.

Il sottosistema gestisce:

* apertura pagine web;
* navigazione;
* interazione elementi;
* estrazione dati;
* gestione sessioni browser;
* automazione procedure web.

---

# 2. Principio fondamentale

## Controlled Browser Interaction

L'agente non controlla direttamente un browser.

Modello errato:

```text
Agent

↓

Browser
```

Modello corretto:

```text
Agent

↓

Tool Manager

↓

Browser Controller

↓

Browser Instance
```

---

# 3. Obiettivi

Il sistema deve fornire:

* navigazione automatizzata;
* controllo elementi pagina;
* estrazione informazioni;
* gestione autenticazioni;
* isolamento sessioni;
* registrazione attività.

---

# 4. Non responsabilità

Il Browser Automation Subsystem NON deve:

* bypassare autenticazioni;
* aggirare sistemi di sicurezza;
* eseguire azioni critiche senza autorizzazione;
* sostituire il ComputerUse Layer.

---

# 5. Architettura interna

Struttura prevista:

```text
browser/

├── controller/

├── drivers/

├── sessions/

├── navigation/

├── extraction/

├── actions/

├── security/

├── snapshots/

└── tests/
```

---

# 6. Browser Engine

Il sistema deve supportare browser automatizzabili.

Implementazione Foundation prevista:

```text
Playwright
```

Possibili alternative:

```text
Selenium

WebDriver
```

---

# 7. Browser Instance Model

Ogni sessione utilizza un'istanza isolata.

Modello:

```text
Browser Instance

id

engine

profile

cookies

storage

status
```

---

# 8. Browser Session

Una sessione rappresenta un ambiente persistente.

Contiene:

* cookie;
* local storage;
* autenticazioni;
* cronologia;
* configurazioni.

Esempio:

```text
User Session

|

Browser Context

|

Pages
```

---

# 9. Navigation Layer

Gestisce:

* apertura URL;
* redirect;
* caricamento pagina;
* timeout.

Interfaccia:

```python
class BrowserNavigator:

    open(url)

    back()

    forward()

    refresh()
```

---

# 10. Page Interaction

Il sistema deve supportare azioni sugli elementi.

Esempi:

```text
click

type

select

scroll

upload

download
```

---

# 11. Element Identification

Gli elementi possono essere individuati tramite:

```text
CSS Selector

XPath

Accessibility Label

Text Locator
```

Priorità consigliata:

```text
Accessibility

↓

Semantic Locator

↓

CSS/XPath
```

---

# 12. Extraction Layer

Permette recupero informazioni.

Esempi:

* testo;
* tabelle;
* metadata;
* immagini;
* link.

Modello:

```text
Web Page

↓

Extractor

↓

Structured Data
```

---

# 13. Structured Extraction

L'output deve essere normalizzato.

Esempio:

```json
{
 "title": "",
 "content": "",
 "links": []
}
```

---

# 14. Browser Actions

Ogni azione deve essere rappresentata.

Modello:

```text
BrowserAction

id

session

action

target

parameters

timestamp
```

---

# 15. Authentication Management

Il sistema deve supportare:

* profili browser;
* cookie persistenti;
* session restore.

Le credenziali non devono essere salvate direttamente nei file di configurazione.

---

# 16. Security Model

Ogni sessione browser deve avere:

* permessi;
* dominio consentiti;
* limiti operativi.

Esempio:

```yaml
browser:

  allowed_domains:

    - example.com


  downloads:

    enabled: false
```

---

# 17. Domain Policy

Il sistema deve poter limitare:

* domini visitabili;
* azioni consentite;
* durata sessione.

---

# 18. Human Approval

Operazioni sensibili possono richiedere conferma.

Esempi:

* invio moduli;
* acquisti;
* modifica dati;
* pubblicazioni.

Flusso:

```text
Agent

↓

Browser Action

↓

Approval

↓

Execution
```

---

# 19. Screenshot e Snapshot

Il sistema deve poter salvare:

* screenshot;
* HTML;
* stato pagina.

Utilità:

* debugging;
* audit;
* ComputerUse futuro.

---

# 20. ComputerUse Integration

Il Browser Automation Layer prepara il contesto per ComputerUse.

Schema:

```text
Browser Automation

        |

DOM + Stato Pagina

        |

ComputerUse

        |

Vision + Mouse + Keyboard
```

---

# 21. Knowledge Integration

Le informazioni raccolte possono alimentare RAG.

Flusso:

```text
Web Page

↓

Extraction

↓

Document

↓

Knowledge Pipeline

↓

Vector Storage
```

---

# 22. Observability Integration

Devono essere registrati:

* URL visitati;
* azioni;
* tempi;
* errori;
* screenshot.

Eventi:

```text
BrowserOpened

PageLoaded

ActionExecuted

ExtractionCompleted

BrowserClosed
```

---

# 23. API Integration

Interfacce previste:

```text
POST /browser/session

POST /browser/navigate

POST /browser/action

GET /browser/state

DELETE /browser/session
```

---

# 24. Configuration

File:

```text
configs/browser.yaml
```

Esempio:

```yaml
browser:

  engine: playwright


  timeout:

    seconds: 30


  headless:

    true
```

---

# 25. Podman Integration

Il browser deve poter essere eseguito isolato.

Schema:

```text
rumiai-core

        |

browser container

        |

Chromium Instance
```

Vantaggi:

* isolamento;
* riproducibilità;
* sicurezza.

---

# 26. Implementazione Foundation

Prima versione:

```text
Playwright

+

Chromium

+

Browser Controller

+

Session Manager

+

Audit Logging
```

---

# 27. Test richiesti

## Unit Test

Verificare:

* navigazione;
* parsing;
* gestione sessione.

---

## Integration Test

Scenario:

```text
Agent

↓

Browser Tool

↓

Pagina Web

↓

Extraction

↓

Result
```

---

## Security Test

Verificare:

* dominio bloccato;
* azione non autorizzata;
* perdita sessione.

---

# 28. Scenario operativo

Richiesta:

```text
"Cerca informazioni sul progetto RumiAI"
```

Flusso:

```text
Agent

↓

Browser Request

↓

Navigate

↓

Extract Content

↓

Knowledge Pipeline

↓

Answer
```

---

# 29. Evoluzione futura

Possibili estensioni:

* browser multimodale;
* visione artificiale;
* agenti web specialistici;
* automazione workflow complessi;
* integrazione ComputerUse completa.

---

# 30. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del ComputerUse Runtime Subsystem.
