#!/bin/sh

export LOCAL_CA_CERT="/m/src/git/m/cmd/cert/rpr-spa.it/rpr-DOM-CA.crt"
export AI_HOME="/m/data/ai-home"
export PODMAN_HOME="/m/data/podman"
export PODMAN_GRAPH_ROOT="${PODMAN_HOME}/podman-storage"
export PODMAN_RUN_ROOT="${PODMAN_HOME}/run/user/${USER}/containers"

mkdir -p "$AI_HOME"
cd "$AI_HOME"

# podman install and config ----------------------------------------------------
sudo apt install podman
mkdir -p "$PODMAN_HOME"
cat << EOF > ~/.config/containers/storage.conf
[storage]
driver = "overlay"
graphroot = "${PODMAN_GRAPH_ROOT}"
runroot = "${PODMAN_RUN_ROOT}"
EOF

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

podman system reset

# ai containers creation and configuration -------------------------------------
podman image rm --all --force
podman image pull ollama/ollama
podman image pull ghcr.io/open-webui/open-webui:main
podman image pull python:3.12
podman image list

podman network rm ai-net --force
podman network create ai-net
podman network inspect ai-net
podman network ls

podman volume rm --all --force
podman volume create ollama-vol
podman volume create webui-vol
podman volume create python-vol
podman volume ls

podman container rm --all --force
podman pod rm --all --force
podman pod create --name ollama-pod --network ai-net -p 11434:11434 --hostname ollama-host --network-alias ollama.ai
podman pod create --name webui-pod --network ai-net -p 3000:8080 --hostname webui-host --network-alias webui.ai
podman pod create --name python-pod --network ai-net -p 8000:8000 --hostname python-host --network-alias python.ai
podman pod ps

podman container create --name ollama-container --pod ollama-pod \
  --cpus=4 -e OLLAMA_NUM_PARALLEL=1 \
  -v ollama-vol:/root/.ollama \
  -v ${LOCAL_CA_CERT}:/etc/ssl/certs/CA_Aziendale.crt:ro \
  ollama/ollama
podman container create --name webui-container --pod webui-pod \
  -e OLLAMA_BASE_URL=http://ollama.ai:11434 \
  -v webui-vol:/app/backend/data \
  --restart always \
  ghcr.io/open-webui/open-webui:main
podman container create -it --name python-container --pod python-pod \
  -v python-vol:/usr/local/lib/python3.12/site-packages \
  -v ${AI_HOME}:/app \
  python:3.12
podman container ps --all

# ai containers start ----------------------------------------------------------
podman container start ollama-container
podman container start webui-container
podman container start python-container

# start interactively instead of start as daemon and then attach to it
#podman container start -ai python-container

podman container cp ${LOCAL_CA_CERT} ollama-container:/usr/local/share/ca-certificates/rpr-DOM-CA.crt
podman container exec -u root ollama-container sh -c "apt-get update && apt-get install -y ca-certificates && update-ca-certificates"
podman container restart ollama-container

podman container cp ${LOCAL_CA_CERT} webui-container:/usr/local/share/ca-certificates/rpr-DOM-CA.crt
podman container exec -u root webui-container sh -c "apt-get update && apt-get install -y ca-certificates && update-ca-certificates"
podman container restart webui-container

podman container cp ${LOCAL_CA_CERT} python-container:/usr/local/share/ca-certificates/rpr-DOM-CA.crt
podman container exec -u root python-container sh -c "apt-get update && apt-get install -y ca-certificates && update-ca-certificates"
podman container restart python-container

# ai config --------------------------------------------------------------------
podman container exec -it ollama-container ollama pull gemma4

# ai test ----------------------------------------------------------------------
podman container exec -it python-container bash

cat << 'EOF' > ./config.py
OLLAMA_URL = "http://ollama.ai:11434"
MODEL = "gemma4"
EMBED_MODEL = "nomic-embed-text"
LANCEDB_PATH = "./data/lancedb"
EOF

cat << 'EOF' > ./ask.py
from ollama import Client

client = Client(host="http://ollama.ai:11434")

def ask(prompt):

    response = client.chat(
        model="gemma4",
        messages=[
            {
                "role":"user",
                "content":prompt
            }
        ]
    )

    return response["message"]["content"]

EOF

python
from ask import ask
print(ask("test"))

podman container exec -it python-container pip install fastapi uvicorn ollama
podman container exec -it python-container pip install lancedb pyarrow pandas sentence-transformers

podman container exec -it python-container bash
