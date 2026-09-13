import React, { useState } from 'react';
import { X, Store } from 'lucide-react';
import { ShopProfile } from '../../types';
import { useAuth } from '../auth/AuthContext';

interface CreateRecyclerListingProps {
  onSubmit: (listing: Omit<ShopProfile, 'id'>) => void;
  onClose: () => void;
  initialData?: any;
}

export const CreateRecyclerListing: React.FC<CreateRecyclerListingProps> = ({ onSubmit, onClose, initialData }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    shopName: initialData?.name || '',
    shopAddress: initialData?.location || user?.location?.address || '',
    ownerName: initialData?.contact_info?.split(',')[0] || user?.fullName || '',
    phone: initialData?.contact_info?.split(',')[1] || user?.phone || '',
    whatsapp: initialData?.contact_info?.split(',')[2] || user?.whatsapp || '',
    acceptedMaterials: initialData?.accepted_materials || user?.acceptedItems || [],
    customMaterial: '',
    rates: {} as { [key: string]: number },
    description: initialData?.description || user?.description || ''
  });

  const materials = [
    'E-waste', 'Mobile phones', 'Laptops', 'Computer parts', 'Chargers & cables',
    'Old batteries', 'Metal items (iron, steel, copper, aluminium, brass)',
    'Paper', 'Newspapers', 'Books', 'Cardboard', 'Plastics', 'Plastic bottles',
    'Plastic containers', 'Glass', 'Old clothes', 'Blankets', 'Home appliances',
    'Kitchen appliances', 'Vehicle batteries', 'Tyres', 'Others'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const finalMaterials = formData.acceptedMaterials.includes('Others') && formData.customMaterial
      ? [...formData.acceptedMaterials.filter(m => m !== 'Others'), formData.customMaterial]
      : formData.acceptedMaterials;

    const newListing: Omit<ShopProfile, 'id'> = {
      shopName: formData.shopName,
      ownerName: formData.ownerName,
      acceptedMaterials: finalMaterials,
      address: formData.shopAddress,
      location: user.location,
      pickupAvailable: user.pickupAvailable || false,
      timings: user.workingHours || '9 AM - 6 PM',
      rates: formData.rates,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      description: formData.description,
      images: [],
      // Auto-filled user profile information
      userEmail: user.email,
      userDescription: user.description
    };

    onSubmit(newListing);
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-popupIn" style={{
        background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
        border: '3px solid #FFD700',
        borderRadius: '20px',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
      }}>
        <div className="sticky top-0 p-6 flex justify-between items-center" style={{
          background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
          borderBottom: '2px solid #FFD700',
          borderRadius: '17px 17px 0 0'
        }}>
          <h2 className="text-3xl font-bold" style={{
            color: '#FFD700',
            fontFamily: 'Poppins, Montserrat',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
          }}>{initialData ? 'Edit Recycler Listing' : 'Create Recycler Listing'}</h2>
          <button
            onClick={onClose}
            className="p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: 'rgba(255, 215, 0, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <X size={20} style={{color: '#1A1A1A'}} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <style>{`
            .recycler-form label { color: #FFD700 !important; }
            .recycler-form input, .recycler-form textarea, .recycler-form select {
              background: linear-gradient(135deg, #1A1A1A, #2D5016) !important;
              border: 2px solid #FFD700 !important;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4) !important;
              color: #FFD700 !important;
            }
            .recycler-form input::placeholder, .recycler-form textarea::placeholder {
              color: #999 !important;
            }
            .recycler-form span, .recycler-form p {
              color: #FFD700 !important;
            }
            .recycler-form .text-sm {
              color: #E6C55F !important;
            }
          `}</style>
          <div className="recycler-form">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name *</label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address *</label>
            <input
              type="text"
              value={formData.shopAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, shopAddress: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Complete shop address with area and city"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location (GPS) *</label>
            <input
              type="text"
              value={user?.location?.address || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              placeholder="GPS location from your profile"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Location is taken from your profile settings</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number *</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Accepted Materials *</label>
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
            {formData.acceptedMaterials.includes('Others') && (
              <input
                type="text"
                value={formData.customMaterial}
                onChange={(e) => setFormData(prev => ({ ...prev, customMaterial: e.target.value }))}
                placeholder="Specify other materials"
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            )}
          </div>

          {formData.acceptedMaterials.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Rates per kg (₹) - Optional</label>
              <div className="grid md:grid-cols-2 gap-4 max-h-40 overflow-y-auto">
                {formData.acceptedMaterials.filter(m => m !== 'Others').map((material) => (
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description / Notes</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Additional information about your recycling services..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 text-white px-6 py-3 rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 font-bold"
              style={{
                background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
              }}
            >
              {initialData ? 'Update Listing' : 'Create Listing'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 font-bold"
              style={{
                background: 'linear-gradient(135deg, #8B0000, #A52A2A)',
                border: '2px solid #DC143C',
                boxShadow: '0 4px 15px rgba(139, 0, 0, 0.4)',
                color: 'white'
              }}
            >
              Cancel
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};