// Initialize a Supabase client when configuration is present.
// If the Supabase JS SDK is not yet loaded, dynamically load it and then initialize.
(function () {
  const CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';

  function loadScript(src, timeout = 10000) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
      if (timeout > 0) setTimeout(() => reject(new Error('Timeout loading ' + src)), timeout);
    });
  }

  async function initSupabase() {
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
      console.warn('Supabase client not configured: missing SUPABASE_URL or SUPABASE_ANON_KEY');
      return;
    }

    // Ensure SDK is available
    if (!window.supabase || !window.supabase.createClient) {
      try {
        await loadScript(CDN);
      } catch (err) {
        console.warn('Supabase JS library not found and dynamic load failed:', err);
        return;
      }
    }

    if (!window.supabase || !window.supabase.createClient) {
      console.error('Supabase SDK still not available after load attempt.');
      return;
    }

    try {
      // Normalize SUPABASE_URL: if user accidentally provided the REST endpoint (ending with /rest/v1),
      // strip that part so createClient receives the project base URL.
      let baseUrl = String(window.SUPABASE_URL || '');
      baseUrl = baseUrl.replace(/\/rest\/v1\/?$/i, '');
      baseUrl = baseUrl.replace(/\/+$/, '');
      if (!/^https?:\/\//i.test(baseUrl)) {
        // try to recover from malformed input by treating it as host
        baseUrl = 'https://' + baseUrl;
      }
      window.supabaseClient = window.supabase.createClient(baseUrl, window.SUPABASE_ANON_KEY, {
        auth: { persistSession: true }
      });
      console.info('Supabase client initialized (url:', baseUrl + ')');
      // mark readiness for other scripts that may rely on the client
      try {
        window.supabaseReady = true;
        document.dispatchEvent(new CustomEvent('supabase:ready', { detail: { url: baseUrl } }));
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.error('Failed to initialize Supabase client', e);
    }
  }

  // Kick off initialization (do not block page)
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initSupabase();
  } else {
    document.addEventListener('DOMContentLoaded', initSupabase);
  }
})();
