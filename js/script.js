// Small JavaScript for mobile nav toggle and smooth scrolling

document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-nav');
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){
      nav.style.display = 'block';
    } else {
      nav.style.display = '';
    }
  });

  // Smooth scrolling for all anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const hash = this.getAttribute('href');
      if(hash.length > 1){
        e.preventDefault();
        const elem = document.querySelector(hash);
        if(elem){
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // close nav on mobile
        if(window.innerWidth <= 768){
          nav.style.display = '';
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Fill in the current year in the footer
  const yearSpan = document.getElementById('year');
  if(yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Add alternating classes to timeline items (left / right)
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, i) => {
    item.classList.add(i % 2 === 0 ? 'left' : 'right');
    item.classList.add('reveal');
  });

  // Mark main sections for reveal
  document.querySelectorAll('main > section').forEach(s => s.classList.add('reveal'));

  // Reveal on scroll using IntersectionObserver
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Active nav highlight (observe sections)
  const navLinks = document.querySelectorAll('.primary-nav a');
  const sections = document.querySelectorAll('main section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => sectionObserver.observe(s));

  // Theme toggle logic (localStorage + prefers-color-scheme)
  const themeToggle = document.getElementById('theme-toggle');
  const ROOT = document.documentElement;
  function applyTheme(theme){
    // Normalize to 'light' or 'dark'
    const t = theme === 'light' ? 'light' : 'dark';
    ROOT.setAttribute('data-theme', t);
    themeToggle.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
    localStorage.setItem('theme', t);
  }

  function initTheme(){
    const saved = localStorage.getItem('theme');
    if(saved === 'light' || saved === 'dark'){
      applyTheme(saved);
    } else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
      applyTheme('light');
    } else {
      applyTheme('dark');
    }
  }

  initTheme();

  if(themeToggle){
    themeToggle.addEventListener('click', () => {
      const current = ROOT.getAttribute('data-theme');
      const newTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }
});
