import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const production = read("hso.html");
const test = read("hso-test.html");
const core = read("hso-core.js");
const formCore = read("formularz-pucharowy.js");

try {
  new Function(core);
} catch (error) {
  errors.push(`hso-core.js: ${error.message}`);
}

try {
  new Function(formCore);
} catch (error) {
  errors.push(`formularz-pucharowy.js: ${error.message}`);
}

for (const [file, html, mode] of [
  ["hso.html", production, "production"],
  ["hso-test.html", test, "test"]
]) {
  check(html.includes(`window.HSO_CONFIG={mode:'${mode}'}`), `${file}: zly tryb`);
  check(html.includes('href="hso.css?v='), `${file}: brak hso.css`);
  check(html.includes('src="hso-core.js?v='), `${file}: brak hso-core.js`);
  check(!html.includes("<style>"), `${file}: pozostawiono osadzony CSS`);

  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const reference = match[1].split("?")[0];
    if (/^(?:https?:|#|data:)/.test(reference)) continue;
    check(fs.existsSync(path.join(root, reference)), `${file}: brak zasobu ${reference}`);
  }
}

const normalizeWrapper = html => html
  .replace("mode:'production'", "mode:'MODE'")
  .replace("mode:'test'", "mode:'MODE'")
  .replace(/\r\n/g, "\n");
check(
  normalizeWrapper(production) === normalizeWrapper(test),
  "hso.html i hso-test.html roznia sie czyms wiecej niz trybem"
);

const productionVersion = production.match(/hso-core\.js\?v=([^"']+)/)?.[1];
const testVersion = test.match(/hso-core\.js\?v=([^"']+)/)?.[1];
check(productionVersion === testVersion, "Rozne wersje cache hso-core.js");

const knownBlock = core.match(/const KNOWN_KNOCKOUT_TEAMS = \[([\s\S]*?)\n\];/)?.[1] || "";
const entries = [...knownBlock.matchAll(
  /matchId:\s*(\d+),\s*side:\s*['"](homeTeam|awayTeam)['"][\s\S]*?name:\s*['"]([^'"]+)['"]/g
)].map(match => ({ id: Number(match[1]), side: match[2], team: match[3] }));

check(entries.length === 32, `Pary pucharowe: znaleziono ${entries.length}/32 druzyn`);
check(new Set(entries.map(entry => entry.team)).size === 32, "Powtorzona druzyna w 1/16 finalu");

const matchIds = new Map();
for (const entry of entries) {
  if (!matchIds.has(entry.id)) matchIds.set(entry.id, new Set());
  matchIds.get(entry.id).add(entry.side);
}
check(matchIds.size === 16, `Pary pucharowe: znaleziono ${matchIds.size}/16 meczow`);
for (const [id, sides] of matchIds) {
  check(sides.size === 2, `Mecz ${id}: brak gospodarza lub goscia`);
}

check(
  core.includes("if(!soon.length)return nextKnockoutMatch();"),
  "Kafel nastepnego meczu nie przechodzi do fazy pucharowej"
);
check(
  formCore.includes("ms2026_${config.key}_typy"),
  "Zmieniono klucz localStorage formularzy pucharowych"
);

for (const file of [
  "hso-typowanie16.html",
  "hso-typowanie8.html",
  "hso-typowanie4.html",
  "hso-typowanie2.html",
  "hso-typowanie1.html"
]) {
  const html = read(file);
  check(html.includes("formularz-pucharowy.css"), `${file}: brak wspolnego CSS`);
  check(html.includes("formularz-pucharowy.js"), `${file}: brak wspolnego JS`);
}

if (errors.length) {
  console.error("TEST HSO: BLEDY");
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log("TEST HSO: OK");
console.log("- wspolny rdzen produkcji i testu");
console.log("- skladnia JavaScript");
console.log("- 16 kompletnych i unikalnych par 1/16 finalu");
console.log("- zasoby lokalne i formularze pucharowe");
console.log("- klucz zapisu typow i kafel nastepnego meczu");

