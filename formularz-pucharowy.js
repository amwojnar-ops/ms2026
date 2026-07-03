const PLAYERS = [
  "Alex", "Agnieszka", "Aldona", "Andrzej G.", "Andrzej W.", "Borys",
  "Iwona", "Izunia", "Jacek", "Justyna", "Kacper", "Leszek", "Lucas",
  "Łukasz", "Magda", "Maria", "Mariusz", "Mateusz", "Michał", "Ola",
  "Paweł", "Robert", "Tomek", "Waldemar"
];

const ROUND_CONFIG = {
  index16: { key: "index16", title: "1/16 finału", count: 16, start: 0, dates: "28 czerwca – 4 lipca" },
  index8:  { key: "index8",  title: "1/8 finału", count: 8,  start: 16, dates: "4–7 lipca" },
  index4:  { key: "index4",  title: "Ćwierćfinały", count: 4, start: 24, dates: "9–11 lipca" },
  index2:  { key: "index2",  title: "Półfinały", count: 2, start: 28, dates: "14–15 lipca" },
  index1:  { key: "index1",  title: "Mecze o medale", count: 2, start: 30, dates: "18–19 lipca" }
};

const ROUND_CONFIG_EN = {
  index16: { title: "Round of 32", dates: "June 28 – July 4" },
  index8:  { title: "Round of 16", dates: "July 4–7" },
  index4:  { title: "Quarter-finals", dates: "July 9–11" },
  index2:  { title: "Semi-finals", dates: "July 14–15" },
  index1:  { title: "Medal matches", dates: "July 18–19" }
};

const I18N = {
  pl: {
    langToggle: "EN",
    eyebrow: "Loża Ekspertów · MŚ 2026",
    intro: "Wynik typujemy po 90 minutach. Dogrywka i rzuty karne nie są uwzględniane.",
    player: "Gracz",
    choosePlayer: "— wybierz swoje imię —",
    notice: "Możesz typować poznane pary etapami. Wcześniejsze wyniki pozostaną zapisane lokalnie po dodaniu kolejnych meczów. Pełny zestaw wyślesz po poznaniu wszystkich par.",
    progress: "Postęp typowania",
    copy: "KOPIUJ TYPY",
    copied: "SKOPIOWANO",
    savePdf: "ZAPISZ PDF",
    preview: "Podgląd danych",
    match: "Mecz",
    thirdPlace: "Mecz o 3. miejsce",
    final: "Finał",
    matchSingular: "mecz",
    matchFew: "mecze",
    matchPlural: "meczów",
    history: "Historia ↓",
    noHistory: "Brak zakończonych meczów tej drużyny.",
    unknownTeam: "Drużyna jeszcze nieznana",
    dateFallback: "Termin",
    noDate: "—",
    deadlineUnknown: "termin zostanie podany po ustaleniu terminarza",
    closed: "Termin minął · typowanie zamknięte",
    available: (known, count, deadline) => `Dostępne pary: ${known}/${count} · termin ${deadline}`,
    waiting: deadline => `Oczekiwanie na pierwszą parę · termin ${deadline}`,
    selectPlayerToast: "Wybierz gracza.",
    fillAllToast: "Uzupełnij wyniki wszystkich meczów.",
    pdfPlayerToast: "Wybierz gracza przed zapisaniem PDF.",
    popupToast: "Zezwól przeglądarce na otwieranie nowych okien.",
    outputPlayer: "GRACZ",
    outputRound: "RUNDA",
    pdfHeader: "Loża Ekspertów · MŚ 2026 · wynik po 90 minutach",
    pdfPlayer: "Gracz",
    pdfFilled: "Wypełniono",
    pdfGenerated: "Wygenerowano",
    pdfMatch: "Mecz",
    pdfDate: "Termin",
    pdfPick: "Typ",
    pdfFooter: "Prywatna kopia typów gracza. Dane zapisane w tym dokumencie nie są automatycznie przesyłane administratorowi.",
    instructionTitle: "Jak przesłać typy",
    instructionHtml: 'Po uzupełnieniu wszystkich wyników kliknij <strong>KOPIUJ TYPY</strong>. Następnie otwórz prywatną rozmowę na WhatsAppie z <strong>Andrzejem W. (administratorem)</strong>, wklej skopiowaną treść i wyślij ją w prywatnej wiadomości. Nie przesyłaj typów na grupę.'
  },
  en: {
    langToggle: "PL",
    eyebrow: "Experts' Lounge · World Cup 2026",
    intro: "Predict the score after 90 minutes. Extra time and penalties do not count.",
    player: "Player",
    choosePlayer: "— choose your name —",
    notice: "You can predict known fixtures step by step. Earlier scores stay saved locally when new fixtures are added. Send the full set once all fixtures are known.",
    progress: "Prediction progress",
    copy: "COPY PICKS",
    copied: "COPIED",
    savePdf: "SAVE PDF",
    preview: "Data preview",
    match: "Match",
    thirdPlace: "Third-place match",
    final: "Final",
    matchSingular: "match",
    matchFew: "matches",
    matchPlural: "matches",
    history: "History ↓",
    noHistory: "No finished matches for this team.",
    unknownTeam: "Team not known yet",
    dateFallback: "Date",
    noDate: "—",
    deadlineUnknown: "deadline will be shown once the schedule is known",
    closed: "Deadline passed · predictions closed",
    available: (known, count, deadline) => `Available fixtures: ${known}/${count} · deadline ${deadline}`,
    waiting: deadline => `Waiting for the first fixture · deadline ${deadline}`,
    selectPlayerToast: "Choose a player.",
    fillAllToast: "Fill in all match scores.",
    pdfPlayerToast: "Choose a player before saving PDF.",
    popupToast: "Allow your browser to open new windows.",
    outputPlayer: "PLAYER",
    outputRound: "ROUND",
    pdfHeader: "Experts' Lounge · World Cup 2026 · score after 90 minutes",
    pdfPlayer: "Player",
    pdfFilled: "Filled",
    pdfGenerated: "Generated",
    pdfMatch: "Match",
    pdfDate: "Date",
    pdfPick: "Pick",
    pdfFooter: "Private copy of the player's picks. Data saved in this document is not sent automatically to the administrator.",
    instructionTitle: "How to send your picks",
    instructionHtml: 'After filling in all scores, click <strong>COPY PICKS</strong>. Then open a private WhatsApp chat with <strong>Andrzej W. (administrator)</strong>, paste the copied text and send it privately. Do not send your picks to the group.'
  }
};

const API_TO_PL = {
  "Mexico":"Meksyk", "South Africa":"RPA", "Korea Republic":"Korea Płd.",
  "South Korea":"Korea Płd.", "Czechia":"Czechy", "Canada":"Kanada",
  "Bosnia-H.":"Bośnia i Herc.", "Bosnia-Herzegovina":"Bośnia i Herc.", "United States":"USA",
  "Paraguay":"Paragwaj", "Qatar":"Katar", "Switzerland":"Szwajcaria",
  "Brazil":"Brazylia", "Morocco":"Maroko", "Scotland":"Szkocja",
  "Turkey":"Turcja", "Germany":"Niemcy", "Ivory Coast":"WKS",
  "Netherlands":"Holandia", "Sweden":"Szwecja", "Tunisia":"Tunezja",
  "Spain":"Hiszpania", "Cape Verde Islands":"RZP", "Cape Verde":"RZP",
  "Belgium":"Belgia", "Egypt":"Egipt", "Saudi Arabia":"Arabia Saudyjska",
  "Uruguay":"Urugwaj", "New Zealand":"Nowa Zelandia", "France":"Francja",
  "Norway":"Norwegia", "Argentina":"Argentyna", "Algeria":"Algieria",
  "England":"Anglia", "Croatia":"Chorwacja", "Congo DR":"DR Konga",
  "Colombia":"Kolumbia", "Japan":"Japonia", "Ecuador":"Ekwador",
  "Australia":"Australia", "Portugal":"Portugalia", "Austria":"Austria",
  "Jordan":"Jordania", "Ghana":"Ghana", "Panama":"Panama", "Iran":"Iran",
  "Iraq":"Irak", "Senegal":"Senegal", "Uzbekistan":"Uzbekistan",
  "Haiti":"Haiti", "Curaçao":"Curaçao"
};

const pageKey = document.body.dataset.round;
const config = ROUND_CONFIG[pageKey];
const storageKey = `ms2026_${config.key}_typy`;
const langStorageKey = "ms2026_knockout_lang";
const PREDICTION_LOCK_MINUTES = 120;
const KNOWN_KNOCKOUT_TEAMS = [
  { matchId: 537376, side: "homeTeam", team: { name: "Canada", shortName: "Canada", tla: "CAN" } },
  { matchId: 537375, side: "homeTeam", team: { name: "Paraguay", shortName: "Paraguay", tla: "PAR" } },
  { matchId: 537375, side: "awayTeam", team: { name: "France", shortName: "France", tla: "FRA" } },
  { matchId: 537377, side: "homeTeam", team: { name: "Brazil", shortName: "Brazil", tla: "BRA" } },
  { matchId: 537377, side: "awayTeam", team: { name: "Norway", shortName: "Norway", tla: "NOR" } },
  { matchId: 537378, side: "homeTeam", team: { name: "Mexico", shortName: "Mexico", tla: "MEX" } },
  { matchId: 537378, side: "awayTeam", team: { name: "England", shortName: "England", tla: "ENG" } },
  { matchId: 537376, side: "awayTeam", team: { name: "Morocco", shortName: "Morocco", tla: "MAR" } },
  { matchId: 537380, side: "homeTeam", team: { name: "United States", shortName: "United States", tla: "USA" } },
  { matchId: 537380, side: "awayTeam", team: { name: "Belgium", shortName: "Belgium", tla: "BEL" } },
  { matchId: 537379, side: "homeTeam", team: { name: "Portugal", shortName: "Portugal", tla: "POR" } },
  { matchId: 537379, side: "awayTeam", team: { name: "Spain", shortName: "Spain", tla: "ESP" } },
  { matchId: 537382, side: "homeTeam", team: { name: "Switzerland", shortName: "Switzerland", tla: "SUI" } },
  { matchId: 537381, side: "awayTeam", team: { name: "Egypt", shortName: "Egypt", tla: "EGY" } },
  { matchId: 537425, side: "homeTeam", team: { name: "Mexico", shortName: "Mexico", tla: "MEX" } },
  { matchId: 537425, side: "awayTeam", team: { name: "Ecuador", shortName: "Ecuador", tla: "ECU" } },
  { matchId: 537421, side: "homeTeam", team: { name: "United States", shortName: "United States", tla: "USA" } },
  { matchId: 537415, side: "homeTeam", team: { name: "Germany", shortName: "Germany", tla: "GER" } },
  { matchId: 537415, side: "awayTeam", team: { name: "Paraguay", shortName: "Paraguay", tla: "PAR" } },
  { matchId: 537427, side: "homeTeam", team: { name: "Argentina", shortName: "Argentina", tla: "ARG" } },
  { matchId: 537417, side: "homeTeam", team: { name: "South Africa", shortName: "South Africa", tla: "RSA" } },
  { matchId: 537417, side: "awayTeam", team: { name: "Canada", shortName: "Canada", tla: "CAN" } },
  { matchId: 537429, side: "homeTeam", team: { name: "Switzerland", shortName: "Switzerland", tla: "SUI" } },
  { matchId: 537429, side: "awayTeam", team: { name: "Algeria", shortName: "Algeria", tla: "ALG" } },
  { matchId: 537423, side: "homeTeam", team: { name: "Brazil", shortName: "Brazil", tla: "BRA" } },
  { matchId: 537423, side: "awayTeam", team: { name: "Japan", shortName: "Japan", tla: "JPN" } },
  { matchId: 537418, side: "homeTeam", team: { name: "Netherlands", shortName: "Netherlands", tla: "NED" } },
  { matchId: 537418, side: "awayTeam", team: { name: "Morocco", shortName: "Morocco", tla: "MAR" } },
  { matchId: 537424, side: "homeTeam", team: { name: "Ivory Coast", shortName: "Ivory Coast", tla: "CIV" } },
  { matchId: 537416, side: "homeTeam", team: { name: "France", shortName: "France", tla: "FRA" } },
  { matchId: 537416, side: "awayTeam", team: { name: "Sweden", shortName: "Sweden", tla: "SWE" } },
  { matchId: 537424, side: "awayTeam", team: { name: "Norway", shortName: "Norway", tla: "NOR" } },
  { matchId: 537422, side: "homeTeam", team: { name: "Belgium", shortName: "Belgium", tla: "BEL" } },
  { matchId: 537422, side: "awayTeam", team: { name: "Senegal", shortName: "Senegal", tla: "SEN" } },
  { matchId: 537420, side: "homeTeam", team: { name: "Spain", shortName: "Spain", tla: "ESP" } },
  { matchId: 537420, side: "awayTeam", team: { name: "Austria", shortName: "Austria", tla: "AUT" } },
  { matchId: 537421, side: "awayTeam", team: { name: "Bosnia-Herzegovina", shortName: "Bosnia-H.", tla: "BIH" } },
  { matchId: 537428, side: "homeTeam", team: { name: "Australia", shortName: "Australia", tla: "AUS" } },
  { matchId: 537428, side: "awayTeam", team: { name: "Egypt", shortName: "Egypt", tla: "EGY" } },
  { matchId: 537427, side: "awayTeam", team: { name: "Cape Verde Islands", shortName: "Cape Verde", tla: "CPV" } },
  { matchId: 537426, side: "homeTeam", team: { name: "England", shortName: "England", tla: "ENG" } },
  { matchId: 537426, side: "awayTeam", team: { name: "Congo DR", shortName: "Congo DR", tla: "COD" } },
  { matchId: 537419, side: "homeTeam", team: { name: "Portugal", shortName: "Portugal", tla: "POR" } },
  { matchId: 537419, side: "awayTeam", team: { name: "Croatia", shortName: "Croatia", tla: "CRO" } },
  { matchId: 537430, side: "homeTeam", team: { name: "Colombia", shortName: "Colombia", tla: "COL" } },
  { matchId: 537430, side: "awayTeam", team: { name: "Ghana", shortName: "Ghana", tla: "GHA" } }
];
let roundMatches = [];
let sourceMatches = [];
let selects = [];
let roundDeadline = null;
let knownPairCount = 0;
let LANG = localStorage.getItem(langStorageKey) === "en" ? "en" : "pl";

function tr(key, ...args) {
  const value = I18N[LANG][key];
  return typeof value === "function" ? value(...args) : value;
}

function roundTitle() {
  return LANG === "en" ? ROUND_CONFIG_EN[pageKey].title : config.title;
}

function roundDates() {
  return LANG === "en" ? ROUND_CONFIG_EN[pageKey].dates : config.dates;
}

function knockoutMatches(matches) {
  const knockout = matches
    .filter(match => Date.parse(match.utcDate) >= Date.parse("2026-06-28T19:00:00Z"))
    .sort((a, b) => Date.parse(a.utcDate) - Date.parse(b.utcDate));
  return withKnownKnockoutTeams(knockout);
}

function hasKnownTeam(team) {
  return Boolean(team?.name || team?.shortName || team?.tla);
}

function withKnownKnockoutTeams(matches) {
  return matches.map(match => {
    const known = KNOWN_KNOCKOUT_TEAMS.filter(item => item.matchId === match.id);
    if (!known.length) return match;
    let next = match;
    known.forEach(item => {
      if (hasKnownTeam(next[item.side])) return;
      next = {
        ...next,
        [item.side]: { ...item.team },
        knownTeamFallback: true
      };
    });
    return next;
  });
}

function teamName(team) {
  const source = team?.shortName || team?.name;
  if (!source) return tr("unknownTeam");
  if (LANG === "pl" && ["Bosnia-H.", "Bosnia-Herzegovina"].includes(source)
      && window.matchMedia("(max-width: 620px)").matches) return "BiH";
  return LANG === "en" ? source : (API_TO_PL[source] || source);
}

function teamCode(team) {
  return team?.tla || "?";
}

const FLAG_BY_TLA = {
  ALG:"dz", ARG:"ar", AUS:"au", AUT:"at", BEL:"be", BIH:"ba", BRA:"br", CAN:"ca",
  CIV:"ci", COL:"co", COD:"cd", CPV:"cv", CRO:"hr", CUW:"cw", CZE:"cz", ECU:"ec",
  EGY:"eg", ENG:"gb-eng", FRA:"fr", GER:"de", GHA:"gh", HAI:"ht", IRN:"ir", IRQ:"iq",
  JOR:"jo", JPN:"jp", KOR:"kr", KSA:"sa", MAR:"ma", MEX:"mx", NED:"nl", NOR:"no",
  NZL:"nz", PAN:"pa", PAR:"py", POR:"pt", QAT:"qa", RSA:"za", SCO:"gb-sct", SEN:"sn",
  ESP:"es", SUI:"ch", SWE:"se", TUN:"tn", TUR:"tr", URU:"uy", USA:"us", UZB:"uz"
};

function teamFlag(team) {
  const code = FLAG_BY_TLA[team?.tla];
  if (!code) return "?";
  return `<img src="img/flags/${code}.png" width="22" height="16" alt="${escapeHtml(teamName(team))}">`;
}

function teamKey(team) {
  const source = team?.tla || team?.name || team?.shortName || "";
  return source.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "");
}

function finishedMatchScore(match) {
  const score = match?.score?.fullTime;
  return Number.isInteger(score?.home) && Number.isInteger(score?.away)
    ? score
    : null;
}

function teamHistory(team, beforeUtcDate) {
  const key = teamKey(team);
  if (!key) return [];
  const before = beforeUtcDate ? Date.parse(beforeUtcDate) : Infinity;
  return sourceMatches
    .filter(match => {
      if (match.status !== "FINISHED") return false;
      if (!finishedMatchScore(match)) return false;
      if (Date.parse(match.utcDate) >= before) return false;
      return teamKey(match.homeTeam) === key || teamKey(match.awayTeam) === key;
    })
    .sort((a, b) => Date.parse(a.utcDate) - Date.parse(b.utcDate));
}

function historyRow(match, team) {
  const score = finishedMatchScore(match);
  const homeSide = teamKey(match.homeTeam) === teamKey(team);
  const opponent = homeSide ? match.awayTeam : match.homeTeam;
  const teamGoals = homeSide ? score.home : score.away;
  const opponentGoals = homeSide ? score.away : score.home;
  const resultClass = teamGoals > opponentGoals
    ? "win"
    : teamGoals < opponentGoals
      ? "loss"
      : "draw";
  const date = formatDate(match.utcDate);
  return `<div class="history-match ${resultClass}">
    <span class="history-date">${date.date}</span>
    <span class="history-opponent">vs ${teamName(opponent)}</span>
    <strong class="history-score">${teamGoals}–${opponentGoals}</strong>
  </div>`;
}

function buildHistoryColumn(team, matches) {
  const rows = matches.map(match => historyRow(match, team)).join("");
  return `<div class="history-column">
    <div class="history-team"><span>${teamFlag(team)}</span>${teamName(team)}</div>
    ${rows || `<div class="history-empty">${tr("noHistory")}</div>`}
  </div>`;
}

function buildMatchHistory(match) {
  const homeHistory = teamHistory(match.homeTeam, match.utcDate);
  const awayHistory = teamHistory(match.awayTeam, match.utcDate);
  return `<div class="match-history" hidden>
    ${buildHistoryColumn(match.homeTeam, homeHistory)}
    ${buildHistoryColumn(match.awayTeam, awayHistory)}
  </div>`;
}

function formatDate(utcDate) {
  if (!utcDate) return { date: tr("dateFallback"), time: tr("noDate") };
  const date = new Date(utcDate);
  const locale = LANG === "en" ? "en-GB" : "pl-PL";
  return {
    date: new Intl.DateTimeFormat(locale, {
      timeZone: "Europe/Warsaw", day: "2-digit", month: "2-digit"
    }).format(date),
    time: new Intl.DateTimeFormat(locale, {
      timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit"
    }).format(date)
  };
}

function deadlineFromFirstMatch(utcDate) {
  if (!utcDate) return null;
  return new Date(Date.parse(utcDate) - PREDICTION_LOCK_MINUTES * 60 * 1000);
}

function deadlineLabel(deadline) {
  if (!deadline) return tr("deadlineUnknown");
  return new Intl.DateTimeFormat(LANG === "en" ? "en-GB" : "pl-PL", {
    timeZone: "Europe/Warsaw", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  }).format(deadline).replace(",", " ·");
}

function buildPlayerSelect() {
  const select = document.getElementById("player");
  PLAYERS.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

function scoreSelect(index, slotId, side, locked) {
  const select = document.createElement("select");
  select.dataset.index = index;
  select.dataset.slotId = slotId;
  select.dataset.side = side;
  select.disabled = locked;
  select.setAttribute("aria-label", `${roundLabel(index)} · ${side === "home" ? "gospodarze" : "goście"}`);
  select.innerHTML = '<option value="">–</option>' +
    Array.from({ length: 10 }, (_, value) => `<option value="${value}">${value}</option>`).join("");
  select.addEventListener("change", () => {
    select.classList.toggle("set", select.value !== "");
    updateRows();
    saveState();
  });
  select.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const enabled = selects.flatMap(item => [item.home, item.away]).filter(field => !field.disabled);
    const current = enabled.indexOf(select);
    const target = enabled[current + (event.shiftKey ? -1 : 1)];
    if (!target) return;
    event.preventDefault();
    target.focus();
  });
  return select;
}

function roundLabel(index) {
  if (pageKey !== "index1") return `${tr("match")} ${index + 1}`;
  return index === 0 ? tr("thirdPlace") : tr("final");
}

function renderMatches() {
  const container = document.getElementById("matches");
  container.innerHTML = "";
  selects = [];
  const beforeDeadline = !roundDeadline || Date.now() <= roundDeadline.getTime();
  knownPairCount = roundMatches.filter(match =>
    match.homeTeam?.name && match.awayTeam?.name
  ).length;

  roundMatches.forEach((match, index) => {
    const slotId = `${config.key}-${index + 1}`;
    const homeKnown = Boolean(match.homeTeam?.name);
    const awayKnown = Boolean(match.awayTeam?.name);
    const pairKnown = homeKnown && awayKnown;
    const locked = !pairKnown || !beforeDeadline;
    const date = formatDate(match.utcDate);
    const row = document.createElement("div");
    row.className = `match${locked ? " locked" : ""}`;
    row.dataset.slotId = slotId;
    if (pairKnown) row.classList.add("expandable");

    const time = document.createElement("div");
    time.className = "match-time";
    time.innerHTML = `<strong>${roundLabel(index)}</strong>${date.date} · ${date.time}<span class="match-more">${tr("history")}</span>`;

    const teams = document.createElement("div");
    teams.className = "teams";
    teams.innerHTML = `
      <div class="team${homeKnown ? "" : " unknown"}">
        <span class="team-code">${teamFlag(match.homeTeam)}</span>
        <span class="team-name">${teamName(match.homeTeam)}</span>
      </div>
      <div class="team${awayKnown ? "" : " unknown"}">
        <span class="team-code">${teamFlag(match.awayTeam)}</span>
        <span class="team-name">${teamName(match.awayTeam)}</span>
      </div>`;

    const score = document.createElement("div");
    score.className = "score";
    const home = scoreSelect(index, slotId, "home", locked);
    const away = scoreSelect(index, slotId, "away", locked);
    score.append(home, Object.assign(document.createElement("span"), {
      className: "score-sep", textContent: "–"
    }), away);

    const history = document.createElement("div");
    history.innerHTML = pairKnown ? buildMatchHistory(match) : "";
    const historyNode = history.firstElementChild;

    row.append(time, teams, score);
    if (historyNode) row.appendChild(historyNode);
    row.addEventListener("click", event => {
      if (!pairKnown || event.target.closest("select")) return;
      const details = row.querySelector(".match-history");
      if (!details) return;
      const open = !details.hidden;
      details.hidden = open;
      row.classList.toggle("expanded", !open);
    });
    container.appendChild(row);
    selects.push({ home, away, row, slotId, pairKnown });
  });

  setAvailability();
  loadState();
  updateRows();
}

function placeholderMatches() {
  return Array.from({ length: config.count }, (_, index) => ({
    id: `${config.key}-${index + 1}`,
    utcDate: null,
    homeTeam: { name: null, shortName: null, tla: null },
    awayTeam: { name: null, shortName: null, tla: null }
  }));
}

function setAvailability() {
  const beforeDeadline = !roundDeadline || Date.now() <= roundDeadline.getTime();
  const anyKnown = knownPairCount > 0;
  const status = document.getElementById("status");
  status.classList.toggle("ready", anyKnown && beforeDeadline);
  document.getElementById("status-text").textContent = !beforeDeadline
    ? tr("closed")
    : anyKnown
      ? tr("available", knownPairCount, config.count, deadlineLabel(roundDeadline))
      : tr("waiting", deadlineLabel(roundDeadline));
  selects.forEach(({ home, away, pairKnown }) => {
    home.disabled = !pairKnown || !beforeDeadline;
    away.disabled = !pairKnown || !beforeDeadline;
  });
  updateCopyButton();
}

async function loadMatches() {
  try {
    const response = await fetch("data/football-data.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    sourceMatches = Array.isArray(data.matches) ? data.matches : [];
    const all = knockoutMatches(sourceMatches);
    roundMatches = all.slice(config.start, config.start + config.count);
  } catch (error) {
    console.warn("Nie udało się pobrać par:", error);
  }

  if (roundMatches.length !== config.count) {
    const current = [...roundMatches];
    roundMatches = placeholderMatches().map((fallback, index) => current[index] || fallback);
  }
  roundDeadline = deadlineFromFirstMatch(roundMatches[0]?.utcDate);
  renderMatches();
}

function saveState() {
  const data = {
    player: document.getElementById("player").value,
    scores: Object.fromEntries(selects.map(({ slotId, home, away }) => [
      slotId,
      { home: home.value, away: away.value }
    ]))
  };
  try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch (_) {}
}

function loadState() {
  let data;
  try { data = JSON.parse(localStorage.getItem(storageKey)); } catch (_) {}
  if (!data) return;
  document.getElementById("player").value = PLAYERS.includes(data.player) ? data.player : "";
  selects.forEach(({ slotId, home, away }, index) => {
    // Obsługa starszego zapisu tablicowego oraz nowego zapisu po stałym ID meczu.
    const score = Array.isArray(data.scores)
      ? data.scores[index]
      : data.scores?.[slotId];
    if (!score) return;
    home.value = score.home ?? "";
    away.value = score.away ?? "";
    home.classList.toggle("set", home.value !== "");
    away.classList.toggle("set", away.value !== "");
  });
}

function updateRows() {
  let filled = 0;
  selects.forEach(({ home, away, row }) => {
    const complete = home.value !== "" && away.value !== "";
    row.classList.toggle("filled", complete);
    if (complete) filled++;
  });
  document.getElementById("progress-count").textContent = `${filled} / ${config.count}`;
  document.getElementById("progress-fill").style.width = `${config.count ? filled / config.count * 100 : 0}%`;
  updateCopyButton(filled);
}

function updateCopyButton(filledCount) {
  const beforeDeadline = !roundDeadline || Date.now() <= roundDeadline.getTime();
  const allKnown = knownPairCount === config.count;
  const filled = Number.isInteger(filledCount)
    ? filledCount
    : selects.filter(({ home, away }) => home.value !== "" && away.value !== "").length;
  document.getElementById("copy").disabled = !(allKnown && beforeDeadline && filled === config.count);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

function outputText() {
  const player = document.getElementById("player").value;
  const lines = [`${tr("outputPlayer")}: ${player}`, `${tr("outputRound")}: ${roundTitle()}`, "---"];
  roundMatches.forEach((match, index) => {
    const score = selects[index];
    lines.push(`${roundLabel(index)}: ${teamName(match.homeTeam)} - ${teamName(match.awayTeam)} | ${score.home.value}-${score.away.value}`);
  });
  return lines.join("\n");
}

function copyResults() {
  const player = document.getElementById("player").value;
  if (!player) {
    showToast(tr("selectPlayerToast"));
    document.getElementById("player").focus();
    return;
  }
  const missing = selects.find(({ home, away }) => home.value === "" || away.value === "");
  if (missing) {
    showToast(tr("fillAllToast"));
    missing.row.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const text = outputText();
  const done = () => {
    const button = document.getElementById("copy");
    button.classList.add("success");
    button.textContent = tr("copied");
    document.getElementById("preview-text").textContent = text;
    document.getElementById("preview").classList.add("visible");
    setTimeout(() => {
      button.classList.remove("success");
      button.textContent = tr("copy");
    }, 2200);
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  const area = document.createElement("textarea");
  area.value = text;
  area.style.cssText = "position:fixed;opacity:0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
  done();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function generatePDF() {
  const player = document.getElementById("player").value;
  if (!player) {
    showToast(tr("pdfPlayerToast"));
    document.getElementById("player").focus();
    return;
  }

  const filled = selects.filter(({ home, away }) => home.value !== "" && away.value !== "").length;
  const rows = roundMatches.map((match, index) => {
    const score = selects[index];
    const result = score.home.value !== "" && score.away.value !== ""
      ? `${score.home.value}–${score.away.value}`
      : "—";
    const date = formatDate(match.utcDate);
    return `<tr>
      <td>${escapeHtml(roundLabel(index))}</td>
      <td>${escapeHtml(date.date)}<br><small>${escapeHtml(date.time)}</small></td>
      <td class="home">${escapeHtml(teamName(match.homeTeam))}</td>
      <td class="score-cell">${escapeHtml(result)}</td>
      <td>${escapeHtml(teamName(match.awayTeam))}</td>
    </tr>`;
  }).join("");

  const generated = new Intl.DateTimeFormat(LANG === "en" ? "en-GB" : "pl-PL", {
    dateStyle: "short", timeStyle: "short"
  }).format(new Date());
  const html = `<!DOCTYPE html>
<html lang="${LANG}">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(roundTitle())} · ${escapeHtml(player)}</title>
<style>
  @page { size: A4 portrait; margin: 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #152238; font-family: Arial, sans-serif; font-size: 11px; }
  header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 9px; border-bottom: 3px solid #d3a91f; }
  h1 { margin: 0; color: #17375e; font-size: 25px; text-transform: uppercase; }
  header p { margin: 4px 0 0; color: #68758a; }
  .player { text-align: right; }
  .player strong { display: block; color: #17375e; font-size: 18px; }
  .summary { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 10px; background: #f3f5f8; }
  table { width: 100%; border-collapse: collapse; }
  th { padding: 7px 6px; color: #fff; background: #17375e; font-size: 9px; text-transform: uppercase; }
  td { padding: 7px 6px; border-bottom: 1px solid #dde3eb; }
  td.home { text-align: right; }
  td.score-cell { width: 52px; color: #17375e; font-size: 14px; font-weight: bold; text-align: center; }
  small { color: #8490a1; }
  footer { margin-top: 14px; padding-top: 7px; color: #8a94a3; border-top: 1px solid #dde3eb; font-size: 9px; }
</style>
</head>
<body>
  <header>
    <div><h1>${escapeHtml(roundTitle())}</h1><p>${escapeHtml(tr("pdfHeader"))}</p></div>
    <div class="player"><span>${escapeHtml(tr("pdfPlayer"))}</span><strong>${escapeHtml(player)}</strong></div>
  </header>
  <div class="summary"><span>${escapeHtml(tr("pdfFilled"))}: <strong>${filled}/${config.count}</strong></span><span>${escapeHtml(tr("pdfGenerated"))}: ${escapeHtml(generated)}</span></div>
  <table>
    <thead><tr><th>${escapeHtml(tr("pdfMatch"))}</th><th>${escapeHtml(tr("pdfDate"))}</th><th colspan="3">${escapeHtml(tr("pdfPick"))}</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <footer>${escapeHtml(tr("pdfFooter"))}</footer>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showToast(tr("popupToast"));
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 350);
}

function addFinalActions() {
  const actions = document.querySelector(".actions");
  const pdfButton = document.createElement("button");
  pdfButton.type = "button";
  pdfButton.className = "pdf-btn";
  pdfButton.id = "pdf";
  pdfButton.textContent = tr("savePdf");
  pdfButton.addEventListener("click", generatePDF);
  actions.appendChild(pdfButton);

  const instruction = document.createElement("section");
  instruction.className = "send-instruction";
  instruction.id = "sendInstruction";
  instruction.innerHTML = `
    <h2>${tr("instructionTitle")}</h2>
    <p>${tr("instructionHtml")}</p>`;
  actions.insertAdjacentElement("afterend", instruction);
}

function applyLanguage() {
  document.documentElement.lang = LANG;
  document.title = `${roundTitle()} · ${LANG === "en" ? "World Cup 2026" : "MŚ 2026"}`;
  document.getElementById("langToggle").textContent = tr("langToggle");
  document.querySelector(".eyebrow").textContent = tr("eyebrow");
  document.getElementById("introText").textContent = tr("intro");
  document.getElementById("playerLabel").textContent = tr("player");
  document.getElementById("playerEmpty").textContent = tr("choosePlayer");
  document.getElementById("notice").textContent = tr("notice");
  document.getElementById("progressLabel").textContent = tr("progress");
  document.getElementById("copy").textContent = tr("copy");
  const pdfButton = document.getElementById("pdf");
  if (pdfButton) pdfButton.textContent = tr("savePdf");
  document.getElementById("previewTitle").textContent = tr("preview");
  document.getElementById("round-title").textContent = roundTitle();
  document.getElementById("round-dates").textContent = roundDates();
  document.getElementById("match-count").textContent = config.count;
  const mod10 = config.count % 10;
  const mod100 = config.count % 100;
  const matchWord = LANG === "en"
    ? (config.count === 1 ? tr("matchSingular") : tr("matchPlural"))
    : config.count === 1
      ? tr("matchSingular")
      : mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)
        ? tr("matchFew")
        : tr("matchPlural");
  document.getElementById("match-word").textContent = matchWord;
  const instruction = document.getElementById("sendInstruction");
  if (instruction) instruction.innerHTML = `<h2>${tr("instructionTitle")}</h2><p>${tr("instructionHtml")}</p>`;
  if (roundMatches.length) {
    const savedScroll = window.scrollY;
    renderMatches();
    window.scrollTo(0, savedScroll);
  } else {
    setAvailability();
  }
}

document.getElementById("langToggle").addEventListener("click", () => {
  saveState();
  LANG = LANG === "pl" ? "en" : "pl";
  localStorage.setItem(langStorageKey, LANG);
  applyLanguage();
});
document.getElementById("player").addEventListener("change", saveState);
document.getElementById("copy").addEventListener("click", copyResults);
buildPlayerSelect();
addFinalActions();
applyLanguage();
loadMatches();
setInterval(() => {
  if (roundMatches.length) setAvailability();
}, 60 * 1000);
