/* Simple client-side admin authentication
   - Stores credential (username + SHA-256 password hash) in localStorage key `clinic_admin_cred`
   - Stores session token in localStorage key `clinic_admin_session` with expiry
   - Default credential created on first run: admin / Admin@123 (please change after login)
   NOTE: This is a client-side convenience only and NOT secure for production.
*/
(function () {
  const CRED_KEY = 'clinic_admin_cred';
  const SESSION_KEY = 'clinic_admin_session';
  const SESSION_TTL = 1000 * 60 * 60; // 1 hour

  function $(sel) { return document.querySelector(sel); }

  async function sha256Hex(text) {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  function randomHex(len = 16) {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  function getStoredCred() {
    try { return JSON.parse(localStorage.getItem(CRED_KEY)); } catch (e) { return null; }
  }

  async function ensureDefaultCred() {
    let cred = getStoredCred();
    if (!cred) {
      const defaultPw = 'Admin@123';
      const hash = await sha256Hex(defaultPw);
      cred = { username: 'admin', passwordHash: hash };
      localStorage.setItem(CRED_KEY, JSON.stringify(cred));
    }
    return cred;
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
  }

  function setSession(username) {
    const session = {
      token: randomHex(12),
      user: username,
      created: Date.now(),
      expires: Date.now() + SESSION_TTL
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function clearSession() { localStorage.removeItem(SESSION_KEY); }

  async function authenticate(username, password) {
    const cred = getStoredCred();
    if (!cred) return false;
    const h = await sha256Hex(password);
    return (username === cred.username && h === cred.passwordHash);
  }

  function showApp(show) {
    const login = $('#adminLogin');
    const app = $('#adminApp');
    if (login) login.hidden = show;
    if (app) app.hidden = !show;
  }

  async function init() {
    // If Supabase client is expected but not yet ready, wait briefly for it to initialize.
    if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && !window.supabaseClient) {
      // wait up to 3000ms for the Supabase client to become available
      await new Promise((resolve) => {
        if (window.supabaseClient) return resolve();
        const onReady = () => resolve();
        document.addEventListener('supabase:ready', onReady, { once: true });
        setTimeout(resolve, 3000);
      });
    }

    // If Supabase client is available, use Supabase Auth; otherwise fall back to local credential store
    const hasSupabase = window.supabaseClient && window.supabaseClient.auth;

    if (hasSupabase) {
      // attempt to restore session from Supabase auth
      const user = await window.supabaseClient.auth.getUser();
      if (user && user.data && user.data.user) {
        showApp(true);
      } else {
        showApp(false);
      }

      const form = $('#loginForm');
      if (form) {
        form.addEventListener('submit', async (ev) => {
          ev.preventDefault();
          const fd = new FormData(form);
          const email = fd.get('username');
          const password = fd.get('password');
          try {
            const res = await window.supabaseClient.auth.signInWithPassword({ email, password });
            if (res.error) throw res.error;
            showApp(true);
          } catch (err) {
            console.error('Supabase login error', err);
            alert('Login failed. Check credentials.');
          }
        });
      }
    } else {
      await ensureDefaultCred();

      const session = getSession();
      if (session && session.expires && session.expires > Date.now()) {
        showApp(true);
      } else {
        clearSession();
        showApp(false);
      }

      const form = $('#loginForm');
      if (form) {
        form.addEventListener('submit', async (ev) => {
          ev.preventDefault();
          const fd = new FormData(form);
          const username = fd.get('username');
          const password = fd.get('password');
          const ok = await authenticate(username, password);
          if (ok) {
            setSession(username);
            showApp(true);
          } else {
            alert('Invalid username or password');
          }
        });
      }
    }

    // Add logout UI if header exists
    const header = document.querySelector('.admin-header .container');
    if (header) {
      const logout = document.createElement('button');
      logout.id = 'adminLogout';
      logout.className = 'button';
      logout.textContent = 'Sign out';
      logout.style.marginLeft = '12px';
      logout.hidden = !(getSession() && getSession().expires > Date.now());
      logout.addEventListener('click', () => { clearSession(); showApp(false); logout.hidden = true; });
      // place at end of header
      header.appendChild(logout);
    }

    // When app becomes visible, reveal logout button
    const observer = new MutationObserver(() => {
      const logoutBtn = document.getElementById('adminLogout');
      if (logoutBtn) logoutBtn.hidden = $('#adminApp') && $('#adminApp').hidden;
    });
    observer.observe(document.body, { attributes: false, childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
