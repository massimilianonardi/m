#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 1.2 Configuration
# POSIX compliant
# =====================================================

set -eu


echo "==> Configurazione ambiente"


# -----------------------------------------------------
# Aggiornamento requirements
# -----------------------------------------------------

if ! grep -q "pydantic-settings" requirements.txt 2>/dev/null
then

    echo "Aggiungo pydantic-settings"

    printf '%s\n' "pydantic-settings" >> requirements.txt

fi


# -----------------------------------------------------
# Aggiornamento pyproject
# -----------------------------------------------------

if ! grep -q "pydantic-settings" pyproject.toml 2>/dev/null
then

    echo "Aggiorno pyproject.toml"

    sed -i.bak '/"python-dotenv"/a\
    "pydantic-settings",' pyproject.toml

    rm -f pyproject.toml.bak

fi


# -----------------------------------------------------
# File config.py
# -----------------------------------------------------

if [ ! -f app/config.py ]
then

cat > app/config.py <<'EOF'
"""
Configurazione centrale dell'applicazione.

Tutti i moduli devono leggere
la configurazione da questo file.
"""


from functools import lru_cache

from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict
)



class Settings(BaseSettings):

    """
    Configurazione applicazione.
    """

    # Ollama

    ollama_host: str = "http://ollama.ai:11434"

    ollama_model: str = "gemma4"


    # Application

    log_level: str = "INFO"


    model_config = SettingsConfigDict(

        env_file=".env",

        env_file_encoding="utf-8",

        case_sensitive=False

    )



@lru_cache
def get_settings() -> Settings:

    """
    Restituisce una singola istanza
    condivisa della configurazione.
    """

    return Settings()

EOF

fi


# -----------------------------------------------------
# Aggiornamento .env.example
# -----------------------------------------------------

cat > .env.example <<'EOF'
# ====================================
# Local Agent Configuration
# ====================================


# Ollama

OLLAMA_HOST=http://ollama.ai:11434

OLLAMA_MODEL=gemma4



# Application

LOG_LEVEL=INFO

EOF



# -----------------------------------------------------
# Test configurazione
# -----------------------------------------------------

cat > tests/test_config.py <<'EOF'

from app.config import get_settings



def test_configuration():

    settings = get_settings()


    assert settings.ollama_host

    assert settings.ollama_model

    assert settings.log_level



if __name__ == "__main__":

    print(
        get_settings()
    )

EOF



echo
echo "================================="
echo "Configurazione completata."
echo "================================="
echo
echo "Esegui:"
echo
echo "pip install -r requirements.txt"
echo
echo "poi:"
echo
echo "pytest tests/test_config.py"
echo
