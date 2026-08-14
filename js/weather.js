// ===== LIVE WEATHER (proxied via /api/weather) =====
// The OpenWeatherMap key lives in the serverless function now, so we never
// ship a secret to the browser.
async function loadWeather() {
  try {
    const r = await fetch("/api/weather", { cache: "no-store" });
    const d = await r.json();

    if (!r.ok || d.error) {
      console.warn("[weather] /api/weather error:", d.error);
      document.getElementById("weatherTemp").textContent = "—";
      document.getElementById("weatherDesc").textContent = "Weather unavailable";
      return;
    }

    document.getElementById("weatherTemp").textContent = d.temp + "°C";
    document.getElementById("weatherDesc").textContent =
      `${d.icon} ${d.desc} · Feels ${d.feels}°C · 💧 ${d.humidity}%` +
      (d.windSpeed != null ? ` · 💨 ${d.windSpeed}km/h` : "");

    const iconEl = document.querySelector("#weatherCard .dash-icon");
    if (iconEl) iconEl.textContent = d.icon;

    // Stash for the Nexora chat if it ever wants to reference it.
    window._weatherData = d;
  } catch (e) {
    console.warn("[weather] fetch failed:", e && e.message);
    document.getElementById("weatherTemp").textContent = "—";
    document.getElementById("weatherDesc").textContent = "Weather unavailable";
  }
}
loadWeather();
setInterval(loadWeather, 10 * 60 * 1000);
