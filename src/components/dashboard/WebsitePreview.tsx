import LuxuryTemplate from '../templates/LuxuryTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import VintageTemplate from '../templates/VintageTemplate';
import ResortTemplate from '../templates/ResortTemplate';
import ColorfulTemplate from '../templates/ColorfulTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import BusinessTemplate from '../templates/BusinessTemplate';

type WebsitePreviewProps = {
  hotel: {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    description: string;
    amenities: string[];
  };
  rooms: Array<{ id: string; name: string; price: number; capacity: number; amenities: string[] }>;
  templateId: string;
};

export default function WebsitePreview({ hotel, rooms, templateId }: WebsitePreviewProps) {
  const hotelData = {
    name: hotel.name,
    address: hotel.address,
    city: hotel.city,
    phone: hotel.phone,
    email: hotel.email,
    description: hotel.description,
    amenities: hotel.amenities || [],
    rooms: rooms
  };

  const renderTemplate = () => {
    const props = { hotel: hotelData, onBookRoom: () => {} };
    switch (templateId) {
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
    <div className="h-full bg-gray-100 rounded-lg overflow-hidden flex flex-col">
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-semibold flex items-center justify-between">
        <span>Live Preview</span>
        <span className="text-xs bg-green-600 px-2 py-1 rounded">Live</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderTemplate()}
      </div>
    </div>
  );
}
