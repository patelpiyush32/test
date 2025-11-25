import { ReactNode } from 'react';
import {
  LayoutDashboard,
  Globe,
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
  ShoppingBag,
  Users as UsersIcon,
  ClipboardCheck,
  DoorOpen
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type DashboardLayoutProps = {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  hotelName?: string;
};

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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static premium-shadow-lg`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Hotel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 truncate text-sm">{hotelName}</h2>
              <p className="text-xs text-slate-500 font-medium">Hotel Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-900"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition font-medium ${isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-slate-200 bg-white flex-shrink-0">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-5 premium-shadow">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-700 hover:text-slate-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 font-medium hidden md:block">{hotelName}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
