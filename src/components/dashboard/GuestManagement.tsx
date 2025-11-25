import { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Star, Calendar, DollarSign, Ban } from 'lucide-react';
import { supabase, Guest } from '../../lib/supabase';

type GuestManagementProps = {
  hotelId: string;
};

export default function GuestManagement({ hotelId }: GuestManagementProps) {
  const [guests, setGuests] = useState<Array<Guest & { bookings?: any[] }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGuests();
  }, [hotelId]);

  const loadGuests = async () => {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('guest_email, guest_name, guest_phone, total_amount, created_at, status')
      .eq('hotel_id', hotelId);

    if (bookings) {
      const guestMap = new Map();
      bookings.forEach(b => {
        const key = b.guest_email;
        if (!guestMap.has(key)) {
          guestMap.set(key, {
            id: key,
            email: b.guest_email,
            name: b.guest_name,
            phone: b.guest_phone,
            total_bookings: 0,
            total_spent: 0,
            last_booking: b.created_at,
            bookings: []
          });
        }
        const guest = guestMap.get(key);
        if (b.status !== 'cancelled') {
          guest.total_bookings++;
          guest.total_spent += b.total_amount || 0;
        }
        guest.bookings.push(b);
        if (new Date(b.created_at) > new Date(guest.last_booking)) {
          guest.last_booking = b.created_at;
        }
      });
      setGuests(Array.from(guestMap.values()).sort((a, b) => b.total_spent - a.total_spent));
    }
    setLoading(false);
  };

  const filteredGuests = guests.filter(g =>
    g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.phone?.includes(searchTerm)
  );

  const getTier = (spent: number) => {
    if (spent >= 50000) return { label: 'Platinum', color: 'purple' };
    if (spent >= 25000) return { label: 'Gold', color: 'yellow' };
    if (spent >= 10000) return { label: 'Silver', color: 'gray' };
    return { label: 'Bronze', color: 'orange' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Guest Management</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Guests</p>
          <p className="text-2xl font-bold text-gray-900">{guests.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Repeat Guests</p>
          <p className="text-2xl font-bold text-gray-900">{guests.filter(g => g.total_bookings > 1).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Avg Bookings</p>
          <p className="text-2xl font-bold text-gray-900">
            {guests.length > 0 ? (guests.reduce((sum, g) => sum + g.total_bookings, 0) / guests.length).toFixed(1) : 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{guests.reduce((sum, g) => sum + g.total_spent, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Guest</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Contact</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tier</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Bookings</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Total Spent</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Visit</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No guests found</p>
                  </td>
                </tr>
              ) : (
                filteredGuests.map(guest => {
                  const tier = getTier(guest.total_spent);
                  return (
                    <tr key={guest.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold">
                              {guest.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{guest.name}</p>
                            <p className="text-sm text-gray-500">{guest.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-1" />
                            {guest.email}
                          </div>
                          {guest.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-1" />
                              {guest.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${tier.color}-100 text-${tier.color}-700`}>
                          {tier.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {guest.total_bookings}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end font-semibold text-green-600">
                          <DollarSign className="h-4 w-4" />
                          {guest.total_spent.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(guest.last_booking).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedGuest(guest)}
                            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedGuest.name}</h3>
                <p className="text-gray-600">{selectedGuest.email}</p>
              </div>
              <button onClick={() => setSelectedGuest(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedGuest.total_bookings}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-green-600">₹{selectedGuest.total_spent.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tier</p>
                  <p className="text-2xl font-bold text-purple-600">{getTier(selectedGuest.total_spent).label}</p>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-3">Booking History</h4>
              <div className="space-y-2">
                {selectedGuest.bookings?.slice(0, 10).map((booking, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{booking.booking_reference || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₹{booking.total_amount}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
