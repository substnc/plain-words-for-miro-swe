/*
 * Plain Words for Miro SWE: svep i din egen webbläsare.
 *
 * Kör på en sida på miro.com med tillägget påslaget. Skriptet håller
 * "musen" över varje knapp, flik, länk och rubrik i tur och ordning med det
 * riktiga tillägget, och listar allt som inte fick någon förklaring. Det
 * klickar aldrig på något.
 *
 * Två sätt att köra:
 * - Själv: klistra in hela filen i konsolen (Cmd + Alt + J i Chrome). När det
 *   är klart skrivs en tabell ut med det som saknas.
 * - Claude via Claude in Chrome: kör filen med javascript_tool. Den startar
 *   svepet och svarar direkt "startat". Fråga sedan efter window.__pwSweep.finished
 *   i högst 40 sekunder i taget (verktyget ger upp efter 45) och hämta
 *   resultatet med window.__pwReport().
 *
 * Öppna menyer innan du kör, så kommer deras rader med. Vilka menyer som
 * finns och hur de öppnas står i tests/sweep-log.txt.
 *
 * Miro: svepet väntar 4 sekunder innan det börjar, eftersom sidopanelen
 * laddar in sent. "Var" i rapporten är närmaste data-testid.
 */
void (async function pwSweep() {
  // Saker som medvetet saknar bubbla (PW_SKIPPED i extension/explanations.js).
  // Räknas för sig, inte som missade. Fylls i av: node tests/sync-skipped.js
  // SKIPPED-START
  const SKIPPED = {"selectors":["[data-testid=\"draw-toolbar-pen\"]","[data-testid=\"draw-toolbar-highlighter\"]","[data-testid=\"draw-toolbar-eraser\"]","[data-testid=\"embed-code__help-button\"]","[data-testid=\"embed-code__copy-embed-code-button\"]","[data-testid=\"close-panel\"]","[data-testid=\"user-list-search-input\"]","[data-testid=\"back-to-top__button\"]","[data-testid=\"user-switcher__logout-btn\"]","[data-testid=\"user-profiles__no-sub-item\"]","[data-testid=\"CreationBarButton--CREATION_BAR_UNDO\"]","[data-testid=\"board-settings__app_UNDO\"]","[data-testid=\"CreationBarButton--CREATION_BAR_REDO\"]","[data-testid=\"board-settings__app_REDO\"]","[data-testid=\"CreationBarButton--TEXT\"]","[data-testid=\"app-menu__item-TEXT\"]","[data-testid=\"CreationBarButton--PEN\"]","[data-testid=\"app-menu__item-PEN\"]","[data-testid=\"canvas-controls-zoom-out\"]","[data-testid=\"canvas-controls-zoom-in\"]","[data-testid=\"space-input-search\"]","[data-testid=\"template-picker__search_input\"]","[data-testid=\"app-library__search-input\"]","[data-testid=\"template-picker__close-button\"]","[aria-label=\"close setup checklist\" i]","[data-testid=\"welcome-checklist__connect-tools-dismiss\"]","[data-testid=\"action-item__SEND_FEEDBACK\"]","[data-testid=\"action-item__HELP_CENTER\"]","[data-testid=\"topBar__helpCenter-button\"]","[data-testid=\"action-item__SHORTCUTS\"]","[data-testid=\"action-item__WHAT_IS_NEW\"]","[data-testid=\"board-export__plugin_BOARD_EXPORT_PDF.main\"]","[data-testid=\"board-export__plugin_BOARD_EXPORT_IMAGE.main\"]","[data-testid=\"board-export__plugin_SAVE_TO_GOOGLE_DRIVE.main\"]","[data-testid=\"board-settings__app_CREATE_NEW_BOARD\"]","[data-testid=\"board-settings__app_DUPLICATE\"]","[data-testid=\"board-settings__app_FIND\"]","[data-testid=\"settings__export_subMenu\"]","[data-testid=\"board-settings__app_STAR_BOARD\"]","[data-testid=\"board-star-button\"]","[data-testid=\"board-settings__app_FULL_SCREEN\"]","[data-testid=\"action-item__FULL_SCREEN\"]","[data-testid=\"board-settings__app_DO_NOT_DISTURB\"]","[data-testid=\"board-settings__app_SCROLL_BARS\"]","[data-testid=\"board-settings__app_REDUCE_MOTION\"]","[data-testid=\"user-info-form__name-input\"]","[data-testid=\"user-info-form__lang-select\"]","[data-testid=\"logo-upload__uploadButton\"]","[data-testid=\"logo-upload__removeButton\"]","[data-testid=\"change-email-flow__toggleOpenButton\"]","[data-testid=\"profile-deletion-flow__deleteButton\"]","[data-testid=\"tree-item-home\"]","[data-testid=\"spaces-header-miro-logo\"]","[data-testid=\"board-header__logo\"]","[data-testid=\"dashboardTemplatesPanel__createNewBoard\"]","[data-testid=\"topBar__goToBoards-button\"]","[data-testid=\"hamburger-menu-button\"]","[data-testid=\"board-title__container\"]","a[href^=\"/app/board/\"]","a[href^=\"https://miro.com/app/board/\"]","[data-testid=\"create-menu-create-board\"]","[data-testid=\"emails-editor-input\"]","[data-testid=\"action-item__ZOOM_CONTROLS-fitToScreen\"]","[data-testid^=\"action-item__ZOOM_CONTROLS-zoomTo\"]","[data-testid=\"icon-button-grid\"]","[data-testid=\"icon-button-list\"]"],"texts":["view all","learn more","learn about public sharing","domain control guide","start something new","jump back to recents"]};
  // SKIPPED-END

  const SEL = 'a[href], button, summary, input, textarea, select, [role="tab"], [role="button"], [role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [role="option"], [role="switch"], h2, h3';
  // Text som folk själva har skrivit, sådant som inte syns och sådant som är gömt för alla.
  const SKIP = 'footer, .sr-only, [class*="VisuallyHidden"], [hidden], [aria-hidden="true"], template, #pw-host, article p, blockquote, pre, code';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clean = (s, n) => (s || "").replace(/\s+/g, " ").trim().slice(0, n);
  const norm = (s) => clean(s, 200).toLowerCase();

  window.__pwSweep = { finished: false, done: 0, total: 0 };
  await sleep(4000);

  function where(el) {
    const t = el.closest("[data-testid]");
    return t ? t.getAttribute("data-testid").slice(0, 60) : "";
  }

  function isSkipped(el) {
    for (const s of SKIPPED.selectors) {
      try {
        if (el.closest(s)) return true;
      } catch (e) {
        /* ogiltig väljare */
      }
    }
    return SKIPPED.texts.indexOf(norm(el.innerText)) !== -1;
  }

  const items = [];
  for (const el of document.querySelectorAll(SEL)) {
    if (el.closest(SKIP)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const parent = el.parentElement && el.parentElement.closest(SEL);
    if (parent && !parent.closest(SKIP)) continue;
    items.push({
      el,
      tag: el.tagName.toLowerCase(),
      label: clean(el.getAttribute("aria-label") || el.getAttribute("title"), 60),
      text: el.matches("input, textarea, select") ? "" : clean(el.innerText || el.getAttribute("placeholder"), 50),
      where: where(el)
    });
  }

  const state = { page: location.pathname.replace(/\d{6,}/g, "N"), total: items.length, done: 0, missing: [], skipped: 0, found: {}, withUse: 0, finished: false };
  window.__pwSweep = state;

  // Samma sak som saknas på många ställen visas bara en gång. Siffror blir N.
  window.__pwReport = function () {
    const seen = new Set();
    const rows = [];
    for (const m of state.missing) {
      const k = [m.tag, m.label, m.text].map((v) => v.replace(/\d+/g, "N")).join(" | ");
      if (!seen.has(k)) {
        seen.add(k);
        rows.push(k + " @ " + m.where);
      }
    }
    return {
      page: state.page,
      total: state.total,
      withExplanation: state.total - state.missing.length - state.skipped,
      skippedOnPurpose: state.skipped,
      withUse: state.withUse,
      finished: state.finished,
      missing: rows.slice(0, 150),
      found: Object.entries(state.found).map(([k, v]) => k + (v > 1 ? "×" + v : "")).join(" ").slice(0, 1500)
    };
  };

  for (const it of items) {
    document.body.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(20);
    if (!it.el.isConnected) {
      state.done++;
      continue;
    }
    it.el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(560);
    const host = document.getElementById("pw-host");
    const shadow = host && host.shadowRoot;
    const bubble = shadow && shadow.querySelector(".bubble");
    const key = bubble && bubble.classList.contains("show") ? bubble.getAttribute("data-key") : null;
    if (key) {
      state.found[key] = (state.found[key] || 0) + 1;
      const use = shadow.querySelector(".use");
      if (use && !use.hidden && use.textContent.length > 8) state.withUse++;
    } else if (isSkipped(it.el)) {
      state.skipped++;
    } else {
      delete it.el;
      state.missing.push(it);
    }
    state.done++;
  }
  document.body.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  state.finished = true;
  const report = window.__pwReport();
  console.log(`Plain Words for Miro SWE: ${report.withExplanation}/${report.total} med förklaring, ${report.skippedOnPurpose} medvetet utan, på ${report.page}`);
  console.table(state.missing.map(({ tag, label, text, where }) => ({ tag, label, text, where })));
})();
"startat";
