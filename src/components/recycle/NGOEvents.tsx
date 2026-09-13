import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { NGOEvent } from '../../types';
import { useAuth } from '../auth/AuthContext';
import { NGOEventModal } from './NGOEventModal';


interface NGOEventsProps {
  events?: any[];
  showEditDelete?: boolean;
  onEdit?: (event: any) => void;
  onDelete?: (eventId: string) => void;
}

export const NGOEvents: React.FC<NGOEventsProps> = ({ events: dbEvents = [], showEditDelete = false, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<NGOEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [events, setEvents] = useState<NGOEvent[]>([]);

  useEffect(() => {
    if (dbEvents.length > 0) {
      const formattedEvents = dbEvents.map((event: any) => {
        console.log('Event images from DB:', event.images);
        return {
          id: event.id,
          title: event.event_title,
          ngoId: event.id,
          ngoName: event.ngo_name,
          ngoLogo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop',
          contactPerson: event.contact_info?.split(',')[0] || 'Contact Person',
          phone: '+91-9876543210',
          whatsapp: '+91-9876543210',
          eventDate: new Date(event.event_date).toISOString().split('T')[0],
          eventTime: new Date(event.event_date).toLocaleTimeString(),
          venue: event.location,
          location: {
            lat: 28.6139,
            lng: 77.2090,
            address: event.location
          },
          description: event.description,
          images: (event.images && event.images.length > 0) ? event.images : ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
          createdAt: new Date(event.created_at)
        };
      });
      setEvents(formattedEvents);
    }
  }, [dbEvents]);

  const handleCreateEvent = (newEvent: Omit<NGOEvent, 'id' | 'createdAt'>) => {
    const event: NGOEvent = {
      ...newEvent,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setEvents([event, ...events]);
    setShowCreateForm(false);
  };

  const locations = ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
  const dateFilters = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || 
                           event.venue.toLowerCase().includes(selectedLocation.toLowerCase());
    
    let matchesDate = true;
    if (selectedDate !== 'all') {
      const eventDate = new Date(event.eventDate);
      const today = new Date();
      
      switch (selectedDate) {
        case 'today':
          matchesDate = eventDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          matchesDate = eventDate >= today && eventDate <= weekFromNow;
          break;
        case 'month':
          const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
          matchesDate = eventDate >= today && eventDate <= monthFromNow;
          break;
      }
    }
    
    return matchesSearch && matchesLocation && matchesDate;
  });

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
        }}>NGO Events</h2>
        <p className="text-xl" style={{
          color: '#E6C55F',
          textShadow: '0 0 10px rgba(230, 197, 95, 0.3)'
        }}>Community recycling events organized by NGO partners</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#FFD700'}} size={20} />
          <input
            type="text"
            placeholder="Search events, NGOs, or venues..."
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
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-4 py-3 rounded-lg focus:outline-none font-semibold"
          style={{
            background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            color: '#FFD700'
          }}
        >
          <option value="all" style={{background: '#1A1A1A', color: '#FFD700'}}>All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location} style={{background: '#1A1A1A', color: '#FFD700'}}>
              {location}
            </option>
          ))}
        </select>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-3 rounded-lg focus:outline-none font-semibold"
          style={{
            background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            color: '#FFD700'
          }}
        >
          {dateFilters.map((filter) => (
            <option key={filter.value} value={filter.value} style={{background: '#1A1A1A', color: '#FFD700'}}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {filteredEvents.map((event, index) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}
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
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="relative">
              <img
                src={event.images[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop'}
                alt={event.title}
                className="w-full h-48 object-cover"
                style={{borderRadius: '13px 13px 0 0'}}
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full" style={{
                background: 'rgba(255, 215, 0, 0.9)',
                backdropFilter: 'blur(10px)'
              }}>
                <span className="text-xs font-bold" style={{color: '#1A1A1A'}}>NGO EVENT</span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={event.ngoLogo}
                  alt={event.ngoName}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                  style={{border: '2px solid #FFD700'}}
                />
                <span className="text-sm font-semibold" style={{color: '#E6C55F'}}>{event.ngoName}</span>
              </div>

              <h3 className="text-lg font-bold mb-4 line-clamp-2" style={{color: 'white'}}>
                {event.title}
              </h3>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-3" style={{color: '#FFD700'}} />
                  <span style={{color: '#E6C55F'}}>{event.eventDate} at {event.eventTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-3" style={{color: '#FFD700'}} />
                  <span className="line-clamp-1" style={{color: '#E6C55F'}}>{event.venue}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{color: '#90EE90'}}>
                  <Users size={16} className="mr-2" style={{color: '#FFD700'}} />
                  <span className="text-sm font-medium">Community Event</span>
                </div>
                <button className="text-sm font-bold transition-all duration-500 hover:scale-110 hover:translate-x-2 hover:brightness-125" style={{color: '#FFD700'}}>
                  View Details →
                </button>
              </div>
              {showEditDelete && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(dbEvents.find(ev => ev.id === event.id));
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
                      if (confirm('Are you sure you want to delete this event?')) {
                        onDelete?.(event.id);
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

      {filteredEvents.length === 0 && events.length > 0 && (
        <div className="text-center py-12">
          <p className="text-lg" style={{color: '#E6C55F'}}>No events found</p>
          <p className="mt-2" style={{color: '#FFD700'}}>Try adjusting your search criteria</p>
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto mb-4" style={{color: '#FFD700'}} size={48} />
          <p className="text-lg" style={{color: '#E6C55F'}}>No NGO events available</p>
          <p className="mt-2" style={{color: '#FFD700'}}>Check back later for community recycling events</p>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <NGOEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};