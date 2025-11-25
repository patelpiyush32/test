import { MapPin, Phone, Mail, Star, Heart } from 'lucide-react';
import { Hotel, Room } from '../../lib/supabase';

type BoutiqueTemplateProps = {
  hotel: Hotel;
  rooms: Room[];
  onBooking: (room: Room) => void;
};

export default function BoutiqueTemplate({ hotel, rooms, onBooking }: BoutiqueTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur z-40 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-serif text-amber-900">{hotel.name}</h1>
            <button
              onClick={() => onBooking(rooms[0])}
              className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition"
            >
              Reserve
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {hotel.photos && hotel.photos[0] && (
          <div className="relative h-96 md:h-[500px]">
            <img src={hotel.photos[0]} alt={hotel.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-5xl font-serif mb-2">{hotel.name}</h2>
                <p className="text-lg">Intimate Luxury Experience</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <Phone className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Call</p>
            <p className="font-semibold text-gray-900">{hotel.phone}</p>
          </div>
          <div className="text-center">
            <Mail className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold text-gray-900">{hotel.email}</p>
          </div>
          <div className="text-center">
            <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-semibold text-gray-900">{hotel.city}</p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-serif text-amber-900 mb-6 text-center">Our Story</h2>
          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            {hotel.description || 'A carefully curated boutique hotel experience designed for discerning travelers seeking authentic luxury and personalized service.'}
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-serif text-amber-900 mb-12 text-center">Exclusive Suites</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {rooms.map((room) => (
              <div key={room.id} className="border-l-4 border-amber-600 pl-6">
                {room.photos && room.photos[0] && (
                  <img src={room.photos[0]} alt={room.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
                <h3 className="text-2xl font-serif text-amber-900 mb-2">{room.title}</h3>
                <p className="text-gray-600 mb-4">{room.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-serif text-amber-600">₹{room.price}</span>
                  <button
                    onClick={() => onBooking(room)}
                    className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-amber-900 text-amber-50 py-12 text-center">
        <p>&copy; 2024 {hotel.name}. Powered by HotelAutoSite</p>
      </footer>
    </div>
  );
}
