#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 2.4 Document Chunking
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione Document Chunker"


mkdir -p app/rag



# -----------------------------------------------------
# Aggiornamento modelli RAG
# -----------------------------------------------------

cat > app/rag/models.py <<'EOF'
"""
Modelli base RAG.
"""


from dataclasses import dataclass

from typing import Dict, List




@dataclass
class Document:


    id: str


    path: str


    content: str


    metadata: Dict[str, str]




@dataclass
class DocumentChunk:


    id: str


    document_id: str


    content: str


    metadata: Dict[str, str]

EOF



# -----------------------------------------------------
# Chunker
# -----------------------------------------------------

cat > app/rag/chunker.py <<'EOF'
"""
Divide documenti in chunk.
"""


import hashlib


from app.rag.models import (
    Document,
    DocumentChunk
)


from app.logging import get_logger



logger = get_logger(__name__)




class DocumentChunker:



    def __init__(
        self,
        chunk_size=500,
        overlap=50
    ):

        if overlap >= chunk_size:

            raise ValueError(
                "Overlap deve essere minore della dimensione chunk"
            )


        self.chunk_size = chunk_size

        self.overlap = overlap




    def split(
        self,
        document: Document
    ):


        text = document.content


        chunks = []


        start = 0


        index = 0



        while start < len(text):


            end = start + self.chunk_size


            content = text[start:end]



            chunk_id = hashlib.sha256(

                (

                    document.id

                    +

                    str(index)

                ).encode()

            ).hexdigest()



            chunks.append(

                DocumentChunk(

                    id=chunk_id,

                    document_id=document.id,

                    content=content,

                    metadata={

                        "chunk_index":
                        str(index)

                    }

                )

            )



            index += 1


            start = end - self.overlap



        logger.info(

            "Creati %s chunk",

            len(chunks)

        )


        return chunks

EOF



# -----------------------------------------------------
# Test
# -----------------------------------------------------

cat > tests/test_chunker.py <<'EOF'

from app.rag.models import Document

from app.rag.chunker import DocumentChunker




def test_chunk_creation():


    document = Document(

        id="doc1",

        path="test.txt",

        content="a" * 1200,

        metadata={}

    )


    chunker = DocumentChunker(

        chunk_size=500,

        overlap=50

    )


    chunks = chunker.split(

        document

    )


    assert len(chunks) > 1


    assert chunks[0].document_id == "doc1"



def test_invalid_overlap():


    try:

        DocumentChunker(

            chunk_size=10,

            overlap=10

        )

        assert False


    except ValueError:

        assert True

EOF



echo
echo "================================="
echo "Chunker RAG creato."
echo "================================="
echo
echo "Test:"
echo
echo "pytest tests/test_chunker.py"
