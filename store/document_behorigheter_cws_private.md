# Fliken Privacy i Chrome Web Store

Svaren att klistra in, fält för fält. Kontrollerat mot Chrome Web Stores
krav 2026-10-21. Texten i butiken skrivs på engelska, eftersom granskarna
läser engelska. Svensk översättning under varje svar.

## Single purpose

> Shows short Swedish explanations of Miro's interface buttons, menus and settings when the user hovers over them on miro.com.

Svenska: Visar korta förklaringar på svenska av Miros knappar, menyer och inställningar när man håller musen över dem på miro.com.

## Behörigheter

Tillägget ber bara om en behörighet. Det finns inga `host_permissions`.

### storage

> Saves one setting locally: whether the explanations are switched on or off. Nothing else is stored, and nothing leaves the browser.

Svenska: Sparar en inställning lokalt: om förklaringarna är på eller av. Inget annat sparas, och inget lämnar webbläsaren.

### Sidorna där tillägget körs (content script på https://miro.com/app/*)

Om fältet Host permission justification visas:

> The content script runs only on https://miro.com/app/*, the logged-in Miro app. It reads the labels of Miro's own buttons (aria-label and data-testid attributes) to choose which explanation to show. It never reads board content, never sends data anywhere and makes no network requests.

Svenska: Skriptet körs bara på https://miro.com/app/*, alltså inloggade Miro. Det läser namnen på Miros egna knappar för att välja förklaring. Det läser aldrig innehållet på tavlorna, skickar inget och gör inga nätverksanrop.

## Varför inga fler behörigheter

| Behörighet | Behövs inte, eftersom |
| --- | --- |
| `host_permissions` | Ett content script i manifestet behöver det inte. Det räcker med `matches`. |
| `activeTab` | Den gäller först efter ett klick på ikonen. Förklaringarna ska synas direkt. |
| `tabs`, `scripting` | Tillägget öppnar inga flikar och lägger inte in skript i efterhand. |
| `https://miro.com/*` (hela sajten) | Bara appen under `/app/` har knappar att förklara. Smalast möjliga. |

## Remote code

> No, I am not using remote code.

All kod ligger i paketet. Inga skript hämtas från nätet.

## Data usage

Kryssa inte i någon datatyp. Tillägget samlar inte in:
personuppgifter, hälsa, ekonomi, autentisering, kommunikation, plats,
webbhistorik, användaraktivitet eller webbplatsinnehåll.

Kryssa i alla tre intygen:
- I do not sell or transfer user data to third parties, outside of the approved use cases.
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

## Privacy policy

Adressen till `store/document_integritetspolicy_private.html` när den ligger
publikt. Se checklistan för var den kan ligga.
