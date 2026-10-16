(() => {
  const qs = (selector, context = document) => context.querySelector(selector);
  const qsa = (selector, context = document) => [...context.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const menuButton = qs('.menu-button');
  const mobileNav = qs('#mobile-nav');
  let menuReturnFocus = null;

  function closeMenu({ returnFocus = false } = {}) {
    if (mobileNav.hidden) return;
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Menü öffnen');
    document.body.classList.remove('menu-open');
    if (returnFocus && menuReturnFocus) menuReturnFocus.focus();
  }

  menuButton.addEventListener('click', () => {
    const opening = mobileNav.hidden;
    if (opening) menuReturnFocus = document.activeElement;
    mobileNav.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Menü schließen' : 'Menü öffnen');
    document.body.classList.toggle('menu-open', opening);
    if (opening) qs('a', mobileNav)?.focus();
  });
  qsa('a', mobileNav).forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu({ returnFocus: true });
  });
  document.addEventListener('click', event => {
    if (!mobileNav.hidden && !mobileNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  addEventListener('resize', () => {
    if (innerWidth >= 1200) closeMenu();
  });

  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px 60px' });
    qsa('.reveal').forEach(item => observer.observe(item));
  } else {
    qsa('.reveal').forEach(item => item.classList.add('is-visible'));
  }

  const slider = qs('[data-slider]');
  const track = qs('[data-slider-track]');
  const slides = qsa('.gallery-slide', track);
  const currentOutput = qs('[data-slider-current]');
  const totalOutput = qs('[data-slider-total]');
  let current = 0;
  let startX = 0;
  let pointerDelta = 0;

  totalOutput.textContent = String(slides.length).padStart(2, '0');

  function slideOffset(index) {
    const first = slides[0];
    return slides[index].offsetLeft - first.offsetLeft;
  }

  function updateSlider(index, animate = true) {
    current = (index + slides.length) % slides.length;
    if (!animate) track.style.transition = 'none';
    track.style.transform = `translate3d(${-slideOffset(current)}px,0,0)`;
    currentOutput.textContent = String(current + 1).padStart(2, '0');
    slides.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== current)));
    if (!animate) requestAnimationFrame(() => { track.style.transition = ''; });
  }

  qs('[data-slider-prev]').addEventListener('click', () => updateSlider(current - 1));
  qs('[data-slider-next]').addEventListener('click', () => updateSlider(current + 1));
  slider.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); updateSlider(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); updateSlider(current + 1); }
    if (event.key === 'Home') { event.preventDefault(); updateSlider(0); }
    if (event.key === 'End') { event.preventDefault(); updateSlider(slides.length - 1); }
  });
  slider.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    startX = event.clientX;
    pointerDelta = 0;
    slider.setPointerCapture(event.pointerId);
    track.style.transition = 'none';
  });
  slider.addEventListener('pointermove', event => {
    if (!slider.hasPointerCapture(event.pointerId)) return;
    pointerDelta = event.clientX - startX;
    track.style.transform = `translate3d(${pointerDelta - slideOffset(current)}px,0,0)`;
  });
  slider.addEventListener('pointerup', event => {
    if (!slider.hasPointerCapture(event.pointerId)) return;
    slider.releasePointerCapture(event.pointerId);
    track.style.transition = '';
    if (Math.abs(pointerDelta) > Math.min(90, innerWidth * .15)) updateSlider(current + (pointerDelta < 0 ? 1 : -1));
    else updateSlider(current);
  });
  addEventListener('resize', () => updateSlider(current, false));
  updateSlider(0, false);

  const lightbox = qs('#lightbox');
  const lightboxImage = qs('img', lightbox);
  const lightboxCaption = qs('p', lightbox);
  qsa('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = qs('img', button).alt;
    lightboxCaption.textContent = button.closest('figure').querySelector('figcaption').textContent;
    lightbox.showModal();
  }));
  qs('.lightbox-close', lightbox).addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });

  const form = qs('#event-form');
  const result = qs('#request-result');
  const resultText = qs('#request-text');
  const copyButton = qs('#copy-request');
  let preparedRequest = '';

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const services = data.getAll('service');
    preparedRequest = [
      'EVENTANFRAGE – MANAGE IT WEILBURG E.V.',
      '',
      `Name: ${data.get('name')}`,
      `E-Mail: ${data.get('email')}`,
      `Telefon: ${data.get('phone') || 'Nicht angegeben'}`,
      `Art des Events: ${data.get('kind')}`,
      `Wunschtermin: ${data.get('date') || 'Noch offen'}`,
      `Gästezahl: ${data.get('guests') || 'Noch offen'}`,
      `Gewünschte Leistungen: ${services.length ? services.join(', ') : 'Noch offen / Beratung erwünscht'}`,
      '',
      'Nachricht:',
      data.get('message') || 'Keine weiteren Angaben'
    ].join('\n');
    resultText.textContent = preparedRequest;
    result.hidden = false;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  });

  copyButton.addEventListener('click', async () => {
    if (!preparedRequest) return;
    try {
      await navigator.clipboard.writeText(preparedRequest);
      showToast('Anfragetext wurde kopiert.');
    } catch {
      const temporary = document.createElement('textarea');
      temporary.value = preparedRequest;
      temporary.style.position = 'fixed';
      temporary.style.left = '-9999px';
      document.body.appendChild(temporary);
      temporary.select();
      const copied = document.execCommand('copy');
      temporary.remove();
      showToast(copied ? 'Anfragetext wurde kopiert.' : 'Bitte markieren Sie den Text und kopieren Sie ihn manuell.');
    }
  });

  const toast = qs('.toast');
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3600);
  }

  qsa('[data-legal]').forEach(button => button.addEventListener('click', () => {
    showToast(`${button.dataset.legal} wird nach rechtlicher Prüfung ergänzt.`);
  }));

  qs('#year').textContent = new Date().getFullYear();
})();
