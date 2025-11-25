import { useState } from 'react';
import { supabase, Booking } from '../lib/supabase';
import { Calendar, Mail, Phone, DollarSign, X, Hotel } from 'lucide-react';

export default function GuestBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('guest_email', email)
        .order('created_at', { ascending: false });

      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;
      alert('Booking cancelled successfully');
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-slate-900 text-white';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-6 animate-scale-in">
            <Hotel className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-3 tracking-tight">My Bookings</h1>
          <p className="text-xl text-slate-600">View and manage your hotel reservations</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl premium-shadow-xl p-8 mb-10 border border-slate-100 hover-lift">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">Email Address</label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition text-slate-900 placeholder-slate-400 hover:border-slate-300"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 font-bold premium-shadow whitespace-nowrap hover:scale-105"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* No Results */}
        {searched && bookings.length === 0 && !loading && (
          <div className="bg-white rounded-2xl premium-shadow-xl p-16 text-center border border-slate-100 animate-scale-in">
            <Calendar className="h-20 w-20 text-slate-300 mx-auto mb-6" />
            <p className="text-slate-600 text-lg font-medium">No bookings found for this email</p>
          </div>
        )}

        {/* Bookings List */}
        {bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="bg-white rounded-2xl premium-shadow-lg p-8 border-l-4 border-slate-900 hover-lift transition cursor-pointer animate-slide-up"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{booking.booking_reference}</h3>
                    <p className="text-slate-600 font-medium">{booking.guest_name}</p>
                  </div>
                  <span className={`text-xs px-4 py-2 rounded-lg font-bold ${getStatusColor(booking.status)}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-6 text-sm">
                  <div className="flex items-center text-slate-600">
                    <Calendar className="h-5 w-5 mr-2 text-slate-400" />
                    <span className="font-medium">{new Date(booking.check_in).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Calendar className="h-5 w-5 mr-2 text-slate-400" />
                    <span className="font-medium">{new Date(booking.check_out).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <DollarSign className="h-5 w-5 mr-2 text-slate-400" />
                    <span className="font-bold">₹{booking.total_amount}</span>
                  </div>
                  <div className="text-right text-slate-600 font-medium">
                    {Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24))} nights
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
            <div className="bg-white rounded-2xl premium-shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-10 border border-slate-100 animate-scale-in">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-slate-400 hover:text-slate-900 transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Booking Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-2 font-semibold">Booking Reference</p>
                    <p className="font-bold text-slate-900 text-lg">{selectedBooking.booking_reference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2 font-semibold">Status</p>
                    <span className={`text-sm px-4 py-2 rounded-lg font-bold inline-block ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="border-t border-slate-100 pt-8">
                  <h4 className="font-bold text-slate-900 mb-6 text-lg">Guest Information</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500 mb-2 font-semibold">Name</p>
                      <p className="font-bold text-slate-900">{selectedBooking.guest_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-2 font-semibold">Email</p>
                      <p className="font-bold text-slate-900 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        {selectedBooking.guest_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-2 font-semibold">Phone</p>
                      <p className="font-bold text-slate-900 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        {selectedBooking.guest_phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-2 font-semibold">Guests</p>
                      <p className="font-bold text-slate-900">{selectedBooking.num_guests}</p>
                    </div>
                  </div>
                </div>

                {/* Stay Details */}
                <div className="border-t border-slate-100 pt-8">
                  <h4 className="font-bold text-slate-900 mb-6 text-lg">Stay Details</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500 mb-2 font-semibold">Check-in</p>
                      <p className="font-bold text-slate-900">{new Date(selectedBooking.check_in).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-2 font-semibold">Check-out</p>
                      <p className="font-bold text-slate-900">{new Date(selectedBooking.check_out).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-2 font-semibold">Total Amount</p>
                      <p className="font-bold text-slate-900 text-xl">₹{selectedBooking.total_amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-2 font-semibold">Payment Status</p>
                      <p className="font-bold text-slate-900">{selectedBooking.payment_status}</p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedBooking.special_requests && (
                  <div className="border-t border-slate-100 pt-8">
                    <p className="text-sm text-slate-500 mb-3 font-semibold">Special Requests</p>
                    <p className="text-slate-900 leading-relaxed">{selectedBooking.special_requests}</p>
                  </div>
                )}

                {/* Cancel Button */}
                {selectedBooking.status !== 'cancelled' && (
                  <div className="border-t border-slate-100 pt-8">
                    <button
                      onClick={() => handleCancel(selectedBooking.id)}
                      className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold premium-shadow hover:scale-105"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
