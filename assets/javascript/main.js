const doctors = [
  {
    name: 'Dr. Ananya Sen',
    specialty: 'General Physician',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80',
    bio: 'Focused on preventive care, routine checkups, and long-term wellness planning.'
  },
  {
    name: 'Dr. Rahman Karim',
    specialty: 'General Surgeon',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80',
    bio: 'Delivers precise surgical care with a strong emphasis on safety and recovery.'
  },
  {
    name: 'Dr. Nabila Ahmed',
    specialty: 'Gynecology / Obstetrics',
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80',
    bio: 'Supports women’s health through compassionate consultations, pregnancy care, and treatment.'
  }
];

const services = [
  {
    title: 'General Consultation',
    category: 'Primary Care',
    image:
      'https://images.unsplash.com/photo-1538108149393-fbbd81895973?auto=format&fit=crop&w=900&q=80',
    description: 'Routine assessment, consultation and health guidance for everyday wellbeing.'
  },
  {
    title: 'Surgical Care',
    category: 'Procedures',
    image:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=900&q=80',
    description: 'Modern surgical evaluation and specialist support tailored to recovery needs.'
  },
  {
    title: 'Women’s Health',
    category: 'Gynecology',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    description: 'Comprehensive obstetric and gynecological care for every life stage.'
  },
  {
    title: 'Nursing Care',
    category: 'Medical Support',
    image:
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=900&q=80',
    description: 'Skilled nursing support and attentive treatment assistance for a smooth recovery.'
  },
  {
    title: 'Rehabilitation',
    category: 'Recovery',
    image:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
    description: 'Well-structured rehabilitation services that emphasise comfort and progress.'
  },
  {
    title: 'Family Wellness',
    category: 'Preventive Care',
    image:
      'https://images.unsplash.com/photo-1541534401786-8ac7e1d65f7b?auto=format&fit=crop&w=900&q=80',
    description: 'Personalised care plans that support families with long-term health goals.'
  }
];

const facilities = [
  {
    title: 'Private Consultation Rooms',
    category: 'Comfort',
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',
    description: 'Private, quiet spaces for confidential consultation and health discussions.'
  },
  {
    title: 'Advanced Diagnostic Support',
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
    description: 'Modern examination and diagnostic infrastructure to support accurate care.'
  },
  {
    title: 'Recovery Suites',
    category: 'Care',
    image:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
    description: 'Restful recovery rooms designed for healing, comfort and safe monitoring.'
  }
];

const galleryImages = [
  {
    title: 'Consultation area',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895973?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Medical team',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Nursing support',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Recovery room',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Care environment',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Wellness consultation',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Family care',
    image: 'https://images.unsplash.com/photo-1541534401786-8ac7e1d65f7b?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Modern clinic',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80'
  }
];

function renderDoctors() {
  const container = document.getElementById('doctorCards');
  if (!container) return;

  container.innerHTML = doctors
    .map(
      (doctor) => `
        <article class="info-card">
          <div class="card-image">
            <img src="${doctor.image}" alt="${doctor.name}" />
          </div>
          <div class="card-body">
            <span class="card-meta">${doctor.specialty}</span>
            <h3>${doctor.name}</h3>
            <p>${doctor.bio}</p>
          </div>
        </article>
      `
    )
    .join('');
}

function renderServices() {
  const container = document.getElementById('serviceCards');
  if (!container) return;

  container.innerHTML = services
    .map(
      (service) => `
        <article class="info-card">
          <div class="card-image">
            <img src="${service.image}" alt="${service.title}" />
          </div>
          <div class="card-body">
            <span class="card-meta">${service.category}</span>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
          </div>
        </article>
      `
    )
    .join('');
}

function renderFacilities() {
  const container = document.getElementById('facilityCards');
  if (!container) return;

  container.innerHTML = facilities
    .map(
      (facility) => `
        <article class="info-card">
          <div class="card-image">
            <img src="${facility.image}" alt="${facility.title}" />
          </div>
          <div class="card-body">
            <span class="card-meta">${facility.category}</span>
            <h3>${facility.title}</h3>
            <p>${facility.description}</p>
          </div>
        </article>
      `
    )
    .join('');
}

function renderGallery() {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  container.innerHTML = galleryImages
    .map(
      (item) => `
        <figure class="gallery-item">
          <img src="${item.image}" alt="${item.title}" />
          <figcaption>${item.title}</figcaption>
        </figure>
      `
    )
    .join('');
}

function setupNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (!navToggle || !nav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupCurrentYear() {
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

    const name = form.elements.name.value.trim();
    if (status) {
      status.textContent = `Thank you, ${name || 'there'}! Your message has been noted for follow-up.`;
    }

    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderDoctors();
  renderServices();
  renderFacilities();
  renderGallery();
  setupNavigation();
  setupCurrentYear();
  setupContactForm();
});
