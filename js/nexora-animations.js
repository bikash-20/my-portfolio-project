/**
 * nexora-animations.js
 * GSAP (ScrollTrigger) + Anime.js powered animation suite
 * Covers: page load, scroll reveals, hover micro-interactions, parallax
 */
;(function () {
  'use strict';

  /* ── Wait for GSAP + Anime to load ─────────────────────────── */
  const poll = setInterval(() => {
    if (window.gsap && window.ScrollTrigger && window.anime) {
      clearInterval(poll);
      init();
    }
  }, 60);

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    /* ── Preloader ─────────────────────────────────────────────── */
    const preloader   = document.getElementById('preloader');
    const preloaderFill = document.getElementById('preloaderFill');
    const body        = document.body;

    // Show loading state
    body.classList.add('is-loading');
    if (preloaderFill) preloaderFill.style.width = '100%';

    // Fade out preloader after a short settle
    const dismiss = () => {
      if (preloader) preloader.classList.add('is-hidden');
      body.classList.remove('is-loading');
      // Remove from DOM after transition
      setTimeout(() => { if (preloader) preloader.remove(); }, 700);
    };
    // Give fonts/images a moment, then dismiss
    setTimeout(dismiss, 600);

    /* ────────────────────────────────────────────────────────────
       1.  PAGE-LOAD TIMELINE  (GSAP)  — snappy, cinematic
       ──────────────────────────────────────────────────────────── */
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });

    heroTL
      // Tag slides in from left
      .from('.hero-tag', { opacity: 0, x: -24, duration: 0.5 })
      // Name lines — fast stagger, each line enters from opposite sides
      .from('.hero-name .l1', { opacity: 0, x: -50, duration: 0.45 }, '-=0.2')
      .from('.hero-name .l2', { opacity: 0, x: 50, duration: 0.45, ease: 'power2.out' }, '-=0.25')
      // Bio fades up with a slight blur-to-clear
      .fromTo('.hero-bio',
        { opacity: 0, y: 18, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5 }, '-=0.15')
      // Role typing line
      .from('.hero-role', { opacity: 0, y: 14, duration: 0.35 }, '-=0.2')
      // Buttons — pop in with slight overshoot
      .from('.hero-btns', { opacity: 0, y: 16, scale: 0.95, duration: 0.4, ease: 'back.out(1.4)' }, '-=0.1')
      // Contact items — tight stagger from left
      .from('.hero-contacts .hc-item', { opacity: 0, x: -16, stagger: 0.08, duration: 0.3 }, '-=0.15')
      // Photo frame — scales up from center
      .from('.photo-frame', { opacity: 0, scale: 0.88, duration: 0.7, ease: 'power2.out' }, '-=0.55')
      // Year badge — spring pop
      .from('.year-badge', { opacity: 0, scale: 0, rotation: -120, duration: 0.5, ease: 'back.out(2.5)' }, '-=0.25')
      // Scroll hint — gentle fade
      .from('.scroll-hint', { opacity: 0, y: 8, duration: 0.3 }, '-=0.1');

    /* ────────────────────────────────────────────────────────────
       2.  SCROLL-TRIGGERED SECTION REVEALS  (GSAP)
       ──────────────────────────────────────────────────────────── */

    // Section headers — number + title slide in together
    gsap.utils.toArray('.sec-hdr').forEach((hdr) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: hdr, start: 'top 85%', toggleActions: 'play none none none' },
      });
      tl.from(hdr.querySelector('.sec-num'), { opacity: 0, x: -16, duration: 0.35 })
        .from(hdr.querySelector('.sec-title'), { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.15');
    });

    // About strip — badge + text split reveal
    const aboutBadge = document.querySelector('.about-badge');
    const aboutText = document.querySelector('.about-text');
    if (aboutBadge && aboutText) {
      const aboutTL = gsap.timeline({
        scrollTrigger: { trigger: '.about-inner', start: 'top 82%' },
      });
      aboutTL
        .from(aboutBadge, { opacity: 0, scale: 0.8, rotation: -8, duration: 0.5, ease: 'back.out(1.6)' })
        .from(aboutText, { opacity: 0, x: 30, duration: 0.6, ease: 'power2.out' }, '-=0.25');
    } else {
      const aboutInner = document.querySelector('.about-inner');
      if (aboutInner) {
        gsap.from(aboutInner, {
          scrollTrigger: { trigger: aboutInner, start: 'top 82%' },
          opacity: 0, y: 40, duration: 0.7, ease: 'power2.out',
        });
      }
    }

    // Skill groups — each category cascades in with offset
    gsap.utils.toArray('.skill-group').forEach((grp, i) => {
      gsap.from(grp, {
        scrollTrigger: { trigger: grp, start: 'top 88%' },
        opacity: 0, y: 24, duration: 0.45,
        delay: (i % 3) * 0.08, ease: 'power2.out',
      });
    });

    // Skill pills — tighter stagger with descending delay per pill
    gsap.utils.toArray('.skill-pills').forEach((container) => {
      const pills = container.querySelectorAll('.skill-pill');
      if (!pills.length) return;
      ScrollTrigger.create({
        trigger: container,
        start: 'top 88%',
        onEnter: () => {
          anime({
            targets: pills,
            opacity: [0, 1],
            translateY: [14, 0],
            scale: [0.88, 1],
            delay: anime.stagger(30, { start: 50 }),
            duration: 380,
            easing: 'easeOutQuart',
          });
        },
        once: true,
      });
    });

    // Skill bars
    const skillBars = document.getElementById('skillBars');
    if (skillBars) {
      ScrollTrigger.create({
        trigger: skillBars,
        start: 'top 85%',
        onEnter: () => skillBars.querySelectorAll('.sb-fill').forEach((f) => f.classList.add('on')),
        once: true,
      });
    }

    // Project cards — row-by-row cascade (3 per row)
    gsap.utils.toArray('.proj-card').forEach((card, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%' },
        opacity: 0, y: 35, scale: 0.96,
        duration: 0.5,
        delay: row * 0.05 + col * 0.09,  // left→right within each row
        ease: 'power2.out',
      });
    });

    // Achievement glass card — dramatic scale-up
    const achvGlass = document.querySelector('.achv-glass');
    if (achvGlass) {
      gsap.from(achvGlass, {
        scrollTrigger: { trigger: achvGlass, start: 'top 82%' },
        opacity: 0, y: 50, scale: 0.92, duration: 0.75, ease: 'power3.out',
      });
    }

    // Achievement stats — staggered counter with accelerating ease
    gsap.utils.toArray('.achv-stat').forEach((stat, i) => {
      const numEl = stat.querySelector('.achv-stat-num');
      if (!numEl) return;
      gsap.from(stat, {
        scrollTrigger: { trigger: stat, start: 'top 90%' },
        opacity: 0, y: 20, duration: 0.4,
        delay: i * 0.12, ease: 'power2.out',
      });
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 90%',
        onEnter: () => {
          const raw = numEl.textContent.trim();
          const num = parseInt(raw, 10);
          if (!isNaN(num)) {
            const suffix = raw.replace(/[\d,]+/, '');
            const obj = { val: 0 };
            gsap.to(obj, {
              val: num, duration: 1.0, delay: i * 0.12,
              ease: 'power2.out',
              onUpdate: () => { numEl.textContent = Math.round(obj.val) + suffix; },
            });
          }
        },
        once: true,
      });
    });

    // Research cards — alternating rotation with tighter stagger
    gsap.utils.toArray('.res-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%' },
        opacity: 0, y: 25,
        rotation: i % 2 === 0 ? -2 : 2,
        scale: 0.97,
        duration: 0.45,
        delay: (i % 3) * 0.08,
        ease: 'power2.out',
      });
    });

    // Contact section — left panel + art split
    const contactLeft = document.querySelector('.contact-left');
    const contactArt = document.querySelector('.contact-art');
    if (contactLeft) {
      const contactTL = gsap.timeline({
        scrollTrigger: { trigger: '.contact-inner', start: 'top 82%' },
      });
      contactTL.from(contactLeft, { opacity: 0, x: -30, duration: 0.6, ease: 'power2.out' });
      if (contactArt) {
        contactTL.from(contactArt, { opacity: 0, x: 30, scale: 0.9, duration: 0.6, ease: 'power2.out' }, '-=0.4');
      }
    }

    // Contact links — fast stagger from left
    gsap.utils.toArray('.c-link').forEach((link, i) => {
      gsap.from(link, {
        scrollTrigger: { trigger: link, start: 'top 90%' },
        opacity: 0, x: -14, duration: 0.35,
        delay: i * 0.06, ease: 'power2.out',
      });
    });

    // Dashboard cards — 3-col grid cascade
    gsap.utils.toArray('.dash-card').forEach((card, i) => {
      const col = i % 3;
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 90%' },
        opacity: 0, y: 25, scale: 0.96,
        duration: 0.45,
        delay: col * 0.09,
        ease: 'power2.out',
      });
    });

    // Divider lines — faster, snappier
    gsap.utils.toArray('.divider').forEach((div) => {
      gsap.from(div, {
        scrollTrigger: { trigger: div, start: 'top 92%' },
        scaleX: 0, duration: 0.6, ease: 'power3.inOut',
      });
    });

    /* ────────────────────────────────────────────────────────────
       3.  PARALLAX BLOBS  (GSAP)
       ──────────────────────────────────────────────────────────── */
    gsap.utils.toArray('.blob').forEach((blob) => {
      gsap.to(blob, {
        y: () => Math.random() * 80 - 40,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    });

    /* ────────────────────────────────────────────────────────────
       4.  HOVER MICRO-INTERACTIONS  (Anime.js)
       ──────────────────────────────────────────────────────────── */

    // Nav links — pulse glow on hover
    document.querySelectorAll('nav a').forEach((a) => {
      a.addEventListener('mouseenter', () => {
        anime({
          targets: a,
          boxShadow: ['0 0 0 rgba(201,168,76,0)', '0 0 18px rgba(201,168,76,0.35)'],
          duration: 300,
          easing: 'easeOutQuad',
        });
      });
      a.addEventListener('mouseleave', () => {
        anime({
          targets: a,
          boxShadow: ['0 0 18px rgba(201,168,76,0.35)', '0 0 0 rgba(201,168,76,0)'],
          duration: 400,
          easing: 'easeOutQuad',
        });
      });
    });

    // Buttons — scale bounce
    document.querySelectorAll('.btn-fill, .btn-outline').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        anime({ targets: btn, scale: 1.06, duration: 250, easing: 'easeOutBack' });
      });
      btn.addEventListener('mouseleave', () => {
        anime({ targets: btn, scale: 1, duration: 300, easing: 'easeOutCubic' });
      });
    });

    // Skill pills — tilt on hover
    document.querySelectorAll('.skill-pill').forEach((pill) => {
      pill.addEventListener('mouseenter', () => {
        anime({
          targets: pill,
          scale: 1.1,
          translateY: -3,
          boxShadow: '0 6px 20px rgba(26,92,90,0.35)',
          duration: 280,
          easing: 'easeOutCubic',
        });
      });
      pill.addEventListener('mouseleave', () => {
        anime({
          targets: pill,
          scale: 1,
          translateY: 0,
          boxShadow: '0 0 0 rgba(26,92,90,0)',
          duration: 320,
          easing: 'easeOutCubic',
        });
      });
    });

    // Project cards — hover lift + border glow
    document.querySelectorAll('.proj-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card,
          translateY: -6,
          boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 25px rgba(201,168,76,0.15)',
          duration: 300,
          easing: 'easeOutCubic',
        });
      });
      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          translateY: 0,
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          duration: 350,
          easing: 'easeOutCubic',
        });
      });
    });

    // Research cards — subtle rotate on hover
    document.querySelectorAll('.res-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card,
          scale: 1.04,
          rotateY: 4,
          boxShadow: '0 12px 35px rgba(0,0,0,0.4)',
          duration: 300,
          easing: 'easeOutCubic',
        });
      });
      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          scale: 1,
          rotateY: 0,
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          duration: 350,
          easing: 'easeOutCubic',
        });
      });
    });

    // Contact links — slide right on hover
    document.querySelectorAll('.c-link').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        anime({
          targets: link.querySelector('.c-arr'),
          translateX: [0, 6],
          duration: 250,
          easing: 'easeOutCubic',
        });
      });
      link.addEventListener('mouseleave', () => {
        anime({
          targets: link.querySelector('.c-arr'),
          translateX: [6, 0],
          duration: 300,
          easing: 'easeOutCubic',
        });
      });
    });

    // Dashboard cards — glow pulse
    document.querySelectorAll('.dash-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card,
          scale: 1.03,
          boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.12)',
          duration: 300,
          easing: 'easeOutCubic',
        });
      });
      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          scale: 1,
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          duration: 350,
          easing: 'easeOutCubic',
        });
      });
    });

    /* ────────────────────────────────────────────────────────────
       5.  YEAR BADGE — gentle wobble  (GSAP)
       ──────────────────────────────────────────────────────────── */
    const yb = document.querySelector('.year-badge');
    if (yb) {
      gsap.to(yb, {
        rotation: '+=8',
        yoyo: true,
        repeat: -1,
        duration: 3,
        ease: 'sine.inOut',
      });
    }

    /* ────────────────────────────────────────────────────────────
       6.  SCROLL PROGRESS + HINT FADE  (GSAP)
       ──────────────────────────────────────────────────────────── */
    gsap.to('.scroll-hint .s-line', {
      scaleY: 1,
      transformOrigin: 'top',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
    // Fade scroll hint as user scrolls
    gsap.to('.scroll-hint', {
      opacity: 0,
      y: -10,
      scrollTrigger: {
        trigger: '.hero',
        start: '15% top',
        end: '30% top',
        scrub: true,
      },
    });
  }
})();
