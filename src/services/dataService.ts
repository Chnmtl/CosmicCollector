/**
 * Cosmic Data Service
 * Main service for fetching and managing cosmic object data
 * Single Responsibility: Orchestrate data fetching from various sources
 */

import { CosmicObject } from '../models/CosmicObject';
import { Planet } from '../models/Planet';
import { fetchPlanetaryData, fetchPlanetLore } from '../api';
import { mapApiToPlanet } from './apiMapper';
import { PlanetCache, MoonCache } from './cacheService';

export class CosmicDataService {
  /**
   * Fetch all planets from Solar System API (with caching)
   */
  static async fetchPlanets(): Promise<Planet[]> {
    try {
      // Check cache first
      const cached = await PlanetCache.get();
      if (cached && cached.length > 0) {
        console.log(`📦 Using cached planet data (${cached.length} planets)`);
        return cached as Planet[];
      }

      console.log('🌍 Fetching fresh planet data from API...');
      
      // Fetch from API - now returns Planet[] directly from updated API
      const planets = await fetchPlanetaryData();
      console.log(`✅ Received ${planets.length} planets from Solar System API`);

      // Fetch Wikipedia descriptions and update planet objects
      console.log('📖 Fetching planet descriptions from Wikipedia...');
      const planetsWithLore = await Promise.all(
        planets.map(async (planet) => {
          const description = await fetchPlanetLore(planet.name, 'Planet');
          if (description) {
            return {
              ...planet,
              description: description,
            };
          }
          return planet;
        })
      );

      // Cache the results
      await PlanetCache.set(planetsWithLore);
      console.log(`💾 Cached ${planetsWithLore.length} planets`);

      return planetsWithLore;
    } catch (error) {
      console.error('Failed to fetch planets:', error);
      throw error;
    }
  }

  /**
   * Fetch all moons (to be implemented)
   */
  static async fetchMoons(): Promise<CosmicObject[]> {
    try {
      const cached = await MoonCache.get();
      if (cached && cached.length > 0) {
        return cached;
      }

      // TODO: Implement moon fetching from API
      console.log('🌙 Moon fetching not yet implemented');
      return [];
    } catch (error) {
      console.error('Failed to fetch moons:', error);
      return [];
    }
  }

  /**
   * Fetch all cosmic objects from all sources
   */
  static async fetchAllObjects(): Promise<Map<string, CosmicObject>> {
    try {
      const [planets, moons] = await Promise.all([
        this.fetchPlanets(),
        this.fetchMoons(),
      ]);

      // Combine all objects into a Map for O(1) lookup
      const objectMap = new Map<string, CosmicObject>();

      [...planets, ...moons].forEach(obj => {
        objectMap.set(obj.id, obj);
      });

      console.log(`📚 Loaded ${objectMap.size} total cosmic objects`);
      return objectMap;
    } catch (error) {
      console.error('Failed to fetch cosmic objects:', error);
      return new Map();
    }
  }

  /**
   * Get object by ID
   */
  static async getObjectById(id: string, catalog: Map<string, CosmicObject>): Promise<CosmicObject | null> {
    return catalog.get(id) || null;
  }

  /**
   * Filter objects by type
   */
  static filterByType(
    catalog: Map<string, CosmicObject>,
    type: string
  ): CosmicObject[] {
    return Array.from(catalog.values()).filter(obj => obj.type === type);
  }

  /**
   * Filter objects by rarity
   */
  static filterByRarity(
    catalog: Map<string, CosmicObject>,
    rarity: string
  ): CosmicObject[] {
    return Array.from(catalog.values()).filter(obj => obj.rarity === rarity);
  }
}
