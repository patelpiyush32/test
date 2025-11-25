import { Plus, X, Bed, Users, IndianRupee } from 'lucide-react';

type Room = {
  title: string;
  description: string;
  price: string;
  maxGuests: string;
  amenities: string[];
};

type Step3Props = {
  data: {
    rooms: Room[];
  };
  onChange: (data: Partial<Step3Props['data']>) => void;
};

const commonAmenities = [
  'AC', 'WiFi', 'TV', 'Attached Bathroom', 'Hot Water',
  'Mini Fridge', 'Balcony', 'Room Service', 'Wardrobe'
];

export default function Step3Rooms({ data, onChange }: Step3Props) {
  const addRoom = () => {
    const newRooms = [
      ...data.rooms,
      {
        title: '',
        description: '',
        price: '',
        maxGuests: '2',
        amenities: []
      }
    ];
    onChange({ rooms: newRooms });
  };

  const removeRoom = (index: number) => {
    const newRooms = data.rooms.filter((_, i) => i !== index);
    onChange({ rooms: newRooms });
  };

  const updateRoom = (index: number, field: keyof Room, value: string | string[]) => {
    const newRooms = [...data.rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    onChange({ rooms: newRooms });
  };

  const toggleAmenity = (roomIndex: number, amenity: string) => {
    const room = data.rooms[roomIndex];
    const amenities = room.amenities.includes(amenity)
      ? room.amenities.filter(a => a !== amenity)
      : [...room.amenities, amenity];
    updateRoom(roomIndex, 'amenities', amenities);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rooms & Pricing</h2>
        <p className="text-gray-600">Add your room types and set pricing</p>
      </div>

      {data.rooms.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Bed className="h-16 w-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No rooms added yet</p>
          <button
            onClick={addRoom}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Room
          </button>
        </div>
      )}

      <div className="space-y-6">
        {data.rooms.map((room, idx) => (
          <div key={idx} className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Room {idx + 1}
              </h3>
              {data.rooms.length > 1 && (
                <button
                  onClick={() => removeRoom(idx)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={room.title}
                      onChange={(e) => updateRoom(idx, 'title', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="e.g., Deluxe Room"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price/Night *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={room.price}
                        onChange={(e) => updateRoom(idx, 'price', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                        placeholder="2000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Guests *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={room.maxGuests}
                        onChange={(e) => updateRoom(idx, 'maxGuests', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                        placeholder="2"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={room.description}
                  onChange={(e) => updateRoom(idx, 'description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="Describe the room features..."
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(idx, amenity)}
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
            </div>
          </div>
        ))}
      </div>

      {data.rooms.length > 0 && (
        <button
          onClick={addRoom}
          className="w-full border-2 border-dashed border-gray-300 text-gray-600 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Another Room Type
        </button>
      )}
    </div>
  );
}
