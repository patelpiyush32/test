import { Upload, X, Image as ImageIcon } from 'lucide-react';

type Step2Props = {
  data: {
    photos: string[];
  };
  onChange: (data: Partial<Step2Props['data']>) => void;
};

export default function Step2Photos({ data, onChange }: Step2Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = [...data.photos];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push(reader.result as string);
        onChange({ photos: newPhotos });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = data.photos.filter((_, i) => i !== index);
    onChange({ photos: newPhotos });
  };

  const photoCategories = [
    { label: 'Hotel Exterior', placeholder: 'Front view of your hotel' },
    { label: 'Reception/Lobby', placeholder: 'Your welcoming entrance' },
    { label: 'Rooms', placeholder: 'Showcase your rooms' },
    { label: 'Bathroom', placeholder: 'Clean and modern bathrooms' },
    { label: 'Amenities', placeholder: 'Pool, gym, restaurant, etc.' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Photos</h2>
        <p className="text-gray-600">Add beautiful photos to showcase your hotel</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> High-quality photos increase bookings by up to 300%. Include photos of rooms, amenities, and exterior views.
        </p>
      </div>

      <div className="space-y-4">
        {photoCategories.map((category, idx) => (
          <div key={idx} className="border border-gray-300 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{category.label}</h3>
            <p className="text-sm text-gray-600 mb-3">{category.placeholder}</p>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload All Photos
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-1">Click to upload photos</p>
            <p className="text-sm text-gray-500">or drag and drop</p>
            <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB each</p>
          </label>
        </div>
      </div>

      {data.photos.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Uploaded Photos ({data.photos.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.photos.map((photo, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={photo}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePhoto(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.photos.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No photos uploaded yet</p>
          <p className="text-sm text-gray-400 mt-1">Add at least 5 photos to continue</p>
        </div>
      )}
    </div>
  );
}
