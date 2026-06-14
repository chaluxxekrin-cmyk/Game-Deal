// News view — gaming headlines from RSS (via news worker). Self-contained module.
window.News = (function () {
  const API = (window.NEWS_API_BASE || '').replace(/\/$/, '');
  let items = [];
  let loaded = false;
  let range = 'all';

  function T(k) { return (typeof window.t === 'function') ? window.t(k) : k; }

  function esc2(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fmtDate(ms) {
    const d = new Date(ms);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function inRange(ms) {
    if (range === 'all') return true;
    const day = new Date(ms).getDate();
    if (range === 'early') return day <= 10;
    if (range === 'mid') return day >= 11 && day <= 20;
    if (range === 'late') return day >= 21;
    return true;
  }

  function renderList() {
    const list = document.getElementById('newsList');
    if (!list) return;
    const rows = items.filter(n => inRange(n.date));
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
    const opts = [['all', 'n_all'], ['early', 'n_early'], ['mid', 'n_mid'], ['late', 'n_late']];
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
    if (!el) return;
    el.innerHTML = `
      <div class="news-filter" id="newsFilter"></div>
      <div class="news-list" id="newsList"><div class="lmi" style="display:block">${T('loading')}</div></div>`;
  }

  async function load() {
    try {
      const data = await (await fetch(`${API}/api/news`, { signal: AbortSignal.timeout(15000) })).json();
      items = Array.isArray(data.items) ? data.items : [];
    } catch (e) {
      items = [];
      const list = document.getElementById('newsList');
      if (list) list.innerHTML = `<div class="empty"><p>${T('cant_connect')}</p></div>`;
      return;
    }
    loaded = true;
    renderFilter();
    renderList();
  }

  return {
    show() {
      const el = document.getElementById('newsView');
      if (el) el.style.display = '';
      build();
      renderFilter();
      if (!loaded) load(); else renderList();
    },
    hide() {
      const el = document.getElementById('newsView');
      if (el) el.style.display = 'none';
    },
    applyLang() {
      if (document.getElementById('newsView') && document.getElementById('newsView').style.display !== 'none') {
        renderFilter();
        renderList();
      }
    },
  };
})();
