// Shared behaviour for every page: theme toggle, toasts, copy email,
// scroll reveals, the growing vine and gentle tilt on images.
const root = document.documentElement;
const motionOK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');
if (motionOK) root.classList.add('motion');

/* toast */
const toastEl = document.getElementById('toast');
let toastTimer;
export function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

/* theme toggle: follows the system until clicked */
const themeBtn = document.getElementById('themeBtn');
const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
const labelTheme = () => themeBtn?.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to low-power dark mode');
labelTheme();
themeBtn?.addEventListener('click', () => {
  root.dataset.theme = isDark() ? 'light' : 'dark';
  try { localStorage.setItem('tk-theme', root.dataset.theme); } catch (e) {}
  labelTheme();
  toast(isDark() ? 'Dark mode on 🌙' : 'Light mode on ☀️');
});

/* carry the theme to the next page (backup for when storage is blocked) */
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (/^(https?:|mailto:|tel:|#)/.test(href) || a.hasAttribute('download') || /\.(pdf|mp4|webp)$/.test(href)) return;
  a.setAttribute('href', `${href.split('#')[0]}#theme-${root.dataset.theme || 'light'}`);
});

/* read more / show less */
document.querySelectorAll('.readmore').forEach((btn) => {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  const lbl = btn.querySelector('.lbl');
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (lbl) lbl.textContent = open ? btn.dataset.less : btn.dataset.more;
    if (open) panel.querySelectorAll('.reveal, .rise, .pr, .hl').forEach((el) => el.classList.add('in'));
    else btn.scrollIntoView({ block: 'center', behavior: motionOK ? 'smooth' : 'auto' });
  });
});


/* copy email */
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const text = btn.getAttribute('data-copy');
    const fallback = () => toast(text);
    try { navigator.clipboard.writeText(text).then(() => toast('Email copied. Talk soon! ✉️'), fallback); } catch (e) { fallback(); }
  });
});

/* split headings into words for the reveal */
document.querySelectorAll('.reveal').forEach((el) => {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement('span');
          s.className = 'w';
          s.style.setProperty('--i', i++);
          s.textContent = part;
          frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.classList.contains('hand')) {
        n.classList.add('w');
        n.style.setProperty('--i', i++);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el);
});

/* in-view: whatever is already on screen starts revealed */
const targets = document.querySelectorAll('.reveal, .rise, .pr, .hl');
if ('IntersectionObserver' in window && motionOK) {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -12% 0px' });
  targets.forEach((t) => (t.getBoundingClientRect().top < innerHeight * 0.9 ? t.classList.add('in') : io.observe(t)));
} else targets.forEach((t) => t.classList.add('in'));

/* ribbon: drifts with scroll and lights one word at a time */
const ribbon = document.getElementById('ribbon');
if (ribbon && motionOK) {
  const words = [...ribbon.querySelectorAll('span')];
  const perRow = words.length / 3;
  let w = 0;
  setInterval(() => {
    words.forEach((s) => s.classList.remove('lit'));
    for (let k = w % perRow; k < words.length; k += perRow) words[k].classList.add('lit');
    w++;
  }, 1400);
}

/* vine grows with scroll (doubles as the progress bar) */
const stem = document.getElementById('stem');
const leaves = document.getElementById('leaves');
const mobileBar = document.getElementById('pm');
const marks = [];
let L = 0;
if (stem && leaves) {
  L = stem.getTotalLength();
  stem.style.strokeDasharray = L;
  stem.style.strokeDashoffset = L;
  const NS = 'http://www.w3.org/2000/svg';
  [0.08, 0.17, 0.27, 0.36, 0.46, 0.55, 0.65, 0.74, 0.84, 0.93].forEach((t, k) => {
    const p = stem.getPointAtLength(L * t);
    const bud = k % 3 === 2;
    const el = document.createElementNS(NS, bud ? 'circle' : 'path');
    if (bud) {
      el.setAttribute('cx', p.x); el.setAttribute('cy', p.y); el.setAttribute('r', 4.5); el.setAttribute('class', 'bud');
    } else {
      const d = k % 2 ? 1 : -1;
      el.setAttribute('d', `M${p.x} ${p.y} q ${12 * d} -14 ${24 * d} -4 q ${-10 * d} 12 ${-24 * d} 4 Z`);
      el.setAttribute('class', 'lf');
    }
    leaves.appendChild(el);
    marks.push([t, el]);
  });
}
let ticking = false;
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, scrollY / max) : 0;
  const g = motionOK ? Math.max(0.04, p) : 1;
  if (stem) stem.style.strokeDashoffset = L * (1 - g);
  if (mobileBar) mobileBar.style.transform = `scaleX(${p})`;
  marks.forEach(([t, el]) => el.classList.toggle('on', g >= t));
  if (ribbon && motionOK) {
    const w = ribbon.scrollWidth / 3;
    ribbon.style.transform = `translateX(${-((scrollY * 0.35) % w)}px)`;
  }
  ticking = false;
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* gentle tilt toward the pointer */
if (motionOK && matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* before / after sliders on case studies */
document.querySelectorAll('.compare').forEach((c) => {
  const input = c.querySelector('input');
  const set = () => c.style.setProperty('--x', input.value + '%');
  input.addEventListener('input', set);
  set();
});

/* walkthrough videos: play muted while on screen, pause when away */
const vids = document.querySelectorAll('video[data-autoplay]');
/* walkthroughs play at half speed by default (viewers can still change it) */
vids.forEach((v) => {
  const slow = () => { v.defaultPlaybackRate = 0.5; v.playbackRate = 0.5; };
  slow();
  v.addEventListener('loadedmetadata', slow, { once: true });
});
if (vids.length && motionOK && 'IntersectionObserver' in window) {
  const vo = new IntersectionObserver((entries) => entries.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) { v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.5 });
  vids.forEach((v) => vo.observe(v));
}
