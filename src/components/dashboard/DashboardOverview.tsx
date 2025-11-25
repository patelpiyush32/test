import { Calendar, DollarSign, Star, ExternalLink, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, Hotel, Booking } from '../../lib/supabase';
import { getHotelWebsiteUrl } from '../../lib/config';

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

  const websiteUrl = hotel ? getHotelWebsiteUrl(hotel.slug) : '';

  const statCards = [
    {
      icon: Calendar,
      value: stats.todayBookings,
      label: "Today's Bookings",
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      delay: '0s'
    },
    {
      icon: DollarSign,
      value: `₹${stats.totalEarnings.toLocaleString()}`,
      label: 'Total Earnings',
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-600',
      delay: '0.1s'
    },
    {
      icon: Star,
      value: stats.averageRating,
      label: 'Average Rating',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      delay: '0.2s'
    },
    {
      icon: Users,
      value: stats.totalGuests,
      label: 'Total Guests',
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-600',
      delay: '0.3s'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl premium-shadow-lg p-6 border border-slate-100 hover-lift animate-bounce-in"
            style={{ animationDelay: stat.delay }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-xl hover-grow`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-500 animate-pulse" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-600 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Website Card */}
      {hotel && (
        <div className="bg-slate-900 rounded-2xl premium-shadow-xl p-8 text-white hover-lift animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-3">Your Hotel Website</h3>
              <p className="text-emerald-400 mb-6 font-mono text-sm">{websiteUrl}</p>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-semibold hover-glow"
              >
                <ExternalLink className="h-5 w-5" />
                <span>View Website</span>
              </a>
            </div>
            <div className="hidden md:block">
              <div className="bg-white p-6 rounded-xl hover-grow">
                <div className="text-center text-slate-900 font-mono text-sm font-semibold">QR Code</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl premium-shadow-lg p-8 border border-slate-100 animate-slide-in-left">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Bookings</h3>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking, idx) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all hover-lift"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{booking.guest_name}</p>
                    <p className="text-sm text-slate-600 mt-1">
                      {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">₹{booking.total_amount}</p>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold mt-1 inline-block ${booking.payment_status === 'paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                      }`}>
                      {booking.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4 animate-pulse" />
              <p className="font-medium">No bookings yet</p>
            </div>
          )}
        </div>

        {/* Calendar Preview */}
        <div className="bg-white rounded-2xl premium-shadow-lg p-8 border border-slate-100 animate-slide-in-right">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Booking Calendar</h3>
          <div className="bg-slate-50 rounded-xl p-12 text-center hover-lift">
            <Calendar className="h-20 w-20 text-slate-300 mx-auto mb-4 animate-pulse" />
            <p className="text-slate-600 font-medium">Calendar view coming soon</p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 animate-scale-in hover-lift">
        <h3 className="font-bold text-slate-900 mb-4 text-lg">💡 Quick Tips</h3>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-start">
            <span className="text-emerald-600 mr-3 text-xl">•</span>
            <span>Share your website link on social media to get more bookings</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-600 mr-3 text-xl">•</span>
            <span>Add high-quality photos to increase conversion by 300%</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-600 mr-3 text-xl">•</span>
            <span>Respond to reviews promptly to build trust</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-600 mr-3 text-xl">•</span>
            <span>Keep your room prices competitive and up-to-date</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
