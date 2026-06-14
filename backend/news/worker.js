const FEEDS = [
  { source: 'PC Gamer', url: 'https://www.pcgamer.com/rss/' },
  { source: 'Rock Paper Shotgun', url: 'https://www.rockpapershotgun.com/feed' },
  { source: 'Eurogamer', url: 'https://www.eurogamer.net/feed' },
];

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,OPTIONS',
      'cache-control': 'public, max-age=900',
    },
  });
}

function decode(s = '') {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&hellip;|&#8230;/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pick(block, re) {
  const m = block.match(re);
  return m ? m[1] : '';
}

function parseFeed(xml, source) {
  const items = xml.match(/<item[\s\S]*?<\/item>/g) || xml.match(/<entry[\s\S]*?<\/entry>/g) || [];
  return items.map((it) => {
    const title = decode(pick(it, /<title[^>]*>([\s\S]*?)<\/title>/));
    const link = (pick(it, /<link[^>]*>([\s\S]*?)<\/link>/) || pick(it, /<link[^>]*href="([^"]+)"/)).trim();
    const pub = pick(it, /<pubDate>([\s\S]*?)<\/pubDate>/) || pick(it, /<dc:date>([\s\S]*?)<\/dc:date>/) || pick(it, /<published>([\s\S]*?)<\/published>/) || pick(it, /<updated>([\s\S]*?)<\/updated>/);
    const date = pub ? Date.parse(pub.trim()) : 0;
    return { title, url: link, source, date: Number.isFinite(date) ? date : 0 };
  }).filter((x) => x.title && x.url);
}

async function fetchNews() {
  const results = await Promise.allSettled(FEEDS.map(async (f) => {
    const res = await fetch(f.url, { headers: { 'User-Agent': 'Mozilla/5.0 GameDeal News', accept: 'application/rss+xml,application/xml,text/xml,*/*' } });
    if (!res.ok) throw new Error(f.source + ' ' + res.status);
    return parseFeed(await res.text(), f.source);
  }));
  const items = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  items.sort((a, b) => b.date - a.date);
  return { items: items.slice(0, 120), fetchedAt: Date.now() };
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return json({});
    const url = new URL(request.url);
    if (url.pathname !== '/api/news') {
      return json({ ok: true, endpoint: '/api/news' });
    }
    const cache = caches.default;
    const cacheUrl = new URL('https://gamedeal.local/api/news');
    const hit = await cache.match(cacheUrl);
    if (hit) return hit;
    const out = json(await fetchNews());
    ctx.waitUntil(cache.put(cacheUrl, out.clone()));
    return out;
  },
};
