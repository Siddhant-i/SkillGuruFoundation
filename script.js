



'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

(function initHamburger() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const mobileLinks = $$('.mobile-link', mobileMenu);

  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';   // prevent body scroll
  }

  function closeMenu() {
    isOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  document.addEventListener('click', e => {
    if (isOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });
})();

(function initParallax() {
  const layer1  = $('.layer-1');
  const layer2  = $('.layer-2');
  const grid    = $('.parallax-grid');
  const shapes  = $$('.shape');

  if (!layer1) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (layer1)  layer1.style.transform  = `translateY(${scrollY * 0.25}px)`;
        if (layer2)  layer2.style.transform  = `translateY(${scrollY * 0.15}px)`;
        if (grid)    grid.style.transform    = `translateY(${scrollY * 0.08}px)`;
        shapes.forEach((shape, i) => {
          const speed = 0.05 + i * 0.03;
          shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
(function initTypingAnimation() {
  const typedEl  = $('#typedText');
  const cursorEl = $('#cursor');
  if (!typedEl) return;

  // Words to cycle through
  const phrases = [
    'Faster.',
    'Smarter.',
    'Deeper.',
    'Better.',
    'Together.',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPING_SPEED   = 90;
  const DELETING_SPEED = 55;
  const PAUSE_AFTER    = 2000;
  const PAUSE_BEFORE   = 400;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isPaused) return;

    if (isDeleting) {
      typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        isPaused = true;
        setTimeout(() => { isPaused = false; loop(); }, PAUSE_BEFORE);
        return;
      }
      setTimeout(loop, DELETING_SPEED);
    } else {
      typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        isPaused = true;
        setTimeout(() => { isPaused = false; loop(); }, PAUSE_AFTER);
        return;
      }
      setTimeout(loop, TYPING_SPEED);
    }
  }

  function loop() { type(); }

  setTimeout(loop, 800);
})();

(function initDarkMode() {
  const toggle     = $('#themeToggle');
  const themeIcon  = $('#themeIcon');
  const htmlEl     = document.documentElement;

  if (!toggle) return;

  const saved = localStorage.getItem('nexus-theme');
  if (saved) {
    htmlEl.setAttribute('data-theme', saved);
    themeIcon.textContent = saved === 'dark' ? '☀️' : '🌙';
  }

  toggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';

    htmlEl.setAttribute('data-theme', next);
    themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('nexus-theme', next);

    // Update navbar background (already handled by CSS vars)
    showToast(next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on');
  });
})();

(function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollH    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct        = scrollH > 0 ? (scrollTop / scrollH) * 100 : 0;
        bar.style.width  = pct.toFixed(2) + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

(function initNavScroll() {
  const navbar  = $('#navbar');
  const sections = $$('section[id], div[id]');
  const navLinks = $$('.nav-links a');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    // Shadow
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Active link (highlight current section)
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();

(function initScrollReveal() {
  const reveals = $$('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger cards in a grid
        const siblings = $$('.reveal', entry.target.parentElement);
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(idx * 80, 300));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

(function initCounters() {
  const statsSection = $('.stats-section');
  if (!statsSection) return;

  let counted = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    let start = null;

    // Format large numbers
    function formatVal(val) {
      if (target >= 10000) return (val / 1000).toFixed(0) + suffix;
      return val + suffix;
    }

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = formatVal(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatVal(target);
      }
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      $$('[data-target]', statsSection).forEach(animateCounter);
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(statsSection);
})();

(function initBarAnimations() {
  const fills = $$('.bar-fill');
  fills.forEach(fill => {
    fill.style.width = '0';
  });

  const dashboard = $('.dashboard-card');
  if (!dashboard) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      fills.forEach(fill => {
        const w = fill.style.getPropertyValue('--w') || '80%';
        setTimeout(() => {
          fill.style.transition = 'width 1.2s cubic-bezier(0.16,1,0.3,1)';
          fill.style.width = w;
        }, 400);
      });
      observer.disconnect();
    }
  }, { threshold: 0.4 });

  observer.observe(dashboard);
})();

(function initPricingToggle() {
  const toggle = $('#billingToggle');
  if (!toggle) return;

  let isYearly = true;  // default: yearly shown
  toggle.classList.add('yearly');

  toggle.addEventListener('click', () => {
    isYearly = !isYearly;
    toggle.classList.toggle('yearly', isYearly);
    toggle.classList.toggle('monthly', !isYearly);
    toggle.setAttribute('aria-pressed', String(isYearly));

    $$('.price-val').forEach(el => {
      const from = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
      const to   = isYearly
        ? parseInt(el.dataset.yearly, 10)
        : parseInt(el.dataset.monthly, 10);

      animatePrice(el, from, to);
    });

    const label = isYearly ? 'yearly' : 'monthly';
    showToast(`Showing ${label} prices`);
  });

  function animatePrice(el, from, to) {
    const duration = 350;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round(from + (to - from) * p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
})();
(function initSteps() {
  const steps = $$('.step');
  steps.forEach(step => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
    step.addEventListener('mouseenter', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });
})();

(function initChatDemo() {
  const chatMessages = $('#chatMessages');
  const replayBtn    = $('#chatReplay');
  if (!chatMessages) return;

  // Conversation script
  const CONVERSATION = [
    { role: 'ai',   delay: 800,   text: null, typing: true },   // typing...
    {
      role: 'ai',   delay: 2000,  typing: false,
      text: "I've analysed <strong>47 documents</strong> from your workspace. Here's your board-ready report:<br><br><strong>Q3 Highlights</strong> ✦ Launched 3 major features ✦ 31% user growth ✦ NPS jumped to 72.<br><br>Want me to format it as a slide deck?"
    },
    { role: 'user', delay: 1200, text: 'Yes! Export as PDF and email it to the team' },
    { role: 'ai',   delay: 800,  text: null, typing: true },
    {
      role: 'ai',   delay: 1600,
      text: "✅ Done! PDF generated and sent to <strong>8 team members</strong>.<br>Saved to <span style='color:var(--accent)'>Drive / Q3-Report.pdf</span>"
    }
  ];

  let chatStarted = false;
  let activeTypingEl = null;

  function createMsg(role, text, isTyping) {
    const msg = document.createElement('div');
    msg.className = `chat-msg${role === 'user' ? ' user-msg' : ''}`;

    const avatar = document.createElement('div');
    avatar.className = `chat-avatar ${role}`;
    avatar.textContent = role === 'user' ? 'A' : 'N';
    avatar.setAttribute('aria-label', role === 'user' ? 'User' : 'NexusAI');

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    if (isTyping) {
      const ind = document.createElement('div');
      ind.className = 'typing-indicator';
      ind.innerHTML = '<span></span><span></span><span></span>';
      bubble.appendChild(ind);
      activeTypingEl = msg;
    } else {
      bubble.innerHTML = text;
    }

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    return msg;
  }

  function removeTyping() {
    if (activeTypingEl && activeTypingEl.parentNode) {
      activeTypingEl.parentNode.removeChild(activeTypingEl);
      activeTypingEl = null;
    }
  }

  function runConversation() {
    chatMessages.innerHTML = '';
    chatMessages.appendChild(createMsg('user', 'Summarise last quarter&apos;s product updates and create a board report'));

    let totalDelay = 300;
    let typingTimeout = null;

    CONVERSATION.forEach((item, i) => {
      totalDelay += item.delay;

      if (item.typing) {
        setTimeout(() => {
          const typingMsg = createMsg('ai', null, true);
          chatMessages.appendChild(typingMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, totalDelay);
      } else {
        totalDelay += 0;  // extra delay already set in item.delay
        setTimeout(() => {
          removeTyping();
          const newMsg = createMsg(item.role, item.text, false);
          chatMessages.appendChild(newMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, totalDelay);
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !chatStarted) {
      chatStarted = true;
      setTimeout(runConversation, 600);
      observer.disconnect();
    }
  }, { threshold: 0.35 });

  if ($('#chatDemo')) observer.observe($('#chatDemo'));

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      chatStarted = true;
      runConversation();
      showToast('↺ Demo replaying...');
    });
  }
})();

function handlePlan(plan) {
  const messages = {
    Starter: '🎉 Welcome! Your free account is being created...',
    Pro: '🚀 Starting your 14-day Pro trial — no card needed!',
    Team: '📞 Our sales team will reach out within 24 hours.',
  };
  showToast(messages[plan] || '✅ Done!');
}

function handleCTA(type) {
  if (type === 'start') {
    showToast('🚀 Welcome to NexusAI! Setting up your workspace...');
  } else {
    showToast('📅 Opening calendar to book your demo...');
  }
}

let toastTimeout = null;

function showToast(message, duration = 3000) {
  const toast = $('#toast');
  if (!toast) return;

  // Clear existing timeout
  if (toastTimeout) clearTimeout(toastTimeout);

  toast.textContent = message;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH   = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 70;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

(function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return; 

  $$('.feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -5;
      const rotY   = ((x - cx) / cx) *  5;

      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

(function initLogoInteraction() {
  $$('.logo-item').forEach(logo => {
    logo.addEventListener('click', () => {
      showToast(`🔗 NexusAI × ${logo.textContent} — Integration available`);
    });
  });
})();

(function initKeyboardNav() {
  $$('.pricing-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const btn = card.querySelector('.btn-plan');
        if (btn) btn.click();
      }
    });
  });
})();

(function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) {
    $$('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    const imgObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          imgObserver.unobserve(img);
        }
      });
    });
    $$('img[data-src]').forEach(img => imgObserver.observe(img));
  }
})();

console.log(
  '%cNexusAI 🚀', 'font-size:18px; font-weight:bold; color:#5c3fff;',
  '\nBuilt for Internshala × SkillGuru Foundation\nAll interactive features loaded ✓'
);