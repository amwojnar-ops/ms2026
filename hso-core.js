const HSO_MODE = window.HSO_CONFIG?.mode === 'test' ? 'test' : 'production';
const TRANSLATIONS = {
  pl: {
    pageTitle:'Loża Ekspertów · MŚ 2026',
    introTitle:'LOŻA', introName:'EKSPERTÓW', worldCup:'MŚ 2026', skipIntro:'Pomiń intro',
    headerTitle:'LOŻA <span>EKSPERTÓW</span>',
    headerSubtitle:'Mistrzostwa Świata 2026 &nbsp;·&nbsp; Kanada · Meksyk · USA &nbsp;·&nbsp; 11 czerwca – 19 lipca',
    locked:'Typy fazy grupowej zamknięte', played:'Rozegranych', leader:'Lider', leaders:'Liderzy',
    leaderPoints:'Pkt lidera', leadersPoints:'Pkt liderów', nextMatch:'Następny mecz',
    players:'Gracze', matches:'Faza grupowa', ranking:'Ranking', knockout:'Faza pucharowa',
    knockoutTitle:'Faza pucharowa zostanie uruchomiona później', coming:'wkrótce',
    byGroups:'Wg grup', byDates:'Wg dat', groupTables:'Tabele', championPick:'Typ na mistrza',
    player:'Gracz', team:'Zespół', champion:'Mistrz', total:'Razem', date:'Data', match:'Mecz',
    result:'Wynik', predictionPoints:'Typ / pkt', group:'Grupa',
    playedShort:'M', pointsShort:'Pkt', goalsForAgainst:'Bramki',
    finished:'Zakończony', live:'Trwa', paused:'Przerwa', waiting:'Oczekuje na wynik', soon:'Wkrótce',
    predictions:'typów', playerPredictions:'Typy graczy',
    efficiency:'skuteczność', pointsPerMatch:'pkt / mecz',
    bestGroup:'najlepsza grupa', currentStreak:'aktualna seria',
    place:'miejsce', point:'pkt', points:'pkt', toLeader:'do lidera'
  },
  en: {
    pageTitle:"Experts' Lounge · World Cup 2026",
    introTitle:'EXPERTS’', introName:'LOUNGE', worldCup:'WORLD CUP 2026', skipIntro:'Skip intro',
    headerTitle:"EXPERTS' <span>LOUNGE</span>",
    headerSubtitle:'World Cup 2026 &nbsp;·&nbsp; Canada · Mexico · USA &nbsp;·&nbsp; June 11 – July 19',
    locked:'Group-stage predictions closed', played:'Played', leader:'Leader', leaders:'Leaders',
    leaderPoints:'Leader points', leadersPoints:'Leaders’ points', nextMatch:'Next match',
    players:'Players', matches:'Group stage', ranking:'Ranking', knockout:'Knockout stage',
    knockoutTitle:'The knockout stage will be available later', coming:'soon',
    byGroups:'By group', byDates:'By date', groupTables:'Tables', championPick:'World champion pick',
    player:'Player', team:'Team', champion:'Champion', total:'Total', date:'Date', match:'Match',
    result:'Result', predictionPoints:'Prediction / pts', group:'Group',
    playedShort:'P', pointsShort:'Pts', goalsForAgainst:'Goals',
    finished:'Finished', live:'Live', paused:'Half-time', waiting:'Waiting for result', soon:'Coming up',
    predictions:'predictions', playerPredictions:'Player predictions',
    efficiency:'accuracy', pointsPerMatch:'pts / match',
    bestGroup:'best group', currentStreak:'current streak',
    place:'place', point:'pt', points:'pts', toLeader:'behind leader'
  }
};
const TEAM_EN = {
  'Algieria':'Algeria','Anglia':'England','Arabia Saudyjska':'Saudi Arabia','Argentyna':'Argentina',
  'Australia':'Australia','Austria':'Austria','Belgia':'Belgium','Bośnia i Herc.':'Bosnia & Herz.',
  'Brazylia':'Brazil','Chorwacja':'Croatia','Curaçao':'Curaçao','Czechy':'Czechia',
  'DR Konga':'DR Congo','Egipt':'Egypt','Ekwador':'Ecuador','Francja':'France',
  'Ghana':'Ghana','Haiti':'Haiti','Hiszpania':'Spain','Holandia':'Netherlands',
  'Irak':'Iraq','Iran':'Iran','Japonia':'Japan','Jordania':'Jordan',
  'Kanada':'Canada','Katar':'Qatar','Kolumbia':'Colombia','Korea Płd.':'South Korea',
  'Maroko':'Morocco','Meksyk':'Mexico','Niemcy':'Germany','Norwegia':'Norway',
  'Nowa Zelandia':'New Zealand','Panama':'Panama','Paragwaj':'Paraguay','Portugalia':'Portugal',
  'Rep. Ziel. Przył.':'Cape Verde','RPA':'South Africa','Senegal':'Senegal','Szwajcaria':'Switzerland',
  'Szwecja':'Sweden','Szkocja':'Scotland','Tunezja':'Tunisia','Turcja':'Turkey',
  'Urugwaj':'Uruguay','USA':'USA','Uzbekistan':'Uzbekistan','Wybrzeże K.Sł.':'Ivory Coast'
};
const queryLanguage=new URLSearchParams(location.search).get('lang');
let savedLanguage='pl';
try{savedLanguage=localStorage.getItem('hso_lang')==='en'?'en':'pl';}catch(e){}
let LANG=queryLanguage==='en'||queryLanguage==='pl'
  ? queryLanguage
  : savedLanguage;
function tr(key){ return TRANSLATIONS[LANG][key] ?? key; }
function teamName(name){ return LANG==='en' ? (TEAM_EN[name]||name) : name; }
function pointsLabel(value){ return value===1 ? tr('point') : tr('points'); }

const INTRO_SESSION_KEY='loza_ekspertow_intro_seen';
const siteIntro=document.getElementById('siteIntro');
function closeIntro(){
  siteIntro.classList.add('hidden');
  document.body.classList.remove('intro-active');
  try{sessionStorage.setItem(INTRO_SESSION_KEY,'1');}catch(e){}
  setTimeout(()=>siteIntro.remove(),700);
}
let introSeen=false;
try{introSeen=sessionStorage.getItem(INTRO_SESSION_KEY)==='1';}catch(e){}
if(introSeen || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  siteIntro.remove();
  document.body.classList.remove('intro-active');
}else{
  document.getElementById('introSkip').addEventListener('click',closeIntro);
  setTimeout(closeIntro,2000);
}

function setText(id,key){
  const el=document.getElementById(id);
  if(el)el.textContent=tr(key);
}
function setHeaderBadge(text,state='locked'){
  const badge=document.getElementById('lockBadge');
  const badgeText=document.getElementById('lockBadgeText');
  if(!badge||!badgeText)return;
  badge.classList.remove('available','waiting');
  if(state)badge.classList.add(state);
  badgeText.textContent=text;
}
function applyLanguage(){
  document.documentElement.lang=LANG;
  document.title=tr('pageTitle');
  const intro=document.getElementById('siteIntro');
  if(intro)intro.setAttribute('aria-label',LANG==='en'?"Experts' Lounge, World Cup 2026":'Loża Ekspertów, MŚ 2026');
  setText('introTitle','introTitle'); setText('introName','introName'); setText('introYear','worldCup');
  setText('introSkip','skipIntro');
  document.getElementById('headerTitle').innerHTML=tr('headerTitle');
  document.getElementById('headerSubtitle').innerHTML=tr('headerSubtitle');
  setHeaderBadge(tr('locked'),'locked');
  setText('playedLabel','played'); setText('nextMatchLabel','nextMatch');
  setText('tabPlayersBtn','players'); setText('tabMatchesBtn','matches'); setText('tabRankingBtn','ranking');
  setText('tabKnockoutBtn','knockout');
  const backLabel=document.getElementById('mobileSectionBackLabel');
  if(backLabel)backLabel.textContent=LANG==='en'?'Back':'Wróć';
  document.getElementById('tabKnockoutBtn').title=tr('knockout');
  setText('subtab-grupy','byGroups'); setText('subtab-daty','byDates'); setText('subtab-tabele','groupTables');
  setText('pdpChampLabel','championPick'); setText('spChampLabel','championPick');
  setText('rankPlayer','player'); setText('rankChampion','champion'); setText('rankTotal','total');
  document.getElementById('rankExact').textContent=`3 ${pointsLabel(3)}`;
  document.getElementById('rankOutcome').textContent=`1 ${pointsLabel(1)}`;
  setText('spDateLabel','date'); setText('spMatchLabel','match');
  setText('spResultLabel','result'); setText('spPredictionLabel','predictionPoints');
  document.getElementById('langSwitch').textContent=LANG==='pl'?'EN':'PL';
  document.getElementById('langSwitch').title=LANG==='pl'?'English':'Polski';
}
function switchLanguage(){
  LANG=LANG==='pl'?'en':'pl';
  try{localStorage.setItem('hso_lang',LANG);}catch(e){}
  const url=new URL(location.href);
  if(LANG==='en')url.searchParams.set('lang','en'); else url.searchParams.delete('lang');
  history.replaceState(null,'',url);
  closePanel();
  closePlayerPanel();
  applyLanguage();
  renderPlayerCards();
  renderMatches();
  renderRanking();
  renderKnockout();
}
document.getElementById('langSwitch').addEventListener('click',switchLanguage);
applyLanguage();

const MATCHES=[
  // Grupa A
  {g:'A',date:'11.06',time:'21:00',home:'Meksyk',             away:'RPA',              status:'soon'},
  {g:'A',date:'12.06',time:'04:00',home:'Korea Płd.',          away:'Czechy',           status:'soon'},
  {g:'A',date:'18.06',time:'18:00',home:'Czechy',              away:'RPA',              status:'soon'},
  {g:'A',date:'19.06',time:'03:00',home:'Meksyk',              away:'Korea Płd.',       status:'soon'},
  {g:'A',date:'25.06',time:'03:00',home:'Czechy',              away:'Meksyk',           status:'soon'},
  {g:'A',date:'25.06',time:'03:00',home:'RPA',                 away:'Korea Płd.',       status:'soon'},
  // Grupa B
  {g:'B',date:'12.06',time:'21:00',home:'Kanada',              away:'Bośnia i Herc.',   status:'soon'},
  {g:'B',date:'13.06',time:'21:00',home:'Katar',               away:'Szwajcaria',       status:'soon'},
  {g:'B',date:'18.06',time:'21:00',home:'Szwajcaria',          away:'Bośnia i Herc.',   status:'soon'},
  {g:'B',date:'19.06',time:'00:00',home:'Kanada',              away:'Katar',            status:'soon'},
  {g:'B',date:'24.06',time:'21:00',home:'Szwajcaria',          away:'Kanada',           status:'soon'},
  {g:'B',date:'24.06',time:'21:00',home:'Bośnia i Herc.',      away:'Katar',            status:'soon'},
  // Grupa C
  {g:'C',date:'14.06',time:'00:00',home:'Brazylia',            away:'Maroko',           status:'soon'},
  {g:'C',date:'14.06',time:'03:00',home:'Haiti',               away:'Szkocja',          status:'soon'},
  {g:'C',date:'20.06',time:'00:00',home:'Szkocja',             away:'Maroko',           status:'soon'},
  {g:'C',date:'20.06',time:'02:30',home:'Brazylia',            away:'Haiti',            status:'soon'},
  {g:'C',date:'25.06',time:'00:00',home:'Szkocja',             away:'Brazylia',         status:'soon'},
  {g:'C',date:'25.06',time:'00:00',home:'Maroko',              away:'Haiti',            status:'soon'},
  // Grupa D
  {g:'D',date:'13.06',time:'03:00',home:'USA',                 away:'Paragwaj',         status:'soon'},
  {g:'D',date:'14.06',time:'06:00',home:'Australia',           away:'Turcja',           status:'soon'},
  {g:'D',date:'20.06',time:'05:00',home:'Turcja',              away:'Paragwaj',         status:'soon'},
  {g:'D',date:'19.06',time:'21:00',home:'USA',                 away:'Australia',        status:'soon'},
  {g:'D',date:'26.06',time:'04:00',home:'Turcja',              away:'USA',              status:'soon'},
  {g:'D',date:'26.06',time:'04:00',home:'Paragwaj',            away:'Australia',        status:'soon'},
  // Grupa E
  {g:'E',date:'14.06',time:'19:00',home:'Niemcy',              away:'Curaçao',          status:'soon'},
  {g:'E',date:'15.06',time:'01:00',home:'Wybrzeże K.Sł.',      away:'Ekwador',          status:'soon'},
  {g:'E',date:'20.06',time:'22:00',home:'Niemcy',              away:'Wybrzeże K.Sł.',   status:'soon'},
  {g:'E',date:'21.06',time:'02:00',home:'Ekwador',             away:'Curaçao',          status:'soon'},
  {g:'E',date:'25.06',time:'22:00',home:'Ekwador',             away:'Niemcy',           status:'soon'},
  {g:'E',date:'25.06',time:'22:00',home:'Curaçao',             away:'Wybrzeże K.Sł.',   status:'soon'},
  // Grupa F
  {g:'F',date:'14.06',time:'22:00',home:'Holandia',            away:'Japonia',          status:'soon'},
  {g:'F',date:'15.06',time:'04:00',home:'Szwecja',             away:'Tunezja',          status:'soon'},
  {g:'F',date:'20.06',time:'19:00',home:'Holandia',            away:'Szwecja',          status:'soon'},
  {g:'F',date:'21.06',time:'06:00',home:'Tunezja',             away:'Japonia',          status:'soon'},
  {g:'F',date:'26.06',time:'01:00',home:'Tunezja',             away:'Holandia',         status:'soon'},
  {g:'F',date:'26.06',time:'01:00',home:'Japonia',             away:'Szwecja',          status:'soon'},
  // Grupa G
  {g:'G',date:'15.06',time:'21:00',home:'Belgia',              away:'Egipt',            status:'soon'},
  {g:'G',date:'16.06',time:'03:00',home:'Iran',                away:'Nowa Zelandia',    status:'soon'},
  {g:'G',date:'21.06',time:'21:00',home:'Belgia',              away:'Iran',             status:'soon'},
  {g:'G',date:'22.06',time:'03:00',home:'Nowa Zelandia',       away:'Egipt',            status:'soon'},
  {g:'G',date:'27.06',time:'05:00',home:'Nowa Zelandia',       away:'Belgia',           status:'soon'},
  {g:'G',date:'27.06',time:'05:00',home:'Egipt',               away:'Iran',             status:'soon'},
  // Grupa H
  {g:'H',date:'15.06',time:'18:00',home:'Hiszpania',           away:'Rep. Ziel. Przył.',status:'soon'},
  {g:'H',date:'16.06',time:'00:00',home:'Arabia Saudyjska',    away:'Urugwaj',          status:'soon'},
  {g:'H',date:'21.06',time:'18:00',home:'Hiszpania',           away:'Arabia Saudyjska', status:'soon'},
  {g:'H',date:'22.06',time:'00:00',home:'Urugwaj',             away:'Rep. Ziel. Przył.',status:'soon'},
  {g:'H',date:'27.06',time:'02:00',home:'Urugwaj',             away:'Hiszpania',        status:'soon'},
  {g:'H',date:'27.06',time:'02:00',home:'Rep. Ziel. Przył.',   away:'Arabia Saudyjska', status:'soon'},
  // Grupa I
  {g:'I',date:'16.06',time:'21:00',home:'Francja',             away:'Senegal',          status:'soon'},
  {g:'I',date:'17.06',time:'00:00',home:'Irak',                away:'Norwegia',         status:'soon'},
  {g:'I',date:'22.06',time:'23:00',home:'Francja',             away:'Irak',             status:'soon'},
  {g:'I',date:'23.06',time:'02:00',home:'Norwegia',            away:'Senegal',          status:'soon'},
  {g:'I',date:'26.06',time:'21:00',home:'Norwegia',            away:'Francja',          status:'soon'},
  {g:'I',date:'26.06',time:'21:00',home:'Senegal',             away:'Irak',             status:'soon'},
  // Grupa J
  {g:'J',date:'17.06',time:'03:00',home:'Argentyna',           away:'Algieria',         status:'soon'},
  {g:'J',date:'17.06',time:'06:00',home:'Austria',             away:'Jordania',         status:'soon'},
  {g:'J',date:'22.06',time:'19:00',home:'Argentyna',           away:'Austria',          status:'soon'},
  {g:'J',date:'23.06',time:'05:00',home:'Jordania',            away:'Algieria',         status:'soon'},
  {g:'J',date:'28.06',time:'04:00',home:'Jordania',            away:'Argentyna',        status:'soon'},
  {g:'J',date:'28.06',time:'04:00',home:'Algieria',            away:'Austria',          status:'soon'},
  // Grupa K
  {g:'K',date:'17.06',time:'19:00',home:'Portugalia',          away:'DR Konga',         status:'soon'},
  {g:'K',date:'18.06',time:'04:00',home:'Uzbekistan',          away:'Kolumbia',         status:'soon'},
  {g:'K',date:'23.06',time:'19:00',home:'Portugalia',          away:'Uzbekistan',       status:'soon'},
  {g:'K',date:'24.06',time:'04:00',home:'Kolumbia',            away:'DR Konga',         status:'soon'},
  {g:'K',date:'28.06',time:'01:30',home:'Kolumbia',            away:'Portugalia',       status:'soon'},
  {g:'K',date:'28.06',time:'01:30',home:'DR Konga',            away:'Uzbekistan',       status:'soon'},
  // Grupa L
  {g:'L',date:'17.06',time:'22:00',home:'Anglia',              away:'Chorwacja',        status:'soon'},
  {g:'L',date:'18.06',time:'01:00',home:'Ghana',               away:'Panama',           status:'soon'},
  {g:'L',date:'23.06',time:'22:00',home:'Anglia',              away:'Ghana',            status:'soon'},
  {g:'L',date:'24.06',time:'01:00',home:'Panama',              away:'Chorwacja',        status:'soon'},
  {g:'L',date:'27.06',time:'23:00',home:'Panama',              away:'Anglia',           status:'soon'},
  {g:'L',date:'27.06',time:'23:00',home:'Chorwacja',           away:'Ghana',            status:'soon'},
];
// WYNIKI MECZOW - edytuj tylko te tablice.
// Po meczu zamien odpowiednie null na wynik, np. '2-1', i opublikuj plik.
const RESULTS = [
  // Grupa A
  null, // 11.06 Meksyk - RPA
  null, // 12.06 Korea Pld. - Czechy
  null, // 18.06 Czechy - RPA
  null, // 19.06 Meksyk - Korea Pld.
  null, // 25.06 Czechy - Meksyk
  null, // 25.06 RPA - Korea Pld.
  // Grupa B
  null, // 12.06 Kanada - Bosnia i Herc.
  null, // 13.06 Katar - Szwajcaria
  null, // 18.06 Szwajcaria - Bosnia i Herc.
  null, // 19.06 Kanada - Katar
  null, // 24.06 Szwajcaria - Kanada
  null, // 24.06 Bosnia i Herc. - Katar
  // Grupa C
  null, // 14.06 Brazylia - Maroko
  null, // 14.06 Haiti - Szkocja
  null, // 20.06 Szkocja - Maroko
  null, // 20.06 Brazylia - Haiti
  null, // 25.06 Szkocja - Brazylia
  null, // 25.06 Maroko - Haiti
  // Grupa D
  null, // 13.06 USA - Paragwaj
  null, // 14.06 Australia - Turcja
  null, // 20.06 Turcja - Paragwaj
  null, // 19.06 USA - Australia
  null, // 26.06 Turcja - USA
  null, // 26.06 Paragwaj - Australia
  // Grupa E
  null, // 14.06 Niemcy - Curacao
  null, // 15.06 Wybrzeze K.Sl. - Ekwador
  null, // 20.06 Niemcy - Wybrzeze K.Sl.
  null, // 21.06 Ekwador - Curacao
  null, // 25.06 Ekwador - Niemcy
  null, // 25.06 Curacao - Wybrzeze K.Sl.
  // Grupa F
  null, // 14.06 Holandia - Japonia
  null, // 15.06 Szwecja - Tunezja
  null, // 20.06 Holandia - Szwecja
  null, // 21.06 Tunezja - Japonia
  null, // 26.06 Tunezja - Holandia
  null, // 26.06 Japonia - Szwecja
  // Grupa G
  null, // 15.06 Belgia - Egipt
  null, // 16.06 Iran - Nowa Zelandia
  null, // 21.06 Belgia - Iran
  null, // 22.06 Nowa Zelandia - Egipt
  null, // 27.06 Nowa Zelandia - Belgia
  null, // 27.06 Egipt - Iran
  // Grupa H
  null, // 15.06 Hiszpania - Rep. Ziel. Przyl.
  null, // 16.06 Arabia Saudyjska - Urugwaj
  null, // 21.06 Hiszpania - Arabia Saudyjska
  null, // 22.06 Urugwaj - Rep. Ziel. Przyl.
  null, // 27.06 Urugwaj - Hiszpania
  null, // 27.06 Rep. Ziel. Przyl. - Arabia Saudyjska
  // Grupa I
  null, // 16.06 Francja - Senegal
  null, // 17.06 Irak - Norwegia
  null, // 22.06 Francja - Irak
  null, // 23.06 Norwegia - Senegal
  null, // 26.06 Norwegia - Francja
  null, // 26.06 Senegal - Irak
  // Grupa J
  null, // 17.06 Argentyna - Algieria
  null, // 17.06 Austria - Jordania
  null, // 22.06 Argentyna - Austria
  null, // 23.06 Jordania - Algieria
  null, // 28.06 Jordania - Argentyna
  null, // 28.06 Algieria - Austria
  // Grupa K
  null, // 17.06 Portugalia - DR Konga
  null, // 18.06 Uzbekistan - Kolumbia
  null, // 23.06 Portugalia - Uzbekistan
  null, // 24.06 Kolumbia - DR Konga
  null, // 28.06 Kolumbia - Portugalia
  null, // 28.06 DR Konga - Uzbekistan
  // Grupa L
  null, // 17.06 Anglia - Chorwacja
  null, // 18.06 Ghana - Panama
  null, // 22.06 Anglia - Ghana
  null, // 24.06 Panama - Chorwacja
  null, // 27.06 Panama - Anglia
  null, // 27.06 Chorwacja - Ghana
];
const results = [...RESULTS];
let API_MATCHES = [];
let API_LAST_UPDATED = null;
let API_DATA_READY = false;
let API_REFRESH_SEQUENCE = 0;
const DEMO_MODE = new URLSearchParams(location.search).get('demo');
const FINISHED_RESULTS_CACHE_KEY = 'ms2026_finished_results_v1';

function loadFinishedResultsCache(){
  if(DEMO_MODE)return {};
  try{
    const cached=JSON.parse(localStorage.getItem(FINISHED_RESULTS_CACHE_KEY));
    return cached&&typeof cached==='object'&&!Array.isArray(cached)?cached:{};
  }catch{
    return {};
  }
}

function saveFinishedResultsCache(){
  if(DEMO_MODE)return;
  try{
    localStorage.setItem(FINISHED_RESULTS_CACHE_KEY,JSON.stringify(FINISHED_RESULTS_CACHE));
  }catch{}
}

const FINISHED_RESULTS_CACHE=loadFinishedResultsCache();
Object.entries(FINISHED_RESULTS_CACHE).forEach(([idx,result])=>{
  const matchIndex=Number(idx);
  if(!RESULTS[matchIndex]&&/^\d+-\d+$/.test(result))results[matchIndex]=result;
});

const API_TEAM_ALIASES = {
  'south africa':'rpa',
  'korea republic':'korea pld',
  'south korea':'korea pld',
  'bosnia and herzegovina':'bosnia i herc',
  'ivory coast':'wybrzeze ksl',
  'cote divoire':'wybrzeze ksl',
  'cape verde':'rep ziel przyl',
  'saudi arabia':'arabia saudyjska',
  'new zealand':'nowa zelandia',
  'dr congo':'dr konga',
  'congo dr':'dr konga',
  'united states':'usa',
  'united states of america':'usa'
};

const LOCAL_TEAM_TLA = {
  'Meksyk':'MEX','RPA':'RSA','Korea Płd.':'KOR','Czechy':'CZE',
  'Kanada':'CAN','Bośnia i Herc.':'BIH','Katar':'QAT','Szwajcaria':'SUI',
  'Brazylia':'BRA','Maroko':'MAR','Haiti':'HAI','Szkocja':'SCO',
  'USA':'USA','Paragwaj':'PAR','Australia':'AUS','Turcja':'TUR',
  'Niemcy':'GER','Curaçao':'CUW','Wybrzeże K.Sł.':'CIV','Ekwador':'ECU',
  'Holandia':'NED','Japonia':'JPN','Szwecja':'SWE','Tunezja':'TUN',
  'Belgia':'BEL','Egipt':'EGY','Iran':'IRN','Nowa Zelandia':'NZL',
  'Hiszpania':'ESP','Rep. Ziel. Przył.':'CPV','Arabia Saudyjska':'KSA','Urugwaj':'URU',
  'Francja':'FRA','Senegal':'SEN','Irak':'IRQ','Norwegia':'NOR',
  'Argentyna':'ARG','Algieria':'ALG','Austria':'AUT','Jordania':'JOR',
  'Portugalia':'POR','DR Konga':'COD','Uzbekistan':'UZB','Kolumbia':'COL',
  'Anglia':'ENG','Chorwacja':'CRO','Ghana':'GHA','Panama':'PAN'
};

function normalizedTeamName(name){
  const normalized=(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  return API_TEAM_ALIASES[normalized]||normalized;
}

function apiMatchFor(m){
  const demoLive=DEMO_MODE==='live'&&m.home==='Meksyk'&&m.away==='RPA';
  const demoMulti=DEMO_MODE==='multi'&&m.date==='25.06'&&m.time==='03:00';
  const demoFinished=DEMO_MODE==='finished'&&m.home==='Meksyk'&&m.away==='RPA';
  if(demoLive||demoMulti||demoFinished){
    return {
      utcDate:matchDateTime(m).toISOString(),
      status:demoFinished?'FINISHED':'IN_PLAY',
      homeTeam:{name:m.home,tla:LOCAL_TEAM_TLA[m.home]},
      awayTeam:{name:m.away,tla:LOCAL_TEAM_TLA[m.away]},
      score:{fullTime:demoFinished?{home:2,away:1}:demoLive?{home:1,away:0}:{home:m.home==='Czechy'?2:0,away:1}}
    };
  }
  const target=matchDateTime(m).getTime();
  return API_MATCHES.find(api=>{
    const kickoff=Date.parse(api.utcDate);
    if(!Number.isFinite(kickoff)||Math.abs(kickoff-target)>30*60*1000)return false;
    const homeTla=(api.homeTeam?.tla||'').toUpperCase();
    const awayTla=(api.awayTeam?.tla||'').toUpperCase();
    if(homeTla&&awayTla){
      return homeTla===LOCAL_TEAM_TLA[m.home]&&awayTla===LOCAL_TEAM_TLA[m.away];
    }
    const home=normalizedTeamName(api.homeTeam?.name||api.homeTeam?.shortName);
    const away=normalizedTeamName(api.awayTeam?.name||api.awayTeam?.shortName);
    return home===normalizedTeamName(m.home)&&away===normalizedTeamName(m.away);
  })||null;
}

function apiResult(api){
  if(!api||api.status!=='FINISHED')return null;
  const score=api.score?.fullTime;
  return Number.isInteger(score?.home)&&Number.isInteger(score?.away)
    ? `${score.home}-${score.away}` : null;
}
function apiLiveScore(api){
  const candidates=[
    api?.score?.fullTime,
    api?.score?.regularTime,
    api?.score?.halfTime
  ];
  const score=candidates.find(s=>Number.isInteger(s?.home)&&Number.isInteger(s?.away));
  return score||{home:0,away:0};
}

function applyApiResults(){
  let cacheChanged=false;
  MATCHES.forEach((m,idx)=>{
    if(RESULTS[idx])return;
    const finishedResult=apiResult(apiMatchFor(m));
    if(finishedResult){
      results[idx]=finishedResult;
      if(!DEMO_MODE&&FINISHED_RESULTS_CACHE[idx]!==finishedResult){
        FINISHED_RESULTS_CACHE[idx]=finishedResult;
        cacheChanged=true;
      }
    }else if(FINISHED_RESULTS_CACHE[idx]){
      // Raz potwierdzony FINISHED nie może zostać cofnięty przez IN_PLAY lub TIMED.
      results[idx]=FINISHED_RESULTS_CACHE[idx];
    }
  });
  if(cacheChanged)saveFinishedResultsCache();
}

async function refreshApiData(){
  const requestId=++API_REFRESH_SEQUENCE;
  try{
    const stamp=Date.now();
    const sources=[
      `data/football-data.json?t=${stamp}`,
      `https://raw.githubusercontent.com/amwojnar-ops/ms2026/main/data/football-data.json?t=${stamp}`
    ];
    const responses=await Promise.allSettled(sources.map(async source=>{
      const response=await fetch(source,{cache:'no-store'});
      if(!response.ok)throw new Error(`${source}: HTTP ${response.status}`);
      const data=await response.json();
      if(!Array.isArray(data.matches))throw new Error(`${source}: niepełne dane`);
      return data;
    }));
    const snapshots=responses.filter(item=>item.status==='fulfilled').map(item=>item.value);
    if(!snapshots.length)throw new Error('Brak poprawnej odpowiedzi ze źródeł wyników.');
    snapshots.sort((a,b)=>{
      const finishedA=a.matches.filter(m=>m.status==='FINISHED').length;
      const finishedB=b.matches.filter(m=>m.status==='FINISHED').length;
      return finishedB-finishedA||(Date.parse(b.updatedAt)||0)-(Date.parse(a.updatedAt)||0);
    });
    const data=snapshots[0];
    if(requestId!==API_REFRESH_SEQUENCE)return true;
    const incomingFinished=data.matches.filter(m=>m.status==='FINISHED').length;
    const currentFinished=API_MATCHES.filter(m=>m.status==='FINISHED').length;
    const incomingUpdated=Date.parse(data.updatedAt)||0;
    const currentUpdated=Date.parse(API_LAST_UPDATED)||0;
    if(API_DATA_READY&&(incomingFinished<currentFinished||(
      incomingFinished===currentFinished&&incomingUpdated<currentUpdated
    )))return true;
    API_MATCHES=Array.isArray(data.matches)?data.matches:[];
    API_LAST_UPDATED=data.updatedAt||null;
    API_DATA_READY=true;
    applyApiResults();
    renderPlayerCards();
    renderMatches();
    renderRanking();
    renderKnockout();
    return true;
  }catch(error){
    console.warn('Nie udało się odczytać danych football-data.org:',error);
    return false;
  }
}
const PLAYERS=[
  {name:'Alex', champ:'Hiszpania', tips:[,'2-0','0-2','3-1','1-1','2-2','0-1','2-1','0-3','2-1','1-2','3-2','2-0','3-1','0-1','1-1','6-0','2-3','2-1','1-1','1-2','1-1','1-2','2-0','2-1','4-0','1-2','3-0','1-1','1-3','1-1','1-1','2-1','2-1','2-2','0-3','2-2','1-2','0-0','2-1','0-0','1-3','1-2','4-0','1-2','3-1','2-0','1-2','1-3','4-0','1-3','2-0','2-1','2-2','2-1','3-0','2-0','2-1','0-1','0-2','1-3','2-0','1-2','1-0','1-0','1-1','0-0','2-1','0-0','1-0','0-1','0-1','2-0']},
  {name:'Agnieszka', champ:'Portugalia', tips:[,'3-1','0-2','0-1','2-0','1-1','2-1','2-1','2-3','1-1','1-2','0-0','0-1','3-0','0-2','1-0','4-0','1-3','1-1','1-0','1-2','2-1','1-1','1-0','0-2','2-0','1-0','1-0','2-0','1-1','0-0','2-0','2-0','2-2','0-1','0-3','0-2','3-0','0-1','3-0','1-0','0-4','1-1','3-0','1-2','2-0','0-1','1-3','0-2','3-1','0-1','2-0','1-0','1-2','1-1','3-0','2-0','1-0','1-1','0-4','0-2','3-0','1-1','5-0','1-1','1-3','0-0','1-2','0-0','2-1','0-3','0-2','2-1']},
  {name:'Aldona', champ:'Hiszpania', tips:[,'2-0','1-1','2-0','2-0','1-1','1-2','1-1','0-3','1-1','2-0','2-0','2-0','3-1','0-2','1-2','4-0','1-3','3-0','2-1','1-2','2-1','2-0','1-2','1-1','5-0','1-1','2-1','3-0','1-2','0-3','2-1','2-1','1-1','0-2','0-3','1-0','2-0','1-0','3-0','0-2','0-3','2-0','4-0','1-2','3-0','2-0','1-3','1-1','3-1','0-2','3-0','2-0','1-2','3-1','2-0','3-0','2-1','0-2','0-3','1-2','3-0','0-2','4-0','2-0','1-2','1-0','2-1','2-0','2-0','0-2','0-3','3-1']},
  {name:'Andrzej G.', champ:'Hiszpania', tips:[,'2-1','1-1','2-1','1-0','0-0','1-1','2-2','1-2','2-2','2-1','2-1','3-0','1-1','0-2','2-2','3-0','0-2','1-1','1-2','2-3','3-2','2-2','2-1','2-2','3-0','1-2','2-0','1-1','0-3','2-2','2-0','1-1','2-1','2-3','2-2','1-2','2-1','3-1','2-2','1-2','1-2','2-2','3-0','0-2','3-0','2-0','1-1','0-2','3-1','2-2','3-1','1-0','0-2','1-1','3-1','2-0','2-1','1-1','0-3','2-2','2-2','1-1','2-0','1-0','1-3','1-1','2-1','2-0','2-0','1-2','0-3','2-2']},
  {name:'Andrzej W.', champ:'Francja', tips:[,'2-0','1-1','1-0','2-1','0-0','0-2','2-1','0-3','2-0','2-0','2-1','2-1','3-2','0-2','1-2','4-0','1-3','3-0','1-2','1-2','1-1','2-0','2-1','2-0','7-0','1-1','3-1','3-1','1-4','1-3','3-1','2-2','3-1','1-2','0-4','1-1','4-1','2-0','2-0','0-1','0-3','1-1','8-0','0-2','3-0','2-0','1-3','1-2','2-0','0-3','4-0','3-1','2-2','2-0','3-1','2-0','2-1','0-2','0-5','1-1','3-0','1-3','4-1','2-0','1-2','1-1','2-1','1-0','2-0','1-3','0-4','2-1']},
  {name:'Borys', champ:'Francja', tips:[,'2-0','1-1','2-0','2-1','1-1','1-2','2-1','0-2','1-1','2-0','1-1','2-0','2-1','0-3','1-2','4-0','1-2','2-0','3-1','1-2','2-0','2-1','1-1','1-2','5-0','2-1','2-1','3-0','1-2','0-3','1-2','2-1','1-1','0-2','0-2','2-2','2-0','2-0','3-1','0-1','0-3','1-1','3-0','1-2','3-0','1-1','0-3','2-1','2-1','0-2','3-0','1-2','0-2','2-0','2-0','2-0','2-0','1-2','0-3','1-2','4-0','1-2','3-0','2-0','1-2','1-1','2-1','2-0','2-1','0-1','0-2','1-1']},
  {name:'Iwona', champ:'Brazylia', tips:[,'3-0','0-2','3-0','2-0','2-2','1-1','1-0','0-2','1-1','1-1','1-1','1-0','3-0','0-2','1-1','4-0','1-3','2-0','0-1','1-1','1-1','2-1','1-0','2-2','2-0','2-2','2-0','1-1','2-0','1-1','3-1','2-1','2-2','1-1','0-3','0-4','3-0','2-1','2-0','1-0','1-4','1-2','3-0','0-2','3-0','3-1','1-2','1-1','2-1','1-3','3-2','2-1','2-2','3-1','4-0','3-0','3-2','2-2','1-4','1-5','5-0','2-3','6-0','2-2','0-3','3-3','2-1','2-2','3-0','1-4','1-5','3-0']},
  {name:'Izunia', champ:'Hiszpania', tips:[,'2-0','1-1','2-0','2-1','1-1','1-2','2-0','1-1','2-0','2-1','1-1','0-2','2-1','0-2','1-1','3-1','0-2','2-1','2-0','1-2','1-1','2-1','1-1','2-0','3-0','1-1','3-0','2-1','1-2','0-2','2-1','1-0','1-1','1-2','0-2','1-1','2-1','2-0','2-1','0-1','0-3','1-1','3-0','1-2','3-1','2-0','1-2','1-1','2-1','0-2','3-0','1-1','0-3','2-1','3-1','1-1','2-1','0-2','0-3','1-2','2-0','0-2','3-0','2-1','1-2','1-1','2-1','2-1','2-0','0-2','0-3','2-1']},
  {name:'Jacek', champ:'Portugalia', tips:[,'3-0','1-2','2-1','2-1','0-0','0-1','2-1','1-3','1-0','1-0','1-1','2-0','2-1','0-3','1-1','3-0','1-2','2-0','2-0','1-2','1-1','2-1','2-1','1-0','4-0','2-2','3-1','3-0','0-2','0-2','3-1','2-0','2-0','0-2','0-4','2-1','2-0','1-0','3-0','0-2','0-3','3-1','5-0','0-2','3-0','3-0','1-2','1-1','3-0','0-2','3-0','2-0','1-1','3-0','2-0','3-1','2-1','0-2','0-4','0-1','2-0','1-3','4-0','2-0','1-1','1-1','2-0','2-0','2-0','0-3','0-3','3-1']},
  {name:'Justyna', champ:'Hiszpania', tips:[,'3-0','2-0','1-0','1-1','1-2','0-3','2-1','1-2','3-1','3-0','0-0','1-0','3-1','0-1','1-2','4-1','1-3','2-0','2-0','0-1','1-0','2-0','1-1','0-0','3-0','1-3','2-1','1-0','1-3','0-1','1-2','2-0','2-1','1-3','0-2','2-0','1-1','1-1','2-0','1-2','0-2','2-1','4-1','1-2','3-1','2-1','1-2','0-0','2-1','1-2','3-1','1-1','0-1','2-0','3-0','2-0','2-1','1-1','0-5','1-3','4-0','0-2','2-0','3-1','1-2','2-2','2-1','3-1','2-1','1-3','0-3','3-0']},
  {name:'Kacper', champ:'Hiszpania', tips:[,'2-0','1-1','2-0','2-1','1-1','0-2','2-0','0-2','2-0','2-1','1-1','1-1','2-1','0-3','1-1','4-0','0-2','3-0','2-1','1-2','1-1','2-1','1-1','1-1','4-0','1-1','2-1','2-0','0-2','0-2','2-1','1-0','1-1','0-2','0-2','1-1','2-1','2-0','2-1','0-2','0-3','1-1','3-0','0-2','3-0','2-0','1-1','1-1','2-1','0-2','3-0','1-1','1-2','2-0','2-1','2-0','2-0','0-2','0-3','1-2','3-0','1-2','2-0','2-1','1-1','1-1','1-1','2-1','2-0','0-2','0-3','2-1']},
  {name:'Leszek', champ:'Francja', tips:[,'2-0','0-0','1-0','2-1','1-1','0-2','0-0','0-2','1-0','1-0','2-1','1-0','2-0','0-2','1-1','4-0','0-2','2-0','1-2','0-1','1-1','1-1','0-1','2-1','6-0','0-2','4-0','2-0','1-3','1-1','3-0','2-0','3-1','1-1','0-2','1-1','2-0','1-1','3-0','0-0','0-2','1-1','5-0','1-3','4-0','2-0','1-3','0-1','3-0','0-3','4-0','3-0','1-2','2-0','4-0','3-0','2-0','0-2','0-3','1-1','4-0','0-2','3-0','1-0','0-2','0-0','2-1','2-0','1-0','0-2','0-3','2-0']},
  {name:'Lucas', champ:'Francja', tips:[,'3-1','1-2','3-1','2-1','2-2','0-2','1-2','0-2','2-2','2-2','2-1','3-0','2-1','0-2','1-3','5-0','1-3','3-0','1-1','1-2','2-2','2-1','2-1','1-1','4-0','1-2','3-1','2-0','1-2','0-1','2-1','2-1','3-2','0-2','0-1','2-1','2-0','1-0','3-0','1-2','1-3','1-1','4-0','1-2','3-1','2-0','1-2','1-2','4-1','0-2','3-1','1-2','1-2','3-1','3-1','2-0','2-0','0-2','0-4','2-1','2-1','1-2','3-0','1-1','1-3','2-2','3-2','2-1','2-1','1-3','1-3','2-1']},
  {name:'Łukasz', champ:'Francja', tips:[,'2-1','1-1','2-0','3-1','1-1','0-2','1-1','1-3','2-0','2-1','2-1','2-0','2-1','0-2','1-1','3-0','1-2','2-0','1-1','1-3','1-1','2-0','2-2','2-0','3-0','1-1','2-0','2-0','1-2','0-2','2-1','1-0','1-1','0-2','0-2','1-1','2-1','3-0','1-1','0-2','0-2','1-1','3-0','1-2','2-0','2-0','1-1','0-2','2-1','0-3','2-0','1-1','0-1','2-0','2-0','2-0','2-1','0-3','0-3','1-1','2-0','1-2','3-1','2-0','1-2','0-2','2-1','3-0','2-1','0-2','0-2','1-0']},
  {name:'Magda', champ:'Francja', tips:[,'2-0','1-2','2-0','2-1','1-2','0-2','1-2','1-3','2-1','2-0','2-1','2-1','2-1','0-2','1-2','2-0','1-2','2-0','2-0','1-2','2-1','2-1','2-1','1-1','3-0','1-2','2-0','2-0','1-2','0-2','2-2','2-0','3-2','0-2','0-3','2-1','2-0','1-0','2-0','0-2','0-3','2-1','3-0','1-2','3-1','2-0','1-2','1-2','2-1','0-2','3-0','2-2','1-2','1-1','2-0','2-0','2-2','0-0','0-2','0-2','3-0','0-2','3-0','2-0','1-2','1-1','1-2','1-1','2-0','0-3','0-3','2-1']},
  {name:'Mariusz', champ:'Francja', tips:[,'1-1','1-2','3-1','0-0','0-0','1-1','2-1','1-3','2-0','1-2','0-0','2-2','3-1','1-1','0-2','3-1','1-3','2-0','0-0','0-0','1-1','1-0','2-2','0-0','2-0','1-1','1-1','2-0','1-3','2-3','3-2','0-1','2-0','1-1','1-3','0-0','1-1','1-0','1-1','0-0','1-2','2-1','4-1','1-2','3-1','3-0','1-1','2-1','2-0','0-0','2-1','0-1','1-3','1-1','3-1','0-0','2-0','0-2','0-2','1-1','2-0','0-1','3-0','1-1','1-1','2-1','0-0','0-0','2-1','1-1','1-3','1-1']},
  {name:'Maria', champ:'Hiszpania', tips:[,'2-1','0-2','2-0','2-1','2-2','1-1','1-0','1-2','3-1','2-1','3-2','1-2','3-1','0-1','1-0','2-0','1-2','2-0','1-0','2-1','2-1','1-2','1-2','1-3','2-0','0-1','2-1','2-0','1-2','0-0','2-1','1-0','2-2','1-2','0-2','1-3','1-0','1-1','2-1','0-1','1-2','1-0','3-1','2-1','2-1','1-0','1-3','1-1','2-0','0-2','2-1','2-1','1-2','0-1','2-1','1-0','2-1','1-0','0-2','0-2','3-0','1-1','3-1','1-0','1-2','1-1','2-1','1-2','3-1','1-2','1-3','2-1']},
  {name:'Mateusz', champ:'Portugalia', tips:[,'2-0','1-1','1-1','2-1','0-1','2-1','2-1','0-2','2-1','3-1','1-2','2-1','1-3','0-4','2-2','3-0','1-2','4-0','3-0','1-1','2-1','4-1','2-2','1-2','6-0','1-0','4-1','3-1','0-3','1-3','2-2','1-1','3-0','1-3','0-2','2-1','3-1','0-0','2-0','1-2','0-4','0-1','5-0','0-1','4-1','3-0','2-3','0-2','2-0','0-3','2-0','1-2','1-2','1-1','2-0','3-0','3-1','0-3','0-4','1-2','5-0','1-3','4-0','2-1','1-3','1-1','2-2','1-2','3-0','0-2','0-3','1-1']},
  {name:'Michał', champ:'Portugalia', tips:[,'2-1','0-1','0-0','1-0','1-1','2-1','3-0','0-1','2-0','1-1','2-2','1-1','3-1','0-3','1-1','5-0','1-3','1-1','1-1','1-2','1-0','2-0','2-1','0-0','6-0','1-1','5-1','1-1','0-2','1-1','2-1','3-1','3-3','1-1','0-1','2-3','4-0','1-1','2-1','1-1','1-3','0-0','5-0','1-2','3-1','2-1','2-4','1-1','4-2','1-4','3-1','2-2','2-3','1-0','3-0','3-0','2-2','0-1','0-2','1-3','3-1','1-2','4-0','2-1','1-2','1-1','3-3','2-1','2-1','0-2','1-3','3-1']},
  {name:'Ola', champ:'Francja', tips:[,'2-1','1-1','1-0','2-0','2-2','0-0','1-0','1-3','1-1','2-0','1-1','0-2','3-0','1-2','2-2','3-1','1-1','0-0','2-0','1-1','2-0','2-1','2-2','0-0','3-0','1-2','4-1','1-0','2-2','1-1','2-1','2-0','1-1','0-1','0-2','1-2','2-0','1-1','2-1','0-0','1-3','1-1','2-0','1-2','4-1','2-0','1-2','1-1','2-1','0-2','3-0','3-1','2-2','1-0','2-0','1-0','3-1','1-1','0-2','0-1','2-0','0-0','3-1','2-1','0-2','1-1','2-1','2-2','3-0','1-3','1-2','3-0']},
  {name:'Paweł', champ:'Anglia', tips:[,'2-0','1-1','2-1','2-1','1-1','1-2','2-1','0-2','2-0','2-0','1-1','2-0','2-1','0-2','1-1','4-0','0-2','3-0','2-0','1-2','2-1','3-1','1-2','1-1','4-0','1-1','2-0','3-0','1-2','0-2','2-1','2-0','2-1','0-1','0-3','1-1','2-1','1-0','2-0','1-1','0-3','1-0','3-0','0-2','2-0','3-0','1-2','1-1','2-0','0-3','4-0','1-1','1-2','2-0','3-0','2-0','2-1','0-2','0-4','1-1','3-1','0-2','2-0','2-0','1-2','1-1','2-1','1-1','3-0','0-2','0-3','2-1']},
  {name:'Robert', champ:'Hiszpania', tips:[,'2-0','3-1','1-1','2-2','0-2','0-2','2-2','0-3','1-1','2-1','1-1','2-0','2-1','0-3','1-2','4-0','0-2','3-0','2-1','1-3','2-1','1-1','2-1','2-2','5-0','2-2','2-0','2-0','0-2','1-2','2-1','1-2','3-0','1-1','1-2','2-0','2-0','1-1','2-0','1-2','0-3','2-1','5-0','1-3','3-0','3-0','1-3','1-2','3-1','0-3','3-0','2-1','1-2','2-1','3-1','1-0','2-0','0-2','0-3','1-1','3-0','0-2','3-0','1-0','1-2','0-0','3-1','1-1','3-0','0-2','0-3','2-0']},
  {name:'Tomek', champ:'Argentyna', tips:[,'3-0','1-1','2-1','3-1','0-1','0-2','2-1','1-2','0-0','1-0','1-1','2-0','2-0','0-2','1-1','2-0','1-3','2-0','2-2','1-2','1-1','1-1','2-2','1-0','4-0','1-1','2-0','2-0','1-2','1-2','3-1','1-1','3-1','1-1','1-2','0-0','2-0','2-0','3-1','1-2','0-3','1-1','3-0','1-2','3-0','3-1','1-3','2-1','2-0','0-2','3-0','2-1','2-2','1-1','3-0','3-1','2-0','1-1','0-3','1-1','4-0','1-3','3-0','2-0','2-4','0-0','2-0','2-0','2-0','0-1','0-2','1-1']},
  {name:'Waldemar', champ:'Holandia', tips:[,'1-0','1-1','0-2','2-1','1-3','2-2','0-0','2-1','2-2','1-1','1-1','0-1','3-1','2-2','0-1','2-1','0-1','3-0','2-0','1-3','1-1','2-0','1-1','1-1','2-1','3-1','2-2','1-1','1-1','0-2','2-1','2-0','3-2','0-3','1-2','1-1','1-1','2-0','1-1','0-3','0-3','2-2','3-0','2-2','2-0','2-1','2-2','0-1','2-1','1-1','2-0','1-2','0-3','2-1','3-1','2-0','3-0','1-3','0-2','2-1','2-1','0-3','3-0','2-2','1-1','3-0','1-1','3-0','1-1','0-3','0-2','2-2']}
];

// Status typowania fazy pucharowej.
// Runda staje się aktywna automatycznie, gdy ma przynajmniej jeden mecz
// z wpisanymi obiema drużynami. Kropka oznacza komplet typów gracza.
// Gdy komplet mają wszyscy gracze, wszystkie kropki są ukrywane.
const KNOCKOUT_TIP_ROUNDS = [
  // {
  //   id: '1/16',
  //   matches: [{id:'r16-1', home:'Drużyna A', away:'Drużyna B'}],
  //   tipsByPlayer: {'Agnieszka': {'r16-1':'2-1'}}
  // }
];

function knockoutTipDotPlayers(){
  const requiredMatches = KNOCKOUT_TIP_ROUNDS.flatMap(round =>
    (round.matches || [])
      .filter(match => match.home && match.away)
      .map((match, index) => ({
        round,
        key: match.id || String(index)
      }))
  );

  if(!requiredMatches.length) return new Set();

  const completePlayers = PLAYERS.filter(player =>
    requiredMatches.every(({round, key}) => {
      const tip = round.tipsByPlayer?.[player.name]?.[key];
      return typeof tip === 'string' && tip.trim() !== '';
    })
  );

  return completePlayers.length === PLAYERS.length
    ? new Set()
    : new Set(completePlayers.map(player => player.name));
}

const PLAYER_KNOCKOUT_STAGES = [
  {ids:['1/16','r32'], pl:'1/16 finału', en:'Round of 32'},
  {ids:['1/8','r16'], pl:'1/8 finału', en:'Round of 16'},
  {ids:['1/4','qf'], pl:'Ćwierćfinały', en:'Quarter-finals'},
  {ids:['1/2','sf'], pl:'Półfinały', en:'Semi-finals'},
  {ids:['medale','third','final'], pl:'Mecze o medale', en:'Medal matches'}
];

function togglePlayerPhase(button){
  button.closest('.pdp-phase')?.classList.toggle('open');
}

function knockoutRoundComplete(round){
  const matches=(round?.matches||[]).filter(match=>match.home&&match.away);
  return matches.length>0&&PLAYERS.every(player=>matches.every((match,index)=>{
    const key=match.id||String(index);
    const tip=round.tipsByPlayer?.[player.name]?.[key];
    return typeof tip==='string'&&tip.trim()!=='';
  }));
}

function playerKnockoutStageData(stage,p){
  const rounds=KNOCKOUT_TIP_ROUNDS.filter(round=>stage.ids.includes(round.id));
  const matches=rounds.flatMap(round=>(round.matches||[])
    .filter(match=>match.home&&match.away)
    .map((match,index)=>({round,match,key:match.id||String(index)})));
  const visible=rounds.length>0&&rounds.every(knockoutRoundComplete);
  const tips=matches.filter(({round,key})=>{
    const tip=round.tipsByPlayer?.[p.name]?.[key];
    return typeof tip==='string'&&tip.trim()!=='';
  }).length;
  return {rounds,matches,visible,tips};
}

function playerSubsectionLabel(title){
  return `<div class="pdp-subsection-lbl">
    <span class="pdp-subsection-lbl-title">${title}</span>
    <span class="pdp-subsection-col">${LANG==='en'?'Result':'Wynik'}</span>
    <span class="pdp-subsection-col">${LANG==='en'?'Tip':'Typ'}</span>
  </div>`;
}

function playerGroupPhaseRows(p){
  const all=MATCHES.map((m,idx)=>({...m,idx})).sort((a,b)=>matchDateTime(a)-matchDateTime(b));
  const played=all.filter(m=>Boolean(results[m.idx]));
  const upcoming=all.filter(m=>!results[m.idx]);
  const rows=matches=>matches.length?matches.map(m=>{
      const tip=p.tips[m.idx+1]||'—';
      const result=results[m.idx]||'—';
      const score=results[m.idx]?sc(tip,results[m.idx]):null;
      const resultClass=score===3?'r3':score===1?'r1':score===0?'r0':'';
      return `
      <div class="pdp-match">
        <span class="pdp-date">${m.date}</span>
        <span class="pdp-teams">${flag(m.home)} ${disp(m.home)} – ${disp(m.away)} ${flag(m.away)}</span>
        <span class="pdp-result ${resultClass}">${result}</span>
        <span class="pdp-tip">${tip}</span>
      </div>`}).join(''):`<div class="pdp-empty">${LANG==='en'?'No matches.':'Brak meczów.'}</div>`;
  return `${playerSubsectionLabel(LANG==='en'?'Played':'Rozegrane')}
    ${rows(played)}
    ${playerSubsectionLabel(LANG==='en'?'Upcoming':'Nadchodzące')}
    ${rows(upcoming)}`;
}

function playerKnockoutPhaseRows(p){
  const content=PLAYER_KNOCKOUT_STAGES.map(stage=>{
    const data=playerKnockoutStageData(stage,p);
    const name=LANG==='en'?stage.en:stage.pl;
    if(!data.matches.length){
      return `<div class="pdp-round"><span>${name}</span><span class="pdp-round-status">${LANG==='en'?'waiting':'oczekiwanie'}</span></div>`;
    }
    if(!data.visible){
      return `<div class="pdp-round"><span>${name}</span><span class="pdp-round-status">${data.tips}/${data.matches.length} · ${LANG==='en'?'predictions hidden':'typy ukryte'}</span></div>`;
    }
    return `<div class="pdp-section-lbl">${name}</div>${data.matches.map(({round,match,key})=>`
      <div class="pdp-match">
        <span class="pdp-date">${match.date||'—'}</span>
        <span class="pdp-teams">${match.home} – ${match.away}</span>
        <span class="pdp-result">—</span>
        <span class="pdp-tip">${round.tipsByPlayer?.[p.name]?.[key]||'—'}</span>
      </div>`).join('')}`;
  }).join('');
  return `${playerSubsectionLabel(LANG==='en'?'Played':'Rozegrane')}
    <div class="pdp-empty">${LANG==='en'?'No completed knockout matches.':'Brak rozegranych meczów pucharowych.'}</div>
    ${playerSubsectionLabel(LANG==='en'?'Upcoming':'Nadchodzące')}${content}`;
}

function buildPlayerPhases(p){
  return `<section class="pdp-phase open">
      <button class="pdp-phase-toggle" type="button" onclick="togglePlayerPhase(this)">
        <span class="pdp-phase-title">${LANG==='en'?'Group stage':'Faza grupowa'}</span>
        <span class="pdp-phase-summary">72 ${LANG==='en'?'predictions':'typy'}</span>
        <span class="pdp-phase-chevron">⌄</span>
      </button>
      <div class="pdp-phase-body">${playerGroupPhaseRows(p)}</div>
    </section>
    <section class="pdp-phase">
      <button class="pdp-phase-toggle" type="button" onclick="togglePlayerPhase(this)">
        <span class="pdp-phase-title">${LANG==='en'?'Knockout stage':'Faza pucharowa'}</span>
        <span class="pdp-phase-summary">${LANG==='en'?'rounds':'rundy'}</span>
        <span class="pdp-phase-chevron">⌄</span>
      </button>
      <div class="pdp-phase-body">${playerKnockoutPhaseRows(p)}</div>
    </section>`;
}

const ISO = {
  'Algieria':'dz','Anglia':'gb-eng','Arabia Saudyjska':'sa','Argentyna':'ar',
  'Australia':'au','Austria':'at','Belgia':'be','Bośnia i Herc.':'ba',
  'Brazylia':'br','Chorwacja':'hr','Curaçao':'cw','Czechy':'cz',
  'DR Konga':'cd','Egipt':'eg','Ekwador':'ec','Francja':'fr',
  'Ghana':'gh','Haiti':'ht','Hiszpania':'es','Holandia':'nl',
  'Irak':'iq','Iran':'ir','Japonia':'jp','Jordania':'jo',
  'Kanada':'ca','Katar':'qa','Kolumbia':'co','Korea Płd.':'kr',
  'Maroko':'ma','Meksyk':'mx','Niemcy':'de','Norwegia':'no',
  'Nowa Zelandia':'nz','Panama':'pa','Paragwaj':'py','Portugalia':'pt',
  'Rep. Ziel. Przył.':'cv','RPA':'za','Senegal':'sn','Szwajcaria':'ch',
  'Szwecja':'se','Szkocja':'gb-sct','Tunezja':'tn','Turcja':'tr',
  'Urugwaj':'uy','USA':'us','Uzbekistan':'uz','Wybrzeże K.Sł.':'ci',
};
const SHORT = {
  'Hiszpania':        'ESP',
  'Holandia':         'NED',
  'Bośnia i Herc.':  'BIH',
  'Wybrzeże K.Sł.':  'WKS',
  'Rep. Ziel. Przył.':'RZP',
};
const MATCH_SHORT = {
  'Bośnia i Herc.':  'BIH',
  'Wybrzeże K.Sł.':  'WKS',
  'Rep. Ziel. Przył.':'RZP',
};
function flag(t){
  const code=ISO[t];
  if(!code)return '';
  return `<img src="img/flags/${code}.png" width="16" height="12" alt="${teamName(t)}" style="vertical-align:middle;border-radius:2px;margin:0 2px">`;
}
function disp(t){ return LANG==='en' ? teamName(t) : (MATCH_SHORT[t]||t); }
function teamHTML(t, side='home'){
  const f=flag(t), d=disp(t);
  return side==='home'
    ? `${f} ${d}`
    : `${d} ${f}`;
}

function sc(t,r){
  if(!r||!t)return null;if(t===r)return 3;
  const[th,ta]=t.split('-').map(Number),[rh,ra]=r.split('-').map(Number);
  if(isNaN(th)||isNaN(rh))return null;
  const s=x=>x>0?1:x<0?-1:0;return s(th-ta)===s(rh-ra)?1:0;
}
function calcAll(resultSet=results){
  return PLAYERS.map(p=>{
    let pts=0,ex=0,en=0;
    resultSet.forEach((r,i)=>{const s=sc(p.tips[i+1],r);if(s===3){pts+=3;ex++;}else if(s===1){pts+=1;en++;}});
    return{...p,pts,ex,en};
  }).sort((a,b)=>{
    if(b.pts!==a.pts) return b.pts-a.pts;           // 1. punkty
    if(b.ex!==a.ex)  return b.ex-a.ex;              // 2. dokładne wyniki (3 pkt)
    return a.name.localeCompare(b.name,'pl');         // 3. alfabetycznie
  });
}
function assignPositions(ranked){
  ranked.forEach((p,i)=>{
    if(i===0) p._pos=1;
    else {
      const prev=ranked[i-1];
      p._pos=(p.pts===prev.pts && p.ex===prev.ex) ? prev._pos : i+1;
    }
  });
  return ranked;
}
function latestCompletedIndex(){
  let latest=-1,latestTime=-Infinity;
  results.forEach((r,i)=>{
    if(!r)return;
    const time=matchDateTime(MATCHES[i]).getTime();
    if(time>latestTime){latestTime=time;latest=i;}
  });
  return latest;
}
function rankingMovement(){
  const latest=latestCompletedIndex();
  if(latest<0)return {};
  const previousResults=results.map((r,i)=>i===latest?null:r);
  const previous=assignPositions(calcAll(previousResults));
  return Object.fromEntries(previous.map(p=>[p.name,p._pos]));
}
function playerStats(p){
  const playedIndexes=results.map((r,i)=>r?i:-1).filter(i=>i>=0)
    .sort((a,b)=>matchDateTime(MATCHES[a])-matchDateTime(MATCHES[b]));
  let scored=0,pts=0,streak=0,bestStreak=0;
  const groupPts={};
  playedIndexes.forEach(i=>{
    const value=sc(p.tips[i+1],results[i])??0;
    pts+=value;
    if(value>0){scored++;streak+=value;bestStreak=Math.max(bestStreak,streak);}
    else streak=0;
    groupPts[MATCHES[i].g]=(groupPts[MATCHES[i].g]||0)+value;
  });
  const bestGroup=Object.entries(groupPts).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0];
  return {
    efficiency:playedIndexes.length?Math.round(scored/playedIndexes.length*100):0,
    average:playedIndexes.length?(pts/playedIndexes.length).toFixed(2).replace('.',LANG==='pl'?',':'.'):(LANG==='pl'?'0,00':'0.00'),
    bestGroup:bestGroup&&bestGroup[1]>0?`${tr('group')} ${bestGroup[0]}`:'—',
    streak,
    bestStreak
  };
}
function breakdown(idx){
  const r=results[idx];if(!r)return null;
  const g={3:[],1:[],0:[]};
  PLAYERS.forEach(p=>{const s=sc(p.tips[idx+1],r);g[s===3?3:s===1?1:0].push({name:p.name,tip:p.tips[idx+1]||'—'});});
  [3,1,0].forEach(k=>g[k].sort((a,b)=>a.name.localeCompare(b.name,'pl')));
  return g;
}
let _rotateTimer = null;
let _rotateIdx   = 0;
let _countdownTimer = null;
let _countdownMatch = null;

// Parsuje datę meczu (DD.MM, HH:MM) do obiektu Date w CEST (UTC+2)
function matchDateTime(m){
  if(m.utcDate)return new Date(m.utcDate);
  const [d, mo] = m.date.split('.').map(Number);
  const [h, mi] = m.time.split(':').map(Number);
  // CEST = UTC+2 → odejmujemy 2h żeby dostać UTC
  return new Date(Date.UTC(2026, mo-1, d, h-2, mi, 0));
}
function matchStatus(m,idx){
  if(results[idx])return 'done';
  if(DEMO_MODE==='live'&&m.home==='Meksyk'&&m.away==='RPA')return 'live';
  if(DEMO_MODE==='multi'&&m.date==='25.06'&&m.time==='03:00')return 'live';
  const api=apiMatchFor(m);
  if(api?.status==='FINISHED')return 'done';
  if(api?.status==='PAUSED')return 'paused';
  if(['IN_PLAY','LIVE'].includes(api?.status))return 'live';
  const diff=Date.now()-matchDateTime(m).getTime();
  if(diff<0)return 'soon';
  if(!API_DATA_READY)return 'waiting';
  // Awaryjnie uznajemy mecz za trwający tylko przez cztery godziny od rozpoczęcia.
  // Zapobiega to powrotowi zakończonych spotkań do rotacji przy opóźnieniu API.
  if(diff<=4*60*60*1000)return 'live';
  return 'waiting';
}

// Formatuje pozostały czas do meczu
function formatCountdown(ms){
  if(ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const days  = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins  = Math.floor((totalSec % 3600) / 60);
  const secs  = totalSec % 60;
  const pad   = n => String(n).padStart(2,'0');
  if(days > 0)
    return `<span style="color:var(--gold)">${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s</span>`;
  if(hours > 0)
    return `<span style="color:var(--amber)">${pad(hours)}h ${pad(mins)}m ${pad(secs)}s</span>`;
  return `<span style="color:var(--green)">${pad(mins)}m ${pad(secs)}s</span>`;
}

function nextMatchHTML(m){
  const status=matchStatus(m,m.idx);
  const api=apiMatchFor(m);
  if(['live','paused'].includes(status)){
    const score=apiLiveScore(api);
    const homeScore=score.home;
    const awayScore=score.away;
    return `<span class="live-summary">
      <span class="live-summary-status"><span class="dot dot-live"></span>${tr(status)}</span>
      <span class="live-summary-team">
        <span class="live-summary-name">${flag(m.home)} ${disp(m.home)}</span>
        <span class="live-summary-score">${homeScore}</span>
      </span>
      <span class="live-summary-team">
        <span class="live-summary-name">${flag(m.away)} ${disp(m.away)}</span>
        <span class="live-summary-score">${awayScore}</span>
      </span>
    </span>`;
  }
  const dt = matchDateTime(m);
  const diff = dt - Date.now();
  const countdown = diff > 0 ? formatCountdown(diff) : null;
  return `<span style="display:block;font-size:13px;font-weight:500;color:#fff;line-height:1.3">${m.date} · ${m.time}</span>`
       + `<span style="display:block;font-size:12px;color:var(--muted);margin-top:2px;line-height:1.3">${flag(m.home)} ${disp(m.home)} – ${disp(m.away)} ${flag(m.away)}</span>`
       + (countdown ? `<span id="countdown-tick" style="display:block;font-size:11px;font-weight:500;margin-top:4px;font-family:'Barlow Condensed',sans-serif;letter-spacing:.5px">⏱ ${countdown}</span>` : '');
}

function knockoutSummaryStatus(match){
  if(match?.status==='FINISHED')return 'done';
  if(match?.status==='PAUSED')return 'paused';
  if(['IN_PLAY','LIVE'].includes(match?.status))return 'live';
  const diff=Date.now()-Date.parse(match?.utcDate);
  if(diff<0)return 'soon';
  return diff<=4*60*60*1000?'live':'waiting';
}
function knockoutSummaryTeam(team){
  const name=knockoutTeamName(team);
  const code=KNOCKOUT_FLAG_BY_TLA[team?.tla]||ISO[name];
  const image=code?`<img src="img/flags/${code}.png" width="16" height="12" alt="${name}" style="vertical-align:middle;border-radius:2px;margin:0 2px">`:'';
  return {name,image};
}
function nextKnockoutMatchHTML(match){
  const status=knockoutSummaryStatus(match);
  const home=knockoutSummaryTeam(match.homeTeam);
  const away=knockoutSummaryTeam(match.awayTeam);
  if(['live','paused'].includes(status)){
    const score=apiLiveScore(match);
    return `<span class="live-summary">
      <span class="live-summary-status"><span class="dot dot-live"></span>${tr(status)}</span>
      <span class="live-summary-team"><span class="live-summary-name">${home.image} ${home.name}</span><span class="live-summary-score">${score.home}</span></span>
      <span class="live-summary-team"><span class="live-summary-name">${away.image} ${away.name}</span><span class="live-summary-score">${score.away}</span></span>
    </span>`;
  }
  const dt=new Date(match.utcDate);
  const date=new Intl.DateTimeFormat('pl-PL',{timeZone:'Europe/Warsaw',day:'2-digit',month:'2-digit'}).format(dt);
  const time=new Intl.DateTimeFormat('pl-PL',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit'}).format(dt);
  const countdown=formatCountdown(dt-Date.now());
  return `<span style="display:block;font-size:13px;font-weight:500;color:#fff;line-height:1.3">${date} · ${time}</span>`
    + `<span style="display:block;font-size:12px;color:var(--muted);margin-top:2px;line-height:1.3">${home.image} ${home.name} – ${away.name} ${away.image}</span>`
    + (countdown?`<span id="countdown-tick" style="display:block;font-size:11px;font-weight:500;margin-top:4px;font-family:'Barlow Condensed',sans-serif;letter-spacing:.5px">⏱ ${countdown}</span>`:'');
}
function nextKnockoutMatch(){
  const matches=knockoutMatches().slice(0,16)
    .filter(match=>hasKnockoutTeam(match.homeTeam)&&hasKnockoutTeam(match.awayTeam));
  const live=matches.find(match=>['live','paused'].includes(knockoutSummaryStatus(match)));
  if(live){
    document.getElementById('nextMatchLabel').textContent=LANG==='pl'?'Mecz trwa':'Match live';
    stopRotation();stopCountdown();_countdownMatch=null;
    return nextKnockoutMatchHTML(live);
  }
  const upcoming=matches.filter(match=>knockoutSummaryStatus(match)==='soon')
    .sort((a,b)=>Date.parse(a.utcDate)-Date.parse(b.utcDate))[0];
  if(!upcoming){stopRotation();stopCountdown();_countdownMatch=null;return '—';}
  document.getElementById('nextMatchLabel').textContent=tr('nextMatch');
  stopRotation();_countdownMatch=upcoming;startCountdown();
  return nextKnockoutMatchHTML(upcoming);
}

function tickCountdown(){
  const el = document.getElementById('countdown-tick');
  if(!el || !_countdownMatch) return;
  const dt = matchDateTime(_countdownMatch);
  const diff = dt - Date.now();
  const countdown = diff > 0 ? formatCountdown(diff) : null;
  if(countdown) el.innerHTML = `⏱ ${countdown}`;
  else el.remove();
}

function nextMatch(){
  // Znajdź "następne" mecze — live lub najbliższe soon
  const indexed=MATCHES.map((m,idx)=>({...m,idx,status:matchStatus(m,idx)}));
  const live = indexed.filter(m=>['live','paused'].includes(m.status));
  if(live.length){
    document.getElementById('nextMatchLabel').textContent=live.length>1
      ? (LANG==='pl'?'Mecze trwają':'Matches live')
      : (LANG==='pl'?'Mecz trwa':'Match live');
    startRotation(live);
    _countdownMatch = null;
    stopCountdown();
    return nextMatchHTML(live[0]);
  }
  document.getElementById('nextMatchLabel').textContent=tr('nextMatch');
  const soon = indexed.filter(m=>m.status==='soon').sort((a,b)=>matchDateTime(a)-matchDateTime(b));
  if(!soon.length)return nextKnockoutMatch();
  // Grupuj po dacie+godzinie — weź pierwsze (najwcześniejsze)
  const firstTime = soon[0].date + soon[0].time;
  const group = soon.filter(m=> m.date+m.time === firstTime);
  startRotation(group);
  _countdownMatch = group[0];
  startCountdown();
  return nextMatchHTML(group[0]);
}

function startRotation(group){
  stopRotation();
  if(group.length <= 1) return;
  _rotateIdx = 0;
  _rotateTimer = setInterval(()=>{
    _rotateIdx = (_rotateIdx + 1) % group.length;
    const el = document.getElementById('s-next');
    if(el){
      el.style.opacity='0';
      setTimeout(()=>{
        el.innerHTML = nextMatchHTML(group[_rotateIdx]);
        el.style.opacity='1';
      }, 200);
    }
  }, 3000);
}

function stopRotation(){
  if(_rotateTimer){ clearInterval(_rotateTimer); _rotateTimer=null; }
}

function startCountdown(){
  stopCountdown();
  _countdownTimer = setInterval(tickCountdown, 1000);
}

function stopCountdown(){
  if(_countdownTimer){ clearInterval(_countdownTimer); _countdownTimer=null; }
}
function isMobile(){return window.innerWidth<=540;}

let activePlayer=null;

function rankingStageRows(p){
  let h='';
  results.forEach((r,i)=>{
    if(!r)return;
    const m=MATCHES[i],t=p.tips[i+1]||'—',s=sc(t,r);
    const cls=s===3?'sp-p3':s===1?'sp-p1':s===0?'sp-p0':'sp-pq';
    const lbl=s===3?`3 ${pointsLabel(3)}`:s===1?`1 ${pointsLabel(1)}`:s===0?`0 ${pointsLabel(0)}`:'?';
    h+=`<div class="sp-match">
      <span class="sp-date">${m.date}</span>
      <span class="sp-teams">${flag(m.home)} ${disp(m.home)}–${disp(m.away)} ${flag(m.away)}</span>
      <span class="sp-res">${r}</span>
      <span class="${cls}">${t} / ${lbl}</span>
    </div>`;
  });
  return h;
}
function playerOverview(p){
  const played=results.filter(Boolean).length;
  const average=played ? (p.pts/played).toFixed(2).replace('.',LANG==='pl'?',':'.') : '0';
  return `<div class="sp-overview-item"><span>${LANG==='en'?'played':'rozegrane'}</span><strong>${played}</strong></div>
    <div class="sp-overview-item"><span>${LANG==='en'?'points':'punkty'}</span><strong>${p.pts}</strong></div>
    <div class="sp-overview-item"><span>${LANG==='en'?'average':'średnia'}</span><strong>${average}</strong></div>`;
}
function toggleRankingStage(button){
  button.closest('.sp-stage')?.classList.toggle('open');
}
function rankingCompletedItems(p){
  return results.map((r,i)=>{
    if(!r)return null;
    const m=MATCHES[i], tip=p.tips[i+1]||'—', pts=sc(tip,r);
    return {m,idx:i,result:r,tip,pts};
  }).filter(Boolean).sort((a,b)=>matchDateTime(a.m)-matchDateTime(b.m));
}

function rankingHistoryRows(items){
  return items.map(({m,result,tip,pts})=>{
    const cls=pts===3?'sp-p3':pts===1?'sp-p1':pts===0?'sp-p0':'sp-pq';
    const lbl=pts===3?`3 ${pointsLabel(3)}`:pts===1?`1 ${pointsLabel(1)}`:pts===0?`0 ${pointsLabel(0)}`:'?';
    return `<div class="sp-match">
      <span class="sp-date">${m.date}</span>
      <span class="sp-teams">${flag(m.home)} ${disp(m.home)}–${disp(m.away)} ${flag(m.away)}</span>
      <span class="sp-res">${result}</span>
      <span class="${cls}">${tip} / ${lbl}</span>
    </div>`;
  }).join('');
}

function buildSpRows(p){
  const items=rankingCompletedItems(p);
  const empty=LANG==='en'?'No completed matches yet.':'Brak rozegranych meczów.';
  return `<div class="sp-hdr"><span>${tr('date')}</span><span>${tr('match')}</span><span style="text-align:center">${tr('result')}</span><span style="text-align:center">${tr('predictionPoints')}</span></div>
    ${rankingHistoryRows(items)||`<div class="pdp-empty">${empty}</div>`}`;
}
function buildExpRows(p){
  return buildSpRows(p);
}
function openPanel(name,ranked){
  const p=ranked.find(x=>x.name===name);
  activePlayer=name;
  if(isMobile()){
    document.querySelectorAll('.expand-tr.open').forEach(r=>r.classList.remove('open'));
    const exp=document.getElementById('exp-'+name);
    if(exp){
      exp.classList.add('open');
      document.getElementById('exp-in-'+name).innerHTML=
        `<div class="exp-champ-line">${tr('champion')}: <strong>${p.champ?teamName(p.champ):'—'}</strong> &nbsp;·&nbsp; ${p.pts} ${pointsLabel(p.pts)} (${p.ex}×3 + ${p.en}×1)</div>`
        +buildExpRows(p);
    }
  } else {
    document.getElementById('spName').textContent=name;
    document.getElementById('spSub').textContent=`${p.pts} ${pointsLabel(p.pts)} · ${p.ex}× 3 ${pointsLabel(3)} + ${p.en}× 1 ${pointsLabel(1)}`;
    document.getElementById('spChamp').textContent=p.champ?teamName(p.champ):'—';
    document.getElementById('spOverview').innerHTML=playerOverview(p);
    document.getElementById('spMatches').innerHTML=buildSpRows(p);
    document.getElementById('sidePanel').classList.add('open');
    document.getElementById('rankingWrap').classList.add('panel-open');
  }
  document.querySelectorAll('#rankingBody tr.row').forEach(tr=>
    tr.classList.toggle('hi',tr.dataset.name===name));
}
function closePanel(){
  activePlayer=null;
  document.getElementById('sidePanel').classList.remove('open');
  document.getElementById('rankingWrap').classList.remove('panel-open');
  document.querySelectorAll('.expand-tr.open').forEach(r=>r.classList.remove('open'));
  document.querySelectorAll('#rankingBody tr').forEach(tr=>tr.classList.remove('hi'));
}

function renderRanking(){
  const ranked=assignPositions(calcAll());
  const previousPositions=rankingMovement();
  const played=results.filter(Boolean).length;
  const leaderPts=ranked[0]?.pts;
  const leaders=played>0 ? ranked.filter(p=>p._pos===1) : [];
  const manyLeaders=leaders.length>1;
  const leaderNames=leaders.map(p=>p.name).join(', ');
  document.getElementById('s-played').textContent=`${played} / 72`;
  document.getElementById('s-leader-label').textContent=manyLeaders?tr('leaders'):tr('leader');
  document.getElementById('s-leadpts-label').textContent=manyLeaders?tr('leadersPoints'):tr('leaderPoints');
  const leaderEl=document.getElementById('s-leader');
  leaderEl.textContent=leaderNames||'—';
  leaderEl.classList.toggle('leaders',manyLeaders);
  document.getElementById('s-leadpts').textContent=played>0?leaderPts:'—';
  document.getElementById('s-next').innerHTML=nextMatch();

  const tbody=document.getElementById('rankingBody');tbody.innerHTML='';
  ranked.forEach((p,i)=>{
    const pos=p._pos;
    const pc=pos===1?'pos-1':pos===2?'pos-2':pos===3?'pos-3':'pos-n';
    const posLabel=String(pos);
    const previous=previousPositions[p.name];
    const movement=previous==null?0:previous-pos;
    const chg=movement>0?`<span class="up">▲${movement}</span>`:movement<0?`<span class="dn">▼${Math.abs(movement)}</span>`:`<span class="eq">—</span>`;
    const tr=document.createElement('tr');tr.className='row';tr.dataset.name=p.name;
    if(p.name===activePlayer)tr.classList.add('hi');
    tr.innerHTML=`<td class="pos ${pc}">${posLabel}</td>
      <td class="p-name">${p.name}</td>
      <td class="p-num">${p.ex}</td>
      <td class="p-num">${p.en}</td>
      <td class="p-num" style="font-size:11px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.champ?teamName(p.champ):'—'}</td>
      <td class="p-pts">${p.pts}</td>
      <td class="p-chg">${chg}</td>`;
    tr.onclick=()=>activePlayer===p.name?closePanel():openPanel(p.name,ranked);
    tbody.appendChild(tr);
    const expTr=document.createElement('tr');expTr.className='expand-tr';expTr.id='exp-'+p.name;
    expTr.innerHTML=`<td colspan="7"><div class="expand-inner" id="exp-in-${p.name}"></div></td>`;
    tbody.appendChild(expTr);
  });
  if(activePlayer){
    if(ranked.some(p=>p.name===activePlayer)){
      openPanel(activePlayer,ranked);
    }else{
      closePanel();
    }
  }
}

let _matchView = 'skrot';
let expandedMatchIdx = null;

function switchMatchView(view, el){
  _matchView = view;
  document.querySelectorAll('.subtab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  renderMatches();
  if(view==='daty')scrollToRelevantMatch();
  requestAnimationFrame(updateMobileSectionBack);
}

function updateMobileSectionBack(){
  const button=document.getElementById('mobileSectionBack');
  const matchesTab=document.getElementById('tab-mecze');
  const playersTab=document.getElementById('tab-gracze');
  const rankingTab=document.getElementById('tab-ranking');
  const matchesVisible=matchesTab&&matchesTab.style.display!=='none';
  const playersVisible=playersTab&&playersTab.style.display!=='none';
  const rankingVisible=rankingTab&&rankingTab.style.display!=='none';
  const longMatchView=['daty','grupy','tabele','zakonczone','nadchodzace'].includes(_matchView);
  const anchor=matchesVisible&&longMatchView
    ? matchesTab.querySelector('.subtabs')
    : playersVisible
      ? playersTab
      : rankingVisible
        ? rankingTab
        : null;
  const pastAnchor=anchor&&(window.scrollY>anchor.getBoundingClientRect().top+window.scrollY+260);
  button?.classList.toggle('visible',Boolean(anchor&&pastAnchor));
}

function backToPageTop(){
  window.scrollTo({top:0,behavior:'smooth'});
}

window.addEventListener('scroll',updateMobileSectionBack,{passive:true});
window.addEventListener('resize',updateMobileSectionBack);

function setMatchSubtabState(){
  document.querySelectorAll('.subtab').forEach(t=>t.classList.remove('active'));
  const ids={skrot:'subtab-skrot',daty:'subtab-daty',grupy:'subtab-grupy',tabele:'subtab-tabele',zakonczone:'subtab-zakonczone',nadchodzace:'subtab-nadchodzace'};
  const active=document.getElementById(ids[_matchView]||'subtab-skrot');
  if(active)active.classList.add('active');
}

function relevantMatchIndex(){
  const ordered=MATCHES.map((m,idx)=>({...m,idx}))
    .sort((a,b)=>matchDateTime(a)-matchDateTime(b));
  const active=ordered.find(m=>['live','paused','waiting'].includes(matchStatus(m,m.idx)));
  if(active)return active.idx;
  const next=ordered.find(m=>matchStatus(m,m.idx)!=='done');
  return next?next.idx:null;
}

function scrollToRelevantMatch(){
  if(_matchView!=='daty')return;
  const tab=document.getElementById('tab-mecze');
  if(!tab||tab.style.display==='none')return;
  const idx=relevantMatchIndex();
  if(idx==null)return;
  requestAnimationFrame(()=>{
    const tile=document.querySelector(`[data-match-idx="${idx}"]`);
    if(tile)tile.scrollIntoView({behavior:'smooth',block:'center'});
  });
}

function buildTile(m, gcVar){
  const r=results[m.idx];
  const status=matchStatus(m,m.idx);
  const tile=document.createElement('div');
  tile.className=`tile ${status}`;
  tile.dataset.matchIdx=m.idx;
  tile.style.setProperty('--g-color',`var(${gcVar||'--muted'})`);
  let sHTML='';
  if(status==='done')         sHTML=`<span class="dot dot-done"></span><span style="color:var(--red);font-weight:600">${tr('finished')}</span>`;
  else if(status==='live')    sHTML=`<span class="dot dot-live"></span><span style="color:var(--green);font-weight:600">${tr('live')}</span>`;
  else if(status==='paused')  sHTML=`<span class="dot dot-live"></span><span style="color:var(--green);font-weight:600">${tr('paused')}</span>`;
  else if(status==='waiting') sHTML=`<span class="dot dot-soon"></span><span style="color:var(--amber)">${tr('waiting')}</span>`;
  else                        sHTML=`<span class="dot dot-soon"></span><span style="color:var(--amber)">${tr('soon')} · ${m.date} ${m.time}</span>`;
  let scHTML='';
  if(r){const[h,a]=r.split('-');scHTML=`<div class="t-score"><span>${h}</span><span class="sep">–</span><span>${a}</span></div>`;}
  else if(['live','paused'].includes(status)){
    const score=apiLiveScore(apiMatchFor(m));
    scHTML=`<div class="t-score"><span>${score.home}</span><span class="sep">–</span><span>${score.away}</span></div>`;
  }
  else scHTML=`<div class="t-vs">VS</div>`;
  let fHTML='';
  if(status==='done'&&r){
    const bd=breakdown(m.idx);
    fHTML=`<span class="f3">▲ ${bd[3].length} × 3 ${pointsLabel(3)}</span><span class="f1">${bd[1].length} × 1 ${pointsLabel(1)}</span><span class="f-hint">↓</span>`;
  } else {
    const cnt=PLAYERS.filter(p=>p.tips[m.idx+1]).length;
    fHTML=`<span>${cnt}/${PLAYERS.length} ${tr('predictions')}</span><span class="f-hint">↓</span>`;
  }
  let dHTML='';
  if(status==='done'&&r){
    const bd=breakdown(m.idx);
    dHTML=`<div class="tile-expand" id="tx-${m.idx}">`;
    [{pts:3,cls:'lbl-g exp-lbl',label:`3 ${pointsLabel(3)}`,cc:'chip-g'},{pts:1,cls:'lbl-a exp-lbl',label:`1 ${pointsLabel(1)}`,cc:'chip-a'},{pts:0,cls:'lbl-r exp-lbl',label:`0 ${pointsLabel(0)}`,cc:'chip-r'}].forEach(({pts,cls,label,cc})=>{
      if(!bd[pts].length)return;
      dHTML+=`<div class="exp-section"><div class="${cls}">${label}</div><div class="chips">`;
      bd[pts].forEach(({name,tip})=>{dHTML+=`<span class="chip ${cc}">${name}<span class="chip-tip">${tip}</span></span>`;});
      dHTML+=`</div></div>`;
    });
    dHTML+=`</div>`;
  } else {
    dHTML=`<div class="tile-expand" id="tx-${m.idx}"><div class="exp-section"><div class="exp-lbl" style="color:var(--muted)">${tr('playerPredictions')}</div><div class="chips">`;
    const withTip=PLAYERS.filter(p=>p.tips[m.idx+1]).sort((a,b)=>a.name.localeCompare(b.name,'pl'));
    const noTip=PLAYERS.filter(p=>!p.tips[m.idx+1]).sort((a,b)=>a.name.localeCompare(b.name,'pl'));
    withTip.forEach(p=>{dHTML+=`<span class="chip chip-tip-pre"><span class="chip-pname">${p.name}</span><span class="chip-tip">${p.tips[m.idx+1]}</span></span>`;});
    noTip.forEach(p=>{dHTML+=`<span class="chip chip-tip-empty"><span class="chip-pname">${p.name}</span><span class="chip-tip">—</span></span>`;});
    dHTML+=`</div></div></div>`;
  }
  tile.innerHTML=`
    <div class="tile-top"><div class="tile-status">${sHTML}</div></div>
    <div class="tile-teams"><span class="t-name">${teamHTML(m.home,'home')}</span>${scHTML}<span class="t-name away">${teamHTML(m.away,'away')}</span></div>
    <div class="tile-footer">${fHTML}</div>${dHTML}`;
  tile.style.cursor='pointer';
  tile.addEventListener('click',()=>{
    const d=document.getElementById('tx-'+m.idx);if(!d)return;
    const op=d.classList.contains('open');
    document.querySelectorAll('.tile-expand.open').forEach(x=>x.classList.remove('open'));
    document.querySelectorAll('.tile.expanded').forEach(x=>x.classList.remove('expanded'));
    if(op){
      expandedMatchIdx=null;
    }else{
      d.classList.add('open');
      tile.classList.add('expanded');
      expandedMatchIdx=m.idx;
    }
  });
  return tile;
}

function restoreExpandedMatch(){
  if(expandedMatchIdx===null)return;
  const details=document.getElementById('tx-'+expandedMatchIdx);
  const tile=details?.closest('.tile');
  if(!details||!tile){
    expandedMatchIdx=null;
    return;
  }
  details.classList.add('open');
  tile.classList.add('expanded');
}

function todayMatchKey(){
  const parts=new Intl.DateTimeFormat('pl-PL',{timeZone:'Europe/Warsaw',day:'2-digit',month:'2-digit'}).formatToParts(new Date());
  const day=parts.find(p=>p.type==='day')?.value||'';
  const month=parts.find(p=>p.type==='month')?.value||'';
  return `${day}.${month}`;
}

function matchFilterList(view){
  const items=MATCHES.map((m,idx)=>({...m,idx})).sort((a,b)=>matchDateTime(a)-matchDateTime(b));
  if(view==='zakonczone')return items.filter(m=>matchStatus(m,m.idx)==='done');
  if(view==='nadchodzace')return items.filter(m=>!['done','live','paused','waiting'].includes(matchStatus(m,m.idx)));
  if(view==='skrot'){
    const key=todayMatchKey();
    const selected=[];
    const add=m=>{if(!selected.some(x=>x.idx===m.idx))selected.push(m);};
    items.filter(m=>m.date===key).forEach(add);
    items.filter(m=>['live','paused','waiting'].includes(matchStatus(m,m.idx))).forEach(add);
    items.filter(m=>!['done','live','paused','waiting'].includes(matchStatus(m,m.idx))).slice(0,4).forEach(add);
    if(!selected.length)items.filter(m=>matchStatus(m,m.idx)==='done').slice(-4).forEach(add);
    return selected.sort((a,b)=>matchDateTime(a)-matchDateTime(b));
  }
  return items;
}

function renderMatchesByDate(cont,matches,GC){
  if(!matches.length){
    const empty=document.createElement('div');
    empty.className='pdp-empty';
    empty.textContent=LANG==='en'?'No matches in this view.':'Brak meczów w tym widoku.';
    cont.appendChild(empty);
    return;
  }
  const byDate={};
  matches.forEach(m=>{if(!byDate[m.date])byDate[m.date]=[];byDate[m.date].push(m);});
  const sorted=Object.keys(byDate).sort((a,b)=>{
    const[da,ma]=a.split('.').map(Number),[db,mb]=b.split('.').map(Number);
    return (ma-mb)||(da-db);
  });
  sorted.forEach(date=>{
    const ms=byDate[date];
    const[d,mo]=date.split('.').map(Number);
    const label=new Intl.DateTimeFormat(LANG==='en'?'en-GB':'pl-PL',{timeZone:'Europe/Warsaw',day:'numeric',month:'long',weekday:'long'}).format(new Date(Date.UTC(2026,mo-1,d,12)));
    const lbl=document.createElement('div');
    lbl.className='section-lbl';
    lbl.style.setProperty('--g-color','rgba(255,255,255,.35)');
    lbl.textContent=label;
    cont.appendChild(lbl);
    const grid=document.createElement('div');grid.className='tiles-grid';
    ms.sort((a,b)=>a.time.localeCompare(b.time));
    ms.forEach(m=>grid.appendChild(buildTile(m, GC[m.g])));
    cont.appendChild(grid);
  });
}
function groupTableRows(group){
  const teams={};
  const ensure=name=>teams[name]||(teams[name]={team:name,played:0,pts:0,gf:0,ga:0});
  MATCHES.forEach((m,idx)=>{
    if(m.g!==group)return;
    ensure(m.home); ensure(m.away);
    const r=results[idx];
    if(!r)return;
    const[homeGoals,awayGoals]=r.split('-').map(Number);
    const home=ensure(m.home);
    const away=ensure(m.away);
    home.played++; away.played++;
    home.gf+=homeGoals; home.ga+=awayGoals;
    away.gf+=awayGoals; away.ga+=homeGoals;
    if(homeGoals>awayGoals)home.pts+=3;
    else if(homeGoals<awayGoals)away.pts+=3;
    else {home.pts++; away.pts++;}
  });
  return Object.values(teams)
    .map(row=>({...row,gd:row.gf-row.ga}))
    .sort((a,b)=>{
      const basic=b.pts-a.pts||b.gd-a.gd||b.gf-a.gf;
      if(basic)return basic;
      const direct=MATCHES.find((m,idx)=>m.g===group&&results[idx]&&(
        (m.home===a.team&&m.away===b.team)||(m.home===b.team&&m.away===a.team)
      ));
      if(direct){
        const idx=MATCHES.indexOf(direct);
        const[homeGoals,awayGoals]=results[idx].split('-').map(Number);
        if(homeGoals!==awayGoals){
          const winner=homeGoals>awayGoals?direct.home:direct.away;
          return winner===a.team?-1:1;
        }
      }
      return a.team.localeCompare(b.team,'pl');
    });
}
function renderGroupTables(cont,GC){
  const groups=[...new Set(MATCHES.map(m=>m.g))].sort((a,b)=>a.localeCompare(b,'pl'));
  const grid=document.createElement('div');
  grid.className='group-standings-grid';
  groups.forEach(group=>{
    const card=document.createElement('div');
    card.className='group-table-card';
    card.style.setProperty('--g-color',`var(${GC[group]||'--muted'})`);
    const rows=groupTableRows(group);
    card.innerHTML=`
      <div class="group-table-head"><strong>${tr('group')} ${group}</strong><span>${rows.reduce((sum,row)=>sum+row.played,0)/2}/6</span></div>
      <table class="group-table">
        <thead><tr>
          <th class="rank-pos">#</th>
          <th>${tr('team')}</th>
          <th class="num-cell">${tr('playedShort')}</th>
          <th class="num-cell">${tr('pointsShort')}</th>
          <th class="goals-cell">${tr('goalsForAgainst')}</th>
        </tr></thead>
        <tbody>
          ${rows.map((row,index)=>{
            return `<tr>
              <td class="rank-pos">${index+1}</td>
              <td class="team-cell">${teamHTML(row.team,'home')}</td>
              <td class="num-cell">${row.played}</td>
              <td class="num-cell">${row.pts}</td>
              <td class="goals-cell">${row.gf}-${row.ga}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`;
    grid.appendChild(card);
  });
  cont.appendChild(grid);
}
function renderMatches(){
  const cont=document.getElementById('matches-content');
  if(!cont) return;
  cont.innerHTML='';
  setMatchSubtabState();
  const GC={A:'--ga',B:'--gb',C:'--gc',D:'--gd',E:'--ge',F:'--gf',G:'--gg',H:'--gh',I:'--gi',J:'--gj',K:'--gk',L:'--gl'};

  if(_matchView==='tabele'){
    renderGroupTables(cont,GC);
    return;
  }

  if(_matchView!=='grupy'){
    renderMatchesByDate(cont,matchFilterList(_matchView),GC);
    if(typeof restoreExpandedMatch==='function')restoreExpandedMatch();
    return;
  }

  if(_matchView==='grupy'){
    const grouped={};
    MATCHES.forEach((m,i)=>{if(!grouped[m.g])grouped[m.g]=[];grouped[m.g].push({...m,idx:i});});
    Object.entries(grouped).forEach(([grp,ms])=>{
      const lbl=document.createElement('div');
      lbl.className='section-lbl';
      lbl.style.setProperty('--g-color',`var(${GC[grp]||'--muted'})`);
      lbl.textContent=`${tr('group')} ${grp}`;
      cont.appendChild(lbl);
      const grid=document.createElement('div');grid.className='tiles-grid';
      ms.forEach(m=>grid.appendChild(buildTile(m, GC[m.g])));
      cont.appendChild(grid);
    });
  } else {
    const byDate={};
    MATCHES.forEach((m,i)=>{if(!byDate[m.date])byDate[m.date]=[];byDate[m.date].push({...m,idx:i});});
    const months=LANG==='en'
      ? ['','January','February','March','April','May','June','July','August','September','October','November','December']
      : ['','stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];
    const days=LANG==='en'
      ? ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
      : ['niedziela','poniedziałek','wtorek','środa','czwartek','piątek','sobota'];
    const sorted=Object.keys(byDate).sort((a,b)=>{
      const[da,ma]=a.split('.').map(Number),[db,mb]=b.split('.').map(Number);
      return (ma-mb)||(da-db);
    });
    sorted.forEach(date=>{
      const ms=byDate[date];
      const[d,mo]=date.split('.').map(Number);
      const dow=new Date(2026,mo-1,d).getDay();
      const lbl=document.createElement('div');
      lbl.className='section-lbl';
      lbl.style.setProperty('--g-color','rgba(255,255,255,.35)');
      lbl.textContent=`${d} ${months[mo]} · ${days[dow]}`;
      cont.appendChild(lbl);
      const grid=document.createElement('div');grid.className='tiles-grid';
      ms.sort((a,b)=>a.time.localeCompare(b.time));
      ms.forEach(m=>grid.appendChild(buildTile(m, GC[m.g])));
      cont.appendChild(grid);
    });
  }
  restoreExpandedMatch();
}

// Zdjęcia graczy — wstaw URL zdjęcia lub zostaw '' dla placeholdera
const PHOTOS = {
  'Alex': 'img/alex.jpg',
  'Borys': 'img/borys.jpg',
  'Agnieszka': 'img/agnieszka.jpg','Aldona': 'img/aldona.jpg','Andrzej G.': 'img/andrzej_g.jpg','Andrzej W.': 'img/andrzej_w.jpg','Iwona': 'img/iwona.jpg','Izunia': 'img/iza.jpg','Jacek': 'img/jacek.jpg',  'Justyna': 'img/justyna.jpg','Kacper': 'img/kacper.jpg','Leszek': 'img/leszek.jpg','Łukasz':'img/lukasz.jpg','Magda': 'img/magda.jpg',
  'Lucas': 'img/lucas.jpg','Mariusz': 'img/mariusz.jpg','Mateusz': 'img/mateusz.jpg','Maria': 'img/marysia.jpg','Michał': 'img/michal.jpg','Ola': 'img/ola.jpg',
  'Paweł': 'img/pawel.jpg','Robert': 'img/robert.jpg','Tomek': 'img/tomek.jpg','Waldemar': 'img/waldek.jpg',
};

let activePlayerCard = null;

function renderPlayerCards(){
  const grid = document.getElementById('playersGrid');
  grid.innerHTML = '';
  const ranked = assignPositions(calcAll());
  const sorted = ranked;
  const leaderPts = ranked[0] ? ranked[0].pts : 0;
  const hasResults = results.some(Boolean);
  const tipDotPlayers = knockoutTipDotPlayers();

  sorted.forEach((rp, i) => {
    const p = PLAYERS.find(x => x.name === rp.name);
    if(!p) return;
    const card = document.createElement('div');
    const hasTips = p.tips && p.tips.filter((t,i) => i>0 && t && t!=='').length === 72;
    const showTipDot = tipDotPlayers.has(p.name);
    const isLeader = hasResults && rp._pos === 1;
    card.className = 'fifa-card' + (isLeader ? ' leader' : '') + (hasTips ? ' has-tips' : '');
    card.dataset.name = p.name;

    const pts = rp.pts;
    const pos = rp._pos || (i + 1);
    const diff = pts - leaderPts;
    const diffStr = diff === 0 ? '—' : String(diff);

    // flaga i kod mistrza
    const champISO = ISO[p.champ] || '';
    const champCode = SHORT[p.champ] || (p.champ ? teamName(p.champ).substring(0,3).toUpperCase() : '—');
    const flagHTML = champISO
      ? `<img class="card-champ-flag" src="img/flags/${champISO}.png" alt="${teamName(p.champ)}">`
      : `<div class="card-champ-flag" style="background:rgba(255,255,255,.1)"></div>`;

    const photoSrc = PHOTOS[p.name] || '';
    const photoHTML = photoSrc
      ? `<img src="${photoSrc}" alt="${p.name}">`
      : `<div class="fifa-photo-placeholder">👤</div>`;

    card.innerHTML = `
      <div class="card-bg"></div>
      <div class="card-shine"></div>
      <div class="card-crystal"></div>
      <div class="card-ribbon"></div>
      <div class="card-border"></div>
      <div class="card-top">
        <div class="card-hso">${LANG==='en'?'WC':'MŚ'}</div>
        <div class="card-year">2026</div>
      </div>
      <div class="card-badge">
        ${flagHTML}
        <div class="card-champ-code">${champCode}</div>
      </div>
      <div class="fifa-photo">${photoHTML}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-divider"></div>
      <div class="card-stats">
        <div class="card-stat"><div class="card-stat-val">${pos}</div><div class="card-stat-lbl">${tr('place')}</div></div>
        <div class="card-stat"><div class="card-stat-val">${pts}</div><div class="card-stat-lbl">${tr('points')}</div></div>
        <div class="card-stat"><div class="card-stat-val">${diffStr}</div><div class="card-stat-lbl">${tr('toLeader')}</div></div>
      </div>
      ${showTipDot ? '<div class="card-check"></div>' : ''}`;

    card.addEventListener('click', () => {
      if (activePlayerCard === p.name) {
        closePlayerPanel();
      } else {
        openPlayerPanel(p);
        activePlayerCard = p.name;
        document.querySelectorAll('.fifa-card').forEach(c => {
          const isSelected = c.dataset.name === p.name;
          c.classList.toggle('selected', isSelected);
        });
      }
    });
    grid.appendChild(card);
  });

  if(activePlayerCard){
    const active=PLAYERS.find(p=>p.name===activePlayerCard);
    if(active){
      openPlayerPanel(active,false);
      document.querySelectorAll('.fifa-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.name === activePlayerCard);
      });
    }
  }
}

function openPlayerPanel(p, scroll=true){
  const panel = document.getElementById('playerDetailPanel');
  const phaseStates = !scroll ? [...panel.querySelectorAll('.pdp-phase')].map(el=>el.classList.contains('open')) : null;
  const subsectionStates = !scroll ? [...panel.querySelectorAll('.pdp-subsection')].map(el=>el.classList.contains('open')) : null;
  activePlayerCard = p.name;
  document.getElementById('pdpName').textContent = p.name;
  document.getElementById('pdpSub').textContent = '';
  document.getElementById('pdpChamp').textContent = p.champ ? teamName(p.champ) : '—';
  const stats=playerStats(p);
  document.getElementById('pdpStats').innerHTML=`
    <div class="pdp-stat"><strong>${stats.efficiency}%</strong><span>${tr('efficiency')}</span></div>
    <div class="pdp-stat"><strong>${stats.average}</strong><span>${tr('pointsPerMatch')}</span></div>
    <div class="pdp-stat"><strong>${stats.bestGroup}</strong><span>${tr('bestGroup')}</span></div>
    <div class="pdp-stat"><strong>${stats.streak} ${LANG==='pl'?'pkt.':'pts.'}</strong><span>${tr('currentStreak')}</span></div>`;

  const cont = document.getElementById('pdpMatches');
  cont.innerHTML = buildPlayerPhases(p);
  if(!scroll){
    document.querySelectorAll('#pdpMatches .pdp-phase').forEach((el,i)=>el.classList.toggle('open', phaseStates?.[i] ?? el.classList.contains('open')));
    document.querySelectorAll('#pdpMatches .pdp-subsection').forEach((el,i)=>el.classList.toggle('open', subsectionStates?.[i] ?? el.classList.contains('open')));
  }

  panel.classList.add('open');
  if(scroll)panel.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function closePlayerPanel(){
  activePlayerCard = null;
  document.getElementById('playerDetailPanel').classList.remove('open');
  document.querySelectorAll('.fifa-card').forEach(c => c.classList.remove('selected'));
}

// ── Panel — dostęp tylko dla organizatora ─────────────────────────────────
if(false){
  const HASH = 'panel';
  // prosta suma kontrolna — nie wymaga btoa
  function hashPwd(s){ let h=0; for(let i=0;i<s.length;i++) h=(Math.imul(31,h)+s.charCodeAt(i))|0; return h; }
  const PWD_HASH = hashPwd('Żetakpowiem2405!#');

  function unlockPanel(){
    const entered = prompt('Podaj hasło dostępu do panelu:');
    if(entered === null) return;
    if(hashPwd(entered) === PWD_HASH){
      document.getElementById('adminTab').style.display = '';
      sessionStorage.setItem('hso_admin','1');
      // auto-przełącz do panelu
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      document.getElementById('adminTab').classList.add('active');
      ['gracze','mecze','ranking','pucharowa','admin'].forEach(t=>
        document.getElementById(`tab-${t}`).style.display=t==='admin'?'block':'none');
      // usuń hash z URL żeby nie podpowiadać
      history.replaceState(null,'',location.pathname);
    } else {
      alert('Nieprawidłowe hasło.');
    }
  }

  // Odblokuj jeśli sesja już autoryzowana
  if(sessionStorage.getItem('hso_admin')==='1'){
    document.getElementById('adminTab').style.display = '';
  }

  // Aktywuj po wejściu z #panel w URL
  if(location.hash === '#'+HASH){
    unlockPanel();
  }

  // Aktywuj skrótem Ctrl+Shift+P
  document.addEventListener('keydown', e=>{
    if(e.ctrlKey && e.shiftKey && e.key==='A'){
      e.preventDefault();
      if(sessionStorage.getItem('hso_admin')==='1'){
        document.getElementById('adminTab').style.display = '';
        document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
        document.getElementById('adminTab').classList.add('active');
        ['gracze','mecze','ranking','pucharowa','admin'].forEach(t=>
          document.getElementById(`tab-${t}`).style.display=t==='admin'?'block':'none');
      } else {
        unlockPanel();
      }
    }
  });
}
const KNOCKOUT_ROUNDS = [
  {id:'r32', pl:'1/16 finału', en:'Round of 32', count:16, start:0, form:'hso-typowanie16.html'},
  {id:'r16', pl:'1/8 finału', en:'Round of 16', count:8, start:16, form:'hso-typowanie8.html'},
  {id:'qf', pl:'Ćwierćfinały', en:'Quarter-finals', count:4, start:24, form:'hso-typowanie4.html'},
  {id:'sf', pl:'Półfinały', en:'Semi-finals', count:2, start:28, form:'hso-typowanie2.html'},
  {id:'third', pl:'3. miejsce', en:'Third place', count:1, start:30, form:'hso-typowanie1.html'},
  {id:'final', pl:'Finał', en:'Final', count:1, start:31, form:'hso-typowanie1.html'}
];
const KNOCKOUT_FALLBACK_DATES = [
  '2026-06-28T19:00:00Z','2026-06-29T17:00:00Z','2026-06-29T20:30:00Z','2026-06-30T01:00:00Z',
  '2026-06-30T17:00:00Z','2026-06-30T21:00:00Z','2026-07-01T01:00:00Z','2026-07-01T16:00:00Z',
  '2026-07-01T20:00:00Z','2026-07-02T00:00:00Z','2026-07-02T19:00:00Z','2026-07-02T23:00:00Z',
  '2026-07-03T03:00:00Z','2026-07-03T18:00:00Z','2026-07-03T22:00:00Z','2026-07-04T01:30:00Z',
  '2026-07-04T17:00:00Z','2026-07-04T21:00:00Z','2026-07-05T20:00:00Z','2026-07-06T00:00:00Z',
  '2026-07-06T19:00:00Z','2026-07-07T00:00:00Z','2026-07-07T16:00:00Z','2026-07-07T20:00:00Z',
  '2026-07-09T20:00:00Z','2026-07-10T19:00:00Z','2026-07-11T21:00:00Z','2026-07-12T01:00:00Z',
  '2026-07-14T19:00:00Z','2026-07-15T19:00:00Z','2026-07-18T21:00:00Z','2026-07-19T19:00:00Z'
];
const KNOWN_KNOCKOUT_TEAMS = [
  {matchId:537425, side:'homeTeam', team:{name:'Mexico',shortName:'Mexico',tla:'MEX'}},
  {matchId:537425, side:'awayTeam', team:{name:'Ecuador',shortName:'Ecuador',tla:'ECU'}},
  {matchId:537421, side:'homeTeam', team:{name:'United States',shortName:'United States',tla:'USA'}},
  {matchId:537415, side:'homeTeam', team:{name:'Germany',shortName:'Germany',tla:'GER'}},
  {matchId:537415, side:'awayTeam', team:{name:'Paraguay',shortName:'Paraguay',tla:'PAR'}},
  {matchId:537427, side:'homeTeam', team:{name:'Argentina',shortName:'Argentina',tla:'ARG'}},
  {matchId:537417, side:'homeTeam', team:{name:'South Africa',shortName:'South Africa',tla:'RSA'}},
  {matchId:537417, side:'awayTeam', team:{name:'Canada',shortName:'Canada',tla:'CAN'}},
  {matchId:537429, side:'homeTeam', team:{name:'Switzerland',shortName:'Switzerland',tla:'SUI'}},
  {matchId:537429, side:'awayTeam', team:{name:'Algeria',shortName:'Algeria',tla:'ALG'}},
  {matchId:537423, side:'homeTeam', team:{name:'Brazil',shortName:'Brazil',tla:'BRA'}},
  {matchId:537423, side:'awayTeam', team:{name:'Japan',shortName:'Japan',tla:'JPN'}},
  {matchId:537418, side:'homeTeam', team:{name:'Netherlands',shortName:'Netherlands',tla:'NED'}},
  {matchId:537418, side:'awayTeam', team:{name:'Morocco',shortName:'Morocco',tla:'MAR'}},
  {matchId:537424, side:'homeTeam', team:{name:'Ivory Coast',shortName:'Ivory Coast',tla:'CIV'}},
  {matchId:537416, side:'homeTeam', team:{name:'France',shortName:'France',tla:'FRA'}},
  {matchId:537416, side:'awayTeam', team:{name:'Sweden',shortName:'Sweden',tla:'SWE'}},
  {matchId:537424, side:'awayTeam', team:{name:'Norway',shortName:'Norway',tla:'NOR'}},
  {matchId:537422, side:'homeTeam', team:{name:'Belgium',shortName:'Belgium',tla:'BEL'}},
  {matchId:537422, side:'awayTeam', team:{name:'Senegal',shortName:'Senegal',tla:'SEN'}},
  {matchId:537420, side:'homeTeam', team:{name:'Spain',shortName:'Spain',tla:'ESP'}},
  {matchId:537420, side:'awayTeam', team:{name:'Austria',shortName:'Austria',tla:'AUT'}},
  {matchId:537421, side:'awayTeam', team:{name:'Bosnia-Herzegovina',shortName:'Bosnia-H.',tla:'BIH'}},
  {matchId:537428, side:'homeTeam', team:{name:'Australia',shortName:'Australia',tla:'AUS'}},
  {matchId:537428, side:'awayTeam', team:{name:'Egypt',shortName:'Egypt',tla:'EGY'}},
  {matchId:537427, side:'awayTeam', team:{name:'Cape Verde Islands',shortName:'Cape Verde',tla:'CPV'}},
  {matchId:537426, side:'homeTeam', team:{name:'England',shortName:'England',tla:'ENG'}},
  {matchId:537426, side:'awayTeam', team:{name:'Congo DR',shortName:'Congo DR',tla:'COD'}},
  {matchId:537419, side:'homeTeam', team:{name:'Portugal',shortName:'Portugal',tla:'POR'}},
  {matchId:537419, side:'awayTeam', team:{name:'Croatia',shortName:'Croatia',tla:'CRO'}},
  {matchId:537430, side:'homeTeam', team:{name:'Colombia',shortName:'Colombia',tla:'COL'}},
  {matchId:537430, side:'awayTeam', team:{name:'Ghana',shortName:'Ghana',tla:'GHA'}}
];
let selectedKnockoutRound = 0;

function knockoutPlaceholderMatch(utcDate,index){
  return {
    id:`ko-fallback-${index+1}`,
    utcDate,
    status:'TIMED',
    homeTeam:{name:null,shortName:null,tla:null},
    awayTeam:{name:null,shortName:null,tla:null},
    score:{fullTime:{home:null,away:null}},
    fallback:true
  };
}
function hasKnockoutTeam(team){
  return Boolean(team?.name || team?.shortName || team?.tla);
}
function withKnownKnockoutTeams(matches){
  return matches.map(match=>{
    const known=KNOWN_KNOCKOUT_TEAMS.filter(item=>item.matchId===match.id);
    if(!known.length)return match;
    let next=match;
    known.forEach(item=>{
      if(hasKnockoutTeam(next[item.side]))return;
      next={
        ...next,
        [item.side]:{...item.team},
        knownTeamFallback:true
      };
    });
    return next;
  });
}
function knockoutMatches(){
  const matches = API_MATCHES
    .filter(match => Date.parse(match.utcDate) >= Date.parse('2026-06-28T19:00:00Z'))
    .sort((a,b) => Date.parse(a.utcDate)-Date.parse(b.utcDate));
  const source = matches.length ? matches : KNOCKOUT_FALLBACK_DATES.map(knockoutPlaceholderMatch);
  return withKnownKnockoutTeams(source);
}
function knockoutRoundName(round){
  return LANG==='en' ? round.en : round.pl;
}
function knockoutMatchCountLabel(count){
  if(LANG==='en')return `${count} ${count===1?'match':'matches'}`;
  const mod10=count%10;
  const mod100=count%100;
  const word=count===1
    ? 'mecz'
    : mod10>=2&&mod10<=4&&!(mod100>=12&&mod100<=14)
      ? 'mecze'
      : 'meczów';
  return `${count} ${word}`;
}
function knockoutDate(utcDate){
  if(!utcDate)return '—';
  return new Intl.DateTimeFormat(LANG==='en'?'en-GB':'pl-PL',{
    timeZone:'Europe/Warsaw',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'
  }).format(new Date(utcDate)).replace(',',' ·');
}
function knockoutDeadline(firstMatchUtc){
  if(!firstMatchUtc)return null;
  return new Date(Date.parse(firstMatchUtc)-120*60*1000);
}
function knockoutDeadlineLabel(deadline){
  if(!deadline)return LANG==='en'?'Deadline will appear when the schedule is known.':'Termin pojawi się po ustaleniu terminarza.';
  return new Intl.DateTimeFormat(LANG==='en'?'en-GB':'pl-PL',{
    timeZone:'Europe/Warsaw',day:'2-digit',month:'2-digit',year:'numeric',
    hour:'2-digit',minute:'2-digit'
  }).format(deadline).replace(',',' ·');
}
function knockoutTeamName(team){
  const name=team?.shortName||team?.name;
  if(!name)return LANG==='en'?'Team not known yet':'Drużyna jeszcze nieznana';
  if(LANG==='en')return name;
  if(['Bosnia-H.','Bosnia-Herzegovina'].includes(name)&&window.matchMedia('(max-width: 560px)').matches)return 'BiH';
  const apiToPl={
    'Mexico':'Meksyk','South Africa':'RPA','Korea Republic':'Korea Płd.','South Korea':'Korea Płd.',
    'Czechia':'Czechy','Canada':'Kanada','Bosnia-H.':'Bośnia i Herc.','Bosnia-Herzegovina':'Bośnia i Herc.',
    'United States':'USA','Paraguay':'Paragwaj','Qatar':'Katar','Switzerland':'Szwajcaria',
    'Brazil':'Brazylia','Japan':'Japonia','Morocco':'Maroko','Scotland':'Szkocja','Turkey':'Turcja',
    'Germany':'Niemcy','Ivory Coast':'WKS','Netherlands':'Holandia','Sweden':'Szwecja',
    'Tunisia':'Tunezja','Spain':'Hiszpania','Cape Verde Islands':'RZP','Cape Verde':'RZP','Belgium':'Belgia',
    'Egypt':'Egipt','Saudi Arabia':'Arabia Saudyjska','Uruguay':'Urugwaj','New Zealand':'Nowa Zelandia',
    'France':'Francja','Norway':'Norwegia','Argentina':'Argentyna','Algeria':'Algieria',
    'Austria':'Austria','Jordan':'Jordania','Portugal':'Portugalia','Congo DR':'DR Konga',
    'England':'Anglia','Croatia':'Chorwacja','Colombia':'Kolumbia','Ecuador':'Ekwador'
  };
  return apiToPl[name]||name;
}
const KNOCKOUT_FLAG_BY_TLA = {
  ALG:'dz', ARG:'ar', AUS:'au', AUT:'at', BEL:'be', BIH:'ba', BRA:'br', CAN:'ca',
  CIV:'ci', COL:'co', COD:'cd', CPV:'cv', CRO:'hr', CUW:'cw', CZE:'cz', ECU:'ec',
  EGY:'eg', ENG:'gb-eng', FRA:'fr', GER:'de', GHA:'gh', HAI:'ht', IRN:'ir', IRQ:'iq',
  JOR:'jo', JPN:'jp', KOR:'kr', KSA:'sa', MAR:'ma', MEX:'mx', NED:'nl', NOR:'no',
  NZL:'nz', PAN:'pa', PAR:'py', POR:'pt', QAT:'qa', RSA:'za', SCO:'gb-sct', SEN:'sn',
  ESP:'es', SUI:'ch', SWE:'se', TUN:'tn', TUR:'tr', URU:'uy', USA:'us', UZB:'uz'
};
function knockoutTeamFlag(team){
  const code=KNOCKOUT_FLAG_BY_TLA[team?.tla]||ISO[knockoutTeamName(team)];
  if(!code)return '<span class="ko-team-flag placeholder">?</span>';
  return `<img class="ko-team-flag" src="img/flags/${code}.png" alt="${knockoutTeamName(team)}">`;
}
function knockoutStatus(match){
  if(match?.status==='FINISHED')return {cls:'finished',label:LANG==='en'?'Finished':'Zakończony'};
  if(match?.status==='PAUSED')return {cls:'live',label:LANG==='en'?'Half-time':'Przerwa'};
  if(['IN_PLAY','LIVE'].includes(match?.status))return {cls:'live',label:LANG==='en'?'Live':'Trwa'};
  return {cls:'',label:LANG==='en'?'Scheduled':'Zaplanowany'};
}
function currentKnockoutRoundIndex(allMatches){
  if(!allMatches.length)return 0;
  for(let i=0;i<KNOCKOUT_ROUNDS.length;i++){
    const round=KNOCKOUT_ROUNDS[i];
    const matches=allMatches.slice(round.start,round.start+round.count);
    if(!matches.length||matches.some(match=>match.status!=='FINISHED'))return i;
  }
  return KNOCKOUT_ROUNDS.length-1;
}
function renderKnockout(){
  const root=document.getElementById('tab-pucharowa');
  if(!root)return;
  const allMatches=knockoutMatches();
  const currentIndex=currentKnockoutRoundIndex(allMatches);
  const activeRound=KNOCKOUT_ROUNDS[selectedKnockoutRound]||KNOCKOUT_ROUNDS[0];
  const roundMatches=allMatches.slice(activeRound.start,activeRound.start+activeRound.count);
  const knownPairs=roundMatches.filter(match=>match.homeTeam?.name&&match.awayTeam?.name).length;
  const allKnown=roundMatches.length===activeRound.count&&knownPairs===activeRound.count;
  const allFinished=roundMatches.length===activeRound.count&&roundMatches.every(match=>match.status==='FINISHED');
  const formMatches=activeRound.form==='hso-typowanie1.html'
    ? allMatches.slice(30,32)
    : roundMatches;
  const formKnownPairs=formMatches.filter(match=>match.homeTeam?.name&&match.awayTeam?.name).length;
  const deadline=knockoutDeadline(formMatches[0]?.utcDate);
  const beforeDeadline=!deadline||Date.now()<=deadline.getTime();
  const formReady=formKnownPairs>0&&beforeDeadline;
  const headerRound=KNOCKOUT_ROUNDS[currentIndex]||KNOCKOUT_ROUNDS[0];
  const headerMatches=allMatches.slice(headerRound.start,headerRound.start+headerRound.count);
  const headerFormMatches=headerRound.form==='hso-typowanie1.html'
    ? allMatches.slice(30,32)
    : headerMatches;
  const headerKnownPairs=headerFormMatches.filter(match=>match.homeTeam?.name&&match.awayTeam?.name).length;
  const headerIsFinalForm=headerRound.form==='hso-typowanie1.html';
  const headerDeadline=knockoutDeadline(headerFormMatches[0]?.utcDate);
  setHeaderBadge(
    headerKnownPairs>0
      ? (LANG==='en'
        ? `${headerIsFinalForm?'Final-stage predictions available':`Available fixtures: ${headerKnownPairs}/${headerRound.count}`} · deadline ${knockoutDeadlineLabel(headerDeadline)}`
        : `${headerIsFinalForm?'Typowanie finałów dostępne':`Dostępne pary: ${headerKnownPairs}/${headerRound.count}`} · termin ${knockoutDeadlineLabel(headerDeadline)}`)
      : (LANG==='en'
        ? `${headerIsFinalForm?'Waiting for finals':'Waiting for fixtures'} · deadline ${knockoutDeadlineLabel(headerDeadline)}`
        : `${headerIsFinalForm?'Oczekiwanie na finały':'Oczekiwanie na pary'} · termin ${knockoutDeadlineLabel(headerDeadline)}`),
    headerKnownPairs>0?'available':'waiting'
  );

  document.getElementById('koEyebrow').textContent=LANG==='en'?'Road to the final':'Droga do finału';
  document.getElementById('koTitle').textContent=LANG==='en'?'Knockout stage':'Faza pucharowa';
  document.getElementById('koCopy').textContent=LANG==='en'
    ? 'Fixtures come from football-data.org. Teams will appear automatically after the group stage is decided.'
    : 'Terminy pochodzą z football-data.org. Pary pojawią się automatycznie po rozstrzygnięciu fazy grupowej.';
  document.getElementById('koCurrentLabel').textContent=LANG==='en'?'Current stage':'Aktualny etap';
  document.getElementById('koFirstLabel').textContent=LANG==='en'?'First match':'Pierwszy mecz';
  document.getElementById('koTeamsLabel').textContent=LANG==='en'?'Known fixtures':'Znane pary';
  document.getElementById('koCurrentStage').textContent=knockoutRoundName(KNOCKOUT_ROUNDS[currentIndex]);
  document.getElementById('koFirstMatch').textContent=allMatches[0]?knockoutDate(allMatches[0].utcDate):'28.06 · 21:00';
  const firstRound=KNOCKOUT_ROUNDS[0];
  const firstRoundMatches=allMatches.slice(0,firstRound.count);
  document.getElementById('koKnownPairs').textContent=`${firstRoundMatches.filter(m=>m.homeTeam?.name&&m.awayTeam?.name).length} / ${firstRound.count}`;

  const nav=document.getElementById('koStageNav');
  nav.innerHTML=KNOCKOUT_ROUNDS.map((round,index)=>{
    const matches=allMatches.slice(round.start,round.start+round.count);
    const done=matches.length===round.count&&matches.every(match=>match.status==='FINISHED');
    const meta=done
      ? (LANG==='en'?'completed':'zakończone')
      : knockoutMatchCountLabel(round.count);
    return `<button class="ko-stage${index===selectedKnockoutRound?' active':''}${done?' done':''}" type="button" data-ko-round="${index}">
      <span class="ko-stage-name">${knockoutRoundName(round)}</span><span class="ko-stage-meta">${meta}</span>
    </button>`;
  }).join('');
  nav.querySelectorAll('[data-ko-round]').forEach(button=>button.addEventListener('click',()=>{
    selectedKnockoutRound=Number(button.dataset.koRound);
    renderKnockout();
  }));

  document.getElementById('koRoundTitle').textContent=(LANG==='en'?'Matches · ':'Mecze · ')+knockoutRoundName(activeRound);
  document.getElementById('koRoundState').textContent=allFinished
    ? (LANG==='en'?'Completed':'Zakończone')
    : allKnown
      ? (LANG==='en'?'Fixtures confirmed':'Pary potwierdzone')
      : (LANG==='en'?'Waiting for teams':'Oczekiwanie na pary');

  const matchesEl=document.getElementById('koMatches');
  matchesEl.innerHTML=roundMatches.length ? roundMatches.map((match,index)=>{
    const homeKnown=Boolean(match.homeTeam?.name);
    const awayKnown=Boolean(match.awayTeam?.name);
    const status=knockoutStatus(match);
    const score=match.score?.fullTime||{};
    return `<article class="ko-match">
      <div class="ko-match-top"><span>${LANG==='en'?'Match':'Mecz'} ${index+1}</span><span>${knockoutDate(match.utcDate)}</span></div>
      <div class="ko-team${homeKnown?'':' unknown'}">${knockoutTeamFlag(match.homeTeam)}<span class="ko-team-name">${knockoutTeamName(match.homeTeam)}</span><span class="ko-team-score">${Number.isInteger(score.home)?score.home:'–'}</span></div>
      <div class="ko-team${awayKnown?'':' unknown'}">${knockoutTeamFlag(match.awayTeam)}<span class="ko-team-name">${knockoutTeamName(match.awayTeam)}</span><span class="ko-team-score">${Number.isInteger(score.away)?score.away:'–'}</span></div>
      <div class="ko-match-status ${status.cls}"><span class="ko-status-dot"></span>${status.label}</div>
    </article>`;
  }).join('') : `<div class="ko-match">${LANG==='en'?'No fixture data.':'Brak danych o meczach.'}</div>`;

  document.getElementById('koActionTitle').textContent=LANG==='en'?'Round predictions':'Typowanie rundy';
  document.getElementById('koActionCopy').textContent=!beforeDeadline
    ? (LANG==='en'
      ? 'The prediction deadline for this stage has passed.'
      : 'Termin typowania tej rundy minął.')
    : formKnownPairs>0
      ? (LANG==='en'
      ? 'You can start with the confirmed fixtures. Earlier predictions stay saved when more fixtures are added.'
      : 'Możesz rozpocząć od potwierdzonych par. Wcześniejsze typy pozostaną zapisane po dodaniu kolejnych meczów.')
      : (LANG==='en'
        ? 'The round form will become available as soon as the first fixture is known.'
        : 'Formularz rundy zostanie udostępniony po poznaniu pierwszej pary tego etapu.');
  document.getElementById('koDeadline').textContent=(LANG==='en'?'Deadline: ':'Termin typowania: ')+knockoutDeadlineLabel(deadline);
  const actionBtn=document.getElementById('koActionBtn');
  actionBtn.textContent=!beforeDeadline
    ? (LANG==='en'?'Predictions closed':'Typowanie zamknięte')
    : formKnownPairs>0
    ? (LANG==='en'?'Open prediction form':'Otwórz formularz typowania')
    : (LANG==='en'?'Waiting for teams':'Oczekiwanie na drużyny');
  actionBtn.href=formReady?activeRound.form:'#';
  actionBtn.target=formReady?'_blank':'';
  actionBtn.rel=formReady?'noopener noreferrer':'';
  actionBtn.classList.toggle('ready',formReady);
  actionBtn.setAttribute('aria-disabled',String(!formReady));
  actionBtn.onclick=formReady?null:event=>event.preventDefault();
  document.getElementById('koProgressLabel').textContent=LANG==='en'?'Predictions submitted':'Oddane typy';
  document.getElementById('koProgressValue').textContent=`0 / ${PLAYERS.length}`;
  document.getElementById('koProgressFill').style.width='0%';
  document.getElementById('koProgressNote').textContent=LANG==='en'
    ? 'Once the stage opens, player prediction progress will appear here.'
    : 'Po uruchomieniu rundy zobaczysz tutaj postęp typowania graczy.';
  document.getElementById('koRoadLabel').textContent=LANG==='en'?'Road to the final':'Droga do finału';
  document.getElementById('koRoadList').innerHTML=KNOCKOUT_ROUNDS.map((round,index)=>
    `<div class="ko-road-item${index===currentIndex?' current':''}"><span class="ko-road-dot"></span><span>${knockoutRoundName(round)}</span><span class="ko-road-count">${round.count}</span></div>`
  ).join('');
}

function switchTab(tab,el){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');
  ['gracze','mecze','ranking','pucharowa'].forEach(t=>document.getElementById(`tab-${t}`).style.display=t===tab?'block':'none');
  if(tab==='mecze'){
    _matchView='skrot';
    renderMatches();
  }
  if(tab==='pucharowa')renderKnockout();
  requestAnimationFrame(updateMobileSectionBack);
}
if(DEMO_MODE){
  applyApiResults();
  renderPlayerCards();renderMatches();renderRanking();renderKnockout();
}else{
  refreshApiData().then(loaded=>{
    if(!loaded){
      renderPlayerCards();renderMatches();renderRanking();renderKnockout();
    }
  });
}
setInterval(refreshApiData,60*1000);
