import React, { useState, useEffect } from 'react';
import { Search, Filter, Phone, MessageCircle, MapPin, Clock, Truck, Plus, Edit, Trash2 } from 'lucide-react';
import { ShopProfile } from '../../types';
import { ShopModal } from './ShopModal';
import { useAuth } from '../auth/AuthContext';

interface ShopProfilesProps {
  partners?: any[];
  showEditDelete?: boolean;
  onEdit?: (partner: any) => void;
  onDelete?: (partnerId: string) => void;
}

export const ShopProfiles: React.FC<ShopProfilesProps> = ({ partners = [], showEditDelete = false, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedShop, setSelectedShop] = useState<ShopProfile | null>(null);
  const [shops, setShops] = useState<ShopProfile[]>([]);

  useEffect(() => {
    if (partners.length > 0) {
      const formattedShops = partners.map((partner: any) => ({
        id: partner.id,
        shopName: partner.name,
        ownerName: partner.contact_info?.split(',')[0] || 'Owner',
        acceptedMaterials: partner.accepted_materials || [],
        address: partner.location,
        location: { lat: 28.6139, lng: 77.2090 },
        pickupAvailable: true,
        timings: '9 AM - 6 PM',
        rates: {},
        phone: '+91-9876543210',
        whatsapp: '+91-9876543210',
        description: partner.description,
        images: [partner.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop']
      }));
      setShops(formattedShops);
    }
  }, [partners]);

  const handleCreateListing = (newListing: Omit<ShopProfile, 'id'>) => {
    const listing: ShopProfile = {
      ...newListing,
      id: Date.now().toString()
    };
    setShops([listing, ...shops]);
    setShowCreateForm(false);
  };

  const materials = [
    'E-waste', 'Mobile phones', 'Laptops', 'Computer parts', 'Metal items',
    'Paper', 'Plastic bottles', 'Glass', 'Old clothes', 'Home appliances'
  ];

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMaterial = selectedMaterial === 'all' || 
                           shop.acceptedMaterials.includes(selectedMaterial);
    return matchesSearch && matchesMaterial;
  });

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (whatsapp: string, shopName: string) => {
    const message = `Hi! I have some recyclable items and would like to know more about your services at ${shopName}.`;
    window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleLocation = (lat: number, lng: number) => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
  };

  return (
    <div className="p-8 rounded-2xl" style={{
      background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
      border: '2px solid #FFD700',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
    }}>
      <div className="text-center animate-fadeInZoom mb-8">
        <h2 className="text-4xl font-bold mb-4" style={{
          color: '#FFD700',
          fontFamily: 'Poppins, Montserrat, Playfair Display',
          textShadow: '0 0 25px rgba(255, 215, 0, 0.5)'
        }}>EcoRecycler Partners</h2>
        <p className="text-xl" style={{
          color: '#E6C55F',
          textShadow: '0 0 10px rgba(230, 197, 95, 0.3)'
        }}>Connect with certified recycling partners</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#FFD700'}} size={20} />
          <input
            type="text"
            placeholder="Search shops or owners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none text-white placeholder-gray-400"
            style={{
              background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
            }}
          />
        </div>
        <select
          value={selectedMaterial}
          onChange={(e) => setSelectedMaterial(e.target.value)}
          className="px-4 py-3 rounded-lg focus:outline-none font-semibold"
          style={{
            background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            color: '#FFD700'
          }}
        >
          <option value="all" style={{background: '#1A1A1A', color: '#FFD700'}}>All Materials</option>
          {materials.map((material) => (
            <option key={material} value={material} style={{background: '#1A1A1A', color: '#FFD700'}}>
              {material}
            </option>
          ))}
        </select>
      </div>

      {/* Shop Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {filteredShops.map((shop, index) => (
          <div 
            key={shop.id} 
            onClick={() => setSelectedShop(shop)}
            className="cursor-pointer transition-all duration-700 hover:scale-105 hover:-translate-y-4 hover:rotate-1 animate-slideUp group"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
              e.currentTarget.style.borderColor = '#FFD700';
              e.currentTarget.style.background = 'linear-gradient(135deg, #2D5016, #1A1A1A, #2D5016)';
              e.currentTarget.style.filter = 'brightness(1.1) saturate(1.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = '#FFD700';
              e.currentTarget.style.background = 'linear-gradient(135deg, #2D5016, #1A1A1A)';
              e.currentTarget.style.filter = 'brightness(1) saturate(1)';
            }}
            style={{
              background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
              border: '2px solid #FFD700',
              borderRadius: '15px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2" style={{color: 'white'}}>{shop.shopName}</h3>
              <p style={{color: '#E6C55F'}}>Owner: {shop.ownerName}</p>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-center text-sm" style={{color: '#E6C55F'}}>
                <MapPin size={16} className="mr-2" style={{color: '#FFD700'}} />
                <span>{shop.address}</span>
              </div>
              <div className="flex items-center text-sm" style={{color: '#E6C55F'}}>
                <Clock size={16} className="mr-2" style={{color: '#FFD700'}} />
                <span>{shop.timings}</span>
              </div>
              {shop.pickupAvailable && (
                <div className="flex items-center text-sm" style={{color: '#90EE90'}}>
                  <Truck size={16} className="mr-2" style={{color: '#FFD700'}} />
                  <span>Pickup Available</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3" style={{color: 'white'}}>Accepted Materials:</h4>
              <div className="flex flex-wrap gap-2">
                {shop.acceptedMaterials.slice(0, 3).map((material) => (
                  <span
                    key={material}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      background: 'rgba(255, 215, 0, 0.2)',
                      color: '#FFD700',
                      border: '1px solid #FFD700'
                    }}
                  >
                    {material}
                  </span>
                ))}
                {shop.acceptedMaterials.length > 3 && (
                  <span className="text-xs px-3 py-1 rounded-full font-medium" style={{
                    background: 'rgba(230, 197, 95, 0.2)',
                    color: '#E6C55F'
                  }}>
                    +{shop.acceptedMaterials.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3" style={{color: 'white'}}>Sample Rates (₹/kg):</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span style={{color: '#E6C55F'}}>Paper:</span>
                  <span style={{color: '#FFD700', fontWeight: 'bold'}}>₹8-12</span>
                </div>
                <div className="flex justify-between">
                  <span style={{color: '#E6C55F'}}>Plastic:</span>
                  <span style={{color: '#FFD700', fontWeight: 'bold'}}>₹15-25</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCall(shop.phone);
                }}
                className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 hover:scale-125 hover:brightness-125 hover:rotate-12 hover:shadow-lg"
                style={{
                  background: '#CFAF4C',
                  boxShadow: '0 4px 12px rgba(207, 175, 76, 0.4)'
                }}
                title="Call"
              >
                <Phone size={18} style={{color: 'white'}} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleWhatsApp(shop.whatsapp, shop.shopName);
                }}
                className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 hover:scale-125 hover:brightness-125 hover:rotate-12 hover:shadow-lg"
                style={{
                  background: '#075E36',
                  boxShadow: '0 4px 12px rgba(7, 94, 54, 0.4)'
                }}
                title="WhatsApp"
              >
                <MessageCircle size={18} style={{color: 'white'}} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLocation(shop.location.lat, shop.location.lng);
                }}
                className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 hover:scale-125 hover:brightness-125 hover:rotate-12 hover:shadow-lg"
                style={{
                  background: '#8B0000',
                  boxShadow: '0 4px 12px rgba(139, 0, 0, 0.4)'
                }}
                title="View Location"
              >
                <MapPin size={18} style={{color: 'white'}} />
              </button>
            </div>
            {showEditDelete && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(partners.find(p => p.id === shop.id));
                  }}
                  className="flex-1 text-white py-2 px-3 rounded-lg text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  style={{
                    background: '#4A90E2',
                    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)'
                  }}
                >
                  <Edit size={14} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this listing?')) {
                      onDelete?.(shop.id);
                    }
                  }}
                  className="flex-1 text-white py-2 px-3 rounded-lg text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  style={{
                    background: '#E74C3C',
                    boxShadow: '0 4px 12px rgba(231, 76, 60, 0.4)'
                  }}
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredShops.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg" style={{color: '#E6C55F'}}>No recycling partners found</p>
          <p className="mt-2" style={{color: '#FFD700'}}>Try adjusting your search criteria</p>
        </div>
      )}

      {/* Shop Detail Modal */}
      {selectedShop && (
        <ShopModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
        />
      )}
    </div>
  );
};