# Pending: this project needs its own repo

This directory holds a complete, tested build ("Dev Toolbox" — a client-side
JSON formatter, Base64/URL encoder, UUID generator, Unix timestamp
converter, hash generator (MD5/SHA-1/256/384/512), JWT decoder, color
converter, and Lorem Ipsum generator, see README.md) produced by the
autonomous build agent on 2026-10-14.

Verified working end-to-end: `npm run build` passes with no type errors,
and every tool was driven in a real headless-Chromium session (JSON
format/minify, Base64 round-trip, UUID batch generation, timestamp
conversion both directions, all five hash algorithms checked against known
test vectors for "hello", JWT decode of a sample token, hex→rgb→hsl color
conversion, Lorem Ipsum generation) with zero console/page errors.

It could **not** be pushed to its own repo and deployed as the pipeline
normally does, for the exact same reason documented in
`pending-builds/snippet-vault/PENDING.md` on 2026-10-07 — **this is the
second occurrence of the same structural block, one week apart, still
unresolved**:

```
HTTP 403: This GitHub API path is not available: sessions are bound to their
configured repositories. Use repository-scoped endpoints (repos/{owner}/{repo}/...).
```

Reproduced again this run via: raw curl `POST /user/repos` with the
fine-grained PAT, `gh repo create` (same PAT, proxied), and the `add_repo`
MCP tool (confirmed by its own error: it only attaches existing repos,
never creates one — it rejected `dev-toolbox` with "not found... or this
session's GitHub credential doesn't have access to it"). This session's
GitHub egress proxy flatly refuses repository creation; git clone/push
against repos the session already has (like this one) works fine, which is
how this file got here.

**To unblock future runs**, one of the three options already listed in
`pending-builds/snippet-vault/PENDING.md` still applies and none have been
actioned yet.

**To ship this specific project** once unblocked: create a `dev-toolbox`
repo under Kellie-Brighty, push the contents of this directory (minus this
file) to it as `main`, then send the deploy outbox entry with
`deployType: "static"` (pure client-side, no backend).
