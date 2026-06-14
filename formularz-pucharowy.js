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

const API_TO_PL = {
  "Mexico":"Meksyk", "South Africa":"RPA", "Korea Republic":"Korea Płd.",
  "South Korea":"Korea Płd.", "Czechia":"Czechy", "Canada":"Kanada",
  "Bosnia-H.":"BIH", "Bosnia-Herzegovina":"BIH", "United States":"USA",
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
let roundMatches = [];
let selects = [];
let roundDeadline = null;
let roundTeamsReady = false;

function knockoutMatches(matches) {
  return matches
    .filter(match => Date.parse(match.utcDate) >= Date.parse("2026-06-28T19:00:00Z"))
    .sort((a, b) => Date.parse(a.utcDate) - Date.parse(b.utcDate));
}

function teamName(team) {
  const source = team?.shortName || team?.name;
  return source ? (API_TO_PL[source] || source) : "Drużyna jeszcze nieznana";
}

function teamCode(team) {
  return team?.tla || "?";
}

function formatDate(utcDate) {
  if (!utcDate) return { date: "Termin", time: "—" };
  const date = new Date(utcDate);
  return {
    date: new Intl.DateTimeFormat("pl-PL", {
      timeZone: "Europe/Warsaw", day: "2-digit", month: "2-digit"
    }).format(date),
    time: new Intl.DateTimeFormat("pl-PL", {
      timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit"
    }).format(date)
  };
}

function deadlineFromFirstMatch(utcDate) {
  if (!utcDate) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date(utcDate)).reduce((result, part) => {
    if (part.type !== "literal") result[part.type] = Number(part.value);
    return result;
  }, {});
  // Rundy odbywają się podczas czasu CEST (UTC+2).
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day - 1, 21, 59, 59));
}

function deadlineLabel(deadline) {
  if (!deadline) return "termin zostanie podany po ustaleniu terminarza";
  return new Intl.DateTimeFormat("pl-PL", {
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

function scoreSelect(index, side, locked) {
  const select = document.createElement("select");
  select.dataset.index = index;
  select.dataset.side = side;
  select.disabled = locked;
  select.innerHTML = '<option value="">–</option>' +
    Array.from({ length: 10 }, (_, value) => `<option value="${value}">${value}</option>`).join("");
  select.addEventListener("change", () => {
    select.classList.toggle("set", select.value !== "");
    updateRows();
    saveState();
  });
  return select;
}

function roundLabel(index) {
  if (pageKey !== "index1") return `Mecz ${index + 1}`;
  return index === 0 ? "Mecz o 3. miejsce" : "Finał";
}

function renderMatches() {
  const container = document.getElementById("matches");
  container.innerHTML = "";
  selects = [];
  const allKnown = roundMatches.length === config.count &&
    roundMatches.every(match => match.homeTeam?.name && match.awayTeam?.name);
  roundTeamsReady = allKnown;

  roundMatches.forEach((match, index) => {
    const homeKnown = Boolean(match.homeTeam?.name);
    const awayKnown = Boolean(match.awayTeam?.name);
    const locked = !allKnown;
    const date = formatDate(match.utcDate);
    const row = document.createElement("div");
    row.className = `match${locked ? " locked" : ""}`;

    const time = document.createElement("div");
    time.className = "match-time";
    time.innerHTML = `<strong>${roundLabel(index)}</strong>${date.date} · ${date.time}`;

    const teams = document.createElement("div");
    teams.className = "teams";
    teams.innerHTML = `
      <div class="team${homeKnown ? "" : " unknown"}">
        <span class="team-code">${teamCode(match.homeTeam)}</span>
        <span class="team-name">${teamName(match.homeTeam)}</span>
      </div>
      <div class="team${awayKnown ? "" : " unknown"}">
        <span class="team-code">${teamCode(match.awayTeam)}</span>
        <span class="team-name">${teamName(match.awayTeam)}</span>
      </div>`;

    const score = document.createElement("div");
    score.className = "score";
    const home = scoreSelect(index, "home", locked);
    const away = scoreSelect(index, "away", locked);
    score.append(home, Object.assign(document.createElement("span"), {
      className: "score-sep", textContent: "–"
    }), away);

    row.append(time, teams, score);
    container.appendChild(row);
    selects.push({ home, away, row });
  });

  setAvailability(allKnown);
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

function setAvailability(teamsReady) {
  const beforeDeadline = !roundDeadline || Date.now() <= roundDeadline.getTime();
  const ready = teamsReady && beforeDeadline;
  const status = document.getElementById("status");
  status.classList.toggle("ready", ready);
  document.getElementById("status-text").textContent = !beforeDeadline
    ? "Termin minął · typowanie zamknięte"
    : ready
      ? `Formularz aktywny · termin ${deadlineLabel(roundDeadline)}`
      : `Oczekiwanie na wszystkie drużyny · termin ${deadlineLabel(roundDeadline)}`;
  document.getElementById("copy").disabled = !ready;
  selects.forEach(({ home, away }) => {
    home.disabled = !ready;
    away.disabled = !ready;
  });
}

async function loadMatches() {
  try {
    const response = await fetch("data/football-data.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const all = knockoutMatches(Array.isArray(data.matches) ? data.matches : []);
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
    scores: selects.map(({ home, away }) => ({ home: home.value, away: away.value }))
  };
  try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch (_) {}
}

function loadState() {
  let data;
  try { data = JSON.parse(localStorage.getItem(storageKey)); } catch (_) {}
  if (!data) return;
  document.getElementById("player").value = PLAYERS.includes(data.player) ? data.player : "";
  (data.scores || []).forEach((score, index) => {
    if (!selects[index]) return;
    selects[index].home.value = score.home ?? "";
    selects[index].away.value = score.away ?? "";
    selects[index].home.classList.toggle("set", selects[index].home.value !== "");
    selects[index].away.classList.toggle("set", selects[index].away.value !== "");
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
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

function outputText() {
  const player = document.getElementById("player").value;
  const lines = [`GRACZ: ${player}`, `RUNDA: ${config.title}`, "---"];
  roundMatches.forEach((match, index) => {
    const score = selects[index];
    lines.push(`${roundLabel(index)}: ${teamName(match.homeTeam)} - ${teamName(match.awayTeam)} | ${score.home.value}-${score.away.value}`);
  });
  return lines.join("\n");
}

function copyResults() {
  const player = document.getElementById("player").value;
  if (!player) {
    showToast("Wybierz gracza.");
    document.getElementById("player").focus();
    return;
  }
  const missing = selects.find(({ home, away }) => home.value === "" || away.value === "");
  if (missing) {
    showToast("Uzupełnij wyniki wszystkich meczów.");
    missing.row.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const text = outputText();
  const done = () => {
    const button = document.getElementById("copy");
    button.classList.add("success");
    button.textContent = "SKOPIOWANO";
    document.getElementById("preview-text").textContent = text;
    document.getElementById("preview").classList.add("visible");
    setTimeout(() => {
      button.classList.remove("success");
      button.textContent = "KOPIUJ TYPY";
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
    showToast("Wybierz gracza przed zapisaniem PDF.");
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

  const generated = new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short", timeStyle: "short"
  }).format(new Date());
  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(config.title)} · ${escapeHtml(player)}</title>
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
    <div><h1>${escapeHtml(config.title)}</h1><p>Loża Ekspertów · MŚ 2026 · wynik po 90 minutach</p></div>
    <div class="player"><span>Gracz</span><strong>${escapeHtml(player)}</strong></div>
  </header>
  <div class="summary"><span>Wypełniono: <strong>${filled}/${config.count}</strong></span><span>Wygenerowano: ${escapeHtml(generated)}</span></div>
  <table>
    <thead><tr><th>Mecz</th><th>Termin</th><th colspan="3">Typ</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <footer>Prywatna kopia typów gracza. Dane zapisane w tym dokumencie nie są automatycznie przesyłane administratorowi.</footer>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showToast("Zezwól przeglądarce na otwieranie nowych okien.");
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
  pdfButton.textContent = "ZAPISZ PDF";
  pdfButton.addEventListener("click", generatePDF);
  actions.appendChild(pdfButton);

  const instruction = document.createElement("section");
  instruction.className = "send-instruction";
  instruction.innerHTML = `
    <h2>Jak przesłać typy</h2>
    <p>
      Po uzupełnieniu wszystkich wyników kliknij <strong>KOPIUJ TYPY</strong>.
      Następnie otwórz prywatną rozmowę na WhatsAppie z
      <strong>Andrzejem W. (administratorem)</strong>, wklej skopiowaną treść
      i wyślij ją w prywatnej wiadomości. Nie przesyłaj typów na grupę.
    </p>`;
  actions.insertAdjacentElement("afterend", instruction);
}

document.getElementById("round-title").textContent = config.title;
document.getElementById("round-dates").textContent = config.dates;
document.getElementById("match-count").textContent = config.count;
document.getElementById("match-word").textContent = config.count === 1 ? "mecz" : "meczów";
document.getElementById("player").addEventListener("change", saveState);
document.getElementById("copy").addEventListener("click", copyResults);
buildPlayerSelect();
addFinalActions();
loadMatches();
setInterval(() => {
  if (roundMatches.length) setAvailability(roundTeamsReady);
}, 60 * 1000);
