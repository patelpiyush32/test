import { MapPin, Phone, Mail, Star, Wifi, Coffee, Utensils, Dumbbell } from 'lucide-react';

type ModernTemplateProps = {
  hotel: {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    description: string;
    amenities: string[];
  };
  rooms: Array<{ id: string; title: string; price: number; max_guests: number; amenities: string[] }>;
  onBookRoom: (roomId: string) => void;
};

export default function ModernTemplate({ hotel, rooms, onBookRoom }: ModernTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">{hotel.name}</h1>
            <button
              onClick={() => onBookRoom(rooms?.[0]?.id || '')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-16 bg-gradient-to-r from-blue-500 to-blue-600 h-96 md:h-[500px] flex items-end">
        <div className="w-full p-8 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">{hotel.name}</h2>
          <p className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {hotel.city}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Call Us</p>
                <p className="font-semibold text-gray-900">{hotel.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{hotel.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">{hotel.city}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {hotel.description || 'Welcome to our hotel. We offer exceptional service and comfortable accommodations for all our guests.'}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Amenities</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {hotel.amenities && hotel.amenities.length > 0 ? (
              hotel.amenities.slice(0, 4).map((amenity, idx) => (
                <div key={idx} className="text-center">
                  <Wifi className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">{amenity}</h3>
                </div>
              ))
            ) : (
              <>
                <div className="text-center">
                  <Wifi className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">WiFi</h3>
                </div>
                <div className="text-center">
                  <Coffee className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">Breakfast</h3>
                </div>
                <div className="text-center">
                  <Dumbbell className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">Fitness</h3>
                </div>
                <div className="text-center">
                  <Utensils className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">Restaurant</h3>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Rooms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms && rooms.length > 0 ? (
              rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-4xl">🛏️</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">Capacity: {room.max_guests} guests</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">₹{room.price}</span>
                        <span className="text-gray-600"> / night</span>
                      </div>
                      <button
                        onClick={() => onBookRoom(room.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No rooms available
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 {hotel.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
