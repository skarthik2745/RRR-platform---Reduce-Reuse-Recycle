import React from 'react';
import { X, Phone, MessageCircle, MapPin, Clock, Truck, Star, Image } from 'lucide-react';
import { ShopProfile } from '../../types';

interface ShopModalProps {
  shop: ShopProfile;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ shop, onClose }) => {
  const handleCall = () => {
    window.open(`tel:${shop.phone}`, '_self');
  };

  const handleWhatsApp = () => {
    const message = `Hi! I have some recyclable materials and would like to know more about your services at ${shop.shopName}.`;
    window.open(`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleLocation = () => {
    window.open(`https://maps.google.com/?q=${shop.location.lat},${shop.location.lng}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-popupIn" style={{
        background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
        border: '3px solid #FFD700',
        borderRadius: '20px',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
      }}>
        {/* Header */}
        <div className="relative p-6" style={{
          background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
          borderBottom: '2px solid #FFD700',
          borderRadius: '17px 17px 0 0'
        }}>
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
          <div className="text-center">
            <div className="inline-block px-4 py-2 rounded-full mb-4" style={{
              background: 'rgba(255, 215, 0, 0.9)',
              backdropFilter: 'blur(10px)'
            }}>
              <span className="text-sm font-bold" style={{color: '#1A1A1A'}}>ECORECYCLER PARTNER</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Shop Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3" style={{
              color: '#FFD700',
              fontFamily: 'Poppins, Montserrat',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
            }}>{shop.shopName}</h1>
            <p className="text-xl mb-3" style={{color: '#E6C55F'}}>Owner: {shop.ownerName}</p>
            <div className="flex items-center justify-center">
              <Star className="mr-2" style={{color: '#FFD700'}} size={20} />
              <span className="font-semibold" style={{color: 'white'}}>Verified EcoRecycler Partner</span>
            </div>
          </div>

          {/* Shop Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="p-4 rounded-lg" style={{
                background: '#0E2B19',
                border: '2px solid #FFD700',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <div className="flex items-start mb-4">
                  <MapPin className="mr-3 mt-1" style={{color: '#FFD700'}} size={20} />
                  <div>
                    <p className="font-semibold" style={{color: '#FFD700'}}>Address</p>
                    <p style={{color: '#FFD700'}}>{shop.address}</p>
                    <button
                      onClick={handleLocation}
                      className="text-sm mt-1 hover:underline"
                      style={{color: '#FFD700'}}
                    >
                      View on Map →
                    </button>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <Clock className="mr-3" style={{color: '#FFD700'}} size={20} />
                  <div>
                    <p className="font-semibold" style={{color: '#FFD700'}}>Timings</p>
                    <p style={{color: '#E6C55F'}}>{shop.timings || 'Contact for timings'}</p>
                  </div>
                </div>

                {shop.pickupAvailable && (
                  <div className="flex items-center">
                    <Truck className="mr-3" style={{color: '#FFD700'}} size={20} />
                    <div>
                      <p className="font-semibold" style={{color: '#FFD700'}}>Pickup Service</p>
                      <p style={{color: '#E6C55F'}}>Available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-xl" style={{
              background: '#0E2B19',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 className="font-bold mb-6 text-center" style={{
                color: '#FFD700',
                fontSize: '22px',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
              }}>Complete Partner Information</h3>
              <div className="space-y-4 mb-6">
                {/* Partner Details */}
                <div className="p-4 rounded-lg mb-4" style={{
                  background: '#0E2B19',
                  border: '2px solid #FFD700',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  <h4 className="font-bold mb-3" style={{
                    color: '#FFD700',
                    fontSize: '18px'
                  }}>Partner Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium" style={{color: '#E6C55F'}}>Shop Name:</span>
                      <span className="ml-2" style={{color: '#FFD700'}}>{shop.shopName}</span>
                    </div>
                    <div>
                      <span className="font-medium" style={{color: '#E6C55F'}}>Owner Name:</span>
                      <span className="ml-2" style={{color: '#FFD700'}}>{shop.ownerName}</span>
                    </div>
                    {shop.userEmail && (
                      <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="ml-2 text-gray-800">{shop.userEmail}</span>
                      </div>
                    )}

                  </div>
                </div>

                {/* Service Information */}
                <div className="p-4 rounded-lg mb-4" style={{
                  background: '#0E2B19',
                  border: '2px solid #FFD700',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  <h4 className="font-bold mb-3" style={{
                    color: '#FFD700',
                    fontSize: '18px'
                  }}>Service Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Clock className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span className="font-semibold" style={{color: '#FFD700'}}>Working Hours:</span>
                      <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{shop.timings}</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span className="font-semibold" style={{color: '#FFD700'}}>Pick-up Available:</span>
                      <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{shop.pickupAvailable ? 'Yes' : 'No'}</span>
                    </div>
                    {shop.userDescription && (
                      <div>
                        <span className="font-semibold" style={{color: '#FFD700'}}>About:</span>
                        <p className="mt-1" style={{color: '#E6C55F', fontSize: '15px'}}>{shop.userDescription}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-4 rounded-lg" style={{
                  background: '#0E2B19',
                  border: '2px solid #FFD700',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  <h4 className="font-bold mb-3" style={{
                    color: '#FFD700',
                    fontSize: '18px'
                  }}>Contact Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Phone className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span className="font-semibold" style={{color: '#FFD700'}}>Phone:</span>
                      <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{shop.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span className="font-semibold" style={{color: '#FFD700'}}>WhatsApp:</span>
                      <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{shop.whatsapp}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleCall}
                  className="w-full text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-bold hover:scale-105 hover:brightness-110 mb-3"
                  style={{
                    background: '#CFAF4C',
                    boxShadow: '0 4px 15px rgba(207, 175, 76, 0.4)'
                  }}
                >
                  <Phone className="mr-2" size={18} />
                  Call Now
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="w-full text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-bold hover:scale-105 hover:brightness-110 mb-3"
                  style={{
                    background: '#075E36',
                    boxShadow: '0 4px 15px rgba(7, 94, 54, 0.4)'
                  }}
                >
                  <MessageCircle className="mr-2" size={18} />
                  WhatsApp
                </button>
                <button
                  onClick={handleLocation}
                  className="w-full text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-bold hover:scale-105 hover:brightness-110"
                  style={{
                    background: '#8B0000',
                    boxShadow: '0 4px 15px rgba(139, 0, 0, 0.4)'
                  }}
                >
                  <MapPin className="mr-2" size={18} />
                  Get Directions
                </button>
              </div>
            </div>
          </div>

          {/* Accepted Materials */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4" style={{color: '#FFD700', textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'}}>Accepted Materials</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {shop.acceptedMaterials.map((material, index) => (
                <div key={index} className="px-3 py-2 rounded-lg text-sm font-medium text-center" style={{
                  background: '#0E2B19',
                  border: '2px solid #FFD700',
                  color: '#FFD700'
                }}>
                  {material}
                </div>
              ))}
            </div>
          </div>

          {/* Rates */}
          {Object.keys(shop.rates).length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4" style={{color: '#FFD700', textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'}}>Current Rates (₹/kg)</h3>
              <div className="rounded-xl p-6" style={{
                background: '#0E2B19',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
              }}>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(shop.rates).map(([material, rate]) => (
                    <div key={material} className="flex justify-between items-center py-2 border-b last:border-b-0" style={{borderColor: '#FFD700'}}>
                      <span style={{color: '#E6C55F'}}>{material}</span>
                      <span className="font-semibold" style={{color: '#FFD700'}}>₹{rate}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-4" style={{color: '#E6C55F'}}>
                  * Rates may vary based on quality and quantity. Contact for current pricing.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {shop.description && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3" style={{color: '#FFD700', textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'}}>About Us</h3>
              <div className="p-4 rounded-lg" style={{
                background: '#0E2B19',
                border: '2px solid #FFD700'
              }}>
                <p className="leading-relaxed" style={{color: '#E6C55F'}}>{shop.description}</p>
              </div>
            </div>
          )}

          {/* Image Gallery */}
          {shop.images.length > 1 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Image className="mr-2" size={20} />
                Shop Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {shop.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Shop image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="p-6 rounded-xl text-center" style={{
            background: '#0E2B19',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 className="text-lg font-bold mb-2" style={{
              color: '#FFD700',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
            }}>Ready to Recycle?</h3>
            <p className="mb-4" style={{color: '#E6C55F'}}>
              Contact {shop.shopName} to discuss your recyclable materials and get the best rates.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCall}
                className="text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center font-bold hover:scale-105 hover:brightness-110"
                style={{
                  background: '#CFAF4C',
                  boxShadow: '0 4px 12px rgba(207, 175, 76, 0.4)'
                }}
              >
                <Phone className="mr-2" size={16} />
                Call Now
              </button>
              <button
                onClick={handleWhatsApp}
                className="text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center font-bold hover:scale-105 hover:brightness-110"
                style={{
                  background: '#075E36',
                  boxShadow: '0 4px 12px rgba(7, 94, 54, 0.4)'
                }}
              >
                <MessageCircle className="mr-2" size={16} />
                Contact via WhatsApp
              </button>
              <button
                onClick={handleLocation}
                className="text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center font-bold hover:scale-105 hover:brightness-110"
                style={{
                  background: '#8B0000',
                  boxShadow: '0 4px 12px rgba(139, 0, 0, 0.4)'
                }}
              >
                <MapPin className="mr-2" size={16} />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};