import { useState, useEffect } from 'react';
import { Search, Eye, Ban, CheckCircle, Trash2, ExternalLink } from 'lucide-react';
import { supabase, Hotel } from '../../lib/supabase';
import { getHotelWebsiteUrl } from '../../lib/config';

export default function AllHotelsManager() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadHotels();
  }, [filter]);

  const loadHotels = async () => {
    let query = supabase.from('hotels').select('*').order('created_at', { ascending: false });
    
    if (filter === 'active') query = query.eq('is_active', true);
    if (filter === 'inactive') query = query.eq('is_active', false);
    
    const { data } = await query;
    if (data) setHotels(data);
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('hotels').update({ is_active: !currentStatus }).eq('id', id);
    loadHotels();
  };

  const deleteHotel = async (id: string) => {
    if (confirm('Delete this hotel? This will delete all related data.')) {
      await supabase.from('hotels').delete().eq('id', id);
      loadHotels();
    }
  };

  const filtered = hotels.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hotels..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hotel</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Template</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(hotel => (
                <tr key={hotel.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{hotel.name}</p>
                      <p className="text-sm text-gray-500">{hotel.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{hotel.city}, {hotel.state}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium capitalize">
                      {hotel.template_id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${hotel.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {hotel.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(hotel.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <a
                        href={getHotelWebsiteUrl(hotel.slug)}
                        target="_blank"
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Website"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => toggleStatus(hotel.id, hotel.is_active)}
                        className={`p-1 rounded ${hotel.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        title={hotel.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {hotel.is_active ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deleteHotel(hotel.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
