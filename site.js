// Snurrande vinyl (om den finns på sidan)
document.addEventListener('DOMContentLoaded', () => {
  const platter = document.getElementById('platter');
  if (platter) {
    platter.addEventListener('click', () => platter.classList.toggle('playing'));
  }

  // Kontaktformulär (statisk sida — ingen backend, ger bara visuell bekräftelse)
  const contactBtn = document.querySelector('.contact-form button');
  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      contactBtn.textContent = 'Tack! Vi hör av oss.';
      contactBtn.disabled = true;
    });
  }

  // Koppla "Köp nu"-knappar till Stripe Payment Links, se stripe-config.js
  document.querySelectorAll('.buy-btn[data-stripe]').forEach(btn => {
    const slug = btn.getAttribute('data-stripe');
    const url = (typeof STRIPE_LINKS !== 'undefined') ? STRIPE_LINKS[slug] : '';
    if (url && url.trim() !== '') {
      btn.href = url.trim();
      btn.target = '_blank';
      btn.rel = 'noopener';
    } else {
      btn.classList.add('soon');
      btn.textContent = 'Kommer snart';
      btn.addEventListener('click', (e) => e.preventDefault());
    }
  });

  // Markera aktiv sida i menyn
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.links a, .mobile-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Mobilmeny
  const toggle = document.querySelector('.mobile-toggle');
  const mobileLinks = document.querySelector('.mobile-links');
  if (toggle && mobileLinks) {
    toggle.addEventListener('click', () => mobileLinks.classList.toggle('open'));
  }
});
