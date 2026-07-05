import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const outputPath = 'data/football-data.json';
const pollingMarkerPath = 'data/.football-data-polling';
const waitingMarkerPath = 'data/.football-data-waiting';
const pagePath = 'hso.html';
const now = process.env.TEST_NOW ? Date.parse(process.env.TEST_NOW) : Date.now();
const activeWindowMs = 4 * 60 * 60 * 1000;
const preStartWindowMs = 30 * 60 * 1000;
const tournamentMonitoringStart = Date.UTC(2026, 5, 11, 0, 0);
const tournamentMonitoringEnd = Date.UTC(2026, 6, 20, 23, 59);

let previousMatches = [];
try {
  const previous = JSON.parse(await readFile(outputPath, 'utf8'));
  previousMatches = previous.matches || [];
} catch {
  // The first run may not have an existing data file.
}

const statusRank = {
  SCHEDULED: 1,
  TIMED: 1,
  POSTPONED: 1,
  SUSPENDED: 2,
  IN_PLAY: 3,
  PAUSED: 3,
  FINISHED: 4
};

function hasScore(match) {
  return ['fullTime', 'regularTime', 'halfTime', 'extraTime'].some(period =>
    Number.isInteger(match?.score?.[period]?.home)
      && Number.isInteger(match?.score?.[period]?.away)
  );
}

function betterMatch(current, candidate, options = {}) {
  if (!current) return candidate;
  const currentRank = statusRank[current.status] || 0;
  const candidateRank = statusRank[candidate.status] || 0;
  if (candidateRank > currentRank) return candidate;
  if (candidateRank < currentRank) return current;
  if (hasScore(candidate) && !hasScore(current)) return candidate;
  if (hasScore(current) && !hasScore(candidate)) return current;
  const currentUpdated = Date.parse(current.lastUpdated) || 0;
  const candidateUpdated = Date.parse(candidate.lastUpdated) || 0;
  if (options.preferFreshLive && candidateRank < statusRank.FINISHED) {
    if (currentUpdated && (!candidateUpdated || candidateUpdated < currentUpdated)) return current;
    return candidate;
  }
  return candidateUpdated >= currentUpdated ? candidate : current;
}

function historicalBestMatches() {
  const best = new Map(previousMatches.map(match => [match.id, match]));
  try {
    const revisions = execFileSync(
      'git',
      ['log', '-20', '--format=%H', '--', outputPath],
      { encoding: 'utf8' }
    ).trim().split(/\s+/).filter(Boolean);

    for (const revision of revisions) {
      try {
        const snapshot = JSON.parse(execFileSync(
          'git',
          ['show', `${revision}:${outputPath}`],
          { encoding: 'utf8' }
        ));
        for (const match of snapshot.matches || []) {
          best.set(match.id, betterMatch(best.get(match.id), match));
        }
      } catch {
        // Ignore unreadable historical snapshots.
      }
    }
  } catch {
    // Git history may be unavailable outside the repository.
  }
  return best;
}

const page = await readFile(pagePath, 'utf8');
const schedule = [...page.matchAll(/\{g:'[^']+',date:'(\d{2}\.\d{2})',time:'(\d{2}:\d{2})',home:'([^']+)',\s*away:'([^']+)'/g)]
  .map(([, date, time, home, away]) => {
    const [day, month] = date.split('.').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    return {
      date,
      time,
      home,
      away,
      kickoff: Date.UTC(2026, month - 1, day, hour - 2, minute)
    };
  });

const scheduledActiveMatches = schedule.filter(match =>
  now >= match.kickoff && now < match.kickoff + activeWindowMs
);
const nextScheduledMatch = schedule
  .filter(match => match.kickoff > now)
  .sort((a, b) => a.kickoff - b.kickoff)[0];
const nextApiMatch = previousMatches
  .map(match => ({
    kickoff: Date.parse(match.utcDate),
    home: match.homeTeam?.shortName || match.homeTeam?.name || 'unknown team',
    away: match.awayTeam?.shortName || match.awayTeam?.name || 'unknown team'
  }))
  .filter(match => Number.isFinite(match.kickoff) && match.kickoff > now)
  .sort((a, b) => a.kickoff - b.kickoff)[0];
const nextMatch = [nextScheduledMatch, nextApiMatch]
  .filter(Boolean)
  .sort((a, b) => a.kickoff - b.kickoff)[0];
const activeApiMatches = previousMatches.filter(match => {
  const kickoff = Date.parse(match.utcDate);
  return Number.isFinite(kickoff)
    && now >= kickoff
    && now < kickoff + activeWindowMs;
});
const matchInProgress = activeApiMatches.some(match => match.status !== 'FINISHED')
  || (
    scheduledActiveMatches.length > 0
    && (
    activeApiMatches.length === 0
    || activeApiMatches.some(match => match.status !== 'FINISHED')
    )
  );
const matchApproaching = nextMatch
  && nextMatch.kickoff - now <= preStartWindowMs;
const fiveMinuteCheck = Math.floor(now / 60000) % 5 === 0;
const thirtyMinuteCheck = Math.floor(now / 60000) % 30 === 0;
const backgroundMonitoring = now >= tournamentMonitoringStart
  && now <= tournamentMonitoringEnd
  && thirtyMinuteCheck;

if (!matchInProgress && (!matchApproaching || !fiveMinuteCheck) && !backgroundMonitoring) {
  await rm(pollingMarkerPath, { force: true });
  await rm(waitingMarkerPath, { force: true });
  console.log('No API request needed in this minute.');
  process.exit(0);
}

await mkdir('data', { recursive: true });
if (matchInProgress) {
  await writeFile(pollingMarkerPath, 'active\n', 'utf8');
  await rm(waitingMarkerPath, { force: true });
  console.log('Active match: checking football-data.org.');
} else if (backgroundMonitoring) {
  await rm(pollingMarkerPath, { force: true });
  await rm(waitingMarkerPath, { force: true });
  console.log('Background monitoring: checking football-data.org (30-minute interval).');
} else {
  const waitSeconds = Math.max(1, Math.ceil((nextMatch.kickoff - now) / 1000));
  await rm(pollingMarkerPath, { force: true });
  await writeFile(waitingMarkerPath, `${waitSeconds}\n`, 'utf8');
  console.log(`Next match starts in ${waitSeconds} seconds: checking pre-match status.`);
}

if (process.env.TEST_SCHEDULER_ONLY === '1') {
  console.log('Scheduler test only: API request skipped.');
  process.exit(0);
}

const token = process.env.FOOTBALL_DATA_TOKEN;
if (!token) {
  throw new Error('Missing FOOTBALL_DATA_TOKEN secret.');
}

const competitionUrl = 'https://api.football-data.org/v4/competitions/WC/matches?season=2026';
const liveUrl = 'https://api.football-data.org/v4/matches?status=LIVE';
const retryDelaysMs = [3000, 7000];
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function fetchFootballData(url, label, maxAttempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'X-Auth-Token': token,
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache'
        }
      });

      if (response.ok) {
        return await response.json();
      }

      const responseText = await response.text();
      const error = new Error(
        `football-data.org ${label} returned HTTP ${response.status}: ${responseText}`
      );

      // Authentication and other client errors require configuration changes,
      // so retrying them would only hide a permanent problem.
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw Object.assign(error, { permanent: true });
      }

      lastError = error;
    } catch (error) {
      if (error.permanent) {
        throw error;
      }
      lastError = error;
    }

    if (attempt < maxAttempts) {
      const delay = retryDelaysMs[attempt - 1];
      console.warn(`API ${label} attempt ${attempt}/${maxAttempts} failed. Retrying in ${delay / 1000} seconds.`);
      await sleep(delay);
    }
  }

  console.warn(
    `football-data.org ${label} is temporarily unavailable after ${maxAttempts} attempt(s): ${lastError?.message || lastError}`
  );
  return null;
}

function mapApiMatch(match) {
  const mapScore = period => ({
    home: match.score?.[period]?.home ?? null,
    away: match.score?.[period]?.away ?? null
  });
  return {
    id: match.id,
    utcDate: match.utcDate,
    status: match.status,
    homeTeam: {
      name: match.homeTeam?.name || null,
      shortName: match.homeTeam?.shortName || null,
      tla: match.homeTeam?.tla || null
    },
    awayTeam: {
      name: match.awayTeam?.name || null,
      shortName: match.awayTeam?.shortName || null,
      tla: match.awayTeam?.tla || null
    },
    score: {
      winner: match.score?.winner || null,
      duration: match.score?.duration || null,
      fullTime: mapScore('fullTime'),
      regularTime: mapScore('regularTime'),
      halfTime: mapScore('halfTime'),
      extraTime: mapScore('extraTime'),
      penalties: mapScore('penalties')
    },
    lastUpdated: match.lastUpdated
  };
}

const payload = await fetchFootballData(competitionUrl, 'competition');
if (!payload) {
  console.log('Keeping the last saved match data. The next workflow run will try again.');
  process.exit(0);
}
const freshMatches = (payload.matches || []).map(mapApiMatch);

if (matchInProgress || backgroundMonitoring) {
  let livePayload = null;
  try {
    livePayload = await fetchFootballData(liveUrl, 'live');
  } catch (error) {
    console.warn(`Live endpoint skipped: ${error?.message || error}`);
  }
  if (livePayload) {
    const byId = new Map(freshMatches.map(match => [match.id, match]));
    let liveOverrides = 0;
    for (const liveMatch of (livePayload.matches || []).map(mapApiMatch)) {
      const competitionMatch = byId.get(liveMatch.id);
      if (!competitionMatch) continue;
      const merged = betterMatch(competitionMatch, liveMatch, { preferFreshLive: true });
      if (JSON.stringify(merged) !== JSON.stringify(competitionMatch)) {
        liveOverrides += 1;
        byId.set(liveMatch.id, merged);
      }
    }
    if (liveOverrides > 0) {
      console.log(`Live endpoint refreshed ${liveOverrides} World Cup match(es).`);
    }
    freshMatches.splice(0, freshMatches.length, ...freshMatches.map(match => byId.get(match.id) || match));
  }
}

if (matchInProgress) {
  const activeMatches = freshMatches.filter(match => {
    const kickoff = Date.parse(match.utcDate);
    return Number.isFinite(kickoff)
      && now >= kickoff
      && now < kickoff + activeWindowMs
      && match.status !== 'FINISHED';
  });

  let exactOverrides = 0;
  for (const activeMatch of activeMatches) {
    let exactPayload = null;
    try {
      exactPayload = await fetchFootballData(
        `https://api.football-data.org/v4/matches/${activeMatch.id}`,
        `match ${activeMatch.id}`,
        1
      );
    } catch (error) {
      console.warn(`Exact match endpoint ${activeMatch.id} skipped: ${error?.message || error}`);
    }
    if (!exactPayload?.id) continue;
    const index = freshMatches.findIndex(match => match.id === activeMatch.id);
    if (index < 0) continue;
    const exactMatch = mapApiMatch(exactPayload);
    const merged = betterMatch(freshMatches[index], exactMatch, { preferFreshLive: true });
    if (JSON.stringify(merged) !== JSON.stringify(freshMatches[index])) {
      freshMatches[index] = merged;
      exactOverrides += 1;
    }
  }
  console.log(`Exact endpoint checked ${activeMatches.length} active match(es); refreshed ${exactOverrides}.`);
}

const historicalMatches = historicalBestMatches();
const matches = freshMatches.map(match => {
  return betterMatch(historicalMatches.get(match.id), match, { preferFreshLive: true });
});

const apiHasUnfinishedActiveMatch = matches.some(match => {
  const kickoff = Date.parse(match.utcDate);
  return Number.isFinite(kickoff)
    && now >= kickoff
    && now < kickoff + activeWindowMs
    && match.status !== 'FINISHED';
});

if (apiHasUnfinishedActiveMatch) {
  await writeFile(pollingMarkerPath, 'active\n', 'utf8');
} else {
  await rm(pollingMarkerPath, { force: true });
}

if (JSON.stringify(previousMatches) === JSON.stringify(matches)) {
  console.log(`No changes in ${matches.length} matches.`);
  process.exit(0);
}

await writeFile(
  outputPath,
  `${JSON.stringify({ updatedAt: new Date().toISOString(), matches }, null, 2)}\n`,
  'utf8'
);

console.log(`Saved ${matches.length} matches.`);
