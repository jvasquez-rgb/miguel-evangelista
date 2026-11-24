(function () {
  // Número de WhatsApp de Miguel con código de país, solo dígitos (ej: 56912345678).
  // Mientras esté vacío, el formulario abre su enlace de WhatsApp sin el mensaje.
  var WA_NUMERO = '';
  var WA_FALLBACK = 'https://wa.me/message/YCGHCQOXYPEAG1';

  // ---- Banner ----
  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  var cur = 0, timer;
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.hidden = k !== cur; s.classList.toggle('is-active', k === cur); });
    tabs.forEach(function (t, k) { t.setAttribute('aria-pressed', k === cur ? 'true' : 'false'); });
    slides[cur].querySelectorAll('.me-up,.me-up2,.me-up3,.me-img').forEach(function (el) {
      el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    });
  }
  function restart() { clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 8000); }
  tabs.forEach(function (t) { t.addEventListener('click', function () { go(+t.dataset.goto); restart(); }); });
  document.querySelectorAll('[data-action="prev"]').forEach(function (b) { b.addEventListener('click', function () { go(cur - 1); restart(); }); });
  document.querySelectorAll('[data-action="next"]').forEach(function (b) { b.addEventListener('click', function () { go(cur + 1); restart(); }); });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) restart();

  // ---- Filtros de servicios ----
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  var cards = [].slice.call(document.querySelectorAll('.service'));
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.dataset.filter;
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      cards.forEach(function (card) { card.hidden = !(f === 'Todos' || card.dataset.cat === f); });
    });
  });

  // ---- Videos: reproducir sin sonido ----
  document.querySelectorAll('video').forEach(function (v) {
    v.muted = true; v.defaultMuted = true;
    var p = v.play && v.play(); if (p && p.catch) p.catch(function () {});
  });

  // ---- Formulario de cotización ----
  var LISTS = {
    Servicio: cards.map(function (c) { return c.querySelector('h3').textContent.trim(); }),
    Producto: [].slice.call(document.querySelectorAll('#productos h3')).map(function (h) { return h.textContent.trim(); }),
    Clase: ['Luxury Experience', 'Master Class', 'Advanced Digital Masterclass', 'Curso VIP']
  };
  var modal = document.getElementById('quote');
  var form = document.getElementById('quoteForm');
  var itemsBox = document.getElementById('qItems');
  var errBox = document.getElementById('qError');
  var typeLabel = document.getElementById('qTypeLabel');
  var qType = 'Servicio', qItem = '', lastFocus = null;

  function renderItems() {
    document.querySelectorAll('[data-qtype]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.qtype === qType ? 'true' : 'false'); });
    typeLabel.textContent = qType === 'Clase' ? 'clase' : qType === 'Producto' ? 'producto' : 'servicio';
    itemsBox.innerHTML = '';
    LISTS[qType].forEach(function (name) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pill'; b.textContent = name;
      b.setAttribute('aria-pressed', name === qItem ? 'true' : 'false');
      b.addEventListener('click', function () { qItem = name; renderItems(); });
      itemsBox.appendChild(b);
    });
  }
  function openQuote(type, item) {
    qType = type || 'Servicio'; qItem = item || '';
    errBox.hidden = true; renderItems();
    lastFocus = document.activeElement;
    modal.hidden = false; document.body.classList.add('modal-open');
    setTimeout(function () { document.getElementById('qName').focus(); }, 50);
  }
  function closeQuote() {
    modal.hidden = true; document.body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('[data-quote-type]').forEach(function (b) {
    b.addEventListener('click', function () { openQuote(b.dataset.quoteType, b.dataset.quoteItem); });
  });
  document.querySelectorAll('[data-qtype]').forEach(function (b) {
    b.addEventListener('click', function () { qType = b.dataset.qtype; qItem = ''; renderItems(); });
  });
  modal.querySelector('[data-action="close"]').addEventListener('click', closeQuote);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeQuote(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeQuote(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.qName.value.trim(), phone = form.qPhone.value.trim(), email = form.qEmail.value.trim(), msg = form.qMsg.value.trim();
    var err = '';
    if (!qItem) err = 'Elige qué te interesa cotizar.';
    else if (name.length < 2) err = 'Escribe tu nombre.';
    else if (phone.replace(/\D/g, '').length < 8) err = 'Escribe un teléfono válido.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err = 'Escribe un correo válido.';
    if (err) { errBox.textContent = err; errBox.hidden = false; return; }
    var text = 'Hola Miguel, quiero cotizar:\n• ' + qType + ': ' + qItem + '\n\nNombre: ' + name + '\nTeléfono: ' + phone + '\nCorreo: ' + email + (msg ? '\nMensaje: ' + msg : '');
    var num = WA_NUMERO.replace(/\D/g, '');
    var url = num ? 'https://wa.me/' + num + '?text=' + encodeURIComponent(text) : WA_FALLBACK;
    window.open(url, '_blank', 'noopener');
    closeQuote(); form.reset();
  });
})();
