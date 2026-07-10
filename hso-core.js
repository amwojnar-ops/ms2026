const HSO_MODE = window.HSO_CONFIG?.mode === 'test' ? 'test' : 'production';
document.documentElement.dataset.hsoMode=HSO_MODE;
const TRANSLATIONS = {
  pl: {
    pageTitle:'Loża Ekspertów · MŚ 2026',
    introTitle:'LOŻA', introName:'EKSPERTÓW', worldCup:'MŚ 2026', skipIntro:'Pomiń intro',
    headerTitle:'LOŻA <span>EKSPERTÓW</span>',
    headerSubtitle:'Mistrzostwa Świata 2026 &nbsp;·&nbsp; Kanada · Meksyk · USA &nbsp;·&nbsp; 11 czerwca – 19 lipca',
    locked:'Typy fazy grupowej zamknięte', played:'Rozegranych', leader:'Lider', leaders:'Liderzy',
    leaderPoints:'Pkt lidera', leadersPoints:'Pkt liderów', nextMatch:'Następny mecz',
    players:'Gracze', matches:'Raport fazy grupowej', ranking:'Ranking', knockout:'Faza pucharowa',
    knockoutTitle:'Faza pucharowa zostanie uruchomiona później', coming:'wkrótce',
    byGroups:'Wg grup', byDates:'Wg dat', groupTables:'Tabele', championPick:'Typ na mistrza',
    player:'Gracz', team:'Zespół', champion:'Mistrz', total:'Razem', date:'Data', match:'Mecz',
    result:'Wynik', predictionPoints:'Typ / pkt', group:'Grupa',
    playedShort:'M', pointsShort:'Pkt', goalsForAgainst:'Bramki',
    finished:'Zakończony', live:'Trwa', paused:'Trwa', waiting:'Oczekuje na wynik', soon:'Wkrótce',
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
    players:'Players', matches:'Group-stage report', ranking:'Ranking', knockout:'Knockout stage',
    knockoutTitle:'The knockout stage will be available later', coming:'soon',
    byGroups:'By group', byDates:'By date', groupTables:'Tables', championPick:'World champion pick',
    player:'Player', team:'Team', champion:'Champion', total:'Total', date:'Date', match:'Match',
    result:'Result', predictionPoints:'Prediction / pts', group:'Group',
    playedShort:'P', pointsShort:'Pts', goalsForAgainst:'Goals',
    finished:'Finished', live:'Live', paused:'Live', waiting:'Waiting for result', soon:'Coming up',
    predictions:'predictions', playerPredictions:'Player predictions',
    efficiency:'accuracy', pointsPerMatch:'pts / match',
    bestGroup:'best group', currentStreak:'current streak',
    place:'place', point:'pt', points:'pts', toLeader:'behind leader'
  },
  it: {
    pageTitle:'Salotto degli Esperti · Mondiali 2026',
    introTitle:'SALOTTO', introName:'DEGLI ESPERTI', worldCup:'MONDIALI 2026', skipIntro:'Salta intro',
    headerTitle:'SALOTTO <span>DEGLI ESPERTI</span>',
    headerSubtitle:'Mondiali 2026 &nbsp;·&nbsp; Canada · Messico · USA &nbsp;·&nbsp; 11 giugno – 19 luglio',
    locked:'Pronostici della fase a gironi chiusi', played:'Giocate', leader:'Leader', leaders:'Leader',
    leaderPoints:'Punti leader', leadersPoints:'Punti leader', nextMatch:'Prossima partita',
    players:'Giocatori', matches:'Report fase a gironi', ranking:'Classifica', knockout:'Fase a eliminazione',
    knockoutTitle:'La fase a eliminazione sarà disponibile più tardi', coming:'a breve',
    byGroups:'Per girone', byDates:'Per data', groupTables:'Classifiche', championPick:'Pronostico campione',
    player:'Giocatore', team:'Squadra', champion:'Campione', total:'Totale', date:'Data', match:'Partita',
    result:'Risultato', predictionPoints:'Pronostico / pt', group:'Girone',
    playedShort:'G', pointsShort:'Pt', goalsForAgainst:'Gol',
    finished:'Terminata', live:'In corso', paused:'In corso', waiting:'In attesa del risultato', soon:'A breve',
    predictions:'pronostici', playerPredictions:'Pronostici dei giocatori',
    efficiency:'precisione', pointsPerMatch:'pt / partita', bestGroup:'miglior girone', currentStreak:'serie attuale',
    place:'posto', point:'pt', points:'pt', toLeader:'dal leader'
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
const TEAM_IT = {
  'Algieria':'Algeria','Anglia':'Inghilterra','Arabia Saudyjska':'Arabia Saudita','Argentyna':'Argentina',
  'Australia':'Australia','Austria':'Austria','Belgia':'Belgio','Bośnia i Herc.':'Bosnia ed Erzegovina',
  'Brazylia':'Brasile','Chorwacja':'Croazia','Curaçao':'Curaçao','Czechy':'Cechia','DR Konga':'RD Congo',
  'Egipt':'Egitto','Ekwador':'Ecuador','Francja':'Francia','Ghana':'Ghana','Haiti':'Haiti','Hiszpania':'Spagna',
  'Holandia':'Paesi Bassi','Irak':'Iraq','Iran':'Iran','Japonia':'Giappone','Jordania':'Giordania',
  'Kanada':'Canada','Katar':'Qatar','Kolumbia':'Colombia','Korea Płd.':'Corea del Sud','Maroko':'Marocco',
  'Meksyk':'Messico','Niemcy':'Germania','Norwegia':'Norvegia','Nowa Zelandia':'Nuova Zelanda',
  'Panama':'Panama','Paragwaj':'Paraguay','Portugalia':'Portogallo','Rep. Ziel. Przył.':'Capo Verde',
  'RPA':'Sudafrica','Senegal':'Senegal','Szwajcaria':'Svizzera','Szwecja':'Svezia','Szkocja':'Scozia',
  'Tunezja':'Tunisia','Turcja':'Turchia','Urugwaj':'Uruguay','USA':'USA','Uzbekistan':'Uzbekistan',
  'Wybrzeże K.Sł.':"Costa d'Avorio"
};
const CONFIG_LANGUAGES=Array.isArray(window.HSO_CONFIG?.languages)?window.HSO_CONFIG.languages:null;
const AVAILABLE_LANGUAGES=CONFIG_LANGUAGES?.filter(language=>TRANSLATIONS[language])||['pl','en'];
const queryLanguage=new URLSearchParams(location.search).get('lang');
let savedLanguage=null;
try{const saved=localStorage.getItem('hso_lang');savedLanguage=AVAILABLE_LANGUAGES.includes(saved)?saved:null;}catch(e){}
const browserLanguages=[...(navigator.languages||[]),navigator.language].filter(Boolean);
const detectedLanguage=AVAILABLE_LANGUAGES.includes('it')&&HSO_MODE==='test'&&browserLanguages.some(language=>/^it(?:-|$)/i.test(language))?'it':'pl';
let LANG=AVAILABLE_LANGUAGES.includes(queryLanguage)?queryLanguage:(savedLanguage||detectedLanguage);
function tr(key){ return TRANSLATIONS[LANG][key] ?? key; }
function teamName(name){ return LANG==='en'?(TEAM_EN[name]||name):LANG==='it'?(TEAM_IT[name]||TEAM_EN[name]||name):name; }
function lt(pl,en,it){return LANG==='pl'?pl:LANG==='it'?it:en;}
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
function groupReportHref(){
  const base='Raport_typow_MS_2026.html?v=20260704-5';
  if(HSO_MODE!=='test')return base;
  return `${base}&from=test&lang=${LANG}`;
}
function setHeaderBadge(text,state='locked',detail='',progress=null){
  const badge=document.getElementById('lockBadge');
  const badgeText=document.getElementById('lockBadgeText');
  if(!badge||!badgeText)return;
  badge.classList.remove('available','waiting');
  if(state)badge.classList.add(state);
  badgeText.replaceChildren();
  const main=document.createElement('span');
  main.className='lock-badge-main';
  main.textContent=text;
  badgeText.appendChild(main);
  if(detail){
    const secondary=document.createElement('span');
    secondary.className='lock-badge-detail';
    secondary.textContent=detail;
    badgeText.appendChild(secondary);
  }
  if(progress){
    const progressWrap=document.createElement('span');
    progressWrap.className='lock-badge-progress';
    const progressTitle=document.createElement('span');
    progressTitle.className='lock-badge-progress-title';
    progressTitle.textContent=`${progress.label}: ${progress.value}/${progress.total}`;
    const progressBar=document.createElement('span');
    progressBar.className='lock-badge-progress-bar';
    const progressFill=document.createElement('span');
    progressFill.className='lock-badge-progress-fill';
    progressFill.style.width=`${progress.total?progress.value/progress.total*100:0}%`;
    progressBar.appendChild(progressFill);
    progressWrap.append(progressTitle,progressBar);
    badgeText.appendChild(progressWrap);
  }
}
function applyLanguage(){
  document.documentElement.lang=LANG;
  document.title=tr('pageTitle');
  const intro=document.getElementById('siteIntro');
  if(intro)intro.setAttribute('aria-label',lt('Loża Ekspertów, MŚ 2026',"Experts' Lounge, World Cup 2026",'Salotto degli Esperti, Mondiali 2026'));
  setText('introTitle','introTitle'); setText('introName','introName'); setText('introYear','worldCup');
  setText('introSkip','skipIntro');
  document.getElementById('headerTitle').innerHTML=tr('headerTitle');
  document.getElementById('headerSubtitle').innerHTML=tr('headerSubtitle');
  setHeaderBadge(tr('locked'),'locked');
  setText('playedLabel','played'); setText('nextMatchLabel','nextMatch');
  setText('tabPlayersBtn','players');
  const groupTab=document.getElementById('tabMatchesBtn');
  const groupTabIsHistory=groupTab?.tagName==='BUTTON';
  if(groupTab)groupTab.textContent=groupTabIsHistory?lt('Historia punktów','Point history','Storico punti'):tr('matches');
  setText('tabRankingBtn','ranking');
  document.getElementById('tabPlayersBtn').setAttribute('aria-label',tr('players'));
  document.getElementById('tabKnockoutBtn').setAttribute('aria-label',tr('knockout'));
  document.getElementById('tabMatchesBtn').setAttribute('aria-label',tr('matches'));
  document.getElementById('tabRankingBtn').setAttribute('aria-label',tr('ranking'));
  document.getElementById('mainTabs').dataset.label=lt('MENU GŁÓWNE','MAIN MENU','MENU PRINCIPALE');
  document.getElementById('koStageNav').dataset.label=lt('WYBIERZ RUNDĘ','SELECT ROUND','SELEZIONA TURNO');
  if(groupTab){
    groupTab.title=groupTabIsHistory
      ? lt('Pokaż historię punktów','Show point history','Mostra storico punti')
      : lt('Otwórz raport fazy grupowej','Open the group-stage report','Apri il report della fase a gironi');
    if('href' in groupTab)groupTab.href=groupReportHref();
  }
  setText('tabKnockoutBtn','knockout');
  const backLabel=document.getElementById('mobileSectionBackLabel');
  if(backLabel)backLabel.textContent=lt('Wróć','Back','Indietro');
  document.getElementById('tabKnockoutBtn').title=tr('knockout');
  setText('subtab-grupy','byGroups'); setText('subtab-daty','byDates'); setText('subtab-tabele','groupTables');
  setText('pdpChampLabel','championPick'); setText('spChampLabel','championPick');
  setText('rankPlayer','player'); setText('rankChampion','champion'); setText('rankTotal','total');
  document.getElementById('rankExact').textContent=`3 ${pointsLabel(3)}`;
  document.getElementById('rankOutcome').textContent=`1 ${pointsLabel(1)}`;
  setText('spDateLabel','date'); setText('spMatchLabel','match');
  setText('spResultLabel','result'); setText('spPredictionLabel','predictionPoints');
  const nextLanguage=AVAILABLE_LANGUAGES[(AVAILABLE_LANGUAGES.indexOf(LANG)+1)%AVAILABLE_LANGUAGES.length];
  document.getElementById('langSwitch').textContent=nextLanguage.toUpperCase();
  document.getElementById('langSwitch').title=nextLanguage==='pl'?'Polski':nextLanguage==='it'?'Italiano':'English';
}
function switchLanguage(){
  LANG=AVAILABLE_LANGUAGES[(AVAILABLE_LANGUAGES.indexOf(LANG)+1)%AVAILABLE_LANGUAGES.length];
  try{localStorage.setItem('hso_lang',LANG);}catch(e){}
  const url=new URL(location.href);
  if(LANG==='pl')url.searchParams.delete('lang'); else url.searchParams.set('lang',LANG);
  history.replaceState(null,'',url);
  closePanel();
  closePlayerPanel();
  applyLanguage();
  renderPlayerCards();
  renderRanking();
  renderKnockout();
  renderGroupArchive();
}
document.getElementById('langSwitch').addEventListener('click',switchLanguage);
applyLanguage();

let API_MATCHES = [];
let API_LAST_UPDATED = null;
let API_DATA_READY = false;
let API_REFRESH_SEQUENCE = 0;
let API_FINISHED_COUNT = 0;
const KNOCKOUT_START_UTC = Date.parse('2026-06-28T19:00:00Z');

function validApiScore(score){
  return Number.isInteger(score?.home)&&Number.isInteger(score?.away);
}

function apiRegulationScore(api){
  const regular=api?.score?.regularTime;
  if(validApiScore(regular))return regular;
  const full=api?.score?.fullTime;
  const extra=api?.score?.extraTime;
  const duration=api?.score?.duration;
  if(['EXTRA_TIME','PENALTY_SHOOTOUT'].includes(duration)&&validApiScore(full)&&validApiScore(extra)){
    const derived={home:full.home-extra.home,away:full.away-extra.away};
    if(derived.home>=0&&derived.away>=0)return derived;
  }
  return validApiScore(full)?full:null;
}

function apiResult(api){
  if(!api)return null;
  if(api.status!=='FINISHED')return null;
  const score=apiRegulationScore(api);
  return Number.isInteger(score?.home)&&Number.isInteger(score?.away)
    ? `${score.home}-${score.away}` : null;
}

function apiLiveScore(api){
  const candidates=[
    api?.score?.extraTime,
    api?.score?.regularTime,
    api?.score?.fullTime,
    api?.score?.halfTime
  ].filter(validApiScore);
  return candidates.reduce((best,score)=>
    score.home+score.away>best.home+best.away?score:best,
    {home:0,away:0}
  );
}

function knockoutDisplayScore(match){
  if(match?.status==='FINISHED')return apiRegulationScore(match)||{home:null,away:null};
  if(['IN_PLAY','LIVE','PAUSED'].includes(match?.status))return apiLiveScore(match);
  return validApiScore(match?.score?.fullTime)?match.score.fullTime:{home:null,away:null};
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
    const currentFinished=API_FINISHED_COUNT;
    const incomingUpdated=Date.parse(data.updatedAt)||0;
    const currentUpdated=Date.parse(API_LAST_UPDATED)||0;
    if(API_DATA_READY&&(incomingFinished<currentFinished||(
      incomingFinished===currentFinished&&incomingUpdated<currentUpdated
    )))return true;
    API_MATCHES=data.matches.filter(match=>Date.parse(match.utcDate)>=KNOCKOUT_START_UTC);
    API_FINISHED_COUNT=incomingFinished;
    API_LAST_UPDATED=data.updatedAt||null;
    API_DATA_READY=true;
    renderPlayerCards();
    renderRanking();
    renderKnockout();
    return true;
  }catch(error){
    console.warn('Nie udało się odczytać danych football-data.org:',error);
    return false;
  }
}
const PLAYERS=[
  {name:'Andrzej W.',champ:'Francja',group:{pts:60,ex:8,en:36}},
  {name:'Łukasz',champ:'Francja',group:{pts:59,ex:8,en:35}},
  {name:'Justyna',champ:'Hiszpania',group:{pts:59,ex:7,en:38}},
  {name:'Borys',champ:'Francja',group:{pts:58,ex:8,en:34}},
  {name:'Kacper',champ:'Hiszpania',group:{pts:57,ex:8,en:33}},
  {name:'Aldona',champ:'Hiszpania',group:{pts:57,ex:6,en:39}},
  {name:'Leszek',champ:'Francja',group:{pts:56,ex:7,en:35}},
  {name:'Robert',champ:'Hiszpania',group:{pts:56,ex:6,en:38}},
  {name:'Waldemar',champ:'Holandia',group:{pts:56,ex:6,en:38}},
  {name:'Izunia',champ:'Hiszpania',group:{pts:55,ex:7,en:34}},
  {name:'Magda',champ:'Francja',group:{pts:53,ex:6,en:35}},
  {name:'Mateusz',champ:'Portugalia',group:{pts:53,ex:6,en:35}},
  {name:'Jacek',champ:'Portugalia',group:{pts:53,ex:5,en:38}},
  {name:'Tomek',champ:'Argentyna',group:{pts:52,ex:8,en:28}},
  {name:'Paweł',champ:'Anglia',group:{pts:52,ex:5,en:37}},
  {name:'Andrzej G.',champ:'Hiszpania',group:{pts:50,ex:6,en:32}},
  {name:'Alex',champ:'Hiszpania',group:{pts:49,ex:5,en:34}},
  {name:'Lucas',champ:'Francja',group:{pts:49,ex:4,en:37}},
  {name:'Michał',champ:'Portugalia',group:{pts:48,ex:5,en:33}},
  {name:'Agnieszka',champ:'Portugalia',group:{pts:45,ex:7,en:24}},
  {name:'Maria',champ:'Hiszpania',group:{pts:45,ex:4,en:33}},
  {name:'Ola',champ:'Francja',group:{pts:40,ex:3,en:31}},
  {name:'Mariusz',champ:'Francja',group:{pts:37,ex:4,en:25}},
  {name:'Iwona',champ:'Brazylia',group:{pts:35,ex:0,en:35}}
];

// Status typowania fazy pucharowej.
// Runda staje się aktywna automatycznie, gdy ma przynajmniej jeden mecz
// z wpisanymi obiema drużynami. Kropka oznacza komplet typów gracza.
// Gdy komplet mają wszyscy gracze, wszystkie kropki są ukrywane.
const KNOCKOUT_TIP_ROUNDS = [
  {
    id:'r32',
    matches:[
      {id:537417,apiId:537417,home:'RPA',away:'Kanada'},
      {id:537423,apiId:537423,home:'Brazylia',away:'Japonia'},
      {id:537415,apiId:537415,home:'Niemcy',away:'Paragwaj'},
      {id:537418,apiId:537418,home:'Holandia',away:'Maroko'},
      {id:537424,apiId:537424,home:'WKS',away:'Norwegia'},
      {id:537416,apiId:537416,home:'Francja',away:'Szwecja'},
      {id:537425,apiId:537425,home:'Meksyk',away:'Ekwador'},
      {id:537426,apiId:537426,home:'Anglia',away:'DR Konga'},
      {id:537422,apiId:537422,home:'Belgia',away:'Senegal'},
      {id:537421,apiId:537421,home:'USA',away:'BiH'},
      {id:537420,apiId:537420,home:'Hiszpania',away:'Austria'},
      {id:537419,apiId:537419,home:'Portugalia',away:'Chorwacja'},
      {id:537429,apiId:537429,home:'Szwajcaria',away:'Algieria'},
      {id:537428,apiId:537428,home:'Australia',away:'Egipt'},
      {id:537427,apiId:537427,home:'Argentyna',away:'RZP'},
      {id:537430,apiId:537430,home:'Kolumbia',away:'Ghana'}
    ],
    tipsByPlayer:{
      'Tomek':{'537417':'0-1','537423':'2-0','537415':'1-1','537418':'2-2','537424':'1-2','537416':'2-0','537425':'1-1','537426':'2-1','537422':'1-1','537421':'3-1','537420':'3-1','537419':'2-1','537429':'1-1','537428':'1-1','537427':'3-0','537430':'2-1'},
      'Iwona':{'537417':'1-1','537423':'3-0','537415':'2-1','537418':'1-1','537424':'1-2','537416':'3-1','537425':'2-2','537426':'2-0','537422':'1-1','537421':'1-1','537420':'2-1','537419':'1-1','537429':'1-1','537428':'2-1','537427':'3-0','537430':'2-2'},
      'Waldemar':{'537417':'2-2','537423':'2-2','537415':'4-0','537418':'3-1','537424':'2-1','537416':'3-1','537425':'2-1','537426':'1-1','537422':'2-1','537421':'1-1','537420':'2-1','537419':'3-2','537429':'0-0','537428':'1-1','537427':'3-1','537430':'1-2'},
      'Leszek':{'537417':'0-2','537423':'2-0','537415':'2-0','537418':'2-1','537424':'0-2','537416':'3-0','537425':'2-2','537426':'2-0','537422':'1-1','537421':'2-0','537420':'2-0','537419':'2-2','537429':'1-0','537428':'0-0','537427':'3-0','537430':'1-1'},
      'Lucas':{'537417':'1-2','537423':'3-2','537415':'4-1','537418':'2-1','537424':'1-3','537416':'4-1','537425':'2-2','537426':'3-1','537422':'3-2','537421':'2-2','537420':'3-1','537419':'3-2','537429':'1-1','537428':'1-2','537427':'5-0','537430':'2-2'},
      'Agnieszka':{'537417':'2-1','537423':'3-1','537415':'3-0','537418':'3-2','537424':'1-2','537416':'4-1','537425':'2-0','537426':'4-0','537422':'2-2','537421':'2-1','537420':'2-1','537419':'3-2','537429':'2-0','537428':'1-1','537427':'4-0','537430':'2-1'},
      'Ola':{'537417':'0-1','537423':'3-1','537415':'2-0','537418':'2-1','537424':'1-2','537416':'2-0','537425':'1-1','537426':'1-0','537422':'2-2','537421':'2-1','537420':'2-0','537419':'1-1','537429':'3-2','537428':'2-1','537427':'3-1','537430':'0-1'},
      'Łukasz':{'537417':'1-2','537423':'2-1','537415':'2-0','537418':'2-1','537424':'1-1','537416':'3-0','537425':'2-0','537426':'2-1','537422':'2-1','537421':'2-0','537420':'2-1','537419':'1-1','537429':'2-1','537428':'1-1','537427':'2-0','537430':'2-0'},
      'Justyna':{'537417':'1-1','537423':'2-0','537415':'3-0','537418':'0-1','537424':'2-0','537416':'3-1','537425':'3-0','537426':'2-0','537422':'2-1','537421':'2-1','537420':'2-0','537419':'2-2','537429':'1-1','537428':'1-1','537427':'3-0','537430':'2-1'},
      'Mariusz':{'537417':'1-2','537423':'3-2','537415':'4-1','537418':'1-1','537424':'1-2','537416':'3-0','537425':'0-0','537426':'4-1','537422':'1-1','537421':'2-0','537420':'3-1','537419':'2-1','537429':'2-1','537428':'1-1','537427':'3-0','537430':'0-0'},
      'Izunia':{'537417':'1-2','537423':'3-1','537415':'3-0','537418':'1-1','537424':'1-1','537416':'2-0','537425':'2-1','537426':'3-0','537422':'2-1','537421':'2-0','537420':'2-1','537419':'2-1','537429':'1-1','537428':'1-2','537427':'3-1','537430':'2-1'},
      'Kacper':{'537417':'1-2','537423':'3-1','537415':'2-0','537418':'2-1','537424':'1-2','537416':'2-0','537425':'2-1','537426':'3-0','537422':'1-2','537421':'2-1','537420':'2-1','537419':'1-1','537429':'1-0','537428':'1-2','537427':'3-0','537430':'2-1'},
      'Mateusz':{'537417':'1-2','537423':'1-2','537415':'2-0','537418':'1-1','537424':'2-1','537416':'3-0','537425':'1-1','537426':'2-0','537422':'1-2','537421':'2-0','537420':'2-1','537419':'1-1','537429':'1-1','537428':'1-1','537427':'2-0','537430':'2-1'},
      'Magda':{'537417':'1-2','537423':'2-2','537415':'4-0','537418':'3-1','537424':'1-3','537416':'3-1','537425':'3-0','537426':'3-1','537422':'1-3','537421':'2-2','537420':'3-2','537419':'3-2','537429':'2-2','537428':'0-1','537427':'3-0','537430':'3-1'},
      'Paweł':{'537417':'1-2','537423':'1-2','537415':'2-1','537418':'3-0','537424':'1-2','537416':'2-0','537425':'1-0','537426':'3-1','537422':'1-1','537421':'2-1','537420':'2-0','537419':'1-1','537429':'2-0','537428':'1-1','537427':'3-0','537430':'2-1'},
      'Maria':{'537417':'0-1','537423':'2-1','537415':'3-1','537418':'2-1','537424':'1-2','537416':'2-1','537425':'1-1','537426':'3-1','537422':'1-2','537421':'1-2','537420':'2-0','537419':'2-1','537429':'2-1','537428':'2-1','537427':'3-0','537430':'1-2'},
      'Michał':{'537417':'1-3','537423':'3-2','537415':'4-1','537418':'3-2','537424':'1-3','537416':'4-2','537425':'3-1','537426':'4-1','537422':'1-2','537421':'2-1','537420':'3-2','537419':'2-2','537429':'3-2','537428':'1-2','537427':'4-0','537430':'2-1'},
      'Andrzej W.':{'537417':'1-2','537423':'2-1','537415':'2-0','537418':'2-2','537424':'1-2','537416':'3-0','537425':'1-1','537426':'2-0','537422':'1-2','537421':'2-1','537420':'3-1','537419':'1-1','537429':'2-1','537428':'1-1','537427':'3-0','537430':'2-1'},
      'Aldona':{'537417':'1-2','537423':'2-1','537415':'2-0','537418':'2-1','537424':'1-2','537416':'3-1','537425':'2-1','537426':'3-0','537422':'1-1','537421':'2-1','537420':'2-0','537419':'2-1','537429':'2-1','537428':'1-1','537427':'3-0','537430':'1-1'},
      'Alex':{'537417':'0-1','537423':'2-1','537415':'3-1','537418':'2-0','537424':'0-2','537416':'4-0','537425':'1-1','537426':'2-0','537422':'1-1','537421':'1-0','537420':'2-0','537419':'1-2','537429':'1-1','537428':'1-2','537427':'5-0','537430':'2-2'},
      'Borys':{'537417':'1-3','537423':'3-1','537415':'2-0','537418':'1-1','537424':'1-2','537416':'3-0','537425':'1-2','537426':'2-0','537422':'1-1','537421':'2-1','537420':'2-0','537419':'2-1','537429':'2-1','537428':'1-0','537427':'3-1','537430':'2-0'},
      'Jacek':{'537417':'1-1','537423':'2-1','537415':'2-0','537418':'2-1','537424':'1-1','537416':'3-1','537425':'1-1','537426':'2-0','537422':'0-0','537421':'2-1','537420':'3-1','537419':'1-1','537429':'2-1','537428':'1-1','537427':'2-0','537430':'2-1'},
      'Robert':{'537417':'2-2','537423':'2-0','537415':'3-0','537418':'2-2','537424':'1-3','537416':'4-0','537425':'1-1','537426':'3-1','537422':'1-2','537421':'2-2','537420':'2-0','537419':'1-1','537429':'1-1','537428':'0-2','537427':'3-0','537430':'1-1'},
      'Andrzej G.':{'537417':'1-2','537423':'3-1','537415':'0-0','537418':'2-0','537424':'1-2','537416':'3-0','537425':'2-1','537426':'3-1','537422':'0-0','537421':'1-0','537420':'2-1','537419':'1-1','537429':'2-0','537428':'2-0','537427':'3-0','537430':'0-0'}
    }
  },
  {
    id:'r16',
    matches:[
      {id:537376,apiId:537376,home:'Kanada',away:'Maroko'},
      {id:537375,apiId:537375,home:'Paragwaj',away:'Francja'},
      {id:537377,apiId:537377,home:'Brazylia',away:'Norwegia'},
      {id:537378,apiId:537378,home:'Meksyk',away:'Anglia'},
      {id:537379,apiId:537379,home:'Portugalia',away:'Hiszpania'},
      {id:537380,apiId:537380,home:'USA',away:'Belgia'},
      {id:537381,apiId:537381,home:'Argentyna',away:'Egipt'},
      {id:537382,apiId:537382,home:'Szwajcaria',away:'Kolumbia'}
    ],
    tipsByPlayer:{
      'Andrzej W.':{'537376':'1-3','537375':'0-3','537377':'2-2','537378':'1-1','537379':'1-2','537380':'2-2','537381':'2-1','537382':'0-0'},
      'Paweł':{'537376':'1-2','537375':'0-2','537377':'2-1','537378':'1-2','537379':'1-3','537380':'1-2','537381':'3-0','537382':'1-0'},
      'Iwona':{'537376':'0-2','537375':'0-2','537377':'2-1','537378':'1-1','537379':'0-2','537380':'1-1','537381':'2-0','537382':'1-2'},
      'Tomek':{'537376':'0-2','537375':'0-2','537377':'2-1','537378':'1-1','537379':'0-2','537380':'1-1','537381':'2-0','537382':'1-2'},
      'Łukasz':{'537376':'1-2','537375':'0-2','537377':'2-1','537378':'2-1','537379':'0-2','537380':'1-2','537381':'2-0','537382':'1-1'},
      'Michał':{'537376':'1-2','537375':'1-3','537377':'2-1','537378':'1-2','537379':'2-2','537380':'1-1','537381':'2-1','537382':'1-1'},
      'Leszek':{'537376':'0-1','537375':'0-3','537377':'2-2','537378':'2-1','537379':'1-1','537380':'1-0','537381':'2-0','537382':'1-1'},
      'Lucas':{'537376':'0-2','537375':'1-4','537377':'1-1','537378':'1-2','537379':'2-2','537380':'1-1','537381':'3-1','537382':'1-1'},
      'Ola':{'537376':'0-1','537375':'0-3','537377':'2-3','537378':'1-1','537379':'2-2','537380':'1-2','537381':'1-1','537382':'1-0'},
      'Magda':{'537376':'1-2','537375':'1-3','537377':'3-1','537378':'2-2','537379':'2-2','537380':'2-3','537381':'2-2','537382':'2-3'},
      'Aldona':{'537376':'1-2','537375':'0-2','537377':'1-1','537378':'1-1','537379':'1-2','537380':'2-1','537381':'2-1','537382':'1-1'},
      'Jacek':{'537376':'0-1','537375':'0-3','537377':'2-1','537378':'2-1','537379':'2-2','537380':'1-1','537381':'2-0','537382':'1-2'},
      'Justyna':{'537376':'0-1','537375':'0-2','537377':'1-1','537378':'2-1','537379':'1-2','537380':'1-0','537381':'1-1','537382':'1-1'},
      'Mariusz':{'537376':'1-2','537375':'0-3','537377':'1-1','537378':'1-1','537379':'1-2','537380':'1-1','537381':'3-1','537382':'2-0'},
      'Waldemar':{'537376':'1-1','537375':'0-3','537377':'1-2','537378':'2-2','537379':'3-2','537380':'1-2','537381':'1-1','537382':'1-2'},
      'Alex':{'537376':'1-1','537375':'0-3','537377':'2-1','537378':'1-0','537379':'0-1','537380':'1-2','537381':'3-1','537382':'1-1'},
      'Maria':{'537376':'1-1','537375':'1-2','537377':'3-1','537378':'1-2','537379':'1-2','537380':'1-2','537381':'3-1','537382':'0-1'},
      'Andrzej G.':{'537376':'0-1','537375':'0-2','537377':'1-1','537378':'1-2','537379':'1-2','537380':'1-2','537381':'2-0','537382':'1-1'},
      'Robert':{'537376':'1-2','537375':'0-3','537377':'1-1','537378':'1-1','537379':'1-2','537380':'2-2','537381':'2-1','537382':'1-1'},
      'Kacper':{'537376':'1-2','537375':'1-4','537377':'2-2','537378':'0-0','537379':'1-3','537380':'1-1','537381':'2-1','537382':'1-1'},
      'Agnieszka':{'537376':'1-2','537375':'1-3','537377':'3-2','537378':'2-2','537379':'2-1','537380':'3-1','537381':'2-1','537382':'1-2'},
      'Mateusz':{'537376':'1-2','537375':'0-2','537377':'1-1','537378':'1-2','537379':'1-2','537380':'2-1','537381':'2-0','537382':'1-1'},
      'Borys':{'537376':'0-2','537375':'0-3','537377':'2-1','537378':'1-1','537379':'1-2','537380':'1-1','537381':'2-0','537382':'0-1'},
      'Izunia':{'537376':'1-1','537375':'0-2','537377':'2-1','537378':'1-1','537379':'1-2','537380':'1-2','537381':'2-0','537382':'1-1'}
    }
  },
  {
    id:'qf',
    matches:[
      {id:537383,apiId:537383,home:'Francja',away:'Maroko'},
      {id:537384,apiId:537384,home:'Hiszpania',away:'Belgia'},
      {id:537385,apiId:537385,home:'Norwegia',away:'Anglia'},
      {id:537386,apiId:537386,home:'Argentyna',away:'Szwajcaria'}
    ],
    tipsByPlayer:{
      'Andrzej W.':{'537383':'3-1','537384':'3-1','537385':'1-1','537386':'2-1'},
      'Łukasz':{'537383':'2-0','537384':'1-0','537385':'2-1','537386':'2-0'},
      'Lucas':{'537383':'3-2','537384':'2-1','537385':'2-2','537386':'3-1'},
      'Leszek':{'537383':'2-1','537384':'2-0','537385':'2-2','537386':'2-1'},
      'Mateusz':{'537383':'1-1','537384':'2-1','537385':'2-2','537386':'2-1'},
      'Michał':{'537383':'2-1','537384':'2-0','537385':'2-2','537386':'2-0'},
      'Robert':{'537383':'2-1','537384':'2-0','537385':'1-1','537386':'2-1'},
      'Waldemar':{'537383':'1-1','537384':'2-2','537385':'1-3','537386':'1-2'},
      'Justyna':{'537383':'1-1','537384':'2-0','537385':'1-0','537386':'2-0'},
      'Magda':{'537383':'3-1','537384':'2-1','537385':'2-1','537386':'2-0'},
      'Tomek':{'537383':'2-1','537384':'2-0','537385':'1-2','537386':'1-0'},
      'Iwona':{'537383':'0-0','537384':'1-1','537385':'1-1','537386':'1-1'},
      'Ola':{'537383':'3-1','537384':'1-1','537385':'2-1','537386':'2-2'},
      'Mariusz':{'537383':'2-1','537384':'1-1','537385':'2-1','537386':'2-1'},
      'Jacek':{'537383':'2-0','537384':'1-0','537385':'1-1','537386':'1-1'},
      'Aldona':{'537383':'2-0','537384':'2-0','537385':'1-2','537386':'2-1'},
      'Agnieszka':{'537383':'2-0','537384':'3-0','537385':'1-0','537386':'1-1'},
      'Alex':{'537383':'3-1','537384':'1-0','537385':'2-1','537386':'2-2'},
      'Borys':{'537383':'2-1','537384':'2-0','537385':'1-2','537386':'2-0'},
      'Maria':{'537383':'3-1','537384':'3-2','537385':'1-2','537386':'3-2'},
      'Andrzej G.':{'537383':'1-1','537384':'2-1','537385':'1-2','537386':'2-0'},
      'Paweł':{'537383':'3-1','537384':'2-0','537385':'2-2','537386':'2-1'},
      'Kacper':{'537383':'3-2','537384':'4-2','537385':'1-2','537386':'3-1'},
      'Izunia':{'537383':'2-1','537384':'2-0','537385':'1-2','537386':'2-0'}
    }
  }
];

const KNOCKOUT_SUBMISSIONS = {};

function knockoutTipDotPlayers(){
  const submitted = new Set(Object.values(KNOCKOUT_SUBMISSIONS).flatMap(players => [...players]));
  const requiredMatches = KNOCKOUT_TIP_ROUNDS.flatMap(round =>
    (round.matches || [])
      .filter(match => match.home && match.away)
      .map((match, index) => ({
        round,
        key: match.id || String(index)
      }))
  );

  if(!requiredMatches.length) return submitted;

  const completePlayers = PLAYERS.filter(player =>
    requiredMatches.every(({round, key}) => {
      const tip = round.tipsByPlayer?.[player.name]?.[key];
      return typeof tip === 'string' && tip.trim() !== '';
    })
  );

  if(completePlayers.length !== PLAYERS.length){
    completePlayers.forEach(player => submitted.add(player.name));
  }
  return submitted;
}

const PLAYER_KNOCKOUT_STAGES = [
  {id:'r32', ids:['1/16','r32'], count:16, pl:'1/16 finału', en:'Round of 32'},
  {id:'r16', ids:['1/8','r16'], count:8, pl:'1/8 finału', en:'Round of 16'},
  {id:'qf', ids:['1/4','qf'], count:4, pl:'Ćwierćfinały', en:'Quarter-finals'},
  {id:'sf', ids:['1/2','sf'], count:2, pl:'Półfinały', en:'Semi-finals'},
  {id:'third', ids:['third'], count:1, medalIndex:0, pl:'3. miejsce', en:'Third place'},
  {id:'final', ids:['final'], count:1, medalIndex:1, pl:'Finał', en:'Final'}
];

function togglePlayerPhase(button){
  button.closest('.pdp-phase')?.classList.toggle('open');
}

function togglePlayerRound(button){
  button.closest('.pdp-knockout-round')?.classList.toggle('open');
}

function capturePlayerAccordionState(root){
  if(!root)return null;
  return {
    phases:[...root.querySelectorAll('.pdp-phase')].map(element=>element.classList.contains('open')),
    rounds:Object.fromEntries([...root.querySelectorAll('[data-player-round]')].map(element=>[
      element.dataset.playerRound,
      element.classList.contains('open')
    ]))
  };
}

function restorePlayerAccordionState(root,state){
  if(!root||!state)return;
  root.querySelectorAll('.pdp-phase').forEach((element,index)=>{
    if(index<state.phases.length)element.classList.toggle('open',state.phases[index]);
  });
  root.querySelectorAll('[data-player-round]').forEach(element=>{
    const open=state.rounds[element.dataset.playerRound];
    if(typeof open==='boolean')element.classList.toggle('open',open);
  });
}

function knockoutRoundComplete(round){
  const matches=(round?.matches||[]).filter(match=>match.home&&match.away);
  return matches.length>0&&PLAYERS.every(player=>matches.every((match,index)=>{
    const key=match.id||String(index);
    const tip=round.tipsByPlayer?.[player.name]?.[key];
    return typeof tip==='string'&&tip.trim()!=='';
  }));
}

function knockoutRoundTipsRevealAllowed(stageId){
  const uiRound=KNOCKOUT_ROUNDS.find(round=>round.id===stageId);
  if(!uiRound)return true;
  const matches=knockoutMatches().slice(uiRound.start,uiRound.start+uiRound.count);
  const formMatches=uiRound.form==='hso-typowanie1.html'
    ? knockoutMatches().slice(30,32)
    : matches;
  const revealDeadline=knockoutDeadline(formMatches[0]?.utcDate,uiRound.id);
  return !revealDeadline||Date.now()>=revealDeadline.getTime();
}

function playerKnockoutStageData(stage,p){
  let rounds=KNOCKOUT_TIP_ROUNDS.filter(round=>stage.ids.includes(round.id));
  let matches=rounds.flatMap(round=>(round.matches||[])
    .filter(match=>match.home&&match.away)
    .map((match,index)=>({round,match,key:match.id||String(index)})));
  if(!matches.length&&Number.isInteger(stage.medalIndex)){
    const medalRound=KNOCKOUT_TIP_ROUNDS.find(round=>round.id==='medale');
    const medalMatch=medalRound?.matches?.[stage.medalIndex];
    if(medalRound&&medalMatch?.home&&medalMatch?.away){
      rounds=[medalRound];
      matches=[{round:medalRound,match:medalMatch,key:medalMatch.id||String(stage.medalIndex)}];
    }
  }
  const visible=rounds.length>0&&rounds.every(knockoutRoundComplete)&&knockoutRoundTipsRevealAllowed(stage.id);
  const tips=matches.filter(({round,key})=>{
    const tip=round.tipsByPlayer?.[p.name]?.[key];
    return typeof tip==='string'&&tip.trim()!=='';
  }).length;
  const uiRound=KNOCKOUT_ROUNDS.find(round=>round.id===stage.id);
  const complete=uiRound?knockoutUiRoundComplete(uiRound,knockoutMatches()):false;
  return {rounds,matches,visible,tips,complete};
}

function playerSubsectionLabel(title){
  return `<div class="pdp-subsection-lbl">
    <span class="pdp-subsection-lbl-title">${title}</span>
    <span class="pdp-subsection-col">${lt('Wynik','Result','Risultato')}</span>
    <span class="pdp-subsection-col">${lt('Typ / pkt','Tip / pts','Pronostico / pt')}</span>
  </div>`;
}

function playerKnockoutMatchMeta(match){
  const apiId=Number(match?.apiId??match?.id);
  const apiMatch=Number.isFinite(apiId)?API_MATCHES.find(item=>item.id===apiId):null;
  return apiMatch?.utcDate?knockoutDate(apiMatch.utcDate):(match?.date||'—');
}

function playerKnockoutTeams(match){
  return `<span class="pdp-team-line">${flag(match.home)}<span>${teamName(match.home)}</span></span>
    <span class="pdp-team-line">${flag(match.away)}<span>${teamName(match.away)}</span></span>`;
}

function playerKnockoutPhaseRows(p){
  const allMatches=knockoutMatches();
  const currentId=KNOCKOUT_ROUNDS[currentKnockoutRoundIndex(allMatches)]?.id||'r32';
  const orderedStages=[...PLAYER_KNOCKOUT_STAGES].sort((a,b)=>{
    const aRound=KNOCKOUT_ROUNDS.find(round=>round.id===a.id);
    const bRound=KNOCKOUT_ROUNDS.find(round=>round.id===b.id);
    return Number(knockoutUiRoundComplete(aRound,allMatches))-Number(knockoutUiRoundComplete(bRound,allMatches));
  });
  const content=orderedStages.map(stage=>{
    const data=playerKnockoutStageData(stage,p);
    const name=knockoutRoundName(KNOCKOUT_ROUNDS.find(round=>round.id===stage.id)||stage);
    let body;
    if(!data.matches.length){
      body=`<div class="pdp-round-empty">${lt('Oczekiwanie na typy i pary.','Waiting for predictions and fixtures.','In attesa di pronostici e abbinamenti.')}</div>`;
    }else if(!data.visible){
      body=`<div class="pdp-round-empty">${data.tips}/${data.matches.length} · ${lt('typy ukryte','predictions hidden','pronostici nascosti')}</div>`;
    }else{
      body=`${playerSubsectionLabel(lt('Mecze pucharowe','Knockout matches','Partite a eliminazione'))}${data.matches.map(({round,match,key})=>{
        const tip=round.tipsByPlayer?.[p.name]?.[key]||'—';
        const result=knockoutMatchResult(match);
        const points=result&&tip!=='—'?sc(tip,result):null;
        const resultClass=points===null?'rq':`r${points}`;
        const pointsText=points===null?'—':`${points} ${pointsLabel(points)}`;
        return `<div class="pdp-match ${resultClass}">
          <span class="pdp-fixture">
            <span class="pdp-kickoff">${playerKnockoutMatchMeta(match)}</span>
            ${playerKnockoutTeams(match)}
          </span>
          <span class="pdp-result">${result||'—'}</span>
          <span class="pdp-tip-card"><strong>${tip}</strong><small>${pointsText}</small></span>
        </div>`;
      }).join('')}`;
    }
    const status=data.complete
      ? lt('zakończona','completed','terminata')
      : stage.id===currentId
        ? lt('aktualna','current','attuale')
        : lt('oczekiwanie','waiting','in attesa');
    return `<section class="pdp-knockout-round${stage.id===currentId?' open':''}${data.complete?' done':''}" data-player-round="${stage.id}">
      <button class="pdp-round-toggle" type="button" onclick="togglePlayerRound(this)">
        <span>${name}</span><span class="pdp-round-status">${status}</span><span class="pdp-round-chevron">⌄</span>
      </button>
      <div class="pdp-round-body">${body}</div>
    </section>`;
  }).join('');
  return content;
}

function groupReportLink(){
  return `<a class="phase-report-link" href="${groupReportHref()}">${lt('Otwórz statyczny raport fazy grupowej','Open the static group-stage report','Apri il report statico della fase a gironi')}</a>`;
}

function playerGroupPhaseRows(p){
  const source=window.HSO_GROUP_REPORT;
  const player=source?.players?.find(item=>item.name===p.name);
  if(!source?.matches?.length||!player?.tips?.length)return groupReportLink();
  const rows=source.matches.map((match,index)=>{
    const tip=player.tips?.[index]||'—';
    const points=sc(tip,match.result)??0;
    const resultClass=`r${points}`;
    return `<div class="pdp-match pdp-group-match ${resultClass}">
      <span class="pdp-fixture">
        <span class="pdp-kickoff">${lt('Grupa','Group','Girone')} ${match.g} · ${match.date}</span>
        <span class="pdp-team-line">${flag(match.home)}<span>${teamName(match.home)}</span></span>
        <span class="pdp-team-line">${flag(match.away)}<span>${teamName(match.away)}</span></span>
      </span>
      <span class="pdp-result">${match.result}</span>
      <span class="pdp-tip-card"><strong>${tip}</strong><small>${points} ${pointsLabel(points)}</small></span>
    </div>`;
  }).join('');
  return `${playerSubsectionLabel(lt('Mecze fazy grupowej','Group-stage matches','Partite fase a gironi'))}${rows}${groupReportLink()}`;
}

function buildPlayerPhases(p){
  const ranked=calcAll().find(player=>player.name===p.name)||p;
  return `<section class="pdp-phase open">
      <button class="pdp-phase-toggle" type="button" onclick="togglePlayerPhase(this)">
        <span class="pdp-phase-title">${lt('Faza pucharowa','Knockout stage','Fase a eliminazione')}</span>
        <span class="pdp-phase-summary">${lt('rundy','rounds','turni')}</span>
        <span class="pdp-phase-chevron">⌄</span>
      </button>
      <div class="pdp-phase-body">${playerKnockoutPhaseRows(p)}</div>
    </section>
    <section class="pdp-phase">
      <button class="pdp-phase-toggle" type="button" onclick="togglePlayerPhase(this)">
        <span class="pdp-phase-title">${lt('Faza grupowa','Group stage','Fase a gironi')}</span>
        <span class="pdp-phase-summary">${ranked.group.pts} ${pointsLabel(ranked.group.pts)}</span>
        <span class="pdp-phase-chevron">⌄</span>
      </button>
      <div class="pdp-phase-body">
        <div class="phase-baseline">
          <span><strong>${ranked.group.pts}</strong>${lt('punktów','points','punti')}</span>
          <span><strong>${ranked.group.ex}</strong>${lt('trafień za 3','exact scores','risultati esatti')}</span>
          <span><strong>${ranked.group.en}</strong>${lt('trafień za 1','outcomes','esiti corretti')}</span>
        </div>
        ${playerGroupPhaseRows(ranked)}
      </div>
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
  'BiH':'ba','WKS':'ci','RZP':'cv',
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
function disp(t){ return LANG==='pl' ? (MATCH_SHORT[t]||t) : teamName(t); }
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
function knockoutMatchResult(match){
  if(/^\d+-\d+$/.test(match?.result||''))return match.result;
  const direct=match?.status==='FINISHED'?apiRegulationScore(match):null;
  if(Number.isInteger(direct?.home)&&Number.isInteger(direct?.away))return `${direct.home}-${direct.away}`;
  const apiId=Number(match?.apiId??match?.id);
  return Number.isFinite(apiId)?apiResult(API_MATCHES.find(item=>item.id===apiId)):null;
}

function completedKnockoutEntries(){
  return KNOCKOUT_TIP_ROUNDS.flatMap(round=>(round.matches||[]).map((match,index)=>{
    const key=match.id||String(index);
    const result=knockoutMatchResult(match);
    return result?{round,match,key,result,token:`${round.id}:${key}`}:null;
  }).filter(Boolean));
}

function calcAll(excludedToken=null){
  const entries=completedKnockoutEntries();
  return PLAYERS.map(p=>{
    let pts=p.group.pts,ex=p.group.ex,en=p.group.en;
    entries.forEach(({round,key,result,token})=>{
      if(token===excludedToken)return;
      const value=sc(round.tipsByPlayer?.[p.name]?.[key],result);
      if(value===3){pts+=3;ex++;}
      else if(value===1){pts++;en++;}
    });
    return{...p,pts,ex,en};
  }).sort((a,b)=>{
    if(b.pts!==a.pts)return b.pts-a.pts;
    if(b.ex!==a.ex)return b.ex-a.ex;
    return a.name.localeCompare(b.name,'pl');
  });
}

function assignPositions(ranked){
  ranked.forEach((p,i)=>{
    if(i===0)p._pos=1;
    else{
      const prev=ranked[i-1];
      p._pos=(p.pts===prev.pts&&p.ex===prev.ex)?prev._pos:i+1;
    }
  });
  return ranked;
}

function rankingMovement(){
  const latest=completedKnockoutEntries().sort((a,b)=>
    Date.parse(b.match.utcDate||b.match.date||0)-Date.parse(a.match.utcDate||a.match.date||0)
  )[0];
  if(!latest)return {};
  const previous=assignPositions(calcAll(latest.token));
  return Object.fromEntries(previous.map(p=>[p.name,p._pos]));
}

function playerStats(p){
  const ranked=calcAll().find(player=>player.name===p.name)||p;
  const played=72+completedKnockoutEntries().length;
  return{
    ...ranked,
    played,
    efficiency:played?Math.round((ranked.ex+ranked.en)/played*100):0,
    average:played?(ranked.pts/played).toFixed(2).replace('.',LANG==='en'?'.':','):(LANG==='en'?'0.00':'0,00')
  };
}

let _countdownTimer=null;
let _countdownMatch=null;

function formatCountdown(ms){
  if(ms<=0)return null;
  const totalSec=Math.floor(ms/1000);
  const days=Math.floor(totalSec/86400);
  const hours=Math.floor((totalSec%86400)/3600);
  const mins=Math.floor((totalSec%3600)/60);
  const secs=totalSec%60;
  const pad=n=>String(n).padStart(2,'0');
  if(days>0)return `<span style="color:var(--gold)">${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s</span>`;
  if(hours>0)return `<span style="color:var(--amber)">${pad(hours)}h ${pad(mins)}m ${pad(secs)}s</span>`;
  return `<span style="color:var(--green)">${pad(mins)}m ${pad(secs)}s</span>`;
}

function knockoutSummaryStatus(match){
  if(match?.status==='FINISHED')return 'done';
  const diff=Date.now()-Date.parse(match?.utcDate);
  if(['IN_PLAY','LIVE','PAUSED'].includes(match?.status))return diff<=4*60*60*1000?'live':'waiting';
  if(diff<0)return 'soon';
  return diff<=4*60*60*1000?'live':'waiting';
}

function knockoutSummaryTeam(team){
  const name=knockoutTeamName(team);
  const code=KNOCKOUT_FLAG_BY_TLA[team?.tla]||ISO[name];
  const image=code?`<img src="img/flags/${code}.png" width="16" height="12" alt="${name}" style="vertical-align:middle;border-radius:2px;margin:0 2px">`:'';
  return{name,image};
}

function nextKnockoutMatchHTML(match){
  const status=knockoutSummaryStatus(match);
  const home=knockoutSummaryTeam(match.homeTeam);
  const away=knockoutSummaryTeam(match.awayTeam);
  if(['live','paused'].includes(status)){
    const score=apiLiveScore(match);
    const card=document.querySelector('.next-match-card');
    card?.classList.add('is-live');
    card?.classList.remove('is-upcoming');
    return `<span class="live-summary">
      <span class="live-summary-status"><span class="dot dot-live"></span><span class="live-summary-status-text">${tr(status)}</span></span>
      <span class="live-summary-vertical">
        <span class="live-summary-team"><span class="live-summary-name">${home.image} ${home.name}</span><span class="live-summary-score">${score.home}</span></span>
        <span class="live-summary-team"><span class="live-summary-name">${away.image} ${away.name}</span><span class="live-summary-score">${score.away}</span></span>
      </span>
      <span class="live-summary-scoreboard">
        <span class="live-summary-side home">${home.image}<span class="live-summary-team-name">${home.name}</span></span>
        <strong class="live-summary-result">${score.home}–${score.away}</strong>
        <span class="live-summary-side away"><span class="live-summary-team-name">${away.name}</span>${away.image}</span>
      </span>
    </span>`;
  }
  const card=document.querySelector('.next-match-card');
  card?.classList.remove('is-live');
  card?.classList.add('is-upcoming');
  const dt=new Date(match.utcDate);
  const date=new Intl.DateTimeFormat('pl-PL',{timeZone:'Europe/Warsaw',day:'2-digit',month:'2-digit'}).format(dt);
  const time=new Intl.DateTimeFormat('pl-PL',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit'}).format(dt);
  const countdown=formatCountdown(dt-Date.now());
  const countdownHtml=countdown?`⏱ ${countdown}`:'';
  return `<span class="upcoming-summary">
    <span class="upcoming-summary-status"><span class="dot dot-soon"></span></span>
    <span class="upcoming-summary-vertical">
      <span style="display:block;font-size:13px;font-weight:500;color:#fff;line-height:1.3">${date} · ${time}</span>
      <span style="display:block;font-size:12px;color:var(--muted);margin-top:2px;line-height:1.3">${home.image} ${home.name} – ${away.name} ${away.image}</span>
      ${countdown?`<span class="countdown-tick" style="display:block;font-size:11px;font-weight:500;margin-top:4px;font-family:'Barlow Condensed',sans-serif;letter-spacing:.5px">${countdownHtml}</span>`:''}
    </span>
    <span class="upcoming-summary-scoreboard">
      <span class="live-summary-side home">${home.image}<span class="live-summary-team-name">${home.name}</span></span>
      <span class="upcoming-summary-center"><strong>${date} · ${time}</strong>${countdown?`<span class="countdown-tick">${countdownHtml}</span>`:''}</span>
      <span class="live-summary-side away"><span class="live-summary-team-name">${away.name}</span>${away.image}</span>
    </span>
  </span>`;
}

function nextKnockoutMatch(){
  const matches=knockoutMatches()
    .filter(match=>hasKnockoutTeam(match.homeTeam)&&hasKnockoutTeam(match.awayTeam));
  const live=matches.find(match=>['live','paused'].includes(knockoutSummaryStatus(match)));
  if(live){
    setFeaturedKnockoutMatch(live);
    document.getElementById('nextMatchLabel').textContent=lt('Mecz trwa','Match live','Partita in corso');
    stopCountdown();_countdownMatch=null;
    return nextKnockoutMatchHTML(live);
  }
  const upcoming=matches.filter(match=>knockoutSummaryStatus(match)==='soon')
    .sort((a,b)=>Date.parse(a.utcDate)-Date.parse(b.utcDate))[0];
  if(!upcoming){
    setFeaturedKnockoutMatch(null);
    const card=document.querySelector('.next-match-card');
    card?.classList.remove('is-live','is-upcoming');
    stopCountdown();_countdownMatch=null;return '—';
  }
  setFeaturedKnockoutMatch(upcoming);
  document.getElementById('nextMatchLabel').textContent=tr('nextMatch');
  _countdownMatch=upcoming;startCountdown();
  return nextKnockoutMatchHTML(upcoming);
}

function tickCountdown(){
  const elements=document.querySelectorAll('.countdown-tick');
  if(!elements.length||!_countdownMatch)return;
  const diff=Date.parse(_countdownMatch.utcDate)-Date.now();
  const countdown=diff>0?formatCountdown(diff):null;
  if(countdown)elements.forEach(el=>el.innerHTML=`⏱ ${countdown}`);
  else elements.forEach(el=>el.remove());
}

function nextMatch(){return nextKnockoutMatch();}

function setFeaturedKnockoutMatch(match){
  featuredKnockoutMatchId=match?String(match.id):null;
  const card=document.querySelector('.next-match-card');
  if(!card)return;
  card.classList.toggle('has-match-link',Boolean(match));
  if(match){
    const home=knockoutTeamName(match.homeTeam);
    const away=knockoutTeamName(match.awayTeam);
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-label',lt(`Otwórz typy meczu ${home} – ${away}`,`Open predictions for ${home} versus ${away}`,`Apri i pronostici di ${home} - ${away}`));
  }else{
    card.removeAttribute('role');
    card.removeAttribute('tabindex');
    card.removeAttribute('aria-label');
  }
}

function openFeaturedKnockoutMatch(){
  if(!featuredKnockoutMatchId)return;
  const allMatches=knockoutMatches();
  const matchIndex=allMatches.findIndex(match=>String(match.id)===featuredKnockoutMatchId);
  if(matchIndex<0)return;
  const roundIndex=KNOCKOUT_ROUNDS.findIndex(round=>matchIndex>=round.start&&matchIndex<round.start+round.count);
  if(roundIndex<0)return;
  selectedKnockoutRound=roundIndex;
  knockoutRoundSelectionManual=true;
  expandedKnockoutMatchId=featuredKnockoutMatchId;
  switchTab('pucharowa',document.getElementById('tabKnockoutBtn'));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const tile=document.querySelector(`[data-ko-match-id="${featuredKnockoutMatchId}"]`);
    tile?.scrollIntoView({behavior:'smooth',block:'start'});
    tile?.focus({preventScroll:true});
  }));
}

function initFeaturedKnockoutLink(){
  const card=document.querySelector('.next-match-card');
  if(!card)return;
  card.addEventListener('click',openFeaturedKnockoutMatch);
  card.addEventListener('keydown',event=>{
    if(!['Enter',' '].includes(event.key)||!featuredKnockoutMatchId)return;
    event.preventDefault();
    openFeaturedKnockoutMatch();
  });
}

function fitLiveSummaryNames(){
  if(!window.matchMedia('(max-width:640px)').matches)return;
  document.querySelectorAll('.live-summary-team-name').forEach(name=>{
    let size=15;
    name.style.fontSize=`${size}px`;
    while(name.scrollWidth>name.clientWidth&&size>10){
      size-=0.5;
      name.style.fontSize=`${size}px`;
    }
  });
}

window.addEventListener('resize',()=>requestAnimationFrame(fitLiveSummaryNames));

function startCountdown(){
  stopCountdown();
  _countdownTimer=setInterval(tickCountdown,1000);
}

function stopCountdown(){
  if(_countdownTimer){clearInterval(_countdownTimer);_countdownTimer=null;}
}

function isMobile(){return window.innerWidth<=540;}

let activePlayer=null;

function playerOverview(p){
  const played=72+completedKnockoutEntries().length;
  const average=played?(p.pts/played).toFixed(2).replace('.',LANG==='en'?'.':','):'0';
  return `<div class="sp-overview-item"><span>${lt('rozegrane','played','giocate')}</span><strong>${played}</strong></div>
    <div class="sp-overview-item"><span>${lt('punkty','points','punti')}</span><strong>${p.pts}</strong></div>
    <div class="sp-overview-item"><span>${lt('średnia','average','media')}</span><strong>${average}</strong></div>`;
}

function buildSpRows(p){
  return buildPlayerPhases(p);
}

function buildExpRows(p){return buildSpRows(p);}

function openPanel(name,ranked,accordionState=null){
  const p=ranked.find(x=>x.name===name);
  activePlayer=name;
  if(isMobile()){
    document.body.classList.remove('ranking-panel-open');
    document.querySelectorAll('.expand-tr.open').forEach(r=>r.classList.remove('open'));
    const exp=document.getElementById('exp-'+name);
    if(exp){
      exp.classList.add('open');
      document.getElementById('exp-in-'+name).innerHTML=
        `<div class="exp-champ-line">${tr('champion')}: <strong>${p.champ?teamName(p.champ):'—'}</strong> &nbsp;·&nbsp; ${p.pts} ${pointsLabel(p.pts)} (${p.ex}×3 + ${p.en}×1)</div>`
        +buildExpRows(p);
      restorePlayerAccordionState(document.getElementById('exp-in-'+name),accordionState);
    }
  } else {
    document.body.classList.add('ranking-panel-open');
    document.getElementById('spName').textContent=name;
    document.getElementById('spSub').textContent=`${p.pts} ${pointsLabel(p.pts)} · ${p.ex}× 3 ${pointsLabel(3)} + ${p.en}× 1 ${pointsLabel(1)}`;
    document.getElementById('spChamp').textContent=p.champ?teamName(p.champ):'—';
    document.getElementById('spOverview').innerHTML=playerOverview(p);
    document.getElementById('spMatches').innerHTML=buildSpRows(p);
    restorePlayerAccordionState(document.getElementById('spMatches'),accordionState);
    document.getElementById('sidePanel').classList.add('open');
    document.getElementById('rankingWrap').classList.add('panel-open');
  }
  document.querySelectorAll('#rankingBody tr.row').forEach(tr=>
    tr.classList.toggle('hi',tr.dataset.name===name));
}
function closePanel(){
  activePlayer=null;
  document.body.classList.remove('ranking-panel-open');
  document.getElementById('sidePanel').classList.remove('open');
  document.getElementById('rankingWrap').classList.remove('panel-open');
  document.querySelectorAll('.expand-tr.open').forEach(r=>r.classList.remove('open'));
  document.querySelectorAll('#rankingBody tr').forEach(tr=>tr.classList.remove('hi'));
}

function renderRanking(){
  const rankingAccordionRoot=activePlayer
    ? (isMobile()?document.getElementById('exp-in-'+activePlayer):document.getElementById('spMatches'))
    : null;
  const rankingAccordionState=capturePlayerAccordionState(rankingAccordionRoot);
  const ranked=assignPositions(calcAll());
  const previousPositions=rankingMovement();
  const played=72+completedKnockoutEntries().length;
  const leaderPts=ranked[0]?.pts;
  const leaders=played>0 ? ranked.filter(p=>p._pos===1) : [];
  const manyLeaders=leaders.length>1;
  const leaderNames=leaders.map(p=>p.name).join(', ');
  document.getElementById('s-played').textContent=`${played} / 104`;
  document.getElementById('s-leader-label').textContent=manyLeaders?tr('leaders'):tr('leader');
  document.getElementById('s-leadpts-label').textContent=manyLeaders?tr('leadersPoints'):tr('leaderPoints');
  const leaderEl=document.getElementById('s-leader');
  leaderEl.textContent=leaderNames||'—';
  leaderEl.classList.toggle('leaders',manyLeaders);
  document.getElementById('s-leadpts').textContent=played>0?leaderPts:'—';
  document.getElementById('s-next').innerHTML=nextMatch();
  requestAnimationFrame(fitLiveSummaryNames);
  document.fonts?.ready.then(fitLiveSummaryNames);

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
      openPanel(activePlayer,ranked,rankingAccordionState);
    }else{
      closePanel();
    }
  }
}

function updateMobileSectionBack(){
  const button=document.getElementById('mobileSectionBack');
  const playersTab=document.getElementById('tab-gracze');
  const rankingTab=document.getElementById('tab-ranking');
  const knockoutTab=document.getElementById('tab-pucharowa');
  const historyTab=document.getElementById('tab-grupowa');
  const playersVisible=playersTab&&playersTab.style.display!=='none';
  const rankingVisible=rankingTab&&rankingTab.style.display!=='none';
  const knockoutVisible=knockoutTab&&knockoutTab.style.display!=='none';
  const historyVisible=historyTab&&historyTab.style.display!=='none';
  const anchor=playersVisible?playersTab:rankingVisible?rankingTab:knockoutVisible?knockoutTab:historyVisible?historyTab:null;
  const pastAnchor=anchor&&(window.scrollY>anchor.getBoundingClientRect().top+window.scrollY+260);
  button?.classList.toggle('visible',Boolean(anchor&&pastAnchor));
}

let historyPointsFilter='all';
let expandedHistoryMatchKey=null;

function historyPlayerGroups(entries){
  const groups={3:[],1:[],0:[]};
  entries.forEach(entry=>{
    if(groups[entry.points])groups[entry.points].push(entry);
  });
  return [3,1,0].map(points=>{
    const cls=points===3?'lbl-g':points===1?'lbl-a':'lbl-r';
    const chip=points===3?'chip-g':points===1?'chip-a':'chip-r';
    return `<div class="exp-section">
      <div class="exp-lbl ${cls}">${points} ${pointsLabel(points)} · ${groups[points].length}</div>
      <div class="chips">${groups[points].map(entry=>`<span class="chip ${chip}"><span class="chip-pname">${entry.name}</span><span class="chip-tip">${entry.tip}</span></span>`).join('')}</div>
    </div>`;
  }).join('');
}

function groupHistoryMatches(){
  const source=window.HSO_GROUP_REPORT;
  if(!source?.matches||!source?.players)return [];
  return source.matches.map((match,index)=>{
    const entries=source.players.map(player=>({
      name:player.name,
      tip:player.tips?.[index]||'—',
      points:sc(player.tips?.[index],match.result)??0
    })).sort((a,b)=>a.name.localeCompare(b.name,'pl',{sensitivity:'base'}));
    const exact=entries.filter(entry=>entry.points===3).length;
    const outcome=entries.filter(entry=>entry.points===1).length;
    return {
      key:`group:${match.id||index}`,
      round:'group',
      roundLabel:`${lt('Faza grupowa','Group stage','Fase a gironi')} · ${lt('Grupa','Group','Girone')} ${match.g}`,
      date:match.date,
      home:match.home,
      away:match.away,
      result:match.result,
      status:lt('Zakończony','Finished','Terminata'),
      entries,
      exact,
      outcome,
      misses:entries.length-exact-outcome,
      available:true
    };
  });
}

function knockoutHistoryMatches(){
  const apiMatches=knockoutMatches();
  return KNOCKOUT_TIP_ROUNDS.flatMap(tipRound=>{
    const uiRound=KNOCKOUT_ROUNDS.find(round=>round.id===tipRound.id);
    const revealAllowed=knockoutRoundTipsRevealAllowed(tipRound.id);
    const roundMatches=uiRound?apiMatches.slice(uiRound.start,uiRound.start+uiRound.count):[];
    return (tipRound.matches||[]).filter(match=>match.home&&match.away).map((match,index)=>{
      const apiMatch=roundMatches.find(item=>item.id===Number(match.apiId??match.id))||API_MATCHES.find(item=>item.id===Number(match.apiId??match.id));
      const result=knockoutMatchResult(match);
      const complete=knockoutRoundComplete(tipRound);
      const available=complete&&revealAllowed;
      const entries=available?PLAYERS.map(player=>{
        const tip=tipRound.tipsByPlayer?.[player.name]?.[match.id||String(index)]||'—';
        return {name:player.name,tip,points:result?sc(tip,result)??0:0};
      }).sort((a,b)=>a.name.localeCompare(b.name,'pl',{sensitivity:'base'})):[];
      const exact=result?entries.filter(entry=>entry.points===3).length:0;
      const outcome=result?entries.filter(entry=>entry.points===1).length:0;
      const roundLabel=knockoutRoundName(uiRound||{pl:tipRound.id,en:tipRound.id,it:tipRound.id});
      return {
        key:`ko:${tipRound.id}:${match.id||index}`,
        round:tipRound.id,
        roundLabel,
        date:apiMatch?.utcDate?knockoutDate(apiMatch.utcDate):(match.date||'—'),
        home:match.home,
        away:match.away,
        result:result||'—',
        status:result?lt('Zakończony','Finished','Terminata'):lt('Nierozstrzygnięty','Pending','In attesa'),
        entries,
        exact,
        outcome,
        misses:result?entries.length-exact-outcome:0,
        available,
        hiddenReason:complete
          ? lt('Typy są wprowadzone, ale zostaną pokazane po terminie ujawnienia.','Predictions are entered, but will be shown after the reveal deadline.','I pronostici sono inseriti, ma saranno visibili dopo la scadenza.')
          : lt('Typy tej rundy nie są jeszcze kompletne.','Predictions for this round are not complete yet.','I pronostici di questo turno non sono ancora completi.')
      };
    });
  });
}

function historyFilterLabel(filter){
  const labels={
    all:lt('Wszystkie','All','Tutte'),
    group:lt('Faza grupowa','Group stage','Fase a gironi'),
    r32:lt('1/16','Round of 32','Sedicesimi'),
    r16:lt('1/8','Round of 16','Ottavi'),
    qf:lt('1/4','Quarter-finals','Quarti')
  };
  return labels[filter]||filter;
}

function renderGroupArchive(){
  const archive=document.getElementById('groupArchive');
  if(!archive)return;
  const ranked=assignPositions(calcAll()).sort((a,b)=>b.group.pts-a.group.pts||b.group.ex-a.group.ex||a.name.localeCompare(b.name,'pl',{sensitivity:'base'}));
  const groupMatches=groupHistoryMatches();
  const knockoutMatchesHistory=knockoutHistoryMatches();
  const matches=[...groupMatches,...knockoutMatchesHistory];
  const filtered=matches.filter(match=>historyPointsFilter==='all'
    || match.round===historyPointsFilter);
  archive.innerHTML=`
    <div class="group-archive-head">
      <div>
        <p class="eyebrow">${lt('Archiwum','Archive','Archivio')}</p>
        <h2>${lt('Historia punktów','Point history','Storico punti')}</h2>
        <p>${lt('Kafle wszystkich meczów z rozwijaną listą punktów graczy. Faza grupowa korzysta z zamrożonego raportu, a faza pucharowa z aktualnych typów i wyników.','Match cards with expandable player-point lists. Group-stage data comes from the frozen report; knockout data uses current predictions and results.','Schede di tutte le partite con elenco punti espandibile. La fase a gironi usa il report congelato, la fase a eliminazione usa pronostici e risultati attuali.')}</p>
      </div>
      <a class="group-archive-report" href="${groupReportHref()}">${lt('Pełny raport','Full report','Report completo')}</a>
    </div>
    <div class="history-filter-bar" role="tablist" aria-label="${lt('Filtr rund','Round filter','Filtro turni')}">
      ${['all','group','r32','r16','qf'].map(filter=>`<button class="history-filter${historyPointsFilter===filter?' active':''}" type="button" data-history-filter="${filter}">${historyFilterLabel(filter)}</button>`).join('')}
    </div>
    <div class="history-match-grid">
      ${filtered.map(match=>`<article class="history-match${expandedHistoryMatchKey===match.key?' expanded':''}" data-history-key="${match.key}" tabindex="0" role="button" aria-expanded="${expandedHistoryMatchKey===match.key}">
        <div class="history-match-top"><span>${match.roundLabel}</span><span>${match.date}</span></div>
        <div class="history-scoreline">
          <span class="history-team home">${flag(match.home)}<strong>${teamName(match.home)}</strong></span>
          <span class="history-result">${match.result}</span>
          <span class="history-team away"><strong>${teamName(match.away)}</strong>${flag(match.away)}</span>
        </div>
        <div class="history-match-foot">
          <span>${match.status}</span>
          <span class="history-points-summary"><b class="p3">${match.exact}</b> / <b class="p1">${match.outcome}</b> / <b class="p0">${match.misses}</b></span>
        </div>
        <div class="history-details" ${expandedHistoryMatchKey===match.key?'':'hidden'}>
          ${match.available
            ? historyPlayerGroups(match.entries)
            : `<div class="ko-details-empty">${match.hiddenReason||lt('Brak widocznych typów dla tego meczu.','No visible predictions for this match.','Nessun pronostico visibile per questa partita.')}</div>`}
        </div>
      </article>`).join('')}
    </div>
    <div class="group-archive-footer">
      <div>
        <strong>${lt('Źródło fazy grupowej','Group-stage source','Fonte fase a gironi')}</strong>
        <span>${lt('Pełny statyczny raport pozostaje dostępny jako wersja do druku i PDF.','The full static report remains available as the print/PDF version.','Il report statico completo resta disponibile come versione stampa/PDF.')}</span>
      </div>
      <a class="group-archive-report secondary" href="${groupReportHref()}">${lt('Otwórz raport','Open report','Apri report')}</a>
    </div>`;
  archive.querySelectorAll('[data-history-filter]').forEach(button=>button.addEventListener('click',event=>{
    historyPointsFilter=button.dataset.historyFilter;
    expandedHistoryMatchKey=null;
    renderGroupArchive();
  }));
  archive.querySelectorAll('[data-history-key]').forEach(card=>{
    const toggle=()=>{
      expandedHistoryMatchKey=expandedHistoryMatchKey===card.dataset.historyKey?null:card.dataset.historyKey;
      renderGroupArchive();
    };
    card.addEventListener('click',toggle);
    card.addEventListener('keydown',event=>{
      if(!['Enter',' '].includes(event.key))return;
      event.preventDefault();
      toggle();
    });
  });
}

function backToPageTop(){
  window.scrollTo({top:0,behavior:'smooth'});
}

window.addEventListener('scroll',updateMobileSectionBack,{passive:true});
window.addEventListener('resize',updateMobileSectionBack);

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
  const hasResults = true;
  const tipDotPlayers = knockoutTipDotPlayers();

  sorted.forEach((rp, i) => {
    const p = PLAYERS.find(x => x.name === rp.name);
    if(!p) return;
    const card = document.createElement('div');
    const hasTips = true;
    const showTipDot = tipDotPlayers.has(p.name);
    const isLeader = hasResults && rp._pos === 1;
    card.className = 'fifa-card' + (isLeader ? ' leader' : '') + (hasTips ? ' has-tips' : '') + (showTipDot ? ' tips-submitted' : '');
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
        <div class="card-hso">${lt('MŚ','WC','CM')}</div>
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
  const accordionState = !scroll ? capturePlayerAccordionState(document.getElementById('pdpMatches')) : null;
  activePlayerCard = p.name;
  document.getElementById('pdpName').textContent = p.name;
  document.getElementById('pdpSub').textContent = '';
  document.getElementById('pdpChamp').textContent = p.champ ? teamName(p.champ) : '—';
  const stats=playerStats(p);
  document.getElementById('pdpStats').innerHTML=`
    <div class="pdp-stat"><strong>${stats.pts}</strong><span>${tr('points')}</span></div>
    <div class="pdp-stat"><strong>${stats.ex}</strong><span>3 ${pointsLabel(3)}</span></div>
    <div class="pdp-stat"><strong>${stats.en}</strong><span>1 ${pointsLabel(1)}</span></div>
    <div class="pdp-stat"><strong>${stats.average}</strong><span>${tr('pointsPerMatch')}</span></div>`;

  const cont = document.getElementById('pdpMatches');
  cont.innerHTML = buildPlayerPhases(p);
  restorePlayerAccordionState(cont,accordionState);

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
  {id:'r32', pl:'1/16 finału', en:'Round of 32', it:'Sedicesimi', count:16, start:0, form:'hso-typowanie16.html'},
  {id:'r16', pl:'1/8 finału', en:'Round of 16', it:'Ottavi', count:8, start:16, form:'hso-typowanie8.html'},
  {id:'qf', pl:'Ćwierćfinały', en:'Quarter-finals', it:'Quarti', count:4, start:24, form:'hso-typowanie4.html'},
  {id:'sf', pl:'Półfinały', en:'Semi-finals', it:'Semifinali', count:2, start:28, form:'hso-typowanie2.html'},
  {id:'third', pl:'3. miejsce', en:'Third place', it:'3° posto', count:1, start:30, form:'hso-typowanie1.html'},
  {id:'final', pl:'Finał', en:'Final', it:'Finale', count:1, start:31, form:'hso-typowanie1.html'}
];
const KNOCKOUT_DEADLINE_OVERRIDES = {
  r16:'2026-07-04T13:00:00Z'
};
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
  {matchId:537376, side:'homeTeam', team:{name:'Canada',shortName:'Canada',tla:'CAN'}},
  {matchId:537375, side:'homeTeam', team:{name:'Paraguay',shortName:'Paraguay',tla:'PAR'}},
  {matchId:537375, side:'awayTeam', team:{name:'France',shortName:'France',tla:'FRA'}},
  {matchId:537377, side:'homeTeam', team:{name:'Brazil',shortName:'Brazil',tla:'BRA'}},
  {matchId:537377, side:'awayTeam', team:{name:'Norway',shortName:'Norway',tla:'NOR'}},
  {matchId:537378, side:'homeTeam', team:{name:'Mexico',shortName:'Mexico',tla:'MEX'}},
  {matchId:537378, side:'awayTeam', team:{name:'England',shortName:'England',tla:'ENG'}},
  {matchId:537376, side:'awayTeam', team:{name:'Morocco',shortName:'Morocco',tla:'MAR'}},
  {matchId:537380, side:'homeTeam', team:{name:'United States',shortName:'United States',tla:'USA'}},
  {matchId:537380, side:'awayTeam', team:{name:'Belgium',shortName:'Belgium',tla:'BEL'}},
  {matchId:537379, side:'homeTeam', team:{name:'Portugal',shortName:'Portugal',tla:'POR'}},
  {matchId:537379, side:'awayTeam', team:{name:'Spain',shortName:'Spain',tla:'ESP'}},
  {matchId:537382, side:'homeTeam', team:{name:'Switzerland',shortName:'Switzerland',tla:'SUI'}},
  {matchId:537381, side:'homeTeam', team:{name:'Argentina',shortName:'Argentina',tla:'ARG'}},
  {matchId:537381, side:'awayTeam', team:{name:'Egypt',shortName:'Egypt',tla:'EGY'}},
  {matchId:537382, side:'awayTeam', team:{name:'Colombia',shortName:'Colombia',tla:'COL'}},
  {matchId:537383, side:'homeTeam', team:{name:'France',shortName:'France',tla:'FRA'}},
  {matchId:537383, side:'awayTeam', team:{name:'Morocco',shortName:'Morocco',tla:'MAR'}},
  {matchId:537384, side:'homeTeam', team:{name:'Spain',shortName:'Spain',tla:'ESP'}},
  {matchId:537384, side:'awayTeam', team:{name:'Belgium',shortName:'Belgium',tla:'BEL'}},
  {matchId:537385, side:'homeTeam', team:{name:'Norway',shortName:'Norway',tla:'NOR'}},
  {matchId:537386, side:'homeTeam', team:{name:'Argentina',shortName:'Argentina',tla:'ARG'}},
  {matchId:537386, side:'awayTeam', team:{name:'Switzerland',shortName:'Switzerland',tla:'SUI'}},
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
let selectedKnockoutRound = null;
let knockoutRoundSelectionManual = false;
let expandedKnockoutMatchId = null;
let featuredKnockoutMatchId = null;

function knockoutTipsForRound(round){
  const aliases={r32:['r32','1/16'],r16:['r16','1/8'],qf:['qf','1/4'],sf:['sf','1/2'],third:['third','medale'],final:['final','medale']};
  return KNOCKOUT_TIP_ROUNDS.find(item=>(aliases[round.id]||[round.id]).includes(item.id))||null;
}

function knockoutTipMatch(tipRound,apiMatch,index){
  const matches=tipRound?.matches||[];
  const declared=matches.find(match=>Number(match.apiId??match.id)===apiMatch.id)||matches[index];
  if(!declared)return null;
  return {match:declared,key:declared.id||String(index)};
}

function knockoutRoundProgress(round,roundMatches){
  const tipRound=knockoutTipsForRound(round);
  const submitted=KNOCKOUT_SUBMISSIONS[round.id]||new Set();
  if(!tipRound)return {
    tipRound:null,
    completePlayers:PLAYERS.filter(player=>submitted.has(player.name)),
    complete:false
  };
  const required=roundMatches.map((match,index)=>knockoutTipMatch(tipRound,match,index)).filter(Boolean);
  const completePlayers=PLAYERS.filter(player=>submitted.has(player.name)||(required.length===round.count&&required.every(({key})=>{
    const tip=tipRound.tipsByPlayer?.[player.name]?.[key];
    return typeof tip==='string'&&tip.trim()!=='';
  })));
  return {tipRound,completePlayers,complete:completePlayers.length===PLAYERS.length};
}

function knockoutMatchDetails(round,match,index,roundMatches){
  const progress=knockoutRoundProgress(round,roundMatches);
  const tipData=knockoutTipMatch(progress.tipRound,match,index);
  const finishedResult=apiResult(match);
  const revealDeadline=knockoutDeadline(roundMatches[0]?.utcDate,round.id);
  const afterRevealDeadline=!revealDeadline||Date.now()>=revealDeadline.getTime();
  const reveal=Boolean(tipData&&progress.complete&&afterRevealDeadline);
  const playersAlphabetically=[...PLAYERS].sort((a,b)=>a.name.localeCompare(b.name,'pl',{sensitivity:'base'}));
  if(!reveal){
    const message=!progress.tipRound
      ? lt('Typy nie zostały jeszcze wprowadzone.','Predictions have not been entered yet.','I pronostici non sono ancora stati inseriti.')
      : !progress.complete
        ? lt(`Wprowadzone komplety: ${progress.completePlayers.length}/${PLAYERS.length}.`,`Predictions entered: ${progress.completePlayers.length}/${PLAYERS.length}.`,`Pronostici inseriti: ${progress.completePlayers.length}/${PLAYERS.length}.`)
        : lt(`Typy są wprowadzone. Pokażą się o ${knockoutDeadlineLabel(revealDeadline)}.`,`Predictions are entered. They will appear at ${knockoutDeadlineLabel(revealDeadline)}.`,`I pronostici sono inseriti. Saranno visibili alle ${knockoutDeadlineLabel(revealDeadline)}.`);
    return `<div class="ko-match-details" hidden><div class="ko-details-empty">${message}</div></div>`;
  }
  if(finishedResult){
    const groups={3:[],1:[],0:[]};
    playersAlphabetically.forEach(player=>{
      const tip=progress.tipRound.tipsByPlayer?.[player.name]?.[tipData.key]||'—';
      const value=sc(tip,finishedResult)??0;
      groups[value].push({name:player.name,tip});
    });
    const sections=[
      {value:3,label:`3 ${pointsLabel(3)}`,cls:'lbl-g',chip:'chip-g'},
      {value:1,label:`1 ${pointsLabel(1)}`,cls:'lbl-a',chip:'chip-a'},
      {value:0,label:`0 ${pointsLabel(0)}`,cls:'lbl-r',chip:'chip-r'}
    ].map(section=>`<div class="exp-section"><div class="exp-lbl ${section.cls}">${section.label} · ${groups[section.value].length}</div><div class="chips">${groups[section.value].map(item=>`<span class="chip ${section.chip}"><span class="chip-pname">${item.name}</span><span class="chip-tip">${item.tip}</span></span>`).join('')}</div></div>`).join('');
    return `<div class="ko-match-details" hidden>${sections}</div>`;
  }
  const chips=playersAlphabetically.map(player=>{
    const tip=progress.tipRound.tipsByPlayer?.[player.name]?.[tipData.key]||'—';
    return `<span class="chip chip-tip-pre"><span class="chip-pname">${player.name}</span><span class="chip-tip">${tip}</span></span>`;
  }).join('');
  return `<div class="ko-match-details" hidden><div class="exp-section"><div class="exp-lbl">${lt('Typy graczy','Player predictions','Pronostici dei giocatori')} · ${PLAYERS.length}</div><div class="chips">${chips}</div></div></div>`;
}

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
  return LANG==='it'?(round.it||round.en):LANG==='en'?round.en:round.pl;
}
function knockoutMatchCountLabel(count){
  if(LANG==='en')return `${count} ${count===1?'match':'matches'}`;
  if(LANG==='it')return `${count} ${count===1?'partita':'partite'}`;
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
  return new Intl.DateTimeFormat(LANG==='en'?'en-GB':LANG==='it'?'it-IT':'pl-PL',{
    timeZone:'Europe/Warsaw',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'
  }).format(new Date(utcDate)).replace(',',' ·');
}
function knockoutDeadline(firstMatchUtc,roundId){
  const override=KNOCKOUT_DEADLINE_OVERRIDES[roundId];
  if(override)return new Date(override);
  if(!firstMatchUtc)return null;
  return new Date(Date.parse(firstMatchUtc)-120*60*1000);
}
function knockoutDeadlineLabel(deadline){
  if(!deadline)return lt('Termin pojawi się po ustaleniu terminarza.','Deadline will appear when the schedule is known.','La scadenza apparirà quando sarà noto il calendario.');
  return new Intl.DateTimeFormat(LANG==='en'?'en-GB':LANG==='it'?'it-IT':'pl-PL',{
    timeZone:'Europe/Warsaw',day:'2-digit',month:'2-digit',year:'numeric',
    hour:'2-digit',minute:'2-digit'
  }).format(deadline).replace(',',' ·');
}
function knockoutTeamName(team){
  const name=team?.shortName||team?.name;
  if(!name)return lt('Drużyna jeszcze nieznana','Team not known yet','Squadra non ancora nota');
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
  const polish=apiToPl[name]||name;
  return LANG==='it'?(TEAM_IT[polish]||name):polish;
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
  if(match?.status==='FINISHED')return {cls:'finished',label:lt('Zakończony','Finished','Terminata')};
  if(['IN_PLAY','LIVE','PAUSED'].includes(match?.status))return {cls:'live',label:lt('Trwa','Live','In corso')};
  return {cls:'',label:lt('Zaplanowany','Scheduled','Programmata')};
}
function currentKnockoutRoundIndex(allMatches){
  if(!allMatches.length)return 0;
  for(let i=0;i<KNOCKOUT_ROUNDS.length;i++){
    const round=KNOCKOUT_ROUNDS[i];
    if(!knockoutUiRoundComplete(round,allMatches))return i;
  }
  return KNOCKOUT_ROUNDS.length-1;
}
function knockoutUiRoundComplete(round,allMatches){
  if(!round)return false;
  const matches=(allMatches||[]).slice(round.start,round.start+round.count);
  return matches.length===round.count&&matches.every(match=>Boolean(knockoutMatchResult(match)));
}
function orderedKnockoutRounds(allMatches){
  return KNOCKOUT_ROUNDS.map((round,index)=>({round,index,done:knockoutUiRoundComplete(round,allMatches)}))
    .sort((a,b)=>Number(a.done)-Number(b.done));
}
function renderKnockout(){
  const root=document.getElementById('tab-pucharowa');
  if(!root)return;
  const allMatches=knockoutMatches();
  const currentIndex=currentKnockoutRoundIndex(allMatches);
  if(!knockoutRoundSelectionManual)selectedKnockoutRound=currentIndex;
  const activeRound=KNOCKOUT_ROUNDS[selectedKnockoutRound]||KNOCKOUT_ROUNDS[0];
  root.classList.toggle('ko-final-view',activeRound.id==='final');
  const roundMatches=allMatches.slice(activeRound.start,activeRound.start+activeRound.count);
  const knownPairs=roundMatches.filter(match=>match.homeTeam?.name&&match.awayTeam?.name).length;
  const allKnown=roundMatches.length===activeRound.count&&knownPairs===activeRound.count;
  const allFinished=roundMatches.length===activeRound.count&&roundMatches.every(match=>match.status==='FINISHED');
  const formMatches=activeRound.form==='hso-typowanie1.html'
    ? allMatches.slice(30,32)
    : roundMatches;
  const formKnownPairs=formMatches.filter(match=>match.homeTeam?.name&&match.awayTeam?.name).length;
  const deadline=knockoutDeadline(formMatches[0]?.utcDate,activeRound.id);
  const beforeDeadline=!deadline||Date.now()<=deadline.getTime();
  const formReady=formKnownPairs>0&&beforeDeadline;
  const nextDeadlineIndex=KNOCKOUT_ROUNDS.findIndex(round=>{
    const matches=round.form==='hso-typowanie1.html'
      ? allMatches.slice(30,32)
      : allMatches.slice(round.start,round.start+round.count);
    const roundDeadline=knockoutDeadline(matches[0]?.utcDate,round.id);
    return !roundDeadline||Date.now()<=roundDeadline.getTime();
  });
  const headerRound=KNOCKOUT_ROUNDS[nextDeadlineIndex>=0?nextDeadlineIndex:currentIndex]||KNOCKOUT_ROUNDS[0];
  const headerMatches=allMatches.slice(headerRound.start,headerRound.start+headerRound.count);
  const headerFormMatches=headerRound.form==='hso-typowanie1.html'
    ? allMatches.slice(30,32)
    : headerMatches;
  const headerKnownPairs=headerFormMatches.filter(match=>match.homeTeam?.name&&match.awayTeam?.name).length;
  const headerIsFinalForm=headerRound.form==='hso-typowanie1.html';
  const headerDeadline=knockoutDeadline(headerFormMatches[0]?.utcDate,headerRound.id);
  const headerTipProgress=knockoutRoundProgress(headerRound,headerMatches);
  setHeaderBadge(
    LANG==='en'
      ? `${headerIsFinalForm?'Final stage':knockoutRoundName(headerRound)} · available fixtures: ${headerKnownPairs}/${headerRound.count}`
      : LANG==='it'
        ? `${headerIsFinalForm?'Fase finale':knockoutRoundName(headerRound)} · abbinamenti disponibili: ${headerKnownPairs}/${headerRound.count}`
        : `${headerIsFinalForm?'Faza finałowa':knockoutRoundName(headerRound)} · dostępne pary: ${headerKnownPairs}/${headerRound.count}`,
    headerKnownPairs>0?'available':'waiting',
    LANG==='en'
      ? `deadline ${knockoutDeadlineLabel(headerDeadline)}${headerRound.id==='r16'?' (then Magda and I are going to a party)':''}`
      : LANG==='it'
        ? `scadenza ${knockoutDeadlineLabel(headerDeadline)}${headerRound.id==='r16'?' (poi io e Magda andiamo a una festa)':''}`
        : `termin ${knockoutDeadlineLabel(headerDeadline)}${headerRound.id==='r16'?' (potem idziemy z Magdą na imprezę)':''}`,
    {
      label:lt('Oddane typy','Predictions submitted','Pronostici inviati'),
      value:headerTipProgress.completePlayers.length,
      total:PLAYERS.length
    }
  );

  const nav=document.getElementById('koStageNav');
  nav.innerHTML=orderedKnockoutRounds(allMatches).map(({round,index,done})=>{
    const matches=allMatches.slice(round.start,round.start+round.count);
    const meta=done
      ? lt('zakończone','completed','terminato')
      : knockoutMatchCountLabel(round.count);
    return `<button class="ko-stage${index===selectedKnockoutRound?' active':''}${done?' done':''}" type="button" data-ko-round="${index}">
      <span class="ko-stage-name">${knockoutRoundName(round)}</span><span class="ko-stage-meta">${meta}</span>
    </button>`;
  }).join('');
  nav.querySelectorAll('[data-ko-round]').forEach(button=>button.addEventListener('click',()=>{
    selectedKnockoutRound=Number(button.dataset.koRound);
    knockoutRoundSelectionManual=true;
    expandedKnockoutMatchId=null;
    renderKnockout();
  }));

  document.getElementById('koRoundTitle').textContent=lt('Mecze · ','Matches · ','Partite · ')+knockoutRoundName(activeRound);
  document.getElementById('koRoundState').textContent=allFinished
    ? lt('Zakończone','Completed','Terminato')
    : allKnown
      ? lt('Pary potwierdzone','Fixtures confirmed','Abbinamenti confermati')
      : lt('Oczekiwanie na pary','Waiting for teams','In attesa delle squadre');

  const matchesEl=document.getElementById('koMatches');
  matchesEl.innerHTML=roundMatches.length ? roundMatches.map((match,index)=>{
    const homeKnown=Boolean(match.homeTeam?.name);
    const awayKnown=Boolean(match.awayTeam?.name);
    const status=knockoutStatus(match);
    const score=knockoutDisplayScore(match);
    const matchId=String(match.id);
    const expanded=expandedKnockoutMatchId===matchId;
    return `<article class="ko-match${expanded?' expanded':''}" data-ko-match-id="${matchId}" role="button" tabindex="0" aria-expanded="${expanded}">
      <div class="ko-match-top"><span>${lt('Mecz','Match','Partita')} ${index+1}</span><span>${knockoutDate(match.utcDate)}</span></div>
      <div class="ko-team${homeKnown?'':' unknown'}">${knockoutTeamFlag(match.homeTeam)}<span class="ko-team-name">${knockoutTeamName(match.homeTeam)}</span><span class="ko-team-score">${Number.isInteger(score.home)?score.home:'–'}</span></div>
      <div class="ko-team${awayKnown?'':' unknown'}">${knockoutTeamFlag(match.awayTeam)}<span class="ko-team-name">${knockoutTeamName(match.awayTeam)}</span><span class="ko-team-score">${Number.isInteger(score.away)?score.away:'–'}</span></div>
      <div class="ko-match-status ${status.cls}"><span class="ko-status-dot"></span>${status.label}</div>
      <div class="ko-match-hint">${lt('Kliknij, aby zobaczyć typy','Click for predictions','Clicca per vedere i pronostici')} ↓</div>
      ${knockoutMatchDetails(activeRound,match,index,roundMatches)}
    </article>`;
  }).join('') : `<div class="ko-match">${lt('Brak danych o meczach.','No fixture data.','Nessun dato sulle partite.')}</div>`;

  matchesEl.querySelectorAll('[data-ko-match-id]').forEach(tile=>{
    const setExpanded=open=>{
      expandedKnockoutMatchId=open?tile.dataset.koMatchId:null;
      matchesEl.querySelectorAll('[data-ko-match-id]').forEach(item=>{
        const active=item===tile&&open;
        item.classList.toggle('expanded',active);
        item.setAttribute('aria-expanded',String(active));
        const details=item.querySelector('.ko-match-details');
        if(details)details.hidden=!active;
      });
      if(!open)tile.scrollIntoView({behavior:'smooth',block:'nearest'});
    };
    tile.addEventListener('click',event=>{
      setExpanded(!tile.classList.contains('expanded'));
    });
    tile.addEventListener('keydown',event=>{
      if(!['Enter',' '].includes(event.key))return;
      event.preventDefault();
      setExpanded(!tile.classList.contains('expanded'));
    });
    if(tile.classList.contains('expanded')){
      const details=tile.querySelector('.ko-match-details');
      if(details)details.hidden=false;
    }
  });

  const medalForm=activeRound.form==='hso-typowanie1.html';
  const tipProgress=knockoutRoundProgress(activeRound,roundMatches);
  const completedTips=tipProgress.completePlayers.length;
  const predictionsClosed=!beforeDeadline||tipProgress.complete;
  document.getElementById('koActionTitle').textContent=predictionsClosed
    ? lt('Typowanie zakończone','Predictions closed','Pronostici chiusi')
    : medalForm
      ? lt('Typowanie meczów o medale','Medal-match predictions','Pronostici delle partite per le medaglie')
      : lt('Typowanie rundy','Round predictions','Pronostici del turno');
  document.getElementById('koActionCopy').textContent=predictionsClosed
    ? (tipProgress.complete
      ? lt('Wszystkie typy tej rundy zostały wprowadzone.','All predictions for this stage have been entered.','Tutti i pronostici di questo turno sono stati inseriti.')
      : lt('Termin typowania tej rundy minął.','The prediction deadline for this stage has passed.','La scadenza dei pronostici per questo turno è trascorsa.'))
    : medalForm
      ? lt('Jeden wspólny formularz obejmuje mecz o 3. miejsce oraz finał.','One shared form covers both the third-place match and the final.','Un unico modulo comprende la finale per il 3° posto e la finale.')
    : formKnownPairs>0
      ? lt('Możesz rozpocząć od potwierdzonych par. Wcześniejsze typy pozostaną zapisane po dodaniu kolejnych meczów.','You can start with the confirmed fixtures. Earlier predictions stay saved when more fixtures are added.','Puoi iniziare dagli abbinamenti confermati. I pronostici precedenti resteranno salvati quando verranno aggiunte altre partite.')
      : lt('Formularz rundy zostanie udostępniony po poznaniu pierwszej pary tego etapu.','The round form will become available as soon as the first fixture is known.','Il modulo del turno sarà disponibile non appena sarà noto il primo abbinamento.');
  document.getElementById('koDeadline').textContent=lt('Termin typowania: ','Deadline: ','Scadenza: ')+knockoutDeadlineLabel(deadline);
  const actionBtn=document.getElementById('koActionBtn');
  const actionPanel=actionBtn.closest('.ko-action');
  actionPanel.hidden=activeRound.id==='final';
  actionPanel.classList.toggle('deadline-closed',predictionsClosed);
  actionPanel.classList.toggle('tips-complete',tipProgress.complete);
  actionBtn.textContent=predictionsClosed
    ? lt('Typowanie zamknięte','Predictions closed','Pronostici chiusi')
    : formKnownPairs>0
    ? medalForm
      ? lt('Otwórz typowanie meczów o medale','Open medal-match form','Apri i pronostici delle partite per le medaglie')
      : lt('Otwórz formularz typowania','Open prediction form','Apri il modulo dei pronostici')
    : lt('Oczekiwanie na drużyny','Waiting for teams','In attesa delle squadre');
  const allowForm=formReady&&!predictionsClosed;
  actionBtn.href=allowForm?activeRound.form:'#';
  actionBtn.target=allowForm?'_blank':'';
  actionBtn.rel=allowForm?'noopener noreferrer':'';
  actionBtn.classList.toggle('ready',allowForm);
  actionBtn.setAttribute('aria-disabled',String(!allowForm));
  actionBtn.onclick=allowForm?null:event=>event.preventDefault();
  document.getElementById('koProgressLabel').textContent=lt('Oddane typy','Predictions submitted','Pronostici inviati');
  document.getElementById('koProgressValue').textContent=`${completedTips} / ${PLAYERS.length}`;
  document.getElementById('koProgressFill').style.width=`${completedTips/PLAYERS.length*100}%`;
  document.getElementById('koProgressNote').textContent=lt('Po uruchomieniu rundy zobaczysz tutaj postęp typowania graczy.','Once the stage opens, player prediction progress will appear here.','Quando il turno sarà aperto, qui vedrai l’avanzamento dei pronostici.');
  document.getElementById('koRoadLabel').textContent=lt('Droga do finału','Road to the final','Cammino verso la finale');
  document.getElementById('koRoadList').innerHTML=KNOCKOUT_ROUNDS.map((round,index)=>
    `<div class="ko-road-item${index===currentIndex?' current':''}"><span class="ko-road-dot"></span><span>${knockoutRoundName(round)}</span><span class="ko-road-count">${round.count}</span></div>`
  ).join('');
}

function switchTab(tab,el){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');
  ['gracze','ranking','pucharowa','grupowa'].forEach(t=>{
    const section=document.getElementById(`tab-${t}`);
    if(section)section.style.display=t===tab?'block':'none';
  });
  document.body.classList.toggle('ranking-active',tab==='ranking');
  document.body.classList.toggle('ranking-panel-open',tab==='ranking'&&document.getElementById('sidePanel').classList.contains('open'));
  if(tab==='pucharowa')renderKnockout();
  if(tab==='grupowa')renderGroupArchive();
  requestAnimationFrame(updateMobileSectionBack);
}
initFeaturedKnockoutLink();
refreshApiData().then(loaded=>{
  if(!loaded)renderPlayerCards(),renderRanking(),renderKnockout();
});
setInterval(refreshApiData,60*1000);
