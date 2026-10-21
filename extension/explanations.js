/*
 * Plain Words for Miro SWE: alla förklaringar.
 *
 * PW_CONFIG säger hur tillägget ska bete sig på miro.com.
 * PW_EXPLANATIONS är listan med förklaringar. Varje förklaring har:
 *   key        en intern kod (används bara av programmet och testerna)
 *   name       vad saken heter på sajten (visas i grått överst i bubblan)
 *   text       vad saken är, med vardagliga ord, max två korta meningar
 *   use        när man har nytta av den, börjar med "När", visas under rubriken Nytta
 *   obvious    true i stället för use när saken är självklar (ångra, zooma, stäng).
 *              Då visas bara namnet och första raden. Anthons val 2026-10-21.
 *
 * Och ett eller flera sätt att känna igen saken på sidan. Programmet provar
 * dem i den här ordningen: ids, aria (aria-label, title, placeholder, alt),
 * href (länkens adress utan ?-del), selectors (CSS) och sist texts (synlig text).
 * Siffror, parenteser och kolon tas bort före jämförelsen, och allt jämförs
 * med små bokstäver. En sträng måste stämma exakt, ett /mönster/ räcker att det matchar.
 *
 * Valfria begränsningar:
 *   tags       bara de här elementtyperna för texts, t.ex. ["a"] eller ["button"]
 *   within     måste ligga inuti något som matchar den här CSS-väljaren
 *   notWithin  får inte ligga inuti något som matchar den här CSS-väljaren
 *   page       sidans adress (sökvägen) måste matcha det här mönstret
 * Förklaringar med within eller page provas före andra.
 *
 * Miro: nästan allt runt tavlan har ett data-testid. Det är samma på alla
 * språk och byter sällan namn, så det används i första hand (tid() nedan).
 * Tavlan själv (det man ritar på) är en canvas och förklaras inte.
 * Svepets ankare och hur menyerna öppnas står i tests/sweep-log.txt.
 */
(function () {
  globalThis.PW_CONFIG = {
    // Rubriken över nyttan i bubblan.
    useLabel: "Nytta",
    // Varje nytta ska börja så här. Kollas av tests/check-texts.js.
    useStartsWith: "När ",
    // Text som människor själva har skrivit. Där jämförs aldrig knapptext.
    userContent: "article p, blockquote, pre, code, textarea, [contenteditable]",
    sameSiteHosts: [],
    // Bubblan bredvid saken i menyer, i verktygsfältet till vänster på tavlan
    // och i sidopanelerna, så att den inte täcker nästa rad.
    sidePlacement:
      '[role="menu"], [role="listbox"], [role="tree"], [data-testid="LayoutPanelContainer"], [data-testid="spaces-sidebar-element"], [data-testid="LayoutPanelItem"]'
  };

  // Ett eller flera data-testid, exakt.
  function tid() {
    return Array.prototype.map.call(arguments, function (t) {
      return '[data-testid="' + t + '"]';
    });
  }
  // Alla data-testid som börjar med det här.
  function tidStart(prefix) {
    return '[data-testid^="' + prefix + '"]';
  }

  var DASHBOARD = /^\/app\/dashboard/;
  var BOARD = /^\/app\/board\//;
  var SETTINGS = /^\/app\/settings\//;

  globalThis.PW_EXPLANATIONS = [
    /* ================= Överallt ================= */
    {
      key: "skip-links",
      name: "Skip to ...",
      text: "Genvägar för den som använder tangentbordet eller en skärmläsare. De hoppar direkt till en del av sidan.",
      obvious: true,
      texts: [/^skip to /, "enhance accessibility support"]
    },

    /* ================= Kontrollpanelen (startsidan med alla tavlor) ================= */
    {
      key: "dash-org-settings",
      name: "Organization settings",
      text: "Kugghjulet öppnar inställningarna för ditt team: vilka som är med, säkerhet och appar.",
      use: "När du vill se vem som är med i teamet eller ändra teamets namn.",
      selectors: tid("icon-button-[object-object]"),
      aria: ["organization settings"]
    },
    {
      key: "dash-create-org",
      name: "Create an organization",
      text: "Skapar en organisation, alltså en samlad plats för flera team, till exempel ett helt företag.",
      use: "När ett helt företag ska samla sina team. För ett litet team behövs det inte.",
      selectors: tid("icon-button-create-an-organization")
    },
    {
      key: "dash-create-menu",
      name: "Create",
      text: "Öppnar en meny där du skapar något nytt: en tavla, ett utrymme (Space) eller en import.",
      use: "När du ska börja på något nytt, till exempel en tavla för ett nytt projekt.",
      selectors: tid("create-menu-trigger")
    },
    {
      key: "dash-starred",
      name: "Starred",
      text: "Tavlor du har markerat med en stjärna, samlade på ett ställe.",
      use: "När du vill hitta dina viktigaste tavlor snabbt utan att söka.",
      selectors: tid("tree-item-starred"),
      // Rubriken Starred i sidopanelen på tavlan har inget testid.
      texts: ["starred"],
      tags: ["button"]
    },
    {
      key: "dash-browse",
      name: "Browse",
      text: "Visar alla tavlor i teamet, även sådana som andra har gjort och delat.",
      use: "När du letar efter en tavla som någon annan i teamet har skapat.",
      selectors: tid("tree-item-browse")
    },
    {
      key: "dash-create-space",
      name: "Create Space",
      text: "Ett utrymme (Space) är en mapp där du samlar tavlor som hör ihop, till exempel för ett projekt.",
      use: "När du har flera tavlor för samma projekt och vill hålla ordning.",
      selectors: tid("create-menu-create-space", "team-free-create-space-link")
    },
    {
      key: "dash-beta",
      name: "Beta",
      text: "Visar att du använder en ny version av Miro som fortfarande testas. Klicka för att läsa vad som är nytt.",
      use: "När något ser annorlunda ut än i en guide du läser.",
      selectors: tid("platform-beta-tag")
    },
    {
      key: "dash-free-plan",
      name: "Free plan",
      text: "Visar vilken plan teamet har. Gratisplanen räcker långt men har en gräns för hur många tavlor du kan redigera.",
      use: "När Miro säger att du har nått en gräns och du vill se varför.",
      selectors: tid("free-plan-upgrade-popover__chip")
    },
    {
      key: "invite-members",
      name: "Invite members",
      text: "Bjuder in någon till hela teamet, så att den personen ser teamets tavlor.",
      use: "När en kollega ska jobba med dig i flera tavlor, inte bara en.",
      selectors: tid("dashboard-promotion-buttons__invite_members-button", "invite-new-members__button")
    },
    {
      key: "upgrade",
      name: "Upgrade",
      text: "Byter till en plan som kostar pengar och ger fler funktioner.",
      use: "När gratisplanen inte räcker längre, till exempel för att ni behöver fler tavlor.",
      selectors: tid(
        "dashboard-promotion-buttons__upgrade-button",
        "upgrade-btn",
        "topBar-upgrade-button",
        "user-switcher__upgrade-btn",
        "commonCompanyPromo__button",
        "share-window-team-management-hidden-text-upgrade-button",
        "settings__billing-overview__change-plan-link"
      ),
      texts: ["upgrade"],
      tags: ["button", "a"]
    },
    {
      key: "dash-referral",
      name: "Get up to $500",
      text: "Miros värvningsprogram. Du får rabatt om någon du bjuder in börjar betala.",
      use: "När du vill tipsa någon om Miro. Behövs inte för att använda Miro.",
      selectors: tid("referral-program_button")
    },
    {
      key: "dash-feed",
      name: "Feed",
      text: "Klockan visar aviseringar (notiser), till exempel när någon har kommenterat eller nämnt dig.",
      use: "När du vill se vad som har hänt på dina tavlor sedan sist.",
      selectors: tid("feedback-button")
    },
    {
      key: "dash-profile",
      name: "Profil",
      text: "Din bild öppnar en meny med ditt konto, papperskorgen och utloggning.",
      use: "När du vill ändra namn, hitta något du har raderat eller logga ut.",
      selectors: tid("user-switcher__root")
    },
    {
      key: "dash-from-miroverse",
      name: "From Miroverse",
      text: "Miroverse är Miros bibliotek med mallar som andra användare har gjort och delat.",
      use: "När du söker inspiration eller en färdig mall för en workshop.",
      selectors: tid("dashboardTemplatesPanel__fromTemplate")
    },
    {
      key: "dash-board-options",
      name: "Options",
      text: "Tre prickar på en tavla i listan. Där kan du byta namn, kopiera, flytta eller ta bort tavlan.",
      use: "När du vill städa bland dina tavlor utan att öppna dem.",
      selectors: tid("board-context-menu-trigger")
    },
    {
      key: "dash-template-card",
      name: "Mall",
      text: "En mall är en tavla med färdig struktur, till exempel för en retrospektiv eller en tidsplan.",
      use: "När du vill slippa bygga upp allt själv och komma igång snabbt.",
      selectors: [tid("templates-panel-loaded-templates")[0] + " button"],
      page: DASHBOARD
    },
    {
      key: "dash-template-category",
      name: "Templates for ...",
      text: "Väljer vilket slags mallar som visas här, till exempel för design eller projektledning.",
      use: "När förslagen inte passar det du ska göra.",
      texts: [/^templates for /],
      page: DASHBOARD
    },

    /* ---------- Create-menyn på kontrollpanelen ---------- */
    {
      key: "create-format",
      name: "Format",
      text: "Skapar något i ett färdigt format, till exempel ett dokument, en tabell eller en presentation, i stället för en tom tavla.",
      use: "När du vet att du ska göra en viss sak, som en presentation.",
      texts: ["format"],
      within: tid("create-boards-dropdown")[0]
    },
    {
      key: "create-import",
      name: "Import",
      text: "Hämtar in en fil från datorn eller en tavla från ett annat program, till exempel en PDF.",
      use: "När du redan har material någon annanstans och vill jobba vidare i Miro.",
      texts: ["import"],
      within: tid("create-boards-dropdown")[0]
    },
    {
      key: "create-explore-templates",
      name: "Explore templates",
      text: "Öppnar alla Miros mallar, sorterade efter ämne.",
      use: "När du vill se vilka färdiga upplägg som finns innan du börjar.",
      selectors: tid("create-menu-explore-templates")
    },
    {
      key: "create-explore-miroverse",
      name: "Explore Miroverse",
      text: "Öppnar Miroverse, där andra användare delar med sig av sina mallar.",
      use: "När du söker idéer från andra, till exempel designers eller projektledare.",
      texts: ["explore miroverse"],
      within: tid("create-boards-dropdown")[0]
    },

    /* ---------- Profilmenyn på kontrollpanelen ---------- */
    {
      key: "profile-settings",
      name: "Profile / Profile settings",
      text: "Dina egna inställningar: namn, bild, språk och vilka aviseringar du får.",
      use: "När du vill byta bild, språk eller stänga av mejl från Miro.",
      selectors: tid("user-switcher__user-profile-btn", "self-user-dropdown__profile-settings", "board-settings__app_ACC_SETTINGS")
    },
    {
      key: "profile-connect-ai",
      name: "Connect AI tools",
      text: "Kopplar ihop Miro med AI-tjänster utanför Miro, till exempel en chattbot.",
      use: "När du vill att ett AI-verktyg ska kunna läsa eller skapa saker på dina tavlor.",
      selectors: tid("connect-ai-tools-menu-item")
    },
    {
      key: "profile-admin-console",
      name: "Admin Console",
      text: "Inställningarna för hela teamet: medlemmar, säkerhet och appar.",
      use: "När du är den som har skapat teamet och vill styra vem som får vara med.",
      selectors: tid("user-switcher__admin-console-btn")
    },
    {
      key: "profile-trash",
      name: "Trash",
      text: "Papperskorgen. Här hamnar tavlor som har tagits bort, och de går att få tillbaka en tid.",
      obvious: true,
      selectors: tid("user-switcher__trash-btn")
    },
    {
      key: "learning-center",
      name: "Learning Center",
      text: "Miros egna kurser och filmer om hur Miro fungerar, på engelska.",
      use: "När du vill lära dig mer än det grundläggande.",
      selectors: tid("user-switcher__learning-center-btn", "action-item__LEARNING_CENTER")
    },
    {
      key: "profile-apps",
      name: "iOS, Android, Desktop Apps",
      text: "Länkar till Miro som app för mobilen och datorn.",
      use: "När du vill använda Miro på mobilen eller utan webbläsare.",
      selectors: tid("user-switcher__open-apps-btn")
    },
    {
      key: "profile-developer-hub",
      name: "Developer Hub",
      text: "Sidor för programmerare som bygger egna tillägg till Miro.",
      use: "När du kan programmera och vill bygga något eget. Annars behövs den inte.",
      selectors: tid("user-switcher__developer-plan-btn")
    },
    {
      key: "profile-marketplace",
      name: "Miro Marketplace",
      text: "En butik med tillägg (appar) från andra företag som fungerar i Miro.",
      use: "När du vill koppla ihop Miro med ett annat verktyg du använder.",
      selectors: tid("user-switcher__open-marketplace-btn"),
      // Länken längst ner i verktygspanelen.
      texts: [/^find more tools on the marketplace/]
    },

    /* ================= Tavlan: raden högst upp till vänster ================= */
    {
      key: "board-sidebar",
      name: "Sidebar",
      text: "Visar eller döljer listan till vänster med dina andra tavlor.",
      obvious: true,
      selectors: tid("toggle-spaces-sidebar-button")
    },
    {
      key: "board-emoji",
      name: "Choose emoji",
      text: "Väljer en liten bild (emoji) som syns bredvid tavlans namn.",
      use: "När du vill känna igen tavlan snabbare i listan.",
      selectors: tid("board-icon-picker__container")
    },
    {
      key: "board-main-menu",
      name: "Main menu",
      text: "Tavlans huvudmeny med inställningar för tavlan, redigering, visning och tillgänglighet.",
      obvious: true,
      selectors: tid("board-settings__toggle-icon")
    },
    {
      key: "board-export",
      name: "Export this board",
      text: "Sparar tavlan som en fil, till exempel PDF eller bild, eller som mall.",
      obvious: true,
      selectors: tid("board-export__plugin_toggle-icon")
    },

    /* ---------- Tavlan: högst upp till höger ---------- */
    {
      key: "board-get-set-up",
      name: "Get set up",
      text: "En lista med förslag på saker att prova i Miro, med hur många som är kvar.",
      use: "När du är ny och vill ha tips på var du ska börja.",
      selectors: tid("welcome-checklist__entrypoint")
    },
    {
      key: "board-facilitation",
      name: "Facilitation tools and reactions",
      text: "Verktyg för den som leder ett möte på tavlan: reaktioner, timer och omröstning.",
      use: "När du håller i en workshop och vill att alla ska rösta eller hålla tiden.",
      selectors: tid("timberlake-facilitation-apps-and-reactions-dropdown__trigger")
    },
    {
      key: "board-activity",
      name: "Activity",
      text: "Visar kommentarer och vad som har ändrats på tavlan.",
      use: "När du har varit borta och vill se vad de andra har gjort.",
      selectors: tid("toolbar-comment-activity-button")
    },
    {
      key: "board-video",
      name: "Record Talktrack or start a call",
      text: "Spela in en film där du visar och pratar om tavlan (Talktrack), eller starta ett videosamtal.",
      use: "När du vill förklara tavlan för någon som tittar senare.",
      selectors: tid("videotoolsdropdown-toggle")
    },
    {
      key: "board-self-user",
      name: "Du",
      text: "Din bild på tavlan. Menyn visar din roll och om andras muspekare ska synas.",
      use: "När andras muspekare stör dig och du vill dölja dem.",
      selectors: tid("self-user-dropdown-trigger")
    },
    {
      key: "board-present",
      name: "Present",
      text: "Visar tavlan som en presentation, ram (Frame) för ram, som bilder i ett bildspel.",
      use: "När du ska presentera direkt från tavlan, utan att göra bilder någon annanstans.",
      selectors: tid("presentation-mode-start-session-button")
    },
    {
      key: "board-share",
      name: "Share",
      text: "Bjuder in andra till just den här tavlan och bestämmer vad de får göra.",
      use: "När du vill att gruppen ska kunna se eller ändra tavlan.",
      selectors: tid("share-board-button")
    },

    /* ---------- Tavlan: verktygsfältet till vänster ---------- */
    {
      key: "tool-sidekick",
      name: "Sidekick",
      text: "Miros AI-assistent. Den kan skriva, sammanfatta och skapa saker på tavlan åt dig.",
      use: "När du vill ha hjälp att komma igång eller sammanfatta många lappar.",
      aria: [/sidekick/],
      within: tid("CreationBarTopButtons")[0] + ", " + tid("LayoutPanelContainer")[0]
    },
    {
      key: "tool-select",
      name: "Select",
      text: "Pekaren. Med den markerar och flyttar du saker på tavlan.",
      obvious: true,
      selectors: tid("CreationBarButton--CREATION_BAR_CURSOR_BUTTON")
    },
    {
      key: "tool-formats",
      name: "Formats and Flows",
      text: "Lägger in färdiga format, till exempel dokument, tabell eller tidslinje, och AI-flöden.",
      use: "När lappar inte räcker och du vill ha något mer ordnat, som en tabell.",
      selectors: tid("CreationBarButton--AI_CANVAS_FORMATS_AND_FLOWS_MENU")
    },
    {
      key: "tool-templates",
      name: "Templates",
      text: "Öppnar Miros mallar, alltså färdiga upplägg du kan lägga in på tavlan.",
      use: "När du ska göra något vanligt, som en tankekarta, och vill slippa börja från noll.",
      selectors: tid("CreationBarButton--TEMPLATES", "app-menu__item-TEMPLATES")
    },
    {
      key: "tool-sticky",
      name: "Sticky note",
      text: "Lappar, som post-it-lappar. Du väljer färg och klickar på tavlan för att sätta upp en.",
      use: "När gruppen ska spåna idéer och skriva en tanke per lapp.",
      selectors: tid("CreationBarButton--STICKERS", "app-menu__item-STICKERS")
    },
    {
      key: "tool-shapes",
      name: "Shapes and lines",
      text: "Former som rutor och cirklar, och linjer och pilar som binder ihop dem.",
      use: "När du ritar ett flödesschema eller visar hur saker hänger ihop.",
      selectors: tid("CreationBarButton--SHAPES", "app-menu__item-SHAPES")
    },
    // Pen-panelen
    {
      key: "pen-smart",
      name: "Smart pen",
      text: "En penna som gör om det du ritar till rena former, till exempel en sned ruta till en rak.",
      use: "När du skissar snabbt men vill att det ska se prydligt ut.",
      selectors: tid("draw-toolbar-smart-pen")
    },
    {
      key: "pen-precision-eraser",
      name: "Precision eraser",
      text: "Suddar bara den del av ett streck som du drar över, inte hela strecket.",
      obvious: true,
      selectors: tid("draw-toolbar-precision-eraser")
    },
    {
      key: "pen-preset",
      name: "Sparad penna",
      text: "En penna med färdig färg och tjocklek. Klicka igen för att ändra den.",
      obvious: true,
      selectors: [tidStart("draw-toolbar-preset-")]
    },
    {
      key: "tool-frame",
      name: "Frame",
      text: "En ram (Frame) är en ruta som delar in tavlan i delar, ungefär som sidor eller bilder i ett bildspel.",
      use: "När du vill dela upp tavlan i avsnitt eller göra en presentation.",
      selectors: tid("CreationBarButton--FRAMES", "app-menu__item-FRAMES")
    },
    {
      key: "tool-media",
      name: "Stickers, Emoji and GIFs",
      text: "Klistermärken, emojier och rörliga bilder (GIF) att sätta på tavlan.",
      use: "När du vill göra tavlan roligare eller visa en känsla.",
      selectors: tid("CreationBarButton--MEDIA_LIBRARY", "app-menu__item-MEDIA_LIBRARY")
    },
    {
      key: "tool-comment",
      name: "Comment",
      text: "Sätter en kommentar på en plats på tavlan, som en gul lapp med en fråga.",
      use: "När du vill fråga eller tycka något utan att ändra själva innehållet.",
      selectors: tid("CreationBarButton--COMMENTS", "app-menu__item-COMMENTS")
    },
    {
      key: "tool-catalog",
      name: "Tools, Media and Integrations",
      text: "Plustecknet visar alla verktyg som inte får plats i fältet, plus appar från andra företag.",
      use: "När du saknar ett verktyg, som tabell, tankekarta eller att ladda upp en fil.",
      selectors: tid("CreationBarButton--CATALOG")
    },

    /* ---------- Tavlan: nere till höger och i mitten ---------- */
    {
      key: "board-frames-list",
      name: "Frames",
      text: "Visar en lista över alla ramar (Frames) på tavlan, i ordning.",
      use: "När tavlan är stor och du vill hoppa direkt till en viss del.",
      selectors: tid("action-item__FRAMES_LIST")
    },
    {
      key: "board-zoom-menu",
      name: "Zoom and navigation",
      text: "Visar hur inzoomad du är. Klicka för fler val, som att se hela tavlan.",
      use: "När du har tappat bort dig på tavlan och vill hitta tillbaka.",
      selectors: tid("canvas-controls-zoom-button")
    },
    {
      key: "board-help",
      name: "Help and resources",
      text: "Frågetecknet öppnar hjälp: Miros hjälpsidor, kortkommandon och vad som är nytt.",
      obvious: true,
      selectors: tid("canvas-controls-feedback-button")
    },
    {
      key: "board-prompt-chip",
      name: "Förslag till AI",
      text: "Färdiga förslag på vad Miros AI kan göra åt dig på tavlan.",
      use: "När du inte vet vad du ska be AI:n om och vill testa.",
      selectors: [tidStart("prompt-starter-chip-")]
    },
    {
      key: "board-prompt-dismiss",
      name: "Hide prompt starters",
      text: "Döljer förslagen ovanför AI-rutan.",
      obvious: true,
      selectors: tid("prompt-starter-bar-dismiss")
    },
    {
      key: "board-ai-input",
      name: "AI input",
      text: "Här skriver du vad Miros AI ska göra, till exempel \"gör en tidsplan för vårt projekt\".",
      use: "När du vill att AI:n ska skapa ett första utkast på tavlan.",
      aria: ["ai input"]
    },
    {
      key: "board-ai-add",
      name: "Add content",
      text: "Lägger till en fil, länk eller annat som AI:n ska utgå från.",
      use: "När AI:n ska jobba med ditt eget material, som en uppgiftsbeskrivning.",
      aria: ["add content"],
      within: tid("inline-chat-shell")[0]
    },
    {
      key: "board-ai-dictation",
      name: "Start dictation",
      text: "Låter dig prata i stället för att skriva till AI:n.",
      obvious: true,
      aria: ["start dictation"]
    },

    /* ---------- Activity-panelen ---------- */
    {
      key: "act-comments-tab",
      name: "Board",
      text: "Fliken med alla kommentarer på den här tavlan.",
      use: "När du vill se vad gruppen har frågat eller tyckt om tavlan.",
      selectors: tid("comments-tab")
    },
    {
      key: "act-team-tab",
      name: "Team",
      text: "Aviseringar från hela teamet, till exempel när någon har nämnt dig på en annan tavla.",
      use: "När du vill se allt som hänt i teamet, inte bara här.",
      selectors: tid("activity-header-tab", "activity-tab")
    },
    {
      key: "act-filter",
      name: "All comments",
      text: "Väljer vilka kommentarer som visas, till exempel bara olösta eller bara dina.",
      use: "När det finns många kommentarer och du bara vill se dem som väntar på svar.",
      selectors: tid("sidebar_comments__filter-button")
    },
    {
      key: "act-options",
      name: "More options",
      text: "Fler val för kommentarerna, till exempel att markera alla som lästa.",
      obvious: true,
      selectors: tid("sidebar_comments__options")
    },

    /* ================= Tavlans huvudmeny (tre prickar) ================= */
    {
      key: "mm-board",
      name: "Board",
      text: "Allt som gäller tavlan som helhet: kopiera, flytta, stjärnmärka, ta bort och bakgrundsfärg.",
      obvious: true,
      selectors: tid("board-settings__item_board_menu")
    },
    {
      key: "mm-edit",
      name: "Edit",
      text: "Ångra, gör om, sök på tavlan och en lista med alla kommandon.",
      obvious: true,
      selectors: tid("board-settings__item_edit_menu")
    },
    {
      key: "mm-view",
      name: "View",
      text: "Bestämmer vad du ser: rutnät, andras muspekare, kommentarer och helskärm.",
      obvious: true,
      selectors: tid("board-settings__item_view_menu")
    },
    {
      key: "mm-preferences",
      name: "Preferences",
      text: "Dina egna val för hur Miro beter sig, till exempel mus eller styrplatta.",
      obvious: true,
      selectors: tid("board-settings__item_preferences_menu")
    },
    {
      key: "mm-accessibility",
      name: "Accessibility",
      text: "Inställningar som gör Miro lättare att använda, till exempel mindre rörelser på skärmen.",
      obvious: true,
      selectors: tid("board-settings__item_accessibility_menu")
    },
    {
      key: "mm-assign-status",
      name: "Assign status",
      text: "Sätter en status på tavlan, till exempel utkast eller klar.",
      use: "När andra ska veta om tavlan är färdig eller fortfarande ändras.",
      selectors: tid("board-settings__app_ASSIGN_BOARD_STATUS_MENU_ITEM")
    },
    {
      key: "mm-send-to-display",
      name: "Send to interactive display",
      text: "Visar tavlan på en stor pekskärm i ett mötesrum.",
      use: "När rummet har en interaktiv skärm och ni vill jobba vid den tillsammans.",
      selectors: tid("board-settings__app_SEND_TO_DISPLAY")
    },
    // Undermenyn Board
    {
      key: "mm-catch-up",
      name: "Catch up",
      text: "En sammanfattning av vad som har hänt på tavlan sedan du var här senast.",
      obvious: true,
      selectors: tid("board-settings__app_ASYNC_INSIGHTS_UI")
    },
    {
      key: "mm-move-to",
      name: "Move to",
      text: "Flyttar tavlan till ett annat utrymme (Space) eller team.",
      use: "När tavlan hamnat på fel ställe.",
      selectors: tid("settings__move_to_subMenu")
    },
    {
      key: "mm-delete",
      name: "Delete",
      text: "Tar bort tavlan. Den hamnar i papperskorgen (Trash) en tid innan den försvinner.",
      use: "När tavlan inte behövs längre. Kolla först att ingen annan i gruppen behöver den.",
      selectors: tid("board-settings__app_DELETE")
    },
    {
      key: "mm-background",
      name: "Background color",
      text: "Byter färg på tavlans bakgrund.",
      use: "När du vill att tavlan ska kännas som er egen eller bli lättare att läsa.",
      selectors: tid("board-settings__app_BACKGROUND_MENU")
    },
    {
      key: "mm-annotations",
      name: "Manage annotations",
      text: "Hanterar anteckningar som förklarar delar av tavlan för den som läser.",
      use: "När tavlan ska förstås av någon som inte var med när den gjordes.",
      selectors: tid("board-settings__app_MANAGE_ANNOTATIONS")
    },
    {
      key: "mm-start-view",
      name: "Start view",
      text: "Bestämmer vilken del av tavlan andra ser först när de öppnar den.",
      use: "När du vill att den som öppnar tavlan ska landa på rätt ställe direkt.",
      selectors: tid("board-settings__app_SET_START_VIEW")
    },
    {
      key: "mm-history",
      name: "History",
      text: "En lista över ändringar på tavlan: vem som gjorde vad och när.",
      use: "När något har försvunnit och du vill se vem som ändrade det.",
      selectors: tid("board-settings__app_ACTIVITY_LIST")
    },
    {
      key: "mm-details",
      name: "Details",
      text: "Fakta om tavlan: vem som äger den, när den skapades och en beskrivning.",
      use: "När du vill skriva en kort beskrivning av vad tavlan är till för.",
      selectors: tid("board-settings__app_BOARD_DETAILS")
    },
    // Undermenyn Edit
    {
      key: "mm-commands",
      name: "Commands",
      text: "En sökbar lista med allt du kan göra i Miro. Skriv vad du vill göra så hittar den rätt.",
      use: "När du vet vad du vill göra men inte var knappen finns.",
      selectors: tid("board-settings__app_COMMAND_PALETTE_TOGGLE")
    },
    // Undermenyn View
    {
      key: "mm-grid",
      name: "Grid",
      text: "Visar eller döljer rutmönstret i bakgrunden.",
      obvious: true,
      selectors: tid("board-settings__app_GRID_MENU", "canvas-controls-GRID_MENU")
    },
    {
      key: "mm-collab-cursors",
      name: "Show collaborators' cursors",
      text: "Visar eller döljer de andras muspekare på tavlan.",
      obvious: true,
      selectors: tid("board-settings__app_COLLAB_CURSORS")
    },
    {
      key: "mm-comments-on-board",
      name: "Comments on board",
      text: "Visar eller döljer kommentarerna på tavlan.",
      obvious: true,
      selectors: tid("board-settings__app_COMMENTS_ON_BOARD")
    },
    {
      key: "mm-object-dimensions",
      name: "Object dimensions",
      text: "Visar hur stor en sak är i siffror när du ändrar storlek på den.",
      use: "När saker ska vara exakt lika stora.",
      selectors: tid("board-settings__app_SHOW_OBJECT_DIMENSIONS", "action-item__SHOW_OBJECT_DIMENSIONS")
    },
    {
      key: "mm-undo-redo-controls",
      name: "Undo/Redo controls",
      text: "Visar eller döljer knapparna för ångra och gör om i verktygsfältet.",
      obvious: true,
      selectors: tid("board-settings__app_UNDO_REDO_CONTROLS")
    },
    {
      key: "mm-flow-connectors",
      name: "Show/Hide Flow Connectors",
      text: "Visar eller döljer linjerna som kopplar ihop steg i ett AI-flöde.",
      use: "När du använder flöden (Flows) och vill se hur stegen hänger ihop.",
      selectors: tid("board-settings__app_WORKFLOW")
    },
    // Undermenyn Preferences
    {
      key: "mm-navigation",
      name: "Mouse or trackpad",
      text: "Väljer om du styr med mus eller styrplatta, så att zoom och flytt känns rätt.",
      use: "När tavlan zoomar när du ville flytta, eller tvärtom.",
      selectors: tid("board-settings__app_NAVIGATION_MENU")
    },
    {
      key: "mm-align",
      name: "Align objects",
      text: "Hjälplinjer som gör att saker hamnar i linje med varandra när du flyttar dem.",
      use: "När du vill att lappar ska stå i raka rader.",
      selectors: tid("board-settings__app_ALIGN_OBJECTS")
    },
    {
      key: "mm-follow-threads",
      name: "Follow all threads",
      text: "Du får aviseringar om alla kommentarstrådar på tavlan, inte bara dina egna.",
      use: "När du är ansvarig för tavlan och vill missa så lite som möjligt.",
      selectors: tid("board-settings__app_FOLLOW_THREADS")
    },
    {
      key: "mm-open-desktop",
      name: "Always open in desktop app",
      text: "Tavlor öppnas i Miros datorapp i stället för i webbläsaren.",
      use: "När du har installerat appen och föredrar den.",
      selectors: tid("board-settings__app_OPEN_IN_DESKTOP")
    },
    // Undermenyn Accessibility
    {
      key: "mm-precise-selection",
      name: "Precise selection",
      text: "Du markerar bara det du klickar exakt på, inte saker som ligger bakom.",
      use: "När du råkar markera fel sak hela tiden.",
      selectors: tid("board-settings__item_precise_selection")
    },
    {
      key: "mm-single-char",
      name: "Single-character shortcuts",
      text: "Kortkommandon med en enda tangent, till exempel N för en lapp.",
      use: "När du råkar byta verktyg när du skriver, då kan du stänga av dem.",
      selectors: tid("board-settings__app_SINGLE_CHARACTER_SHORTCUTS")
    },
    {
      key: "a11y-checker",
      name: "Accessibility Checker",
      text: "Kollar om tavlan är lätt att läsa för alla, till exempel att texten inte är för liten.",
      use: "När tavlan ska visas för många och du vill att alla ska kunna läsa den.",
      selectors: tid("board-settings__app_A11Y_CHECKER", "app-menu__item-A11Y_CHECKER")
    },

    /* ================= Delningsrutan (Share) ================= */
    {
      key: "share-tab-invite",
      name: "Invite",
      text: "Fliken där du bjuder in personer till tavlan med deras mejladress.",
      obvious: true,
      selectors: tid("tab__item--invite", "tab__itemText--invite")
    },
    {
      key: "share-tab-embed",
      name: "Embed",
      text: "Ger en kod som visar tavlan inuti en annan webbsida.",
      use: "När tavlan ska synas på en hemsida eller på intranätet.",
      selectors: tid("tab__item--embed", "tab__itemText--embed")
    },
    {
      key: "share-tab-publish",
      name: "Publish",
      text: "Publicerar tavlan så att vem som helst kan se den, till exempel i Miroverse.",
      use: "När du vill visa tavlan offentligt. Tänk efter innan, allt blir synligt.",
      selectors: tid("tab__item--publish", "tab__itemText--publish")
    },
    {
      key: "share-tab-ai",
      name: "AI",
      text: "Delar tavlan med AI-tjänster utanför Miro, så att de kan läsa den.",
      use: "När du vill använda en AI-chatt med tavlans innehåll.",
      selectors: tid("tab__item--ai", "tab__itemText--ai")
    },
    {
      key: "share-link-role",
      name: "Can edit",
      text: "Bestämmer vad de som får länken kan göra: bara titta, kommentera eller ändra.",
      use: "När kunden bara ska titta men teamet ska kunna ändra.",
      selectors: tid("share-modal__private-board-link-button-select")
    },
    {
      key: "share-copy-link",
      name: "Copy team invite link",
      text: "Kopierar en länk som du kan klistra in i ett meddelande.",
      use: "När det är enklare att skicka länken i en chatt än att skriva mejladresser.",
      selectors: tid("copy-share-link-button__button")
    },
    {
      key: "share-public-link",
      name: "Anyone with the link",
      text: "Bestämmer vad alla som har länken får göra, även personer utanför teamet.",
      use: "När du vill att vem som helst med länken ska kunna titta.",
      selectors: tid("public-link-access__select-button")
    },

    // Fliken Embed
    {
      key: "embed-sharing",
      name: "Sharing settings",
      text: "Går till inställningen för vem som får se tavlan. En inbäddad tavla syns bara för dem som har tillgång.",
      obvious: true,
      selectors: tid("embed-code__sharing-settings-button")
    },
    {
      key: "embed-start-view",
      name: "Starting view",
      text: "Väljer vilken del av tavlan som syns först när den visas på en annan webbsida.",
      obvious: true,
      selectors: tid("embed-code__frame-select-dropdown-button", "embed-code__preview-area-hover")
    },
    {
      key: "embed-code",
      name: "Embed code",
      text: "Visar koden (HTML) som du klistrar in på en webbsida för att visa tavlan där.",
      use: "När tavlan ska synas på en hemsida eller på intranätet.",
      selectors: tid("embed-code__toggle-embed-code-button")
    },
    {
      key: "embed-copy-link",
      name: "Copy link",
      text: "Kopierar en länk för inbäddning. Många webbsidor och verktyg kan visa tavlan direkt från den.",
      obvious: true,
      selectors: tid("embed-code__copy-embed-link-button")
    },
    {
      key: "embed-view-only",
      name: "View only",
      text: "Gör den inbäddade tavlan läsbar men inte ändringsbar för dem som ser den på den andra sidan.",
      use: "När många ska se tavlan och ingen av misstag ska kunna ändra den.",
      ids: ["view-only-checkbox"]
    },
    // Fliken Publish
    {
      key: "publish-template",
      name: "Publish template",
      text: "Publicerar tavlan som mall i Miroverse, så att vem som helst kan hitta och använda den.",
      use: "När du har gjort ett upplägg som andra har nytta av. Allt på tavlan blir synligt.",
      selectors: tid("tab__content--publish__button-create_template")
    },
    // Fliken AI
    {
      key: "share-ai-tool",
      name: "AI-tjänst",
      text: "Kopplar tavlan till AI-tjänsten på knappen, så att den kan läsa och ändra tavlan.",
      use: "När du vill låta en AI-chatt jobba med tavlan. Tavlans innehåll delas då med den tjänsten.",
      selectors: [tidStart("tab__content--ai__tool-")]
    },

    /* ================= Export-menyn ================= */
    {
      key: "export-template",
      name: "Save board as template",
      text: "Sparar tavlans upplägg som en mall som du kan använda igen.",
      use: "När du har gjort ett upplägg du vill återanvända i nästa projekt.",
      selectors: tid("board-export__plugin_SAVE_BOARD_AS_TEMPLATE.main")
    },
    {
      key: "export-spreadsheet",
      name: "Export to spreadsheet",
      text: "Sparar texten på lappar och kort som ett kalkylark, till exempel för Excel.",
      use: "När ni har spånat många idéer och vill sortera dem i en lista.",
      selectors: tid("board-export__plugin_BOARD_EXPORT_SPREADSHEET.main")
    },
    {
      key: "export-backup",
      name: "Download board backup",
      text: "Laddar ner en säkerhetskopia av hela tavlan som en fil.",
      use: "När du vill spara tavlan själv, till exempel innan ett projekt avslutas.",
      selectors: tid("board-export__plugin_BOARD_EXPORT_BACKUP.main")
    },
    {
      key: "export-embed",
      name: "Embed",
      text: "Ger en kod som visar tavlan inuti en annan webbsida.",
      use: "När tavlan ska synas på en hemsida eller på intranätet.",
      selectors: tid("board-export__plugin_BOARD_EXPORT_EMBED.main")
    },

    /* ================= Get set up-listan ================= */
    {
      key: "checklist-item",
      name: "Steg i listan",
      text: "Ett förslag på något att prova i Miro. Klicka för att se mer.",
      obvious: true,
      selectors: [tidStart("welcome-checklist__item-")]
    },
    {
      key: "checklist-sidekick",
      name: "Open Sidekick",
      text: "Öppnar Miros AI-assistent Sidekick.",
      use: "När du vill prova att låta AI:n hjälpa till på tavlan.",
      selectors: tid("welcome-checklist__sidekick-cta")
    },
    {
      key: "checklist-connect-tools",
      name: "Share with AI tools",
      text: "Kopplar tavlan till AI-tjänster utanför Miro.",
      use: "När du vill använda en AI-chatt med tavlans innehåll.",
      selectors: tid("welcome-checklist__connect-tools-cta")
    },
    {
      key: "checklist-remove",
      name: "Remove setup",
      text: "Tar bort hela tipslistan för gott.",
      use: "När du redan kan Miro och inte vill se tipsen igen.",
      texts: ["remove setup"],
      within: tid("welcome-checklist__panel")[0]
    },

    /* ================= Facilitation-menyn ================= */
    {
      key: "fac-reaction",
      name: "Reaktion",
      text: "Skickar en reaktion, till exempel tumme upp, som syns en kort stund för alla på tavlan.",
      use: "När du vill visa att du håller med utan att säga något.",
      selectors: [tidStart("reaction_")]
    },
    {
      key: "fac-timer",
      name: "Timer",
      text: "En nedräkning som alla på tavlan ser.",
      obvious: true,
      selectors: tid("action-item__COUNTDOWN_TRIGGER")
    },
    {
      key: "fac-voting",
      name: "Voting",
      text: "Låter alla rösta på lappar eller saker på tavlan.",
      use: "När ni har många idéer och ska välja de bästa.",
      selectors: tid("action-item__VOTING_TRIGGER")
    },
    {
      key: "private-mode",
      name: "Private mode",
      text: "Alla kan skriva lappar utan att de andra ser dem, tills läget stängs av.",
      use: "När alla ska tänka själva först utan att påverkas av de andra.",
      selectors: tid("action-item__PRIVATE_MODE", "app-menu__item-PRIVATE_MODE")
    },
    {
      key: "note",
      name: "Note",
      text: "En anteckning som sitter fast vid tavlans kant, för instruktioner eller agenda.",
      use: "När du leder en workshop och vill att alla ska se dagens upplägg.",
      selectors: tid("action-item__NOTES", "app-menu__item-NOTES")
    },

    /* ================= Video-menyn ================= */
    {
      key: "video-record",
      name: "Record",
      text: "Spelar in en Talktrack, alltså en film av dig och tavlan medan du pratar.",
      use: "När du vill förklara tavlan för någon som inte kan vara med live.",
      selectors: tid("videotoolsdropdown-talktrack-record-button").concat('[role="menuitem"]:has([data-testid="videotoolsdropdown-talktrack-record-button"])')
    },
    {
      key: "video-library",
      name: "Library",
      text: "Dina inspelade Talktracks.",
      obvious: true,
      selectors: tid("videotoolsdropdown-recordings-watch")
    },

    /* ================= Din meny på tavlan ================= */
    {
      key: "self-role",
      name: "Ditt namn och din roll",
      text: "Visar din roll på tavlan. Board owner betyder att du äger tavlan och bestämmer vem som får vara med.",
      obvious: true,
      selectors: ['[data-testid="self-user-dropdown__about-role"]', '[role="menuitem"]:has([data-testid="self-user-dropdown__about-role"])']
    },
    {
      key: "self-share-prompt",
      name: "Share the board to start collaborating",
      text: "Öppnar delningsrutan, så att andra kan jobba på tavlan tillsammans med dig.",
      use: "När du vill bjuda in gruppen till tavlan.",
      texts: [/^share the board to start/],
      within: "[role=menu]",
      page: BOARD
    },
    {
      key: "self-show-cursors",
      name: "Show cursors",
      text: "Visar eller döljer de andras muspekare på tavlan.",
      obvious: true,
      texts: ["show cursors"],
      within: '[data-testid^="self-user"], [role=menu]',
      page: BOARD
    },

    /* ================= Zoom-menyn ================= */
    {
      key: "zoom-minimap",
      name: "Show minimap",
      text: "En liten karta i hörnet som visar hela tavlan och var du är.",
      use: "När tavlan är stor och du lätt tappar bort dig.",
      selectors: tid("action-item__MINIMAP")
    },

    /* ================= Hjälpmenyn ================= */

    /* ================= Verktygspanelen (plustecknet) ================= */
    {
      key: "tools-tab-tools",
      name: "Tools",
      text: "Miros egna verktyg.",
      obvious: true,
      selectors: tid("app-library__your-apps-tab")
    },
    {
      key: "tools-tab-marketplace",
      name: "Marketplace",
      text: "Appar från andra företag som fungerar i Miro.",
      use: "När du vill hämta in något från ett annat verktyg, som bilder eller diagram.",
      selectors: tid("app-library__discover-tab")
    },
    {
      key: "tools-pin",
      name: "Pin to toolbar",
      text: "Nålen fäster verktyget i fältet till vänster, eller tar bort det därifrån.",
      use: "När du använder ett verktyg ofta och vill ha det nära till hands.",
      selectors: tid("mega-menu__pin-button")
    },
    {
      key: "tools-table",
      name: "Table",
      text: "En tabell med rader och kolumner direkt på tavlan.",
      use: "När ni vill ordna information, som vem som gör vad.",
      selectors: tid("app-menu__item-DATA_TABLE").concat('[data-testid="ai-formats-and-flows-menu"] button[aria-label="Table"]')
    },
    {
      key: "tools-mind-map",
      name: "Mind map",
      text: "En tankekarta: ett ämne i mitten och idéer som grenar ut sig.",
      use: "När du vill spåna kring ett ämne och se hur idéerna hänger ihop.",
      selectors: tid("app-menu__item-MIND_MAP")
    },
    {
      key: "tools-doc",
      name: "Doc",
      text: "Ett textdokument direkt på tavlan, för längre texter.",
      use: "När ni ska skriva en beskrivning som inte får plats på lappar.",
      selectors: tid("app-menu__item-STRUCTDOC").concat('[data-testid="ai-formats-and-flows-menu"] button[aria-label="Doc"]')
    },
    {
      key: "tools-kanban",
      name: "Kanban",
      text: "En tavla med kolumner som Att göra, Pågår och Klart, där kort flyttas mellan kolumnerna.",
      use: "När gruppen vill hålla koll på vem som gör vad.",
      selectors: tid("app-menu__item-KANBAN_V2", "app-menu__item-KANBAN").concat('[data-testid="ai-formats-and-flows-menu"] button[aria-label="Kanban"]')
    },
    {
      key: "tools-timeline",
      name: "Timeline",
      text: "En tidslinje där du lägger in saker efter datum.",
      use: "När ni planerar ett projekt med deadlines.",
      selectors: tid("app-menu__item-TIMELINE").concat('[data-testid="ai-formats-and-flows-menu"] button[aria-label="Timeline"]')
    },
    {
      key: "tools-slides",
      name: "Slides",
      text: "Bilder för en presentation, direkt i Miro.",
      use: "När ni ska presentera och vill bygga bildspelet bredvid ert arbete.",
      selectors: tid("app-menu__item-SLIDES_FORMAT").concat('[data-testid="ai-formats-and-flows-menu"] button[aria-label="Slides"]')
    },
    {
      key: "tools-diagram",
      name: "Diagram",
      text: "Verktyg för att rita diagram, till exempel flödesscheman, med färdiga former.",
      use: "När du vill visa ett förlopp i steg.",
      selectors: tid("app-menu__item-DIAGRAM", "app-menu__item-SHAPE_LIBRARY").concat('[data-testid="ai-formats-and-flows-menu"] button[aria-label="Diagram"]')
    },
    {
      key: "tools-upload",
      name: "Upload",
      text: "Laddar upp en fil från datorn till tavlan, till exempel en bild eller PDF.",
      use: "När du vill ha med egna bilder eller dokument.",
      selectors: tid("app-menu__item-UPLOAD")
    },
    {
      key: "tools-images",
      name: "Images and icons",
      text: "Sök bland gratis bilder och ikoner och lägg in dem på tavlan.",
      use: "När du vill göra tavlan tydligare med bilder.",
      selectors: tid("app-menu__item-IMAGE_LIBRARY")
    },
    {
      key: "tools-card",
      name: "Card",
      text: "Ett kort med rubrik, beskrivning och vem som ansvarar, som en uppgift.",
      use: "När du vill skriva en uppgift som någon ska ta hand om.",
      selectors: tid("app-menu__item-CARD_WIDGET")
    },
    {
      key: "tools-poll",
      name: "Poll / Engage activities",
      text: "Frågor och omröstningar som alla på tavlan kan svara på.",
      use: "När du leder en workshop och vill fråga alla något.",
      selectors: tid("app-menu__item-POLLING", "app-menu__item-ACTIVITIES", "app-menu__item-DOT_VOTING").concat('[data-testid="ai-formats-and-flows-menu"] button[aria-label="Engage activities"]')
    },
    {
      key: "tools-prototype",
      name: "Prototype",
      text: "En klickbar skiss av en app eller webbsida, där man kan klicka sig mellan skärmar.",
      use: "När ni ska visa hur en app är tänkt att fungera innan någon har byggt den.",
      selectors: tid("app-menu__item-PROTOTYPING_CONTAINER").concat('[data-testid="ai-formats-and-flows-menu"] button[aria-label="Prototype"]')
    },
    {
      key: "tools-talktrack",
      name: "Talktrack",
      text: "Spelar in en film av dig och tavlan medan du pratar och visar.",
      use: "När du vill förklara tavlan för någon som tittar senare.",
      selectors: tid("app-menu__item-TALKTRACK_MEDIA").concat('[data-testid="ai-formats-and-flows-menu"] button[aria-label="Talktrack"]')
    },
    {
      key: "tools-flows",
      name: "Flows",
      text: "Ett AI-flöde: steg som Miros AI gör i tur och ordning, till exempel sammanfatta lappar och sedan skriva en rapport.",
      use: "När samma AI-arbete ska göras flera gånger på olika material.",
      selectors: tid("app-menu__item-FLOW_TEMPLATES").concat('[data-testid="ai-formats-and-flows-menu"] button[aria-label="Flows"]')
    },
    {
      key: "tools-other",
      name: "Verktyg",
      text: "Ett verktyg du kan lägga in på tavlan. Namnet står i rutan.",
      use: "När du vill prova något nytt. Klicka och sedan på tavlan för att lägga in det.",
      selectors: [tidStart("app-menu__item-")]
    },

    /* ================= Mallväljaren (Templates) ================= */
    {
      key: "tp-category",
      name: "Kategori",
      text: "Visar bara mallar inom ett ämne, till exempel möten eller strategi.",
      use: "När du vet vilken sorts mall du behöver.",
      selectors: tid("template-picker-category-button")
    },
    {
      key: "tp-card",
      name: "Mall",
      text: "En färdig mall. Klicka för att se den större innan du lägger in den.",
      use: "När du vill se om mallen passar innan du använder den.",
      selectors: tid("templateCard__preview")
    },

    {
      key: "tp-autoshow",
      name: "Show when creating a board",
      text: "Bestämmer om mallväljaren ska öppnas av sig själv varje gång du skapar en ny tavla.",
      obvious: true,
      ids: ["tpicker_autoshow"]
    },
    {
      key: "tp-preview",
      name: "Preview",
      text: "Visar mallen större, så att du ser hur den ser ut innan du väljer den.",
      obvious: true,
      aria: [/^preview /],
      within: tid("templatePickerModalRoot")[0]
    },
    {
      key: "tp-use",
      name: "Use",
      text: "Lägger in mallen på din tavla.",
      use: "När du har hittat en mall som passar. Du kan ändra allt i den efteråt.",
      texts: [/^use /],
      within: tid("templatePickerModalRoot")[0]
    },
    {
      key: "tp-options",
      name: "Options",
      text: "Fler val för mallen, till exempel att spara den eller dela den.",
      obvious: true,
      selectors: tid("customTemplateContextMenu__selector")
    },
    {
      key: "tp-ai",
      name: "Start with AI templates",
      text: "Mallar där Miros AI fyller i innehållet åt dig utifrån en kort beskrivning.",
      use: "När du vill ha ett första utkast snabbt och sedan ändra själv.",
      selectors: tid("open-ai-templates-section")
    },
    {
      key: "tp-for-you",
      name: "For you",
      text: "Mallar som Miro föreslår för dig, utifrån vad du har sagt att du jobbar med.",
      obvious: true,
      texts: ["for you"],
      within: tid("templatePickerModalRoot")[0]
    },

    /* ================= Inställningarna ================= */
    {
      key: "set-settings-menu",
      name: "Settings Menu",
      text: "Din bild öppnar en meny med ditt konto och utloggning.",
      obvious: true,
      selectors: tid("user-profile-trigger")
    },
    {
      key: "set-users",
      name: "Users",
      text: "Listan över alla i teamet och vilken roll de har.",
      use: "När du vill se vem som är med eller bjuda in någon.",
      selectors: ['[data-testid="top-level-menu-item__link"][aria-label="Users"]']
    },
    {
      key: "set-analytics",
      name: "Analytics",
      text: "Statistik över hur teamet använder Miro. Kräver en betald plan.",
      use: "När du ansvarar för ett stort team. För ett litet team behövs den inte.",
      selectors: ['[data-testid="top-level-menu-item__link"][aria-label="Analytics"]']
    },
    {
      key: "set-security",
      name: "Security",
      text: "Regler för vem som får dela tavlor och logga in. Här finns också Permissions och Audit logs.",
      use: "När du vill bestämma om tavlor får delas med alla som har länken.",
      selectors: [tid("category-menu-item__expand-button")[0], '[data-testid="secondary-level-menu-item__link"][aria-label="Security"]']
    },
    {
      key: "set-permissions",
      name: "Permissions",
      text: "Bestämmer vad olika medlemmar får göra i teamet.",
      use: "När bara vissa ska få skapa eller ta bort tavlor.",
      selectors: ['[data-testid="secondary-level-menu-item__link"][aria-label="Permissions"]']
    },
    {
      key: "set-audit",
      name: "Audit logs",
      text: "En logg över viktiga händelser i teamet, som inloggningar och ändringar. Kräver en betald plan.",
      use: "När ett företag måste kunna visa vem som gjorde vad.",
      selectors: ['[data-testid="secondary-level-menu-item__link"][aria-label="Audit logs"]']
    },
    {
      key: "set-ai",
      name: "Miro AI",
      text: "Slår på eller av Miros AI-funktioner för teamet.",
      use: "När företaget eller kunden inte vill att AI används på tavlorna.",
      selectors: ['[data-testid="top-level-menu-item__link"][aria-label="Miro AI"]']
    },
    {
      key: "set-apps",
      name: "Apps",
      text: "Appar från andra företag som teamet har kopplat till Miro.",
      use: "När du vill se eller ta bort en koppling till ett annat verktyg.",
      selectors: ['[data-testid="top-level-menu-item__link"][aria-label="Apps"]']
    },
    {
      key: "set-team-profile",
      name: "Team profile",
      text: "Teamets namn, bild och plan.",
      use: "När du vill döpa om teamet, till exempel till projektets eller företagets namn.",
      selectors: ['[data-testid="top-level-menu-item__link"][aria-label="Team profile"]']
    },
    {
      key: "set-members-tab",
      name: "Members / Guests",
      text: "Medlemmar är med i hela teamet. Gäster (Guests) har bara fått se enstaka tavlor.",
      use: "När du vill se vilka som har tillgång till vad.",
      texts: [/^members\b/, /^guests\b/],
      tags: ["button", "li"],
      page: SETTINGS
    },
    {
      key: "set-column-info",
      name: "Information",
      text: "Frågetecknet förklarar vad kolumnen betyder, till exempel vad Boards access står för.",
      obvious: true,
      aria: ["information"],
      within: tid("SmartTable__headerCell")[0]
    },
    {
      key: "set-member-menu",
      name: "Open row's action menu",
      text: "Tre prickar på en medlem. Där ändrar du personens roll eller tar bort hen ur teamet.",
      use: "När någon har slutat i gruppen eller ska få bestämma mer.",
      selectors: tid("SettingsPopupMenuButton")
    },
    {
      key: "set-team-name",
      name: "Team name",
      text: "Teamets namn, som alla medlemmar ser.",
      obvious: true,
      selectors: tid("rtb-team-name__input")
    },
    {
      key: "set-delete-team",
      name: "Delete team",
      text: "Tar bort hela teamet med alla tavlor. Det går inte att ångra.",
      use: "När teamet inte ska användas mer och alla har sparat det de behöver.",
      selectors: tid("rtb-team-settings-remove__delete-button")
    },
    {
      key: "set-public-sharing",
      name: "Allow public sharing",
      text: "Bestämmer om tavlor får delas med vem som helst som har länken.",
      use: "När tavlorna innehåller sådant som inte får spridas.",
      aria: ["allow public sharing"]
    },
    {
      key: "set-restrict-domains",
      name: "Restrict domains for sharing",
      text: "Tavlor får bara delas med mejladresser från vissa domäner, till exempel företagets.",
      use: "När bara personer på företaget ska kunna bjudas in.",
      aria: ["restrict domains for sharing"]
    },
    {
      key: "set-add-domain",
      name: "Add a domain",
      text: "Lägger till en domän, alltså slutet på en mejladress som @foretaget.se, som teamet äger. Kräver en dyrare plan.",
      use: "När ett företag vill att alla med företagets mejl hamnar i samma team.",
      texts: ["add a domain"],
      page: /^\/app\/settings\/company\/[^/]+\/security/
    },
    {
      key: "set-contact-sales",
      name: "Contact us",
      text: "Kontaktar Miros säljare om en dyrare plan för företag.",
      use: "När ett företag behöver funktioner som inte finns i gratisplanen.",
      selectors: tid("enterprise-cta__contact-us-button", "commonCompanyPromo__contact-us-button")
    },

    /* ---------- Din profil (Profile settings) ---------- */
    {
      key: "prof-tab-profile",
      name: "Profile",
      text: "Ditt namn, din bild, ditt språk och ditt konto.",
      obvious: true,
      selectors: tid("page-user-profile_details-tab")
    },
    {
      key: "prof-tab-notifications",
      name: "Notifications",
      text: "Bestämmer vilka mejl och aviseringar du får från Miro.",
      use: "När Miro skickar för många mejl.",
      selectors: tid("page-user-profile_notifications-tab")
    },
    {
      key: "prof-tab-apps",
      name: "Your apps",
      text: "Appar som du själv har gett tillgång till ditt Miro-konto.",
      use: "När du vill ta bort en app som du inte använder längre.",
      selectors: tid("page-user-profile_apps-tab")
    },
    {
      key: "prof-tab-integrations",
      name: "Integrations",
      text: "Kopplingar mellan Miro och andra tjänster, till exempel Slack eller Teams.",
      use: "När du vill få aviseringar från Miro i ett annat program.",
      selectors: tid("page-user-profile_integrations-tab")
    },
    {
      key: "prof-company",
      name: "Company name",
      text: "Var du jobbar eller studerar. Frivilligt.",
      use: "När du vill att andra ska se var du hör hemma, till exempel ditt företag.",
      selectors: tid("user-info-form__company-name-input")
    },
    {
      key: "prof-industry-role",
      name: "Industry / Role",
      text: "Din bransch och din roll. Miro använder det för att föreslå mallar.",
      use: "När förslagen på startsidan inte passar dig.",
      selectors: tid("user-info-form__industry-select", "user-info-form__role-select")
    },
    {
      key: "prof-sign-out-everywhere",
      name: "Sign out everywhere",
      text: "Loggar ut ditt konto på alla datorer och mobiler på en gång.",
      use: "När du har glömt att logga ut på en lånad dator.",
      selectors: tid("sign-out-everywhere__button")
    },
    {
      key: "prof-cookies",
      name: "Manage how Miro uses cookies",
      text: "Cookies är små filer som sparar uppgifter om dig i webbläsaren. Här väljer du vilka Miro får använda.",
      use: "När du inte vill att Miro ska följa hur du använder sajten.",
      texts: [/^manage how miro uses cook/],
      page: SETTINGS
    },
    {
      key: "apps-add",
      name: "Add apps",
      text: "Öppnar Miro Marketplace, där du hittar appar från andra företag.",
      use: "När teamet vill koppla Miro till ett annat verktyg.",
      texts: ["add apps"],
      page: SETTINGS
    }
  ];

  /*
   * Självklara saker som medvetet INTE får någon bubbla (Anthons val
   * 2026-10-21): Log out, Undo, Zoom in och liknande. Tillägget läser inte
   * listan. Svepet gör det, så att de räknas som "medvetet utan" och inte
   * som missade. Vill du ge en av dem en bubbla: flytta in den i
   * PW_EXPLANATIONS och lägg till text.
   */
  globalThis.PW_SKIPPED = [
    { key: "pen-basic", name: "Pen, Highlighter, Eraser", selectors: tid("draw-toolbar-pen", "draw-toolbar-highlighter", "draw-toolbar-eraser") },
    { key: "embed-help", name: "How to embed boards", selectors: tid("embed-code__help-button") },
    { key: "embed-copy-code", name: "Copy code", selectors: tid("embed-code__copy-embed-code-button") },
    { key: "tp-view-all", name: "View all", texts: ["view all"] },
    { key: "close-panel", name: "Close", selectors: tid("close-panel") },
    { key: "set-help-links", name: "Learn more och guider", texts: ["learn more", "learn about public sharing", "domain control guide"] },
    { key: "set-user-search", name: "Search by name or email", selectors: tid("user-list-search-input") },
    { key: "back-to-top", name: "Back to top", selectors: tid("back-to-top__button") },
    { key: "dash-headings", name: "Rubriker", texts: ["start something new", "jump back to recents"] },
    { key: "profile-logout", name: "Log out", selectors: tid("user-switcher__logout-btn") },
    { key: "profile-name", name: "Ditt namn", selectors: tid("user-profiles__no-sub-item") },
    { key: "tool-undo", name: "Undo", selectors: tid("CreationBarButton--CREATION_BAR_UNDO", "board-settings__app_UNDO") },
    { key: "tool-redo", name: "Redo", selectors: tid("CreationBarButton--CREATION_BAR_REDO", "board-settings__app_REDO") },
    { key: "tool-text", name: "Text", selectors: tid("CreationBarButton--TEXT", "app-menu__item-TEXT") },
    { key: "tool-pen", name: "Pen", selectors: tid("CreationBarButton--PEN", "app-menu__item-PEN") },
    { key: "board-zoom-out", name: "Zoom out", selectors: tid("canvas-controls-zoom-out") },
    { key: "board-zoom-in", name: "Zoom in", selectors: tid("canvas-controls-zoom-in") },
    { key: "dash-search", name: "Search by title or topic", selectors: tid("space-input-search") },
    { key: "tp-search", name: "Search templates", selectors: tid("template-picker__search_input") },
    { key: "tools-search", name: "Search tools", selectors: tid("app-library__search-input") },
    { key: "tp-close", name: "Close", selectors: tid("template-picker__close-button") },
    { key: "checklist-close", name: "Close setup checklist", aria: ["close setup checklist"] },
    { key: "checklist-not-now", name: "Not now", selectors: tid("welcome-checklist__connect-tools-dismiss") },
    { key: "help-feedback", name: "Send feedback", selectors: tid("action-item__SEND_FEEDBACK") },
    { key: "help-center", name: "Help center", selectors: tid("action-item__HELP_CENTER", "topBar__helpCenter-button") },
    { key: "help-shortcuts", name: "Keyboard shortcuts", selectors: tid("action-item__SHORTCUTS") },
    { key: "help-whats-new", name: "What's new", selectors: tid("action-item__WHAT_IS_NEW") },
    { key: "export-pdf", name: "Save as PDF", selectors: tid("board-export__plugin_BOARD_EXPORT_PDF.main") },
    { key: "export-image", name: "Export as image", selectors: tid("board-export__plugin_BOARD_EXPORT_IMAGE.main") },
    { key: "export-drive", name: "Save to Google Drive", selectors: tid("board-export__plugin_SAVE_TO_GOOGLE_DRIVE.main") },
    { key: "mm-new-board", name: "New board", selectors: tid("board-settings__app_CREATE_NEW_BOARD") },
    { key: "mm-duplicate", name: "Duplicate", selectors: tid("board-settings__app_DUPLICATE") },
    { key: "mm-find", name: "Find", selectors: tid("board-settings__app_FIND") },
    { key: "mm-export-sub", name: "Export", selectors: tid("settings__export_subMenu") },
    { key: "mm-star", name: "Star this board", selectors: tid("board-settings__app_STAR_BOARD", "board-star-button") },
    { key: "full-screen", name: "Enter full screen", selectors: tid("board-settings__app_FULL_SCREEN", "action-item__FULL_SCREEN") },
    { key: "mm-dnd", name: "Do Not Disturb", selectors: tid("board-settings__app_DO_NOT_DISTURB") },
    { key: "mm-scroll-bars", name: "Scroll bars", selectors: tid("board-settings__app_SCROLL_BARS") },
    { key: "mm-reduce-motion", name: "Reduce motion", selectors: tid("board-settings__app_REDUCE_MOTION") },
    { key: "prof-name", name: "Name", selectors: tid("user-info-form__name-input") },
    { key: "prof-language", name: "Language", selectors: tid("user-info-form__lang-select") },
    { key: "prof-photo", name: "Upload / Remove image", selectors: tid("logo-upload__uploadButton", "logo-upload__removeButton") },
    { key: "prof-change-email", name: "Change Email", selectors: tid("change-email-flow__toggleOpenButton") },
    { key: "prof-delete-account", name: "Delete account", selectors: tid("profile-deletion-flow__deleteButton") },
    { key: "dash-home", name: "Home", selectors: tid("tree-item-home") },
    { key: "dash-logo", name: "Miro", selectors: tid("spaces-header-miro-logo", "board-header__logo") },
    { key: "dash-blank-board", name: "Blank board", selectors: tid("dashboardTemplatesPanel__createNewBoard") },
    { key: "set-go-to-boards", name: "Go to boards", selectors: tid("topBar__goToBoards-button") },
    { key: "set-menu", name: "Menu", selectors: tid("hamburger-menu-button") },
    { key: "board-title", name: "Tavlans namn", selectors: tid("board-title__container") },
    { key: "dash-board-link", name: "Tavla", selectors: ['a[href^="/app/board/"]', 'a[href^="https://miro.com/app/board/"]'], page: DASHBOARD },
    { key: "create-board", name: "Board", selectors: tid("create-menu-create-board") },
    { key: "share-email", name: "Enter emails", selectors: tid("emails-editor-input") },
    { key: "zoom-fit", name: "Fit to screen", selectors: tid("action-item__ZOOM_CONTROLS-fitToScreen") },
    { key: "zoom-level", name: "Zoomnivå", selectors: [tidStart("action-item__ZOOM_CONTROLS-zoomTo")] },
    { key: "dash-grid-view", name: "Grid", selectors: tid("icon-button-grid") },
    { key: "dash-list-view", name: "List", selectors: tid("icon-button-list") }
  ];
})();
