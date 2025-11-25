import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Hotel = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  description: string | null;
  amenities: string[];
  photos: string[];
  policies: Record<string, unknown>;
  upi_id: string | null;
  payment_gateway_config: Record<string, unknown>;
  template_id: string;
  theme_config: Record<string, unknown>;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Room = {
  id: string;
  hotel_id: string;
  title: string;
  description: string | null;
  price: number;
  base_price?: number;
  max_guests: number;
  amenities: string[];
  photos: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  booking_reference: string;
  hotel_id: string;
  room_id: string | null;
  guest_id?: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  num_rooms?: number;
  num_adults?: number;
  num_children?: number;
  total_amount: number;
  discount_amount?: number;
  promo_code?: string | null;
  payment_status: string;
  payment_id: string | null;
  special_requests: string | null;
  status: string;
  source?: string;
  id_proof_url?: string | null;
  early_checkin?: boolean;
  late_checkout?: boolean;
  room_preferences?: Record<string, unknown>;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  refund_amount?: number | null;
  booking_source?: string;
  created_at: string;
  updated_at: string;
};

export type Template = {
  id: string;
  name: string;
  description: string | null;
  preview_image: string | null;
  category: string;
  config: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
};

export type Review = {
  id: string;
  hotel_id: string;
  booking_id: string | null;
  guest_name: string;
  rating: number;
  cleanliness_rating?: number;
  service_rating?: number;
  location_rating?: number;
  value_rating?: number;
  comment: string | null;
  photos?: string[];
  owner_reply?: string | null;
  replied_at?: string | null;
  is_approved: boolean;
  created_at: string;
};

export type Guest = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  preferences: Record<string, unknown>;
  loyalty_points: number;
  total_bookings: number;
  created_at: string;
  updated_at: string;
};

export type PromoCode = {
  id: string;
  hotel_id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  valid_from: string;
  valid_to: string;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
};

export type Addon = {
  id: string;
  hotel_id: string;
  name: string;
  description: string | null;
  price: number;
  type: string;
  is_active: boolean;
  created_at: string;
};

export type BookingAddon = {
  id: string;
  booking_id: string;
  addon_id: string;
  quantity: number;
  price: number;
  created_at: string;
};

export type Availability = {
  id: string;
  room_id: string;
  date: string;
  is_available: boolean;
  price_override: number | null;
  min_stay: number;
  created_at: string;
};

export type Transaction = {
  id: string;
  booking_id: string;
  amount: number;
  type: 'payment' | 'refund' | 'addon';
  gateway: string | null;
  transaction_id: string | null;
  status: string;
  created_at: string;
};

export type Checkin = {
  id: string;
  booking_id: string;
  checked_in_at: string | null;
  checked_out_at: string | null;
  id_proof_url: string | null;
  room_number: string | null;
  notes: string | null;
  created_at: string;
};

export type HousekeepingTask = {
  id: string;
  hotel_id: string;
  room_id: string | null;
  task_type: 'cleaning' | 'maintenance' | 'inspection';
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'normal' | 'high';
  assigned_to: string | null;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
};

export type BookingGuest = {
  id: string;
  booking_id: string;
  guest_type: 'primary' | 'additional';
  name: string;
  email?: string | null;
  phone?: string | null;
  id_proof_type?: string | null;
  id_proof_number?: string | null;
  id_proof_url?: string | null;
  age?: number | null;
  created_at: string;
};

export type PaymentMethod = {
  id: string;
  hotel_id: string;
  method_type: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash' | 'bank_transfer';
  is_active: boolean;
  config: Record<string, unknown>;
  created_at: string;
};

export type Package = {
  id: string;
  hotel_id: string;
  name: string;
  description: string | null;
  package_type: 'honeymoon' | 'family' | 'business' | 'weekend' | 'custom';
  included_items: string[];
  price: number;
  validity_days: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type BookingPackage = {
  id: string;
  booking_id: string;
  package_id: string;
  quantity: number;
  price: number;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  hotel_id: string;
  type: 'booking' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
};

export type RoomPricingRule = {
  id: string;
  room_id: string;
  rule_type: 'weekend' | 'seasonal' | 'length_of_stay' | 'last_minute';
  condition: Record<string, unknown>;
  price_modifier: number;
  modifier_type: 'percentage' | 'fixed';
  priority: number;
  is_active: boolean;
  created_at: string;
};

export type AnalyticsEvent = {
  id: string;
  hotel_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  session_id: string | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
};
