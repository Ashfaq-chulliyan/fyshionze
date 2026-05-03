document.addEventListener('DOMContentLoaded', () => {

  // ── LOADING SCREEN ──
  const loader = document.getElementById('loader');
  if (loader) {
    const minDuration = 2200;
    const start = Date.now();
    window.addEventListener('load', () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, minDuration - elapsed);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
      }, wait);
    });
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 4000);
  }

  // ── LANGUAGE TOGGLE ──
  const LANG_KEY = 'fyshionze_lang';
  let currentLang = localStorage.getItem(LANG_KEY) || 'en';

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = lang === 'id' ? (el.dataset.id || el.dataset.en) : el.dataset.en;
    });
    document.querySelectorAll('[data-en-html]').forEach(el => {
      el.innerHTML = lang === 'id' ? (el.dataset.idHtml || el.dataset.enHtml) : el.dataset.enHtml;
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  applyLang(currentLang);

  // ── NAVBAR SCROLL ──
  const navbar = document.querySelector('.navbar');
  const langToggle = document.querySelector('.lang-toggle');
  const isHeroPage = document.body.classList.contains('has-hero');

  function updateNavbar() {
    if (!navbar) return;
    const scrolled = window.scrollY > 80;
    if (isHeroPage) {
      navbar.classList.toggle('transparent', !scrolled);
      navbar.classList.toggle('solid', scrolled);
    } else {
      navbar.classList.add('solid');
      navbar.classList.remove('transparent');
    }
    if (langToggle) {
      langToggle.classList.toggle('solid-bg', scrolled || !isHeroPage);
    }
  }
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  // ── MOBILE MENU ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── ACTIVE NAV LINK ──
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── SCROLL ANIMATIONS ──
  const animEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .service-img-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  animEls.forEach(el => observer.observe(el));

  // ── LAZY IMAGES ──
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imgObserver.observe(img));

  // ── HERO MODEL IMAGE ──
  const heroModelImg = document.querySelector('.hero-model-img');
  if (heroModelImg && heroModelImg.dataset.src) {
    const img = new Image();
    img.onload = () => {
      heroModelImg.src = heroModelImg.dataset.src;
      heroModelImg.classList.add('loaded');
    };
    img.src = heroModelImg.dataset.src;
  }

  // ── WHATSAPP LINKS ──
  const WA_NUMBER = '6281234567890';
  const WA_MSG_EN = encodeURIComponent('Hello La Fyshionzè Tailor, I would like to enquire about your tailoring services.');
  const WA_MSG_ID = encodeURIComponent('Halo La Fyshionzè Tailor, saya ingin bertanya tentang layanan jahit.');

  function updateWaLinks() {
    const msg = currentLang === 'id' ? WA_MSG_ID : WA_MSG_EN;
    document.querySelectorAll('[data-wa]').forEach(el => {
      el.href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });
  }
  updateWaLinks();

  // ── BOOKING FORM ──
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = bookingForm.querySelector('[name="name"]').value.trim();
      const phone   = bookingForm.querySelector('[name="phone"]').value.trim();
      const email   = bookingForm.querySelector('[name="email"]').value.trim();
      const service = bookingForm.querySelector('[name="service"]').value;
      const message = bookingForm.querySelector('[name="message"]').value.trim();

      if (!name || !phone || !service) {
        alert(currentLang === 'id' ? 'Harap isi semua field yang wajib.' : 'Please fill in all required fields.');
        return;
      }

      const waMsg = currentLang === 'id'
        ? encodeURIComponent(`Halo La Fyshionzè Tailor!\n\nNama: ${name}\nNo. HP: ${phone}${email ? `\nEmail: ${email}` : ''}\nLayanan: ${service}\nPesan: ${message}`)
        : encodeURIComponent(`Hello La Fyshionzè Tailor!\n\nName: ${name}\nPhone: ${phone}${email ? `\nEmail: ${email}` : ''}\nService: ${service}\nMessage: ${message}`);
      window.open(`https://wa.me/${WA_NUMBER}?text=${waMsg}`, '_blank');
    });
  }

  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── CUSTOM CURSOR (desktop only) ──
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    function moveCursor() {
      cx += (mouseX - cx) * 0.18;
      cy += (mouseY - cy) * 0.18;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      requestAnimationFrame(moveCursor);
    }
    moveCursor();

    document.querySelectorAll('a, button, .service-card, .value-card, .collection-item').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
    });
  }

  // ── PARALLAX HERO ──
  if (document.querySelector('.hero')) {
    window.addEventListener('scroll', () => {
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        heroContent.style.opacity = 1 - window.scrollY / 600;
      }
    }, { passive: true });
  }

  // ── STAGGER COUNTER ANIMATION ──
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  // ── SERVICE IMAGE PARALLAX ──
  const serviceImgWrap = document.querySelector('.service-img-floating');
  if (serviceImgWrap) {
    window.addEventListener('scroll', () => {
      const rect = serviceImgWrap.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      serviceImgWrap.style.transform = `translateY(${(progress - 0.5) * -40}px)`;
    }, { passive: true });
  }

  console.log('La Fyshionzè Tailor — fyshionze.store ✦');
});