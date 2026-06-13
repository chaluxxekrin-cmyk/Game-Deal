const STEAM_URLS = [
  'https://store.steampowered.com/api/featuredcategories/?cc=th&l=english',
  'https://store.steampowered.com/api/featured/?cc=th&l=english',
];

const CHEAPSHARK_URL = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&pageSize=100&sortBy=DealRating&desc=1&upperPrice=100';

const PROXIES = [
  u => u,
  u => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  u => `https://thingproxy.freeboard.io/fetch/${u}`,
];

const BUILD = 'v12-2026-06-13';
console.log('SteamDeal ' + BUILD);
const CACHE_KEY = 'steamdeal_v8';

const ICONS = {
  search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
  filter: '<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  gift: '<path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/>',
  puzzle: '<path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/>',
  heart: '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',
  gamepad: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
  loader: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
};
function icon(name, cls = '') {
  return `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}
const CACHE_TTL = 2 * 60 * 1000;
const THB_RATE = 33;
const LIVE_API_BASE = (window.STEAMDEAL_API_BASE || '').replace(/\/$/, '');
const LIVE_API = `${LIVE_API_BASE}/api/steam-deals`;
const LIVE_PAGE_SIZE = 50;

let ALL_GAMES = [];
let dataSource = 'fallback';
let fetchedAt = null;
let autoTimer = null;
let liveStart = 0;
let liveTotal = 0;
let liveLoading = false;
let liveAvailable = location.protocol !== 'file:';
let liveKey = '';
let liveExhausted = false;
let LIVE_VIEW = [];
let liveGen = 0;
let renderedIds = new Set();

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

function parseSteamItems(items = []) {
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
    games.push({ appid: item.id, name: item.name || '', dev: item.publisher || '', orig, sale, disc, genres: [], tags: [], coop: false, multi: false, rating: 0, free: isFree, _live: true });
  }
  return games;
}

async function fetchCheapShark() {
  const data = await tryFetch(CHEAPSHARK_URL);
  if (!Array.isArray(data)) return [];
  const games = [];
  const seen = new Set();
  for (const item of data) {
    const appid = parseInt(item.steamAppID);
    if (!appid || isNaN(appid) || seen.has(appid)) continue;
    seen.add(appid);
    const disc = Math.round(parseFloat(item.savings));
    const saleUSD = parseFloat(item.salePrice);
    const origUSD = parseFloat(item.normalPrice);
    if (saleUSD <= 0 && disc <= 0) continue;
    games.push({
      appid, name: item.title, dev: '',
      orig: Math.round(origUSD * THB_RATE),
      sale: Math.round(saleUSD * THB_RATE),
      disc, genres: [], tags: [],
      coop: false, multi: false,
      rating: parseInt(item.steamRatingPercent) || 0,
      free: saleUSD === 0 && origUSD === 0,
      _cs: true,
    });
  }
  return games;
}

function isLiveMode() {
  return liveAvailable && (S.tab === 'sale' || S.tab === 'free' || S.tab === 'dlc');
}

function currentLiveParams() {
  return {
    mode: S.tab === 'free' ? 'free' : S.tab === 'dlc' ? 'dlc' : 'sale',
    genre: (S.tab === 'sale' || S.tab === 'dlc') ? S.genre : '',
    search: S.search || '',
    discount: (S.tab === 'sale' || S.tab === 'dlc') ? S.disc : 0,
    sort: S.sort || 'disc',
  };
}

function makeLiveKey(params = currentLiveParams()) {
  return JSON.stringify(params);
}

async function fetchLiveSteamPage(start = 0, params = currentLiveParams()) {
  if (!liveAvailable) return null;
  try {
    const qs = new URLSearchParams({
      start: String(start),
      count: String(LIVE_PAGE_SIZE),
      mode: params.mode,
      genre: params.genre,
      search: params.search,
      discount: String(params.discount),
      sort: params.sort || 'disc',
    });
    const res = await fetch(`${LIVE_API}?${qs}`, {
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`Live API ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.games)) return null;
    liveTotal = data.total || data.games.length;
    return data;
  } catch {
    liveAvailable = false;
    return null;
  }
}

function mergeGames(incoming, replace = false) {
  const base = replace ? [] : ALL_GAMES;
  const byId = new Map(base.map(g => [g.appid, g]));
  const normalized = [];

  for (const game of incoming) {
    byId.set(game.appid, game);
    normalized.push(game);
  }

  ALL_GAMES = [...byId.values()];
  return normalized;
}

async function loadMoreLive(reset = false) {
  if (!isLiveMode()) return false;
  const params = currentLiveParams();
  const key = makeLiveKey(params);
  const needReset = reset || key !== liveKey;
  if (!needReset && (liveLoading || liveExhausted)) return false;

  if (needReset) {
    liveGen++;
    liveKey = key;
    liveStart = 0;
    liveTotal = 0;
    liveExhausted = false;
    LIVE_VIEW = [];
    S.filtered = [];
    S.page = 0;
    S.shown = 0;
    S.allLoaded = false;
    renderedIds = new Set();
    showSkeletons();
  }
  const gen = liveGen;

  liveLoading = true;
  document.getElementById('lmi').style.display = 'block';
  document.getElementById('lmi').textContent = 'กำลังดึงเพิ่มจาก Steam...';

  let data = null;
  let newCount = 0;
  for (let tries = 0; tries < 8 && newCount === 0 && !liveExhausted; tries++) {
    data = await fetchLiveSteamPage(liveStart, params);
    if (gen !== liveGen) return false;
    if (!data) break;
    const rawCount = data.rawCount || (data.games || []).length || 0;
    liveTotal = data.total || liveTotal || rawCount;
    liveStart += rawCount || LIVE_PAGE_SIZE;
    if (!rawCount || liveStart >= liveTotal) liveExhausted = true;
    const merged = mergeGames(data.games || []);
    const seen = new Set(LIVE_VIEW.map(g => g.appid));
    const fresh = [];
    for (const g of merged) {
      if (seen.has(g.appid)) continue;
      seen.add(g.appid);
      fresh.push(g);
    }
    if (fresh.length) {
      LIVE_VIEW.push(...fresh);
      newCount += fresh.length;
    }
  }
  liveLoading = false;

  if (!data) {
    document.getElementById('lmi').textContent = 'โหลดข้อมูลสดเพิ่มไม่ได้';
    liveExhausted = true;
    if (needReset) {
      document.getElementById('gameGrid').innerHTML = '';
      render();
    }
    return false;
  }

  fetchedAt = new Date(data.fetchedAt || Date.now());
  dataSource = 'live';
  setStatus('success', `เชื่อม Steam สด — โหลด ${LIVE_VIEW.length} รายการจากผลลัพธ์ ${Math.min(liveStart, liveTotal || liveStart)} / ${liveTotal || liveStart}`);
  S.filtered = buildFilteredList();
  if (needReset) {
    S.page = 0;
    S.shown = 0;
    S.allLoaded = false;
    document.getElementById('gameGrid').innerHTML = '';
  }
  if (newCount > 0 || needReset) {
    S.allLoaded = false;
    loadMore();
  } else if (liveExhausted) {
    document.getElementById('lmi').style.display = 'none';
  }
  updateStats();
  return newCount > 0;
}

async function fetchSteam(force = false) {
  if (!force) {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        ALL_GAMES = cached.games;
        LIVE_VIEW = cached.liveView || ALL_GAMES.filter(g => g._live && !g.free && !g.type);
        liveStart = cached.liveStart || ALL_GAMES.filter(g => g._live).length || 0;
        liveTotal = cached.liveTotal || liveStart;
        liveKey = cached.liveKey || makeLiveKey({ mode: 'sale', genre: '', search: '', discount: 0, sort: 'disc' });
        liveExhausted = false;
        liveAvailable = location.protocol !== 'file:';
        fetchedAt = new Date(cached.ts);
        dataSource = 'cache';
        setStatus('cache', `แคชข้อมูล — อัปเดตเมื่อ ${timeAgo(fetchedAt)}`);
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

  liveAvailable = location.protocol !== 'file:';
  LIVE_VIEW = [];
  liveStart = 0;
  liveTotal = 0;
  liveExhausted = false;
  liveKey = '';

  const liveLoaded = await loadMoreLive(true);
  if (liveLoaded || LIVE_VIEW.length) {
    dataSource = 'live';
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        games: ALL_GAMES,
        liveView: LIVE_VIEW,
        ts: fetchedAt.getTime(),
        liveStart,
        liveTotal,
        liveKey,
      }));
    } catch {}
    document.getElementById('liveDot').style.display = 'block';
    document.getElementById('liveLabel').style.display = 'block';
    spinRefresh(false);
    updateStats();
    startAutoUpdate();
    showToast(`โหลดจาก Steam สด ${LIVE_VIEW.length} เกม`);
    return;
  }

  const [steamData, csGames] = await Promise.allSettled([
    (async () => {
      for (const url of STEAM_URLS) {
        const data = await tryFetch(url);
        if (!data) continue;
        const items = [
          ...(data.specials?.items || []),
          ...(data.top_sellers?.items || []),
          ...(data.new_releases?.items || []),
          ...(data.featured_win || []),
        ];
        const games = parseSteamItems(items);
        if (games.length > 0) return games;
      }
      return [];
    })(),
    fetchCheapShark(),
  ]);

  const steamGames = steamData.status === 'fulfilled' ? steamData.value : [];
  const cheapSharkGames = csGames.status === 'fulfilled' ? csGames.value : [];

  const seen = new Set();
  const merged = [];

  const addGame = (g) => {
    if (seen.has(g.appid)) return;
    seen.add(g.appid);
    merged.push(g);
  };

  for (const g of steamGames) addGame(g);
  for (const g of cheapSharkGames) addGame(g);

  ALL_GAMES = merged;
  fetchedAt = new Date();

  const liveCount = merged.length;
  if (liveCount > 0) {
    dataSource = steamGames.length > 0 ? 'live' : 'cache';
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ games: ALL_GAMES, ts: fetchedAt.getTime() })); } catch {}
    setStatus('success', `ดึงข้อมูลสำรองสำเร็จ — Steam ${steamGames.length} + CheapShark ${cheapSharkGames.length} เกม`);
    document.getElementById('liveDot').style.display = 'block';
    document.getElementById('liveLabel').style.display = 'block';
    showToast(`โหลดสำรอง ${liveCount} เกม`);
  } else {
    dataSource = 'fallback';
    setStatus('error', 'เชื่อมต่อ Steam ไม่ได้ — ลองรีเฟรชอีกครั้ง');
    showToast('เชื่อมต่อไม่ได้');
  }

  spinRefresh(false);
  render();
  updateStats();
  startAutoUpdate();
}

function hardReload() {
  try { sessionStorage.removeItem(CACHE_KEY); } catch {}
  location.replace(location.pathname + '?r=' + Date.now());
}

function startAutoUpdate() {
  clearInterval(autoTimer);
  updateTimestamp();
  autoTimer = setInterval(() => {
    updateTimestamp();
    const atTop = window.scrollY < 300;
    const stale = fetchedAt && Date.now() - fetchedAt.getTime() >= CACHE_TTL;
    if (stale && atTop && S.tab !== 'wish' && document.visibilityState === 'visible') {
      fetchSteam(true);
    }
  }, 30000);
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
  return `${Math.round(m / 60)} ชม. ที่แล้ว`;
}

function spinRefresh(on) {
  document.getElementById('refreshBtn').classList.toggle('spinning', on);
}

function setStatus(type, msg) {
  const b = document.getElementById('statusBanner');
  b.className = 'status-banner ' + (type === 'success' ? 'success' : type === 'error' ? 'error' : '');
  const icons = { loading: icon('loader', 'spin'), success: icon('check'), cache: icon('package'), error: icon('alert') };
  const labels = { live: 'LIVE', cache: 'CACHED', fallback: 'OFFLINE' };
  b.innerHTML = `<span class="s-ic">${icons[type] || ''}</span><span class="s-text">${msg}</span><span class="src-chip ${dataSource}">${labels[dataSource] || ''}</span>`;
  updateTimestamp();
}

function thumb(id) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showSkeletons() {
  document.getElementById('gameGrid').innerHTML = Array(12).fill(0).map(() => `
    <div class="gskel"><div class="sk-img"></div><div class="sk-body">
      <div class="sk-line w80"></div><div class="sk-line w45"></div><div class="sk-line w70"></div>
    </div></div>`).join('');
}

function loadWishStore() {
  let data = [];
  let ids = [];
  try { data = JSON.parse(localStorage.getItem('wl_data') || '[]'); } catch {}
  try { ids = JSON.parse(localStorage.getItem('wl') || '[]'); } catch {}
  if (!Array.isArray(data)) data = [];
  if (!Array.isArray(ids)) ids = [];
  const map = new Map(data.filter(g => g && g.appid).map(g => [g.appid, g]));
  const set = new Set([...map.keys(), ...ids]);
  return { set, map };
}
const _wl = loadWishStore();

const S = {
  tab: 'sale', disc: 0, genre: '', search: '', sort: 'disc',
  wishlist: _wl.set,
  wishMap: _wl.map,
  filtered: [], page: 0, shown: 0, perPage: 24, loading: false, allLoaded: false,
};

function saveWishlist() {
  localStorage.setItem('wl', JSON.stringify([...S.wishlist]));
  localStorage.setItem('wl_data', JSON.stringify([...S.wishMap.values()]));
}

function updateStats() {
  const paid = ALL_GAMES.filter(g => !g.free && !g.type && g.sale > 0);
  const free = ALL_GAMES.filter(g => g.free);
  const liveSaleMode = dataSource === 'live' && (S.tab === 'sale' || S.tab === 'dlc') && liveTotal > 0;
  const totalCount = liveSaleMode ? liveTotal : paid.length;
  document.getElementById('stTotal').textContent = totalCount.toLocaleString();
  const sample = (dataSource === 'live' && LIVE_VIEW.length) ? LIVE_VIEW.filter(g => !g.free) : paid;
  const discs = sample.map(x => x.disc).filter(x => x > 0);
  document.getElementById('stMax').textContent = (discs.length ? Math.max(...discs) : 0) + '%';
  const avg = discs.length ? Math.round(discs.reduce((a, x) => a + x, 0) / discs.length) : 0;
  document.getElementById('stAvg').textContent = avg + '%';
  const freeCount = (dataSource === 'live' && S.tab === 'free' && liveTotal > 0) ? liveTotal : free.length;
  document.getElementById('stFree').textContent = freeCount.toLocaleString();
}

function getPool() {
  if (isLiveMode()) return LIVE_VIEW;
  if (S.tab === 'free') return ALL_GAMES.filter(g => g.free);
  if (S.tab === 'wish') {
    const live = new Map(ALL_GAMES.map(g => [g.appid, g]));
    return [...S.wishlist].map(id => live.get(id) || S.wishMap.get(id)).filter(Boolean);
  }
  if (S.tab === 'dlc') return ALL_GAMES.filter(g => g.type === 'dlc');
  return ALL_GAMES.filter(g => !g.free && !g.type && g.sale > 0);
}

function buildFilteredList() {
  let list = getPool();

  if (isLiveMode()) return (S.tab === 'sale' || S.tab === 'dlc') ? list.filter(g => !g.free) : list;

  if (!isLiveMode() && (S.tab === 'sale' || S.tab === 'dlc')) {
    if (S.disc > 0) list = list.filter(g => g.disc >= S.disc);
    if (S.genre) list = list.filter(g => g.genres.includes(S.genre));
  }

  if (!isLiveMode() && S.search) {
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

  return list;
}

function render() {
  const list = buildFilteredList();
  S.filtered = list;
  S.page = 0;
  S.shown = 0;
  S.allLoaded = false;
  renderedIds = new Set();
  document.getElementById('gameGrid').innerHTML = '';
  loadMore();
  updateSidebarBudget();
}

function loadMore() {
  if (S.loading || S.allLoaded) return;
  S.loading = true;
  const start = S.shown;
  const slice = S.filtered.slice(start, start + S.perPage);

  if (!slice.length) {
    if (isLiveMode() && !liveExhausted) {
      S.loading = false;
      loadMoreLive(false);
      return;
    }
    S.allLoaded = true;
    document.getElementById('lmi').style.display = 'none';
    if (S.page === 0) {
      document.getElementById('gameGrid').innerHTML = `
        <div class="empty"><div class="big">${icon('gamepad')}</div><p>ไม่พบเกมที่ตรงเงื่อนไข</p></div>`;
    }
    document.getElementById('rcCount').textContent = `${S.filtered.length} รายการ`;
    S.loading = false;
    return;
  }

  requestAnimationFrame(() => {
    const frag = document.createDocumentFragment();
    for (const g of slice) {
      if (renderedIds.has(g.appid)) continue;
      renderedIds.add(g.appid);
      const el = document.createElement('div');
      el.innerHTML = cardHTML(g);
      frag.appendChild(el.firstElementChild);
    }
    document.getElementById('gameGrid').appendChild(frag);
    S.page++;
    S.shown += slice.length;
    const shown = Math.min(S.shown, S.filtered.length);
    document.getElementById('rcCount').textContent = `${shown} / ${S.filtered.length} รายการ`;
    if (S.shown >= S.filtered.length) {
      S.allLoaded = true;
      if (isLiveMode() && !liveExhausted) {
        S.allLoaded = false;
        S.loading = false;
        loadMoreLive(false);
        return;
      }
      document.getElementById('lmi').style.display = 'none';
    }
    S.loading = false;
    maybePrefetchLive();
  });
}

function maybePrefetchLive() {
  if (isLiveMode() && !liveExhausted && !liveLoading && (S.filtered.length - S.shown) < S.perPage) {
    loadMoreLive(false);
  }
}

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) loadMore();
}, { rootMargin: '1200px' });
observer.observe(document.getElementById('sentinel'));

function cardHTML(g) {
  const inW = S.wishlist.has(g.appid);
  const steamUrl = `https://store.steampowered.com/app/${g.appid}`;
  const imgUrl = g.img || thumb(g.appid);

  const badge = g.disc > 0 && !g.free
    ? `<div class="dbadge">-${g.disc}%</div>` : '';
  const dlcBadge = g.type === 'dlc'
    ? `<div class="dbadge dlc">DLC</div>` : '';
  const tags = g.tags.slice(0, 2).map(t => `<span class="gtag2">${esc(t)}</span>`).join('');

  const priceHtml = g.free
    ? `<span class="pfree">ฟรี</span>`
    : `<span class="pnew">฿${g.sale.toLocaleString()}</span>`;
  const origHtml = g.disc > 0 && !g.free
    ? `<span class="porig">฿${g.orig.toLocaleString()}</span>` : '';

  const sourceChip = g._live
    ? `<span class="card-chip live">LIVE</span>`
    : g._cs
      ? `<span class="card-chip cs">~THB</span>`
      : '';

  return `<a class="gc" href="${steamUrl}" target="_blank" rel="noopener">
    <div class="gthumb">
      <img src="${imgUrl}" loading="lazy" alt="${esc(g.name)}"
        onerror="this.onerror=null;this.src='https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/header.jpg';this.onerror=function(){this.style.display='none'}">
      ${badge}${dlcBadge}
      <button class="wbtn${inW ? ' on' : ''}" data-id="${g.appid}"
        onclick="event.preventDefault();event.stopPropagation();toggleWish(event,${g.appid})"
        aria-label="Wishlist">${icon('heart')}</button>
    </div>
    <div class="gi">
      <div class="gname">${esc(g.name)} ${sourceChip}</div>
      <div class="gdev">${esc(g.dev) || '&nbsp;'}</div>
      <div class="gtags2">${tags}</div>
      <div class="grow">
        <div>${origHtml} ${priceHtml}</div>
        ${g.rating > 0 ? `<span class="grating">${icon('star')} ${g.rating}%</span>` : ''}
      </div>
    </div>
  </a>`;
}

function switchTab(tab) {
  S.tab = tab;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  const titles = {
    sale: `${icon('zap')} เกมลดราคาตอนนี้`,
    free: `${icon('gift')} เกมฟรีเล่นได้เลย`,
    wish: `${icon('heart')} Wishlist ของคุณ`,
    dlc: `${icon('puzzle')} DLC ลดราคา`,
  };
  document.getElementById('secTitle').innerHTML = titles[tab] || '';
  const showSidebar = tab === 'sale' || tab === 'dlc';
  const sidebar = document.getElementById('sidebar');
  const layout = document.querySelector('.layout');
  const filterBtn = document.getElementById('filterBtn');
  if (window.innerWidth > 768) sidebar.style.display = showSidebar ? '' : 'none';
  layout.classList.toggle('full', !showSidebar);
  if (filterBtn) filterBtn.style.display = showSidebar ? '' : 'none';
  closeSidebarMobile();
  if (isLiveMode()) loadMoreLive(true);
  else render();
}

function toggleSidebarMobile() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

function closeSidebarMobile() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

function updateSidebarBudget() {
  const b = parseFloat(document.getElementById('sbBudget').value);
  const el = document.getElementById('sbRes');
  if (!b || b <= 0) { el.textContent = ''; return; }
  const cnt = S.filtered.filter(g => g.sale > 0 && g.sale <= b).length;
  el.textContent = `ซื้อได้ ${cnt} รายการในงบนี้`;
}

function calcBudget() {
  const b = parseFloat(document.getElementById('budgetIn').value);
  if (!b || b <= 0) { showToast('กรอกงบก่อนนะ'); return; }
  const pool = ALL_GAMES.filter(g => !g.free && g.sale > 0 && g.sale <= b).sort((a, c) => c.disc - a.disc);
  const out = document.getElementById('budgetOut');
  if (!pool.length) {
    out.innerHTML = `<div class="bsum">ไม่พบรายการในงบ ฿${b.toLocaleString()}</div>`;
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
  out.innerHTML = `<div class="bsum">งบ <strong>฿${b.toLocaleString()}</strong> ซื้อได้ <strong>${pool.length}</strong> รายการ · แนะนำชุดนี้:</div>
    <div class="blist">${bundle.map(g => `<div class="bi">
      <img src="${thumb(g.appid)}" onerror="this.style.display='none'" alt="">
      <span class="bin">${esc(g.name)}</span>
      <span class="bip">฿${g.sale.toLocaleString()}</span>
    </div>`).join('')}</div>
    <div class="btot">รวม <strong>฿${total.toLocaleString()}</strong> · เหลือ ฿${(b - total).toFixed(0)}</div>`;
  out.classList.add('show');
}

function toggleWish(e, id) {
  e.stopPropagation();
  if (S.wishlist.has(id)) {
    S.wishlist.delete(id);
    S.wishMap.delete(id);
    showToast('ลบออกจาก Wishlist');
  } else {
    S.wishlist.add(id);
    const g = ALL_GAMES.find(x => x.appid === id) || LIVE_VIEW.find(x => x.appid === id);
    if (g) S.wishMap.set(id, g);
    showToast('เพิ่มใน Wishlist');
  }
  saveWishlist();
  if (S.tab === 'wish') {
    render();
  } else {
    document.querySelectorAll(`.wbtn[data-id="${id}"]`).forEach(btn => {
      btn.classList.toggle('on', S.wishlist.has(id));
    });
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2400);
}

document.getElementById('sidebarOverlay').addEventListener('click', closeSidebarMobile);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebarMobile(); });

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
function doSearch() {
  clearTimeout(searchTimer);
  const v = document.getElementById('searchInput').value.trim();
  if (v === S.search) return;
  S.search = v;
  if (isLiveMode()) loadMoreLive(true);
  else render();
}
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(doSearch, 450);
});
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
});

document.querySelectorAll('.db').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.db').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    S.disc = parseInt(b.dataset.disc);
    if (isLiveMode()) loadMoreLive(true);
    else render();
  });
});

document.querySelectorAll('.gt').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.gt').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    S.genre = b.dataset.g;
    if (isLiveMode()) loadMoreLive(true);
    else render();
  });
});

document.getElementById('sortSel').addEventListener('change', e => {
  S.sort = e.target.value;
  if (isLiveMode()) loadMoreLive(true);
  else render();
});

document.getElementById('sbBudget').addEventListener('input', updateSidebarBudget);

function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    el.innerHTML = icon(el.dataset.icon, el.dataset.iconClass || '');
    el.removeAttribute('data-icon');
  });
}
hydrateIcons();

fetchSteam();