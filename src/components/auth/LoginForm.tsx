import React, { useState } from 'react';
import { User } from '../../types';
import { useAuth } from './AuthContext';
import { signIn, getUserProfile } from '../../lib/auth';
import { Leaf, Recycle } from 'lucide-react';
import logo from '../logo1.jpg';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await signIn(identifier, password);
    
    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }
    
    if (data.user) {
      try {
        const { data: profile, error: profileError } = await getUserProfile(data.user.id);
        
        const user: User = {
          id: data.user.id,
          fullName: profile?.full_name || data.user.user_metadata?.full_name || 'User',
          phone: profile?.phone || identifier,
          whatsapp: profile?.whatsapp || identifier,
          email: data.user.email || profile?.email,
          profilePhoto: profile?.profile_photo,
          location: profile?.location || {
            lat: 28.6139,
            lng: 77.2090,
            address: 'New Delhi, India'
          },
          userType: profile?.user_type || 'general',
          organizationName: profile?.organization_name,
          description: profile?.description,
          acceptedItems: profile?.accepted_items,
          ecoBadges: [],
          challengeHistory: []
        };
        login(user);
      } catch (err) {
        console.error('Profile fetch error:', err);
        // Fallback user if profile fetch fails
        const fallbackUser: User = {
          id: data.user.id,
          fullName: data.user.user_metadata?.full_name || 'User',
          phone: identifier,
          whatsapp: identifier,
          email: data.user.email,
          location: {
            lat: 28.6139,
            lng: 77.2090,
            address: 'New Delhi, India'
          },
          userType: 'general',
          ecoBadges: [],
          challengeHistory: []
        };
        login(fallbackUser);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #1A1A1A, #0E2B19)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <div className="max-w-lg w-full p-8 shadow-2xl animate-fadeIn" style={{
        background: 'linear-gradient(135deg, #0E2B19, #1A1A1A)',
        border: '3px solid #FFD700',
        borderRadius: '20px',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
      }}>
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="relative p-1 rounded-2xl mx-auto" style={{
              width: '280px',
              background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700, #DAA520)',
              backgroundSize: '400% 400%',
              animation: 'gradient 3s ease infinite',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.4)'
            }}>
              <img 
                src={logo} 
                alt="RRR Platform" 
                className="w-full h-40 object-cover rounded-xl"
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4" style={{
            color: '#FFD700',
            fontFamily: 'Poppins, Montserrat',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.5)'
          }}>Welcome to RRR</h1>
          <p className="text-xl" style={{
            color: '#E6C55F',
            fontFamily: 'Poppins, Montserrat'
          }}>Reduce • Reuse • Recycle</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Phone Number / Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
              placeholder="Enter phone number or email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#FFD700'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-400"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D5016)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                color: '#FFD700'
              }}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white py-4 px-6 rounded-lg transition-all duration-500 hover:scale-105 hover:brightness-125 font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, #B8860B, #DAA520)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            }}
          >
            Login to RRR
          </button>
        </form>
        <p className="mt-6 text-center text-sm" style={{color: '#E6C55F'}}>
          Don't have an account?{' '}
          <button
            onClick={onToggleMode}
            className="font-medium transition-colors duration-300 hover:brightness-125"
            style={{color: '#FFD700'}}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};