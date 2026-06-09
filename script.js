// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

// Open/closed status
function checkOpenStatus() {
  const el = document.getElementById('openStatus');
  if (!el) return;
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...6=Sat
  const h = now.getHours();
  const m = now.getMinutes();
  const time = h * 60 + m;

  let isOpen = false;
  if (day >= 1 && day <= 5 && time >= 540 && time < 1080) isOpen = true; // Mon–Fri 9–18
  if (day === 6 && time >= 540 && time < 840) isOpen = true;               // Sat 9–14

  el.textContent = isOpen ? '✅ Jetzt geöffnet' : '❌ Aktuell geschlossen';
  el.className = 'open-status ' + (isOpen ? 'open' : 'closed-now');
}
checkOpenStatus();

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Intersection Observer – fade-in cards
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .info-card, .gallery-item, .mobile-de-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .55s ease, transform .55s ease';
  observer.observe(el);
});
