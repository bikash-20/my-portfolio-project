// ===== LEETCODE (live count) =====
// Fetches total solved problems for the user via LeetCode's public GraphQL API.
// Falls back to a community API if GraphQL fails. Renders into <div id="lcSolved">.

const LC_USERNAME = 'bikashtalukder';
const LC_GRAPHQL_URL = 'https://leetcode.com/graphql/';
const LC_FALLBACK_URL = 'https://alfa-leetcode-api.onrender.com/'; // community alternative
const LC_PROFILE_URL = `https://leetcode.com/${LC_USERNAME}/`;

async function loadLeetCode() {
  const el = document.getElementById('lcSolved');
  if (!el) return;

  // 1) Primary path — LeetCode GraphQL.
  // LeetCode's GraphQL is browser-friendly with these headers, but it can be flaky
  // (CORS, anti-bot, profile-private). We treat any non-2xx or missing data as failure.
  try {
    const query = {
      query: `query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum { difficulty count }
          }
        }
      }`,
      variables: { username: LC_USERNAME },
    };
    const res = await fetch(LC_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // These two headers dramatically increase success rate from a browser context.
        'Referer': LC_PROFILE_URL,
        'Origin': 'https://leetcode.com',
      },
      body: JSON.stringify(query),
    });
    if (res.ok) {
      const data = await res.json();
      const stats = data?.data?.matchedUser?.submitStats?.acSubmissionNum;
      if (Array.isArray(stats)) {
        const total = stats.find(s => s.difficulty === 'All');
        if (total && typeof total.count === 'number') {
          el.textContent = total.count + ' solved';
          console.log('[LC] GraphQL ok:', total.count);
          return;
        }
      }
      console.warn('[LC] GraphQL returned unexpected shape:', data);
    } else {
      console.warn('[LC] GraphQL HTTP', res.status);
    }
  } catch (e) {
    console.warn('[LC] GraphQL failed:', e && e.message);
  }

  // 2) Fallback path — community API (alfa-leetcode-api). Different host, no auth.
  try {
    const r = await fetch(LC_FALLBACK_URL + LC_USERNAME, { cache: 'no-store' });
    if (r.ok) {
      const d = await r.json();
      // alfa-leetcode-api returns { totalSolved, easySolved, mediumSolved, hardSolved, ... }
      const n = (d && (d.totalSolved ?? d.totalSolvedCount ?? d.solvedProblem));
      if (typeof n === 'number') {
        el.textContent = n + ' solved';
        console.log('[LC] fallback ok:', n);
        return;
      }
      console.warn('[LC] fallback returned unexpected shape:', d);
    } else {
      console.warn('[LC] fallback HTTP', r.status);
    }
  } catch (e) {
    console.warn('[LC] fallback failed:', e && e.message);
  }

  // 3) Both APIs failed — show a static, useful label instead of a stale number.
  el.textContent = 'LC Profile';
  console.warn('[LC] all sources failed; showing fallback label.');
}

// Initial load and periodic refresh every 5 minutes
loadLeetCode();
setInterval(loadLeetCode, 5 * 60 * 1000);
