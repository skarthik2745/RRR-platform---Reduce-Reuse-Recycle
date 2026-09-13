import React, { useState, useEffect } from 'react';
import { Plus, Store, Users, Recycle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ShopProfiles } from './ShopProfiles';
import { NGOEvents } from './NGOEvents';
import { CreateRecyclerListing } from './CreateRecyclerListing';
import { CreateNGOEvent } from './CreateNGOEvent';
import { getRecyclerPartners, getNGOEvents, createRecyclerPartner, createNGOEvent, updateRecyclerPartner, deleteRecyclerPartner, updateNGOEvent, deleteNGOEvent } from '../../lib/database';
import { getCurrentUser } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export const RecycleSection: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('shops');
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [recyclerPartners, setRecyclerPartners] = useState([]);
  const [userRecyclerPartners, setUserRecyclerPartners] = useState([]);
  const [ngoEvents, setNgoEvents] = useState([]);
  const [userNgoEvents, setUserNgoEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      

      const { data: partnersData } = await getRecyclerPartners();
      if (partnersData) {
        setRecyclerPartners(partnersData);
        setUserRecyclerPartners(partnersData.filter(p => p.user_id === user?.id));
      }
      
      const { data: eventsData } = await getNGOEvents();
      if (eventsData) {
        setNgoEvents(eventsData);
        setUserNgoEvents(eventsData.filter(e => e.user_id === user?.id));
      }
    };
    
    loadData();
  }, []);

  const tabs = [
    { id: 'shops', label: 'EcoRecycler Partners', icon: Store },
    { id: 'events', label: 'NGO Events', icon: Users }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'shops':
        return (
          <div>
            {userRecyclerPartners.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>My Recycler Listings</h3>
                <ShopProfiles 
                  partners={userRecyclerPartners}
                  showEditDelete={true}
                  onEdit={(partner) => {
                    setEditingPartner(partner);
                    setShowCreateListing(true);
                  }}
                  onDelete={async (partnerId) => {
                    const { error } = await deleteRecyclerPartner(partnerId);
                    if (!error) {
                      setUserRecyclerPartners(userRecyclerPartners.filter(p => p.id !== partnerId));
                      setRecyclerPartners(recyclerPartners.filter(p => p.id !== partnerId));
                    }
                  }}
                />
              </div>
            )}
            <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>All EcoRecycler Partners</h3>
            <ShopProfiles partners={recyclerPartners} />
          </div>
        );
      case 'events':
        return (
          <div>
            {userNgoEvents.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>My NGO Events</h3>
                <NGOEvents 
                  events={userNgoEvents}
                  showEditDelete={true}
                  onEdit={(event) => {
                    setEditingEvent(event);
                    setShowCreateEvent(true);
                  }}
                  onDelete={async (eventId) => {
                    const { error } = await deleteNGOEvent(eventId);
                    if (!error) {
                      setUserNgoEvents(userNgoEvents.filter(e => e.id !== eventId));
                      setNgoEvents(ngoEvents.filter(e => e.id !== eventId));
                    }
                  }}
                />
              </div>
            )}
            <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>All NGO Events</h3>
            <NGOEvents events={ngoEvents} />
          </div>
        );
      default:
        return <div />;
    }
  };

  const renderActionButton = () => {
    if (user?.userType === 'ecorecycler' && activeTab === 'shops') {
      return (
        <button
          onClick={() => setShowCreateListing(true)}
          className="text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center font-semibold hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #B8860B, #DAA520)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
          }}
        >
          <Store className="mr-2" size={20} />
          Create Recycler Listing
        </button>
      );
    }
    if (user?.userType === 'ngo' && activeTab === 'events') {
      return (
        <button
          onClick={() => setShowCreateEvent(true)}
          className="text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center font-semibold hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #B8860B, #DAA520)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
          }}
        >
          <Plus className="mr-2" size={20} />
          Create NGO Event
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
          }}>Recycle Hub</h1>
          <p className="text-2xl" style={{
            color: '#E6C55F',
            fontFamily: 'Poppins, Montserrat',
            textShadow: '0 0 15px rgba(230, 197, 95, 0.4)'
          }}>Connect with recycling partners and join community events</p>
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
                  className={`flex items-center space-x-3 py-3 px-6 font-medium text-lg transition-all duration-300 rounded-lg ${
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
      </div>

      {/* Modals */}
      {showCreateListing && (
        <CreateRecyclerListing 
          initialData={editingPartner}
          onSubmit={async (newListing) => {
            if (currentUser) {
              let data, error;
              if (editingPartner) {
                ({ data, error } = await updateRecyclerPartner(editingPartner.id, {
                  name: newListing.shopName,
                  description: newListing.description,
                  location: newListing.address,
                  contact_info: newListing.phone,
                  accepted_materials: newListing.acceptedMaterials
                }));
              } else {
                ({ data, error } = await createRecyclerPartner({
                  user_id: currentUser.id,
                  name: newListing.shopName,
                  description: newListing.description,
                  location: newListing.address,
                  contact_info: newListing.phone,
                  accepted_materials: newListing.acceptedMaterials,
                  rating: 4.5
                }));
              }
              if (data) {
                if (editingPartner) {
                  setUserRecyclerPartners(userRecyclerPartners.map(p => p.id === editingPartner.id ? data[0] : p));
                  setRecyclerPartners(recyclerPartners.map(p => p.id === editingPartner.id ? data[0] : p));
                } else {
                  setUserRecyclerPartners([data[0], ...userRecyclerPartners]);
                  setRecyclerPartners([data[0], ...recyclerPartners]);
                }
              } else if (error) {
                console.error('Error with recycler partner:', error);
                alert('Failed to save listing. Please try again.');
              }
            }
            setShowCreateListing(false);
            setEditingPartner(null);
          }}
          onClose={() => {
            setShowCreateListing(false);
            setEditingPartner(null);
          }} 
        />
      )}

      {showCreateEvent && (
        <CreateNGOEvent 
          initialData={editingEvent}
          onSubmit={async (newEvent) => {
            if (currentUser) {
              let data, error;
              if (editingEvent) {
                ({ data, error } = await updateNGOEvent(editingEvent.id, {
                  ngo_name: newEvent.ngoName,
                  event_title: newEvent.title,
                  description: newEvent.description,
                  event_date: newEvent.eventDate,
                  location: newEvent.venue,
                  contact_info: newEvent.contactPerson,
                  volunteers_needed: newEvent.volunteersNeeded || 50,
                  images: newEvent.images || []
                }));
              } else {
                ({ data, error } = await createNGOEvent({
                  user_id: currentUser.id,
                  ngo_name: newEvent.ngoName,
                  event_title: newEvent.title,
                  description: newEvent.description,
                  event_date: newEvent.eventDate,
                  location: newEvent.venue,
                  contact_info: newEvent.contactPerson,
                  volunteers_needed: newEvent.volunteersNeeded || 50,
                  current_volunteers: 0,
                  images: newEvent.images || []
                }));
              }
              if (data) {
                if (editingEvent) {
                  setUserNgoEvents(userNgoEvents.map(e => e.id === editingEvent.id ? data[0] : e));
                  setNgoEvents(ngoEvents.map(e => e.id === editingEvent.id ? data[0] : e));
                } else {
                  setUserNgoEvents([data[0], ...userNgoEvents]);
                  setNgoEvents([data[0], ...ngoEvents]);
                }
              } else if (error) {
                console.error('Error with NGO event:', error);
                alert('Failed to save event. Please try again.');
              }
            }
            setShowCreateEvent(false);
            setEditingEvent(null);
          }}
          onClose={() => {
            setShowCreateEvent(false);
            setEditingEvent(null);
          }} 
        />
      )}
    </div>
  );
};