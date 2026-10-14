/**
 * Annapurna Caterers — Premium Animation Framework
 * Complete Vanilla JS Animation & Interaction Engine
 * Features: ScrollReveal, Animated Counters, Navbar Scroll, Parallax,
 * Magnetic Buttons, Text Split, Page Load Transitions, Cursor Glow,
 * Mobile Navigation Toggle, Active Page Detection.
 * 
 * Performance: requestAnimationFrame, Passive Listeners, IntersectionObserver,
 * Zero External Dependencies.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. SMOOTH PAGE LOAD ENTRANCE
     ========================================================================== */
  function initPageLoad() {
    // Add loaded class to body after 300ms for smooth hero entrance cascade
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 300);
  }

  /* ==========================================================================
     2. SCROLL REVEAL SYSTEM (IntersectionObserver)
     ========================================================================== */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate'
    );

    // Auto-setup staggered delays for grid / list children
    const staggerContainers = document.querySelectorAll(
      '.stagger-reveal, .reveal-grid, [data-stagger], .pages-teaser-grid, .packages-grid, .hero-stats-grid, .pillars-grid, .service-dual-grid, .calc-steps'
    );

    staggerContainers.forEach((container) => {
      const children = container.querySelectorAll(
        ':scope > .reveal, :scope > .reveal-up, :scope > .reveal-down, :scope > .reveal-left, :scope > .reveal-right, :scope > .reveal-scale, :scope > .reveal-rotate, :scope > div, :scope > article'
      );
      children.forEach((child, index) => {
        // Only apply if element does not already have an explicit delay class
        const hasExplicitDelay = Array.from(child.classList).some((cls) => cls.startsWith('delay-'));
        if (!hasExplicitDelay) {
          const delayTime = (index * 0.12).toFixed(2);
          child.style.transitionDelay = `${delayTime}s`;
        }
      });
    });

    // Graceful degradation if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('active'));
      animateAllCounters();
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('active');

          // Trigger counters inside this revealed block if present
          if (target.matches('.counter-value') || target.querySelector('.counter-value')) {
            animateCounters(target);
          }

          // Trigger text split characters inside this block if present
          const splitChars = target.querySelectorAll('.split-text-char');
          if (splitChars.length > 0) {
            target.classList.add('active');
          }

          // One-time activation: unobserve immediately
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });

    // Also observe counter elements directly if not already in a .reveal wrapper
    document.querySelectorAll('.counter-value, .hero-stats-grid, .stat-item').forEach((counterEl) => {
      if (!counterEl.closest('.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate')) {
        revealObserver.observe(counterEl);
      }
    });
  }

  /* ==========================================================================
     3. ANIMATED COUNTERS (requestAnimationFrame with Ease-Out)
     ========================================================================== */
  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  function animateSingleCounter(element) {
    if (element.getAttribute('data-animated') === 'true') {
      return;
    }
    element.setAttribute('data-animated', 'true');

    // Parse target number, prefix, and suffix
    let rawText = element.getAttribute('data-target') || element.textContent.trim();
    let prefix = '';
    let suffix = '';

    // Extract currency or non-digit prefix (e.g. "₹")
    const prefixMatch = rawText.match(/^[^\d]+/);
    if (prefixMatch) {
      prefix = prefixMatch[0];
      rawText = rawText.slice(prefix.length);
    }

    // Extract suffix (e.g. "+", "%", "/plate")
    const suffixMatch = rawText.match(/[^\d,.]+$/);
    if (suffixMatch) {
      suffix = suffixMatch[0];
      rawText = rawText.slice(0, rawText.length - suffix.length);
    }

    // Clean comma separators for numerical parsing
    const cleanedNumber = rawText.replace(/,/g, '');
    const targetValue = parseFloat(cleanedNumber);

    if (isNaN(targetValue)) {
      return;
    }

    const duration = 2000; // 2 seconds
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(easedProgress * targetValue);

      // Format with Indian/International thousands separator if original had commas or > 999
      let formattedNumber = currentValue.toLocaleString('en-IN');

      element.textContent = `${prefix}${formattedNumber}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Ensure final exact value is set
        const finalFormatted = targetValue.toLocaleString('en-IN');
        element.textContent = `${prefix}${finalFormatted}${suffix}`;
        // Flash pulse highlight animation on completion
        element.classList.add('pulsing');
        setTimeout(() => element.classList.remove('pulsing'), 500);
      }
    }

    requestAnimationFrame(step);
  }

  function animateCounters(container = document) {
    const counterElements = container.matches && container.matches('.counter-value')
      ? [container]
      : container.querySelectorAll('.counter-value');

    counterElements.forEach((el) => {
      animateSingleCounter(el);
    });
  }

  function animateAllCounters() {
    animateCounters(document);
  }

  /* ==========================================================================
     4. NAVBAR SCROLL EFFECTS
     ========================================================================== */
  function initNavbarScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    let ticking = false;
    const threshold = 80;

    function handleScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollY > threshold) {
        if (!header.classList.contains('scrolled')) {
          header.classList.add('scrolled');
        }
      } else {
        if (header.classList.contains('scrolled')) {
          header.classList.remove('scrolled');
        }
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(handleScroll);
          ticking = true;
        }
      },
      { passive: true }
    );

    // Initial check on load
    handleScroll();
  }

  /* ==========================================================================
     5. PARALLAX BACKGROUND EFFECT
     ========================================================================== */
  function initParallaxBackground() {
    const parallaxElements = document.querySelectorAll('.parallax-bg, [data-parallax]');
    if (parallaxElements.length === 0) return;

    let ticking = false;

    function updateParallax() {
      const windowHeight = window.innerHeight;

      parallaxElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Only compute if within or near viewport
        if (rect.top < windowHeight && rect.bottom > 0) {
          const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.18;
          const offset = (rect.top - windowHeight / 2) * speed;
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      });

      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ==========================================================================
     6. MAGNETIC BUTTON EFFECT
     ========================================================================== */
  function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        btn.style.transform = `translate3d(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });

    // Ripple click interaction for primary action buttons
    const rippleButtons = document.querySelectorAll(
      '.btn-ripple, .btn-primary-gold, .btn-primary-red, .btn-calc, .btn-quote, .btn-submit-quote'
    );

    rippleButtons.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - rect.left - radius}px`;
        ripple.style.top = `${e.clientY - rect.top - radius}px`;

        const existingRipple = btn.querySelector('.ripple');
        if (existingRipple) {
          existingRipple.remove();
        }

        btn.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 700);
      });
    });
  }

  /* ==========================================================================
     7. TEXT SPLIT ANIMATION
     ========================================================================== */
  function initTextSplit() {
    const splitTextElements = document.querySelectorAll('.split-text');

    splitTextElements.forEach((el) => {
      const text = el.textContent.trim();
      el.textContent = '';
      el.setAttribute('aria-label', text);

      // Split into words, then characters
      const words = text.split(' ');
      let charCounter = 0;

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        for (let i = 0; i < word.length; i++) {
          const char = word[i];
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.classList.add('split-text-char');
          charSpan.style.transitionDelay = `${(charCounter * 0.035).toFixed(3)}s`;
          wordSpan.appendChild(charSpan);
          charCounter++;
        }

        el.appendChild(wordSpan);

        // Add space between words
        if (wordIndex < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
          charCounter++;
        }
      });
    });
  }

  /* ==========================================================================
     8. INTERACTIVE CURSOR GLOW (Desktop Only)
     ========================================================================== */
  function initCursorGlow() {
    // Disable on mobile or touch-enabled devices
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 768;

    if (isTouchDevice) return;

    let glow = document.querySelector('.cursor-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.classList.add('cursor-glow');
      document.body.appendChild(glow);
    }

    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;
    let isMoving = false;

    window.addEventListener(
      'mousemove',
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!document.body.classList.contains('has-cursor')) {
          document.body.classList.add('has-cursor');
        }

        if (!isMoving) {
          isMoving = true;
          requestAnimationFrame(renderGlow);
        }
      },
      { passive: true }
    );

    document.addEventListener('mouseleave', () => {
      document.body.classList.remove('has-cursor');
    });

    function renderGlow() {
      // Linear interpolation (lerp) for smooth trailing movement
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      glow.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) translate(-50%, -50%)`;

      const dist = Math.abs(mouseX - currentX) + Math.abs(mouseY - currentY);
      if (dist > 0.2) {
        requestAnimationFrame(renderGlow);
      } else {
        isMoving = false;
      }
    }

    // Window resize handler: disable if resized to mobile
    window.addEventListener(
      'resize',
      () => {
        if (window.innerWidth <= 768) {
          document.body.classList.remove('has-cursor');
        }
      },
      { passive: true }
    );
  }

  /* ==========================================================================
     9. MOBILE NAVIGATION TOGGLE
     ========================================================================== */
  function toggleNav() {
    const navLinks = document.querySelector('nav ul.nav-links, nav ul');
    const toggleBtn = document.querySelector('.mobile-nav-toggle');

    if (!navLinks) return;

    const isOpen = navLinks.classList.contains('open');

    if (isOpen) {
      navLinks.classList.remove('open');
      if (toggleBtn) {
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    } else {
      navLinks.classList.add('open');
      if (toggleBtn) {
        toggleBtn.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    }
  }

  function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('nav ul.nav-links, nav ul');
    const header = document.querySelector('header');

    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Toggle Navigation Menu');

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNav();
      });
    }

    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
      if (navLinks && navLinks.classList.contains('open')) {
        if (header && !header.contains(e.target)) {
          toggleNav();
        }
      }
    });

    // Close mobile nav on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
        toggleNav();
      }
    });

    // Close mobile nav when any nav link is clicked
    if (navLinks) {
      const links = navLinks.querySelectorAll('a');
      links.forEach((link) => {
        link.addEventListener('click', () => {
          if (navLinks.classList.contains('open')) {
            toggleNav();
          }
        });
      });
    }
  }

  /* ==========================================================================
     10. ACTIVE PAGE DETECTION
     ========================================================================== */
  function initActivePage() {
    const navLinks = document.querySelectorAll('nav a');
    if (navLinks.length === 0) return;

    // Extract current filename from pathname (e.g. "packages.html")
    let pathname = window.location.pathname;
    let currentPage = pathname.split('/').pop().split('?')[0].split('#')[0];

    if (!currentPage || currentPage === '' || currentPage === '/') {
      currentPage = 'index.html';
    }

    let matchFound = false;

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPage = href.split('/').pop().split('?')[0].split('#')[0];

      if (linkPage === currentPage) {
        link.classList.add('active-page');
        link.setAttribute('aria-current', 'page');
        matchFound = true;
      } else {
        // Remove active class from non-matching links
        link.classList.remove('active-page');
        link.removeAttribute('aria-current');
      }
    });

    // Fallback: If no match found and we are on root or index
    if (!matchFound) {
      const homeLink = document.querySelector('nav a[href="index.html"], nav a[href="./"], nav a[href="/"]');
      if (homeLink) {
        homeLink.classList.add('active-page');
        homeLink.setAttribute('aria-current', 'page');
      }
    }
  }

  /* ==========================================================================
     11. AWWWARDS "SITE OF THE YEAR" SUITE
     ========================================================================== */

  /* 11.1 Film Grain Overlay */
  function initFilmGrain() {
    if (!document.querySelector('.film-grain-overlay')) {
      const grain = document.createElement('div');
      grain.classList.add('film-grain-overlay');
      grain.setAttribute('aria-hidden', 'true');
      document.body.appendChild(grain);
    }
  }

  /* 11.2 Scroll Progress Indicator */
  function initScrollProgress() {
    let progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.classList.add('scroll-progress-bar');
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    let ticking = false;

    function updateProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min((scrollTop / docHeight) * 100, 100);
        progressBar.style.width = `${progress.toFixed(2)}%`;
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateProgress);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateProgress();
  }

  /* 11.3 Luxury Dual-Ring Interactive Cursor */
  function initAwwwardsCursor() {
    // Touch suppression
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 768;
    if (isTouch) return;

    let dot = document.querySelector('.soty-cursor-dot');
    let ring = document.querySelector('.soty-cursor-ring');

    if (!dot) {
      dot = document.createElement('div');
      dot.classList.add('soty-cursor-dot');
      dot.setAttribute('aria-hidden', 'true');
      document.body.appendChild(dot);
    }

    if (!ring) {
      ring = document.createElement('div');
      ring.classList.add('soty-cursor-ring');
      ring.setAttribute('aria-hidden', 'true');
      const textSpan = document.createElement('span');
      textSpan.classList.add('soty-cursor-text');
      textSpan.textContent = 'VIEW';
      ring.appendChild(textSpan);
      document.body.appendChild(ring);
    }

    const cursorTextEl = ring.querySelector('.soty-cursor-text');

    let mouseX = -500;
    let mouseY = -500;
    let ringX = -500;
    let ringY = -500;
    let isMoving = false;

    function renderCursor() {
      // Direct placement for inner dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      // Smooth Lerp physics for outer ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(renderCursor);
    }

    window.addEventListener(
      'mousemove',
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!document.body.classList.contains('cursor-active')) {
          document.body.classList.add('cursor-active');
        }

        if (!isMoving) {
          isMoving = true;
          requestAnimationFrame(renderCursor);
        }
      },
      { passive: true }
    );

    document.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
    });

    // Interactive element hover listeners
    const clickables = document.querySelectorAll(
      'a, button, input, select, textarea, .magnetic-btn, .btn, .pkg-tab-btn, .counter-chip, [role="button"]'
    );
    clickables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    // Card hover state with mini badge
    const cards = document.querySelectorAll(
      '.pkg-card, .teaser-card, .service-box, .pillar-card, .station-card, .calc-card-container'
    );
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const customText = card.getAttribute('data-cursor-text') || 'EXPLORE';
        if (cursorTextEl) cursorTextEl.textContent = customText;
        document.body.classList.add('cursor-card-hover');
      });
      card.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-card-hover');
      });
    });

    // Click snap
    window.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-click');
    });
    window.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-click');
    });
  }

  /* 11.4 Celestial Interactive Canvas Background */
  function initAmbientCanvas() {
    const hero = document.querySelector('.hero, .page-hero');
    if (!hero) return;

    let canvas = document.getElementById('ambient-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'ambient-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      hero.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = hero.offsetWidth);
    let height = (canvas.height = hero.offsetHeight);

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 45);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 0.8;
        this.baseAlpha = Math.random() * 0.45 + 0.2;
        this.alpha = this.baseAlpha;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -Math.random() * 0.45 - 0.1; // Gentle upwards drift like embers
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.18;

        // Wrap around boundaries
        if (this.y < -10) this.y = height + 10;
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 202, 101, ${Math.max(this.alpha, 0.05)})`;
        ctx.shadowColor = 'rgba(197, 155, 39, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let isVisible = true;
    let animId = null;

    function animate() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle golden filament lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const lineAlpha = (1 - dist / 100) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(197, 155, 39, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animId = requestAnimationFrame(animate);
    }

    animate();

    // Resize handling
    window.addEventListener(
      'resize',
      () => {
        width = canvas.width = hero.offsetWidth;
        height = canvas.height = hero.offsetHeight;
      },
      { passive: true }
    );

    // Pause when tab not visible to preserve 60fps & battery
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible) {
        animate();
      } else {
        cancelAnimationFrame(animId);
      }
    });
  }

  /* 11.5 3D Kinetic Card Tilt & Specular Light Physics */
  function init3DTilt() {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 768;
    if (isTouch) return;

    const tiltCards = document.querySelectorAll(
      '[data-tilt], .pkg-card, .teaser-card, .service-box, .calc-card-container, .pillar-card, .station-card'
    );

    tiltCards.forEach((card) => {
      let glare = card.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.classList.add('tilt-glare');
        card.appendChild(glare);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const maxTilt = 7; // Max tilt degrees
        const tiltX = -y * maxTilt;
        const tiltY = x * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translate3d(0, -6px, 0)`;

        // Specular highlight glare position
        const glareX = ((x + 0.5) * 100).toFixed(1);
        const glareY = ((y + 0.5) * 100).toFixed(1);
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, transparent 65%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
      });
    });
  }

  /* 11.6 Cinematic Studio Preloader Screen */
  function initStudioPreloader() {
    // Only run on homepage or when preloader markup exists
    const preloader = document.querySelector('.soty-preloader');
    if (!preloader) return;

    // Check if session has already seen the preloader
    if (sessionStorage.getItem('annapurna_preloaded') === 'true') {
      preloader.classList.add('dismissed');
      setTimeout(() => preloader.remove(), 1200);
      return;
    }

    const numberEl = preloader.querySelector('.preloader-number');
    const barEl = preloader.querySelector('.preloader-bar');

    let current = 0;
    const target = 100;
    const duration = 1200; // 1.2s smooth studio countdown
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo for high-fashion countdown
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(eased * target);

      if (numberEl) {
        numberEl.textContent = current < 10 ? `0${current}%` : `${current}%`;
      }
      if (barEl) {
        barEl.style.width = `${current}%`;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (numberEl) numberEl.textContent = '100%';
        if (barEl) barEl.style.width = '100%';

        sessionStorage.setItem('annapurna_preloaded', 'true');

        setTimeout(() => {
          preloader.classList.add('dismissed');
          // Trigger body loaded entrance
          document.body.classList.add('loaded');
          setTimeout(() => preloader.remove(), 1200);
        }, 250);
      }
    }

    requestAnimationFrame(step);
  }

  /* 11.7 Luxury Web Audio Synthesizer (Zero-Asset Procedural Audio) */
  function initWebAudioEngine() {
    let audioCtx = null;
    let isMuted = localStorage.getItem('annapurna_audio_enabled') !== 'true';

    function getAudioContext() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtx = new AudioContext();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    // Soft warm chime on hover
    function playHoverTone() {
      if (isMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.018, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {
        // Audio not allowed or error
      }
    }

    // Resonant bell tone on CTA click
    function playClickTone() {
      if (isMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.08); // G5

        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } catch (e) {
        // Audio error
      }
    }

    // Attach sound hooks to buttons
    document.querySelectorAll('.magnetic-btn, .btn, .pkg-tab-btn, nav a').forEach((el) => {
      el.addEventListener('mouseenter', playHoverTone);
      el.addEventListener('click', playClickTone);
    });

    // Audio Controller Buttons
    const audioButtons = document.querySelectorAll('.audio-toggle-btn');
    function updateButtonUI() {
      audioButtons.forEach((btn) => {
        if (!isMuted) {
          btn.classList.add('active');
          btn.setAttribute('aria-label', 'Sound Effects: Enabled');
          const label = btn.querySelector('.audio-label');
          if (label) label.textContent = 'Audio ON';
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-label', 'Sound Effects: Muted');
          const label = btn.querySelector('.audio-label');
          if (label) label.textContent = 'Audio OFF';
        }
      });
    }

    audioButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        isMuted = !isMuted;
        localStorage.setItem('annapurna_audio_enabled', (!isMuted).toString());
        updateButtonUI();
        if (!isMuted) {
          getAudioContext();
          playClickTone();
        }
      });
    });

    updateButtonUI();
  }

  /* ==========================================================================
     12. GLOBAL INITIALIZATION
     ========================================================================== */
  function initAll() {
    initFilmGrain();
    initScrollProgress();
    initStudioPreloader();
    initPageLoad();
    initTextSplit();
    initScrollReveal();
    initNavbarScroll();
    initParallaxBackground();
    initAmbientCanvas();
    initMagneticButtons();
    initAwwwardsCursor();
    init3DTilt();
    initWebAudioEngine();
    initMobileNav();
    initActivePage();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* ==========================================================================
     13. WINDOW EXPORTS FOR INLINE HTML COMPATIBILITY
     ========================================================================== */
  window.toggleNav = toggleNav;
  window.animateCounters = animateCounters;
  window.animateAllCounters = animateAllCounters;
  window.initScrollReveal = initScrollReveal;

})();

