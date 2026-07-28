#!/bin/bash

# Di seguito trovi uno script bootstrap_phase1.sh che crea:
#
# la struttura delle directory;
# i file __init__.py;
# uno scheletro per:
# llm/ollama.py
# agent/core.py
# agent/planner.py
# agent/dispatcher.py
# tools/base.py
# tools/registry.py
# tools/time_tool.py
# app.py
# tests/test_phase1.py
# un requirements.txt.
#
# Puoi eseguirlo in una directory vuota.

set -e

PROJECT="backend"

echo "Creazione progetto..."

mkdir -p $PROJECT/{agent,llm,tools,tests}

touch $PROJECT/agent/__init__.py
touch $PROJECT/llm/__init__.py
touch $PROJECT/tools/__init__.py

#########################################################
# requirements.txt
#########################################################

cat > $PROJECT/requirements.txt <<EOF
ollama
EOF

#########################################################
# llm/ollama.py
#########################################################

cat > $PROJECT/llm/ollama.py <<'EOF'
from ollama import Client


class OllamaClient:

    def __init__(self,
                 host="http://ollama:11434",
                 model="gemma4"):
        self.client = Client(host=host)
        self.model = model

    def chat(self, prompt):

        response = self.client.chat(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response["message"]["content"]
EOF

#########################################################
# tools/base.py
#########################################################

cat > $PROJECT/tools/base.py <<'EOF'
from abc import ABC, abstractmethod


class Tool(ABC):

    name = ""
    description = ""

    @abstractmethod
    def execute(self, **kwargs):
        pass
EOF

#########################################################
# tools/time_tool.py
#########################################################

cat > $PROJECT/tools/time_tool.py <<'EOF'
from datetime import datetime
from .base import Tool


class TimeTool(Tool):

    name = "time"

    description = "Restituisce l'ora corrente"

    def execute(self, **kwargs):

        return datetime.now().strftime("%H:%M:%S")
EOF

#########################################################
# tools/registry.py
#########################################################

cat > $PROJECT/tools/registry.py <<'EOF'
from .time_tool import TimeTool


class ToolRegistry:

    def __init__(self):

        self.tools = {}

        self.register(TimeTool())

    def register(self, tool):

        self.tools[tool.name] = tool

    def get(self, name):

        return self.tools.get(name)
EOF

#########################################################
# agent/dispatcher.py
#########################################################

cat > $PROJECT/agent/dispatcher.py <<'EOF'
class Dispatcher:

    def __init__(self, registry):

        self.registry = registry

    def dispatch(self, tool_name, **kwargs):

        tool = self.registry.get(tool_name)

        if tool is None:
            raise Exception(f"Tool {tool_name} non trovato")

        return tool.execute(**kwargs)
EOF

#########################################################
# agent/planner.py
#########################################################

cat > $PROJECT/agent/planner.py <<'EOF'
class Planner:

    def choose(self, prompt):

        p = prompt.lower()

        if "ora" in p:

            return "time"

        return None
EOF

#########################################################
# agent/core.py
#########################################################

cat > $PROJECT/agent/core.py <<'EOF'
from llm.ollama import OllamaClient
from .planner import Planner
from .dispatcher import Dispatcher
from tools.registry import ToolRegistry


class Agent:

    def __init__(self):

        self.llm = OllamaClient()

        self.planner = Planner()

        self.dispatcher = Dispatcher(
            ToolRegistry()
        )

    def ask(self, prompt):

        tool = self.planner.choose(prompt)

        if tool:

            result = self.dispatcher.dispatch(tool)

            final_prompt = f"""
Utente:

{prompt}

Il tool ha restituito:

{result}

Rispondi all'utente usando questo risultato.
"""

            return self.llm.chat(final_prompt)

        return self.llm.chat(prompt)
EOF

#########################################################
# app.py
#########################################################

cat > $PROJECT/app.py <<'EOF'
from agent.core import Agent


agent = Agent()

while True:

    prompt = input("\n> ")

    if prompt == "exit":
        break

    print()

    print(agent.ask(prompt))
EOF

#########################################################
# tests/test_phase1.py
#########################################################

cat > $PROJECT/tests/test_phase1.py <<'EOF'
from tools.registry import ToolRegistry
from agent.dispatcher import Dispatcher

registry = ToolRegistry()

dispatcher = Dispatcher(registry)

print(dispatcher.dispatch("time"))
EOF

echo
echo "========================================"
echo "Bootstrap completato."
echo
echo "Struttura:"
echo
tree $PROJECT || true
echo
echo "Per installare:"
echo
echo "cd backend"
echo "pip install -r requirements.txt"
echo
echo "Per testare:"
echo
echo "python app.py"
echo
echo "========================================"
