import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-2xl premium-shadow-xl p-12 border border-slate-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Access Denied</h1>
          <p className="text-slate-600">You don't have admin privileges</p>
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
