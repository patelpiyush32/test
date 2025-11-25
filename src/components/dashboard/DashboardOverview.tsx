import { Calendar, DollarSign, Star, ExternalLink, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, Hotel, Booking } from '../../lib/supabase';

type DashboardOverviewProps = {
  hotelId: string;
};

export default function DashboardOverview({ hotelId }: DashboardOverviewProps) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    todayBookings: 0,
    totalEarnings: 0,
    averageRating: 4.5,
    totalGuests: 0
  });

  useEffect(() => {
    loadData();
  }, [hotelId]);

  const loadData = async () => {
    const { data: hotelData } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', hotelId)
      .single();

    if (hotelData) {
      setHotel(hotelData);
    }

    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (bookingsData) {
      setBookings(bookingsData);

      const today = new Date().toISOString().split('T')[0];
      const todayCount = bookingsData.filter(b => b.check_in === today).length;
      const totalEarnings = bookingsData.reduce((sum, b) => sum + b.total_amount, 0);

      setStats({
        todayBookings: todayCount,
        totalEarnings,
        averageRating: 4.5,
        totalGuests: bookingsData.length
      });
    }
  };

  const websiteUrl = hotel ? `http://localhost:5173/hotel/${hotel.slug}` : '';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.todayBookings}</p>
          <p className="text-sm text-gray-600 mt-1">Today's Bookings</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Total Earnings</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
          <p className="text-sm text-gray-600 mt-1">Average Rating</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalGuests}</p>
          <p className="text-sm text-gray-600 mt-1">Total Guests</p>
        </div>
      </div>

      {hotel && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Hotel Website</h3>
              <p className="text-blue-100 mb-4 font-mono">{websiteUrl}</p>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View Website</span>
              </a>
            </div>
            <div className="hidden md:block">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-center text-gray-900 font-mono text-xs">QR Code</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{booking.guest_name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{booking.total_amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.payment_status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>No bookings yet</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Calendar</h3>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Calendar view coming soon</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Quick Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Share your website link on social media to get more bookings</li>
          <li>• Add high-quality photos to increase conversion by 300%</li>
          <li>• Respond to reviews promptly to build trust</li>
          <li>• Keep your room prices competitive and up-to-date</li>
        </ul>
      </div>
    </div>
  );
}
