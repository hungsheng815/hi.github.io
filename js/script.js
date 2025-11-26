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
});
