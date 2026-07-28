#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 1.8 FastAPI
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione API FastAPI"



mkdir -p app/api



# -----------------------------------------------------
# Modelli API
# -----------------------------------------------------

cat > app/api/models.py <<'EOF'
"""
Modelli dati API.
"""


from pydantic import BaseModel




class ChatRequest(BaseModel):

    message: str




class ChatResponse(BaseModel):

    response: str

EOF



# -----------------------------------------------------
# Server FastAPI
# -----------------------------------------------------

cat > app/api/server.py <<'EOF'
"""
API HTTP dell'agente.
"""


from fastapi import FastAPI

from app.agent.core import Agent

from app.api.models import (
    ChatRequest,
    ChatResponse
)

from app.logging import get_logger



logger = get_logger(__name__)



app = FastAPI(

    title="Local Agent API",

    version="0.1.0"

)



agent = Agent()




@app.get("/health")
def health():

    return {

        "status": "ok"

    }




@app.post(
    "/chat",
    response_model=ChatResponse
)
def chat(
    request: ChatRequest
):

    logger.info(

        "API request: %s",

        request.message

    )


    response = agent.ask(

        request.message

    )


    return ChatResponse(

        response=response

    )

EOF



# -----------------------------------------------------
# Test API
# -----------------------------------------------------

cat > tests/test_api.py <<'EOF'

from fastapi.testclient import TestClient

from app.api.server import app



client = TestClient(app)




def test_health():


    response = client.get(

        "/health"

    )


    assert response.status_code == 200


    assert response.json()["status"] == "ok"

EOF



echo
echo "================================="
echo "FastAPI creata."
echo "================================="
echo
echo "Avvio:"
echo
echo "uvicorn app.api.server:app --host 0.0.0.0 --port 8000"
echo
echo "Test:"
echo
echo "pytest tests/test_api.py"
