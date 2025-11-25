import { useState, useEffect } from 'react';
import { supabase, Hotel, Room } from '../lib/supabase';
import LuxuryTemplate from './templates/LuxuryTemplate';
import ModernTemplate from './templates/ModernTemplate';
import VintageTemplate from './templates/VintageTemplate';
import ResortTemplate from './templates/ResortTemplate';
import ColorfulTemplate from './templates/ColorfulTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import BusinessTemplate from './templates/BusinessTemplate';
import EnhancedBookingForm from './EnhancedBookingForm';

type PublicHotelWebsiteProps = {
  hotelSlug: string;
};



export default function PublicHotelWebsite({ hotelSlug }: PublicHotelWebsiteProps) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    loadHotelData();
  }, [hotelSlug]);

  const loadHotelData = async () => {
    try {
      const { data: hotelData } = await supabase
        .from('hotels')
        .select('*')
        .eq('is_published', true)
        .eq('slug', hotelSlug)
        .maybeSingle();

      if (hotelData) {
        setHotel(hotelData);
        const { data: roomsData } = await supabase
          .from('rooms')
          .select('*')
          .eq('hotel_id', hotelData.id);
        if (roomsData) setRooms(roomsData);
      }
    } catch (error) {
      console.error('Error loading hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    setShowBooking(false);
    setSelectedRoom(null);
    loadHotelData();
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
          <p className="text-gray-600 text-lg">Hotel not found</p>
        </div>
      </div>
    );
  }

  const handleBookingClick = (room: Room) => {
    setSelectedRoom(room);
    setShowBooking(true);
  };

  const hotelData = {
    name: hotel.name,
    address: hotel.address,
    city: hotel.city,
    phone: hotel.phone,
    email: hotel.email,
    description: hotel.description || 'Welcome to our hotel',
    amenities: hotel.amenities || []
  };

  const renderTemplate = () => {
    const props = { hotel: hotelData, rooms: rooms, onBookRoom: handleBookingClick };
    switch (hotel.template_id) {
      case 'luxury':
        return <LuxuryTemplate {...props} />;
      case 'vintage':
        return <VintageTemplate {...props} />;
      case 'resort':
        return <ResortTemplate {...props} />;
      case 'colorful':
        return <ColorfulTemplate {...props} />;
      case 'minimal':
        return <MinimalTemplate {...props} />;
      case 'business':
        return <BusinessTemplate {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  return (
    <>
      {renderTemplate()}

      {showBooking && selectedRoom && hotel && (
        <EnhancedBookingForm
          room={selectedRoom}
          hotelId={hotel.id}
          hotelName={hotel.name}
          onClose={() => {
            setShowBooking(false);
            setSelectedRoom(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
}
