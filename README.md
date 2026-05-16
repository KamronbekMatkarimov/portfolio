# Kamron Matkarimov — Portfolio

Production-grade personal portfolio built with:

- React 18 + Vite
- Pure CSS (no Tailwind / no UI libraries)
- Vercel Serverless Functions (`/api/chat` → OpenRouter)
- GitHub REST API (token optional)
- Lazy-loaded AI chat

## Setup

1) Install deps

```bash
npm install
```

2) Configure env

Copy `.env.example` to `.env` and set values:

- `OPENROUTER_API_KEY` — API key from [OpenRouter](https://openrouter.ai/keys)
- `OPENROUTER_MODEL` (optional; default `nousresearch/hermes-3-llama-3.1-405b:free`)
- `OPENROUTER_MODEL_FALLBACK` (optional; e.g. `meta-llama/llama-3.2-3b-instruct:free`)
- **`api/assistant-knowledge.json`** — facts about you for the AI (bio, skills, FAQ, projects). Edit this file so chat answers accurately.
- `VITE_GITHUB_TOKEN` (GitHub API: projects list + optional repo context for AI)
- `VITE_GITHUB_USERNAME`

3) Run dev server

```bash
npm run dev
```

`npm run dev` serves `POST /api/chat` via a small Vite middleware that calls the same logic as `api/chat.js` (Vite itself does not run Vercel Functions). In production on Vercel, `api/chat.js` handles `/api/chat` directly.

## Deploy (Vercel)

Production URL: **https://kamron.uz** (also `matkarimov.uz`, `matkarimovff.uz`).

If a custom domain does not open yet, add an **A** record at your registrar: `@` → `76.76.21.21` (or point nameservers to Vercel: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`).

- Vercel will detect Vite automatically.
- Serverless function lives in `api/chat.js` and is available at `/api/chat`.
