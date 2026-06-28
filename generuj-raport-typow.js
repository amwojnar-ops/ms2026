const fs = require('fs');
const crypto = require('crypto');

const REPORT = 'Raport_typow_MS_2026.html';
const FOOTBALL_DATA = 'data/football-data.json';
const CORE = 'hso-core.js';

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function decode(value) {
  return String(value)
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function groupedHash(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex')
    .toUpperCase().match(/.{1,8}/g).join('-');
}

function score(tip, result) {
  if (!tip || !result) return 0;
  if (tip === result) return 3;
  const [th, ta] = tip.split('-').map(Number);
  const [rh, ra] = result.split('-').map(Number);
  const sign = value => value > 0 ? 1 : value < 0 ? -1 : 0;
  return sign(th - ta) === sign(rh - ra) ? 1 : 0;
}

function parseEmbeddedData(html) {
  const match = html.match(/<script id="report-source" type="application\/json">([\s\S]*?)<\/script>/);
  return match ? JSON.parse(match[1].replaceAll('<\\/script>', '</script>')) : null;
}

function parseLegacyReport(html) {
  const articles = [...html.matchAll(/<article class="page player-page">([\s\S]*?)<\/article>/g)]
    .map(match => match[1]);
  if (articles.length !== 24) throw new Error(`Stary raport: znaleziono ${articles.length}/24 graczy`);

  const players = articles.map(article => {
    const name = decode(article.match(/<h2>([\s\S]*?)<\/h2>/)?.[1]);
    const champ = decode(article.match(/class="champion">[\s\S]*?<strong>([\s\S]*?)<\/strong>/)?.[1]);
    const rows = [...article.matchAll(
      /<tr>[\s\S]*?<td class="date">([\s\S]*?)<\/td>[\s\S]*?<td class="match">([\s\S]*?)<\/td>[\s\S]*?<td class="tip">([\s\S]*?)<\/td>[\s\S]*?<\/tr>/g
    )].map(row => ({ date: decode(row[1]), match: decode(row[2]), tip: decode(row[3]) }));
    if (rows.length !== 72) throw new Error(`${name}: znaleziono ${rows.length}/72 typów`);
    return { name, champ, tips: rows.map(row => row.tip), rows };
  });

  const groups = [...articles[0].matchAll(/<h3>GRUPA ([A-L])<\/h3>/g)].map(match => match[1]);
  const matches = players[0].rows.map((row, index) => {
    const [home, away] = row.match.split(/\s+[–-]\s+/);
    return { g: groups[Math.floor(index / 6)], date: row.date, home, away };
  });
  return { matches, players: players.map(({ name, champ, tips }) => ({ name, champ, tips })) };
}

const TEAM_TLA = {
  'Meksyk':'MEX','RPA':'RSA','Korea Płd.':'KOR','Czechy':'CZE',
  'Kanada':'CAN','BIH':'BIH','Katar':'QAT','Szwajcaria':'SUI',
  'Brazylia':'BRA','Maroko':'MAR','Haiti':'HAI','Szkocja':'SCO',
  'USA':'USA','Paragwaj':'PAR','Australia':'AUS','Turcja':'TUR',
  'Niemcy':'GER','Curaçao':'CUW','WKS':'CIV','Ekwador':'ECU',
  'Holandia':'NED','Japonia':'JPN','Szwecja':'SWE','Tunezja':'TUN',
  'Belgia':'BEL','Egipt':'EGY','Iran':'IRN','Nowa Zelandia':'NZL',
  'Hiszpania':'ESP','RZP':'CPV','Arabia Saudyjska':'KSA','Urugwaj':'URU',
  'Francja':'FRA','Senegal':'SEN','Irak':'IRQ','Norwegia':'NOR',
  'Argentyna':'ARG','Algieria':'ALG','Austria':'AUT','Jordania':'JOR',
  'Portugalia':'POR','DR Konga':'COD','Uzbekistan':'UZB','Kolumbia':'COL',
  'Anglia':'ENG','Chorwacja':'CRO','Ghana':'GHA','Panama':'PAN'
};

function localDate(utcDate) {
  return new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Warsaw', day: '2-digit', month: '2-digit'
  }).format(new Date(utcDate));
}

function attachResults(data) {
  const snapshot = JSON.parse(fs.readFileSync(FOOTBALL_DATA, 'utf8'));
  const groupMatches = snapshot.matches.filter(match => Date.parse(match.utcDate) < Date.parse('2026-06-28T19:00:00Z'));
  if (groupMatches.length !== 72) throw new Error(`Migawka API: znaleziono ${groupMatches.length}/72 meczów grupowych`);

  data.matches.forEach(match => {
    const api = groupMatches.find(candidate =>
      candidate.homeTeam?.tla === TEAM_TLA[match.home] &&
      candidate.awayTeam?.tla === TEAM_TLA[match.away]
    );
    const result = api?.score?.fullTime;
    if (!api || api.status !== 'FINISHED' || !Number.isInteger(result?.home) || !Number.isInteger(result?.away)) {
      throw new Error(`Brak końcowego wyniku: ${match.date} ${match.home} – ${match.away}`);
    }
    match.date = localDate(api.utcDate);
    match.result = `${result.home}-${result.away}`;
    match.id = api.id;
  });
}

function baselineFromCore() {
  const core = fs.readFileSync(CORE, 'utf8');
  return new Map([...core.matchAll(
    /\{name:'([^']+)',champ:'([^']+)',group:\{pts:(\d+),ex:(\d+),en:(\d+)\}\}/g
  )].map(match => [match[1], {
    pts: Number(match[3]), ex: Number(match[4]), en: Number(match[5])
  }]));
}

const previous = fs.readFileSync(REPORT, 'utf8');
const frozen = parseEmbeddedData(previous) || parseLegacyReport(previous);
attachResults(frozen);

const baseline = baselineFromCore();
frozen.players.forEach(player => {
  player.points = player.tips.map((tip, index) => score(tip, frozen.matches[index].result));
  player.total = player.points.reduce((sum, value) => sum + value, 0);
  player.exact = player.points.filter(value => value === 3).length;
  player.outcome = player.points.filter(value => value === 1).length;
  const expected = baseline.get(player.name);
  if (!expected || player.total !== expected.pts || player.exact !== expected.ex || player.outcome !== expected.en) {
    throw new Error(`${player.name}: raport ${player.total}/${player.exact}/${player.outcome}, baza ${JSON.stringify(expected)}`);
  }
});

const ranked = [...frozen.players].sort((a, b) =>
  b.total - a.total || b.exact - a.exact || a.name.localeCompare(b.name, 'pl')
);
const reportHash = groupedHash(JSON.stringify(frozen));
const generatedAt = new Intl.DateTimeFormat('pl-PL', {
  dateStyle: 'long', timeStyle: 'medium', timeZone: 'Europe/Warsaw'
}).format(new Date());

function groupTable(player, group) {
  const indexes = frozen.matches.map((match, index) => ({ match, index })).filter(item => item.match.g === group);
  const subtotal = indexes.reduce((sum, item) => sum + player.points[item.index], 0);
  const rows = indexes.map(({ match, index }) => {
    const points = player.points[index];
    return `<tr>
      <td class="date">${esc(match.date)}</td>
      <td class="match">${esc(match.home)} <span>–</span> ${esc(match.away)}</td>
      <td class="result">${esc(match.result)}</td>
      <td class="tip">${esc(player.tips[index])}</td>
      <td class="points p${points}">${points}</td>
    </tr>`;
  }).join('');
  return `<section class="group">
    <h3><span>GRUPA ${group}</span><strong>${subtotal} PKT</strong></h3>
    <table><thead><tr><th>Data</th><th>Mecz</th><th>Wynik</th><th>Typ</th><th>Pkt</th></tr></thead><tbody>${rows}</tbody></table>
  </section>`;
}

function playerPage(player, index) {
  const groups = 'ABCDEFGHIJKL'.split('').map(group => groupTable(player, group)).join('');
  return `<article class="page player-page" id="gracz-${encodeURIComponent(player.name)}">
    <header class="player-header">
      <div><p class="eyebrow">LOŻA EKSPERTÓW · MŚ 2026</p><h2>${esc(player.name)}</h2></div>
      <div class="summary">
        <span><small>Suma</small><strong>${player.total}</strong></span>
        <span><small>3 pkt</small><strong>${player.exact}</strong></span>
        <span><small>1 pkt</small><strong>${player.outcome}</strong></span>
        <span class="champion"><small>Typ na mistrza</small><strong>${esc(player.champ)}</strong></span>
      </div>
    </header>
    <div class="groups">${groups}</div>
    <footer><span>Historia punktów po fazie grupowej</span><span>Suma kontrolna: ${groupedHash(JSON.stringify(player)).slice(0,35)}</span><span>Strona ${index + 2} / ${ranked.length + 1}</span></footer>
  </article>`;
}

const rankingRows = ranked.map((player, index) => `<tr>
  <td>${index + 1}</td><td><a href="#gracz-${encodeURIComponent(player.name)}">${esc(player.name)}</a></td>
  <td>${player.exact}</td><td>${player.outcome}</td><td><strong>${player.total}</strong></td>
</tr>`).join('');
const embedded = JSON.stringify({ matches: frozen.matches, players: frozen.players.map(({ points, total, exact, outcome, ...player }) => player) })
  .replaceAll('</script>', '<\\/script>');

const html = `<!doctype html>
<html lang="pl" data-report-version="2"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Historia punktów · Faza grupowa · MŚ 2026</title>
<style>
:root{--navy:#101a31;--blue:#1c315a;--gold:#e7b93f;--ink:#101522;--muted:#667085;--line:#d8dde8;--green:#147d45;--red:#ba2f3c}
*{box-sizing:border-box}html{scroll-behavior:smooth;background:#e8ebf1}body{margin:0;color:var(--ink);font-family:Arial,Helvetica,sans-serif}
.toolbar{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:12px 20px;color:#fff;background:var(--navy);box-shadow:0 4px 18px #0003}.toolbar strong{color:var(--gold)}
.toolbar button{border:0;border-radius:6px;padding:10px 18px;color:var(--navy);background:var(--gold);font-weight:800;cursor:pointer}
.report-back{position:fixed;left:18px;bottom:18px;z-index:10;padding:10px 15px;border:1px solid #e7b93f80;border-radius:999px;color:#fff;background:#101a31f2;box-shadow:0 6px 20px #0004;font-size:12px;font-weight:800;text-decoration:none;backdrop-filter:blur(8px)}.report-back:hover{color:var(--gold);border-color:var(--gold)}
.page{position:relative;width:297mm;min-height:210mm;margin:10mm auto;padding:8mm 10mm;background:#fff;box-shadow:0 4px 24px #17213a24;overflow:hidden;page-break-after:always}
.cover{color:#fff;background:linear-gradient(145deg,var(--navy),#172a50 70%,#203766)}.cover h1{margin:0 0 4mm;color:var(--gold);font-size:35px}.cover p{margin:0 0 7mm;color:#d8e1f2}
.cover-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:12mm}.cover-stats{padding:6mm;border:1px solid #ffffff2e;border-radius:10px;background:#ffffff0b}.cover-stats div{display:flex;justify-content:space-between;padding:2.5mm 0;border-bottom:1px solid #ffffff20}.cover-stats span{color:#c4cee0}
.ranking{width:100%;border-collapse:collapse;background:#fff;color:var(--ink);font-size:11px}.ranking th,.ranking td{padding:2mm 3mm;border-bottom:1px solid var(--line);text-align:center}.ranking th:nth-child(2),.ranking td:nth-child(2){text-align:left}.ranking a{color:var(--blue);font-weight:700;text-decoration:none}
.player-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:3mm;padding-bottom:3mm;border-bottom:2px solid var(--gold)}.eyebrow{margin:0 0 1mm;color:var(--blue);font-size:9px;font-weight:800;letter-spacing:.13em}.player-header h2{margin:0;color:var(--navy);font-size:25px;text-transform:uppercase}
.summary{display:flex;gap:2mm}.summary span{min-width:18mm;padding:2mm 3mm;border-radius:5px;color:#fff;background:var(--navy);text-align:center}.summary small{display:block;color:#bdc9df;font-size:7px;text-transform:uppercase}.summary strong{color:var(--gold);font-size:16px}.summary .champion{min-width:44mm}
.groups{display:grid;grid-template-columns:repeat(3,1fr);gap:2.5mm 4mm}.group{break-inside:avoid;border:1px solid var(--line);border-radius:5px;overflow:hidden}.group h3{display:flex;justify-content:space-between;margin:0;padding:1.2mm 2mm;color:#fff;background:var(--blue);font-size:8px;letter-spacing:.1em}.group h3 strong{color:var(--gold)}
table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:6.8px}th{padding:.6mm .8mm;color:var(--muted);background:#f1f3f7;font-size:5.5px;text-align:left;text-transform:uppercase}td{padding:.65mm .8mm;border-top:1px solid #edf0f5;white-space:nowrap;overflow:hidden}.date{width:9mm;color:var(--muted)}.match{font-size:6.2px}.match span{color:#9aa2b1}.result,.tip,.points{width:9mm;text-align:center}.result{font-weight:700}.tip{background:#fff8e3;font-weight:700}.points{font-weight:900}.p3{color:var(--green);background:#e9f7ef}.p1{color:#8a6300;background:#fff6d8}.p0{color:var(--red);background:#fdecef}
footer{position:absolute;left:10mm;right:10mm;bottom:3mm;display:flex;justify-content:space-between;padding-top:1.5mm;border-top:1px solid var(--line);color:var(--muted);font-size:6.5px}
@media(max-width:900px){.page{width:calc(100% - 20px);margin:10px;padding:20px;overflow:visible}.cover-grid{grid-template-columns:1fr}.groups{grid-template-columns:1fr}.player-header{align-items:flex-start;gap:12px;flex-direction:column}.summary{flex-wrap:wrap}footer{position:static;margin-top:20px}.toolbar{gap:10px}.toolbar button{padding:8px}.report-back{left:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));padding:9px 13px}}
@page{size:A4 landscape;margin:0}@media print{html,body{background:#fff}.toolbar,.report-back{display:none}.page{width:297mm;height:210mm;min-height:0;margin:0;box-shadow:none}}
</style></head><body>
<div class="toolbar"><div><strong>Historia punktów</strong> · faza grupowa · 24 graczy</div><button onclick="window.print()">DRUKUJ / ZAPISZ PDF</button></div>
<a class="report-back" href="hso.html" aria-label="Wróć do strony głównej HSO">← WRÓĆ DO HSO</a>
<article class="page cover"><h1>Raport punktów fazy grupowej</h1><p>Wynik, typ i liczba punktów za każdy z 72 meczów.</p><div class="cover-grid">
  <div class="cover-stats"><div><span>Gracze</span><strong>24</strong></div><div><span>Mecze</span><strong>72</strong></div><div><span>Wpisy punktowe</span><strong>1728</strong></div><div><span>Wygenerowano</span><strong>${esc(generatedAt)}</strong></div><div><span>SHA-256</span><strong>${reportHash.slice(0,17)}…</strong></div></div>
  <table class="ranking"><thead><tr><th>#</th><th>Gracz</th><th>3 pkt</th><th>1 pkt</th><th>Suma</th></tr></thead><tbody>${rankingRows}</tbody></table>
</div></article>
${ranked.map(playerPage).join('')}
<script id="report-source" type="application/json">${embedded}</script>
</body></html>`;

fs.writeFileSync(REPORT, html, 'utf8');
console.log(`HTML=${REPORT}`);
console.log(`PLAYERS=${ranked.length}`);
console.log(`MATCHES=${frozen.matches.length}`);
console.log(`POINT_ROWS=${ranked.length * frozen.matches.length}`);
console.log(`TOTAL_POINTS=${ranked.reduce((sum, player) => sum + player.total, 0)}`);
console.log(`HASH=${reportHash}`);
