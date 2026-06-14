// News view — gaming headlines from RSS (via news worker). Self-contained module.
window.News = (function () {
  const API = (window.NEWS_API_BASE || '').replace(/\/$/, '');
  let items = [];
  let loaded = false;
  let built = false;
  let range = 'all';
  let query = '';

  function T(k) { return (typeof window.t === 'function') ? window.t(k) : k; }

  function esc2(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fmtDate(ms) {
    return new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function inRange(ms) {
    if (range === 'all') return true;
    const d = new Date(ms);
    const now = new Date();
    if (range === 'today') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    if (range === '10d') return ms >= Date.now() - 10 * 86400000;
    if (range === 'month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    return true;
  }

  function renderList() {
    const list = document.getElementById('newsList');
    if (!list) return;
    const q = query.trim().toLowerCase();
    const rows = items.filter(n => inRange(n.date) && (!q || n.title.toLowerCase().includes(q)));
    if (!rows.length) {
      list.innerHTML = `<div class="empty"><p>${T('empty')}</p></div>`;
      return;
    }
    list.innerHTML = rows.map(n => `
      <a class="news-item" href="${esc2(n.url)}" target="_blank" rel="noopener">
        <span class="news-src">${esc2(n.source)}</span>
        <span class="news-title">${esc2(n.title)}</span>
        <span class="news-date">${n.date ? fmtDate(n.date) : ''}</span>
      </a>`).join('');
  }

  function renderFilter() {
    const bar = document.getElementById('newsFilter');
    if (!bar) return;
    const opts = [['all', 'n_all'], ['today', 'n_today'], ['10d', 'n_10d'], ['month', 'n_month']];
    bar.innerHTML = opts.map(([v, k]) =>
      `<button class="nf-btn${v === range ? ' on' : ''}" data-r="${v}">${T(k)}</button>`).join('');
    bar.querySelectorAll('.nf-btn').forEach(b => b.addEventListener('click', () => {
      range = b.dataset.r;
      bar.querySelectorAll('.nf-btn').forEach(x => x.classList.toggle('on', x === b));
      renderList();
    }));
  }

  function build() {
    const el = document.getElementById('newsView');
    if (!el || built) return;
    el.innerHTML = `
      <div class="news-bar">
        <div class="news-filter" id="newsFilter"></div>
        <div class="news-search">
          <span class="si" data-icon="search"></span>
          <input type="text" id="newsSearch" autocomplete="off">
        </div>
      </div>
      <div class="news-list" id="newsList"><div class="lmi" style="display:block">${T('loading')}</div></div>`;
    if (typeof hydrateIcons === 'function') hydrateIcons(el);
    renderFilter();
    const inp = document.getElementById('newsSearch');
    inp.placeholder = T('news_search_ph');
    let timer;
    inp.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => { query = inp.value; renderList(); }, 250);
    });
    built = true;
  }

  async function load() {
    try {
      const data = await (await fetch(`${API}/api/news`, { signal: AbortSignal.timeout(15000) })).json();
      items = Array.isArray(data.items) ? data.items : [];
      loaded = true;
      renderList();
    } catch (e) {
      const list = document.getElementById('newsList');
      if (list) list.innerHTML = `<div class="empty"><p>${T('cant_connect')}</p></div>`;
    }
  }

  return {
    show() {
      const el = document.getElementById('newsView');
      if (el) el.style.display = '';
      build();
      if (!loaded) load();
    },
    hide() {
      const el = document.getElementById('newsView');
      if (el) el.style.display = 'none';
    },
    applyLang() {
      if (!built) return;
      renderFilter();
      const inp = document.getElementById('newsSearch');
      if (inp) inp.placeholder = T('news_search_ph');
      if (loaded) renderList();
    },
  };
})();
