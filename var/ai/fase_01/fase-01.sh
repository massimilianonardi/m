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
