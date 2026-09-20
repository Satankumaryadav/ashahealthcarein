# Supabase Initial Admin User & Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up or log in.
2. Click "New Project" and fill in:
   - **Name**: Asha Healthcare
   - **Database Password**: (generate a strong password and save it securely)
   - **Region**: Choose closest to your users (e.g., `us-east-1` for USA, `eu-west-1` for EU, `ap-south-1` for India)
3. Wait for project to be created (~2 minutes).

## Step 2: Run the Complete SQL Schema

1. In Supabase dashboard, click **SQL Editor** (left sidebar).
2. Click **New Query**.
3. Copy and paste the entire content of `SQL_SCHEMA_COMPLETE.sql` from this project.
4. Click **Run** (play button, top-right of editor).
5. Wait for completion (you should see "Query successful" or similar message).
6. Verify tables exist:
   - Click **Table Editor** in the left sidebar.
   - You should see: `doctors`, `services`, `facilities`, `gallery`, `admin_profiles`, `audit_logs`.

## Step 3: Create Initial Admin User via Auth Dashboard

1. In Supabase dashboard, click **Authentication** (left sidebar).
2. Click **Users** tab.
3. Click **Invite** button (or **Create new user** if available).
4. Enter:
   - **Email**: `admin@ashahealthcare.in` (or your preferred email)
   - **Password**: (generate a strong password and save it securely)
5. Check **Auto confirm user** (so the user is active immediately).
6. Click **Create user**.
7. **Copy the user's UUID** (click on the user to see it) — you'll need this in Step 4.

## Step 4: Create Admin Profile Row

1. In Supabase, click **SQL Editor** → **New Query**.
2. Replace `YOUR_USER_UUID_HERE` with the UUID from Step 3 and run:

```sql
INSERT INTO public.admin_profiles (id, user_role, notes)
VALUES ('YOUR_USER_UUID_HERE', 'super_admin', 'Initial super admin user for Asha Healthcare');
```

Example (with a fake UUID):
```sql
INSERT INTO public.admin_profiles (id, user_role, notes)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'super_admin', 'Initial super admin user for Asha Healthcare');
```

3. Click **Run**.
4. Verify: Go to **Table Editor** → **admin_profiles** table → you should see the new row.

## Step 5: [Optional] Seed Mock Content

To populate the site with mock doctors/services/etc., run this SQL query:

```sql
INSERT INTO public.doctors (name, specialty, bio, image, status) VALUES
('Dr. Sanjeev Gandhi', 'General Physician & Surgeon', 'Supports surgery planning and recovery with a focus on safety, comfort, and clear communication.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80', 'published'),
('Dr. Ayushi', 'Gynecology', 'Offers compassionate women''s healthcare services, consultation, and supportive care pathways.', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80', 'published');

INSERT INTO public.services (title, category, description, image, status) VALUES
('General Consultation', 'Primary Care', 'Routine consultations and health reviews designed around individual care needs.', 'https://images.unsplash.com/photo-1538108149393-fbbd81895973?auto=format&fit=crop&w=900&q=80', 'published'),
('Specialist Review', 'Medical Care', 'Focused specialist assessments for recovery, ongoing management, and clear treatment planning.', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=900&q=80', 'published'),
('Women''s Health', 'Gynecology', 'Comprehensive support for consultations, health education, and women''s wellness needs.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80', 'published'),
('Nursing Care', 'Support Services', 'Skilled nursing assistance and attentive support to promote safe, comfortable recovery.', 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=900&q=80', 'published'),
('Rehabilitation Support', 'Recovery', 'Structured recovery support that balances comfort, mobility, and patient confidence.', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80', 'published'),
('Family Wellness', 'Preventive Care', 'Personalised health planning with a family-centred approach to long-term wellbeing.', 'https://images.unsplash.com/photo-1541534401786-8ac7e1d65f7b?auto=format&fit=crop&w=900&q=80', 'published');
```

## Step 6: Get Your Supabase Project Credentials

You'll need these for Netlify and local testing:

1. In Supabase dashboard, click **Project Settings** (gear icon, bottom-left).
2. Click **API** tab.
3. Copy:
   - **Project URL**: (looks like `https://xxxxx.supabase.co`)
   - **anon public key**: (labeled "public" or "anon", NOT the service_role key)

4. **Save these securely** — you'll add them to Netlify in the next step.

## Step 7: [Optional] Test Locally

Before deploying to Netlify, test locally:

1. Edit `admin-assets/js/supabase-config-client.js` and uncomment:
```javascript
window.SUPABASE_URL = 'https://your-project.supabase.co';
window.SUPABASE_ANON_KEY = 'your-public-anon-key';
```

2. Open `index.html` in a browser and check that doctors/services load from Supabase.
3. Open `admin/index.html`, log in with `admin@ashahealthcare.in` and the password from Step 3.
4. Try creating/editing a doctor or service.
5. Verify changes save to Supabase (check Table Editor → doctors/services).

## Next Steps

- See `NETLIFY_DEPLOY.md` for Netlify deployment instructions.
- See `REMAINING_TASKS.md` for post-deployment checklist.
- See `DEPLOY_TESTING_GUIDE.md` for verification and testing steps.
