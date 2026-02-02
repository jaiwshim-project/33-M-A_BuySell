// ===== Navigation =====
document.addEventListener('DOMContentLoaded', () => {
  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      toggle.textContent = menu.classList.contains('open') ? '✕' : '☰';
    });
    // Sub-menu toggle on mobile
    menu.querySelectorAll(':scope > li > a').forEach(a => {
      a.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          const sub = a.nextElementSibling;
          if (sub && sub.classList.contains('sub-menu')) {
            e.preventDefault();
            sub.classList.toggle('open');
          }
        }
      });
    });
  }

  // Active nav highlight
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });

  // Accordion (smooth max-height)
  document.querySelectorAll('.accordion-header').forEach(h => {
    h.addEventListener('click', () => {
      const item = h.parentElement;
      const body = item.querySelector('.accordion-body');
      if (item.classList.contains('open')) {
        body.style.maxHeight = '0';
        body.style.padding = '0 24px';
        item.classList.remove('open');
      } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 18 + 'px';
        body.style.padding = '0 24px 18px';
      }
    });
  });

  // Tabs
  document.querySelectorAll('.tabs').forEach(tabBar => {
    tabBar.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabBar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        if (target) {
          document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
          const panel = document.getElementById(target);
          if (panel) panel.style.display = 'block';
        }
      });
    });
  });

  // Scroll reveal animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.card, .stat-card, .form-card, .expert-card, .article-item, .section, .step, .info-icon-card').forEach((el, i) => {
    el.classList.add('animate-on-scroll');
    const stagger = (i % 4) + 1;
    el.classList.add('stagger-' + stagger);
    observer.observe(el);
  });

  // Nav shadow on scroll
  const nav = document.querySelector('.top-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // Init Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// Toast notification
function showToast(msg, duration = 3000) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// Modal
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

// Form validation helper
function validateForm(formEl) {
  let valid = true;
  formEl.querySelectorAll('[required]').forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#ef4444';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  return valid;
}

// Number formatting
function formatPrice(n) {
  if (n >= 100000000) return (n / 100000000).toFixed(1).replace(/\.0$/, '') + '억원';
  if (n >= 10000) return (n / 10000).toFixed(0) + '만원';
  return n.toLocaleString() + '원';
}
