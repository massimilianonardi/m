#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 2.6 Vector Store
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione Vector Store"



mkdir -p app/rag



# -----------------------------------------------------
# Configurazione
# -----------------------------------------------------

cat >> .env.example <<'EOF'


# Vector Store

VECTOR_DB_PATH=data/vectorstore

VECTOR_COLLECTION=documents

EOF



python - <<'PY'
from pathlib import Path

path = Path("app/config.py")

text = path.read_text()

if "vector_db_path" not in text:

    text = text.replace(

        'embedding_model: str = "BAAI/bge-small-en-v1.5"\n',

        '''embedding_model: str = "BAAI/bge-small-en-v1.5"


    vector_db_path: str = "data/vectorstore"


    vector_collection: str = "documents"

'''

    )

    path.write_text(text)

PY



# -----------------------------------------------------
# Vector Store
# -----------------------------------------------------

cat > app/rag/vector_store.py <<'EOF'
"""
Vector Store locale basato su ChromaDB.
"""


import chromadb


from app.config import get_settings

from app.logging import get_logger



logger = get_logger(__name__)




class VectorStore:



    def __init__(self):


        settings = get_settings()


        self.client = chromadb.PersistentClient(

            path=settings.vector_db_path

        )


        self.collection = (

            self.client.get_or_create_collection(

                name=settings.vector_collection

            )

        )



    def add(

        self,

        chunks,

        embeddings

    ):


        ids = []

        documents = []

        vectors = []

        metadata = []



        for chunk, vector in zip(

            chunks,

            embeddings

        ):


            ids.append(

                chunk.id

            )


            documents.append(

                chunk.content

            )


            vectors.append(

                vector

            )


            metadata.append(

                {

                    "document_id":

                    chunk.document_id

                }

            )



        self.collection.add(

            ids=ids,

            documents=documents,

            embeddings=vectors,

            metadatas=metadata

        )




    def search(

        self,

        embedding,

        limit=3

    ):


        result = self.collection.query(

            query_embeddings=[embedding],

            n_results=limit

        )


        return result

EOF



# -----------------------------------------------------
# Test
# -----------------------------------------------------

cat > tests/test_vector_store.py <<'EOF'

from app.rag.models import DocumentChunk

from app.rag.vector_store import VectorStore




def test_vector_storage():


    store = VectorStore()



    chunk = DocumentChunk(

        id="chunk1",

        document_id="doc1",

        content="Podman usa container",

        metadata={}

    )


    store.add(

        [chunk],

        [[0.1, 0.2, 0.3]]

    )


    result = store.search(

        [0.1, 0.2, 0.3]

    )


    assert result

    assert len(

        result["ids"][0]

    ) > 0

EOF



echo
echo "================================="
echo "Vector Store creato."
echo "================================="
echo
echo "Dipendenza:"
echo "pip install chromadb"
echo
echo "Test:"
echo "pytest tests/test_vector_store.py"
