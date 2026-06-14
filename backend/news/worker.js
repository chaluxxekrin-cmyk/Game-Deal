// News worker — permanently accumulates gaming headlines in Cloudflare D1 (SQL).
// Old items are NEVER deleted; new ones are added on a schedule (deduped by URL).
// /api/news reads the newest rows from D1 (does not hit the source feeds).
//
// Setup required (see backend/news/SETUP.md):
//   1) Create a D1 database, bind it to this worker as variable name: NEWS_DB
//   2) Create the table (schema below)
//   3) Add a Cron Trigger (e.g. */15 * * * *) so scheduled() runs periodically
//
// Schema:
//   CREATE TABLE IF NOT EXISTS news (
//     url TEXT PRIMARY KEY, title TEXT, source TEXT, date INTEGER
//   );
//   CREATE INDEX IF NOT EXISTS idx_news_date ON news(date);

const FEEDS = [
  { source: 'PC Gamer', url: 'https://www.pcgamer.com/rss/' },
  { source: 'Rock Paper Shotgun', url: 'https://www.rockpapershotgun.com/feed' },
  { source: 'Eurogamer', url: 'https://www.eurogamer.net/feed' },
];
const RETURN_LIMIT = 2000; // newest N rows returned to the page (DB keeps everything)

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

async function fetchFeeds() {
  const results = await Promise.allSettled(FEEDS.map(async (f) => {
    const res = await fetch(f.url, { headers: { 'User-Agent': 'Mozilla/5.0 GameDeal News', accept: 'application/rss+xml,application/xml,text/xml,*/*' } });
    if (!res.ok) throw new Error(f.source + ' ' + res.status);
    return parseFeed(await res.text(), f.source);
  }));
  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}

async function ensureTable(env) {
  await env.NEWS_DB.prepare('CREATE TABLE IF NOT EXISTS news (url TEXT PRIMARY KEY, title TEXT, source TEXT, date INTEGER)').run();
  await env.NEWS_DB.prepare('CREATE INDEX IF NOT EXISTS idx_news_date ON news(date)').run();
}

// Insert new items; INSERT OR IGNORE keeps existing rows untouched (never deletes/overwrites).
async function refresh(env) {
  await ensureTable(env);
  const fresh = await fetchFeeds();
  if (!fresh.length) return 0;
  const stmt = env.NEWS_DB.prepare('INSERT OR IGNORE INTO news (url, title, source, date) VALUES (?, ?, ?, ?)');
  await env.NEWS_DB.batch(fresh.map((n) => stmt.bind(n.url, n.title, n.source, n.date)));
  return fresh.length;
}

async function readNews(env) {
  await ensureTable(env);
  const { results } = await env.NEWS_DB
    .prepare('SELECT url, title, source, date FROM news ORDER BY date DESC LIMIT ?')
    .bind(RETURN_LIMIT)
    .all();
  return results || [];
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
    let items = await readNews(env);
    if (!items.length) { await refresh(env); items = await readNews(env); } // first-ever run before cron
    return json({ items, fetchedAt: Date.now() });
  },

  async scheduled(event, env, ctx) {
    if (env.NEWS_DB) ctx.waitUntil(refresh(env));
  },
};
