-- Enhanced Booking System Migration

-- Add new columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS num_rooms INTEGER DEFAULT 1;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS num_adults INTEGER DEFAULT 1;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS num_children INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS id_proof_url TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS early_checkin BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS late_checkout BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS room_preferences JSONB DEFAULT '{}';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_source TEXT DEFAULT 'website';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON bookings(guest_email);

-- Create booking_guests table for multiple guest details
CREATE TABLE IF NOT EXISTS booking_guests (
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

CREATE INDEX IF NOT EXISTS idx_booking_guests_booking_id ON booking_guests(booking_id);

-- Enable RLS
ALTER TABLE booking_guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their hotel's booking guests"
  ON booking_guests FOR SELECT
  USING (
    booking_id IN (
      SELECT b.id FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      WHERE h.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert booking guests for their hotels"
  ON booking_guests FOR INSERT
  WITH CHECK (
    booking_id IN (
      SELECT b.id FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      WHERE h.user_id = auth.uid()
    )
  );

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  method_type TEXT CHECK (method_type IN ('upi', 'card', 'netbanking', 'wallet', 'cash', 'bank_transfer')),
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_hotel_id ON payment_methods(hotel_id);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their hotel's payment methods"
  ON payment_methods FOR ALL
  USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  package_type TEXT CHECK (package_type IN ('honeymoon', 'family', 'business', 'weekend', 'custom')),
  included_items JSONB DEFAULT '[]',
  price DECIMAL(10,2) NOT NULL,
  validity_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packages_hotel_id ON packages(hotel_id);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages"
  ON packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can manage their hotel's packages"
  ON packages FOR ALL
  USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));

-- Create booking_packages table
CREATE TABLE IF NOT EXISTS booking_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id),
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_packages_booking_id ON booking_packages(booking_id);

ALTER TABLE booking_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their hotel's booking packages"
  ON booking_packages FOR SELECT
  USING (
    booking_id IN (
      SELECT b.id FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      WHERE h.user_id = auth.uid()
    )
  );

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
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

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Create function to send notification
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

-- Create trigger for new bookings
DROP TRIGGER IF EXISTS trigger_booking_notification ON bookings;
CREATE TRIGGER trigger_booking_notification
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_booking_notification();

-- Add room status tracking
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available' 
  CHECK (status IN ('available', 'occupied', 'cleaning', 'maintenance', 'blocked'));
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS room_number TEXT;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS floor INTEGER;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS bed_type TEXT;

-- Create room_pricing_rules table for dynamic pricing
CREATE TABLE IF NOT EXISTS room_pricing_rules (
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

CREATE INDEX IF NOT EXISTS idx_room_pricing_rules_room_id ON room_pricing_rules(room_id);

ALTER TABLE room_pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their hotel's room pricing rules"
  ON room_pricing_rules FOR ALL
  USING (
    room_id IN (
      SELECT r.id FROM rooms r
      JOIN hotels h ON r.hotel_id = h.id
      WHERE h.user_id = auth.uid()
    )
  );

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_hotel_id ON analytics_events(hotel_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their hotel's analytics"
  ON analytics_events FOR SELECT
  USING (hotel_id IN (SELECT id FROM hotels WHERE user_id = auth.uid()));

-- Create function to calculate booking revenue
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
