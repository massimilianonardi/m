#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 1.3 Logging
# POSIX compliant
# =====================================================

set -eu


echo "==> Installazione logging centralizzato"



# -----------------------------------------------------
# Creazione modulo logging
# -----------------------------------------------------

cat > app/logging.py <<'EOF'
"""
Sistema logging centralizzato.

Tutti i moduli dell'applicazione
devono usare get_logger().
"""


import logging
import sys

from pathlib import Path

from app.config import get_settings



_initialized = False



def setup_logging():

    """
    Inizializza il sistema logging.
    """

    global _initialized


    if _initialized:
        return


    settings = get_settings()


    log_level = getattr(
        logging,
        settings.log_level.upper(),
        logging.INFO
    )


    log_directory = Path("logs")

    log_directory.mkdir(
        exist_ok=True
    )


    formatter = logging.Formatter(

        "%(asctime)s | "
        "%(levelname)s | "
        "%(name)s | "
        "%(message)s"

    )


    console = logging.StreamHandler(
        sys.stdout
    )

    console.setFormatter(
        formatter
    )


    file_handler = logging.FileHandler(

        log_directory /
        "agent.log"

    )

    file_handler.setFormatter(
        formatter
    )


    root = logging.getLogger()

    root.setLevel(
        log_level
    )


    root.addHandler(
        console
    )

    root.addHandler(
        file_handler
    )


    _initialized = True




def get_logger(name: str):

    """
    Restituisce un logger configurato.
    """

    setup_logging()

    return logging.getLogger(name)

EOF



# -----------------------------------------------------
# Test logging
# -----------------------------------------------------

cat > tests/test_logging.py <<'EOF'

from app.logging import get_logger



def test_logging():

    logger = get_logger(
        "test"
    )

    logger.info(
        "Test logging eseguito"
    )

    assert logger is not None



if __name__ == "__main__":

    logger = get_logger(
        "manual-test"
    )

    logger.info(
        "Logging funzionante"
    )

EOF



echo
echo "================================="
echo "Logging configurato."
echo "================================="
echo
echo "Test:"
echo
echo "pytest tests/test_logging.py"
echo
