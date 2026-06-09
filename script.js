/* ================================================================
   AUTO PRO SERVICE LITAJ – Script
   ================================================================ */

// ── INTRO ANIMATION ───────────────────────────────────────────────
(function () {
  const overlay   = document.getElementById('introOverlay');
  const fillBar   = document.getElementById('introBarFill');
  const skipBtn   = document.getElementById('introSkip');
  const DURATION  = 3200; // ms until auto-dismiss

  if (!overlay) return;

  // Prevent body scroll while intro plays
  document.body.style.overflow = 'hidden';

  function dismiss() {
    overlay.classList.add('exit');
    document.body.style.overflow = '';
    overlay.addEventListener('transitionend', () => {
      overlay.classList.add('hidden');
    }, { once: true });
  }

  // Animated progress bar
  let start = null;
  function animateBar(ts) {
    if (!start) start = ts;
    const pct = Math.min(((ts - start) / DURATION) * 100, 100);
    fillBar.style.width = pct + '%';
    if (pct < 100) {
      requestAnimationFrame(animateBar);
    } else {
      dismiss();
    }
  }
  // Start bar after initial animations settle (≈1.2s)
  setTimeout(() => requestAnimationFrame(animateBar), 1200);

  skipBtn.addEventListener('click', () => {
    dismiss();
  });
})();


// ── NAVBAR SCROLL ─────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


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
  const day  = now.getDay();          // 0=Sun … 6=Sat
  const mins = now.getHours() * 60 + now.getMinutes();
  let open = false;
  if (day >= 1 && day <= 5 && mins >= 540 && mins < 1080) open = true; // Mo–Fr 9–18
  if (day === 6             && mins >= 540 && mins <  840) open = true; // Sa   9–14
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


// ── SCROLL FADE-IN (Intersection Observer) ───────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.card, .info-card, .gallery-item, .mde-browser').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  io.observe(el);
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

  function onLoaded() {
    // Cross-origin frames fire load even when X-Frame-Options blocks them.
    // Try accessing contentDocument – SecurityError means cross-origin (could still be blocked).
    // We use a short timeout to check if the iframe actually rendered content
    // by seeing whether the inner document has any body height.
    loading.classList.add('hide');
    try {
      // Same-origin: works fine
      const h = frame.contentDocument?.body?.scrollHeight;
      if (h && h > 50) {
        frame.classList.add('loaded');
      } else {
        showFallback();
      }
    } catch (_) {
      // Cross-origin loaded (SecurityError) – could be real content or error page.
      // Show the frame optimistically; if it's blank the fallback timer will catch it.
      frame.classList.add('loaded');
    }
  }

  frame.addEventListener('load', onLoaded);

  // Hard timeout: if load event never fires within 8s → show fallback
  const timeout = setTimeout(() => {
    if (!frame.classList.contains('loaded')) showFallback();
  }, 8000);

  frame.addEventListener('load', () => clearTimeout(timeout));
})();
