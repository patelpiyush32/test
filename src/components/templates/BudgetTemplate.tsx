import { MapPin, Phone, Mail, Users, Wifi, DollarSign } from 'lucide-react';
import { Hotel, Room } from '../../lib/supabase';

type BudgetTemplateProps = {
  hotel: Hotel;
  rooms: Room[];
  onBooking: (room: Room) => void;
};

export default function BudgetTemplate({ hotel, rooms, onBooking }: BudgetTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="fixed top-0 w-full bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-green-600">{hotel.name}</h1>
            <button
              onClick={() => onBooking(rooms[0])}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-bold"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {hotel.photos && hotel.photos[0] && (
          <div className="relative h-80 md:h-96">
            <img src={hotel.photos[0]} alt={hotel.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/40 to-transparent flex items-center">
              <div className="text-white pl-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-2">{hotel.name}</h2>
                <p className="text-lg">Budget-Friendly Stays</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12 bg-green-50 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">CALL</p>
              <p className="font-bold text-gray-900">{hotel.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">EMAIL</p>
              <p className="font-bold text-gray-900">{hotel.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">LOCATION</p>
              <p className="font-bold text-gray-900">{hotel.city}</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome!</h2>
          <p className="text-gray-700 leading-relaxed">
            {hotel.description || 'Affordable, clean, and comfortable accommodation for travelers on a budget. Perfect for backpackers and budget-conscious guests.'}
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Rooms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white border-2 border-green-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                {room.photos && room.photos[0] && (
                  <img src={room.photos[0]} alt={room.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{room.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Users className="h-4 w-4" />
                    <span>Up to {room.max_guests} guests</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">₹{room.price}</span>
                    </div>
                    <button
                      onClick={() => onBooking(room)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-bold text-sm"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Wifi className="h-6 w-6 text-green-600" />
            <h3 className="font-bold text-gray-900">Free WiFi Available</h3>
          </div>
          <p className="text-gray-700">Stay connected with complimentary high-speed internet throughout the property</p>
        </div>
      </div>

      <footer className="bg-green-600 text-white py-8 text-center">
        <p>&copy; 2024 {hotel.name}. Powered by HotelAutoSite</p>
      </footer>
    </div>
  );
}
