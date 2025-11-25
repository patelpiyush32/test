# Sample Hotel Data Instructions

## 📋 Overview
This will create a complete sample hotel "Grand Plaza Hotel" with realistic data including rooms, bookings, reviews, packages, add-ons, and more.

## 🏨 Sample Hotel Details

### Hotel: Grand Plaza Hotel
- **Location**: Mumbai, Maharashtra, India
- **Type**: Luxury Hotel
- **Rooms**: 4 different room types
- **Template**: Luxury
- **Status**: Published and Active

### Included Data:
- ✅ 1 Hotel (Grand Plaza Hotel)
- ✅ 4 Rooms (Deluxe, Executive Suite, Family, Presidential)
- ✅ 3 Promo Codes (WELCOME10, SUMMER25, FLAT500)
- ✅ 3 Packages (Honeymoon, Family Fun, Business)
- ✅ 5 Add-ons (Airport Transfer, Breakfast, Spa, Extra Bed, City Tour)
- ✅ 7 Bookings (past and upcoming)
- ✅ 4 Reviews (5-star ratings)
- ✅ 3 Housekeeping Tasks
- ✅ 3 Payment Methods
- ✅ 1 Check-in record

## 🚀 Setup Steps

### Step 1: Create Your Account
1. Run: `npm run dev`
2. Go to: `http://localhost:5173`
3. Click "Get Started"
4. Sign up with email/password
5. **IMPORTANT**: Note your email address

### Step 2: Get Your User ID
1. Go to Supabase Dashboard → SQL Editor
2. Run this query (replace with your email):

```sql
SELECT id FROM auth.users WHERE email = 'your@email.com';
```

3. Copy the UUID (e.g., `abc123-def456-...`)

### Step 3: Apply Sample Data
1. Open file: `supabase/migrations/20251127000001_sample_hotel_data.sql`
2. Find line 8: `'YOUR_USER_ID'`
3. Replace with your actual user_id from Step 2
4. Go to Supabase Dashboard → SQL Editor
5. Copy entire modified file content
6. Paste and Run

### Step 4: Verify Data
Run these queries to verify:

```sql
-- Check hotel
SELECT name, slug, city FROM hotels;

-- Check rooms
SELECT title, price, room_number FROM rooms;

-- Check bookings
SELECT booking_reference, guest_name, check_in, status FROM bookings;

-- Check promo codes
SELECT code, discount_type, discount_value FROM promo_codes;

-- Check packages
SELECT name, package_type, price FROM packages;

-- Check add-ons
SELECT name, type, price FROM addons;

-- Check reviews
SELECT guest_name, rating, comment FROM reviews;
```

### Step 5: Access Your Hotel
1. Refresh your app
2. You'll be automatically logged in
3. Dashboard will show all data
4. Visit public site: `http://localhost:5173/hotel/grand-plaza-hotel`

## 📊 Sample Data Details

### Rooms (4 types)
1. **Deluxe Room** - ₹3,500/night
   - 2 guests, King bed
   - Room 201, Floor 2

2. **Executive Suite** - ₹6,500/night
   - 3 guests, King + Sofa bed
   - Room 501, Floor 5

3. **Family Room** - ₹5,000/night
   - 4 guests, Two Queen beds
   - Room 302, Floor 3

4. **Presidential Suite** - ₹12,000/night
   - 4 guests, King bed + extras
   - Room 1001, Floor 10

### Promo Codes (3 active)
1. **WELCOME10** - 10% off (100 uses)
2. **SUMMER25** - 25% off (50 uses)
3. **FLAT500** - ₹500 off (unlimited)

### Packages (3 types)
1. **Honeymoon Special** - ₹5,000
   - Breakfast, room decoration, champagne, spa, late checkout, dinner

2. **Family Fun Package** - ₹3,500
   - Breakfast for 4, kids area, pool, movie night, games, snacks

3. **Business Traveler** - ₹4,000
   - WiFi, conference room, business center, laundry, airport transfer

### Add-ons (5 services)
1. **Airport Transfer** - ₹1,500
2. **Breakfast Buffet** - ₹500
3. **Spa Treatment** - ₹2,000
4. **Extra Bed** - ₹800
5. **City Tour** - ₹2,500

### Bookings (7 bookings)
- 4 past bookings (checked out)
- 1 current booking (checked in today)
- 2 upcoming bookings (confirmed)

**Revenue Generated**: ₹122,500 from past bookings

### Reviews (4 reviews)
- All 5-star or 4-star ratings
- Detailed comments
- Approved and visible

### Housekeeping Tasks (3 tasks)
- 1 completed (cleaning)
- 1 pending (deep cleaning)
- 1 in progress (maintenance)

## 🎯 What You Can Test

### Dashboard Features
- ✅ Overview with stats
- ✅ Analytics with revenue charts
- ✅ Bookings list (past, current, upcoming)
- ✅ Check-in/out management
- ✅ Guest database (7 guests)
- ✅ Rooms management
- ✅ Housekeeping tasks
- ✅ Packages management
- ✅ Add-ons management
- ✅ Promo codes management
- ✅ Reviews with ratings
- ✅ Payment methods

### Public Website
- ✅ View hotel details
- ✅ Browse 4 room types
- ✅ Book rooms with add-ons
- ✅ Apply promo codes
- ✅ Select packages
- ✅ Read reviews

### Analytics
- ✅ Total revenue: ₹122,500
- ✅ Total bookings: 7
- ✅ Average booking: ₹17,500
- ✅ Occupancy rate
- ✅ Revenue by month
- ✅ Top performing rooms

### Guest Management
- ✅ 7 unique guests
- ✅ Guest tiers (based on spending)
- ✅ Booking history
- ✅ Contact information

## 🔄 Reset and Reload

If you want to reset and reload data:

1. Run complete reset migration first
2. Create new account or use existing
3. Get user_id
4. Update sample data file
5. Run sample data migration

## 📝 Customization

You can modify the sample data:

### Change Hotel Name
Find line 11 in sample data file:
```sql
'Grand Plaza Hotel',
```

### Change Location
Find lines 13-15:
```sql
'Mumbai',
'Maharashtra',
'India',
```

### Change Room Prices
Find price values in rooms section:
```sql
3500.00,  -- Change this
```

### Add More Bookings
Copy existing booking INSERT and modify:
- booking_reference
- guest details
- dates
- amounts

## ✅ Verification Checklist

After loading data, verify:
- [ ] Hotel appears in dashboard
- [ ] 4 rooms visible
- [ ] 7 bookings showing
- [ ] 4 reviews displayed
- [ ] 3 promo codes active
- [ ] 3 packages available
- [ ] 5 add-ons listed
- [ ] Analytics showing revenue
- [ ] Guest list showing 7 guests
- [ ] Housekeeping tasks visible
- [ ] Public website accessible

## 🎉 You're Ready!

Your hotel is now fully loaded with realistic data. You can:
- Test all dashboard features
- Create new bookings
- Manage operations
- View analytics
- Test guest experience

Enjoy exploring your fully functional hotel management system! 🏨
