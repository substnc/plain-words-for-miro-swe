# Beslut

Varje viktigt val i tre rader: vad som valdes, varför, och vad du ska tänka
på om du gör om det för en annan sajt. I samma ordning som de gjordes,
21 oktober 2026.

## 1. Namnet: Plain Words for Miro SWE

- **Valt:** "Plain Words for Miro SWE", samma familj som Plain Words for GitHub SWE.
- **Varför:** Miros riktlinjer för appar säger "<Din app> for <Miro-produkt>" och visar "Image Generator for Miro" som tillåtet, "Miro Image Generator" som otillåtet (developers.miro.com/docs/design-guidelines). Ett namn som börjar med "Miro" ser ut som Miros egen produkt.
- **Tänk på:** Sök upp sajtens egna regler för namn, ofta under "brand guidelines" eller "developer guidelines". Sök också efter tillägg med samma namn i Chrome Web Store och på GitHub.

## 2. Ingen Miro-logga i rutan

- **Valt:** Miros logga visas inte någonstans i tillägget. Ordet Miro står bara i text, för att säga vad tillägget fungerar med.
- **Varför:** Miros sida med logotypregler (brandkit.miro.com) gick inte att läsa, och partneravtalet kräver Miros godkännande för att använda deras märke. GitHub tillåter sitt märke litet, Miro har inget sådant tillstånd. Hellre utan än fel.
- **Tänk på:** Lägg bara in en sajts logga om du hittar en skriven regel som tillåter det. "Alla andra gör det" räcker inte.

## 3. Bara gränssnittet runt tavlan

- **Valt:** Verktygsfältet, menyerna, panelerna, delningsrutan, kontrollpanelen och inställningarna. Inte lappar eller former på tavlan.
- **Varför:** Tavlan är en canvas, en enda yta som ritas av programmet. Det finns inga knappar att fästa en bubbla vid där. Det du ritar är dessutom ditt eget innehåll.
- **Tänk på:** Kolla i svepet om delar av sajten är en canvas (Figma, Miro, kartor). De kan inte förklaras med den här metoden.

## 4. data-testid först, aria-label som reserv

- **Valt:** Nästan alla förklaringar känner igen saken på `data-testid`. aria-label används där testid saknas, och synlig text bara inuti en meny med testid.
- **Varför:** Miro har testid på nästan allt. Det är gjort för Miros egna automatiska tester, ändras sällan och är samma på alla språk. Genererade klassnamn som `c-kLYmPV` byts vid varje uppdatering.
- **Tänk på:** Börja varje sajt med en inventering: vilka testid, aria-label och role finns? Se tests/sweep-log.txt för hur den gjordes. Saknas testid helt är aria-label nästa bästa, men den byter språk med användaren.

## 5. Tre nivåer i stället för en

- **Valt:** (a) Bubbla med Nytta. (b) Bubbla med bara första raden, `obvious: true`, för sådant som är nästan självklart, som Main menu. (c) Ingen bubbla alls för det helt självklara, som Log out, Undo och Zoom in. De ligger i `PW_SKIPPED`.
- **Varför:** Anthon tyckte att för långa förklaringar på självklara saker blev tjatiga. En nybörjare läser hellre färre och bättre bubblor.
- **Tänk på:** Fråga dig: skulle någon som aldrig använt sajten men kan använda en dator förstå knappen ändå? Ja: ingen bubbla. Nästan: bara första raden. Nej: hela bubblan. Lägg allt utan bubbla i `PW_SKIPPED` så att svepet inte räknar det som missat, och kör `node tests/sync-skipped.js`.

## 6. Bubblan bredvid i menyer och verktygsfält

- **Valt:** I menyer, listor och verktygsfältet till vänster läggs bubblan bredvid saken i stället för under (`sidePlacement` i explanations.js).
- **Varför:** Under raden täckte bubblan nästa rader i menyn, så man kunde inte läsa det man skulle välja.
- **Tänk på:** Prova bubblan i en öppen meny och i ett lodrätt verktygsfält. Lägg till sajtens behållare i `sidePlacement`.

## 7. Menyerna öppnades av Anthon, inte av Claude

- **Valt:** Anthon klickade upp en meny i taget. Claude läste av ankarna och hovrade över undermenyerna.
- **Varför:** Klick från Claude in Chrome når inte fram på Miros tavla (inga klickhändelser kommer in), men hovring och tangentbordsfokus gör det. På kontrollpanelen och i inställningarna fungerade klicken.
- **Tänk på:** Prova ett ofarligt klick tidigt. Når det inte fram, dela upp arbetet: du klickar, Claude läser. Skriv i sweep-log.txt hur varje meny öppnas, så att nästa svep kan göra likadant.

## 8. En behörighet: storage

- **Valt:** `permissions: ["storage"]` och ett content script på `https://miro.com/app/*`. Inga `host_permissions`, ingen `activeTab`.
- **Varför:** Chrome Web Store kräver smalast möjliga behörigheter. Ett content script i manifestet behöver ingen host-behörighet. `activeTab` fungerar först efter ett klick på ikonen, och bubblorna ska synas direkt. `/app/*` räcker eftersom alla knappar finns där.
- **Tänk på:** Begränsa `matches` till den del av sajten som har knappar. Bredare behörighet ger längre granskning.

## 9. Integritetspolicy trots att inget samlas in

- **Valt:** En kort policy i `store/document_integritetspolicy_private.html`.
- **Varför:** Butiken kräver policy om tillägget hanterar användardata, och läsning av sidans innehåll kan räknas dit även om inget sparas. En policy kostar inget och tar bort risken för avslag.
- **Tänk på:** Policyn måste ligga på en publik adress innan du laddar upp. Den ska säga exakt vad som sparas (här bara på/av) och inget mer.

## 10. Ikon: pw på gul cirkel

- **Valt:** Monogrammet "pw" (Plain Words) i svart på en gul cirkel, #FFE873. GitHub-versionen fick samma form i lila på svart.
- **Varför:** Anthon ville ha gult som Miros app, men Miros gula rundade ruta med svarta streck är deras kännetecken. Chrome Web Store avvisar tillägg som kan förväxlas med ett annat märke. En cirkel, egna bokstäver och en ljusare gul ger samma känsla utan att likna Miro.
- **Tänk på:** Ta sajtens färg, men inte dess form eller logga. Kör `tools/make_icons.py` med ny färg. Butiksikonen ska vara 96x96 bild med 16 px genomskinlig kant på 128x128.

## 11. Accentfärgen i namnet och reglaget

- **Valt:** Ordet Miro i rutans rubrik och reglaget för Förklaringar är gula (GitHub: lila). Allt annat följer sub.stnc® Dark: svart, vitt, grått.
- **Varför:** Anthon ville att sajtens färg skulle synas, men designsystemet ska vara detsamma i alla Plain Words-tillägg.
- **Tänk på:** Ändra bara `--accent` i popup.css och färgen i make_icons.py. Rör inte resten av färgerna.

## 12. Skärmbilder med simulerad hovring

- **Valt:** Skärmbilderna visar riktiga bubblor från tillägget på testtavlan, beskurna till 1280x800. Bubblan visades med en simulerad mouseover.
- **Varför:** Riktig hovring från Claude når inte tavlan (se 7). Bubblan som syns är ändå exakt den som en användare ser. Inga personuppgifter syns, bara initialen A.
- **Tänk på:** Ta skärmbilder på en tom testsida utan namn, mejl eller kunddata. Kolla att texterna på bilderna stämmer med integritetspolicyn.

## 13. Texter för alla, inte för skolan

- **Valt:** Exemplen i bubblorna handlar om projekt, kollegor, kunder och möten, inte om lärare, klass eller skoluppgifter. Butikstexten säger inte att tillägget är för Berghs.
- **Varför:** Tillägget ska ligga publikt i Chrome Web Store, så vem som helst ska känna igen sig. Anthon ville bort från "lärare och elever".
- **Tänk på:** Bestäm målgruppen innan du skriver. Sök efter ord som pekar på en viss miljö (`grep -i "lärare\|klass\|skol"`) innan du bygger zip-filen.

## 14. Menyerna öppnades till sist med simulerade klick

- **Valt:** I slutkontrollen öppnade Claude menyerna själv med simulerade pekarhändelser (`pointerdown`, `click`) från sidans eget skript, och kontrollerade varje rad med tillägget påslaget.
- **Varför:** Riktiga klick från Claude in Chrome når inte Miros tavla, men händelser som skapas på sidan gör det. Då kunde alla undermenyer och flikar kontrolleras utan att Anthon klickade.
- **Tänk på:** Prova `element.click()` och simulerade pekarhändelser innan du ber användaren klicka. Använd dem bara för att öppna menyer och byta flikar, aldrig på knappar som ändrar något.

## 15. Avvikelse: flikbyte i delningsrutan utan att fråga

- **Valt:** Under slutkontrollen bytte Claude flik i delningsrutan (Invite, Embed, Publish, AI) utan att fråga först. Inget klickades inuti flikarna, och inget delades eller publicerades. Det räknas här som en avvikelse från regel 3 tills Anthon har sagt något annat.
- **Varför:** Regel 3 säger att Claude ska fråga när det är osäkert om ett klick ändrar något. Ett flikbyte ändrar inget, men fliken Publish har en knapp som publicerar, så det var nära nog att fråga.
- **Tänk på:** Fråga innan du byter flik i en dialog där någon flik kan dela, publicera eller bjuda in. Skillen säger nu det.

## 16. Present svepdes inte

- **Valt:** Presentationsläget öppnades aldrig. Knappen Present har en bubbla, men knapparna inne i presentationsläget saknar förklaring.
- **Varför:** Present startar ett läge på tavlan, och Anthon hann inte svara på om det var okej. Regel 3: klicka inte när du är osäker.
- **Tänk på:** Fråga innan du öppnar något som startar ett läge, en session eller ett samtal.
