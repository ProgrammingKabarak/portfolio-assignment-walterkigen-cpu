// =========================================================
// FEATURE 1 — Responsive nav toggle (mobile hamburger)
// =========================================================
const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');

navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

// Close mobile menu after a link is tapped
document.querySelectorAll('.tab').forEach(link => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Highlight the active section tab as you scroll
const sections = document.querySelectorAll('main .section');
const tabs = document.querySelectorAll('.tab');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      tabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(section => navObserver.observe(section));


// =========================================================
// FEATURE 2 — Typing animation for the hero name
// =========================================================
const fullName = "Walter Kigen";
const typedEl = document.getElementById('typed-name');
let charIndex = 0;

function typeName() {
  if (charIndex <= fullName.length) {
    typedEl.textContent = fullName.slice(0, charIndex);
    charIndex++;
    setTimeout(typeName, 90);
  }
}
typeName();


// =========================================================
// FEATURE 3 — Dark / light theme toggle (persisted)
// =========================================================
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
  themeToggle.querySelector('span').textContent = theme === 'light' ? '☀️' : '🌙';
  localStorage.setItem('portfolio-theme', theme);
}

const savedTheme = localStorage.getItem('portfolio-theme')
  || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(current);
});


// =========================================================
// FEATURE 4 — Scroll reveal animations (+ animated skill bars)
// =========================================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');

      // If this is the skills section, animate the bars once
      if (entry.target.id === 'skills') {
        entry.target.querySelectorAll('.skill__fill').forEach(fill => {
          const level = fill.getAttribute('data-level');
          fill.style.width = `${level}%`;
        });
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));


// =========================================================
// FEATURE 5 — Scroll-to-top button
// =========================================================
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('is-visible', window.scrollY > 500);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// =========================================================
// FEATURE 6 — Contact form validation
// =========================================================
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

const fields = {
  name: { el: document.getElementById('name'), error: document.getElementById('name-error') },
  email: { el: document.getElementById('email'), error: document.getElementById('email-error') },
  message: { el: document.getElementById('message'), error: document.getElementById('message-error') },
};

function validateField(key) {
  const { el, error } = fields[key];
  el.setAttribute('data-touched', 'true');

  if (el.validity.valueMissing) {
    error.textContent = 'This field is required.';
  } else if (el.validity.tooShort) {
    error.textContent = `Please enter at least ${el.minLength} characters.`;
  } else if (el.validity.typeMismatch && key === 'email') {
    error.textContent = 'Please enter a valid email address.';
  } else {
    error.textContent = '';
  }
  return el.validity.valid;
}

Object.keys(fields).forEach(key => {
  fields[key].el.addEventListener('blur', () => validateField(key));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const allValid = Object.keys(fields)
    .map(validateField)
    .every(Boolean);

  if (!allValid) {
    formStatus.textContent = 'Please fix the errors above before sending.';
    formStatus.style.color = '#EF6461';
    return;
  }

  // NOTE: this demo doesn't actually send an email — wire it up to
  // Formspree, EmailJS, or your own backend endpoint when ready.
  formStatus.textContent = `Thanks — message received. I'll get back to you soon.`;
  formStatus.style.color = 'var(--accent-teal)';
  form.reset();
  Object.values(fields).forEach(f => f.el.removeAttribute('data-touched'));
});


// =========================================================
// Footer current year
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();
