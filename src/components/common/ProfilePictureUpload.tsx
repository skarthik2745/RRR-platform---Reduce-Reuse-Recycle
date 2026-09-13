import React, { useState } from 'react';
import { Camera, Upload, User, X } from 'lucide-react';

interface ProfilePictureUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photo: string) => void;
  size?: 'small' | 'medium' | 'large';
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  currentPhoto, 
  onPhotoChange, 
  size = 'medium' 
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string>('');

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewPhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (previewPhoto) {
      onPhotoChange(previewPhoto);
      setShowUploadModal(false);
      setPreviewPhoto('');
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange('');
    setShowUploadModal(false);
    setPreviewPhoto('');
  };

  const predefinedAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
  ];

  return (
    <>
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer`}
             onClick={() => setShowUploadModal(true)}>
          {currentPhoto ? (
            <img 
              src={currentPhoto} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <User className="text-gray-400" size={size === 'large' ? 32 : size === 'medium' ? 24 : 16} />
            </div>
          )}
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="absolute bottom-0 right-0 p-2 rounded-full text-white transition-all duration-500 hover:scale-110 hover:brightness-125 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #B8860B, #DAA520)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
          }}
        >
          <Camera size={16} />
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="max-w-md w-full p-6 shadow-2xl animate-popupIn" style={{
            background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
            border: '3px solid #FFD700',
            borderRadius: '20px',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
          }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{
                color: '#FFD700',
                fontFamily: 'Poppins, Montserrat',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
              }}>Update Profile Picture</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{
                  background: 'rgba(255, 215, 0, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <X size={16} style={{color: '#1A1A1A'}} />
              </button>
            </div>

            {/* Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>
                Upload from Device
              </label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{
                borderColor: '#FFD700',
                background: 'rgba(255, 215, 0, 0.1)'
              }}>
                <Upload className="mx-auto mb-2" style={{color: '#FFD700'}} size={24} />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
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
                    Choose File
                  </button>
                </div>
                <p className="text-xs mt-3" style={{color: '#E6C55F'}}>Max size: 5MB</p>
              </div>
            </div>

            {/* Preview */}
            {previewPhoto && (
              <div className="mb-6 text-center">
                <img 
                  src={previewPhoto} 
                  alt="Preview" 
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gray-200"
                />
              </div>
            )}



            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleSavePhoto}
                disabled={!previewPhoto}
                className="flex-1 text-white py-3 px-4 rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                }}
              >
                Save Photo
              </button>
              {currentPhoto && (
                <button
                  onClick={handleRemovePhoto}
                  className="px-4 py-3 text-white rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #8B0000, #A52A2A)',
                    border: '2px solid #DC143C',
                    boxShadow: '0 4px 15px rgba(139, 0, 0, 0.4)'
                  }}
                >
                  Remove
                </button>
              )}
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-3 text-white rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 font-bold"
                style={{
                  background: 'linear-gradient(135deg, #4A4A4A, #2D2D2D)',
                  border: '2px solid #666',
                  boxShadow: '0 4px 15px rgba(74, 74, 74, 0.3)'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};