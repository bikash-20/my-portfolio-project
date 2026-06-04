// ===== LIVE WEATHER (OpenWeatherMap) =====
async function loadWeather() {
  try {
    const r = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Dhaka&units=metric&appid=1926c1f86c487b32de625363a6372de0');
    const d = await r.json();
    if (d.main) {
      const temp = Math.round(d.main.temp);
      const feels = Math.round(d.main.feels_like);
      const humidity = d.main.humidity;
      const windSpeed = d.wind ? Math.round(d.wind.speed * 3.6) : '—';
      const desc = d.weather[0].description;
      const iconMap = { '01d':'☀️','01n':'🌙','02d':'⛅','02n':'🌥','03d':'☁️','03n':'☁️','04d':'☁️','04n':'☁️','09d':'🌧','09n':'🌧','10d':'🌦','10n':'🌧','11d':'⛈','11n':'⛈','13d':'❄️','13n':'❄️','50d':'🌫','50n':'🌫' };
      const ic = d.weather[0].icon;
      const icon = iconMap[ic] || '🌡';
      document.getElementById('weatherTemp').textContent = temp + '°C';
      document.getElementById('weatherDesc').textContent = icon + ' ' + desc.charAt(0).toUpperCase() + desc.slice(1) + ' · Feels ' + feels + '°C · 💧 ' + humidity + '% · 💨 ' + windSpeed + 'km/h';
      const iconEl = document.querySelector('#weatherCard .dash-icon');
      if (iconEl) iconEl.textContent = icon;
      // Store globally for Nexora chat
      window._weatherData = { temp, feels, humidity, windSpeed, desc: desc.charAt(0).toUpperCase() + desc.slice(1), icon };
    } else {
      document.getElementById('weatherTemp').textContent = 'N/A';
      document.getElementById('weatherDesc').textContent = 'API key activating — try again in a few minutes';
    }
  } catch(e) {
    document.getElementById('weatherTemp').textContent = '—';
    document.getElementById('weatherDesc').textContent = 'Weather unavailable';
  }
}
loadWeather();
setInterval(loadWeather, 10 * 60 * 1000);
