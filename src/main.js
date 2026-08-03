/* ==========================================================================
   MAIN ENTRY POINT - JAWAHERNATH P PORTFOLIO (OPTIMIZED 60 FPS PERFORMANCE)
   ========================================================================== */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initGalaxyBackground } from './js/galaxy.js';
import { init3DCameraCanvas } from './js/camera3d.js';
import { renderPortfolioApp } from './js/portfolio.js';
import { toggleAudio, playHoverSound, playClickSound } from './js/audio.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Initialize WebGL Background & Hero 3D Viewport
  initGalaxyBackground('bg-canvas');
  init3DCameraCanvas('hero-3d-canvas');

  // 3. Render DOM Content
  renderPortfolioApp();

  // 4. Custom Cursor & Throttled Mouse Sparkle Trail
  initCustomCursor();
  initMouseSparkleTrail();

  // 5. GSAP Animations & ScrollTrigger
  initGSAPAnimations();

  // 6. Mobile Menu Overlay Interactivity
  initMobileMenu();

  // 7. Audio Toggle Listener
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isEnabled = toggleAudio();
      audioBtn.style.color = isEnabled ? '#00F5FF' : '#71717A';
    });
  }

  // 8. Navbar Scroll Class
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Sound FX for buttons & links
  document.querySelectorAll('a, button, .btn-glow, .btn-outline').forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
    el.addEventListener('click', playClickSound);
  });
});

/* Optimized Mouse Sparkle Particle Trail */
function initMouseSparkleTrail() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-trail-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const particles = [];
  const colors = ['#FF3CAC', '#00F5FF', '#7B2FF7', '#FFD93D'];
  let lastSpawn = 0;

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSpawn < 30) return; // Throttle particle creation for 60 FPS
    lastSpawn = now;

    if (particles.length < 30) {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 25
      });
    }
  }, { passive: true });

  function renderTrail() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 1 / p.life;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(renderTrail);
  }
  renderTrail();
}

/* Mobile Menu Handler */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const overlay = document.getElementById('mobile-menu-overlay');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !overlay) return;

  function openMenu() {
    playClickSound();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    playClickSound();
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* Custom Cursor */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const follower = document.querySelector('.custom-cursor-follower');

  if (!dot || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  function renderCursor() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  const interactiveEls = 'a, button, .glass-card, .portfolio-item, input, textarea';
  document.querySelectorAll(interactiveEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
  });
}

/* GSAP Animations */
function initGSAPAnimations() {
  const heroTl = gsap.timeline();
  heroTl
    .from('.hero-badge', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' })
    .from('.hero-title', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' }, '-=0.4')
    .from('.hero-subtitles', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero-tagline', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero-ctas', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero-canvas-container', { opacity: 0, scale: 0.9, duration: 1.2, ease: 'power3.out' }, '-=0.8');

  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%'
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out'
    });
  });

  gsap.from('.animated-word', {
    scrollTrigger: {
      trigger: '.intro-quote-section',
      start: 'top 75%'
    },
    opacity: 0,
    scale: 0.6,
    stagger: 0.25,
    duration: 0.8,
    ease: 'back.out(1.7)'
  });
}
