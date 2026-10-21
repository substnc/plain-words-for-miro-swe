#!/bin/bash
# Gör om tillägget till en Safari-app. Körs på en Mac med Xcode installerat.
# Resultatet hamnar i mappen "safari" bredvid det här skriptet.
set -e
cd "$(dirname "$0")"

# Kommandoradsverktygen har xcrun men inte omvandlaren. Den följer bara med hela Xcode.
if ! xcrun --find safari-web-extension-converter >/dev/null 2>&1; then
  echo "Hittar inte Safaris omvandlare. Den följer med Xcode, som du hämtar gratis i App Store."
  echo "Öppna Xcode en gång efter installationen och kör sedan: sudo xcode-select -s /Applications/Xcode.app"
  echo "Vill du bara prova tillägget går det utan Xcode, se Installera i Safari i LASMIG.md."
  exit 1
fi

xcrun safari-web-extension-converter extension \
  --project-location safari \
  --app-name "Plain Words Miro SWE" \
  --bundle-identifier com.anthonbackstrom.PlainWordsMiroSwe \
  --swift \
  --macos-only \
  --copy-resources \
  --no-prompt \
  --force

echo ""
echo "Klart. Öppna \"safari/Plain Words Miro SWE/Plain Words Miro SWE.xcodeproj\" i Xcode och tryck på Play."
