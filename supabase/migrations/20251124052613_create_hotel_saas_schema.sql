/*
  # Hotel SaaS Platform Database Schema

  ## Overview
  This migration creates the complete database structure for the HotelAutoSite SaaS platform,
  which allows hotel owners to automatically generate websites and manage bookings.

  ## New Tables

  ### 1. `hotels`
  Stores core hotel information including business details, contact info, and settings
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users) - Owner of the hotel
  - `name` (text) - Hotel name
  - `slug` (text, unique) - URL-friendly identifier
  - `address` (text) - Street address
  - `city` (text) - City name
  - `state` (text) - State/province
  - `country` (text) - Country
  - `latitude` (numeric) - GPS coordinate
  - `longitude` (numeric) - GPS coordinate
  - `phone` (text) - Primary phone number
  - `whatsapp` (text) - WhatsApp number
  - `email` (text) - Hotel email
  - `description` (text) - About the hotel
  - `amenities` (jsonb) - Array of amenity names
  - `photos` (jsonb) - Array of photo URLs
  - `policies` (jsonb) - Check-in/out times, cancellation policy
  - `upi_id` (text) - Payment UPI ID
  - `payment_gateway_config` (jsonb) - Payment gateway settings
  - `template_id` (text) - Selected website template
  - `theme_config` (jsonb) - Colors, fonts, styling
  - `is_active` (boolean) - Hotel is active
  - `is_published` (boolean) - Website is live
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `rooms`
  Stores room types and pricing information for each hotel
  - `id` (uuid, primary key)
  - `hotel_id` (uuid, references hotels)
  - `title` (text) - Room type name
  - `description` (text) - Room description
  - `price` (numeric) - Price per night
  - `max_guests` (integer) - Maximum occupancy
  - `amenities` (jsonb) - Room-specific amenities
  - `photos` (jsonb) - Room photos
  - `is_available` (boolean) - Currently bookable
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `bookings`
  Tracks all customer bookings
  - `id` (uuid, primary key)
  - `booking_reference` (text, unique) - Human-readable ID
  - `hotel_id` (uuid, references hotels)
  - `room_id` (uuid, references rooms)
  - `guest_name` (text)
  - `guest_email` (text)
  - `guest_phone` (text)
  - `check_in` (date)
  - `check_out` (date)
  - `num_guests` (integer)
  - `total_amount` (numeric)
  - `payment_status` (text) - pending, paid, refunded
  - `payment_id` (text) - Payment gateway transaction ID
  - `special_requests` (text)
  - `status` (text) - confirmed, cancelled, completed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `templates`
  Available website templates
  - `id` (text, primary key)
  - `name` (text) - Template name
  - `description` (text)
  - `preview_image` (text) - Screenshot URL
  - `category` (text) - standard, premium, minimal, luxury, hostel
  - `config` (jsonb) - Template configuration
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 5. `reviews`
  Customer reviews for hotels
  - `id` (uuid, primary key)
  - `hotel_id` (uuid, references hotels)
  - `booking_id` (uuid, references bookings)
  - `guest_name` (text)
  - `rating` (integer) - 1-5 stars
  - `comment` (text)
  - `is_approved` (boolean)
  - `created_at` (timestamptz)

  ### 6. `admin_settings`
  Platform-wide settings and analytics
  - `id` (uuid, primary key)
  - `key` (text, unique)
  - `value` (jsonb)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Hotel owners can only access their own data
  - Customers can create bookings but not modify hotels
  - Admin access controlled separately
  - Public read access for published hotel websites
*/

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  address text,
  city text,
  state text,
  country text DEFAULT 'India',
  latitude numeric,
  longitude numeric,
  phone text,
  whatsapp text,
  email text,
  description text,
  amenities jsonb DEFAULT '[]'::jsonb,
  photos jsonb DEFAULT '[]'::jsonb,
  policies jsonb DEFAULT '{}'::jsonb,
  upi_id text,
  payment_gateway_config jsonb DEFAULT '{}'::jsonb,
  template_id text DEFAULT 'standard',
  theme_config jsonb DEFAULT '{"primaryColor": "#2563eb", "fontFamily": "Inter"}'::jsonb,
  is_active boolean DEFAULT true,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  max_guests integer DEFAULT 2,
  amenities jsonb DEFAULT '[]'::jsonb,
  photos jsonb DEFAULT '[]'::jsonb,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text UNIQUE NOT NULL,
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
  room_id uuid REFERENCES rooms(id) ON DELETE SET NULL,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  num_guests integer DEFAULT 1,
  total_amount numeric NOT NULL,
  payment_status text DEFAULT 'pending',
  payment_id text,
  special_requests text,
  status text DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  preview_image text,
  category text DEFAULT 'standard',
  config jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  guest_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Hotels policies
CREATE POLICY "Hotel owners can view their own hotels"
  ON hotels FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Hotel owners can create their own hotels"
  ON hotels FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Hotel owners can update their own hotels"
  ON hotels FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view published hotels"
  ON hotels FOR SELECT
  TO anon
  USING (is_published = true);

-- Rooms policies
CREATE POLICY "Hotel owners can view their hotel rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = rooms.hotel_id
      AND hotels.user_id = auth.uid()
    )
  );

CREATE POLICY "Hotel owners can create rooms for their hotels"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = hotel_id
      AND hotels.user_id = auth.uid()
    )
  );

CREATE POLICY "Hotel owners can update their hotel rooms"
  ON rooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = rooms.hotel_id
      AND hotels.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = hotel_id
      AND hotels.user_id = auth.uid()
    )
  );

CREATE POLICY "Hotel owners can delete their hotel rooms"
  ON rooms FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = rooms.hotel_id
      AND hotels.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view rooms for published hotels"
  ON rooms FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = rooms.hotel_id
      AND hotels.is_published = true
    )
  );

-- Bookings policies
CREATE POLICY "Hotel owners can view bookings for their hotels"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = bookings.hotel_id
      AND hotels.user_id = auth.uid()
    )
  );

CREATE POLICY "Hotel owners can update bookings for their hotels"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = bookings.hotel_id
      AND hotels.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = hotel_id
      AND hotels.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

-- Templates policies
CREATE POLICY "Anyone can view active templates"
  ON templates FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Reviews policies
CREATE POLICY "Hotel owners can view reviews for their hotels"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = reviews.hotel_id
      AND hotels.user_id = auth.uid()
    )
  );

CREATE POLICY "Hotel owners can update reviews for their hotels"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = reviews.hotel_id
      AND hotels.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hotels
      WHERE hotels.id = hotel_id
      AND hotels.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  TO anon
  USING (is_approved = true);

CREATE POLICY "Anyone can create reviews"
  ON reviews FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hotels_user_id ON hotels(user_id);
CREATE INDEX IF NOT EXISTS idx_hotels_slug ON hotels(slug);
CREATE INDEX IF NOT EXISTS idx_hotels_is_published ON hotels(is_published);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_reviews_hotel_id ON reviews(hotel_id);

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS text AS $$
DECLARE
  ref text;
BEGIN
  ref := 'BK' || to_char(now(), 'YYYYMMDD') || LPAD(floor(random() * 10000)::text, 4, '0');
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- Insert default templates
INSERT INTO templates (id, name, description, category, preview_image) VALUES
  ('standard', 'Standard', 'Clean and professional hotel website', 'standard', '/templates/standard.jpg'),
  ('premium', 'Premium', 'Luxury design with advanced features', 'premium', '/templates/premium.jpg'),
  ('minimal', 'Minimal', 'Simple and elegant minimalist design', 'minimal', '/templates/minimal.jpg'),
  ('luxury', 'Luxury', 'High-end boutique hotel design', 'luxury', '/templates/luxury.jpg'),
  ('hostel', 'Hostel/PG', 'Budget-friendly hostel and PG design', 'hostel', '/templates/hostel.jpg')
ON CONFLICT (id) DO NOTHING;