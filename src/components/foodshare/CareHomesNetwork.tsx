import React, { useState, useEffect } from 'react';
import { MapPin, Users, Phone, MessageCircle, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { CareHomeModal } from './CareHomeModal';
import { useAuth } from '../auth/AuthContext';
import { getCurrentUser } from '../../lib/auth';

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

interface CareHomesNetworkProps {
  homes?: any[];
  onEdit?: (home: any) => void;
  onDelete?: (homeId: string) => void;
  showEditDelete?: boolean;
}

export const CareHomesNetwork: React.FC<CareHomesNetworkProps> = ({ homes: dbHomes = [], onEdit, onDelete, showEditDelete = false }) => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getCurrentUser();
      setCurrentUser(userData);
    };
    loadUser();
  }, []);
  const [selectedCareHome, setSelectedCareHome] = useState<CareHome | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [careHomes, setCareHomes] = useState<CareHome[]>([]);

  useEffect(() => {
    if (dbHomes.length > 0) {
      const formattedHomes = dbHomes.map((home: any) => ({
        id: home.id,
        organizationName: home.name,
        type: 'NGO' as const,
        address: home.address,
        contactPerson: home.contact_person,
        phone: home.phone,
        whatsapp: home.phone,
        email: home.email,
        residents: home.current_residents || 0,
        dailyRequirements: `Meals for ${home.current_residents || 0} residents`,
        description: home.description,
        images: home.images && home.images.length > 0 ? home.images : ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop'],
        createdAt: new Date(home.created_at)
      }));
      setCareHomes(formattedHomes);
    }
  }, [dbHomes]);

  const filteredHomes = careHomes.filter(home => {
    const matchesSearch = home.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         home.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || home.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#FFD700'}} size={20} />
          <input
            type="text"
            placeholder="Search care homes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none text-white placeholder-gray-400"
            style={{
              background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
              color: '#FFD700'
            }}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-3 rounded-lg focus:outline-none font-semibold"
          style={{
            background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            color: '#FFD700'
          }}
        >
          <option value="all" style={{background: '#1A1A1A', color: '#FFD700'}}>All Types</option>
          <option value="Orphanage" style={{background: '#1A1A1A', color: '#FFD700'}}>Orphanage</option>
          <option value="Old Age Home" style={{background: '#1A1A1A', color: '#FFD700'}}>Old Age Home</option>
          <option value="Shelter" style={{background: '#1A1A1A', color: '#FFD700'}}>Shelter</option>
          <option value="NGO" style={{background: '#1A1A1A', color: '#FFD700'}}>NGO</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHomes.map((home) => (
          <div
            key={home.id}
            onClick={() => setSelectedCareHome(home)}
            className="overflow-hidden cursor-pointer transition-all duration-700 hover:scale-105 hover:-translate-y-4 hover:rotate-1 animate-slideUp group"
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
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
            }}
          >
            <img
              src={home.images[0]}
              alt={home.organizationName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold line-clamp-1" style={{color: '#FFD700'}}>{home.organizationName}</h3>
                <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  color: '#FFD700',
                  border: '1px solid #FFD700'
                }}>
                  {home.type}
                </span>
              </div>
              <div className="flex items-center mb-2" style={{color: '#E6C55F'}}>
                <MapPin size={14} className="mr-1" style={{color: '#FFD700'}} />
                <span className="text-sm">{home.address}</span>
              </div>
              <div className="flex items-center mb-3" style={{color: '#E6C55F'}}>
                <Users size={14} className="mr-1" style={{color: '#FFD700'}} />
                <span className="text-sm">{home.residents} residents</span>
              </div>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${home.phone}`);
                  }}
                  className="flex-1 text-white py-2 px-3 rounded-lg text-sm transition-all duration-500 hover:scale-110 hover:brightness-125 flex items-center justify-center font-semibold"
                  style={{
                    background: '#CFAF4C',
                    boxShadow: '0 4px 12px rgba(207, 175, 76, 0.4)'
                  }}
                >
                  <Phone size={14} className="mr-1" />
                  Call
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://wa.me/${home.whatsapp.replace(/[^0-9]/g, '')}`);
                  }}
                  className="flex-1 text-white py-2 px-3 rounded-lg text-sm transition-all duration-500 hover:scale-110 hover:brightness-125 flex items-center justify-center font-semibold"
                  style={{
                    background: '#075E36',
                    boxShadow: '0 4px 12px rgba(7, 94, 54, 0.4)'
                  }}
                >
                  <MessageCircle size={14} className="mr-1" />
                  WhatsApp
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://maps.google.com/?q=${encodeURIComponent(home.address)}`);
                }}
                className="w-full text-white py-2 px-3 rounded-lg text-sm transition-all duration-500 hover:scale-105 flex items-center justify-center font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                  border: '1px solid #FFD700',
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                }}
              >
                <MapPin size={14} className="mr-1" />
                View Location
              </button>
              {showEditDelete && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(home);
                    }}
                    className="flex-1 text-white py-2 px-3 rounded-lg text-sm transition-all duration-500 hover:scale-110 flex items-center justify-center font-semibold"
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
                      if (confirm('Are you sure you want to delete this care home?')) {
                        onDelete?.(home.id);
                      }
                    }}
                    className="flex-1 text-white py-2 px-3 rounded-lg text-sm transition-all duration-500 hover:scale-110 flex items-center justify-center font-semibold"
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
          </div>
        ))}
      </div>

      {filteredHomes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg" style={{color: '#E6C55F'}}>No care homes found</p>
          <p className="mt-2" style={{color: '#FFD700'}}>Try adjusting your search or filters</p>
        </div>
      )}

      {selectedCareHome && (
        <CareHomeModal
          careHome={selectedCareHome}
          onClose={() => setSelectedCareHome(null)}
        />
      )}
    </div>
  );
};