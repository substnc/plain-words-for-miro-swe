#!/bin/bash
# Packar mappen extension/ till en zip som går att ladda upp i Chrome Web Store.
# manifest.json hamnar i zip-filens rot, som butiken kräver. Versionen läses
# från manifest.json, så höj den där innan varje ny uppladdning.
set -euo pipefail
cd "$(dirname "$0")/.."
VERSION=$(python3 -c 'import json;print(json.load(open("extension/manifest.json"))["version"])')
OUT="plain-words-for-miro-swe-$VERSION.zip"
node tests/check-texts.js >/dev/null
rm -f "$OUT"
(cd extension && zip -q -r -X "../$OUT" . -x '.*' -x '__MACOSX/*')
echo "Klar: $OUT"
unzip -l "$OUT"
