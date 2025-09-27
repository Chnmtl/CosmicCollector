import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CelestialObject, GameState, UserProgress, Mission } from '../types';
import { celestialObjectsData } from '../data/celestialObjects';

interface GameStore extends GameState {
  // Actions
  exploreUniverse: () => Promise<CelestialObject | null>;
  refillEnergy: () => void;
  levelUp: () => void;
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
  resetGame: () => void;
  
  // Getters
  canExplore: () => boolean;
  getDiscoveredByType: (type: string) => CelestialObject[];
  getRarityCount: (rarity: string) => number;
}

const ENERGY_REFILL_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const ENERGY_REFILL_AMOUNT = 1;
const MAX_ENERGY = 10;
const XP_PER_LEVEL = 100;

const initialUserProgress: UserProgress = {
  level: 1,
  xp: 0,
  xpToNextLevel: XP_PER_LEVEL,
  energy: MAX_ENERGY,
  maxEnergy: MAX_ENERGY,
  lastEnergyRefill: new Date(),
  totalDiscovered: 0,
  discoveredByType: {
    Star: 0,
    Planet: 0,
    Galaxy: 0,
    Exoplanet: 0,
    Nebula: 0,
    BlackHole: 0,
  },
};

const initialState: GameState = {
  userProgress: initialUserProgress,
  discoveredObjects: [],
  availableObjects: celestialObjectsData,
  isExploring: false,
  lastExploreTime: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  exploreUniverse: async () => {
    const state = get();
    
    if (!state.canExplore()) {
      return null;
    }

    set({ isExploring: true });

    // Simulate exploration delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const undiscoveredObjects = state.availableObjects.filter(obj => !obj.discovered);
    
    if (undiscoveredObjects.length === 0) {
      set({ isExploring: false });
      return null;
    }

    // Weighted random selection based on rarity
    const weights = {
      Common: 60,
      Rare: 25,
      Epic: 12,
      Legendary: 3,
    };

    const weightedObjects = undiscoveredObjects.map(obj => ({
      ...obj,
      weight: weights[obj.rarity],
    }));

    const totalWeight = weightedObjects.reduce((sum, obj) => sum + obj.weight, 0);
    let random = Math.random() * totalWeight;

    let selectedObject: CelestialObject | null = null;
    for (const obj of weightedObjects) {
      random -= obj.weight;
      if (random <= 0) {
        selectedObject = { ...obj };
        break;
      }
    }

    if (!selectedObject) {
      set({ isExploring: false });
      return null;
    }

    // Mark as discovered
    selectedObject.discovered = true;
    selectedObject.discoveredAt = new Date();

    const newUserProgress = { ...state.userProgress };
    newUserProgress.energy -= 1;
    newUserProgress.xp += selectedObject.xp;
    newUserProgress.totalDiscovered += 1;
    newUserProgress.discoveredByType[selectedObject.type] += 1;

    // Check for level up
    if (newUserProgress.xp >= newUserProgress.xpToNextLevel) {
      const extraXp = newUserProgress.xp - newUserProgress.xpToNextLevel;
      newUserProgress.level += 1;
      newUserProgress.xp = extraXp;
      newUserProgress.xpToNextLevel = XP_PER_LEVEL * newUserProgress.level;
    }

    // Update available objects
    const updatedAvailableObjects = state.availableObjects.map(obj =>
      obj.id === selectedObject!.id ? selectedObject! : obj
    );

    set({
      userProgress: newUserProgress,
      discoveredObjects: [...state.discoveredObjects, selectedObject],
      availableObjects: updatedAvailableObjects,
      isExploring: false,
      lastExploreTime: new Date(),
    });

    // Save progress
    get().saveProgress();

    return selectedObject;
  },

  refillEnergy: () => {
    const state = get();
    const now = new Date();
    const timeSinceLastRefill = now.getTime() - state.userProgress.lastEnergyRefill.getTime();
    const refillsAvailable = Math.floor(timeSinceLastRefill / ENERGY_REFILL_TIME);

    if (refillsAvailable > 0) {
      const newEnergy = Math.min(
        state.userProgress.energy + (refillsAvailable * ENERGY_REFILL_AMOUNT),
        state.userProgress.maxEnergy
      );

      set({
        userProgress: {
          ...state.userProgress,
          energy: newEnergy,
          lastEnergyRefill: new Date(
            state.userProgress.lastEnergyRefill.getTime() + (refillsAvailable * ENERGY_REFILL_TIME)
          ),
        },
      });
    }
  },

  levelUp: () => {
    // This is called automatically in exploreUniverse
    // Could be used for manual level up logic if needed
  },

  saveProgress: async () => {
    const state = get();
    try {
      await AsyncStorage.setItem('gameState', JSON.stringify({
        userProgress: state.userProgress,
        discoveredObjects: state.discoveredObjects,
        lastExploreTime: state.lastExploreTime,
      }));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  },

  loadProgress: async () => {
    try {
      const savedData = await AsyncStorage.getItem('gameState');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Update available objects based on discovered ones
        const updatedAvailableObjects = celestialObjectsData.map(obj => {
          const discovered = parsed.discoveredObjects.find((d: CelestialObject) => d.id === obj.id);
          return discovered ? discovered : obj;
        });

        set({
          userProgress: {
            ...parsed.userProgress,
            lastEnergyRefill: new Date(parsed.userProgress.lastEnergyRefill),
          },
          discoveredObjects: parsed.discoveredObjects,
          availableObjects: updatedAvailableObjects,
          lastExploreTime: parsed.lastExploreTime ? new Date(parsed.lastExploreTime) : null,
        });

        // Refill energy based on time passed
        get().refillEnergy();
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  },

  resetGame: () => {
    set({
      ...initialState,
      availableObjects: celestialObjectsData.map(obj => ({ ...obj, discovered: false })),
    });
    AsyncStorage.removeItem('gameState');
  },

  // Getters
  canExplore: () => {
    const state = get();
    return state.userProgress.energy > 0 && !state.isExploring;
  },

  getDiscoveredByType: (type: string) => {
    const state = get();
    return state.discoveredObjects.filter(obj => obj.type === type);
  },

  getRarityCount: (rarity: string) => {
    const state = get();
    return state.discoveredObjects.filter(obj => obj.rarity === rarity).length;
  },
}));