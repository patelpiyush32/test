import { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { supabase, Booking } from '../../lib/supabase';

export default function AllBookingsManager() {
  const [bookings, setBookings] = useState<Array<Booking & { hotels?: any }>>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadBookings = async () => {
    let query = supabase.from('bookings').select('*, hotels(name)').order('created_at', { ascending: false });
    
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    
    const { data } = await query;
    if (data) setBookings(data);
  };

  const exportCSV = () => {
    const csv = [
      ['Reference', 'Hotel', 'Guest', 'Check-in', 'Check-out', 'Amount', 'Status'].join(','),
      ...bookings.map(b => [
        b.booking_reference,
        (b.hotels as any)?.name || '',
        b.guest_name,
        b.check_in,
        b.check_out,
        b.total_amount,
        b.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filtered = bookings.filter(b =>
    b.booking_reference.toLowerCase().includes(search.toLowerCase()) ||
    b.guest_name.toLowerCase().includes(search.toLowerCase()) ||
    b.guest_email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reference</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hotel</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Guest</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Dates</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Payment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{booking.booking_reference}</td>
                  <td className="py-3 px-4 text-sm">{(booking.hotels as any)?.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.guest_name}</p>
                      <p className="text-xs text-gray-500">{booking.guest_email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">₹{booking.total_amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'checked_in' ? 'bg-purple-100 text-purple-700' :
                      booking.status === 'checked_out' ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
