#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 1.9 Time Tool
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione TimeTool"


mkdir -p app/tools



# -----------------------------------------------------
# Time Tool
# -----------------------------------------------------

cat > app/tools/time.py <<'EOF'
"""
Tool per ottenere data e ora corrente.
"""


from datetime import datetime

from app.tools.base import Tool



class TimeTool(Tool):


    name = "time"


    description = (
        "Restituisce data e ora corrente"
    )



    def execute(self, **kwargs):


        now = datetime.now()


        return now.strftime(
            "%d/%m/%Y %H:%M:%S"
        )

EOF



# -----------------------------------------------------
# Aggiornamento Registry
# -----------------------------------------------------

cat > app/tools/registry.py <<'EOF'
"""
Registro centrale dei tool.
"""


from app.tools.echo import EchoTool

from app.tools.time import TimeTool




class ToolRegistry:



    def __init__(self):

        self._tools = {}


        self.register(
            EchoTool()
        )


        self.register(
            TimeTool()
        )



    def register(self, tool):

        self._tools[
            tool.name
        ] = tool



    def get(self, name):

        return self._tools.get(
            name
        )



    def list_tools(self):

        return list(
            self._tools.keys()
        )

EOF



# -----------------------------------------------------
# Aggiornamento Planner
# -----------------------------------------------------

cat > app/agent/planner.py <<'EOF'
"""
Planner iniziale basato su regole.

Verrà sostituito successivamente
da un planner LLM.
"""


from app.logging import get_logger



logger = get_logger(__name__)




class Planner:



    def decide(self, prompt: str):


        logger.info(
            "Analisi richiesta planner"
        )


        text = prompt.lower().strip()



        if text.startswith("echo "):


            return {

                "tool": "echo",

                "arguments": {

                    "text": prompt[5:]

                }

            }



        if text.startswith("ripeti "):


            return {

                "tool": "echo",

                "arguments": {

                    "text": prompt[7:]

                }

            }



        if (
            "che ora" in text
            or
            "dimmi l'ora" in text
            or
            "ora corrente" in text
        ):


            return {

                "tool": "time",

                "arguments": {}

            }



        return {

            "tool": None,

            "arguments": {}

        }

EOF



# -----------------------------------------------------
# Test TimeTool
# -----------------------------------------------------

cat > tests/test_time_tool.py <<'EOF'

from app.tools.time import TimeTool

from app.tools.registry import ToolRegistry



def test_time_tool():


    tool = TimeTool()


    result = tool.execute()


    assert isinstance(
        result,
        str
    )


    assert len(result) > 0




def test_registry_contains_time():


    registry = ToolRegistry()


    assert "time" in registry.list_tools()

EOF



echo
echo "================================="
echo "TimeTool installato."
echo "================================="
echo
echo "Test:"
echo
echo "pytest tests/test_time_tool.py"
