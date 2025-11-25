# Implementation Guide - Next Features

## 1. Email Notifications (Recommended First)

### Option A: Using Supabase Edge Functions (Easiest)

**Step 1**: Create a Supabase Edge Function
```bash
supabase functions new send-booking-email
```

**Step 2**: Add to `supabase/functions/send-booking-email/index.ts`:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { guest_name, guest_email, hotel_name, check_in, check_out, total_amount } = await req.json()

  // Send email using your email service
  // Example with SendGrid
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("SENDGRID_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: guest_email }] }],
      from: { email: "noreply@hotelsite.com" },
      subject: `Booking Confirmation - ${hotel_name}`,
      content: [{
        type: "text/html",
        value: `<h1>Booking Confirmed!</h1><p>Hi ${guest_name},<br>Your booking at ${hotel_name} from ${check_in} to ${check_out} is confirmed. Total: ₹${total_amount}</p>`
      }]
    })
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
```

**Step 3**: Deploy
```bash
supabase functions deploy send-booking-email
```

**Step 4**: Call from React after booking:
```typescript
const { data } = await supabase.functions.invoke('send-booking-email', {
  body: {
    guest_name: bookingData.name,
    guest_email: bookingData.email,
    hotel_name: hotel.name,
    check_in: bookingData.checkIn,
    check_out: bookingData.checkOut,
    total_amount: totalAmount
  }
})
```

---

## 2. Payment Gateway (Razorpay)

### Step 1: Install Razorpay
```bash
npm install razorpay
```

### Step 2: Create Payment Component
```typescript
const handlePayment = async () => {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount: totalAmount })
  })
  
  const { order_id } = await response.json()
  
  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: totalAmount * 100,
    currency: "INR",
    order_id: order_id,
    handler: async (response) => {
      // Verify payment and create booking
    }
  }
  
  const razorpay = new window.Razorpay(options)
  razorpay.open()
}
```

---

## 3. Guest Booking History

### Create New Page: `GuestBookings.tsx`
```typescript
// Show bookings by email
// Allow cancellation
// Show booking status
```

---

## 4. Hotel Owner Booking Management

### Add to Dashboard:
- Booking list with filters
- Accept/Reject buttons
- Guest communication
- Check-in/Check-out tracking

---

## 5. Reviews System

### Database Table:
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  hotel_id UUID REFERENCES hotels,
  booking_id UUID REFERENCES bookings,
  guest_name TEXT,
  rating INTEGER (1-5),
  comment TEXT,
  is_approved BOOLEAN,
  created_at TIMESTAMP
)
```

### Components:
- Review submission form
- Review display on public site
- Admin approval panel

---

## 🎯 Recommended Implementation Order

1. **Email Notifications** (1-2 hours)
2. **Guest Booking History** (2-3 hours)
3. **Payment Gateway** (3-4 hours)
4. **Booking Management** (4-5 hours)
5. **Reviews System** (3-4 hours)

---

## 📋 Checklist for Each Feature

### Email Notifications
- [ ] Set up SendGrid/Mailgun account
- [ ] Create email templates
- [ ] Set up Edge Function
- [ ] Test with real email
- [ ] Add to booking flow

### Payment Gateway
- [ ] Create Razorpay account
- [ ] Get API keys
- [ ] Create order endpoint
- [ ] Implement payment UI
- [ ] Add verification webhook

### Guest Bookings
- [ ] Create new page
- [ ] Add search by email
- [ ] Show booking details
- [ ] Add cancellation logic
- [ ] Update booking status

### Reviews
- [ ] Create review form
- [ ] Add to public site
- [ ] Create admin panel
- [ ] Add approval workflow
- [ ] Display on hotel page

---

## 🚀 Quick Start

**Start with Email Notifications** - it's the easiest and most impactful!

Would you like me to implement any of these?
