const GENRE_TAGS = {
  Action: 19,
  Adventure: 21,
  RPG: 122,
  Strategy: 9,
  Simulation: 599,
  Horror: 1667,
  Indie: 492,
  Racing: 699,
  Sports: 701,
};
const SORT_MAP = {
  disc: '_ASC',
  pasc: 'Price_ASC',
  pdesc: 'Price_DESC',
  name: 'Name_ASC',
  rev: 'Reviews_DESC',
};
const CC_CUR = { us: '$', gb: '£', de: '€', jp: '¥', th: '฿', hk: '$', kr: '₩' };
function ccOf(cc) {
  return CC_CUR[cc] ? cc : 'us';
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,OPTIONS',
      'access-control-allow-headers': 'content-type',
      'cache-control': 'public, max-age=60',
    },
  });
}

function clean(value = '') {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function textBetween(html, regex) {
  const match = html.match(regex);
  return match ? clean(match[1]) : '';
}

function parsePrice(value) {
  const s = clean(value).replace(/[^\d.,]/g, '');
  if (!s) return 0;
  const dec = Math.max(s.lastIndexOf(','), s.lastIndexOf('.'));
  let n;
  if (dec === -1) n = parseFloat(s);
  else if (s.length - dec - 1 === 2) n = parseFloat(s.slice(0, dec).replace(/[.,]/g, '') + '.' + s.slice(dec + 1));
  else n = parseFloat(s.replace(/[.,]/g, ''));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

let TAG_MAP = null;
async function getTagMap(ctx) {
  if (TAG_MAP) return TAG_MAP;
  const cacheUrl = new URL('https://steamdeal.local/tagmap');
  const cache = caches.default;
  const hit = await cache.match(cacheUrl);
  if (hit) { TAG_MAP = await hit.json(); return TAG_MAP; }
  try {
    const res = await fetch('https://store.steampowered.com/tagdata/populartags/english', {
      headers: { accept: 'application/json', 'user-agent': 'Mozilla/5.0 SteamDeal Worker' },
    });
    const arr = await res.json();
    const map = {};
    for (const t of arr) map[t.tagid] = t.name;
    TAG_MAP = map;
    const stored = new Response(JSON.stringify(map), {
      headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=86400' },
    });
    ctx.waitUntil(cache.put(cacheUrl, stored));
    return map;
  } catch {
    return {};
  }
}

function parseRows(html, tagMap = {}, cur = '$') {
  const rows = html.match(/<a\b(?=[^>]*search_result_row)[\s\S]*?<\/a>/g) || [];

  return rows.map((row) => {
    const appid = Number(
      (row.match(/data-ds-appid="(\d+)"/) || row.match(/\/app\/(\d+)/) || [])[1]
    );
    if (!appid) return null;

    const name = textBetween(row, /<span[^>]*class="title"[^>]*>([\s\S]*?)<\/span>/);
    const discountMatch = row.match(/discount_pct[^>]*>\s*-?(\d+)%\s*<\/div>/)
      || row.match(/data-discount="(\d+)"/);
    const disc = discountMatch ? Number(discountMatch[1]) : 0;
    const originalBlock = textBetween(row, /discount_original_price[^>]*>([\s\S]*?)<\/div>/);
    const finalBlock = textBetween(row, /discount_final_price[^>]*>([\s\S]*?)<\/div>/);
    const priceBlock = finalBlock || textBetween(row, /<div[^>]*class="[^"]*search_price[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    const sale = /free/i.test(priceBlock) ? 0 : parsePrice(priceBlock);
    const orig = originalBlock ? parsePrice(originalBlock) : sale;
    const img = (row.match(/<img[^>]+src="([^"]+)"/) || [])[1] || '';
    const tagIds = ((row.match(/data-ds-tagids="\[([^\]]*)\]"/) || [])[1] || '')
      .split(',')
      .map(x => x.trim())
      .filter(Boolean);
    const tags = tagIds.map(id => tagMap[id]).filter(Boolean).slice(0, 6);
    const release = textBetween(row, /search_released[^>]*>([\s\S]*?)<\/div>/);
    const ratingText = textBetween(row, /search_review_summary[^>]*data-tooltip-html="([^"]+)"/);
    const rating = Number((ratingText.match(/(\d+)%/) || [])[1] || 0);

    if (!name) return null;

    return {
      appid,
      name,
      dev: release || '',
      orig,
      sale,
      disc,
      tags,
      coop: tags.includes('Co-op') || tags.includes('Online Co-Op'),
      multi: tags.includes('Multiplayer') || tags.includes('Multi-player'),
      rating,
      free: sale === 0,
      img,
      cur,
      _live: true,
    };
  }).filter(Boolean);
}

async function fetchSteamDeals(params, ctx) {
  const { start, count, mode, genre, search, discount, sort, cc } = params;
  const cacheUrl = new URL(`https://steamdeal.local/api/steam-deals?${new URLSearchParams(params)}`);
  const cache = caches.default;
  const hit = await cache.match(cacheUrl);
  if (hit) return hit;

  const api = new URL('https://store.steampowered.com/search/results/');
  if (search) api.searchParams.set('term', search);
  api.searchParams.set('start', String(start));
  api.searchParams.set('count', String(count));
  api.searchParams.set('dynamic_data', '');
  api.searchParams.set('sort_by', SORT_MAP[sort] || '_ASC');
  if (mode === 'free') {
    api.searchParams.set('specials', '1');
    api.searchParams.set('maxprice', 'free');
    api.searchParams.set('category1', '998');
  } else if (mode === 'dlc') {
    if (!search) api.searchParams.set('specials', '1');
    api.searchParams.set('category1', '21');
  } else {
    if (!search) api.searchParams.set('specials', '1');
    api.searchParams.set('category1', '998');
  }
  if (GENRE_TAGS[genre]) api.searchParams.set('tags', String(GENRE_TAGS[genre]));
  api.searchParams.set('cc', cc);
  api.searchParams.set('l', 'english');
  api.searchParams.set('infinite', '1');

  const response = await fetch(api, {
    headers: {
      accept: 'application/json,text/plain,*/*',
      'user-agent': 'Mozilla/5.0 SteamDeal Worker',
    },
  });

  if (!response.ok) {
    return json({ error: `Steam returned ${response.status}` }, response.status);
  }

  const data = await response.json();
  const tagMap = await getTagMap(ctx);
  const rawCount = (data.results_html || '').match(/<a\b(?=[^>]*search_result_row)[\s\S]*?<\/a>/g)?.length || 0;
  const games = parseRows(data.results_html || '', tagMap, CC_CUR[cc] || '$')
    .filter(game => {
      if (mode === 'free') return game.free;
      if (game.free) return false;
      if (search) return !discount || game.disc >= discount;
      return game.disc > 0 && (!discount || game.disc >= discount);
    })
    .map(game => mode === 'dlc' ? { ...game, type: 'dlc' } : game);
  const out = json({
    start,
    count,
    mode,
    genre,
    search,
    discount,
    sort,
    total: Number(data.total_count || 0),
    rawCount,
    games,
    fetchedAt: Date.now(),
  });

  ctx.waitUntil(cache.put(cacheUrl, out.clone()));
  return out;
}

async function fetchAppDetails(appid, cc, ctx) {
  const cacheUrl = new URL(`https://steamdeal.local/api/app?appid=${appid}&cc=${cc}`);
  const cache = caches.default;
  const hit = await cache.match(cacheUrl);
  if (hit) return hit;
  const api = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=${cc}&l=english`;
  const res = await fetch(api, { headers: { 'user-agent': 'Mozilla/5.0 SteamDeal Worker' } });
  if (!res.ok) return json(null);
  const data = await res.json();
  const entry = data[appid];
  let body = null;
  if (entry && entry.success && entry.data) {
    const d = entry.data;
    body = {
      appid: Number(appid),
      name: d.name || '',
      desc: d.short_description || '',
      image: d.header_image || '',
      screenshots: (d.screenshots || []).slice(0, 4).map(s => s.path_full || s.path_thumbnail).filter(Boolean),
      genres: (d.genres || []).map(g => g.description),
      release: (d.release_date && d.release_date.date) || '',
      developers: d.developers || [],
    };
  }
  const out = json(body);
  ctx.waitUntil(cache.put(cacheUrl, out.clone()));
  return out;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return json({});
    if (url.pathname === '/api/app') {
      return fetchAppDetails(String(Number(url.searchParams.get('appid') || 0)), ccOf(url.searchParams.get('cc') || 'us'), ctx);
    }
    if (url.pathname !== '/api/steam-deals') {
      return json({ ok: true, endpoint: '/api/steam-deals?start=0&count=60' });
    }

    const start = Math.max(0, Number(url.searchParams.get('start') || 0));
    const count = Math.min(100, Math.max(1, Number(url.searchParams.get('count') || 60)));
    return fetchSteamDeals({
      start,
      count,
      mode: url.searchParams.get('mode') || 'sale',
      genre: url.searchParams.get('genre') || '',
      search: url.searchParams.get('search') || '',
      discount: Math.max(0, Number(url.searchParams.get('discount') || 0)),
      sort: url.searchParams.get('sort') || 'disc',
      cc: ccOf(url.searchParams.get('cc') || 'us'),
    }, ctx);
  },
};