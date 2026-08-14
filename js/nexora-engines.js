// ===== MEMORY ENGINE (localStorage) =====
const MEMORY_KEY = 'bikash_chat_memory';
function saveMemory(userMsg, botReply) {
  try {
    const mem = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]');
    mem.push({ q: userMsg, a: botReply, t: Date.now() });
    if (mem.length > 10) mem.splice(0, mem.length - 10);
    localStorage.setItem(MEMORY_KEY, JSON.stringify(mem));
  } catch(e) {}
}
function getMemory() {
  try { return JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]'); }
  catch(e) { return []; }
}
function checkReturningUser() {
  const mem = getMemory();
  if (mem.length === 0) return null;
  const last = mem[mem.length - 1];
  const hours = (Date.now() - last.t) / 3600000;
  if (hours < 0.3) return null;
  const shortQ = last.q.length > 45 ? last.q.slice(0, 45) + '...' : last.q;
  return 'Welcome back! 👋 Last time you asked: <em>"' + shortQ + '"</em><br>Feel free to continue or ask something new. ✦';
}

// ===== INTENT DETECTOR =====
// ===== WEATHER ENGINE (live OpenWeatherMap) =====
async function weatherEngine() {
  // Use cached data if available (loaded by dashboard)
  if (window._weatherData) {
    const w = window._weatherData;
    return `${w.icon} <strong>Live Weather — Dhaka, Bangladesh</strong><br><br>🌡️ <strong>Temperature:</strong> ${w.temp}°C (Feels like ${w.feels}°C)<br>☁️ <strong>Condition:</strong> ${w.desc}<br>💧 <strong>Humidity:</strong> ${w.humidity}%<br>💨 <strong>Wind Speed:</strong> ${w.windSpeed} km/h<br><br><small style="opacity:0.5">⏱ Updated every 10 minutes · Source: OpenWeatherMap</small>`;
  }
  // Fresh fetch if cache not ready — go through our serverless proxy so
  // the OpenWeatherMap key never ships to the browser bundle.
  try {
    const r = await fetch('/api/weather');
    if (!r.ok) throw new Error('proxy ' + r.status);
    const d = await r.json();
    if (d && typeof d.temp === 'number') {
      const { temp, feels, humidity, windSpeed, desc, icon } = d;
      const descCap = desc.charAt(0).toUpperCase() + desc.slice(1);
      window._weatherData = { temp, feels, humidity, windSpeed, desc: descCap, icon };
      return `${icon} <strong>Live Weather — Dhaka, Bangladesh</strong><br><br>🌡️ <strong>Temperature:</strong> ${temp}°C (Feels like ${feels}°C)<br>☁️ <strong>Condition:</strong> ${descCap}<br>💧 <strong>Humidity:</strong> ${humidity}%<br>💨 <strong>Wind Speed:</strong> ${windSpeed} km/h<br><br><small style="opacity:0.5">⏱ Live data · Source: OpenWeatherMap (proxied) ✦</small>`;
    }
    return '🌡 Weather data is loading. Please check the dashboard card at the top of the page! ✦';
  } catch(e) {
    return '🌧 I tried to check Dhaka\'s sky but the weather station is unreachable right now. Check the dashboard for live weather! ✦';
  }
}

// ===== CALCULATOR ENGINE =====
function calcEngine(input) {
  const q = input.toLowerCase().trim();

  // Natural language → math expression
  let expr = q
    .replace(/what(\'?s| is)\s+/gi, '')
    .replace(/\bcalculate\b|\bcalc\b|\bcompute\b|\bsolve\b|\bevaluate\b/gi, '')
    .replace(/\bplus\b/g, '+').replace(/\bminus\b/g, '-')
    .replace(/\btimes\b|\bmultiplied by\b/g, '*')
    .replace(/\bdivided by\b/g, '/')
    .replace(/\bmod\b|\bmodulo\b/g, '%')
    .replace(/\bto the power of\b|\bpower\b|\^/g, '**')
    .replace(/\bsquared\b/g, '**2').replace(/\bcubed\b/g, '**3')
    .replace(/\bsquare root of\b|\bsqrt\b/gi, 'Math.sqrt')
    .replace(/\bsquare root\b/g, 'Math.sqrt')
    .replace(/\bsin\b/g, 'Math.sin').replace(/\bcos\b/g, 'Math.cos')
    .replace(/\btan\b/g, 'Math.tan').replace(/\blog\b/g, 'Math.log10')
    .replace(/\bln\b/g, 'Math.log').replace(/\babs\b/g, 'Math.abs')
    .replace(/\bpi\b/g, 'Math.PI').replace(/\be\b/g, 'Math.E')
    .trim();

  // Factorial
  const factMatch = expr.match(/(\d+)\s*!/);
  if (factMatch) {
    const n = parseInt(factMatch[1]);
    if (n > 20) return `🧮 ${n}! is astronomically large — too big to display simply!`;
    let f = 1; for (let i = 2; i <= n; i++) f *= i;
    return `🧮 ${factMatch[1]}! = <strong>${f.toLocaleString()}</strong>`;
  }

  // Percentage
  const pctMatch = q.match(/([\d\.]+)\s*%\s*of\s*([\d\.]+)/);
  if (pctMatch) {
    const result = (parseFloat(pctMatch[1]) / 100) * parseFloat(pctMatch[2]);
    return `🧮 ${pctMatch[1]}% of ${pctMatch[2]} = <strong>${+result.toFixed(6)}</strong>`;
  }

  // Try evaluating
  try {
    // Safety check — only allow safe characters
    if (/[a-zA-Z]/.test(expr.replace(/Math\.\w+/g, '').replace(/\bPI\b|\bE\b/g, ''))) {
      return null; // not a math expression
    }
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expr + ')')();
    if (typeof result !== 'number' || !isFinite(result)) {
      if (result === Infinity || expr.includes('/0')) return '🧮 Cannot divide by zero! ♾️';
      return null;
    }
    const clean = Number.isInteger(result) ? result.toLocaleString() : +result.toFixed(8);
    // Build a nice display
    const originalExpr = input.replace(/^(what(\'?s| is)|calculate|calc|compute|solve|evaluate)\s+/gi,'').trim();
    return `🧮 <strong>${originalExpr}</strong><br><br>= <span style="font-size:1.3em;font-weight:700;color:#9b4de8;">${clean}</span>`;
  } catch(e) {
    return null;
  }
}

// ===== UNIT CONVERTER =====
function convertEngine(input) {
  const q = input.toLowerCase();
  const num = parseFloat(q.match(/-?[\d\.]+/)?.[0]);
  if (isNaN(num)) return '📐 Please include a number, e.g. <em>"convert 100 km to miles"</em>';

  // Temperature
  if (/celsius.*fahrenheit|c.*to.*f\b/.test(q)) return `🌡️ ${num}°C = <strong>${+(num * 9/5 + 32).toFixed(2)}°F</strong>`;
  if (/fahrenheit.*celsius|f.*to.*c\b/.test(q)) return `🌡️ ${num}°F = <strong>${+((num - 32) * 5/9).toFixed(2)}°C</strong>`;
  if (/celsius.*kelvin|c.*to.*k\b/.test(q)) return `🌡️ ${num}°C = <strong>${+(num + 273.15).toFixed(2)} K</strong>`;
  if (/kelvin.*celsius|k.*to.*c\b/.test(q)) return `🌡️ ${num} K = <strong>${+(num - 273.15).toFixed(2)}°C</strong>`;

  // Length
  if (/km.*to.*miles|kilometers.*miles/.test(q)) return `📏 ${num} km = <strong>${+(num * 0.621371).toFixed(4)} miles</strong>`;
  if (/miles.*to.*km|miles.*kilometers/.test(q)) return `📏 ${num} miles = <strong>${+(num * 1.60934).toFixed(4)} km</strong>`;
  if (/meters.*to.*feet|m.*to.*ft/.test(q)) return `📏 ${num} m = <strong>${+(num * 3.28084).toFixed(4)} feet</strong>`;
  if (/feet.*to.*meters|ft.*to.*m/.test(q)) return `📏 ${num} feet = <strong>${+(num * 0.3048).toFixed(4)} m</strong>`;
  if (/cm.*to.*inches|centimeters.*inches/.test(q)) return `📏 ${num} cm = <strong>${+(num * 0.393701).toFixed(4)} inches</strong>`;
  if (/inches.*to.*cm|inches.*centimeters/.test(q)) return `📏 ${num} inches = <strong>${+(num * 2.54).toFixed(4)} cm</strong>`;
  if (/meters.*to.*km|m.*to.*km/.test(q)) return `📏 ${num} m = <strong>${+(num / 1000).toFixed(6)} km</strong>`;
  if (/km.*to.*meters/.test(q)) return `📏 ${num} km = <strong>${+(num * 1000)} m</strong>`;

  // Weight
  if (/kg.*to.*lbs|kilograms.*pounds/.test(q)) return `⚖️ ${num} kg = <strong>${+(num * 2.20462).toFixed(4)} lbs</strong>`;
  if (/lbs.*to.*kg|pounds.*kilograms/.test(q)) return `⚖️ ${num} lbs = <strong>${+(num * 0.453592).toFixed(4)} kg</strong>`;
  if (/grams.*to.*kg|g.*to.*kg/.test(q)) return `⚖️ ${num} g = <strong>${+(num / 1000).toFixed(6)} kg</strong>`;
  if (/kg.*to.*grams/.test(q)) return `⚖️ ${num} kg = <strong>${+(num * 1000)} g</strong>`;

  // Volume
  if (/liters.*to.*gallons|l.*to.*gal/.test(q)) return `💧 ${num} L = <strong>${+(num * 0.264172).toFixed(4)} gallons</strong>`;
  if (/gallons.*to.*liters|gal.*to.*l/.test(q)) return `💧 ${num} gallons = <strong>${+(num * 3.78541).toFixed(4)} L</strong>`;
  if (/ml.*to.*liters/.test(q)) return `💧 ${num} mL = <strong>${+(num / 1000).toFixed(6)} L</strong>`;
  if (/liters.*to.*ml/.test(q)) return `💧 ${num} L = <strong>${+(num * 1000)} mL</strong>`;

  // Data
  if (/mb.*to.*gb|megabytes.*gigabytes/.test(q)) return `💾 ${num} MB = <strong>${+(num / 1024).toFixed(4)} GB</strong>`;
  if (/gb.*to.*mb|gigabytes.*megabytes/.test(q)) return `💾 ${num} GB = <strong>${+(num * 1024).toFixed(0)} MB</strong>`;
  if (/gb.*to.*tb|gigabytes.*terabytes/.test(q)) return `💾 ${num} GB = <strong>${+(num / 1024).toFixed(6)} TB</strong>`;
  if (/tb.*to.*gb|terabytes.*gigabytes/.test(q)) return `💾 ${num} TB = <strong>${+(num * 1024).toFixed(0)} GB</strong>`;
  if (/kb.*to.*mb|kilobytes.*megabytes/.test(q)) return `💾 ${num} KB = <strong>${+(num / 1024).toFixed(4)} MB</strong>`;

  return `📐 I can convert: <strong>temperature</strong> (°C ↔ °F ↔ K), <strong>length</strong> (km ↔ miles, m ↔ feet, cm ↔ inches), <strong>weight</strong> (kg ↔ lbs), <strong>volume</strong> (L ↔ gallons, mL ↔ L), <strong>data</strong> (KB/MB/GB/TB)<br><br>Try: <em>"convert 100 km to miles"</em> or <em>"25 celsius to fahrenheit"</em> ✦`;
}

// ===== TIME ENGINE =====
function timeEngine() {
  const now = new Date();
  const dhakaTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dhakaDate = now.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const utcTime = now.toUTCString();
  return `🕐 <strong>Current Time (Bangladesh / Dhaka):</strong><br><br>🗓️ <strong>${dhakaDate}</strong><br>⏰ <strong>${dhakaTime}</strong> (UTC+6)<br><br><small style="opacity:0.5">UTC: ${utcTime}</small>`;
}

// ===== CURRENCY MAP =====
const currencyToCountry = {
  'USD':'us','BDT':'bd','INR':'in','EUR':'eu','GBP':'gb','CAD':'ca',
  'AUD':'au','JPY':'jp','SAR':'sa','AED':'ae','MYR':'my','SGD':'sg',
  'CNY':'cn','KRW':'kr','TRY':'tr','PKR':'pk','LKR':'lk','NZD':'nz',
  'CHF':'ch','SEK':'se','NOK':'no','DKK':'dk','THB':'th','IDR':'id',
  'PHP':'ph','VND':'vn','NGN':'ng','ZAR':'za','BRL':'br','MXN':'mx',
  'HKD':'hk','TWD':'tw','HUF':'hu','PLN':'pl','CZK':'cz','RUB':'ru',
  'UAH':'ua','ILS':'il','EGP':'eg','KWD':'kw','QAR':'qa','BHD':'bh',
};

// ===== CURRENCY ENGINE =====
async function currencyEngine(query) {
  const q = query.toUpperCase().replace(/\bCONVERT\b|\bWHAT IS\b|\bWHAT'S\b/g, '').trim();
  const match = q.match(/([\d,]+\.?\d*)\s*([A-Z]{3})\s*(?:TO|IN)\s*([A-Z]{3})/);
  if (!match) return null;
  const amount = parseFloat(match[1].replace(/,/g, ''));
  const from = match[2], to = match[3];
  const apiKey = '5aa034605bf8e975f6a2e96c';
  try {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const d = await r.json();
    if (d.result === 'success') {
      const res = d.conversion_result.toFixed(2);
      const rate = d.conversion_rate.toFixed(6);
      const fromFlag = currencyToCountry[from] || 'un';
      const toFlag   = currencyToCountry[to]   || 'un';
      return `
💱 <strong>Live Currency Conversion</strong><br>
<div class="currency-card">
  <img src="https://flagcdn.com/w40/${fromFlag}.png" class="flag-img" onerror="this.style.display='none'">
  <div class="currency-info"><strong>${amount.toLocaleString()} ${from}</strong></div>
  <span style="color:var(--gold);font-size:1.2rem;">→</span>
  <img src="https://flagcdn.com/w40/${toFlag}.png" class="flag-img" onerror="this.style.display='none'">
  <div class="currency-info"><strong>${parseFloat(res).toLocaleString()} ${to}</strong></div>
</div>
<small style="color:rgba(240,242,245,0.4);font-size:11px;">Rate: 1 ${from} = ${rate} ${to} · Live via ExchangeRate-API</small>`;
    }
    return `⚠️ Currency code not recognised. Try: <em>"100 USD to BDT"</em> or <em>"50 EUR to GBP"</em>`;
  } catch(e) {
    return `⚠️ Couldn't reach the exchange office right now. Please try again in a moment.`;
  }
}

// ===== PASSWORD STRENGTH ENGINE =====
function passwordEngine(input) {
  const q = input.toLowerCase();
  const pwMatch = input.match(/(?:check|analyze|analyse|strength of|test|rate)\s+(?:this\s+)?(?:password[:\s]+)?["']?([^\s"']+)["']?/i)
    || input.match(/password[:\s]+["']?([^\s"']+)["']?/i)
    || input.match(/["']([^"']{4,})["']/);
  if (!pwMatch) return `🔐 To check a password, type: <em>"check password YourPassword123!"</em> or <em>"how strong is MyPass@99"</em>`;
  const pw = pwMatch[1];
  let score = 0;
  const checks = {
    length8:   pw.length >= 8,
    length12:  pw.length >= 12,
    uppercase: /[A-Z]/.test(pw),
    number:    /[0-9]/.test(pw),
    special:   /[^A-Za-z0-9]/.test(pw),
  };
  if (checks.length8)   score++;
  if (checks.length12)  score++;
  if (checks.uppercase) score++;
  if (checks.number)    score++;
  if (checks.special)   score++;
  const levels   = ['Very Weak','Weak','Fair','Good','Strong','Very Strong'];
  const colors   = ['#ef4444','#f97316','#eab308','#84cc16','#22c55e','#10b981'];
  const widths   = ['10%','25%','45%','65%','82%','100%'];
  const level    = levels[score];
  const color    = colors[score];
  const width    = widths[score];
  const tips = [];
  if (!checks.length8)   tips.push('Use at least 8 characters');
  if (!checks.length12)  tips.push('12+ characters is ideal');
  if (!checks.uppercase) tips.push('Add uppercase letters');
  if (!checks.number)    tips.push('Include numbers');
  if (!checks.special)   tips.push('Add special chars (!@#$%)');
  return `🔐 <strong>Password Analysis</strong><br>
<div class="pw-card">
  <div style="font-size:12px;color:rgba(240,242,245,0.5);">Password: <code style="color:var(--gold);">${'*'.repeat(Math.min(pw.length, 20))}</code> (${pw.length} chars)</div>
  <div style="display:flex;align-items:center;gap:10px;margin-top:4px;">
    <div class="pw-bar-track" style="flex:1"><div class="pw-bar-fill" style="width:${width};background:${color};"></div></div>
    <strong style="color:${color};font-size:13px;min-width:80px;">${level}</strong>
  </div>
  <div class="pw-criteria">
    <span class="${checks.length8?'pw-ok':'pw-no'}">${checks.length8?'✓':'✗'} 8+ chars</span>
    <span class="${checks.length12?'pw-ok':'pw-no'}">${checks.length12?'✓':'✗'} 12+ chars</span>
    <span class="${checks.uppercase?'pw-ok':'pw-no'}">${checks.uppercase?'✓':'✗'} Uppercase</span>
    <span class="${checks.number?'pw-ok':'pw-no'}">${checks.number?'✓':'✗'} Number</span>
    <span class="${checks.special?'pw-ok':'pw-no'}">${checks.special?'✓':'✗'} Special char</span>
  </div>
  ${tips.length ? '<div style="font-size:11px;color:rgba(240,242,245,0.45);margin-top:6px;">💡 ' + tips.join(' · ') + '</div>' : '<div style="font-size:11px;color:#10b981;margin-top:6px;">✅ Excellent password!</div>'}
</div>`;
}

// ===== WORD & CHARACTER COUNTER =====
function wordCountEngine(input) {
  // Strip the command, keep the text to count
  const stripped = input
    .replace(/^(count|how many|word count|char count|character count|analyze|analyse|text stats|stats for|words in|characters in)[:\s]*/i, '')
    .replace(/^(this|the following)[:\s]*/i, '')
    .trim();
  if (stripped.length < 2) return `📝 To count, type: <em>"count: Your text goes here"</em> or <em>"how many words: Once upon a time..."</em>`;
  const words    = stripped.trim().split(/\s+/).filter(w => w.length > 0).length;
  const chars    = stripped.length;
  const charsNoSpace = stripped.replace(/\s/g, '').length;
  const sentences = stripped.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = stripped.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const readMins = Math.max(1, Math.ceil(words / 200));
  return `📝 <strong>Text Analysis</strong><br>
<div class="wc-card">
  <div class="wc-stat"><div class="wc-num">${words.toLocaleString()}</div><div class="wc-label">Words</div></div>
  <div class="wc-stat"><div class="wc-num">${chars.toLocaleString()}</div><div class="wc-label">Characters</div></div>
  <div class="wc-stat"><div class="wc-num">${charsNoSpace.toLocaleString()}</div><div class="wc-label">No spaces</div></div>
  <div class="wc-stat"><div class="wc-num">${sentences}</div><div class="wc-label">Sentences</div></div>
  <div class="wc-stat"><div class="wc-num">~${readMins}m</div><div class="wc-label">Read time</div></div>
</div>
<small style="color:rgba(240,242,245,0.4);font-size:11px;">Tip: Twitter limit = 280 chars · SMS = 160 · Email subject = 60</small>`;
}
