# Quick Start Guide - Dashboard Components

## 🎯 What's New

7 fully functional dashboard pages have been created to replace placeholder text:

| Page | Component | Purpose |
|------|-----------|---------|
| 📝 Website Editor | `WebsiteEditor.tsx` | Edit hotel info & customize theme |
| 📸 Photos Manager | `PhotosManager.tsx` | Upload & manage hotel photos |
| 🛏️ Rooms & Pricing | `RoomsManager.tsx` | Create & manage room types |
| 📅 Bookings | `BookingsManager.tsx` | View & manage guest bookings |
| 💰 Payments | `PaymentsManager.tsx` | Track earnings & transactions |
| ⭐ Reviews | `ReviewsManager.tsx` | Manage guest reviews |
| ⚙️ Settings | `Settings.tsx` | Configure payment & account |

---

## 🚀 Getting Started

### 1. Run the Application
```bash
npm run dev
```

### 2. Create an Account
- Go to landing page
- Click "Get Started"
- Sign up with email/password

### 3. Complete Onboarding
- Step 1: Enter hotel basic info
- Step 2: Upload at least 3 photos
- Step 3: Add room types with pricing
- Step 4: Choose payment method
- Step 5: Select website template

### 4. Access Dashboard
After onboarding, you'll see the dashboard with 8 menu items:
- Dashboard (Overview)
- Website Editor
- Photos Manager
- Rooms & Pricing
- Bookings
- Payments
- Reviews
- Settings

---

## 📋 Component Features

### Website Editor
```
✓ Edit hotel name, description
✓ Update contact information
✓ Customize primary color
✓ Change font family
✓ Preview website URL
✓ Copy URL to clipboard
```

### Photos Manager
```
✓ Drag-and-drop upload
✓ Multiple file selection
✓ Photo preview grid
✓ Remove individual photos
✓ Mark featured photo
✓ Save to database
```

### Rooms Manager
```
✓ Add/remove room types
✓ Set price per night
✓ Configure max guests
✓ Add room description
✓ Select amenities
✓ Toggle availability
```

### Bookings Manager
```
✓ View all bookings
✓ Filter by status
✓ See guest details
✓ Update booking status
✓ View special requests
✓ Calculate stay duration
```

### Payments Manager
```
✓ View total earnings
✓ Track paid amount
✓ Monitor pending amount
✓ See transaction history
✓ Filter by payment status
✓ Export data
```

### Reviews Manager
```
✓ View all reviews
✓ See star ratings
✓ Filter by approval status
✓ Approve pending reviews
✓ Delete reviews
✓ View statistics
```

### Settings
```
✓ Choose payment method
✓ Set UPI ID
✓ Publish/unpublish website
✓ View account info
✓ Sign out
```

---

## 🔄 Data Flow

### Adding a Room
1. Click "Rooms & Pricing" in sidebar
2. Click "Add Room" button
3. Fill in room details
4. Select amenities
5. Click "Save Rooms"
6. Data saved to database

### Uploading Photos
1. Click "Photos Manager" in sidebar
2. Click upload area or drag-drop
3. Select multiple images
4. Preview in grid
5. Click "Save Photos"
6. Photos saved to database

### Managing Bookings
1. Click "Bookings" in sidebar
2. Filter by status if needed
3. Click booking to view details
4. Update status if needed
5. Changes saved immediately

---

## 🎨 Design Consistency

All components use:
- **Colors**: Blue (#2563eb) primary, status-specific colors
- **Layout**: White cards with shadows
- **Icons**: Lucide React icons
- **Spacing**: Consistent padding/margins
- **Forms**: Styled inputs with icons
- **Buttons**: Blue primary, gray secondary, red danger

---

## 💾 Database Integration

All components connect to Supabase:
- Real-time data fetching
- Automatic CRUD operations
- Row-level security (RLS)
- Automatic timestamps

### Tables Used
- `hotels` - Hotel information
- `rooms` - Room types
- `bookings` - Guest bookings
- `reviews` - Guest reviews

---

## ⚡ Key Features

### Real-time Updates
- Changes save immediately
- Success/error alerts
- Loading states

### Filtering & Sorting
- Filter bookings by status
- Filter reviews by approval
- Sort by date/amount

### User-Friendly
- Drag-and-drop uploads
- Modal dialogs for details
- Color-coded statuses
- Clear error messages

---

## 🔧 Customization

### Change Primary Color
1. Go to Website Editor
2. Click color picker
3. Select new color
4. Click "Save Changes"

### Add New Amenities
Edit `RoomsManager.tsx`:
```typescript
const commonAmenities = [
  'AC', 'WiFi', 'TV', 'Attached Bathroom', 'Hot Water',
  'Mini Fridge', 'Balcony', 'Room Service', 'Wardrobe',
  // Add new amenities here
];
```

### Change Payment Methods
Edit `Settings.tsx` to add new payment options:
```typescript
<option value="new-method">New Payment Method</option>
```

---

## 📱 Responsive Design

All components are fully responsive:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

---

## 🐛 Troubleshooting

### Photos not saving?
- Check file size (max 10MB)
- Verify file format (PNG, JPG)
- Check internet connection

### Bookings not showing?
- Ensure bookings exist in database
- Check hotel ID is correct
- Verify RLS policies

### Changes not saving?
- Check browser console for errors
- Verify Supabase connection
- Check user authentication

---

## 📚 File Locations

```
src/components/dashboard/
├── WebsiteEditor.tsx      (Hotel info & theme)
├── PhotosManager.tsx      (Photo uploads)
├── RoomsManager.tsx       (Room management)
├── BookingsManager.tsx    (Booking management)
├── PaymentsManager.tsx    (Payment tracking)
├── ReviewsManager.tsx     (Review management)
└── Settings.tsx           (Account settings)
```

---

## 🎓 Learning Resources

### Component Structure
Each component follows this pattern:
1. Import dependencies
2. Define TypeScript types
3. Initialize state with `useState`
4. Load data with `useEffect`
5. Define handler functions
6. Render UI with Tailwind CSS

### Database Queries
All components use Supabase:
```typescript
const { data } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value);
```

---

## ✅ Testing Checklist

- [ ] Upload photos successfully
- [ ] Add room types with pricing
- [ ] Update booking status
- [ ] Approve/delete reviews
- [ ] Change payment settings
- [ ] Edit hotel information
- [ ] Filter bookings by status
- [ ] View payment statistics
- [ ] Publish website
- [ ] Sign out

---

## 🚀 Next Steps

1. **Test all components** - Verify functionality
2. **Customize colors** - Match your brand
3. **Add more amenities** - Expand room options
4. **Connect payment gateway** - Enable real payments
5. **Set up email notifications** - Booking alerts
6. **Deploy to production** - Go live!

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase connection
3. Check database RLS policies
4. Review component code comments

---

## 🎉 You're All Set!

All dashboard pages are now fully functional. Start managing your hotel bookings, payments, and reviews right away!
