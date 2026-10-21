# Plain Words for Miro SWE

Webbläsartillägg som förklarar miro.com med vardagliga ord på svenska.
Skapat med skillen `/forklara-sajt`. Lärdomarna står i
`~/.claude/skills/forklara-sajt/referens.md`.

## Hur det körs

- Tillägget är mappen `extension/`. Det läses in i Chrome via
  `chrome://extensions`, Läs in okomprimerat tillägg. Efter en ändring:
  runda pilen på tilläggets kort, sedan ladda om sidan.
- `node tests/check-texts.js` kollar alla texter.
- `tests/sweep-in-browser.js` letar efter knappar utan förklaring, inloggat
  i Chrome. Siffrorna loggas i `tests/sweep-log.txt`.

## Regler för det här projektet

- Varje förklaring har `text` (vad saken är) och `use` (börjar med "När du").
  Max två meningar. Inga tankstreck. Skriv för någon som aldrig har kodat.
- Tre nivåer: hela bubblan, `obvious: true` (bara första raden) eller ingen
  bubbla alls (`PW_SKIPPED`, sedan `node tests/sync-skipped.js`).
- Känn igen saker på `data-testid` först. Aldrig på genererade klassnamn.
- Bara gränssnittet runt tavlan. Tavlan är en canvas och förklaras inte.
- Testtavlan heter plain-words-test. Öppna aldrig andra tavlor. Klicka
  aldrig på något som lägger till, flyttar, delar eller tar bort.
- Ingen Miro-logga och inget som liknar Miros app. Accentfärgen är #FFE873.
- Hellre ingen bubbla än fel bubbla.
- Avvikelse från projektskelettet: inget `src/` eller `assets/`. Chrome
  kräver att tillägget ligger samlat i en mapp, därför `extension/`.
  Butiksmaterialet ligger i `store/`, besluten i `docs/beslut.md`.
- Ny version till butiken: höj `version` i manifest.json, kör
  `tools/bygg-zip.sh`. Zip-filen hamnar i projektroten och är i .gitignore.
