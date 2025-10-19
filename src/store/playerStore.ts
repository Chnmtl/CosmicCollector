/**
 * Player Store
 * Manages player-specific state: level, XP, energy
 * Single Responsibility: Player progression only
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ENERGY_REFILL_TIME = 5 * 60 * 1000; // 5 minutes
const ENERGY_REFILL_AMOUNT = 1;
const MAX_ENERGY = 10;
const XP_PER_LEVEL = 100;

export interface PlayerProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  energy: number;
  maxEnergy: number;
  lastEnergyRefill: Date;
}

interface PlayerStore {
  // State
  progress: PlayerProgress;
  
  // Actions
  addXp: (amount: number) => void;
  useEnergy: (amount: number) => boolean;
  refillEnergy: () => void;
  resetProgress: () => void;
  
  // Persistence
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
  
  // Getters
  canAffordEnergy: (cost: number) => boolean;
  getEnergyPercentage: () => number;
  getXpPercentage: () => number;
}

const initialProgress: PlayerProgress = {
  level: 1,
  xp: 0,
  xpToNextLevel: XP_PER_LEVEL,
  energy: MAX_ENERGY,
  maxEnergy: MAX_ENERGY,
  lastEnergyRefill: new Date(),
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  progress: initialProgress,

  addXp: (amount: number) => {
    set((state) => {
      const newXp = state.progress.xp + amount;
      let newLevel = state.progress.level;
      let remainingXp = newXp;
      let newXpToNextLevel = state.progress.xpToNextLevel;

      // Check for level ups (can level up multiple times)
      while (remainingXp >= newXpToNextLevel) {
        remainingXp -= newXpToNextLevel;
        newLevel++;
        newXpToNextLevel = XP_PER_LEVEL * newLevel;
      }

      return {
        progress: {
          ...state.progress,
          level: newLevel,
          xp: remainingXp,
          xpToNextLevel: newXpToNextLevel,
        },
      };
    });
    
    // Auto-save after XP change
    get().saveProgress();
  },

  useEnergy: (amount: number): boolean => {
    const state = get();
    if (state.progress.energy < amount) {
      return false; // Not enough energy
    }

    set((state) => ({
      progress: {
        ...state.progress,
        energy: state.progress.energy - amount,
      },
    }));

    // Auto-save after energy change
    get().saveProgress();
    return true;
  },

  refillEnergy: () => {
    set((state) => {
      const now = new Date();
      const timeSinceLastRefill = now.getTime() - state.progress.lastEnergyRefill.getTime();
      const refillsAvailable = Math.floor(timeSinceLastRefill / ENERGY_REFILL_TIME);

      if (refillsAvailable === 0) {
        return state; // No refill needed yet
      }

      const newEnergy = Math.min(
        state.progress.energy + refillsAvailable * ENERGY_REFILL_AMOUNT,
        state.progress.maxEnergy
      );

      const newLastRefill = new Date(
        state.progress.lastEnergyRefill.getTime() + refillsAvailable * ENERGY_REFILL_TIME
      );

      return {
        progress: {
          ...state.progress,
          energy: newEnergy,
          lastEnergyRefill: newLastRefill,
        },
      };
    });
  },

  resetProgress: () => {
    set({ progress: { ...initialProgress, lastEnergyRefill: new Date() } });
    AsyncStorage.removeItem('playerProgress');
  },

  saveProgress: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem('playerProgress', JSON.stringify(state.progress));
    } catch (error) {
      console.error('Failed to save player progress:', error);
    }
  },

  loadProgress: async () => {
    try {
      const saved = await AsyncStorage.getItem('playerProgress');
      if (saved) {
        const progress = JSON.parse(saved);
        set({
          progress: {
            ...progress,
            lastEnergyRefill: new Date(progress.lastEnergyRefill),
          },
        });
        
        // Refill energy based on time passed
        get().refillEnergy();
      }
    } catch (error) {
      console.error('Failed to load player progress:', error);
    }
  },

  canAffordEnergy: (cost: number): boolean => {
    return get().progress.energy >= cost;
  },

  getEnergyPercentage: (): number => {
    const state = get();
    return (state.progress.energy / state.progress.maxEnergy) * 100;
  },

  getXpPercentage: (): number => {
    const state = get();
    return (state.progress.xp / state.progress.xpToNextLevel) * 100;
  },
}));
