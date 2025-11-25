import React, { useState } from 'react';
import { MapPin, Phone, Mail, Wifi, Utensils, Waves, Dumbbell } from 'lucide-react';

type ResortTemplateProps = {
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

export default function ResortTemplate({ hotel, rooms, onBookRoom }: ResortTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="relative h-96 bg-gradient-to-r from-teal-600 to-cyan-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative h-full flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-4">{hotel.name}</h1>
          <p className="text-xl opacity-90">Your Perfect Tropical Getaway</p>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap gap-6 justify-center">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5 text-teal-600" />
            <span>{hotel.address}, {hotel.city}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-5 h-5 text-teal-600" />
            <span>{hotel.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-5 h-5 text-teal-600" />
            <span>{hotel.email}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Paradise</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          {hotel.description || 'Experience tropical paradise at its finest'}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {hotel.amenities && hotel.amenities.length > 0 ? (
            hotel.amenities.slice(0, 4).map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <Wifi className="w-5 h-5" />
                <span className="text-gray-700 font-medium text-sm">{amenity}</span>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <Wifi className="w-5 h-5" />
                <span className="text-gray-700 font-medium text-sm">WiFi</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <Utensils className="w-5 h-5" />
                <span className="text-gray-700 font-medium text-sm">Dining</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <Waves className="w-5 h-5" />
                <span className="text-gray-700 font-medium text-sm">Pool</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <Dumbbell className="w-5 h-5" />
                <span className="text-gray-700 font-medium text-sm">Gym</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-teal-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Rooms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms && rooms.length > 0 ? (
              rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="h-48 bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                    <span className="text-white text-4xl">🏝️</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{room.title}</h3>
                    <p className="text-gray-600 mb-4">Capacity: {room.max_guests} guests</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities && room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-teal-600">₹{room.price}</span>
                      <button
                        onClick={() => onBookRoom(room.id)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                      >
                        Book Now
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

      <footer className="bg-teal-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 {hotel.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
