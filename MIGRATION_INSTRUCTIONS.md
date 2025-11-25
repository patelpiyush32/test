# Database Migration Instructions

## Apply Enhanced Booking System Migration

Since Supabase CLI is not installed, apply the migration manually:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** from the left sidebar
4. Click **New Query**
5. Copy the entire content from: `supabase/migrations/20251126000000_enhanced_booking_system.sql`
6. Paste it in the SQL Editor
7. Click **Run** button

This migration adds:
- Enhanced booking fields (multiple rooms, adults/children, early checkin, etc.)
- Booking guests table for multiple guest details
- Payment methods table
- Packages table for special offers
- Booking packages linking table
- Notifications system with real-time triggers
- Room pricing rules for dynamic pricing
- Analytics events tracking
- Helper functions for revenue calculations
- Proper indexes for performance
- RLS policies for security

## Verify Migration

After running, verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'booking_guests',
  'payment_methods',
  'packages',
  'booking_packages',
  'notifications',
  'room_pricing_rules',
  'analytics_events'
);
```

All 7 tables should be listed.

## Test Notification Trigger

Create a test booking and check if notification is created automatically:

```sql
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;
```
