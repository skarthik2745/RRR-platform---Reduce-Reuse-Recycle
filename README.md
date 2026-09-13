# RRR - Reduce, Reuse, Recycle

**Tagline:** *Small Actions, Big Impact*

A comprehensive sustainability platform connecting individuals, NGOs, and EcoRecycler partners to promote environmental responsibility through community-driven action.

---

## 🌍 Overview

RRR is an AI-powered environmental platform that transforms individual eco-conscious actions into a collective movement. The platform enables users to reduce their carbon footprint, share reusable items, connect with recycling centers, and participate in environmental challenges.

---

## 👥 User Types

- **General Users** - Everyday citizens promoting sustainability
- **NGO Partners** - Organizations managing food sharing initiatives  
- **EcoRecycler Partners** - Recycling shops and collection centers

---

## 📱 Platform Tabs & Features

### 🏠 **HOME**
The central dashboard providing quick access to all platform features.

**Features:**
- Hero banner with environmental imagery
- Three large action buttons (Reduce, Reuse, Recycle)
- User engagement statistics
- Recent community activity feed
- Quick navigation to all sections

---

### ♻️ **REDUCE** (Environmental Awareness)
Empowers users to lower their environmental impact through awareness and action.

**Sub-sections:**

#### 📰 Climate News
- AI-powered real-time environmental news via Google Gemini
- Refresh functionality for latest updates
- Categorized climate information

#### 📅 Climate Events
- Post and discover environmental events
- Event types: Environmental camps, cleanliness drives, seminars, workshops
- Direct photo upload for event promotion
- Auto-filled user details
- Contact information for event organizers

#### 💡 Eco Tips
- Daily AI-generated sustainability tips
- Category-based filtering (Energy, Water, Waste, Transport, Food)
- Actionable advice for everyday life
- Personalized recommendations

#### 📊 Carbon Calculator
- Input lifestyle data (transport, energy, diet, waste)
- AI-powered carbon footprint analysis
- Personalized reduction recommendations
- Visual feedback and insights

#### 🏆 Weekly Challenges
- Participate in eco-friendly challenges
- Upload photo proof of completion
- Earn eco-badges for achievements
- Track challenge history in profile
- Community leaderboard

#### 🌐 Environmental News
- Latest environmental news from around the world
- Categories: Climate, Policy, Research, Success Stories
- Real-time updates via Gemini AI
- Curated content for informed action

---

### 🔄 **REUSE** (Item Sharing Marketplace)
A community marketplace for sharing reusable items and extending product lifecycles.

**Features:**
- **Post Items** - Share items you no longer need
- **Browse Items** - Discover available items in your community
- **15+ Categories** - Furniture, Electronics, Clothes, Books, Toys, Appliances, Sports Equipment, Tools, Kitchenware, Decor, Garden Items, Baby Items, Office Supplies, Bikes/Vehicles, Other
- **7 Condition Levels** - New, Like New, Good, Used, Slightly Damaged, Heavy Used, Other
- **Direct Image Upload** - Upload photos from your device
- **Item Details Modal** - Beautiful popup with full information
- **Contact Options** - One-click Call, WhatsApp, Location sharing
- **Share Functionality** - Share items via native share or clipboard
- **Auto-filled Forms** - User details automatically populated

**How It Works:**
1. Click "Post Item" to share something you want to give away
2. Upload photo, select category and condition
3. Add description and contact preferences
4. Browse posted items and contact owners directly
5. Arrange pickup or delivery

---

### ♻️ **RECYCLE** (Recycling Network)
Connects users with verified EcoRecycler partners for proper waste disposal.

**Features:**

#### 🏪 EcoRecycler Shop Profiles
- Verified recycling centers and shops
- 20+ accepted material types
- Pickup service availability
- Rate information (price per kg)
- Operating hours and location
- Direct contact options

#### 📦 Collection Requests
- EcoRecycler partners post material collection needs
- Specify materials currently accepting
- Quantity requirements
- Pickup availability
- Contact information

#### 🗑️ Accepted Materials
Paper, Cardboard, Plastic Bottles, Plastic Bags, Metal Cans, Aluminum, Steel, E-waste, Batteries, Glass, Textiles, Rubber, Wood, Organic Waste, Hazardous Waste, Tires, Furniture, Appliances, Construction Debris, Other

**How It Works:**
1. Browse EcoRecycler shops in your area
2. Check accepted materials and rates
3. Contact shop via Call, WhatsApp, or Location
4. Arrange pickup or drop-off
5. Contribute to proper recycling

---

### 🍲 **FOOD SHARE** (NGO-Exclusive)
NGO partners manage food donation initiatives to prevent food waste and address hunger.

**Features:**
- Post surplus food availability
- Location-based food distribution
- Direct communication with recipients
- Photo upload for food items
- Quantity and expiry information
- Pickup/delivery coordination

**How It Works:**
1. NGOs post available surplus food
2. Include photos, quantity, and location
3. Recipients contact NGO directly
4. Arrange food pickup or delivery
5. Reduce food waste while helping communities

---

### 👤 **PROFILE**
Comprehensive user profile management and achievement tracking.

**Features:**
- **Profile Picture Upload** - Multiple options (device upload, predefined avatars)
- **Personal Information** - Name, phone, WhatsApp, email, location
- **User Type Display** - General User, NGO, or EcoRecycler
- **Eco Achievements** - Display earned badges from challenges
- **Challenge History** - Track completed weekly challenges
- **Edit Profile** - Update information in-place
- **Circular Profile Photos** - Professional appearance
- **Logout Functionality**

---

## 🤖 AI Integration

Powered by **Google Gemini AI (gemini-1.5-pro)**

- **Real-time Climate News** - Curated environmental news
- **Daily Eco Tips** - Personalized sustainability advice
- **Carbon Footprint Analysis** - Detailed impact assessment with recommendations
- **Environmental News** - Latest global environmental updates
- **Smart Content Categorization** - Organized, relevant information

---

## 🎨 Design Features

- **Eco-friendly Theme** - Green and blue gradient color palette
- **Modern UI** - Rounded corners, shadows, smooth animations
- **Mobile-First** - Fully responsive across all devices
- **Intuitive Navigation** - Clear section-based structure
- **Visual Feedback** - Loading states, success indicators, error handling
- **Hover Effects** - Interactive elements with smooth transitions
- **Accessibility** - Proper contrast and keyboard navigation

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd RRR
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

6. **Preview production build**
```bash
npm run preview
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Component-based UI library
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.4.2** - Fast build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Modern icon library

### AI & APIs
- **Google Gemini AI** - AI-powered content generation
- **@google/generative-ai 0.24.1** - Gemini API integration

### Backend & Database
- **Supabase 2.84.0** - Backend-as-a-Service
  - Authentication
  - PostgreSQL database
  - Real-time subscriptions
  - File storage

### Routing & State
- **React Router DOM 7.9.6** - Client-side routing
- **Context API** - State management

---

## 📂 Project Structure

```
RRR/
├── src/
│   ├── components/
│   │   ├── auth/          # Login & Registration
│   │   ├── common/        # Home, Navigation, Profile
│   │   ├── reduce/        # Reduce section components
│   │   ├── reuse/         # Reuse section components
│   │   ├── recycle/       # Recycle section components
│   │   └── foodshare/     # Food Share section components
│   ├── lib/               # Authentication & Database utilities
│   ├── services/          # API services (Gemini AI)
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

---

## 🎯 Key Features

✅ **AI-Powered Insights** - Real-time environmental content via Gemini AI  
✅ **Community Marketplace** - Share and discover reusable items  
✅ **Recycling Network** - Connect with verified recycling centers  
✅ **Gamification** - Weekly challenges with badge rewards  
✅ **Direct Communication** - One-click Call, WhatsApp, Location sharing  
✅ **Food Waste Prevention** - NGO-managed food sharing  
✅ **Carbon Tracking** - Personalized footprint analysis  
✅ **Event Management** - Post and discover environmental events  
✅ **Profile Management** - Comprehensive user profiles with achievements  
✅ **Mobile Responsive** - Seamless experience across all devices

---

## 🌟 Impact Goals

1. **Reduce** - Raise awareness and lower carbon footprints
2. **Reuse** - Extend product lifecycles and reduce waste
3. **Recycle** - Connect materials with proper recycling channels
4. **Community** - Build an engaged sustainability network

---

## 🔐 Authentication

- Complete registration with validation
- Login via phone number or email
- User type selection (General, NGO, EcoRecycler)
- Profile picture upload during registration
- Secure password management
- Auto-filled forms for better UX

---

## 📸 Screenshots

*(Add screenshots of your platform here)*

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

For questions or support, please reach out through the platform or open an issue on GitHub.

---

## 🚀 What's Next

- 🗺️ Geolocation-based discovery
- 📱 Native mobile apps (iOS/Android)
- 💬 AI chatbot for sustainability advice
- 🏆 Enhanced reward system with brand partnerships
- 📊 Community impact dashboard
- 🌐 Multi-language support
- ⭐ Rating and review system
- 🔔 Push notifications for opportunities

---

**RRR - Transforming environmental responsibility into a connected, rewarding community experience.**

*Small Actions, Big Impact* 🌍
#   R R R - p l a t f o r m - - - R e d u c e - R e u s e - R e c y c l e  
 