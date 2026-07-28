#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 2.2 Filesystem Tool
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione FilesystemTool"



# -----------------------------------------------------
# Configurazione
# -----------------------------------------------------

cat >> .env.example <<'EOF'


# Filesystem Tool

FILESYSTEM_ROOT=data

EOF



python - <<'PY'
from pathlib import Path

path = Path("app/config.py")

text = path.read_text()

if "filesystem_root" not in text:

    text = text.replace(

        'command_timeout: int = 5\n',

        '''command_timeout: int = 5


    filesystem_root: str = "data"

'''

    )

    path.write_text(text)

PY



# -----------------------------------------------------
# Filesystem Tool
# -----------------------------------------------------

cat > app/tools/filesystem.py <<'EOF'
"""
Tool filesystem controllato.

Opera solamente dentro
la directory configurata.
"""


from pathlib import Path


from app.config import get_settings

from app.logging import get_logger

from app.tools.base import Tool



logger = get_logger(__name__)




class FilesystemTool(Tool):


    name = "filesystem"


    description = (
        "Legge, scrive e lista file "
        "nella directory dati"
    )



    def __init__(self):


        settings = get_settings()


        self.root = Path(
            settings.filesystem_root
        ).resolve()


        self.root.mkdir(

            exist_ok=True

        )



    def _safe_path(self, path):


        target = (

            self.root /
            path

        ).resolve()



        if not str(target).startswith(

            str(self.root)

        ):

            raise ValueError(

                "Percorso non consentito"

            )


        return target




    def execute(

        self,

        operation="list",

        path="",

        content=""

    ):



        if operation == "list":


            return [

                item.name

                for item in self.root.iterdir()

            ]



        if operation == "read":


            target = self._safe_path(
                path
            )


            return target.read_text()



        if operation == "write":


            target = self._safe_path(
                path
            )


            target.parent.mkdir(

                parents=True,

                exist_ok=True

            )


            target.write_text(
                content
            )


            return "ok"



        return {

            "error":
            "Operazione sconosciuta"

        }

EOF



# -----------------------------------------------------
# Registry aggiornato
# -----------------------------------------------------

cat > app/tools/registry.py <<'EOF'
"""
Registro centrale dei tool.
"""


from app.tools.echo import EchoTool

from app.tools.time import TimeTool

from app.tools.terminal import TerminalTool

from app.tools.filesystem import FilesystemTool




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

        self.register(
            FilesystemTool()
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

cat > tests/test_filesystem_tool.py <<'EOF'

from app.tools.filesystem import FilesystemTool




def test_write_and_read():


    tool = FilesystemTool()


    result = tool.execute(

        operation="write",

        path="test.txt",

        content="ciao"

    )


    assert result == "ok"



    content = tool.execute(

        operation="read",

        path="test.txt"

    )


    assert content == "ciao"




def test_list():


    tool = FilesystemTool()


    files = tool.execute(

        operation="list"

    )


    assert isinstance(

        files,

        list

    )




def test_path_escape_blocked():


    tool = FilesystemTool()


    try:

        tool.execute(

            operation="read",

            path="../../etc/passwd"

        )

        assert False


    except ValueError:

        assert True

EOF



echo
echo "================================="
echo "FilesystemTool creato."
echo "================================="
echo
echo "Test:"
echo
echo "pytest tests/test_filesystem_tool.py"
