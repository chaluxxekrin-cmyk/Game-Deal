const CACHE_MS = 60 * 1000;

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

function priceToBaht(value) {
  const cleaned = clean(value).replace(/[^\d.,]/g, '').replace(/,/g, '');
  const number = parseFloat(cleaned);
  return Number.isFinite(number) ? Math.round(number) : 0;
}

function parseRows(html) {
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
    const release = textBetween(row, /search_released[^>]*>([\s\S]*?)<\/div>/);
    const ratingText = textBetween(row, /search_review_summary[^>]*data-tooltip-html="([^"]+)"/);
    const rating = Number((ratingText.match(/(\d+)%/) || [])[1] || 0);

    if (!name || (!disc && sale > 0)) return null;

    return {
      appid,
      name,
      dev: release ? `ออกเมื่อ ${release}` : '',
      orig,
      sale,
      disc,
      genres: [],
      tags: [],
      coop: false,
      multi: false,
      rating,
      free: sale === 0,
      img,
      _live: true,
    };
  }).filter(Boolean);
}

async function fetchSteamDeals(start, count, env, ctx) {
  const cacheUrl = new URL(`https://steamdeal.local/api/steam-deals?start=${start}&count=${count}`);
  const cache = caches.default;
  const hit = await cache.match(cacheUrl);
  if (hit) return hit;

  const api = new URL('https://store.steampowered.com/search/results/');
  api.searchParams.set('query', '');
  api.searchParams.set('start', String(start));
  api.searchParams.set('count', String(count));
  api.searchParams.set('dynamic_data', '');
  api.searchParams.set('sort_by', '_ASC');
  api.searchParams.set('specials', '1');
  api.searchParams.set('cc', 'th');
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
  const out = json({
    start,
    count,
    total: Number(data.total_count || 0),
    games: parseRows(data.results_html || ''),
    fetchedAt: Date.now(),
  });

  ctx.waitUntil(cache.put(cacheUrl, out.clone()));
  return out;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return json({});
    if (url.pathname !== '/api/steam-deals') {
      return json({ ok: true, endpoint: '/api/steam-deals?start=0&count=60' });
    }

    const start = Math.max(0, Number(url.searchParams.get('start') || 0));
    const count = Math.min(100, Math.max(1, Number(url.searchParams.get('count') || 60)));
    return fetchSteamDeals(start, count, env, ctx);
  },
};
