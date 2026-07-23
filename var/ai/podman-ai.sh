#!/bin/sh

podman_examples()
{
#----------------------------------------------------------------------------
podman stop --all

# remove all
podman rm -a -f

# remove stopped only
podman container prune

# remove also associated pods
podman pod rm -a -f

# system cleanup
podman system prune -a

# remove all downloaded images
podman rmi -a -f

# remove unused volumes
podman volume prune

# all-in-one remove command: stopped containers, unused images, unused volumes, networks
podman system prune -a --volumes

# used space
podman system df

# Spazio di ogni singola immagine (ordinate per dimensione)
podman images --sort size
# Spazio di ogni singolo container (mostra la dimensione virtuale e quella reale dei file modificati)
podman ps -a --size
# Dettaglio approfondito in formato JSON (per script o analisi avanzate)
podman system df -v



sudo nano /etc/containers/registries.conf

if grep -q '^\[registries\.search\]' /etc/containers/registries.conf
then
  # La sezione esiste: controlla se quay.io è già presente
  if ! grep -A 5 '^\[registries\.search\]' /etc/containers/registries.conf | grep -q 'quay\.io'
  then
    # quay.io manca: lo inserisce all'inizio dell'array esistente
    sudo sed -i '/^\[registries\.search\]/,/^$/ { s/registries = \[\s*\(.*\)/registries = ["quay.io", \1/ }' /etc/containers/registries.conf
    echo "Sezione esistente: 'quay.io' integrato con successo."
  else
    echo "Sezione esistente: 'quay.io' era già presente."
  fi
  
  # La sezione esiste: controlla se docker.io è già presente
  if ! grep -A 5 '^\[registries\.search\]' /etc/containers/registries.conf | grep -q 'docker\.io'
  then
    # docker.io manca: lo inserisce all'inizio dell'array esistente
    sudo sed -i '/^\[registries\.search\]/,/^$/ { s/registries = \[\s*\(.*\)/registries = ["docker.io", \1/ }' /etc/containers/registries.conf
    echo "Sezione esistente: 'docker.io' integrato con successo."
  else
    echo "Sezione esistente: 'docker.io' era già presente."
  fi
else
  # La sezione non esiste: la crea ex novo in fondo al file
  echo -e '\n[registries.search]\nregistries = ["docker.io", "quay.io"]' | sudo tee -a /etc/containers/registries.conf
  echo "Sezione mancante: creata e configurata da zero."
fi

#----------------------------------------------------------------------------
}


init()
{
  PODMAN_HOME="/m/pkg/podman-v4.2.1-r1/squashfs-root/usr"
  export PATH="$PODMAN_HOME/bin/:$PATH"
  export PATH="$PODMAN_HOME/lib/:$PATH"
  export PATH="$PODMAN_HOME/lib64/:$PATH"
  export PATH="$PODMAN_HOME/libexec/:$PATH"
  export PATH="$PODMAN_HOME/sbin/:$PATH"
  export PATH="$PODMAN_HOME/share/:$PATH"
  export LD_LIBRARY_PATH="$PODMAN_HOME/lib:$LD_LIBRARY_PATH"
  export LD_LIBRARY_PATH="$PODMAN_HOME/lib64:$LD_LIBRARY_PATH"
  export LD_LIBRARY_PATH="$PODMAN_HOME/libexec:$LD_LIBRARY_PATH"
  
  #sudo apt install -y uidmap

  mkdir -p ~/.config/containers
  cat > ~/.config/containers/policy.json <<-'EOF'
{
    "default": [
        {
            "type": "insecureAcceptAnything"
        }
    ]
}
EOF

}

#init

export REQUESTS_CA_BUNDLE=/m/src/git/m/cmd/cert/rpr-spa.it/rpr-spa.pem
export SSL_CERT_FILE=/m/src/git/m/cmd/cert/rpr-spa.it/rpr-spa.pem

# How to Run an Interactive Container with Podman
# https://oneuptime.com/blog/post/2026-03-16-run-interactive-container-podman/view

#podman run -it --rm ubuntu:22.04 bash
#podman run -it --rm python:3.12 python3
#podman run -it --rm node:24 node
#podman run -it --rm nginx bash

# Interactive Python container with port access
#podman run -it --rm -p 8000:8000 python:3.12 bash

# Mount current directory into the container
#podman run -it --rm -v $(pwd):/workspace -w /workspace node:24 bash



# How to Use Podman for Python Development
# https://oneuptime.com/blog/post/2026-03-18-use-podman-python-development/view

#podman run -it --rm -v $(pwd):/app:Z -w /app docker.io/library/python:3.12 bash
#podman run -it --rm -v $(pwd):/app:Z -w /app docker.io/library/python:3.12 python
#podman run --rm -v $(pwd):/app:Z -w /app docker.io/library/python:3.12 python "$@"

podman volume create python
podman run -it --network=host --rm -v /m/src/git/m/cmd/cert/rpr-spa.it/rpr-DOM-CA.crt:/etc/ssl/certs/CA_Aziendale.crt:ro -v python:/usr/local/lib/python3.12/site-packages:Z -v $(pwd):/app:Z -w /app docker.io/library/python:3.12 bash
ls -la /usr/local/lib/python3.12/site-packages
python -m venv venv-ia
. venv-ia/bin/activate
pip install fastapi uvicorn ollama --cert /etc/ssl/certs/CA_Aziendale.crt
pip install lancedb pyarrow pandas sentence-transformers --cert /etc/ssl/certs/CA_Aziendale.crt
from ask import ask
print(ask("test"))



# ollama

# Crea un volume per salvare i modelli scaricati
podman volume create ollama

# Avvia il container Ollama (daemon)
podman run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
# no gpu, 4 cores
podman run -d --cpus=4 -e OLLAMA_NUM_PARALLEL=1 -v /m/src/git/m/cmd/cert/rpr-spa.it/rpr-DOM-CA.crt:/etc/ssl/certs/CA_Aziendale.crt:ro -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# web interface on localhost:8080
podman run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main

# Esegui un modello ed entra nella chat interattiva. Per uscire dalla chat: /exit (il container rimarrà comunque attivo in background).
podman exec -it ollama ollama run llama3
podman exec -it ollama ollama run llama3.1
podman exec -it ollama ollama run deepseek-r1
podman exec -it ollama ollama run gemma4
# Vedere i modelli scaricati
podman exec -it ollama ollama list

podman stats ollama

podman stop ollama

podman start ollama

podman rm ollama

#----------------------------------------------------------------------------

podman image rm --all --force
podman image pull ollama/ollama
podman image pull ghcr.io/open-webui/open-webui:main
podman image pull python:3.12
podman image list

podman network rm --all --force
podman network create ai-net
podman network inspect ai-net
podman network ls

podman volume rm --all --force
podman volume create ollama-vol
podman volume create webui-vol
podman volume create python-vol
podman volume ls

podman pod rm --all --force
podman pod create --name ollama-pod --network ai-net -p 11434:11434 --hostname ollama-host --network-alias ollama.ai
podman pod create --name webui-pod --network ai-net -p 3000:8080 --hostname webui-host --network-alias webui.ai
podman pod create --name python-pod --network ai-net -p 8000:8000 --hostname python-host --network-alias python.ai
podman pod ps

podman container rm --all --force
podman container create --name ollama-container --pod ollama-pod \
  --cpus=4 -e OLLAMA_NUM_PARALLEL=1 \
  -v ollama-vol:/root/.ollama \
  -v /m/src/git/m/cmd/cert/rpr-spa.it/rpr-DOM-CA.crt:/etc/ssl/certs/CA_Aziendale.crt:ro \
  ollama/ollama
podman container create --name webui-container --pod webui-pod \
  -e OLLAMA_BASE_URL=http://ollama.ai:11434 \
  -v webui-vol:/app/backend/data \
  --restart always \
  ghcr.io/open-webui/open-webui:main
podman container create -it --name python-container --pod python-pod \
  -v python-vol:/usr/local/lib/python3.12/site-packages \
  -v $(pwd):/app \
  python:3.12
podman container ps --all

podman container start ollama-container
podman container start webui-container
podman container start python-container

podman container start -ai python-container

podman container cp /m/src/git/m/cmd/cert/rpr-spa.it/rpr-DOM-CA.crt ollama-container:/usr/local/share/ca-certificates/rpr-DOM-CA.crt
podman container exec -u root ollama-container sh -c "apt-get update && apt-get install -y ca-certificates && update-ca-certificates"
podman container restart ollama-container

podman container cp /m/src/git/m/cmd/cert/rpr-spa.it/rpr-DOM-CA.crt webui-container:/usr/local/share/ca-certificates/rpr-DOM-CA.crt
podman container exec -u root webui-container sh -c "apt-get update && apt-get install -y ca-certificates && update-ca-certificates"
podman container restart webui-container

podman container cp /m/src/git/m/cmd/cert/rpr-spa.it/rpr-DOM-CA.crt python-container:/usr/local/share/ca-certificates/rpr-DOM-CA.crt
podman container exec -u root python-container sh -c "apt-get update && apt-get install -y ca-certificates && update-ca-certificates"
podman container restart python-container

podman container exec -it ollama-container ollama pull gemma4

podman container exec -it python-container pip install fastapi uvicorn ollama
podman container exec -it python-container pip install lancedb pyarrow pandas sentence-transformers

podman container exec -it python-container bash
