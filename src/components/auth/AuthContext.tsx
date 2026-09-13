import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../../types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const defaultUser: User = {
  id: 'guest-user',
  fullName: 'Guest Visitor',
  phone: '+0000000000',
  whatsapp: '+0000000000',
  email: 'guest@example.com',
  location: {
    lat: 0,
    lng: 0,
    address: 'Public website access'
  },
  userType: 'general',
  ecoBadges: ['welcome'],
  challengeHistory: [],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultUser);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(defaultUser);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((currentUser) => {
      if (!currentUser) return defaultUser;
      return { ...currentUser, ...updates };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};