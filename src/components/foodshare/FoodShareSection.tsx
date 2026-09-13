import React, { useState, useEffect } from 'react';
import { Heart, Home, Plus } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { CareHomesNetwork } from './CareHomesNetwork';
import { LeftoverFoodPosts } from './LeftoverFoodPosts';
import { CreateCareHome } from './CreateCareHome';
import { CreateFoodPost } from './CreateFoodPost';
import { getTADHomes, getFoodPosts, createFoodPost, createTADHome, updateTADHome, deleteTADHome, updateFoodPost, deleteFoodPost } from '../../lib/database';
import { getCurrentUser } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export const FoodShareSection: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('carehomes');
  const [showCreateCareHome, setShowCreateCareHome] = useState(false);
  const [showCreateFoodPost, setShowCreateFoodPost] = useState(false);
  const [editingCareHome, setEditingCareHome] = useState<any>(null);
  const [editingFoodPost, setEditingFoodPost] = useState<any>(null);
  const [careHomes, setCareHomes] = useState([]);
  const [userCareHomes, setUserCareHomes] = useState([]);
  const [foodPosts, setFoodPosts] = useState([]);
  const [userFoodPosts, setUserFoodPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      const { data: homesData } = await getTADHomes();
      if (homesData) {
        setCareHomes(homesData);
        setUserCareHomes(homesData.filter(h => h.user_id === user?.id));
      }
      
      const { data: postsData } = await getFoodPosts();
      if (postsData) {
        setFoodPosts(postsData);
        setUserFoodPosts(postsData.filter(p => p.user_id === user?.id));
      }
    };
    
    loadData();
  }, []);

  const tabs = [
    { id: 'carehomes', label: 'Care Homes Network', icon: Home },
    { id: 'foodposts', label: 'Leftover Food Posts', icon: Heart }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'carehomes':
        return (
          <div>
            {userCareHomes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>My Care Homes</h3>
                <CareHomesNetwork 
                  homes={userCareHomes}
                  showEditDelete={true}
                  onEdit={(home) => {
                    setEditingCareHome(home);
                    setShowCreateCareHome(true);
                  }}
                  onDelete={async (homeId) => {
                    const { error } = await deleteTADHome(homeId);
                    if (!error) {
                      setUserCareHomes(userCareHomes.filter(h => h.id !== homeId));
                    }
                  }}
                />
              </div>
            )}
            <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>All Care Homes</h3>
            <CareHomesNetwork homes={careHomes} />
          </div>
        );
      case 'foodposts':
        return (
          <div>
            {userFoodPosts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>My Food Posts</h3>
                <LeftoverFoodPosts 
                  posts={userFoodPosts}
                  showEditDelete={true}
                  onEdit={(post) => {
                    setEditingFoodPost(post);
                    setShowCreateFoodPost(true);
                  }}
                  onDelete={async (postId) => {
                    const { error } = await deleteFoodPost(postId);
                    if (!error) {
                      setUserFoodPosts(userFoodPosts.filter(p => p.id !== postId));
                      setFoodPosts(foodPosts.filter(p => p.id !== postId));
                    }
                  }}
                />
              </div>
            )}
            <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>All Food Posts</h3>
            <LeftoverFoodPosts posts={foodPosts} />
          </div>
        );
      default:
        return <div />;
    }
  };

  const renderActionButton = () => {
    if (activeTab === 'carehomes') {
      return (
        <button
          onClick={() => setShowCreateCareHome(true)}
          className="text-white px-6 py-3 rounded-lg transition-all duration-500 flex items-center font-semibold hover:scale-105 hover:brightness-125"
          style={{
            background: 'linear-gradient(135deg, #B8860B, #DAA520)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
          }}
        >
          <Plus className="mr-2" size={20} />
          Add Care Home
        </button>
      );
    }
    if (activeTab === 'foodposts') {
      return (
        <button
          onClick={() => setShowCreateFoodPost(true)}
          className="text-white px-6 py-3 rounded-lg transition-all duration-500 flex items-center font-semibold hover:scale-105 hover:brightness-125"
          style={{
            background: 'linear-gradient(135deg, #B8860B, #DAA520)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
          }}
        >
          <Plus className="mr-2" size={20} />
          Post Leftover Food
        </button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen recycle-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 gold-glow" style={{
            fontFamily: 'Poppins, Montserrat, Playfair Display',
            color: '#FFD700',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)'
          }}>FoodShare Network</h1>
          <p className="text-2xl" style={{
            color: '#E6C55F',
            fontFamily: 'Poppins, Montserrat',
            textShadow: '0 0 15px rgba(230, 197, 95, 0.4)'
          }}>Connect surplus food with those who need it most</p>
          <div className="mt-8">
            {renderActionButton()}
          </div>
        </div>

        <div className="mb-12">
          <nav className="flex justify-center space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 py-3 px-6 font-medium text-lg rounded-lg ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={activeTab === tab.id ? {
                    background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.2)'
                  } : {
                    background: 'rgba(45, 80, 22, 0.3)',
                    border: '2px solid transparent'
                  }}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="animate-slideUp">
          {renderContent()}
        </div>

        {showCreateCareHome && (
          <CreateCareHome
            initialData={editingCareHome}
            onSubmit={async (newCareHome) => {
              if (currentUser) {
                let data, error;
                if (editingCareHome) {
                  ({ data, error } = await updateTADHome(editingCareHome.id, {
                    name: newCareHome.organizationName,
                    address: newCareHome.address,
                    contact_person: newCareHome.contactPerson,
                    phone: newCareHome.phone,
                    email: newCareHome.email,
                    capacity: newCareHome.capacity || 50,
                    current_residents: newCareHome.residents || 0,
                    description: newCareHome.description,
                    images: newCareHome.images || []
                  }));
                } else {
                  ({ data, error } = await createTADHome({
                    user_id: currentUser.id,
                    organizationName: newCareHome.organizationName,
                    address: newCareHome.address,
                    contactPerson: newCareHome.contactPerson,
                    phone: newCareHome.phone,
                    email: newCareHome.email,
                    capacity: newCareHome.capacity || 50,
                    residents: newCareHome.residents || 0,
                    description: newCareHome.description,
                    images: newCareHome.images || []
                  }));
                }
                if (data) {
                  if (editingCareHome) {
                    setUserCareHomes(userCareHomes.map(h => h.id === editingCareHome.id ? data[0] : h));
                    setCareHomes(careHomes.map(h => h.id === editingCareHome.id ? data[0] : h));
                  } else {
                    setUserCareHomes([data[0], ...userCareHomes]);
                    setCareHomes([data[0], ...careHomes]);
                  }
                } else if (error) {
                  console.error('Error with care home:', error);
                  alert('Failed to save care home. Please try again.');
                }
              }
              setShowCreateCareHome(false);
              setEditingCareHome(null);
            }}
            onClose={() => {
              setShowCreateCareHome(false);
              setEditingCareHome(null);
            }}
          />
        )}

        {showCreateFoodPost && (
          <CreateFoodPost
            initialData={editingFoodPost}
            onSubmit={async (newFoodPost) => {
              if (currentUser) {
                let data, error;
                if (editingFoodPost) {
                  ({ data, error } = await updateFoodPost(editingFoodPost.id, {
                    title: newFoodPost.eventName,
                    description: newFoodPost.notes || newFoodPost.description,
                    food_type: newFoodPost.foodType,
                    quantity: newFoodPost.quantity,
                    expiry_time: newFoodPost.bestBefore,
                    pickup_location: newFoodPost.pickupLocation,
                    images: newFoodPost.images || []
                  }));
                } else {
                  ({ data, error } = await createFoodPost({
                    user_id: currentUser.id,
                    title: newFoodPost.eventName,
                    description: newFoodPost.notes || newFoodPost.description,
                    food_type: newFoodPost.foodType,
                    quantity: newFoodPost.quantity,
                    expiry_time: newFoodPost.bestBefore,
                    pickup_location: newFoodPost.pickupLocation,
                    images: newFoodPost.images || [],
                    is_available: true
                  }));
                }
                if (data) {
                  if (editingFoodPost) {
                    setUserFoodPosts(userFoodPosts.map(p => p.id === editingFoodPost.id ? data[0] : p));
                    setFoodPosts(foodPosts.map(p => p.id === editingFoodPost.id ? data[0] : p));
                  } else {
                    setUserFoodPosts([data[0], ...userFoodPosts]);
                    setFoodPosts([data[0], ...foodPosts]);
                  }
                } else if (error) {
                  console.error('Error with food post:', error);
                  alert('Failed to save food post. Please try again.');
                }
              }
              setShowCreateFoodPost(false);
              setEditingFoodPost(null);
            }}
            onClose={() => {
              setShowCreateFoodPost(false);
              setEditingFoodPost(null);
            }}
          />
        )}
      </div>
    </div>
  );
};