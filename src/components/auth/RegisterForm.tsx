import React, { useState } from 'react';
import { User } from '../../types';
import { useAuth } from './AuthContext';
import { signUp, createProfile } from '../../lib/auth';
import { Leaf, Recycle } from 'lucide-react';
import { ProfilePictureUpload } from '../common/ProfilePictureUpload';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    userType: 'general' as 'general' | 'ecorecycler' | 'ngo',
    password: '',
    confirmPassword: '',
    profilePhoto: '',
    // EcoRecycler fields
    shopName: '',
    shopAddress: '',
    acceptedMaterials: '',
    // NGO fields
    ngoName: '',
    ngoRegistration: '',
    ngoAddress: '',
    contactPerson: '',
    ngoContact: '',
    ngoDescription: ''
  });
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    const { data, error } = await signUp(formData.email || formData.phone, formData.password, {
      full_name: formData.fullName,
      phone: formData.phone,
      user_type: formData.userType
    });
    
    if (error) {
      alert('Registration failed: ' + error.message);
      return;
    }
    
    if (data.user) {
      await createProfile(data.user.id, {
        username: formData.fullName.toLowerCase().replace(/\s+/g, '_'),
        full_name: formData.fullName,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        user_type: formData.userType,
        organization_name: formData.userType === 'ngo' ? formData.ngoName : formData.userType === 'ecorecycler' ? formData.shopName : null,
        location: {
          address: formData.address,
          lat: 28.6139,
          lng: 77.2090
        },
        description: formData.userType === 'ngo' ? formData.ngoDescription : null,
        profile_photo: formData.profilePhoto,
        accepted_items: formData.userType === 'ecorecycler' ? formData.acceptedMaterials.split(',').map(item => item.trim()) : null,
        bio: `${formData.userType} user`,
        total_points: 0
      });
      
      const newUser: User = {
        id: data.user.id,
        fullName: formData.fullName,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        profilePhoto: formData.profilePhoto,
        location: {
          lat: 28.6139,
          lng: 77.2090,
          address: formData.address
        },
        userType: formData.userType,
        ecoBadges: [],
        challengeHistory: []
      };
      login(newUser);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #1A1A1A, #0E2B19)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <div className="max-w-2xl w-full p-8 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto" style={{
        background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
        border: '3px solid #FFD700',
        borderRadius: '20px',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
      }}>
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="relative p-1 rounded-2xl mx-auto" style={{
              width: '280px',
              background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700, #DAA520)',
              backgroundSize: '400% 400%',
              animation: 'gradient 3s ease infinite',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.4)'
            }}>
              <img 
                src="./WhatsApp Image 2025-11-20 at 22.03.04_d3c7e71e.jpg" 
                alt="RRR Platform" 
                className="w-full h-40 object-cover rounded-xl"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{
            color: '#FFD700',
            fontFamily: 'Poppins, Montserrat',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.5)'
          }}>Join RRR Community</h1>
          <p className="text-lg" style={{
            color: '#E6C55F',
            fontFamily: 'Poppins, Montserrat'
          }}>Reduce • Reuse • Recycle</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <ProfilePictureUpload
              currentPhoto={formData.profilePhoto}
              onPhotoChange={(photo) => setFormData(prev => ({ ...prev, profilePhoto: photo }))}
              size="large"
            />
            <p className="text-sm mt-2" style={{color: '#E6C55F'}}>Add a profile picture</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>WhatsApp Number</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
                placeholder="Enter WhatsApp number"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Email (Optional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
              placeholder="Enter your address"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>User Type</label>
            <select
              value={formData.userType}
              onChange={(e) => setFormData({...formData, userType: e.target.value as 'general' | 'ecorecycler' | 'ngo'})}
              className="w-full px-4 py-3 rounded-lg focus:outline-none"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
            >
              <option value="general" style={{background: '#1A1A1A', color: '#FFD700'}}>General User</option>
              <option value="ecorecycler" style={{background: '#1A1A1A', color: '#FFD700'}}>EcoRecycler Partner</option>
              <option value="ngo" style={{background: '#1A1A1A', color: '#FFD700'}}>NGO Partner</option>
            </select>
          </div>
        {/* Additional Fields Based on User Type */}
          {formData.userType === 'ecorecycler' && (
            <div className="p-4 rounded-lg" style={{
              background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 className="text-lg font-semibold mb-3" style={{color: '#FFD700'}}>EcoRecycler Partner Details</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Shop Name"
                  value={formData.shopName}
                  onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                  style={{
                    background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    color: '#FFD700'
                  }}
                />
                <input
                  type="text"
                  placeholder="Shop Address"
                  value={formData.shopAddress}
                  onChange={(e) => setFormData({...formData, shopAddress: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                  style={{
                    background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    color: '#FFD700'
                  }}
                />
                <textarea
                  placeholder="Materials Accepted (comma separated)"
                  value={formData.acceptedMaterials}
                  onChange={(e) => setFormData({...formData, acceptedMaterials: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                  style={{
                    background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    color: '#FFD700'
                  }}
                  rows={2}
                />
              </div>
            </div>
          )}

          {formData.userType === 'ngo' && (
            <div className="p-4 rounded-lg" style={{
              background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 className="text-lg font-semibold mb-3" style={{color: '#FFD700'}}>NGO Partner Details</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="NGO Name"
                  value={formData.ngoName}
                  onChange={(e) => setFormData({...formData, ngoName: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                  style={{
                    background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    color: '#FFD700'
                  }}
                />
                <input
                  type="text"
                  placeholder="NGO Registration Number"
                  value={formData.ngoRegistration}
                  onChange={(e) => setFormData({...formData, ngoRegistration: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                  style={{
                    background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    color: '#FFD700'
                  }}
                />
                <input
                  type="text"
                  placeholder="NGO Address"
                  value={formData.ngoAddress}
                  onChange={(e) => setFormData({...formData, ngoAddress: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                  style={{
                    background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    color: '#FFD700'
                  }}
                />
                <input
                  type="text"
                  placeholder="Contact Person Name"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                  style={{
                    background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    color: '#FFD700'
                  }}
                />
                <input
                  type="tel"
                  placeholder="NGO Contact Number"
                  value={formData.ngoContact}
                  onChange={(e) => setFormData({...formData, ngoContact: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                  style={{
                    background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    color: '#FFD700'
                  }}
                />
                <textarea
                  placeholder="About NGO / Description"
                  value={formData.ngoDescription}
                  onChange={(e) => setFormData({...formData, ngoDescription: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                  style={{
                    background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    color: '#FFD700'
                  }}
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
                placeholder="Enter password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
                style={{
                  background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  color: '#FFD700'
                }}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full text-white py-4 px-6 rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, #B8860B, #DAA520)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            }}
          >
            Join RRR Community
          </button>
      </form>
        <p className="mt-6 text-center text-sm" style={{color: '#E6C55F'}}>
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="font-medium transition-colors duration-300 hover:brightness-125"
            style={{color: '#FFD700'}}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};