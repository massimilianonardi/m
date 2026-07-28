# RumiAI LLM Subsystem Specification

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Il LLM Subsystem fornisce a RumiAI un'interfaccia astratta verso modelli linguistici di grandi dimensioni (Large Language Models).

Il suo obiettivo è consentire agli agenti di utilizzare capacità linguistiche senza dipendere da uno specifico modello, runtime o provider.

Il sottosistema gestisce:

* generazione testo;
* streaming delle risposte;
* completamento;
* chat;
* embeddings;
* gestione dei modelli;
* selezione del provider.

---

# 2. Principi fondamentali

## Indipendenza dal modello

RumiAI non deve dipendere da:

* Gemma;
* Llama;
* Mistral;
* GPT;
* altri modelli specifici.

Il modello è una configurazione, non un elemento architetturale.

---

## Indipendenza dal runtime

Il sistema deve supportare differenti backend:

* Ollama;
* llama.cpp;
* vLLM;
* API remote;
* altri runtime futuri.

---

## Local First

Il primo scenario operativo previsto è:

```text
RumiAI

↓

Ollama

↓

Gemma
```

con esecuzione locale.

---

## Controllabilità

Ogni chiamata al modello deve essere:

* tracciabile;
* configurabile;
* osservabile.

---

# 3. Responsabilità

Il LLM Subsystem è responsabile di:

* fornire accesso ai modelli linguistici;
* gestire richieste di generazione;
* gestire streaming;
* fornire embedding;
* gestire configurazioni modello;
* normalizzare risposte provenienti da provider diversi.

---

# 4. Non responsabilità

Il LLM Subsystem NON deve:

* decidere obiettivi dell'agente;
* creare piani;
* gestire memoria;
* eseguire tool;
* fare retrieval;
* applicare policy di sicurezza.

Queste responsabilità appartengono ad altri sottosistemi.

---

# 5. Architettura interna

Struttura prevista:

```text
llm/

├── contracts/

├── providers/

├── models/

├── routing/

├── streaming/

├── embeddings/

└── tests/
```

---

# 6. Concetti principali

## LLM Provider

Rappresenta un backend capace di fornire modelli linguistici.

Esempi:

```text
OllamaProvider

OpenAIProvider

LlamaCppProvider

VLLMProvider
```

---

## Model

Rappresenta un modello disponibile.

Esempio:

```yaml
name: gemma4

provider: ollama

context_window: 8192
```

---

## Generation Request

Rappresenta una richiesta al modello.

Contiene:

* prompt;
* messaggi;
* parametri;
* modello richiesto.

---

## Generation Response

Contiene:

* testo prodotto;
* metadata;
* statistiche;
* durata;
* token utilizzati.

---

# 7. Interfacce principali

## LLMProvider Interface

Contratto principale.

Esempio concettuale:

```python
class LLMProvider:

    generate(request)

    stream(request)

    embed(text)
```

---

# 8. Generate

Permette generazione completa.

Flusso:

```text
Agent

↓

LLM Interface

↓

Provider

↓

Model

↓

Response
```

---

# 9. Streaming

Supporta risposte progressive.

Esempio:

```text
Token 1

↓

Token 2

↓

Token 3

↓

Complete Response
```

Necessario per:

* interfacce conversazionali;
* Open WebUI;
* CLI interattive.

---

# 10. Embedding Interface

Gli embedding sono separati dalla generazione.

Interfaccia:

```python
EmbeddingProvider:

embed(text)

embed_batch(texts)
```

Utilizzata principalmente dal:

```text
Knowledge Subsystem
```

---

# 11. Model Registry

Il sistema deve conoscere i modelli disponibili.

Esempio:

```yaml
models:

  - name: gemma4
    provider: ollama
    capabilities:
      - chat
      - completion

  - name: bge-small
    provider: local
    capabilities:
      - embedding
```

---

# 12. Routing

In futuro RumiAI potrà scegliere automaticamente il modello.

Esempio:

```text
Richiesta semplice

↓

Modello veloce


Richiesta complessa

↓

Modello avanzato
```

---

# 13. Configurazione

File:

```text
configs/llm.yaml
```

Esempio:

```yaml
llm:

  default_provider: ollama

  default_model: gemma4

  providers:

    ollama:

      endpoint: http://ollama.ai
```

---

# 14. Eventi prodotti

Il sottosistema genera eventi:

```text
LLMRequestStarted

LLMTokenGenerated

LLMCompleted

LLMError

EmbeddingCreated
```

---

# 15. Sicurezza

Ogni chiamata LLM deve poter essere controllata.

Aspetti:

* limiti token;
* timeout;
* logging;
* gestione dati sensibili;
* controllo provider.

---

# 16. Integrazione con altri sottosistemi

## Agent Runtime

Utilizza il LLM Subsystem per:

* ragionamento;
* generazione;
* pianificazione.

---

## Knowledge Subsystem

Utilizza embeddings.

Flusso:

```text
Document

↓

EmbeddingProvider

↓

Vector Store
```

---

## Memory Subsystem

Può utilizzare il modello per:

* sintesi;
* classificazione;
* estrazione informazioni.

---

# 17. Implementazione iniziale prevista

Prima implementazione:

```text
LLM Subsystem

↓

Ollama Provider

↓

Gemma4
```

Ambiente:

```text
Podman

|

Ollama Pod

|

Gemma Model
```

---

# 18. Test richiesti

## Unit Test

Testare:

* request parsing;
* response parsing;
* provider interface;
* configurazione.

---

## Integration Test

Verificare:

* connessione Ollama;
* caricamento modello;
* generazione risposta;
* streaming.

---

## Scenario Test

Esempio:

```text
Dato un prompt tecnico,

RumiAI deve ottenere una risposta
dal modello configurato e produrre
gli eventi corretti.
```

---

# 19. Evoluzione futura

Possibili estensioni:

* multi-model routing;
* modello locale + cloud fallback;
* fine tuning;
* caching delle risposte;
* valutazione automatica qualità;
* agent specializzati per modello.

---

# 20. Stato documento

Versione:

0.1

Status:

Architettura definita.

Prossimo passo:

Definizione del Tool Subsystem.
