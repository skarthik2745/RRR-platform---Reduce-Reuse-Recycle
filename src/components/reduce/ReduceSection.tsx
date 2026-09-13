import React, { useState } from 'react';
import { Calendar, Lightbulb, Calculator, Target, Home, Users, Trophy, Newspaper, Package, Bot } from 'lucide-react';
import { ClimateAwarenessEvents } from './ClimateAwarenessEvents';
import { EcoTips } from './EcoTips';
import { CarbonCalculator } from './CarbonCalculator';
import { DailyEcoChallenges } from './DailyEcoChallenges';
import { HomeEnergyAudit } from './HomeEnergyAudit';
import { CommunityGreenHall } from './CommunityGreenHall';
import { FoodExpiryLogger } from './FoodExpiryLogger';
import { EcoAICompanion } from './EcoAICompanion';
import { LeaderboardBadges } from './LeaderboardBadges';
import { ClimateNews } from './ClimateNews';

export const ReduceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('events');

  const tabs = [
    { id: 'events', label: 'Climate Events', icon: Calendar },
    { id: 'tips', label: 'Eco Tips', icon: Lightbulb },
    { id: 'calculator', label: 'Carbon Calculator', icon: Calculator },
    { id: 'challenges', label: 'Daily Challenges', icon: Target },
    { id: 'audit', label: 'Energy Audit', icon: Home },
    { id: 'greenhall', label: 'GreenHall', icon: Users },
    { id: 'foodlogger', label: 'Food Expiry Logger', icon: Package },
    { id: 'ecoai', label: 'EcoAI Companion', icon: Bot },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'news', label: 'Climate News', icon: Newspaper }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return <ClimateAwarenessEvents />;
      case 'tips':
        return <EcoTips />;
      case 'calculator':
        return <CarbonCalculator />;
      case 'challenges':
        return <DailyEcoChallenges />;
      case 'audit':
        return <HomeEnergyAudit />;
      case 'greenhall':
        return <CommunityGreenHall />;
      case 'foodlogger':
        return <FoodExpiryLogger />;
      case 'ecoai':
        return <EcoAICompanion />;
      case 'leaderboard':
        return <LeaderboardBadges />;
      case 'news':
        return <ClimateNews />;
      default:
        return <ClimateAwarenessEvents />;
    }
  };

  return (
    <div className="min-h-screen recycle-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 gold-glow" style={{
            fontFamily: 'Poppins, Montserrat, Playfair Display',
            color: '#FFD700',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)'
          }}>Reduce Impact</h1>
          <p className="text-2xl" style={{
            color: '#E6C55F',
            fontFamily: 'Poppins, Montserrat',
            textShadow: '0 0 15px rgba(230, 197, 95, 0.4)'
          }}>Take action for a sustainable future</p>
        </div>

        <div className="mb-12">
          <nav className="flex justify-center space-x-4 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-4 font-medium text-sm transition-all duration-300 rounded-lg mb-2 ${
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
                  <Icon size={16} />
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
    </div>
  );
};