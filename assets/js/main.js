'use strict';
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
(function initVoid() {
  const canvas = document.getElementById('void-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let embers = [];
  function createStars(W, H) {
    stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.1 + 0.25,
      alpha: Math.random() * 0.45 + 0.05,
      speed: Math.random() * 0.025 + 0.008,
      phase: Math.random() * Math.PI * 2,
    }));
    embers = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -(Math.random() * 1 + 0.3),
      alpha: Math.random() * 0.6 + 0.1
    }));
  }
  function resize() {
    const hero = canvas.parentElement;
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    createStars(canvas.width, canvas.height);
  }
  function draw(time) {
    const W = canvas.width;
    const H = canvas.height;
    if (!W || !H) return;
    const cx = W * 0.5;
    const cy = H * 0.58; 
    ctx.clearRect(0, 0, W, H);
    const bgR = Math.min(W, H) * 0.65;
    const bgG = ctx.createRadialGradient(cx, cy, 0, cx, cy, bgR);
    bgG.addColorStop(0,   'rgba(90, 0, 18, 0.28)');
    bgG.addColorStop(0.45,'rgba(35, 0,  8, 0.12)');
    bgG.addColorStop(1,   'rgba( 0, 0,  0, 0   )');
    ctx.fillStyle = bgG;
    ctx.fillRect(0, 0, W, H);
    stars.forEach(s => {
      const twinkle = (Math.sin(time * s.speed + s.phase) * 0.35 + 0.65);
      ctx.globalAlpha = s.alpha * twinkle;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });
    embers.forEach(e => {
      e.x += e.speedX;
      e.y += e.speedY;
      if (e.y < -10) { e.y = H + 10; e.x = Math.random() * W; }
      ctx.globalAlpha = e.alpha;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fillStyle = '#ff2d55';
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    const base = Math.min(W, H);
    const orbits = [
      { rx: base * 0.30, ry: base * 0.065, tilt:  0.0,              speed:  0.00010, dots: 8,  dotR: 2.6 },
      { rx: base * 0.21, ry: base * 0.046, tilt:  Math.PI * 0.16,   speed: -0.00018, dots: 6,  dotR: 2.1 },
      { rx: base * 0.14, ry: base * 0.030, tilt: -Math.PI * 0.10,   speed:  0.00030, dots: 4,  dotR: 1.7 },
    ];
    orbits.forEach((orb, oi) => {
      const rotation = time * orb.speed;
      const ringAlpha = 0.13 + oi * 0.06;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(orb.tilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, orb.rx, orb.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(232, 0, 58, ${ringAlpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    });
    const cG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
    cG.addColorStop(0,   'rgba(255, 45, 85, 0.28)');
    cG.addColorStop(0.5, 'rgba(200,  0, 40, 0.10)');
    cG.addColorStop(1,   'rgba(  0,  0,  0, 0   )');
    ctx.fillStyle = cG;
    ctx.beginPath();
    ctx.arc(cx, cy, 80, 0, Math.PI * 2);
    ctx.fill();
    const fadeR = Math.max(W, H) * 0.55;
    const fade = ctx.createRadialGradient(cx, cy * 0.85, fadeR * 0.22, cx, cy * 0.85, fadeR);
    fade.addColorStop(0, 'rgba(3, 0, 20, 0)');
    fade.addColorStop(1, 'rgba(3, 0, 20, 0.92)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, W, H);
  }
  let raf;
  function animate(t) {
    draw(t);
    raf = requestAnimationFrame(animate);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  raf = requestAnimationFrame(animate);
})();
(function initGlobe() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let R = 0; 
  function resize() {
    const section = canvas.parentElement;
    const W = section.offsetWidth;
    canvas.width  = W;
    canvas.height = Math.round(W * 0.72);
    R = Math.min(W * 0.34, 440);
    canvas.style.width  = W + 'px';
    canvas.style.height = canvas.height + 'px';
  }
  function drawGlobe(time) {
    const W = canvas.width;
    const H = canvas.height;
    if (!W || !H) return;
    const cx = W / 2;
    const cy = H * 0.94;
    ctx.clearRect(0, 0, W, H);
    const atmR = R * 1.22;
    const atm = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, atmR);
    atm.addColorStop(0,   'rgba(232,  0, 58, 0.22)');
    atm.addColorStop(0.45,'rgba(200,  0, 30, 0.07)');
    atm.addColorStop(1,   'rgba(  0,  0,  0, 0   )');
    ctx.fillStyle = atm;
    ctx.beginPath();
    ctx.arc(cx, cy, atmR, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    const fill = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.30, 0, cx, cy, R);
    fill.addColorStop(0,   'rgba(90,  0, 18, 0.95)');
    fill.addColorStop(0.55,'rgba(22,  0,  6, 0.98)');
    fill.addColorStop(1,   'rgba( 5,  0, 15, 1   )');
    ctx.fillStyle = fill;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    const rotation = time * 0.000175;
    const GRID_ALPHA_BASE = 0.10;
    const latLines = 12;
    for (let i = 1; i <= latLines - 1; i++) {
      const lat = (i / latLines) * Math.PI - Math.PI * 0.5;
      const ly  = Math.sin(lat) * R;
      const lr  = Math.cos(lat) * R;
      if (lr < 2) continue;
      const distEq = Math.abs(lat) / (Math.PI * 0.5); 
      const a = GRID_ALPHA_BASE + (1 - distEq) * 0.14;
      ctx.beginPath();
      ctx.ellipse(cx, cy + ly, lr, lr * 0.18, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(232, 0, 58, ${a})`;
      ctx.lineWidth = 0.65;
      ctx.stroke();
    }
    const lonLines = 16;
    for (let i = 0; i < lonLines; i++) {
      const lon = (i / lonLines) * Math.PI + rotation;
      const sx  = Math.cos(lon); 
      if (Math.abs(sx) < 0.03) continue;
      const a = GRID_ALPHA_BASE + Math.abs(sx) * 0.16;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.abs(sx) * R, R, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(232, 0, 58, ${a})`;
      ctx.lineWidth = 0.65;
      ctx.stroke();
    }
    const hi = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.32, 0, cx, cy, R);
    hi.addColorStop(0,    'rgba(255, 90, 110, 0.35)');
    hi.addColorStop(0.30, 'rgba(255, 45,  70, 0.12)');
    hi.addColorStop(0.70, 'rgba(  0,  0,   0, 0   )');
    ctx.fillStyle = hi;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.restore(); 
    const eqGrad = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
    eqGrad.addColorStop(0,   'rgba(232, 0, 58, 0)');
    eqGrad.addColorStop(0.4, 'rgba(255, 45, 85, 0.45)');
    eqGrad.addColorStop(0.6, 'rgba(255, 45, 85, 0.45)');
    eqGrad.addColorStop(1,   'rgba(232, 0, 58, 0)');
    ctx.strokeStyle = eqGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, R, R * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
    const fade = ctx.createLinearGradient(0, cy - R * 0.3, 0, H);
    fade.addColorStop(0, 'rgba(3, 0, 20, 0)');
    fade.addColorStop(1, 'rgba(3, 0, 20, 0.75)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, cy - R * 0.3, W, H);
  }
  let raf;
  function animate(t) {
    drawGlobe(t);
    raf = requestAnimationFrame(animate);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  raf = requestAnimationFrame(animate);
})();
const scrollBar = $('#scroll-progress');
window.addEventListener('scroll', () => {
  if (!scrollBar) return;
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = pct + '%';
}, { passive: true });
const navbar = $('#navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (!navbar) return;
  navbar.classList.toggle('scrolled', y > 30);
  if (y > 100 && y > lastScroll + 5) {
    navbar.style.transform = 'translateY(-100%)';
  } else if (y < lastScroll - 3) {
    navbar.style.transform = '';
  }
  lastScroll = y;
}, { passive: true });
if (navbar) {
  navbar.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease, border-color 0.4s ease';
}
const navLinks = $$('.nav-link[href^="#"]');
const sections = $$('section[id]');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObs.observe(s));

const hamburger  = $('#hamburger');
const mobileMenu = $('#mobile-menu');
const mobileOverlay = $('#mobile-overlay');

function closeMobileMenu() {
  hamburger?.classList.remove('open');
  mobileMenu?.classList.remove('open');
  mobileOverlay?.classList.remove('show');
  mobileMenu?.setAttribute('aria-hidden', 'true');
  hamburger?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function openMobileMenu() {
  hamburger?.classList.add('open');
  mobileMenu?.classList.add('open');
  mobileOverlay?.classList.add('show');
  mobileMenu?.setAttribute('aria-hidden', 'false');
  hamburger?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

hamburger?.addEventListener('click', () => {
  if (hamburger.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});


mobileOverlay?.addEventListener('click', closeMobileMenu);


$('#mobile-close')?.addEventListener('click', closeMobileMenu);


$$('.mobile-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    closeMobileMenu();
    
    if (href && href.includes('#')) {
      const id = href.substring(href.indexOf('#'));
      if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        const target = $(id);
        if (target) {
          e.preventDefault();
          setTimeout(() => {
            window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
            history.replaceState(null, null, window.location.pathname);
          }, 300);
        }
      }
    }
  });
});

$$('.nav-link[href^="#"], .nav-link[href^="/#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    const id = href.includes('#') ? href.substring(href.indexOf('#')) : null;
    
    // Only intercept if we're already on the homepage
    if (href.startsWith('/#') && window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html')) {
      return; 
    }
    
    if (id && id !== '#') {
      const target = $(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
        history.replaceState(null, null, window.location.pathname);
      }
    }
  });
});

window.addEventListener('load', () => {
  if (window.location.hash) {
    const id = window.location.hash;
    const target = $(id);
    if (target) {
      setTimeout(() => {
        window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
        history.replaceState(null, null, window.location.pathname);
      }, 100);
    }
  }
});


document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});
function initScrollAnims() {
  const animEls = $$('[data-anim]');
  if (!animEls.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -20px 0px' });
  animEls.forEach(el => obs.observe(el));
}
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const duration = 2200;
  const start    = performance.now();
  function tick(now) {
    const p     = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
$$('[data-counter]').forEach(el => counterObs.observe(el));
function setupMarquee(wrapSel, trackSel) {
  const wrap  = $(wrapSel);
  const track = $(trackSel);
  if (!wrap || !track) return;
  [...track.children].forEach(child => track.appendChild(child.cloneNode(true)));
  const pause  = () => track.classList.add('paused');
  const resume = () => track.classList.remove('paused');
  wrap.addEventListener('mouseenter', pause);
  wrap.addEventListener('mouseleave', resume);
  wrap.addEventListener('touchstart', pause,  { passive: true });
  wrap.addEventListener('touchend', () => setTimeout(resume, 1500), { passive: true });
}
setupMarquee('.games-scroll-wrap',     '#games-track');
setupMarquee('.executors-scroll-wrap', '#executors-track');
const LOADER_SCRIPT = `loadstring(game:HttpGet("https://moondiety.com/loader"))()`;
function showToast(msg, type = 'success') {
  const toast = $('#toast');
  if (!toast) return;
  const icon = toast.querySelector('.toast-icon');
  const text = toast.querySelector('.toast-text');
  if (icon) icon.className = `toast-icon fas ${
    type === 'success' ? 'fa-check-circle toast-icon-success' : 'fa-times-circle toast-icon-error'
  }`;
  if (text) text.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}
const copyBtn = $('#copy-script');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(LOADER_SCRIPT);
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
      showToast('Script copied to clipboard!');
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = '<i class="fas fa-copy"></i><span>Copy Script</span>';
      }, 2200);
    } catch {
      showToast('Select and copy the text manually', 'error');
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnims();
});
