# TransitPass — Railway Deployment Guide

Deploy the full stack on [Railway](https://railway.app) in ~10 minutes.

```
Railway Project
├── transitpass-api   (Spring Boot — from /transitpass-api folder)
├── transitpass-web   (Next.js PWA  — from /transitpass-web folder)
└── PostgreSQL        (Railway managed plugin)
```

---

## Step 1 — Create a Railway Project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **Empty Project**
3. Name it `TransitPass`

---

## Step 2 — Add PostgreSQL

1. In your project dashboard click **+ New** → **Database** → **Add PostgreSQL**
2. Railway provisions a managed Postgres instance automatically
3. Click the Postgres service → **Variables** tab
4. Note the values — Railway auto-injects these into services in the same project:
   - `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

> **TimescaleDB note**: Railway's Postgres does not include TimescaleDB.
> The migration handles this gracefully — if the extension is absent the
> `create_hypertable` call is skipped and a regular table is used instead.
> All functionality works normally; you only lose time-series compression.

---

## Step 3 — Deploy the API (Spring Boot)

### Option A — GitHub (recommended)

1. Push the `transitpass-api/` folder as its own GitHub repository:
   ```bash
   cd transitpass-api
   git init && git add . && git commit -m "init"
   git remote add origin https://github.com/YOU/transitpass-api.git
   git push -u origin main
   ```
2. In Railway: **+ New** → **GitHub Repo** → select `transitpass-api`
3. Railway detects the `Dockerfile` and `railway.toml` automatically

### Option B — Railway CLI

```bash
npm install -g @railway/cli
railway login
cd transitpass-api
railway link          # link to your project
railway up            # deploy
```

### Set API Environment Variables

In Railway dashboard → `transitpass-api` service → **Variables** tab, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `JWT_SECRET` | `<random 32+ char string>` | Required |
| `ENCRYPTION_MASTER_PASSWORD` | `<strong password>` | Required |
| `SUPERADMIN_USERNAME` | `superadmin` | |
| `SUPERADMIN_PASSWORD` | `<your password>` | Required |
| `AT_USERNAME` | `sandbox` | Africa's Talking |
| `AT_API_KEY` | `<your key>` | |
| `MPESA_CALLBACK_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}/api/mpesa/callback` | Set after deploy |
| `JPA_SHOW_SQL` | `false` | |

> Railway auto-injects `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`
> from the Postgres plugin. No manual DB config needed.

After the first deploy, the superadmin account is created automatically.

---

## Step 4 — Deploy the Frontend (Next.js)

1. Push `transitpass-web/` as its own GitHub repository:
   ```bash
   cd transitpass-web
   git init && git add . && git commit -m "init"
   git remote add origin https://github.com/YOU/transitpass-web.git
   git push -u origin main
   ```
2. In Railway: **+ New** → **GitHub Repo** → select `transitpass-web`

### Set Frontend Environment Variables

In Railway dashboard → `transitpass-web` service → **Variables** tab, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `RAILWAY_API_URL` | `http://transitpass-api.railway.internal:${{transitpass-api.PORT}}` | Internal Railway URL |

> **How this works**: Next.js rewrites `/api/*` requests server-side to the
> internal `transitpass-api` service using Railway's private network.
> The browser never talks to the API directly — all API calls go through the
> Next.js server, which proxies them internally. This means CORS is never an issue.

---

## Step 5 — Set Public Domains

1. Click `transitpass-api` → **Settings** → **Networking** → **Generate Domain**
   → e.g. `transitpass-api-production.up.railway.app`
2. Click `transitpass-web` → **Settings** → **Networking** → **Generate Domain**
   → e.g. `transitpass-web-production.up.railway.app`
3. Go back to `transitpass-api` Variables and update:
   ```
   MPESA_CALLBACK_URL = https://transitpass-api-production.up.railway.app/api/mpesa/callback
   ```

---

## Step 6 — Verify Deployment

```bash
# Health check
curl https://transitpass-api-production.up.railway.app/actuator/health
# → {"status":"UP"}

# Login
curl -X POST https://transitpass-api-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"YOUR_PASSWORD"}'
# → {"token":"eyJ...","role":"SUPER_ADMIN","tenantId":null}
```

Then open `https://transitpass-web-production.up.railway.app` in your browser.

---

## Environment Variable Summary

### transitpass-api (Spring Boot)

| Variable | Source | Required |
|----------|--------|----------|
| `PGHOST` | Auto (Postgres plugin) | ✅ |
| `PGPORT` | Auto (Postgres plugin) | ✅ |
| `PGDATABASE` | Auto (Postgres plugin) | ✅ |
| `PGUSER` | Auto (Postgres plugin) | ✅ |
| `PGPASSWORD` | Auto (Postgres plugin) | ✅ |
| `JWT_SECRET` | Manual | ✅ |
| `ENCRYPTION_MASTER_PASSWORD` | Manual | ✅ |
| `SUPERADMIN_PASSWORD` | Manual | ✅ |
| `SUPERADMIN_USERNAME` | Manual | defaults to `superadmin` |
| `MPESA_CALLBACK_URL` | Manual | after domain is known |
| `AT_USERNAME` | Manual | defaults to `sandbox` |
| `AT_API_KEY` | Manual | for live SMS |
| `PORT` | Auto (Railway) | ✅ auto-injected |

### transitpass-web (Next.js)

| Variable | Source | Required |
|----------|--------|----------|
| `RAILWAY_API_URL` | Manual | ✅ internal URL to API service |
| `PORT` | Auto (Railway) | ✅ auto-injected |

---

## Redeployment

```bash
# API — push to GitHub triggers auto-redeploy, or:
cd transitpass-api && railway up

# Frontend
cd transitpass-web && railway up
```

---

## Logs

```bash
railway logs --service transitpass-api
railway logs --service transitpass-web
```

Or view in Railway dashboard → service → **Logs** tab.

---

## Cost Estimate (Railway Hobby plan — $5/mo)

| Service | Typical usage |
|---------|--------------|
| PostgreSQL | ~$0–5/mo (500MB free) |
| transitpass-api | ~$2–4/mo (512MB RAM) |
| transitpass-web | ~$1–2/mo (256MB RAM) |
| **Total** | **~$5–10/mo** |
