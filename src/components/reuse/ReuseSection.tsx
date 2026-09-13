import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { ReuseItem } from '../../types';
import { ItemCard } from './ItemCard';
import { ItemDetailModal } from './ItemDetailModal';
import { PostItemForm } from './PostItemForm';
import { SearchFilters } from './SearchFilters';
import { getReuseItems, createReuseItem, updateReuseItem, deleteReuseItem } from '../../lib/database';
import { getCurrentUser } from '../../lib/auth';

export const ReuseSection: React.FC = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReuseItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    condition: 'all',
    priceType: 'all',
    location: 'all'
  });
  const [items, setItems] = useState<ReuseItem[]>([]);
  const [userItems, setUserItems] = useState<ReuseItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<ReuseItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      const { data, error } = await getReuseItems();
      if (data && data.length > 0) {
        const formattedItems = data.map((item: any) => ({
          id: item.id,
          photos: [item.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'],
          name: item.title,
          description: item.description,
          condition: item.condition,
          category: item.category,
          isFree: item.price === 0,
          price: item.price,
          userId: item.user_id,
          userName: item.profiles?.full_name || 'Anonymous',
          phone: '+91-9876543210',
          whatsapp: '+91-9876543210',
          location: {
            lat: 28.6139,
            lng: 77.2090,
            address: item.location || 'India'
          },
          userType: 'general',
          userEmail: 'user@example.com',
          userDescription: 'Community member',
          createdAt: new Date(item.created_at)
        }));
        setItems(formattedItems);
        setUserItems(formattedItems.filter(item => item.userId === user?.id));
      } else {
        // Load dummy data if no database data
        const dummyItems = [
          {
            id: '1',
            photos: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'],
            name: 'iPhone 12',
            description: 'Excellent condition iPhone 12, 128GB, with original box and charger',
            condition: 'good',
            category: 'Electronics',
            isFree: false,
            price: 35000,
            userId: '1',
            userName: 'John Doe',
            phone: '+91-9876543210',
            whatsapp: '+91-9876543210',
            location: {
              lat: 28.6139,
              lng: 77.2090,
              address: 'New Delhi, India'
            },
            userType: 'general',
            userEmail: 'john@example.com',
            userDescription: 'Tech enthusiast and gadget collector',
            createdAt: new Date()
          },
          {
            id: '2',
            photos: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop'],
            name: 'Study Table',
            description: 'Wooden study table in good condition, perfect for students',
            condition: 'good',
            category: 'Furniture',
            isFree: true,
            userId: '2',
            userName: 'Green Earth Foundation',
            phone: '+91-9876543211',
            whatsapp: '+91-9876543211',
            location: {
              lat: 28.6139,
              lng: 77.2090,
              address: 'Mumbai, India'
            },
            userType: 'ngo',
            userEmail: 'contact@greenearth.org',
            userDescription: 'Environmental NGO promoting sustainable living',
            organizationName: 'Green Earth Foundation',
            createdAt: new Date()
          }
        ];
        setItems(dummyItems);
        setUserItems(dummyItems.filter(item => item.userId === user?.id));
      }
    };
    
    loadData();
  }, []);

  const categories = [
    'Electronics', 'Furniture', 'Books & Study Materials', 'Clothes', 'Shoes',
    'Kitchen Items', 'Toys', 'Home Decor', 'Sports Items', 'Bags & Accessories',
    'Appliances', 'Tools & Hardware', 'Baby Products', 'Vehicles', 'Others'
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'all' || item.category === filters.category;
    const matchesCondition = filters.condition === 'all' || item.condition === filters.condition;
    const matchesPriceType = filters.priceType === 'all' || 
                            (filters.priceType === 'free' && item.isFree) ||
                            (filters.priceType === 'paid' && !item.isFree);

    return matchesSearch && matchesCategory && matchesCondition && matchesPriceType;
  });

  const handlePostItem = async (newItem: Omit<ReuseItem, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    
    let data, error;
    if (editingItem) {
      ({ data, error } = await updateReuseItem(editingItem.id, {
        title: newItem.name,
        description: newItem.description,
        category: newItem.category,
        condition: newItem.condition,
        price: newItem.isFree ? 0 : (newItem.price || 0),
        image_url: newItem.photos[0] || null,
        location: newItem.location.address
      }));
    } else {
      ({ data, error } = await createReuseItem({
        user_id: currentUser.id,
        title: newItem.name,
        description: newItem.description,
        category: newItem.category,
        condition: newItem.condition,
        price: newItem.isFree ? 0 : (newItem.price || 0),
        image_url: newItem.photos[0] || null,
        location: newItem.location.address,
        is_available: true
      }));
    }
    
    if (data) {
      const item: ReuseItem = {
        ...newItem,
        id: data[0].id,
        createdAt: new Date()
      };
      if (editingItem) {
        setUserItems(userItems.map(i => i.id === editingItem.id ? item : i));
        setItems(items.map(i => i.id === editingItem.id ? item : i));
      } else {
        setUserItems([item, ...userItems]);
        setItems([item, ...items]);
      }
      setShowPostForm(false);
      setEditingItem(null);
    } else if (error) {
      console.error('Error with reuse item:', error);
      alert('Failed to save item. Please try again.');
    }
  };

  return (
    <div className="min-h-screen recycle-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 gold-glow" style={{
            fontFamily: 'Poppins, Montserrat, Playfair Display',
            color: '#FFD700',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)'
          }}>Reuse Marketplace</h1>
          <p className="text-2xl" style={{
            color: '#E6C55F',
            fontFamily: 'Poppins, Montserrat',
            textShadow: '0 0 15px rgba(230, 197, 95, 0.4)'
          }}>Give items a second life by sharing with your community</p>
          <div className="mt-8">
            <button
              onClick={() => setShowPostForm(true)}
              className="text-white px-6 py-3 rounded-lg transition-all duration-500 flex items-center font-semibold hover:scale-105 hover:brightness-125"
              style={{
                background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
              }}
            >
              <Plus className="mr-2" size={20} />
              Post Item
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-8 rounded-2xl mb-8" style={{
          background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
          border: '2px solid #FFD700',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
        }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#FFD700'}} size={20} />
              <input
                type="text"
                placeholder="Search items..."
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 rounded-lg font-semibold"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
            >
              <Filter className="mr-2" size={20} />
              Filters
            </button>
          </div>

          {showFilters && (
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
            />
          )}
        </div>

        {/* User's Items */}
        {userItems.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>My Items</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userItems.filter(item => {
                const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     item.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = filters.category === 'all' || item.category === filters.category;
                const matchesCondition = filters.condition === 'all' || item.condition === filters.condition;
                const matchesPriceType = filters.priceType === 'all' || 
                                        (filters.priceType === 'free' && item.isFree) ||
                                        (filters.priceType === 'paid' && !item.isFree);
                return matchesSearch && matchesCategory && matchesCondition && matchesPriceType;
              }).map((item) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => setSelectedItem(item)}
                  showEditDelete={true}
                  onEdit={() => {
                    setEditingItem(item);
                    setShowPostForm(true);
                  }}
                  onDelete={async () => {
                    if (confirm('Are you sure you want to delete this item?')) {
                      const { error } = await deleteReuseItem(item.id);
                      if (!error) {
                        setUserItems(userItems.filter(i => i.id !== item.id));
                        setItems(items.filter(i => i.id !== item.id));
                      }
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Items */}
        <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>All Items</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg" style={{color: '#E6C55F'}}>No items found matching your criteria</p>
            <p className="mt-2" style={{color: '#FFD700'}}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Item Detail Modal */}
        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}

        {/* Post Item Modal */}
        {showPostForm && (
          <PostItemForm
            categories={categories}
            onSubmit={handlePostItem}
            onClose={() => {
              setShowPostForm(false);
              setEditingItem(null);
            }}
            initialData={editingItem}
          />
        )}
      </div>
    </div>
  );
};