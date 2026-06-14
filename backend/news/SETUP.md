# News worker setup (Cloudflare D1)

The news worker (`worker.js`) permanently accumulates gaming headlines in a
Cloudflare D1 database. Old items are never deleted; new ones are added on a
schedule (deduped by URL). `/api/news` reads the newest rows from D1.

If D1 is not bound, the worker still works as a live (non-accumulating) feed
fetch, so you can deploy first and add D1 later.

## 1. Create the D1 database

In the Cloudflare dashboard: **Workers & Pages → D1 → Create database**
(e.g. name it `gamenews`). Or via CLI:

```
npx wrangler d1 create gamenews
```

## 2. Bind it to the worker

Open the `gamenews` worker → **Settings → Bindings → Add → D1 database**:

- Variable name: `NEWS_DB`
- D1 database: the one created above

(Wrangler equivalent in `wrangler.toml`:)

```
[[d1_databases]]
binding = "NEWS_DB"
database_name = "gamenews"
database_id = "<id from step 1>"
```

## 3. Create the table

D1 → your database → **Console**, run:

```sql
CREATE TABLE IF NOT EXISTS news (
  url TEXT PRIMARY KEY, title TEXT, source TEXT, date INTEGER
);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date);
```

(The worker also runs `CREATE TABLE IF NOT EXISTS` on every request, so this is
optional — but creating it up front is cleaner.)

## 4. Add a Cron Trigger

Worker → **Settings → Triggers → Cron Triggers → Add**:

```
*/15 * * * *
```

This runs `scheduled()` every 15 minutes to pull the feeds and insert new rows.

## 5. Deploy

Paste `worker.js` into the dashboard editor (or `npx wrangler deploy`) and save.

Verify: open `https://gamenews.<your-subdomain>.workers.dev/api/news` — you
should get `{ "items": [...], "fetchedAt": ... }`. The `db: false` field appears
only when D1 is not yet bound (live fallback mode).
