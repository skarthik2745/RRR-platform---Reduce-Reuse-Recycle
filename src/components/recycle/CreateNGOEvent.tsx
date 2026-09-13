import React, { useState } from 'react';
import { X, Upload, Calendar, MapPin, Users } from 'lucide-react';
import { NGOEvent } from '../../types';
import { useAuth } from '../auth/AuthContext';

interface CreateNGOEventProps {
  onSubmit: (event: Omit<NGOEvent, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  initialData?: any;
}

export const CreateNGOEvent: React.FC<CreateNGOEventProps> = ({ onSubmit, onClose, initialData }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: initialData?.event_title || '',
    ngoName: initialData?.ngo_name || user?.organizationName || user?.fullName || '',
    contactPerson: initialData?.contact_info?.split(',')[0] || user?.fullName || '',
    phone: initialData?.contact_info?.split(',')[1] || user?.phone || '',
    whatsapp: initialData?.contact_info?.split(',')[2] || user?.whatsapp || '',
    eventDate: initialData?.event_date ? new Date(initialData.event_date).toISOString().split('T')[0] : '',
    eventTime: initialData?.event_date ? new Date(initialData.event_date).toTimeString().slice(0, 5) : '',
    venue: initialData?.location || '',
    description: initialData?.description || '',
    images: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newEvent: Omit<NGOEvent, 'id' | 'createdAt'> = {
      title: formData.title,
      ngoId: user.id,
      ngoName: formData.ngoName,
      ngoLogo: user.profilePhoto || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop',
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime,
      venue: formData.venue,
      location: {
        lat: user.location.lat,
        lng: user.location.lng,
        address: formData.venue
      },
      description: formData.description,
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
      // Auto-filled user profile information
      userEmail: user.email,
      userDescription: user.description,
      userMission: user.mission,
      userWebsite: user.website
    };

    onSubmit(newEvent);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, result]
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-popupIn" style={{
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
          }}>{initialData ? 'Edit NGO Event' : 'Create NGO Event'}</h2>
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
            .ngo-form label { color: #FFD700 !important; }
            .ngo-form input, .ngo-form textarea, .ngo-form select {
              background: linear-gradient(135deg, #1A1A1A, #2D5016) !important;
              border: 2px solid #FFD700 !important;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4) !important;
              color: #FFD700 !important;
            }
            .ngo-form input::placeholder, .ngo-form textarea::placeholder {
              color: #999 !important;
            }
            .ngo-form input[type="date"]::-webkit-calendar-picker-indicator,
            .ngo-form input[type="time"]::-webkit-calendar-picker-indicator {
              filter: brightness(0) saturate(100%) invert(84%) sepia(58%) saturate(2500%) hue-rotate(2deg) brightness(104%) contrast(97%);
              cursor: pointer;
            }
          `}</style>
          <div className="ngo-form">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Community Plastic Collection Drive"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NGO Name *
            </label>
            <input
              type="text"
              value={formData.ngoName}
              onChange={(e) => setFormData(prev => ({ ...prev, ngoName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Your NGO Name"
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Contact Person Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Phone Number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number *
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="WhatsApp Number"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#FFD700'}} size={16} />
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time *
              </label>
              <input
                type="time"
                value={formData.eventTime}
                onChange={(e) => setFormData(prev => ({ ...prev, eventTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue / Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#FFD700'}} size={16} />
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Central Park, New Delhi"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Describe the event, its purpose, and what participants can expect..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Images *
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{
              borderColor: '#FFD700',
              background: 'rgba(255, 215, 0, 0.1)'
            }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="event-image-upload"
              />
              <label htmlFor="event-image-upload" className="cursor-pointer">
                <Upload className="mx-auto mb-2" style={{color: '#FFD700'}} size={48} />
                <p style={{color: '#FFD700'}}>Click to upload event images</p>
                <p className="text-sm" style={{color: '#E6C55F'}}>Banners, posters, event photos</p>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Images ({formData.images.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Event image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
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
              {initialData ? 'Update Event' : 'Create Event'}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};