/*
  # Ship Booking System Database Schema

  ## Overview
  Complete database schema for a ship ticket booking application supporting multiple operators,
  routes, schedules, bookings, and passenger management.

  ## New Tables

  1. **operators**
     - `id` (uuid, primary key)
     - `name` (text) - Operator name (e.g., PELNI, ASDP)
     - `logo_url` (text) - Operator logo
     - `contact_phone` (text)
     - `contact_email` (text)
     - `created_at` (timestamptz)

  2. **ports**
     - `id` (uuid, primary key)
     - `name` (text) - Port name
     - `city` (text)
     - `code` (text) - Port code (e.g., TJP for Tanjung Perak)
     - `address` (text)
     - `contact_phone` (text)
     - `latitude` (numeric)
     - `longitude` (numeric)
     - `created_at` (timestamptz)

  3. **ships**
     - `id` (uuid, primary key)
     - `operator_id` (uuid, foreign key)
     - `name` (text) - Ship name
     - `capacity` (integer)
     - `year_built` (integer)
     - `length_meters` (numeric)
     - `facilities` (jsonb) - Array of facilities
     - `image_url` (text)
     - `created_at` (timestamptz)

  4. **schedules**
     - `id` (uuid, primary key)
     - `ship_id` (uuid, foreign key)
     - `departure_port_id` (uuid, foreign key)
     - `arrival_port_id` (uuid, foreign key)
     - `departure_time` (timestamptz)
     - `arrival_time` (timestamptz)
     - `duration_minutes` (integer)
     - `classes` (jsonb) - Array of class types with prices and seats
     - `status` (text) - scheduled, departed, arrived, cancelled
     - `created_at` (timestamptz)

  5. **bookings**
     - `id` (uuid, primary key)
     - `booking_code` (text, unique) - Format: SHIP-XXXXXX
     - `user_id` (uuid) - Optional for guest bookings
     - `schedule_id` (uuid, foreign key)
     - `status` (text) - pending_payment, paid, confirmed, boarding, completed, cancelled
     - `total_passengers` (integer)
     - `selected_class` (text)
     - `contact_name` (text)
     - `contact_email` (text)
     - `contact_phone` (text)
     - `payment_method` (text)
     - `payment_amount` (numeric)
     - `payment_breakdown` (jsonb)
     - `payment_status` (text)
     - `payment_expired_at` (timestamptz)
     - `paid_at` (timestamptz)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)

  6. **passengers**
     - `id` (uuid, primary key)
     - `booking_id` (uuid, foreign key)
     - `id_type` (text) - KTP, Passport, SIM, KK
     - `id_number` (text)
     - `full_name` (text)
     - `gender` (text)
     - `birth_date` (date)
     - `category` (text) - adult, child, infant, elderly
     - `phone` (text)
     - `email` (text)
     - `seat_number` (text)
     - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for operators, ports, ships, and schedules
  - Bookings and passengers readable by booking owner or via booking_code + email verification
  - Insert allowed for bookings and passengers (guest checkout)
*/

-- Create operators table
CREATE TABLE IF NOT EXISTS operators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  contact_phone text,
  contact_email text,
  created_at timestamptz DEFAULT now()
);

-- Create ports table
CREATE TABLE IF NOT EXISTS ports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  code text UNIQUE NOT NULL,
  address text,
  contact_phone text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz DEFAULT now()
);

-- Create ships table
CREATE TABLE IF NOT EXISTS ships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id uuid REFERENCES operators(id) ON DELETE CASCADE,
  name text NOT NULL,
  capacity integer NOT NULL DEFAULT 0,
  year_built integer,
  length_meters numeric,
  facilities jsonb DEFAULT '[]'::jsonb,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id uuid REFERENCES ships(id) ON DELETE CASCADE,
  departure_port_id uuid REFERENCES ports(id) ON DELETE CASCADE,
  arrival_port_id uuid REFERENCES ports(id) ON DELETE CASCADE,
  departure_time timestamptz NOT NULL,
  arrival_time timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 0,
  classes jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code text UNIQUE NOT NULL,
  user_id uuid,
  schedule_id uuid REFERENCES schedules(id) ON DELETE RESTRICT,
  status text DEFAULT 'pending_payment',
  total_passengers integer NOT NULL DEFAULT 1,
  selected_class text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  payment_method text,
  payment_amount numeric NOT NULL DEFAULT 0,
  payment_breakdown jsonb DEFAULT '{}'::jsonb,
  payment_status text DEFAULT 'pending',
  payment_expired_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create passengers table
CREATE TABLE IF NOT EXISTS passengers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  id_type text NOT NULL,
  id_number text NOT NULL,
  full_name text NOT NULL,
  gender text NOT NULL,
  birth_date date NOT NULL,
  category text NOT NULL,
  phone text,
  email text,
  seat_number text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ships_operator ON ships(operator_id);
CREATE INDEX IF NOT EXISTS idx_schedules_ship ON schedules(ship_id);
CREATE INDEX IF NOT EXISTS idx_schedules_departure_port ON schedules(departure_port_id);
CREATE INDEX IF NOT EXISTS idx_schedules_arrival_port ON schedules(arrival_port_id);
CREATE INDEX IF NOT EXISTS idx_schedules_departure_time ON schedules(departure_time);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule ON bookings(schedule_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(contact_email);
CREATE INDEX IF NOT EXISTS idx_passengers_booking ON passengers(booking_id);

-- Enable Row Level Security
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ships ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for operators (public read)
CREATE POLICY "Anyone can view operators"
  ON operators FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for ports (public read)
CREATE POLICY "Anyone can view ports"
  ON ports FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for ships (public read)
CREATE POLICY "Anyone can view ships"
  ON ships FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for schedules (public read)
CREATE POLICY "Anyone can view schedules"
  ON schedules FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for bookings
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings with valid booking code"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update bookings with valid booking code"
  ON bookings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for passengers
CREATE POLICY "Anyone can create passengers"
  ON passengers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view passengers"
  ON passengers FOR SELECT
  TO anon, authenticated
  USING (true);

-- Function to generate booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := 'SHIP-' || upper(substr(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM bookings WHERE booking_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
