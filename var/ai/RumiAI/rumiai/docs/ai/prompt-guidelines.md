# RumiAI Prompt Engineering Guidelines

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Questo documento definisce le linee guida per progettare, mantenere e valutare prompt RumiAI.

Gli obiettivi sono:

* migliorare qualità output;
* garantire comportamento coerente;
* ridurre errori;
* rendere i prompt manutenibili.

---

# 2. Principi fondamentali

I prompt devono essere:

* chiari;
* specifici;
* testabili;
* versionati;
* documentati.

---

# 3. Prompt come componente software

Un prompt deve avere:

```text id="x8m4qp"
Owner

Version

Purpose

Tests

Change History
```

---

# 4. Anatomia di un Prompt

Un prompt RumiAI contiene:

```text id="n5k8mv"
Role

Objective

Context

Instructions

Constraints

Output Format
```

---

# 5. Role Definition

Definisce il ruolo dell'agente.

Esempio:

```text id="p7m3qx"
You are a research analysis agent.
```

Il ruolo deve essere:

* specifico;
* coerente con il compito;
* non ambiguo.

---

# 6. Objective Definition

Ogni prompt deve dichiarare un obiettivo.

Esempio:

```text id="v4q8mz"
Analyze the provided information and produce a structured summary.
```

---

# 7. Context Management

Il contesto deve includere solo informazioni necessarie.

Evitare:

* informazioni irrilevanti;
* duplicazioni;
* istruzioni contraddittorie.

---

# 8. Instruction Design

Le istruzioni devono essere:

* ordinate;
* operative;
* verificabili.

Esempio struttura:

```text id="m2q7xn"
1. Analyze input

2. Apply rules

3. Produce output

4. Verify result
```

---

# 9. Constraint Definition

I vincoli definiscono:

* limiti;
* formato;
* comportamento vietato.

Esempio:

```text id="r8m3kv"
Do not disclose private information.
```

---

# 10. Output Specification

Ogni prompt importante deve definire il formato risultato.

Esempi:

* JSON;
* Markdown;
* elenco strutturato;
* testo libero controllato.

---

# 11. Prompt Template

Template standard:

```text id="z6n4mq"
SYSTEM:

Role

OBJECTIVE:

Goal

CONTEXT:

Available information

RULES:

Constraints

OUTPUT:

Expected format
```

---

# 12. Prompt Versioning

Ogni modifica deve incrementare versione.

Esempio:

```text id="w3m8qx"
Prompt v1.0

Prompt v1.1

Prompt v2.0
```

---

# 13. Change Management

Ogni modifica deve registrare:

* autore;
* motivo;
* impatto;
* risultati test.

---

# 14. Prompt Testing

Ogni prompt deve essere testato con:

* casi normali;
* casi limite;
* input ambigui;
* input errati.

---

# 15. Prompt Evaluation

Valutare:

```text id="h7q2mx"
Accuracy

Consistency

Safety

Relevance

Format Compliance
```

---

# 16. Prompt Regression Testing

Dopo una modifica verificare:

* miglioramenti;
* regressioni;
* nuovi errori.

---

# 17. Prompt Security

I prompt devono proteggere da:

* istruzioni malevole;
* fuga informazioni;
* manipolazioni.

---

# 18. Instruction Priority

La gerarchia deve essere:

```text id="c5m9qv"
System Policy

↓

Agent Policy

↓

Task Instruction

↓

User Input
```

---

# 19. Prompt Injection Defense

Contromisure:

* separazione istruzioni/dati;
* validazione input;
* controllo output.

---

# 20. Context Window Management

Ottimizzare:

* quantità informazioni;
* rilevanza;
* ordine dei dati.

---

# 21. Few-Shot Examples

Gli esempi possono essere usati per:

* chiarire formato;
* migliorare coerenza;
* guidare comportamento.

Devono essere:

* brevi;
* rappresentativi;
* aggiornati.

---

# 22. Chain of Reasoning Management

Le configurazioni devono concentrarsi su:

* obiettivo;
* metodo operativo;
* verifica risultato.

---

# 23. Prompt per Agenti Specializzati

Ogni agente deve avere prompt coerente con:

* ruolo;
* capacità;
* strumenti disponibili.

---

# 24. Prompt e Tool Usage

Quando un agente usa strumenti il prompt deve definire:

* quando usarli;
* quali usare;
* come validare risultati.

---

# 25. Prompt e Memoria

Il prompt deve specificare:

* quale memoria consultare;
* quale memoria aggiornare;
* quali dati ignorare.

---

# 26. Prompt Documentation

Ogni prompt deve includere:

```text id="q9m4xk"
Purpose

Input

Output

Dependencies

Examples
```

---

# 27. Prompt Quality Metrics

Metriche:

* successo task;
* precisione;
* costo computazionale;
* stabilità.

---

# 28. Prompt Optimization

L'ottimizzazione deve seguire:

```text id="s3n7mq"
Measure

↓

Change

↓

Test

↓

Compare
```

---

# 29. Prompt Repository

I prompt devono essere conservati con:

* versionamento;
* storico;
* approvazioni.

---

# 30. Prompt Release Process

Prima del rilascio:

```text id="u8m5qx"
Review

↓

Test

↓

Approve

↓

Deploy
```

---

# 31. Foundation Prompt Standard

La prima versione supporta:

```text id="a7m3kv"
Structured Prompts

+

Version Control

+

Basic Evaluation

+

Security Rules
```

---

# 32. Evoluzione futura

Possibili estensioni:

* prompt optimization automatica;
* valutazione AI-assisted;
* prompt marketplace;
* gestione semantica dei prompt.

---

# 33. Stato documento

Versione:

0.1

Status:

Linee guida prompt definite.

Prossimo passo:

Definizione della strategia di gestione dei modelli AI RumiAI.
