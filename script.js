// Small JS for header behavior, mobile menu, and form handling

document.addEventListener('DOMContentLoaded', function(){
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // Header scroll effect
  const onScroll = () => {
    if(window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){
      mobileMenu.style.display = 'block';
      // focus first link for keyboard users
      const firstLink = mobileMenu.querySelector('a');
      firstLink && firstLink.focus();
    } else {
      mobileMenu.style.display = 'none';
      hamburger.focus();
    }
  });

  // Close mobile menu on resize > tablet
  window.addEventListener('resize', () => {
    if(window.innerWidth >= 768){
      hamburger.setAttribute('aria-expanded','false');
      mobileMenu.style.display = 'none';
    }
  });

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href').slice(1);
      if(!targetId) return;
      const target = document.getElementById(targetId);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile menu if open
        if(window.innerWidth < 768){
          hamburger.setAttribute('aria-expanded','false');
          mobileMenu.style.display = 'none';
        }
      }
    });
  });

  // Contact form handling (simple, client-side feedback)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if(form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Sending…';
      const action = form.getAttribute('action');

      // If user didn't configure a server endpoint, fall back to mailto (opens email client).
      if(!action || action === 'ACTION_URL'){
        status.textContent = 'No form action configured — opening your email client as a fallback.';
        const name = encodeURIComponent(form.name.value || '');
        const email = encodeURIComponent(form.email.value || '');
        const message = encodeURIComponent(form.message.value || '');
        const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
        window.location.href = `mailto:you@example.com?subject=${encodeURIComponent('Message from portfolio site')}&body=${body}`;
        return;
      }

      // Try to POST using fetch (CORS and endpoint must be configured)
      try{
        const formData = new FormData(form);
        const res = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if(res.ok){
          status.textContent = 'Message sent — thank you!';
          form.reset();
        } else {
          const data = await res.json().catch(()=>null);
          status.textContent = data && data.error ? `Error: ${data.error}` : 'There was an error submitting the form.';
        }
      }catch(err){
        status.textContent = 'Network error while sending the message.';
      }
    });
  }

  // Insert current year in footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
});
