import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function RevenueReports() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [revenue, setRevenue] = useState<Array<{hotel: string; amount: number}>>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    loadRevenue();
  }, [period]);

  const loadRevenue = async () => {
    const startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
    else startDate.setFullYear(startDate.getFullYear() - 1);

    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_amount, hotel_id, hotels(name)')
      .gte('created_at', startDate.toISOString())
      .neq('status', 'cancelled');

    const hotelRevenue = new Map();
    let total = 0;
    
    bookings?.forEach(b => {
      const hotelName = (b.hotels as any)?.name || 'Unknown';
      hotelRevenue.set(hotelName, (hotelRevenue.get(hotelName) || 0) + b.total_amount);
      total += b.total_amount;
    });

    setRevenue(Array.from(hotelRevenue.entries()).map(([hotel, amount]) => ({ hotel, amount })).sort((a, b) => b.amount - a.amount));
    setTotalRevenue(total);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${period === p ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">Last {period}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Avg per Hotel</p>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ₹{revenue.length > 0 ? Math.round(totalRevenue / revenue.length).toLocaleString() : 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">{revenue.length} hotels</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Top Performer</p>
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-gray-900 truncate">{revenue[0]?.hotel || 'N/A'}</p>
          <p className="text-sm text-green-600 mt-2">₹{revenue[0]?.amount.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Revenue by Hotel</h3>
        <div className="space-y-3">
          {revenue.map((item, idx) => {
            const percentage = (item.amount / totalRevenue) * 100;
            return (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{item.hotel}</span>
                  <span className="text-gray-900 font-semibold">₹{item.amount.toLocaleString()} ({percentage.toFixed(1)}%)</span>
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
      </div>
    </div>
  );
}
