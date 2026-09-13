import React, { useState } from 'react';
import { AuthProvider } from './components/auth/AuthContext';
import { Navigation } from './components/common/Navigation';
import { Home } from './components/common/Home';
import { Profile } from './components/common/Profile';
import { ReduceSection } from './components/reduce/ReduceSection';
import { ReuseSection } from './components/reuse/ReuseSection';
import { RecycleSection } from './components/recycle/RecycleSection';
import { FoodShareSection } from './components/foodshare/FoodShareSection';

function AppContent() {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'reduce':
        return <ReduceSection />;
      case 'reuse':
        return <ReuseSection />;
      case 'recycle':
        return <RecycleSection />;
      case 'foodshare':
        return <FoodShareSection />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} userType="general" />
      <main>{renderSection()}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
