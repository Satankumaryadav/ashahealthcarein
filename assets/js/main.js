const clinic = window.CLINIC_MOCK_DATA || {};

function renderCards(selector, items, cardType) {
  const container = document.querySelector(selector);
  if (!container || !items || !items.length) return;

  const markup = items
    .map((item) => {
      if (cardType === 'doctor') {
        return `
          <article class="info-card">
            <div class="card-image">
              <img src="${item.image}" alt="${item.name}" />
            </div>
            <div class="card-body">
              <span class="card-tag">${item.specialty}</span>
              <h3>${item.name}</h3>
              <p>${item.bio}</p>
            </div>
          </article>
        `;
      }

      if (cardType === 'gallery') {
        return `
          <figure class="gallery-item">
            <img src="${item.image}" alt="${item.title}" />
            <figcaption>${item.title}</figcaption>
          </figure>
        `;
      }

      return `
        <article class="info-card">
          <div class="card-image">
            <img src="${item.image}" alt="${item.title}" />
          </div>
          <div class="card-body">
            <span class="card-tag">${item.category}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        </article>
      `;
    })
    .join('');

  container.innerHTML = markup;
}

function renderSpecialtyList() {
  const container = document.querySelector('[data-specialties]');
  if (!container || !clinic.specialties) return;

  const markup = clinic.specialties
    .map(
      (item) => `
        <li class="feature-box">
          <div class="icon">+</div>
          <h3>${item}</h3>
          <p>Mock service focus for future content updates.</p>
        </li>
      `
    )
    .join('');

  container.innerHTML = markup;
}

function setupNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

function setCurrentYear() {
  const yearNode = document.getElementById('currentYear');
  if (!yearNode) return;
  yearNode.textContent = new Date().getFullYear();
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = form.querySelector('.form-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim() || 'there';

    if (status) {
      status.textContent = `Thank you, ${name}. This is mock front-end form content and can later be connected to a real submission flow.`;
    }

    form.reset();
  });
}

function initializeSite() {
  renderCards('[data-doctors]', clinic.doctors, 'doctor');
  renderCards('[data-services]', clinic.services, 'service');
  renderCards('[data-facilities]', clinic.facilities, 'facility');
  renderCards('[data-gallery]', clinic.gallery, 'gallery');
  renderSpecialtyList();
  setupNavigation();
  setActiveNav();
  setCurrentYear();
  setupContactForm();
}

document.addEventListener('DOMContentLoaded', initializeSite);
