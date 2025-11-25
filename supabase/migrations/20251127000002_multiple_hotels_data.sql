-- 10 Sample Hotels with Complete Data
-- NOTE: Replace 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd' with actual user_id from auth.users

-- Hotels
INSERT INTO hotels (id, user_id, name, slug, address, city, state, country, phone, email, description, amenities, template_id, is_published) VALUES
('a1111111-1111-1111-1111-111111111111', 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd', 'Grand Plaza Hotel', 'grand-plaza-hotel', '123 Main St', 'Mumbai', 'Maharashtra', 'India', '+91 98765 43210', 'info@grandplaza.com', 'Luxury hotel in heart of Mumbai with world-class amenities', ARRAY['WiFi','Pool','Gym','Restaurant','Spa','Parking'], 'luxury', true),
('a2222222-2222-2222-2222-222222222222', 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd', 'Sunset Beach Resort', 'sunset-beach-resort', '45 Beach Road', 'Goa', 'Goa', 'India', '+91 98765 43211', 'info@sunsetbeach.com', 'Beautiful beachfront resort with stunning ocean views', ARRAY['WiFi','Beach Access','Pool','Restaurant','Water Sports','Bar'], 'resort', true),
('a3333333-3333-3333-3333-333333333333', 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd', 'Heritage Palace', 'heritage-palace', '78 Palace Rd', 'Jaipur', 'Rajasthan', 'India', '+91 98765 43212', 'info@heritagepalace.com', 'Royal heritage hotel with traditional Rajasthani hospitality', ARRAY['WiFi','Restaurant','Cultural Shows','Garden','Museum'], 'vintage', true),
('a4444444-4444-4444-4444-444444444444', 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd', 'Tech Hub Inn', 'tech-hub-inn', '90 IT Park', 'Bangalore', 'Karnataka', 'India', '+91 98765 43213', 'info@techhub.com', 'Modern business hotel near tech parks', ARRAY['WiFi','Conference Room','Business Center','Gym','Restaurant'], 'business', true),
('a5555555-5555-5555-5555-555555555555', 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd', 'Mountain View Lodge', 'mountain-view-lodge', '12 Hill Station', 'Shimla', 'Himachal Pradesh', 'India', '+91 98765 43214', 'info@mountainview.com', 'Cozy lodge with breathtaking mountain views', ARRAY['WiFi','Fireplace','Restaurant','Trekking','Bonfire'], 'minimal', true),
('a6666666-6666-6666-6666-666666666666', 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd', 'City Lights Hotel', 'city-lights-hotel', '34 MG Road', 'Delhi', 'Delhi', 'India', '+91 98765 43215', 'info@citylights.com', 'Contemporary hotel in the capital city', ARRAY['WiFi','Restaurant','Bar','Gym','Rooftop','Parking'], 'modern', true),
('a7777777-7777-7777-7777-777777777777', 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd', 'Backwater Paradise', 'backwater-paradise', '56 Lake View', 'Alleppey', 'Kerala', 'India', '+91 98765 43216', 'info@backwaterparadise.com', 'Serene resort on Kerala backwaters', ARRAY['WiFi','Boat Rides','Pool','Ayurveda Spa','Restaurant'], 'resort', true),
('a8888888-8888-8888-8888-888888888888', 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd', 'Urban Stay Suites', 'urban-stay-suites', '67 Park Street', 'Kolkata', 'West Bengal', 'India', '+91 98765 43217', 'info@urbanstay.com', 'Stylish suites in cultural capital', ARRAY['WiFi','Kitchenette','Gym','Restaurant','Laundry'], 'colorful', true),
('a9999999-9999-9999-9999-999999999999', 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd', 'Desert Oasis Hotel', 'desert-oasis-hotel', '89 Sand Dunes', 'Jaisalmer', 'Rajasthan', 'India', '+91 98765 43218', 'info@desertoasis.com', 'Unique desert experience with camel safaris', ARRAY['WiFi','Desert Safari','Cultural Programs','Restaurant','Terrace'], 'vintage', true),
('a0000000-0000-0000-0000-000000000000', 'd1cfb702-d91e-41f8-8496-95e7ed95f8fd', 'Riverside Retreat', 'riverside-retreat', '23 River Bank', 'Rishikesh', 'Uttarakhand', 'India', '+91 98765 43219', 'info@riversideretreat.com', 'Peaceful retreat by the holy Ganges', ARRAY['WiFi','Yoga Center','Meditation','Restaurant','River View','Adventure Sports'], 'minimal', true);

-- Rooms for each hotel (3 rooms per hotel)
INSERT INTO rooms (hotel_id, title, description, price, max_guests, amenities, room_number, floor, bed_type) VALUES
-- Grand Plaza Hotel
('a1111111-1111-1111-1111-111111111111', 'Deluxe Room', 'Spacious room with city view', 3500, 2, ARRAY['King Bed','AC','TV','WiFi'], '201', 2, 'King'),
('a1111111-1111-1111-1111-111111111111', 'Executive Suite', 'Luxury suite with living area', 6500, 3, ARRAY['King Bed','Sofa','AC','TV','WiFi','Balcony'], '501', 5, 'King'),
('a1111111-1111-1111-1111-111111111111', 'Family Room', 'Perfect for families', 5000, 4, ARRAY['Two Queen Beds','AC','TV','WiFi'], '302', 3, 'Queen'),
-- Sunset Beach Resort
('a2222222-2222-2222-2222-222222222222', 'Beach View Room', 'Direct beach access', 4000, 2, ARRAY['King Bed','AC','TV','WiFi','Beach View'], '101', 1, 'King'),
('a2222222-2222-2222-2222-222222222222', 'Ocean Suite', 'Panoramic ocean views', 7000, 3, ARRAY['King Bed','Living Area','AC','TV','WiFi','Balcony'], '301', 3, 'King'),
('a2222222-2222-2222-2222-222222222222', 'Family Villa', 'Private villa for families', 9000, 6, ARRAY['Two Bedrooms','Kitchen','AC','TV','WiFi','Garden'], 'V1', 1, 'Multiple'),
-- Heritage Palace
('a3333333-3333-3333-3333-333333333333', 'Royal Room', 'Traditional Rajasthani decor', 4500, 2, ARRAY['King Bed','AC','TV','WiFi','Antique Furniture'], '201', 2, 'King'),
('a3333333-3333-3333-3333-333333333333', 'Maharaja Suite', 'Luxurious royal suite', 8500, 4, ARRAY['King Bed','Living Room','AC','TV','WiFi','Terrace'], '401', 4, 'King'),
('a3333333-3333-3333-3333-333333333333', 'Heritage Room', 'Classic heritage experience', 3800, 2, ARRAY['Queen Bed','AC','TV','WiFi'], '102', 1, 'Queen'),
-- Tech Hub Inn
('a4444444-4444-4444-4444-444444444444', 'Business Room', 'Perfect for business travelers', 3000, 2, ARRAY['King Bed','AC','TV','WiFi','Work Desk'], '301', 3, 'King'),
('a4444444-4444-4444-4444-444444444444', 'Executive Room', 'Premium business accommodation', 4500, 2, ARRAY['King Bed','AC','TV','WiFi','Work Desk','Lounge Access'], '501', 5, 'King'),
('a4444444-4444-4444-4444-444444444444', 'Studio Suite', 'Living and working space', 5500, 3, ARRAY['King Bed','Living Area','AC','TV','WiFi','Kitchenette'], '601', 6, 'King'),
-- Mountain View Lodge
('a5555555-5555-5555-5555-555555555555', 'Valley View Room', 'Stunning valley views', 3200, 2, ARRAY['Queen Bed','Heater','TV','WiFi','Mountain View'], '201', 2, 'Queen'),
('a5555555-5555-5555-5555-555555555555', 'Mountain Suite', 'Luxury mountain experience', 5500, 3, ARRAY['King Bed','Fireplace','TV','WiFi','Balcony'], '301', 3, 'King'),
('a5555555-5555-5555-5555-555555555555', 'Family Cottage', 'Cozy family cottage', 6000, 5, ARRAY['Two Bedrooms','Heater','TV','WiFi','Kitchen'], 'C1', 1, 'Multiple'),
-- City Lights Hotel
('a6666666-6666-6666-6666-666666666666', 'Standard Room', 'Comfortable city room', 2800, 2, ARRAY['Queen Bed','AC','TV','WiFi'], '401', 4, 'Queen'),
('a6666666-6666-6666-6666-666666666666', 'Premium Room', 'Enhanced city experience', 4200, 2, ARRAY['King Bed','AC','TV','WiFi','City View'], '701', 7, 'King'),
('a6666666-6666-6666-6666-666666666666', 'Penthouse Suite', 'Top floor luxury', 8000, 4, ARRAY['King Bed','Living Room','AC','TV','WiFi','Terrace'], '1001', 10, 'King'),
-- Backwater Paradise
('a7777777-7777-7777-7777-777777777777', 'Lake View Room', 'Serene lake views', 3800, 2, ARRAY['King Bed','AC','TV','WiFi','Lake View'], '101', 1, 'King'),
('a7777777-7777-7777-7777-777777777777', 'Backwater Villa', 'Private waterfront villa', 7500, 4, ARRAY['Two Bedrooms','AC','TV','WiFi','Private Deck'], 'V2', 1, 'Multiple'),
('a7777777-7777-7777-7777-777777777777', 'Honeymoon Suite', 'Romantic lakeside suite', 6500, 2, ARRAY['King Bed','Jacuzzi','AC','TV','WiFi','Balcony'], '201', 2, 'King'),
-- Urban Stay Suites
('a8888888-8888-8888-8888-888888888888', 'Studio Suite', 'Compact living space', 3500, 2, ARRAY['Queen Bed','AC','TV','WiFi','Kitchenette'], '301', 3, 'Queen'),
('a8888888-8888-8888-8888-888888888888', 'One Bedroom Suite', 'Separate bedroom and living', 5000, 3, ARRAY['King Bed','Living Room','AC','TV','WiFi','Kitchen'], '501', 5, 'King'),
('a8888888-8888-8888-8888-888888888888', 'Two Bedroom Suite', 'Perfect for families', 7000, 5, ARRAY['Two Bedrooms','Living Room','AC','TV','WiFi','Full Kitchen'], '701', 7, 'Multiple'),
-- Desert Oasis Hotel
('a9999999-9999-9999-9999-999999999999', 'Desert Room', 'Traditional desert accommodation', 3000, 2, ARRAY['Queen Bed','AC','TV','WiFi','Desert View'], '101', 1, 'Queen'),
('a9999999-9999-9999-9999-999999999999', 'Royal Tent', 'Luxury desert camping', 5500, 3, ARRAY['King Bed','AC','Traditional Decor','WiFi'], 'T1', 1, 'King'),
('a9999999-9999-9999-9999-999999999999', 'Palace Suite', 'Desert palace experience', 7500, 4, ARRAY['King Bed','Living Area','AC','TV','WiFi','Terrace'], '201', 2, 'King'),
-- Riverside Retreat
('a0000000-0000-0000-0000-000000000000', 'River View Room', 'Peaceful river views', 2500, 2, ARRAY['Queen Bed','Fan','WiFi','River View'], '101', 1, 'Queen'),
('a0000000-0000-0000-0000-000000000000', 'Yoga Suite', 'Meditation and yoga space', 4000, 2, ARRAY['King Bed','Yoga Mat','Fan','WiFi','Balcony'], '201', 2, 'King'),
('a0000000-0000-0000-0000-000000000000', 'Ashram Cottage', 'Traditional ashram style', 3500, 4, ARRAY['Simple Beds','Fan','WiFi','Garden'], 'A1', 1, 'Multiple');

-- Promo Codes (2 per hotel)
INSERT INTO promo_codes (hotel_id, code, discount_type, discount_value, valid_from, valid_to, is_active) VALUES
('a1111111-1111-1111-1111-111111111111', 'GRAND10', 'percentage', 10, NOW(), NOW() + INTERVAL '60 days', true),
('a1111111-1111-1111-1111-111111111111', 'LUXURY500', 'fixed', 500, NOW(), NOW() + INTERVAL '30 days', true),
('a2222222-2222-2222-2222-222222222222', 'BEACH15', 'percentage', 15, NOW(), NOW() + INTERVAL '60 days', true),
('a2222222-2222-2222-2222-222222222222', 'SUMMER20', 'percentage', 20, NOW(), NOW() + INTERVAL '90 days', true),
('a3333333-3333-3333-3333-333333333333', 'ROYAL15', 'percentage', 15, NOW(), NOW() + INTERVAL '60 days', true),
('a3333333-3333-3333-3333-333333333333', 'HERITAGE10', 'percentage', 10, NOW(), NOW() + INTERVAL '45 days', true),
('a4444444-4444-4444-4444-444444444444', 'BUSINESS20', 'percentage', 20, NOW(), NOW() + INTERVAL '90 days', true),
('a4444444-4444-4444-4444-444444444444', 'CORP500', 'fixed', 500, NOW(), NOW() + INTERVAL '60 days', true),
('a5555555-5555-5555-5555-555555555555', 'MOUNTAIN15', 'percentage', 15, NOW(), NOW() + INTERVAL '60 days', true),
('a5555555-5555-5555-5555-555555555555', 'WINTER25', 'percentage', 25, NOW(), NOW() + INTERVAL '90 days', true),
('a6666666-6666-6666-6666-666666666666', 'CITY10', 'percentage', 10, NOW(), NOW() + INTERVAL '60 days', true),
('a6666666-6666-6666-6666-666666666666', 'METRO300', 'fixed', 300, NOW(), NOW() + INTERVAL '30 days', true),
('a7777777-7777-7777-7777-777777777777', 'BACKWATER20', 'percentage', 20, NOW(), NOW() + INTERVAL '60 days', true),
('a7777777-7777-7777-7777-777777777777', 'KERALA15', 'percentage', 15, NOW(), NOW() + INTERVAL '45 days', true),
('a8888888-8888-8888-8888-888888888888', 'URBAN10', 'percentage', 10, NOW(), NOW() + INTERVAL '60 days', true),
('a8888888-8888-8888-8888-888888888888', 'SUITE400', 'fixed', 400, NOW(), NOW() + INTERVAL '30 days', true),
('a9999999-9999-9999-9999-999999999999', 'DESERT20', 'percentage', 20, NOW(), NOW() + INTERVAL '60 days', true),
('a9999999-9999-9999-9999-999999999999', 'SAFARI15', 'percentage', 15, NOW(), NOW() + INTERVAL '45 days', true),
('a0000000-0000-0000-0000-000000000000', 'YOGA20', 'percentage', 20, NOW(), NOW() + INTERVAL '90 days', true),
('a0000000-0000-0000-0000-000000000000', 'PEACE300', 'fixed', 300, NOW(), NOW() + INTERVAL '60 days', true);

-- Packages (2 per hotel)
INSERT INTO packages (hotel_id, name, description, package_type, included_items, price, is_active) VALUES
('a1111111-1111-1111-1111-111111111111', 'Honeymoon Special', 'Romantic package', 'honeymoon', ARRAY['Breakfast','Champagne','Spa','Late Checkout'], 5000, true),
('a1111111-1111-1111-1111-111111111111', 'Business Package', 'Corporate package', 'business', ARRAY['WiFi','Conference Room','Breakfast','Airport Transfer'], 4000, true),
('a2222222-2222-2222-2222-222222222222', 'Beach Holiday', 'Complete beach experience', 'weekend', ARRAY['Breakfast','Water Sports','Beach Access','Dinner'], 6000, true),
('a2222222-2222-2222-2222-222222222222', 'Family Fun', 'Family entertainment', 'family', ARRAY['Breakfast','Kids Activities','Pool Access','Snacks'], 4500, true),
('a3333333-3333-3333-3333-333333333333', 'Royal Experience', 'Heritage package', 'custom', ARRAY['Breakfast','Cultural Show','Palace Tour','Dinner'], 5500, true),
('a3333333-3333-3333-3333-333333333333', 'Heritage Tour', 'Cultural immersion', 'custom', ARRAY['Breakfast','City Tour','Museum Entry','Lunch'], 4000, true),
('a4444444-4444-4444-4444-444444444444', 'Corporate Stay', 'Business essentials', 'business', ARRAY['WiFi','Meeting Room','Breakfast','Laundry'], 3500, true),
('a4444444-4444-4444-4444-444444444444', 'Tech Conference', 'Conference package', 'business', ARRAY['Conference Hall','AV Equipment','Lunch','Coffee'], 8000, true),
('a5555555-5555-5555-5555-555555555555', 'Adventure Package', 'Mountain activities', 'custom', ARRAY['Breakfast','Trekking Guide','Packed Lunch','Bonfire'], 4500, true),
('a5555555-5555-5555-5555-555555555555', 'Romantic Getaway', 'Couple package', 'honeymoon', ARRAY['Breakfast','Candlelight Dinner','Room Decoration','Late Checkout'], 5000, true),
('a6666666-6666-6666-6666-666666666666', 'City Explorer', 'Urban experience', 'weekend', ARRAY['Breakfast','City Tour','Metro Pass','Dinner'], 3500, true),
('a6666666-6666-6666-6666-666666666666', 'Weekend Special', 'Weekend package', 'weekend', ARRAY['Breakfast','Rooftop Access','Welcome Drink','Late Checkout'], 4000, true),
('a7777777-7777-7777-7777-777777777777', 'Backwater Cruise', 'Houseboat experience', 'custom', ARRAY['Breakfast','Boat Ride','Lunch','Dinner'], 7000, true),
('a7777777-7777-7777-7777-777777777777', 'Ayurveda Wellness', 'Spa and wellness', 'custom', ARRAY['Breakfast','Ayurveda Treatment','Yoga','Meditation'], 6000, true),
('a8888888-8888-8888-8888-888888888888', 'Extended Stay', 'Long stay package', 'custom', ARRAY['Breakfast','Laundry','Housekeeping','WiFi'], 5000, true),
('a8888888-8888-8888-8888-888888888888', 'Family Suite Deal', 'Family package', 'family', ARRAY['Breakfast','Kitchen Access','City Tour','Welcome Kit'], 5500, true),
('a9999999-9999-9999-9999-999999999999', 'Desert Safari', 'Desert adventure', 'custom', ARRAY['Breakfast','Camel Safari','Cultural Show','Dinner'], 6500, true),
('a9999999-9999-9999-9999-999999999999', 'Royal Desert', 'Luxury desert stay', 'custom', ARRAY['Breakfast','Jeep Safari','Folk Dance','BBQ Dinner'], 7500, true),
('a0000000-0000-0000-0000-000000000000', 'Yoga Retreat', 'Wellness package', 'custom', ARRAY['Breakfast','Yoga Classes','Meditation','Ayurveda Consultation'], 4000, true),
('a0000000-0000-0000-0000-000000000000', 'Adventure Sports', 'Rafting and activities', 'custom', ARRAY['Breakfast','River Rafting','Trekking','Camping'], 5500, true);

-- Add-ons (3 per hotel)
INSERT INTO addons (hotel_id, name, description, price, type, is_active) VALUES
('a1111111-1111-1111-1111-111111111111', 'Airport Transfer', 'Pick up and drop', 1500, 'transport', true),
('a1111111-1111-1111-1111-111111111111', 'Spa Treatment', '60-min massage', 2000, 'service', true),
('a1111111-1111-1111-1111-111111111111', 'Extra Bed', 'Additional bed', 800, 'amenity', true),
('a2222222-2222-2222-2222-222222222222', 'Water Sports', 'Jet ski and parasailing', 3000, 'activity', true),
('a2222222-2222-2222-2222-222222222222', 'Beach Dinner', 'Private beach dinner', 4000, 'food', true),
('a2222222-2222-2222-2222-222222222222', 'Scuba Diving', 'Diving session', 5000, 'activity', true),
('a3333333-3333-3333-3333-333333333333', 'Palace Tour', 'Guided heritage tour', 1500, 'activity', true),
('a3333333-3333-3333-3333-333333333333', 'Cultural Show', 'Folk dance performance', 1000, 'activity', true),
('a3333333-3333-3333-3333-333333333333', 'Royal Dinner', 'Traditional Rajasthani meal', 2500, 'food', true),
('a4444444-4444-4444-4444-444444444444', 'Meeting Room', 'Per hour', 1000, 'service', true),
('a4444444-4444-4444-4444-444444444444', 'Express Laundry', 'Same day service', 500, 'service', true),
('a4444444-4444-4444-4444-444444444444', 'Airport Shuttle', 'Shared transfer', 800, 'transport', true),
('a5555555-5555-5555-5555-555555555555', 'Trekking Guide', 'Professional guide', 2000, 'activity', true),
('a5555555-5555-5555-5555-555555555555', 'Bonfire Night', 'Evening bonfire', 1500, 'activity', true),
('a5555555-5555-5555-5555-555555555555', 'Hot Chocolate', 'Special beverage', 300, 'food', true),
('a6666666-6666-6666-6666-666666666666', 'City Tour', 'Half day tour', 2000, 'activity', true),
('a6666666-6666-6666-6666-666666666666', 'Rooftop Dinner', 'Private rooftop dining', 3500, 'food', true),
('a6666666-6666-6666-6666-666666666666', 'Car Rental', 'Per day', 2500, 'transport', true),
('a7777777-7777-7777-7777-777777777777', 'Houseboat Ride', '2-hour cruise', 3000, 'activity', true),
('a7777777-7777-7777-7777-777777777777', 'Ayurveda Massage', 'Traditional massage', 2500, 'service', true),
('a7777777-7777-7777-7777-777777777777', 'Cooking Class', 'Kerala cuisine', 2000, 'activity', true),
('a8888888-8888-8888-8888-888888888888', 'Grocery Shopping', 'Stocking service', 1000, 'service', true),
('a8888888-8888-8888-8888-888888888888', 'Babysitting', 'Per hour', 500, 'service', true),
('a8888888-8888-8888-8888-888888888888', 'Museum Pass', '3-day pass', 1500, 'activity', true),
('a9999999-9999-9999-9999-999999999999', 'Camel Safari', 'Desert camel ride', 2500, 'activity', true),
('a9999999-9999-9999-9999-999999999999', 'Jeep Safari', 'Desert exploration', 3500, 'activity', true),
('a9999999-9999-9999-9999-999999999999', 'Folk Performance', 'Evening show', 1500, 'activity', true),
('a0000000-0000-0000-0000-000000000000', 'Yoga Session', 'Private class', 1000, 'activity', true),
('a0000000-0000-0000-0000-000000000000', 'River Rafting', 'Adventure activity', 2500, 'activity', true),
('a0000000-0000-0000-0000-000000000000', 'Meditation Class', 'Guided meditation', 800, 'activity', true);

-- Sample Bookings (3 per hotel)
INSERT INTO bookings (booking_reference, hotel_id, room_id, guest_name, guest_email, guest_phone, check_in, check_out, num_guests, total_amount, payment_status, status, created_at) 
SELECT 
  'BK' || LPAD((ROW_NUMBER() OVER())::TEXT, 8, '0'),
  h.hotel_id,
  (SELECT id FROM rooms WHERE rooms.hotel_id = h.hotel_id LIMIT 1),
  CASE (ROW_NUMBER() OVER() % 10)
    WHEN 0 THEN 'Amit Kumar' WHEN 1 THEN 'Priya Singh' WHEN 2 THEN 'Rahul Sharma'
    WHEN 3 THEN 'Sneha Patel' WHEN 4 THEN 'Vikram Reddy' WHEN 5 THEN 'Ananya Iyer'
    WHEN 6 THEN 'Karan Mehta' WHEN 7 THEN 'Divya Nair' WHEN 8 THEN 'Rohan Gupta'
    ELSE 'Pooja Desai'
  END,
  'guest' || (ROW_NUMBER() OVER())::TEXT || '@email.com',
  '+91 98765 ' || LPAD((ROW_NUMBER() OVER())::TEXT, 5, '0'),
  CURRENT_DATE - ((ROW_NUMBER() OVER() % 30) || ' days')::INTERVAL,
  CURRENT_DATE - ((ROW_NUMBER() OVER() % 30) || ' days')::INTERVAL + INTERVAL '3 days',
  2,
  (3000 + (ROW_NUMBER() OVER() % 5) * 1000)::DECIMAL,
  'paid',
  'checked_out',
  NOW() - ((ROW_NUMBER() OVER() % 35) || ' days')::INTERVAL
FROM (SELECT id AS hotel_id FROM hotels LIMIT 10) h
CROSS JOIN generate_series(1, 3);

-- Reviews (2 per hotel)
INSERT INTO reviews (hotel_id, guest_name, rating, comment, is_approved, created_at)
SELECT 
  id,
  CASE (ROW_NUMBER() OVER() % 5)
    WHEN 0 THEN 'Satisfied Guest' WHEN 1 THEN 'Happy Traveler'
    WHEN 2 THEN 'Regular Customer' WHEN 3 THEN 'First Timer'
    ELSE 'Returning Guest'
  END,
  4 + (RANDOM() * 1)::INTEGER,
  CASE (ROW_NUMBER() OVER() % 3)
    WHEN 0 THEN 'Excellent service and clean rooms. Highly recommended!'
    WHEN 1 THEN 'Great location and friendly staff. Will visit again.'
    ELSE 'Wonderful experience. Good value for money.'
  END,
  true,
  NOW() - ((ROW_NUMBER() OVER() % 20) || ' days')::INTERVAL
FROM hotels
CROSS JOIN generate_series(1, 2);

COMMIT;
