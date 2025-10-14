import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CelestialObject, GameState, UserProgress, Mission } from '../types';
import { celestialObjectsData } from '../data/celestialObjects';
import { fetchPlanetaryData, fetchPlanetLore, ProcessedPlanetData } from '../api';

interface GameStore extends GameState {
  // Actions
  exploreUniverse: () => Promise<CelestialObject | null>;
  refillEnergy: () => void;
  levelUp: () => void;
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
  resetGame: () => void;
  fetchAndCachePlanets: () => Promise<void>;
  
  // Getters
  canExplore: () => boolean;
  getDiscoveredByType: (type: string) => CelestialObject[];
  getRarityCount: (rarity: string) => number;
  
  // Planet data cache
  planetDataCache: CelestialObject[];
  planetDataLastFetched: number | null;
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
    Moon: 0,
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

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  planetDataCache: [],
  planetDataLastFetched: null,

  fetchAndCachePlanets: async () => {
    const state = get();
    const now = Date.now();

    // Check if cache is still valid (within 24 hours)
    if (
      state.planetDataCache.length > 0 &&
      state.planetDataLastFetched &&
      now - state.planetDataLastFetched < CACHE_DURATION
    ) {
      console.log('Using cached planet data');
      return;
    }

    console.log('Fetching fresh planet data from API...');

    try {
      const planetData = await fetchPlanetaryData();
      console.log(`✅ Received ${planetData.length} planets from Solar System API`);

      // Fetch lore for each planet
      const planetsWithLore = await Promise.all(
        planetData.map(async (planet) => {
          const lore = await fetchPlanetLore(planet.name);
          return {
            ...planet,
            lore: lore || planet.lore,
          };
        })
      );
      console.log('✅ Finished fetching lore from Wikipedia');

      // Convert API data to CelestialObject format
      console.log('🔄 Converting to CelestialObject format...');
      const celestialPlanets: CelestialObject[] = planetsWithLore.map((planet) => {
        const converted = {
          id: planet.id,
          name: planet.name,
          type: 'Planet' as const,
          image: planet.emoji,
          image_url: planet.image,
          rarity: planet.rarity,
          description: planet.lore,
          xp: planet.xpReward,
          loot: planet.loot || [],
          lore: planet.lore,
          discovered: false,
          stats: {
            type: planet.type,
            diameter: planet.diameter ? `${planet.diameter.toFixed(0)} km` : undefined,
            moons: planet.moons,
            moonNames: planet.moonNames || [],
            gravity: planet.gravity ? `${planet.gravity.toFixed(2)} m/s²` : undefined,
            distanceFromSun: planet.distanceFromSun
              ? `${(planet.distanceFromSun / 1_000_000).toFixed(2)} million km`
              : undefined,
            dayLength: planet.dayLength
              ? Math.abs(planet.dayLength) < 48
                ? `${planet.dayLength.toFixed(1)} hours${planet.dayLength < 0 ? ' (retrograde)' : ''}`
                : `${(planet.dayLength / 24).toFixed(1)} days${planet.dayLength < 0 ? ' (retrograde)' : ''}`
              : undefined,
            yearLength: planet.yearLength ? `${planet.yearLength.toFixed(1)} days` : undefined,
            surfaceTemperature: planet.surfaceTemperature
              ? `${planet.surfaceTemperature.toFixed(0)} K (${(planet.surfaceTemperature - 273.15).toFixed(0)} °C)`
              : undefined,
            atmosphere: planet.atmosphere,
            density: planet.density ? `${planet.density.toFixed(2)} g/cm³` : undefined,
            rings: planet.rings,
            discoveredBy: planet.discoveredBy,
            discoveryDate: planet.discoveryDate,
          },
        };
        
        console.log(`🌍 [${planet.name}] Converted to CelestialObject:`, {
          id: converted.id,
          name: converted.name,
          rarity: converted.rarity,
          loot: converted.loot,
          moonCount: converted.stats.moons,
          moonNames: converted.stats.moonNames?.slice(0, 3), // Show first 3 in log
          discoveredBy: converted.stats.discoveredBy,
          discoveryDate: converted.stats.discoveryDate,
          stats: converted.stats,
        });
        
        return converted;
      });

      // Update cache
      set({
        planetDataCache: celestialPlanets,
        planetDataLastFetched: now,
      });

      // Merge with availableObjects, replacing any static planet data
      const updatedAvailableObjects = [
        ...celestialPlanets,
        ...state.availableObjects.filter(
          (obj) => !celestialPlanets.some((planet) => planet.name === obj.name)
        ),
      ];

      console.log(`🔄 Updated availableObjects. Total objects: ${updatedAvailableObjects.length}`);
      console.log(`   - API planets: ${celestialPlanets.length}`);
      console.log(`   - Static objects kept: ${updatedAvailableObjects.length - celestialPlanets.length}`);

      set({ availableObjects: updatedAvailableObjects });

      // Save cache to AsyncStorage
      await AsyncStorage.setItem(
        'planetCache',
        JSON.stringify({
          data: celestialPlanets,
          timestamp: now,
        })
      );

      console.log(`Successfully fetched and cached ${celestialPlanets.length} planets`);
    } catch (error) {
      console.error('Failed to fetch planet data, using static fallback:', error);
      // Keep using static data from celestialObjects.ts
    }
  },

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

      // Load cached planet data
      const cachedPlanets = await AsyncStorage.getItem('planetCache');
      if (cachedPlanets) {
        const cache = JSON.parse(cachedPlanets);
        set({
          planetDataCache: cache.data,
          planetDataLastFetched: cache.timestamp,
        });
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