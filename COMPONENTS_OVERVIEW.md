# Dashboard Components Overview

## Architecture Diagram

```
HotelDashboard.tsx (Main Container)
│
├── DashboardLayout.tsx (Sidebar Navigation)
│   ├── Menu Items (8 pages)
│   └── Sign Out Button
│
└── Page Components (Based on currentPage state)
    ├── DashboardOverview.tsx ✓ (Existing)
    │   ├── Stats Cards (4)
    │   ├── Website Info
    │   ├── Recent Bookings
    │   └── Calendar Placeholder
    │
    ├── WebsiteEditor.tsx ✓ (NEW)
    │   ├── Website URL Display
    │   ├── Hotel Information Form
    │   └── Theme Customization
    │
    ├── PhotosManager.tsx ✓ (NEW)
    │   ├── Upload Area
    │   └── Photo Gallery
    │
    ├── RoomsManager.tsx ✓ (NEW)
    │   ├── Room List
    │   ├── Room Form
    │   └── Amenities Selector
    │
    ├── BookingsManager.tsx ✓ (NEW)
    │   ├── Filter Buttons
    │   ├── Booking List
    │   └── Booking Details Modal
    │
    ├── PaymentsManager.tsx ✓ (NEW)
    │   ├── Stats Cards (4)
    │   └── Transaction Table
    │
    ├── ReviewsManager.tsx ✓ (NEW)
    │   ├── Stats Cards (4)
    │   ├── Filter Buttons
    │   └── Review List
    │
    └── Settings.tsx ✓ (NEW)
        ├── Payment Settings
        ├── Website Status
        ├── Account Info
        └── Danger Zone
```

---

## Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    HotelDashboard                           │
│  (Fetches hotel data, manages page state)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   DashboardLayout  Page Component  (Receives hotelId)
   (Navigation)     (Renders based on currentPage)
        │
        ├─ WebsiteEditor
        ├─ PhotosManager
        ├─ RoomsManager
        ├─ BookingsManager
        ├─ PaymentsManager
        ├─ ReviewsManager
        └─ Settings
```

---

## Data Flow Diagram

```
User Interaction
    │
    ▼
Component State Update (useState)
    │
    ▼
Form Submission / Button Click
    │
    ▼
Handler Function (e.g., handleSave)
    │
    ▼
Supabase Query (INSERT/UPDATE/DELETE)
    │
    ▼
Database Update
    │
    ▼
Success/Error Response
    │
    ▼
Alert User
    │
    ▼
Reload Data (loadData function)
    │
    ▼
UI Update (Re-render with new data)
```

---

## Component State Management

### WebsiteEditor
```typescript
State:
- hotel: Hotel | null
- loading: boolean
- saving: boolean
- copied: boolean
- formData: {
    name, description, phone, whatsapp, email,
    address, city, state, primaryColor, fontFamily
  }

Effects:
- Load hotel on mount
```

### PhotosManager
```typescript
State:
- hotel: Hotel | null
- photos: string[]
- loading: boolean
- saving: boolean

Effects:
- Load hotel photos on mount
```

### RoomsManager
```typescript
State:
- rooms: Room[]
- loading: boolean
- saving: boolean
- editingId: string | null

Effects:
- Load rooms on mount
```

### BookingsManager
```typescript
State:
- bookings: Booking[]
- loading: boolean
- filter: 'all' | 'confirmed' | 'pending' | 'cancelled'
- selectedBooking: Booking | null

Effects:
- Load bookings on mount
```

### PaymentsManager
```typescript
State:
- bookings: Booking[]
- loading: boolean
- stats: {
    totalEarnings, paidAmount, pendingAmount,
    totalBookings, paidBookings
  }

Effects:
- Load bookings and calculate stats on mount
```

### ReviewsManager
```typescript
State:
- reviews: Review[]
- loading: boolean
- filter: 'all' | 'approved' | 'pending'
- stats: {
    totalReviews, averageRating,
    approvedReviews, pendingReviews
  }

Effects:
- Load reviews on mount
```

### Settings
```typescript
State:
- hotel: Hotel | null
- loading: boolean
- saving: boolean
- formData: {
    upiId, paymentMethod, isPublished
  }

Effects:
- Load hotel settings on mount
```

---

## Database Schema Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Database                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   hotels     │  │    rooms     │  │   bookings   │     │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤     │
│  │ id (PK)      │  │ id (PK)      │  │ id (PK)      │     │
│  │ user_id (FK) │  │ hotel_id(FK) │  │ hotel_id(FK) │     │
│  │ name         │  │ title        │  │ guest_name   │     │
│  │ slug         │  │ price        │  │ check_in     │     │
│  │ description  │  │ max_guests   │  │ check_out    │     │
│  │ photos       │  │ amenities    │  │ total_amount │     │
│  │ upi_id       │  │ is_available │  │ status       │     │
│  │ theme_config │  │              │  │ payment_id   │     │
│  │ is_published │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ▲                  ▲                  ▲             │
│         │                  │                  │             │
│    WebsiteEditor      RoomsManager      BookingsManager    │
│    Settings           (CRUD)            PaymentsManager    │
│    PhotosManager                                           │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │   reviews    │  │  templates   │                       │
│  ├──────────────┤  ├──────────────┤                       │
│  │ id (PK)      │  │ id (PK)      │                       │
│  │ hotel_id(FK) │  │ name         │                       │
│  │ rating       │  │ category     │                       │
│  │ comment      │  │ config       │                       │
│  │ is_approved  │  │ is_active    │                       │
│  └──────────────┘  └──────────────┘                       │
│         ▲                                                   │
│         │                                                   │
│    ReviewsManager                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## UI Component Hierarchy

```
DashboardLayout
├── Header
│   ├── Menu Toggle (Mobile)
│   ├── Page Title
│   └── Hotel Name
│
├── Sidebar
│   ├── Hotel Logo & Name
│   ├── Navigation Menu
│   │   ├── Dashboard
│   │   ├── Website Editor
│   │   ├── Photos Manager
│   │   ├── Rooms & Pricing
│   │   ├── Bookings
│   │   ├── Payments
│   │   ├── Reviews
│   │   └── Settings
│   └── Sign Out Button
│
└── Main Content
    ├── Page Component
    │   ├── Stats Cards (if applicable)
    │   ├── Forms / Tables / Lists
    │   ├── Modals (if applicable)
    │   └── Action Buttons
    │
    └── Footer (implicit)
```

---

## Styling System

### Color Palette
```
Primary:     #2563eb (Blue)
Success:     #16a34a (Green)
Warning:     #ea580c (Orange)
Danger:      #dc2626 (Red)
Info:        #0891b2 (Cyan)
Background:  #f9fafb (Gray-50)
Border:      #e5e7eb (Gray-200)
Text:        #111827 (Gray-900)
```

### Component Styles
```
Cards:       bg-white rounded-xl shadow-sm border border-gray-200
Buttons:     px-4 py-3 rounded-lg transition
Inputs:      px-4 py-3 border border-gray-300 rounded-lg
Icons:       h-5 w-5 (standard size)
Spacing:     gap-4, mb-4, p-6 (standard)
```

---

## Error Handling

```
Try-Catch Block
    │
    ├─ Success
    │   ├─ Alert user
    │   ├─ Reload data
    │   └─ Update UI
    │
    └─ Error
        ├─ Log to console
        ├─ Alert user
        └─ Keep UI unchanged
```

---

## Performance Optimizations

1. **Lazy Loading**: Components load data on mount
2. **Conditional Rendering**: Only render visible component
3. **Memoization**: Can be added for expensive operations
4. **Debouncing**: Can be added for search/filter
5. **Pagination**: Can be added for large lists

---

## Security Features

1. **Row-Level Security (RLS)**: Database level
2. **Authentication**: Required for all operations
3. **Authorization**: Users can only access their data
4. **Input Validation**: Form validation before submit
5. **Error Messages**: No sensitive data exposed

---

## Accessibility Features

1. **Semantic HTML**: Proper heading hierarchy
2. **Form Labels**: All inputs have labels
3. **Color Contrast**: WCAG compliant
4. **Keyboard Navigation**: Tab through forms
5. **ARIA Labels**: For screen readers (can be added)

---

## Testing Scenarios

### WebsiteEditor
- [ ] Load hotel data
- [ ] Edit hotel name
- [ ] Change primary color
- [ ] Save changes
- [ ] Copy website URL

### PhotosManager
- [ ] Upload single photo
- [ ] Upload multiple photos
- [ ] Remove photo
- [ ] Save photos
- [ ] Verify featured photo

### RoomsManager
- [ ] Add room
- [ ] Edit room details
- [ ] Select amenities
- [ ] Remove room
- [ ] Save rooms

### BookingsManager
- [ ] View all bookings
- [ ] Filter by status
- [ ] View booking details
- [ ] Update status
- [ ] Close modal

### PaymentsManager
- [ ] View stats
- [ ] View transactions
- [ ] Filter by status
- [ ] Export data

### ReviewsManager
- [ ] View reviews
- [ ] Filter by status
- [ ] Approve review
- [ ] Delete review

### Settings
- [ ] Change payment method
- [ ] Set UPI ID
- [ ] Publish website
- [ ] View account info
- [ ] Sign out

---

## Deployment Checklist

- [ ] All components created
- [ ] Database tables exist
- [ ] RLS policies configured
- [ ] Environment variables set
- [ ] Supabase connection working
- [ ] All CRUD operations tested
- [ ] Error handling verified
- [ ] UI responsive on mobile
- [ ] Performance acceptable
- [ ] Security verified

---

## Future Enhancements

1. **Real-time Updates**: Supabase subscriptions
2. **Advanced Filtering**: Date ranges, amounts
3. **Bulk Operations**: Batch updates
4. **Export Features**: CSV, PDF exports
5. **Analytics**: Charts and graphs
6. **Notifications**: Email, SMS alerts
7. **Mobile App**: React Native version
8. **API**: REST API for integrations
