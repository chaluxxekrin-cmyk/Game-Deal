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

const BUILD = 'v8-2026-06-13';
console.log(`%cSteamDeal build ${BUILD}`, 'color:#4ade80;font-weight:700');
const CACHE_KEY = 'steamdeal_v8';
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
let liveGen = 0;   // เพิ่มทุกครั้งที่ reset (ค้นหา/กรอง/เรียงใหม่) เพื่อทิ้งผลโหลดเก่าที่ค้างอยู่

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
  // เฉพาะการโหลดหน้าถัดไป (ไม่ใช่ reset) เท่านั้นที่ถูกบล็อกตอนกำลังโหลด/หมดแล้ว
  // ส่วน reset (ค้นหา/กรอง/เรียงใหม่) ต้องทำงานเสมอ
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
  // วนดึงหน้าถัดไปเรื่อยๆ จนกว่าจะได้เกม "ใหม่ที่ไม่ซ้ำ" จริง (ข้ามหน้าที่ซ้ำทั้งหน้า ไม่ให้ตัน)
  for (let tries = 0; tries < 8 && newCount === 0 && !liveExhausted; tries++) {
    data = await fetchLiveSteamPage(liveStart, params);
    if (gen !== liveGen) return false;  // ถูก reset ระหว่างรอ → ทิ้งผลเก่า (call ใหม่จะคุม liveLoading เอง)
    if (!data) break;
    const rawCount = data.rawCount || (data.games || []).length || 0;
    liveTotal = data.total || liveTotal || rawCount;
    liveStart += rawCount || LIVE_PAGE_SIZE;
    if (!rawCount || liveStart >= liveTotal) liveExhausted = true;
    const merged = mergeGames(data.games || []);
    const seen = new Set(LIVE_VIEW.map(g => g.appid));
    const fresh = [];
    for (const g of merged) {
      if (seen.has(g.appid)) continue;   // กันซ้ำทั้งกับหน้าก่อน และซ้ำภายในหน้าเดียวกัน
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
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      games: ALL_GAMES,
      liveView: LIVE_VIEW,
      ts: fetchedAt.getTime(),
      liveStart,
      liveTotal,
      liveKey,
    }));
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
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ games: ALL_GAMES, ts: fetchedAt.getTime() }));
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

function startAutoUpdate() {
  clearInterval(autoTimer);
  updateTimestamp();
  autoTimer = setInterval(() => {
    updateTimestamp();
    // รีเฟรชสดอัตโนมัติเฉพาะตอนผู้ใช้อยู่บนสุดของหน้า เพื่อไม่รีเซ็ตตำแหน่งที่กำลังเลื่อนดูอยู่
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
  const icons = { loading: '⏳', success: '✅', cache: '📦', error: '⚠️' };
  const labels = { live: 'LIVE', cache: 'CACHED', fallback: 'OFFLINE' };
  b.innerHTML = `<span>${icons[type] || '•'}</span><span class="s-text">${msg}</span><span class="src-chip ${dataSource}">${labels[dataSource] || ''}</span>`;
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
  const dlc = ALL_GAMES.filter(g => g.type === 'dlc');
  // ในโหมด live ให้ stTotal แสดงยอดรวมจริงจาก Steam ไม่ใช่แค่ที่โหลดมา
  const liveSaleMode = dataSource === 'live' && (S.tab === 'sale' || S.tab === 'dlc') && liveTotal > 0;
  const totalCount = liveSaleMode ? liveTotal : paid.length;
  document.getElementById('stTotal').textContent = totalCount.toLocaleString();
  // คิดส่วนลดจากรายการที่กำลังแสดงอยู่จริง (LIVE_VIEW ในโหมด live)
  const sample = (dataSource === 'live' && LIVE_VIEW.length) ? LIVE_VIEW.filter(g => !g.free) : paid;
  const discs = sample.map(x => x.disc).filter(x => x > 0);
  document.getElementById('stMax').textContent = (discs.length ? Math.max(...discs) : 0) + '%';
  const avg = discs.length ? Math.round(discs.reduce((a, x) => a + x, 0) / discs.length) : 0;
  document.getElementById('stAvg').textContent = avg + '%';
  const freeCount = (dataSource === 'live' && S.tab === 'free' && liveTotal > 0) ? liveTotal : free.length;
  document.getElementById('stFree').textContent = freeCount.toLocaleString();
  const dlcEl = document.getElementById('stDlc');
  if (dlcEl) dlcEl.textContent = dlc.length;
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

  // โหมด live: กรอง+เรียงทำที่เซิร์ฟเวอร์แล้ว (Steam) คืนลำดับเดิมเพื่อให้ infinite scroll ต่อท้ายแบบเสถียร
  // กันเกมฟรี (ราคา 0) หลุดมาในแท็บลดราคา/DLC แม้ worker ตัวเก่ายังไม่กรอง
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

// appid ที่ render ลง DOM ไปแล้ว — กันการ์ดซ้ำเด็ดขาดไม่ว่า data จะซ้ำมาจากไหน
let renderedIds = new Set();

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
        <div class="empty"><div class="big">🎮</div><p>ไม่พบเกมที่ตรงเงื่อนไข</p></div>`;
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

// ดึงหน้าถัดไปจาก Steam ล่วงหน้าเมื่อ buffer ใกล้หมด เพื่อให้เลื่อนได้ต่อเนื่องไม่สะดุด
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
    ? `<div class="dbadge" style="background:#8b5cf6">DLC</div>` : '';
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
        aria-label="Wishlist">${inW ? '❤️' : '🤍'}</button>
    </div>
    <div class="gi">
      <div class="gname">${esc(g.name)} ${sourceChip}</div>
      <div class="gdev">${esc(g.dev) || '&nbsp;'}</div>
      <div class="gtags2">${tags}</div>
      <div class="grow">
        <div>${origHtml} ${priceHtml}</div>
        ${g.rating > 0 ? `<span class="grating">⭐ ${g.rating}%</span>` : ''}
      </div>
    </div>
  </a>`;
}

function switchTab(tab) {
  S.tab = tab;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  const titles = { sale: '⚡ เกมลดราคาตอนนี้', free: '🆓 เกมฟรีเล่นได้เลย', wish: '❤️ Wishlist ของคุณ', dlc: '🎁 DLC ลดราคา' };
  document.getElementById('secTitle').textContent = titles[tab] || '';
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
      const inW = S.wishlist.has(id);
      btn.classList.toggle('on', inW);
      btn.textContent = inW ? '❤️' : '🤍';
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
  if (v === S.search) return;   // ไม่เปลี่ยน ไม่ต้องค้นซ้ำ
  S.search = v;
  if (isLiveMode()) loadMoreLive(true);
  else render();
}
const searchInput = document.getElementById('searchInput');
// พิมพ์แล้วค้นอัตโนมัติ (debounce) — ไม่ต้องกดอะไร
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(doSearch, 450);
});
// กด Enter = ค้นทันที
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

fetchSteam();