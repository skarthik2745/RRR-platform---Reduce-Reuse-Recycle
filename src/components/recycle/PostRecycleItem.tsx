import React, { useState } from 'react';
import { X, Upload, Recycle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { createRecyclePost } from '../../lib/database';
import { getCurrentUser } from '../../lib/auth';

interface PostRecycleItemProps {
  onClose: () => void;
}

export const PostRecycleItem: React.FC<PostRecycleItemProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    photo: '',
    materials: [] as string[],
    description: '',
    quantity: '',
    pickupAvailable: false,
    rates: {} as { [key: string]: number }
  });

  const materials = [
    'E-waste', 'Mobile phones', 'Laptops', 'Computer parts', 'Chargers & cables',
    'Old batteries', 'Metal items', 'Paper', 'Newspapers', 'Books', 'Cardboard',
    'Plastics', 'Plastic bottles', 'Plastic containers', 'Glass', 'Old clothes',
    'Blankets', 'Home appliances', 'Kitchen appliances', 'Vehicle batteries', 'Tyres'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        alert('Please log in to post items');
        return;
      }

      const { data, error } = await createRecyclePost({
        user_id: currentUser.id,
        photo: formData.photo,
        materials: formData.materials,
        description: formData.description,
        quantity: formData.quantity,
        pickup_available: formData.pickupAvailable,
        rates: formData.rates
      });

      if (error) {
        console.error('Error creating recycle post:', error);
        alert('Failed to create post. Please try again.');
        return;
      }

      console.log('Recycle post created successfully:', data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleMaterialToggle = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const handleRateChange = (material: string, rate: string) => {
    setFormData(prev => ({
      ...prev,
      rates: {
        ...prev.rates,
        [material]: parseFloat(rate) || 0
      }
    }));
  };

  const isEcoRecycler = user?.userType === 'ecorecycler';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <Recycle className="text-green-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">
              {isEcoRecycler ? 'Post Collection Request' : 'Post Recyclable Item'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto text-gray-400 mb-2" size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setFormData(prev => ({ ...prev, photo: e.target?.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Upload photo from your device</p>
              {formData.photo && (
                <div className="mt-2">
                  <img src={formData.photo} alt="Preview" className="w-20 h-20 object-cover rounded mx-auto" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {isEcoRecycler ? 'Materials You Collect *' : 'Type of Waste *'}
            </label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4">
              {materials.map((material) => (
                <label key={material} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.materials.includes(material)}
                    onChange={() => handleMaterialToggle(material)}
                    className="rounded"
                  />
                  <span>{material}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder={isEcoRecycler ? 
                  'Describe your collection service and requirements...' : 
                  'Describe the items you want to recycle...'
                }
                required
              />
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isEcoRecycler ? 'Minimum Quantity' : 'Quantity/Weight'}
                </label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 5 kg, 10 pieces"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pickup"
                  checked={formData.pickupAvailable}
                  onChange={(e) => setFormData(prev => ({ ...prev, pickupAvailable: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="pickup" className="text-sm text-gray-700">
                  {isEcoRecycler ? 'Pickup service available' : 'Pickup required'}
                </label>
              </div>
            </div>
          </div>

          {isEcoRecycler && formData.materials.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Rates per kg (₹) - Optional
              </label>
              <div className="grid md:grid-cols-2 gap-4 max-h-40 overflow-y-auto">
                {formData.materials.map((material) => (
                  <div key={material} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 flex-1">{material}:</span>
                    <input
                      type="number"
                      placeholder="Rate"
                      value={formData.rates[material] || ''}
                      onChange={(e) => handleRateChange(material, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg" style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid #22C55E'
          }}>
            <h3 className="text-sm font-medium text-green-700 mb-2">Contact Information (Auto-filled)</h3>
            <p className="text-sm text-green-600">
              <strong>Name:</strong> {user?.fullName}<br />
              <strong>Phone:</strong> {user?.phone}<br />
              <strong>WhatsApp:</strong> {user?.whatsapp}<br />
              <strong>Location:</strong> {user?.location?.address}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
            >
              {isEcoRecycler ? 'Post Collection Request' : 'Post Item'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};