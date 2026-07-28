#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 1.6 Planner
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione Planner"



mkdir -p app/agent



# -----------------------------------------------------
# Planner
# -----------------------------------------------------

cat > app/agent/planner.py <<'EOF'
"""
Planner iniziale.

Decide se una richiesta
deve usare un tool.
"""


from app.logging import get_logger



logger = get_logger(__name__)




class Planner:



    def decide(self, prompt: str):

        """
        Analizza una richiesta
        e restituisce una decisione.
        """


        logger.info(

            "Analisi richiesta planner"

        )


        text = prompt.lower().strip()



        # Caso echo

        if text.startswith("echo "):


            value = prompt[5:]


            return {

                "tool": "echo",

                "arguments": {

                    "text": value

                }

            }



        if text.startswith("ripeti "):


            value = prompt[7:]


            return {

                "tool": "echo",

                "arguments": {

                    "text": value

                }

            }



        # Nessun tool necessario


        return {

            "tool": None,

            "arguments": {}

        }

EOF



# -----------------------------------------------------
# Test
# -----------------------------------------------------

cat > tests/test_planner.py <<'EOF'

from app.agent.planner import Planner



def test_echo_detection():


    planner = Planner()


    result = planner.decide(

        "echo ciao"

    )


    assert result["tool"] == "echo"


    assert result["arguments"]["text"] == "ciao"





def test_no_tool():


    planner = Planner()


    result = planner.decide(

        "raccontami una storia"

    )


    assert result["tool"] is None

EOF



echo
echo "================================="
echo "Planner creato."
echo "================================="
echo
echo "Test:"
echo
echo "pytest tests/test_planner.py"
