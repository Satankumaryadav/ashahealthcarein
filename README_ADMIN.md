Asha Healthcare — Admin Frontend (scaffold)

Overview
- This folder contains an admin frontend scaffold built with HTML, Bootstrap 5, and vanilla JS.
- It is client-side only and designed to later integrate with Supabase.

Quick start
- Open `admin/index.html` in a browser to access the admin login page.
- Default dev credential (first-run): username `admin`, password `Admin@123`.
- After login, the admin UI pages are available (see `admin/dashboard.html`).

Notes
- Data is persisted to `localStorage` under key `clinic_data` by the admin CRUD scripts.
- Supabase integration placeholder: `admin-assets/js/supabase-config.js`.
- Replace the default login flow with Supabase Auth before using in production.

Files added
- admin/dashboard.html — Dashboard skeleton
- admin-assets/css/admin.css — Admin styles
- admin-assets/js/auth.js — Lightweight auth interface (wrapper)
- admin-assets/js/supabase-config.js — Supabase placeholder

Next steps (recommended)
- Implement full page editors: doctors, services, facilities, gallery, pages.
- Integrate Supabase Auth and Storage.
- Add image upload and media library backed by Supabase Storage.
- Implement role-based UI and administrator management via Supabase Auth.
