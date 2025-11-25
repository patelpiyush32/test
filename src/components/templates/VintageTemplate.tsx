import React, { useState } from 'react';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';

type VintageTemplateProps = {
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

export default function VintageTemplate({ hotel, rooms, onBookRoom }: VintageTemplateProps) {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-900 text-amber-50 py-12 border-b-4 border-amber-700">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-serif text-center mb-2">{hotel.name}</h1>
          <p className="text-center text-amber-200 font-serif italic">Est. 2024</p>
        </div>
      </header>

      <div className="bg-amber-100 border-b-2 border-amber-300 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 text-sm text-amber-900">
          <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {hotel.address}</span>
          <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {hotel.phone}</span>
          <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {hotel.email}</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-12 text-center">
          <p className="text-lg text-amber-900 leading-relaxed font-serif italic max-w-3xl mx-auto">
            {hotel.description || 'Experience timeless elegance'}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-serif text-amber-900 text-center mb-8 border-b-2 border-amber-300 pb-4">
            Our Amenities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotel.amenities && hotel.amenities.length > 0 ? (
              hotel.amenities.map((amenity, idx) => (
                <div key={idx} className="bg-white border-2 border-amber-300 p-4 text-center">
                  <Heart className="w-6 h-6 text-amber-700 mx-auto mb-2" />
                  <p className="text-amber-900 font-serif">{amenity}</p>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white border-2 border-amber-300 p-4 text-center">
                  <Heart className="w-6 h-6 text-amber-700 mx-auto mb-2" />
                  <p className="text-amber-900 font-serif">Comfort</p>
                </div>
                <div className="bg-white border-2 border-amber-300 p-4 text-center">
                  <Heart className="w-6 h-6 text-amber-700 mx-auto mb-2" />
                  <p className="text-amber-900 font-serif">Elegance</p>
                </div>
                <div className="bg-white border-2 border-amber-300 p-4 text-center">
                  <Heart className="w-6 h-6 text-amber-700 mx-auto mb-2" />
                  <p className="text-amber-900 font-serif">Service</p>
                </div>
                <div className="bg-white border-2 border-amber-300 p-4 text-center">
                  <Heart className="w-6 h-6 text-amber-700 mx-auto mb-2" />
                  <p className="text-amber-900 font-serif">Heritage</p>
                </div>
              </>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-serif text-amber-900 text-center mb-8 border-b-2 border-amber-300 pb-4">
            Our Rooms
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {rooms && rooms.length > 0 ? (
              rooms.map((room) => (
                <div key={room.id} className="bg-white border-4 border-amber-300 p-6">
                  <h3 className="text-2xl font-serif text-amber-900 mb-2">{room.title}</h3>
                  <p className="text-amber-800 mb-4 font-serif italic">Capacity: {room.max_guests} guests</p>
                  <div className="mb-4 pb-4 border-b-2 border-amber-200">
                    {room.amenities && room.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="inline-block text-sm text-amber-800 mr-3 mb-2">
                        ✦ {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-serif text-amber-900">₹{room.price}</span>
                    <button
                      onClick={() => onBookRoom(room.id)}
                      className="px-6 py-2 bg-amber-900 text-amber-50 hover:bg-amber-800 transition font-serif"
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No rooms available
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-amber-900 text-amber-50 py-8 mt-12 border-t-4 border-amber-700">
        <div className="max-w-6xl mx-auto px-4 text-center font-serif">
          <p>&copy; 2024 {hotel.name}. Timeless Elegance.</p>
        </div>
      </footer>
    </div>
  );
}
