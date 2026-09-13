import React, { useState } from 'react';
import { X, Store } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

interface CreateShopProfileProps {
  onClose: () => void;
}

export const CreateShopProfile: React.FC<CreateShopProfileProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    acceptedMaterials: [] as string[],
    pickupAvailable: false,
    timings: '',
    rates: {} as { [key: string]: number }
  });

  const materials = [
    'E-waste', 'Mobile phones', 'Laptops', 'Computer parts', 'Chargers & cables',
    'Old batteries', 'Metal items (iron, steel, copper, aluminium, brass)',
    'Paper', 'Newspapers', 'Books', 'Cardboard', 'Plastics', 'Plastic bottles',
    'Plastic containers', 'Glass', 'Old clothes', 'Blankets', 'Home appliances',
    'Kitchen appliances', 'Vehicle batteries', 'Tyres'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would save to backend
    console.log('Shop profile created:', formData);
    onClose();
  };

  const handleMaterialToggle = (material: string) => {
    setFormData(prev => ({
      ...prev,
      acceptedMaterials: prev.acceptedMaterials.includes(material)
        ? prev.acceptedMaterials.filter(m => m !== material)
        : [...prev.acceptedMaterials, material]
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <Store className="text-blue-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Create Shop Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name *
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Timings
            </label>
            <input
              type="text"
              value={formData.timings}
              onChange={(e) => setFormData(prev => ({ ...prev, timings: e.target.value }))}
              placeholder="e.g., 9 AM - 6 PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
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
              Pickup service available
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Accepted Materials *
            </label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4">
              {materials.map((material) => (
                <label key={material} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.acceptedMaterials.includes(material)}
                    onChange={() => handleMaterialToggle(material)}
                    className="rounded"
                  />
                  <span>{material}</span>
                </label>
              ))}
            </div>
          </div>

          {formData.acceptedMaterials.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Rates per kg (₹) - Optional
              </label>
              <div className="grid md:grid-cols-2 gap-4 max-h-40 overflow-y-auto">
                {formData.acceptedMaterials.map((material) => (
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

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
            <p className="text-sm text-gray-600">
              <strong>Owner:</strong> {user?.fullName}<br />
              <strong>Phone:</strong> {user?.phone}<br />
              <strong>WhatsApp:</strong> {user?.whatsapp}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Create Shop Profile
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