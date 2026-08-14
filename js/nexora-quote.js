

// ===== DEV QUOTE =====
const fallbackQuotes = [
  {"q":"First, solve the problem. Then, write the code.","a":"John Johnson"},
  {"q":"Simplicity is the soul of efficiency.","a":"Austin Freeman"},
  {"q":"Code is like humor. When you have to explain it, it\'s bad.","a":"Cory House"},
  {"q":"In order to be irreplaceable, one must always be different.","a":"Coco Chanel"},
  {"q":"The best way to predict the future is to invent it.","a":"Alan Kay"},
];
async function loadQuote() {
  let q, a;
  try {
    const r = await fetch('https://programming-quotesapi.vercel.app/api/random');
    const d = await r.json();
    q = d.quote; a = d.author;
  } catch(e) {
    const fb = fallbackQuotes[Math.floor(Math.random()*fallbackQuotes.length)];
    q = fb.q; a = fb.a;
  }
  document.getElementById('devQuote').innerHTML = '&ldquo;' + q + '&rdquo;<br><small style="font-style:normal;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-family:\'Manrope\',sans-serif;font-weight:700;">— ' + a + '</small>';
}
loadQuote();
