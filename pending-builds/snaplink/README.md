# snaplink

A personal URL shortener with real click analytics. Built for sharing short, trackable links to projects when posting on X — create a short link, drop it in a post, and see when and how often it actually gets clicked.

## Features

- Create short links with an auto-generated or custom slug
- 302 redirect on `/:slug`, with each click logged (timestamp + referrer)
- Dashboard (React + TypeScript + Tailwind + Ant Design) listing all links with live click counts
- Per-link detail view: a clicks-over-time bar chart and a recent-clicks table
- Single access key gates the dashboard and API; the redirect itself stays public

## Stack

- Backend: Node.js + Express + better-sqlite3 (SQLite), serving both the API and the built frontend
- Frontend: React, TypeScript, Vite, Tailwind CSS, Ant Design, Recharts

## Running locally

```bash
# install server deps
npm install

# install + build the client
cd client && npm install && npm run build && cd ..

# start the server (serves the API and the built client)
npm start
```

The server listens on `PORT` (default `4000`). Open `http://localhost:4000`.

On first load you'll be asked for an access key. It defaults to `letmein-snaplink` — override it by setting the `SNAPLINK_API_KEY` environment variable before starting the server.

## API

All `/api/*` routes require an `X-API-Key` header.

- `GET /api/links` — list links with click counts
- `POST /api/links` — `{ url, slug? }` create a link
- `GET /api/links/:slug` — link detail with full click history
- `DELETE /api/links/:slug` — remove a link

`GET /:slug` is public and redirects to the target URL, logging the click.
