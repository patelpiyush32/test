import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Gift } from 'lucide-react';
import { supabase, Package } from '../../lib/supabase';

type PackagesManagerProps = {
  hotelId: string;
};

export default function PackagesManager({ hotelId }: PackagesManagerProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    package_type: 'custom' as 'honeymoon' | 'family' | 'business' | 'weekend' | 'custom',
    included_items: [] as string[],
    price: 0,
    validity_days: null as number | null,
    is_active: true
  });
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    loadPackages();
  }, [hotelId]);

  const loadPackages = async () => {
    const { data } = await supabase
      .from('packages')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('created_at', { ascending: false });
    
    if (data) setPackages(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await supabase
        .from('packages')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingId);
    } else {
      await supabase
        .from('packages')
        .insert({ ...formData, hotel_id: hotelId });
    }

    resetForm();
    loadPackages();
  };

  const handleEdit = (pkg: Package) => {
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      package_type: pkg.package_type,
      included_items: pkg.included_items,
      price: pkg.price,
      validity_days: pkg.validity_days,
      is_active: pkg.is_active
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this package?')) {
      await supabase.from('packages').delete().eq('id', id);
      loadPackages();
    }
  };

  const addItem = () => {
    if (newItem.trim()) {
      setFormData({...formData, included_items: [...formData.included_items, newItem.trim()]});
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      included_items: formData.included_items.filter((_, i) => i !== index)
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      package_type: 'custom',
      included_items: [],
      price: 0,
      validity_days: null,
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
    setNewItem('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Packages</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Package
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Package' : 'Create New Package'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="Honeymoon Special"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Type *</label>
                <select
                  value={formData.package_type}
                  onChange={(e) => setFormData({...formData, package_type: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="honeymoon">Honeymoon</option>
                  <option value="family">Family</option>
                  <option value="business">Business</option>
                  <option value="weekend">Weekend</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validity (Days)</label>
                <input
                  type="number"
                  value={formData.validity_days || ''}
                  onChange={(e) => setFormData({...formData, validity_days: e.target.value ? parseInt(e.target.value) : null})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="No expiry"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                rows={3}
                placeholder="Package description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Included Items</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., Complimentary breakfast"
                />
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.included_items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Active</label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
            <Gift className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No packages yet. Create your first one!</p>
          </div>
        ) : (
          packages.map(pkg => (
            <div key={pkg.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <Gift className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>

              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Includes:</p>
                <ul className="space-y-1">
                  {pkg.included_items.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                  {pkg.included_items.length > 3 && (
                    <li className="text-xs text-gray-500">+{pkg.included_items.length - 3} more</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <p className="text-2xl font-bold text-blue-600">₹{pkg.price}</p>
                  {pkg.validity_days && (
                    <p className="text-xs text-gray-500">{pkg.validity_days} days validity</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
