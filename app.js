// Ahead Master Interactivity Script
(function () {
  'use strict';

  // 1. Mobile Menu Toggle
  var toggle = document.querySelector('.mobile-toggle');
  var nav = document.querySelector('nav.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('menu-open');
    });
  }

  // 2. Status Orb (Easter Egg ping reflecting live status)
  var orb = document.getElementById('statusOrb');
  if (orb) {
    fetch('https://web-production-5e0b.up.railway.app/api/v1/entries.json?count=1', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (data) {
        var entry = data && data[0];
        if (!entry || typeof entry.sgv !== 'number') return;
        var v = entry.sgv;
        var state = 'ok';
        if (v < 55 || v > 250) state = 'alert';
        else if (v < 70 || v > 180) state = 'warn';
        
        orb.className = 'status-orb ' + state;
        if (state === 'alert') orb.style.background = 'var(--red)';
        if (state === 'warn') orb.style.background = 'var(--amber)';
        if (state === 'ok') orb.style.background = 'var(--green)';
      })
      .catch(function () {
        // Degrades gracefully to default green
      });
  }

  // 3. Scroll Reveal Animations
  var targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !targets.length) {
    targets.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }
})();
