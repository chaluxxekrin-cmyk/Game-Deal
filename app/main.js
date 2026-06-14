const BUILD = 'v24-2026-06-14';
console.log('GameDeal ' + BUILD);

const ICONS = {
  search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
  filter: '<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  gift: '<path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/>',
  puzzle: '<path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/>',
  heart: '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',
  gamepad: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
};
function icon(name, cls = '') {
  return `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

const SOURCES = window.GAMEDEAL_SOURCES || [];
const ADAPTERS = {};
function getAdapter(src) {
  if (!src) return null;
  if (!ADAPTERS[src.id]) ADAPTERS[src.id] = window.GD_ADAPTERS[src.type](src);
  return ADAPTERS[src.id];
}
function sourceById(id) {
  return SOURCES.find(s => s.id === id) || null;
}
function cardLink(g) {
  const a = getAdapter(sourceById(g._source)) || adapter;
  return a ? a.cardLink(g) : '#';
}
function cardImage(g) {
  const a = getAdapter(sourceById(g._source)) || adapter;
  return a ? a.cardImage(g) : (g.img || '');
}

let curSource = null;
let adapter = null;
let fetchedAt = null;
let autoTimer = null;
let liveTotal = 0;
let liveLoading = false;
let liveKey = '';
let liveExhausted = false;
let LIVE_VIEW = [];
let liveGen = 0;
let renderedIds = new Set();

function loadWishStore() {
  let data = [];
  try { data = JSON.parse(localStorage.getItem('wl_data') || '[]'); } catch {}
  if (!Array.isArray(data)) data = [];
  data = data
    .map(g => (g && !g.key && g.appid) ? { ...g, key: 'steam:' + g.appid, _source: 'steam' } : g)
    .filter(g => g && g.key);
  const map = new Map(data.map(g => [g.key, g]));
  return { set: new Set(map.keys()), map };
}
const _wl = loadWishStore();

const S = {
  tab: 'sale', disc: 0, genre: '', search: '', sort: 'disc', budget: 0,
  currency: localStorage.getItem('currency') || 'usd',
  wishlist: _wl.set,
  wishMap: _wl.map,
  filtered: [], page: 0, shown: 0, perPage: 24, loading: false, allLoaded: false,
};

function saveWishlist() {
  localStorage.setItem('wl_data', JSON.stringify([...S.wishMap.values()]));
}

function currentParams() {
  const filterable = S.tab === 'sale' || S.tab === 'dlc';
  return {
    mode: S.tab === 'free' ? 'free' : S.tab === 'dlc' ? 'dlc' : 'sale',
    genre: (filterable && adapter && adapter.genre) ? S.genre : '',
    search: S.search || '',
    discount: filterable ? S.disc : 0,
    sort: S.sort || 'disc',
    cc: curInfo().cc,
  };
}
function makeLiveKey() {
  return (curSource ? curSource.id : '') + ':' + JSON.stringify(currentParams());
}
function isLiveMode() {
  return S.tab !== 'wish' && !!adapter;
}

function setLmi(text) {
  const lmi = document.getElementById('lmi');
  lmi.style.display = 'block';
  lmi.textContent = text;
}
function hideLmi() {
  document.getElementById('lmi').style.display = 'none';
}

async function loadMoreLive(reset = false) {
  if (!isLiveMode()) return false;
  const key = makeLiveKey();
  const needReset = reset || key !== liveKey;
  if (!needReset && (liveLoading || liveExhausted)) return false;

  if (needReset) {
    liveGen++;
    liveKey = key;
    liveTotal = 0;
    liveExhausted = false;
    LIVE_VIEW = [];
    S.filtered = [];
    S.page = 0;
    S.shown = 0;
    S.allLoaded = false;
    renderedIds = new Set();
    adapter.reset(currentParams());
    showSkeletons();
  }
  const gen = liveGen;

  liveLoading = true;
  setLmi(t('loading'));

  let newCount = 0;
  let failed = false;
  for (let tries = 0; tries < 8 && newCount === 0 && !liveExhausted; tries++) {
    let r;
    try { r = await adapter.next(); } catch { r = null; }
    if (gen !== liveGen) return false;
    if (!r) { failed = true; break; }
    liveTotal = r.total || liveTotal;
    if (r.exhausted) liveExhausted = true;
    const seen = new Set(LIVE_VIEW.map(g => g.key));
    for (const g of (r.games || [])) {
      if (!g || seen.has(g.key)) continue;
      seen.add(g.key);
      LIVE_VIEW.push(g);
      newCount++;
    }
  }
  liveLoading = false;

  if (failed && LIVE_VIEW.length === 0) {
    liveExhausted = true;
    document.getElementById('gameGrid').innerHTML =
      `<div class="empty"><div class="big">${icon('gamepad')}</div><p>${t('cant_connect')}</p></div>`;
    hideLmi();
    return false;
  }

  fetchedAt = new Date();
  document.getElementById('liveDot').style.display = 'block';
  document.getElementById('liveLabel').style.display = 'block';
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
    hideLmi();
  }
  updateStats();
  updateTimestamp();
  return newCount > 0;
}

function startAutoUpdate() {
  clearInterval(autoTimer);
  updateTimestamp();
  autoTimer = setInterval(() => {
    updateTimestamp();
    const atTop = window.scrollY < 300;
    const stale = fetchedAt && Date.now() - fetchedAt.getTime() >= 2 * 60 * 1000;
    if (stale && atTop && S.tab !== 'wish' && document.visibilityState === 'visible') {
      loadMoreLive(true);
    }
  }, 30000);
}

function updateTimestamp() {
  if (!fetchedAt) return;
  document.getElementById('updatedAt').textContent = t('updated', { t: timeAgo(fetchedAt) });
}

function timeAgo(d) {
  const s = Math.round((Date.now() - d) / 1000);
  if (s < 60) return t('ago_s', { n: s });
  const m = Math.round(s / 60);
  if (m < 60) return t('ago_m', { n: m });
  return t('ago_h', { n: Math.round(m / 60) });
}

function spinRefresh(on) {
  document.getElementById('refreshBtn').classList.toggle('spinning', on);
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const CURRENCIES = [
  { code: 'usd', cc: 'us', sym: '$', label: 'USD $' },
  { code: 'eur', cc: 'de', sym: '€', label: 'EUR €' },
  { code: 'gbp', cc: 'gb', sym: '£', label: 'GBP £' },
  { code: 'thb', cc: 'th', sym: '฿', label: 'THB ฿' },
  { code: 'jpy', cc: 'jp', sym: '¥', label: 'JPY ¥' },
  { code: 'hkd', cc: 'hk', sym: 'HK$', label: 'HKD HK$' },
  { code: 'krw', cc: 'kr', sym: '₩', label: 'KRW ₩' },
];
function curInfo() {
  return CURRENCIES.find(c => c.code === S.currency) || CURRENCIES[0];
}
function curSym() {
  return (curSource && curSource.type === 'cheapshark') ? '$' : curInfo().sym;
}
function money(v, cur) {
  const c = cur || curSym();
  const n = Number(v) || 0;
  const s = (c === '¥' || c === '₩' || Number.isInteger(n)) ? Math.round(n).toLocaleString() : n.toFixed(2);
  return c + s;
}

function showSkeletons() {
  document.getElementById('gameGrid').innerHTML = Array(12).fill(0).map(() => `
    <div class="gskel"><div class="sk-img"></div><div class="sk-body">
      <div class="sk-line w80"></div><div class="sk-line w45"></div><div class="sk-line w70"></div>
    </div></div>`).join('');
}

function updateStats() {
  const paid = LIVE_VIEW.filter(g => !g.free);
  const free = LIVE_VIEW.filter(g => g.free);
  const totalCount = (liveTotal > 0 && S.tab !== 'wish')
    ? liveTotal
    : (S.tab === 'free' ? free.length : paid.length);
  document.getElementById('stTotal').textContent = Number(totalCount).toLocaleString();
  const discs = paid.map(x => x.disc).filter(x => x > 0);
  document.getElementById('stMax').textContent = (discs.length ? Math.max(...discs) : 0) + '%';
  const avg = discs.length ? Math.round(discs.reduce((a, x) => a + x, 0) / discs.length) : 0;
  document.getElementById('stAvg').textContent = avg + '%';
  document.getElementById('stFree').textContent = Number(S.tab === 'free' ? (liveTotal || free.length) : free.length).toLocaleString();
}

function getPool() {
  if (S.tab === 'wish') {
    return [...S.wishlist]
      .map(k => LIVE_VIEW.find(g => g.key === k) || S.wishMap.get(k))
      .filter(Boolean);
  }
  return LIVE_VIEW;
}

function applyBudget(list) {
  if (S.budget > 0 && (S.tab === 'sale' || S.tab === 'dlc')) {
    return list.filter(g => !g.free && g.sale > 0 && g.sale <= S.budget);
  }
  return list;
}

function buildFilteredList() {
  let list = applyBudget(getPool());
  if (isLiveMode()) return list;

  if (S.search) {
    const q = S.search.toLowerCase();
    list = list.filter(g => g.name.toLowerCase().includes(q) || (g.dev || '').toLowerCase().includes(q));
  }
  if (S.sort === 'disc') list = [...list].sort((a, b) => b.disc - a.disc);
  else if (S.sort === 'pasc') list = [...list].sort((a, b) => a.sale - b.sale);
  else if (S.sort === 'pdesc') list = [...list].sort((a, b) => b.sale - a.sale);
  else if (S.sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  else if (S.sort === 'rev') list = [...list].sort((a, b) => b.rating - a.rating);
  return list;
}

function render() {
  S.filtered = buildFilteredList();
  S.page = 0;
  S.shown = 0;
  S.allLoaded = false;
  renderedIds = new Set();
  document.getElementById('gameGrid').innerHTML = '';
  loadMore();
}

function loadMore() {
  if (S.loading || S.allLoaded) return;
  S.loading = true;
  const slice = S.filtered.slice(S.shown, S.shown + S.perPage);

  if (!slice.length) {
    if (isLiveMode() && !liveExhausted) {
      S.loading = false;
      loadMoreLive(false);
      return;
    }
    S.allLoaded = true;
    hideLmi();
    if (S.page === 0) {
      document.getElementById('gameGrid').innerHTML =
        `<div class="empty"><div class="big">${icon('gamepad')}</div><p>${t('empty')}</p></div>`;
    }
    document.getElementById('rcCount').textContent = `${S.filtered.length} ${t('items')}`;
    S.loading = false;
    return;
  }

  requestAnimationFrame(() => {
    const frag = document.createDocumentFragment();
    for (const g of slice) {
      if (renderedIds.has(g.key)) continue;
      renderedIds.add(g.key);
      const el = document.createElement('div');
      el.innerHTML = cardHTML(g);
      frag.appendChild(el.firstElementChild);
    }
    document.getElementById('gameGrid').appendChild(frag);
    S.page++;
    S.shown += slice.length;
    const shown = Math.min(S.shown, S.filtered.length);
    document.getElementById('rcCount').textContent = `${shown}${liveTotal ? ' / ' + Number(liveTotal).toLocaleString() : ''} ${t('items')}`;
    if (S.shown >= S.filtered.length) {
      S.allLoaded = true;
      if (isLiveMode() && !liveExhausted) {
        S.allLoaded = false;
        S.loading = false;
        loadMoreLive(false);
        return;
      }
      hideLmi();
    }
    S.loading = false;
    maybePrefetchLive();
  });
}

function maybePrefetchLive() {
  if (S.loading || liveLoading || S.allLoaded) return;
  const s = document.getElementById('sentinel');
  if (s && s.getBoundingClientRect().top <= window.innerHeight + 1200) loadMore();
}

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) loadMore();
}, { rootMargin: '1200px' });
observer.observe(document.getElementById('sentinel'));

let prefetchTick = false;
window.addEventListener('scroll', () => {
  if (prefetchTick) return;
  prefetchTick = true;
  requestAnimationFrame(() => { prefetchTick = false; maybePrefetchLive(); });
}, { passive: true });

function cardHTML(g) {
  const inW = S.wishlist.has(g.key);
  const link = cardLink(g);
  const img = cardImage(g);
  const fallback = g.appid ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/header.jpg` : '';

  const badge = g.disc > 0 && !g.free ? `<div class="dbadge">-${g.disc}%</div>` : '';
  const dlcBadge = g.type === 'dlc' ? `<div class="dbadge dlc">DLC</div>` : '';
  const tags = (g.tags || []).slice(0, 2).map(t => `<span class="gtag2">${esc(t)}</span>`).join('');

  const priceHtml = g.free
    ? `<span class="pfree">ฟรี</span>`
    : `<span class="pnew">${money(g.sale, g.cur)}</span>`;
  const origHtml = g.disc > 0 && !g.free ? `<span class="porig">${money(g.orig, g.cur)}</span>` : '';

  return `<a class="gc" href="${link}" target="_blank" rel="noopener">
    <div class="gthumb">
      <img src="${img}" loading="lazy" alt="${esc(g.name)}"
        onerror="this.onerror=null;this.src='${fallback}';this.onerror=function(){this.style.display='none'}">
      ${badge}${dlcBadge}
      <button class="wbtn${inW ? ' on' : ''}" data-key="${esc(g.key)}" aria-label="Wishlist">${icon('heart')}</button>
    </div>
    <div class="gi">
      <div class="gname">${esc(g.name)}</div>
      <div class="gdev">${esc(g.dev) || '&nbsp;'}</div>
      <div class="gtags2">${tags}</div>
      <div class="grow">
        <div>${origHtml} ${priceHtml}</div>
        ${g.rating > 0 ? `<span class="grating">${icon('star')} ${g.rating}%</span>` : ''}
      </div>
    </div>
  </a>`;
}

const TAB_ICON = { sale: 'zap', free: 'gift', dlc: 'puzzle', wish: 'heart' };
function setSecTitle() {
  document.getElementById('secTitle').innerHTML = `${icon(TAB_ICON[S.tab] || 'zap')} ${t('title_' + S.tab)}`;
}

function switchTab(tab) {
  S.tab = tab;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  setSecTitle();
  const showSidebar = (tab === 'sale' || tab === 'dlc');
  const sidebar = document.getElementById('sidebar');
  const filterBtn = document.getElementById('filterBtn');
  if (window.innerWidth > 900) sidebar.style.display = showSidebar ? '' : 'none';
  document.querySelector('.layout').classList.toggle('full', !showSidebar);
  if (filterBtn) filterBtn.style.display = showSidebar ? '' : 'none';
  closeSidebarMobile();
  if (isLiveMode()) loadMoreLive(true);
  else render();
}

function buildSourceSwitch() {
  const wrap = document.getElementById('sourceSwitch');
  if (!wrap) return;
  wrap.innerHTML = SOURCES.map(s =>
    `<button class="src-tab" data-src="${esc(s.id)}">${esc(s.name)}</button>`
  ).join('');
  wrap.querySelectorAll('.src-tab').forEach(b => {
    b.addEventListener('click', () => setSource(b.dataset.src));
  });
}

function applySourceUI() {
  const allowed = adapter ? adapter.tabs : ['sale'];
  document.querySelectorAll('.tab').forEach(b => {
    const tb = b.dataset.tab;
    b.style.display = (tb === 'wish' || allowed.includes(tb)) ? '' : 'none';
  });
  const genreSection = document.getElementById('genreSection');
  if (genreSection) genreSection.style.display = (adapter && adapter.genre) ? '' : 'none';
  const curWrap = document.getElementById('currencyWrap');
  if (curWrap) curWrap.style.display = (curSource && curSource.type === 'cheapshark') ? 'none' : '';
  document.querySelectorAll('.src-tab').forEach(b => b.classList.toggle('on', b.dataset.src === (curSource && curSource.id)));
}

function setSource(id) {
  curSource = sourceById(id) || SOURCES[0];
  if (!curSource) return;
  adapter = getAdapter(curSource);
  if (!adapter.tabs.includes(S.tab) && S.tab !== 'wish') S.tab = 'sale';
  if (!adapter.genre) {
    S.genre = '';
    document.querySelectorAll('.gt').forEach(x => x.classList.toggle('on', x.dataset.g === ''));
  }
  applySourceUI();
  switchTab(S.tab);
}

function toggleSidebarMobile() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}
function closeSidebarMobile() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

function calcBudget() {
  const b = parseFloat(document.getElementById('budgetIn').value);
  S.budget = (b && b > 0) ? b : 0;
  const out = document.getElementById('budgetOut');
  if (S.budget > 0) {
    out.innerHTML = `<div class="bsum">${t('budget_showing', { b: money(S.budget) })}</div>`;
    out.classList.add('show');
  } else {
    out.classList.remove('show');
    out.innerHTML = '';
  }
  if (S.tab !== 'sale' && S.tab !== 'dlc') switchTab('sale');
  else render();
}

function toggleWish(key) {
  if (S.wishlist.has(key)) {
    S.wishlist.delete(key);
    S.wishMap.delete(key);
    showToast(t('wish_remove'));
  } else {
    S.wishlist.add(key);
    const g = LIVE_VIEW.find(x => x.key === key) || S.wishMap.get(key);
    if (g) S.wishMap.set(key, g);
    showToast(t('wish_add'));
  }
  saveWishlist();
  if (S.tab === 'wish') {
    render();
  } else {
    document.querySelectorAll(`.wbtn[data-key="${key}"]`).forEach(b => b.classList.toggle('on', S.wishlist.has(key)));
  }
}

document.getElementById('gameGrid').addEventListener('click', e => {
  const btn = e.target.closest('.wbtn');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  toggleWish(btn.dataset.key);
});

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2400);
}

function hardReload() {
  location.replace(location.pathname + '?r=' + Date.now());
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
const THEMES = ['mono', 'dark', 'steam', 'paper'];
let savedTh = localStorage.getItem('th');
if (savedTh === 'rose') savedTh = 'paper';
if (savedTh && !THEMES.includes(savedTh)) savedTh = null;
if (savedTh) {
  localStorage.setItem('th', savedTh);
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

document.getElementById('budgetIn').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); calcBudget(); }
});

function makeDropdown(container, options, current, onSelect) {
  container.classList.add('dd');
  const cur = options.find(o => o.value === current) || options[0];
  container.innerHTML = `
    <button class="dd-btn" type="button"><span class="dd-val">${esc(cur ? cur.label : '')}</span>${icon('chevron', 'dd-chev')}</button>
    <div class="dd-list">${options.map(o => `<div class="dd-opt${o.value === current ? ' on' : ''}" data-v="${esc(o.value)}">${esc(o.label)}</div>`).join('')}</div>`;
  const btn = container.querySelector('.dd-btn');
  const valEl = container.querySelector('.dd-val');
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const open = container.classList.contains('open');
    document.querySelectorAll('.dd.open').forEach(d => d.classList.remove('open'));
    container.classList.toggle('open', !open);
  });
  container.querySelectorAll('.dd-opt').forEach(o => o.addEventListener('click', () => {
    container.querySelectorAll('.dd-opt').forEach(x => x.classList.toggle('on', x === o));
    valEl.textContent = o.textContent;
    container.classList.remove('open');
    onSelect(o.dataset.v);
  }));
}
document.addEventListener('click', () => document.querySelectorAll('.dd.open').forEach(d => d.classList.remove('open')));

function buildSortDropdown() {
  const opts = ['disc', 'pasc', 'pdesc', 'name', 'rev'].map(v => ({ value: v, label: t('sort_' + v) }));
  makeDropdown(document.getElementById('sortDd'), opts, S.sort, v => {
    S.sort = v;
    if (isLiveMode()) loadMoreLive(true); else render();
  });
}

function buildCurrencyDropdown() {
  const opts = CURRENCIES.map(c => ({ value: c.code, label: c.label }));
  makeDropdown(document.getElementById('currencyWrap'), opts, S.currency, v => {
    S.currency = v;
    localStorage.setItem('currency', v);
    applySourceUI();
    if (isLiveMode()) loadMoreLive(true); else render();
  });
}

const LANGS = [
  { value: 'en', label: 'EN' },
  { value: 'th', label: 'ไทย' },
  { value: 'zh', label: '中文' },
  { value: 'ko', label: '한국어' },
  { value: 'ms', label: 'Melayu' },
];
function buildLangDropdown() {
  makeDropdown(document.getElementById('langDd'), LANGS, getLang(), v => setLang(v));
}

window.onLangChange = () => {
  setSecTitle();
  buildSortDropdown();
};

function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    el.innerHTML = icon(el.dataset.icon, el.dataset.iconClass || '');
    el.removeAttribute('data-icon');
  });
}

applyStaticLang();
hydrateIcons();
buildLangDropdown();
buildSortDropdown();
buildCurrencyDropdown();
buildSourceSwitch();
startAutoUpdate();
if (SOURCES.length) setSource(SOURCES[0].id);
