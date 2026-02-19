/**
 * Smooth scroll, contact form feedback, hamburger menu, freeform links.
 */
(function () {
  'use strict';

  var MOBILE_BREAK = 600;

  // ——— Language switcher UI: only one visible (dropdown on mobile, buttons on desktop) ———
  function updateLangSwitcherVisibility() {
    var isMobile = window.innerWidth <= MOBILE_BREAK;
    var select = document.getElementById('script-select');
    var switcher = document.querySelector('.script-switcher');
    if (select) select.style.setProperty('display', isMobile ? 'block' : 'none', 'important');
    if (switcher) switcher.style.setProperty('display', isMobile ? 'none' : 'flex', 'important');
  }
  updateLangSwitcherVisibility();
  window.addEventListener('resize', updateLangSwitcherVisibility);

  // ——— Freeform links: one config drives worker / service / contact ———
  var siteLinksEl = document.getElementById('site-links');
  if (siteLinksEl && siteLinksEl.textContent) {
    try {
      var siteLinks = JSON.parse(siteLinksEl.textContent.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
      var keyMap = { worker: 'linkWorker', service: 'linkService', contact: 'linkContact' };
      document.querySelectorAll('[data-link="worker"], [data-link="service"], [data-link="contact"]').forEach(function (el) {
        var key = keyMap[el.getAttribute('data-link')];
        if (key && siteLinks[key]) el.setAttribute('href', siteLinks[key]);
      });
    } catch (e) {}
  }

  // ——— Smooth scroll for anchor links ———
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var header = document.querySelector('.header');
        if (header && header.classList.contains('open')) {
          header.classList.remove('open');
          document.querySelector('.hamburger').setAttribute('aria-expanded', 'false');
          document.getElementById('nav-menu').setAttribute('aria-hidden', 'true');
        }
      }
    });
  });

  // ——— Hamburger menu ———
  var hamburger = document.querySelector('.hamburger');
  var header = document.querySelector('.header');
  var nav = document.getElementById('nav-menu');

  if (hamburger && header && nav) {
    hamburger.addEventListener('click', function () {
      var isOpen = header.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      nav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });
  }

  // ——— Contact forms (Formspree) + success message ———
  function handleFormSubmit(form, successEl) {
    if (!form || !successEl) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(form);
      var action = form.getAttribute('action');
      var msgSuccess = (window.i18nGetString && window.i18nGetString('formSuccess')) || 'Hvala, javićemo vam se uskoro.';
      var msgError = (window.i18nGetString && window.i18nGetString('formError')) || 'Došlo je do greške. Pokušajte ponovo.';
      if (!action || action.indexOf('YOUR_FORM_ID') !== -1) {
        successEl.hidden = false;
        successEl.textContent = msgSuccess;
        form.reset();
        return;
      }
      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            successEl.hidden = false;
            successEl.textContent = msgSuccess;
            form.reset();
          } else {
            successEl.hidden = false;
            successEl.textContent = msgError;
          }
        })
        .catch(function () {
          successEl.hidden = false;
          successEl.textContent = msgError;
        });
    });
  }

  var mainForm = document.getElementById('contact-form');
  var mainSuccess = document.getElementById('form-success');
  if (mainForm && mainSuccess) handleFormSubmit(mainForm, mainSuccess);

  document.querySelectorAll('.form-section-form').forEach(function (form) {
    var wrap = form.closest('.form-section-form-wrap');
    var success = wrap ? wrap.querySelector('.form-section-success') : null;
    if (success) handleFormSubmit(form, success);
  });

  // ——— Gallery carousel (arrows) ———
  var track = document.querySelector('.gallery-track');
  var prevBtn = document.querySelector('.gallery-prev');
  var nextBtn = document.querySelector('.gallery-next');
  var counterEl = document.querySelector('.gallery-current');
  var total = document.querySelectorAll('.gallery-slide').length;
  var current = 0;

  function setSlide(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    if (track) track.style.transform = 'translateX(-' + current * 100 + '%)';
    if (counterEl) counterEl.textContent = current + 1;
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { setSlide(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { setSlide(current + 1); });
  setSlide(0);

  // ——— Form section: match image column height to form (so image does not extend past Pošalji) ———
  function matchFormImageHeights() {
    document.querySelectorAll('.form-section-grid').forEach(function (grid) {
      if (grid.offsetWidth < 700) return;
      var formWrap = grid.querySelector('.form-section-form-wrap');
      var imageWrap = grid.querySelector('.form-section-image');
      if (formWrap && imageWrap) {
        imageWrap.style.height = formWrap.offsetHeight + 'px';
      }
    });
  }
  matchFormImageHeights();
  window.addEventListener('resize', matchFormImageHeights);
})();
