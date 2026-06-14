// News view — placeholder for now. Self-contained module (no dependency on main.js).
// Future: fetch and render game news/articles here.
window.News = (function () {
  const ICON = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M22 6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z"/><path d="M10 6h8v4h-8z"/></svg>';
  let built = false;

  function msg() {
    return (typeof window.t === 'function') ? window.t('news_soon') : 'News coming soon';
  }

  function build() {
    const el = document.getElementById('newsView');
    if (!el) return;
    el.innerHTML = `<div class="empty"><div class="big">${ICON}</div><p class="news-msg">${msg()}</p></div>`;
    built = true;
  }

  return {
    show() {
      if (!built) build();
      this.applyLang();
      const el = document.getElementById('newsView');
      if (el) el.style.display = '';
    },
    hide() {
      const el = document.getElementById('newsView');
      if (el) el.style.display = 'none';
    },
    applyLang() {
      const m = document.querySelector('#newsView .news-msg');
      if (m) m.textContent = msg();
    },
  };
})();
