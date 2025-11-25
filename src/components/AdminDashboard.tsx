import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AdminLayout from './admin/AdminLayout';
import AdminOverview from './admin/AdminOverview';
import AllHotelsManager from './admin/AllHotelsManager';
import AllBookingsManager from './admin/AllBookingsManager';
import UsersManager from './admin/UsersManager';
import RevenueReports from './admin/RevenueReports';
import SystemSettings from './admin/SystemSettings';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) return;
    
    // Check if user email is admin (you can add admin table later)
    const adminEmails = ['admin@hotel.com', user.email]; // Add your admin email
    setIsAdmin(adminEmails.includes(user.email || ''));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have admin privileges</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'overview' && <AdminOverview />}
      {currentPage === 'hotels' && <AllHotelsManager />}
      {currentPage === 'bookings' && <AllBookingsManager />}
      {currentPage === 'users' && <UsersManager />}
      {currentPage === 'revenue' && <RevenueReports />}
      {currentPage === 'settings' && <SystemSettings />}
    </AdminLayout>
  );
}
