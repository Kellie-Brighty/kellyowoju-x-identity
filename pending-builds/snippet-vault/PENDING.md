# Pending: this project needs its own repo

This directory holds a complete, tested build ("Snippet Vault" — a self-hosted
code snippet manager, see README.md) produced by the autonomous build agent on
2026-10-07.

It could **not** be pushed to its own repo and deployed as the pipeline
normally does, because this run's GitHub session access rejects repo-creation
calls outright:

```
HTTP 403: This GitHub API path is not available: sessions are bound to their
configured repositories. Use repository-scoped endpoints (repos/{owner}/{repo}/...).
```

This happened via `POST /user/repos` (raw curl with the fine-grained PAT),
`gh repo create` (same PAT), and the `add_repo` tool (which only attaches
*existing* repos, not create new ones) — all blocked the same way. This is a
proxy-level restriction tied to how this Claude Code Remote session's GitHub
access is scoped, not a credentials problem — the PAT works fine for git
clone/push against repos the session already knows about (that's how this
file got here).

**To unblock future runs**, one of:
1. Change this environment's GitHub connector so the session isn't bound to
   a fixed repo list (if that's configurable), or
2. Pre-create a pool of empty repos under Kellie-Brighty for the agent to
   claim one per cycle via `add_repo`, or
3. Redesign the pipeline to ship projects as subdirectories of one
   already-authorized repo (like this one) instead of one repo per project,
   and adjust the deploy outbox / droplet poller accordingly.

**To ship this specific project** once unblocked: create a `snippet-vault`
repo under Kellie-Brighty, push the contents of this directory (minus this
file) to it as `main`, then send the deploy outbox entry with
`deployType: "service"`, `start_command: "node server/index.js"`, pointing at
that repo.
