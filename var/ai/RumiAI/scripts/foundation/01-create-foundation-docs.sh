#!/bin/sh
#
# RumiAI Foundation Release
# Create documentation skeleton
#
# POSIX compliant
#

set -eu

DOC_ROOT=${1:-docs}

echo "Creating RumiAI documentation skeleton"

mkdir -p \
"$DOC_ROOT/architecture" \
"$DOC_ROOT/decisions" \
"$DOC_ROOT/specifications" \
"$DOC_ROOT/security" \
"$DOC_ROOT/roadmap"


create_file()
{
    FILE="$1"

    if [ ! -f "$FILE" ]; then
        cat > "$FILE" <<EOF
# $(basename "$FILE" .md)

RumiAI Project Documentation

Status:
Draft

EOF
        echo "created: $FILE"
    else
        echo "exists: $FILE"
    fi
}


create_file "$DOC_ROOT/00-project-manifesto.md"

create_file "$DOC_ROOT/architecture/software-architecture-document.md"

create_file "$DOC_ROOT/specifications/kernel.md"

create_file "$DOC_ROOT/specifications/knowledge.md"

create_file "$DOC_ROOT/specifications/tool.md"

create_file "$DOC_ROOT/specifications/llm.md"

create_file "$DOC_ROOT/specifications/memory.md"

create_file "$DOC_ROOT/specifications/workflow.md"

create_file "$DOC_ROOT/specifications/browser.md"

create_file "$DOC_ROOT/specifications/computer.md"

create_file "$DOC_ROOT/specifications/security.md"

create_file "$DOC_ROOT/security/security-model.md"

create_file "$DOC_ROOT/development-standards.md"

create_file "$DOC_ROOT/testing-strategy.md"

create_file "$DOC_ROOT/roadmap/roadmap.md"


create_file "$DOC_ROOT/decisions/ADR-0000-project-identity.md"
create_file "$DOC_ROOT/decisions/ADR-0001-local-first.md"
create_file "$DOC_ROOT/decisions/ADR-0002-podman-runtime.md"
create_file "$DOC_ROOT/decisions/ADR-0003-plugin-architecture.md"
create_file "$DOC_ROOT/decisions/ADR-0004-event-driven-architecture.md"
create_file "$DOC_ROOT/decisions/ADR-0005-knowledge-abstraction.md"
create_file "$DOC_ROOT/decisions/ADR-0006-lancedb-initial-store.md"
create_file "$DOC_ROOT/decisions/ADR-0007-llm-provider-abstraction.md"


echo ""
echo "RumiAI documentation skeleton created."
