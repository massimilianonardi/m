# RumiAI Project Manifesto

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Identità del progetto

RumiAI è una piattaforma AI locale, modulare ed estendibile progettata per permettere la costruzione, l'esecuzione e l'evoluzione di agenti intelligenti mantenendo il controllo locale dei dati, la trasparenza delle operazioni e l'indipendenza dalle tecnologie sottostanti.

RumiAI non è un singolo agente AI.

È un'infrastruttura sulla quale possono essere costruiti molteplici agenti specializzati, applicazioni intelligenti e sistemi autonomi.

---

# 2. Visione

La visione di RumiAI è creare una piattaforma personale di intelligenza artificiale completamente controllabile dall'utente, capace di integrare modelli linguistici, conoscenza privata, strumenti operativi e automazioni avanzate in un ecosistema coerente.

RumiAI mira a rendere possibile un futuro nel quale ogni persona o organizzazione possa avere un sistema AI personale:

* locale;
* trasparente;
* personalizzabile;
* sicuro;
* indipendente dai provider cloud.

---

# 3. Missione

La missione di RumiAI è fornire una piattaforma aperta per costruire agenti AI capaci di:

* comprendere richieste complesse;
* utilizzare strumenti esterni;
* accedere a conoscenza privata;
* eseguire workflow multi-step;
* interagire con applicazioni e sistemi;
* migliorare attraverso memoria ed esperienza.

La piattaforma deve consentire tutto questo mantenendo sempre il controllo dell'utente.

---

# 4. Perché esiste RumiAI

I sistemi AI moderni sono spesso:

* dipendenti da servizi cloud;
* poco trasparenti;
* difficili da personalizzare;
* vincolati a singoli provider;
* poco adatti alla gestione di dati privati.

RumiAI nasce per esplorare un modello alternativo:

un'intelligenza artificiale locale, componibile e governabile.

---

# 5. Principi fondamentali

## 5.1 Local First

RumiAI deve poter funzionare localmente senza dipendere obbligatoriamente da servizi esterni.

La connessione a servizi remoti può essere un'estensione, non un requisito.

I dati dell'utente devono rimanere sotto il controllo dell'utente.

---

## 5.2 Privacy by Design

La privacy non è una funzionalità aggiuntiva.

È un requisito architetturale.

Ogni componente deve essere progettato considerando:

* minimizzazione dei dati;
* controllo degli accessi;
* tracciabilità delle operazioni;
* gestione sicura delle informazioni.

---

## 5.3 Modularità

Ogni componente deve avere una responsabilità chiara.

RumiAI deve essere composto da sottosistemi indipendenti:

* LLM;
* Knowledge;
* Memory;
* Tools;
* Workflow;
* Browser;
* Computer;
* Security;
* Events.

---

## 5.4 Sostituibilità

Nessuna tecnologia specifica deve diventare una dipendenza irreversibile.

Esempi:

* Ollama può essere sostituito da un altro runtime LLM;
* LanceDB può essere sostituito da un altro knowledge store;
* Playwright può essere sostituito da un altro motore browser.

Le interfacce sono più importanti delle implementazioni.

---

## 5.5 Trasparenza

Ogni azione significativa deve poter essere osservata.

RumiAI deve permettere di conoscere:

* cosa è stato deciso;
* quali strumenti sono stati utilizzati;
* quali dati sono stati consultati;
* quali risultati sono stati prodotti.

---

## 5.6 Sicurezza

Ogni capacità operativa deve essere controllata.

Un agente non deve poter:

* eseguire azioni non autorizzate;
* accedere a risorse non consentite;
* modificare dati senza controllo.

La sicurezza deve essere parte del progetto fin dall'inizio.

---

## 5.7 Estensibilità

Nuove capacità devono poter essere aggiunte senza modificare il nucleo della piattaforma.

Il sistema deve supportare:

* plugin;
* nuove integrazioni;
* nuovi modelli;
* nuovi strumenti.

---

# 6. Cosa è RumiAI

RumiAI è:

* una piattaforma AI locale;
* un runtime per agenti intelligenti;
* un sistema modulare basato su plugin;
* un ambiente per sperimentare nuove architetture AI;
* un'infrastruttura per applicazioni intelligenti personali.

---

# 7. Cosa non è RumiAI

RumiAI non vuole essere:

* un semplice chatbot;
* un wrapper per un singolo modello;
* un'applicazione legata a un provider specifico;
* un sistema completamente autonomo senza controllo umano;
* una raccolta disordinata di script.

---

# 8. Filosofia architetturale

RumiAI segue il principio:

"Il dominio non conosce l'infrastruttura."

Il nucleo del sistema deve dipendere da concetti astratti:

* Agent;
* Task;
* Plan;
* Capability;
* Tool;
* Document;
* Memory;
* Event.

Le implementazioni concrete appartengono ai livelli inferiori.

---

# 9. Filosofia dello sviluppo

Lo sviluppo di RumiAI segue il principio:

"Prima l'architettura, poi il codice."

Ogni nuova funzionalità deve attraversare queste fasi:

1. Analisi del requisito.
2. Progettazione architetturale.
3. Definizione delle interfacce.
4. Definizione dei test.
5. Implementazione.
6. Verifica.
7. Refactoring.

---

# 10. Obiettivi a lungo termine

RumiAI mira a diventare una piattaforma capace di supportare:

* assistenti personali;
* agenti per sviluppo software;
* agenti di ricerca;
* automazioni locali;
* sistemi multi-agente;
* integrazione con strumenti quotidiani.

---

# 11. Criteri per nuove funzionalità

Una nuova funzionalità deve essere valutata secondo questi criteri:

## Valore

Porta una capacità realmente utile?

## Coerenza

Rispetta l'architettura esistente?

## Modularità

Può essere isolata in un sottosistema o plugin?

## Sicurezza

Può essere controllata e verificata?

## Manutenibilità

Riduce o aumenta il debito tecnico?

---

# 12. Definizione di successo

RumiAI sarà considerato un successo quando sarà possibile:

* eseguire una piattaforma AI completamente locale;
* aggiungere nuove capacità tramite plugin;
* sostituire componenti senza riscrivere il sistema;
* utilizzare conoscenza privata tramite RAG;
* eseguire workflow complessi;
* mantenere pieno controllo sui dati e sulle azioni.

---

# 13. Principio finale

RumiAI non nasce per creare un singolo agente migliore.

Nasce per creare l'ambiente nel quale molti agenti intelligenti possano evolvere.

La piattaforma deve essere costruita per durare oltre i modelli, gli strumenti e le tecnologie che oggi utilizziamo.

Il valore di RumiAI non sarà il singolo modello AI utilizzato.

Il valore sarà l'architettura che permette a qualunque intelligenza artificiale di diventare utile, controllabile e personale.
