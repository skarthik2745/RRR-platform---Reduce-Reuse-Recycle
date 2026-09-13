import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { ReuseItem } from '../../types';
import { useAuth } from '../auth/AuthContext';

interface PostItemFormProps {
  categories: string[];
  onSubmit: (item: Omit<ReuseItem, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  initialData?: ReuseItem;
}

export const PostItemForm: React.FC<PostItemFormProps> = ({ categories, onSubmit, onClose, initialData }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    photos: initialData?.photos || [] as string[],
    name: initialData?.name || '',
    description: initialData?.description || '',
    condition: (initialData?.condition || 'good') as 'new' | 'good' | 'used' | 'like-new' | 'slightly-damaged' | 'heavy-used' | 'other',
    category: initialData?.category || categories[0],
    customCategory: '',
    isFree: initialData?.isFree ?? true,
    price: initialData?.price?.toString() || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const finalCategory = formData.category === 'Others' ? formData.customCategory : formData.category;

    const newItem: Omit<ReuseItem, 'id' | 'createdAt'> = {
      photos: formData.photos.length > 0 ? formData.photos : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'],
      name: formData.name,
      description: formData.description,
      condition: formData.condition,
      category: finalCategory,
      isFree: formData.isFree,
      price: formData.isFree ? undefined : parseFloat(formData.price),
      userId: user.id,
      userName: user.organizationName || user.fullName,
      phone: user.phone,
      whatsapp: user.whatsapp,
      location: user.location,
      // Auto-filled user profile information
      userType: user.userType,
      userEmail: user.email,
      userDescription: user.description,
      organizationName: user.organizationName
    };

    onSubmit(newItem);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-popupIn" style={{
        background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
        border: '3px solid #FFD700',
        borderRadius: '20px',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
      }}>
        <div className="flex justify-between items-center p-6" style={{
          borderBottom: '2px solid #FFD700'
        }}>
          <h2 className="text-3xl font-bold" style={{
            color: '#FFD700',
            fontFamily: 'Poppins, Montserrat',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
          }}>{initialData ? 'Edit Item' : 'Post an Item'}</h2>
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
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>
              Item Photos
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{
              borderColor: '#FFD700',
              background: 'rgba(255, 215, 0, 0.1)'
            }}>
              <Upload className="mx-auto mb-2" style={{color: '#FFD700'}} size={24} />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      Array.from(files).forEach(file => {
                        if (file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const result = e.target?.result as string;
                            setFormData(prev => ({
                              ...prev,
                              photos: [...prev.photos, result]
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      });
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                    border: '2px solid #FFD700',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                  }}
                >
                  Choose Files
                </button>
              </div>
              <p className="text-xs mt-3" style={{color: '#E6C55F'}}>
                Upload multiple photos of your item
              </p>
              {formData.photos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2" style={{color: '#FFD700'}}>
                    Uploaded Photos ({formData.photos.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              photos: prev.photos.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute -top-2 -right-2 text-white rounded-full p-1 transition-colors opacity-0 group-hover:opacity-100"
                          style={{
                            background: '#8B0000',
                            boxShadow: '0 2px 8px rgba(139, 0, 0, 0.4)'
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>
                Item Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
              >
                <option value="new" style={{background: '#1A1A1A', color: '#FFD700'}}>New</option>
                <option value="like-new" style={{background: '#1A1A1A', color: '#FFD700'}}>Like New</option>
                <option value="good" style={{background: '#1A1A1A', color: '#FFD700'}}>Good</option>
                <option value="used" style={{background: '#1A1A1A', color: '#FFD700'}}>Used</option>
                <option value="slightly-damaged" style={{background: '#1A1A1A', color: '#FFD700'}}>Slightly Damaged</option>
                <option value="heavy-used" style={{background: '#1A1A1A', color: '#FFD700'}}>Heavy Used</option>
                <option value="other" style={{background: '#1A1A1A', color: '#FFD700'}}>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 rounded-md focus:outline-none"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
            >
              {categories.map((category) => (
                <option key={category} value={category} style={{background: '#1A1A1A', color: '#FFD700'}}>
                  {category}
                </option>
              ))}
            </select>
            {formData.category === 'Others' && (
              <input
                type="text"
                value={formData.customCategory}
                onChange={(e) => handleInputChange('customCategory', e.target.value)}
                placeholder="Enter custom category"
                className="w-full mt-2 px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>
              Pricing
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="free"
                  name="pricing"
                  checked={formData.isFree}
                  onChange={() => handleInputChange('isFree', true)}
                  className="mr-2"
                />
                <label htmlFor="free" className="text-sm" style={{color: '#E6C55F'}}>
                  Free
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paid"
                  name="pricing"
                  checked={!formData.isFree}
                  onChange={() => handleInputChange('isFree', false)}
                  className="mr-2"
                />
                <label htmlFor="paid" className="text-sm" style={{color: '#E6C55F'}}>
                  Paid
                </label>
              </div>
              {!formData.isFree && (
                <div className="ml-6">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price in ₹"
                    className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                    style={{
                      background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                      border: '2px solid #FFD700',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                      color: '#FFD700'
                    }}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{
            background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 className="text-sm font-medium mb-2" style={{color: '#FFD700'}}>Your Information (Auto-filled)</h3>
            <div className="text-sm space-y-1" style={{color: '#E6C55F'}}>
              <p><strong style={{color: '#FFD700'}}>User Type:</strong> {user?.userType === 'ecorecycler' ? 'EcoRecycler Partner' : user?.userType === 'ngo' ? 'NGO Partner' : 'General User'}</p>
              <p><strong style={{color: '#FFD700'}}>Name:</strong> {user?.organizationName || user?.fullName}</p>
              {user?.email && <p><strong style={{color: '#FFD700'}}>Email:</strong> {user.email}</p>}
              <p><strong style={{color: '#FFD700'}}>Phone:</strong> {user?.phone}</p>
              <p><strong style={{color: '#FFD700'}}>WhatsApp:</strong> {user?.whatsapp}</p>
              <p><strong style={{color: '#FFD700'}}>Location:</strong> {user?.location.address}</p>
              {user?.description && <p><strong style={{color: '#FFD700'}}>About:</strong> {user.description}</p>}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 text-white py-3 px-4 rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 font-bold"
              style={{
                background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
              }}
            >
              {initialData ? 'Update Item' : 'Post Item'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 font-bold"
              style={{
                background: 'linear-gradient(135deg, #4A4A4A, #2D2D2D)',
                border: '2px solid #666',
                boxShadow: '0 4px 15px rgba(74, 74, 74, 0.3)',
                color: 'white'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};