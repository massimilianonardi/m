# RumiAI Browser Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Browser Subsystem fornisce a RumiAI la capacità di interagire con contenuti web e applicazioni browser-based.

Il sottosistema permette agli agenti di:

* aprire pagine web;
* navigare siti;
* estrarre informazioni;
* interagire con elementi della pagina;
* gestire sessioni;
* acquisire screenshot;
* automatizzare operazioni web.

---

# 2. Principio fondamentale

## Browser Capability, non Browser Automation Script

RumiAI non deve contenere script rigidi di automazione.

Esempio non corretto:

```text
Apri Chrome

Clicca coordinate 500,300

Scrivi testo

Premi invio
```

Esempio corretto:

```text
Capability:

interact_with_web_application

↓

Browser Provider

↓

Azione controllata
```

---

# 3. Obiettivi

Il Browser Subsystem deve fornire:

* gestione browser;
* gestione sessioni;
* isolamento contesti;
* navigazione;
* estrazione contenuti;
* interazione DOM;
* gestione autenticazioni;
* osservabilità.

---

# 4. Non responsabilità

Il Browser Subsystem NON deve:

* decidere quali siti visitare;
* generare autonomamente obiettivi;
* bypassare controlli di sicurezza;
* conservare credenziali senza autorizzazione;
* sostituire il ComputerUse Subsystem.

---

# 5. Architettura interna

Struttura prevista:

```text
browser/

├── contracts/

├── engine/

├── sessions/

├── navigation/

├── extraction/

├── interaction/

├── security/

└── tests/
```

---

# 6. Concetti principali

## Browser Instance

Rappresenta un'istanza browser.

Attributi:

```text
id

engine

status

configuration
```

---

## Browser Context

Rappresenta un ambiente isolato.

Può contenere:

* cookie;
* sessioni;
* storage locale;
* preferenze.

Esempio:

```text
User Context

Agent Context

Temporary Research Context
```

---

## Page

Rappresenta una pagina aperta.

Contiene:

```text
url

title

DOM

metadata
```

---

## Browser Session

Rappresenta una sessione completa.

Esempio:

```text
Login portale aziendale

↓

Navigazione

↓

Estrazione dati

↓

Chiusura sessione
```

---

# 7. Browser Engine

Il Browser Engine è un adapter verso una tecnologia concreta.

Implementazioni possibili:

```text
Playwright

Selenium

Browser remoto

Browser embedded
```

La prima implementazione prevista:

```text
Playwright Adapter
```

---

# 8. Capability previste

Capability iniziali:

```text
open_url

navigate

extract_content

find_element

click_element

fill_form

take_screenshot

download_file

close_session
```

---

# 9. Interfacce principali

## BrowserProvider

```python
class BrowserProvider:

    create_session()

    close_session()

    navigate(url)

    screenshot()
```

---

## PageInteractor

```python
class PageInteractor:

    click(selector)

    fill(selector, value)

    extract(selector)
```

---

## ContentExtractor

```python
class ContentExtractor:

    extract_text(page)

    extract_links(page)

    extract_metadata(page)
```

---

# 10. Flusso operativo

Esempio:

Richiesta:

```text
"Cerca informazioni sul progetto X"
```

Flusso:

```text
Agent

↓

Workflow

↓

Browser Capability Request

↓

Security Check

↓

Browser Plugin

↓

Create Session

↓

Navigate

↓

Extract Content

↓

Return Result

↓

Memory/Knowledge Update
```

---

# 11. Gestione sessioni

Le sessioni devono supportare:

* creazione;
* sospensione;
* ripristino;
* eliminazione.

Ogni sessione deve avere:

```text
session_id

owner

created_at

expiration

permissions
```

---

# 12. Autenticazione

Le credenziali non devono essere gestite dal browser direttamente.

Devono essere fornite tramite un sistema dedicato.

Possibili integrazioni future:

* Secret Manager;
* vault locale;
* credenziali temporanee.

---

# 13. Sicurezza

Il Browser Subsystem deve supportare:

* whitelist domini;
* blacklist domini;
* isolamento sessioni;
* controllo download;
* audit attività.

Esempio:

```text
Navigazione richiesta

↓

Policy Check

↓

Allowed / Denied

↓

Execution
```

---

# 14. Integrazione con Knowledge Subsystem

Il browser può alimentare la conoscenza.

Flusso:

```text
Web Page

↓

Content Extraction

↓

Document

↓

Knowledge Pipeline

↓

Index
```

---

# 15. Integrazione con Tool Subsystem

Il browser viene esposto come insieme di capability.

Esempio:

```yaml
capability:

  browse_web:

    provider:
      playwright-browser
```

---

# 16. Integrazione con ComputerUse

Browser e ComputerUse sono distinti.

Browser:

```text
DOM

Elementi semantici

Automazione strutturata
```

ComputerUse:

```text
Pixel

Mouse

Tastiera

Schermo
```

Il Browser Subsystem è preferibile quando possibile perché più affidabile.

---

# 17. Configurazione

File:

```text
configs/browser.yaml
```

Esempio:

```yaml
browser:

  provider: playwright

  headless: true

  timeout: 30

  allowed_domains:

    - example.com
```

---

# 18. Eventi prodotti

Eventi previsti:

```text
BrowserSessionCreated

PageLoaded

NavigationCompleted

ContentExtracted

ScreenshotCreated

BrowserError
```

---

# 19. Logging

Ogni operazione deve registrare:

```text
timestamp

session_id

action

url

result

duration
```

Informazioni sensibili devono poter essere escluse.

---

# 20. Test richiesti

## Unit Test

Testare:

* session management;
* URL validation;
* configuration;
* adapter.

---

## Integration Test

Verificare:

* apertura browser;
* navigazione;
* estrazione contenuto;
* chiusura sessione.

---

## Security Test

Verificare:

* blocco domini non autorizzati;
* isolamento sessioni;
* gestione permessi.

---

## Scenario Test

Esempio:

```text
L'agente deve raccogliere informazioni
da una pagina web.

Il sistema deve:

- creare sessione;
- navigare;
- estrarre contenuto;
- fornire risultato.
```

---

# 21. Evoluzione futura

Possibili estensioni:

* browser persistente per agente;
* gestione profili utente;
* multi-browser;
* navigazione autonoma;
* web research agent;
* integrazione ComputerUse completa.

---

# 22. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del ComputerUse Subsystem.
