# Dev Toolbox

A single page of the small utilities I keep re-opening tabs for: JSON
formatting, Base64/URL encoding, UUID generation, Unix timestamp
conversion, hash generation (MD5/SHA-1/256/384/512), JWT decoding, color
conversion, and Lorem Ipsum. Everything runs client-side in the browser —
nothing you type is sent anywhere.

## Why

I kept bouncing between five different bookmarked sites to format JSON,
decode a JWT, or convert a timestamp while debugging. This puts all of
them behind one sidebar, built with the stack I actually use day to day.

## Stack

React 19 + TypeScript + Vite, Tailwind CSS v4, Ant Design.

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static
`dist/` folder that can be served from any static host.
