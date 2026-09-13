import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Crown, Award, Shield, Target, Zap, TrendingUp } from 'lucide-react';
import { getLeaderboard } from '../../lib/database';
import { getCurrentUser } from '../../lib/auth';

interface User {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  habitsCompleted: number;
  challengesCompleted: number;
  eventsParticipated: number;
  badges: string[];
  rank: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
}

export const LeaderboardBadges: React.FC = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [userTotalPoints, setUserTotalPoints] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      const { data, error } = await getLeaderboard();
      if (data) {
        const formattedUsers = data.map((entry: any, index: number) => ({
          id: entry.user_id,
          name: entry.profiles?.full_name || entry.profiles?.username || 'Anonymous',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          totalPoints: entry.points || 0,
          habitsCompleted: Math.floor((entry.points || 0) / 25),
          challengesCompleted: Math.floor((entry.points || 0) / 15),
          eventsParticipated: Math.floor((entry.points || 0) / 100),
          badges: (entry.points || 0) >= 1000 ? ['Eco Champion'] : (entry.points || 0) >= 500 ? ['Green Warrior'] : [],
          rank: index + 1
        }));
        setUsers(formattedUsers);
      }
    };
    
    const updatePoints = () => {
      const points = parseInt(localStorage.getItem('userTotalPoints') || '0');
      setUserTotalPoints(points);
    };
    
    loadData();
    updatePoints();
    const interval = setInterval(updatePoints, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const badges: Badge[] = [
    { id: '1', name: 'Green Warrior', description: 'Complete 50 eco challenges', icon: 'shield', color: 'green', requirement: '50 challenges' },
    { id: '2', name: 'Plastic-Free Hero', description: 'Avoid plastic for 30 days', icon: 'star', color: 'blue', requirement: '30 days plastic-free' },
    { id: '3', name: 'Energy Saver', description: 'Reduce energy consumption by 25%', icon: 'zap', color: 'yellow', requirement: '25% energy reduction' },
    { id: '4', name: 'Water Protector', description: 'Save 1000 gallons of water', icon: 'award', color: 'cyan', requirement: '1000 gallons saved' },
    { id: '5', name: 'Climate Ambassador', description: 'Organize 5 climate events', icon: 'crown', color: 'purple', requirement: '5 events organized' },
    { id: '6', name: 'Eco Champion', description: 'Earn 1000 total points', icon: 'trophy', color: 'gold', requirement: '1000 points' },
    { id: '7', name: 'Sustainability Star', description: 'Complete 100 eco habits', icon: 'star', color: 'pink', requirement: '100 habits' },
    { id: '8', name: 'Earth Defender', description: 'Plant 25 trees or plants', icon: 'shield', color: 'emerald', requirement: '25 plants' },
    { id: '9', name: 'Waste Reducer', description: 'Reduce waste by 50%', icon: 'target', color: 'orange', requirement: '50% waste reduction' },
    { id: '10', name: 'Nature Lover', description: 'Participate in 10 outdoor cleanups', icon: 'award', color: 'teal', requirement: '10 cleanups' },
    { id: '11', name: 'Carbon Neutral', description: 'Achieve net-zero carbon footprint', icon: 'medal', color: 'gray', requirement: 'Net-zero carbon' },
    { id: '12', name: 'Renewable Champion', description: 'Use 100% renewable energy', icon: 'zap', color: 'yellow', requirement: '100% renewable' },
    { id: '13', name: 'Eco Educator', description: 'Teach 50 people about sustainability', icon: 'star', color: 'indigo', requirement: '50 people educated' },
    { id: '14', name: 'Green Innovator', description: 'Create 5 eco-friendly solutions', icon: 'crown', color: 'violet', requirement: '5 innovations' },
    { id: '15', name: 'Sustainable Shopper', description: 'Buy only eco-friendly products for 3 months', icon: 'award', color: 'green', requirement: '3 months eco shopping' },
    { id: '16', name: 'Transport Hero', description: 'Use only green transportation for 1 month', icon: 'shield', color: 'blue', requirement: '1 month green transport' },
    { id: '17', name: 'Food Saver', description: 'Reduce food waste to zero for 2 months', icon: 'target', color: 'red', requirement: '2 months zero waste' },
    { id: '18', name: 'Community Leader', description: 'Lead 10 environmental initiatives', icon: 'crown', color: 'gold', requirement: '10 initiatives led' },
    { id: '19', name: 'Eco Influencer', description: 'Inspire 100 people to go green', icon: 'star', color: 'pink', requirement: '100 people inspired' },
    { id: '20', name: 'Planet Guardian', description: 'Complete all eco challenges and habits', icon: 'trophy', color: 'rainbow', requirement: 'All challenges complete' }
  ];

  // Add current user to leaderboard if logged in
  const allUsers = currentUser ? [
    {
      id: currentUser.id,
      name: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      totalPoints: userTotalPoints,
      habitsCompleted: Math.floor(userTotalPoints / 25),
      challengesCompleted: Math.floor(userTotalPoints / 15),
      eventsParticipated: Math.floor(userTotalPoints / 100),
      badges: userTotalPoints >= 1000 ? ['Eco Champion'] : userTotalPoints >= 500 ? ['Green Warrior'] : [],
      rank: 0
    },
    ...users
  ] : users;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy size={24} />;
      case 'medal': return <Medal size={24} />;
      case 'star': return <Star size={24} />;
      case 'crown': return <Crown size={24} />;
      case 'award': return <Award size={24} />;
      case 'shield': return <Shield size={24} />;
      case 'target': return <Target size={24} />;
      case 'zap': return <Zap size={24} />;
      default: return <Trophy size={24} />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'gold': return 'from-yellow-400 to-yellow-600 text-yellow-900';
      case 'green': return 'from-green-400 to-green-600 text-green-900';
      case 'blue': return 'from-blue-400 to-blue-600 text-blue-900';
      case 'purple': return 'from-purple-400 to-purple-600 text-purple-900';
      case 'pink': return 'from-pink-400 to-pink-600 text-pink-900';
      case 'cyan': return 'from-cyan-400 to-cyan-600 text-cyan-900';
      case 'yellow': return 'from-yellow-400 to-orange-400 text-yellow-900';
      case 'emerald': return 'from-emerald-400 to-emerald-600 text-emerald-900';
      case 'orange': return 'from-orange-400 to-red-400 text-orange-900';
      case 'teal': return 'from-teal-400 to-teal-600 text-teal-900';
      case 'gray': return 'from-gray-400 to-gray-600 text-gray-900';
      case 'indigo': return 'from-indigo-400 to-indigo-600 text-indigo-900';
      case 'violet': return 'from-violet-400 to-violet-600 text-violet-900';
      case 'red': return 'from-red-400 to-red-600 text-red-900';
      case 'rainbow': return 'from-pink-400 via-purple-400 to-indigo-400 text-white';
      default: return 'from-gray-400 to-gray-600 text-gray-900';
    }
  };

  // Sort users by points and assign ranks
  const sortedUsers = allUsers.sort((a, b) => b.totalPoints - a.totalPoints).map((user, index) => ({
    ...user,
    rank: index + 1
  }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-500" size={24} strokeWidth={3} />;
      case 2: return <Medal className="text-gray-400" size={24} strokeWidth={3} />;
      case 3: return <Award className="text-orange-500" size={24} strokeWidth={3} />;
      default: return <span className="text-lg font-bold" style={{ color: '#FFD700' }}>#{rank}</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#FFD700' }}>Leaderboard & Badges</h2>
        <p style={{ color: '#E6C55F' }}>Compete with others and earn achievement badges</p>
        
        {/* User Points Display */}
        <div className="mt-4 p-4 rounded-xl inline-block" style={{
          background: 'rgba(40, 167, 69, 0.1)',
          border: '2px solid #28A745'
        }}>
          <div className="flex items-center gap-3">
            <TrendingUp size={24} style={{ color: '#28A745' }} />
            <div>
              <p className="text-sm" style={{ color: '#28A745' }}>Your Total Points</p>
              <p className="text-2xl font-bold" style={{ color: '#28A745' }}>{userTotalPoints}</p>
              <p className="text-xs" style={{ color: '#28A745' }}>From Daily Challenges + Food Logger + Community Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="rounded-xl shadow-sm p-1" style={{
          background: 'rgba(45, 80, 22, 0.2)',
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'leaderboard' ? 'text-white shadow-md' : 'hover:text-white'
            }`}
            style={activeTab === 'leaderboard' ? {
              background: 'linear-gradient(135deg, #B8860B, #DAA520)',
              border: '2px solid #FFD700'
            } : {
              color: '#E6C55F'
            }}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'badges' ? 'text-white shadow-md' : 'hover:text-white'
            }`}
            style={activeTab === 'badges' ? {
              background: 'linear-gradient(135deg, #B8860B, #DAA520)',
              border: '2px solid #FFD700'
            } : {
              color: '#E6C55F'
            }}
          >
            Badges
          </button>
        </div>
      </div>

      {activeTab === 'leaderboard' && (
        <div className="max-w-4xl mx-auto">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {sortedUsers.slice(0, 3).map((user, index) => (
              <div
                key={user.id}
                className={`text-center ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}
              >
                <div className={`rounded-xl shadow-lg p-6 ${index === 0 ? 'transform scale-110' : ''}`} style={{
                  background: 'rgba(45, 80, 22, 0.2)',
                  border: '1px solid rgba(255, 215, 0, 0.3)'
                }}>
                  <div className="mb-4">
                    {getRankIcon(user.rank)}
                  </div>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold mb-1" style={{ color: '#FFD700' }}>{user.name}</h3>
                  <div className="text-2xl font-bold mb-2" style={{ color: '#FFD700' }}>{user.totalPoints}</div>
                  <div className="text-xs" style={{ color: '#E6C55F' }}>
                    {user.habitsCompleted} habits • {user.challengesCompleted} challenges
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Leaderboard */}
          <div className="rounded-xl shadow-lg overflow-hidden" style={{
            background: 'rgba(45, 80, 22, 0.2)',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <div className="text-white p-4" style={{
              background: 'linear-gradient(135deg, #B8860B, #DAA520)'
            }}>
              <h3 className="text-lg font-semibold">Full Rankings</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <div key={user.id} className="p-4 transition-colors" style={{ background: 'rgba(255, 215, 0, 0.05)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 text-center">
                        {user.rank <= 3 ? getRankIcon(user.rank) : <span className="font-bold" style={{ color: '#FFD700' }}>#{user.rank}</span>}
                      </div>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold" style={{ color: '#FFD700' }}>{user.name}</h4>
                        <div className="text-sm" style={{ color: '#E6C55F' }}>
                          {user.habitsCompleted} habits • {user.challengesCompleted} challenges • {user.eventsParticipated} events
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold" style={{ color: '#FFD700' }}>{user.totalPoints}</div>
                      <div className="text-sm" style={{ color: '#E6C55F' }}>points</div>
                    </div>
                  </div>
                  {user.badges.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.badges.slice(0, 3).map((badgeName) => (
                        <span
                          key={badgeName}
                          className="text-xs text-white px-2 py-1 rounded-full"
                          style={{ background: 'linear-gradient(135deg, #B8860B, #DAA520)' }}
                        >
                          {badgeName}
                        </span>
                      ))}
                      {user.badges.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }}>
                          +{user.badges.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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
      `}</style>

      {activeTab === 'badges' && (
        <div>
          <div className="mb-6 p-4 rounded-xl text-center" style={{
            background: 'rgba(40, 167, 69, 0.1)',
            border: '2px solid #28A745'
          }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#28A745' }}>Points Sources</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p style={{ color: '#28A745' }}>Daily Challenges</p>
                <p style={{ color: '#e7c97b' }}>10-50 points per challenge</p>
              </div>
              <div>
                <p style={{ color: '#28A745' }}>Food Logger Weekly</p>
                <p style={{ color: '#e7c97b' }}>200 points (no expired items)</p>
              </div>
              <div>
                <p style={{ color: '#28A745' }}>Community Posts</p>
                <p style={{ color: '#e7c97b' }}>10-50 points from others</p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-xl shadow-md transition-all duration-500 overflow-hidden ${
                badge.id === '1' || badge.id === '6' || badge.id === '18' ? 'glow-animation' :
                badge.id === '2' || badge.id === '7' || badge.id === '12' ? 'shimmer-animation' :
                'wiggle-animation'
              }`}
            style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              opacity: 1
            }}
            >
              <div className={`bg-gradient-to-r ${getColorClasses(badge.color)} p-6 text-center`}>
                <div className="text-white mb-2">
                  {getIcon(badge.icon)}
                </div>
                <h3 className="font-bold text-lg text-white">{badge.name}</h3>
              </div>
              <div className="p-4">
                <p className="text-sm mb-3" style={{ color: '#E6C55F' }}>{badge.description}</p>
                <div className="rounded-lg p-2" style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                  <div className="text-xs font-medium mb-1" style={{ color: '#FFD700' }}>Requirement:</div>
                  <div className="text-xs" style={{ color: '#E6C55F' }}>{badge.requirement}</div>
                </div>
              </div>
            </div>
          ))}
          </div>
          
          <div className="mt-8 rounded-xl p-6 text-center" style={{
            background: 'rgba(45, 80, 22, 0.3)',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <Trophy className="mx-auto mb-4" style={{ color: '#FFD700' }} size={48} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFD700' }}>Earn More Badges!</h3>
            <p style={{ color: '#E6C55F' }}>
              Complete challenges, build habits, and participate in events to unlock achievement badges.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};