obiettivo: architettura software IA sovrana, locale e open source.
sistema operativo cognitivo personale.
nome del progetto: RumiAI.
Principi:
- Zero costi obbligatori: nessun abbonamento, nessun servizio cloud necessario;
- Local-first: elaborazione e dati sul dispositivo dell’utente, il sistema deve funzionare anche senza connessione internet, senza account esterni e senza API proprietarie;
- Open source: componenti verificabili e modificabili;
- Modulare: ogni componente può essere sostituito o migliorato;
- Distribuibile: futura evoluzione verso una rete di nodi IA cooperanti;
- i dati personali appartengano all’utente, ma l’architettura, le regole e l’evoluzione di RumiAI sono governate dagli sviluppatori;
- Data ownership: l’utente possiede modelli, dati, memoria e configurazioni, può usare il sistema, configurarlo entro i limiti previsti, fornire dati e contenuti, concedere o negare permessi previsti, scegliere tra opzioni disponibili;
- Governance ownership: gli sviluppatori mantengono la responsabilità di definire il modello cognitivo, stabilire quali moduli esistono, decidere le modalità di estensione, governare l’evoluzione del progetto;
Architettura di livello 0: utente - interfaccia ia - core ia.
Architettura di livello 1:
- utente: persona, operatore o nodo;
- interfaccia ia: chat, voce, immagini, video, documenti, conversazione multimodale;
- core ia: interpretazione, ragionamento, pianificazione, esecuzione, apprendimento;
Architettura di livello 2 - Core IA:
- Kernel Cognitivo (orchestrazione e ciclo cognitivo)
- Memoria (breve termine, lungo termine, conoscenza)
- Reasoning Engine (ragionamento e inferenza)
- Planner (pianificazione di obiettivi e task)
- Tool Engine (esecuzione di strumenti e automazioni)
- Knowledge Engine (RAG, indicizzazione e ricerca locale)
- Learning Engine (apprendimento e adattamento)
- Security & Permissions (permessi, sandbox e controllo accessi)
- Node Engine (cooperazione tra nodi RumiAI)
- Model Manager (gestione di LLM, embedding, modelli multimodali e loro sostituzione)
Questa decomposizione mantiene la filosofia di RumiAI: un kernel cognitivo modulare, analogo a un sistema operativo, in cui ogni componente è sostituibile senza compromettere l'intero ecosistema.

2.1 Kernel Cognitivo
È il supervisore dell'intero sistema.
Responsabilità:
orchestrazione dei moduli;
gestione del ciclo cognitivo;
controllo dello stato interno;
coordinamento dei flussi informativi;
gestione delle priorità;
monitoraggio delle prestazioni;
gestione degli errori e del recupero.
Il Kernel Cognitivo non esegue direttamente il ragionamento: coordina i moduli specializzati.

2.2 Memory Engine
Gestisce tutte le forme di memoria.
Comprende:
memoria di lavoro;
memoria conversazionale;
memoria episodica;
memoria semantica;
memoria documentale;
memoria delle preferenze;
memoria procedurale.
Caratteristiche:
completamente locale;
esportabile;
cifrabile;
versionabile.

2.3 Reasoning Engine
È il motore del ragionamento.
Responsabilità:
interpretazione;
deduzione;
induzione;
pianificazione logica;
valutazione delle alternative;
verifica della coerenza;
gestione delle incertezze.
È indipendente dal modello linguistico utilizzato.

2.4 Planner
Trasforma gli obiettivi in piani eseguibili.
Funzioni:
decomposizione dei problemi;
definizione delle priorità;
pianificazione multi-step;
gestione delle dipendenze;
monitoraggio dello stato di avanzamento;
revisione dinamica del piano.

2.5 Tool Engine
Gestisce l'utilizzo degli strumenti.
Può controllare:
filesystem;
database;
browser;
terminale;
automazioni;
sensori;
dispositivi locali;
servizi remoti opzionali.
Ogni strumento opera attraverso permessi espliciti.

2.6 Knowledge Engine
Gestisce la conoscenza.
Responsabilità:
indicizzazione;
ricerca semantica;
RAG locale;
gestione dei documenti;
ontologie;
basi di conoscenza;
collegamenti tra informazioni.
Può operare completamente offline.

2.7 Learning Engine
Permette al sistema di migliorare nel tempo.
Può apprendere:
preferenze;
abitudini;
procedure;
pattern ricorrenti;
nuove conoscenze autorizzate.
Non modifica autonomamente il Kernel Cognitivo.

2.8 Security & Permissions
Controlla sicurezza e autorizzazioni.
Responsabilità:
autenticazione locale;
autorizzazioni;
sandbox;
isolamento dei moduli;
gestione dei privilegi;
audit;
registrazione delle operazioni.
Nessun modulo può aggirare questo componente.

2.9 Model Manager
Gestisce tutti i modelli IA.
Comprende:
LLM;
modelli embedding;
OCR;
STT (Speech-to-Text);
TTS (Text-to-Speech);
modelli di visione;
classificatori;
modelli futuri.
Responsabilità:
installazione;
aggiornamento;
sostituzione;
selezione automatica;
ottimizzazione delle risorse;
compatibilità tra versioni.
Il resto dell'architettura non dipende da uno specifico modello.

2.10 Node Engine
È il modulo dedicato alla futura evoluzione distribuita.
Responsabilità:
comunicazione tra nodi;
sincronizzazione autorizzata;
federazione;
cooperazione;
condivisione selettiva della conoscenza;
esecuzione distribuita.
Può essere completamente disabilitato senza compromettere il funzionamento locale.

Principi Architetturali del Livello 2
Ogni modulo del Core IA deve rispettare i seguenti principi:
Singola responsabilità: ogni modulo ha un compito ben definito.
Modularità: ogni componente può essere sostituito senza modificare il resto del sistema.
Interoperabilità: i moduli comunicano tramite interfacce standardizzate.
Local-first: tutte le funzionalità essenziali operano senza connessione Internet.
Sicurezza: ogni operazione è soggetta ai controlli del modulo Security & Permissions.
Estensibilità: nuovi moduli possono essere integrati senza alterare il Kernel Cognitivo.
Governance centrale: l'evoluzione dell'architettura e dei protocolli è definita dagli sviluppatori del progetto, mentre l'utente mantiene il controllo dei propri dati, modelli e configurazioni.

Con questo Livello 2, RumiAI assume una struttura assimilabile a quella di un sistema operativo moderno: il Kernel Cognitivo coordina un insieme di servizi specializzati che costituiscono il nucleo dell'intelligenza artificiale, mantenendo indipendenza dai modelli sottostanti e garantendo modularità, sicurezza ed evolvibilità.

Regola di progettazione
L'architettura di RumiAI viene progettata top-down.
Ogni livello definisce esclusivamente:
le responsabilità;
le interfacce;
i contratti tra i moduli.
Il livello successivo dettaglia l'implementazione interna di ciascun modulo del livello precedente.
Un livello non deve conoscere l'implementazione dei livelli inferiori.

Principio di standardizzazione
RumiAI non reinventa protocolli o interfacce già consolidate, quando queste soddisfano i requisiti di sovranità, apertura, modularità e indipendenza del progetto.

Principio di Riuso degli Standard
Quando esiste uno standard aperto che soddisfa i requisiti del progetto, esso deve essere preferito rispetto alla progettazione di un protocollo proprietario.
Uno standard viene adottato se è:
aperto e documentato;
implementabile localmente;
indipendente da servizi cloud;
sostituibile;
estendibile senza compromettere la compatibilità.
RumiAI introduce nuovi protocolli solo quando gli standard esistenti non consentono di realizzare il modello cognitivo previsto.

Decisione architetturale
L'interfaccia di comunicazione tra "Interfaccia IA" e "Core IA" è il protocollo OpenAI-compatible Chat API.

Principio architetturale - Principio di Compatibilità dei Protocolli:
RumiAI adotta protocolli aperti e largamente diffusi come contratti di comunicazione tra i moduli. Quando esiste uno standard de facto che soddisfa i requisiti di sovranità, modularità e interoperabilità del progetto, esso viene preferito a un protocollo proprietario.

Applicazione al Livello 0
Contratto tra Interfaccia IA e Core IA
Protocollo: OpenAI-compatible Chat API
Trasporto: HTTP/HTTPS con streaming opzionale (Server-Sent Events)
Formato dati: JSON
Implementazioni compatibili: Ollama, vLLM, llama.cpp server, LocalAI e altre implementazioni che espongano lo stesso contratto.

Interfaccia IA non è un singolo componente: è un insieme di UI-Gateway.
Il principio di indipendenza
Ogni UI-Gateway comunica esclusivamente con il Core IA. I UI-Gateway non comunicano direttamente tra loro.
nessuna dipendenza tra gateway;
ogni gateway può essere sviluppato, distribuito e aggiornato indipendentemente;
è possibile aggiungere o rimuovere un gateway senza impattare sugli altri;
il Core rimane l'unico punto di coordinamento.

Gli UI-Gateway sono stateless.
Cioè:
non mantengono memoria della conversazione come responsabilità propria;
non prendono decisioni;
non coordinano altri gateway;
non implementano logica cognitiva.
La loro responsabilità è:
acquisire l'input dell'utente;
convertirlo nel formato del contratto;
inviarlo al Core IA;
ricevere la risposta;
presentarla all'utente.
In questo modo il Core IA rimane l'unico componente "intelligente" del sistema.

Per evitare ambiguità future, userei il termine Gateway solo per i componenti che parlano con l'utente o con sistemi esterni, e riserverei il termine Adapter ai componenti che traducono tra protocolli interni ed esterni.

Terminal Gateway:
Uniche responsabilità:
leggere l'input da stdin;
costruire una richiesta verso il Core IA;
ricevere la risposta;
stamparla sul terminale;
gestire lo streaming della risposta.
Il Gateway non salva nulla su disco.
CORE_AI_URL = "http://ollama.ai:11434"
MODEL = "gemma4"
