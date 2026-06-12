import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const outputPath = 'data/football-data.json';
const pollingMarkerPath = 'data/.football-data-polling';
const waitingMarkerPath = 'data/.football-data-waiting';
const pagePath = 'hso.html';
const now = process.env.TEST_NOW ? Date.parse(process.env.TEST_NOW) : Date.now();
const activeWindowMs = 4 * 60 * 60 * 1000;
const preStartWindowMs = 35 * 60 * 1000;

let previousMatches = [];
try {
  const previous = JSON.parse(await readFile(outputPath, 'utf8'));
  previousMatches = previous.matches || [];
} catch {
  // Pierwsze uruchomienie nie ma jeszcze pliku danych.
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
  return Number.isInteger(match?.score?.fullTime?.home)
    && Number.isInteger(match?.score?.fullTime?.away);
}

function betterMatch(current, candidate) {
  if (!current) return candidate;
  const currentRank = statusRank[current.status] || 0;
  const candidateRank = statusRank[candidate.status] || 0;
  if (candidateRank > currentRank) return candidate;
  if (candidateRank < currentRank) return current;
  if (hasScore(candidate) && !hasScore(current)) return candidate;
  if (hasScore(current) && !hasScore(candidate)) return current;
  const currentUpdated = Date.parse(current.lastUpdated) || 0;
  const candidateUpdated = Date.parse(candidate.lastUpdated) || 0;
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
        // Pomijamy nieczytelny lub nieistniejący historyczny plik.
      }
    }
  } catch {
    // Poza repozytorium Git historia może być niedostępna.
  }
  return best;
}

const page = await readFile(pagePath, 'utf8');
const schedule = [...page.matchAll(/\{g:'[^']+',date:'(\d{2}\.\d{2})',time:'(\d{2}:\d{2})',home:'([^']+)',\s*away:'([^']+)'/g)]
  .map(([, date, time, home, away]) => {
    const [day, month] = date.split('.').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    return {
      date, time, home, away,
      kickoff: Date.UTC(2026, month - 1, day, hour - 2, minute)
    };
  });

const scheduledNow = schedule.some(match =>
  now >= match.kickoff && now < match.kickoff + activeWindowMs
);
const nextMatch = schedule
  .filter(match => match.kickoff > now)
  .sort((a, b) => a.kickoff - b.kickoff)[0];
const unfinishedStartedMatch = previousMatches.some(match =>
  Date.parse(match.utcDate) <= now && match.status !== 'FINISHED'
);

if (!scheduledNow && !unfinishedStartedMatch && nextMatch
    && nextMatch.kickoff - now <= preStartWindowMs) {
  const waitSeconds = Math.max(1, Math.ceil((nextMatch.kickoff - now) / 1000));
  await mkdir('data', { recursive: true });
  await writeFile(pollingMarkerPath, 'active\n', 'utf8');
  await writeFile(waitingMarkerPath, `${waitSeconds}\n`, 'utf8');
  console.log(
    `Najbliższy mecz ${nextMatch.home} - ${nextMatch.away} rozpocznie się za ${waitSeconds} s.`
  );
  process.exit(0);
}

if (!scheduledNow && !unfinishedStartedMatch) {
  await rm(pollingMarkerPath, { force: true });
  await rm(waitingMarkerPath, { force: true });
  console.log('Brak trwającego meczu. Pomijam zapytanie do API.');
  process.exit(0);
}

await rm(waitingMarkerPath, { force: true });

const token = process.env.FOOTBALL_DATA_TOKEN;
if (!token) {
  throw new Error('Brak sekretu FOOTBALL_DATA_TOKEN.');
}

const url = 'https://api.football-data.org/v4/competitions/WC/matches?season=2026';
const response = await fetch(url, {
  headers: { 'X-Auth-Token': token }
});

if (!response.ok) {
  throw new Error(`football-data.org zwróciło HTTP ${response.status}: ${await response.text()}`);
}

const payload = await response.json();
const freshMatches = (payload.matches || []).map(match => ({
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
    fullTime: {
      home: match.score?.fullTime?.home ?? null,
      away: match.score?.fullTime?.away ?? null
    }
  },
  lastUpdated: match.lastUpdated
}));

const historicalMatches = historicalBestMatches();
const matches = freshMatches.map(match => betterMatch(historicalMatches.get(match.id), match));

const apiHasUnfinishedActiveMatch = matches.some(match => {
  const kickoff = Date.parse(match.utcDate);
  return Number.isFinite(kickoff)
    && now >= kickoff
    && now < kickoff + activeWindowMs
    && match.status !== 'FINISHED';
});

await mkdir('data', { recursive: true });
if (apiHasUnfinishedActiveMatch) {
  await writeFile(pollingMarkerPath, 'active\n', 'utf8');
} else {
  await rm(pollingMarkerPath, { force: true });
}

if (JSON.stringify(previousMatches) === JSON.stringify(matches)) {
  console.log(`Brak zmian w ${matches.length} meczach.`);
  process.exit(0);
}

await writeFile(
  outputPath,
  `${JSON.stringify({ updatedAt: new Date().toISOString(), matches }, null, 2)}\n`,
  'utf8'
);

console.log(`Zapisano ${matches.length} meczów.`);
