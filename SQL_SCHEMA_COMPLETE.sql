-- ============================================================================
-- Asha Healthcare — Complete Supabase Schema Setup
-- ============================================================================
-- Copy and paste this entire file into Supabase SQL Editor and run.
-- This creates all tables, RLS policies, functions, triggers, and storage policies.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS AND TYPES
-- ============================================================================

CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'editor', 'viewer');
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');

-- ============================================================================
-- 2. AUTH & PROFILES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_role public.user_role DEFAULT 'viewer' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  notes text
);

-- ============================================================================
-- 3. DOCTORS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  bio text,
  image text,
  status public.content_status DEFAULT 'draft' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT name_not_empty CHECK (char_length(name) > 0)
);

-- ============================================================================
-- 4. SERVICES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text,
  image text,
  status public.content_status DEFAULT 'draft' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT title_not_empty CHECK (char_length(title) > 0)
);

-- ============================================================================
-- 5. FACILITIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text,
  image text,
  status public.content_status DEFAULT 'draft' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT title_not_empty CHECK (char_length(title) > 0)
);

-- ============================================================================
-- 6. GALLERY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image text NOT NULL,
  status public.content_status DEFAULT 'draft' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT title_not_empty CHECK (char_length(title) > 0)
);

-- ============================================================================
-- 7. AUDIT LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid,
  action text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  changes jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- ============================================================================
-- 8. HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.current_admin_profile_id()
RETURNS uuid AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT user_role = 'super_admin' FROM public.admin_profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT user_role IN ('super_admin', 'admin') FROM public.admin_profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT user_role IN ('super_admin', 'admin', 'editor') FROM public.admin_profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- 9. AUDIT LOG TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.insert_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (table_name, record_id, action, user_id, changes)
  VALUES (TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), TG_OP, auth.uid(), to_jsonb(NEW));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 10. UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 11. TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS update_doctors_updated_at ON public.doctors;
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS audit_doctors ON public.doctors;
CREATE TRIGGER audit_doctors AFTER INSERT OR UPDATE OR DELETE ON public.doctors
FOR EACH ROW EXECUTE FUNCTION public.insert_audit_log();

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS audit_services ON public.services;
CREATE TRIGGER audit_services AFTER INSERT OR UPDATE OR DELETE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.insert_audit_log();

DROP TRIGGER IF EXISTS update_facilities_updated_at ON public.facilities;
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON public.facilities
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS audit_facilities ON public.facilities;
CREATE TRIGGER audit_facilities AFTER INSERT OR UPDATE OR DELETE ON public.facilities
FOR EACH ROW EXECUTE FUNCTION public.insert_audit_log();

DROP TRIGGER IF EXISTS update_gallery_updated_at ON public.gallery;
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS audit_gallery ON public.gallery;
CREATE TRIGGER audit_gallery AFTER INSERT OR UPDATE OR DELETE ON public.gallery
FOR EACH ROW EXECUTE FUNCTION public.insert_audit_log();

-- ============================================================================
-- 12. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_doctors_status ON public.doctors(status);
CREATE INDEX IF NOT EXISTS idx_doctors_created_at ON public.doctors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON public.services(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_facilities_status ON public.facilities(status);
CREATE INDEX IF NOT EXISTS idx_facilities_created_at ON public.facilities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_status ON public.gallery(status);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============================================================================
-- 13. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all content tables
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- DOCTORS RLS Policies
CREATE POLICY "Doctors: Published visible to anon" ON public.doctors
  FOR SELECT USING (status = 'published');

CREATE POLICY "Doctors: Editors can read all" ON public.doctors
  FOR SELECT USING (public.is_editor());

CREATE POLICY "Doctors: Editors can create" ON public.doctors
  FOR INSERT WITH CHECK (public.is_editor());

CREATE POLICY "Doctors: Editors can update own" ON public.doctors
  FOR UPDATE USING (public.is_editor()) WITH CHECK (public.is_editor());

CREATE POLICY "Doctors: Editors can delete" ON public.doctors
  FOR DELETE USING (public.is_editor());

-- SERVICES RLS Policies
CREATE POLICY "Services: Published visible to anon" ON public.services
  FOR SELECT USING (status = 'published');

CREATE POLICY "Services: Editors can read all" ON public.services
  FOR SELECT USING (public.is_editor());

CREATE POLICY "Services: Editors can create" ON public.services
  FOR INSERT WITH CHECK (public.is_editor());

CREATE POLICY "Services: Editors can update" ON public.services
  FOR UPDATE USING (public.is_editor()) WITH CHECK (public.is_editor());

CREATE POLICY "Services: Editors can delete" ON public.services
  FOR DELETE USING (public.is_editor());

-- FACILITIES RLS Policies
CREATE POLICY "Facilities: Published visible to anon" ON public.facilities
  FOR SELECT USING (status = 'published');

CREATE POLICY "Facilities: Editors can read all" ON public.facilities
  FOR SELECT USING (public.is_editor());

CREATE POLICY "Facilities: Editors can create" ON public.facilities
  FOR INSERT WITH CHECK (public.is_editor());

CREATE POLICY "Facilities: Editors can update" ON public.facilities
  FOR UPDATE USING (public.is_editor()) WITH CHECK (public.is_editor());

CREATE POLICY "Facilities: Editors can delete" ON public.facilities
  FOR DELETE USING (public.is_editor());

-- GALLERY RLS Policies
CREATE POLICY "Gallery: Published visible to anon" ON public.gallery
  FOR SELECT USING (status = 'published');

CREATE POLICY "Gallery: Editors can read all" ON public.gallery
  FOR SELECT USING (public.is_editor());

CREATE POLICY "Gallery: Editors can create" ON public.gallery
  FOR INSERT WITH CHECK (public.is_editor());

CREATE POLICY "Gallery: Editors can update" ON public.gallery
  FOR UPDATE USING (public.is_editor()) WITH CHECK (public.is_editor());

CREATE POLICY "Gallery: Editors can delete" ON public.gallery
  FOR DELETE USING (public.is_editor());

-- ADMIN_PROFILES RLS Policies
CREATE POLICY "Admin profiles: Only admins can read" ON public.admin_profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin profiles: Super admins can manage" ON public.admin_profiles
  FOR UPDATE USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "Admin profiles: Super admins can insert" ON public.admin_profiles
  FOR INSERT WITH CHECK (public.is_super_admin());

-- AUDIT_LOGS RLS Policies (read-only for admins)
CREATE POLICY "Audit logs: Admins can read" ON public.audit_logs
  FOR SELECT USING (public.is_admin());

-- ============================================================================
-- 14. SUPABASE STORAGE POLICY GUIDE
-- ============================================================================
-- Run these via Supabase SQL editor after creating Storage buckets in the dashboard.
-- Create buckets: clinic-images, doctor-images, service-images, gallery-images, facility-images

-- Example for doctor-images bucket:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('doctor-images', 'doctor-images', true);

-- CREATE POLICY "Public read doctor images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'doctor-images');

-- CREATE POLICY "Authenticated users can upload doctor images" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'doctor-images' AND auth.role() = 'authenticated');

-- CREATE POLICY "Editors can delete doctor images" ON storage.objects
--   FOR DELETE USING (bucket_id = 'doctor-images' AND public.is_editor());

-- ============================================================================
-- 15. SEED DATA (MOCK CONTENT) - OPTIONAL
-- ============================================================================
-- Uncomment and run these to populate with mock data

-- INSERT INTO public.doctors (name, specialty, bio, image, status) VALUES
-- ('Dr. Sanjeev Gandhi', 'General Physician & Surgeon', 'Supports surgery planning and recovery with a focus on safety, comfort, and clear communication.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80', 'published'),
-- ('Dr. Ayushi', 'Gynecology', 'Offers compassionate women''s healthcare services, consultation, and supportive care pathways.', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80', 'published');

-- INSERT INTO public.services (title, category, description, image, status) VALUES
-- ('General Consultation', 'Primary Care', 'Routine consultations and health reviews designed around individual care needs.', 'https://images.unsplash.com/photo-1538108149393-fbbd81895973?auto=format&fit=crop&w=900&q=80', 'published'),
-- ('Specialist Review', 'Medical Care', 'Focused specialist assessments for recovery, ongoing management, and clear treatment planning.', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=900&q=80', 'published'),
-- ('Women''s Health', 'Gynecology', 'Comprehensive support for consultations, health education, and women''s wellness needs.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80', 'published'),
-- ('Nursing Care', 'Support Services', 'Skilled nursing assistance and attentive support to promote safe, comfortable recovery.', 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=900&q=80', 'published'),
-- ('Rehabilitation Support', 'Recovery', 'Structured recovery support that balances comfort, mobility, and patient confidence.', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80', 'published'),
-- ('Family Wellness', 'Preventive Care', 'Personalised health planning with a family-centred approach to long-term wellbeing.', 'https://images.unsplash.com/photo-1541534401786-8ac7e1d65f7b?auto=format&fit=crop&w=900&q=80', 'published');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
