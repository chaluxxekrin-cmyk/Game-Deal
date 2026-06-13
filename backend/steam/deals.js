const CACHE_MS = 60 * 1000;
const cache = new Map();
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
const TAG_GENRES = Object.fromEntries(Object.entries(GENRE_TAGS).map(([name, id]) => [String(id), name]));
const SORT_MAP = {
  disc: '_ASC',
  pasc: 'Price_ASC',
  pdesc: 'Price_DESC',
  name: 'Name_ASC',
  rev: 'Reviews_DESC',
};

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

function priceToBaht(value) {
  const cleaned = clean(value).replace(/[^\d.,]/g, '').replace(/,/g, '');
  const number = parseFloat(cleaned);
  return Number.isFinite(number) ? Math.round(number) : 0;
}

let TAG_MAP = null;
let TAG_MAP_TS = 0;
async function getTagMap() {
  if (TAG_MAP && Date.now() - TAG_MAP_TS < 86400000) return TAG_MAP;
  try {
    const res = await fetch('https://store.steampowered.com/tagdata/populartags/english', {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 GameDeal local' },
    });
    const arr = await res.json();
    const map = {};
    for (const t of arr) map[t.tagid] = t.name;
    TAG_MAP = map;
    TAG_MAP_TS = Date.now();
    return map;
  } catch {
    return TAG_MAP || {};
  }
}

function parseRows(html, tagMap = {}) {
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
    const saleText = priceBlock.split(' ').filter(Boolean).pop() || priceBlock;
    const sale = /free/i.test(priceBlock) ? 0 : priceToBaht(saleText);
    const orig = originalBlock ? priceToBaht(originalBlock) : sale;
    const img = (row.match(/<img[^>]+src="([^"]+)"/) || [])[1] || '';
    const tagIds = ((row.match(/data-ds-tagids="\[([^\]]*)\]"/) || [])[1] || '')
      .split(',')
      .map(x => x.trim())
      .filter(Boolean);
    const genres = [...new Set(tagIds.map(id => TAG_GENRES[id]).filter(Boolean))];
    const tags = tagIds.map(id => tagMap[id]).filter(Boolean).slice(0, 6);
    const release = textBetween(row, /search_released[^>]*>([\s\S]*?)<\/div>/);
    const ratingText = textBetween(row, /search_review_summary[^>]*data-tooltip-html="([^"]+)"/);
    const rating = Number((ratingText.match(/(\d+)%/) || [])[1] || 0);

    if (!name) return null;

    return {
      appid,
      name,
      dev: release ? `ออกเมื่อ ${release}` : '',
      orig,
      sale,
      disc,
      genres,
      tags,
      coop: tags.includes('Co-op') || tags.includes('Online Co-Op'),
      multi: tags.includes('Multiplayer') || tags.includes('Multi-player'),
      rating,
      free: sale === 0,
      img,
      _live: true,
    };
  }).filter(Boolean);
}

async function fetchSteamDeals(params) {
  const { start, count, mode, genre, search, discount, sort } = params;
  const key = JSON.stringify(params);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_MS) return hit.data;

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
  api.searchParams.set('cc', 'th');
  api.searchParams.set('l', 'english');
  api.searchParams.set('infinite', '1');

  const response = await fetch(api, {
    headers: {
      'Accept': 'application/json,text/plain,*/*',
      'User-Agent': 'Mozilla/5.0 GameDeal local live loader',
    },
  });

  if (!response.ok) {
    throw new Error(`Steam returned ${response.status}`);
  }

  const data = await response.json();
  const tagMap = await getTagMap();
  const rawCount = (data.results_html || '').match(/<a\b(?=[^>]*search_result_row)[\s\S]*?<\/a>/g)?.length || 0;
  const games = parseRows(data.results_html || '', tagMap)
    .filter(game => {
      if (mode === 'free') return game.free;
      if (game.free) return false;
      if (search) return !discount || game.disc >= discount;
      return game.disc > 0 && (!discount || game.disc >= discount);
    })
    .map(game => mode === 'dlc' ? { ...game, type: 'dlc' } : game);
  const payload = {
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
  };

  cache.set(key, { ts: Date.now(), data: payload });
  return payload;
}

module.exports = { fetchSteamDeals };
