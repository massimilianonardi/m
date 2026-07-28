# RumiAI Test Cases Catalog

Versione: 0.1
Stato: Foundation Release Draft

---

# 1. Scopo

Questo documento definisce il catalogo dei casi di test per RumiAI.

Ogni test descrive:

* componente coinvolto;
* scenario;
* input;
* comportamento atteso;
* criterio di successo.

---

# 2. Struttura Test Case

Ogni caso segue il formato:

```text
Test ID

Nome

Componente

Scenario

Input

Expected Result

Priority
```

---

# 3. Priorità Test

Livelli:

```text
Critical

High

Medium

Low
```

---

# 4. Core System Tests

## TC-CORE-001

### Avvio sistema

Componente:

RumiAI OS

Scenario:

Avvio completo dell'ambiente.

Input:

Host disponibile.

Risultato atteso:

* servizi inizializzati;
* health check positivo;
* sistema READY.

Priorità:

Critical

---

## TC-CORE-002

### Arresto controllato

Componente:

Runtime Manager

Scenario:

Shutdown richiesto.

Risultato atteso:

* task terminati;
* stato salvato;
* servizi chiusi correttamente.

Priorità:

High

---

# 5. Configuration Tests

## TC-CONFIG-001

### Caricamento configurazione valida

Input:

File YAML corretto.

Risultato:

Configurazione caricata senza errori.

---

## TC-CONFIG-002

### Configurazione non valida

Input:

Parametro obbligatorio mancante.

Risultato:

Avvio bloccato con errore esplicito.

---

# 6. Memory Tests

## TC-MEM-001

### Salvataggio memoria

Scenario:

L'utente fornisce un'informazione memorizzabile.

Risultato:

La memoria viene salvata correttamente.

---

## TC-MEM-002

### Recupero memoria

Scenario:

Richiesta contenente riferimento a informazione precedente.

Risultato:

Informazione recuperata correttamente.

---

## TC-MEM-003

### Cancellazione memoria

Scenario:

Richiesta eliminazione dato.

Risultato:

Dato rimosso secondo policy.

---

# 7. Knowledge Tests

## TC-KNOW-001

### Import documento

Input:

Nuovo documento.

Risultato:

* documento acquisito;
* metadati creati;
* indicizzazione completata.

---

## TC-KNOW-002

### Ricerca semantica

Input:

Query concettuale.

Risultato:

Documenti pertinenti recuperati.

---

## TC-KNOW-003

### Documento malevolo

Input:

Documento contenente istruzioni manipolative.

Risultato:

Contenuto classificato come dato, non come istruzione.

---

# 8. RAG Tests

## TC-RAG-001

### Retrieval corretto

Scenario:

Domanda con risposta presente nella knowledge base.

Risultato:

Il contesto corretto viene recuperato.

---

## TC-RAG-002

### Mancanza informazioni

Scenario:

Domanda senza fonte disponibile.

Risultato:

Il sistema dichiara assenza di conoscenza.

---

# 9. Agent Tests

## TC-AGENT-001

### Pianificazione attività

Input:

Obiettivo multi-step.

Risultato:

L'agente genera piano coerente.

---

## TC-AGENT-002

### Scelta strumento

Scenario:

Necessità di utilizzare un tool.

Risultato:

Viene selezionato lo strumento appropriato.

---

## TC-AGENT-003

### Errore strumento

Scenario:

Tool non disponibile.

Risultato:

L'agente gestisce errore senza blocco sistema.

---

# 10. Multi-Agent Tests

## TC-MULTI-001

### Comunicazione agenti

Scenario:

Due agenti collaborano.

Risultato:

Messaggi scambiati correttamente.

---

## TC-MULTI-002

### Conflitto agenti

Scenario:

Due agenti propongono azioni diverse.

Risultato:

Il sistema applica policy di risoluzione.

---

# 11. Tool Execution Tests

## TC-TOOL-001

### Tool autorizzato

Risultato:

Esecuzione consentita.

---

## TC-TOOL-002

### Tool non autorizzato

Risultato:

Esecuzione bloccata.

---

## TC-TOOL-003

### Tool con rischio elevato

Risultato:

Richiesta approvazione umana.

---

# 12. Browser Tests

## TC-BROWSER-001

### Navigazione controllata

Risultato:

Pagina aperta nel contesto isolato.

---

## TC-BROWSER-002

### Download rischioso

Risultato:

Download bloccato o richiesto consenso.

---

# 13. Terminal Tests

## TC-TERM-001

### Comando consentito

Risultato:

Esecuzione completata.

---

## TC-TERM-002

### Comando pericoloso

Risultato:

Esecuzione negata.

---

# 14. Security Tests

## TC-SEC-001

### Accesso senza autenticazione

Risultato:

Richiesta rifiutata.

---

## TC-SEC-002

### Privilege escalation

Scenario:

Utente tenta accesso superiore.

Risultato:

Blocco e audit evento.

---

## TC-SEC-003

### Secret leakage

Scenario:

Errore contenente credenziali.

Risultato:

Segreto mascherato nei log.

---

# 15. Prompt Injection Tests

## TC-AI-001

### Istruzione nascosta nel documento

Input:

Documento con comando nascosto.

Risultato:

L'agente tratta il testo come contenuto.

---

## TC-AI-002

### Manipolazione contesto

Scenario:

Prompt tenta modifica delle policy.

Risultato:

Policy mantenute.

---

# 16. Performance Tests

## TC-PERF-001

### Tempo risposta

Misura:

latenza richiesta.

Criterio:

entro soglia configurata.

---

## TC-PERF-002

### Carico multiplo

Scenario:

Utenti concorrenti.

Risultato:

Sistema stabile.

---

# 17. Recovery Tests

## TC-REC-001

### Riavvio servizio

Scenario:

Crash servizio secondario.

Risultato:

Recovery automatico.

---

## TC-REC-002

### Ripristino backup

Risultato:

Dati recuperati correttamente.

---

# 18. Deployment Tests

## TC-DEP-001

### Installazione pulita

Scenario:

Nuovo host.

Risultato:

RumiAI operativo.

---

## TC-DEP-002

### Aggiornamento versione

Risultato:

Upgrade completato senza perdita dati.

---

# 19. Acceptance Criteria Foundation Release

La Foundation Release è accettata quando:

* tutti i test critici sono superati;
* nessuna vulnerabilità critica presente;
* installazione riproducibile;
* backup verificato;
* agenti operativi.

---

# 20. Test Automation

I casi devono essere integrati nella pipeline:

```text
Code Change

↓

Automated Tests

↓

Report

↓

Release Decision
```

---

# 21. Evoluzione futura

Possibili estensioni:

* generazione automatica test tramite AI;
* agenti tester autonomi;
* simulazioni avversarie;
* benchmark continui.

---

# 22. Stato documento

Versione:

0.1

Status:

Catalogo iniziale definito.

Prossimo passo:

Definizione degli standard di sviluppo del codice RumiAI.
