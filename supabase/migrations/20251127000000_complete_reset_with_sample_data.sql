-- Complete Database Reset and Sample Data Load

-- Drop all existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS room_pricing_rules CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS booking_packages CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS booking_addons CASCADE;
DROP TABLE IF EXISTS addons CASCADE;
DROP TABLE IF EXISTS booking_guests CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS housekeeping_tasks CASCADE;
DROP TABLE IF EXISTS checkins CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS availability CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS templates CASCADE;

-- Create templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  category TEXT,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hotels table
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  description TEXT,
  amenities TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  policies JSONB DEFAULT '{}',
  upi_id TEXT,
  payment_gateway_config JSONB DEFAULT '{}',
  template_id TEXT DEFAULT 'modern',
  theme_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  base_price DECIMAL(10,2),
  max_guests INTEGER DEFAULT 2,
  amenities TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'cleaning', 'maintenance', 'blocked')),
  room_number TEXT,
  floor INTEGER,
  bed_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create guests table
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  preferences JSONB DEFAULT '{}',
  loyalty_points INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT UNIQUE NOT NULL,
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id),
  guest_id UUID REFERENCES guests(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  num_guests INTEGER DEFAULT 1,
  num_rooms INTEGER DEFAULT 1,
  num_adults INTEGER DEFAULT 1,
  num_children INTEGER DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  promo_code TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_id TEXT,
  special_requests TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
  booking_source TEXT DEFAULT 'website',
  id_proof_url TEXT,
  early_checkin BOOLEAN DEFAULT false,
  late_checkout BOOLEAN DEFAULT false,
  room_preferences JSONB DEFAULT '{}',
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  refund_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id),
  guest_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
  location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  comment TEXT,
  photos TEXT[] DEFAULT '{}',
  owner_reply TEXT,
  replied_at TIMESTAMPTZ,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create promo_codes table
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_to TIMESTAMPTZ NOT NULL,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hotel_id, code)
);

-- Create availability table
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  price_override DECIMAL(10,2),
  min_stay INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, date)
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('payment', 'refund', 'addon')),
  gateway TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create checkins table
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ,
  checked_out_at TIMESTAMPTZ,
  id_proof_url TEXT,
  room_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create housekeeping_tasks table
CREATE TABLE housekeeping_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id),
  task_type TEXT CHECK (task_type IN ('cleaning', 'maintenance', 'inspection')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  assigned_to TEXT,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create email_logs table
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_methods table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  method_type TEXT CHECK (method_type IN ('upi', 'card', 'netbanking', 'wallet', 'cash', 'bank_transfer')),
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create booking_guests table
CREATE TABLE booking_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  guest_type TEXT CHECK (guest_type IN ('primary', 'additional')),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  id_proof_type TEXT,
  id_proof_number TEXT,
  id_proof_url TEXT,
  age INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create addons table
CREATE TABLE addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  type TEXT DEFAULT 'service',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create booking_addons table
CREATE TABLE booking_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  addon_id UUID REFERENCES addons(id),
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create packages table
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  package_type TEXT CHECK (package_type IN ('honeymoon', 'family', 'business', 'weekend', 'custom')),
  included_items TEXT[] DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL,
  validity_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create booking_packages table
CREATE TABLE booking_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id),
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('booking', 'payment', 'review', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create room_pricing_rules table
CREATE TABLE room_pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  rule_type TEXT CHECK (rule_type IN ('weekend', 'seasonal', 'length_of_stay', 'last_minute')),
  condition JSONB NOT NULL,
  price_modifier DECIMAL(10,2),
  modifier_type TEXT CHECK (modifier_type IN ('percentage', 'fixed')),
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics_events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_hotels_user_id ON hotels(user_id);
CREATE INDEX idx_hotels_slug ON hotels(slug);
CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX idx_bookings_hotel_id ON bookings(hotel_id);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);
CREATE INDEX idx_bookings_check_out ON bookings(check_out);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX idx_booking_guests_booking_id ON booking_guests(booking_id);
CREATE INDEX idx_payment_methods_hotel_id ON payment_methods(hotel_id);
CREATE INDEX idx_packages_hotel_id ON packages(hotel_id);
CREATE INDEX idx_booking_packages_booking_id ON booking_packages(booking_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_room_pricing_rules_room_id ON room_pricing_rules(room_id);
CREATE INDEX idx_analytics_events_hotel_id ON analytics_events(hotel_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Enable RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE housekeeping_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own hotels" ON hotels FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Anyone can view published hotels" ON hotels FOR SELECT USING (is_published = true);

CREATE POLICY "Users can manage their hotel's rooms" ON rooms FOR ALL USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));
CREATE POLICY "Anyone can view available rooms" ON rooms FOR SELECT USING (is_available = true);

CREATE POLICY "Users can view their hotel's bookings" ON bookings FOR SELECT USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their hotel's bookings" ON bookings FOR UPDATE USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can manage their hotel's reviews" ON reviews FOR ALL USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their hotel's promo codes" ON promo_codes FOR ALL USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));
CREATE POLICY "Anyone can view active promo codes" ON promo_codes FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their hotel's addons" ON addons FOR ALL USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));
CREATE POLICY "Anyone can view active addons" ON addons FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their hotel's packages" ON packages FOR ALL USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));
CREATE POLICY "Anyone can view active packages" ON packages FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their hotel's booking guests" ON booking_guests FOR SELECT USING (booking_id IN (SELECT b.id FROM bookings b JOIN hotels h ON b.hotel_id = h.id WHERE h.user_id = auth.uid()));
CREATE POLICY "Users can insert booking guests for their hotels" ON booking_guests FOR INSERT WITH CHECK (booking_id IN (SELECT b.id FROM bookings b JOIN hotels h ON b.hotel_id = h.id WHERE h.user_id = auth.uid()));

CREATE POLICY "Users can manage their hotel's payment methods" ON payment_methods FOR ALL USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their hotel's booking packages" ON booking_packages FOR SELECT USING (booking_id IN (SELECT b.id FROM bookings b JOIN hotels h ON b.hotel_id = h.id WHERE h.user_id = auth.uid()));

CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can manage their hotel's room pricing rules" ON room_pricing_rules FOR ALL USING (room_id IN (SELECT r.id FROM rooms r JOIN hotels h ON r.hotel_id = h.id WHERE h.user_id = auth.uid()));

CREATE POLICY "Users can view their hotel's analytics" ON analytics_events FOR SELECT USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their hotel's housekeeping tasks" ON housekeeping_tasks FOR ALL USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their hotel's checkins" ON checkins FOR ALL USING (booking_id IN (SELECT b.id FROM bookings b JOIN hotels h ON b.hotel_id = h.id WHERE h.user_id = auth.uid()));

-- Create notification trigger function
CREATE OR REPLACE FUNCTION create_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, hotel_id, type, title, message, data)
  SELECT 
    h.user_id,
    NEW.hotel_id,
    'booking',
    'New Booking Received',
    'New booking from ' || NEW.guest_name || ' for ' || NEW.check_in::date,
    jsonb_build_object('booking_id', NEW.id, 'booking_reference', NEW.booking_reference)
  FROM hotels h
  WHERE h.id = NEW.hotel_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_booking_notification
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_booking_notification();

-- Create revenue calculation function
CREATE OR REPLACE FUNCTION calculate_hotel_revenue(p_hotel_id UUID, p_start_date DATE, p_end_date DATE)
RETURNS TABLE (
  total_revenue DECIMAL,
  total_bookings BIGINT,
  avg_booking_value DECIMAL,
  occupancy_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(b.total_amount), 0) as total_revenue,
    COUNT(b.id) as total_bookings,
    COALESCE(AVG(b.total_amount), 0) as avg_booking_value,
    ROUND(
      (COUNT(DISTINCT b.room_id)::DECIMAL / 
      (SELECT COUNT(*) FROM rooms WHERE hotel_id = p_hotel_id)::DECIMAL) * 100,
      2
    ) as occupancy_rate
  FROM bookings b
  WHERE b.hotel_id = p_hotel_id
    AND b.check_in >= p_start_date
    AND b.check_out <= p_end_date
    AND b.status != 'cancelled';
END;
$$ LANGUAGE plpgsql;

-- Insert sample templates
INSERT INTO templates (name, description, category, is_active) VALUES
('Modern', 'Clean and modern design', 'contemporary', true),
('Luxury', 'Elegant luxury template', 'premium', true),
('Vintage', 'Classic vintage style', 'classic', true),
('Resort', 'Beach resort theme', 'vacation', true),
('Colorful', 'Vibrant and colorful', 'creative', true),
('Minimal', 'Minimalist design', 'simple', true),
('Business', 'Professional business style', 'corporate', true);

COMMIT;
