#!/bin/sh

. ./00-env-project.sh

# =====================================================
# Local Agent - Phase 2.3 Document Loader
# POSIX compliant
# =====================================================

set -eu


echo "==> Creazione Document Loader"



mkdir -p app/documents
mkdir -p app/rag



touch app/documents/__init__.py
touch app/rag/__init__.py



# -----------------------------------------------------
# Modello documento
# -----------------------------------------------------

cat > app/rag/models.py <<'EOF'
"""
Modelli base per RAG.
"""


from dataclasses import dataclass

from typing import Dict




@dataclass
class Document:


    id: str


    path: str


    content: str


    metadata: Dict[str, str]

EOF



# -----------------------------------------------------
# Document Loader
# -----------------------------------------------------

cat > app/documents/loader.py <<'EOF'
"""
Caricatore documenti locali.
"""


from pathlib import Path

import hashlib



from app.rag.models import Document

from app.config import get_settings

from app.logging import get_logger




logger = get_logger(__name__)




class DocumentLoader:



    def __init__(self):


        settings = get_settings()


        self.root = Path(

            settings.filesystem_root

        ).resolve()




    def load_file(self, path: str):


        file_path = (

            self.root /
            path

        ).resolve()



        if not str(file_path).startswith(

            str(self.root)

        ):

            raise ValueError(

                "Percorso non consentito"

            )



        if not file_path.exists():

            raise FileNotFoundError(

                path

            )



        extension = (

            file_path
            .suffix
            .lower()

        )



        if extension not in (

            ".txt",

            ".md"

        ):

            raise ValueError(

                "Formato non supportato"

            )



        content = file_path.read_text(

            encoding="utf-8"

        )



        identifier = hashlib.sha256(

            content.encode()

        ).hexdigest()



        return Document(

            id=identifier,

            path=str(path),

            content=content,

            metadata={

                "extension": extension

            }

        )

EOF



# -----------------------------------------------------
# Test
# -----------------------------------------------------

cat > tests/test_document_loader.py <<'EOF'

from pathlib import Path


from app.documents.loader import DocumentLoader




def test_load_document():


    root = Path("data")

    root.mkdir(

        exist_ok=True

    )


    file = root / "example.txt"


    file.write_text(

        "documento di test",

        encoding="utf-8"

    )


    loader = DocumentLoader()



    doc = loader.load_file(

        "example.txt"

    )


    assert doc.content == (

        "documento di test"

    )


    assert doc.metadata["extension"] == ".txt"

EOF



echo
echo "================================="
echo "Document Loader creato."
echo "================================="
echo
echo "Test:"
echo
echo "pytest tests/test_document_loader.py"
