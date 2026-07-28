#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 1.5 Tool Engine
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione Tool Engine"


mkdir -p app/tools



# -----------------------------------------------------
# Classe base Tool
# -----------------------------------------------------

cat > app/tools/base.py <<'EOF'
"""
Classe base per tutti i tool.
"""


from abc import ABC, abstractmethod



class Tool(ABC):


    name: str = ""

    description: str = ""



    @abstractmethod
    def execute(self, **kwargs):

        """
        Esegue il tool.
        """

        pass

EOF



# -----------------------------------------------------
# Echo Tool
# -----------------------------------------------------

cat > app/tools/echo.py <<'EOF'
"""
Tool di test.
"""


from app.tools.base import Tool



class EchoTool(Tool):


    name = "echo"


    description = (
        "Restituisce il testo ricevuto"
    )



    def execute(self, text=""):


        return f"Echo: {text}"

EOF



# -----------------------------------------------------
# Registry
# -----------------------------------------------------

cat > app/tools/registry.py <<'EOF'
"""
Registro centrale dei tool.
"""


from app.tools.echo import EchoTool



class ToolRegistry:



    def __init__(self):

        self._tools = {}

        self.register(
            EchoTool()
        )



    def register(self, tool):

        self._tools[
            tool.name
        ] = tool



    def get(self, name):

        return self._tools.get(name)



    def list_tools(self):

        return list(
            self._tools.keys()
        )

EOF



# -----------------------------------------------------
# Dispatcher
# -----------------------------------------------------

cat > app/tools/dispatcher.py <<'EOF'
"""
Dispatcher dei tool.
"""


from app.logging import get_logger



logger = get_logger(__name__)



class ToolDispatcher:



    def __init__(self, registry):

        self.registry = registry



    def execute(self, tool_name, **kwargs):


        logger.info(

            "Esecuzione tool: %s",

            tool_name

        )


        tool = self.registry.get(
            tool_name
        )


        if tool is None:

            raise ValueError(

                f"Tool sconosciuto: {tool_name}"

            )


        result = tool.execute(
            **kwargs
        )


        logger.info(

            "Tool completato: %s",

            tool_name

        )


        return result

EOF



# -----------------------------------------------------
# Test
# -----------------------------------------------------

cat > tests/test_tools.py <<'EOF'

from app.tools.registry import ToolRegistry
from app.tools.dispatcher import ToolDispatcher



def test_echo_tool():


    registry = ToolRegistry()


    dispatcher = ToolDispatcher(
        registry
    )


    result = dispatcher.execute(

        "echo",

        text="ciao"

    )


    assert result == "Echo: ciao"



def test_registry():


    registry = ToolRegistry()


    assert "echo" in registry.list_tools()

EOF



echo
echo "================================="
echo "Tool Engine creato."
echo "================================="
echo
echo "Test:"
echo
echo "pytest tests/test_tools.py"
