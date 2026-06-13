(window.GD_ADAPTERS = window.GD_ADAPTERS || {}).cheapshark = function (source) {
  const PAGE = 60;
  const SORT = {
    disc: ['Savings', '0'],
    pasc: ['Price', '0'],
    pdesc: ['Price', '1'],
    name: ['Title', '0'],
    rev: ['Metacritic', '0'],
  };
  let page = 0;
  let exhausted = false;
  let params = {};

  function normalize(d) {
    const sale = parseFloat(d.salePrice);
    const orig = parseFloat(d.normalPrice);
    const appid = d.steamAppID ? Number(d.steamAppID) : null;
    return {
      key: 'cs' + source.storeID + ':' + d.dealID,
      dealID: d.dealID,
      appid,
      name: d.title || '',
      dev: '',
      orig: Number.isFinite(orig) ? orig : 0,
      sale: Number.isFinite(sale) ? sale : 0,
      cur: '$',
      disc: Math.round(parseFloat(d.savings) || 0),
      free: sale === 0,
      tags: [],
      rating: d.steamRatingPercent ? parseInt(d.steamRatingPercent) : 0,
      img: d.thumb || (appid ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg` : ''),
      _source: source.id,
    };
  }

  return {
    tabs: source.tabs || ['sale', 'free'],
    genre: source.genre === true,
    currency: '$',

    reset(p) {
      params = p || {};
      page = 0;
      exhausted = false;
    },

    async next() {
      if (exhausted) return { games: [], total: 0, exhausted: true };
      const u = new URL('https://www.cheapshark.com/api/1.0/deals');
      u.searchParams.set('storeID', String(source.storeID));
      u.searchParams.set('pageSize', String(PAGE));
      u.searchParams.set('pageNumber', String(page));
      const free = params.mode === 'free';
      const [by, desc] = free ? ['Savings', '0'] : (SORT[params.sort] || ['Savings', '0']);
      u.searchParams.set('sortBy', by);
      u.searchParams.set('desc', desc);
      if (params.search) u.searchParams.set('title', params.search);

      const res = await fetch(u, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error('cheapshark ' + res.status);
      const arr = await res.json();
      if (!Array.isArray(arr)) throw new Error('cheapshark bad payload');
      page += 1;
      if (arr.length < PAGE) exhausted = true;

      const discount = params.discount || 0;
      const games = arr.map(normalize).filter(g => {
        if (free) return g.free;
        if (g.free) return false;
        return g.disc > 0 && (!discount || g.disc >= discount);
      });
      if (games.length === 0) {
        if (free) exhausted = true;
        else if (!arr.some(d => parseFloat(d.salePrice) === 0)) exhausted = true;
      }
      return { games, total: 0, exhausted };
    },

    cardLink: g => `https://www.cheapshark.com/redirect?dealID=${g.dealID}`,
    cardImage: g => g.img,
  };
};
