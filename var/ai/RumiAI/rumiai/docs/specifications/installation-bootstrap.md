# RumiAI Installation & Bootstrap Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

L'Installation & Bootstrap Subsystem definisce il processo di installazione, configurazione e inizializzazione di una nuova istanza RumiAI.

Il sottosistema gestisce:

* requisiti sistema;
* installazione dipendenze;
* creazione ambiente Python;
* configurazione runtime;
* inizializzazione storage;
* primo avvio.

---

# 2. Principio fondamentale

## Reproducible Deployment

Una nuova installazione RumiAI deve essere ricreabile.

Modello non corretto:

```
Installazione manuale

↓

Configurazioni personali

↓

Sistema non riproducibile
```

Modello RumiAI:

```
Host pulito

↓

Bootstrap Script

↓

Configurazione dichiarativa

↓

Sistema operativo
```

---

# 3. Obiettivi

Il bootstrap deve garantire:

* installazione automatica;
* configurazione consistente;
* separazione ambienti;
* semplicità manutenzione;
* possibilità di reinstallazione.

---

# 4. Ambiente di riferimento

Foundation Release:

## Sistema operativo

Supporto primario:

* Linux;
* distribuzioni Debian/Ubuntu compatibili.

Supporto futuro:

* Fedora;
* Arch;
* macOS;
* Windows tramite WSL.

---

# 5. Directory principale

Installazione standard:

```
/opt/rumiai/
```

Struttura:

```
rumiai/

├── app/

├── config/

├── data/

├── models/

├── storage/

├── logs/

├── scripts/

├── backups/

├── tests/

└── venv/
```

---

# 6. Separazione dati e codice

Principio:

```
Application

≠

Configuration

≠

User Data

≠

Models
```

Un aggiornamento software non deve cancellare dati utente.

---

# 7. Prerequisiti Hardware

Configurazione minima indicativa:

* CPU moderna;
* RAM sufficiente al modello scelto;
* spazio disco adeguato;
* GPU opzionale.

La configurazione dipende dai modelli LLM utilizzati.

---

# 8. Prerequisiti Software

Richiesti:

* Linux;
* Python;
* Git;
* strumenti shell POSIX;
* Ollama.

Opzionali:

* Docker;
* GPU drivers;
* CUDA.

---

# 9. Bootstrap Flow

Procedura:

```
bootstrap.sh

↓

System Check

↓

Dependencies Install

↓

Python Environment

↓

Configuration Setup

↓

Storage Initialization

↓

Ollama Setup

↓

RumiAI Start
```

---

# 10. Script Bootstrap

Directory:

```
scripts/
```

Script previsti:

```
00-system-check.sh

01-install-dependencies.sh

02-python-env.sh

03-storage-init.sh

04-ollama.sh

05-config-init.sh

06-start-rumiai.sh
```

Tutti gli script devono essere:

* POSIX compliant;
* idempotenti;
* documentati.

---

# 11. System Check

Controlli:

* sistema operativo;
* versione Python;
* spazio disco;
* memoria;
* presenza strumenti necessari.

Esempio:

```
Checking environment...

Python OK

Disk OK

Ollama detected

Ready
```

---

# 12. Python Environment

RumiAI utilizza ambiente virtuale isolato.

Struttura:

```
venv/

├── bin/

├── lib/

└── packages/
```

---

# 13. Dependency Management

Dipendenze definite tramite:

```
requirements.txt
```

oppure:

```
pyproject.toml
```

nella futura evoluzione package.

---

# 14. Ollama Setup

Ollama è il provider LLM locale principale.

Configurazione:

```
User Request

↓

RumiAI Model Router

↓

Ollama API

↓

Local Model
```

---

# 15. Ollama Host Configuration

Parametro:

```
OLLAMA_HOST
```

Esempio:

```
ollama.ai
```

deve essere configurabile senza modificare codice.

---

# 16. Model Initialization

Il bootstrap può preparare modelli necessari.

Esempio:

```
Model Registry

↓

Required Models

↓

Pull / Verify
```

---

# 17. Storage Initialization

Il bootstrap prepara:

* database;
* vector storage;
* knowledge directories;
* cache.

---

# 18. LanceDB Preparation

La Foundation Release prepara l'architettura per LanceDB.

Struttura prevista:

```
data/

└── lancedb/

    ├── tables/

    └── metadata/
```

L'adozione definitiva potrà avvenire in una fase successiva.

---

# 19. Configuration Initialization

Creazione:

```
config/
```

File iniziali:

```
system.yaml

models.yaml

storage.yaml

security.yaml

privacy.yaml
```

---

# 20. Environment Variables

File:

```
.env
```

Contiene:

* path;
* endpoint;
* credenziali;
* configurazioni runtime.

Mai includere:

* password;
* token pubblici;
* chiavi private nel repository.

---

# 21. First Run

Primo avvio:

```
RumiAI

↓

Environment Validation

↓

Database Init

↓

Model Check

↓

Service Start
```

---

# 22. Installation Modes

Supportati:

## Interactive

Installazione guidata.

## Automated

Installazione tramite script.

## Development

Ambiente sviluppatore.

---

# 23. Upgrade Compatibility

Gli aggiornamenti devono preservare:

* configurazioni;
* memoria;
* conoscenza;
* backup.

---

# 24. Logging Bootstrap

Ogni fase produce log:

```
logs/bootstrap.log
```

Esempi eventi:

```
InstallStarted

DependencyInstalled

StorageCreated

BootstrapCompleted
```

---

# 25. Error Handling

Ogni script deve:

* controllare errori;
* interrompere in caso critico;
* fornire messaggi chiari.

---

# 26. Security Considerations

Bootstrap deve:

* verificare sorgenti;
* limitare privilegi;
* proteggere configurazioni;
* evitare credenziali hardcoded.

---

# 27. Test Bootstrap

## Fresh Install Test

Scenario:

```
Host vuoto

↓

Bootstrap

↓

RumiAI funzionante
```

---

## Reinstall Test

Verifica:

* preservazione dati;
* backup;
* configurazioni.

---

## Upgrade Test

Verifica:

* compatibilità versioni.

---

# 28. Implementazione Foundation

Prima versione:

```
bootstrap.sh

+

POSIX Install Scripts

+

Python Environment Setup

+

Ollama Configuration

+

Storage Initialization
```

---

# 29. Scenario operativo

Nuovo server:

```
Ubuntu Installato

↓

git clone RumiAI

↓

./scripts/bootstrap.sh

↓

Configurazione

↓

Avvio Sistema
```

---

# 30. Evoluzione futura

Possibili estensioni:

* installer grafico;
* containerizzazione;
* Kubernetes deployment;
* cloud images;
* appliance RumiAI dedicata.

---

# 31. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Data Architecture Subsystem.
