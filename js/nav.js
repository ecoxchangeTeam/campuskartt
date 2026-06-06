/**
 * Campus Kartt — Global Navigation & Footer Logic
 * Ported from college-community/static/javascripts/browse.js
 * Enhanced with DTU Red theme, GSAP ScrollTrigger sections, and MCE badge
 */

/* ── Navbar HTML Template ── */
const CK_NAV_HTML = (activePage = '') => `
<header class="ck-header" id="ck-header">
  <div class="ck-navbar">
    <!-- Logo -->
    <a href="/app/browse.html" class="ck-logo">
      <div class="ck-logo-main">
        <span class="campus">Campus&nbsp;</span><span class="kartt">Kartt</span>
      </div>
      <span class="ck-dtu-badge">DTU</span>
    </a>

    <!-- Integrated Search Bar -->
    <div class="ck-search-bar" id="ck-desktop-search">
      <span class="ck-search-icon">
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </span>
      <input type="text" id="ck-search-desktop" placeholder="Search legacy gear, drafters, lab coats…"
        oninput="ckSearchInput(this.value)" onkeydown="ckSearchKeydown(event)" />
    </div>

    <!-- Desktop Nav -->
    <nav class="ck-nav-menu">
      <a href="/app/browse.html"    class="ck-nav-link ${activePage==='browse'?'active':''}"   id="ck-link-browse">Legacy Market</a>
      <a href="/app/post.html"      class="ck-nav-link ${activePage==='post'?'active':''}"     id="ck-link-post">Sell an Item</a>
      <a href="/app/dashboard.html" class="ck-nav-link ${activePage==='dash'?'active':''}"     id="ck-link-dash">Student Dashboard</a>
    </nav>

    <!-- MCE Badge + Right Controls -->
    <div class="ck-nav-right">
      <div class="ck-mce-badge">
        <span class="mce-dot"></span>DTU Community
      </div>
      <a href="/app/post.html" class="btn btn-primary btn-sm" style="white-space:nowrap; display:${activePage==='post'?'none':'inline-flex'};">+ List Gear</a>
      <div class="dropdown" id="ck-user-dropdown">
        <a class="ck-user-icon" id="ck-user-avatar" onclick="ckToggleDropdown(event)" title="My Account">?</a>
        <div class="dropdown-menu hidden" id="ck-dropdown-menu">
          <div class="dropdown-item" id="ck-user-name" style="font-weight:700; pointer-events:none; color:var(--red); font-family:'JetBrains Mono'; font-size:0.72rem; letter-spacing:0.06em;">Loading…</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" onclick="location.href='/app/dashboard.html'">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Student Dashboard
          </div>
          <div class="dropdown-item" onclick="location.href='/app/post.html'">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Sell an Item
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item danger" onclick="ckLogout()">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Sign Out
          </div>
        </div>
      </div>
      <!-- Mobile toggle -->
      <button class="ck-menu-toggle" id="ck-menu-toggle" aria-label="Toggle menu" onclick="ckToggleMobileMenu()">
        <svg id="ck-icon-bars" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        <svg id="ck-icon-times" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="display:none"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  </div>

  <!-- Mobile Slide-Out Menu -->
  <div class="ck-mobile-menu" id="ck-mobile-menu">
    <div class="ck-mobile-search">
      <input type="text" id="ck-search-mobile" placeholder="Search legacy gear…"
        oninput="ckSearchInput(this.value)" onkeydown="ckSearchKeydown(event)" />
    </div>
    <a href="/app/browse.html"    class="ck-mobile-nav-link ${activePage==='browse'?'active':''}">⚡ Legacy Market</a>
    <a href="/app/post.html"      class="ck-mobile-nav-link ${activePage==='post'?'active':''}"  >🛒 Sell an Item</a>
    <a href="/app/dashboard.html" class="ck-mobile-nav-link ${activePage==='dash'?'active':''}"  >🎓 Student Dashboard</a>
    <a href="/app/post.html" class="ck-mobile-cta">+ Sell an Item ⚡</a>
  </div>
</header>
`;

/* ── Footer HTML Template ── */
const CK_FOOTER_HTML = () => `
<footer class="ck-footer">
  <div class="ck-footer-grid">
    <!-- Brand col -->
    <div class="ck-footer-brand">
      <div class="ck-footer-logo"><span class="campus">Campus&nbsp;</span><span class="kartt">Kartt</span></div>
      <p>Delhi Technological University's premier marketplace for Legacy Gear. Pass your drafter to a junior. Find a lab coat before Semester 3.</p>
      <div class="ck-social-links">
        <a href="#" title="Instagram">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <a href="#" title="Twitter/X">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="#" title="LinkedIn">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
      </div>
      <div class="ck-footer-powered">An <span>Campus Kartt</span> Initiative</div>
    </div>

    <!-- Quick Links -->
    <div class="ck-footer-col">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="/index.html">Campus Home</a></li>
        <li><a href="/app/browse.html">Legacy Market</a></li>
        <li><a href="/app/post.html">Sell an Item</a></li>
        <li><a href="/app/dashboard.html">Student Dashboard</a></li>
      </ul>
    </div>

    <!-- Information -->
    <div class="ck-footer-col">
      <h3>Information</h3>
      <ul>
        <li><a href="#">About Kartt</a></li>
        <li><a href="#">How It Works</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Service</a></li>
        <li><a href="#">FAQ</a></li>
      </ul>
    </div>

    <!-- Newsletter -->
    <div class="ck-footer-col">
      <h3>Stay in the Loop</h3>
      <p style="font-size:0.78rem; color:rgba(176,176,176,0.40); margin-bottom:0.75rem; line-height:1.6; font-family:'Space Grotesk';">
        Get notified when seniors post new Legacy Gear — drafters, lab coats, cycles.
      </p>
      <form class="ck-newsletter-form" onsubmit="ckNewsletterSubmit(event)">
        <input type="email" id="ck-newsletter-email" placeholder="your@dtu.ac.in" required />
        <button type="submit" title="Subscribe">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        </button>
      </form>
    </div>
  </div>

  <div class="ck-footer-bottom">
    <div class="ck-footer-copy">© <span id="ck-year"></span> Campus Kartt — Delhi Technological University</div>
    <div class="ck-footer-mce"><span class="dot"></span>DTU Students Community</div>
  </div>
</footer>
`;

/* ── Inject Nav & Footer ── */
function ckInjectNav(activePage) {
  const existing = document.getElementById('ck-header');
  if (existing) return; // Already injected (e.g. done inline)
  document.body.insertAdjacentHTML('afterbegin', CK_NAV_HTML(activePage));
}

function ckInjectFooter() {
  const existing = document.querySelector('.ck-footer');
  if (existing) return;
  document.body.insertAdjacentHTML('beforeend', CK_FOOTER_HTML());
  const yearEl = document.getElementById('ck-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ── Scroll: header solidify ── */
function ckInitScroll() {
  const header = document.getElementById('ck-header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Mobile Menu Toggle ── */
function ckToggleMobileMenu() {
  const menu = document.getElementById('ck-mobile-menu');
  const bars = document.getElementById('ck-icon-bars');
  const times = document.getElementById('ck-icon-times');
  if (!menu) return;
  const isOpen = menu.classList.toggle('active');
  if (bars)  bars.style.display  = isOpen ? 'none' : 'block';
  if (times) times.style.display = isOpen ? 'block' : 'none';
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  const menu   = document.getElementById('ck-mobile-menu');
  const toggle = document.getElementById('ck-menu-toggle');
  if (menu && menu.classList.contains('active') && toggle) {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('active');
      const bars  = document.getElementById('ck-icon-bars');
      const times = document.getElementById('ck-icon-times');
      if (bars)  bars.style.display  = 'block';
      if (times) times.style.display = 'none';
    }
  }
});

// Close mobile menu when any mobile link is clicked
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('ck-mobile-nav-link') || e.target.classList.contains('ck-mobile-cta')) {
    const menu = document.getElementById('ck-mobile-menu');
    if (menu) menu.classList.remove('active');
  }
});

/* ── User Dropdown ── */
function ckToggleDropdown(e) {
  e.stopPropagation();
  document.getElementById('ck-dropdown-menu')?.classList.toggle('hidden');
}
document.addEventListener('click', () => {
  document.getElementById('ck-dropdown-menu')?.classList.add('hidden');
});

/* ── Search ── */
let ckSearchTimeout;
function ckSearchInput(val) {
  // Sync both search bars
  const desktop = document.getElementById('ck-search-desktop');
  const mobile  = document.getElementById('ck-search-mobile');
  if (desktop && document.activeElement !== desktop) desktop.value = val;
  if (mobile  && document.activeElement !== mobile)  mobile.value  = val;

  clearTimeout(ckSearchTimeout);
  ckSearchTimeout = setTimeout(() => {
    if (typeof handleSearch === 'function') handleSearch(val);
    else if (typeof applyFilters === 'function') applyFilters();
  }, 260);
}
function ckSearchKeydown(e) {
  if (e.key === 'Enter') { e.preventDefault(); ckSearchInput(e.target.value); }
}

/* ── Populate user info in navbar ── */
async function ckPopulateUser() {
  try {
    if (typeof supabaseClient === 'undefined') return;
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;
    const avatar = document.getElementById('ck-user-avatar');
    const name   = document.getElementById('ck-user-name');
    try {
      const profile = await getUserProfile(user.id);
      if (profile?.full_name) {
        const initials = profile.full_name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
        if (avatar) avatar.textContent = initials;
        if (name)   name.textContent   = profile.full_name;
      } else {
        if (avatar) avatar.textContent = user.email[0].toUpperCase();
        if (name)   name.textContent   = user.email;
      }
    } catch(e) {
      if (avatar) avatar.textContent = user.email[0].toUpperCase();
    }
  } catch(e) {}
}

/* ── Logout ── */
async function ckLogout() {
  if (typeof supabaseClient !== 'undefined') await supabaseClient.auth.signOut();

  // ── Federated Single Log-Out (SLO) with EcoXchange ──
  // Next.js (EcoXchange) development server runs on http://localhost:3000
  const ECOXCHANGE_DEV_URL = 'http://localhost:3000';
  const ECOXCHANGE_PROD_URL = 'https://www.ecoxchange.in';

  let targetUrl = ECOXCHANGE_DEV_URL;
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    targetUrl = ECOXCHANGE_PROD_URL;
  }

  const returnUrl = encodeURIComponent(window.location.origin + '/app/login.html');
  window.location.href = `${targetUrl}/api/auth/signout?callbackUrl=${returnUrl}`;
}

/* ── Newsletter ── */
function ckNewsletterSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('ck-newsletter-email');
  if (!input?.value) return;
  ckShowToast('✓ You\'re on the list! We\'ll ping you when new gear drops.', 'success');
  input.value = '';
}

/* ── Global Toast (if not already defined) ── */
function ckShowToast(msg, type = 'success') {
  if (typeof showToast === 'function') { showToast(msg, type); return; }
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

/* ── GSAP Section Scroll-Trigger Fade-Slide (from browse.js pattern) ── */
function ckInitGSAP() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // All [data-ck-animate] sections fade+slide up on scroll
  gsap.utils.toArray('[data-ck-animate]').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 48 },
      {
        opacity: 1, y: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  });

  // Filled/outline scroll parallax text (from browse.js)
  document.querySelectorAll('.filled-text, .outline-text').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
      x: 160,
    });
  });
}

/* ── Init everything ── */
document.addEventListener('DOMContentLoaded', () => {
  ckInitScroll();
  ckInitGSAP();
  // Populate footer year
  const yr = document.getElementById('ck-year');
  if (yr) yr.textContent = new Date().getFullYear();
  // Set active link based on path
  const path = window.location.pathname;
  document.querySelectorAll('.ck-nav-link, .ck-mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (path.includes('browse') && href.includes('browse')) link.classList.add('active');
    if (path.includes('post') && href.includes('post')) link.classList.add('active');
    if (path.includes('dashboard') && href.includes('dashboard')) link.classList.add('active');
  });
});
