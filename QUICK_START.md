# 🚀 Asha Healthcare – Quick Deployment Checklist

## Pre-Deployment (Code is Ready ✅)

Your website code is **complete and ready for deployment**. All that remains is:
1. Set up Supabase (5 databases & auth)
2. Deploy to Netlify
3. Test
4. Configure custom domain (optional)

**Total time: ~1 hour**

---

## Step 1: Set Up Supabase (15 minutes)

Follow: **`SUPABASE_SETUP_GUIDE.md`**

- [ ] Create Supabase project at https://supabase.com
- [ ] Copy `SQL_SCHEMA_COMPLETE.sql` → paste into Supabase SQL Editor → Run
- [ ] Create admin user in Supabase Auth (email: `admin@ashahealthcare.in`)
- [ ] Copy the admin user's UUID
- [ ] Run seed SQL to create admin_profiles row (paste UUID)
- [ ] [Optional] Seed mock doctors/services content
- [ ] Copy **Project URL** and **anon public key** (you'll need these for Netlify)

**Result**: Supabase project with tables, admin user, and sample content ✅

---

## Step 2: Deploy to Netlify (10 minutes)

Follow: **`NETLIFY_DEPLOYMENT_GUIDE.md`**

**Option A: GitHub (Recommended)**
- [ ] Push this project to GitHub
- [ ] Go to https://netlify.com → "New site from Git"
- [ ] Connect GitHub, select repo
- [ ] Click **Deploy site**

**Option B: Drag-and-Drop**
- [ ] Go to https://netlify.drop
- [ ] Drag this folder into Netlify
- [ ] Wait for deployment to complete

**Result**: Site deployed at a Netlify URL (e.g., `https://random-name-1234.netlify.app`) ✅

---

## Step 3: Configure Environment Variables (5 minutes)

**After deployment, set Netlify env vars:**

1. In Netlify dashboard → **Site settings** → **Build & deploy** → **Environment**
2. Click **Add environment variables**
3. Add two variables:
   - **Name**: `SUPABASE_URL` | **Value**: `https://your-project-ref.supabase.co` (from Step 1)
   - **Name**: `SUPABASE_ANON_KEY` | **Value**: `your-public-anon-key` (from Step 1)
4. Go to **Deploys** → **Trigger deploy**

**Result**: Site rebuilt with Supabase connection ✅

---

## Step 4: Test (15 minutes)

Follow: **`DEPLOY_TESTING_GUIDE.md`** (or quick checks below)

- [ ] **Public site**: Visit your Netlify URL → homepage loads, content visible
- [ ] **All pages**: Visit `/about`, `/doctors`, `/services`, `/contact` — all load without errors
- [ ] **Admin login**: Visit `/admin/` → log in with `admin@ashahealthcare.in` + password → admin dashboard loads
- [ ] **Admin CRUD**: Add a doctor → appears in list → edit it → delete it — all work
- [ ] **Mobile**: Open in mobile browser or DevTools (F12 → device toggle) → responsive layout looks good
- [ ] **Console**: F12 → Console tab → no red errors

**Result**: All systems working ✅

---

## Step 5: Custom Domain & SSL [OPTIONAL]

If you own `ashahealthcare.in`:

1. In Netlify dashboard → **Domain settings** → **Custom domains** → Add `ashahealthcare.in`
2. Netlify provides DNS records
3. Update DNS at your domain registrar (GoDaddy, Namecheap, etc.)
4. Wait for DNS propagation (5 min–48 hours)
5. Netlify auto-provisions HTTPS via Let's Encrypt

**Result**: Site accessible at `https://ashahealthcare.in` ✅

---

## 🎉 You're Live!

Your Asha Healthcare website is now live with:

✅ Public website (10 pages)  
✅ Admin dashboard for content management  
✅ Supabase database (PostgreSQL)  
✅ Secure Supabase Auth  
✅ Image storage  
✅ RLS policies (published content visible to all, drafts only to admins)  
✅ Netlify hosting (CDN, auto-deploys when you push to GitHub)  
✅ HTTPS & security headers  
✅ Mobile-responsive design  
✅ SEO optimized  

---

## 📚 Documentation Reference

| Guide | Purpose |
|-------|---------|
| **README.md** | Project overview, how to use |
| **SUPABASE_SETUP_GUIDE.md** | Detailed Supabase setup steps |
| **NETLIFY_DEPLOYMENT_GUIDE.md** | Detailed Netlify deployment (3 methods) |
| **DEPLOY_TESTING_GUIDE.md** | Comprehensive testing checklist |
| **REMAINING_TASKS.md** | Post-deployment, monitoring, future features |
| **netlify.toml** | Build config, security headers, cache settings |
| **SQL_SCHEMA_COMPLETE.sql** | Database schema (copy-paste into Supabase) |

---

## Troubleshooting

**Q: "Admin CRUD not working"**  
A: Check Netlify env vars are set. Go to Netlify → Site Settings → Environment → verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are present.

**Q: "Content not loading from Supabase"**  
A: Verify Supabase project is active (not paused) and content status is set to 'published'.

**Q: "Login fails"**  
A: Verify the admin user exists in Supabase Auth and there's an `admin_profiles` row with matching user ID.

**Q: "CORS error"**  
A: Check RLS policies allow anonymous reads on content tables. Run SQL schema again to ensure policies are enabled.

---

## Next Steps

1. **Announce your site**: Email stakeholders with the live URL
2. **Copy content**: Ask team to provide real doctors, services, facility info
3. **Upload images**: Use admin UI to upload real images to Supabase Storage
4. **Edit content**: Use admin dashboard to update doctors, services, etc.
5. **Monitor**: Check Netlify and Supabase dashboards regularly
6. **Plan features**: Contact forms → Netlify Forms, payments → Stripe, emails → SendGrid

---

## Support

All guides are in this project folder. If you get stuck:
1. Check the relevant guide (SUPABASE_SETUP, NETLIFY_DEPLOYMENT, DEPLOY_TESTING)
2. See browser console (F12 → Console) for error messages
3. Check Netlify build logs (Deploys → View log)
4. Check Supabase project health

---

**You've got this! 🎉 Your Asha Healthcare website is ready for the world.**

See you on the live site! 🚀
