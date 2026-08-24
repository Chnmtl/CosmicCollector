/**
 * Moon Provider
 * Responsibility: Fetch moons from Solar System API, enrich with Wikipedia, cache results
 * 
 * Single Responsibility Principle: Only handles moon data fetching and building
 * Depends on: PlanetProvider metadata (planet IDs and names)
 */

import { Moon } from '../../models/Moon';
import { SolarSystemClient } from '../../api/clients/SolarSystemClient';
import { WikipediaClient } from '../../api/clients/WikipediaClient';
import { mapMoon } from '../mappers/mapMoon';
import { MoonCache } from '../cacheService';
import { SolarSystemPlanetResponse } from '../../api/types';

export class MoonProvider {
  constructor(
    private solarSystemClient: SolarSystemClient,
    private wikipediaClient: WikipediaClient
  ) {}

  /**
   * Fetch all moons (with caching)
   * Requires planet metadata to:
   * 1. Filter moons to only those orbiting main planets (not dwarf planets)
   * 2. Map parent planet French ID to English name
   * 
   * @param planetIds - Array of valid planet IDs to filter moons by
   * @param planetNameMap - Map from planet ID (French) to English name
   * @returns Top 60 moons sorted by size
   */
  async fetchAll(
    planetIds: string[],
    planetNameMap: Record<string, string>
  ): Promise<Moon[]> {
    // Check cache first
    const cached = await MoonCache.get();
    if (cached && cached.length > 0) {
      console.log(`📦 [MoonProvider] Using cached moons (${cached.length})`);
      return cached as Moon[];
    }

    console.log('🌙 [MoonProvider] Fetching moons from API...');
    console.log(`   Using ${planetIds.length} planet IDs for filtering`);

    // Fetch raw data from Solar System API (filtered by valid planet IDs)
    const rawMoons = await this.solarSystemClient.getMoons(planetIds);
    console.log(`✅ [MoonProvider] Received ${rawMoons.length} moons from API`);

    // Build moons with Wikipedia descriptions
    const moons = await Promise.all(
      rawMoons.map((raw) => this.buildMoon(raw, planetNameMap))
    );

    // Cache results
    await MoonCache.set(moons);
    console.log(`💾 [MoonProvider] Cached ${moons.length} moons`);

    return moons;
  }

  /**
   * Build a single moon with Wikipedia description
   * Private method - internal implementation detail
   */
  private async buildMoon(
    apiData: SolarSystemPlanetResponse,
    planetNameMap: Record<string, string>
  ): Promise<Moon> {
    const name = apiData.englishName;

    // Fetch description from Wikipedia (non-blocking, can fail gracefully)
    const description = await this.wikipediaClient.getDescription(name, 'Moon');

    // Map API data to Moon domain model
    return mapMoon(apiData, planetNameMap, description || undefined);
  }
}
