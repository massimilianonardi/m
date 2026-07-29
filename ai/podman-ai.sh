#!/bin/sh

export LOCAL_CA_CERT="/m/src/git/m/cmd/cert/rpr-spa.it/rpr-DOM-CA.crt"
export AI_HOME="/m/src/git/m/ai/pod-src/"

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
podman volume create core-ai-vol
podman volume create terminal-gateway-vol
podman volume create python-vol
podman volume ls

podman container rm --all --force
podman pod rm --all --force
podman pod create --name ollama-pod --network ai-net -p 11434:11434 --hostname ollama-host --network-alias ollama.ai
podman pod create --name webui-pod --network ai-net -p 3000:8080 --hostname webui-host --network-alias webui.ai
podman pod create --name core-ai-pod --network ai-net -p 2000:2000 --hostname core-ai-host --network-alias core.ai
podman pod create --name terminal-gateway-pod --network ai-net -p 2100:2100 --hostname terminal-gateway-host --network-alias terminal.gateway
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
mkdir -p "${AI_HOME}/core-ai"
podman container create -it --name core-ai-container --pod core-ai-pod \
  -v core-ai-vol:/usr/local/lib/python3.12/site-packages \
  -v ${AI_HOME}/core-ai:/app \
  python:3.12
mkdir -p "${AI_HOME}/terminal-gateway"
podman container create -it --name terminal-gateway-container --pod terminal-gateway-pod \
  -v terminal-gateway-vol:/usr/local/lib/python3.12/site-packages \
  -v ${AI_HOME}/terminal-gateway:/app \
  python:3.12
mkdir -p "${AI_HOME}/python"
podman container create -it --name python-container --pod python-pod \
  -v python-vol:/usr/local/lib/python3.12/site-packages \
  -v ${AI_HOME}/python:/app \
  python:3.12
podman container ps --all

# ai containers start ----------------------------------------------------------
podman container start ollama-container
podman container start webui-container
podman container start core-ai-container
podman container start terminal-gateway-container
podman container start python-container

# start interactively instead of start as daemon and then attach to it
#podman container start -ai python-container

podman container cp ${LOCAL_CA_CERT} ollama-container:/usr/local/share/ca-certificates/rpr-DOM-CA.crt
podman container exec -u root ollama-container sh -c "apt-get update && apt-get install -y ca-certificates && update-ca-certificates"
podman container restart ollama-container

podman container cp ${LOCAL_CA_CERT} webui-container:/usr/local/share/ca-certificates/rpr-DOM-CA.crt
podman container exec -u root webui-container sh -c "apt-get update && apt-get install -y ca-certificates && update-ca-certificates"
podman container restart webui-container

podman container cp ${LOCAL_CA_CERT} core-ai-container:/usr/local/share/ca-certificates/rpr-DOM-CA.crt
podman container exec -u root core-ai-container sh -c "apt-get update && apt-get install -y ca-certificates && update-ca-certificates"
podman container restart core-ai-container

podman container cp ${LOCAL_CA_CERT} terminal-gateway-container:/usr/local/share/ca-certificates/rpr-DOM-CA.crt
podman container exec -u root terminal-gateway-container sh -c "apt-get update && apt-get install -y ca-certificates && update-ca-certificates"
podman container restart terminal-gateway-container

podman container cp ${LOCAL_CA_CERT} python-container:/usr/local/share/ca-certificates/rpr-DOM-CA.crt
podman container exec -u root python-container sh -c "apt-get update && apt-get install -y ca-certificates && update-ca-certificates"
podman container restart python-container

# ai config --------------------------------------------------------------------
podman container exec -it ollama-container ollama pull gemma4

# ai test ----------------------------------------------------------------------

# core-ai pass-through
podman container exec -it core-ai-container bash
pip install fastapi uvicorn requests
cd /app

cat << 'EOF' > ./core-ai.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from ollama import Client

app = FastAPI()

# Client verso Ollama
client = Client(host="http://ollama.ai:11434")


@app.post("/v1/chat/completions")
async def chat(request: Request):
    body = await request.json()

    response = client.chat(
        model=body["model"],
        messages=body["messages"]
    )

    return JSONResponse(content=response)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=2000)

EOF

cat << 'EOF' > ./core-ai.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from ollama import Client

app = FastAPI()

client = Client(host="http://ollama.ai:11434")

@app.post("/v1/chat/completions")
async def chat(request: Request):
    try:
        body = await request.json()

        print(body)

        response = client.chat(
            model=body["model"],
            messages=body["messages"]
        )

        print(response)

        # return JSONResponse(content=response)
        # return JSONResponse(content=response.model_dump())
        return response.model_dump()

    except Exception as e:
        print(e)
        raise

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=2000)

EOF

cat << 'EOF' > ./core-ai.py
from fastapi import FastAPI, Request
import requests

app = FastAPI()

OLLAMA_URL = "http://ollama.ai:11434"


@app.post("/v1/chat/completions")
async def chat(request: Request):
    body = await request.json()

    response = requests.post(
        f"{OLLAMA_URL}/v1/chat/completions",
        json=body,
        timeout=300
    )

    response.raise_for_status()

    return response.json()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=2000)

EOF

exit

podman container exec -it core-ai-container python /app/core-ai.py

# terminal gateway
podman container exec -it terminal-gateway-container bash

curl http://ollama.ai:11434/api/tags # ollama
curl -X POST http://ollama.ai:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model":"gemma4",
    "messages":[
      {
        "role":"user",
        "content":"Ciao, rispondi con una sola parola."
      }
    ],
    "stream":false
  }'

curl http://core.ai:2000/openapi.json # core-ai fastapi
curl -X POST http://core.ai:2000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma4",
    "messages": [
      {
        "role": "user",
        "content": "Ciao! Rispondi con una sola parola."
      }
    ]
  }'

pip install requests
cd /app

cat << 'EOF' > ./config.py
CORE_AI_URL = "http://core.ai:2000"
MODEL = "gemma4"
EOF

cat << 'EOF' > ./terminal_gateway.py
from ollama import Client
from config import CORE_AI_URL, MODEL

client = Client(host=CORE_AI_URL)

def ask(prompt: str) -> str:
    response = client.chat(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]

EOF

cat << 'EOF' > ./terminal_gateway.py
import requests
from config import CORE_AI_URL, MODEL

def ask(prompt: str) -> str:
    response = requests.post(
        f"{CORE_AI_URL}/v1/chat/completions",
        json={
            "model": MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        },
        timeout=300
    )

    response.raise_for_status()

    data = response.json()

    # return data["message"]["content"]
    return data["choices"][0]["message"]["content"]

EOF

cat << 'EOF' > ./terminal_gateway_client.py
from terminal_gateway import ask

while True:
    prompt = input("CoreAI > ")

    if prompt.lower() in ("exit", "quit"):
        break

    print()
    print(ask(prompt))
    print()

EOF

exit

podman container exec -it terminal-gateway-container python /app/terminal_gateway_client.py

podman container exec -it python-container pip install fastapi uvicorn ollama
podman container exec -it python-container pip install lancedb pyarrow pandas sentence-transformers

podman container exec -it python-container bash
