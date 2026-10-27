// Azulì — animations au scroll, en-tête, barre de progression, parallaxe, réservation
(function () {
  var doc = document, win = window;
  var GOLD = '#D4B26A';
  var reduce = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Révélation au scroll (le contenu reste visible si le script ne tourne pas)
  if (!reduce && 'IntersectionObserver' in win) {
    doc.documentElement.classList.add('az-js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          e.target.querySelectorAll(':scope > .az-curtain').forEach(function (c) { c.classList.add('is-in'); });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    // un élément masqué par clip-path n'est jamais « visible » : on observe son parent
    doc.querySelectorAll('.az-reveal, .az-curtain, .az-line').forEach(function (el) {
      io.observe(el.classList.contains('az-curtain') ? el.parentElement : el);
    });
  }

  // En-tête compact, barre de progression, parallaxe du hero
  var header = doc.querySelector('.az-header');
  var bar = doc.querySelector('.az-progress');
  var par = doc.querySelector('.az-parallax');
  var ticking = false;
  function update() {
    ticking = false;
    var y = win.scrollY || doc.documentElement.scrollTop || 0;
    var max = Math.max(1, doc.documentElement.scrollHeight - win.innerHeight);
    if (bar) bar.style.transform = 'scaleX(' + Math.min(1, y / max).toFixed(4) + ')';
    if (header) header.classList.toggle('az-scrolled', y > 60);
    if (par && !reduce) par.style.transform = 'translate3d(0,' + (y * 0.3).toFixed(1) + 'px,0)';
  }
  function onScroll() { if (!ticking) { ticking = true; win.requestAnimationFrame(update); } }
  win.addEventListener('scroll', onScroll, { passive: true });
  win.addEventListener('resize', onScroll);
  update();

  // Réservation : choix du créneau et écran de confirmation
  var form = doc.getElementById('az-form');
  if (form) {
    var thanks = doc.getElementById('az-thanks');
    var label = doc.getElementById('az-slot-label');
    var slots = Array.prototype.slice.call(doc.querySelectorAll('[data-slot]'));
    var chosen = '20h00';
    function paint() {
      slots.forEach(function (b) {
        var on = b.textContent.trim() === chosen;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.style.background = on ? GOLD : 'transparent';
        b.style.color = on ? '#0D0C0A' : '#ECE4D3';
        b.style.borderColor = on ? GOLD : 'rgba(212,178,106,0.45)';
      });
    }
    slots.forEach(function (b) {
      b.addEventListener('click', function () { chosen = b.textContent.trim(); paint(); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (label) label.textContent = chosen;
      form.hidden = true;
      form.style.display = 'none';
      if (thanks) { thanks.hidden = false; thanks.style.display = 'flex'; }
    });
    if (thanks) thanks.style.display = 'none';
    paint();
  }
})();
