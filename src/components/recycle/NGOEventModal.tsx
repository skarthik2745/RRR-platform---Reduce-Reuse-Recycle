import React, { useState } from 'react';
import { X, Calendar, MapPin, MessageCircle, ExternalLink, Image, Phone, User } from 'lucide-react';
import { NGOEvent } from '../../types';
import { ImageViewer } from './ImageViewer';

interface NGOEventModalProps {
  event: NGOEvent;
  onClose: () => void;
}

export const NGOEventModal: React.FC<NGOEventModalProps> = ({ event, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in registering for the event "${event.title}" organized by ${event.ngoName}.`;
    window.open(`https://wa.me/${event.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${event.phone}`, '_self');
  };

  const handleLocation = () => {
    window.open(`https://maps.google.com/?q=${event.location.lat},${event.location.lng}`, '_blank');
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
        <div className="relative">
          <img
            src={event.images[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=300&fit=crop'}
            alt={event.title}
            className="w-full h-64 object-cover"
            style={{borderRadius: '17px 17px 0 0'}}
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
          <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full" style={{
            background: 'rgba(255, 215, 0, 0.9)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-sm font-bold" style={{color: '#1A1A1A'}}>NGO EVENT</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* NGO Info */}
          <div className="p-4 rounded-lg mb-6" style={{
            background: '#0E2B19',
            border: '2px solid #FFD700',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <div className="flex items-center">
              <img
                src={event.ngoLogo}
                alt={event.ngoName}
                className="w-16 h-16 rounded-full object-cover mr-4"
                style={{border: '4px solid #FFD700'}}
              />
              <div>
                <h3 className="text-lg font-bold" style={{color: '#FFD700'}}>{event.ngoName}</h3>
                <p style={{color: '#E6C55F'}}>NGO Partner</p>
                <div className="flex items-center text-sm mt-1">
                  <User size={14} className="mr-1" style={{color: '#FFD700'}} />
                  <span style={{color: '#E6C55F'}}>{event.contactPerson}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Title */}
          <h1 className="text-4xl font-bold mb-6 text-center" style={{
            color: '#FFD700',
            fontFamily: 'Poppins, Montserrat',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
          }}>{event.title}</h1>

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 rounded-lg" style={{
              background: '#0E2B19',
              border: '2px solid #FFD700',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="mr-3" style={{color: '#FFD700'}} size={20} />
                  <div>
                    <p className="font-semibold" style={{color: '#FFD700'}}>Date & Time</p>
                    <p style={{color: '#E6C55F'}}>{event.eventDate} at {event.eventTime}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="mr-3 mt-1" style={{color: '#FFD700'}} size={20} />
                  <div>
                    <p className="font-semibold" style={{color: '#FFD700'}}>Venue</p>
                    <p style={{color: '#E6C55F'}}>{event.venue}</p>
                    <button
                      onClick={handleLocation}
                      className="text-sm flex items-center mt-1 hover:underline"
                      style={{color: '#FFD700'}}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      View on Map
                    </button>
                  </div>
                </div>
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
              }}>Complete NGO Information</h3>
              <div className="space-y-4 mb-6">
                {/* Event Details */}
                <div className="p-4 rounded-lg mb-4" style={{
                  background: '#0E2B19',
                  border: '2px solid #FFD700',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  <h4 className="font-bold mb-3" style={{
                    color: '#FFD700',
                    fontSize: '18px'
                  }}>Event Details</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold" style={{color: '#FFD700'}}>Title:</span>
                      <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{event.title}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span className="font-semibold" style={{color: '#FFD700'}}>Date & Time:</span>
                      <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{event.eventDate} at {event.eventTime}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-2 mt-0.5" style={{color: '#FFD700'}} size={16} />
                      <span className="font-semibold" style={{color: '#FFD700'}}>Venue:</span>
                      <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{event.venue}</span>
                    </div>
                  </div>
                </div>

                {/* NGO Information */}
                <div className="p-4 rounded-lg mb-4" style={{
                  background: '#0E2B19',
                  border: '2px solid #FFD700',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  <h4 className="font-bold mb-3" style={{
                    color: '#FFD700',
                    fontSize: '18px'
                  }}>NGO Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold" style={{color: '#FFD700'}}>Organization:</span>
                      <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{event.ngoName}</span>
                    </div>
                    {event.userEmail && (
                      <div>
                        <span className="font-semibold" style={{color: '#FFD700'}}>Email:</span>
                        <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{event.userEmail}</span>
                      </div>
                    )}
                    {event.userWebsite && (
                      <div>
                        <span className="font-semibold" style={{color: '#FFD700'}}>Website:</span>
                        <a href={event.userWebsite} target="_blank" rel="noopener noreferrer" className="ml-2 hover:underline" style={{color: '#FFD700'}}>
                          {event.userWebsite}
                        </a>
                      </div>
                    )}
                    {event.userMission && (
                      <div>
                        <span className="font-medium text-gray-600">Mission:</span>
                        <p className="mt-1 text-gray-800">{event.userMission}</p>
                      </div>
                    )}
                    {event.userDescription && (
                      <div>
                        <span className="font-medium text-gray-600">About:</span>
                        <p className="mt-1 text-gray-800">{event.userDescription}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-4 rounded-lg mb-4" style={{
                  background: '#0E2B19',
                  border: '2px solid #FFD700',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  <h4 className="font-bold mb-3" style={{
                    color: '#FFD700',
                    fontSize: '18px'
                  }}>Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span className="font-semibold" style={{color: '#FFD700'}}>Contact Person:</span>
                      <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{event.contactPerson}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span className="font-semibold" style={{color: '#FFD700'}}>Phone:</span>
                      <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{event.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="mr-2" style={{color: '#FFD700'}} size={16} />
                      <span className="font-semibold" style={{color: '#FFD700'}}>WhatsApp:</span>
                      <span className="ml-2" style={{color: '#E6C55F', fontSize: '15px'}}>{event.whatsapp}</span>
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
                  className="w-full text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-bold hover:scale-105 hover:brightness-110"
                  style={{
                    background: '#075E36',
                    boxShadow: '0 4px 15px rgba(7, 94, 54, 0.4)'
                  }}
                >
                  <MessageCircle className="mr-2" size={18} />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3" style={{color: '#FFD700', textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'}}>Full Description</h3>
            <div className="p-4 rounded-lg" style={{
              background: '#0E2B19',
              border: '2px solid #FFD700',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}>
              <p className="leading-relaxed whitespace-pre-line" style={{color: '#E6C55F'}}>{event.description}</p>
            </div>
          </div>

          {/* Image Gallery */}
          {event.images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center" style={{color: '#FFD700', textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'}}>
                <Image className="mr-2" style={{color: '#FFD700'}} size={20} />
                Event Gallery ({event.images.length} images)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {event.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Event image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group-hover:scale-105"
                      style={{border: '2px solid #FFD700'}}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm mt-2" style={{color: '#E6C55F'}}>
                Click on any image to view in full screen
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="p-6 rounded-xl text-center" style={{
            background: '#0E2B19',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 className="text-xl font-bold mb-3" style={{
              color: '#FFD700',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
            }}>Join the Movement!</h3>
            <p className="mb-6" style={{
              color: '#E6C55F',
              fontSize: '16px'
            }}>
              Be part of this community initiative and help make a positive environmental impact.
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
                Register Now
              </button>
              <button
                onClick={handleLocation}
                className="text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center font-bold hover:scale-105 hover:brightness-110"
                style={{
                  background: '#8B0000',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 12px rgba(139, 0, 0, 0.4)'
                }}
              >
                <MapPin className="mr-2" size={16} />
                Get Directions
              </button>
            </div>
          </div>
        </div>

        {/* Image Viewer */}
        {selectedImageIndex !== null && (
          <ImageViewer
            images={event.images}
            currentIndex={selectedImageIndex}
            onClose={() => setSelectedImageIndex(null)}
            onNext={() => setSelectedImageIndex((selectedImageIndex + 1) % event.images.length)}
            onPrev={() => setSelectedImageIndex((selectedImageIndex - 1 + event.images.length) % event.images.length)}
          />
        )}
      </div>
    </div>
  );
};