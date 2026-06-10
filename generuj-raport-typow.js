const fs = require('fs');
const crypto = require('crypto');
const vm = require('vm');

const SOURCE = 'hso.html';
const OUTPUT = 'Raport_typow_MS_2026.html';

function extractArray(source, name) {
  const marker = `const ${name}=`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Nie znaleziono ${name}`);
  const start = source.indexOf('[', markerIndex);
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const char = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === '[') depth += 1;
    if (char === ']' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`Nie znaleziono końca ${name}`);
}

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function hash(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex').toUpperCase();
}

function groupedHash(value) {
  return hash(value).match(/.{1,8}/g).join('-');
}

function team(name) {
  return {
    'Bośnia i Herc.': 'BIH',
    'Wybrzeże K.Sł.': 'WKS',
    'Rep. Ziel. Przył.': 'RZP',
  }[name] || name;
}

const source = fs.readFileSync(SOURCE, 'utf8');
const matches = vm.runInNewContext(extractArray(source, 'MATCHES'));
const players = vm.runInNewContext(extractArray(source, 'PLAYERS'))
  .sort((a, b) => a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' }));

const invalid = players.filter((player) => player.tips.length !== matches.length + 1);
if (matches.length !== 72) throw new Error(`Nieprawidłowa liczba meczów: ${matches.length}`);
if (players.length !== 24) throw new Error(`Nieprawidłowa liczba graczy: ${players.length}`);
if (invalid.length) throw new Error(`Niekompletne typy: ${invalid.map((p) => p.name).join(', ')}`);

const frozenData = {
  stage: 'Faza grupowa MŚ 2026',
  matches: matches.map(({ g, date, time, home, away }) => ({ g, date, time, home, away })),
  players: players.map(({ name, champ, tips }) => ({ name, champ, tips })),
};
const reportHash = groupedHash(JSON.stringify(frozenData));
const generatedAt = new Intl.DateTimeFormat('pl-PL', {
  dateStyle: 'long',
  timeStyle: 'medium',
  timeZone: 'Europe/Warsaw',
}).format(new Date());

function groupTable(player, group) {
  const rows = matches
    .map((match, index) => ({ match, index }))
    .filter(({ match }) => match.g === group)
    .map(({ match, index }) => `
      <tr>
        <td class="date">${esc(match.date)}</td>
        <td class="match">${esc(team(match.home))} <span>–</span> ${esc(team(match.away))}</td>
        <td class="tip">${esc(player.tips[index + 1])}</td>
      </tr>`)
    .join('');
  return `<section class="group">
    <h3>GRUPA ${group}</h3>
    <table>
      <thead><tr><th>Data</th><th>Mecz</th><th>Typ</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`;
}

function playerPage(player, index) {
  const playerHash = groupedHash(JSON.stringify({
    name: player.name,
    champ: player.champ,
    tips: player.tips,
  }));
  const groups = 'ABCDEFGHIJKL'.split('').map((group) => groupTable(player, group)).join('');
  return `<article class="page player-page">
    <header class="player-header">
      <div>
        <p class="eyebrow">LOŻA EKSPERTÓW · MŚ 2026</p>
        <h2>${esc(player.name)}</h2>
      </div>
      <div class="champion">
        <span>Typ na mistrza świata</span>
        <strong>${esc(player.champ)}</strong>
      </div>
    </header>
    <div class="groups">${groups}</div>
    <footer>
      <span>Stan typów utrwalony: ${esc(generatedAt)}</span>
      <span>SHA-256 gracza: ${playerHash}</span>
      <span>Strona ${index + 2} / ${players.length + 1}</span>
    </footer>
  </article>`;
}

const pages = players.map(playerPage).join('');
const html = `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Raport typów · Loża Ekspertów · MŚ 2026</title>
<style>
:root{--navy:#101a31;--blue:#1c315a;--gold:#e7b93f;--ink:#101522;--muted:#667085;--line:#d8dde8}
*{box-sizing:border-box}html{background:#e8ebf1}body{margin:0;color:var(--ink);font-family:Arial,Helvetica,sans-serif}
.toolbar{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:12px 20px;color:#fff;background:var(--navy);box-shadow:0 4px 18px #0003}
.toolbar strong{color:var(--gold)}.toolbar button{border:0;border-radius:6px;padding:10px 18px;color:var(--navy);background:var(--gold);font-weight:800;cursor:pointer}
.page{position:relative;width:297mm;min-height:210mm;margin:10mm auto;padding:8mm 12mm;background:#fff;box-shadow:0 4px 24px #17213a24;overflow:hidden;page-break-after:always}
.cover{color:#fff;background:linear-gradient(145deg,var(--navy),#172a50 70%,#203766)}
.cover:before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 64%,#e7b93f18 64% 72%,transparent 72%)}
.cover-content{position:relative;z-index:1;height:184mm;display:grid;grid-template-columns:1.15fr .85fr;gap:18mm;align-items:center}
.mark{display:inline-flex;align-items:center;gap:9px;margin-bottom:18mm;color:var(--gold);font-size:13px;font-weight:800;letter-spacing:.16em}
.ball{width:13px;height:13px;border:2px solid currentColor;border-radius:50%}
h1{max-width:165mm;margin:0;font-size:50px;line-height:.98;letter-spacing:-.04em;text-transform:uppercase}
.subtitle{margin:8mm 0 0;color:#d8e1f2;font-size:20px}
.stamp{padding:9mm;border:1px solid #ffffff2e;border-radius:12px;background:#ffffff0b}
.stamp h2{margin:0 0 7mm;color:var(--gold);font-size:22px}
.stat{display:flex;justify-content:space-between;padding:4mm 0;border-bottom:1px solid #ffffff20}.stat span{color:#c4cee0}.stat strong{font-size:17px}
.hash-box{margin-top:8mm;padding:6mm;border-left:4px solid var(--gold);background:#09122688}
.hash-box span{display:block;margin-bottom:2mm;color:#b8c4d9;font-size:11px;text-transform:uppercase;letter-spacing:.1em}
.hash-box code{color:#fff;font:700 12px/1.7 Consolas,monospace;overflow-wrap:anywhere}.notice{margin-top:8mm;color:#d5deed;font-size:12px;line-height:1.55}
.seal{position:absolute;left:14mm;bottom:13mm;z-index:2;padding:5mm 7mm;border:1px solid #ffffff30;border-radius:8px;background:#ffffff0b;color:#e9edf5;font-size:12px}
.seal strong{display:block;margin-bottom:2mm;color:var(--gold);font-size:13px;text-transform:uppercase}
.player-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:4mm;padding-bottom:3mm;border-bottom:2px solid var(--gold)}
.eyebrow{margin:0 0 2mm;color:var(--blue);font-size:10px;font-weight:800;letter-spacing:.14em}.player-header h2{margin:0;color:var(--navy);font-size:26px;text-transform:uppercase}
.champion{min-width:62mm;padding:3mm 5mm;color:#fff;background:var(--navy);border-radius:6px;text-align:right}.champion span{display:block;margin-bottom:1mm;color:#bdc9df;font-size:9px;text-transform:uppercase;letter-spacing:.1em}.champion strong{color:var(--gold);font-size:17px}
.groups{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm 6mm}.group{break-inside:avoid;border:1px solid var(--line);border-radius:5px;overflow:hidden}
.group h3{margin:0;padding:1.5mm 2.5mm;color:#fff;background:var(--blue);font-size:9px;letter-spacing:.12em}
table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:7.5px}th{padding:.75mm 1.2mm;color:var(--muted);background:#f1f3f7;font-size:6px;text-align:left;text-transform:uppercase}
td{padding:.8mm 1.2mm;border-top:1px solid #edf0f5;white-space:nowrap;overflow:hidden}.date{width:10mm;color:var(--muted)}.match{font-size:6.6px;letter-spacing:-.01em}.match span{color:#9aa2b1}.tip{width:9mm;color:var(--navy);background:#fff8e3;font-weight:800;text-align:center}
footer{position:absolute;left:12mm;right:12mm;bottom:4mm;display:flex;justify-content:space-between;padding-top:2mm;border-top:1px solid var(--line);color:var(--muted);font-size:7px}
@page{size:A4 landscape;margin:0}@media print{html,body{background:#fff}.toolbar{display:none}.page{width:297mm;height:210mm;min-height:0;margin:0;box-shadow:none}}
</style>
</head>
<body>
<div class="toolbar"><div><strong>Finalny raport typów</strong> · 24 graczy</div><button onclick="window.print()">DRUKUJ / ZAPISZ PDF</button></div>
<article class="page cover">
  <div class="cover-content">
    <div>
      <div class="mark"><span class="ball"></span> LOŻA EKSPERTÓW · MŚ 2026</div>
      <h1>Protokół utrwalenia typów</h1>
      <p class="subtitle">Faza grupowa · pełny wykaz przewidywanych wyników</p>
    </div>
    <div class="stamp">
      <h2>Potwierdzenie stanu danych</h2>
      <div class="stat"><span>Wygenerowano</span><strong>${esc(generatedAt)}</strong></div>
      <div class="stat"><span>Stan utrwalony</span><strong>${esc(generatedAt)}</strong></div>
      <div class="stat"><span>Liczba graczy</span><strong>${players.length}</strong></div>
      <div class="stat"><span>Liczba meczów</span><strong>${matches.length}</strong></div>
      <div class="stat"><span>Sprawdzone typy</span><strong>${players.length * matches.length}</strong></div>
      <div class="hash-box"><span>SHA-256 całego raportu</span><code>${reportHash}</code></div>
      <p class="notice">Identyfikator obliczono z terminarza, nazw graczy, typów mistrza i wszystkich wyników. Zmiana dowolnej wartości powoduje zmianę identyfikatora.</p>
    </div>
  </div>
  <div class="seal"><strong>Komplet zweryfikowany</strong>24 graczy · 72 mecze · brak pustych typów</div>
</article>
${pages}
</body>
</html>`;

fs.writeFileSync(OUTPUT, html, 'utf8');
console.log(`HTML=${OUTPUT}`);
console.log(`PLAYERS=${players.length}`);
console.log(`MATCHES=${matches.length}`);
console.log(`TIPS=${players.length * matches.length}`);
console.log(`HASH=${reportHash}`);
