#!/bin/sh

./01-bootstrap.sh
cd local-agent
pip install -r requirements.txt
cd ..

./02-config.sh
cd local-agent
pip install -r requirements.txt
pytest tests/test_config.py
cd ..

./03-logging.sh
cd local-agent
pip install -r requirements.txt
python tests/test_logging.py
cd ..

./04-ollama.sh
cd local-agent
pip install -r requirements.txt
pytest tests/test_ollama.py
cd ..

./05-tools.sh
cd local-agent
pip install -r requirements.txt
pytest tests/test_tools.py
cd ..

./06-planner.sh
cd local-agent
pip install -r requirements.txt
pytest tests/test_planner.py
cd ..

./07-agent.sh
cd local-agent
pip install -r requirements.txt
pytest tests/test_agent.py
cd ..

./08-api.sh
cd local-agent
pip install -r requirements.txt
pytest tests/test_api.py
cd ..

./09-timetool.sh
cd local-agent
pip install -r requirements.txt
pytest tests/test_time_tool.py
cd ..

./10-tests.sh
cd local-agent
./scripts/test.sh
cd ..

./11-terminal.sh
cd local-agent
cp .env.example .env
pytest tests/test_terminal_tool.py
cd ..

./12-filesystem.sh
cd local-agent
cp .env.example .env
pytest tests/test_filesystem_tool.py
cd ..

./13-document-loader.sh
cd local-agent
pytest tests/test_document_loader.py
cd ..

./14-chunking.sh
cd local-agent
pytest tests/test_chunker.py
cd ..

./15-embedding.sh
cd local-agent
pip install sentence-transformers torch
export SSL_CERT_FILE="/usr/local/share/ca-certificates/rpr-DOM-CA.crt"
pytest tests/test_embeddings.py
cd ..

./16-vector-store.sh
cd local-agent
pip install chromadb
pytest tests/test_vector_store.py
cd ..
