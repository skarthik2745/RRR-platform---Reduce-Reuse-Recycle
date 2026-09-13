import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, User, Camera } from 'lucide-react';
import { ClimateEvent } from '../../types';
import { useAuth } from '../auth/AuthContext';
import { getClimateEvents } from '../../lib/database';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

export const ClimateEvents: React.FC = () => {
  const { user } = useAuth();
  const [showPostForm, setShowPostForm] = useState(false);
  const [events, setEvents] = useState<ClimateEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      const { data, error } = await getClimateEvents();
      if (data && data.length > 0) {
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          photo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
          location: {
            lat: 28.6139,
            lng: 77.2090,
            address: event.location || 'Event Location'
          },
          userId: event.organizer || 'organizer',
          userName: event.organizer || 'Event Organizer',
          userType: 'ngo' as const,
          createdAt: new Date(event.created_at)
        }));
        setEvents(formattedEvents);
      } else {
        // Load dummy data if no database data
        setEvents([
          {
            id: '1',
            title: 'Community Tree Plantation Drive',
            description: 'Join us for a massive tree plantation drive in Central Park. We aim to plant 500 saplings in one day!',
            photo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
            location: {
              lat: 28.6139,
              lng: 77.2090,
              address: 'Central Park, New Delhi'
            },
            userId: '1',
            userName: 'Green Warriors NGO',
            userType: 'ngo' as const,
            createdAt: new Date()
          },
          {
            id: '2',
            title: 'Beach Cleanup Campaign',
            description: 'Help us clean the coastline and protect marine life from plastic pollution',
            photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
            location: {
              lat: 28.6315,
              lng: 77.2167,
              address: 'Sunset Beach'
            },
            userId: '2',
            userName: 'Ocean Guardians',
            userType: 'ngo' as const,
            createdAt: new Date()
          },
          {
            id: '3',
            title: 'Renewable Energy Fair',
            description: 'Explore solar, wind, and other renewable energy solutions for homes',
            photo: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
            location: {
              lat: 28.5355,
              lng: 77.3910,
              address: 'Convention Center'
            },
            userId: '3',
            userName: 'Clean Energy Alliance',
            userType: 'ngo' as const,
            createdAt: new Date()
          }
        ]);
      }
    };
    
    loadData();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photo: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const { data, error } = await supabase
      .from('climate_events')
      .insert([{
        title: formData.title,
        description: formData.description,
        location: formData.location || 'Event Location',
        organizer: currentUser.user_metadata?.full_name || 'Organizer',
        max_participants: 100,
        current_participants: 0,
        points_reward: 50
      }]);

    if (data) {
      const newEvent: ClimateEvent = {
        id: data[0].id,
        title: formData.title,
        description: formData.description,
        photo: formData.photo || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
        location: {
          lat: 28.6139,
          lng: 77.2090,
          address: formData.location || 'Event Location'
        },
        userId: currentUser.id,
        userName: currentUser.user_metadata?.full_name || 'Organizer',
        userType: 'ngo' as const,
        createdAt: new Date()
      };

      setEvents([newEvent, ...events]);
    }
    
    setFormData({ title: '', description: '', photo: '', location: '' });
    setShowPostForm(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Climate Events</h2>
          <p className="text-gray-600">Community events for environmental awareness</p>
        </div>
        <button
          onClick={() => setShowPostForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
        >
          <Plus className="mr-2" size={20} />
          Post Event
        </button>
      </div>

      {/* Post Event Form */}
      {showPostForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Post Climate Event</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">Upload event photo</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder={user?.location.address}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Post Event
              </button>
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={event.photo}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{event.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.userType === 'ecorecycler' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {event.userType === 'ecorecycler' ? 'Partner' : 'Community'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <User size={14} className="mr-2" />
                  <span>{event.userName}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2" />
                  <span>{event.location.address}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  <span>{event.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};