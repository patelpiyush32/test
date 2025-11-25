import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Calendar, BarChart3, PieChart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type AnalyticsDashboardProps = {
  hotelId: string;
};

export default function AnalyticsDashboard({ hotelId }: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    avgBookingValue: 0,
    occupancyRate: 0,
    revenueGrowth: 0,
    bookingsGrowth: 0
  });
  const [revenueByMonth, setRevenueByMonth] = useState<Array<{month: string; revenue: number}>>([]);
  const [bookingsBySource, setBookingsBySource] = useState<Array<{source: string; count: number}>>([]);
  const [topRooms, setTopRooms] = useState<Array<{title: string; bookings: number; revenue: number}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [hotelId, period]);

  const loadAnalytics = async () => {
    const endDate = new Date();
    const startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const { data: bookings } = await supabase
      .from('bookings')
      .select('*, rooms(title)')
      .eq('hotel_id', hotelId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .neq('status', 'cancelled');

    if (bookings) {
      const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
      const totalBookings = bookings.length;
      const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

      const { data: rooms } = await supabase
        .from('rooms')
        .select('id')
        .eq('hotel_id', hotelId);

      const totalRooms = rooms?.length || 1;
      const bookedRooms = new Set(bookings.map(b => b.room_id)).size;
      const occupancyRate = (bookedRooms / totalRooms) * 100;

      const prevStartDate = new Date(startDate);
      const prevEndDate = new Date(startDate);
      if (period === 'week') {
        prevStartDate.setDate(prevStartDate.getDate() - 7);
      } else if (period === 'month') {
        prevStartDate.setMonth(prevStartDate.getMonth() - 1);
      } else {
        prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
      }

      const { data: prevBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('hotel_id', hotelId)
        .gte('created_at', prevStartDate.toISOString())
        .lte('created_at', prevEndDate.toISOString())
        .neq('status', 'cancelled');

      const prevRevenue = prevBookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
      const prevBookingsCount = prevBookings?.length || 0;
      
      const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      const bookingsGrowth = prevBookingsCount > 0 ? ((totalBookings - prevBookingsCount) / prevBookingsCount) * 100 : 0;

      setStats({
        totalRevenue,
        totalBookings,
        avgBookingValue,
        occupancyRate,
        revenueGrowth,
        bookingsGrowth
      });

      const monthlyRevenue: Record<string, number> = {};
      bookings.forEach(b => {
        const month = new Date(b.created_at).toLocaleDateString('en-US', { month: 'short' });
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (b.total_amount || 0);
      });
      setRevenueByMonth(Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue })));

      const sourceCount: Record<string, number> = {};
      bookings.forEach(b => {
        const source = b.booking_source || 'website';
        sourceCount[source] = (sourceCount[source] || 0) + 1;
      });
      setBookingsBySource(Object.entries(sourceCount).map(([source, count]) => ({ source, count })));

      const roomStats: Record<string, {bookings: number; revenue: number; title: string}> = {};
      bookings.forEach(b => {
        if (b.room_id && b.rooms) {
          if (!roomStats[b.room_id]) {
            roomStats[b.room_id] = { bookings: 0, revenue: 0, title: (b.rooms as any).title };
          }
          roomStats[b.room_id].bookings++;
          roomStats[b.room_id].revenue += b.total_amount || 0;
        }
      });
      setTopRooms(
        Object.values(roomStats)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)
      );
    }

    setLoading(false);
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
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className={`text-sm mt-2 flex items-center ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}% vs last {period}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Bookings</p>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
          <p className={`text-sm mt-2 flex items-center ${stats.bookingsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {stats.bookingsGrowth >= 0 ? '+' : ''}{stats.bookingsGrowth.toFixed(1)}% vs last {period}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Avg Booking Value</p>
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{stats.avgBookingValue.toFixed(0)}</p>
          <p className="text-sm text-gray-500 mt-2">Per booking</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Occupancy Rate</p>
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.occupancyRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-500 mt-2">Room utilization</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-bold text-gray-900">Revenue by Month</h3>
          </div>
          {revenueByMonth.length > 0 ? (
            <div className="space-y-3">
              {revenueByMonth.map(item => {
                const maxRevenue = Math.max(...revenueByMonth.map(r => r.revenue));
                const width = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={item.month}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.month}</span>
                      <span className="font-semibold">₹{item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-bold text-gray-900">Bookings by Source</h3>
          </div>
          {bookingsBySource.length > 0 ? (
            <div className="space-y-3">
              {bookingsBySource.map(item => {
                const total = bookingsBySource.reduce((sum, s) => sum + s.count, 0);
                const percentage = (item.count / total) * 100;
                return (
                  <div key={item.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">{item.source}</span>
                      <span className="font-semibold">{item.count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Top Performing Rooms</h3>
        {topRooms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Room</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Bookings</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topRooms.map((room, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">{room.title}</td>
                    <td className="py-3 px-4 text-right">{room.bookings}</td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      ₹{room.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No data available</p>
        )}
      </div>
    </div>
  );
}
