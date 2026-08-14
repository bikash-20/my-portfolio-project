// =====================================================================
// api/weather.js — Vercel serverless function
// Proxies OpenWeatherMap so the API key never ships to the browser.
//
// Env var (set in Vercel → Project → Settings → Environment Variables):
//   OPENWEATHER_API_KEY   required   your OpenWeatherMap key
//   WEATHER_CITY          optional   default: Dhaka
//
// The browser hits /api/weather and gets a sanitized payload back.
// =====================================================================

const json = (res, status, body, extraHeaders = {}) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  for (const [k, v] of Object.entries(extraHeaders)) res.setHeader(k, v);
  res.status(status).json(body);
};

// Tiny in-memory rate limit: 30 req / IP / minute. Resets on cold start
// (good enough for a personal portfolio; upgrade to Upstash later if needed).
const hits = new Map();
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;

const rateLimit = (ip) => {
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, reset: now + WINDOW_MS };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + WINDOW_MS; }
  entry.count++;
  hits.set(ip, entry);
  return entry.count <= RATE_LIMIT;
};

const ICON_MAP = {
  "01d":"☀️","01n":"🌙","02d":"⛅","02n":"🌥","03d":"☁️","03n":"☁️",
  "04d":"☁️","04n":"☁️","09d":"🌧","09n":"🌧","10d":"🌦","10n":"🌧",
  "11d":"⛈","11n":"⛈","13d":"❄️","13n":"❄️","50d":"🌫","50n":"🌫",
};

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") return json(res, 204, {});
  if (req.method !== "GET") return json(res, 405, { error: "GET only" });

  const ip =
    (req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"]))
      ?.toString().split(",")[0].trim() || "anon";

  if (!rateLimit(ip)) {
    return json(res, 429, { error: "Too many requests, slow down." });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return json(res, 500, {
      error: "Server is missing OPENWEATHER_API_KEY. Add it in Vercel → Settings → Environment Variables.",
    });
  }

  const city = process.env.WEATHER_CITY || "Dhaka";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

  try {
    const upstream = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!upstream.ok) {
      return json(res, 502, {
        error: `OpenWeatherMap returned ${upstream.status}.`,
      });
    }
    const data = await upstream.json();
    if (!data || !data.main) {
      return json(res, 502, { error: "OpenWeatherMap returned no data." });
    }

    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = data.wind ? Math.round(data.wind.speed * 3.6) : null;
    const desc = data.weather?.[0]?.description ?? "";
    const iconCode = data.weather?.[0]?.icon ?? "";
    const icon = ICON_MAP[iconCode] || "🌡";

    return json(res, 200, {
      temp,
      feels,
      humidity,
      windSpeed,
      desc: desc.charAt(0).toUpperCase() + desc.slice(1),
      icon,
      city,
      fetchedAt: Date.now(),
    }, { "Cache-Control": "public, max-age=600, s-maxage=600" });
  } catch (e) {
    return json(res, 502, {
      error: `Weather upstream error: ${e?.message || e}`,
    });
  }
};