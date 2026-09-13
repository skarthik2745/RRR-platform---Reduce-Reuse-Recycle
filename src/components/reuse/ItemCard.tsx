import React from 'react';
import { Phone, MessageCircle, MapPin, Share2, Edit, Trash2 } from 'lucide-react';
import { ReuseItem } from '../../types';

interface ItemCardProps {
  item: ReuseItem;
  onClick: () => void;
  showEditDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, showEditDelete = false, onEdit, onDelete }) => {
  // Support legacy single photo format
  const itemPhotos = item.photos || (item.photo ? [item.photo] : []);
  const mainPhoto = itemPhotos[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
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
      // Fallback for browsers that don't support Web Share API
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
    <div 
      className="overflow-hidden cursor-pointer transition-all duration-700 hover:scale-105 hover:-translate-y-4 hover:rotate-1 animate-slideUp group"
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
        e.currentTarget.style.borderColor = '#FFD700';
        e.currentTarget.style.background = 'linear-gradient(135deg, #2D5016, #1A1A1A, #2D5016)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4)';
        e.currentTarget.style.borderColor = '#FFD700';
        e.currentTarget.style.background = 'linear-gradient(135deg, #2D5016, #1A1A1A)';
      }}
      style={{
        background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
        border: '2px solid #FFD700',
        borderRadius: '15px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
      }}
    >
      <div className="relative">
        <img
          src={mainPhoto}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          {item.isFree ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              FREE
            </span>
          ) : (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ₹{item.price?.toLocaleString()}
            </span>
          )}
        </div>
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
            {item.condition.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>
        {itemPhotos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
            +{itemPhotos.length - 1} more
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold mb-1" style={{color: '#FFD700'}}>{item.name}</h3>
          <p className="text-sm line-clamp-2" style={{color: '#E6C55F'}}>{item.description}</p>
        </div>

        <div className="mb-3">
          <p className="text-sm font-medium" style={{color: '#FFD700'}}>{item.userName}</p>
          <div className="flex items-center text-xs mt-1" style={{color: '#E6C55F'}}>
            <MapPin size={12} className="mr-1" style={{color: '#FFD700'}} />
            <span>{item.location.address}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCall();
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 hover:scale-125 hover:brightness-125 hover:rotate-12 hover:shadow-lg"
              style={{
                background: '#CFAF4C',
                boxShadow: '0 4px 12px rgba(207, 175, 76, 0.4)'
              }}
              title="Call"
            >
              <Phone size={14} style={{color: 'white'}} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleWhatsApp();
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 hover:scale-125 hover:brightness-125 hover:rotate-12 hover:shadow-lg"
              style={{
                background: '#075E36',
                boxShadow: '0 4px 12px rgba(7, 94, 54, 0.4)'
              }}
              title="WhatsApp"
            >
              <MessageCircle size={14} style={{color: 'white'}} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLocation();
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 hover:scale-125 hover:brightness-125 hover:rotate-12 hover:shadow-lg"
              style={{
                background: '#8B0000',
                boxShadow: '0 4px 12px rgba(139, 0, 0, 0.4)'
              }}
              title="View Location"
            >
              <MapPin size={14} style={{color: 'white'}} />
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 hover:scale-125 hover:brightness-125 hover:rotate-12 hover:shadow-lg"
            style={{
              background: '#4A4A4A',
              boxShadow: '0 4px 12px rgba(74, 74, 74, 0.4)'
            }}
            title="Share"
          >
            <Share2 size={14} style={{color: 'white'}} />
          </button>
        </div>
        {showEditDelete && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
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
                onDelete?.();
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
    </div>
  );
};