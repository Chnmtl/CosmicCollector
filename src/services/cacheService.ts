/**
 * Cache Service
 * Handles caching of API data with timestamps
 * Single Responsibility: Cache management only
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CosmicObject } from '../models/CosmicObject';

const CACHE_KEYS = {
  PLANETS: 'cache_planets',
  MOONS: 'cache_moons',
  STARS: 'cache_stars',
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Generic cache service
 */
export class CacheService {
  /**
   * Save data to cache
   */
  static async set<T>(key: string, data: T): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error(`Failed to cache data for key ${key}:`, error);
    }
  }

  /**
   * Get data from cache if valid
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - entry.timestamp < CACHE_DURATION) {
        console.log(`✅ Cache hit for ${key} (age: ${Math.round((now - entry.timestamp) / 1000 / 60)} minutes)`);
        return entry.data;
      } else {
        console.log(`⏰ Cache expired for ${key}`);
        await this.clear(key);
        return null;
      }
    } catch (error) {
      console.error(`Failed to read cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Clear specific cache entry
   */
  static async clear(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to clear cache for key ${key}:`, error);
    }
  }

  /**
   * Clear all caches
   */
  static async clearAll(): Promise<void> {
    try {
      await Promise.all(
        Object.values(CACHE_KEYS).map(key => AsyncStorage.removeItem(key))
      );
      
      console.log('🧹 All caches cleared');
    } catch (error) {
      console.error('Failed to clear all caches:', error);
    }
  }
}

/**
 * Specific cache accessors for each data type
 */
export const PlanetCache = {
  get: () => CacheService.get<CosmicObject[]>(CACHE_KEYS.PLANETS),
  set: (data: CosmicObject[]) => CacheService.set(CACHE_KEYS.PLANETS, data),
  clear: () => CacheService.clear(CACHE_KEYS.PLANETS),
};

export const MoonCache = {
  get: () => CacheService.get<CosmicObject[]>(CACHE_KEYS.MOONS),
  set: (data: CosmicObject[]) => CacheService.set(CACHE_KEYS.MOONS, data),
  clear: () => CacheService.clear(CACHE_KEYS.MOONS),
};

export const StarCache = {
  get: () => CacheService.get<CosmicObject[]>(CACHE_KEYS.STARS),
  set: (data: CosmicObject[]) => CacheService.set(CACHE_KEYS.STARS, data),
  clear: () => CacheService.clear(CACHE_KEYS.STARS),
};
