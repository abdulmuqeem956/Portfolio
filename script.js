/* ============================================================
   AFTER CUTS STUDIO — script.js
   Handles: Loader · Navbar · Mobile Menu · Scroll Reveal
            Portfolio Lightbox · Footer Year
   NOTE   : Custom cursor animation removed as requested
============================================================ */

/* ─── 1. PAGE LOADER ────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');

  setTimeout(() => {
    loader.classList.add('hidden');

    // Trigger hero reveal animations after loader fades
    document.querySelectorAll('#hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 160);
    });
  }, 1860);
});


/* ─── 2. NAVBAR SCROLL ──────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ─── 3. MOBILE MENU ────────────────────────────────────────── */
const navToggle  = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ─── 4. SCROLL REVEAL ──────────────────────────────────────── */
/* ─── 4. SCROLL REVEAL (REPEATING) ─── */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // This removes the class when you scroll away, making it fade out
        entry.target.classList.remove('visible'); 
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
// Observe everything except hero (hero handled post-loader)
document.querySelectorAll(
  '.reveal-up:not(#hero .reveal-up), .reveal-left, .reveal-right'
).forEach(el => revealObserver.observe(el));


/* ─── 5. PORTFOLIO LIGHTBOX ─────────────────────────────────── */
const lightbox = document.getElementById('video-lightbox');
const iframe   = document.getElementById('lightbox-iframe');
const closeBtn = document.querySelector('.lightbox-close');
const backdrop = document.querySelector('.lightbox-backdrop');

document.querySelectorAll('.portfolio-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    try {
      const url     = new URL(link.href);
      const videoId = url.searchParams.get('v') || url.pathname.split('/').pop();
      if (videoId) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    } catch (err) {
      console.warn('Invalid video URL:', link.href);
    }
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  iframe.src = '';
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeLightbox);
backdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});


/* ─── 6. SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ─── 7. FOOTER YEAR ────────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


