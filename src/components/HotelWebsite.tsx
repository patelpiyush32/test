import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Wifi, Coffee, Car, Star, Calendar, Users } from 'lucide-react';
import { supabase, Hotel, Room } from '../lib/supabase';

type HotelWebsiteProps = {
  hotelSlug: string;
};

export default function HotelWebsite({ hotelSlug }: HotelWebsiteProps) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    loadHotelData();
  }, [hotelSlug]);

  const loadHotelData = async () => {
    const { data: hotelData } = await supabase
      .from('hotels')
      .select('*')
      .eq('slug', hotelSlug)
      .eq('is_published', true)
      .maybeSingle();

    if (hotelData) {
      setHotel(hotelData);

      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*')
        .eq('hotel_id', hotelData.id)
        .eq('is_available', true);

      if (roomsData) {
        setRooms(roomsData);
      }
    }
    setLoading(false);
  };

  const amenityIcons: Record<string, typeof Wifi> = {
    'WiFi': Wifi,
    'Breakfast': Coffee,
    'Parking': Car
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Hotel not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">{hotel.name}</h1>
            <button
              onClick={() => setShowBooking(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </nav>

      {hotel.photos.length > 0 && (
        <div className="relative h-96 md:h-[500px] bg-gray-200">
          <img
            src={hotel.photos[0]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">{hotel.name}</h2>
              {hotel.city && (
                <p className="text-xl md:text-2xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 mr-2" />
                  {hotel.city}, {hotel.state}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-600 text-white rounded-xl shadow-lg p-6 -mt-20 relative z-10 mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center md:justify-start">
              <Phone className="h-6 w-6 mr-3" />
              <div>
                <p className="text-sm text-blue-100">Call Us</p>
                <p className="font-semibold">{hotel.phone}</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Mail className="h-6 w-6 mr-3" />
              <div>
                <p className="text-sm text-blue-100">Email</p>
                <p className="font-semibold">{hotel.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <MapPin className="h-6 w-6 mr-3" />
              <div>
                <p className="text-sm text-blue-100">Address</p>
                <p className="font-semibold">{hotel.city}</p>
              </div>
            </div>
          </div>
        </div>

        {hotel.description && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{hotel.description}</p>
          </section>
        )}

        {hotel.amenities && hotel.amenities.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotel.amenities.map((amenity, idx) => {
                const Icon = amenityIcons[amenity] || Star;
                return (
                  <div key={idx} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <span className="text-gray-900">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Rooms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition">
                {room.photos.length > 0 && (
                  <img
                    src={room.photos[0]}
                    alt={room.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.title}</h3>
                  {room.description && (
                    <p className="text-gray-600 mb-4">{room.description}</p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-2" />
                      <span>Max {room.max_guests} guests</span>
                    </div>
                  </div>
                  {room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{room.price}</span>
                      <span className="text-gray-600"> / night</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowBooking(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {hotel.address && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Location</h2>
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MapPin className="h-16 w-16 mx-auto mb-3 text-gray-400" />
                <p className="font-semibold">{hotel.address}</p>
                <p>{hotel.city}, {hotel.state}</p>
              </div>
            </div>
          </section>
        )}
      </section>

      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Book Your Stay</h3>
                {selectedRoom && (
                  <p className="text-gray-600 mt-1">{selectedRoom.title}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowBooking(false);
                  setSelectedRoom(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none">
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="Any special requirements..."
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{selectedRoom ? selectedRoom.price : rooms[0]?.price || 0}
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">{hotel.name}</h3>
              <p className="text-sm">{hotel.address}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-sm mb-2">Phone: {hotel.phone}</p>
              <p className="text-sm mb-2">Email: {hotel.email}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#rooms" className="hover:text-white">Rooms</a></li>
                <li><a href="#amenities" className="hover:text-white">Amenities</a></li>
                <li><a href="#location" className="hover:text-white">Location</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 {hotel.name}. All rights reserved. Powered by HotelAutoSite</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
