// ===================================================================
// VERBIER 2026 — Luxury Dashboard Interactions
// ===================================================================

// === Theme Toggle ===
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
    });
  }
})();

// === Sticky Nav — Frosted glass on scroll ===
(function () {
  const nav = document.querySelector('.hero-nav');
  if (!nav) return;
  
  const observer = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('scrolled', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
  );

  const hero = document.getElementById('hero');
  if (hero) observer.observe(hero);
})();

// === Smooth scroll for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// === Countdown ===
(function () {
  const el = document.getElementById('countdown');
  if (!el) return;

  function update() {
    const trip = new Date('2026-03-28T00:00:00+01:00');
    const now = new Date();
    const diff = trip - now;

    if (diff <= 0) {
      el.textContent = 'Now';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    el.textContent = days > 0 ? `${days}d` : `${hours}h`;
  }

  update();
  setInterval(update, 60000);
})();

// === Scroll Reveal (Intersection Observer) ===
(function () {
  const items = document.querySelectorAll('.fade-in');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings slightly
          const delay = Array.from(entry.target.parentElement.children)
            .filter(c => c.classList.contains('fade-in'))
            .indexOf(entry.target) * 60;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(item => observer.observe(item));
})();

// === Snowfall ===
(function () {
  const canvas = document.getElementById('snowCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let flakes = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function initFlakes() {
    flakes = [];
    const count = Math.min(Math.floor(w / 18), 80); // Fewer, more elegant
    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.3,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpd: Math.random() * 0.015 + 0.003
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';

    flakes.forEach(f => {
      f.wobble += f.wobbleSpd;
      f.x += f.vx + Math.sin(f.wobble) * 0.2;
      f.y += f.vy;

      if (f.y > h + 10) { f.y = -10; f.x = Math.random() * w; }
      if (f.x > w + 10) f.x = -10;
      if (f.x < -10) f.x = w + 10;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = dark
        ? `rgba(255,255,255,${f.opacity * 0.3})`
        : `rgba(160,175,200,${f.opacity * 0.25})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  initFlakes();
  draw();
  window.addEventListener('resize', () => { resize(); initFlakes(); });
})();

// === Checklist ===
document.querySelectorAll('.check-item input').forEach(cb => {
  cb.addEventListener('change', () => {
    const span = cb.nextElementSibling;
    if (span) {
      span.style.textDecoration = cb.checked ? 'line-through' : 'none';
      span.style.opacity = cb.checked ? '0.45' : '1';
      span.style.transition = 'opacity 0.3s ease, text-decoration 0.3s ease';
    }
  });
});
