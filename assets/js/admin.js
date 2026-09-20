/* Admin frontend (client-only) — CRUD using localStorage
   - Loads initial data from window.CLINIC_MOCK_DATA
   - Persists edits to localStorage key: clinic_data
   - Provides add/edit/delete for doctors and services
*/
(function () {
  const STORAGE_KEY = 'clinic_data';

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { console.warn('Invalid local data, falling back'); }
    }
    return deepClone(window.CLINIC_MOCK_DATA || { doctors: [], services: [] });
  }

  function ensureIdsInState(s) {
    if (!s) return;
    if (!Array.isArray(s.doctors)) s.doctors = [];
    if (!Array.isArray(s.services)) s.services = [];
    s.doctors.forEach(d => {
      if (!d.id) d.id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : ('doc-' + Date.now() + '-' + Math.random().toString(36).slice(2,8));
      if (!d.created_at) d.created_at = new Date().toISOString();
      d.updated_at = new Date().toISOString();
    });
    s.services.forEach(x => {
      if (!x.id) x.id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : ('svc-' + Date.now() + '-' + Math.random().toString(36).slice(2,8));
      if (!x.created_at) x.created_at = new Date().toISOString();
      x.updated_at = new Date().toISOString();
    });
  }

  async function saveData(data) {
    // ensure stable ids and timestamps
    ensureIdsInState(data);

    // persist locally first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // if Supabase client exists, attempt to persist remotely (best-effort, batch upsert)
    if (window.supabaseClient && window.supabaseClient.from) {
      console.log('[SaveData] Supabase client is available, attempting to sync...');
      try {
        // helper to detect if id looks like a UUID v4 (basic check)
        const isUuid = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

        if (Array.isArray(data.doctors) && data.doctors.length) {
          // prepare payload: remove non-UUID ids so DB generates them, 
          // and remove updated_at/created_at so triggers can manage them (prevents stack depth recursion)
          const payload = data.doctors.map(d => {
            const copy = Object.assign({}, d);
            if (!isUuid(copy.id)) delete copy.id;
            delete copy.updated_at; // let trigger set this
            delete copy.created_at; // keep existing created_at on updates, set on inserts
            return copy;
          });
          console.log('[SaveData] Upserting doctors payload:', JSON.stringify(payload, null, 2));
          // upsert with onConflict to let DB insert new rows and update existing ones
          const resp = await window.supabaseClient.from('doctors').upsert(payload, { onConflict: 'id' }).select('*');
          console.log('[SaveData] Doctors upsert response:', { error: resp.error, data: resp.data });
          if (resp.error) throw resp.error;
          if (resp.data) data.doctors = resp.data;
        }

        if (Array.isArray(data.services) && data.services.length) {
          const payload2 = data.services.map(s => {
            const copy = Object.assign({}, s);
            if (!isUuid(copy.id)) delete copy.id;
            delete copy.updated_at; // let trigger set this
            delete copy.created_at; // keep existing created_at on updates, set on inserts
            return copy;
          });
          console.log('[SaveData] Upserting services payload:', JSON.stringify(payload2, null, 2));
          const resp2 = await window.supabaseClient.from('services').upsert(payload2, { onConflict: 'id' }).select('*');
          console.log('[SaveData] Services upsert response:', { error: resp2.error, data: resp2.data });
          if (resp2.error) throw resp2.error;
          if (resp2.data) data.services = resp2.data;
        }
        console.log('[SaveData] Supabase sync complete');
      } catch (err) {
        console.error('[SaveData] Supabase save failed, localStorage kept as source of truth', err);
        console.error('[SaveData] Error details:', { message: err.message, code: err.code, hint: err.hint });
      }
    } else {
      console.warn('[SaveData] Supabase client not available, using localStorage only');
    }
    return data;
  }

  let state = loadData();
  // ensure existing local/mock data have stable ids/timestamps
  ensureIdsInState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  async function fetchRemoteDataIfAvailable() {
    if (window.supabaseClient && window.supabaseClient.from) {
      try {
        const { data: doctors, error: docErr } = await window.supabaseClient.from('doctors').select('*').order('created_at', { ascending: false });
        if (docErr) throw docErr;
        const { data: services, error: svcErr } = await window.supabaseClient.from('services').select('*').order('created_at', { ascending: false });
        if (svcErr) throw svcErr;
        // if we have remote data, prefer it
        if (Array.isArray(doctors) && doctors.length >= 0 && Array.isArray(services) && services.length >= 0) {
          state = { doctors: doctors || [], services: services || [] };
          // persist to localStorage as cache
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          // re-render if UI already initialized
          const doctorsList = document.getElementById('doctorsList');
          if (doctorsList) renderDoctors();
          const servicesList = document.getElementById('servicesList');
          if (servicesList) renderServices();
        }
      } catch (err) {
        console.warn('Failed to fetch remote data from Supabase, using local data', err);
      }
    }
  }

  /* ---- helpers ---- */
  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  /* ---- render lists ---- */
  function renderDoctors() {
    const container = $('#doctorsList');
    container.innerHTML = '';
    if (!state.doctors || !state.doctors.length) {
      container.innerHTML = '<p class="muted">No doctors yet.</p>';
      return;
    }

    state.doctors.forEach((d) => {
      const item = document.createElement('div');
      item.className = 'admin-item';
      item.innerHTML = `
        <div class="admin-item-media"><img src="${escapeHtml(d.image||'')}" alt="${escapeHtml(d.name||'doctor')}"/></div>
        <div class="admin-item-body">
          <strong>${escapeHtml(d.name||'Unnamed')}</strong>
          <div class="muted">${escapeHtml(d.specialty||'')}</div>
          <p>${escapeHtml(d.bio||'')}</p>
        </div>
        <div class="admin-item-actions">
          <button data-edit-id="${escapeHtml(d.id||'')}" class="button">Edit</button>
          <button data-delete-id="${escapeHtml(d.id||'')}" class="button">Delete</button>
        </div>`;
      container.appendChild(item);
    });
  }

  function renderServices() {
    const container = $('#servicesList');
    container.innerHTML = '';
    if (!state.services || !state.services.length) {
      container.innerHTML = '<p class="muted">No services yet.</p>';
      return;
    }

    state.services.forEach((s) => {
      const item = document.createElement('div');
      item.className = 'admin-item';
      item.innerHTML = `
        <div class="admin-item-media"><img src="${escapeHtml(s.image||'')}" alt="${escapeHtml(s.title||'service')}"/></div>
        <div class="admin-item-body">
          <strong>${escapeHtml(s.title||'Untitled')}</strong>
          <div class="muted">${escapeHtml(s.category||'')}</div>
          <p>${escapeHtml(s.description||'')}</p>
        </div>
        <div class="admin-item-actions">
          <button data-edit-id="${escapeHtml(s.id||'')}" class="button">Edit</button>
          <button data-delete-id="${escapeHtml(s.id||'')}" class="button">Delete</button>
        </div>`;
      container.appendChild(item);
    });
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  /* ---- UI actions ---- */
  function showSection(name) {
    $all('.admin-section').forEach(sec => sec.hidden = true);
    const el = $(`#section-${name}`);
    if (el) el.hidden = false;
    $all('.admin-nav button').forEach(b => b.classList.toggle('active', b.dataset.section === name));
  }

  function initDoctorsUI() {
    renderDoctors();
    $('#btnAddDoctor').addEventListener('click', () => openDoctorForm());

    $('#doctorsList').addEventListener('click', async (e) => {
      const edit = e.target.closest('[data-edit-id]');
      const del = e.target.closest('[data-delete-id]');
      if (edit) {
        const id = edit.getAttribute('data-edit-id');
        openDoctorForm('edit', id);
      }
      if (del) {
        const id = del.getAttribute('data-delete-id');
        if (confirm('Delete this doctor?')) {
          const idx = state.doctors.findIndex(x => x.id === id);
          if (idx >= 0) {
            state.doctors.splice(idx, 1);
            await saveData(state);
            renderDoctors();
          }
        }
      }
    });

    const form = $('#doctorForm');
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const obj = {
        name: fd.get('name')||'',
        specialty: fd.get('specialty')||'',
        image: fd.get('image')||'',
        bio: fd.get('bio')||'',
        // make new entries visible by default; existing entries keep their status
        status: 'published'
      };
      const mode = form.dataset.mode;
      const id = form.dataset.id;
      if (mode === 'edit' && id) {
        const idx = state.doctors.findIndex(x => x.id === id);
        if (idx >= 0) {
          obj.id = id;
          obj.created_at = state.doctors[idx].created_at || new Date().toISOString();
          obj.status = state.doctors[idx].status || obj.status;
          obj.updated_at = new Date().toISOString();
          state.doctors[idx] = obj;
        }
      } else {
        obj.id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : ('doc-' + Date.now() + '-' + Math.random().toString(36).slice(2,8));
        obj.created_at = new Date().toISOString();
        obj.updated_at = obj.created_at;
        state.doctors.push(obj);
      }
      state = await saveData(state);
      renderDoctors();
      closeDoctorForm();
    });

    $('#cancelDoctor').addEventListener('click', closeDoctorForm);
  }

  function openDoctorForm(mode='add', id) {
    const form = $('#doctorForm');
    form.reset();
    form.dataset.mode = mode;
    form.dataset.id = id ?? '';
    $('#doctorFormTitle').textContent = mode === 'edit' ? 'Edit doctor' : 'Add doctor';
    if (mode === 'edit' && id) {
      const idx = state.doctors.findIndex(x => x.id === id);
      if (idx >= 0) {
        const d = state.doctors[idx];
        form.name.value = d.name || '';
        form.specialty.value = d.specialty || '';
        form.image.value = d.image || '';
        form.bio.value = d.bio || '';
      }
    }
    form.hidden = false;
    form.scrollIntoView({behavior: 'smooth', block: 'center'});
  }

  function closeDoctorForm() { const f = $('#doctorForm'); f.hidden = true; }

  /* ---- services UI ---- */
  function initServicesUI() {
    renderServices();
    $('#btnAddService').addEventListener('click', () => openServiceForm());

    $('#servicesList').addEventListener('click', async (e) => {
      const edit = e.target.closest('[data-edit-id]');
      const del = e.target.closest('[data-delete-id]');
      if (edit) {
        const id = edit.getAttribute('data-edit-id');
        openServiceForm('edit', id);
      }
      if (del) {
        const id = del.getAttribute('data-delete-id');
        if (confirm('Delete this service?')) {
          const idx = state.services.findIndex(x => x.id === id);
          if (idx >= 0) {
            state.services.splice(idx,1);
            await saveData(state);
            renderServices();
          }
        }
      }
    });

    const form = $('#serviceForm');
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const obj = {
        title: fd.get('title')||'',
        category: fd.get('category')||'',
        image: fd.get('image')||'',
        description: fd.get('description')||'',
        // publish new services by default so public site shows them
        status: 'published'
      };
      const mode = form.dataset.mode;
      const id = form.dataset.id;
      if (mode === 'edit' && id) {
        const idx = state.services.findIndex(x => x.id === id);
        if (idx >= 0) {
          obj.id = id;
          obj.created_at = state.services[idx].created_at || new Date().toISOString();
          obj.status = state.services[idx].status || obj.status;
          obj.updated_at = new Date().toISOString();
          state.services[idx] = obj;
        }
      } else {
        obj.id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : ('svc-' + Date.now() + '-' + Math.random().toString(36).slice(2,8));
        obj.created_at = new Date().toISOString();
        obj.updated_at = obj.created_at;
        state.services.push(obj);
      }
      state = await saveData(state);
      renderServices();
      closeServiceForm();
    });

    $('#cancelService').addEventListener('click', closeServiceForm);
  }

  function openServiceForm(mode='add', id) {
    const form = $('#serviceForm');
    form.reset();
    form.dataset.mode = mode;
    form.dataset.id = id ?? '';
    $('#serviceFormTitle').textContent = mode === 'edit' ? 'Edit service' : 'Add service';
    if (mode === 'edit' && id) {
      const idx = state.services.findIndex(x => x.id === id);
      if (idx >= 0) {
        const s = state.services[idx];
        form.title.value = s.title || '';
        form.category.value = s.category || '';
        form.image.value = s.image || '';
        form.description.value = s.description || '';
      }
    }
    form.hidden = false;
    form.scrollIntoView({behavior: 'smooth', block: 'center'});
  }

  function closeServiceForm() { const f = $('#serviceForm'); f.hidden = true; }

  /* ---- init ---- */
  async function init() {
    // if Supabase configured, try to fetch remote data first
    await fetchRemoteDataIfAvailable();

    // navigation
    $all('.admin-nav button').forEach(b => b.addEventListener('click', () => showSection(b.dataset.section)));
    showSection('doctors');

    initDoctorsUI();
    initServicesUI();

    // expose a small helper to reset local data (dev)
    window.__clinicAdmin = {
      export: () => deepClone(state),
      resetToMock: () => { state = deepClone(window.CLINIC_MOCK_DATA || {doctors:[],services:[]}); saveData(state); renderDoctors(); renderServices(); }
    };
  }

  document.addEventListener('DOMContentLoaded', async () => { await init(); });
})();
