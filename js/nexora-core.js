// ===== MAIN SEND MESSAGE (CLEAN RAG ROUTER) =====
// ===== NEXORA AI (OpenRouter via Vercel /api/chat) =====
// NEXORA_API_URL must be the ABSOLUTE production URL of the Vercel
// project that actually serves /api/chat. We set it at build-time via
// a <meta name="nexora-api-url"> tag (which you can override in HTML)
// and fall back to the live Vercel project URL.
const NEXORA_API_URL = (document.querySelector('meta[name="nexora-api-url"]')||{}).content
  || 'https://my-portfolio-project-rho-six.vercel.app/api/chat';

// ===== STREAMING STORAGE =====
// While streaming, we hold the active AbortController + the accumulator +
// the live bubble element so the Stop button can cancel and so the bubble
// can be progressively filled in.
let currentAbort = null;
let currentStream = null; // { bubbles: [{el, text}], finishReason, model }

// Streaming chat: sends to /api/chat?stream=1 with body.stream=true.
// Parses SSE `data: {...}` events. Calls onDelta(partial, finishReason|null)
// for each delta event; calls onDone({ok, reply, model, error}) at the end
// (success, abort, or error — exactly once).
function askNexoraAIStream(history, { onDelta, onDone, signal }) {
  const url = NEXORA_API_URL + (NEXORA_API_URL.includes('?') ? '&' : '?') + 'stream=1';
  const controller = new AbortController();
  // 60s timeout — streaming can be slow on first hit + cold start.
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  // If the caller passed their own signal, fan out its abort.
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  currentAbort = controller;

  let acc = "";
  let model = null;
  let settled = false;

  const finish = (payload) => {
    if (settled) return;
    settled = true;
    clearTimeout(timeoutId);
    currentAbort = null;
    currentStream = null;
    try { onDone(payload); } catch (e) { console.warn('[Nexora] onDone threw:', e); }
  };

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
    body: JSON.stringify({ messages: history, stream: true }),
    signal: controller.signal,
  }).then(async (r) => {
    if (!r.ok || !r.body) {
      let detail = '';
      try { detail = (await r.text()).slice(0, 500); } catch {}
      finish({ ok: false, error: `HTTP ${r.status}: ${detail || 'no body'}`, status: r.status });
      return;
    }
    const reader = r.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const rawEvent = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        for (const line of rawEvent.split('\n')) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          const payload = t.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;
          let parsed;
          try { parsed = JSON.parse(payload); } catch { continue; }
          if (parsed.model && !model) model = parsed.model;
          if (parsed.error) {
            finish({ ok: false, error: parsed.error, status: parsed.status || 0 });
            return;
          }
          if (typeof parsed.delta === 'string' && parsed.delta.length) {
            acc += parsed.delta;
            try { onDelta(acc, parsed.finishReason || null); }
            catch (e) { console.warn('[Nexora] onDelta threw:', e); }
            if (parsed.finishReason) {
              finish({ ok: true, reply: acc, model, finishReason: parsed.finishReason });
              return;
            }
          } else if (parsed.finishReason) {
            finish({ ok: true, reply: acc, model, finishReason: parsed.finishReason });
            return;
          }
        }
      }
    }
    // Stream ended without an explicit finishReason — treat as done.
    finish({ ok: true, reply: acc, model, finishReason: 'stop' });
  }).catch((e) => {
    if (e && e.name === 'AbortError') {
      finish({ ok: false, aborted: true, reply: acc, error: 'aborted', model });
    } else {
      finish({ ok: false, error: `Network error: ${e && e.message || e}`, reply: acc, model });
    }
  });
}

// Legacy non-streaming call. Kept as a fallback for callers that don't want
// streaming (and for tools that expect a single resolved value).
async function askNexoraAI(history) {
  // 25s timeout — Vercel cold start + free OpenRouter models can be slow on first hit.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);
  try {
    const r = await fetch(NEXORA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    let data = null;
    try { data = await r.json(); } catch (_) { /* non-JSON body */ }

    if (r.ok && data && data.reply) {
      return { ok: true, reply: data.reply, model: data.model || null };
    }

    // Surface the real reason in the console so we can debug.
    const errMsg = (data && (data.error || data.detail)) || `HTTP ${r.status}`;
    console.warn('[Nexora] /api/chat failed:', r.status, data);
    return { ok: false, reply: null, error: errMsg, status: r.status };
  } catch (e) {
    clearTimeout(timeoutId);
    const msg = (e && e.name === 'AbortError')
      ? 'Nexora timed out after 25s. The free model may be busy or the server is cold-starting — try again in a moment.'
      : `Network error: ${e && e.message || e}`;
    console.warn('[Nexora] fetch error:', msg);
    return { ok: false, reply: null, error: msg, status: 0, debug: { url: NEXORA_API_URL } };
  }
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  chatSend.disabled = true;
  quickBtns.style.display = 'none';

  addMsg('user', text);
  chatHistory.push({ role: 'user', content: text });
  showTyping();

  const intent = detectIntent(text);

  // The AI path (no typed intent matched) is handled separately so it can
  // stream token-by-token. Everything else uses the legacy engine pipeline.
  if (intent !== 'persona') {
    let reply = '';
    try {
      if (intent === 'currency') {
        reply = await currencyEngine(text);
        if (!reply) reply = convertEngine(text); // fallback to unit converter
      } else if (intent === 'calc') {
        await new Promise(res => setTimeout(res, 280));
        reply = calcEngine(text);
        if (!reply) reply = generateSmartReply(text);
      } else if (intent === 'convert') {
        await new Promise(res => setTimeout(res, 280));
        reply = convertEngine(text);
      } else if (intent === 'convo') {
        await new Promise(res => setTimeout(res, 500 + Math.random() * 300));
        reply = convoEngine(text);
      } else if (intent === 'password') {
        await new Promise(res => setTimeout(res, 400));
        reply = passwordEngine(text);
      } else if (intent === 'wordcount') {
        await new Promise(res => setTimeout(res, 280));
        reply = wordCountEngine(text);
      } else if (intent === 'time') {
        await new Promise(res => setTimeout(res, 200));
        reply = timeEngine();
      } else if (intent === 'medical') {
        reply = await fetchMedical(text);
      } else if (intent === 'technews') {
        reply = await fetchTechNews(text);
      }
    } catch(err) {
      reply = "⚠️ Something went wrong. Please try again!";
    }
    removeTyping();
    addMsg('bot', reply);
    chatHistory.push({ role: 'assistant', content: reply });
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
    saveMemory(text, reply.replace(/<[^>]+>/g, '').slice(0, 100));
    chatSend.disabled = false;
    return;
  }

  // ── AI path: streaming via /api/chat?stream=1 ───────────────────
  removeTyping();
  const bot = addMsg('bot', null); // empty bubble for streaming
  showStopButton();
  let lastAcc = '';
  try {
    const history = chatHistory.slice(-12).map(m => ({ role: m.role, content: m.content }));
    await new Promise((resolve) => {
      askNexoraAIStream(history, {
        onDelta(partial /* , finishReason */) {
          lastAcc = partial;
          bot.setText(partial);
        },
        onDone(result) {
          // Fall back to a local reply if the AI failed outright (no abort).
          if (!result || !result.ok) {
            if (result && result.aborted) {
              bot.markStopped();
              // Keep partial text visible — don't finalize the HTML render,
              // because the AI response was incomplete.
              chatHistory.push({ role: 'assistant', content: lastAcc });
              hideStopButton();
              chatSend.disabled = false;
              resolve();
              return;
            }
            const why = (result && result.error) || 'unknown error';
            console.warn('[Nexora] falling back to local reply. Reason:', why);
            const local = generateSmartReply(text);
            const fallbackHTML = `${local}<div class="ai-debug" style="margin-top:8px;font-size:11px;opacity:.55;border-top:1px dashed rgba(255,255,255,.15);padding-top:6px;">⚠ AI offline — ${why}</div>`;
            bot.finalize(fallbackHTML);
            chatHistory.push({ role: 'assistant', content: local });
            saveMemory(text, local.replace(/<[^>]+>/g, '').slice(0, 100));
            hideStopButton();
            chatSend.disabled = false;
            resolve();
            return;
          }
          // Success: convert accumulated plain text → markdown → sanitized HTML
          // → highlight.js + KaTeX post-render.
          const plain = result.reply || '';
          const html = renderMarkdownToSafeHTML(plain);
          bot.finalize(html);
          chatHistory.push({ role: 'assistant', content: html });
          if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
          saveMemory(text, plain.slice(0, 100));
          hideStopButton();
          chatSend.disabled = false;
          resolve();
        },
      });
    });
  } catch (err) {
    console.warn('[Nexora] sendMessage outer error:', err);
    bot.setText('⚠️ Something went wrong. Please try again!');
    hideStopButton();
    chatSend.disabled = false;
  }
}

// ===== MARKDOWN / CODE / MATH RENDER (post-stream pass) =====
// `renderMarkdownToSafeHTML(plain)` takes the accumulated plain-text reply
// from the AI and converts it to safe, rich HTML:
//   1. marked → HTML (markdown)
//   2. DOMPurify → strip anything dangerous
//   3. <code> blocks → hljs.highlightElement (only if hljs is loaded)
//   4. KaTeX renderMathInElement (only if KaTeX is loaded)
// If the helper libraries fail to load (CDN blocked, offline, etc.) we fall
// back to a plain-text-with-newlines render so the UI never breaks.
function renderMarkdownToSafeHTML(plain) {
  let safePlain = String(plain == null ? '' : plain);
  if (typeof window.marked === 'function' && typeof window.DOMPurify === 'object') {
    try {
      // Configure marked: GitHub-style, but disable its own escaping — we
      // pass everything through DOMPurify anyway.
      if (typeof window.marked.setOptions === 'function') {
        window.marked.setOptions({ breaks: true, gfm: true });
      }
      // ---- 0. Convert Python-style docstring fences ('''python ... ''') into
      // standard markdown fences so marked produces a real <pre><code>.
      // The free-tier Llama 3.3 model occasionally emits this idiom instead
      // of proper ``` fences.
      safePlain = safePlain.replace(
        /(?:^|\n)'''([a-zA-Z+#-]*)\n([\s\S]*?)\n'''/g,
        (_, lang, code) => '\n```' + (lang || '') + '\n' + code + '\n```\n'
      );
      const raw = window.marked.parse(safePlain);
      const clean = window.DOMPurify.sanitize(raw, {
        ADD_ATTR: ['target', 'rel'],
        ADD_TAGS: ['span', 'div'], // KaTeX injects these
      });
      // We need to run hljs + KaTeX on a DOM node (they walk the live tree),
      // so we parse the sanitized string into a fragment, run them, then
      // serialize back to HTML.
      const tpl = document.createElement('template');
      tpl.innerHTML = clean;

      // ---- 1. Mark code blocks that are missing a `language-*` hint.
      // The AI sometimes opens a "code block" with Python-style docstring
      // delimiters ('''python ... ''') or with plain ``` and no language;
      // marked already wrapped those in <pre><code>, but the <code> element
      // has no class so hljs cannot auto-detect. Tag every such block with
      // a generic "language-text" so hljs still paints token classes.
      tpl.content.querySelectorAll('pre code').forEach((codeEl) => {
        if (!codeEl.className || !/language-|^hljs$/.test(codeEl.className)) {
          codeEl.classList.add('language-text');
        }
        // Ensure the parent <pre> has the hljs host class so the theme's
        // background applies (atom-one-dark targets `.hljs`).
        const pre = codeEl.parentElement;
        if (pre && !pre.classList.contains('hljs')) pre.classList.add('hljs');
      });

      // ---- 2. Highlight with hljs. If hljs isn't loaded yet (the bundle is
      // heavy and the streaming reply can complete before defer scripts run),
      // wait up to ~2s for it to show up, then continue. This avoids the
      // "everything is plain white" symptom users see on first reply.
      const tryHighlight = () => {
        if (window.hljs && typeof window.hljs.highlightElement === 'function') {
          tpl.content.querySelectorAll('pre code').forEach((el) => {
            try { window.hljs.highlightElement(el); } catch {}
          });
          return true;
        }
        return false;
      };
      if (!tryHighlight()) {
        let waited = 0;
        const wait = setInterval(() => {
          waited += 100;
          if (tryHighlight() || waited >= 2000) clearInterval(wait);
        }, 100);
      }

      if (window.renderMathInElement) {
        try {
          window.renderMathInElement(tpl.content, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\[', right: '\\]', display: true },
              { left: '\\(', right: '\\)', display: false },
            ],
            throwOnError: false,
          });
        } catch {}
      }
      return tpl.innerHTML;
    } catch (e) {
      console.warn('[Nexora] markdown render failed:', e);
      // fall through to plain-text fallback
    }
  }
  // Fallback: preserve newlines as <br>, escape HTML, no rich formatting.
  return safePlain
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

// ===== DEBUG FLAG =====
// Append ?debug=1 to the URL to log intent + engine choices to the console.
const NEXORA_DEBUG = /[?&]debug=1\b/.test(location.search);
if (NEXORA_DEBUG) {
  // Hook into the engine chain by patching addMsg to log every bot reply
  // length, and stashing the last intent on window for inspection.
  const _addMsg = addMsg;
  addMsg = function(role, text) {
    if (role === 'bot') {
      console.groupCollapsed('%c[Nexora:debug] bot reply', 'color:#c9a84c');
      console.log('chars:', text.length, '| preview:', text.slice(0, 120).replace(/<[^>]+>/g, ''));
      console.groupEnd();
    }
    return _addMsg(role, text);
  };
  window.__nexoraDebug = true;
  console.log('%c[Nexora:debug] mode on — every bot reply will be logged to the console.', 'color:#c9a84c');
}
