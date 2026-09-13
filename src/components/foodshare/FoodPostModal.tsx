import React, { useState } from 'react';
import { X, Phone, MessageCircle, Mail, MapPin, Clock, Calendar, Navigation } from 'lucide-react';

interface FoodPost {
  id: string;
  eventName: string;
  quantity: string;
  foodType: string;
  pickupLocation: string;
  bestBefore: Date;
  notes: string;
  images: string[];
  userName: string;
  phone: string;
  whatsapp: string;
  userEmail: string;
  createdAt: Date;
}

interface FoodPostModalProps {
  foodPost: FoodPost;
  onClose: () => void;
}

export const FoodPostModal: React.FC<FoodPostModalProps> = ({ foodPost, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const getTimeRemaining = (bestBefore: Date) => {
    const now = new Date();
    const diff = bestBefore.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff <= 0) return 'Expired';
    if (hours > 0) return `${hours} hours ${minutes} minutes`;
    return `${minutes} minutes`;
  };

  const getUrgencyColor = (bestBefore: Date) => {
    const now = new Date();
    const diff = bestBefore.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours <= 0) return 'text-red-600 bg-red-100';
    if (hours <= 2) return 'text-orange-600 bg-orange-100';
    if (hours <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-popupIn" style={{
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
            }}>{foodPost.eventName}</h2>
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

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <img
                    src={foodPost.images[selectedImageIndex]}
                    alt={foodPost.eventName}
                    className="w-full h-64 object-cover rounded-lg cursor-pointer"
                    onClick={() => setShowFullScreen(true)}
                  />
                  {foodPost.images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {foodPost.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${foodPost.eventName} ${index + 1}`}
                          className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                            selectedImageIndex === index ? 'border-green-500' : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl" style={{
                    background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                  }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock size={20} className="mr-2" style={{color: '#FFD700'}} />
                        <span className="font-semibold" style={{color: '#FFD700'}}>Time Remaining</span>
                      </div>
                      <span className="text-lg font-bold" style={{color: '#FFD700'}}>{getTimeRemaining(foodPost.bestBefore)}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl" style={{
                    background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                  }}>
                    <h3 className="font-semibold mb-3" style={{color: '#FFD700'}}>Food Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span style={{color: '#E6C55F'}}>Quantity:</span>
                        <span className="font-medium" style={{color: '#FFD700'}}>{foodPost.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{color: '#E6C55F'}}>Food Type:</span>
                        <span className="font-medium" style={{color: '#FFD700'}}>{foodPost.foodType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{color: '#E6C55F'}}>Best Before:</span>
                        <span className="font-medium" style={{color: '#FFD700'}}>{foodPost.bestBefore.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl" style={{
                    background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                  }}>
                    <h3 className="font-semibold mb-2" style={{color: '#FFD700'}}>Additional Notes</h3>
                    <p style={{color: '#E6C55F'}}>{foodPost.notes}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-6 rounded-xl mb-6" style={{
                  background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                }}>
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#FFD700'}}>Pickup Information</h3>
                  
                  <div className="flex items-start mb-4">
                    <MapPin style={{color: '#FFD700'}} className="mr-2 mt-1" size={18} />
                    <div>
                      <p className="font-medium" style={{color: '#FFD700'}}>Pickup Location</p>
                      <p style={{color: '#E6C55F'}}>{foodPost.pickupLocation}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(foodPost.pickupLocation)}`)}
                    className="w-full text-white py-3 px-4 rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 flex items-center justify-center mb-4 font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                      border: '2px solid #FFD700',
                      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                    }}
                  >
                    <Navigation size={18} className="mr-2" />
                    Get Directions
                  </button>
                </div>

                <div className="p-6 rounded-xl" style={{
                  background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                }}>
                  <h3 className="text-lg font-semibold mb-3" style={{color: '#FFD700'}}>Contact Organizer</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium" style={{color: '#FFD700'}}>Contact Person</p>
                      <p style={{color: '#E6C55F'}}>{foodPost.userName}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => window.open(`tel:${foodPost.phone}`)}
                        className="flex-1 text-white py-3 px-4 rounded-lg transition-all duration-500 hover:scale-110 hover:brightness-125 flex items-center justify-center font-bold"
                        style={{
                          background: '#CFAF4C',
                          boxShadow: '0 4px 15px rgba(207, 175, 76, 0.4)'
                        }}
                      >
                        <Phone size={18} className="mr-2" />
                        Call
                      </button>
                      <button
                        onClick={() => window.open(`https://wa.me/${foodPost.whatsapp.replace(/[^0-9]/g, '')}`)}
                        className="flex-1 text-white py-3 px-4 rounded-lg transition-all duration-500 hover:scale-110 hover:brightness-125 flex items-center justify-center font-bold"
                        style={{
                          background: '#075E36',
                          boxShadow: '0 4px 15px rgba(7, 94, 54, 0.4)'
                        }}
                      >
                        <MessageCircle size={18} className="mr-2" />
                        WhatsApp
                      </button>
                    </div>
                    <button
                      onClick={() => window.open(`mailto:${foodPost.userEmail}`)}
                      className="w-full text-white py-3 px-4 rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 flex items-center justify-center font-bold"
                      style={{
                        background: '#8B0000',
                        boxShadow: '0 4px 15px rgba(139, 0, 0, 0.4)'
                      }}
                    >
                      <Mail size={18} className="mr-2" />
                      Email
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl" style={{
                  background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                }}>
                  <div className="flex items-center">
                    <Calendar style={{color: '#FFD700'}} className="mr-2" size={18} />
                    <span className="text-sm" style={{color: '#E6C55F'}}>
                      Posted {foodPost.createdAt.toLocaleDateString()} at {foodPost.createdAt.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60">
          <button
            onClick={() => setShowFullScreen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X size={32} />
          </button>
          <img
            src={foodPost.images[selectedImageIndex]}
            alt={foodPost.eventName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
};