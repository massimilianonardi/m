#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 1.4 Ollama Client
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione Ollama Client"


mkdir -p app/llm


# -----------------------------------------------------
# Client Ollama
# -----------------------------------------------------

cat > app/llm/client.py <<'EOF'
"""
Client astratto per comunicazione con Ollama.
"""


from ollama import Client

from app.config import get_settings
from app.logging import get_logger



logger = get_logger(__name__)



class OllamaClient:


    def __init__(self):

        settings = get_settings()


        self.model = settings.ollama_model


        self.client = Client(

            host=settings.ollama_host

        )


        logger.info(

            "OllamaClient inizializzato "
            "model=%s host=%s",

            self.model,
            settings.ollama_host

        )



    def chat(self, prompt: str) -> str:

        """
        Invia un messaggio al modello.
        """

        logger.debug(

            "Richiesta Ollama: %s",

            prompt

        )


        try:

            response = self.client.chat(

                model=self.model,

                messages=[

                    {

                        "role": "user",

                        "content": prompt

                    }

                ]

            )


            content = (

                response
                .get("message", {})
                .get("content", "")

            )


            logger.debug(

                "Risposta ricevuta lunghezza=%s",

                len(content)

            )


            return content



        except Exception as exc:


            logger.exception(

                "Errore comunicazione Ollama"

            )


            raise exc

EOF



# -----------------------------------------------------
# Test
# -----------------------------------------------------

cat > tests/test_ollama.py <<'EOF'

from app.llm.client import OllamaClient



def test_ollama_connection():


    client = OllamaClient()


    response = client.chat(

        "Rispondi solamente: OK"

    )


    assert response

    print(response)



if __name__ == "__main__":


    client = OllamaClient()

    print(

        client.chat(

            "Rispondi solamente: OK"

        )

    )

EOF



echo
echo "================================="
echo "Ollama Client creato."
echo "================================="
echo
echo "Test:"
echo
echo "pytest tests/test_ollama.py"
echo
