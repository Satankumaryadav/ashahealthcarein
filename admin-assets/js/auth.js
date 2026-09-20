// auth.js: lightweight auth interface for later Supabase integration
// Provides promise-based functions: login, logout, getCurrentUser, resetPassword

const auth = (function(){
  const SESSION_KEY = 'clinic_admin_session';

  function getSession(){
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e){return null}
  }

  function isAuthenticated(){
    const s = getSession();
    return s && s.expires && s.expires > Date.now();
  }

  function login(email, password){
    // This wrapper attempts to use admin-auth stored session. For real auth, replace with Supabase calls.
    return new Promise((resolve, reject) => {
      // delegate to existing session
      const s = getSession();
      if (s && s.user === email && s.expires > Date.now()) return resolve(s);
      // fallback: attempt fake local check by dispatching a login event that admin-auth listens to
      // NOTE: admin-auth.js currently sets session on successful local login, so here we just wait.
      const timeout = setTimeout(()=>reject(new Error('Login timeout')),3000);
      const onStorage = (e)=>{
        if (e.key === SESSION_KEY) {
          clearTimeout(timeout);
          window.removeEventListener('storage', onStorage);
          resolve(JSON.parse(localStorage.getItem(SESSION_KEY)));
        }
      };
      window.addEventListener('storage', onStorage);
    });
  }

  function logout(){
    localStorage.removeItem(SESSION_KEY);
    return Promise.resolve();
  }

  function getCurrentUser(){
    const s = getSession();
    return Promise.resolve(s ? { email: s.user } : null);
  }

  function resetPassword(email){
    // placeholder: integrate with Supabase Auth password reset
    return Promise.reject(new Error('resetPassword not implemented. Connect Supabase Auth.'));
  }

  return { login, logout, getCurrentUser, resetPassword, isAuthenticated };
})();

export default auth;
