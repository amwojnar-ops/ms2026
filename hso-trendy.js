(() => {
  const shared = window.HSO_SHARED || {};
  const groupSource = window.HSO_GROUP_REPORT || {};
  const players = [...(shared.PLAYERS || [])].sort((a, b) => a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' }));
  const select = document.getElementById('playerSelect');
  const chartBox = document.getElementById('chartBox');
  const chartTitle = document.getElementById('chartTitle');
  const currentPlace = document.getElementById('currentPlace');
  const summaryList = document.getElementById('summaryList');
  const timelineTable = document.getElementById('timelineTable');
  const trendNote = document.getElementById('trendNote');

  const score = (tip, result) => {
    if (!tip || !result) return 0;
    if (tip === result) return 3;
    const [th, ta] = tip.split('-').map(Number);
    const [rh, ra] = result.split('-').map(Number);
    if (![th, ta, rh, ra].every(Number.isFinite)) return 0;
    const sign = value => value > 0 ? 1 : value < 0 ? -1 : 0;
    return sign(th - ta) === sign(rh - ra) ? 1 : 0;
  };

  const apiRegulationResult = match => {
    if (match?.status !== 'FINISHED') return null;
    const valid = value => Number.isInteger(value?.home) && Number.isInteger(value?.away);
    if (valid(match.score?.regularTime)) return `${match.score.regularTime.home}-${match.score.regularTime.away}`;
    if (valid(match.score?.fullTime) && valid(match.score?.extraTime)) {
      return `${match.score.fullTime.home - match.score.extraTime.home}-${match.score.fullTime.away - match.score.extraTime.away}`;
    }
    if (valid(match.score?.fullTime)) return `${match.score.fullTime.home}-${match.score.fullTime.away}`;
    return null;
  };

  const assignPositions = rows => {
    rows.sort((a, b) => b.pts - a.pts || b.ex - a.ex || a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' }));
    rows.forEach((row, index) => {
      const prev = rows[index - 1];
      row.pos = index && prev.pts === row.pts && prev.ex === row.ex ? prev.pos : index + 1;
    });
    return rows;
  };

  const groupEvents = () => {
    const matches = groupSource.matches || [];
    const sourcePlayers = new Map((groupSource.players || []).map(player => [player.name, player]));
    return matches
      .map((match, index) => ({ match, index }))
      .filter(item => /^\d+-\d+$/.test(item.match.result || ''))
      .sort((a, b) => (a.match.id || 0) - (b.match.id || 0))
      .map(({ match, index }) => ({
        id: `group:${match.id || index}`,
        phase: 'Faza grupowa',
        date: match.date || '',
        label: `${match.home} – ${match.away}`,
        result: match.result,
        pointsFor: name => score(sourcePlayers.get(name)?.tips?.[index], match.result)
      }));
  };

  const knockoutEvents = apiMatches => {
    const apiById = new Map((apiMatches || []).map(match => [Number(match.id), match]));
    const roundLabels = { r32: '1/16', r16: '1/8', qf: '1/4', sf: '1/2', medale: 'Medale' };
    return (shared.KNOCKOUT_TIP_ROUNDS || []).flatMap(round => (round.matches || []).map((declared, index) => {
      const key = declared.id || String(index);
      const api = apiById.get(Number(declared.apiId ?? declared.id));
      const result = apiRegulationResult(api);
      if (!result || !round.tipsByPlayer) return null;
      return {
        id: `${round.id}:${key}`,
        phase: roundLabels[round.id] || round.id,
        date: api?.utcDate ? new Date(api.utcDate).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' }) : '',
        sort: Date.parse(api?.utcDate || '') || Number(key) || 0,
        label: `${declared.home || api?.homeTeam?.name || '—'} – ${declared.away || api?.awayTeam?.name || '—'}`,
        result,
        pointsFor: name => score(round.tipsByPlayer?.[name]?.[key], result)
      };
    }).filter(Boolean)).sort((a, b) => a.sort - b.sort);
  };

  const buildTrend = events => {
    const totals = new Map(players.map(player => [player.name, { name: player.name, pts: 0, ex: 0, en: 0 }]));
    const timeline = [];
    events.forEach((event, eventIndex) => {
      players.forEach(player => {
        const value = event.pointsFor(player.name);
        const row = totals.get(player.name);
        if (value === 3) { row.pts += 3; row.ex += 1; }
        else if (value === 1) { row.pts += 1; row.en += 1; }
      });
      const ranked = assignPositions([...totals.values()].map(row => ({ ...row })));
      ranked.forEach(row => {
        if (!timelineByPlayer.has(row.name)) timelineByPlayer.set(row.name, []);
        timelineByPlayer.get(row.name).push({
          eventIndex: eventIndex + 1,
          pos: row.pos,
          pts: row.pts,
          ex: row.ex,
          en: row.en,
          event
        });
      });
      timeline.push(ranked);
    });
    return timeline;
  };

  const timelineByPlayer = new Map();

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  const renderSummary = data => {
    const first = data[0];
    const last = data[data.length - 1];
    const best = Math.min(...data.map(item => item.pos));
    const worst = Math.max(...data.map(item => item.pos));
    const move = first.pos - last.pos;
    const deltaClass = move > 0 ? 'good' : move < 0 ? 'bad' : '';
    summaryList.innerHTML = [
      ['Po 1. meczu', first.pos],
      ['Aktualnie', last.pos],
      ['Najwyżej', best],
      ['Najniżej', worst],
      ['Zmiana', move > 0 ? `▲ ${move}` : move < 0 ? `▼ ${Math.abs(move)}` : '—', deltaClass]
    ].map(([label, value, cls]) => `<div class="summary-item ${cls || ''}"><span>${label}</span><strong>${value}</strong></div>`).join('');
    currentPlace.textContent = `#${last.pos}`;
  };

  const renderChart = (name, data) => {
    const width = 1000, height = 520, left = 64, right = 28, top = 42, bottom = 64;
    const chartW = width - left - right;
    const chartH = height - top - bottom;
    const maxPos = Math.max(players.length, ...data.map(item => item.pos));
    const x = index => left + (data.length === 1 ? chartW / 2 : index / (data.length - 1) * chartW);
    const y = pos => top + (pos - 1) / Math.max(1, maxPos - 1) * chartH;
    const points = data.map((item, index) => `${x(index).toFixed(1)},${y(item.pos).toFixed(1)}`).join(' ');
    const area = `${left},${top + chartH} ${points} ${left + chartW},${top + chartH}`;
    const ticks = [1, 5, 10, 15, 20, 24].filter((value, index, arr) => value <= maxPos && arr.indexOf(value) === index);
    const eventTicks = [0, Math.floor((data.length - 1) / 4), Math.floor((data.length - 1) / 2), Math.floor((data.length - 1) * 3 / 4), data.length - 1]
      .filter((value, index, arr) => value >= 0 && arr.indexOf(value) === index);
    chartTitle.textContent = name;
    chartBox.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Trend miejsc gracza ${esc(name)}">
      <defs>
        <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f6c247" stop-opacity=".32"/>
          <stop offset="100%" stop-color="#f6c247" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="transparent"/>
      ${ticks.map(tick => `<line class="chart-grid-line" x1="${left}" x2="${left + chartW}" y1="${y(tick)}" y2="${y(tick)}"/><text class="tick-label" x="${left - 16}" y="${y(tick) + 4}" text-anchor="end">#${tick}</text>`).join('')}
      ${eventTicks.map(index => `<text class="tick-label" x="${x(index)}" y="${height - 25}" text-anchor="middle">${data[index].eventIndex}</text>`).join('')}
      <text class="axis-label" x="${left}" y="${height - 8}">kolejne zakończone mecze</text>
      <text class="axis-label" transform="translate(18 ${top + chartH / 2}) rotate(-90)" text-anchor="middle">miejsce w rankingu</text>
      <polygon class="trend-area" points="${area}"/>
      <polyline class="trend-line" points="${points}"/>
      ${data.map((item, index) => `<circle class="trend-dot ${index === data.length - 1 ? 'last' : ''}" cx="${x(index)}" cy="${y(item.pos)}" r="${index === data.length - 1 ? 7 : 4}">
        <title>${esc(item.event.phase)} · ${esc(item.event.label)} · miejsce ${item.pos} · ${item.pts} pkt</title>
      </circle>`).join('')}
    </svg>`;
  };

  const renderTable = data => {
    const rows = [...data].slice(-14).reverse();
    timelineTable.innerHTML = `<table>
      <thead><tr><th>Mecz</th><th>Etap</th><th>Wynik</th><th>Miejsce</th><th>Punkty</th><th>Zmiana</th></tr></thead>
      <tbody>${rows.map(item => {
        const previous = data[item.eventIndex - 2];
        const delta = previous ? previous.pos - item.pos : 0;
        const deltaText = delta > 0 ? `▲ ${delta}` : delta < 0 ? `▼ ${Math.abs(delta)}` : '—';
        const cls = delta > 0 ? 'delta-up' : delta < 0 ? 'delta-down' : 'delta-same';
        return `<tr>
          <td>${esc(item.event.date)} · ${esc(item.event.label)}</td>
          <td>${esc(item.event.phase)}</td>
          <td>${esc(item.event.result)}</td>
          <td>#${item.pos}</td>
          <td>${item.pts}</td>
          <td class="${cls}">${deltaText}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
  };

  const renderPlayer = name => {
    const data = timelineByPlayer.get(name) || [];
    if (!data.length) return;
    renderSummary(data);
    renderChart(name, data);
    renderTable(data);
  };

  const init = async () => {
    select.innerHTML = players.map(player => `<option value="${esc(player.name)}">${esc(player.name)}</option>`).join('');
    let apiMatches = [];
    try {
      const response = await fetch(`data/football-data.json?t=${Date.now()}`, { cache: 'no-store' });
      const payload = await response.json();
      apiMatches = payload.matches || [];
    } catch (error) {
      trendNote.textContent = 'Nie udało się pobrać aktualnych danych pucharowych. Pokazuję fazę grupową.';
    }
    const events = [...groupEvents(), ...knockoutEvents(apiMatches)];
    buildTrend(events);
    const selected = players[0]?.name;
    trendNote.textContent = `${events.length} zakończonych meczów w historii rankingu.`;
    if (selected) {
      select.value = selected;
      renderPlayer(selected);
    }
    select.addEventListener('change', () => renderPlayer(select.value));
  };

  document.getElementById('printTrend').addEventListener('click', () => window.print());
  init();
})();
