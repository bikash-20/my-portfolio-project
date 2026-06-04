// ===== LEETCODE (live count) =====
// This script fetches the total solved problems for the user using LeetCode's public GraphQL API.
// It falls back to the unofficial stats API if the GraphQL request fails.

async function loadLeetCode() {
  const el = document.getElementById('lcSolved');
  if (!el) return;
  try {
    // Attempt to use LeetCode GraphQL endpoint
    const query = {
      query: `query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }`,
      variables: { username: 'bikashtalukder' }
    };
    const res = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(query)
    });
    const data = await res.json();
    if (data && data.data && data.data.matchedUser && data.data.matchedUser.submitStats) {
      const stats = data.data.matchedUser.submitStats.acSubmissionNum;
      // Find the total count (difficulty "All")
      const total = stats.find(s => s.difficulty === 'All');
      if (total && typeof total.count === 'number') {
        el.textContent = total.count + ' solved';
        return;
      }
    }
  } catch (_) {
    // ignore and fallback
  }
  // Fallback to unofficial stats API
  try {
    const r = await fetch('https://leetcode-stats-api.herokuapp.com/bikashtalukder');
    const d = await r.json();
    if (d && d.totalSolved !== undefined) {
      el.textContent = d.totalSolved + ' solved';
    } else {
      el.textContent = 'LC Profile';
    }
  } catch (e) {
    el.textContent = 'LC Profile';
  }
}

// Initial load and periodic refresh every 5 minutes
loadLeetCode();
setInterval(loadLeetCode, 5 * 60 * 1000);
