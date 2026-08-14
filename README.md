# Bikash Talukder — Portfolio

Live link: https://bikash-20.github.io/my-portfolio-project/

Personal portfolio site for **Bikash Talukder** — a single-page front-end
with a dashboard of live widgets (local time, weather, GitHub, Codeforces,
LeetCode) and an embedded AI chat assistant called **Nexora**.

- **Front-end:** plain HTML / CSS / vanilla JS — no framework, no build step.
- **AI backend:** Vercel serverless function (`api/chat.js`) that proxies
  requests to [OpenRouter](https://openrouter.ai). The OpenRouter API key
  lives in the Vercel dashboard and is **never** shipped to the browser.
- **Weather backend:** Vercel serverless function (`api/weather.js`) that
  proxies requests to [OpenWeatherMap](https://openweathermap.org). Same
  story — the API key is server-side only.

---

## Deploy to Vercel (one-time setup)

1. **Push this repo to GitHub** (or GitLab / Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and **import the repo**.
3. Vercel auto-detects it as a static site. Leave the build settings blank:
   - Build Command: *(leave empty)*
   - Output Directory: *(leave empty)*
   - Install Command: *(leave empty)*
4. Before clicking **Deploy**, click **Environment Variables** and add:
   | Name | Value | Required |
   | --- | --- | --- |
   | `OPENROUTER_API_KEY` | your key from [openrouter.ai/keys](https://openrouter.ai/keys) | yes |
   | `OPENWEATHER_API_KEY` | your key from [openweathermap.org/appid](https://openweathermap.org/appid) | yes |
   | `OPENROUTER_MODEL` | `meta-llama/llama-3.3-70b-instruct:free` | optional |
   | `OPENROUTER_REFERER` | `https://your-domain.example` | optional |
   | `OPENROUTER_TITLE` | `Bikash Talukder \| Portfolio` | optional |
   | `WEATHER_CITY` | `Dhaka` | optional |
5. Hit **Deploy**. Your site will be live at
   `https://<project-name>.vercel.app` within about 30 seconds.
6. (Optional) In **Settings → Domains**, add a custom domain.

Both the OpenRouter and OpenWeatherMap keys are only available to the
serverless functions, never to visitors' browsers.

---

## Local development

You can develop the static site without any Vercel setup:

```bash
npm run dev
# serves the site on http://localhost:3000
```

To develop the `api/*.js` serverless functions locally, install the Vercel
CLI and run `vercel dev`:

```bash
npm i -g vercel
vercel login
vercel link                # one-time, links to your Vercel project
vercel env pull .env.local # pulls env vars into .env.local
npm run dev:api            # runs front-end + /api/* on http://localhost:3000
```

The `dev:api` script needs `vercel` to be installed and a project linked.
If you only want to test the front-end, just use `npm run dev` — the chat
will gracefully fall back to the offline smart-reply engine when no API
endpoint is available.

---

## Project structure

```
.
├── index.html              # single-page site (all sections + chat UI)
├── style.css               # all styles
├── 404.html                # themed not-found page
├── js/
│   ├── loaders.js          # time / GitHub / Codeforces / LeetCode loaders
│   ├── nexora.js           # chat engines + AI ask
│   ├── ui.js               # cursor, nav observer, typing, skill bars
│   ├── weather.js          # browser-side weather loader (proxied)
│   └── leetcode.js         # LeetCode stats fallback
├── assets/
│   └── hero.jpg            # hero photo (576x576, ~40 KB)
├── api/
│   ├── chat.js             # Vercel serverless → OpenRouter
│   └── weather.js          # Vercel serverless → OpenWeatherMap
├── vercel.json             # Vercel config (functions, headers, caching)
├── .env.example            # template for local dev env vars
├── .vercelignore           # files Vercel should skip
├── .gitignore              # files git should skip
└── package.json            # dev convenience scripts
```

---

## Live data sources

| Widget          | Source                                      | Key in code?              |
| --------------- | ------------------------------------------- | ------------------------- |
| Local time      | `Intl.DateTimeFormat` (browser)             | no                        |
| Weather         | OpenWeatherMap (via Vercel `/api/weather`)  | no (Vercel env var)       |
| GitHub repos    | `api.github.com/users/<u>`                  | no                        |
| Codeforces      | `codeforces.com/api/user.info`              | no                        |
| LeetCode        | `leetcode-stats-api.herokuapp.com/<u>`      | no                        |
| Nexora chat     | OpenRouter (via Vercel `/api/chat`)         | no (Vercel env var)       |

### Updating usernames

The three handles live in `js/loaders.js` and `js/leetcode.js` inside
their respective loader functions. Find and replace the current values
(`bikash-20`, `talukder_20`, `bikashtalukder`) if you ever change them.

### Rotating the OpenWeatherMap key

If the key in `OPENWEATHER_API_KEY` gets rate-limited or you want to rotate
it, generate a new one at [openweathermap.org/appid](https://openweathermap.org/appid)
and update the value in the Vercel dashboard. No code change needed.

---

## Security notes

- The OpenRouter and OpenWeatherMap keys **must never** be committed. If
  one is leaked, rotate it immediately in the respective dashboard.
- The chat function enforces a `messages` shape, caps each message at
  4000 chars, and limits history to the last 20 turns to prevent abuse.
- The chat function tries the primary model, then several free fallbacks,
  before returning a 502. The front-end catches 502s and falls back to
  the offline smart-reply engine, so a Nexora outage never breaks the
  chat UI.
- The weather function rate-limits each IP to 30 requests per minute and
  caches responses for 10 minutes.

---

## License

MIT — do whatever you like with the code, attribution appreciated.
