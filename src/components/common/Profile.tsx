import React, { useState } from 'react';
import { User, Phone, MessageCircle, MapPin, Edit, Trophy, Calendar } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ProfilePictureUpload } from './ProfilePictureUpload';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    email: user?.email || '',
    address: user?.location.address || '',
    profilePhoto: user?.profilePhoto || '',
    description: user?.description || '',
    organizationName: user?.organizationName || '',
    mission: user?.mission || '',
    website: user?.website || '',
    acceptedItems: user?.acceptedItems || [],
    workingHours: user?.workingHours || '',
    pickupAvailable: user?.pickupAvailable || false
  });

  const handleSave = () => {
    if (user) {
      updateUser({
        fullName: formData.fullName,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        profilePhoto: formData.profilePhoto,
        description: formData.description,
        organizationName: formData.organizationName,
        mission: formData.mission,
        website: formData.website,
        acceptedItems: formData.acceptedItems,
        workingHours: formData.workingHours,
        pickupAvailable: formData.pickupAvailable,
        location: {
          ...user.location,
          address: formData.address
        }
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      whatsapp: user?.whatsapp || '',
      email: user?.email || '',
      address: user?.location.address || '',
      profilePhoto: user?.profilePhoto || '',
      description: user?.description || '',
      organizationName: user?.organizationName || '',
      mission: user?.mission || '',
      website: user?.website || '',
      acceptedItems: user?.acceptedItems || [],
      workingHours: user?.workingHours || '',
      pickupAvailable: user?.pickupAvailable || false
    });
    setIsEditing(false);
  };

  const handlePhotoChange = (photo: string) => {
    setFormData(prev => ({ ...prev, profilePhoto: photo }));
    if (!isEditing) {
      // Auto-save photo changes
      updateUser({ profilePhoto: photo });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen recycle-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="overflow-hidden" style={{
          background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
          border: '2px solid #FFD700',
          borderRadius: '20px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
        }}>
          {/* Header */}
          <div className="px-6 py-8" style={{
            background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
            borderBottom: '2px solid #FFD700'
          }}>
            <div className="text-center mb-8">
              <h1 className="text-6xl font-bold mb-4 gold-glow" style={{
                fontFamily: 'Poppins, Montserrat, Playfair Display',
                color: '#FFD700',
                textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)'
              }}>User Profile</h1>
              <p className="text-2xl" style={{
                color: '#E6C55F',
                fontFamily: 'Poppins, Montserrat',
                textShadow: '0 0 15px rgba(230, 197, 95, 0.4)'
              }}>Manage your account and eco journey</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4">
                  <ProfilePictureUpload
                    currentPhoto={user.profilePhoto}
                    onPhotoChange={handlePhotoChange}
                    size="large"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2" style={{color: '#FFD700'}}>{user.fullName}</h2>
                  <p className="text-xl capitalize" style={{color: '#E6C55F'}}>
                    {user.userType === 'ecorecycler' ? 'EcoRecycler Partner' : user.userType === 'ngo' ? 'NGO Partner' : 'General User'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-3 rounded-full transition-all duration-500 hover:scale-110 hover:rotate-12 hover:brightness-125"
                style={{
                  background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                }}
              >
                <Edit size={20} style={{color: 'white'}} />
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="p-6 rounded-xl transition-all duration-700 hover:scale-102 hover:-translate-y-2 hover:rotate-1" style={{
                background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.3), 0 0 25px rgba(255, 215, 0, 0.2)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              }}>
                <h2 className="text-2xl font-bold mb-6" style={{
                  color: '#FFD700',
                  textShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
                }}>Basic Information</h2>
              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1" style={{color: '#E6C55F'}}>User Type</label>
                  <div className="flex items-center">
                    <User className="text-blue-500 mr-2" size={16} />
                    <span className="capitalize font-medium" style={{color: '#FFD700'}}>
                      {user.userType === 'ecorecycler' ? 'EcoRecycler Partner' : user.userType === 'ngo' ? 'NGO Partner' : 'General User'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#E6C55F'}}>
                    {user.userType === 'ngo' ? 'Organization Name' : 'Name'}
                  </label>
                  {isEditing && user.userType === 'ngo' ? (
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                      style={{
                        background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                        border: '2px solid #FFD700',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                        color: '#FFD700'
                      }}
                      placeholder="Organization Name"
                    />
                  ) : isEditing ? (
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                      style={{
                        background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                        border: '2px solid #FFD700',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                        color: '#FFD700'
                      }}
                    />
                  ) : (
                    <div className="flex items-center">
                      <User className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span style={{color: '#FFD700'}}>
                        {user.userType === 'ngo' ? (user.organizationName || user.fullName) : user.fullName}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#E6C55F'}}>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                      style={{
                        background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                        border: '2px solid #FFD700',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                        color: '#FFD700'
                      }}
                    />
                  ) : (
                    <div className="flex items-center">
                      <MessageCircle className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span style={{color: '#FFD700'}}>{user.email || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#E6C55F'}}>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                      style={{
                        background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                        border: '2px solid #FFD700',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                        color: '#FFD700'
                      }}
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span style={{color: '#FFD700'}}>{user.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#E6C55F'}}>Address / Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                      style={{
                        background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                        border: '2px solid #FFD700',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                        color: '#FFD700'
                      }}
                    />
                  ) : (
                    <div className="flex items-center">
                      <MapPin className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span style={{color: '#FFD700'}}>{user.location.address}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#E6C55F'}}>Description / About</label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                      style={{
                        background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                        border: '2px solid #FFD700',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                        color: '#FFD700'
                      }}
                      placeholder="Tell us about yourself or your organization..."
                    />
                  ) : (
                    <p style={{color: '#FFD700'}}>{user.description || 'No description provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* User Type Specific Information */}
            {user.userType === 'ngo' && (
              <div className="p-6 rounded-xl transition-all duration-700 hover:scale-102 hover:-translate-y-2 hover:rotate-1" style={{
                background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.3), 0 0 25px rgba(255, 215, 0, 0.2)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              }}>
                <h2 className="text-2xl font-bold mb-6" style={{
                  color: '#FFD700',
                  textShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
                }}>NGO Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: '#E6C55F'}}>Mission</label>
                    {isEditing ? (
                      <textarea
                        value={formData.mission}
                        onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                        style={{
                          background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                          border: '2px solid #FFD700',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                          color: '#FFD700'
                        }}
                        placeholder="Your organization's mission..."
                      />
                    ) : (
                      <p style={{color: '#FFD700'}}>{user.mission || 'No mission statement provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: '#E6C55F'}}>Website</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                        style={{
                          background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                          border: '2px solid #FFD700',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                          color: '#FFD700'
                        }}
                        placeholder="https://your-website.com"
                      />
                    ) : (
                      <div className="flex items-center">
                        <span style={{color: '#FFD700'}}>
                          {user.website ? (
                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {user.website}
                            </a>
                          ) : (
                            'No website provided'
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {user.userType === 'ecorecycler' && (
              <div className="p-6 rounded-xl transition-all duration-700 hover:scale-102 hover:-translate-y-2 hover:rotate-1" style={{
                background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.3), 0 0 25px rgba(255, 215, 0, 0.2)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              }}>
                <h2 className="text-2xl font-bold mb-6" style={{
                  color: '#FFD700',
                  textShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
                }}>EcoRecycler Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: '#E6C55F'}}>Working Hours</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.workingHours}
                        onChange={(e) => setFormData(prev => ({ ...prev, workingHours: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md focus:outline-none placeholder-gray-400"
                        style={{
                          background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                          border: '2px solid #FFD700',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                          color: '#FFD700'
                        }}
                        placeholder="e.g., 9 AM - 6 PM"
                      />
                    ) : (
                      <p style={{color: '#FFD700'}}>{user.workingHours || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: '#E6C55F'}}>Pick-up Availability</label>
                    {isEditing ? (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.pickupAvailable}
                          onChange={(e) => setFormData(prev => ({ ...prev, pickupAvailable: e.target.checked }))}
                          className="mr-2"
                        />
                        <span style={{color: '#FFD700'}}>Pick-up service available</span>
                      </label>
                    ) : (
                      <p style={{color: '#FFD700'}}>{user.pickupAvailable ? 'Yes' : 'No'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="lg:col-span-3">
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={handleSave}
                    className="text-white px-8 py-3 rounded-lg transition-all duration-500 hover:scale-110 hover:brightness-125 font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                      border: '2px solid #FFD700',
                      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-white px-8 py-3 rounded-lg transition-all duration-500 hover:scale-110 hover:brightness-125 font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #4A4A4A, #2A2A2A)',
                      border: '2px solid #666',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

            {!isEditing && (
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-8" style={{
                  color: '#FFD700',
                  textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
                }}>Eco Achievements</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Eco Badges */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center" style={{color: '#FFD700'}}>
                      <Trophy className="mr-3" style={{color: '#FFD700'}} size={24} />
                      Eco Badges ({user.ecoBadges?.length || 0})
                    </h3>
                    {user.ecoBadges && user.ecoBadges.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.ecoBadges.map((badge, index) => (
                          <span key={index} className="text-2xl p-3 rounded-lg transition-all duration-500 hover:scale-110 hover:rotate-12" style={{
                            background: 'linear-gradient(135deg, #FFD700, #DAA520)',
                            border: '2px solid #FFD700',
                            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                            color: '#1A1A1A',
                            fontWeight: 'bold'
                          }}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p style={{color: '#E6C55F'}}>Complete challenges to earn your first eco badge!</p>
                    )}
                  </div>

                  {/* Challenge History */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center" style={{color: '#FFD700'}}>
                      <Calendar className="mr-3" style={{color: '#FFD700'}} size={24} />
                      Challenge History
                    </h3>
                    {user.challengeHistory && user.challengeHistory.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {user.challengeHistory.filter(c => c.completed).map((challenge) => (
                          <div key={challenge.id} className="p-4 rounded-lg transition-all duration-500 hover:scale-102 hover:-translate-y-1" style={{
                            background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                            border: '2px solid #FFD700',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold" style={{color: '#FFD700'}}>{challenge.title}</h4>
                              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{
                                background: 'rgba(255, 215, 0, 0.2)',
                                color: '#FFD700',
                                border: '1px solid #FFD700'
                              }}>
                                Week {challenge.week}
                              </span>
                            </div>
                            <p className="text-sm mb-2" style={{color: '#E6C55F'}}>{challenge.description}</p>
                            {challenge.proof && (
                              <p className="text-xs mt-1" style={{color: '#E6C55F'}}>
                                Proof: {challenge.proof.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{color: '#E6C55F'}}>No completed challenges yet. Start with this week's challenge!</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};