import { useState, useEffect } from 'react';
import { LogIn, LogOut, Calendar, User } from 'lucide-react';
import { supabase, Booking, Checkin } from '../../lib/supabase';

type CheckInOutManagerProps = {
  hotelId: string;
};

export default function CheckInOutManager({ hotelId }: CheckInOutManagerProps) {
  const [bookings, setBookings] = useState<Array<Booking & { checkins?: Checkin; rooms?: any }>>([]);
  const [filter, setFilter] = useState<'arriving' | 'checked_in' | 'departing'>('arriving');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [checkInData, setCheckInData] = useState({
    room_number: '',
    notes: ''
  });

  useEffect(() => {
    loadBookings();
  }, [hotelId, filter]);

  const loadBookings = async () => {
    const today = new Date().toISOString().split('T')[0];
    let query = supabase
      .from('bookings')
      .select('*, checkins(*), rooms(title)')
      .eq('hotel_id', hotelId)
      .eq('status', 'confirmed');

    if (filter === 'arriving') {
      query = query.eq('check_in', today).is('checkins.checked_in_at', null);
    } else if (filter === 'checked_in') {
      query = query.not('checkins.checked_in_at', 'is', null).is('checkins.checked_out_at', null);
    } else {
      query = query.eq('check_out', today).not('checkins.checked_in_at', 'is', null).is('checkins.checked_out_at', null);
    }

    const { data } = await query;
    if (data) setBookings(data);
  };

  const handleCheckIn = async () => {
    if (!selectedBooking) return;

    const { data: existing } = await supabase
      .from('checkins')
      .select('*')
      .eq('booking_id', selectedBooking.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('checkins')
        .update({
          checked_in_at: new Date().toISOString(),
          room_number: checkInData.room_number,
          notes: checkInData.notes
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('checkins').insert({
        booking_id: selectedBooking.id,
        checked_in_at: new Date().toISOString(),
        room_number: checkInData.room_number,
        notes: checkInData.notes
      });
    }

    setSelectedBooking(null);
    setCheckInData({ room_number: '', notes: '' });
    loadBookings();
  };

  const handleCheckOut = async (bookingId: string) => {
    const { data: checkin } = await supabase
      .from('checkins')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (checkin) {
      await supabase
        .from('checkins')
        .update({ checked_out_at: new Date().toISOString() })
        .eq('id', checkin.id);
      loadBookings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Check-In / Check-Out</h2>
      </div>

      <div className="flex gap-2">
        {(['arriving', 'checked_in', 'departing'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'arriving' ? 'Arriving Today' : f === 'checked_in' ? 'Checked In' : 'Departing Today'}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-900">{booking.guest_name}</p>
                  <p className="text-sm text-gray-600">{booking.booking_reference}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {(booking.rooms as any)?.title || 'Room'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {booking.guest_phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                </div>
                {booking.checkins && (booking.checkins as any).room_number && (
                  <div className="text-sm text-gray-600">
                    Room: {(booking.checkins as any).room_number}
                  </div>
                )}
              </div>

              {filter === 'arriving' && (
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Check In
                </button>
              )}

              {filter === 'departing' && (
                <button
                  onClick={() => handleCheckOut(booking.id)}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Check Out
                </button>
              )}

              {filter === 'checked_in' && (
                <div className="text-center">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Currently Staying
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Check-In Guest</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Guest Name</p>
                <p className="font-medium text-gray-900">{selectedBooking.guest_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Booking Reference</p>
                <p className="font-medium text-gray-900">{selectedBooking.booking_reference}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                <input
                  type="text"
                  value={checkInData.room_number}
                  onChange={(e) => setCheckInData({...checkInData, room_number: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="101"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={checkInData.notes}
                  onChange={(e) => setCheckInData({...checkInData, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  rows={3}
                  placeholder="Any special notes..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCheckIn}
                  disabled={!checkInData.room_number}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Confirm Check-In
                </button>
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    setCheckInData({ room_number: '', notes: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
