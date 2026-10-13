# Test Web 1 — QuickByte demo shop

A dependency-free static storefront with **6 planted bugs** (5 cosmetic, 1 visible
pricing bug). Its only connection to BugShield is the report widget in
`index.html` — no shared code, no shared server. Ships as **its own repository**
with its own `render.yaml` (Render static site).

## Layout (split-repo ready)

- `index.html`, `styles.css`, `app.js` — the shop (inlined BugShield SDK, no external script to block).
- `config.example.js` — widget config template (committed).
- `config.js` — real widget config (**gitignored**). Local copy points at localhost;
  on Render it is generated at build time from env vars.
- `scripts/build-config.mjs` — build step: writes `config.js` from
  `BUGSHIELD_HOST` / `BUGSHIELD_APP_ID` / `BUGSHIELD_INGESTION_KEY`. Fails the
  build loudly when any is missing.
- `render.yaml` — static-site blueprint (`runtime: static`, publish `./`).
- `.gitignore` — keeps `config.js` (per-site secret) out of git.

## Run locally

```bash
# BugShield repo:
npm start                                  # http://localhost:3000
# This repo:
cp config.example.js config.js             # then fill localhost values
python -m http.server 8080                # http://localhost:8080
```

## Deploy as two separate repositories

**Repo 1 — BugShield** (root `render.yaml` in the platform repo):
New → Blueprint → set `BOOTSTRAP_OWNER_EMAIL/PASSWORD`, `AI_API_KEY`
(OpenRouter key). Needs Starter+ (persistent disk). Note its public URL.

**Repo 2 — this shop** (this folder as its own repo):
New → Blueprint → set `BUGSHIELD_HOST` (platform URL, no trailing slash),
`BUGSHIELD_APP_ID`, `BUGSHIELD_INGESTION_KEY` (create it in the BugShield
dashboard under Apps → Ingestion keys, origin allow-listed to the shop URL).

**Unlock assess → fix → deploy** (widget-only gives reports):
In the BugShield dashboard, connect this repo's Git URL as the app's source
(Apps → source). For private repos / pushing fixes back, set `GITHUB_TOKEN` on
BugShield. BugShield clones, the AI patches, the push redeploys this static
site automatically. Without `AI_API_KEY`, cosmetic reports honestly close as
`INVALID_REPORT`.

## Planted bugs

1. Typos: "Shoping Cart", "Add to Card", "Totle", "grocerys", "upto".
2. Hero headline overlaps the hero art (negative margin + fixed 64px).
3. SALE badge renders behind product photos (`z-index: -1`).
4. Fixed 300px grid columns — sideways scroll on mobile.
5. Near-invisible footer text; stale © 2023.
6. Cart total concatenates prices as strings (`app.js` `cartTotal()`).
