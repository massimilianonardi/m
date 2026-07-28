# RumiAI Knowledge Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Knowledge Subsystem fornisce a RumiAI la capacità di acquisire, organizzare, indicizzare, ricercare e recuperare informazioni provenienti da fonti differenti.

Il suo obiettivo è trasformare dati grezzi in conoscenza utilizzabile dagli agenti.

Il sottosistema costituisce la base tecnica per:

* RAG;
* ricerca documentale;
* recupero contestuale;
* conoscenza personale;
* analisi del patrimonio informativo locale.

---

# 2. Principi fondamentali

## Separazione tra conoscenza e storage

Il Knowledge Subsystem non deve dipendere da un database specifico.

Esempio vietato:

```python
from lancedb import LanceDB
```

Esempio corretto:

```python
from contracts.knowledge import KnowledgeStore
```

---

## Pipeline esplicita

La trasformazione della conoscenza deve essere osservabile.

Il flusso deve essere rappresentabile come:

```
Source

↓

Loader

↓

Parser

↓

Normalizer

↓

Chunker

↓

Embedder

↓

Indexer

↓

Retriever

↓

Context Builder
```

---

## Riproducibilità

Ogni documento indicizzato deve poter essere:

* identificato;
* aggiornato;
* rimosso;
* reindicizzato.

---

# 3. Responsabilità del Knowledge Subsystem

Il sottosistema è responsabile di:

* acquisizione dati;
* estrazione contenuto;
* suddivisione documenti;
* generazione embedding;
* indicizzazione;
* ricerca;
* ranking;
* costruzione del contesto per gli LLM.

---

# 4. Non responsabilità

Il Knowledge Subsystem NON deve:

* generare risposte linguistiche;
* decidere il piano dell'agente;
* eseguire azioni;
* gestire conversazioni;
* controllare strumenti esterni.

Queste responsabilità appartengono ad altri sottosistemi.

---

# 5. Architettura interna

Struttura concettuale:

```
knowledge/

├── ingestion/

├── processing/

├── embedding/

├── indexing/

├── retrieval/

├── storage/

├── contracts/

└── tests/
```

---

# 6. Pipeline di acquisizione

## 6.1 Source

Una sorgente rappresenta una origine di conoscenza.

Esempi:

* filesystem;
* repository Git;
* URL;
* database;
* API;
* cartelle locali.

Modello:

```
KnowledgeSource

id

type

location

metadata
```

---

# 6.2 Loader

Il Loader recupera il contenuto dalla sorgente.

Esempi:

```
FileLoader

WebLoader

GitLoader

DatabaseLoader
```

Output:

```
RawDocument
```

---

# 6.3 Parser

Trasforma dati grezzi in contenuto strutturato.

Esempi:

* PDF;
* Markdown;
* HTML;
* codice sorgente;
* testo.

Output:

```
ParsedDocument
```

---

# 6.4 Normalizer

Uniforma il contenuto.

Responsabilità:

* pulizia testo;
* normalizzazione caratteri;
* rimozione rumore.

---

# 6.5 Chunker

Divide documenti in frammenti utilizzabili.

Modello:

```
Document

↓

Chunk 1

Chunk 2

Chunk 3
```

Ogni chunk deve mantenere:

* riferimento al documento originale;
* posizione;
* metadata.

---

# 6.6 Embedding

Trasforma il contenuto in rappresentazione vettoriale.

Interfaccia:

```
EmbeddingProvider

embed(text)

embed_batch(texts)
```

Implementazioni possibili:

* modelli locali;
* Ollama embeddings;
* sentence-transformers.

---

# 6.7 Indexer

Inserisce i dati nello storage.

Responsabilità:

* creazione indice;
* aggiornamento;
* eliminazione;
* sincronizzazione.

---

# 6.8 Retriever

Recupera informazioni rilevanti.

Interfaccia:

```
retrieve(query, filters, limit)
```

Strategie future:

* vector search;
* keyword search;
* hybrid search;
* graph search.

---

# 6.9 Context Builder

Prepara il contesto destinato al modello linguistico.

Responsabilità:

* selezione chunk;
* ordinamento;
* compressione;
* gestione limite token.

Output:

```
LLMContext
```

---

# 7. Modelli principali

## Document

Rappresenta un documento.

Attributi:

```
id

source

title

content

metadata

created_at

updated_at
```

---

## DocumentChunk

Rappresenta una porzione indicizzabile.

Attributi:

```
id

document_id

content

position

metadata

embedding
```

---

## KnowledgeQuery

Rappresenta una richiesta di ricerca.

Attributi:

```
text

filters

limit

strategy
```

---

## KnowledgeResult

Risultato della ricerca.

Attributi:

```
chunk

score

metadata
```

---

# 8. Interfacce principali

## KnowledgeStore

Contratto per lo storage.

```
add(document)

update(document)

delete(id)

search(query)

get(id)
```

---

## DocumentLoader

```
load(source)
```

---

## DocumentParser

```
parse(raw_document)
```

---

## Chunker

```
split(document)
```

---

## EmbeddingProvider

```
embed(text)

embed_batch(texts)
```

---

# 9. Storage iniziale

La prima implementazione prevista utilizzerà:

```
LanceDB
```

Motivazione:

* database vettoriale locale;
* adatto a dati personali;
* integrabile con Python;
* coerente con il principio local-first.

L'utilizzo di LanceDB deve però essere confinato allo strato Infrastructure.

---

# 10. Integrazione con LLM Subsystem

Il Knowledge Subsystem fornisce contesto.

Non genera risposta.

Flusso:

```
User Query

↓

Agent

↓

Knowledge Retrieval

↓

Context Builder

↓

LLM Subsystem

↓

Response
```

---

# 11. Eventi prodotti

Il sottosistema deve generare eventi.

Esempi:

```
DocumentAdded

DocumentUpdated

DocumentIndexed

EmbeddingCreated

SearchExecuted

RetrievalCompleted
```

---

# 12. Configurazione

Configurazione prevista:

```
configs/knowledge.yaml
```

Esempio:

```yaml
knowledge:

  store:
    provider: lancedb

  chunking:
    size: 800

  retrieval:
    top_k: 5
```

---

# 13. Sicurezza

Il Knowledge Subsystem deve supportare:

* controllo accesso ai documenti;
* metadata di provenienza;
* audit delle ricerche;
* separazione degli spazi di conoscenza.

Esempio:

```
Personal Knowledge Space

Project Knowledge Space

System Knowledge Space
```

---

# 14. Test richiesti

## Unit Test

Testare:

* parser;
* chunker;
* embedding adapter;
* retriever.

---

## Integration Test

Verificare:

* caricamento documento;
* indicizzazione;
* ricerca;
* recupero contesto.

---

## Scenario Test

Esempio:

```
Dato un insieme di documenti tecnici,

l'agente deve trovare le informazioni
relative alla configurazione Podman.
```

---

# 15. Evoluzione futura

Possibili estensioni:

* Knowledge Graph;
* ricerca ibrida;
* reranking;
* multimodal retrieval;
* immagini e OCR;
* memoria semantica integrata.

---

# 16. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del LLM Subsystem.
