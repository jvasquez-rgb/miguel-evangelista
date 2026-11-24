/* Miguel Evangelista — comportamiento mobile y carga eficiente de videos */
(function () {
  var mq = window.matchMedia('(max-width: 767px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Videos: se cargan y reproducen solo cuando están a la vista (todas las pantallas) ----
  var vids = [].slice.call(document.querySelectorAll('video[data-lazy]'));
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src) { v.src = v.dataset.src; }
          v.muted = true;
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) { v.pause(); }
      });
    }, { rootMargin: '200px 0px', threshold: 0.15 });
    vids.forEach(function (v) { vio.observe(v); });
  } else {
    vids.forEach(function (v) { v.src = v.dataset.src; v.muted = true; v.play(); });
  }

  // ---- Menú ----
  var menu = document.getElementById('m-menu');
  var burger = document.querySelector('.m-burger');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('m-menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var c = menu.querySelector('.m-menu-close'); if (c) c.focus(); } else if (burger) { burger.focus({ preventScroll: true }); }
  }
  if (burger) burger.addEventListener('click', function () { setMenu(true); });
  if (menu) {
    menu.querySelector('.m-menu-close').addEventListener('click', function () { setMenu(false); });
    menu.querySelectorAll('nav a, .m-menu-cta').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
  }

  // ---- Barra inferior: aparece después del banner ----
  var hero = document.getElementById('top');
  function onScroll() {
    if (!hero) return;
    document.body.classList.toggle('m-past-hero', window.scrollY > hero.offsetHeight * 0.7);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Deslizar el banner con el dedo ----
  if (hero) {
    var x0 = null, y0 = null;
    hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        var b = hero.querySelector(dx < 0 ? '[data-action="next"]' : '[data-action="prev"]');
        if (b) b.click();
      }
      x0 = null;
    }, { passive: true });
  }

  // ---- Barras de progreso de los carruseles ----
  document.querySelectorAll('.m-rail').forEach(function (rail) {
    var bar = document.createElement('div');
    bar.className = 'm-only m-rail-bar' + (rail.dataset.dark ? ' on-dark' : '');
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<span></span>';
    rail.insertAdjacentElement('afterend', bar);
    var fill = bar.firstChild;
    function update() {
      var max = rail.scrollWidth - rail.clientWidth;
      var vis = rail.scrollWidth ? rail.clientWidth / rail.scrollWidth : 1;
      fill.style.width = Math.max(12, Math.min(100, vis * 100)) + '%';
      var room = bar.clientWidth - fill.offsetWidth;
      fill.style.transform = 'translateX(' + (max > 0 ? (rail.scrollLeft / max) * room : 0) + 'px)';
      bar.style.visibility = max > 4 ? 'visible' : 'hidden';
    }
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    rail.addEventListener('m-refresh', update);
    setTimeout(update, 100);
  });
  // al filtrar servicios, volver al inicio del carrusel
  document.querySelectorAll('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      var r = document.querySelector('.m-rail-svc');
      if (r) { r.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' }); setTimeout(function () { r.dispatchEvent(new Event('m-refresh')); }, 60); }
    });
  });

  // ---- Aparición progresiva al hacer scroll (solo mobile) ----
  if (mq.matches && !reduce && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('section h2, .m-sec-head > p, .m-card, .m-res-fig, .m-lux-media, .m-ing-media, .m-stats > div, .m-about-text > p, .m-loc > div');
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('m-in'); rio.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t, i) {
      if (t.closest('#top')) return;
      t.classList.add('m-rv');
      if (t.parentElement && t.parentElement.classList.contains('m-rail')) {
        var idx = [].indexOf.call(t.parentElement.children, t);
        t.style.transitionDelay = Math.min(idx, 3) * 0.08 + 's';
      }
      rio.observe(t);
    });
  }
})();
