#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 1.7 Agent Core
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione Agent Core"


mkdir -p app/agent



# -----------------------------------------------------
# Agent Core
# -----------------------------------------------------

cat > app/agent/core.py <<'EOF'
"""
Core dell'agente.

Coordina:
- Planner
- Tool Engine
- Ollama Client
"""


from app.logging import get_logger

from app.llm.client import OllamaClient

from app.agent.planner import Planner

from app.tools.registry import ToolRegistry

from app.tools.dispatcher import ToolDispatcher



logger = get_logger(__name__)




class Agent:



    def __init__(self):


        logger.info(
            "Inizializzazione Agent"
        )


        self.llm = OllamaClient()


        self.planner = Planner()


        self.registry = ToolRegistry()


        self.dispatcher = ToolDispatcher(
            self.registry
        )



    def ask(self, prompt: str) -> str:


        logger.info(

            "Richiesta agente: %s",

            prompt

        )


        decision = self.planner.decide(
            prompt
        )


        tool = decision.get(
            "tool"
        )


        if tool:


            logger.info(

                "Esecuzione tool: %s",

                tool

            )


            result = self.dispatcher.execute(

                tool,

                **decision.get(
                    "arguments",
                    {}

                )

            )


            final_prompt = f"""

L'utente ha chiesto:

{prompt}


Un tool ha restituito:

{result}


Formula una risposta utile.

"""


            return self.llm.chat(
                final_prompt
            )



        else:


            return self.llm.chat(
                prompt
            )

EOF



# -----------------------------------------------------
# Test
# -----------------------------------------------------

cat > tests/test_agent.py <<'EOF'

from app.agent.core import Agent



def test_agent_echo():


    agent = Agent()


    response = agent.ask(

        "echo ciao"

    )


    assert response



if __name__ == "__main__":


    agent = Agent()


    print(

        agent.ask(
            "echo ciao"
        )

    )

EOF



echo
echo "================================="
echo "Agent Core creato."
echo "================================="
echo
echo "Test:"
echo
echo "pytest tests/test_agent.py"
