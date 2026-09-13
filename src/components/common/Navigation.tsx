import React from 'react';
import { Home, Leaf, RefreshCw, Recycle, User, Heart } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userType?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange, userType }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'reduce', label: 'Reduce', icon: Leaf },
    { id: 'reuse', label: 'Reuse', icon: RefreshCw },
    { id: 'recycle', label: 'Recycle', icon: Recycle },
    { id: 'foodshare', label: 'FoodShare', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="text-white shadow-lg" style={{
      background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
      borderBottom: '2px solid #FFD700'
    }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <h1 className="text-xl font-bold" style={{ color: '#FFD700' }}>RRR</h1>
            </div>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 hover:scale-105"
                    style={activeSection === item.id ? {
                      background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                      border: '1px solid #FFD700',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                    } : {
                      color: '#E6C55F',
                      border: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== item.id) {
                        e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)';
                        e.currentTarget.style.color = '#FFD700';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== item.id) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#E6C55F';
                      }
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-sm font-medium" style={{ color: '#E6C55F' }}>
            {userType === 'general' ? 'Public View' : 'Visitor'}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-bold transition-all duration-300"
                style={activeSection === item.id ? {
                  background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                  border: '1px solid #FFD700',
                  color: 'white'
                } : {
                  color: '#E6C55F'
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};