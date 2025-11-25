-- Sample Hotel Data for "Grand Plaza Hotel"
-- NOTE: Replace 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd' with actual user_id from auth.users after signup

-- Insert sample hotel (you'll need to replace user_id after creating account)
-- To get your user_id, run: SELECT id FROM auth.users WHERE email = 'your@email.com';

-- Sample Hotel
INSERT INTO hotels (id, user_id, name, slug, address, city, state, country, phone, whatsapp, email, description, amenities, photos, template_id, is_published)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'd1cfb702-d91e-41f8-8496-95e7ed95f8fd', -- Replace with your actual user_id
  'Grand Plaza Hotel',
  'grand-plaza-hotel',
  '123 Main Street, Downtown',
  'Mumbai',
  'Maharashtra',
  'India',
  '+91 98765 43210',
  '+91 98765 43210',
  'info@grandplaza.com',
  'Experience luxury and comfort at Grand Plaza Hotel, located in the heart of Mumbai. Our hotel offers world-class amenities, spacious rooms, and exceptional service to make your stay memorable.',
  ARRAY['WiFi', 'Swimming Pool', 'Gym', 'Restaurant', 'Bar', 'Spa', 'Room Service', 'Parking', 'Conference Room', 'Airport Shuttle'],
  ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
  'luxury',
  true
);

-- Sample Rooms
INSERT INTO rooms (id, hotel_id, title, description, price, max_guests, amenities, photos, room_number, floor, bed_type, status)
VALUES 
(
  '22222222-2222-2222-2222-222222222221',
  '11111111-1111-1111-1111-111111111111',
  'Deluxe Room',
  'Spacious deluxe room with city view, king-size bed, and modern amenities. Perfect for couples or business travelers.',
  3500.00,
  2,
  ARRAY['King Bed', 'AC', 'TV', 'Mini Bar', 'WiFi', 'Work Desk', 'Safe'],
  ARRAY['https://images.unsplash.com/photo-1611892440504-42a792e24d32', 'https://images.unsplash.com/photo-1590490360182-c33d57733427'],
  '201',
  2,
  'King',
  'available'
),
(
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Executive Suite',
  'Luxurious suite with separate living area, premium furnishings, and stunning views. Ideal for extended stays.',
  6500.00,
  3,
  ARRAY['King Bed', 'Sofa Bed', 'AC', 'TV', 'Mini Bar', 'WiFi', 'Kitchenette', 'Balcony'],
  ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'],
  '501',
  5,
  'King',
  'available'
),
(
  '22222222-2222-2222-2222-222222222223',
  '11111111-1111-1111-1111-111111111111',
  'Family Room',
  'Comfortable family room with two queen beds, perfect for families with children. Spacious and well-equipped.',
  5000.00,
  4,
  ARRAY['Two Queen Beds', 'AC', 'TV', 'Mini Fridge', 'WiFi', 'Extra Space'],
  ARRAY['https://images.unsplash.com/photo-1598928506311-c55ded91a20c', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'],
  '302',
  3,
  'Queen',
  'available'
),
(
  '22222222-2222-2222-2222-222222222224',
  '11111111-1111-1111-1111-111111111111',
  'Presidential Suite',
  'Ultimate luxury with panoramic views, private terrace, jacuzzi, and personalized butler service.',
  12000.00,
  4,
  ARRAY['King Bed', 'Living Room', 'Dining Area', 'Jacuzzi', 'Private Terrace', 'Butler Service', 'Premium Minibar'],
  ARRAY['https://images.unsplash.com/photo-1591088398332-8a7791972843', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'],
  '1001',
  10,
  'King',
  'available'
);

-- Sample Promo Codes
INSERT INTO promo_codes (hotel_id, code, discount_type, discount_value, valid_from, valid_to, usage_limit, is_active)
VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'WELCOME10',
  'percentage',
  10,
  NOW(),
  NOW() + INTERVAL '90 days',
  100,
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'SUMMER25',
  'percentage',
  25,
  NOW(),
  NOW() + INTERVAL '60 days',
  50,
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'FLAT500',
  'fixed',
  500,
  NOW(),
  NOW() + INTERVAL '30 days',
  NULL,
  true
);

-- Sample Packages
INSERT INTO packages (hotel_id, name, description, package_type, included_items, price, validity_days, is_active)
VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Honeymoon Special',
  'Perfect romantic getaway for newlyweds with special amenities and services',
  'honeymoon',
  ARRAY['Complimentary breakfast', 'Room decoration with flowers', 'Champagne bottle', 'Couple spa session', 'Late checkout till 2 PM', 'Candlelight dinner'],
  5000,
  NULL,
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'Family Fun Package',
  'Complete family entertainment package with activities for all ages',
  'family',
  ARRAY['Breakfast for 4', 'Kids play area access', 'Swimming pool access', 'Movie night setup', 'Board games', 'Welcome snacks'],
  3500,
  NULL,
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'Business Traveler',
  'Everything a business traveler needs for a productive stay',
  'business',
  ARRAY['High-speed WiFi', 'Conference room access (2 hours)', 'Business center access', 'Express laundry', 'Airport transfer', 'Breakfast'],
  4000,
  7,
  true
);

-- Sample Add-ons
INSERT INTO addons (hotel_id, name, description, price, type, is_active)
VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Airport Transfer',
  'Comfortable pick-up and drop service from/to airport',
  1500,
  'transport',
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'Breakfast Buffet',
  'Delicious breakfast buffet with Indian and Continental options',
  500,
  'food',
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'Spa Treatment',
  'Relaxing 60-minute spa session with aromatherapy',
  2000,
  'service',
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'Extra Bed',
  'Additional comfortable bed for extra guest',
  800,
  'amenity',
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'City Tour',
  'Guided city tour covering major attractions (4 hours)',
  2500,
  'activity',
  true
);

-- Sample Bookings (Past and Upcoming)
INSERT INTO bookings (booking_reference, hotel_id, room_id, guest_name, guest_email, guest_phone, check_in, check_out, num_guests, num_adults, num_children, total_amount, payment_status, status, booking_source, created_at)
VALUES 
(
  'BK20241101',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222221',
  'Rajesh Kumar',
  'rajesh.kumar@email.com',
  '+91 98765 11111',
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE - INTERVAL '27 days',
  2,
  2,
  0,
  10500.00,
  'paid',
  'checked_out',
  'website',
  NOW() - INTERVAL '35 days'
),
(
  'BK20241115',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Priya Sharma',
  'priya.sharma@email.com',
  '+91 98765 22222',
  CURRENT_DATE - INTERVAL '15 days',
  CURRENT_DATE - INTERVAL '12 days',
  2,
  2,
  0,
  19500.00,
  'paid',
  'checked_out',
  'website',
  NOW() - INTERVAL '20 days'
),
(
  'BK20241120',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222223',
  'Amit Patel',
  'amit.patel@email.com',
  '+91 98765 33333',
  CURRENT_DATE - INTERVAL '10 days',
  CURRENT_DATE - INTERVAL '7 days',
  4,
  2,
  2,
  15000.00,
  'paid',
  'checked_out',
  'website',
  NOW() - INTERVAL '15 days'
),
(
  'BK20241201',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222221',
  'Sneha Reddy',
  'sneha.reddy@email.com',
  '+91 98765 44444',
  CURRENT_DATE - INTERVAL '5 days',
  CURRENT_DATE - INTERVAL '3 days',
  2,
  2,
  0,
  7000.00,
  'paid',
  'checked_out',
  'website',
  NOW() - INTERVAL '8 days'
),
(
  'BK20241205',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222224',
  'Vikram Singh',
  'vikram.singh@email.com',
  '+91 98765 55555',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '3 days',
  2,
  2,
  0,
  36000.00,
  'paid',
  'checked_in',
  'website',
  NOW() - INTERVAL '5 days'
),
(
  'BK20241210',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Ananya Iyer',
  'ananya.iyer@email.com',
  '+91 98765 66666',
  CURRENT_DATE + INTERVAL '5 days',
  CURRENT_DATE + INTERVAL '8 days',
  3,
  2,
  1,
  19500.00,
  'pending',
  'confirmed',
  'website',
  NOW() - INTERVAL '2 days'
),
(
  'BK20241215',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222223',
  'Karan Mehta',
  'karan.mehta@email.com',
  '+91 98765 77777',
  CURRENT_DATE + INTERVAL '10 days',
  CURRENT_DATE + INTERVAL '13 days',
  4,
  2,
  2,
  15000.00,
  'pending',
  'confirmed',
  'website',
  NOW() - INTERVAL '1 day'
);

-- Sample Reviews
INSERT INTO reviews (hotel_id, guest_name, rating, cleanliness_rating, service_rating, location_rating, value_rating, comment, is_approved, created_at)
VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Rajesh Kumar',
  5,
  5,
  5,
  5,
  4,
  'Excellent stay! The room was spotless, staff was very courteous, and the location is perfect. Highly recommended for business travelers.',
  true,
  NOW() - INTERVAL '25 days'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Priya Sharma',
  5,
  5,
  5,
  5,
  5,
  'Absolutely loved our stay at Grand Plaza! The suite was luxurious, breakfast was amazing, and the spa was so relaxing. Will definitely come back!',
  true,
  NOW() - INTERVAL '10 days'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Amit Patel',
  4,
  5,
  4,
  5,
  4,
  'Great hotel for families. Kids loved the pool and the room was spacious. Only minor issue was the checkout process took a bit long. Overall great experience!',
  true,
  NOW() - INTERVAL '5 days'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Sneha Reddy',
  5,
  5,
  5,
  5,
  5,
  'Perfect for a weekend getaway! Clean rooms, friendly staff, and excellent room service. The location is convenient with many restaurants nearby.',
  true,
  NOW() - INTERVAL '2 days'
);

-- Sample Housekeeping Tasks
INSERT INTO housekeeping_tasks (hotel_id, room_id, task_type, status, priority, notes, created_at)
VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222221',
  'cleaning',
  'completed',
  'normal',
  'Regular cleaning after checkout',
  NOW() - INTERVAL '3 days'
),
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'cleaning',
  'pending',
  'high',
  'Deep cleaning required',
  NOW() - INTERVAL '1 hour'
),
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222223',
  'maintenance',
  'in_progress',
  'normal',
  'AC filter replacement',
  NOW() - INTERVAL '2 hours'
);

-- Sample Payment Methods
INSERT INTO payment_methods (hotel_id, method_type, is_active, config)
VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'upi',
  true,
  '{"upi_id": "grandplaza@paytm"}'::jsonb
),
(
  '11111111-1111-1111-1111-111111111111',
  'card',
  true,
  '{}'::jsonb
),
(
  '11111111-1111-1111-1111-111111111111',
  'cash',
  true,
  '{}'::jsonb
);

-- Sample Checkins
INSERT INTO checkins (booking_id, checked_in_at, room_number, notes)
SELECT 
  id,
  check_in + INTERVAL '14 hours',
  '201',
  'Early check-in requested'
FROM bookings 
WHERE booking_reference = 'BK20241205';

COMMIT;
