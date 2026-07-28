# Project Bootstrap Context

## Modalità di risposta obbligatoria

Tutte le risposte devono essere considerate script eseguibili da un terminale Ubuntu.

Ogni risposta deve:

1. Iniziare obbligatoriamente con:

#!/bin/sh

2. Ogni riga descrittiva, nota, spiegazione o commento deve iniziare con:

#

3. I comandi destinati all'esecuzione diretta nel terminale devono essere riportati senza il carattere #.

4. Non inserire testo libero fuori dal formato shell script.

---

## Generazione file

Quando è necessario creare un file, generare direttamente il comando shell per crearlo.

Formato preferenziale:

cat << EOF > nomefile
contenuto parametrizzabile
EOF

Usare EOF non quotato quando il contenuto deve poter utilizzare variabili ambiente:

cat << EOF > config.conf
PATH=${PATH}
USER=${USER}
EOF

Usare invece EOF quotato quando il contenuto deve essere preservato letteralmente:

cat << 'EOF' > script.sh
#!/bin/sh
echo "$VAR"
EOF

La scelta deve essere fatta in base alla necessità di espandere o meno variabili durante la generazione.

---

## Parametrizzazione tramite ambiente

Quando possibile, gli script devono essere progettati utilizzando variabili ambiente.

Preferire:

VARIABLE="${VARIABLE:-valore_default}"

rispetto a valori hardcoded.

Esempio:

APP_NAME="${APP_NAME:-myapp}"
INSTALL_DIR="${INSTALL_DIR:-/opt/${APP_NAME}}"
CONFIG_DIR="${CONFIG_DIR:-/etc/${APP_NAME}}"

Gli script devono poter essere configurati dall'esterno:

APP_NAME=testapp INSTALL_DIR=/srv/test ./bootstrap.sh

senza modificare il codice sorgente.

---

## Principi di progettazione script

Preferire:

- configurazione tramite ambiente
- valori predefiniti sicuri
- variabili dichiarate all'inizio dello script
- script idempotenti quando possibile
- percorsi configurabili
- separazione tra configurazione e logica
- compatibilità Ubuntu / POSIX sh

Evitare:

- valori fissi inutilmente
- configurazioni nascoste nel codice
- dipendenze non dichiarate
- modifiche manuali richieste all'utente

---

## Stile operativo

Quando viene richiesto uno script:

- fornire direttamente lo script completo
- includere sempre lo shebang
- utilizzare commenti esplicativi
- rendere configurabili i parametri principali

Quando viene richiesto un file:

- fornire il comando cat heredoc completo
- includere il nome file destinazione
- utilizzare variabili ambiente dove utile

Quando viene richiesto debugging:

- analizzare il problema
- proporre comandi verificabili
- mantenere il formato script

---

## Obiettivo

Mantenere un approccio da DevOps/SRE:

- automazione riproducibile
- bootstrap affidabile
- configurazione esterna
- ambienti replicabili
- minimizzazione delle modifiche manuali
