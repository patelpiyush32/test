import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Hotel } from '../lib/supabase';
import DashboardLayout from './dashboard/DashboardLayout';
import DashboardOverview from './dashboard/DashboardOverview';
import AnalyticsDashboard from './dashboard/AnalyticsDashboard';
import WebsiteEditor from './dashboard/WebsiteEditor';
import RoomsManager from './dashboard/RoomsManager';
import HotelBookingsManager from './dashboard/HotelBookingsManager';
import CheckInOutManager from './dashboard/CheckInOutManager';
import GuestManagement from './dashboard/GuestManagement';
import HousekeepingManager from './dashboard/HousekeepingManager';
import PackagesManager from './dashboard/PackagesManager';
import AddonsManager from './dashboard/AddonsManager';
import PromoCodesManager from './dashboard/PromoCodesManager';
import PaymentsManager from './dashboard/PaymentsManager';
import ReviewsManager from './dashboard/ReviewsManager';
import NotificationsPanel from './dashboard/NotificationsPanel';
import Settings from './dashboard/Settings';

export default function HotelDashboard() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('overview');
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHotel();
    }
  }, [user]);

  const loadHotel = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('hotels')
      .select('*')
      .eq('user_id', user.id)
      .limit(1);

    if (data && data.length > 0) {
      setHotel(data[0]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-2xl premium-shadow-xl p-12 border border-slate-100 max-w-md">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🏨</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">No Hotel Found</h2>
          <p className="text-slate-600">Please complete onboarding to create your hotel.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      hotelName={hotel.name}
    >
      {currentPage === 'overview' && <DashboardOverview hotelId={hotel.id} />}
      {currentPage === 'analytics' && <AnalyticsDashboard hotelId={hotel.id} />}
      {currentPage === 'bookings' && <HotelBookingsManager hotelId={hotel.id} />}
      {currentPage === 'checkinout' && <CheckInOutManager hotelId={hotel.id} />}
      {currentPage === 'guests' && <GuestManagement hotelId={hotel.id} />}
      {currentPage === 'rooms' && <RoomsManager hotelId={hotel.id} />}
      {currentPage === 'housekeeping' && <HousekeepingManager hotelId={hotel.id} />}
      {currentPage === 'packages' && <PackagesManager hotelId={hotel.id} />}
      {currentPage === 'addons' && <AddonsManager hotelId={hotel.id} />}
      {currentPage === 'promo-codes' && <PromoCodesManager hotelId={hotel.id} />}
      {currentPage === 'website' && <WebsiteEditor hotelId={hotel.id} />}
      {currentPage === 'payments' && <PaymentsManager hotelId={hotel.id} />}
      {currentPage === 'reviews' && <ReviewsManager hotelId={hotel.id} />}
      {currentPage === 'notifications' && <NotificationsPanel />}
      {currentPage === 'settings' && <Settings hotelId={hotel.id} />}
    </DashboardLayout>
  );
}
