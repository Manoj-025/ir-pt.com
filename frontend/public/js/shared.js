/* ir-pt Edtech — shared.js  (ALL pages include this) */
'use strict';

/* ── API base: auto-detect ───────────────────────────── */
const API = (() => {
  const h = window.location.hostname;
  // If running locally via file:// or Live Server on diff port → use localhost:5000
  if (h === '' || h === 'localhost' || h === '127.0.0.1') {
    // Try to use same port as current page, fallback to 5000
    const port = window.location.port || '5000';
    return `http://localhost:${port}/api`;
  }
  // Production: same origin
  return '/api';
})();

/* ── Admin token helpers ─────────────────────────────── */
const Auth = {
  get:   ()  => localStorage.getItem('irpt_tk') || '',
  set:   t   => localStorage.setItem('irpt_tk', t),
  clear: ()  => localStorage.removeItem('irpt_tk'),
  has:   ()  => !!localStorage.getItem('irpt_tk'),
};

/* ── Fetch helpers ───────────────────────────────────── */
async function apiFetch(method, path, data, isAdmin = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (isAdmin) headers['x-admin-token'] = Auth.get();
  const init = { method, headers };
  if (data) init.body = JSON.stringify(data);
  const res = await fetch(API + path, init);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}
const apiGet  = (p, admin)    => apiFetch('GET',    p, null, admin);
const apiPost = (p, d, admin) => apiFetch('POST',   p, d,    admin);
const apiPut  = (p, d)        => apiFetch('PUT',    p, d,    true);
const apiDel  = (p)           => apiFetch('DELETE', p, null, true);

/* ── Toast ───────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const el = Object.assign(document.createElement('div'), {
    className: `toast ${type}`,
    textContent: (type === 'error' ? '⚠ ' : '✅ ') + msg,
  });
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 400); }, 3500);
}

/* ── Formatters ──────────────────────────────────────── */
function fmtFee(n) {
  if (!n) return '–';
  return n >= 100000 ? '₹' + (n / 100000).toFixed(1) + 'L/yr' : '₹' + Math.round(n / 1000) + 'K/yr';
}
function fmtDate(d) {
  if (!d) return '–';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function initials(name) {
  return (name || '--').split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2);
}

/* ── Scroll reveal ───────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-s').forEach(el => obs.observe(el));
}

/* ── Counter animation ───────────────────────────────── */
function animateCount(el, target) {
  const dur = 1600, start = performance.now();
  const step = ts => {
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
function initCounters() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      animateCount(e.target, +e.target.dataset.target);
    }
  }), { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
}

/* ── Nav init (transparent → solid on scroll) ────────── */
function initNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const isHome = ['/', '/index.html', ''].includes(window.location.pathname);
  if (isHome) {
    nav.className = window.scrollY > 60 ? 'scrolled' : 'top';
    window.addEventListener('scroll', () => {
      nav.className = window.scrollY > 60 ? 'scrolled' : 'top';
    }, { passive: true });
  } else {
    nav.className = 'solid';
  }
  // Highlight active nav link
  const cur = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
    a.classList.toggle('active', href === cur);
  });
}

/* ── Mobile menu ─────────────────────────────────────── */
function toggleMenu() { document.getElementById('mobMenu')?.classList.toggle('open'); }
function closeMenu()  { document.getElementById('mobMenu')?.classList.remove('open'); }

/* ── WA pill auto-hide ───────────────────────────────── */
function initWaPill() {
  setTimeout(() => {
    const p = document.getElementById('waPill');
    if (p) { p.style.opacity = '0'; setTimeout(() => p.style.display = 'none', 500); }
  }, 5000);
}

/* ── Shared HTML snippets ────────────────────────────── */
const WA_SVG = `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const NAV_HTML = `
<nav id="mainNav">
  <a class="nav-logo" href="/index.html">
    <img src="/images/logo.jpg" alt="ir-pt Edtech">
    <div class="nav-brand">ir-pt <em>Edtech</em></div>
  </a>
  <ul class="nav-links">
    <li><a href="/index.html">Home</a></li>
    <li><a href="/about.html">About</a></li>
    <li><a href="/services.html">Services</a></li>
    <li><a href="/colleges.html">Colleges</a></li>
    <li><a href="/jobs.html">Jobs</a></li>
    <li><a href="/news.html">News</a></li>
    <li><a href="/faq.html">FAQ</a></li>
    <li><a href="/contact.html">Contact</a></li>
    <li><a href="/track.html">Track Status</a></li>
  </ul>
  <div class="nav-actions">
    <a href="https://wa.me/918223063535?text=Hi!%20I%20need%20career%20guidance." target="_blank" class="nav-wa">${WA_SVG} WhatsApp</a>
    <a href="tel:8223063535" class="nav-call">📞 82230 63535</a>
    <div class="hamburger" onclick="toggleMenu()"><span></span><span></span><span></span></div>
  </div>
</nav>
<div class="mob-menu" id="mobMenu">
  <button class="mob-close" onclick="closeMenu()">✕</button>
  <a href="/index.html"   onclick="closeMenu()">Home</a>
  <a href="/about.html"   onclick="closeMenu()">About Us</a>
  <a href="/services.html" onclick="closeMenu()">Services</a>
  <a href="/colleges.html" onclick="closeMenu()">Colleges</a>
  <a href="/jobs.html"    onclick="closeMenu()">Jobs</a>
  <a href="/news.html"    onclick="closeMenu()">News</a>
  <a href="/faq.html"     onclick="closeMenu()">FAQ</a>
  <a href="/contact.html" onclick="closeMenu()">Contact</a>
  <a href="/track.html"   onclick="closeMenu()">Track Status</a>
  <div class="mob-btns">
    <a href="https://wa.me/918223063535" target="_blank" class="btn btn-wa btn-sm">WhatsApp Us</a>
    <a href="tel:8223063535" class="btn btn-gold btn-sm">📞 Call Now</a>
  </div>
</div>`;

const TICKER_HTML = `<div class="ticker"><div class="ticker-track">
  <span class="ticker-item"><span>🎓</span>Free counselling for 12th students</span>
  <span class="ticker-item"><span>📞</span>Call: 82230 63535</span>
  <span class="ticker-item"><span>🏫</span>50+ colleges in Bhopal listed</span>
  <span class="ticker-item"><span>✅</span>500+ students guided</span>
  <span class="ticker-item"><span>💼</span>New Bhopal jobs added daily</span>
  <span class="ticker-item"><span>🎯</span>Direct college tie-ups — no hidden fees</span>
  <span class="ticker-item"><span>📋</span>Project & thesis support available</span>
  <span class="ticker-item"><span>🎓</span>Free counselling for 12th students</span>
  <span class="ticker-item"><span>📞</span>Call: 82230 63535</span>
  <span class="ticker-item"><span>🏫</span>50+ colleges in Bhopal listed</span>
  <span class="ticker-item"><span>✅</span>500+ students guided</span>
  <span class="ticker-item"><span>💼</span>New Bhopal jobs added daily</span>
  <span class="ticker-item"><span>🎯</span>Direct college tie-ups — no hidden fees</span>
  <span class="ticker-item"><span>📋</span>Project & thesis support available</span>
</div></div>`;

const WA_FLOAT_HTML = `<div class="wa-float">
  <div class="wa-pill" id="waPill">Chat with us! ✨</div>
  <a href="https://wa.me/918223063535?text=Hi!%20I%20need%20career%20guidance." target="_blank" class="wa-fab" title="WhatsApp">
    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>
</div>`;

const FOOTER_HTML = `<footer>
  <div class="mw">
    <div class="ft-grid">
      <div>
        <div class="ft-logo"><img src="/images/logo.jpg" alt="ir-pt Edtech"><div class="ft-brand">ir-pt <em>Edtech</em></div></div>
        <div class="ft-tag">"We Can Help You Find Your Dream Career"</div>
        <p class="ft-p">Bhopal's trusted career guidance & college admission consultancy. Turning confusion into clarity since 2022.</p>
        <div class="ft-contact">
          <a href="https://wa.me/918223063535" target="_blank">💬 WhatsApp: 82230 63535</a>
          <a href="tel:8223063535">📞 82230 63535</a>
          <a href="mailto:edu.irpt@gmail.com">✉ edu.irpt@gmail.com</a>
          <a>📍 LG-03, Sagar Landmark Complex, Ayodhya Bypass Rd, Bhopal</a>
        </div>
      </div>
      <div class="ft-col"><h4>Services</h4><ul>
        <li><a href="/services.html">Career Counselling</a></li>
        <li><a href="/services.html">College Admissions</a></li>
        <li><a href="/services.html">Project & Thesis Help</a></li>
        <li><a href="/services.html">Placement Support</a></li>
        <li><a href="/jobs.html">Job Finder</a></li>
      </ul></div>
      <div class="ft-col"><h4>Quick Links</h4><ul>
        <li><a href="/colleges.html">Find Colleges</a></li>
        <li><a href="/jobs.html">Bhopal Jobs</a></li>
        <li><a href="/track.html">Track Status</a></li>
        <li><a href="/news.html">News</a></li>
        <li><a href="/faq.html">FAQ</a></li>
       
      </ul></div>
      <div class="ft-col"><h4>Top Courses</h4><ul>
        <li><a href="/colleges.html?course=B.Tech">B.Tech Bhopal</a></li>
        <li><a href="/colleges.html?course=BCA">BCA Colleges</a></li>
        <li><a href="/colleges.html?course=MBA">MBA Admissions</a></li>
        <li><a href="/colleges.html?course=BBA">BBA Colleges</a></li>
        <li><a href="/colleges.html?course=B.Sc">B.Sc Programs</a></li>
      </ul></div>
    </div>
    <div class="ft-bot">
      <p>© 2025 ir-pt Edtech. All rights reserved.</p>
      <div class="ft-tline">✦ We Can Help You Find Your Dream Career ✦</div>
    </div>
  </div>
</footer>`;

/* ── DOM ready: inject shared elements ───────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const inject = id => document.getElementById(id);
  if (inject('nav-slot'))    inject('nav-slot').innerHTML    = NAV_HTML;
  if (inject('ticker-slot')) inject('ticker-slot').innerHTML = TICKER_HTML;
  if (inject('wa-slot'))     inject('wa-slot').innerHTML     = WA_FLOAT_HTML;
  if (inject('footer-slot')) inject('footer-slot').innerHTML = FOOTER_HTML;
  initNav();
  initReveal();
  initCounters();
  initWaPill();
});
