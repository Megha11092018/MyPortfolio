/* ============================================================
   MEGHA BIRADAR — Portfolio Script v2.0
   Smart Animations, Particles, Interactions & Effects
   ============================================================ */

(function () {
  'use strict';

  // ===================== DOM HELPERS =====================
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // ===================== PRELOADER =====================
  const preloader = $('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 600);
    });
    // Fallback: hide after 3s max
    setTimeout(() => {
      if (!preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }, 3500);
  }

  // ===================== SCROLL PROGRESS BAR =====================
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ===================== CURSOR GLOW =====================
  const cursorGlow = document.createElement('div');
  cursorGlow.id = 'cursor-glow';
  document.body.prepend(cursorGlow);

  let mouseX = -200;
  let mouseY = -200;
  let currentX = -200;
  let currentY = -200;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateCursor() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hide cursor glow on touch devices
  if ('ontouchstart' in window) {
    cursorGlow.style.display = 'none';
  }

  // ===================== PARTICLES SYSTEM =====================
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 260 : 185; // purple or cyan
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.hue === 260
        ? `rgba(124, 92, 255, ${this.opacity})`
        : `rgba(34, 211, 238, ${this.opacity})`;
      ctx.fill();
    }
  }

  const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  particles = Array.from({ length: particleCount }, () => new Particle());

  let mouseParticleX = -1000;
  let mouseParticleY = -1000;
  document.addEventListener('mousemove', (e) => {
    mouseParticleX = e.clientX;
    mouseParticleY = e.clientY;
  }, { passive: true });

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 92, 255, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      // Mouse connection
      const dx = particles[i].x - mouseParticleX;
      const dy = particles[i].y - mouseParticleY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseParticleX, mouseParticleY);
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 * (1 - dist / 150)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    animationId = requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ===================== MOBILE NAVIGATION =====================
  const toggleBtn = $('.nav-toggle');
  const menu = $('#nav-menu');

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = menu.getAttribute('data-visible') === 'true';
      const nextState = !isOpen;
      menu.setAttribute('data-visible', String(nextState));
      toggleBtn.setAttribute('aria-expanded', String(nextState));
      toggleBtn.classList.toggle('active', nextState);
    });

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (!menu.contains(target) && target !== toggleBtn && !toggleBtn.contains(target)) {
        menu.setAttribute('data-visible', 'false');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('active');
      }
    });

    $$('a', menu).forEach((a) => {
      a.addEventListener('click', () => {
        menu.setAttribute('data-visible', 'false');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('active');
      });
    });
  }

  // ===================== HEADER SCROLL EFFECT =====================
  const header = $('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ===================== FOOTER YEAR =====================
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===================== ACTIVE SECTION HIGHLIGHT =====================
  const sections = $$('section[id]');
  const navLinks = $$('.nav-menu a');

  function updateActiveNav() {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const offsetTop = section.offsetTop;
      const offsetBottom = offsetTop + section.offsetHeight;
      if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ===================== SCROLL REVEAL =====================
  const revealElements = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale, .section-head, ' +
    '.skill-category, .project-card, .exp-card, .sidebar-card, .stat-item, .contact-link-card');

  if ('IntersectionObserver' in window && revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => {
      if (!el.classList.contains('reveal') &&
          !el.classList.contains('reveal-left') &&
          !el.classList.contains('reveal-right') &&
          !el.classList.contains('reveal-scale') &&
          !el.classList.contains('section-head')) {
        el.classList.add('reveal');
      }
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // ===================== SKILL BARS ANIMATION =====================
  const skillBars = $$('.skill-bar-fill');
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const width = target.getAttribute('data-width') || '0';
          setTimeout(() => {
            target.style.width = width + '%';
          }, 200);
          barObserver.unobserve(target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach((bar) => barObserver.observe(bar));

  // ===================== BUTTON RIPPLE EFFECT =====================
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
    btn.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
  });

  // ===================== STAT COUNTER ANIMATION =====================
  function animateCounter(el) {
    const rawTarget = el.getAttribute('data-target');
    const target = parseFloat(rawTarget);
    if (isNaN(target) || target === 0) return;
    const suffix = el.getAttribute('data-suffix') || '';
    const isDecimal = rawTarget.includes('.');
    const duration = 2000;
    const startTime = performance.now();

    function formatValue(value) {
      if (isDecimal) return value.toFixed(1) + suffix;
      return Math.floor(value) + suffix;
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatValue(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = formatValue(target);
      }
    }
    requestAnimationFrame(update);
  }

  const statNumbers = $$('.stat-number');
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const numberEl = entry.target.querySelector('.stat-number');
          if (numberEl) animateCounter(numberEl);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  $$('.stat-item').forEach((item) => statObserver.observe(item));

  // ===================== BACK TO TOP BUTTON =====================
  const backToTop = document.createElement('button');
  backToTop.id = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===================== PARALLAX ON HERO =====================
  const hero = $('.hero');
  if (hero && !('ontouchstart' in window)) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroBg = hero.querySelector('.hero-bg-grid');
      if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }

  // ===================== TEXT SLIDER / WORDS (optional flair) =====================
  const subtitle = $('.hero-subtitle');
  if (subtitle) {
    const roles = [
      'Java Fullstack Developer',
      'Web Designer',
      'CSE Student',
      'Problem Solver'
    ];
    let roleIndex = 0;
    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      subtitle.style.opacity = '0';
      subtitle.style.transform = 'translateY(10px)';
      setTimeout(() => {
        subtitle.textContent = roles[roleIndex];
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
      }, 300);
    }, 4000);
    subtitle.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }

  // ===================== 3D TILT ON PROFILE HEX =====================
  const profileHex = $('.profile-hex');
  if (profileHex && !('ontouchstart' in window)) {
    const wrapper = profileHex.closest('.profile-hex-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        profileHex.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
        profileHex.style.transition = 'transform 0.1s ease';
      });
      wrapper.addEventListener('mouseleave', () => {
        profileHex.style.transform = 'rotateY(0deg) rotateX(0deg)';
        profileHex.style.transition = 'transform 0.5s ease';
      });
    }
  }

  // ===================== SMOOTH ANCHOR SCROLL (fallback) =====================
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  });

  // ===================== CONSOLE EASTER EGG =====================
  console.log('%c Megha Biradar ', 'background:#7c5cff;color:white;font-size:20px;font-weight:bold;padding:10px 20px;border-radius:8px;');
  console.log('%c Built with ❤️ using HTML, CSS & Vanilla JS ', 'color:#22d3ee;font-size:14px;');

})();
