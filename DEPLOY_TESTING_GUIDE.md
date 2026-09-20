# Deployment Testing & Verification Guide

## Integration Tests (After Deployment)

### Test 1: Public Page Content Loading

**Objective**: Verify public pages fetch published content from Supabase (or fall back to mock data).

**Steps**:
1. Visit your deployed Netlify site URL (e.g., https://asha-healthcare.netlify.app or https://ashahealthcare.in).
2. Check the homepage:
   - [ ] Hero section displays correctly.
   - [ ] Doctor cards render (from Supabase or mock data).
   - [ ] Services cards render.
   - [ ] Facilities display.
   - [ ] Gallery images show.
3. Visit `/about`, `/doctors`, `/services`, `/facilities`, `/nursing-home`, `/gallery`, `/contact`:
   - [ ] Each page loads without errors.
   - [ ] Content is visible and readable.
   - [ ] Images load properly.
4. **Check browser console** (F12 → Console):
   - [ ] No JavaScript errors (red messages).
   - [ ] If Supabase is configured, should see "Supabase client initialized" log.
   - [ ] If fetch succeeds, should see successful REST calls in Network tab.

---

### Test 2: Admin Login & CRUD

**Objective**: Verify admin authentication and content management works.

**Steps**:
1. Visit `/admin/` on your deployed site.
2. You should see a login form.
3. Log in with your Supabase admin credentials (e.g., `admin@ashahealthcare.in` / password you set in `SUPABASE_SETUP_GUIDE.md`).
   - [ ] Login succeeds (if Supabase configured correctly).
   - [ ] If login fails, check: Supabase Auth user exists, admin_profiles row exists with matching user_id.
4. After login, you should see the admin dashboard:
   - [ ] "Doctors" section with list of doctors.
   - [ ] "Services" section with list of services.
5. **Test Add Doctor**:
   - [ ] Click "Add Doctor" button.
   - [ ] Fill form: Name, Specialty, Image URL, Bio.
   - [ ] Click Submit.
   - [ ] Doctor appears in the list.
   - [ ] Refresh page — doctor still appears (persisted to Supabase or localStorage).
6. **Test Edit Doctor**:
   - [ ] Click "Edit" on a doctor.
   - [ ] Modify one or more fields.
   - [ ] Click Submit.
   - [ ] Changes appear in the list.
   - [ ] Refresh page — changes persist.
7. **Test Delete Doctor**:
   - [ ] Click "Delete" on a doctor.
   - [ ] Confirm deletion.
   - [ ] Doctor removed from list.
   - [ ] Refresh page — doctor still gone (persisted to Supabase).
8. Repeat steps 5-7 for **Services**.
9. **Check browser console**:
   - [ ] No JavaScript errors.
   - [ ] If Supabase configured, should see upsert/delete calls in Network tab.

---

### Test 3: RLS Policies (Anon vs. Authenticated)

**Objective**: Verify Row-Level Security policies enforce correctness.

**Prerequisites**: Have mock published content in Supabase.

**Steps**:

#### 3a: Anonymous User Can Read Published Content
1. Open an **incognito/private browser tab** (so you're logged out).
2. Visit your deployed site.
3. [ ] Public content displays (doctors/services with status='published').
4. Open DevTools → **Network** tab.
5. Refresh the page.
6. Look for REST calls to Supabase (e.g., `/rest/v1/doctors`).
7. [ ] Response contains only published records (not draft/archived).

#### 3b: Authenticated User Can Read All & Write
1. In the same private tab, visit `/admin/` and log in.
2. [ ] Admin can see/edit all content (published + draft).
3. Create a new doctor with status='draft'.
4. Refresh the page — draft doctor still visible in admin.
5. Log out (click "Sign out" button).
6. Visit homepage — draft doctor should NOT appear.
7. Log back in — draft doctor visible again.

#### 3c: Non-Admin Cannot Edit
1. (If available) Create a second admin user with role='editor' (not 'admin').
2. Log in as the editor.
3. [ ] Editor can create/edit content.
4. Log in as the original admin (super_admin).
5. Try to create a user with role='admin' — if RLS is strict, only super_admin can do this.

---

### Test 4: Storage Upload & Image Display

**Objective**: Verify image uploads to Supabase Storage and display correctly (if implemented).

**Steps**:
1. In admin UI, when editing a doctor/service, look for an image upload field.
2. If upload is available:
   - [ ] Select an image file.
   - [ ] Upload succeeds (check Network tab in DevTools).
   - [ ] Image displays in the item card.
   - [ ] Refresh page — image still visible (persisted).
3. Check image URL: should be from Supabase Storage (e.g., `https://your-project.supabase.co/storage/v1/object/public/doctor-images/...`).

> Note: If image upload UI is not yet implemented, this test is skipped (see REMAINING_TASKS.md for "Implement file uploads").

---

### Test 5: Responsive Design & Mobile

**Objective**: Verify site works on mobile devices.

**Steps**:
1. Open your Netlify site on an **iPhone** or **Android phone**.
2. [ ] Page loads and is readable (text is not too small).
3. [ ] Navigation toggle (hamburger menu) works on mobile.
4. [ ] Cards display in a single column on small screens.
5. [ ] Doctor/service images display at appropriate size.
6. [ ] WhatsApp CTA button is visible and clickable.
7. [ ] Contact form is usable on mobile.

**Alternate (DevTools)**:
1. Open site in Chrome/Firefox.
2. Press F12 → DevTools.
3. Click device toggle (top-left, phone icon).
4. Select "iPhone 12" or "Galaxy S21" preset.
5. Verify layout as above.

---

### Test 6: Contact Form

**Objective**: Verify contact form submission works (currently displays mock response; can be wired to Netlify Forms or email later).

**Steps**:
1. Visit `/contact` page.
2. Fill in the form:
   - [ ] Name field accepts input.
   - [ ] Email field accepts valid email format.
   - [ ] Message field accepts larger text.
3. [ ] Submit button is clickable.
4. [ ] After submit, a success message appears (e.g., "Thank you, [Name]...").
5. [ ] Form resets (fields are cleared).

> Note: This is currently a mock form. To wire to real email, implement Netlify Forms or a backend function (see REMAINING_TASKS.md).

---

### Test 7: Security Headers & CORS

**Objective**: Verify security headers are present and CORS allows Supabase.

**Steps**:
1. Open DevTools → **Network** tab.
2. Visit your site.
3. Click on the first HTML response (e.g., `index.html`).
4. Look at **Response Headers** section.
5. [ ] You should see headers like:
   - `Content-Security-Policy`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `Strict-Transport-Security` (if HTTPS enabled)
6. Check REST calls to Supabase:
   - [ ] Calls to `https://your-project.supabase.co/rest/v1/...` succeed (no CORS errors).
   - [ ] Authorization header includes the anon key (if visible in Network tab).

---

### Test 8: Performance (Lighthouse Audit)

**Objective**: Verify site performance is acceptable.

**Steps**:
1. Open your Netlify site in **Chrome**.
2. Press F12 → DevTools.
3. Go to **Lighthouse** tab (or click "Analyze page load" if using older Chrome).
4. Select "Mobile" and "Throttling: Slow 4G" for realistic testing.
5. Click **Analyze page load**.
6. After ~1 minute, you'll see scores:
   - [ ] **Performance**: Aim for 70+ (target 90+).
   - [ ] **Accessibility**: Aim for 80+ (target 95+).
   - [ ] **Best Practices**: Aim for 80+.
   - [ ] **SEO**: Aim for 80+.
7. Review suggestions and make optimizations if needed (e.g., compress images, minify CSS/JS).

---

### Test 9: Accessibility (A11y)

**Objective**: Verify site is accessible to users with disabilities.

**Steps**:
1. Install the **WAVE** browser extension (https://wave.webaim.org/extension/).
2. Visit your Netlify site.
3. Click the WAVE icon → Click "WAVE this page".
4. Review for:
   - [ ] **Errors**: Should be 0 (critical a11y issues).
   - [ ] **Contrast**: All text should have sufficient contrast ratio (4.5:1 for body text, 3:1 for large text).
5. Test keyboard navigation:
   - [ ] Press **Tab** repeatedly — focus should cycle through all interactive elements.
   - [ ] Press **Enter** on buttons — they should activate.
   - [ ] Press **Enter** on form fields — inputs should be editable.
6. Test **screen reader** (NVDA if Windows, JAWS if Windows, VoiceOver if Mac/iOS):
   - [ ] Page title is announced.
   - [ ] Headings are announced with level (h1, h2, etc.).
   - [ ] Form labels are associated with inputs.
   - [ ] Images have alt text.

---

### Test 10: Cross-Browser Compatibility

**Objective**: Verify site works on multiple browsers.

**Steps**:
1. Test on:
   - [ ] Chrome (latest)
   - [ ] Firefox (latest)
   - [ ] Safari (latest, if on Mac)
   - [ ] Edge (latest)
2. On each browser:
   - [ ] Site loads and displays correctly.
   - [ ] Admin login works.
   - [ ] Admin CRUD works.
   - [ ] No console errors (F12 → Console).

---

## Manual Testing Checklist (Print & Check Off)

- [ ] All public pages load without errors.
- [ ] Content from Supabase displays correctly (if configured).
- [ ] Admin login works with Supabase credentials.
- [ ] Admin can add, edit, delete doctors and services.
- [ ] Changes persist after page refresh.
- [ ] Anonymous users see only published content.
- [ ] Images load from Supabase Storage (if configured).
- [ ] Responsive design works on mobile.
- [ ] Contact form submits and displays success message.
- [ ] Security headers are present.
- [ ] WhatsApp CTA button is visible and functional.
- [ ] No broken links.
- [ ] Lighthouse score is acceptable (70+).
- [ ] No a11y errors in WAVE scan.
- [ ] Works on Chrome, Firefox, Safari, Edge.

---

## Automated Testing (Optional)

If you want to automate tests:

1. Install testing framework (e.g., Playwright, Cypress):
   ```bash
   npm install -D @playwright/test
   ```

2. Create a test file (e.g., `tests/smoke.spec.js`):
   ```javascript
   import { test, expect } from '@playwright/test';

   test('homepage loads', async ({ page }) => {
     await page.goto('https://asha-healthcare.netlify.app');
     await expect(page).toHaveTitle(/Asha Healthcare/);
     await expect(page.locator('text=Doctors')).toBeVisible();
   });

   test('admin login', async ({ page }) => {
     await page.goto('https://asha-healthcare.netlify.app/admin/');
     await page.fill('[name="username"]', 'admin@ashahealthcare.in');
     await page.fill('[name="password"]', 'your-password');
     await page.click('button[type="submit"]');
     await expect(page.locator('text=Doctors')).toBeVisible();
   });
   ```

3. Run tests:
   ```bash
   npx playwright test
   ```

---

## Deployment Success Criteria

You can **go live** once all of the following are true:

- ✅ Public site loads and displays content from Supabase (or mock data with env vars set).
- ✅ Admin login works with Supabase Auth.
- ✅ Admin CRUD persists to Supabase.
- ✅ All pages load without errors.
- ✅ Responsive design works on mobile.
- ✅ Lighthouse score is 70+ (ideally 80+).
- ✅ No a11y critical errors (WAVE scan).
- ✅ Custom domain is set up and SSL is enabled (if applicable).
- ✅ Security headers are configured.

---

## Next Steps After Verification

- Update your domain registrar to point to Netlify (if using a custom domain).
- Enable monitoring & alerts on Netlify and Supabase dashboards.
- Set up analytics (Google Analytics, Plausible, etc.) if desired.
- Document admin procedures for future team members.
- Plan for future features (e.g., email notifications, appointment scheduling, payments).
