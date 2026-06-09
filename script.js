/* ================================================================
   AUTO PRO SERVICE LITAJ – Script
   ================================================================ */

// ── VIDEO INTRO ───────────────────────────────────────────────────
(function () {
  const overlay  = document.getElementById('introOverlay');
  const video    = document.getElementById('introVideo');
  const darken   = document.getElementById('introDarken');
  const flash    = document.getElementById('introFlash');
  const brand    = document.getElementById('introBrand');
  if (!overlay || !video) return;

  document.body.style.overflow = 'hidden';

  function dismiss() {
    // 1. White flash
    if (flash) {
      flash.classList.add('fire');
      setTimeout(() => flash.classList.remove('fire'), 150);
    }
    // 2. Fade out brand overlay
    if (brand) { brand.style.transition = 'opacity .4s'; brand.style.opacity = '0'; }
    // 3. Darken + zoom video out
    setTimeout(() => {
      darken.classList.add('dim');
      overlay.classList.add('fade-out');
      overlay.addEventListener('transitionend', () => {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
      }, { once: true });
    }, 100);
  }

  // Darken 0.7s before end
  video.addEventListener('timeupdate', () => {
    if (video.duration && video.currentTime >= video.duration - 0.7) {
      darken.classList.add('dim');
    }
  });

  video.addEventListener('ended', dismiss);
  video.addEventListener('error', dismiss);
  setTimeout(dismiss, 15000);
})();


// ── SCROLL PROGRESS BAR + STREAK TURBO ──────────────────────────
(function () {
  const bar   = document.getElementById('scrollProgress');
  const layer = document.getElementById('streakLayer');
  let turboTimer = null;

  window.addEventListener('scroll', () => {
    // Progress bar
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar && max > 0) bar.style.height = (window.scrollY / max * 100) + '%';

    // Streak turbo
    if (layer) {
      layer.classList.add('turbo');
      clearTimeout(turboTimer);
      turboTimer = setTimeout(() => layer.classList.remove('turbo'), 700);
    }
  }, { passive: true });
})();

// ── SCROLL REVEAL ────────────────────────────────────────────────
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    // Skip hero elements (they animate via CSS)
    if (!el.closest('.hero')) io.observe(el);
    else el.classList.add('in');
  });
})();


// ── NAVBAR SCROLL ─────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


// ── MOBILE MENU ───────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
navMenu.querySelectorAll('.nav-link').forEach(l =>
  l.addEventListener('click', () => navMenu.classList.remove('open'))
);


// ── OPEN / CLOSED STATUS ─────────────────────────────────────────
function checkOpenStatus() {
  const el = document.getElementById('openStatus');
  if (!el) return;
  const now  = new Date();
  const day  = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  let open = false;
  if (day >= 1 && day <= 5 && mins >= 540 && mins < 1080) open = true;
  if (day === 6             && mins >= 540 && mins <  840) open = true;
  el.textContent = open ? '✅ Jetzt geöffnet' : '❌ Aktuell geschlossen';
  el.className   = 'open-status ' + (open ? 'open' : 'closed-now');
}
checkOpenStatus();


// ── SMOOTH ANCHOR SCROLL ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
  });
});




// ── MOBILE.DE IFRAME DETECTION ───────────────────────────────────
(function () {
  const frame    = document.getElementById('mdeFrame');
  const loading  = document.getElementById('mdeLoading');
  const fallback = document.getElementById('mdeFallback');
  if (!frame) return;

  function showFallback() {
    loading.classList.add('hide');
    frame.style.display = 'none';
    fallback.classList.add('show');
  }

  frame.addEventListener('load', () => {
    loading.classList.add('hide');
    try {
      const h = frame.contentDocument?.body?.scrollHeight;
      if (h && h > 50) {
        frame.classList.add('loaded');
      } else {
        showFallback();
      }
    } catch (_) {
      frame.classList.add('loaded');
    }
  });

  const t = setTimeout(() => {
    if (!frame.classList.contains('loaded')) showFallback();
  }, 8000);
  frame.addEventListener('load', () => clearTimeout(t));
})();
