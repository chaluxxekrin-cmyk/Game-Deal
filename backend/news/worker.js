const FEEDS = [
  { source: 'PC Gamer', url: 'https://www.pcgamer.com/rss/' },
  { source: 'Rock Paper Shotgun', url: 'https://www.rockpapershotgun.com/feed' },
  { source: 'Eurogamer', url: 'https://www.eurogamer.net/feed' },
];
const RETURN_LIMIT = 2000; // newest N rows returned to the page (DB keeps everything)
const BACKFILL_PER_RUN = 15; // old rows without an image get their og:image looked up, a few per cron run
const EDGE_CACHE_S = 300;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,OPTIONS',
      'cache-control': 'public, max-age=300',
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

function unescAttr(s = '') {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

// Feed image: media:content / media:thumbnail / image enclosure, else first <img> in the body.
function pickImage(it) {
  const tag = it.match(/<media:(?:content|thumbnail)\b[^>]*\burl="([^"]+)"[^>]*>/)
    || it.match(/<enclosure\b(?=[^>]*type="image)[^>]*\burl="([^"]+)"[^>]*>/)
    || it.match(/<img\b[^>]*\bsrc="([^"]+)"/);
  const url = tag ? unescAttr(tag[1]) : '';
  return /^https?:\/\//.test(url) ? url : '';
}

function parseFeed(xml, source) {
  const items = xml.match(/<item[\s\S]*?<\/item>/g) || xml.match(/<entry[\s\S]*?<\/entry>/g) || [];
  return items.map((it) => {
    const title = decode(pick(it, /<title[^>]*>([\s\S]*?)<\/title>/));
    const link = (pick(it, /<link[^>]*>([\s\S]*?)<\/link>/) || pick(it, /<link[^>]*href="([^"]+)"/)).trim();
    const pub = pick(it, /<pubDate>([\s\S]*?)<\/pubDate>/) || pick(it, /<dc:date>([\s\S]*?)<\/dc:date>/) || pick(it, /<published>([\s\S]*?)<\/published>/) || pick(it, /<updated>([\s\S]*?)<\/updated>/);
    const date = pub ? Date.parse(pub.trim()) : 0;
    return { title, url: link, source, date: Number.isFinite(date) ? date : 0, image: pickImage(it) };
  }).filter((x) => x.title && x.url);
}

async function fetchFeeds() {
  const results = await Promise.allSettled(FEEDS.map(async (f) => {
    const res = await fetch(f.url, { headers: { 'User-Agent': 'Mozilla/5.0 GameDeal News', accept: 'application/rss+xml,application/xml,text/xml,*/*' } });
    if (!res.ok) throw new Error(f.source + ' ' + res.status);
    return parseFeed(await res.text(), f.source);
  }));
  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}

let tableReady = false;
async function ensureTable(env) {
  if (tableReady) return;
  await env.NEWS_DB.batch([
    env.NEWS_DB.prepare('CREATE TABLE IF NOT EXISTS news (url TEXT PRIMARY KEY, title TEXT, source TEXT, date INTEGER, image TEXT)'),
    env.NEWS_DB.prepare('CREATE INDEX IF NOT EXISTS idx_news_date ON news(date)'),
  ]);
  try {
    await env.NEWS_DB.prepare('ALTER TABLE news ADD COLUMN image TEXT').run(); // older tables lack the column
  } catch { /* already there */ }
  tableReady = true;
}

// Insert new items. Existing rows are never deleted; only a missing image gets filled in.
async function refresh(env) {
  await ensureTable(env);
  const fresh = await fetchFeeds();
  if (!fresh.length) return 0;
  const stmt = env.NEWS_DB.prepare(
    `INSERT INTO news (url, title, source, date, image) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(url) DO UPDATE SET image = excluded.image
     WHERE (news.image IS NULL OR news.image = '') AND excluded.image <> ''`);
  await env.NEWS_DB.batch(fresh.map((n) => stmt.bind(n.url, n.title, n.source, n.date, n.image || '')));
  return fresh.length;
}

// Read only the first `limit` bytes — og:image is in <head>, article pages can be 2MB.
async function readHead(res, limit) {
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let out = '';
  while (out.length < limit) {
    const { done, value } = await reader.read();
    if (done) break;
    out += dec.decode(value, { stream: true });
  }
  reader.cancel().catch(() => {});
  return out;
}

// Rows saved before images were tracked: read og:image from the article page.
// '-' marks a page with no image so it isn't retried every run.
async function backfillImages(env) {
  await ensureTable(env);
  const { results } = await env.NEWS_DB
    .prepare("SELECT url FROM news WHERE image IS NULL OR image = '' ORDER BY date DESC LIMIT ?")
    .bind(BACKFILL_PER_RUN)
    .all();
  if (!results || !results.length) return;
  const found = await Promise.all(results.map(async ({ url }) => {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 GameDeal News' } });
      if (!res.ok) return [url, '-'];
      const head = await readHead(res, 60000);
      const m = head.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)
        || head.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/);
      const img = m ? unescAttr(m[1]) : '';
      return [url, /^https?:\/\//.test(img) ? img : '-'];
    } catch {
      return [url, ''];
    }
  }));
  const stmt = env.NEWS_DB.prepare('UPDATE news SET image = ? WHERE url = ?');
  const writes = found.filter(([, img]) => img).map(([url, img]) => stmt.bind(img, url));
  if (writes.length) await env.NEWS_DB.batch(writes);
}

async function readNews(env) {
  await ensureTable(env);
  const { results } = await env.NEWS_DB
    .prepare('SELECT url, title, source, date, image FROM news ORDER BY date DESC LIMIT ?')
    .bind(RETURN_LIMIT)
    .all();
  return (results || []).map((r) => (r.image === '-' ? { ...r, image: '' } : r));
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return json({});
    const url = new URL(request.url);
    if (url.pathname !== '/api/news') return json({ ok: true, endpoint: '/api/news' });
    if (!env.NEWS_DB) {
      // DB not bound yet — fall back to a live (non-accumulating) fetch so it still works
      const items = (await fetchFeeds()).sort((a, b) => b.date - a.date).slice(0, RETURN_LIMIT);
      return json({ items, fetchedAt: Date.now(), db: false });
    }
    // Serve from the edge cache so repeat visits skip D1 entirely
    const cache = caches.default;
    const cacheKey = new Request(url.origin + '/api/news');
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
    let items = await readNews(env);
    if (!items.length) { await refresh(env); items = await readNews(env); } // first-ever run before cron
    const res = json({ items, fetchedAt: Date.now() });
    res.headers.set('cache-control', `public, max-age=${EDGE_CACHE_S}`);
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  },

  async scheduled(event, env, ctx) {
    if (!env.NEWS_DB) return;
    ctx.waitUntil(refresh(env).then(() => backfillImages(env)));
  },
};