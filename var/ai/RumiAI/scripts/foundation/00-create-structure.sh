#!/bin/sh
#
# RumiAI Foundation Release
# Create project structure
#
# POSIX compliant
#

set -eu

PROJECT_ROOT=${1:-rumiai}

echo "Creating RumiAI project structure in: $PROJECT_ROOT"

mkdir -p "$PROJECT_ROOT"

cd "$PROJECT_ROOT"

DIRECTORIES="
app
docs
docs/architecture
docs/decisions
docs/specifications
docs/security
docs/roadmap
tests
scripts
scripts/foundation
configs
plugins
examples
data
workspace
"

for dir in $DIRECTORIES
do
    mkdir -p "$dir"
    echo "created: $dir"
done

FILES="
README.md
LICENSE
CHANGELOG.md
"

for file in $FILES
do
    if [ ! -f "$file" ]; then
        touch "$file"
        echo "created: $file"
    else
        echo "exists: $file"
    fi
done

echo ""
echo "RumiAI foundation structure created."
