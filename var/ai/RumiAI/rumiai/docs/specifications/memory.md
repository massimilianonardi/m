# RumiAI Memory Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Memory Subsystem fornisce a RumiAI la capacità di conservare, recuperare e utilizzare informazioni generate durante l'esecuzione degli agenti.

La memoria permette agli agenti di mantenere continuità tra interazioni differenti e di utilizzare esperienze precedenti per migliorare il comportamento futuro.

---

# 2. Principio fondamentale

## Memory ≠ Knowledge

RumiAI separa chiaramente:

## Knowledge

Informazioni esterne:

* documenti;
* manuali;
* codice;
* dati aziendali;
* fonti informative.

Gestite dal:

```text
Knowledge Subsystem
```

---

## Memory

Informazioni generate dall'utilizzo:

* conversazioni;
* esperienze;
* decisioni;
* eventi;
* preferenze;
* stato operativo.

Gestite dal:

```text
Memory Subsystem
```

---

# 3. Obiettivi

Il Memory Subsystem deve permettere:

* continuità conversazionale;
* apprendimento dal contesto;
* recupero di esperienze passate;
* conservazione dello stato degli agenti;
* gestione della storia operativa.

---

# 4. Principi fondamentali

## Controllo dell'utente

La memoria appartiene all'utente.

L'utente deve poter:

* visualizzare;
* modificare;
* eliminare;
* esportare.

---

## Esplicitazione

La memoria non deve crescere in modo invisibile.

Ogni elemento memorizzato deve avere:

* origine;
* motivo;
* timestamp;
* classificazione.

---

## Separazione dei tipi

Non deve esistere una memoria unica indistinta.

Ogni tipo di memoria ha caratteristiche diverse.

---

# 5. Tipologie di memoria

RumiAI definisce quattro livelli principali.

---

# 5.1 Working Memory

Memoria temporanea utilizzata durante un'attività.

Esempio:

```text
Sto analizzando il progetto X.

Documento corrente:
architecture.md

Passo attuale:
analisi dipendenze.
```

Caratteristiche:

* breve durata;
* alta frequenza di aggiornamento;
* eliminabile.

---

# 5.2 Conversation Memory

Conserva lo storico delle interazioni.

Contiene:

* messaggi utente;
* risposte agente;
* metadati conversazione.

Utilizzata per:

* continuità dialogo;
* contesto recente.

---

# 5.3 Episodic Memory

Conserva esperienze significative.

Esempi:

```text
Il 20 luglio l'agente ha completato
correttamente una migrazione Podman.
```

Contiene:

* evento;
* situazione;
* azione;
* risultato.

---

# 5.4 Semantic Memory

Conserva conoscenza derivata dalle esperienze.

Esempi:

```text
L'utente preferisce utilizzare
script POSIX compliant.

Il progetto RumiAI usa Podman
come runtime principale.
```

Questa memoria può essere utilizzata dagli agenti futuri.

---

# 6. Architettura interna

Struttura prevista:

```text
memory/

├── contracts/

├── working/

├── conversation/

├── episodic/

├── semantic/

├── storage/

├── retrieval/

└── tests/
```

---

# 7. Modello Memory Entry

Ogni elemento di memoria deve avere una struttura comune.

Esempio:

```text
MemoryEntry

id

type

content

source

created_at

updated_at

importance

confidence

metadata
```

---

# 8. Importanza e rilevanza

Non tutto deve essere conservato.

Ogni memoria può avere:

```text
importance

confidence

expiration
```

Esempio:

Una preferenza esplicita dell'utente:

```text
importance: high
confidence: high
```

Un'informazione dedotta:

```text
importance: medium
confidence: low
```

---

# 9. Memory Lifecycle

Una memoria segue un ciclo:

```text
Created

↓

Evaluated

↓

Stored

↓

Retrieved

↓

Updated

↓

Archived
```

---

# 10. Memory Manager

Il Memory Manager coordina:

* creazione memoria;
* classificazione;
* persistenza;
* recupero.

Responsabilità:

```text
Store Memory

Retrieve Memory

Update Memory

Delete Memory
```

---

# 11. Interfacce principali

## MemoryStore

Contratto base:

```python
class MemoryStore:

    add(memory)

    get(id)

    search(query)

    update(memory)

    delete(id)
```

---

## Memory Retrieval

Interfaccia:

```python
retrieve(
    query,
    memory_type,
    limit
)
```

---

## Memory Policy

Definisce:

* cosa salvare;
* quanto conservarlo;
* quando eliminarlo.

---

# 12. Integrazione con Agent Runtime

Flusso:

```text
Agent Start

↓

Load Relevant Memory

↓

Execute Task

↓

Evaluate Experience

↓

Store Memory
```

---

# 13. Integrazione con Knowledge Subsystem

Le due componenti possono collaborare.

Esempio:

Un agente crea un documento importante.

Flusso:

```text
Experience

↓

Episodic Memory

↓

Semantic Extraction

↓

Knowledge Indexing
```

Ma non devono essere fuse.

---

# 14. Storage

La prima implementazione deve rimanere astratta.

Possibili backend:

* SQLite;
* LanceDB;
* filesystem strutturato;
* database relazionale.

La scelta dello storage appartiene allo strato Infrastructure.

---

# 15. Configurazione

File:

```text
configs/memory.yaml
```

Esempio:

```yaml
memory:

  enabled: true

  types:

    working:
      ttl: 3600

    conversation:
      retention_days: 90

    semantic:
      persistent: true
```

---

# 16. Eventi prodotti

Eventi previsti:

```text
MemoryCreated

MemoryUpdated

MemoryRetrieved

MemoryDeleted

MemoryArchived
```

---

# 17. Sicurezza e privacy

La memoria può contenere informazioni sensibili.

Devono essere supportati:

* cifratura;
* controllo accessi;
* esportazione;
* cancellazione completa;
* audit.

---

# 18. Test richiesti

## Unit Test

Testare:

* classificazione memoria;
* storage;
* retrieval;
* lifecycle.

---

## Integration Test

Verificare:

* salvataggio esperienza;
* recupero memoria;
* aggiornamento informazioni.

---

## Scenario Test

Esempio:

```text
Un utente comunica una preferenza.

L'agente deve:

- riconoscere la preferenza;
- salvarla come memoria semantica;
- recuperarla in una sessione futura.
```

---

# 19. Evoluzione futura

Possibili estensioni:

* memoria multi-agente;
* consolidamento automatico;
* forgetting intelligente;
* ranking basato sull'utilità;
* apprendimento dalle esperienze;
* memoria multimodale.

---

# 20. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Workflow Subsystem.
