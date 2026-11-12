# CareLink — Healthcare Appointment Portal

A hackathon demo: a React patient portal with an AI scheduling assistant (Google Gemini function calling), doctor discovery, appointment booking/cancellation, a health profile and a symptom relief guide. Backed by an Express API with in-memory data.

> **Demo only.** Not a production healthcare platform. Data is held in memory and resets whenever the backend restarts. The symptom guide and assistant do not provide medical diagnoses.

## Features

- **Auth** — sign in, register, one-click demo logins (John Doe, Ayesha Khan), password toggle, validation.
- **Dashboard** — next appointment, health summary, current symptoms, upcoming visits, quick actions (all from the backend).
- **Find Doctors** — search + specialty filters, qualifications, experience, fee, next availability.
- **Booking** — pick date → fetch real slots → pick slot → confirm. Success is shown only after the backend confirms. Cancellation with confirmation; upcoming/history tabs.
- **AI Assistant** — dedicated chat page, suggested prompts, typing indicator, appointment confirmation card. Uses Gemini with function calling; falls back to the built-in clinical scheduler when no valid key is set.
- **Health profile** — per-section edit/save/cancel for personal details, history, allergies, medications and symptoms.
- **Symptom relief** — OTC info, home care, red flags, allergy warnings, disclaimer and a specialist booking shortcut (content from `client/src/data/symptomReliefData.js`, unchanged).
- Light/dark theme, responsive layout (sidebar → drawer + bottom nav on mobile).

## Project structure

```
client/                      React + Vite (JavaScript, plain CSS with design tokens)
  src/
    components/              common · layout · auth · dashboard · profile · doctors · chat · appointments · symptoms
    pages/                   one file per route
    context/                 Auth, Theme, Chat, Toast providers
    hooks/                   useAsync, useAppointments, useServerStatus
    services/api.js          the only place that talks to the backend (reads VITE_API_URL)
    styles/                  tokens.css (design system) + per-area stylesheets
    utils/                   formatting + validation
    data/symptomReliefData.js  static clinical content
  vercel.json                SPA rewrite for Vercel
server/                      Express API
  index.js                   routes (auth, patient, doctors, availability, appointments, chat, health)
  data/ tools/ services/ prompts/   seeded data, scheduling tools, Gemini + clinical fallback
  test/api.test.js           API tests (node:test)
render.yaml                  Render blueprint for the backend
```

## Local setup

Requires Node.js 18+.

```bash
npm run install:all        # installs server + client dependencies
cp server/.env.example server/.env   # optional: add GEMINI_API_KEY
```

Run in two terminals:

```bash
npm run server             # API on http://localhost:3001
npm run client             # UI on http://localhost:5173 (proxies /api to :3001)
```

Demo logins: `john@example.com` / `ayesha@example.com`, password `password123`.

Tests and build:

```bash
npm run test:server        # backend API tests
npm run build:client       # production build -> client/dist
```

## Environment variables

| Where | Variable | Purpose |
|---|---|---|
| client (Vercel) | `VITE_API_URL` | Public URL of the backend, no trailing slash. Leave empty locally. |
| server (Render) | `GEMINI_API_KEY` | Gemini key. **Server only.** Optional — without it the clinical fallback answers. |
| server | `GEMINI_MODEL` | Defaults to `gemini-3.1-flash-lite` in `.env.example`. |
| server | `CORS_ORIGINS` | Comma-separated allowed origins, e.g. `https://your-app.vercel.app`. Empty = allow all. |
| server | `PORT` | Set automatically by Render. |

## Deployment

The frontend (Vercel) and backend (Render) are deployed **separately**. Deploy the backend first so you have its URL.

### 1. Backend on Render

1. Push the repo to GitHub.
2. Render → **New → Web Service** (or **Blueprint** using `render.yaml`) → select the repo.
3. Settings: **Root Directory** `server`, **Build Command** `npm install`, **Start Command** `npm start`, **Health Check Path** `/api/health`.
4. Environment: add `GEMINI_API_KEY` (optional). Leave `CORS_ORIGINS` empty for now.
5. Deploy and note the URL, e.g. `https://carelink-api.onrender.com`. Check `<url>/api/health` returns `{"status":"ok",...}`.

### 2. Frontend on Vercel

1. Vercel → **Add New → Project** → import the repo.
2. **Root Directory** `client`. Framework preset: Vite (build `npm run build`, output `dist`; `vercel.json` already sets these and the SPA rewrite).
3. Environment variable: `VITE_API_URL` = your Render URL (no trailing slash).
4. Deploy and note the Vercel URL.

### 3. Lock down CORS

In Render, set `CORS_ORIGINS` to your Vercel URL (add preview domains comma-separated if needed) and redeploy. Open the Vercel app → Settings page shows the API endpoint and server status.

> Render's free tier sleeps after inactivity; the first request can take up to a minute. The UI shows a "connecting" banner, and the first demo action may be slow — open the site a minute before presenting.

### Alternative: everything on Vercel (single project)

The repo root also deploys as one Vercel project: `vercel.json` builds the client and routes `/api/*` to `api/index.js`, which serves the Express app as a serverless function.

1. Vercel → **Add New → Project** → import the repo. Leave **Root Directory** as the repo root.
2. Environment variables: `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-3.1-flash-lite`. Do **not** set `VITE_API_URL` (the app then calls the same domain). `CORS_ORIGINS` is not needed.
3. Deploy.

**Caveat:** serverless functions are stateless, so the in-memory data (registrations, bookings, profile edits, chat sessions) can reset on cold starts and may differ between function instances. Fine for a quick look; for a reliable live demo prefer the Render + Vercel split above, or add a database.

## API summary

`GET /api/health` · `POST /api/auth/login|register` · `GET|PUT /api/patient/:id` · `GET /api/patient/:id/appointments` · `GET /api/doctors[?specialty=&q=]` · `GET /api/doctors/:id` · `GET /api/doctors/:id/availability?date=YYYY-MM-DD` · `POST /api/appointments` · `DELETE /api/appointments/:id?patientId=` · `POST /api/chat`

## Known limitations

- In-memory data: registrations, bookings and profile edits reset when the backend restarts (the UI signs you out if your account no longer exists).
- Authentication is the original demo mechanism (no tokens/sessions); do not use real credentials or health data.
- Doctor qualifications, experience and fees are illustrative seed data added in `server/data/doctors.js`.
- Appointment times are in the clinic timezone (Asia/Karachi, +05:00).
