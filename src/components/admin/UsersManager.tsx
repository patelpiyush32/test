import { useState, useEffect } from 'react';
import { Search, Mail, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function UsersManager() {
  const [users, setUsers] = useState<Array<any>>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data: hotels } = await supabase.from('hotels').select('user_id, name, created_at');
    
    const userMap = new Map();
    hotels?.forEach(h => {
      if (!userMap.has(h.user_id)) {
        userMap.set(h.user_id, {
          id: h.user_id,
          hotels: [],
          created_at: h.created_at
        });
      }
      userMap.get(h.user_id).hotels.push(h.name);
    });
    
    setUsers(Array.from(userMap.values()));
  };

  const filtered = users.filter(u =>
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-lg">U</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2 font-mono truncate">{user.id}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Joined {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500 mb-2">Hotels ({user.hotels.length})</p>
              <div className="space-y-1">
                {user.hotels.slice(0, 2).map((hotel: string, idx: number) => (
                  <p key={idx} className="text-sm text-gray-700 truncate">{hotel}</p>
                ))}
                {user.hotels.length > 2 && (
                  <p className="text-xs text-gray-500">+{user.hotels.length - 2} more</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
