-- Availability Calendar
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  is_available boolean DEFAULT true,
  price_override numeric,
  min_stay integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(room_id, date)
);

-- Guest Profiles
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  phone text,
  preferences jsonb DEFAULT '{}'::jsonb,
  loyalty_points integer DEFAULT 0,
  total_bookings integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Promo Codes
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
  code text NOT NULL,
  discount_type text NOT NULL, -- percentage, fixed
  discount_value numeric NOT NULL,
  valid_from date NOT NULL,
  valid_to date NOT NULL,
  usage_limit integer,
  used_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(hotel_id, code)
);

-- Add-ons
CREATE TABLE IF NOT EXISTS addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  type text NOT NULL, -- breakfast, parking, spa, etc
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Booking Add-ons (junction table)
CREATE TABLE IF NOT EXISTS booking_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  addon_id uuid REFERENCES addons(id) ON DELETE CASCADE NOT NULL,
  quantity integer DEFAULT 1,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL, -- payment, refund, addon
  gateway text,
  transaction_id text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Check-in/Check-out
CREATE TABLE IF NOT EXISTS checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  checked_in_at timestamptz,
  checked_out_at timestamptz,
  id_proof_url text,
  room_number text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Housekeeping
CREATE TABLE IF NOT EXISTS housekeeping_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  task_type text NOT NULL, -- cleaning, maintenance, inspection
  status text DEFAULT 'pending', -- pending, in_progress, completed
  priority text DEFAULT 'normal', -- low, normal, high
  assigned_to text,
  notes text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Email Logs
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient text NOT NULL,
  subject text NOT NULL,
  template text NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  sent_at timestamptz DEFAULT now(),
  status text DEFAULT 'sent'
);

-- Add columns to existing bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS promo_code text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_id uuid REFERENCES guests(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source text DEFAULT 'direct';

-- Add columns to existing rooms table
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS base_price numeric;

-- Update reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS cleanliness_rating integer CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS service_rating integer CHECK (service_rating >= 1 AND service_rating <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS location_rating integer CHECK (location_rating >= 1 AND location_rating <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS value_rating integer CHECK (value_rating >= 1 AND value_rating <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS photos jsonb DEFAULT '[]'::jsonb;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS owner_reply text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS replied_at timestamptz;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_availability_room_date ON availability(room_id, date);
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_promo_codes_hotel ON promo_codes(hotel_id);
CREATE INDEX IF NOT EXISTS idx_transactions_booking ON transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_checkins_booking ON checkins(booking_id);
CREATE INDEX IF NOT EXISTS idx_housekeeping_hotel ON housekeeping_tasks(hotel_id);

-- RLS Policies
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE housekeeping_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Availability policies
CREATE POLICY "Hotel owners can manage availability" ON availability
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM rooms r JOIN hotels h ON r.hotel_id = h.id
    WHERE r.id = availability.room_id AND h.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can view availability" ON availability
  FOR SELECT TO anon
  USING (true);

-- Guest policies
CREATE POLICY "Anyone can create guest profiles" ON guests
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Guests can view their own profile" ON guests
  FOR SELECT TO anon
  USING (true);

-- Promo codes policies
CREATE POLICY "Hotel owners can manage promo codes" ON promo_codes
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM hotels WHERE hotels.id = promo_codes.hotel_id AND hotels.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can view active promo codes" ON promo_codes
  FOR SELECT TO anon
  USING (is_active = true);

-- Addons policies
CREATE POLICY "Hotel owners can manage addons" ON addons
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM hotels WHERE hotels.id = addons.hotel_id AND hotels.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can view active addons" ON addons
  FOR SELECT TO anon
  USING (is_active = true);

-- Booking addons policies
CREATE POLICY "Anyone can create booking addons" ON booking_addons
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Hotel owners can view booking addons" ON booking_addons
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bookings b JOIN hotels h ON b.hotel_id = h.id
    WHERE b.id = booking_addons.booking_id AND h.user_id = auth.uid()
  ));

-- Transactions policies
CREATE POLICY "Hotel owners can view transactions" ON transactions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bookings b JOIN hotels h ON b.hotel_id = h.id
    WHERE b.id = transactions.booking_id AND h.user_id = auth.uid()
  ));

-- Checkins policies
CREATE POLICY "Hotel owners can manage checkins" ON checkins
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bookings b JOIN hotels h ON b.hotel_id = h.id
    WHERE b.id = checkins.booking_id AND h.user_id = auth.uid()
  ));

-- Housekeeping policies
CREATE POLICY "Hotel owners can manage housekeeping" ON housekeeping_tasks
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM hotels WHERE hotels.id = housekeeping_tasks.hotel_id AND hotels.user_id = auth.uid()
  ));

-- Email logs policies
CREATE POLICY "Hotel owners can view email logs" ON email_logs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bookings b JOIN hotels h ON b.hotel_id = h.id
    WHERE b.id = email_logs.booking_id AND h.user_id = auth.uid()
  ));

-- Function to check room availability
CREATE OR REPLACE FUNCTION check_room_availability(
  p_room_id uuid,
  p_check_in date,
  p_check_out date
)
RETURNS boolean AS $$
DECLARE
  v_available boolean;
BEGIN
  -- Check if room is available for all dates in range
  SELECT NOT EXISTS (
    SELECT 1 FROM availability
    WHERE room_id = p_room_id
    AND date >= p_check_in
    AND date < p_check_out
    AND is_available = false
  ) AND NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE room_id = p_room_id
    AND status NOT IN ('cancelled')
    AND (
      (check_in <= p_check_in AND check_out > p_check_in)
      OR (check_in < p_check_out AND check_out >= p_check_out)
      OR (check_in >= p_check_in AND check_out <= p_check_out)
    )
  ) INTO v_available;
  
  RETURN v_available;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate dynamic price
CREATE OR REPLACE FUNCTION get_room_price(
  p_room_id uuid,
  p_date date
)
RETURNS numeric AS $$
DECLARE
  v_price numeric;
  v_base_price numeric;
BEGIN
  -- Get base price
  SELECT price INTO v_base_price FROM rooms WHERE id = p_room_id;
  
  -- Check for price override
  SELECT COALESCE(price_override, v_base_price) INTO v_price
  FROM availability
  WHERE room_id = p_room_id AND date = p_date;
  
  RETURN COALESCE(v_price, v_base_price);
END;
$$ LANGUAGE plpgsql;
