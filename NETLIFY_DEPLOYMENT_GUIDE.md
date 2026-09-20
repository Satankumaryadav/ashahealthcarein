# Netlify Deployment Step-by-Step Guide

## Overview
This site is static HTML/CSS/JS hosted on Netlify. The build command injects Supabase credentials into a config file so the site can connect to your Supabase project.

## Prerequisites
Before starting, ensure you have:
- ✅ Supabase project created and SQL schema applied (see `SUPABASE_SETUP_GUIDE.md`)
- ✅ Admin user created in Supabase Auth
- ✅ Project URL and anon key from Supabase (see SUPABASE_SETUP_GUIDE.md, Step 6)
- ✅ GitHub account (or you can deploy via drag-and-drop later)

---

## Method 1: Deploy via GitHub (Recommended)

### Step 1: Push code to GitHub

1. Create a new GitHub repository (e.g., `asha-healthcare-clinic`)
2. Clone this project, commit, and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Asha Healthcare clinic website"
   git remote add origin https://github.com/YOUR_USERNAME/asha-healthcare-clinic.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect to Netlify

1. Go to https://netlify.com and sign up or log in.
2. Click **New site from Git** button.
3. Choose **GitHub**, then authorize Netlify to access your repositories.
4. Select your `asha-healthcare-clinic` repository.
5. In the deployment settings:
   - **Build command**: Leave blank (Netlify automatically reads `netlify.toml`)
   - **Publish directory**: `.` (or leave blank — the root)
6. Click **Deploy site** (or **Save and deploy** if prompted).

### Step 3: Set Environment Variables

1. After deployment is created, go to **Site settings** (top-right menu).
2. Go to **Build & deploy** → **Environment**.
3. Click **Add environment variables**.
4. Add two variables:
   - **Key**: `SUPABASE_URL` | **Value**: `https://your-project-ref.supabase.co`
   - **Key**: `SUPABASE_ANON_KEY` | **Value**: `your-public-anon-key`

5. Click **Save**.
6. Go to **Deploys** tab → **Trigger deploy** → **Deploy site** (to rebuild with new env vars).

### Step 4: Verify Deployment

1. Wait for the build to complete (you should see a green "Published" status).
2. Click the deployment link (from the "Publish log" or top-left site name).
3. Verify:
   - Public site loads and displays doctors/services from Supabase.
   - Visit `/admin/` and log in with your Supabase credentials.
   - Admin CRUD works (add/edit/delete doctor/service).

---

## Method 2: Deploy via Drag-and-Drop

### Step 1: Prepare the Build

1. If you haven't already, set the `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `admin-assets/js/supabase-config-client.js`:
   ```javascript
   window.SUPABASE_URL = 'https://your-project.supabase.co';
   window.SUPABASE_ANON_KEY = 'your-public-anon-key';
   ```

2. Save the file.

### Step 2: Drag-and-Drop to Netlify

1. Go to https://netlify.com/drop
2. Drag this project folder (or the entire `CLinic` folder) into the drop zone.
3. Netlify will instantly deploy it.

### Step 3: Configure Environment Variables (Post-Deploy)

1. After deployment, you'll see a site URL (e.g., `https://random-name-1234.netlify.app`).
2. Go to **Site settings** → **Build & deploy** → **Environment**.
3. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as in Method 1, Step 3.
4. Go to **Deploys** → **Trigger deploy** → **Deploy site**.

---

## Method 3: Deploy via CLI (Advanced)

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Authenticate & Deploy

```bash
cd path/to/CLinic
netlify deploy --prod
```

### Step 3: Set Environment Variables

```bash
netlify env:set SUPABASE_URL "https://your-project.supabase.co"
netlify env:set SUPABASE_ANON_KEY "your-public-anon-key"
```

### Step 4: Trigger a Rebuild

```bash
netlify deploy --prod
```

---

## Custom Domain Setup (Optional but Recommended)

### Step 1: Buy or Prepare Domain

If you already own `ashahealthcare.in`, proceed to Step 2. Otherwise, buy it from a registrar (e.g., GoDaddy, Namecheap, Google Domains).

### Step 2: Update DNS

1. In Netlify dashboard, go to **Domain settings** → **Custom domains**.
2. Click **Add domain** and enter `ashahealthcare.in`.
3. Netlify will provide DNS records to add to your domain registrar.
4. In your domain registrar's control panel, add the DNS records provided by Netlify.
5. Wait for DNS propagation (can take 5 minutes to 48 hours).

### Step 3: Enable SSL

1. Netlify automatically provisions an SSL certificate via Let's Encrypt.
2. Once DNS is propagated, HTTPS will be enforced automatically.
3. Check: Visit `https://ashahealthcare.in` — should load securely.

---

## Post-Deployment Verification Checklist

- [ ] **Public site loads**: Visit your Netlify site URL → verify homepage, content loads from Supabase.
- [ ] **All pages accessible**: Visit `/about`, `/doctors`, `/services`, `/facilities`, `/nursing-home`, `/gallery`, `/contact`, `/privacy`, `/privacy-policy`.
- [ ] **Admin login works**: Visit `/admin/` → log in with Supabase credentials (e.g., `admin@ashahealthcare.in`).
- [ ] **Admin CRUD works**: Add a new doctor/service → verify it appears in the list and saves to Supabase.
- [ ] **WhatsApp CTA visible**: Check floating WhatsApp button on pages.
- [ ] **Contact form responds**: Fill and submit contact form (displays mock message).
- [ ] **Responsive on mobile**: Test on mobile device or DevTools → verify layout is readable.
- [ ] **Images load**: Verify all images (doctors, services, gallery) display properly.

---

## Troubleshooting

### "Admin CRUD not working" / "Content not loading"

1. Check Netlify env vars are set correctly (Site settings → Environment).
2. Check browser console for errors (F12 → Console tab).
3. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` don't have typos.
4. Verify Supabase RLS policies are enabled (SQL schema should have done this).
5. Try logging out of the admin UI and logging back in.

### "Supabase connection refuses / CORS error"

1. Check your Supabase project is active (not paused in dashboard).
2. Verify RLS policies allow anonymous SELECT on content tables (check SQL schema).
3. Check CORS policy: in Supabase, RLS should allow anonymous reads for "published" content.

### "Build fails on Netlify"

1. Check Netlify build logs (Deploys tab → Recent deploy → View deploy log).
2. Common issue: `netlify.toml` references a file that doesn't exist. Ensure `admin-assets/js/supabase-config-client.js` exists before build.
3. If using Netlify UI to inject env vars via build command, ensure the path in the command is correct.

---

## Next Steps

- See `SUPABASE_SETUP_GUIDE.md` if you haven't set up Supabase yet.
- See `DEPLOY_TESTING_GUIDE.md` for comprehensive testing after deployment.
- See `REMAINING_TASKS.md` for post-deployment tasks (SSL, custom domain, monitoring, etc.).
