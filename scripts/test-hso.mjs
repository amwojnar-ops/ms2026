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
const css = read("hso.css");
const formCore = read("formularz-pucharowy.js");
const groupReport = read("Raport_typow_MS_2026.html");
const footballData = JSON.parse(read("data/football-data.json"));
const footballDataUpdater = read("scripts/update-football-data.mjs");

try {
  new Function(core);
} catch (error) {
  errors.push(`hso-core.js: ${error.message}`);
}

let scoreHelpers;
try {
  const start = core.indexOf("function validApiScore(");
  const end = core.indexOf("async function refreshApiData(");
  scoreHelpers = new Function(
    `${core.slice(start, end)}; return {apiResult,apiLiveScore,knockoutDisplayScore};`
  )();
} catch (error) {
  errors.push(`Funkcje wyniku live: ${error.message}`);
}

if (scoreHelpers) {
  const delayedFullTime = {
    status: "IN_PLAY",
    score: {
      fullTime: { home: 0, away: 0 },
      regularTime: { home: 3, away: 1 },
      halfTime: { home: 1, away: 0 }
    }
  };
  const liveScore = scoreHelpers.knockoutDisplayScore(delayedFullTime);
  check(liveScore.home === 3 && liveScore.away === 1, "Wynik live pozostaje 0-0 mimo regularTime 3-1");

  const extraTime = {
    status: "FINISHED",
    score: {
      fullTime: { home: 4, away: 2 },
      regularTime: { home: 2, away: 2 }
    }
  };
  check(scoreHelpers.apiResult(extraTime) === "2-2", "Punktacja nie uzywa wyniku po 90 minutach");

  const belgiumSenegalLive = {
    id: 537422,
    status: "IN_PLAY",
    score: { duration: "EXTRA_TIME", fullTime: { home: 2, away: 2 }, regularTime: { home: 2, away: 2 } }
  };
  const belgiumSenegalFinished = {
    ...belgiumSenegalLive,
    status: "FINISHED",
    score: { duration: "EXTRA_TIME", fullTime: { home: 3, away: 2 }, regularTime: { home: 2, away: 2 }, extraTime: { home: 1, away: 0 } }
  };
  check(scoreHelpers.apiResult(belgiumSenegalLive) === null, "Belgia-Senegal jest rozliczany przed zakonczeniem meczu");
  check(scoreHelpers.apiResult(belgiumSenegalFinished) === "2-2", "Belgia-Senegal zmienia wynik punktacji po zakonczeniu");
  const displayedBelgiumSenegal = scoreHelpers.knockoutDisplayScore(belgiumSenegalFinished);
  check(displayedBelgiumSenegal.home === 2 && displayedBelgiumSenegal.away === 2, "Kafel Belgia-Senegal nie pokazuje wyniku 2-2");

  const argentinaCapeVerde = {
    id: 537427,
    status: "FINISHED",
    score: { duration: "EXTRA_TIME", fullTime: { home: 3, away: 2 }, regularTime: { home: null, away: null }, extraTime: { home: 2, away: 1 } }
  };
  check(scoreHelpers.apiResult(argentinaCapeVerde) === "1-1", "Argentyna-RZP nie jest rozliczana jako 1-1 po 90 minutach");
  const displayedArgentinaCapeVerde = scoreHelpers.knockoutDisplayScore(argentinaCapeVerde);
  check(displayedArgentinaCapeVerde.home === 1 && displayedArgentinaCapeVerde.away === 1, "Kafel Argentyna-RZP nie pokazuje wyniku 1-1");
}

let roundHelpers;
try {
  const roundsSource = core.match(/const KNOCKOUT_ROUNDS = \[[\s\S]*?\n\];/)?.[0] || "";
  const stateStart = core.indexOf("function currentKnockoutRoundIndex(");
  const stateEnd = core.indexOf("function renderKnockout(");
  roundHelpers = new Function(
    `${roundsSource}\nconst knockoutMatchResult=match=>match.result||null;\n${core.slice(stateStart, stateEnd)}; return {KNOCKOUT_ROUNDS,currentKnockoutRoundIndex,orderedKnockoutRounds};`
  )();
} catch (error) {
  errors.push(`Automatyczne rundy pucharowe: ${error.message}`);
}

if (roundHelpers) {
  const afterRoundOf32 = Array.from({ length: 32 }, (_, index) => ({ result: index < 16 ? "1-0" : null }));
  check(roundHelpers.currentKnockoutRoundIndex(afterRoundOf32) === 1, "Po 1/16 nie otwiera sie domyslnie 1/8 finalu");
  check(
    roundHelpers.orderedKnockoutRounds(afterRoundOf32).map(item => item.round.id).join(",") === "r16,qf,sf,third,final,r32",
    "Zakonczona 1/16 finalu nie jest przenoszona na dol"
  );
  const afterFinal = Array.from({ length: 32 }, () => ({ result: "1-0" }));
  check(roundHelpers.currentKnockoutRoundIndex(afterFinal) === 5, "Po finale nie pozostaje otwarty widok finalu");
  check(
    roundHelpers.orderedKnockoutRounds(afterFinal).map(item => item.round.id).join(",") === "r32,r16,qf,sf,third,final",
    "Po mistrzostwach final nie znajduje sie na dole rund"
  );
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
  check(html.includes(`window.HSO_CONFIG={mode:'${mode}'`), `${file}: zly tryb`);
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
  .replace(/window\.HSO_CONFIG=\{mode:'production'\}/, "window.HSO_CONFIG={mode:'MODE'}")
  .replace(/window\.HSO_CONFIG=\{mode:'test',languages:\['pl','en','it'\]\}/, "window.HSO_CONFIG={mode:'MODE'}")
  .replace(/\r\n/g, "\n");
check(
  normalizeWrapper(production) === normalizeWrapper(test),
  "hso.html i hso-test.html roznia sie czyms wiecej niz trybem"
);

const productionVersion = production.match(/hso-core\.js\?v=([^"']+)/)?.[1];
const testVersion = test.match(/hso-core\.js\?v=([^"']+)/)?.[1];
check(productionVersion === testVersion, "Rozne wersje cache hso-core.js");
check(
  test.includes("window.HSO_CONFIG={mode:'test',languages:['pl','en','it']}") &&
    !production.includes("languages:['pl','en','it']") &&
    core.includes("const AVAILABLE_LANGUAGES=HSO_MODE==='test'?['pl','en','it']:['pl','en'];") &&
    core.includes("pageTitle:'Salotto degli Esperti · Mondiali 2026'") &&
    core.includes("it:'Ottavi'") &&
    core.includes("LANG==='it'?(TEAM_IT[name]||TEAM_EN[name]||name)"),
  "Wloska wersja nie jest kompletna lub zostala wlaczona w produkcji"
);
check(
  core.includes("const browserLanguages=[...(navigator.languages||[]),navigator.language].filter(Boolean);") &&
    core.includes("/^it(?:-|$)/i.test(language)") &&
    core.includes("HSO_MODE==='test'&&browserLanguages.some") &&
    core.includes("savedLanguage||detectedLanguage"),
  "hso-test nie wykrywa automatycznie wloskiego jezyka telefonu"
);
check(
  core.includes('document.documentElement.dataset.hsoMode=HSO_MODE;') &&
    css.includes('html[data-hso-mode="test"][lang="it"] .header-title h1') &&
    css.includes('white-space:nowrap;'),
  "Wloski naglowek testowy nie miesci sie w jednym wierszu na telefonie"
);
check(
  production.includes('class="stat-card next-match-card"') &&
    css.includes('.stats .stat-card:not(.next-match-card) { display:none; }') &&
    css.includes('.next-match-card .countdown-tick { font-size:10px') &&
    core.includes('class="live-summary-scoreboard"') &&
    core.includes('class="upcoming-summary-scoreboard"') &&
    core.includes("card?.classList.add('is-upcoming')") &&
    core.includes("document.querySelectorAll('.countdown-tick')") &&
    core.includes('function fitLiveSummaryNames()') &&
    core.includes('requestAnimationFrame(fitLiveSummaryNames)') &&
    core.includes('function openFeaturedKnockoutMatch()') &&
    core.includes('expandedKnockoutMatchId=featuredKnockoutMatchId') &&
    core.includes("switchTab('pucharowa',document.getElementById('tabKnockoutBtn'))") &&
    core.includes("return diff<=4*60*60*1000?'live':'waiting'") &&
    !core.includes('knockoutMatches().slice(0,16)') &&
    core.includes('const reveal=Boolean(tipData&&progress.complete)') &&
    css.includes('.next-match-card.has-match-link') &&
    css.includes('.live-summary-side { display:flex; align-items:center; gap:6px; min-width:0; color:#fff; font-size:15px;') &&
    core.includes("classList.add('is-live')"),
  "Mobilne statystyki nie zostaly zredukowane do kafla nastepnego meczu"
);
check(
  production.includes('id="tabPlayersBtn" data-icon="★"') &&
    production.includes('id="tabKnockoutBtn" data-icon="★"') &&
    production.includes('id="tabRankingBtn" data-icon="★"') &&
    production.includes('id="tabMatchesBtn" data-icon="▤"') &&
    production.indexOf('id="tabRankingBtn"') < production.indexOf('id="tabMatchesBtn"') &&
    !css.includes("content: 'ARCHIWUM'") &&
    !production.match(/id="tabMatchesBtn"[^>]*target="_blank"/),
  "Ikony, kolejność lub działanie menu głównego są nieprawidłowe"
);
check(
  production.includes('id="mainTabs" data-label="MENU GŁÓWNE"') &&
    production.includes('id="koStageNav" data-label="WYBIERZ RUNDĘ"') &&
    css.includes('.ko-stage-nav { grid-template-columns: repeat(3,minmax(0,1fr)); gap:5px; }') &&
    css.includes('.ko-stage { min-height:44px; padding:6px 4px;'),
  "Menu główne lub mobilne kafle rund nie mają nowej hierarchii"
);
check(
  !css.includes('body.ranking-active .wrap { max-width: 1180px; }') &&
    css.includes('body.ranking-panel-open .wrap { max-width: 1180px; }') &&
    core.includes("document.body.classList.add('ranking-panel-open')") &&
    core.includes("document.body.classList.remove('ranking-panel-open')"),
  "Ranking bez otwartego panelu nadal jest szerszy od pozostałych zakładek"
);
check(
  !core.includes('MANUAL_REGULATION_RESULTS') &&
    core.includes("['EXTRA_TIME','PENALTY_SHOOTOUT'].includes(duration)") &&
    core.includes('const derived={home:full.home-extra.home,away:full.away-extra.away};') &&
    core.includes('let pts=p.group.pts,ex=p.group.ex,en=p.group.en;'),
  "Wynik po 90 minutach nie jest automatycznie wyliczany po dogrywce"
);
check(
  core.includes("let selectedKnockoutRound = null;") &&
    core.includes("if(!knockoutRoundSelectionManual)selectedKnockoutRound=currentIndex;") &&
    core.includes("orderedKnockoutRounds(allMatches).map") &&
    core.includes("class=\"pdp-knockout-round${stage.id===currentId?' open':''}") &&
    core.includes("const direct=match?.status==='FINISHED'?apiRegulationScore(match):null;") &&
    css.includes('.pdp-knockout-round.open .pdp-round-body { display:block; }'),
  "Gracze, ranking lub faza pucharowa nie podazaja za aktualna runda"
);
check(
  core.includes('function capturePlayerAccordionState(root)') &&
    core.includes('function restorePlayerAccordionState(root,state)') &&
    core.includes('rounds:Object.fromEntries') &&
    core.includes('openPanel(activePlayer,ranked,rankingAccordionState)') &&
    core.includes('restorePlayerAccordionState(cont,accordionState)'),
  "Odświeżenie zamyka harmonijki graczy lub rankingu"
);

const knownBlock = core.match(/const KNOWN_KNOCKOUT_TEAMS = \[([\s\S]*?)\n\];/)?.[1] || "";
const entries = [...knownBlock.matchAll(
  /matchId:\s*(\d+),\s*side:\s*['"](homeTeam|awayTeam)['"][\s\S]*?name:\s*['"]([^'"]+)['"]/g
)].map(match => ({ id: Number(match[1]), side: match[2], team: match[3] }));

const r32Ids = new Set(footballData.matches
  .filter(match => Date.parse(match.utcDate) >= Date.parse("2026-06-28T19:00:00Z"))
  .sort((a, b) => Date.parse(a.utcDate) - Date.parse(b.utcDate))
  .slice(0, 16)
  .map(match => match.id));
const r32Entries = entries.filter(entry => r32Ids.has(entry.id));
check(r32Entries.length === 32, `Pary pucharowe: znaleziono ${r32Entries.length}/32 druzyn`);
check(new Set(r32Entries.map(entry => entry.team)).size === 32, "Powtorzona druzyna w 1/16 finalu");

const matchIds = new Map();
for (const entry of r32Entries) {
  if (!matchIds.has(entry.id)) matchIds.set(entry.id, new Set());
  matchIds.get(entry.id).add(entry.side);
}
check(
  entries.some(entry => entry.id === 537376 && entry.side === "homeTeam" && entry.team === "Canada"),
  "Kanada nie zostala przeniesiona do meczu 1/8 finalu"
);
check(
  entries.some(entry => entry.id === 537377 && entry.side === "homeTeam" && entry.team === "Brazil") &&
    formCore.includes('{ matchId: 537377, side: "homeTeam", team: { name: "Brazil"'),
  "Brazylia nie zostala przeniesiona do meczu 1/8 finalu lub formularza"
);
check(
  entries.some(entry => entry.id === 537377 && entry.side === "awayTeam" && entry.team === "Norway") &&
    formCore.includes('{ matchId: 537377, side: "awayTeam", team: { name: "Norway"'),
  "Norwegia nie zostala przeniesiona do meczu 1/8 finalu lub formularza"
);
check(
  entries.some(entry => entry.id === 537375 && entry.side === "homeTeam" && entry.team === "Paraguay") &&
    formCore.includes('{ matchId: 537375, side: "homeTeam", team: { name: "Paraguay"'),
  "Paragwaj nie zostal przeniesiony do meczu 1/8 finalu lub formularza"
);
check(
  entries.some(entry => entry.id === 537375 && entry.side === "awayTeam" && entry.team === "France") &&
    formCore.includes('{ matchId: 537375, side: "awayTeam", team: { name: "France"'),
  "Francja nie zostala dodana do pary z Paragwajem"
);
check(
  entries.some(entry => entry.id === 537378 && entry.side === "homeTeam" && entry.team === "Mexico") &&
    formCore.includes('{ matchId: 537378, side: "homeTeam", team: { name: "Mexico"'),
  "Meksyk nie zostal dodany do meczu 06.07 o 02:00"
);
check(
  entries.some(entry => entry.id === 537378 && entry.side === "awayTeam" && entry.team === "England") &&
    formCore.includes('{ matchId: 537378, side: "awayTeam", team: { name: "England"'),
  "Anglia nie zostala dodana do pary z Meksykiem"
);
check(
  entries.some(entry => entry.id === 537376 && entry.side === "awayTeam" && entry.team === "Morocco") &&
    formCore.includes('{ matchId: 537376, side: "awayTeam", team: { name: "Morocco"'),
  "Maroko nie zostalo przeniesione do meczu 1/8 finalu lub formularza"
);
check(matchIds.size === 16, `Pary pucharowe: znaleziono ${matchIds.size}/16 meczow`);
for (const [id, sides] of matchIds) {
  check(sides.size === 2, `Mecz ${id}: brak gospodarza lub goscia`);
}

check(
  core.includes("function nextMatch(){return nextKnockoutMatch();}"),
  "Kafel nastepnego meczu nie przechodzi do fazy pucharowej"
);
check(core.includes("function knockoutMatchDetails("), "Kafle pucharowe nie maja szczegolow typow");
check(core.includes("function playerKnockoutTeams("), "Historia gracza nie ma flag druzyn");
check(
  ["'BiH':'ba'", "'WKS':'ci'", "'RZP':'cv'"].every(mapping => core.includes(mapping)),
  "Brak flag dla skrotow BiH, WKS lub RZP"
);
check(core.includes("pdp-tip-card"), "Historia gracza nie ma kolorowej karty punktow");
check(!core.includes('class="ko-match-back"'), "Kafle pucharowe nadal maja przycisk Wroc");
check(core.includes("setExpanded(!tile.classList.contains('expanded'))"), "Ponowne klikniecie kafla nie zamyka szczegolow");
check(core.includes("groups[value].push"), "Kafle pucharowe nie dziela punktow na 3/1/0");
check(
  core.includes("playersAlphabetically") && core.includes("localeCompare(b.name,'pl'"),
  "Typy w kaflach pucharowych nie sa sortowane alfabetycznie"
);
check(
  formCore.includes('index1:  { key: "index1",  title: "Mecze o medale", count: 2, start: 30') &&
    core.includes("actionPanel.hidden=activeRound.id==='final'") &&
    core.includes("Jeden wspólny formularz obejmuje mecz o 3. miejsce oraz finał.") &&
    css.includes(".ko-final-view .ko-match::before"),
  "Formularz medalowy lub specjalny kafel finalu sa nieprawidlowe"
);
check(
  core.includes("r16:'2026-07-04T13:00:00Z'") &&
    core.includes("nextDeadlineIndex") &&
    core.includes("dostępne pary: ${headerKnownPairs}/${headerRound.count}") &&
    core.includes("(potem idziemy z Magdą na imprezę)") &&
    core.includes("lock-badge-detail") &&
    core.includes("headerKnownPairs>0?'available':'waiting'"),
  "Baner i termin typowania 1/8 finalu nie sa ustawione"
);
check(
  core.includes("? lt('Typowanie zakończone','Predictions closed','Pronostici chiusi')") &&
    core.includes("actionPanel.classList.toggle('deadline-closed',!beforeDeadline)") &&
    css.includes('.ko-main > .ko-action.deadline-closed { order:4; }'),
  "Zamkniete typowanie nie ma poprawnego naglowka lub pozycji mobilnej"
);
check(
  core.includes('const hasTips = true;') &&
    !core.includes('R16_SUBMITTED_PLAYERS') &&
    !core.includes("(submittedTips ? ' tips-submitted' : '')") &&
    core.includes('const completedTips=tipProgress.completePlayers.length;') &&
    css.includes('.fifa-card.tips-submitted { box-shadow:'),
  "Podswietlenie 1/8 nie zostalo usuniete lub styl nie jest gotowy na 1/4"
);
const southAfricaCanada = footballData.matches.find(match => match.id === 537417);
check(southAfricaCanada?.status === "FINISHED", "RPA-Kanada: mecz nie ma statusu FINISHED");
check(
  southAfricaCanada?.score?.fullTime?.home === 0 && southAfricaCanada?.score?.fullTime?.away === 1,
  "RPA-Kanada: nieprawidlowy wynik"
);
check(
  core.includes("['IN_PLAY','LIVE','PAUSED'].includes(match?.status)"),
  "Aktywne statusy nie sa wspolnie oznaczane jako Trwa"
);
check(
  footballDataUpdater.includes("const authoritativeLiveMatches = new Map()"),
  "Endpoint LIVE nie ma ochrony przed starsza migawka"
);
check(
  footballDataUpdater.includes("merged.status !== 'FINISHED' ? liveMatch : merged"),
  "Status FINISHED nie ma pierwszenstwa przed LIVE"
);
for (const period of ["regularTime", "halfTime", "extraTime", "penalties"]) {
  check(
    footballDataUpdater.includes(`mapScore('${period}')`),
    `Migawka API pomija score.${period}`
  );
}
check(core.includes("function apiRegulationScore("), "Brak wyniku po 90 minutach");
check(core.includes("function knockoutDisplayScore("), "Kafel meczu nie wybiera aktualnego wyniku");
check(
  core.includes("const score=knockoutDisplayScore(match)"),
  "Kafel meczu nadal uzywa tylko score.fullTime"
);
check(
  core.includes("document.body.classList.toggle('ranking-active'"),
  "Ranking nie rozszerza przestrzeni dla historii gracza"
);
check(
  formCore.includes("ms2026_${config.key}_typy"),
  "Zmieniono klucz localStorage formularzy pucharowych"
);
check(
  formCore.includes('index8: "2026-07-04T13:00:00Z"') &&
    formCore.includes('const override = ROUND_DEADLINE_OVERRIDES[pageKey];') &&
    formCore.includes('if (override) return new Date(override);'),
  "Formularz 1/8 finalu nie zamyka typowania o 15:00"
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

const knockoutTipsStart = core.indexOf("const KNOCKOUT_TIP_ROUNDS = [");
const r16TipsStart = core.indexOf("    id:'r16',", knockoutTipsStart);
const knockoutTipsEnd = core.indexOf("const PLAYER_KNOCKOUT_STAGES", r16TipsStart);
const r32TipsBlock = core.slice(knockoutTipsStart, r16TipsStart);
const r16TipsBlock = core.slice(r16TipsStart, knockoutTipsEnd);
const parseRoundTips = block => [...block.matchAll(/^\s*'([^']+)':\{([^}]*)\}/gm)].map(match => ({
  name: match[1],
  scores: [...match[2].matchAll(/'\d+':'(\d+-\d+)'/g)].map(score => score[1])
}));
const r32PlayerTips = parseRoundTips(r32TipsBlock);
const r16PlayerTips = parseRoundTips(r16TipsBlock);
const baselineNames = new Set(baselineEntries.map(player => player.name));
check(r32PlayerTips.length === 24, `Typy 1/16: ${r32PlayerTips.length}/24 graczy`);
check(new Set(r32PlayerTips.map(player => player.name)).size === r32PlayerTips.length, "Typy 1/16: powtorzony gracz");
r32PlayerTips.forEach(player => {
  check(baselineNames.has(player.name), `Typy 1/16: nieznany gracz ${player.name}`);
  check(player.scores.length === 16, `Typy 1/16 ${player.name}: ${player.scores.length}/16 meczow`);
});
check(r16PlayerTips.length === 24, `Typy 1/8: ${r16PlayerTips.length}/24 graczy`);
check(new Set(r16PlayerTips.map(player => player.name)).size === 24, "Typy 1/8: powtorzony gracz");
r16PlayerTips.forEach(player => {
  check(baselineNames.has(player.name), `Typy 1/8: nieznany gracz ${player.name}`);
  check(player.scores.length === 8, `Typy 1/8 ${player.name}: ${player.scores.length}/8 meczow`);
});
check(fs.existsSync(path.join(root, "output", "pdf", "typy-1-8-zestawienie.pdf")), "Brak PDF zestawienia 1/8 finalu");

check(groupReport.includes('data-report-version="2"'), "Raport fazy grupowej ma stary format");
check(
  groupReport.includes('class="report-back" href="hso.html" aria-label="Wróć do strony głównej">← WRÓĆ</a>') &&
    groupReport.includes('grid-template-columns:1fr auto 1fr') &&
    groupReport.includes('.toolbar,.report-back{display:none}'),
  "Raport fazy grupowej nie ma stalego powrotu do HSO"
);
check(
  core.includes("if(HSO_MODE!=='test')return base;") &&
    core.includes("&from=test&lang=${LANG}") &&
    groupReport.includes("params.get('from') === 'test'") &&
    groupReport.includes("fromTest ? 'hso-test.html' : 'hso.html'") &&
    groupReport.includes("['en', 'it'].includes(language)"),
  "Raport grupowy nie wraca do wlasciwej wersji lub nie zachowuje jezyka"
);
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
console.log(`- przygotowane typy 1/16 finalu: ${r32PlayerTips.length}/24 graczy`);
console.log(`- przygotowane typy 1/8 finalu: ${r16PlayerTips.length}/24 graczy`);
