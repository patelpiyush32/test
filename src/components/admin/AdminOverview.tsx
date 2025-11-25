import { useState, useEffect } from 'react';
import { Hotel, Users, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalHotels: 0,
    activeHotels: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    todayBookings: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [hotels, bookings] = await Promise.all([
      supabase.from('hotels').select('id, is_active'),
      supabase.from('bookings').select('total_amount, created_at, status')
    ]);

    const totalHotels = hotels.data?.length || 0;
    const activeHotels = hotels.data?.filter(h => h.is_active).length || 0;
    const totalBookings = bookings.data?.length || 0;
    const totalRevenue = bookings.data?.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.total_amount : 0), 0) || 0;
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthlyRevenue = bookings.data?.filter(b => new Date(b.created_at) >= thisMonth && b.status !== 'cancelled').reduce((sum, b) => sum + b.total_amount, 0) || 0;
    
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.data?.filter(b => b.created_at.startsWith(today)).length || 0;

    setStats({
      totalHotels,
      activeHotels,
      totalUsers: 0, // Will need proper query
      totalBookings,
      totalRevenue,
      monthlyRevenue,
      todayBookings
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Hotels</p>
            <Hotel className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalHotels}</p>
          <p className="text-sm text-green-600 mt-2">{stats.activeHotels} active</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Bookings</p>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
          <p className="text-sm text-blue-600 mt-2">{stats.todayBookings} today</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">All time</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Monthly Revenue</p>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{stats.monthlyRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">This month</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-600" />
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Active Hotels</span>
              <span className="font-semibold text-gray-900">{stats.activeHotels}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Inactive Hotels</span>
              <span className="font-semibold text-gray-900">{stats.totalHotels - stats.activeHotels}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Avg Revenue/Hotel</span>
              <span className="font-semibold text-green-600">₹{stats.totalHotels > 0 ? Math.round(stats.totalRevenue / stats.totalHotels).toLocaleString() : 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Storage</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
