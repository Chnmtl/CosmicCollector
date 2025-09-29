# 🌌 Cosmic Collector

Cosmic Collector is a 2D space exploration and collectible card app built in React Native with Expo. Discover the wonders of the universe, collect celestial objects, and build your cosmic collection!

## ✨ Features

### 🚀 Core Gameplay
- **Explore the Universe**: Tap to discover random celestial objects
- **Collectible Cards**: Each object is a beautifully designed card with stats and lore
- **Rarity System**: Common, Rare, Epic, and Legendary objects with different rewards
- **XP & Progression**: Level up by discovering new objects
- **Energy System**: Strategic gameplay with automatic energy refill over time

### 🎨 Visual Design
- **Space Theme**: Dark gradient backgrounds with cosmic colors
- **Card Animations**: Smooth flip animations and particle effects for rare discoveries
- **Responsive UI**: Clean, modern interface optimized for mobile
- **Visual Feedback**: Glowing elements, rarity-based colors, and smooth transitions

### 📱 Three Main Screens
1. **Explore Screen**: 
   - Discovery mechanics with cooldown system
   - Progress tracking (level, XP, energy)
   - Animated card reveals with particle effects
   
2. **Collection Screen**: 
   - Grid view of all discovered objects
   - Filter by object type (Stars, Planets, Galaxies, etc.)
   - Rarity statistics and collection progress
   
3. **Missions Screen**: 
   - Achievement system with various challenges
   - Progress tracking and rewards
   - Completion badges and statistics

### 🌟 Celestial Objects
**22 unique objects across 6 categories:**
- **Stars**: Sol, Sirius, Betelgeuse, Vega, Rigel, Alpha Centauri
- **Planets**: Earth, Mars, Jupiter, Venus, Saturn
- **Galaxies**: Milky Way, Andromeda, Whirlpool Galaxy
- **Exoplanets**: Kepler-22b, Proxima Centauri b, TRAPPIST-1e
- **Nebulae**: Orion Nebula, Crab Nebula, Horsehead Nebula
- **Black Holes**: Sagittarius A*, Cygnus X-1

Each object includes:
- Real astronomical data and facts
- Beautiful emoji representations
- Rarity-based XP rewards
- Themed loot items
- Educational lore and descriptions

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Storage**: AsyncStorage for persistence
- **Animations**: React Native Animated API
- **Styling**: React Native StyleSheet with linear gradients
- **Icons**: Emoji-based design system

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chnmtl/CosmicCollector.git
   cd CosmicCollector
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run web      # Web development
   npm run android  # Android development
   npm run ios      # iOS development (requires macOS)
   ```

### Building for Production

```bash
# Web build
npx expo export --platform web

# Native builds (requires Expo Application Services)
npx expo build:android
npx expo build:ios
```

## 🎮 How to Play

1. **Start Exploring**: Tap the "Explore Universe" button to discover celestial objects
2. **Energy System**: Each exploration costs 1 energy. Energy refills automatically over time
3. **Collect Cards**: Discovered objects are added to your collection with detailed information
4. **Level Up**: Earn XP from discoveries to increase your level and unlock new content
5. **Complete Missions**: Check the Missions tab for achievements and extra rewards
6. **Build Collection**: Use filters to organize and view your celestial collection

## 📊 Game Mechanics

### Rarity & Rewards
- **Common** (60% chance): 10-15 XP, basic loot
- **Rare** (25% chance): 20-30 XP, better rewards
- **Epic** (12% chance): 40-65 XP, valuable loot + particle effects
- **Legendary** (3% chance): 80-150 XP, premium rewards + spectacular effects

### Energy System
- **Max Energy**: 10 units
- **Refill Rate**: 1 energy every 5 minutes
- **Strategic Element**: Prevents spam while encouraging regular play

### Progression
- **XP Requirements**: Increases with each level (Level 1: 100 XP, Level 2: 200 XP, etc.)
- **Missions**: 8 different achievement categories
- **Collection Goals**: Discover all objects across different types and rarities

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CelestialCard.tsx   # Main card component
│   ├── ProgressBar.tsx     # XP and mission progress
│   ├── TabBar.tsx          # Bottom navigation
│   ├── AnimatedCard.tsx    # Card flip animations
│   └── ParticleEffect.tsx  # Rare discovery effects
├── screens/             # Main app screens
│   ├── ExploreScreen.tsx   # Discovery interface
│   ├── CollectionScreen.tsx # Card collection view
│   └── MissionsScreen.tsx  # Achievements and missions
├── store/               # State management
│   └── gameStore.ts        # Zustand store with persistence
├── data/                # Game content
│   ├── celestialObjects.ts # Object database
│   └── missions.ts         # Achievement definitions
├── types/               # TypeScript definitions
│   └── index.ts            # Core interfaces
└── utils/               # Helper functions
```

## 🎯 Future Enhancements

- **Sound Effects**: Audio feedback for discoveries and interactions
- **Daily Challenges**: Rotating special missions
- **Trading System**: Exchange duplicate objects
- **Real NASA API**: Integration with live astronomical data
- **Augmented Reality**: AR view of discovered objects
- **Social Features**: Share discoveries with friends
- **Constellation Mode**: Group related objects
- **Seasonal Events**: Special limited-time objects

## 🎨 Design Philosophy

- **Educational**: Real astronomical facts make learning fun
- **Accessible**: Simple tap-to-play mechanics for all ages
- **Beautiful**: Space-themed design with smooth animations
- **Balanced**: Strategic energy system promotes regular engagement
- **Rewarding**: Multiple progression systems keep players motivated

## 📱 Platform Support

- ✅ **Web**: Fully functional web app
- ✅ **iOS**: Native iOS app via Expo
- ✅ **Android**: Native Android app via Expo
- 🔄 **Offline**: Local storage for progress persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Cihan Mutlu** - [GitHub](https://github.com/Chnmtl)

---

*Explore the cosmos, one card at a time! 🌌*
