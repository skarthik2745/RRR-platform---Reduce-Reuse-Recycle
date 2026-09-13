import React, { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

interface CreateFoodPostProps {
  onSubmit: (foodPost: any) => void;
  onClose: () => void;
  initialData?: any;
}

export const CreateFoodPost: React.FC<CreateFoodPostProps> = ({ onSubmit, onClose, initialData }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    eventName: initialData?.eventName || '',
    quantity: initialData?.quantity || '',
    foodType: initialData?.foodType || 'Mixed Meals',
    pickupLocation: initialData?.pickupLocation || user?.location?.address || '',
    bestBefore: initialData?.bestBefore ? new Date(initialData.bestBefore).toISOString().slice(0, 16) : '',
    notes: initialData?.notes || '',
    images: initialData?.images || [] as string[]
  });

  const foodTypes = [
    'Mixed Meals',
    'Rice & Curry',
    'Snacks & Sweets',
    'Vegetables',
    'Fruits',
    'Bread & Bakery',
    'Beverages',
    'Others'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const foodPost = {
      ...formData,
      bestBefore: new Date(formData.bestBefore),
      userName: user?.name || '',
      phone: user?.phone || '',
      whatsapp: user?.whatsapp || user?.phone || '',
      userEmail: user?.email || '',
      createdAt: new Date()
    };

    // Simulate notification to care homes
    console.log('Notifying all care homes about new food post:', foodPost);
    
    onSubmit(foodPost);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-popupIn" style={{
        background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
        border: '3px solid #FFD700',
        borderRadius: '20px',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
      }}>
        <div className="sticky top-0 p-4 flex justify-between items-center" style={{
          background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
          borderBottom: '2px solid #FFD700',
          borderRadius: '20px 20px 0 0'
        }}>
          <h2 className="text-3xl font-bold" style={{
            color: '#FFD700',
            fontFamily: 'Poppins, Montserrat',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
          }}>{initialData ? 'Edit Food Post' : 'Post Leftover Food'}</h2>
          <button onClick={onClose} className="p-3 rounded-full transition-all duration-300 hover:scale-110" style={{
            background: 'rgba(255, 215, 0, 0.9)',
            backdropFilter: 'blur(10px)'
          }}>
            <X size={20} style={{color: '#1A1A1A'}} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="p-4 rounded-xl" style={{
            background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 className="font-semibold mb-2" style={{color: '#FFD700'}}>Auto-filled Contact Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{color: '#E6C55F'}}>Name:</span>
                <span className="ml-2 font-medium" style={{color: '#FFD700'}}>{user?.name || 'Not provided'}</span>
              </div>
              <div>
                <span style={{color: '#E6C55F'}}>Phone:</span>
                <span className="ml-2 font-medium" style={{color: '#FFD700'}}>{user?.phone || 'Not provided'}</span>
              </div>
              <div>
                <span style={{color: '#E6C55F'}}>WhatsApp:</span>
                <span className="ml-2 font-medium" style={{color: '#FFD700'}}>{user?.whatsapp || user?.phone || 'Not provided'}</span>
              </div>
              <div>
                <span style={{color: '#E6C55F'}}>Email:</span>
                <span className="ml-2 font-medium" style={{color: '#FFD700'}}>{user?.email || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Event Name</label>
              <input
                type="text"
                required
                value={formData.eventName}
                onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
                placeholder="e.g., Wedding Reception"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Quantity</label>
              <input
                type="text"
                required
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
                placeholder="e.g., 50 servings, 20 boxes"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Food Type</label>
              <select
                value={formData.foodType}
                onChange={(e) => setFormData(prev => ({ ...prev, foodType: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
              >
                {foodTypes.map(type => (
                  <option key={type} value={type} style={{background: '#1A1A1A', color: '#FFD700'}}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Best Before</label>
              <input
                type="datetime-local"
                required
                value={formData.bestBefore}
                onChange={(e) => setFormData(prev => ({ ...prev, bestBefore: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700',
                  colorScheme: 'dark'
                }}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Pickup Location</label>
            <input
              type="text"
              required
              value={formData.pickupLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, pickupLocation: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
              placeholder="Full address for pickup"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
              rows={3}
              placeholder="Any special instructions or details about the food..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Food Images</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{
              borderColor: '#FFD700',
              background: 'rgba(255, 215, 0, 0.1)'
            }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="food-image-upload"
              />
              <label htmlFor="food-image-upload" className="cursor-pointer">
                <Upload className="mx-auto mb-2" style={{color: '#FFD700'}} size={48} />
                <p style={{color: '#FFD700'}}>Click to upload food images</p>
                <p className="text-sm" style={{color: '#E6C55F'}}>Show the quality and quantity of food</p>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Food ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl" style={{
            background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <h4 className="font-semibold mb-2" style={{color: '#FFD700'}}>Automatic Notifications</h4>
            <p className="text-sm" style={{color: '#E6C55F'}}>
              When you post this food, all registered care homes (orphanages, old age homes, shelters, NGOs) 
              will automatically receive a notification with your contact details and pickup information.
            </p>
          </div>

          <div className="flex gap-4">
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
            <button
              type="submit"
              className="flex-1 text-white px-6 py-3 rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 font-bold"
              style={{
                background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
              }}
            >
              {initialData ? 'Update Food Post' : 'Post Food & Notify Care Homes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};