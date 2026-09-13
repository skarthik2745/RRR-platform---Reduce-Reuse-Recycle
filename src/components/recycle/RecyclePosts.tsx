import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Calendar, User, Package } from 'lucide-react';

interface RecyclePost {
  id: string;
  photo: string;
  materials: string[];
  description: string;
  quantity: string;
  pickupAvailable: boolean;
  rates: { [key: string]: number };
  userId: string;
  userName: string;
  phone: string;
  whatsapp: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: Date;
}

interface RecyclePostsProps {
  posts: RecyclePost[];
}

export const RecyclePosts: React.FC<RecyclePostsProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<RecyclePost | null>(null);

  const handleContact = (type: 'phone' | 'whatsapp', number: string) => {
    if (type === 'phone') {
      window.open(`tel:${number}`, '_blank');
    } else {
      window.open(`https://wa.me/${number.replace(/[^0-9]/g, '')}`, '_blank');
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="mx-auto mb-4" style={{color: '#FFD700'}} size={64} />
        <h3 className="text-2xl font-bold mb-2" style={{color: '#FFD700'}}>No Recycle Posts Yet</h3>
        <p className="text-lg" style={{color: '#E6C55F'}}>Be the first to post recyclable items in your community!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
              border: '2px solid #FFD700',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
            }}
            onClick={() => setSelectedPost(post)}
          >
            <div className="relative h-48">
              <img
                src={post.photo || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop'}
                alt="Recyclable items"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: post.pickupAvailable ? '#22C55E' : '#EF4444',
                  color: 'white'
                }}
              >
                {post.pickupAvailable ? 'Pickup Available' : 'Drop-off Only'}
              </div>
            </div>

            <div className="p-4">
              <div className="flex flex-wrap gap-1 mb-3">
                {post.materials.slice(0, 3).map((material, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(255, 215, 0, 0.2)',
                      color: '#FFD700',
                      border: '1px solid #FFD700'
                    }}
                  >
                    {material}
                  </span>
                ))}
                {post.materials.length > 3 && (
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(255, 215, 0, 0.2)',
                      color: '#FFD700',
                      border: '1px solid #FFD700'
                    }}
                  >
                    +{post.materials.length - 3} more
                  </span>
                )}
              </div>

              <p className="text-sm mb-3 line-clamp-2" style={{color: '#E6C55F'}}>
                {post.description}
              </p>

              {post.quantity && (
                <div className="flex items-center mb-2">
                  <Package size={14} className="mr-2" style={{color: '#FFD700'}} />
                  <span className="text-sm" style={{color: '#FFD700'}}>Quantity: {post.quantity}</span>
                </div>
              )}

              <div className="flex items-center mb-2">
                <User size={14} className="mr-2" style={{color: '#FFD700'}} />
                <span className="text-sm font-medium" style={{color: '#FFD700'}}>{post.userName}</span>
              </div>

              <div className="flex items-center mb-3">
                <MapPin size={14} className="mr-2" style={{color: '#FFD700'}} />
                <span className="text-xs" style={{color: '#E6C55F'}}>{post.location.address}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContact('phone', post.phone);
                  }}
                  className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                    color: 'white',
                    border: '1px solid #22C55E'
                  }}
                >
                  <Phone size={12} className="mr-1" />
                  Call
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContact('whatsapp', post.whatsapp);
                  }}
                  className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: 'white',
                    border: '1px solid #25D366'
                  }}
                >
                  <MessageCircle size={12} className="mr-1" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
              border: '3px solid #FFD700',
              boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
            }}
          >
            <div className="relative">
              <img
                src={selectedPost.photo || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop'}
                alt="Recyclable items"
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{background: 'rgba(0, 0, 0, 0.7)'}}
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPost.materials.map((material, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      background: 'rgba(255, 215, 0, 0.2)',
                      color: '#FFD700',
                      border: '1px solid #FFD700'
                    }}
                  >
                    {material}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-3" style={{color: '#FFD700'}}>
                Recyclable Materials Available
              </h3>

              <p className="mb-4" style={{color: '#E6C55F'}}>
                {selectedPost.description}
              </p>

              {selectedPost.quantity && (
                <div className="flex items-center mb-3">
                  <Package size={16} className="mr-2" style={{color: '#FFD700'}} />
                  <span style={{color: '#FFD700'}}>Quantity: {selectedPost.quantity}</span>
                </div>
              )}

              <div className="flex items-center mb-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    background: selectedPost.pickupAvailable ? '#22C55E' : '#EF4444',
                    color: 'white'
                  }}
                >
                  {selectedPost.pickupAvailable ? 'Pickup Available' : 'Drop-off Only'}
                </span>
              </div>

              {Object.keys(selectedPost.rates).length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2" style={{color: '#FFD700'}}>Rates (per kg)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedPost.rates).map(([material, rate]) => (
                      <div key={material} className="flex justify-between p-2 rounded"
                        style={{background: 'rgba(255, 215, 0, 0.1)'}}
                      >
                        <span className="text-sm" style={{color: '#E6C55F'}}>{material}:</span>
                        <span className="text-sm font-medium" style={{color: '#FFD700'}}>₹{rate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4" style={{borderColor: '#FFD700'}}>
                <h4 className="font-semibold mb-3" style={{color: '#FFD700'}}>Contact Information</h4>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <User size={16} className="mr-2" style={{color: '#FFD700'}} />
                    <span style={{color: '#E6C55F'}}>{selectedPost.userName}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" style={{color: '#FFD700'}} />
                    <span style={{color: '#E6C55F'}}>{selectedPost.location.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" style={{color: '#FFD700'}} />
                    <span style={{color: '#E6C55F'}}>
                      Posted on {selectedPost.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleContact('phone', selectedPost.phone)}
                    className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                      color: 'white',
                      border: '2px solid #22C55E'
                    }}
                  >
                    <Phone size={16} className="mr-2" />
                    Call {selectedPost.phone}
                  </button>
                  <button
                    onClick={() => handleContact('whatsapp', selectedPost.whatsapp)}
                    className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #25D366, #128C7E)',
                      color: 'white',
                      border: '2px solid #25D366'
                    }}
                  >
                    <MessageCircle size={16} className="mr-2" />
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};