#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 1.10 Test Consolidation
# POSIX compliant
# =====================================================

set -eu


echo "==> Consolidamento test"


# -----------------------------------------------------
# Test qualità struttura
# -----------------------------------------------------

cat > tests/test_quality.py <<'EOF'
"""
Test strutturali del progetto.
"""


def test_import_core_modules():


    from app.config import get_settings

    from app.logging import get_logger

    from app.llm.client import OllamaClient

    from app.agent.planner import Planner

    from app.agent.core import Agent

    from app.tools.registry import ToolRegistry



    assert get_settings

    assert get_logger

    assert OllamaClient

    assert Planner

    assert Agent

    assert ToolRegistry



def test_available_tools():


    from app.tools.registry import ToolRegistry


    registry = ToolRegistry()


    tools = registry.list_tools()


    assert "echo" in tools

    assert "time" in tools



def test_agent_components():


    from app.agent.core import Agent


    agent = Agent()


    assert agent.llm

    assert agent.planner

    assert agent.dispatcher

EOF



# -----------------------------------------------------
# Script test runner
# -----------------------------------------------------

cat > scripts/test.sh <<'EOF'
#!/bin/sh

set -eu


echo "==> Avvio test completo"


pytest


echo

echo "================================="
echo "Tutti i test completati."
echo "================================="

EOF


chmod +x scripts/test.sh



echo
echo "================================="
echo "Consolidamento completato."
echo "================================="
echo
echo "Esegui:"
echo
echo "./scripts/test.sh"
