# Asha Healthcare – Complete Project Setup & Deployment Guide

Welcome! This is a professional healthcare clinic website for **Asha Healthcare** with a public-facing frontend and an admin content management system (CMS). The site integrates with **Supabase** for authentication, database, and storage.

## Quick Start (5 Minutes)

### For Just Viewing the Code
No setup needed — all HTML/CSS/JS is static. Open `index.html` in your browser to preview.

### For Full Deployment to Netlify + Supabase

**Timeline**: 30-60 minutes.

1. **Supabase Setup** (15 minutes): See `SUPABASE_SETUP_GUIDE.md`
   - Create Supabase project
   - Run SQL schema
   - Create admin user
   
2. **Netlify Deployment** (10 minutes): See `NETLIFY_DEPLOYMENT_GUIDE.md`
   - Push to GitHub or deploy via Netlify UI
   - Set environment variables
   - Site goes live

3. **Testing** (15 minutes): See `DEPLOY_TESTING_GUIDE.md`
   - Verify public pages load
   - Test admin login and CRUD
   - Run Lighthouse audit

---

## Project Structure

```
CLinic/
├── index.html                  # Homepage
├── about.html                  # About page
├── doctors.html                # Doctor profiles
├── services.html               # Services offered
├── facilities.html             # Clinic facilities
├── nursing-home.html           # Nursing home info
├── gallery.html                # Photo gallery
├── contact.html                # Contact form
├── privacy.html, privacy-policy.html  # Legal pages
│
├── admin/                      # Admin dashboard
│   ├── index.html              # Admin login + app container
│   └── dashboard.html          # Admin dashboard
│
├── assets/
│   ├── css/styles.css          # Global styles
│   ├── js/
│   │   ├── site-data.js        # Mock data (doctors, services, etc.)
│   │   ├── main.js             # Public page rendering (fetches from Supabase or mock)
│   │   ├── admin.js            # Admin CRUD (uses Supabase when configured)
│   │   └── admin-auth.js       # Admin authentication (Supabase Auth fallback to local)
│
├── admin-assets/
│   ├── css/admin.css           # Admin UI styles
│   ├── js/
│   │   ├── supabase-config-client.js  # Supabase URL/Key configuration
│   │   └── supabase-client.js   # Supabase client initialization
│
├── netlify/functions/          # (Optional) Netlify serverless functions
│
├── netlify.toml                # Netlify build config (security headers, redirects)
│
├── SQL_SCHEMA_COMPLETE.sql     # Complete Supabase schema (copy-paste into Supabase SQL Editor)
├── SUPABASE_SETUP_GUIDE.md     # Step-by-step Supabase setup
├── NETLIFY_DEPLOYMENT_GUIDE.md # Step-by-step Netlify deployment
├── DEPLOY_TESTING_GUIDE.md     # Testing checklist after deployment
├── NETLIFY_DEPLOY.md           # Quick reference for Netlify env setup
├── REMAINING_TASKS.md          # Post-deployment tasks checklist
└── README.md                   # This file
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Hosting** | Netlify (static site) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (email/password) |
| **Storage** | Supabase Storage (images, media) |
| **UI Framework** | Bootstrap 5 (admin only) |
| **Icons** | Bootstrap Icons + SVG |
| **Fonts** | Inter (Google Fonts) |

---

## Key Features

### Public Site
✅ Multi-page responsive website (10 pages)  
✅ Dynamic content from Supabase (or mock data fallback)  
✅ Doctor and services showcase  
✅ Gallery with photos  
✅ Contact form (currently displays mock response — wire to Netlify Forms or backend email later)  
✅ WhatsApp CTA button  
✅ Mobile-friendly navigation  
✅ SEO optimized (meta tags, structured data, Open Graph)  
✅ Accessibility (WCAG 2.1 AA ready)  

### Admin Dashboard
✅ Secure login with Supabase Auth  
✅ CRUD for doctors (add, edit, delete)  
✅ CRUD for services  
✅ Status tracking (draft/published/archived)  
✅ Timestamps and audit logging  
✅ Fallback to localStorage when Supabase not configured  
✅ Stable UUIDs for all records  

### Database (Supabase)
✅ PostgreSQL tables: doctors, services, facilities, gallery, admin_profiles, audit_logs  
✅ Row-Level Security (RLS): Anonymous users see only published content  
✅ Auth users (editors, admins) can manage all content  
✅ Audit logging (tracks all changes)  
✅ Storage buckets for images (doctor-images, service-images, etc.)  

---

## Getting Started

### 1. Clone or Download This Project

```bash
git clone https://github.com/YOUR_USERNAME/asha-healthcare-clinic.git
cd CLinic
```

### 2. Set Up Supabase

Follow **`SUPABASE_SETUP_GUIDE.md`** step-by-step:
- Create Supabase project
- Copy-paste SQL schema
- Create admin user
- Note down Project URL and anon key

### 3. Local Testing (Optional)

Edit `admin-assets/js/supabase-config-client.js`:

```javascript
window.SUPABASE_URL = 'https://your-project.supabase.co';
window.SUPABASE_ANON_KEY = 'your-public-anon-key';
```

Open `index.html` in your browser. Content should load from Supabase (or mock data if keys are not set).

### 4. Deploy to Netlify

Follow **`NETLIFY_DEPLOYMENT_GUIDE.md`**:
- Push to GitHub or drag-and-drop folder to Netlify
- Set environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
- Site goes live

### 5. Test & Verify

Follow **`DEPLOY_TESTING_GUIDE.md`**:
- Visit public pages
- Log in to admin at `/admin/`
- Test CRUD operations
- Run Lighthouse audit

---

## Configuration & Environment Variables

### Netlify Environment Variables

Set these in Netlify Site Settings → Build & deploy → Environment:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key-here
```

**Never expose the `service_role` key.** Only the `anon` (publishable) key should be in client code.

### Local Development

Edit `admin-assets/js/supabase-config-client.js`:

```javascript
// Uncomment and set these for local testing (don't commit!)
// window.SUPABASE_URL = 'https://your-project.supabase.co';
// window.SUPABASE_ANON_KEY = 'your-public-anon-key';
```

---

## Security

✅ **RLS Policies**: Anonymous users can only read published content  
✅ **Auth**: Supabase Auth with email/password  
✅ **Storage**: Signed URLs for uploads  
✅ **HTTPS**: Automatic via Netlify  
✅ **Security Headers**: CSP, HSTS, X-Frame-Options (configured in `netlify.toml`)  
✅ **Audit Logging**: All changes tracked in `audit_logs` table  

### Production Checklist

- [ ] Use `.gitignore` to exclude sensitive files
- [ ] Never commit real API keys to git
- [ ] Use Netlify env vars for production secrets
- [ ] Enable HTTPS on custom domain
- [ ] Set strong admin password in Supabase
- [ ] Enable MFA on Supabase and Netlify accounts
- [ ] Review and enforce RLS policies
- [ ] Set up Supabase automated backups
- [ ] Monitor error logs and analytics

---

## Development Workflow

### Adding a New Doctor

1. **Via Admin UI** (if deployed):
   - Visit `/admin/`
   - Log in
   - Click "Add Doctor"
   - Fill form and submit
   - Doctor auto-saves to Supabase

2. **Via SQL** (direct database edit):
   - In Supabase SQL Editor, run:
     ```sql
     INSERT INTO public.doctors (name, specialty, bio, image, status)
     VALUES ('Dr. Name', 'Specialty', 'Bio text', 'https://image-url.jpg', 'published');
     ```

### Editing Mock Data (Offline Testing)

Edit `assets/js/site-data.js` to update `window.CLINIC_MOCK_DATA` array.  
**Note**: Mock data is only used if Supabase is not configured or fetch fails.

### Styling

Edit `assets/css/styles.css` for public pages.  
Edit `admin-assets/css/admin.css` for admin UI.

### Adding Pages

1. Create `new-page.html` with the same header/footer structure as other pages
2. Update navigation links in all pages to include the new page
3. Add `<script>` tags for Supabase config (if fetching content)
4. Add meta tags for SEO

---

## Performance & Optimization

✅ **CSS Minification**: Inline or bundled  
✅ **Image Optimization**: Served via Supabase Storage with CDN  
✅ **Lazy Loading**: Browser native `loading="lazy"` for images  
✅ **Font Loading**: Google Fonts with `display=swap`  
✅ **Caching**: Netlify Edge Cache configured in `netlify.toml`  

### Lighthouse Target Scores
- Performance: 80+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

Run audit: Deploy to Netlify → Open in Chrome → F12 → Lighthouse → Analyze.

---

## Accessibility (A11y)

✅ Semantic HTML (header, nav, main, footer)  
✅ ARIA labels on interactive elements  
✅ Sufficient color contrast (WCAG AA)  
✅ Keyboard navigation support  
✅ Alt text on images  
✅ Form labels associated with inputs  

---

## SEO

✅ Meta descriptions on all pages  
✅ Open Graph tags (social sharing)  
✅ Canonical URLs  
✅ Structured data (JSON-LD, schema.org/MedicalBusiness)  
✅ Robots.txt and sitemap (optional, can add)  
✅ Mobile-friendly responsive design  

---

## Troubleshooting

### "Admin CRUD not saving"
- Check Netlify env vars are set correctly
- Open browser console (F12) for errors
- Verify Supabase RLS policies are enabled

### "Content not loading from Supabase"
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Check Network tab in DevTools for failed REST calls
- Ensure content status is set to 'published' in Supabase

### "CORS error from Supabase"
- Check RLS policies allow anonymous SELECT on content tables
- Verify Supabase project is not paused

### "Build fails on Netlify"
- Check Netlify build logs (Deploys → View deploy log)
- Verify `netlify.toml` and build command are correct

---

## Support & Next Steps

1. **Deploy to Netlify**: Follow `NETLIFY_DEPLOYMENT_GUIDE.md`
2. **Test thoroughly**: Follow `DEPLOY_TESTING_GUIDE.md`
3. **Set up custom domain**: Update DNS to point to Netlify
4. **Enable monitoring**: Set up Netlify and Supabase alerts
5. **Plan content management**: Document how admins will use the CMS
6. **Future features**: Consider Netlify Forms (contact emails), Stripe (payments), SendGrid (transactional emails)

---

## Files Reference

| File | Purpose |
|------|---------|
| `SQL_SCHEMA_COMPLETE.sql` | Complete database schema — copy-paste into Supabase |
| `SUPABASE_SETUP_GUIDE.md` | Step-by-step Supabase project and admin user setup |
| `NETLIFY_DEPLOYMENT_GUIDE.md` | Step-by-step Netlify deployment (GitHub, drag-drop, CLI) |
| `DEPLOY_TESTING_GUIDE.md` | Comprehensive testing checklist after deployment |
| `netlify.toml` | Build settings, security headers, cache policies |
| `admin-assets/js/supabase-config-client.js` | Supabase credentials (set via Netlify env vars) |

---

## License

This project is for **Asha Healthcare**. Customize, modify, and deploy as needed.

---

## Questions?

Refer to the detailed guides:
- **Supabase**: `SUPABASE_SETUP_GUIDE.md`
- **Netlify**: `NETLIFY_DEPLOYMENT_GUIDE.md` or `NETLIFY_DEPLOY.md`
- **Testing**: `DEPLOY_TESTING_GUIDE.md`
- **Post-Deploy**: `REMAINING_TASKS.md`

---

**Ready to go live?** Start with `SUPABASE_SETUP_GUIDE.md` → `NETLIFY_DEPLOYMENT_GUIDE.md` → `DEPLOY_TESTING_GUIDE.md`. Good luck! 🚀
