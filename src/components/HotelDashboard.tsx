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
      .maybeSingle();

    if (data) {
      setHotel(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No hotel found. Please complete onboarding.</p>
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
