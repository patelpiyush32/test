# Quick Setup Guide - Hotel SaaS Platform

## 🚀 Setup Steps

### 1. Database Migration
Apply the enhanced booking system migration:

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Copy content from: `supabase/migrations/20251126000000_enhanced_booking_system.sql`
5. Paste and click **Run**

### 2. Verify Tables
Run this query to verify all tables are created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see 20+ tables including:
- hotels, rooms, bookings
- booking_guests, payment_methods
- packages, booking_packages
- addons, booking_addons
- promo_codes, notifications
- checkins, housekeeping_tasks
- room_pricing_rules, analytics_events
- reviews, guests, transactions, availability

### 3. Test the Application

#### A. Create Hotel Account
1. Run: `npm run dev`
2. Go to landing page
3. Click "Get Started"
4. Sign up with email/password
5. Complete 5-step onboarding wizard

#### B. Test Dashboard Features
After onboarding, you'll have access to:

**Dashboard** - View overview stats
**Analytics** - Check revenue & occupancy
**Bookings** - Manage all bookings
**Check-In/Out** - Handle daily operations
**Guests** - View guest database
**Rooms** - Manage room inventory
**Housekeeping** - Create cleaning tasks
**Packages** - Create special offers
**Add-ons** - Add extra services
**Promo Codes** - Create discount codes
**Website** - Customize your site
**Notifications** - View real-time alerts

#### C. Test Public Booking
1. Get your hotel slug from dashboard
2. Visit: `http://localhost:5173/hotel/YOUR-SLUG`
3. Click "Book Now" on any room
4. Complete 4-step booking form:
   - Step 1: Dates, rooms, guests
   - Step 2: Guest details
   - Step 3: Add-ons & packages
   - Step 4: Payment summary

### 4. Add Sample Data

#### Create Promo Code
```sql
INSERT INTO promo_codes (hotel_id, code, discount_type, discount_value, valid_from, valid_to, is_active, used_count)
VALUES (
  'YOUR_HOTEL_ID',
  'WELCOME10',
  'percentage',
  10,
  NOW(),
  NOW() + INTERVAL '30 days',
  true,
  0
);
```

#### Create Package
```sql
INSERT INTO packages (hotel_id, name, description, package_type, included_items, price, is_active)
VALUES (
  'YOUR_HOTEL_ID',
  'Honeymoon Special',
  'Perfect for newlyweds',
  'honeymoon',
  '["Complimentary breakfast", "Room decoration", "Champagne bottle", "Late checkout"]',
  5000,
  true
);
```

#### Create Add-on
```sql
INSERT INTO addons (hotel_id, name, description, price, type, is_active)
VALUES (
  'YOUR_HOTEL_ID',
  'Airport Transfer',
  'Pick up and drop service',
  1500,
  'transport',
  true
);
```

### 5. Test Real-time Notifications

1. Open dashboard in one browser tab
2. Go to Notifications page
3. In another tab, create a booking on public website
4. Watch notification appear in real-time!

### 6. Test Analytics

1. Create a few bookings (different dates, rooms)
2. Go to Analytics page
3. Switch between Week/Month/Year views
4. Check:
   - Revenue growth
   - Occupancy rate
   - Top performing rooms
   - Booking sources

### 7. Test Guest Management

1. Create bookings with different guest emails
2. Go to Guests page
3. Search for guests
4. Click "View" to see booking history
5. Check tier system (Bronze/Silver/Gold/Platinum)

### 8. Test Housekeeping

1. Go to Housekeeping page
2. Create a cleaning task for a room
3. Click "Start" to move to in-progress
4. Click "Complete" to finish task
5. Filter by status

### 9. Test Check-In/Out

1. Create a booking with today's check-in date
2. Go to Check-In/Out page
3. Click "Arriving Today" tab
4. Click "Check In" button
5. Enter room number and notes
6. Confirm check-in

## 🎯 Key Features to Test

### Booking Form
- [ ] Multi-room selection
- [ ] Adults/children count
- [ ] Early check-in/late checkout
- [ ] Add multiple guests
- [ ] Select add-ons with quantity
- [ ] Select package
- [ ] Apply promo code
- [ ] See real-time price calculation

### Dashboard
- [ ] View all 15 menu items
- [ ] Check responsive sidebar
- [ ] Test mobile view
- [ ] View notifications badge
- [ ] Navigate between pages

### Analytics
- [ ] View revenue stats
- [ ] Check growth percentages
- [ ] See visual charts
- [ ] Switch time periods
- [ ] View top rooms

### Guest Management
- [ ] Search guests
- [ ] View guest tiers
- [ ] Check booking history
- [ ] See total spent

## 🐛 Troubleshooting

### Migration Fails
- Check if tables already exist
- Drop existing tables if needed
- Run migration again

### Notifications Not Working
- Check if trigger was created
- Verify RLS policies
- Check browser console for errors

### Booking Form Not Showing
- Verify hotel is published
- Check room availability
- Verify add-ons/packages exist

### Real-time Not Working
- Check Supabase connection
- Verify subscription setup
- Check browser console

## 📊 Sample Test Data

### Test Promo Codes
- WELCOME10 - 10% off
- SUMMER25 - 25% off
- FLAT500 - ₹500 off

### Test Packages
- Honeymoon Special - ₹5000
- Family Package - ₹8000
- Business Package - ₹6000

### Test Add-ons
- Airport Transfer - ₹1500
- Breakfast - ₹500
- Spa Service - ₹2000

## ✅ Verification Checklist

- [ ] Database migration successful
- [ ] All 20+ tables created
- [ ] Hotel onboarding completed
- [ ] Dashboard accessible
- [ ] Public website working
- [ ] Booking form functional
- [ ] Promo codes working
- [ ] Packages selectable
- [ ] Add-ons working
- [ ] Notifications real-time
- [ ] Analytics showing data
- [ ] Guest management working
- [ ] Housekeeping functional
- [ ] Check-in/out working
- [ ] Mobile responsive

## 🎉 You're Ready!

Your hotel SaaS platform is now fully functional with:
- ✅ 15 dashboard modules
- ✅ Industry-level booking system
- ✅ Real-time notifications
- ✅ Comprehensive analytics
- ✅ Guest management
- ✅ Operations tools
- ✅ Marketing features

Start managing your hotel like a pro! 🏨
