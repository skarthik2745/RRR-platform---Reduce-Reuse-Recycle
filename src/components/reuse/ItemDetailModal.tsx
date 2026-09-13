import React, { useState } from 'react';
import { X, Phone, MessageCircle, MapPin, Share2, Tag, User, Calendar, Mail, Building } from 'lucide-react';
import { ImageViewer } from '../recycle/ImageViewer';
import { ReuseItem } from '../../types';

interface ItemDetailModalProps {
  item: ReuseItem;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  // Support legacy single photo format
  const itemPhotos = item.photos || (item.photo ? [item.photo] : []);
  const handleCall = () => {
    window.open(`tel:${item.phone}`, '_self');
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in your ${item.name} posted on RRR platform.`;
    window.open(`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleLocation = () => {
    window.open(`https://maps.google.com/?q=${item.location.lat},${item.location.lng}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: item.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like-new':
        return 'bg-emerald-100 text-emerald-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'used':
        return 'bg-yellow-100 text-yellow-800';
      case 'slightly-damaged':
        return 'bg-orange-100 text-orange-800';
      case 'heavy-used':
        return 'bg-red-100 text-red-800';
      case 'other':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-popupIn" style={{
        background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
        border: '3px solid #FFD700',
        borderRadius: '20px',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
      }}>
        {/* Header */}
        <div className="relative">
          <img
            src={itemPhotos[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'}
            alt={item.name}
            className="w-full h-64 object-cover rounded-t-2xl cursor-pointer"
            onClick={() => setSelectedImageIndex(0)}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: 'rgba(255, 215, 0, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <X size={20} style={{color: '#1A1A1A'}} />
          </button>
          <div className="absolute top-4 left-4">
            {item.isFree ? (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                FREE
              </span>
            ) : (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ₹{item.price?.toLocaleString()}
              </span>
            )}
          </div>
          {itemPhotos.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-sm">
              +{itemPhotos.length - 1} more
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-3" style={{
                color: '#FFD700',
                fontFamily: 'Poppins, Montserrat',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
              }}>{item.name}</h2>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  color: '#FFD700',
                  border: '1px solid #FFD700'
                }}>
                  {item.condition.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  color: '#FFD700',
                  border: '1px solid #FFD700'
                }}>
                  {item.category}
                </span>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="p-3 rounded-full transition-all duration-500 hover:scale-110 hover:brightness-125"
              style={{
                background: '#4A4A4A',
                boxShadow: '0 4px 12px rgba(74, 74, 74, 0.4)'
              }}
            >
              <Share2 size={20} style={{color: 'white'}} />
            </button>
          </div>

          {/* Item Images Gallery */}
          {itemPhotos.length > 1 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Item Photos ({itemPhotos.length})</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {itemPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`${item.name} ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                      onClick={() => setSelectedImageIndex(index)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Click on any image to view in full screen
              </p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3" style={{
              color: '#FFD700',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
            }}>Description</h3>
            <p className="leading-relaxed" style={{color: '#E6C55F'}}>{item.description}</p>
          </div>

          {/* Posted By Information */}
          <div className="rounded-xl p-6 mb-6" style={{
            background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 className="text-xl font-bold mb-4" style={{
              color: '#FFD700',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
            }}>Posted By</h3>
            <div className="space-y-4">
              {/* User Details */}
              <div className="p-4 rounded-lg" style={{
                background: '#0E2B19',
                border: '2px solid #FFD700',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <h4 className="font-bold mb-3" style={{
                  color: '#FFD700',
                  fontSize: '18px'
                }}>User Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User style={{color: '#FFD700'}} className="mr-2" size={14} />
                    <span className="font-medium" style={{color: '#E6C55F'}}>Name:</span>
                    <span className="ml-2" style={{color: '#FFD700'}}>{item.userName}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag style={{color: '#FFD700'}} className="mr-2" size={14} />
                    <span className="font-medium" style={{color: '#E6C55F'}}>User Type:</span>
                    <span className="ml-2 capitalize" style={{color: '#FFD700'}}>
                      {item.userType === 'ecorecycler' ? 'EcoRecycler Partner' : item.userType === 'ngo' ? 'NGO Partner' : 'General User'}
                    </span>
                  </div>
                  {item.organizationName && (
                    <div className="flex items-center">
                      <Building className="mr-2" style={{color: '#FFD700'}} size={14} />
                      <span className="font-medium" style={{color: '#E6C55F'}}>Organization:</span>
                      <span className="ml-2" style={{color: '#FFD700'}}>{item.organizationName}</span>
                    </div>
                  )}
                  {item.userEmail && (
                    <div className="flex items-center">
                      <Mail className="mr-2" style={{color: '#FFD700'}} size={14} />
                      <span className="font-medium" style={{color: '#E6C55F'}}>Email:</span>
                      <span className="ml-2" style={{color: '#FFD700'}}>{item.userEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Phone className="mr-2" style={{color: '#FFD700'}} size={14} />
                    <span className="font-medium" style={{color: '#E6C55F'}}>Phone:</span>
                    <span className="ml-2" style={{color: '#FFD700'}}>{item.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mr-2 mt-0.5" style={{color: '#FFD700'}} size={14} />
                    <div>
                      <span className="font-medium" style={{color: '#E6C55F'}}>Location:</span>
                      <span className="ml-2" style={{color: '#FFD700'}}>{item.location.address}</span>
                    </div>
                  </div>
                  {item.userDescription && (
                    <div>
                      <span className="font-medium" style={{color: '#E6C55F'}}>About:</span>
                      <p className="mt-1" style={{color: '#FFD700'}}>{item.userDescription}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Details */}
              <div className="p-4 rounded-lg" style={{
                background: '#0E2B19',
                border: '2px solid #FFD700',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <h4 className="font-bold mb-3" style={{
                  color: '#FFD700',
                  fontSize: '18px'
                }}>Post Information</h4>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2" style={{color: '#FFD700'}} size={14} />
                  <span className="font-medium" style={{color: '#E6C55F'}}>Posted on:</span>
                  <span className="ml-2" style={{color: '#FFD700'}}>{item.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleCall}
              className="flex items-center justify-center px-4 py-3 text-white rounded-xl transition-all duration-500 hover:scale-110 hover:brightness-125 font-bold"
              style={{
                background: '#CFAF4C',
                boxShadow: '0 4px 15px rgba(207, 175, 76, 0.4)'
              }}
            >
              <Phone size={18} className="mr-2" />
              Call
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center px-4 py-3 text-white rounded-xl transition-all duration-500 hover:scale-110 hover:brightness-125 font-bold"
              style={{
                background: '#075E36',
                boxShadow: '0 4px 15px rgba(7, 94, 54, 0.4)'
              }}
            >
              <MessageCircle size={18} className="mr-2" />
              WhatsApp
            </button>
            <button
              onClick={handleLocation}
              className="flex items-center justify-center px-4 py-3 text-white rounded-xl transition-all duration-500 hover:scale-110 hover:brightness-125 font-bold"
              style={{
                background: '#8B0000',
                boxShadow: '0 4px 15px rgba(139, 0, 0, 0.4)'
              }}
            >
              <MapPin size={18} className="mr-2" />
              Location
            </button>
          </div>
        </div>

        {/* Image Viewer */}
        {selectedImageIndex !== null && (
          <ImageViewer
            images={itemPhotos}
            currentIndex={selectedImageIndex}
            onClose={() => setSelectedImageIndex(null)}
            onNext={() => setSelectedImageIndex((selectedImageIndex + 1) % itemPhotos.length)}
            onPrev={() => setSelectedImageIndex((selectedImageIndex - 1 + itemPhotos.length) % itemPhotos.length)}
          />
        )}
      </div>
    </div>
  );
};