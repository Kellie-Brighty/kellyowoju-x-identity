# Pending: this project needs its own repo

This directory holds a complete, tested build ("snaplink" — a personal URL
shortener with real click analytics: create a short link, share it, see
when and how often it's actually clicked. Built so Kelly can drop
trackable links to shipped projects into X posts. See README.md) produced
by the autonomous build agent on 2026-10-16.

Verified working end-to-end: `npm run build` passes with no type errors,
and the running server was driven both via direct HTTP (auth gating on
`/api/*`, link creation with auto and custom slugs, duplicate-slug and
invalid-URL rejection, `/:slug` redirect with click logging, per-link
detail with click history, delete) and through a real headless-Chromium
session (unlock with the access key, create a link via the form, see it
appear in the table, open its detail view) with zero console/page errors.
It also respects `PORT` from the environment, as required for a service
deploy.

It could **not** be pushed to its own repo and deployed as the pipeline
normally does, for the exact same reason documented in
`pending-builds/snippet-vault/PENDING.md` (2026-10-07) and
`pending-builds/dev-toolbox/PENDING.md` (2026-10-14) — **this is the
third occurrence of the same structural block, over a month running now,
still unresolved**:

```
HTTP 403: This GitHub API path is not available: sessions are bound to their
configured repositories. Use repository-scoped endpoints (repos/{owner}/{repo}/...).
```

Reproduced again this run via: raw curl `POST /user/repos` with the
fine-grained PAT (blocked by the session's network proxy at that exact
message), and the `add_repo` MCP tool, which rejected `snaplink` with "not
found on github.com, or this session's GitHub credential doesn't have
access to it" — confirming (per its own docs) that it only ever attaches a
repo that already exists, never creates one. `git clone`/`push` against a
repo the session already has access to (like this one) works fine, which
is how this file got here.

**To unblock future runs**, the three options listed in
`pending-builds/snippet-vault/PENDING.md` still apply, none have been
actioned in over a month, and three real, finished builds are now
stranded as a result:

1. Change this environment's GitHub connector so the session isn't bound
   to a fixed repo list (if that's configurable), or
2. Pre-create a pool of empty repos under Kellie-Brighty for the agent to
   claim one per cycle via `add_repo`, or
3. Redesign the pipeline to ship projects as subdirectories of one
   already-authorized repo (like this one) instead of one repo per
   project, and adjust the deploy outbox / droplet poller accordingly.

This run deliberately did **not** attempt option 3 unilaterally: there is
no poller source checked into this repo to confirm it can run a service
out of a subdirectory rather than a repo root, and guessing at a
`start_command` against the production deploy queue without being able to
verify the result (the droplet is unreachable from this sandbox) risks a
silent failure that looks like a successful ship. Safer to leave this
documented and flag it than to fake a deploy.

**To ship this specific project** once unblocked: create a `snaplink`
repo under Kellie-Brighty, push the contents of this directory (minus
this file) to it as `main`, then send the deploy outbox entry with
`deployType: "service"`, `start_command: "node server.js"`, pointing at
that repo. The client is already built (`client/dist` is committed), so
no build step is required on deploy.
