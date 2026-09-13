import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, MessageCircle, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { FoodPostModal } from './FoodPostModal';

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

interface LeftoverFoodPostsProps {
  posts?: any[];
  onEdit?: (post: any) => void;
  onDelete?: (postId: string) => void;
  showEditDelete?: boolean;
}

export const LeftoverFoodPosts: React.FC<LeftoverFoodPostsProps> = ({ posts: dbPosts = [], onEdit, onDelete, showEditDelete = false }) => {
  const [selectedPost, setSelectedPost] = useState<FoodPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [foodTypeFilter, setFoodTypeFilter] = useState('all');
  const [foodPosts, setFoodPosts] = useState<FoodPost[]>([]);

  useEffect(() => {
    if (dbPosts.length > 0) {
      const formattedPosts = dbPosts.map((post: any) => ({
        id: post.id,
        eventName: post.title,
        quantity: post.quantity,
        foodType: post.food_type,
        pickupLocation: post.pickup_location,
        bestBefore: new Date(post.expiry_time),
        notes: post.description,
        images: post.images || [post.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop'],
        userName: post.profiles?.full_name || 'Anonymous',
        phone: '+91-9876543210',
        whatsapp: '+91-9876543210',
        userEmail: 'user@example.com',
        createdAt: new Date(post.created_at)
      }));
      setFoodPosts(formattedPosts);
    }
  }, [dbPosts]);

  const filteredPosts = foodPosts.filter(post => {
    const matchesSearch = post.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFoodType = foodTypeFilter === 'all' || post.foodType === foodTypeFilter;
    return matchesSearch && matchesFoodType;
  });

  const getTimeRemaining = (bestBefore: Date) => {
    const now = new Date();
    const diff = bestBefore.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff <= 0) return 'Expired';
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
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
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#FFD700'}} size={20} />
          <input
            type="text"
            placeholder="Search food posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none placeholder-gray-400"
            style={{
              background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
              color: '#FFD700'
            }}
          />
        </div>
        <select
          value={foodTypeFilter}
          onChange={(e) => setFoodTypeFilter(e.target.value)}
          className="px-4 py-2 rounded-lg focus:outline-none"
          style={{
            background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            color: '#FFD700'
          }}
        >
          <option value="all" style={{background: '#1A1A1A', color: '#FFD700'}}>All Food Types</option>
          <option value="Mixed Meals" style={{background: '#1A1A1A', color: '#FFD700'}}>Mixed Meals</option>
          <option value="Rice & Curry" style={{background: '#1A1A1A', color: '#FFD700'}}>Rice & Curry</option>
          <option value="Snacks & Sweets" style={{background: '#1A1A1A', color: '#FFD700'}}>Snacks & Sweets</option>
          <option value="Vegetables" style={{background: '#1A1A1A', color: '#FFD700'}}>Vegetables</option>
          <option value="Fruits" style={{background: '#1A1A1A', color: '#FFD700'}}>Fruits</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
              border: '2px solid #FFD700',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
            }}
          >
            <img
              src={post.images[0]}
              alt={post.eventName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold line-clamp-1" style={{color: '#FFD700'}}>{post.eventName}</h3>
                <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  color: '#FFD700',
                  border: '1px solid #FFD700'
                }}>
                  <Clock size={12} className="inline mr-1" style={{color: '#FFD700'}} />
                  {getTimeRemaining(post.bestBefore)}
                </span>
              </div>
              
              <p className="text-sm mb-2" style={{color: '#E6C55F'}}>{post.quantity} • {post.foodType}</p>
              
              <div className="flex items-center mb-3" style={{color: '#E6C55F'}}>
                <MapPin size={14} className="mr-1" style={{color: '#FFD700'}} />
                <span className="text-sm">{post.pickupLocation}</span>
              </div>
              
              <p className="text-sm mb-4 line-clamp-2" style={{color: '#E6C55F'}}>{post.notes}</p>
              
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${post.phone}`);
                  }}
                  className="flex-1 text-white py-2 px-3 rounded-lg text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  style={{
                    background: '#CFAF4C',
                    boxShadow: '0 4px 15px rgba(207, 175, 76, 0.4)'
                  }}
                >
                  <Phone size={14} className="mr-1" />
                  Call
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://wa.me/${post.whatsapp.replace(/[^0-9]/g, '')}`);
                  }}
                  className="flex-1 text-white py-2 px-3 rounded-lg text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  style={{
                    background: '#075E36',
                    boxShadow: '0 4px 15px rgba(7, 94, 54, 0.4)'
                  }}
                >
                  <MessageCircle size={14} className="mr-1" />
                  WhatsApp
                </button>
              </div>
              {showEditDelete && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(post);
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
                      if (confirm('Are you sure you want to delete this food post?')) {
                        onDelete?.(post.id);
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
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg" style={{color: '#E6C55F'}}>No food posts found</p>
          <p className="mt-2" style={{color: '#FFD700'}}>Try adjusting your search or filters</p>
        </div>
      )}

      {selectedPost && (
        <FoodPostModal
          foodPost={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};