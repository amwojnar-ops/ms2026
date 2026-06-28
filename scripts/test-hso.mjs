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
const groupReport = read("Raport_typow_MS_2026.html");

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
  check(html.includes('href="Raport_typow_MS_2026.html?v='), `${file}: brak statycznego raportu fazy grupowej`);
  check(!html.includes('id="tab-mecze"'), `${file}: pozostawiono dynamiczny widok fazy grupowej`);
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
  core.includes("function nextMatch(){return nextKnockoutMatch();}"),
  "Kafel nastepnego meczu nie przechodzi do fazy pucharowej"
);
check(core.includes("function knockoutMatchDetails("), "Kafle pucharowe nie maja szczegolow typow");
check(core.includes('class="ko-match-back"'), "Kafle pucharowe nie maja przycisku Wroc");
check(core.includes("groups[value].push"), "Kafle pucharowe nie dziela punktow na 3/1/0");
check(
  formCore.includes("ms2026_${config.key}_typy"),
  "Zmieniono klucz localStorage formularzy pucharowych"
);
check(
  !/delete\s+data\.scores\s*\[/.test(formCore),
  "Formularz usuwa zapisany typ z localStorage"
);

const baselineEntries = [...core.matchAll(
  /\{name:'([^']+)',champ:'([^']+)',group:\{pts:(\d+),ex:(\d+),en:(\d+)\}\}/g
)].map(match => ({ name: match[1], pts: Number(match[3]), ex: Number(match[4]), en: Number(match[5]) }));
check(baselineEntries.length === 24, `Baza grupowa: znaleziono ${baselineEntries.length}/24 graczy`);
check(new Set(baselineEntries.map(player => player.name)).size === 24, "Baza grupowa: powtorzony gracz");
baselineEntries.forEach(player => check(
  player.pts === player.ex * 3 + player.en,
  `Baza grupowa ${player.name}: punkty nie zgadzaja sie z trafieniami`
));
check(baselineEntries.reduce((sum, player) => sum + player.pts, 0) === 1234, "Baza grupowa: zmienila sie suma punktow");
check(baselineEntries.reduce((sum, player) => sum + player.ex, 0) === 139, "Baza grupowa: zmienila sie suma trafien za 3");
check(baselineEntries.reduce((sum, player) => sum + player.en, 0) === 817, "Baza grupowa: zmienila sie suma trafien za 1");
check(!core.includes("tips:["), "Szczegolowe typy grupowe pozostaly w aktywnym HSO");
check(!core.includes("const MATCHES=["), "Terminarz grupowy pozostal w aktywnym HSO");

check(groupReport.includes('data-report-version="2"'), "Raport fazy grupowej ma stary format");
const reportSourceMatch = groupReport.match(/<script id="report-source" type="application\/json">([\s\S]*?)<\/script>/);
let reportSource;
try {
  reportSource = JSON.parse(reportSourceMatch?.[1] || "");
} catch (error) {
  errors.push(`Raport fazy grupowej: nieprawidlowe dane (${error.message})`);
}
if (reportSource) {
  check(reportSource.matches?.length === 72, `Raport fazy grupowej: ${reportSource.matches?.length || 0}/72 meczow`);
  check(reportSource.players?.length === 24, `Raport fazy grupowej: ${reportSource.players?.length || 0}/24 graczy`);
  const reportBaseline = new Map(baselineEntries.map(player => [player.name, player]));
  const score = (tip, result) => {
    if (tip === result) return 3;
    const [th, ta] = tip.split("-").map(Number);
    const [rh, ra] = result.split("-").map(Number);
    return Math.sign(th - ta) === Math.sign(rh - ra) ? 1 : 0;
  };
  reportSource.players.forEach(player => {
    const points = player.tips.map((tip, index) => score(tip, reportSource.matches[index].result));
    const expected = reportBaseline.get(player.name);
    check(points.reduce((sum, value) => sum + value, 0) === expected?.pts, `Raport ${player.name}: zla suma punktow`);
    check(points.filter(value => value === 3).length === expected?.ex, `Raport ${player.name}: zla liczba trafien za 3`);
    check(points.filter(value => value === 1).length === expected?.en, `Raport ${player.name}: zla liczba trafien za 1`);
  });
}
check((groupReport.match(/class="points p[013]"/g) || []).length === 1728, "Raport nie zawiera 1728 wpisow punktowych");

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
console.log("- zamrozona baza punktow po fazie grupowej");
console.log("- historia 1728 punktacji w statycznym raporcie");
