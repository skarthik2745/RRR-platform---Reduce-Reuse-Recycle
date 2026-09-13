import React from 'react';
import { Leaf, RefreshCw, Recycle, Heart, Users, Award, ArrowRight, Target, Shield, Smartphone, TrendingUp, Calculator, MapPin, Building, Utensils } from 'lucide-react';

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
    50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4); }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(1deg); }
    75% { transform: rotate(-1deg); }
  }
  @keyframes goldFlow {
    0% { 
      background: conic-gradient(from 0deg, #FFD700, #FFA500, #DAA520, #FFD700, #FFA500);
      box-shadow: 
        0 0 30px rgba(255, 215, 0, 0.8),
        0 0 60px rgba(255, 215, 0, 0.6),
        inset 0 0 20px rgba(255, 215, 0, 0.3);
    }
    100% {
      background: conic-gradient(from 360deg, #FFD700, #FFA500, #DAA520, #FFD700, #FFA500);
      box-shadow: 
        0 0 40px rgba(255, 215, 0, 1.0),
        0 0 80px rgba(255, 215, 0, 0.8),
        inset 0 0 30px rgba(255, 215, 0, 0.4);
    }
  }
  .glow-animation {
    animation: glow 2s ease-in-out infinite;
  }
  .shimmer-animation {
    position: relative;
    overflow: hidden;
  }
  .shimmer-animation::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: shimmer 3s infinite;
  }
  .wiggle-animation {
    animation: wiggle 2s ease-in-out infinite;
  }
  .royal-border {
    animation: goldFlow 4s ease-in-out infinite;
    padding: 6px;
  }
`;
document.head.appendChild(style);

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen recycle-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-16">
          <div className="relative p-12 text-center" style={{
            background: 'linear-gradient(135deg, #2D5016, #1A1A1A)',
            border: '3px solid #FFD700',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
          }}>
            <div className="mb-8">
              <div className="relative rounded-3xl mb-6 mx-auto royal-border" style={{
                width: '700px'
              }}>
                <img 
                  src="/logo1.jpg" 
                  alt="RRR Platform" 
                  className="w-full h-72 object-cover rounded-2xl"
                  style={{
                    filter: 'brightness(1.1) contrast(1.05)'
                  }}
                />
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-4" style={{
              fontFamily: 'Montserrat',
              color: '#FFD700',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.5)'
            }}>
              Building a Zero-Waste & Climate-Resilient Community
            </h1>
            <p className="text-xl mb-8 font-medium" style={{color: '#E6C55F'}}>A unified digital ecosystem for sustainability, food-sharing, recycling, and climate action.</p>
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 font-medium" style={{
                background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                border: '2px solid #FFD700',
                color: 'white'
              }}>
                Explore Platform
              </button>
              <button className="px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 font-medium" style={{
                border: '2px solid #FFD700',
                color: '#FFD700',
                background: 'transparent'
              }}>
                Join Community
              </button>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-xl glow-animation transition-all duration-500 transform hover:scale-105" style={{
            background: 'rgba(45, 80, 22, 0.2)',
            border: '2px solid #FFD700',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
            e.currentTarget.style.transform = 'scale(1.05) rotateY(5deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
            e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
          }}>
            <h2 className="text-3xl font-bold mb-4" style={{color: '#FFD700', textShadow: '0 0 25px rgba(255, 215, 0, 0.5)'}}>Mission</h2>
            <p style={{color: '#E6C55F'}}>A unified digital ecosystem that empowers individuals and communities to adopt sustainable practices through waste reduction, resource sharing, climate education, and community action.</p>
          </div>
          <div className="p-8 rounded-xl shimmer-animation transition-all duration-500 transform hover:scale-105" style={{
            background: 'rgba(45, 80, 22, 0.2)',
            border: '2px solid #FFD700',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
            e.currentTarget.style.transform = 'scale(1.05) rotateY(5deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
            e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
          }}>
            <h2 className="text-3xl font-bold mb-4" style={{color: '#FFD700', textShadow: '0 0 25px rgba(255, 215, 0, 0.5)'}}>Vision</h2>
            <p style={{color: '#E6C55F'}}>A globally connected community where everyone contributes to environmental conservation through the principles of Reduce, Reuse, Recycle, and FoodShare.</p>
          </div>
        </div>

        {/* Pillars Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12" style={{color: '#FFD700'}}>Our Four Pillars</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {/* REDUCE */}
            <div className="p-6 rounded-xl glow-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05) rotateY(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
            }}>
              <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white p-4 text-center rounded-lg mb-4">
                <Leaf size={48} className="mx-auto mb-2" />
                <h3 className="text-2xl font-bold">REDUCE</h3>
              </div>
              <ul className="space-y-2 text-sm" style={{color: '#E6C55F'}}>
                <li>• Eco Challenges</li>
                <li>• Eco Tips</li>
                <li>• Food Expiry Logger</li>
                <li>• Carbon Calculator</li>
                <li>• Climate Awareness</li>
                <li>• Home Energy Audit</li>
              </ul>
            </div>

            {/* REUSE */}
            <div className="p-6 rounded-xl shimmer-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05) rotateY(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
            }}>
              <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white p-4 text-center rounded-lg mb-4">
                <RefreshCw size={48} className="mx-auto mb-2" />
                <h3 className="text-2xl font-bold">REUSE</h3>
              </div>
              <ul className="space-y-2 text-sm" style={{color: '#E6C55F'}}>
                <li>• Marketplace</li>
                <li>• Item Sharing</li>
                <li>• User Profiles</li>
                <li>• Location-Based Exchanges</li>
              </ul>
            </div>

            {/* RECYCLE */}
            <div className="p-6 rounded-xl wiggle-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05) rotateY(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
            }}>
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 text-center rounded-lg mb-4">
                <Recycle size={48} className="mx-auto mb-2" />
                <h3 className="text-2xl font-bold">RECYCLE</h3>
              </div>
              <ul className="space-y-2 text-sm" style={{color: '#E6C55F'}}>
                <li>• Recycler Directory</li>
                <li>• NGO Events</li>
                <li>• Recycling Guidelines</li>
                <li>• Partner Facilities</li>
              </ul>
            </div>

            {/* FOODSHARE */}
            <div className="p-6 rounded-xl glow-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05) rotateY(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
            }}>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 text-center rounded-lg mb-4">
                <Heart size={48} className="mx-auto mb-2" />
                <h3 className="text-2xl font-bold">FOODSHARE</h3>
              </div>
              <ul className="space-y-2 text-sm" style={{color: '#E6C55F'}}>
                <li>• Care Homes Network</li>
                <li>• Leftover Food Posts</li>
                <li>• Food Rescue System</li>
                <li>• Nutrition Impact</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" style={{color: '#FFD700'}}>Key Features</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl glow-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
            }}>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 text-center rounded-lg mb-4">
                <Award size={32} className="mx-auto mb-2" />
                <h3 className="font-bold">Unified Points System</h3>
              </div>
              <p className="text-sm" style={{color: '#E6C55F'}}>Earn rewards across all activities</p>
            </div>
            <div className="p-6 rounded-xl shimmer-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
            }}>
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 text-center rounded-lg mb-4">
                <Shield size={32} className="mx-auto mb-2" />
                <h3 className="font-bold">Role-Based Authentication</h3>
              </div>
              <p className="text-sm" style={{color: '#E6C55F'}}>Customized experience for each user type</p>
            </div>
            <div className="p-6 rounded-xl wiggle-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
            }}>
              <div className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white p-4 text-center rounded-lg mb-4">
                <TrendingUp size={32} className="mx-auto mb-2" />
                <h3 className="font-bold">Real-Time Updates</h3>
              </div>
              <p className="text-sm" style={{color: '#E6C55F'}}>Live tracking of environmental impact</p>
            </div>
            <div className="p-6 rounded-xl glow-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
            }}>
              <div className="bg-gradient-to-r from-red-600 to-pink-700 text-white p-4 text-center rounded-lg mb-4">
                <Smartphone size={32} className="mx-auto mb-2" />
                <h3 className="font-bold">Mobile Responsive</h3>
              </div>
              <p className="text-sm" style={{color: '#E6C55F'}}>Access anywhere, anytime</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" style={{color: '#FFD700'}}>How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl glow-animation transition-all duration-500 transform hover:scale-105" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}>
              <div className="bg-gradient-to-r from-green-600 to-teal-700 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-bold mb-2" style={{color: '#FFD700'}}>Sign Up</h3>
              <p className="text-sm" style={{color: '#E6C55F'}}>Create your account and choose your role</p>
            </div>
            <div className="text-center p-6 rounded-xl shimmer-animation transition-all duration-500 transform hover:scale-105" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}>
              <div className="bg-gradient-to-r from-blue-600 to-cyan-700 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-bold mb-2" style={{color: '#FFD700'}}>Choose Your Action</h3>
              <p className="text-sm" style={{color: '#E6C55F'}}>Select from Reduce, Reuse, Recycle, or FoodShare</p>
            </div>
            <div className="text-center p-6 rounded-xl wiggle-animation transition-all duration-500 transform hover:scale-105" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}>
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-bold mb-2" style={{color: '#FFD700'}}>Take Action</h3>
              <p className="text-sm" style={{color: '#E6C55F'}}>Complete tasks, share items, or participate in events</p>
            </div>
            <div className="text-center p-6 rounded-xl glow-animation transition-all duration-500 transform hover:scale-105" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="font-bold mb-2" style={{color: '#FFD700'}}>Track Impact</h3>
              <p className="text-sm" style={{color: '#E6C55F'}}>Earn points and see your environmental impact</p>
            </div>
          </div>
        </div>

        {/* Community Statistics Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" style={{color: '#FFD700'}}>Community Impact</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="p-6 rounded-xl glow-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
            }}>
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 text-center rounded-lg mb-4">
                <Users size={32} className="mx-auto mb-2" />
                <div className="text-2xl font-bold">10,000+</div>
              </div>
              <div className="text-sm" style={{color: '#E6C55F'}}>Users Joined</div>
            </div>
            <div className="p-6 rounded-xl shimmer-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
            }}>
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 text-center rounded-lg mb-4">
                <Recycle size={32} className="mx-auto mb-2" />
                <div className="text-2xl font-bold">50,000kg</div>
              </div>
              <div className="text-sm" style={{color: '#E6C55F'}}>Waste Reduced</div>
            </div>
            <div className="p-6 rounded-xl wiggle-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
            }}>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 text-center rounded-lg mb-4">
                <Utensils size={32} className="mx-auto mb-2" />
                <div className="text-2xl font-bold">25,000kg</div>
              </div>
              <div className="text-sm" style={{color: '#E6C55F'}}>Food Shared</div>
            </div>
            <div className="p-6 rounded-xl glow-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
            }}>
              <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white p-4 text-center rounded-lg mb-4">
                <RefreshCw size={32} className="mx-auto mb-2" />
                <div className="text-2xl font-bold">75,000+</div>
              </div>
              <div className="text-sm" style={{color: '#E6C55F'}}>Items Reused</div>
            </div>
            <div className="p-6 rounded-xl shimmer-animation transition-all duration-500 transform hover:scale-105 overflow-hidden" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
            }}>
              <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white p-4 text-center rounded-lg mb-4">
                <Leaf size={32} className="mx-auto mb-2" />
                <div className="text-2xl font-bold">100 tons</div>
              </div>
              <div className="text-sm" style={{color: '#E6C55F'}}>CO₂ Saved</div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" style={{color: '#FFD700'}}>Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl glow-animation transition-all duration-500 transform hover:scale-105" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05) rotateY(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
            }}>
              <p className="mb-4" style={{color: '#E6C55F'}}>"The food expiry logger helped me reduce food waste by 80%. I've saved money and helped the environment!"</p>
              <p className="font-bold" style={{color: '#FFD700'}}>- Sarah M., Community Member</p>
            </div>
            <div className="p-6 rounded-xl shimmer-animation transition-all duration-500 transform hover:scale-105" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05) rotateY(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
            }}>
              <p className="mb-4" style={{color: '#E6C55F'}}>"Through the reuse marketplace, I've furnished my entire apartment sustainably and made great community connections."</p>
              <p className="font-bold" style={{color: '#FFD700'}}>- John D., Student</p>
            </div>
            <div className="p-6 rounded-xl wiggle-animation transition-all duration-500 transform hover:scale-105" style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05) rotateY(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
            }}>
              <p className="mb-4" style={{color: '#E6C55F'}}>"As an NGO partner, this platform has helped us organize more effective environmental events and reach more volunteers."</p>
              <p className="font-bold" style={{color: '#FFD700'}}>- Green Earth NGO</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 pt-8" style={{borderColor: '#FFD700'}}>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4" style={{color: '#FFD700'}}>Quick Links</h3>
              <ul className="space-y-2 text-sm" style={{color: '#E6C55F'}}>
                <li>About Us</li>
                <li>How It Works</li>
                <li>Community Guidelines</li>
                <li>Help Center</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4" style={{color: '#FFD700'}}>Contact</h3>
              <ul className="space-y-2 text-sm" style={{color: '#E6C55F'}}>
                <li>support@rrrplatform.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Green Street, Eco City</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4" style={{color: '#FFD700'}}>Social Media</h3>
              <ul className="space-y-2 text-sm" style={{color: '#E6C55F'}}>
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Instagram</li>
                <li>LinkedIn</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4" style={{color: '#FFD700'}}>Legal</h3>
              <ul className="space-y-2 text-sm" style={{color: '#E6C55F'}}>
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
                <li>Cookie Policy</li>
                <li>Data Protection</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t" style={{borderColor: '#FFD700', color: '#E6C55F'}}>
            <p>&copy; 2024 RRR Platform. All rights reserved. Building a sustainable future together.</p>
          </div>
        </div>
      </div>
    </div>
  );
};