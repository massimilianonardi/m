#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 2.5 Embedding Engine
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione Embedding Engine"



mkdir -p app/embeddings

touch app/embeddings/__init__.py



# -----------------------------------------------------
# Configurazione
# -----------------------------------------------------

cat >> .env.example <<'EOF'


# Embedding Engine

EMBEDDING_MODEL=BAAI/bge-small-en-v1.5

EOF



python - <<'PY'
from pathlib import Path

path = Path("app/config.py")

text = path.read_text()

if "embedding_model" not in text:

    text = text.replace(

        'filesystem_root: str = "data"\n',

        '''filesystem_root: str = "data"


    embedding_model: str = "BAAI/bge-small-en-v1.5"

'''

    )

    path.write_text(text)

PY



# -----------------------------------------------------
# Embedding Engine
# -----------------------------------------------------

cat > app/embeddings/engine.py <<'EOF'
"""
Motore locale per embeddings.
"""


from typing import List



from sentence_transformers import SentenceTransformer



from app.config import get_settings

from app.logging import get_logger




logger = get_logger(__name__)




class EmbeddingEngine:



    def __init__(self):


        settings = get_settings()


        logger.info(

            "Caricamento modello embedding: %s",

            settings.embedding_model

        )


        self.model = SentenceTransformer(

            settings.embedding_model

        )




    def embed(

        self,

        text: str

    ) -> List[float]:


        vector = self.model.encode(

            text

        )


        return vector.tolist()




    def embed_many(

        self,

        texts: List[str]

    ):


        vectors = self.model.encode(

            texts

        )


        return [

            vector.tolist()

            for vector in vectors

        ]

EOF



# -----------------------------------------------------
# Test
# -----------------------------------------------------

cat > tests/test_embeddings.py <<'EOF'

from app.embeddings.engine import EmbeddingEngine




def test_embedding_creation():


    engine = EmbeddingEngine()


    vector = engine.embed(

        "test embedding"

    )


    assert isinstance(

        vector,

        list

    )


    assert len(vector) > 0



def test_multiple_embeddings():


    engine = EmbeddingEngine()


    vectors = engine.embed_many(

        [

            "ciao",

            "mondo"

        ]

    )


    assert len(vectors) == 2

EOF



echo
echo "================================="
echo "Embedding Engine creato."
echo "================================="
echo
echo "Dipendenze:"
echo "pip install sentence-transformers torch"
echo
echo "Test:"
echo "pytest tests/test_embeddings.py"
