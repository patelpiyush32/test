# Database Reset Instructions

## ⚠️ WARNING
This will DELETE ALL existing data and create fresh tables with sample data.

## Steps to Reset Database

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project
- Go to **SQL Editor**

### 2. Run Reset Migration
- Click **New Query**
- Copy entire content from: `supabase/migrations/20251127000000_complete_reset_with_sample_data.sql`
- Paste in SQL Editor
- Click **Run** (or press Ctrl+Enter)

### 3. Verify Tables Created
Run this query to check all tables:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see 20 tables:
- addons
- analytics_events
- availability
- booking_addons
- booking_guests
- booking_packages
- bookings
- checkins
- email_logs
- guests
- hotels
- housekeeping_tasks
- notifications
- packages
- payment_methods
- promo_codes
- reviews
- room_pricing_rules
- rooms
- templates

### 4. Verify Sample Data
Check templates:

```sql
SELECT * FROM templates;
```

Should show 7 templates (Modern, Luxury, Vintage, Resort, Colorful, Minimal, Business)

### 5. Create Your First Hotel
Now you can:
1. Go to your app: `http://localhost:5173`
2. Sign up with new account
3. Complete onboarding wizard
4. Your hotel will be created with fresh database!

## What This Migration Does

### ✅ Drops All Existing Tables
- Removes all old data
- Cleans up foreign key relationships
- Fresh start

### ✅ Creates All Tables
- 20 tables with proper structure
- All foreign key relationships
- Proper data types and constraints

### ✅ Creates Indexes
- Performance optimization
- Fast queries on common fields

### ✅ Enables RLS (Row Level Security)
- Secure data access
- User-specific policies
- Public access where needed

### ✅ Creates Triggers
- Auto-notification on new booking
- Real-time updates

### ✅ Creates Functions
- Revenue calculation helper
- Analytics support

### ✅ Inserts Sample Data
- 7 website templates
- Ready to use

## Database Structure

### Core Tables
1. **hotels** - Hotel information
2. **rooms** - Room inventory
3. **bookings** - All bookings
4. **guests** - Guest database

### Booking Related
5. **booking_guests** - Multiple guest details
6. **booking_addons** - Selected add-ons
7. **booking_packages** - Selected packages
8. **checkins** - Check-in/out records

### Marketing
9. **promo_codes** - Discount codes
10. **packages** - Special packages
11. **addons** - Extra services

### Operations
12. **housekeeping_tasks** - Cleaning/maintenance
13. **payment_methods** - Payment options
14. **transactions** - Payment records

### Analytics
15. **analytics_events** - Event tracking
16. **room_pricing_rules** - Dynamic pricing
17. **availability** - Room availability

### Communication
18. **notifications** - Real-time alerts
19. **email_logs** - Email history
20. **reviews** - Guest reviews

### Configuration
21. **templates** - Website templates

## After Reset

### Your app will have:
- ✅ Clean database
- ✅ All tables with proper structure
- ✅ RLS policies enabled
- ✅ Indexes for performance
- ✅ Triggers for automation
- ✅ 7 website templates
- ✅ Ready for onboarding

### You can now:
1. Create hotel account
2. Complete onboarding
3. Add rooms
4. Create promo codes
5. Add packages
6. Add add-ons
7. Receive bookings
8. Manage operations

## Troubleshooting

### If migration fails:
1. Check if you have admin access
2. Try running in smaller parts
3. Check for syntax errors
4. Verify Supabase connection

### If tables not created:
1. Check SQL Editor output
2. Look for error messages
3. Verify foreign key relationships
4. Check data types

### If RLS not working:
1. Verify policies created
2. Check user authentication
3. Test with authenticated user

## Next Steps

After successful reset:
1. ✅ Run `npm run dev`
2. ✅ Sign up new account
3. ✅ Complete onboarding
4. ✅ Test all features
5. ✅ Add sample data via dashboard

Your hotel SaaS platform is now ready with a clean, optimized database! 🎉
