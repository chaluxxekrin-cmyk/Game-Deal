const CACHE_MS = 15 * 60 * 1000;
let cache = null;
let cacheTs = 0;

const FEEDS = [
  { source: 'PC Gamer', url: 'https://www.pcgamer.com/rss/' },
  { source: 'Rock Paper Shotgun', url: 'https://www.rockpapershotgun.com/feed' },
  { source: 'Eurogamer', url: 'https://www.eurogamer.net/feed' },
];

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
  if (cache && Date.now() - cacheTs < CACHE_MS) return cache;
  const results = await Promise.allSettled(FEEDS.map(async (f) => {
    const res = await fetch(f.url, { headers: { 'User-Agent': 'Mozilla/5.0 GameDeal News', accept: 'application/rss+xml,application/xml,text/xml,*/*' } });
    if (!res.ok) throw new Error(f.source + ' ' + res.status);
    return parseFeed(await res.text(), f.source);
  }));
  const items = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  items.sort((a, b) => b.date - a.date);
  const out = { items: items.slice(0, 120), fetchedAt: Date.now() };
  cache = out;
  cacheTs = Date.now();
  return out;
}

module.exports = { fetchNews };
