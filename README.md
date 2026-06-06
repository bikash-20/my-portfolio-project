# Bikash Talukder — Portfolio
live link: https://bikash-20.github.io/my-portfolio-project/

Personal portfolio site for **Bikash Talukder** — a single-page front-end with a
dashboard of live widgets (time, weather, GitHub, Codeforces, LeetCode) and an
embedded AI chat assistant called **Nexora**.

- **Front-end:** plain HTML / CSS / vanilla JS — no framework, no build step.
- **AI backend:** Vercel serverless function (`api/chat.js`) that proxies
  requests to [OpenRouter](https://openrouter.ai). The OpenRouter API key
  lives in the Vercel dashboard and is **never** shipped to the browser.

---

## 🚀 Deploy to Vercel (one-time setup)

1. **Push this repo to GitHub** (or GitLab / Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and **import the repo**.
3. Vercel auto-detects it as a static site. Leave all build settings blank:
   - Build Command: *(leave empty)*
   - Output Directory: *(leave empty)*
   - Install Command: *(leave empty)*
4. Before clicking **Deploy**, click **Environment Variables** and add:
   | Name | Value | Required |
   | --- | --- | --- |
   | `OPENROUTER_API_KEY` | your key from [openrouter.ai/keys](https://openrouter.ai/keys) | ✅ |
   | `OPENROUTER_MODEL` | `meta-llama/llama-3.3-70b-instruct:free` | optional |
   | `OPENROUTER_REFERER` | `https://your-domain.example` | optional |
   | `OPENROUTER_TITLE` | `Bikash Talukder | Portfolio` | optional |
5. Hit **Deploy**. Your site will be live at
   `https://<project-name>.vercel.app` within ~30 seconds.
6. (Optional) In **Settings → Domains**, add a custom domain.

The OpenRouter key is only available to the serverless function, never to
visitors' browsers.

---

## 🧑‍💻 Local development

You can develop the static site without any Vercel setup:

```bash
npm run dev
# → serves the site on http://localhost:3000
```

To develop the `api/chat.js` serverless function locally, install the Vercel
CLI and run `vercel dev`:

```bash
npm i -g vercel
vercel login
vercel link                # one-time, links to your Vercel project
vercel env pull .env.local # pulls OPENROUTER_API_KEY into .env.local
npm run dev:api            # runs front-end + /api/chat on http://localhost:3000
```

> **Note:** the `dev:api` script needs `vercel` to be installed and a project
> linked. If you only want to test the front-end, just use `npm run dev` — the
> chat will gracefully fall back to the offline smart-reply engine.

---

## 🧩 Project structure

```
.
├── index.html              # single-page site + all inline JS
├── style.css               # all styles
├── js/
│   ├── weather.js          # OpenWeatherMap (public key, ok to ship)
│   └── leetcode.js         # LeetCode stats (public API, no key)
├── api/
│   └── chat.js             # Vercel serverless function → OpenRouter
├── vercel.json             # Vercel config (functions, headers, caching)
├── .env.example            # template for local dev env vars
├── .vercelignore           # files Vercel should skip
├── .gitignore              # files git should skip
└── package.json            # dev convenience scripts
```

---

## 🔌 Live data sources

| Widget | Source | Key in code? |
| --- | --- | --- |
| Local time | `Intl.DateTimeFormat` (browser) | ❌ none |
| Weather | OpenWeatherMap | ✅ key in `js/weather.js` (rotatable, public) |
| GitHub repos | `api.github.com/users/<u>` | ❌ none |
| Codeforces | `codeforces.com/api/user.info` | ❌ none |
| LeetCode | `leetcode-stats-api.herokuapp.com/<u>` | ❌ none |
| Nexora chat | OpenRouter (via Vercel `/api/chat`) | 🔐 in Vercel env vars |

### Updating usernames

The three handles live in `index.html` inside their respective loader
functions: `loadGH()`, `loadCF()`, and `js/leetcode.js`. Find/replace on the
current values (`bikash-20`, `bikash_dhaka`, `bikash_00123`) if you ever
change them.

### Rotating the OpenWeatherMap key

If the key in `js/weather.js` gets rate-limited or you want to rotate it:

1. Get a new key at [openweathermap.org/appid](https://openweathermap.org/appid).
2. Replace the `appid=` value in `js/weather.js`.
3. Push. The new key is live on the next deploy.

---

## 🛡 Security notes

- The OpenRouter key **must never** be committed. If you accidentally do,
  rotate it immediately on openrouter.ai.
- The Vercel function enforces a `messages` shape, caps each message at 4000
  chars, and limits history to the last 20 turns to prevent abuse.
- The function tries the primary model, then three free fallbacks, before
  returning a 502. The front-end catches 502s and falls back to the offline
  smart-reply engine, so a Nexora outage never breaks the chat UI.

---

## 📜 License

MIT — do whatever you like with the code, attribution appreciated.
