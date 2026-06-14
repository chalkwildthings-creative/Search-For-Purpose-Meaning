# Logos — deploy & market-test guide

A reflection companion grounded in Viktor Frankl's Logotherapy. This project is a
React (Vite) front end plus one serverless function (`/api/chat.js`) that talks to
**OpenRouter**. Your API key lives on the server and is never exposed to visitors.

> Logos is a reflection tool, not a therapist or crisis service. The interface and
> the AI both make this clear and point to 988 / the Crisis Text Line.

---

## What you need
- A free **GitHub** account
- A free **Vercel** account (hosting + the serverless function)
- Your existing **OpenRouter** account and an API key (starts with `sk-or-`)
- Node.js 18+ if you want to run it locally first (optional)

---

## The fastest path (deploy in ~10 minutes)

### 1. Put this folder on GitHub
- Create a new empty repository on GitHub (e.g. `logos-app`).
- Upload everything in this `logos-app/` folder to it (drag-and-drop in the GitHub
  web UI works, or use git). Do **not** upload a `.env` file — the `.gitignore`
  already excludes it.

### 2. Import the repo into Vercel
- Go to vercel.com, "Add New… - Project," and pick your `logos-app` repo.
- Vercel auto-detects Vite. Leave the build settings at their defaults
  (build command `vite build`, output `dist`). The `api/` folder is detected
  automatically as a serverless function — nothing to configure.

### 3. Add your environment variables (this is the important step)
In the Vercel project: **Settings - Environment Variables**, add:

| Name | Value |
|------|-------|
| `OPENROUTER_API_KEY` | your `sk-or-...` key |
| `OPENROUTER_MODEL` | `google/gemini-2.0-flash-exp:free` (free, for testing) |

To run a **closed test** (only people with a code can use it), also add:

| Name | Value |
|------|-------|
| `TESTER_PASSCODE` | any code you choose, e.g. `frankl-pilot` |

Then share both the URL **and** the code with your testers. The server rejects any
request without the matching code, so it protects your credits even if someone
finds the URL. To make the app fully open later, delete this variable and redeploy.

### Optional: find real local nonprofits (live web search)
If you want Logos to name real volunteer organizations near a user (after they
share only their city or county — never name, age, or anything else), add:

| Name | Value |
|------|-------|
| `ENABLE_WEB_SEARCH` | `true` |

This turns on OpenRouter's web search so the app draws from real, current results
and only names organizations that actually appear — it won't invent any. It adds a
small per-search cost (check current pricing at openrouter.ai). With it **off**, the
app still works: it points users to trusted directories (Idealist/VolunteerMatch,
JustServe, 211) instead of naming specific local orgs. Nothing a user types is
stored either way.

Then click **Deploy**. You'll get a live URL like `https://logos-app.vercel.app`.

That's it — open the URL and talk to it.

---

## Free vs. paid models
For a **market test**, use one of OpenRouter's free models so you pay nothing:
- `google/gemini-2.0-flash-exp:free`
- `meta-llama/llama-3.3-70b-instruct:free`

Free models have lower rate limits (fine for a small test). When you're ready to
**roll out**, change `OPENROUTER_MODEL` to a warmer, more capable model such as
`anthropic/claude-sonnet-4.6` (about $3 per million input / $15 per million output
tokens — roughly a few cents per conversation). Changing the variable and
redeploying is the only change needed; no code edits.

Browse all model slugs at openrouter.ai/models.

---

## Keep your test safe and predictable
- **Cap spending:** in OpenRouter, set a credit limit / low balance so a test can
  never surprise you with a bill.
- **Abuse guard:** `api/chat.js` already trims each conversation to the last 30
  messages and caps message length, which limits cost per visitor.
- **Privacy:** the app does **not** store conversations anywhere — they live only in
  the visitor's browser session and disappear on refresh. Keep it that way during
  testing; it keeps you clear of most data-privacy obligations.
- **Disclaimer:** the "not a therapist / 988 / Crisis Text Line" lines are built in.
  Leave them visible.

---

## Voice features
The microphone and spoken replies use the browser's built-in Web Speech API. They
need a secure (HTTPS) page — which your Vercel URL is — and a supportive browser
(Chrome and Edge are reliable; Safari partial; Firefox limited). The first time a
visitor taps the mic, the browser asks for microphone permission.

For a genuinely warm, human voice later, swap the browser voice for a TTS service
(ElevenLabs, OpenAI, Azure). That's a second backend call and a separate upgrade.

---

## Running locally (optional)
```bash
npm install
# Front end only (the /api function will NOT run under plain vite):
npm run dev
```
To run the API locally too, use the Vercel CLI:
```bash
npm i -g vercel
vercel dev          # serves both the app and /api/chat, reading .env
```
Create a `.env` from `.env.example` first and put your real key in it.

---

## Files
- `src/App.jsx` — the full Logos interface (chat, mic, voice, conversation mode)
- `api/chat.js` — the server function holding your key + the system prompt
- `index.html`, `src/main.jsx`, `vite.config.js`, `package.json` — standard Vite app
- `.env.example` — template for your environment variables
