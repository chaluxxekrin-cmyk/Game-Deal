const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { fetchSteamDeals } = require('./steam/deals.js');

const PORT = Number(process.env.PORT || 5173);
const ROOT = path.join(__dirname, '..');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml; charset=utf-8',
};

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function serveFile(reqPath, res) {
  const pathname = reqPath === '/' ? '/Home.html' : decodeURIComponent(reqPath);
  const filePath = path.normalize(path.join(ROOT, pathname));

  if (!filePath.startsWith(ROOT)) {
    send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, 'Not found', 'text/plain; charset=utf-8');
      return;
    }
    send(res, 200, data, types[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/api/steam-deals') {
      const data = await fetchSteamDeals({
        start: Math.max(0, Number(url.searchParams.get('start') || 0)),
        count: Math.min(100, Math.max(1, Number(url.searchParams.get('count') || 60))),
        mode: url.searchParams.get('mode') || 'sale',
        genre: url.searchParams.get('genre') || '',
        search: url.searchParams.get('search') || '',
        discount: Math.max(0, Number(url.searchParams.get('discount') || 0)),
        sort: url.searchParams.get('sort') || 'disc',
        cc: url.searchParams.get('cc') || 'us',
      });
      send(res, 200, JSON.stringify(data));
      return;
    }

    serveFile(url.pathname, res);
  } catch (error) {
    send(res, 500, JSON.stringify({ error: error.message || 'Server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`GameDeal server: http://localhost:${PORT}`);
});
