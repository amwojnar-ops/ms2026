import { mkdir, readFile, writeFile } from 'node:fs/promises';

const outputPath = 'data/football-data.json';
const pagePath = 'hso-test.html';
const now = Date.now();
const activeWindowMs = 4 * 60 * 60 * 1000;

let previousMatches = [];
try {
  const previous = JSON.parse(await readFile(outputPath, 'utf8'));
  previousMatches = previous.matches || [];
} catch {
  // Pierwsze uruchomienie nie ma jeszcze pliku danych.
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
const unfinishedStartedMatch = previousMatches.some(match =>
  Date.parse(match.utcDate) <= now && match.status !== 'FINISHED'
);

if (!scheduledNow && !unfinishedStartedMatch) {
  console.log('Brak trwającego meczu. Pomijam zapytanie do API.');
  process.exit(0);
}

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
const matches = (payload.matches || []).map(match => ({
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

if (JSON.stringify(previousMatches) === JSON.stringify(matches)) {
  console.log(`Brak zmian w ${matches.length} meczach.`);
  process.exit(0);
}

await mkdir('data', { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify({ updatedAt: new Date().toISOString(), matches }, null, 2)}\n`,
  'utf8'
);

console.log(`Zapisano ${matches.length} meczów.`);
