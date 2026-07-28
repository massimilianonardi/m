#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 2.1 Terminal Tool
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione TerminalTool"



# -----------------------------------------------------
# Aggiornamento configurazione
# -----------------------------------------------------

cat >> .env.example <<'EOF'


# Terminal Tool

ALLOWED_COMMANDS=pwd,date,whoami

COMMAND_TIMEOUT=5

EOF



# -----------------------------------------------------
# Aggiornamento config.py
# -----------------------------------------------------

python - <<'PY'
from pathlib import Path

path = Path("app/config.py")

text = path.read_text()

if "allowed_commands" not in text:

    text = text.replace(

        'log_level: str = "INFO"\n',

        '''log_level: str = "INFO"


    allowed_commands: str = "pwd,date,whoami"


    command_timeout: int = 5

'''

    )

    path.write_text(text)

PY



# -----------------------------------------------------
# Terminal Tool
# -----------------------------------------------------

cat > app/tools/terminal.py <<'EOF'
"""
Tool per esecuzione comandi controllati.
"""


import subprocess

from app.config import get_settings

from app.logging import get_logger

from app.tools.base import Tool



logger = get_logger(__name__)




class TerminalTool(Tool):


    name = "terminal"


    description = (
        "Esegue comandi autorizzati "
        "sul sistema"
    )



    def execute(self, command=""):


        settings = get_settings()


        allowed = [

            item.strip()

            for item in settings.allowed_commands.split(",")

        ]



        executable = command.split()[0]



        if executable not in allowed:


            logger.warning(

                "Comando bloccato: %s",

                command

            )


            return {

                "error":
                "Comando non autorizzato"

            }



        try:


            result = subprocess.run(

                command,

                shell=True,

                capture_output=True,

                text=True,

                timeout=settings.command_timeout

            )


            return {

                "stdout":
                result.stdout.strip(),

                "stderr":
                result.stderr.strip(),

                "returncode":
                result.returncode

            }



        except subprocess.TimeoutExpired:


            return {

                "error":
                "Timeout esecuzione comando"

            }

EOF



# -----------------------------------------------------
# Aggiornamento registry
# -----------------------------------------------------

cat > app/tools/registry.py <<'EOF'
"""
Registro centrale dei tool.
"""


from app.tools.echo import EchoTool

from app.tools.time import TimeTool

from app.tools.terminal import TerminalTool




class ToolRegistry:



    def __init__(self):

        self._tools = {}


        self.register(
            EchoTool()
        )

        self.register(
            TimeTool()
        )

        self.register(
            TerminalTool()
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
# Test
# -----------------------------------------------------

cat > tests/test_terminal_tool.py <<'EOF'

from app.tools.terminal import TerminalTool



def test_allowed_command():


    tool = TerminalTool()


    result = tool.execute(
        "pwd"
    )


    assert "stdout" in result



def test_blocked_command():


    tool = TerminalTool()


    result = tool.execute(

        "rm -rf /"

    )


    assert "error" in result

EOF



echo
echo "================================="
echo "TerminalTool creato."
echo "================================="
echo
echo "Test:"
echo
echo "pytest tests/test_terminal_tool.py"
