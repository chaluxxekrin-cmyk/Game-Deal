// Game preview modal + price history (All-Time Low via CheapShark). Self-contained.
window.GameModal = (function () {
  const API = (window.STEAMDEAL_API_BASE || '').replace(/\/$/, '');
  let escHandler = null;
  let openId = 0;
  const histCache = new Map(); // appid -> Promise<{normal, now, low, lowDate} | null> (USD)

  function T(k) { return (typeof t === 'function') ? t(k) : k; }
  function fmt(n, cur) { return (typeof money === 'function') ? money(n, cur) : cur + (Number(n) || 0).toFixed(2); }
  function curCode(cur) {
    const norm = s => String(s).replace(/\s/g, '');
    const c = (typeof CURRENCIES !== 'undefined') ? CURRENCIES.find(x => norm(x.sym) === norm(cur)) : null;
    return c ? c.code.toUpperCase() : 'USD';
  }
  function ic(name) { return (typeof icon === 'function') ? icon(name) : ''; }
  function esc2(s) { return (typeof esc === 'function') ? esc(s) : String(s); }
  function priceText(g) {
    if (g.free) return T('tab_free');
    return (typeof money === 'function') ? money(g.sale, g.cur) : (g.cur || '') + g.sale;
  }

  function close() {
    const o = document.getElementById('gameModal');
    if (!o) return;
    o.classList.remove('open');
    document.body.style.overflow = '';
    if (escHandler) { document.removeEventListener('keydown', escHandler); escHandler = null; }
  }

  function open(g) {
    const o = document.getElementById('gameModal');
    if (!o || !g) return;
    const id = ++openId;
    const link = (typeof cardLink === 'function') ? cardLink(g) : '#';
    const img = (typeof cardImage === 'function') ? cardImage(g) : (g.img || '');
    const tags = (g.tags || []).slice(0, 5).map(x => `<span class="gtag2">${esc2(x)}</span>`).join('');
    const orig = g.disc > 0 && !g.free
      ? ` <span class="porig">${(typeof money === 'function') ? money(g.orig, g.cur) : g.orig}</span> <span class="m-disc">-${g.disc}%</span>` : '';

    o.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true">
        <button class="modal-x" aria-label="close">${ic('x')}</button>
        <div class="modal-hero"><img id="mHero" src="${img}" alt="${esc2(g.name)}" onerror="this.style.display='none'"></div>
        <div class="modal-body">
          <h2 class="modal-title">${esc2(g.name)}</h2>
          <div class="modal-dev">${esc2(g.dev || '')}</div>
          <div class="gtags2 modal-tags">${tags}</div>
          <div class="modal-price"><span class="pnew">${priceText(g)}</span>${orig}</div>
          <p class="modal-desc" id="mDesc"></p>
          <div class="modal-meta" id="mMeta"></div>
          <div class="modal-hist" id="mHist"></div>
          <a class="modal-go" href="${link}" target="_blank" rel="noopener">${T('view_store')}</a>
        </div>
      </div>`;
    o.classList.add('open');
    document.body.style.overflow = 'hidden';
    o.querySelector('.modal-x').onclick = close;
    o.onclick = (e) => { if (e.target === o) close(); };
    escHandler = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', escHandler);

    if (g.appid) {
      loadDetails(g.appid, id);
      loadHistory(g, id);
    }
  }

  function loadDetails(appid, id) {
    fetch(`${API}/api/app?appid=${appid}`).then(r => r.json()).then(d => {
      if (!d || id !== openId) return;
      const desc = document.getElementById('mDesc');
      if (desc && d.desc) desc.textContent = d.desc;
      const meta = document.getElementById('mMeta');
      if (meta) {
        const bits = [];
        if (d.genres && d.genres.length) bits.push(d.genres.slice(0, 4).join(' · '));
        if (d.developers && d.developers.length) bits.push(d.developers[0]);
        if (d.release) bits.push(d.release);
        meta.textContent = bits.join('  •  ');
      }
      const hero = document.getElementById('mHero');
      if (hero && d.screenshots && d.screenshots[0]) { hero.src = d.screenshots[0]; hero.style.display = ''; }
    }).catch(() => {});
  }

  function fetchHistory(appid) {
    if (!histCache.has(appid)) {
      const p = (async () => {
        const arr = await (await fetch(`https://www.cheapshark.com/api/1.0/games?steamAppID=${appid}`)).json();
        if (!Array.isArray(arr) || !arr.length) return null;
        const info = await (await fetch(`https://www.cheapshark.com/api/1.0/games?id=${arr[0].gameID}`)).json();
        const deal = (info.deals || []).slice().sort((a, b) => parseFloat(a.price) - parseFloat(b.price))[0];
        if (!deal) return null;
        const now = parseFloat(deal.price) || 0;
        return {
          normal: parseFloat(deal.retailPrice) || 0,
          now,
          low: info.cheapestPriceEver ? parseFloat(info.cheapestPriceEver.price) : now,
          lowDate: info.cheapestPriceEver ? new Date(info.cheapestPriceEver.date * 1000) : null,
        };
      })().catch(() => { histCache.delete(appid); return null; });
      histCache.set(appid, p);
    }
    return histCache.get(appid);
  }

  // CheapShark history is USD-only. Normal/Now use the game's own prices (already in the
  // selected currency); the all-time low is scaled by the same local/USD ratio, so regional
  // pricing (e.g. THB) stays realistic instead of a plain FX conversion.
  async function loadHistory(g, id) {
    if (!document.getElementById('mHist')) return;
    const h = await fetchHistory(g.appid);
    const host = document.getElementById('mHist');
    if (!h || !host || id !== openId) return;
    const localNormal = !g.free ? (g.orig || g.sale || 0) : 0;
    const local = localNormal > 0 && h.normal > 0;
    const cur = local ? (g.cur || '$') : '$';
    const normal = local ? localNormal : h.normal;
    const now = local ? g.sale : h.now;
    const low = local ? Math.min(now, h.low * (localNormal / h.normal)) : h.low;
    const approx = local && curCode(cur) !== 'USD' ? '≈ ' : '';
    const max = Math.max(normal, now, low) || 1;
    const bar = (label, val, cls, pre = '') =>
      `<div class="hbar"><span class="hbl">${label}</span><span class="htrack"><span class="hfill ${cls}" style="width:${Math.max(4, val / max * 100)}%"></span></span><span class="hbv">${pre}${fmt(val, cur)}</span></div>`;
    host.innerHTML = `<div class="hist-h">${T('price_hist')} <span class="hist-cur">(${curCode(cur)} · CheapShark)</span></div>
      ${bar(T('p_normal'), normal, 'normal')}
      ${bar(T('p_now'), now, 'now')}
      ${bar(T('p_low'), low, 'low', approx)}
      <div class="hist-low">${T('all_time_low')}: <b>${approx}${fmt(low, cur)}</b>${h.lowDate ? ' · ' + h.lowDate.toISOString().slice(0, 10) : ''}</div>`;
  }

  return { open, close };
})();
