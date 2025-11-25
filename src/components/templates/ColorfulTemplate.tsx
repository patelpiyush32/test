import React, { useState } from 'react';
import { MapPin, Phone, Mail, Sparkles } from 'lucide-react';

type ColorfulTemplateProps = {
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

export default function ColorfulTemplate({ hotel, rooms, onBookRoom }: ColorfulTemplateProps) {
  const colors = ['from-pink-500 to-rose-500', 'from-purple-500 to-indigo-500', 'from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-10 h-10" />
            {hotel.name}
          </h1>
          <p className="text-pink-100">Experience Vibrant Hospitality</p>
        </div>
      </header>

      <div className="bg-gradient-to-r from-pink-500 to-purple-500 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 text-white text-sm">
          <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {hotel.address}</span>
          <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {hotel.phone}</span>
          <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {hotel.email}</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-12 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 text-white">
          <p className="text-lg leading-relaxed">
            {hotel.description || 'Experience vibrant hospitality'}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Amazing Amenities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotel.amenities && hotel.amenities.length > 0 ? (
              hotel.amenities.map((amenity, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${colors[idx % colors.length]} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition transform hover:scale-105`}>
                  <p className="font-bold text-lg">{amenity}</p>
                </div>
              ))
            ) : (
              <>
                <div className={`bg-gradient-to-br ${colors[0]} rounded-xl p-6 text-white shadow-lg`}>
                  <p className="font-bold text-lg">WiFi</p>
                </div>
                <div className={`bg-gradient-to-br ${colors[1]} rounded-xl p-6 text-white shadow-lg`}>
                  <p className="font-bold text-lg">Breakfast</p>
                </div>
                <div className={`bg-gradient-to-br ${colors[2]} rounded-xl p-6 text-white shadow-lg`}>
                  <p className="font-bold text-lg">Gym</p>
                </div>
                <div className={`bg-gradient-to-br ${colors[3]} rounded-xl p-6 text-white shadow-lg`}>
                  <p className="font-bold text-lg">Parking</p>
                </div>
              </>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Rooms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms && rooms.length > 0 ? (
              rooms.map((room, idx) => (
                <div key={room.id} className={`bg-gradient-to-br ${colors[idx % colors.length]} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition transform hover:scale-105`}>
                  <h3 className="text-2xl font-bold mb-2">{room.title}</h3>
                  <p className="mb-4 opacity-90">Capacity: {room.max_guests} guests</p>
                  <div className="mb-6 pb-4 border-b border-white border-opacity-30">
                    {room.amenities && room.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="inline-block text-sm mr-2 mb-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">₹{room.price}</span>
                    <button
                      onClick={() => onBookRoom(room.id)}
                      className="px-6 py-2 bg-white text-gray-900 font-bold rounded-lg hover:bg-opacity-90 transition"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-300">
                No rooms available
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 {hotel.name}. Vibrant Experiences Await!</p>
        </div>
      </footer>
    </div>
  );
}
