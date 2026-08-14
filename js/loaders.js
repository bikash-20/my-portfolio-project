
// ===== LOCAL TIME =====
function updateTime() {
  const now = new Date();
  const opts = { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  const dateOpts = { timeZone: 'Asia/Dhaka', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('localTime').textContent = now.toLocaleTimeString('en-US', opts);
  document.getElementById('localDate').textContent = now.toLocaleDateString('en-US', dateOpts);
}
updateTime();
setInterval(updateTime, 1000);

// ===== GITHUB =====
async function loadGitHub() {
  try {
    const r = await fetch('https://api.github.com/users/bikash-20');
    const d = await r.json();
    document.getElementById('ghRepos').textContent = (d.public_repos || '—') + ' repos';
  } catch(e) { document.getElementById('ghRepos').textContent = 'github.com/bikash-20'; }
}
loadGitHub();

// ===== CODEFORCES =====
async function loadCF() {
  try {
    const r = await fetch('https://codeforces.com/api/user.info?handles=talukder_20');
    const d = await r.json();
    if (d.status === 'OK') {
      const u = d.result[0];
      document.getElementById('cfRating').textContent = (u.rating || 'Unrated') + (u.rank ? ' · ' + u.rank : '');
    }
  } catch(e) { document.getElementById('cfRating').textContent = 'CF Profile'; }
}
loadCF();

// ===== LEETCODE (via unofficial stats API) =====

