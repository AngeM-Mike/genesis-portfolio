/* ════════════════════════════════════════════
   GENESIS DIGIT — script.js
   · Curseur permanent (ne disparaît jamais)
   · Nav scroll + mobile
   · Reveal au scroll
   · Lightbox projets
   · Parallaxe légère hero cards
   · Smooth scroll
   ════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════
     1. CURSEUR PERSONNALISÉ
     Le curseur est TOUJOURS visible.
     Il change uniquement de taille au survol
     des éléments interactifs.
  ══════════════════════════════ */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  // Position du point (instantanée)
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  // Position de l'anneau (avec inertie)
  let rx = mx, ry = my;

  // Initialise les curseurs au centre pour éviter le saut
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  ring.style.left   = rx + 'px';
  ring.style.top    = ry + 'px';

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // L'anneau suit avec une légère inertie
  function animRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  // Grossissement au survol des éléments interactifs
  // (via classe CSS sur body)
  const interactives = 'a, button, .work-item, .scard, .tcard, .hcard, .tcard-link';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
  });

  // IMPORTANT : le curseur ne disparaît JAMAIS.
  // On ne modifie jamais l'opacity ici.


  /* ══════════════════════════════
     2. NAVBAR — scroll & mobile
  ══════════════════════════════ */
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('navBurger');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Burger : toggle menu mobile
  if (burger) {
    burger.addEventListener('click', () => {
      navbar.classList.toggle('mobile-open');
    });
  }

  // Lien actif selon la section visible
  const allSections = document.querySelectorAll('section[id]');
  const navLinks    = document.querySelectorAll('.nav-links a');

  const setActiveLink = () => {
    let current = '';
    allSections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 160) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = (a.getAttribute('href') === '#' + current) ? 'var(--v3)' : '';
    });
  };
  window.addEventListener('scroll', setActiveLink);


  /* ══════════════════════════════
     3. REVEAL AU SCROLL
     Les éléments avec .reveal apparaissent
     progressivement quand ils entrent dans la vue.
  ══════════════════════════════ */
  const revealObs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  /* ══════════════════════════════
     4. LIGHTBOX
     Ouvrir : clic sur .work-item ou .work-zoom
     Fermer : bouton ×, clic sur fond, touche Échap
  ══════════════════════════════ */
  const lightbox = document.getElementById('lightbox');
  const lbBg     = document.getElementById('lbBg');
  const lbClose  = document.getElementById('lbClose');
  const lbImg    = document.getElementById('lbImg');
  const lbPh     = document.getElementById('lbPh');
  const lbCat    = document.getElementById('lbCat');
  const lbName   = document.getElementById('lbName');

  function openLb(item) {
    const label = item.dataset.label || '';
    const cat   = item.dataset.cat   || '';
    const img   = item.querySelector('.work-media img');

    lbCat.textContent  = cat;
    lbName.textContent = label;

    if (img && img.complete && img.naturalWidth > 0) {
      lbImg.src = img.src;
      lbImg.alt = label;
      lbImg.style.display = 'block';
      lbPh.classList.remove('show');
    } else {
      lbImg.style.display = 'none';
      lbPh.textContent = label + ' — image à venir';
      lbPh.classList.add('show');
    }

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('click', () => openLb(item));

    const zoomBtn = item.querySelector('.work-zoom');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', e => {
        e.stopPropagation();
        openLb(item);
      });
    }
  });

  lbClose.addEventListener('click', closeLb);
  lbBg.addEventListener('click', closeLb);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLb();
  });


  /* ══════════════════════════════
     5. PARALLAXE LÉGÈRE — hero cards
     Les cartes bougent légèrement
     selon la position de la souris.
  ══════════════════════════════ */
  const heroCards = document.querySelectorAll('.hcard');
  if (heroCards.length) {
    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      heroCards.forEach((card, i) => {
        const d = (i + 1) * 3.5;
        card.style.transform = `translate(${dx * d}px, ${dy * d}px)`;
      });
    });
  }


  /* ══════════════════════════════
     6. SMOOTH SCROLL — ancres nav
  ══════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navbar.classList.remove('mobile-open');
      }
    });
  });

});