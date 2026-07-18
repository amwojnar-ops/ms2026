(() => {
  const shared = window.HSO_SHARED || {};
  const report = window.HSO_GROUP_REPORT || {};
  const players = [...(shared.PLAYERS || [])].sort((a, b) => a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' }));
  const select = document.getElementById('compatPlayer');
  const ranking = document.getElementById('compatRanking');
  const summary = document.getElementById('compatSummary');
  const filters = document.getElementById('phaseFilters');
  let phase = 'all';
  let expandedName = null;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const outcome = tip => {
    const [home, away] = String(tip || '').split('-').map(Number);
    if (!Number.isFinite(home) || !Number.isFinite(away)) return null;
    return home === away ? 'draw' : home > away ? 'home' : 'away';
  };

  const groupEntries = () => {
    if (!Array.isArray(report.matches) || !Array.isArray(report.players)) return [];
    return report.matches.map((match, index) => ({
      key:`group-${match.id || index}`, phase:'group', label:`${match.home} – ${match.away}`,
      tips:Object.fromEntries(report.players.map(player => [player.name, player.tips?.[index]]))
    }));
  };

  const knockoutEntries = () => (shared.KNOCKOUT_TIP_ROUNDS || []).flatMap(round => {
    const matches = round.matches || [];
    const complete = players.every(player => matches.every((match, index) => {
      const key = String(match.id || index);
      return typeof round.tipsByPlayer?.[player.name]?.[key] === 'string';
    }));
    if (!complete) return [];
    return matches.map((match, index) => {
      const key = String(match.id || index);
      return {
        key:`${round.id}-${key}`, phase:'knockout', label:`${shared.teamName?.(match.home) || match.home} – ${shared.teamName?.(match.away) || match.away}`,
        tips:Object.fromEntries(players.map(player => [player.name, round.tipsByPlayer[player.name][key]]))
      };
    });
  });

  const champEntry = () => ({
    key:'champ', phase:'champ', label:'Typ mistrza świata',
    tips:Object.fromEntries(players.map(player => [player.name, player.champ]))
  });
  const entries = [...groupEntries(), ...knockoutEntries(), champEntry()];
  const activeEntries = () => entries.filter(entry => phase === 'all' || entry.phase === phase);

  const compare = (base, other) => {
    const details = activeEntries().map(entry => {
      const a = entry.tips[base];
      const b = entry.tips[other];
      if (!a || !b) return null;
      if (entry.phase === 'champ') {
        const exact = a === b;
        return { ...entry, a, b, points:exact ? 2 : 0, kind:exact ? 'same' : 'different' };
      }
      const exact = a === b;
      const sameOutcome = !exact && outcome(a) === outcome(b);
      return { ...entry, a, b, points:exact ? 2 : sameOutcome ? 1 : 0, kind:exact ? 'same' : sameOutcome ? 'close' : 'different' };
    }).filter(Boolean);
    const points = details.reduce((sum, item) => sum + item.points, 0);
    const exact = details.filter(item => item.kind === 'same').length;
    const close = details.filter(item => item.kind === 'close').length;
    const different = details.filter(item => item.kind === 'different').length;
    return { name:other, details, points, exact, close, different, total:details.length, percent:details.length ? Math.round(points / (details.length * 2) * 100) : 0 };
  };

  const renderDetails = result => `
    <div class="compat-details" ${expandedName === result.name ? '' : 'hidden'}>
      <div class="detail-stats">
        <div class="detail-stat"><span>Porównane typy</span><strong>${result.total}</strong></div>
        <div class="detail-stat"><span>Identyczne</span><strong>${result.exact}</strong></div>
        <div class="detail-stat"><span>Ten sam kierunek</span><strong>${result.close}</strong></div>
        <div class="detail-stat"><span>Różne</span><strong>${result.different}</strong></div>
      </div>
      <div class="match-list">
        ${result.details.map(item => `<div class="match-item">
          <span>${esc(item.label)}</span><strong>${esc(item.a)} · ${esc(item.b)}</strong>
          <span class="${item.kind}">${item.kind === 'same' ? 'identyczne' : item.kind === 'close' ? 'zgodny kierunek' : 'różne'}</span>
        </div>`).join('')}
      </div>
    </div>`;

  const render = () => {
    const base = select.value;
    const results = players.filter(player => player.name !== base).map(player => compare(base, player.name))
      .sort((a, b) => b.percent - a.percent || b.exact - a.exact || a.name.localeCompare(b.name, 'pl', { sensitivity:'base' }));
    const best = results[0];
    const average = results.length ? Math.round(results.reduce((sum, item) => sum + item.percent, 0) / results.length) : 0;
    summary.innerHTML = `
      <div class="summary-main"><span>Najbardziej zgodna osoba</span><strong>${esc(best?.name || '—')} · ${best?.percent || 0}%</strong></div>
      <div class="summary-stat"><span>Porównanych typów</span><strong>${best?.total || 0}</strong></div>
      <div class="summary-stat"><span>Średnia zgodność</span><strong>${average}%</strong></div>
      <div class="summary-stat"><span>Najwięcej identycznych</span><strong>${Math.max(0, ...results.map(item => item.exact))}</strong></div>`;
    ranking.innerHTML = results.map((result, index) => {
      const player = players.find(item => item.name === result.name);
      const photo = shared.PHOTOS?.[result.name];
      return `<article class="compat-row">
        <button class="compat-row-button" type="button" data-person="${esc(result.name)}" aria-expanded="${expandedName === result.name}">
          <span class="rank-no">${index + 1}</span>
          <span class="person">${photo ? `<img src="${esc(photo)}" alt="">` : '<span class="person-placeholder">👤</span>'}<strong>${esc(result.name)}</strong></span>
          <span class="meter" aria-hidden="true"><span style="width:${result.percent}%"></span></span>
          <span class="score">${result.percent}<small>%</small></span>
        </button>
        ${renderDetails(result)}
      </article>`;
    }).join('');
    ranking.querySelectorAll('[data-person]').forEach(button => button.addEventListener('click', () => {
      expandedName = expandedName === button.dataset.person ? null : button.dataset.person;
      render();
      if (expandedName) ranking.querySelector(`[data-person="${CSS.escape(expandedName)}"]`)?.scrollIntoView({ behavior:'smooth', block:'nearest' });
    }));
  };

  select.innerHTML = players.map(player => `<option value="${esc(player.name)}">${esc(player.name)}</option>`).join('');
  select.addEventListener('change', () => { expandedName = null; render(); });
  filters.querySelectorAll('[data-phase]').forEach(button => button.addEventListener('click', () => {
    phase = button.dataset.phase;
    expandedName = null;
    filters.querySelectorAll('[data-phase]').forEach(item => item.classList.toggle('active', item === button));
    render();
  }));
  render();
})();
