import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  email: string
  full_name: string
  phone?: string
  role: 'student' | 'tutor' | 'admin'
  created_at: string
  updated_at: string
}

export interface Tutor {
  id: string
  user_id?: string
  name: string
  bio?: string
  achievements?: string[]
  profile_image_url?: string
  hourly_rate_trial: number
  hourly_rate_regular: number
  available: boolean
  created_at: string
  subjects?: Subject[]
}

export interface Subject {
  id: string
  name: string
  description?: string
  icon?: string
  created_at: string
}

export interface Package {
  id: string
  user_id: string
  package_type: '10_hours' | '20_hours' | 'trial'
  lessons_total: number
  lessons_used: number
  price_paid: number
  purchased_at: string
  expires_at?: string
  active: boolean
}

export interface Booking {
  id: string
  user_id: string
  tutor_id: string
  subject_id: string
  package_id?: string
  booking_type: 'trial' | 'regular'
  date: string
  start_time: string
  end_time: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
  tutor?: Tutor
  subject?: Subject
}
