# Deploying RapidTriage EMS

Three pieces go live: a **managed Postgres**, the **API**, and a **shareable
mobile build** pointing at the deployed API. Steps that need your own accounts
are marked 🔑.

The API auto-applies database migrations on boot, so a fresh database just works.

---

## 1. Backend API + Database

### Option A — Render (simplest, free tier, one blueprint) 🔑

A Render Blueprint (`render.yaml`) is included. It provisions the Postgres
database, wires `DATABASE_URL`, builds the API, and runs it.

1. Push this repo to a GitHub repo.
2. Create a free account at https://render.com and connect GitHub.
3. **New → Blueprint → select this repo.** Render reads `render.yaml`, creates
   `rapidtriage-db` (Postgres) and `rapidtriage-api` (web service), and deploys.
4. When it's live, copy the API URL, e.g. `https://rapidtriage-api.onrender.com`.
5. Verify: open `https://<your-api>/health` → `{"ok":true,...}`.

> Render's free Postgres and free web service sleep when idle and the free DB
> expires after ~30 days — fine for a shareable demo, upgrade for anything real.

### Option B — Docker (Railway / Fly.io / any host) 🔑

A root `Dockerfile` builds and runs the API. Provide a `DATABASE_URL` env var
pointing at any Postgres (e.g. a free [Neon](https://neon.tech) database).

```bash
# example: Railway
railway up            # uses the Dockerfile
# set DATABASE_URL in the service's variables (from Neon/Railway Postgres)
```

Required env vars for the API:

| Var | Value |
| --- | --- |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` (from your provider) |
| `PORT` | injected by the host automatically (defaults to 4000) |

---

## 2. Point the app at your API

Edit `apps/mobile/eas.json` and replace `https://REPLACE-WITH-YOUR-API-URL` in
the `preview` (and `production`) profiles with your deployed API URL from step 1:

```jsonc
"preview": {
  "distribution": "internal",
  "android": { "buildType": "apk" },
  "env": { "EXPO_PUBLIC_API_URL": "https://rapidtriage-api.onrender.com" }
}
```

---

## 3. Build a shareable app 🔑

The fastest thing to hand someone is an **Android APK** (installable from a link).

```bash
npm install -g eas-cli
eas login                       # 🔑 your Expo account (free)
cd apps/mobile
eas init                        # links this app to an EAS project (writes projectId)
eas build -p android --profile preview
```

When the build finishes, EAS prints a URL / QR code. Share that link — anyone
can download and install the APK, and it will sync to your deployed API. Records
are still saved on-device first and sync when online, so it works offline too.

### iOS

iOS installs require a paid Apple Developer account and TestFlight:

```bash
eas build -p ios --profile preview
eas submit -p ios              # → TestFlight (needs Apple Developer account)
```

---

## Notes

- Nothing secret is committed — `DATABASE_URL` lives only in the host's env, and
  `EXPO_PUBLIC_API_URL` is public by design (baked into the client at build time).
- To change the API URL later, edit `eas.json` and rebuild (or use EAS Update).
- Local development is unchanged: `npm run dev` (see `SETUP.md`).
