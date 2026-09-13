import React, { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

interface CreateCareHomeProps {
  onSubmit: (careHome: any) => void;
  onClose: () => void;
  initialData?: any;
}

export const CreateCareHome: React.FC<CreateCareHomeProps> = ({ onSubmit, onClose, initialData }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    organizationName: initialData?.name || (user?.userType === 'ngo' ? user.organizationName || '' : ''),
    type: (initialData?.type || 'Orphanage') as 'Orphanage' | 'Old Age Home' | 'Shelter' | 'NGO',
    address: initialData?.address || (user?.userType === 'ngo' ? user.location?.address || '' : ''),
    contactPerson: initialData?.contact_person || user?.name || '',
    phone: initialData?.phone || user?.phone || '',
    whatsapp: initialData?.whatsapp || user?.whatsapp || user?.phone || '',
    email: initialData?.email || user?.email || '',
    residents: initialData?.current_residents || 0,
    dailyRequirements: initialData?.daily_requirements || '',
    description: initialData?.description || (user?.userType === 'ngo' ? user.userDescription || '' : ''),
    images: initialData?.images || [] as string[]
  });

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
    onSubmit(formData);
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
          }}>{initialData ? 'Edit Care Home' : 'Add Care Home'}</h2>
          <button onClick={onClose} className="p-3 rounded-full transition-all duration-300 hover:scale-110" style={{
            background: 'rgba(255, 215, 0, 0.9)',
            backdropFilter: 'blur(10px)'
          }}>
            <X size={20} style={{color: '#1A1A1A'}} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Organization Name</label>
              <input
                type="text"
                required
                value={formData.organizationName}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
              >
                <option value="Orphanage" style={{background: '#1A1A1A', color: '#FFD700'}}>Orphanage</option>
                <option value="Old Age Home" style={{background: '#1A1A1A', color: '#FFD700'}}>Old Age Home</option>
                <option value="Shelter" style={{background: '#1A1A1A', color: '#FFD700'}}>Shelter</option>
                <option value="NGO" style={{background: '#1A1A1A', color: '#FFD700'}}>NGO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Contact Person</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Number of Residents</label>
              <input
                type="number"
                required
                min="1"
                value={formData.residents}
                onChange={(e) => setFormData(prev => ({ ...prev, residents: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>WhatsApp Number</label>
              <input
                type="tel"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Daily Food Requirements</label>
            <textarea
              required
              value={formData.dailyRequirements}
              onChange={(e) => setFormData(prev => ({ ...prev, dailyRequirements: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
              rows={3}
              placeholder="e.g., 3 meals for 45 children, snacks"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
              rows={4}
              placeholder="Tell us about your organization..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Images</label>
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
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto mb-2" style={{color: '#FFD700'}} size={48} />
                <p style={{color: '#FFD700'}}>Click to upload images</p>
                <p className="text-sm" style={{color: '#E6C55F'}}>Building photos, facilities, etc.</p>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
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
              {initialData ? 'Update Care Home' : 'Add Care Home'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};