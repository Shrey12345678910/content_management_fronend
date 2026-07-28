# Content Workspace — Frontend

React + TypeScript + Vite + Tailwind frontend for the AI Content Workspace. Talks to the
Express + MongoDB backend via `src/api/api.ts` (real `fetch()` calls — the old `mockApi.ts`
has been removed).

## Setup

```bash
npm install
cp .env.example .env   # optional — defaults to http://localhost:5000/api
```

Make sure the backend is running first (see the backend README), then:

```bash
npm run dev
```

Open `http://localhost:5173`.

## What changed from the mock version

- **Removed:** `src/api/mockApi.ts`
- **Added:** `src/api/api.ts` — same method names/signatures as `mockApi.ts`
  (`getDashboard()`, `generateContent(...)`, `getDrafts(query)`, `getDraft(id)`,
  `refineContent(id, action)`, `updateDraft(id, updates)`, `deleteDraft(id)`,
  `getPreferences()`, `updatePreferences(prefs)`), but backed by real HTTP calls to the
  Express API instead of in-memory data.
- **Every page** now imports `api` instead of `mockApi` and handles request errors (loading
  states existed before, but error states didn't — real network calls can fail in ways a mock
  never does, e.g. backend not running, CORS misconfigured, MongoDB down).
- **Drafts search** is now debounced (300ms) so typing doesn't fire a request per keystroke
  against a real backend.

## Folder structure

```
src/
├── api/api.ts           real API client (fetch-based)
├── types/index.ts        shared types, matching the backend's response shapes
├── components/           Layout, Navbar, StatCard, DraftCard — unchanged
├── pages/                 Dashboard, Generate, Drafts, DraftEditor, Preferences
├── App.tsx / main.tsx
└── index.css
```
