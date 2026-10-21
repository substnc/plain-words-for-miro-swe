// Skriver PW_SKIPPED från extension/explanations.js in i tests/sweep-in-browser.js,
// så att svepet vet vilka saker som medvetet saknar bubbla.
// Kör efter varje ändring i PW_SKIPPED: node tests/sync-skipped.js
const fs = require("fs");
const path = require("path");
require("../extension/explanations.js");

function skippedBlock() {
  const selectors = [];
  const texts = [];
  for (const e of globalThis.PW_SKIPPED || []) {
    (e.selectors || []).forEach((s) => selectors.push(s));
    (e.aria || []).forEach((a) => typeof a === "string" && selectors.push('[aria-label="' + a + '" i]'));
    (e.texts || []).forEach((t) => typeof t === "string" && texts.push(t));
  }
  return "  const SKIPPED = " + JSON.stringify({ selectors, texts }) + ";";
}

const file = path.join(__dirname, "sweep-in-browser.js");
const re = /(\/\/ SKIPPED-START\n)[^\n]*\n(\s*\/\/ SKIPPED-END)/;

if (require.main === module) {
  const src = fs.readFileSync(file, "utf8");
  fs.writeFileSync(file, src.replace(re, "$1" + skippedBlock() + "\n$2"));
  console.log("sweep-in-browser.js uppdaterad med", (globalThis.PW_SKIPPED || []).length, "självklara saker");
}

module.exports = { skippedBlock, file, re };
