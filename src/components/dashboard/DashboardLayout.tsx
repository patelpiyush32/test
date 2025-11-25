import { ReactNode } from 'react';
import {
  LayoutDashboard,
  Globe,
  Image,
  Bed,
  Calendar,
  CreditCard,
  Star,
  Settings,
  LogOut,
  Hotel,
  Menu,
  X,
  Bell,
  BarChart3,
  Tag,
  Gift,
  ShoppingBag
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type DashboardLayoutProps = {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  hotelName?: string;
};

import { Users as UsersIcon, ClipboardCheck, DoorOpen } from 'lucide-react';

const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'checkinout', label: 'Check-In/Out', icon: DoorOpen },
  { id: 'guests', label: 'Guests', icon: UsersIcon },
  { id: 'rooms', label: 'Rooms', icon: Bed },
  { id: 'housekeeping', label: 'Housekeeping', icon: ClipboardCheck },
  { id: 'packages', label: 'Packages', icon: Gift },
  { id: 'addons', label: 'Add-ons', icon: ShoppingBag },
  { id: 'promo-codes', label: 'Promo Codes', icon: Tag },
  { id: 'website', label: 'Website', icon: Globe },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function DashboardLayout({
  children,
  currentPage,
  onNavigate,
  hotelName = 'My Hotel'
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Hotel className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="font-bold text-gray-900 truncate">{hotelName}</h2>
              <p className="text-xs text-gray-500">Hotel Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-700 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:block">{hotelName}</span>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
