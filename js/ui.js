
// Cursor
const cur=document.getElementById('cur'),curR=document.getElementById('curR');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{ mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'; });
(function loop(){ rx+=(mx-rx)*.12;ry+=(my-ry)*.12;curR.style.left=rx+'px';curR.style.top=ry+'px';requestAnimationFrame(loop); })();
document.querySelectorAll('a,button,.skill-pill,.proj-card,.res-card,.c-link').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ cur.style.width='16px';cur.style.height='16px';cur.style.background='#a07830';curR.style.width='46px';curR.style.height='46px'; });
  el.addEventListener('mouseleave',()=>{ cur.style.width='8px';cur.style.height='8px';cur.style.background='var(--gold)';curR.style.width='30px';curR.style.height='30px'; });
});

// Skill bars — watch each one individually
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('on');
    }
  });
}, {threshold: 0.15});
document.querySelectorAll('.sb-fill').forEach((el) => barObserver.observe(el));

// Typing effect
const words = [
  "build efficient algorithms.",
  "solve challenging problems.",
  "write modern C++ code.",
  "craft clean Python solutions.",
  "explore the depths of algorithms.",
  "pursue AI research goals.",
  "turn ideas into code.",
  "design intelligent systems.",
  "optimize performance-critical code.",
  "tinker with Arduino & robotics.",
  "learn something new every day.",
  "bridge hardware and software.",
  "dream in data structures."
];
let wi=0, ci=0, deleting=false;
const typedEl = document.getElementById('typed');

function type(){
  const word = words[wi];
  if(!deleting){
    typedEl.textContent = word.slice(0, ci+1);
    ci++;
    if(ci === word.length){
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typedEl.textContent = word.slice(0, ci-1);
    ci--;
    if(ci === 0){
      deleting = false;
      wi = (wi+1) % words.length;
    }
  }
  setTimeout(type, deleting ? 45 : 90);
}
type();

// Active nav
document.querySelectorAll('section[id]').forEach(sec=>{
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        document.querySelectorAll('nav a').forEach(a=>{
          const active = a.getAttribute('href')==='#'+sec.id;
          a.style.color = active ? 'var(--gold)' : '';
          a.style.borderColor = active ? 'var(--gold)' : '';
          a.style.background = active ? 'rgba(201,168,76,0.12)' : '';
        });
      }
    });
  }, {threshold:0.3});
});


// Sync --w on each .sb-fill with the visible .sb-pct text
// (single source of truth: the percentage label)
document.querySelectorAll('.sb-row').forEach(row => {
  const pct = row.querySelector('.sb-pct');
  const fill = row.querySelector('.sb-fill');
  if (!pct || !fill) return;
  const m = (pct.textContent || '').match(/(\d+)\s*%/);
  if (m) fill.style.setProperty('--w', m[1] + '%');
});

// Hide custom cursor while the user is selecting text so it doesn't snap
// across the highlight. Falls back to native cursor on touch devices.
let selecting = false;
document.addEventListener('selectionchange', () => {
  const sel = String(document.getSelection() || '');
  const now = sel.length > 0;
  if (now !== selecting) {
    selecting = now;
    document.body.classList.toggle('is-selecting', selecting);
  }
});
