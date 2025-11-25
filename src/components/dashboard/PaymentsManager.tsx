import { useState, useEffect } from 'react';
import { supabase, Booking } from '../../lib/supabase';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';

type PaymentsManagerProps = {
  hotelId: string;
};

export default function PaymentsManager({ hotelId }: PaymentsManagerProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    paidAmount: 0,
    pendingAmount: 0,
    totalBookings: 0,
    paidBookings: 0
  });

  useEffect(() => {
    loadPayments();
  }, [hotelId]);

  const loadPayments = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('created_at', { ascending: false });

    if (data) {
      setBookings(data);

      const totalEarnings = data.reduce((sum, b) => sum + b.total_amount, 0);
      const paidAmount = data
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + b.total_amount, 0);
      const pendingAmount = data
        .filter(b => b.payment_status === 'pending')
        .reduce((sum, b) => sum + b.total_amount, 0);
      const paidBookings = data.filter(b => b.payment_status === 'paid').length;

      setStats({
        totalEarnings,
        paidAmount,
        pendingAmount,
        totalBookings: data.length,
        paidBookings
      });
    }
    setLoading(false);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'refunded':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Total Earnings</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{stats.paidAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Paid Amount</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{stats.pendingAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Pending Amount</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.paidBookings}/{stats.totalBookings}</p>
          <p className="text-sm text-gray-600 mt-1">Paid Bookings</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment Transactions</h3>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Guest</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Booking Ref</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{booking.guest_name}</td>
                  <td className="py-3 px-4 text-gray-600 font-mono text-sm">{booking.booking_reference}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">₹{booking.total_amount}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                      {booking.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
