// =====================================================================
// api/chat.js — Vercel serverless function
// Proxies chat requests to OpenRouter so the API key never ships to the
// browser. Reads secrets from process.env, set in the Vercel dashboard.
//
// Env vars (set in Vercel → Project → Settings → Environment Variables):
//   OPENROUTER_API_KEY   required   your OpenRouter key (sk-or-v1-...)
//   OPENROUTER_MODEL     optional   default: meta-llama/llama-3.3-70b-instruct:free
//   OPENROUTER_REFERER   optional   your site URL (used for OpenRouter analytics)
//   OPENROUTER_TITLE     optional   your site name (used for OpenRouter analytics)
// =====================================================================

const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

// Sensible fallbacks if the free model is rate-limited / down.
const MODEL_FALLBACKS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat-v3-0324:free",
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-72b-instruct:free",
];

const DEFAULT_SYSTEM = [
  "You are Nexora, a concise, friendly AI assistant embedded in Bikash Talukder's personal portfolio site.",
  "Keep answers short (under 120 words) unless the user explicitly asks for detail.",
  "Use markdown only when it clearly helps (lists, code, links). Never use # headings.",
  "If you don't know, say so plainly. Do not invent facts about Bikash, his projects, or his stats.",
  "Bikash Talukder is the owner of this site. When asked about him, speak in the third person and only use information the user provides in the conversation.",
].join(" ");

// ---------- helpers ----------
const setCORS = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const json = (res, status, body) => {
  setCORS(res);
  res.status(status).json(body);
};

const readBody = async (req) => {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  // Fallback: stream raw
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
};

const callOpenRouter = async ({ apiKey, model, messages, referer, title, signal }) => {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": referer || "https://bikash-20.github.io",
      "X-Title": title || "Bikash Talukder | Portfolio",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 600,
      // We don't stream from the serverless side — keep it simple + resilient.
      stream: false,
    }),
  });
  const text = await r.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return { ok: r.ok, status: r.status, data };
};

// ---------- handler ----------
module.exports = async (req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") return json(res, 204, {});

  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return json(res, 500, {
      error: "Server is missing OPENROUTER_API_KEY. Add it in Vercel → Settings → Environment Variables.",
    });
  }

  let body;
  try { body = await readBody(req); }
  catch (e) { return json(res, 400, { error: "Invalid JSON body." }); }

  const userMessages = Array.isArray(body.messages) ? body.messages : [];
  if (!userMessages.length) {
    return json(res, 400, { error: "Body must include a non-empty `messages` array." });
  }

  // Sanitize: keep only role + content, drop anything weird, cap history.
  const cleaned = userMessages
    .filter((m) => m && (m.role === "user" || m.role === "assistant" || m.role === "system"))
    .map((m) => ({ role: m.role, content: String(m.content || "").slice(0, 4000) }))
    .slice(-20); // last 20 turns to stay under token limits

  const systemMsg = (typeof body.system === "string" && body.system.trim())
    ? body.system.trim().slice(0, 2000)
    : DEFAULT_SYSTEM;

  const messages = [{ role: "system", content: systemMsg }, ...cleaned];

  // Try primary model, then fallbacks on 429 / 5xx.
  const preferred = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const candidates = [preferred, ...MODEL_FALLBACKS.filter((m) => m !== preferred)];

  const referer = process.env.OPENROUTER_REFERER || (req.headers && (req.headers.referer || req.headers.origin));
  const title = process.env.OPENROUTER_TITLE;

  let lastError = null;
  for (const model of candidates) {
    try {
      const { ok, status, data } = await callOpenRouter({
        apiKey, model, messages, referer, title,
      });

      if (ok) {
        const reply =
          data?.choices?.[0]?.message?.content?.trim() ||
          data?.choices?.[0]?.text?.trim() ||
          "";
        if (reply) {
          return json(res, 200, { reply, model });
        }
        lastError = { status, data, model };
        // Empty reply → try next model.
        continue;
      }

      // Rate-limited or upstream error → try next model.
      if (status === 429 || status === 404 || status >= 500) {
        lastError = { status, data, model };
        continue;
      }

      // 4xx other than 404/429 → don't burn through fallbacks, fail fast.
      return json(res, status, {
        error: "Upstream error",
        status,
        model,
        detail: data?.error || data,
      });
    } catch (e) {
      lastError = { status: 0, data: { message: String(e && e.message || e) }, model };
      // network blip → try next
    }
  }

  return json(res, 502, {
    error: "All OpenRouter models failed.",
    lastError,
  });
};
