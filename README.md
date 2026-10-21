# Plain Words for Miro SWE

miro.com förklarat med vanliga ord, på svenska.

Ett webbläsartillägg för Chrome som förklarar knappar, flikar och menyer på miro.com med vardagliga ord. Håll musen still över något i en halv sekund så dyker en pratbubbla upp. Den säger vad saken är, och under rubriken Nytta när du har användning av den. Självklara saker, som Log out, får ingen bubbla.

Inofficiellt. Inte gjort av, godkänt av eller kopplat till Miro.

**Så installerar du det:** läs [LASMIG.md](LASMIG.md).

## Mappar

- `extension/` själva tillägget. `explanations.js` innehåller alla förklaringar.
- `tests/check-texts.js` kollar att varje förklaring följer reglerna. Kör `node tests/check-texts.js`.
- `tests/sweep-in-browser.js` letar efter knappar som saknar förklaring, i din egen inloggade webbläsare.
- `tests/sync-skipped.js` för över listan med självklara saker (`PW_SKIPPED`) till svepet.
- `tests/sweep-log.txt` vilka menyer som finns, hur de öppnas och svepets siffror.
- `tools/make_icons.py` ritar ikonerna, pw på gul cirkel.
- `tools/bygg-zip.sh` packar `extension/` till zip-filen för Chrome Web Store.
- `store/` bilder, butikstext, motivering för behörigheter och integritetspolicy.
- `docs/beslut.md` varje viktigt val och varför.
- `bygg-safari.sh` gör om tillägget till en Safari-app på en Mac.

Av Anthon Bäckström. MIT-licens.
