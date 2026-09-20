Netlify deployment and Supabase environment setup

Summary
- This project is a static frontend served by Netlify. The admin UI and public pages can connect to Supabase for Auth, Postgres data, and Storage. Keep the service_role key secret; only the anon (publishable) key is used in the browser.

Required Netlify env vars (add in Site settings → Build & deploy → Environment):
- SUPABASE_URL: https://your-project-ref.supabase.co
- SUPABASE_ANON_KEY: your-public-anon-key

Recommended build settings
- Build command: (none) — this is a plain static site. If you use a bundler, set accordingly.
- Publish directory: root of repository (where index.html lives). Example: `/`

How the site reads content
- Public pages: `assets/js/main.js` will attempt to fetch published content from Supabase REST endpoints when `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in the environment at build or runtime.
- Admin pages: The admin shell uses `admin-assets/js/supabase-client.js` which initializes `window.supabaseClient` when `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` are present and the Supabase JS SDK is loaded.

How to inject env vars on Netlify (two options)
1) Recommended: Set Netlify environment variables in the site dashboard (they'll be available at build time). Create a small `admin-assets/js/supabase-config-client.js` at build time by echoing values into the file, for example in Netlify "Build command":

```bash
# create a simple client config file during build
cat > admin-assets/js/supabase-config-client.js <<'EOF'
window.SUPABASE_URL='${SUPABASE_URL}';
window.SUPABASE_ANON_KEY='${SUPABASE_ANON_KEY}';
EOF
```

2) Simpler local-dev approach (NOT for production): Edit `admin-assets/js/supabase-config-client.js` and hard-code `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` for development only. Do NOT commit service_role keys or any secret to source control.

Supabase setup checklist
- Create a Supabase project.
- Run the provided SQL schema (tables, RLS policies, functions) in the Supabase SQL editor.
- Create an initial admin user using the Supabase Auth dashboard, then insert an `admin_profiles` row linking to the user id.
- Create Storage buckets: `clinic-images`, `doctor-images`, `service-images`, `gallery-images`. Apply storage policies per the schema guidance.

Security notes
- Never expose the `service_role` key in client code. Use server-side functions for any privileged operations.
- Use RLS policies to restrict writes to authenticated users with the appropriate role.

Post-deploy checks
- Visit the public site and confirm content (doctors/services) loads from Supabase when env vars are set.
- Sign in to the admin UI and verify you can manage content (after completing SQL setup and creating admin user).
- Verify images load from Storage and permissions behave as expected.

If you want, I can:
- Generate a Netlify build command snippet and update `admin-assets/js/supabase-config-client.js` template.
- Add a small `make` or `deploy.sh` helper to prepare config files during deploy.
