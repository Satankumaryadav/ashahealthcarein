# Asha Healthcare – Remaining Post-Deployment Tasks

When you deploy to Netlify and a Supabase project is set up with the database schema applied and environment variables configured, these tasks complete the site for production use.

## Database & Backend (One-time setup)

- [ ] **Create Supabase project** at https://supabase.com
  - Copy `Project URL` and `anon public key` for env vars.
  
- [ ] **Run SQL schema** in Supabase SQL Editor using the provided full schema (tables, RLS, functions, triggers).
  - Verify: `doctors`, `services`, `facilities`, `gallery` tables exist and have RLS policies applied.
  
- [ ] **Create initial admin user**
  - Use Supabase Auth dashboard → "Create a new user" (email: e.g., `admin@ashahealthcare.in`).
  - Create an `admin_profiles` row linking the new user's UUID to this admin_profile.
  - Test: Log in to `/admin/` with the credentials to verify auth flow works.

- [ ] **Create Storage buckets** in Supabase Storage:
  - `clinic-images`, `doctor-images`, `service-images`, `facility-images`, `gallery-images`
  - Apply RLS policies per the schema guidance (anon = read, authenticated = upload).
  
- [ ] **Seed content** (optional):
  - Insert mock doctors/services/facilities/gallery into Supabase to test public page rendering.
  - Admin UI will allow editing and adding new content.

## Netlify Deployment

- [ ] **Create Netlify site** at https://netlify.com
  - Connect your repository (or drag-and-drop the folder).
  
- [ ] **Set environment variables** in Netlify (Site settings → Build & deploy → Environment):
  - `SUPABASE_URL=https://your-project-ref.supabase.co`
  - `SUPABASE_ANON_KEY=your-public-anon-key-here`
  
- [ ] **Configure build command** (if needed):
  - For a plain static site: leave blank or set to a simple build script that injects env vars into `admin-assets/js/supabase-config-client.js`.
  - Example:
    ```bash
    cat > admin-assets/js/supabase-config-client.js <<'EOF'
    window.SUPABASE_URL='${SUPABASE_URL}';
    window.SUPABASE_ANON_KEY='${SUPABASE_ANON_KEY}';
    EOF
    ```
  
- [ ] **Verify Netlify deployment** is live and site loads.

## Security & Performance

- [ ] **Remove local auth fallback** from production (optional hardening):
  - In `assets/js/admin-auth.js`, remove the `ensureDefaultCred()` branch if Supabase Auth is mandatory.
  
- [ ] **Test RLS policies** across different user roles:
  - Anonymous user: can read published data only.
  - Editor user: can read/write doctors, services, facilities.
  - Admin user: full access to all data + can manage admin_profiles.
  
- [ ] **Test Storage upload** via admin UI:
  - Ensure signed URLs work for image uploads.
  - Verify images display in public pages from Storage.
  
- [ ] **Configure security headers** on Netlify:
  - Add headers in `netlify.toml` or Netlify dashboard (CSP, HSTS, X-Frame-Options, etc.).
  
- [ ] **Enable HTTPS & custom domain**:
  - Point your domain (ashahealthcare.in) to Netlify.
  - Enable SSL certificate (automatic via Let's Encrypt).
  
- [ ] **Run Lighthouse audit**:
  - Check performance, accessibility, SEO, best practices.
  - Optimize if needed: minify assets, lazy-load images, add meta tags.

## Testing & Validation

- [ ] **Smoke test public site**:
  - Visit index.html, about, doctors, services, facilities, nursing-home, gallery, contact pages.
  - Verify all content loads (mock or from Supabase).
  - Test WhatsApp CTA button.
  - Test contact form (demo only).
  
- [ ] **Smoke test admin UI**:
  - Visit /admin/ and log in.
  - Add, edit, delete a doctor/service.
  - Verify changes sync to Supabase and persist on refresh.
  
- [ ] **Test image loading**:
  - Public: mock Unsplash images or real images from Storage.
  - Admin: upload via signed URL; verify display.
  
- [ ] **Test on mobile** (responsive design):
  - Navigation toggle, card layout, forms.
  
- [ ] **Test forms**:
  - Contact form submits (currently mock; can wire to Netlify Forms or a Function later).

## Legal & Analytics (Optional)

- [ ] **Privacy policy & terms** page content.
  - Update based on Supabase data handling.
  
- [ ] **Cookie consent** banner (optional):
  - Add if tracking/analytics is used.
  
- [ ] **Analytics** setup (e.g., Plausible, Hotjar, Google Analytics):
  - Add tracking code to public pages if required.

## Monitoring & Maintenance

- [ ] **Supabase monitoring**:
  - Enable Supabase alerts for quota/performance.
  
- [ ] **Netlify monitoring**:
  - Set up email notifications for failed deploys.
  - Monitor build logs and site analytics.
  
- [ ] **Backups**:
  - Enable Supabase automated backups.
  - Document recovery process.
  
- [ ] **Documentation**:
  - Add admin user manual to a private wiki or README.
  - Document how to add/edit doctors, services, manage gallery.

## Done! 🎉

Once all items are checked, the site is ready for production use.
Ongoing: monitor analytics, user feedback, and iterate on content.
