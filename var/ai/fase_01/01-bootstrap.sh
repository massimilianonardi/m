#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 1.1 Bootstrap
# POSIX compliant
# =====================================================

set -eu

# -----------------------------------------------------
# Directory principali
# -----------------------------------------------------

echo "==> Creazione struttura directory"

mkdir -p \
    app/agent \
    app/api \
    app/llm \
    app/tools \
    app/memory \
    app/rag \
    tests \
    scripts \
    data \
    logs


# -----------------------------------------------------
# Python packages
# -----------------------------------------------------

echo "==> Creazione package Python"

touch \
    app/__init__.py \
    app/agent/__init__.py \
    app/api/__init__.py \
    app/llm/__init__.py \
    app/tools/__init__.py \
    app/memory/__init__.py \
    app/rag/__init__.py


# -----------------------------------------------------
# pyproject.toml
# -----------------------------------------------------

if [ ! -f pyproject.toml ]; then

cat > pyproject.toml <<'EOF'
[build-system]
requires = [
    "setuptools>=68",
    "wheel"
]
build-backend = "setuptools.build_meta"


[project]
name = "local-agent"
version = "0.1.0"
description = "Local AI Agent Framework"
requires-python = ">=3.12"

dependencies = [
    "fastapi",
    "uvicorn",
    "pydantic",
    "python-dotenv",
    "ollama",
    "pytest"
]


[tool.pytest.ini_options]
pythonpath = [
    "."
]
EOF

fi


# -----------------------------------------------------
# requirements.txt
# -----------------------------------------------------

if [ ! -f requirements.txt ]; then

cat > requirements.txt <<'EOF'
fastapi
uvicorn
pydantic
python-dotenv
ollama
pytest
EOF

fi


# -----------------------------------------------------
# Ambiente
# -----------------------------------------------------

if [ ! -f .env.example ]; then

cat > .env.example <<'EOF'
# Ollama

OLLAMA_HOST=http://ollama.ai:11434
OLLAMA_MODEL=gemma4


# Application

LOG_LEVEL=INFO

EOF

fi


# -----------------------------------------------------
# Gitignore
# -----------------------------------------------------

if [ ! -f .gitignore ]; then

cat > .gitignore <<'EOF'
__pycache__/
*.pyc

.env

.venv/

.pytest_cache/

logs/*
!logs/.gitkeep

data/*
!data/.gitkeep

EOF

fi


# -----------------------------------------------------
# Placeholder directory files
# -----------------------------------------------------

touch logs/.gitkeep
touch data/.gitkeep


# -----------------------------------------------------
# README iniziale
# -----------------------------------------------------

if [ ! -f README.md ]; then

cat > README.md <<'EOF'
# Local Agent

Framework per un agente IA locale.

## Architettura prevista

- Ollama come backend LLM
- FastAPI come API layer
- Tool system modulare
- RAG
- Browser automation
- Computer Use


## Sviluppo

Installazione:

```bash
python -m venv .venv

. .venv/bin/activate

pip install -r requirements.txt
EOF

fi
