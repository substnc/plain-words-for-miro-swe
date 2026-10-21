# Plain Words for Miro SWE

miro.com förklarat med vanliga ord, på svenska.

Ett tillägg till webbläsaren. Håll musen still över en knapp, flik, meny eller länk på miro.com i ungefär en halv sekund, så dyker en svart pratbubbla upp. Den berättar med vardagliga ord vad saken är, och under rubriken Nytta när du har användning av den.

Allt finns redan i tillägget. Det behövs ingen AI, ingen nyckel och ingen internetanslutning för förklaringarna. Tillägget läser bara sidor på miro.com och skickar ingenting någonstans.

## Installera från Chrome Web Store

Sök på **Plain Words for Miro SWE** i Chrome Web Store och klicka på **Lägg till i Chrome**. Klart. (Fungerar när tillägget är publicerat där.)

## Installera i Chrome från en mapp

Det tar ungefär fem minuter. Du gör det bara en gång.

1. **Hämta filerna.** Gå till https://github.com/substnc/plain-words-for-miro-swe. Klicka på den gröna knappen **Code** och sedan på **Download ZIP**.
2. **Packa upp.** Öppna mappen Hämtade filer och dubbelklicka på zip-filen. Flytta mappen till ett ställe där den får ligga kvar, till exempel Dokument. Raderar du mappen slutar tillägget att fungera.
3. **Öppna Chromes tilläggssida.** Skriv `chrome://extensions` i adressfältet och tryck Enter.
4. **Slå på utvecklarläget.** Klicka på reglaget **Utvecklarläge** (Developer mode) uppe till höger. Det betyder bara att du får lägga in tillägg från din egen dator.
5. **Lägg in tillägget.** Klicka på **Läs in okomprimerat tillägg** (Load unpacked) och välj mappen **extension** inuti mappen från steg 2.
6. **Sätt fast ikonen.** Klicka på pusselbiten uppe till höger i Chrome och på nålen bredvid **Plain Words for Miro SWE**.
7. **Prova.** Gå till https://miro.com/app/dashboard/ och håll musen still över en knapp.

## Installera i Safari

Det finns två sätt. Det första är enklast och kräver ingenting extra, men tillägget är bara tillfälligt. Det andra är permanent men kräver programmet Xcode.

### Snabbt och tillfälligt, utan Xcode

Kräver Safari 26 eller senare.

1. **Hämta filerna** på samma sätt som i steg 1 och 2 för Chrome ovan.
2. **Visa utvecklarinställningarna.** Öppna Safari, tryck **Cmd + ,** och gå till fliken **Avancerat**. Bocka i **Visa funktioner för webbutvecklare**.
3. **Lägg till tillägget.** Gå till fliken **Utvecklare** i samma fönster och klicka på **Lägg till tillfälligt tillägg** (Add Temporary Extension). Godkänn med ditt lösenord eller Touch ID om Safari frågar. Välj mappen **extension** och klicka **Välj**.
4. **Slå på det.** Safari byter till fliken **Tillägg**, där **Plain Words for Miro SWE** står under Tillfälliga. Bocka i det och tillåt det på miro.com.

Ett tillfälligt tillägg försvinner efter en tid, eller när du startar om Safari. Då gör du steg 3 och 4 igen.

Vill du ha det permanent i Safari: installera Xcode från App Store och kör `bash bygg-safari.sh`.

## Använda tillägget

- **Visa en förklaring:** håll musen still över något på miro.com i ungefär en halv sekund.
- **Stänga bubblan:** flytta musen därifrån eller tryck på Esc.
- **Stänga av alla bubblor:** klicka på ikonen och slå av Förklaringar.

## Uppdatera

Hämta en ny zip-fil, byt ut mappen och klicka på den runda pilen på tilläggets kort i `chrome://extensions`. Ladda sedan om sidan.

## Om något krånglar

- **Ingen bubbla dyker upp:** ladda om sidan. Kolla att Förklaringar är påslaget i tilläggets ruta.
- **Ingen bubbla på en viss knapp:** den knappen saknar förklaring än, eller så har sajten ändrat hur den ser ut i koden.

## Ändra eller lägga till en förklaring

Öppna `extension/explanations.js`. `text` säger vad saken är. `use` säger när du har nytta av den och börjar alltid med "När". Är saken nästan självklar skriver du `obvious: true` i stället för `use`, då visas bara första raden. Är den helt självklar, som Log out, flyttar du den till listan `PW_SKIPPED` längst ner och kör `node tests/sync-skipped.js`. Spara, klicka på den runda pilen i `chrome://extensions` och ladda om sidan. Kör `node tests/check-texts.js` för att se att texterna följer reglerna.

Av Anthon Bäckström.
