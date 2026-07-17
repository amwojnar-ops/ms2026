(() => {
  const shared = window.HSO_SHARED || {};
  const players = [...(shared.PLAYERS || [])].sort((a, b) => a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' }));
  const select = document.getElementById('playerSelect');
  const card = document.getElementById('memoryCard');

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const pointsLabel = value => value === 1 ? 'pkt' : 'pkt';
  const teamName = name => shared.teamName ? shared.teamName(name) : name;
  let ranked = [];
  let leaderPts = 0;
  let rankByName = new Map();
  let groupByName = new Map();

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
    card.className = `memory-card${stats._pos === 1 ? ' leader' : ''}`;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-topline">
          <div>
            <div class="brand-mark">MŚ <span>2026</span></div>
            <div class="season">Loża Ekspertów</div>
          </div>
          <div class="champ-badge">${flagHtml(champ)}<span>${esc(shared.SHORT?.[champ] || teamName(champ))}</span></div>
        </div>

        <div class="portrait-wrap">
          <div class="portrait">${photo ? `<img src="${esc(photo)}" alt="${esc(name)}">` : '<div class="portrait-placeholder">👤</div>'}</div>
        </div>

        <h2 class="player-name">${esc(name)}</h2>
        <p class="subtitle">Pamiątkowa karta turnieju</p>

        <div class="main-stats">
          <div class="stat"><strong>${stats._pos}</strong><span>miejsce</span></div>
          <div class="stat"><strong>${stats.pts}</strong><span>punkty</span></div>
          <div class="stat"><strong>${diffText}</strong><span>do lidera</span></div>
        </div>

        <div class="detail-grid">
          <div class="detail"><span>Typ mistrza</span><strong>${esc(teamName(champ))}</strong></div>
          <div class="detail"><span>Zmiana od fazy grupowej</span><strong class="movement ${movement.cls}">${movement.text}</strong></div>
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

  const init = async () => {
    try {
      const response = await fetch(`data/football-data.json?t=${Date.now()}`, { cache: 'no-store' });
      const payload = await response.json();
      shared.setApiMatches?.(payload.matches || []);
    } catch (error) {
      document.getElementById('cardNote').textContent = 'Nie udało się pobrać aktualnych danych pucharowych. Karta pokazuje dostępne dane lokalne.';
    }
    rebuildRanking();
    select.innerHTML = players.map(player => `<option value="${esc(player.name)}">${esc(player.name)}</option>`).join('');
    const first = players[0]?.name;
    if (first) {
      select.value = first;
      renderCard(first);
    }
    select.addEventListener('change', () => renderCard(select.value));
    document.getElementById('printCard').addEventListener('click', () => window.print());
  };

  init();
})();
