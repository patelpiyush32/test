import { useState, useEffect } from 'react';
import { supabase, Room } from '../../lib/supabase';
import { Plus, X, Save, Bed, Users, IndianRupee } from 'lucide-react';

type RoomsManagerProps = {
  hotelId: string;
};

const commonAmenities = [
  'AC', 'WiFi', 'TV', 'Attached Bathroom', 'Hot Water',
  'Mini Fridge', 'Balcony', 'Room Service', 'Wardrobe'
];

export default function RoomsManager({ hotelId }: RoomsManagerProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, [hotelId]);

  const loadRooms = async () => {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('hotel_id', hotelId);

    if (data) {
      setRooms(data);
    }
    setLoading(false);
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: 'new-' + Date.now(),
      hotel_id: hotelId,
      title: '',
      description: '',
      price: 0,
      max_guests: 2,
      amenities: [],
      photos: [],
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setRooms([...rooms, newRoom]);
    setEditingId(newRoom.id);
  };

  const updateRoom = (id: string, field: keyof Room, value: any) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const toggleAmenity = (roomId: string, amenity: string) => {
    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        const amenities = r.amenities.includes(amenity)
          ? r.amenities.filter(a => a !== amenity)
          : [...r.amenities, amenity];
        return { ...r, amenities };
      }
      return r;
    }));
  };

  const removeRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const room of rooms) {
        if (room.id.startsWith('new-')) {
          const { error } = await supabase
            .from('rooms')
            .insert([{
              hotel_id: hotelId,
              title: room.title,
              description: room.description,
              price: room.price,
              max_guests: room.max_guests,
              amenities: room.amenities,
              photos: room.photos,
              is_available: room.is_available
            }]);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('rooms')
            .update({
              title: room.title,
              description: room.description,
              price: room.price,
              max_guests: room.max_guests,
              amenities: room.amenities,
              is_available: room.is_available,
              updated_at: new Date().toISOString()
            })
            .eq('id', room.id);
          if (error) throw error;
        }
      }
      alert('Rooms updated successfully!');
      setEditingId(null);
      loadRooms();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save rooms');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Rooms ({rooms.length})</h3>
        <button
          onClick={addRoom}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Room
        </button>
      </div>

      <div className="space-y-4">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-semibold text-gray-900">{room.title || 'New Room'}</h4>
              {rooms.length > 1 && (
                <button
                  onClick={() => removeRoom(room.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={room.title}
                      onChange={(e) => updateRoom(room.id, 'title', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="e.g., Deluxe Room"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price/Night</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={room.price}
                        onChange={(e) => updateRoom(room.id, 'price', parseFloat(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={room.max_guests}
                        onChange={(e) => updateRoom(room.id, 'max_guests', parseInt(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={room.description}
                  onChange={(e) => updateRoom(room.id, 'description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  rows={2}
                  placeholder="Describe the room..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {commonAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(room.id, amenity)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        room.amenities.includes(amenity)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={room.is_available}
                  onChange={(e) => updateRoom(room.id, 'is_available', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Available for booking</label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 font-semibold"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save Rooms'}
        </button>
      </div>
    </div>
  );
}
