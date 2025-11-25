import React, { useState } from 'react';
import { MapPin, Phone, Mail, Star } from 'lucide-react';

type MinimalTemplateProps = {
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

export default function MinimalTemplate({ hotel, rooms, onBookRoom }: MinimalTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 z-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">{hotel.name}</h1>
          <div className="flex gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {hotel.address}</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {hotel.phone}</span>
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {hotel.email}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-16">
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
            {hotel.description || 'Welcome to our hotel'}
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Amenities</h2>
          <div className="flex flex-wrap gap-3">
            {hotel.amenities && hotel.amenities.length > 0 ? (
              hotel.amenities.map((amenity, idx) => (
                <span key={idx} className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm">
                  {amenity}
                </span>
              ))
            ) : (
              <>
                <span className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm">WiFi</span>
                <span className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm">Breakfast</span>
                <span className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm">Parking</span>
              </>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-light text-gray-900 mb-8">Rooms</h2>
          <div className="space-y-6">
            {rooms && rooms.length > 0 ? (
              rooms.map((room) => (
                <div key={room.id} className="border border-gray-200 p-6 hover:border-gray-400 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-light text-gray-900">{room.title}</h3>
                      <p className="text-sm text-gray-600">Up to {room.max_guests} guests</p>
                    </div>
                    <span className="text-2xl font-light text-gray-900">₹{room.price}</span>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {room.amenities && room.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="text-xs text-gray-600 border-b border-gray-300">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onBookRoom(room.id)}
                    className="px-6 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
                  >
                    Book
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No rooms available
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; 2024 {hotel.name}</p>
        </div>
      </footer>
    </div>
  );
}
