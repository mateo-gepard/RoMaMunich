-- RoMa Munich Booking System Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student', -- 'student', 'tutor', 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tutors table
CREATE TABLE public.tutors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  achievements TEXT[],
  profile_image_url TEXT,
  hourly_rate_trial DECIMAL(10,2) DEFAULT 0, -- Trial lesson price (can be 0 for free)
  hourly_rate_regular DECIMAL(10,2) NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects table
CREATE TABLE public.subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tutor subjects (many-to-many)
CREATE TABLE public.tutor_subjects (
  tutor_id UUID REFERENCES public.tutors(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (tutor_id, subject_id)
);

-- Packages table
CREATE TABLE public.packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_type TEXT NOT NULL, -- '10_hours', '20_hours', 'trial'
  lessons_total INTEGER NOT NULL,
  lessons_used INTEGER DEFAULT 0,
  price_paid DECIMAL(10,2) NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT TRUE
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES public.tutors(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id),
  package_id UUID REFERENCES public.packages(id),
  booking_type TEXT NOT NULL, -- 'trial', 'regular'
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subjects
INSERT INTO public.subjects (name, description, icon) VALUES
  ('Mathematik', 'Algebra, Geometrie, Analysis', '📐'),
  ('Physik', 'Mechanik, Elektrizität, Optik', '⚛️'),
  ('Chemie', 'Anorganisch, Organisch, Biochemie', '🧪'),
  ('Informatik', 'Programmierung, Algorithmen', '💻'),
  ('Englisch', 'Grammatik, Konversation, Literatur', '🇬🇧'),
  ('Deutsch', 'Rechtschreibung, Literatur, Aufsatz', '📚');

-- Row Level Security (RLS) Policies

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tutors
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tutors" ON public.tutors
  FOR SELECT USING (true);

-- Bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Packages
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own packages" ON public.packages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create packages" ON public.packages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subjects" ON public.subjects
  FOR SELECT USING (true);

-- Functions

-- Check if user has had a trial lesson
CREATE OR REPLACE FUNCTION has_trial_lesson(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.bookings
    WHERE user_id = user_uuid
    AND booking_type = 'trial'
    AND status IN ('confirmed', 'completed')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get available lesson count for user
CREATE OR REPLACE FUNCTION get_available_lessons(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COALESCE(SUM(lessons_total - lessons_used), 0)
  INTO total
  FROM public.packages
  WHERE user_id = user_uuid
  AND active = TRUE
  AND (expires_at IS NULL OR expires_at > NOW());
  
  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
