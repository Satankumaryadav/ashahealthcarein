  const clinic = { ...(window.CLINIC_MOCK_DATA || {}) };

async function fetchPublishedContent() {
  // Use Supabase REST endpoint (no SDK needed) so public pages can fetch with anon key
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const headers = {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Accept': 'application/json'
  };

  try {
    const [doctorsRes, servicesRes, facilitiesRes, galleryRes] = await Promise.all([
      fetch(`${url}/rest/v1/doctors?select=*`, { headers }),
      fetch(`${url}/rest/v1/services?select=*`, { headers }),
      fetch(`${url}/rest/v1/facilities?select=*`, { headers }),
      fetch(`${url}/rest/v1/gallery?select=*`, { headers })
    ]);

    if (!doctorsRes.ok || !servicesRes.ok || !facilitiesRes.ok || !galleryRes.ok) {
      console.warn('Supabase REST fetch returned non-ok status');
      return null;
    }

    const [doctors, services, facilities, gallery] = await Promise.all([
      doctorsRes.json(), servicesRes.json(), facilitiesRes.json(), galleryRes.json()
    ]);

    // specialties could be a simple enum or a table; try to fetch, fallback to derived list
    let specialties = [];
    try {
      const spRes = await fetch(`${url}/rest/v1/specialties?select=*`, { headers });
      if (spRes.ok) specialties = await spRes.json();
      if (Array.isArray(specialties)) specialties = specialties.map(s=>s.name||s);
    } catch (e) { specialties = [] }

    return {
      doctors: doctors || [],
      services: services || [],
      facilities: facilities || [],
      gallery: gallery || [],
      specialties: specialties.length ? specialties : Array.from(new Set((doctors||[]).map(d=>d.specialty).filter(Boolean)))
    };
  } catch (err) {
    console.warn('Failed to fetch published content from Supabase', err);
    return null;
  }
}

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
  // If Supabase config is present try to load published content first
  (async () => {
    const remote = await fetchPublishedContent();
    const used = remote || clinic;
    renderCards('[data-doctors]', used.doctors, 'doctor');
    renderCards('[data-services]', used.services, 'service');
    renderCards('[data-facilities]', used.facilities, 'facility');
    renderCards('[data-gallery]', used.gallery, 'gallery');
    // attach specialties to clinic for renderSpecialtyList
    clinic.specialties = used.specialties || clinic.specialties;
    renderSpecialtyList();
  })();
  setupNavigation();
  setActiveNav();
  setCurrentYear();
  setupContactForm();
}

document.addEventListener('DOMContentLoaded', initializeSite);
