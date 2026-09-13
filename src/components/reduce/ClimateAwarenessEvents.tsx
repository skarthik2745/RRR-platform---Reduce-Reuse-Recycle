import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, User, Phone, Mail, Eye } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ImageViewer } from '../recycle/ImageViewer';
import { getClimateEvents, createClimateEvent, getUserClimateEvents, updateClimateEvent, deleteClimateEvent } from '../../lib/database';
import { getCurrentUser } from '../../lib/auth';

interface ClimateEvent {
  id: string;
  eventName: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  category: string;
  images: string[];
  userId: string;
  userName: string;
  userType: string;
  phone: string;
  email: string;
  address: string;
  profilePhoto: string;
  createdAt: Date;
}

export const ClimateAwarenessEvents: React.FC = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClimateEvent | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [events, setEvents] = useState<ClimateEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [myEvents, setMyEvents] = useState<ClimateEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<ClimateEvent | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      const { data } = await getClimateEvents();
      if (data && data.length > 0) {
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          eventName: event.title,
          description: event.description,
          eventDate: event.event_date?.split('T')[0] || '',
          eventTime: event.event_time || '',
          location: event.location,
          category: event.category || 'Climate Action',
          images: event.photo ? [event.photo] : ['https://images.unsplash.com/photo-1569163139394-de44cb5894c6?w=400&h=300&fit=crop'],
          userId: event.user_id,
          userName: event.organizer_name || event.profiles?.full_name || 'Anonymous',
          userType: 'General User',
          phone: event.organizer_phone || event.profiles?.phone || '+91-9876543210',
          email: event.organizer_email || event.profiles?.email || 'user@example.com',
          address: event.location,
          profilePhoto: '',
          createdAt: new Date(event.created_at)
        }));
        setEvents(formattedEvents);
      } else {
        // Load dummy data if no database data
        setEvents([
          {
            id: '1',
            eventName: 'Community Tree Planting Drive',
            description: 'Join us for a massive tree planting initiative to combat climate change and restore our local ecosystem.',
            eventDate: '2024-02-15',
            eventTime: '09:00',
            location: 'Central Park, Green Valley',
            category: 'Tree Plantation',
            images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'],
            userId: 'user1',
            userName: 'Green Earth Foundation',
            userType: 'NGO Partner',
            phone: '+1-555-0123',
            email: 'contact@greenearth.org',
            address: '123 Eco Street, Green Valley',
            profilePhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=50&h=50&fit=crop',
            createdAt: new Date('2024-01-10')
          }
        ]);
      }
    };
    
    loadData();
  }, []);

  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    category: 'Awareness Campaign',
    images: [] as string[],
    organizerPhone: ''
  });

  const categories = [
    'Awareness Campaign',
    'Tree Plantation',
    'Beach Cleanup',
    'Waste Management',
    'Renewable Energy',
    'Wildlife Conservation',
    'Climate Action',
    'Sustainability Workshop'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, result]
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to create events');
      return;
    }

    try {
      if (editingEvent) {
        const { data, error } = await updateClimateEvent(editingEvent.id, {
          title: formData.eventName,
          description: formData.description,
          location: formData.location,
          photo: formData.images?.[0] || null,
          organizer_name: currentUser.fullName || currentUser.organizationName,
          organizer_phone: currentUser.phone,
          organizer_email: currentUser.email
        });

        if (error) {
          console.error('Error updating climate event:', error);
          alert('Failed to update event. Please try again.');
          return;
        }

        if (data && data.length > 0) {
          const updatedEvent = {
            ...editingEvent,
            eventName: formData.eventName,
            description: formData.description,
            location: formData.location,
            images: formData.images
          };
          setMyEvents(myEvents.map(e => e.id === editingEvent.id ? updatedEvent : e));
          console.log('Event updated successfully:', data);
        } else {
          console.error('Update failed - no data returned');
        }
        setEditingEvent(null);
      } else {
        const { data, error } = await createClimateEvent({
          user_id: currentUser.id,
          title: formData.eventName,
          description: formData.description,
          location: formData.location,
          images: formData.images,
          organizer_name: currentUser.user_metadata?.full_name || currentUser.fullName || 'Organizer',
          organizer_phone: formData.organizerPhone,
          organizer_email: currentUser.email,
          event_date: formData.eventDate,
          event_time: formData.eventTime
        });

        if (error) {
          console.error('Error creating climate event:', error);
          alert('Failed to create event. Please try again.');
          return;
        }

        if (data && data.length > 0) {
          const newEvent: ClimateEvent = {
            id: data[0].id,
            ...formData,
            userId: currentUser.id,
            userName: currentUser.organizationName || currentUser.fullName,
            userType: currentUser.userType === 'ecorecycler' ? 'EcoRecycler Partner' : currentUser.userType === 'ngo' ? 'NGO Partner' : 'General User',
            phone: currentUser.phone,
            email: currentUser.email || '',
            address: currentUser.location?.address || '',
            profilePhoto: currentUser.profilePhoto || '',
            createdAt: new Date()
          };

          setEvents([newEvent, ...events]);
        }
      }

      setFormData({
        eventName: '',
        description: '',
        eventDate: '',
        eventTime: '',
        location: '',
        category: 'Awareness Campaign',
        images: []
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save event. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2" style={{
          color: '#FFD700',
          fontFamily: 'Poppins, Montserrat, Playfair Display',
          textShadow: '0 0 25px rgba(255, 215, 0, 0.5)'
        }}>Climate Awareness Events</h2>
        <p className="text-xl" style={{
          color: '#E6C55F',
          textShadow: '0 0 10px rgba(230, 197, 95, 0.3)'
        }}>Create and join climate action events</p>
      </div>
      <div className="flex justify-end mb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateForm(true)}
            className="text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center font-semibold hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #B8860B, #DAA520)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            }}
          >
            <Plus className="mr-2" size={20} />
            Create Event
          </button>
          <button
            onClick={async () => {
              if (currentUser) {
                const { data } = await getClimateEvents();
                if (data) {
                  const myEventsFiltered = data.filter((event: any) => 
                    event.organizer_email === currentUser.email
                  );
                  const formattedEvents = myEventsFiltered.map((event: any) => ({
                    id: event.id,
                    eventName: event.title,
                    description: event.description,
                    eventDate: '',
                    eventTime: '',
                    location: event.location,
                    category: 'Climate Action',
                    images: event.photo ? [event.photo] : [],
                    userId: event.user_id,
                    userName: event.organizer_name || 'You',
                    userType: 'General User',
                    phone: event.organizer_phone || '',
                    email: event.organizer_email || '',
                    address: event.location,
                    profilePhoto: '',
                    createdAt: new Date(event.created_at)
                  }));
                  setMyEvents(formattedEvents);
                }
              }
              setShowMyEvents(true);
            }}
            className="text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center font-semibold hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #4B0082, #6A0DAD)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(75, 0, 130, 0.3)'
            }}
          >
            <User className="mr-2" size={20} />
            My Events
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(showMyEvents ? myEvents : events).map((event, index) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className="cursor-pointer transition-all duration-700 hover:scale-105 hover:-translate-y-4 hover:rotate-1 animate-slideUp group overflow-hidden"
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
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="relative">
              <img
                src={event.images[0] || 'https://images.unsplash.com/photo-1569163139394-de44cb5894c6?w=400&h=200&fit=crop'}
                alt={event.eventName}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-green-600">{event.category}</span>
              </div>
              {event.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                  +{event.images.length - 1} more
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2" style={{color: 'white'}}>{event.eventName}</h3>
                <p className="text-sm" style={{color: '#E6C55F'}}>By: {event.userName}</p>
              </div>

              <div className="mb-4 space-y-2">
                {(event.eventDate || event.eventTime) && (
                  <div className="flex items-center text-sm" style={{color: '#E6C55F'}}>
                    <Calendar size={16} className="mr-2" style={{color: '#FFD700'}} />
                    <span>{event.eventDate} {event.eventTime && `at ${event.eventTime}`}</span>
                  </div>
                )}
                <div className="flex items-center text-sm" style={{color: '#E6C55F'}}>
                  <MapPin size={16} className="mr-2" style={{color: '#FFD700'}} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm" style={{color: '#E6C55F'}}>
                  <User size={16} className="mr-2" style={{color: '#FFD700'}} />
                  <span>{event.userName}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm line-clamp-2" style={{color: '#E6C55F'}}>{event.description}</p>
              </div>

              <div className="mb-4">
                <span
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    background: 'rgba(255, 215, 0, 0.2)',
                    color: '#FFD700',
                    border: '1px solid #FFD700'
                  }}
                >
                  {event.category}
                </span>
              </div>

              <div className="flex justify-center space-x-2">
                {showMyEvents ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingEvent(event);
                        setFormData({
                          eventName: event.eventName,
                          description: event.description,
                          eventDate: event.eventDate,
                          eventTime: event.eventTime,
                          location: event.location,
                          category: event.category,
                          images: event.images
                        });
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 hover:scale-125"
                      style={{ background: '#22C55E' }}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (confirm('Delete this event?')) {
                          const { error } = await deleteClimateEvent(event.id);
                          if (error) {
                            console.error('Delete failed:', error);
                            alert('Failed to delete event');
                          } else {
                            setMyEvents(myEvents.filter(e => e.id !== event.id));
                            console.log('Event deleted successfully');
                          }
                        }
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 hover:scale-125"
                      style={{ background: '#EF4444' }}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${event.phone}`, '_self');
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 hover:scale-125"
                      style={{ background: '#CFAF4C' }}
                      title="Call"
                    >
                      <Phone size={12} style={{color: 'white'}} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`mailto:${event.email}`, '_blank');
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 hover:scale-125"
                      style={{ background: '#075E36' }}
                      title="Email"
                    >
                      <Mail size={12} style={{color: 'white'}} />
                    </button>
                  </>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 hover:scale-125"
                  style={{ background: '#4B0082' }}
                  title="View"
                >
                  <Eye size={12} style={{color: 'white'}} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showMyEvents && (
        <div className="text-center mb-6">
          <button
            onClick={() => setShowMyEvents(false)}
            className="px-4 py-2 rounded-lg" 
            style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700', border: '1px solid #FFD700' }}
          >
            ← Back to All Events
          </button>
        </div>
      )}

      {(showMyEvents ? myEvents : events).length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <Calendar className="mx-auto mb-4" style={{ color: '#B8860B' }} size={48} />
          <p className="text-lg" style={{ color: '#E6C55F' }}>
            {showMyEvents ? 'No events created yet' : 'No climate events yet'}
          </p>
          <p className="mt-2" style={{ color: '#B8860B' }}>
            {showMyEvents ? 'Create your first event!' : 'Be the first to create a climate awareness event!'}
          </p>
        </div>
      )}

      {/* Create/Edit Event Modal */}
      {(showCreateForm || editingEvent) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{
            background: 'rgba(45, 80, 22, 0.95)',
            border: '2px solid rgba(255, 215, 0, 0.5)'
          }}>
            <div className="p-6 border-b border-yellow-400 flex justify-between items-center">
              <h3 className="text-xl font-semibold" style={{ color: '#FFD700' }}>
                {editingEvent ? 'Edit Climate Event' : 'Create Climate Event'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingEvent(null);
                }}
                className="text-white hover:text-yellow-400 transition-colors p-1"
                style={{ fontSize: '24px' }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#E6C55F' }}>Event Name *</label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  style={{
                    background: 'rgba(45, 80, 22, 0.3)',
                    borderColor: '#FFD700',
                    color: '#FFD700'
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#E6C55F' }}>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  style={{
                    background: 'rgba(45, 80, 22, 0.3)',
                    borderColor: '#FFD700',
                    color: '#FFD700'
                  }}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#E6C55F' }}>Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{
                      background: 'rgba(45, 80, 22, 0.3)',
                      borderColor: '#FFD700',
                      color: '#FFD700'
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#E6C55F' }}>Event Time *</label>
                  <input
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventTime: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{
                      background: 'rgba(45, 80, 22, 0.3)',
                      borderColor: '#FFD700',
                      color: '#FFD700'
                    }}
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#E6C55F' }}>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{
                      background: 'rgba(45, 80, 22, 0.3)',
                      borderColor: '#FFD700',
                      color: '#FFD700'
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#E6C55F' }}>Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.organizerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizerPhone: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{
                      background: 'rgba(45, 80, 22, 0.3)',
                      borderColor: '#FFD700',
                      color: '#FFD700'
                    }}
                    placeholder={currentUser?.phone || 'Enter phone number'}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#E6C55F' }}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  style={{
                    background: 'rgba(45, 80, 22, 0.3)',
                    borderColor: '#FFD700',
                    color: '#FFD700'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} style={{background: '#1A1A1A', color: '#FFD700'}}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#E6C55F' }}>Event Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:cursor-pointer"
                  style={{
                    background: 'rgba(45, 80, 22, 0.3)',
                    borderColor: '#FFD700',
                    color: '#FFD700'
                  }}
                />
                <style jsx>{`
                  input[type="file"]::-webkit-file-upload-button {
                    background: linear-gradient(135deg, #B8860B, #DAA520);
                    border: 2px solid #FFD700;
                    color: white;
                    border-radius: 8px;
                    padding: 8px 16px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-right: 16px;
                  }
                  input[type="date"]::-webkit-calendar-picker-indicator,
                  input[type="time"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) sepia(1) saturate(5) hue-rotate(35deg);
                    cursor: pointer;
                  }
                `}</style>
              </div>
              {formData.images.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2" style={{color: '#E6C55F'}}>Uploaded Images ({formData.images.length})</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 rounded-xl mb-4" style={{
                background: 'rgba(45, 80, 22, 0.2)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
              }}>
                <h4 className="font-semibold mb-2" style={{color: '#FFD700'}}>Organizer Information (Auto-filled)</h4>
                <div className="text-sm">
                  <div>
                    <span style={{color: '#E6C55F'}}>Email:</span>
                    <span className="ml-2 font-medium" style={{color: '#FFD700'}}>{currentUser?.email || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105" style={{
                  background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                  border: '2px solid #FFD700'
                }}>
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button type="button" onClick={() => {
                  setShowCreateForm(false);
                  setEditingEvent(null);
                }} className="flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105" style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  color: '#FFD700',
                  border: '1px solid #FFD700'
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{
            background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
            border: '3px solid #FFD700',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(255, 215, 0, 0.3)'
          }}>
            <div className="relative">
              <img
                src={selectedEvent.images[0] || 'https://images.unsplash.com/photo-1569163139394-de44cb5894c6?w=800&h=300&fit=crop'}
                alt={selectedEvent.eventName}
                className="w-full h-64 object-cover rounded-t-2xl cursor-pointer"
                onClick={() => setSelectedImageIndex(0)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl"></div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{
                  background: 'rgba(255, 215, 0, 0.9)',
                  color: '#1A1A1A',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
              >
                ×
              </button>
              <div className="absolute bottom-4 left-6">
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{
                    background: 'rgba(255, 215, 0, 0.9)',
                    color: '#1A1A1A'
                  }}
                >
                  {selectedEvent.category}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>{selectedEvent.eventName}</h2>
              <p className="text-lg mb-6" style={{ color: '#E6C55F' }}>{selectedEvent.description}</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl" style={{
                  background: 'rgba(45, 80, 22, 0.3)',
                  border: '2px solid rgba(255, 215, 0, 0.5)'
                }}>
                  <h3 className="font-bold mb-4 text-xl" style={{ color: '#FFD700' }}>Event Details</h3>
                  <div className="space-y-3">
                    {(selectedEvent.eventDate || selectedEvent.eventTime) && (
                      <div className="flex items-center">
                        <Calendar size={20} className="mr-3" style={{ color: '#FFD700' }} />
                        <span style={{ color: '#E6C55F' }}>{selectedEvent.eventDate} {selectedEvent.eventTime && `at ${selectedEvent.eventTime}`}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <MapPin size={20} className="mr-3" style={{ color: '#FFD700' }} />
                      <span style={{ color: '#E6C55F' }}>{selectedEvent.location}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-xl" style={{
                  background: 'rgba(45, 80, 22, 0.3)',
                  border: '2px solid rgba(255, 215, 0, 0.5)'
                }}>
                  <h3 className="font-bold mb-4 text-xl" style={{ color: '#FFD700' }}>Organizer Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User size={20} className="mr-3" style={{ color: '#FFD700' }} />
                      <span style={{ color: '#E6C55F' }}>{selectedEvent.userName} ({selectedEvent.userType})</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={20} className="mr-3" style={{ color: '#FFD700' }} />
                      <span style={{ color: '#E6C55F' }}>{selectedEvent.phone}</span>
                    </div>
                    {selectedEvent.email && (
                      <div className="flex items-center">
                        <Mail size={20} className="mr-3" style={{ color: '#FFD700' }} />
                        <span style={{ color: '#E6C55F' }}>{selectedEvent.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-8">
                <button
                  onClick={() => window.open(`tel:${selectedEvent.phone}`, '_self')}
                  className="flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #CFAF4C, #DAA520)',
                    color: 'white',
                    border: '2px solid #FFD700'
                  }}
                >
                  <Phone className="mr-2" size={18} />
                  Call Now
                </button>
                <button
                  onClick={() => window.open(`mailto:${selectedEvent.email}`, '_blank')}
                  className="flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #075E36, #228B22)',
                    color: 'white',
                    border: '2px solid #FFD700'
                  }}
                >
                  <Mail className="mr-2" size={18} />
                  Send Email
                </button>
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedEvent.location)}`, '_blank')}
                  className="flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #8B0000, #DC143C)',
                    color: 'white',
                    border: '2px solid #FFD700'
                  }}
                >
                  <MapPin className="mr-2" size={18} />
                  View Location
                </button>
              </div>
              
              {selectedEvent.images.length > 0 && (
                <div className="mt-8 p-6 rounded-xl" style={{
                  background: 'rgba(45, 80, 22, 0.3)',
                  border: '2px solid rgba(255, 215, 0, 0.5)'
                }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFD700' }}>Event Images</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {selectedEvent.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Event ${idx + 1}`}
                        className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImageIndex(idx)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer */}
      {selectedImageIndex !== null && selectedEvent && (
        <ImageViewer
          images={selectedEvent.images}
          currentIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
          onNext={() => setSelectedImageIndex((selectedImageIndex + 1) % selectedEvent.images.length)}
          onPrev={() => setSelectedImageIndex((selectedImageIndex - 1 + selectedEvent.images.length) % selectedEvent.images.length)}
        />
      )}
    </div>
  );
};