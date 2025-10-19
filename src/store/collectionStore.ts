/**
 * Collection Store (Binder)
 * Manages cosmic object catalog and player's discoveries
 * Single Responsibility: Collection management only
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CosmicObject, CosmicObjectType, Rarity } from '../models';
import { CosmicDataService } from '../services';

interface CollectionStats {
  totalDiscovered: number;
  byType: Record<CosmicObjectType, number>;
  byRarity: Record<Rarity, number>;
}

interface CollectionStore {
  // State
  catalog: Map<string, CosmicObject>; // All available objects
  discoveredIds: Set<string>; // IDs of discovered objects
  stats: CollectionStats;
  isLoading: boolean;
  
  // Actions
  loadCatalog: () => Promise<void>;
  discoverObject: (objectId: string) => void;
  getRandomUndiscovered: (rarityWeights?: Record<Rarity, number>) => CosmicObject | null;
  
  // Queries
  getDiscoveredObjects: () => CosmicObject[];
  getUndiscoveredObjects: () => CosmicObject[];
  getObjectById: (id: string) => CosmicObject | undefined;
  isDiscovered: (id: string) => boolean;
  
  // Persistence
  saveCollection: () => Promise<void>;
  loadCollection: () => Promise<void>;
  resetCollection: () => Promise<void>;
}

const initialStats: CollectionStats = {
  totalDiscovered: 0,
  byType: {
    Star: 0,
    Planet: 0,
    Moon: 0,
    Galaxy: 0,
    Exoplanet: 0,
    Nebula: 0,
    BlackHole: 0,
  },
  byRarity: {
    Common: 0,
    Rare: 0,
    Epic: 0,
    Legendary: 0,
  },
};

const defaultRarityWeights: Record<Rarity, number> = {
  Common: 60,
  Rare: 25,
  Epic: 12,
  Legendary: 3,
};

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  catalog: new Map(),
  discoveredIds: new Set(),
  stats: initialStats,
  isLoading: false,

  loadCatalog: async () => {
    set({ isLoading: true });
    
    try {
      const catalogMap = await CosmicDataService.fetchAllObjects();
      set({ catalog: catalogMap, isLoading: false });
      console.log(`📚 Catalog loaded: ${catalogMap.size} objects`);
    } catch (error) {
      console.error('Failed to load catalog:', error);
      set({ isLoading: false });
    }
  },

  discoverObject: (objectId: string) => {
    const state = get();
    const object = state.catalog.get(objectId);
    
    if (!object) {
      console.error(`Object ${objectId} not found in catalog`);
      return;
    }

    if (state.discoveredIds.has(objectId)) {
      console.warn(`Object ${objectId} already discovered`);
      return;
    }

    // Mark as discovered
    const newDiscoveredIds = new Set(state.discoveredIds);
    newDiscoveredIds.add(objectId);

    // Update stats
    const newStats = {
      totalDiscovered: state.stats.totalDiscovered + 1,
      byType: {
        ...state.stats.byType,
        [object.type]: state.stats.byType[object.type] + 1,
      },
      byRarity: {
        ...state.stats.byRarity,
        [object.rarity]: state.stats.byRarity[object.rarity] + 1,
      },
    };

    set({
      discoveredIds: newDiscoveredIds,
      stats: newStats,
    });

    // Auto-save
    get().saveCollection();
  },

  getRandomUndiscovered: (rarityWeights = defaultRarityWeights): CosmicObject | null => {
    const state = get();
    const undiscovered = Array.from(state.catalog.values()).filter(
      (obj) => !state.discoveredIds.has(obj.id)
    );

    if (undiscovered.length === 0) {
      return null;
    }

    // Weighted random selection based on rarity
    const weightedObjects = undiscovered.map((obj) => ({
      object: obj,
      weight: rarityWeights[obj.rarity],
    }));

    const totalWeight = weightedObjects.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of weightedObjects) {
      random -= item.weight;
      if (random <= 0) {
        return item.object;
      }
    }

    // Fallback (shouldn't happen)
    return undiscovered[0];
  },

  getDiscoveredObjects: (): CosmicObject[] => {
    const state = get();
    return Array.from(state.discoveredIds)
      .map((id) => state.catalog.get(id))
      .filter((obj): obj is CosmicObject => obj !== undefined);
  },

  getUndiscoveredObjects: (): CosmicObject[] => {
    const state = get();
    return Array.from(state.catalog.values()).filter(
      (obj) => !state.discoveredIds.has(obj.id)
    );
  },

  getObjectById: (id: string): CosmicObject | undefined => {
    return get().catalog.get(id);
  },

  isDiscovered: (id: string): boolean => {
    return get().discoveredIds.has(id);
  },

  saveCollection: async () => {
    try {
      const state = get();
      const data = {
        discoveredIds: Array.from(state.discoveredIds),
        stats: state.stats,
      };
      await AsyncStorage.setItem('collection', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save collection:', error);
    }
  },

  loadCollection: async () => {
    try {
      const saved = await AsyncStorage.getItem('collection');
      if (saved) {
        const data = JSON.parse(saved);
        set({
          discoveredIds: new Set(data.discoveredIds),
          stats: data.stats,
        });
        console.log(`📖 Loaded ${data.discoveredIds.length} discovered objects`);
      }
    } catch (error) {
      console.error('Failed to load collection:', error);
    }
  },

  resetCollection: async () => {
    set({
      discoveredIds: new Set(),
      stats: initialStats,
    });
    await AsyncStorage.removeItem('collection');
    console.log('🧹 Collection reset');
  },
}));
