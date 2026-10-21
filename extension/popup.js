// På/av-knappen. Valet sparas i webbläsaren och gäller alla flikar på sajten direkt.
(function () {
  "use strict";

  // Safari använder "browser", Chrome använder "chrome".
  var api = typeof browser !== "undefined" && browser && browser.storage ? browser : chrome;
  var toggle = document.getElementById("toggle");
  function render(enabled) {
    toggle.checked = enabled;
  }

  function load() {
    var done = false;
    function apply(items) {
      if (done || !items) return;
      done = true;
      render(items.enabled !== false);
    }
    try {
      var result = api.storage.local.get({ enabled: true }, apply);
      if (result && typeof result.then === "function") result.then(apply);
    } catch (e) {
      api.storage.local.get({ enabled: true }).then(apply);
    }
  }

  toggle.addEventListener("change", function () {
    var enabled = toggle.checked;
    render(enabled);
    try {
      var result = api.storage.local.set({ enabled: enabled }, function () {});
      if (result && typeof result.catch === "function") result.catch(function () {});
    } catch (e) {
      api.storage.local.set({ enabled: enabled });
    }
  });

  load();
})();
