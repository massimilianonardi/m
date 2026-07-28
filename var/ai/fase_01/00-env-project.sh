#!/bin/sh

PROJECT_NAME="local-agent"

if [ -d "$PROJECT_NAME" ]; then
    echo "Directory $PROJECT_NAME già presente."
else
    echo "==> Creazione progetto: $PROJECT_NAME"
    mkdir "$PROJECT_NAME"
fi

cd "$PROJECT_NAME"
