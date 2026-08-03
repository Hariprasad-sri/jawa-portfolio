/* ==========================================================================
   PORTFOLIO DOM RENDERER & INTERACTIVE MODAL CONTROLLER
   ========================================================================== */

import { 
  SERVICES_DATA, 
  SOFTWARE_STACK, 
  PORTFOLIO_CATEGORIES, 
  PORTFOLIO_PROJECTS, 
  TIMELINE_DATA, 
  SKILLS_DATA, 
  WHY_CHOOSE_ME, 
  TESTIMONIALS 
} from './data.js';

import { playClickSound, playHoverSound } from './audio.js';

export function renderPortfolioApp() {
  renderServices();
  renderSoftware();
  renderPortfolioTabs();
  renderPortfolioGrid('All');
  renderTimeline();
  renderSkills();
  renderWhyChooseMe();
  renderTestimonials();
  setupModalEvents();
}

/* 1. SERVICES */
function renderServices() {
  const container = document.getElementById('services-grid');
  if (!container) return;

  container.innerHTML = SERVICES_DATA.map(s => `
    <div class="glass-card service-card" data-tilt>
      <div>
        <div class="service-header">
          <div class="service-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <span class="service-num">${s.num}</span>
        </div>
        <h3 class="service-title">${s.title}</h3>
        <p class="service-desc">${s.desc}</p>
      </div>
      <div class="service-tags">
        ${s.tags.map(t => `<span class="service-tag-pill">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');

  attachHoverSounds('#services-grid .service-card');
}

/* 2. SOFTWARE STACK */
function renderSoftware() {
  const container = document.getElementById('software-grid');
  if (!container) return;

  container.innerHTML = SOFTWARE_STACK.map(sw => `
    <div class="glass-card software-card" data-tilt>
      <div class="software-icon-wrapper ${sw.class}">
        ${sw.code}
      </div>
      <div>
        <div class="software-name">${sw.name}</div>
        <div class="software-type">${sw.type}</div>
      </div>
    </div>
  `).join('');

  attachHoverSounds('#software-grid .software-card');
}

/* 3. PORTFOLIO TABS & GRID */
function renderPortfolioTabs() {
  const container = document.getElementById('portfolio-tabs');
  if (!container) return;

  container.innerHTML = PORTFOLIO_CATEGORIES.map((cat, idx) => `
    <button class="filter-btn ${idx === 0 ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playClickSound();
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderPortfolioGrid(e.target.dataset.category);
    });
  });
}

function renderPortfolioGrid(category) {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  const filtered = category === 'All' 
    ? PORTFOLIO_PROJECTS 
    : PORTFOLIO_PROJECTS.filter(p => p.category === category);

  container.innerHTML = filtered.map(p => `
    <div class="portfolio-item glass-card" data-project-id="${p.id}">
      <div class="portfolio-thumb">
        <img src="${p.thumb}" alt="${p.title}" loading="lazy" />
        <div class="play-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
      </div>
      <div class="portfolio-overlay">
        <div class="portfolio-cat">${p.category}</div>
        <h3 class="portfolio-item-title">${p.title}</h3>
        <div class="portfolio-meta">
          <span>Client: ${p.client}</span>
          <span>•</span>
          <span>${p.duration}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Add click events to open luxury video modal
  container.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', playHoverSound);
    item.addEventListener('click', () => {
      playClickSound();
      const projId = item.dataset.projectId;
      const proj = PORTFOLIO_PROJECTS.find(p => p.id === projId);
      if (proj) openProjectModal(proj);
    });
  });
}

/* 4. TIMELINE */
function renderTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  container.innerHTML = TIMELINE_DATA.map(t => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="glass-card timeline-content">
        <div class="timeline-date">${t.date}</div>
        <h3 class="timeline-title">${t.title}</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">${t.desc}</p>
      </div>
    </div>
  `).join('');

  attachHoverSounds('#timeline-container .glass-card');
}

/* 5. SKILLS CIRCULAR PROGRESS */
function renderSkills() {
  const container = document.getElementById('skills-grid');
  if (!container) return;

  container.innerHTML = SKILLS_DATA.map(s => {
    const circumference = 2 * Math.PI * 54; // 339.29
    const offset = circumference - (s.percent / 100) * circumference;

    return `
      <div class="glass-card skill-card">
        <div class="circle-progress-wrapper">
          <svg>
            <defs>
              <linearGradient id="skill-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7B2FF7" />
                <stop offset="100%" stop-color="#00D4FF" />
              </linearGradient>
            </defs>
            <circle class="circle-bg" cx="65" cy="65" r="54"></circle>
            <circle class="circle-bar" cx="65" cy="65" r="54" data-offset="${offset}"></circle>
          </svg>
          <div class="circle-value">${s.percent}%</div>
        </div>
        <div class="skill-name">${s.name}</div>
      </div>
    `;
  }).join('');

  // Animate skills on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.circle-bar').forEach(bar => {
          bar.style.strokeDashoffset = bar.dataset.offset;
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(container);
  attachHoverSounds('#skills-grid .skill-card');
}

/* 6. WHY CHOOSE ME */
function renderWhyChooseMe() {
  const container = document.getElementById('why-grid');
  if (!container) return;

  container.innerHTML = WHY_CHOOSE_ME.map(w => `
    <div class="glass-card why-card">
      <div class="why-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h3 class="why-title">${w.title}</h3>
      <p class="why-desc">${w.desc}</p>
    </div>
  `).join('');

  attachHoverSounds('#why-grid .why-card');
}

/* 7. TESTIMONIALS SLIDER */
function renderTestimonials() {
  const track = document.getElementById('testimonials-track');
  if (!track) return;

  const doubleTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  track.innerHTML = doubleTestimonials.map(t => `
    <div class="glass-card testimonial-card">
      <div class="testimonial-stars">★★★★★</div>
      <p class="testimonial-quote">"${t.quote}"</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.author.charAt(0)}</div>
        <div class="author-info">
          <h5>${t.author}</h5>
          <span>${t.role}</span>
        </div>
      </div>
    </div>
  `).join('');
}

/* 8. MODAL CONTROLLER */
function setupModalEvents() {
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn && backdrop) {
    closeBtn.addEventListener('click', () => {
      playClickSound();
      closeModal();
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  // Showreel button listener
  const showreelPlayBtn = document.getElementById('btn-showreel-play');
  if (showreelPlayBtn) {
    showreelPlayBtn.addEventListener('click', () => {
      playClickSound();
      openProjectModal({
        title: 'Jawahernath P - 2026 Master Showreel',
        category: 'Showreel',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-lights-at-night-42226-large.mp4',
        client: 'Global Highlights',
        software: 'Premiere Pro, After Effects, Blender, Cinema 4D, DaVinci',
        duration: '2:30',
        year: '2026',
        desc: 'A high-impact cinematic montage demonstrating master-level Video Editing, 3D Motion Design, Color Grading, and Visual Effects.'
      });
    });
  }
}

function openProjectModal(proj) {
  const backdrop = document.getElementById('modal-backdrop');
  const title = document.getElementById('modal-title');
  const cat = document.getElementById('modal-cat');
  const mediaWrapper = document.getElementById('modal-media-wrapper');
  const client = document.getElementById('modal-client');
  const software = document.getElementById('modal-software');
  const duration = document.getElementById('modal-duration');
  const year = document.getElementById('modal-year');
  const desc = document.getElementById('modal-desc');

  if (!backdrop) return;

  title.textContent = proj.title;
  cat.textContent = proj.category;
  client.textContent = proj.client;
  software.textContent = proj.software;
  duration.textContent = proj.duration;
  year.textContent = proj.year;
  desc.textContent = proj.desc;

  mediaWrapper.innerHTML = `
    <video src="${proj.videoUrl}" controls autoplay playsinline loop></video>
  `;

  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  const mediaWrapper = document.getElementById('modal-media-wrapper');

  if (backdrop) backdrop.classList.remove('active');
  if (mediaWrapper) mediaWrapper.innerHTML = '';
  document.body.style.overflow = '';
}

function attachHoverSounds(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
  });
}
