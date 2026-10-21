// Kollar att varje förklaring och nytta är max två meningar och saknar tankstreck,
// och att nyttan finns (utom för obvious: true) och börjar som PW_CONFIG.useStartsWith säger.
require("../extension/explanations.js");
const config = globalThis.PW_CONFIG || {};
const start = config.useStartsWith || "När ";
const split = (t) => t.split(/(?<=[.!?])\s+(?=[A-ZÅÄÖ@])/).filter(Boolean);
const keys = new Set();
let bad = 0;
for (const e of globalThis.PW_EXPLANATIONS) {
  const problems = [];
  if (!e.key || !e.name || !e.text) problems.push("key, name eller text saknas");
  if (keys.has(e.key)) problems.push("samma key finns två gånger");
  keys.add(e.key);
  if (e.text && split(e.text).length > 2) problems.push(`${split(e.text).length} meningar`);
  if (/[—–]/.test(e.text || "")) problems.push("tankstreck");
  if ((e.text || "").length > 200) problems.push(`${e.text.length} tecken`);
  if (!e.use && !e.obvious) problems.push("nytta saknas");
  else if (e.use && e.obvious) problems.push("både use och obvious");
  else if (!e.use) {
    /* självklar sak, ingen nytta */
  }
  else {
    if (split(e.use).length > 2) problems.push(`nyttan har ${split(e.use).length} meningar`);
    if (/[—–]/.test(e.use)) problems.push("tankstreck i nyttan");
    if (e.use.length > 150) problems.push(`nyttan har ${e.use.length} tecken`);
    if (!e.use.startsWith(start)) problems.push(`nyttan börjar inte med "${start.trim()}"`);
  }
  if (!["ids", "aria", "href", "selectors", "texts"].some((k) => e[k] && e[k].length)) problems.push("inget sätt att känna igen saken");
  if (problems.length) {
    bad++;
    console.log(`${e.key}: ${problems.join(", ")}\n  ${e.text}\n  ${e.use || ""}`);
  }
}
console.log(`${globalThis.PW_EXPLANATIONS.length} förklaringar, ${bad} med problem`);
// Svepet måste känna till samma självklara saker som PW_SKIPPED.
const { skippedBlock, file, re } = require("./sync-skipped.js");
const m = require("fs").readFileSync(file, "utf8").match(re);
if (!m || !m[0].includes(skippedBlock())) {
  bad++;
  console.log("sweep-in-browser.js har inte samma PW_SKIPPED. Kör: node tests/sync-skipped.js");
}
process.exit(bad ? 1 : 0);
