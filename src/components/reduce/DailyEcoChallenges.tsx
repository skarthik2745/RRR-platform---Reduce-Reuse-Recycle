import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, RefreshCw, Trophy, Star } from 'lucide-react';
import { getClimateEvents } from '../../lib/database';
import { getCurrentUser } from '../../lib/auth';

interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: string;
}

export const DailyEcoChallenges: React.FC = () => {
  const [dailyChallenges, setDailyChallenges] = useState<EcoChallenge[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const allChallenges: Omit<EcoChallenge, 'id' | 'completed'>[] = [
    // Daily Lifestyle Challenges
    { title: 'Use a reusable water bottle', description: 'Use a reusable water bottle for 30 days', points: 20, category: 'Daily Lifestyle' },
    { title: 'Avoid single-use plastics', description: 'Avoid single-use plastics for a week', points: 25, category: 'Daily Lifestyle' },
    { title: 'Take 5-minute showers', description: 'Take only 5-minute showers for a week to save water', points: 15, category: 'Daily Lifestyle' },
    { title: 'Switch off lights when leaving', description: 'Switch off fans/lights whenever leaving a room', points: 10, category: 'Daily Lifestyle' },
    { title: 'Use public transportation', description: 'Use public transportation for 10 days', points: 20, category: 'Daily Lifestyle' },
    { title: 'Carry cloth bag for shopping', description: 'Carry your own cloth bag for shopping', points: 10, category: 'Daily Lifestyle' },
    { title: 'Avoid disposable cups', description: 'Avoid disposable cups completely', points: 15, category: 'Daily Lifestyle' },
    { title: 'Practice zero food waste', description: 'Practice "zero food waste" for one week', points: 25, category: 'Daily Lifestyle' },
    { title: 'Buy only essentials', description: 'Buy only essentials for the next 7 days', points: 20, category: 'Daily Lifestyle' },
    { title: 'Avoid fast fashion', description: 'Avoid fast fashion purchases this month', points: 30, category: 'Daily Lifestyle' },
    { title: 'Line-dry clothes', description: 'Line-dry your clothes instead of using dryers', points: 15, category: 'Daily Lifestyle' },
    { title: 'No electricity challenge', description: 'Try a "no electricity for 2 hours" challenge daily', points: 20, category: 'Daily Lifestyle' },
    { title: 'Use both sides of paper', description: 'Use both sides of paper for notes', points: 10, category: 'Daily Lifestyle' },
    { title: 'Repair instead of buying', description: 'Repair one broken item instead of buying new', points: 25, category: 'Daily Lifestyle' },
    { title: 'Eat plant-based meal daily', description: 'Eat one plant-based meal every day', points: 15, category: 'Daily Lifestyle' },
    { title: 'Reduce screen brightness', description: 'Reduce screen brightness to save device energy', points: 10, category: 'Daily Lifestyle' },
    { title: 'Use refillable pen', description: 'Use a refillable pen instead of plastic pens', points: 10, category: 'Daily Lifestyle' },
    { title: 'Switch to LED bulbs', description: 'Switch to LED bulbs at home', points: 20, category: 'Daily Lifestyle' },
    { title: 'Walk or cycle short distances', description: 'Walk or cycle for short distances for a week', points: 15, category: 'Daily Lifestyle' },
    { title: 'Use digital notes', description: 'Practice digital notes instead of paper notes', points: 10, category: 'Daily Lifestyle' },
    { title: 'Reduce screen time by 1 hour', description: 'Save energy and improve well-being', points: 15, category: 'Digital' },
    { title: 'Water plants with greywater', description: 'Reuse water from washing dishes/hands', points: 15, category: 'Water' },
    { title: 'Use a programmable thermostat', description: 'Optimize heating/cooling efficiency', points: 20, category: 'Energy' },
    { title: 'Donate unused items', description: 'Give away things you no longer need', points: 20, category: 'Waste Reduction' },
    { title: 'Choose digital receipts', description: 'Opt for email receipts instead of paper', points: 10, category: 'Digital' },
    { title: 'Use refillable containers', description: 'Bring your own containers for bulk items', points: 15, category: 'Plastic-Free' },
    { title: 'Plant a seed or seedling', description: 'Contribute to green spaces', points: 25, category: 'Environment' },
    { title: 'Use cold water for washing', description: 'Wash clothes in cold water to save energy', points: 15, category: 'Energy' },
    { title: 'Avoid single-use items', description: 'Say no to disposable cups, plates, utensils', points: 15, category: 'Plastic-Free' },
    { title: 'Carpool or rideshare', description: 'Share transportation with others', points: 20, category: 'Transport' },
    { title: 'Use natural pest control', description: 'Avoid chemical pesticides in garden', points: 20, category: 'Chemicals' },
    { title: 'Reduce food waste', description: 'Plan meals and use leftovers creatively', points: 20, category: 'Food' },
    { title: 'Use rechargeable batteries', description: 'Switch to rechargeable alternatives', points: 15, category: 'Electronics' },
    { title: 'Support renewable energy', description: 'Research or switch to green energy provider', points: 25, category: 'Energy' },
    { title: 'Use bamboo products', description: 'Choose bamboo alternatives to plastic', points: 15, category: 'Plastic-Free' },
    { title: 'Collect rainwater', description: 'Set up rain collection for garden use', points: 25, category: 'Water' },
    { title: 'Use public library', description: 'Borrow books instead of buying new ones', points: 15, category: 'Sharing' },
    { title: 'Choose sustainable fashion', description: 'Buy second-hand or eco-friendly clothing', points: 20, category: 'Fashion' },
    { title: 'Use natural fertilizers', description: 'Compost or organic fertilizers for plants', points: 20, category: 'Gardening' },
    { title: 'Reduce meat consumption', description: 'Have a meat-free day', points: 20, category: 'Food' },
    { title: 'Use energy-efficient appliances', description: 'Choose ENERGY STAR rated products', points: 25, category: 'Energy' },
    { title: 'Practice mindful consumption', description: 'Think before buying - do you really need it?', points: 20, category: 'Mindfulness' },
    { title: 'Use natural cleaning methods', description: 'Clean with vinegar, baking soda, lemon', points: 15, category: 'Chemicals' },
    { title: 'Support eco-friendly businesses', description: 'Choose companies with green practices', points: 20, category: 'Economy' },
    { title: 'Reduce packaging waste', description: 'Choose products with minimal packaging', points: 15, category: 'Waste Reduction' },
    { title: 'Use solar chargers', description: 'Charge devices with solar power', points: 25, category: 'Energy' },
    { title: 'Practice water conservation', description: 'Fix leaks and use water-saving devices', points: 20, category: 'Water' },
    { title: 'Use natural beauty products', description: 'Choose organic, chemical-free cosmetics', points: 15, category: 'Health' },
    { title: 'Educate children about environment', description: 'Teach kids about sustainability', points: 25, category: 'Education' },
    { title: 'Use green transportation', description: 'Walk, bike, or use electric vehicles', points: 20, category: 'Transport' },
    { title: 'Support conservation efforts', description: 'Donate to or volunteer with environmental groups', points: 30, category: 'Activism' },
    { title: 'Use sustainable packaging', description: 'Choose products with recyclable packaging', points: 15, category: 'Packaging' },
    { title: 'Practice zero waste cooking', description: 'Use all parts of ingredients, minimize waste', points: 25, category: 'Food' },
    { title: 'Use natural air fresheners', description: 'Essential oils instead of chemical sprays', points: 15, category: 'Health' },
    { title: 'Support local environmental initiatives', description: 'Join community green projects', points: 25, category: 'Community' },
    { title: 'Use eco-friendly transportation', description: 'Choose low-emission travel options', points: 20, category: 'Transport' },
    { title: 'Practice sustainable gardening', description: 'Use organic methods and native plants', points: 25, category: 'Gardening' },
    { title: 'Reduce electronic waste', description: 'Repair, donate, or properly recycle electronics', points: 25, category: 'Electronics' },
    { title: 'Use natural insect repellent', description: 'Avoid chemical bug sprays', points: 15, category: 'Health' },
    { title: 'Support sustainable agriculture', description: 'Buy organic and locally grown food', points: 20, category: 'Food' },
    { title: 'Use renewable materials', description: 'Choose products made from sustainable materials', points: 20, category: 'Materials' },
    { title: 'Practice energy conservation', description: 'Turn off and unplug unused devices', points: 15, category: 'Energy' },
    { title: 'Use eco-friendly pet products', description: 'Choose sustainable pet food and toys', points: 15, category: 'Pets' },
    { title: 'Support green building practices', description: 'Choose eco-friendly construction materials', points: 25, category: 'Construction' },
    { title: 'Use natural dyes and colors', description: 'Avoid synthetic chemicals in crafts', points: 15, category: 'Crafts' },
    { title: 'Practice sustainable tourism', description: 'Choose eco-friendly travel options', points: 25, category: 'Travel' },
    { title: 'Use biodegradable products', description: 'Choose items that break down naturally', points: 20, category: 'Products' },
    { title: 'Support circular economy', description: 'Buy, sell, or trade used items', points: 25, category: 'Economy' },
    { title: 'Use natural pest deterrents', description: 'Plant companion plants to deter pests', points: 20, category: 'Gardening' },
    { title: 'Practice mindful water use', description: 'Be conscious of every drop', points: 15, category: 'Water' },
    { title: 'Use sustainable office supplies', description: 'Choose eco-friendly work materials', points: 15, category: 'Office' },
    { title: 'Support environmental education', description: 'Learn and teach about sustainability', points: 20, category: 'Education' },
    { title: 'Use natural food preservation', description: 'Avoid chemical preservatives', points: 15, category: 'Food' },
    { title: 'Practice green computing', description: 'Use energy-efficient computer settings', points: 15, category: 'Technology' },
    { title: 'Use sustainable party supplies', description: 'Choose reusable or biodegradable party items', points: 20, category: 'Events' },
    { title: 'Support wildlife conservation', description: 'Create habitat or support wildlife organizations', points: 25, category: 'Wildlife' },
    { title: 'Use natural fabric softeners', description: 'Use vinegar or wool dryer balls', points: 15, category: 'Laundry' },
    { title: 'Practice sustainable gift giving', description: 'Give experiences or eco-friendly gifts', points: 20, category: 'Gifts' },
    { title: 'Use green cleaning tools', description: 'Choose sustainable cleaning equipment', points: 15, category: 'Cleaning' },
    { title: 'Support environmental research', description: 'Stay informed about environmental science', points: 20, category: 'Science' },
    { title: 'Use natural wound care', description: 'Choose organic first aid products', points: 15, category: 'Health' },
    { title: 'Practice sustainable photography', description: 'Use digital instead of film, respect nature', points: 15, category: 'Photography' },
    { title: 'Use eco-friendly sports equipment', description: 'Choose sustainable gear for activities', points: 20, category: 'Sports' },
    { title: 'Support green technology', description: 'Invest in or use environmentally friendly tech', points: 25, category: 'Technology' },
    { title: 'Use natural hair care', description: 'Choose organic shampoos and conditioners', points: 15, category: 'Beauty' },
    { title: 'Practice sustainable cooking', description: 'Use energy-efficient cooking methods', points: 20, category: 'Cooking' },
    { title: 'Use biodegradable phone cases', description: 'Choose eco-friendly phone accessories', points: 15, category: 'Accessories' },
    { title: 'Support environmental journalism', description: 'Read and share environmental news', points: 15, category: 'Media' },
    { title: 'Use natural deodorants', description: 'Avoid aluminum and chemical deodorants', points: 15, category: 'Health' },
    { title: 'Practice green event planning', description: 'Organize eco-friendly gatherings', points: 25, category: 'Events' },
    { title: 'Use sustainable art supplies', description: 'Choose eco-friendly paints and materials', points: 20, category: 'Art' },
    { title: 'Support environmental activism', description: 'Participate in environmental campaigns', points: 30, category: 'Activism' },
    { title: 'Use natural sleep aids', description: 'Choose organic pillows and mattresses', points: 20, category: 'Sleep' },
    { title: 'Practice sustainable exercise', description: 'Use human-powered or eco-friendly equipment', points: 15, category: 'Fitness' },
    { title: 'Use green building materials', description: 'Choose sustainable construction options', points: 25, category: 'Construction' },
    { title: 'Support environmental policy', description: 'Vote for and advocate green policies', points: 30, category: 'Politics' },
    { title: 'Use natural baby products', description: 'Choose organic baby care items', points: 20, category: 'Baby Care' },
    { title: 'Practice sustainable fishing', description: 'Use eco-friendly fishing methods', points: 20, category: 'Fishing' },
    { title: 'Use biodegradable glitter', description: 'Choose eco-friendly craft materials', points: 15, category: 'Crafts' },
    { title: 'Support green finance', description: 'Choose banks with environmental policies', points: 25, category: 'Finance' },
    { title: 'Use natural sunscreen', description: 'Choose reef-safe, organic sun protection', points: 15, category: 'Health' },
    { title: 'Practice sustainable camping', description: 'Leave no trace when outdoors', points: 25, category: 'Outdoor' },
    { title: 'Use eco-friendly car care', description: 'Choose biodegradable car wash products', points: 15, category: 'Automotive' },
    { title: 'Support environmental art', description: 'Create or support eco-themed artwork', points: 20, category: 'Art' },
    { title: 'Use natural mosquito control', description: 'Plant mosquito-repelling plants', points: 15, category: 'Gardening' },
    { title: 'Practice green investing', description: 'Invest in environmentally responsible companies', points: 30, category: 'Finance' }
  ];

  const getRandomChallenges = () => {
    const shuffled = [...allChallenges].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6).map((challenge, index) => ({
      ...challenge,
      id: `${Date.now()}-${index}`,
      completed: false
    }));
  };

  useEffect(() => {
    setDailyChallenges(getRandomChallenges());
    // Load climate events for additional challenges
    const loadClimateEvents = async () => {
      const { data } = await getClimateEvents();
      if (data) {
        // Could integrate climate events as special challenges
      }
    };
    loadClimateEvents();
  }, []);

  const completeChallenge = (challengeId: string) => {
    setDailyChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true }
          : challenge
      )
    );
    
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
      setTotalPoints(prev => prev + challenge.points);
      setCompletedToday(prev => prev + 1);
      
      // Add to unified points system
      const currentPoints = parseInt(localStorage.getItem('userTotalPoints') || '0');
      const newTotal = currentPoints + challenge.points;
      localStorage.setItem('userTotalPoints', newTotal.toString());
    }
  };

  const refreshChallenges = () => {
    const allCompleted = dailyChallenges.every(c => c.completed);
    if (allCompleted || completedToday >= 6) {
      setDailyChallenges(getRandomChallenges());
      setCompletedToday(0);
    }
  };

  const getRandomRoyalColor = () => {
    const royalColors = [
      { from: '#4B0082', to: '#8A2BE2' }, // Indigo to Blue Violet
      { from: '#800080', to: '#9932CC' }, // Purple to Dark Orchid
      { from: '#8B008B', to: '#BA55D3' }, // Dark Magenta to Medium Orchid
      { from: '#9400D3', to: '#7B68EE' }, // Violet to Medium Slate Blue
      { from: '#6A0DAD', to: '#9370DB' }, // Royal Purple to Medium Purple
      { from: '#483D8B', to: '#6495ED' }, // Dark Slate Blue to Cornflower Blue
      { from: '#191970', to: '#4169E1' }, // Midnight Blue to Royal Blue
      { from: '#000080', to: '#0000CD' }, // Navy to Medium Blue
      { from: '#8B0000', to: '#DC143C' }, // Dark Red to Crimson
      { from: '#B22222', to: '#CD5C5C' }, // Fire Brick to Indian Red
      { from: '#2F4F4F', to: '#708090' }, // Dark Slate Gray to Slate Gray
      { from: '#556B2F', to: '#6B8E23' }  // Dark Olive Green to Olive Drab
    ];
    return royalColors[Math.floor(Math.random() * royalColors.length)];
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2" style={{
          color: '#FFD700',
          fontFamily: 'Poppins, Montserrat, Playfair Display',
          textShadow: '0 0 25px rgba(255, 215, 0, 0.5)'
        }}>Daily Eco Challenges</h2>
        <p className="text-xl" style={{
          color: '#E6C55F',
          textShadow: '0 0 10px rgba(230, 197, 95, 0.3)'
        }}>Complete challenges to earn points and make a difference</p>
      </div>
      <div className="flex justify-end items-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-xl">
            <div className="flex items-center">
              <Trophy className="mr-2" size={20} />
              <span className="font-bold">{totalPoints} Session Points</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-xl">
            <div className="flex items-center">
              <Star className="mr-2" size={20} />
              <span className="font-bold">{parseInt(localStorage.getItem('userTotalPoints') || '0')} Total Points</span>
            </div>
          </div>
          <button
            onClick={refreshChallenges}
            disabled={!dailyChallenges.every(c => c.completed) && completedToday < 6}
            className="text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center disabled:opacity-50 font-semibold hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #B8860B, #DAA520)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            }}
          >
            <RefreshCw className="mr-2" size={16} />
            New Challenges
          </button>
        </div>

      {/* Progress Bar */}
      <div className="mb-6 rounded-xl shadow-md p-4" style={{
        background: 'rgba(45, 80, 22, 0.2)',
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium" style={{ color: '#FFD700' }}>Today's Progress</span>
          <span className="text-sm" style={{ color: '#E6C55F' }}>{completedToday}/6 completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(completedToday / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dailyChallenges.map((challenge, index) => (
          <div
            key={challenge.id}
            className={`rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 overflow-hidden ${
              index % 3 === 0 ? 'glow-animation' :
              index % 3 === 1 ? 'shimmer-animation' :
              'wiggle-animation'
            }`}
            style={{
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
            }}
          >
            <div className="p-4 text-center" style={{
              background: `linear-gradient(135deg, ${getRandomRoyalColor().from}, ${getRandomRoyalColor().to})`
            }}>
              <div className="text-white mb-2">
                <Target size={24} />
              </div>
              <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full text-white">
                {challenge.category}
              </span>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFD700' }}>{challenge.title}</h3>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#E6C55F' }}>{challenge.description}</p>
              
              <div className="mb-4 text-center">
                <div className="flex items-center justify-center">
                  <Star className="mr-1" style={{ color: '#FFD700' }} size={16} />
                  <span className="font-bold" style={{ color: '#FFD700' }}>{challenge.points} Points</span>
                </div>
              </div>
              
              <button
                onClick={() => completeChallenge(challenge.id)}
                disabled={challenge.completed}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                  challenge.completed
                    ? 'cursor-not-allowed' : 'text-white hover:shadow-lg hover:scale-105'
                }`}
                style={challenge.completed ? {
                  background: 'rgba(255, 215, 0, 0.2)',
                  color: '#FFD700',
                  border: '1px solid #FFD700'
                } : {
                  background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                  border: '2px solid #FFD700'
                }}
              >
                {challenge.completed ? (
                  <>
                    <CheckCircle className="mr-2" size={16} />
                    Completed!
                  </>
                ) : (
                  <>
                    <Target className="mr-2" size={16} />
                    Mark Complete
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {completedToday === 6 && (
        <div className="mt-8 rounded-xl p-6 text-center" style={{
          background: 'rgba(45, 80, 22, 0.3)',
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}>
          <Trophy className="mx-auto mb-4" style={{ color: '#FFD700' }} size={48} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFD700' }}>Congratulations!</h3>
          <p className="mb-4" style={{ color: '#E6C55F' }}>
            You've completed all 6 challenges today! You earned {dailyChallenges.reduce((sum, c) => sum + (c.completed ? c.points : 0), 0)} points.
          </p>
          <button
            onClick={refreshChallenges}
            className="text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #B8860B, #DAA520)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            }}
          >
            Get New Challenges
          </button>
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
    </div>
  );
};