export interface User {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  profilePhoto?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  userType: 'general' | 'ecorecycler' | 'ngo';
  ecoBadges: string[];
  challengeHistory: Challenge[];
  // Additional fields for specific user types
  description?: string;
  // NGO specific fields
  organizationName?: string;
  mission?: string;
  website?: string;
  // EcoRecycler specific fields
  acceptedItems?: string[];
  workingHours?: string;
  pickupAvailable?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  week: number;
  completed: boolean;
  proof?: {
    photo: string;
    description: string;
  };
}

export interface ReuseItem {
  id: string;
  photos: string[];
  name: string;
  description: string;
  condition: 'new' | 'good' | 'used' | 'like-new' | 'slightly-damaged' | 'heavy-used' | 'other';
  category: string;
  isFree: boolean;
  price?: number;
  userId: string;
  userName: string;
  phone: string;
  whatsapp: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: Date;
  // Auto-filled user profile information
  userType: 'general' | 'ecorecycler' | 'ngo';
  userEmail?: string;
  userDescription?: string;
  organizationName?: string;
  // Legacy support
  photo?: string;
}

export interface ShopProfile {
  id: string;
  shopName: string;
  ownerName: string;
  acceptedMaterials: string[];
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  pickupAvailable: boolean;
  timings: string;
  rates: { [material: string]: number };
  phone: string;
  whatsapp: string;
  description?: string;
  images: string[];
  // Auto-filled user profile information
  userEmail?: string;
  userDescription?: string;
}

export interface NGOProfile {
  id: string;
  ngoName: string;
  registrationNumber: string;
  address: string;
  contactPersonName: string;
  contactNumber: string;
  description: string;
  logo: string;
  userId: string;
}

export interface NGOEvent {
  id: string;
  title: string;
  ngoId: string;
  ngoName: string;
  ngoLogo: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  images: string[];
  createdAt: Date;
  // Auto-filled user profile information
  userEmail?: string;
  userDescription?: string;
  userMission?: string;
  userWebsite?: string;
}

export interface RecyclePost {
  id: string;
  photo: string;
  materials: string[];
  description: string;
  rates: { [material: string]: number };
  pickupAvailable: boolean;
  shopId?: string;
  shopName?: string;
  userId: string;
  userName: string;
  phone: string;
  whatsapp: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'climate' | 'pollution' | 'policy' | 'research';
  imageUrl: string;
  publishedAt: Date;
}

export interface EcoTip {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface ClimateEvent {
  id: string;
  title: string;
  description: string;
  photo: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  userId: string;
  userName: string;
  userType: 'general' | 'ecorecycler';
  createdAt: Date;
}