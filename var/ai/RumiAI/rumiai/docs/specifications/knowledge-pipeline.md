# RumiAI Knowledge Pipeline Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il Knowledge Pipeline Subsystem definisce il processo attraverso cui RumiAI acquisisce, trasforma, indicizza e recupera informazioni da fonti documentali.

Il sottosistema abilita funzionalità RAG (Retrieval Augmented Generation).

---

# 2. Principio fondamentale

## Data Transformation Pipeline

La conoscenza non viene utilizzata direttamente dalla fonte originale.

Il processo è:

```text
Raw Data

↓

Processed Knowledge

↓

Retrievable Knowledge

↓

LLM Context
```

---

# 3. Obiettivi

Il sistema deve fornire:

* acquisizione documenti;
* normalizzazione contenuti;
* suddivisione semantica;
* generazione embeddings;
* indicizzazione;
* ricerca semantica;
* ranking risultati;
* preparazione contesto LLM.

---

# 4. Non responsabilità

Il Knowledge Pipeline NON deve:

* generare risposte finali;
* decidere obiettivi dell'agente;
* sostituire la memoria personale;
* gestire direttamente il modello LLM.

---

# 5. Architettura interna

Struttura prevista:

```text
knowledge_pipeline/

├── ingestion/

├── parsers/

├── preprocessing/

├── chunking/

├── enrichment/

├── embeddings/

├── indexing/

├── retrieval/

├── ranking/

└── tests/
```

---

# 6. Knowledge Flow

Flusso completo:

```text
Source

↓

Ingestion

↓

Document Object

↓

Parser

↓

Chunks

↓

Embedding Model

↓

Vector Store

↓

Retriever

↓

Context Builder

↓

LLM
```

---

# 7. Document Ingestion

L'Ingestion Layer acquisisce fonti informative.

Fonti supportate inizialmente:

```text
File locali

PDF

TXT

Markdown

HTML

Documenti Office
```

Possibili future:

```text
Web

Database

API

Email
```

---

# 8. Document Object

Ogni documento viene rappresentato internamente.

Modello:

```text
Document

id

source

content

metadata

created_at

hash
```

---

# 9. Parser Layer

Il Parser converte formati diversi in testo uniforme.

Esempio:

```text
PDF

↓

Parser

↓

Plain Text
```

Ogni parser deve essere sostituibile tramite plugin.

---

# 10. Preprocessing

Prima del chunking il contenuto viene normalizzato.

Operazioni:

* rimozione elementi inutili;
* normalizzazione caratteri;
* pulizia testo;
* estrazione metadata.

---

# 11. Chunking

Il Chunking divide documenti grandi in unità gestibili.

Obiettivo:

```text
Documento lungo

↓

Frammenti semanticamente coerenti
```

Ogni chunk contiene:

```text
Chunk

id

text

position

metadata

document_id
```

---

# 12. Chunk Strategy

Il sistema deve supportare strategie diverse.

Esempi:

```text
Fixed Size

Semantic Chunking

Paragraph Based

Recursive Splitting
```

Configurazione:

```yaml
chunking:

  strategy: recursive

  size: 500

  overlap: 50
```

---

# 13. Metadata Enrichment

Ogni chunk può essere arricchito.

Esempi:

```text
source

author

date

category

tags

security_level
```

---

# 14. Embedding Layer

Trasforma testo in rappresentazione vettoriale.

Schema:

```text
Chunk

↓

Embedding Model

↓

Vector
```

Interfaccia:

```python
class EmbeddingProvider:

    embed(text)

    embed_batch(texts)
```

---

# 15. Embedding Provider

Il provider deve essere sostituibile.

Possibili implementazioni:

```text
Local Transformer Model

Ollama Embedding Model

API Provider
```

---

# 16. Vector Indexing

Gli embeddings vengono salvati nel Vector Storage.

Schema:

```text
Chunk

+

Embedding

+

Metadata

↓

Vector Database
```

Provider previsti:

```text
LanceDB

Chroma

FAISS
```

---

# 17. Retrieval

Il Retriever cerca informazioni rilevanti.

Input:

```text
User Query
```

Output:

```text
Relevant Chunks
```

Interfaccia:

```python
class Retriever:

    search(query, limit)
```

---

# 18. Similarity Search

Il retrieval iniziale utilizza:

```text
Vector Similarity
```

Possibili metriche:

```text
Cosine Similarity

Euclidean Distance

Dot Product
```

---

# 19. Ranking Layer

Dopo il recupero iniziale è possibile migliorare il risultato.

Pipeline:

```text
Retriever

↓

Candidate Chunks

↓

Reranker

↓

Final Context
```

---

# 20. Context Builder

Il Context Builder prepara il materiale per il modello LLM.

Input:

```text
Retrieved Documents
```

Output:

```text
LLM Prompt Context
```

Deve gestire:

* limite token;
* priorità;
* duplicati.

---

# 21. RAG Flow Completo

Esempio:

Domanda:

```text
"Come configuro il sistema RumiAI?"
```

Flusso:

```text
Query

↓

Embedding Query

↓

Vector Search

↓

Top Documents

↓

Context Assembly

↓

LLM

↓

Answer
```

---

# 22. Knowledge Quality

Il sistema deve permettere valutazione:

Metriche:

```text
Retrieval Accuracy

Context Relevance

Duplicate Rate

Latency
```

---

# 23. Security Integration

La conoscenza deve rispettare permessi.

Esempio:

```text
User Query

↓

Retrieval

↓

Permission Filter

↓

Allowed Context
```

Un documento non accessibile non deve essere recuperato.

---

# 24. Observability Integration

Devono essere tracciati:

* documenti acquisiti;
* tempi parsing;
* embedding latency;
* retrieval score;
* errori.

---

# 25. Configuration

File:

```text
configs/knowledge.yaml
```

Esempio:

```yaml
knowledge:

  chunking:

    size: 500

    overlap: 50


  retrieval:

    top_k: 5


  vector_store:

    provider: lancedb
```

---

# 26. Eventi prodotti

Eventi previsti:

```text
DocumentImported

DocumentParsed

ChunksCreated

EmbeddingGenerated

IndexUpdated

RetrievalCompleted
```

---

# 27. Implementazione Foundation

Prima versione prevista:

```text
Filesystem

+

Parser base

+

Embedding Provider locale

+

SQLite Metadata

+

Vector Provider astratto
```

Preparata per futura integrazione:

```text
LanceDB
```

---

# 28. Test richiesti

## Unit Test

Testare:

* parser;
* chunking;
* metadata;
* embedding interface.

---

## Integration Test

Verificare:

* import documento;
* indicizzazione;
* ricerca.

---

## RAG Scenario Test

Esempio:

```text
Inserire documentazione RumiAI.

Chiedere:

"Come funziona il Browser Subsystem?"

Il sistema deve:

- recuperare documenti pertinenti;
- fornire contesto;
- generare risposta corretta.
```

---

# 29. Evoluzione futura

Possibili estensioni:

* multimodal RAG;
* immagini e PDF visuali;
* knowledge graph;
* hybrid search;
* reranking con LLM;
* aggiornamento incrementale;
* agenti specializzati nella ricerca.

---

# 30. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Evaluation & Testing Subsystem.
