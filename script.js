/* Auto Pro Service Litaj */

// ── VIDEO INTRO ───────────────────────────────────────────────────
(function () {
  const overlay = document.getElementById('introOverlay');
  const video   = document.getElementById('introVideo');
  const darken  = document.getElementById('introDarken');
  const flash   = document.getElementById('introFlash');
  const brand   = document.getElementById('introBrand');
  if (!overlay || !video) return;

  document.body.style.overflow = 'hidden';

  function dismiss() {
    if (flash) { flash.classList.add('fire'); setTimeout(() => flash.classList.remove('fire'), 130); }
    if (brand) { brand.style.transition = 'opacity .35s'; brand.style.opacity = '0'; }
    setTimeout(() => {
      darken.classList.add('dim');
      overlay.classList.add('fade-out');
      overlay.addEventListener('transitionend', () => {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
      }, { once: true });
    }, 80);
  }

  video.addEventListener('timeupdate', () => {
    if (video.duration && video.currentTime >= video.duration - 0.7) darken.classList.add('dim');
  });
  video.addEventListener('ended', dismiss);
  video.addEventListener('error', dismiss);
  setTimeout(dismiss, 15000);
})();


// ── SCROLL: progress + streak turbo ──────────────────────────────
(function () {
  const bar   = document.getElementById('scrollProgress');
  const layer = document.getElementById('streakLayer');
  let t = null;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar && max > 0) bar.style.height = (window.scrollY / max * 100) + '%';
    if (layer) {
      layer.classList.add('turbo');
      clearTimeout(t);
      t = setTimeout(() => layer.classList.remove('turbo'), 650);
    }
  }, { passive: true });
})();


// ── NAVBAR ────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
navMenu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navMenu.classList.remove('open')));


// ── REVEAL on scroll ─────────────────────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.1 });

document.querySelectorAll('.rv').forEach(el => {
  if (!el.closest('.hero')) io.observe(el);
});


// ── STATS COUNTER ────────────────────────────────────────────────
function animateCounter(el, target, decimals = 0) {
  const dur = 1400, start = performance.now();
  const from = 0;
  requestAnimationFrame(function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = from + (target - from) * ease;
    el.textContent = decimals ? val.toFixed(1) : Math.round(val);
    if (p < 1) requestAnimationFrame(tick);
  });
}
const statIo = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const t = parseFloat(el.dataset.target);
    if (!isNaN(t)) animateCounter(el, t, t % 1 !== 0 ? 1 : 0);
    statIo.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-n[data-target]').forEach(el => statIo.observe(el));


// ── OPEN / CLOSED STATUS ─────────────────────────────────────────
(function () {
  const el = document.getElementById('openStatus');
  if (!el) return;
  const now  = new Date();
  const day  = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = (day >= 1 && day <= 5 && mins >= 540 && mins < 1080)
            || (day === 6 && mins >= 540 && mins < 840);
  el.textContent = open ? '✅ Jetzt geöffnet' : '❌ Aktuell geschlossen';
  el.className = 'open-tag ' + (open ? 'open' : 'closed-now');

  // Highlight today's row
  const days = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
  document.querySelectorAll('.h-day').forEach(d => {
    if (d.textContent === days[day]) d.closest('.h-row')?.classList.add('today');
  });
})();


// ── SMOOTH SCROLL ────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
  });
});


// ── MOBILE.DE iframe ─────────────────────────────────────────────
(function () {
  const frame    = document.getElementById('mdeFrame');
  const loading  = document.getElementById('mdeLoading');
  const fallback = document.getElementById('mdeFallback');
  if (!frame) return;

  function showFallback() {
    if (loading) loading.classList.add('hide');
    frame.style.display = 'none';
    if (fallback) fallback.classList.add('show');
  }

  frame.addEventListener('load', () => {
    if (loading) loading.classList.add('hide');
    try {
      const h = frame.contentDocument?.body?.scrollHeight;
      if (h && h > 50) frame.classList.add('loaded');
      else showFallback();
    } catch (_) { frame.classList.add('loaded'); }
  });

  const t = setTimeout(showFallback, 8000);
  frame.addEventListener('load', () => clearTimeout(t));
})();
