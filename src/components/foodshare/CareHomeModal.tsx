import React, { useState } from 'react';
import { X, Phone, MessageCircle, Mail, Users, MapPin, Clock } from 'lucide-react';

interface CareHome {
  id: string;
  organizationName: string;
  type: 'Orphanage' | 'Old Age Home' | 'Shelter' | 'NGO';
  address: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  residents: number;
  dailyRequirements: string;
  description: string;
  images: string[];
  createdAt: Date;
}

interface CareHomeModalProps {
  careHome: CareHome;
  onClose: () => void;
}

export const CareHomeModal: React.FC<CareHomeModalProps> = ({ careHome, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-popupIn" style={{
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
            }}>{careHome.organizationName}</h2>
            <button
              onClick={onClose}
              className="p-3 rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: 'rgba(255, 215, 0, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <X size={24} style={{color: '#1A1A1A'}} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <img
                    src={careHome.images[selectedImageIndex]}
                    alt={careHome.organizationName}
                    className="w-full h-64 object-cover rounded-lg cursor-pointer"
                    onClick={() => setShowFullScreen(true)}
                  />
                  {careHome.images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {careHome.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${careHome.organizationName} ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg cursor-pointer border-2"
                          style={{
                            borderColor: selectedImageIndex === index ? '#FFD700' : 'rgba(255, 215, 0, 0.3)'
                          }}
                          onClick={() => setSelectedImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
                      background: 'rgba(255, 215, 0, 0.2)',
                      color: '#FFD700',
                      border: '1px solid #FFD700'
                    }}>
                      {careHome.type}
                    </span>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="mr-2 mt-1" style={{color: '#FFD700'}} size={18} />
                    <div>
                      <p className="font-bold" style={{color: '#FFD700'}}>Address</p>
                      <p style={{color: '#E6C55F'}}>{careHome.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="mr-2 mt-1" style={{color: '#FFD700'}} size={18} />
                    <div>
                      <p className="font-bold" style={{color: '#FFD700'}}>Residents</p>
                      <p style={{color: '#E6C55F'}}>{careHome.residents} people</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="mr-2 mt-1" style={{color: '#FFD700'}} size={18} />
                    <div>
                      <p className="font-bold" style={{color: '#FFD700'}}>Daily Food Requirements</p>
                      <p style={{color: '#E6C55F'}}>{careHome.dailyRequirements}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-6 rounded-xl mb-6" style={{
                  background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                }}>
                  <h3 className="text-xl font-bold mb-4" style={{
                    color: '#FFD700',
                    textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                  }}>Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold" style={{color: '#FFD700'}}>Contact Person</p>
                      <p style={{color: '#E6C55F'}}>{careHome.contactPerson}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => window.open(`tel:${careHome.phone}`)}
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
                        onClick={() => window.open(`https://wa.me/${careHome.whatsapp.replace(/[^0-9]/g, '')}`)}
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
                      onClick={() => window.open(`mailto:${careHome.email}`)}
                      className="w-full text-white py-3 px-4 rounded-lg transition-all duration-500 hover:scale-110 hover:brightness-125 flex items-center justify-center font-bold"
                      style={{
                        background: '#4A4A4A',
                        boxShadow: '0 4px 15px rgba(74, 74, 74, 0.4)'
                      }}
                    >
                      <Mail size={18} className="mr-2" />
                      Email
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-xl" style={{
                  background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                }}>
                  <h3 className="text-xl font-bold mb-4" style={{
                    color: '#FFD700',
                    textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                  }}>About</h3>
                  <p className="leading-relaxed" style={{color: '#E6C55F'}}>{careHome.description}</p>
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
            src={careHome.images[selectedImageIndex]}
            alt={careHome.organizationName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
};