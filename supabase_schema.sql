-- FastTrack Projects - Supabase Database Schema

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  branch TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  price_inr NUMERIC NOT NULL,
  discounted_price_inr NUMERIC,
  thumbnail_url TEXT NOT NULL,
  demo_video_url TEXT,
  file_path TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  includes_report BOOLEAN DEFAULT true,
  includes_ppt BOOLEAN DEFAULT true,
  includes_diagrams BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Users / Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  branch TEXT,
  role TEXT DEFAULT 'STUDENT',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders / Purchases Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  amount_inr NUMERIC NOT NULL,
  status TEXT DEFAULT 'COMPLETED',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  download_access_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Custom Requests Table
CREATE TABLE IF NOT EXISTS public.custom_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  branch TEXT NOT NULL,
  category TEXT NOT NULL,
  project_title TEXT NOT NULL,
  tech_stack TEXT,
  description TEXT,
  deadline DATE,
  budget TEXT,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;

-- Public read access for projects
CREATE POLICY "Allow public read access to published projects" ON public.projects
  FOR SELECT USING (is_published = true);

-- Public insert access for custom requests
CREATE POLICY "Allow public insert for custom requests" ON public.custom_requests
  FOR INSERT WITH CHECK (true);
