import { ReactNode } from 'react';
import { LayoutDashboard, Hotel, Calendar, Users, DollarSign, Settings, LogOut, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type AdminLayoutProps = {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
};

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'hotels', label: 'All Hotels', icon: Hotel },
  { id: 'bookings', label: 'All Bookings', icon: Calendar },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'revenue', label: 'Revenue Reports', icon: DollarSign },
  { id: 'settings', label: 'System Settings', icon: Settings }
];

export default function AdminLayout({ children, currentPage, onNavigate }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-900 to-purple-800 transform transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="p-6 border-b border-purple-700 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-yellow-400" />
            <div>
              <h2 className="font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-purple-300">System Management</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-purple-700 text-white' : 'text-purple-200 hover:bg-purple-700/50'}`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-purple-700 bg-purple-900 flex-shrink-0">
          <button onClick={() => signOut()} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/30 transition">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {menuItems.find(item => item.id === currentPage)?.label || 'Admin Dashboard'}
          </h1>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
