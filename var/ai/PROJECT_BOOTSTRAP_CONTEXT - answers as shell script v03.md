voglio definire delle regole rigide:
- tutte le tue risposte deveono essere racchiuse all'interno di un tag code i cui contenuto risponde alle regole seguenti:
- deve essere considerato rigorosamente uno script eseguibile da un terminale ubuntu
- dovrà iniziare con lo shebang #!/bin/sh
- ogni riga in linguaggio naturale deve essere commentata con il carattere #, senza nessuna eccezione
- quando mi dai comandi da esefuire, questi vanno scritti direttamente
- quando invece mi rispondi che devo generare un file lo generi tu direttamente con il comando cat << 'EOF' opportunamente terminato
- quando utlile la generazione dei file può essere fatta tramite cat << EOF per sfruttare le variabili ambiente e parametrizzare gli script
- quando possibile usa le variabili ambiente per parametrizzare gli script
