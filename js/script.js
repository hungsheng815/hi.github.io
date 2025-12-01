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

  // Mark main sections and common elements for reveal
  document.querySelectorAll('main > section').forEach(s => s.classList.add('reveal'));
  // Add reveal to project cards, skill cards, nav links, buttons and logo for staggered animations
  document.querySelectorAll('.project-card, .skill, .primary-nav a, .btn, .logo, .hero-avatar, .timeline-item').forEach(el => el.classList.add('reveal'));

  // Reveal on scroll using IntersectionObserver, but respect prefers-reduced-motion and narrow viewports
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smallViewport = window.matchMedia('(max-width: 600px)').matches;

  const allRevealEls = Array.from(document.querySelectorAll('.reveal'));
  // Apply stagger delay for nicer entrance (only if can animate)
  if(!prefersReduced && !smallViewport){
    allRevealEls.forEach((el, i) => {
      const delay = (i % 6) * 80; // mod 6 to keep delays within a reasonable range per row
      el.style.animationDelay = delay + 'ms';
    });
  }
  if (prefersReduced || smallViewport) {
    // Immediately reveal everything without animation for accessibility and performance
    allRevealEls.forEach(el => el.classList.add('revealed'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Add subtle animate classes for extra polish
          entry.target.classList.add('animate-fade');
          // Stop observing after reveal to improve performance
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    allRevealEls.forEach((el) => revealObserver.observe(el));
  }

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
  // Add a small pop animation to the theme toggle on click
  if (themeToggle){
    themeToggle.addEventListener('click', () => {
      themeToggle.classList.add('animate-pop');
      setTimeout(()=> themeToggle.classList.remove('animate-pop'), 350);
    });
  }

  // Avatar modal open/close
  const avatar = document.querySelector('.hero-avatar img');
  const modal = document.getElementById('avatar-modal');
  const modalOverlay = document.querySelector('.avatar-modal-overlay');
  const modalClose = document.querySelector('.avatar-modal-close');
  const modalImg = document.querySelector('.avatar-full');

  function openModal(src){
    if(!modal) return;
    // If a src is provided, use it; otherwise fall back to avatar if available
    if(src && modalImg){
      modalImg.src = src;
    } else if(avatar && modalImg){
      modalImg.src = avatar.src;
    }
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.remove('closing');
    modal.classList.add('open');
    // trap focus to close
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    if(!modal) return;
    // If reduced motion or small viewport, skip exit animation
    if (prefersReduced || smallViewport){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if(avatar) avatar.focus?.();
      return;
    }
    modal.classList.remove('open');
    modal.classList.add('closing');
    // wait for animation end on content to finalize close
    const content = modal.querySelector('.avatar-modal-content');
    if(content){
      const onAnimEnd = (e) => {
        if(e.target !== content) return;
        content.removeEventListener('animationend', onAnimEnd);
        modal.classList.remove('closing');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if(avatar) avatar.focus?.();
      };
      content.addEventListener('animationend', onAnimEnd);
      // Fallback in case animationend doesn't fire
      setTimeout(() => {
        if(modal.classList.contains('closing')){
          modal.classList.remove('closing');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          if(avatar) avatar.focus?.();
        }
      }, 400);
    } else {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if(avatar) avatar.focus?.();
    }
  }

  if(avatar){
    avatar.style.cursor = 'pointer';
    avatar.addEventListener('click', () => openModal(avatar.src));
    avatar.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(avatar.src); } });
  }
  if(modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if(modalClose) modalClose.addEventListener('click', closeModal);
  // close on escape
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

  // Prevent animation on small screens (respect earlier boolean)
  if(smallViewport){
    if(modal) modal.style.animation = 'none';
  }

  // Project card 'View' buttons: optionally open image in modal
  document.querySelectorAll('.project-card .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.project-card');
      if(card){
        const img = card.querySelector('.project-image');
        if(img){
          openModal(img.src);
        }
      }
    });
  });
});

