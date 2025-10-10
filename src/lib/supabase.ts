import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Operator = {
  id: string;
  name: string;
  logo_url: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  created_at: string;
};

export type Port = {
  id: string;
  name: string;
  city: string;
  code: string;
  address: string | null;
  contact_phone: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type Ship = {
  id: string;
  operator_id: string;
  name: string;
  capacity: number;
  year_built: number | null;
  length_meters: number | null;
  facilities: string[];
  image_url: string | null;
  created_at: string;
};

export type ClassInfo = {
  class: string;
  price: number;
  available_seats: number;
};

export type Schedule = {
  id: string;
  ship_id: string;
  departure_port_id: string;
  arrival_port_id: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  classes: ClassInfo[];
  status: string;
  created_at: string;
  ship?: Ship;
  operator?: Operator;
  departure_port?: Port;
  arrival_port?: Port;
};

export type Passenger = {
  id?: string;
  booking_id?: string;
  id_type: string;
  id_number: string;
  full_name: string;
  gender: string;
  birth_date: string;
  category: string;
  phone: string;
  email: string;
  seat_number: string;
};

export type PaymentBreakdown = {
  ticket_price: number;
  admin_fee: number;
  service_fee: number;
};

export type Booking = {
  id: string;
  booking_code: string;
  user_id: string | null;
  schedule_id: string;
  status: string;
  total_passengers: number;
  selected_class: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  payment_method: string | null;
  payment_amount: number;
  payment_breakdown: PaymentBreakdown;
  payment_status: string;
  payment_expired_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  schedule?: Schedule;
  passengers?: Passenger[];
};
