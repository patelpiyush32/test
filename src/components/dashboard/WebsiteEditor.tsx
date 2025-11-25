import { useState, useEffect } from 'react';
import { supabase, Hotel, Room } from '../../lib/supabase';
import { Save, Eye, Copy, CheckCircle2, X } from 'lucide-react';
import WebsitePreview from './WebsitePreview';

type WebsiteEditorProps = {
  hotelId: string;
};

const TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean & professional' },
  { id: 'luxury', name: 'Luxury', description: 'Premium black & gold' },
  { id: 'vintage', name: 'Vintage', description: 'Classic & elegant' },
  { id: 'resort', name: 'Resort', description: 'Tropical paradise' },
  { id: 'colorful', name: 'Colorful', description: 'Vibrant & trendy' },
  { id: 'minimal', name: 'Minimal', description: 'Simple & clean' },
  { id: 'business', name: 'Business', description: 'Corporate professional' }
];

export default function WebsiteEditor({ hotelId }: WebsiteEditorProps) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    city: '',
    state: '',
    primaryColor: '#2563eb',
    fontFamily: 'Inter',
    templateId: 'modern'
  });

  useEffect(() => {
    loadHotel();
  }, [hotelId]);

  const loadHotel = async () => {
    try {
      const { data } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', hotelId)
        .single();

      if (data) {
        setHotel(data);
        setFormData({
          name: data.name,
          description: data.description || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          email: data.email || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          primaryColor: data.theme_config?.primaryColor || '#2563eb',
          fontFamily: data.theme_config?.fontFamily || 'Inter',
          templateId: data.template_id || 'modern'
        });

        const { data: roomsData } = await supabase
          .from('rooms')
          .select('*')
          .eq('hotel_id', hotelId)
          .order('created_at', { ascending: true });
        
        if (roomsData) {
          setRooms(roomsData);
        }
      }
    } catch (error) {
      console.error('Error loading hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('hotels')
        .update({
          name: formData.name,
          description: formData.description,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          template_id: formData.templateId,
          is_published: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', hotelId);

      if (error) throw error;
      alert('Website updated successfully!');
      loadHotel();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const copyWebsiteUrl = () => {
    if (hotel) {
      navigator.clipboard.writeText(`http://localhost:5173/hotel/${hotel.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('hotels')
        .update({
          template_id: templateId,
          is_published: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', hotelId);

      if (error) throw error;
    } catch (error) {
      console.error('Error changing template:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 lg:space-y-6">
        {hotel && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 lg:p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-2">Your Website</h3>
                <p className="text-blue-100 font-mono text-xs sm:text-sm truncate">http://localhost:5173/hotel/{hotel.slug}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={copyWebsiteUrl}
                  className="flex-1 sm:flex-none bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 text-sm"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={`http://localhost:5173/hotel/${hotel.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 text-sm"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Open</span>
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Select Website Template</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 lg:gap-3">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  setFormData({ ...formData, templateId: template.id });
                  handleTemplateChange(template.id);
                }}
                className={`p-2 lg:p-4 rounded-lg border-2 transition text-left text-xs lg:text-sm ${
                  formData.templateId === template.id
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-300'
                    : 'border-gray-300 hover:border-blue-600'
                }`}
              >
                <h4 className="font-semibold text-gray-900 truncate">{template.name}</h4>
                <p className="text-xs text-gray-600 line-clamp-1">{template.description}</p>
                {formData.templateId === template.id && (
                  <p className="text-xs text-blue-600 font-semibold mt-1">✓</p>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Website Information</h3>

          <div className="space-y-3 lg:space-y-4">
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                rows={3}
                placeholder="Tell guests about your hotel..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2 lg:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 font-semibold text-sm lg:text-base"
          >
            <Eye className="h-4 w-4" />
            Preview Theme
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 lg:py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-semibold text-sm lg:text-base"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Theme Preview</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {hotel && rooms.length > 0 ? (
                <WebsitePreview
                  hotel={{
                    name: formData.name,
                    address: formData.address,
                    city: formData.city,
                    phone: formData.phone,
                    email: formData.email,
                    description: formData.description,
                    amenities: hotel.amenities || []
                  }}
                  rooms={rooms}
                  templateId={formData.templateId}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">Add rooms to see preview</p>
                    <p className="text-xs text-gray-400">Go to Rooms & Pricing tab</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
