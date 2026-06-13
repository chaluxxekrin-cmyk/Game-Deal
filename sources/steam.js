(window.GD_ADAPTERS = window.GD_ADAPTERS || {}).steam = function (source) {
  const API = (source.api || window.STEAMDEAL_API_BASE || '').replace(/\/$/, '');
  const PAGE = 50;
  let start = 0;
  let total = 0;
  let exhausted = false;
  let params = {};

  return {
    tabs: source.tabs || ['sale', 'free', 'dlc'],
    genre: source.genre !== false,

    reset(p) {
      params = p || {};
      start = 0;
      total = 0;
      exhausted = false;
    },

    async next() {
      if (exhausted) return { games: [], total, exhausted: true };
      const qs = new URLSearchParams({
        start: String(start),
        count: String(PAGE),
        mode: params.mode || 'sale',
        genre: params.genre || '',
        search: params.search || '',
        discount: String(params.discount || 0),
        sort: params.sort || 'disc',
        cc: params.cc || 'us',
      });
      const res = await fetch(`${API}/api/steam-deals?${qs}`, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error('steam ' + res.status);
      const data = await res.json();
      if (!Array.isArray(data.games)) throw new Error('steam bad payload');
      const raw = data.rawCount || data.games.length || 0;
      total = data.total || total || raw;
      start += raw || PAGE;
      if (!raw || start >= total) exhausted = true;
      const games = data.games.map(g => ({ ...g, key: 'steam:' + g.appid, cur: g.cur || '$', _source: source.id }));
      return { games, total, exhausted };
    },

    cardLink: g => `https://store.steampowered.com/app/${g.appid}`,
    cardImage: g => g.img || `https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
  };
};
