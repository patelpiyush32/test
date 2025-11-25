import React, { useState } from 'react';
import { MapPin, Phone, Mail, Wifi, Coffee, Briefcase, Clock } from 'lucide-react';

type BusinessTemplateProps = {
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

export default function BusinessTemplate({ hotel, rooms, onBookRoom }: BusinessTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 text-white sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{hotel.name}</h1>
            <p className="text-slate-300 text-sm">Premium Business Hotel</p>
          </div>
          <div className="text-right">
            <p className="flex items-center gap-2 text-slate-300"><Phone className="w-4 h-4" /> {hotel.phone}</p>
            <p className="flex items-center gap-2 text-slate-300"><Mail className="w-4 h-4" /> {hotel.email}</p>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Your Business Home Away From Home</h2>
          <p className="text-xl text-slate-300 mb-6">
            {hotel.description || 'Experience professional hospitality'}
          </p>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-5 h-5" />
            <span>{hotel.address}, {hotel.city}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Business Amenities</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {hotel.amenities && hotel.amenities.length > 0 ? (
            hotel.amenities.slice(0, 4).map((amenity, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow border-l-4 border-slate-900">
                <div className="flex items-center gap-3 mb-2">
                  {amenity === 'WiFi' && <Wifi className="w-6 h-6 text-slate-900" />}
                  {amenity === 'Breakfast' && <Coffee className="w-6 h-6 text-slate-900" />}
                  {amenity === 'Gym' && <Briefcase className="w-6 h-6 text-slate-900" />}
                  {amenity === 'Parking' && <Clock className="w-6 h-6 text-slate-900" />}
                  {!['WiFi', 'Breakfast', 'Gym', 'Parking'].includes(amenity) && <Wifi className="w-6 h-6 text-slate-900" />}
                  <span className="font-semibold text-gray-800">{amenity}</span>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-slate-900">
                <div className="flex items-center gap-3 mb-2">
                  <Wifi className="w-6 h-6 text-slate-900" />
                  <span className="font-semibold text-gray-800">High-Speed WiFi</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-slate-900">
                <div className="flex items-center gap-3 mb-2">
                  <Coffee className="w-6 h-6 text-slate-900" />
                  <span className="font-semibold text-gray-800">Breakfast</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-slate-900">
                <div className="flex items-center gap-3 mb-2">
                  <Briefcase className="w-6 h-6 text-slate-900" />
                  <span className="font-semibold text-gray-800">Business Center</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-slate-900">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-slate-900" />
                  <span className="font-semibold text-gray-800">24/7 Service</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Room Options</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms && rooms.length > 0 ? (
              rooms.map((room) => (
                <div key={room.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                  <div className="h-40 bg-slate-200 flex items-center justify-center text-4xl">🏢</div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{room.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">Capacity: {room.max_guests} guests</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities && room.amenities.slice(0, 2).map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-2xl font-bold text-slate-900">₹{room.price}</span>
                      <button
                        onClick={() => onBookRoom(room.id)}
                        className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition"
                      >
                        Reserve
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
      </div>

      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 {hotel.name}. Professional Hospitality.</p>
        </div>
      </footer>
    </div>
  );
}
