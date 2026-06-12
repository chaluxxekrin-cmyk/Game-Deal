const FALLBACK = [
  {appid:292030,name:"The Witcher 3: Wild Hunt",dev:"CD PROJEKT RED",orig:799,sale:79,disc:90,genres:["RPG","Adventure"],tags:["Open World","Story Rich","Fantasy"],coop:false,multi:false,rating:97},
  {appid:1091500,name:"Cyberpunk 2077",dev:"CD PROJEKT RED",orig:1099,sale:329,disc:70,genres:["Action","RPG"],tags:["Open World","Cyberpunk","Story Rich"],coop:false,multi:true,rating:78},
  {appid:1174180,name:"Red Dead Redemption 2",dev:"Rockstar Games",orig:1499,sale:599,disc:60,genres:["Action","Adventure"],tags:["Open World","Story Rich","Western"],coop:false,multi:true,rating:93},
  {appid:1245620,name:"Elden Ring",dev:"FromSoftware Inc.",orig:1699,sale:849,disc:50,genres:["Action","RPG"],tags:["Souls-like","Difficult","Open World"],coop:true,multi:true,rating:96},
  {appid:105600,name:"Terraria",dev:"Re-Logic",orig:149,sale:37,disc:75,genres:["Action","Adventure","Indie"],tags:["Survival","Crafting","Co-op"],coop:true,multi:true,rating:97},
  {appid:413150,name:"Stardew Valley",dev:"ConcernedApe",orig:199,sale:99,disc:50,genres:["Simulation","RPG","Indie"],tags:["Farming","Relaxing","Co-op"],coop:true,multi:false,rating:98},
  {appid:381210,name:"Dead by Daylight",dev:"Behaviour Interactive",orig:599,sale:89,disc:85,genres:["Horror","Action"],tags:["Survival Horror","Multiplayer","Co-op"],coop:true,multi:true,rating:78},
  {appid:240760,name:"Subnautica",dev:"Unknown Worlds",orig:399,sale:79,disc:80,genres:["Adventure","Simulation","Indie"],tags:["Survival","Open World","Underwater"],coop:false,multi:false,rating:95},
  {appid:736220,name:"RESIDENT EVIL 2",dev:"CAPCOM",orig:799,sale:159,disc:80,genres:["Action","Horror"],tags:["Survival Horror","Zombies","Story Rich"],coop:false,multi:false,rating:93},
  {appid:252490,name:"Rust",dev:"Facepunch Studios",orig:549,sale:137,disc:75,genres:["Action","Simulation"],tags:["Survival","Open World","PvP"],coop:false,multi:true,rating:70},
  {appid:892970,name:"Valheim",dev:"Iron Gate AB",orig:249,sale:124,disc:50,genres:["Action","Simulation","Indie"],tags:["Survival","Open World","Co-op"],coop:true,multi:true,rating:88},
  {appid:271590,name:"Grand Theft Auto V",dev:"Rockstar North",orig:749,sale:187,disc:75,genres:["Action","Adventure"],tags:["Open World","Multiplayer","Story Rich"],coop:false,multi:true,rating:80},
  {appid:2379780,name:"Baldur's Gate 3",dev:"Larian Studios",orig:1599,sale:1119,disc:30,genres:["RPG","Adventure"],tags:["Co-op","Fantasy","Turn-Based"],coop:true,multi:true,rating:97},
  {appid:1113560,name:"Hades",dev:"Supergiant Games",orig:449,sale:224,disc:50,genres:["Action","Indie","RPG"],tags:["Roguelike","Greek Mythology","Hack and Slash"],coop:false,multi:false,rating:98},
  {appid:1627720,name:"Vampire Survivors",dev:"poncle",orig:79,sale:39,disc:50,genres:["Action","Indie"],tags:["Roguelite","Survival","Bullet Hell"],coop:true,multi:false,rating:97},
  {appid:620,name:"Portal 2",dev:"Valve",orig:149,sale:22,disc:85,genres:["Action","Adventure"],tags:["Puzzle","Co-op","Sci-fi"],coop:true,multi:false,rating:99},
  {appid:400,name:"Portal",dev:"Valve",orig:99,sale:14,disc:85,genres:["Action","Adventure"],tags:["Puzzle","Sci-fi","Short"],coop:false,multi:false,rating:98},
  {appid:367520,name:"Hollow Knight",dev:"Team Cherry",orig:149,sale:52,disc:65,genres:["Action","Adventure","Indie"],tags:["Metroidvania","Difficult","Atmospheric"],coop:false,multi:false,rating:97},
  {appid:1466060,name:"It Takes Two",dev:"Hazelight Studios",orig:699,sale:209,disc:70,genres:["Action","Adventure"],tags:["Co-op","Platformer","Story Rich"],coop:true,multi:false,rating:97},
  {appid:39150,name:"Disco Elysium",dev:"ZA/UM",orig:499,sale:99,disc:80,genres:["RPG","Adventure"],tags:["Detective","Story Rich","Indie"],coop:false,multi:false,rating:97},
  {appid:1658440,name:"Persona 5 Royal",dev:"ATLUS",orig:1799,sale:629,disc:65,genres:["RPG","Adventure"],tags:["JRPG","Anime","Turn-Based"],coop:false,multi:false,rating:97},
  {appid:1569580,name:"NieR:Automata",dev:"PlatinumGames",orig:799,sale:199,disc:75,genres:["Action","RPG"],tags:["Anime","Story Rich","Hack and Slash"],coop:false,multi:false,rating:92},
  {appid:614570,name:"Sekiro: Shadows Die Twice",dev:"FromSoftware Inc.",orig:1199,sale:599,disc:50,genres:["Action","Adventure"],tags:["Souls-like","Difficult","Japan"],coop:false,multi:false,rating:93},
  {appid:289070,name:"Sid Meier's Civilization VI",dev:"Firaxis Games",orig:799,sale:79,disc:90,genres:["Strategy","Simulation"],tags:["Turn-Based","4X","Historical"],coop:false,multi:true,rating:85},
  {appid:108600,name:"Project Zomboid",dev:"The Indie Stone",orig:279,sale:139,disc:50,genres:["Simulation","RPG","Indie"],tags:["Zombies","Survival","Co-op"],coop:true,multi:true,rating:93},
  {appid:730630,name:"Phasmophobia",dev:"Kinetic Games",orig:299,sale:209,disc:30,genres:["Horror","Simulation","Indie"],tags:["Co-op","Ghost","Atmospheric"],coop:true,multi:true,rating:91},
  {appid:203810,name:"Outlast",dev:"Red Barrels",orig:199,sale:29,disc:85,genres:["Horror","Action"],tags:["Survival Horror","Atmospheric","Dark"],coop:false,multi:false,rating:89},
  {appid:1382330,name:"MONSTER HUNTER RISE",dev:"CAPCOM",orig:999,sale:249,disc:75,genres:["Action","RPG"],tags:["Hunting","Co-op","Anime"],coop:true,multi:true,rating:87},
  {appid:1237970,name:"Titanfall 2",dev:"Respawn Entertainment",orig:399,sale:59,disc:85,genres:["Action"],tags:["FPS","Story Rich","Multiplayer"],coop:false,multi:true,rating:97},
  {appid:648800,name:"Raft",dev:"Redbeet Interactive",orig:299,sale:89,disc:70,genres:["Action","Simulation","Indie"],tags:["Survival","Co-op","Open World"],coop:true,multi:true,rating:88},
  {appid:1644870,name:"Cuphead",dev:"Studio MDHR",orig:399,sale:199,disc:50,genres:["Action","Indie"],tags:["Difficult","Platformer","Co-op"],coop:true,multi:false,rating:95},
  {appid:1182480,name:"Satisfactory",dev:"Coffee Stain Studios",orig:549,sale:274,disc:50,genres:["Simulation","Indie"],tags:["Factory Building","Co-op","Open World"],coop:true,multi:true,rating:97},
  {appid:1145360,name:"Hades II",dev:"Supergiant Games",orig:499,sale:424,disc:15,genres:["Action","Indie","RPG"],tags:["Roguelike","Greek Mythology","Early Access"],coop:false,multi:false,rating:95},
  {appid:753640,name:"Outer Wilds",dev:"Mobius Digital",orig:349,sale:174,disc:50,genres:["Adventure","Indie"],tags:["Exploration","Mystery","Space"],coop:false,multi:false,rating:97},
  {appid:632360,name:"Risk of Rain 2",dev:"Hopoo Games",orig:449,sale:134,disc:70,genres:["Action","Indie"],tags:["Roguelike","Co-op","Shooter"],coop:true,multi:true,rating:91},
  {appid:2521900,name:"Schedule I",dev:"TVGS",orig:199,sale:139,disc:30,genres:["Simulation","Indie"],tags:["Drug Dealer","Sandbox","Open World"],coop:true,multi:false,rating:96},
  {appid:346110,name:"ARK: Survival Evolved",dev:"Studio Wildcard",orig:549,sale:82,disc:85,genres:["Action","Adventure","Simulation"],tags:["Survival","Dinosaurs","Co-op"],coop:true,multi:true,rating:74},
  {appid:1158310,name:"Crusader Kings III",dev:"Paradox Development Studio",orig:799,sale:199,disc:75,genres:["Strategy","Simulation","RPG"],tags:["Grand Strategy","Medieval","Dynasty"],coop:false,multi:true,rating:91},
  {appid:1551360,name:"Forza Horizon 5",dev:"Playground Games",orig:1999,sale:999,disc:50,genres:["Racing","Simulation","Sports"],tags:["Driving","Open World","Multiplayer"],coop:false,multi:true,rating:90},
  {appid:570,name:"Dota 2",dev:"Valve",orig:0,sale:0,disc:0,genres:["Strategy","Action"],tags:["MOBA","Multiplayer"],coop:false,multi:true,rating:80,free:true},
  {appid:730,name:"Counter-Strike 2",dev:"Valve",orig:0,sale:0,disc:0,genres:["Action"],tags:["FPS","Competitive"],coop:false,multi:true,rating:78,free:true},
  {appid:578080,name:"PUBG: BATTLEGROUNDS",dev:"PUBG Corporation",orig:0,sale:0,disc:0,genres:["Action"],tags:["Battle Royale","Survival"],coop:true,multi:true,rating:67,free:true},
  {appid:1172470,name:"Apex Legends",dev:"Respawn Entertainment",orig:0,sale:0,disc:0,genres:["Action"],tags:["Battle Royale","FPS"],coop:false,multi:true,rating:80,free:true},
  {appid:230410,name:"Warframe",dev:"Digital Extremes",orig:0,sale:0,disc:0,genres:["Action","Simulation"],tags:["Co-op","Sci-fi"],coop:true,multi:true,rating:87,free:true},
  {appid:438100,name:"VRChat",dev:"VRChat",orig:0,sale:0,disc:0,genres:["Simulation"],tags:["VR","Social"],coop:true,multi:true,rating:80,free:true},
  {appid:218620,name:"PAYDAY 2",dev:"Overkill Software",orig:0,sale:0,disc:0,genres:["Action"],tags:["Co-op","Heist","FPS"],coop:true,multi:true,rating:83,free:true},
  {appid:1097150,name:"Fall Guys",dev:"Mediatonic",orig:0,sale:0,disc:0,genres:["Action","Indie"],tags:["Battle Royale","Party","Cute"],coop:false,multi:true,rating:76,free:true},
  {appid:1085660,name:"Destiny 2",dev:"Bungie",orig:0,sale:0,disc:0,genres:["Action"],tags:["FPS","Co-op","Sci-fi"],coop:true,multi:true,rating:73,free:true},
];

const STEAM_URLS = [
  'https://store.steampowered.com/api/featuredcategories/?cc=th&l=english',
  'https://store.steampowered.com/api/featured/?cc=th&l=english',
];

const PROXIES = [
  u => u,
  u => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  u => `https://thingproxy.freeboard.io/fetch/${u}`,
];

const CACHE_KEY = 'steamdeal_v3';
const CACHE_TTL = 15 * 60 * 1000;

let ALL_GAMES = [];
let dataSource = 'fallback';
let fetchedAt = null;
let autoTimer = null;

async function tryFetch(url) {
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(url), { signal: AbortSignal.timeout(7000) });
      if (!res.ok) continue;
      const text = await res.text();
      const j = JSON.parse(text);
      const data = j.contents ? JSON.parse(j.contents) : j;
      if (data && typeof data === 'object') return data;
    } catch {
      continue;
    }
  }
  return null;
}

function parseItems(items = []) {
  const seen = new Set();
  const games = [];
  for (const item of items) {
    if (!item.id || seen.has(item.id)) continue;
    seen.add(item.id);
    const sale = item.final_price != null ? Math.round(item.final_price / 100) : 0;
    const orig = item.original_price != null ? Math.round(item.original_price / 100) : sale;
    const disc = item.discount_percent || 0;
    const isFree = (sale === 0 && orig === 0 && disc === 0) || item.is_free_game === true;
    if (!isFree && sale === 0) continue;
    games.push({
      appid: item.id,
      name: item.name || '',
      dev: item.publisher || '',
      orig, sale, disc,
      genres: [], tags: [],
      coop: false, multi: false, rating: 0,
      free: isFree,
      _live: true,
    });
  }
  return games;
}

async function fetchSteam(force = false) {
  if (!force) {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        ALL_GAMES = cached.games;
        fetchedAt = new Date(cached.ts);
        dataSource = 'cache';
        setStatus('cache', `ข้อมูลแคช — อัปเดตเมื่อ ${timeAgo(fetchedAt)}`);
        render();
        updateStats();
        startAutoUpdate();
        return;
      }
    } catch {}
  }

  setStatus('loading', 'กำลังเชื่อมต่อ Steam...');
  spinRefresh(true);
  showSkeletons();

  let liveGames = [];

  for (const url of STEAM_URLS) {
    const data = await tryFetch(url);
    if (!data) continue;

    const specials = data.specials?.items || [];
    const topSellers = data.top_sellers?.items || [];
    const newReleases = data.new_releases?.items || [];
    const featuredWin = data.featured_win || [];

    const all = [...specials, ...topSellers, ...newReleases, ...featuredWin];
    liveGames = parseItems(all);
    if (liveGames.length > 0) break;
  }

  const fbMap = new Map(FALLBACK.map(g => [g.appid, g]));

  if (liveGames.length > 0) {
    ALL_GAMES = liveGames.map(g => {
      const fb = fbMap.get(g.appid);
      return fb ? { ...fb, orig: g.orig, sale: g.sale, disc: g.disc, _live: true } : g;
    });

    const liveIds = new Set(ALL_GAMES.map(g => g.appid));
    for (const g of FALLBACK) {
      if (g.free && !liveIds.has(g.appid)) ALL_GAMES.push(g);
    }

    fetchedAt = new Date();
    dataSource = 'live';
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ games: ALL_GAMES, ts: fetchedAt.getTime() }));
    setStatus('success', `ดึงข้อมูลสำเร็จ — ${liveGames.length} เกม จาก Steam`);
    document.getElementById('liveDot').style.display = 'block';
    document.getElementById('liveLabel').style.display = 'block';
    showToast(`โหลด ${liveGames.length} เกมจาก Steam สำเร็จ`);
  } else {
    ALL_GAMES = [...FALLBACK];
    fetchedAt = new Date();
    dataSource = 'fallback';
    setStatus('error', 'ไม่สามารถเชื่อมต่อ Steam — ใช้ข้อมูลสำรอง (ลองเปิดผ่าน browser โดยตรง)');
    showToast('ใช้ข้อมูลสำรอง');
  }

  spinRefresh(false);
  render();
  updateStats();
  startAutoUpdate();
}

function startAutoUpdate() {
  clearInterval(autoTimer);
  updateTimestamp();
  autoTimer = setInterval(() => {
    updateTimestamp();
    if (fetchedAt && Date.now() - fetchedAt.getTime() >= CACHE_TTL) {
      fetchSteam(true);
    }
  }, 60000);
}

function updateTimestamp() {
  if (!fetchedAt) return;
  document.getElementById('updatedAt').textContent = `อัปเดต ${timeAgo(fetchedAt)}`;
}

function timeAgo(d) {
  const s = Math.round((Date.now() - d) / 1000);
  if (s < 60) return `${s}s ที่แล้ว`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} นาทีที่แล้ว`;
  return `${Math.round(m / 60)} ชั่วโมงที่แล้ว`;
}

function spinRefresh(on) {
  document.getElementById('refreshBtn').classList.toggle('spinning', on);
}

function setStatus(type, msg) {
  const b = document.getElementById('statusBanner');
  const map = { loading: 'loading', success: 'success', cache: '', error: 'error' };
  b.className = 'status-banner ' + (map[type] || '');
  const icons = { loading: '⏳', success: '✅', cache: '📦', error: '⚠️' };
  b.innerHTML = `<span>${icons[type] || '•'}</span><span class="s-text">${msg}</span><span class="src-chip ${dataSource}">${{ live: 'LIVE', cache: 'CACHED', fallback: 'OFFLINE' }[dataSource] || ''}</span>`;
  updateTimestamp();
}

function thumb(id) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showSkeletons() {
  const grid = document.getElementById('gameGrid');
  grid.innerHTML = Array(12).fill(0).map(() => `
    <div class="gskel">
      <div class="sk-img"></div>
      <div class="sk-body">
        <div class="sk-line w80"></div>
        <div class="sk-line w45"></div>
        <div class="sk-line w70"></div>
      </div>
    </div>`).join('');
}

const S = {
  tab: 'sale',
  disc: 0,
  genre: '',
  search: '',
  sort: 'disc',
  wishlist: new Set(JSON.parse(localStorage.getItem('wl') || '[]')),
  filtered: [],
  page: 0,
  perPage: 24,
  loading: false,
  allLoaded: false,
};

function updateStats() {
  const paid = ALL_GAMES.filter(g => !g.free && g.sale > 0);
  const free = ALL_GAMES.filter(g => g.free);
  document.getElementById('stTotal').textContent = paid.length;
  const discs = paid.map(x => x.disc).filter(x => x > 0);
  document.getElementById('stMax').textContent = (discs.length ? Math.max(...discs) : 0) + '%';
  const avg = discs.length ? Math.round(discs.reduce((a, x) => a + x, 0) / discs.length) : 0;
  document.getElementById('stAvg').textContent = avg + '%';
  document.getElementById('stFree').textContent = free.length;
}

function getPool() {
  if (S.tab === 'free') return ALL_GAMES.filter(g => g.free);
  if (S.tab === 'wish') return ALL_GAMES.filter(g => S.wishlist.has(g.appid));
  return ALL_GAMES.filter(g => !g.free && g.sale > 0);
}

function render() {
  let list = getPool();

  if (S.tab === 'sale') {
    if (S.disc > 0) list = list.filter(g => g.disc >= S.disc);
    if (S.genre) list = list.filter(g => g.genres.includes(S.genre));
  }

  if (S.search) {
    const q = S.search.toLowerCase();
    list = list.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.tags.join(' ').toLowerCase().includes(q) ||
      g.dev.toLowerCase().includes(q)
    );
  }

  if (S.sort === 'disc') list.sort((a, b) => b.disc - a.disc);
  else if (S.sort === 'pasc') list.sort((a, b) => a.sale - b.sale);
  else if (S.sort === 'pdesc') list.sort((a, b) => b.sale - a.sale);
  else if (S.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  else if (S.sort === 'rev') list.sort((a, b) => b.rating - a.rating);

  S.filtered = list;
  S.page = 0;
  S.allLoaded = false;
  document.getElementById('gameGrid').innerHTML = '';
  loadMore();
  updateSidebarBudget();
}

function loadMore() {
  if (S.loading || S.allLoaded) return;
  S.loading = true;

  const start = S.page * S.perPage;
  const slice = S.filtered.slice(start, start + S.perPage);

  if (!slice.length) {
    S.allLoaded = true;
    document.getElementById('lmi').style.display = 'none';
    if (S.page === 0) {
      document.getElementById('gameGrid').innerHTML = `
        <div class="empty">
          <div class="big">🎮</div>
          <p>ไม่พบเกมที่ตรงเงื่อนไข</p>
        </div>`;
    }
    document.getElementById('rcCount').textContent = `${S.filtered.length} เกม`;
    S.loading = false;
    return;
  }

  requestAnimationFrame(() => {
    const frag = document.createDocumentFragment();
    for (const g of slice) {
      const el = document.createElement('div');
      el.innerHTML = cardHTML(g);
      frag.appendChild(el.firstElementChild);
    }
    document.getElementById('gameGrid').appendChild(frag);
    S.page++;

    const shown = Math.min(S.page * S.perPage, S.filtered.length);
    document.getElementById('rcCount').textContent = `${shown} / ${S.filtered.length} เกม`;

    if (S.page * S.perPage >= S.filtered.length) {
      S.allLoaded = true;
      document.getElementById('lmi').style.display = 'none';
    }
    S.loading = false;
  });
}

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) loadMore();
}, { rootMargin: '300px' });
observer.observe(document.getElementById('sentinel'));

function cardHTML(g) {
  const inW = S.wishlist.has(g.appid);
  const badge = g.disc > 0 && !g.free ? `<div class="dbadge">-${g.disc}%</div>` : '';
  const tags = g.tags.slice(0, 2).map(t => `<span class="gtag2">${esc(t)}</span>`).join('');
  const priceHtml = g.free
    ? `<span class="pfree">ฟรี</span>`
    : `<span class="pnew">฿${g.sale}</span>`;
  const origHtml = g.disc > 0 && !g.free ? `<span class="porig">฿${g.orig}</span>` : '';
  const liveChip = g._live
    ? `<span style="font-size:8px;background:rgba(74,222,128,.15);color:#4ade80;padding:1px 4px;border-radius:3px;font-family:'IBM Plex Mono',monospace;margin-left:3px">LIVE</span>`
    : '';
  return `<div class="gc" data-appid="${g.appid}" onclick="openModal(${g.appid})">
    <div class="gthumb">
      <img src="${thumb(g.appid)}" loading="lazy" onerror="this.style.display='none'" alt="">
      ${badge}
      <button class="wbtn${inW ? ' on' : ''}" data-id="${g.appid}" onclick="toggleWish(event,${g.appid})" aria-label="Wishlist">${inW ? '❤️' : '🤍'}</button>
    </div>
    <div class="gi">
      <div class="gname">${esc(g.name)}${liveChip}</div>
      <div class="gdev">${esc(g.dev)}</div>
      <div class="gtags2">${tags}</div>
      <div class="grow">
        <div>${origHtml} ${priceHtml}</div>
        <a href="https://store.steampowered.com/app/${g.appid}" target="_blank" class="sbtn" onclick="event.stopPropagation()">Steam ↗</a>
      </div>
    </div>
  </div>`;
}

function switchTab(tab) {
  S.tab = tab;

  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));

  const titles = { sale: '⚡ เกมลดราคาตอนนี้', free: '🆓 เกมฟรีเล่นได้เลย', wish: '❤️ Wishlist ของคุณ' };
  document.getElementById('secTitle').textContent = titles[tab];

  const showSidebar = tab === 'sale';
  const sidebar = document.getElementById('sidebar');
  const layout = document.querySelector('.layout');
  const filterBtn = document.getElementById('filterBtn');

  if (window.innerWidth > 768) {
    sidebar.style.display = showSidebar ? '' : 'none';
  }
  layout.classList.toggle('full', !showSidebar);
  if (filterBtn) filterBtn.style.display = showSidebar ? '' : 'none';

  closeSidebarMobile();
  render();
}

function toggleSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}

function closeSidebarMobile() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

function updateSidebarBudget() {
  const b = parseFloat(document.getElementById('sbBudget').value);
  const el = document.getElementById('sbRes');
  if (!b || b <= 0) { el.textContent = ''; return; }
  const cnt = S.filtered.filter(g => g.sale <= b).length;
  el.textContent = `ซื้อได้ ${cnt} เกมในงบนี้`;
}

function calcBudget() {
  const b = parseFloat(document.getElementById('budgetIn').value);
  if (!b || b <= 0) { showToast('กรอกงบก่อนนะ'); return; }
  const pool = ALL_GAMES.filter(g => !g.free && g.sale > 0 && g.sale <= b).sort((a, c) => c.disc - a.disc);
  const out = document.getElementById('budgetOut');
  if (!pool.length) {
    out.innerHTML = `<div class="bsum">ไม่พบเกมในงบ ฿${b}</div>`;
    out.classList.add('show');
    return;
  }
  let rem = b;
  const bundle = [];
  for (const g of pool) {
    if (g.sale <= rem) { bundle.push(g); rem -= g.sale; }
    if (bundle.length >= 5) break;
  }
  const total = bundle.reduce((s, g) => s + g.sale, 0);
  out.innerHTML = `<div class="bsum">งบ <strong>฿${b}</strong> ซื้อได้ <strong>${pool.length}</strong> เกม · แนะนำชุดนี้:</div>
    <div class="blist">${bundle.map(g => `<div class="bi"><img src="${thumb(g.appid)}" onerror="this.style.display='none'" alt=""><span class="bin">${esc(g.name)}</span><span class="bip">฿${g.sale}</span></div>`).join('')}</div>
    <div class="btot">รวม <strong>฿${total}</strong> · เหลือ ฿${(b - total).toFixed(0)}</div>`;
  out.classList.add('show');
}

function toggleWish(e, id) {
  e.stopPropagation();
  if (S.wishlist.has(id)) {
    S.wishlist.delete(id);
    showToast('ลบออกจาก Wishlist');
  } else {
    S.wishlist.add(id);
    showToast('เพิ่มใน Wishlist');
  }
  localStorage.setItem('wl', JSON.stringify([...S.wishlist]));

  if (S.tab === 'wish') {
    render();
  } else {
    document.querySelectorAll(`.wbtn[data-id="${id}"]`).forEach(btn => {
      const inW = S.wishlist.has(id);
      btn.classList.toggle('on', inW);
      btn.textContent = inW ? '❤️' : '🤍';
    });
  }
}

function openModal(id) {
  const g = ALL_GAMES.find(x => x.appid === id);
  if (!g) return;
  const inW = S.wishlist.has(id);
  const feats = [];
  if (g.coop) feats.push('👥 Co-op');
  if (g.multi) feats.push('🌐 Multiplayer');
  if (!g.multi && !g.coop) feats.push('🎮 Singleplayer');
  if (g.rating > 0) feats.push(`⭐ ${g.rating}%`);
  if (g._live) feats.push('🟢 ข้อมูลสด');

  document.getElementById('modalContent').innerHTML = `
    <img class="mimg" src="${thumb(g.appid)}" onerror="this.style.display='none'" alt="${esc(g.name)}">
    <div class="mbody">
      <div class="mtitle">${esc(g.name)}</div>
      <div class="mdev">โดย ${esc(g.dev)}</div>
      <div class="mtags">${[...g.genres, ...g.tags].map(t => `<span class="mtag">${esc(t)}</span>`).join('')}</div>
      <div class="mprow">
        ${g.disc > 0 && !g.free ? `<span class="mporig">฿${g.orig}</span>` : ''}
        ${g.free ? `<span class="pfree" style="font-size:22px">ฟรี!</span>` : `<span class="mpnew">฿${g.sale}</span>`}
        ${g.disc > 0 ? `<span class="mdisc">-${g.disc}%</span>` : ''}
      </div>
      <div class="mfeats">${feats.map(f => `<div class="fp">${f}</div>`).join('')}</div>
      <div class="macts">
        <a href="https://store.steampowered.com/app/${g.appid}" target="_blank" class="sbtn" style="font-size:12px;padding:8px 18px">เปิดใน Steam ↗</a>
        <button class="sbtn" id="modalWishBtn" style="background:var(--surface2);color:var(--text);border:1px solid var(--border);font-size:12px;padding:8px 18px" onclick="toggleWish(event,${g.appid});updateModalWish(${g.appid})">${inW ? '❤️ ใน Wishlist' : '🤍 เพิ่ม Wishlist'}</button>
      </div>
    </div>`;
  document.getElementById('moverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function updateModalWish(id) {
  const btn = document.getElementById('modalWishBtn');
  if (!btn) return;
  btn.textContent = S.wishlist.has(id) ? '❤️ ใน Wishlist' : '🤍 เพิ่ม Wishlist';
}

function closeModal() {
  document.getElementById('moverlay').classList.remove('show');
  document.body.style.overflow = '';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2400);
}

document.getElementById('moverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('moverlay')) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

document.querySelectorAll('.tb').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.tb').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    document.documentElement.setAttribute('data-theme', b.dataset.t);
    localStorage.setItem('th', b.dataset.t);
  });
});

const savedTh = localStorage.getItem('th');
if (savedTh) {
  document.documentElement.setAttribute('data-theme', savedTh);
  document.querySelectorAll('.tb').forEach(b => b.classList.toggle('on', b.dataset.t === savedTh));
}

let searchTimer;
document.getElementById('searchInput').addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { S.search = e.target.value.trim(); render(); }, 200);
});

document.querySelectorAll('.db').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.db').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    S.disc = parseInt(b.dataset.disc);
    render();
  });
});

document.querySelectorAll('.gt').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.gt').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    S.genre = b.dataset.g;
    render();
  });
});

document.getElementById('sortSel').addEventListener('change', e => {
  S.sort = e.target.value;
  render();
});

document.getElementById('sbBudget').addEventListener('input', updateSidebarBudget);

document.getElementById('sidebarOverlay').addEventListener('click', closeSidebarMobile);

fetchSteam();
