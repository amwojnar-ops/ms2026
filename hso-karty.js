(() => {
  const shared = window.HSO_SHARED || {};
  const groupSource = window.HSO_GROUP_REPORT || {};
  const players = [...(shared.PLAYERS || [])].sort((a, b) => a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' }));
  const selectButton = document.getElementById('playerSelectButton');
  const selectLabel = document.getElementById('playerSelectLabel');
  const selectMenu = document.getElementById('playerSelectMenu');
  const card = document.getElementById('memoryCard');

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const pointsLabel = () => 'pkt';
  const teamName = name => shared.teamName ? shared.teamName(name) : name;
  const cardPlayerName = name => /^Andrzej\s+/i.test(name) ? 'Andrzej' : name;
  let ranked = [];
  let leaderPts = 0;
  let rankByName = new Map();
  let groupByName = new Map();
  let timelineByPlayer = new Map();
  let selectedPlayer = null;

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

  const assignTrendPositions = rows => {
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
        sort: match.id || index,
        result: match.result,
        pointsFor: name => score(sourcePlayers.get(name)?.tips?.[index], match.result)
      }));
  };

  const knockoutEvents = apiMatches => {
    const apiById = new Map((apiMatches || []).map(match => [Number(match.id), match]));
    const events = (shared.KNOCKOUT_TIP_ROUNDS || []).flatMap(round => (round.matches || []).map((declared, index) => {
      const key = declared.id || String(index);
      const api = apiById.get(Number(declared.apiId ?? declared.id));
      const result = apiRegulationResult(api);
      if (!result || !round.tipsByPlayer) return null;
      return {
        id: `${round.id}:${key}`,
        sort: Date.parse(api?.utcDate || '') || Number(key) || 0,
        result,
        pointsFor: name => score(round.tipsByPlayer?.[name]?.[key], result)
      };
    }).filter(Boolean)).sort((a, b) => a.sort - b.sort);
    const champion = shared.completedWorldChampion?.();
    if (champion) events.push({
      id: 'champion:bonus',
      sort: Math.max(0, ...events.map(event => event.sort)) + 1,
      result: champion,
      pointsFor: name => players.find(player => player.name === name)?.champ === champion ? 5 : 0
    });
    return events;
  };

  const buildTrend = events => {
    const totals = new Map(players.map(player => [player.name, { name: player.name, pts: 0, ex: 0, en: 0 }]));
    timelineByPlayer = new Map(players.map(player => [player.name, []]));
    events.forEach((event, eventIndex) => {
      players.forEach(player => {
        const value = event.pointsFor(player.name);
        const row = totals.get(player.name);
        if (value === 5) {
          row.pts += 5;
        } else if (value === 3) {
          row.pts += 3;
          row.ex += 1;
        } else if (value === 1) {
          row.pts += 1;
          row.en += 1;
        }
      });
      const trendRows = assignTrendPositions([...totals.values()].map(row => ({ ...row })));
      trendRows.forEach(row => {
        timelineByPlayer.get(row.name)?.push({
          eventIndex: eventIndex + 1,
          pos: row.pos,
          pts: row.pts
        });
      });
    });
  };

  const rebuildRanking = () => {
    ranked = shared.assignPositions ? shared.assignPositions(shared.calcAll ? shared.calcAll() : []) : [];
    leaderPts = ranked[0]?.pts || 0;
    rankByName = new Map(ranked.map(player => [player.name, player]));
    const groupRanked = shared.assignPositions
      ? shared.assignPositions(players.map(player => ({ ...player, pts: player.group.pts, ex: player.group.ex, en: player.group.en })))
      : [];
    groupByName = new Map(groupRanked.map(player => [player.name, player]));
  };

  const flagHtml = team => {
    const iso = shared.ISO?.[team];
    if (!iso) return '';
    return `<img src="img/flags/${iso}.png" alt="${esc(teamName(team))}">`;
  };

  const movementText = (start, current) => {
    const diff = start - current;
    if (diff > 0) return { text: `▲ ${diff}`, cls: 'good' };
    if (diff < 0) return { text: `▼ ${Math.abs(diff)}`, cls: 'bad' };
    return { text: '—', cls: 'neutral' };
  };

  const trendSummary = name => {
    const data = timelineByPlayer.get(name) || [];
    if (!data.length) return { first: '—', best: '—', worst: '—', current: '—' };

    const first = data[0];
    const last = data[data.length - 1];
    const best = Math.min(...data.map(item => item.pos));
    const worst = Math.max(...data.map(item => item.pos));
    return { first: `#${first.pos}`, best: `#${best}`, worst: `#${worst}`, current: `#${last.pos}` };
  };

  const renderTrend = name => {
    const data = timelineByPlayer.get(name) || [];
    if (!data.length) {
      return `
        <div class="trend-panel empty">
          <div class="trend-title">
            <span>Trend miejsc · brak historii</span>
          </div>
        </div>`;
    }

    const width = 640;
    const height = 240;
    const positions = data.map(item => item.pos);
    const bestPos = Math.min(...positions);
    const worstPos = Math.max(...positions);
    const pad = Math.max(1, Math.ceil((worstPos - bestPos) * 0.18));
    const minPos = Math.max(1, bestPos - pad);
    const maxPos = Math.min(players.length, worstPos + pad);
    const x = index => data.length === 1 ? width / 2 : index / (data.length - 1) * width;
    const y = pos => 18 + (pos - minPos) / Math.max(1, maxPos - minPos) * 194;
    const last = data[data.length - 1];
    const points = data.map((item, index) => `${x(index).toFixed(1)},${y(item.pos).toFixed(1)}`).join(' ');
    const area = `0,226 ${points} ${width},226`;

    return `
      <div class="trend-panel">
        <div class="trend-title">
          <span>Trend miejsc od 1. meczu</span>
        </div>
        <div class="trend-chart">
          <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Trend miejsc gracza ${esc(name)}">
            <line class="trend-grid" x1="0" x2="${width}" y1="26" y2="26"></line>
            <line class="trend-grid" x1="0" x2="${width}" y1="120" y2="120"></line>
            <line class="trend-grid" x1="0" x2="${width}" y1="214" y2="214"></line>
            <polygon class="trend-area" points="${area}"></polygon>
            <polyline class="trend-line" points="${points}"></polyline>
            <circle class="trend-dot" cx="${x(data.length - 1).toFixed(1)}" cy="${y(last.pos).toFixed(1)}" r="6"></circle>
          </svg>
        </div>
      </div>`;
  };

  const renderCard = name => {
    const base = players.find(player => player.name === name);
    const stats = rankByName.get(name);
    const groupStats = groupByName.get(name);
    if (!base || !stats) return;
    const photo = shared.PHOTOS?.[name] || '';
    const diff = stats.pts - leaderPts;
    const diffText = diff === 0 ? '—' : String(diff);
    const movement = movementText(groupStats?._pos || stats._pos, stats._pos);
    const champ = base.champ || '—';
    const exactTotal = stats.ex;
    const oneTotal = stats.en;
    const knockoutPoints = Math.max(0, stats.pts - base.group.pts);
    const trend = trendSummary(name);
    const displayName = cardPlayerName(name);
    card.className = `memory-card${stats._pos === 1 ? ' leader' : ''}`;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-topline">
          <div>
            <div class="brand-mark">MŚ <span>2026</span></div>
            <div class="season">Loża Ekspertów</div>
          </div>
          <div class="champ-badge">${flagHtml(champ)}<span>${esc(teamName(champ))}</span></div>
        </div>

        <div class="card-hero">
          <div class="portrait-wrap">
            <div class="portrait">${photo ? `<img src="${esc(photo)}" alt="${esc(displayName)}">` : '<div class="portrait-placeholder">👤</div>'}</div>
          </div>
          <div class="identity">
            <h2 class="player-name">${esc(displayName)}</h2>
            <p class="subtitle">Pamiątkowa karta turnieju</p>
          </div>
        </div>

        <div class="main-stats">
          <div class="stat"><strong>${stats._pos}</strong><span>miejsce</span></div>
          <div class="stat"><strong>${stats.pts}</strong><span>punkty</span></div>
          <div class="stat"><strong>${diffText}</strong><span>do lidera</span></div>
        </div>

        ${renderTrend(name)}

        <div class="detail-grid">
          <div class="detail trend-detail">
            <span>Podsumowanie trendu</span>
            <strong>
              <em>Start ${trend.first}</em>
              <em>Najniżej ${trend.worst}</em>
              <em>Najwyżej ${trend.best}</em>
            </strong>
          </div>
          <div class="detail"><span>Trafienia za 3</span><strong>${exactTotal}</strong></div>
          <div class="detail"><span>Trafienia za 1</span><strong>${oneTotal}</strong></div>
          <div class="detail"><span>Faza grupowa</span><strong>${base.group.pts} ${pointsLabel(base.group.pts)}</strong></div>
          <div class="detail"><span>Faza pucharowa</span><strong>${knockoutPoints} ${pointsLabel(knockoutPoints)}</strong></div>
        </div>

        <div class="footer-line">
          <span>Kanada · Meksyk · USA</span>
          <span>11.06–19.07.2026</span>
        </div>
      </div>`;
  };

  const closePlayerMenu = () => {
    selectMenu.hidden = true;
    selectButton.setAttribute('aria-expanded', 'false');
  };

  const openPlayerMenu = () => {
    selectMenu.hidden = false;
    selectButton.setAttribute('aria-expanded', 'true');
    selectMenu.querySelector('.custom-select-option.active')?.scrollIntoView({ block: 'nearest' });
  };

  const setSelectedPlayer = name => {
    selectedPlayer = name;
    selectLabel.textContent = name || 'Wybierz gracza';
    selectMenu.querySelectorAll('.custom-select-option').forEach(option => {
      const active = option.dataset.value === name;
      option.classList.toggle('active', active);
      option.setAttribute('aria-selected', String(active));
    });
    renderCard(name);
  };

  const renderPlayerMenu = () => {
    selectMenu.innerHTML = players.map(player =>
      `<button class="custom-select-option" type="button" role="option" data-value="${esc(player.name)}">${esc(player.name)}</button>`
    ).join('');
    selectMenu.querySelectorAll('.custom-select-option').forEach(option => {
      option.addEventListener('click', () => {
        setSelectedPlayer(option.dataset.value);
        closePlayerMenu();
        selectButton.focus();
      });
    });
  };

  const init = async () => {
    let apiMatches = [];
    try {
      const response = await fetch(`data/football-data.json?t=${Date.now()}`, { cache: 'no-store' });
      const payload = await response.json();
      apiMatches = payload.matches || [];
      shared.setApiMatches?.(apiMatches);
    } catch (error) {
      document.getElementById('cardNote').textContent = 'Nie udało się pobrać aktualnych danych pucharowych. Karta pokazuje dostępne dane lokalne.';
    }
    buildTrend([...groupEvents(), ...knockoutEvents(apiMatches)]);
    rebuildRanking();
    renderPlayerMenu();
    const first = players[0]?.name;
    if (first) {
      setSelectedPlayer(first);
    }
    selectButton.addEventListener('click', () => {
      if (selectMenu.hidden) openPlayerMenu();
      else closePlayerMenu();
    });
    selectButton.addEventListener('keydown', event => {
      if (!['ArrowDown', 'Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      openPlayerMenu();
      selectMenu.querySelector('.custom-select-option.active, .custom-select-option')?.focus();
    });
    selectMenu.addEventListener('keydown', event => {
      const options = [...selectMenu.querySelectorAll('.custom-select-option')];
      const index = options.indexOf(document.activeElement);
      if (event.key === 'Escape') {
        closePlayerMenu();
        selectButton.focus();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        options[Math.min(options.length - 1, index + 1)]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        options[Math.max(0, index - 1)]?.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('#playerSelectWrap')) closePlayerMenu();
    });
    document.getElementById('printCard').addEventListener('click', () => window.print());
  };

  init();
})();
