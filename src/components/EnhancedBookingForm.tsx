import { useState, useEffect } from 'react';
import { X, Calendar, Users, CreditCard, Gift, Plus, Minus, Upload, Check } from 'lucide-react';
import { supabase, Room, Addon, PromoCode, Package } from '../lib/supabase';

type EnhancedBookingFormProps = {
  room: Room;
  hotelId: string;
  hotelName: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EnhancedBookingForm({ room, hotelId, hotelName, onClose, onSuccess }: EnhancedBookingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    numRooms: 1,
    numAdults: 1,
    numChildren: 0,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    earlyCheckin: false,
    lateCheckout: false,
    roomPreferences: { floor: '', bedType: '', view: '' },
    specialRequests: '',
    promoCode: '',
  });
  
  const [additionalGuests, setAdditionalGuests] = useState<Array<{name: string; age: number}>>([]);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [promoCodeData, setPromoCodeData] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  useEffect(() => {
    loadAddonsAndPackages();
  }, [hotelId]);

  const loadAddonsAndPackages = async () => {
    const [addonsRes, packagesRes] = await Promise.all([
      supabase.from('addons').select('*').eq('hotel_id', hotelId).eq('is_active', true),
      supabase.from('packages').select('*').eq('hotel_id', hotelId).eq('is_active', true)
    ]);
    
    if (addonsRes.data) setAddons(addonsRes.data);
    if (packagesRes.data) setPackages(packagesRes.data);
  };

  const validatePromoCode = async () => {
    if (!formData.promoCode) return;
    
    setPromoLoading(true);
    const { data } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('code', formData.promoCode.toUpperCase())
      .eq('is_active', true)
      .gte('valid_to', new Date().toISOString())
      .lte('valid_from', new Date().toISOString())
      .maybeSingle();
    
    if (data && (data.usage_limit === null || data.used_count < data.usage_limit)) {
      setPromoCodeData(data);
      alert('Promo code applied successfully!');
    } else {
      alert('Invalid or expired promo code');
      setPromoCodeData(null);
    }
    setPromoLoading(false);
  };

  const calculateTotal = () => {
    const nights = formData.checkIn && formData.checkOut 
      ? Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
      : 1;
    
    let total = room.price * nights * formData.numRooms;
    
    if (formData.earlyCheckin) total += 500;
    if (formData.lateCheckout) total += 500;
    
    Object.entries(selectedAddons).forEach(([addonId, qty]) => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) total += addon.price * qty;
    });
    
    if (selectedPackage) {
      const pkg = packages.find(p => p.id === selectedPackage);
      if (pkg) total += pkg.price;
    }
    
    let discount = 0;
    if (promoCodeData) {
      discount = promoCodeData.discount_type === 'percentage'
        ? (total * promoCodeData.discount_value) / 100
        : promoCodeData.discount_value;
    }
    
    return { subtotal: total, discount, total: total - discount };
  };

  const handleSubmit = async () => {
    if (!formData.guestName || !formData.guestEmail || !formData.guestPhone || !formData.checkIn || !formData.checkOut) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    
    const { subtotal, discount, total } = calculateTotal();
    const bookingRef = 'BK' + Date.now().toString().slice(-8);
    
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        booking_reference: bookingRef,
        hotel_id: hotelId,
        room_id: room.id,
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guest_phone: formData.guestPhone,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        num_guests: formData.numAdults + formData.numChildren,
        num_rooms: formData.numRooms,
        num_adults: formData.numAdults,
        num_children: formData.numChildren,
        total_amount: total,
        discount_amount: discount,
        promo_code: promoCodeData?.code || null,
        payment_status: 'pending',
        special_requests: formData.specialRequests,
        status: 'confirmed',
        early_checkin: formData.earlyCheckin,
        late_checkout: formData.lateCheckout,
        room_preferences: formData.roomPreferences,
        booking_source: 'website'
      })
      .select()
      .single();

    if (error) {
      alert('Booking failed: ' + error.message);
      setLoading(false);
      return;
    }

    if (booking && additionalGuests.length > 0) {
      await supabase.from('booking_guests').insert(
        additionalGuests.map(g => ({
          booking_id: booking.id,
          guest_type: 'additional',
          name: g.name,
          age: g.age
        }))
      );
    }

    if (booking && Object.keys(selectedAddons).length > 0) {
      await supabase.from('booking_addons').insert(
        Object.entries(selectedAddons).map(([addonId, qty]) => ({
          booking_id: booking.id,
          addon_id: addonId,
          quantity: qty,
          price: addons.find(a => a.id === addonId)?.price || 0
        }))
      );
    }

    if (booking && selectedPackage) {
      await supabase.from('booking_packages').insert({
        booking_id: booking.id,
        package_id: selectedPackage,
        quantity: 1,
        price: packages.find(p => p.id === selectedPackage)?.price || 0
      });
    }

    if (promoCodeData) {
      await supabase
        .from('promo_codes')
        .update({ used_count: promoCodeData.used_count + 1 })
        .eq('id', promoCodeData.id);
    }

    setLoading(false);
    alert(`Booking confirmed! Reference: ${bookingRef}`);
    onSuccess();
  };

  const { subtotal, discount, total } = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full my-8">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book {room.title}</h2>
            <p className="text-gray-600">{hotelName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex mb-6 border-b border-gray-200">
            {['Details', 'Guests', 'Add-ons', 'Payment'].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx + 1)}
                className={`flex-1 pb-3 text-center font-medium transition ${
                  step === idx + 1
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date *</label>
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.numRooms}
                    onChange={(e) => setFormData({...formData, numRooms: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.numAdults}
                    onChange={(e) => setFormData({...formData, numAdults: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.numChildren}
                    onChange={(e) => setFormData({...formData, numChildren: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.earlyCheckin}
                    onChange={(e) => setFormData({...formData, earlyCheckin: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm">Early Check-in (+₹500)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.lateCheckout}
                    onChange={(e) => setFormData({...formData, lateCheckout: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm">Late Check-out (+₹500)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="Any special requirements..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.guestName}
                    onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={formData.guestPhone}
                  onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Additional Guests</h3>
                  <button
                    onClick={() => setAdditionalGuests([...additionalGuests, {name: '', age: 0}])}
                    className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Guest
                  </button>
                </div>
                {additionalGuests.map((guest, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={guest.name}
                      onChange={(e) => {
                        const updated = [...additionalGuests];
                        updated[idx].name = e.target.value;
                        setAdditionalGuests(updated);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={guest.age || ''}
                      onChange={(e) => {
                        const updated = [...additionalGuests];
                        updated[idx].age = parseInt(e.target.value);
                        setAdditionalGuests(updated);
                      }}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => setAdditionalGuests(additionalGuests.filter((_, i) => i !== idx))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              {packages.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3 flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-blue-600" />
                    Special Packages
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {packages.map(pkg => (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(selectedPackage === pkg.id ? null : pkg.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                          selectedPackage === pkg.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{pkg.name}</h4>
                          <span className="text-blue-600 font-semibold">₹{pkg.price}</span>
                        </div>
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {addons.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Add-ons</h3>
                  <div className="space-y-2">
                    {addons.map(addon => (
                      <div key={addon.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{addon.name}</p>
                          <p className="text-sm text-gray-600">{addon.description}</p>
                          <p className="text-blue-600 font-semibold mt-1">₹{addon.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedAddons({...selectedAddons, [addon.id]: Math.max(0, (selectedAddons[addon.id] || 0) - 1)})}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{selectedAddons[addon.id] || 0}</span>
                          <button
                            onClick={() => setSelectedAddons({...selectedAddons, [addon.id]: (selectedAddons[addon.id] || 0) + 1})}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.promoCode}
                    onChange={(e) => setFormData({...formData, promoCode: e.target.value.toUpperCase()})}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    onClick={validatePromoCode}
                    disabled={promoLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {promoLoading ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {promoCodeData && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> Promo code applied!
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">Payment will be collected at the hotel during check-in</p>
                <p className="text-xs text-gray-600">Cancellation policy: Free cancellation up to 24 hours before check-in</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : step === 4 ? 'Confirm Booking' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
