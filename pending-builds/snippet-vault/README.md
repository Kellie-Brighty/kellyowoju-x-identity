# Snippet Vault

A self-hosted code snippet manager. Save the one-liners and small functions you
always end up re-googling — debounce helpers, regexes, shell one-liners, SQL
queries — tag them, search them, and copy them back out in one click.

Built because the usual home for these is a messy "notes" doc or a scattering
of gists, neither of which is searchable or fast to add to.

## Features

- Create, edit, and delete snippets with a title, language, and tags
- Full-text search across titles, code, and tags
- Filter by tag with one click
- Syntax-highlighted code display (via highlight.js)
- One-click copy to clipboard
- Data persists on the server (JSON-file backed), so it survives restarts

## Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Ant Design
- **Backend**: Node.js + Express, simple file-backed JSON store

## Running locally

```bash
# install server deps
npm install

# install + build the client
npm run build

# start the server (serves the built client + API on one port)
PORT=4000 npm start
```

Then open http://localhost:4000.

For frontend-only development with hot reload, run the client dev server
separately (it proxies `/api` to the Express server on port 4000):

```bash
npm run dev:server   # terminal 1
npm run dev:client   # terminal 2, opens on http://localhost:5173
```

## API

| Method | Path                | Description                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/api/snippets`      | List snippets (`?q=` and `?tag=` filters) |
| POST   | `/api/snippets`      | Create a snippet                     |
| PUT    | `/api/snippets/:id`  | Update a snippet                     |
| DELETE | `/api/snippets/:id`  | Delete a snippet                     |
