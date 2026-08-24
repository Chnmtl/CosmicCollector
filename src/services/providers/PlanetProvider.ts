/**
 * Planet Provider
 * Responsibility: Fetch planets from Solar System API, enrich with Wikipedia, cache results
 * 
 * Single Responsibility Principle: Only handles planet data fetching and building
 * Open/Closed Principle: Can be extended without modifying existing code
 */

import { Planet } from '../../models/Planet';
import { SolarSystemClient } from '../../api/clients/SolarSystemClient';
import { WikipediaClient } from '../../api/clients/WikipediaClient';
import { mapPlanet } from '../mappers/mapPlanet';
import { PlanetCache } from '../cacheService';
import { SolarSystemPlanetResponse } from '../../api/types';

/**
 * Planet metadata for other providers
 */
export interface PlanetMetadata {
  planetIds: string[];
  planetNameMap: Record<string, string>;
}

export class PlanetProvider {
  constructor(
    private solarSystemClient: SolarSystemClient,
    private wikipediaClient: WikipediaClient
  ) {}

  /**
   * Fetch all planets (with caching)
   * Returns the 8 main planets with full data
   */
  async fetchAll(): Promise<Planet[]> {
    // Check cache first
    const cached = await PlanetCache.get();
    if (cached && cached.length > 0) {
      console.log(`📦 [PlanetProvider] Using cached planets (${cached.length})`);
      return cached as Planet[];
    }

    console.log('🌍 [PlanetProvider] Fetching planets from API...');

    // Fetch raw data from Solar System API
    const rawPlanets = await this.solarSystemClient.getPlanets();
    console.log(`✅ [PlanetProvider] Received ${rawPlanets.length} planets from API`);

    // Build planets with Wikipedia descriptions
    const planets = await Promise.all(
      rawPlanets.map((raw) => this.buildPlanet(raw))
    );

    // Cache results
    await PlanetCache.set(planets);
    console.log(`💾 [PlanetProvider] Cached ${planets.length} planets`);

    return planets;
  }

  /**
   * Get planet metadata for other providers (e.g., MoonProvider needs this)
   * Ensures consistent planet data across providers
   */
  async getMetadata(): Promise<PlanetMetadata> {
    const planets = await this.fetchAll();

    const metadata: PlanetMetadata = {
      planetIds: planets.map((p) => p.id),
      planetNameMap: Object.fromEntries(planets.map((p) => [p.id, p.name])),
    };

    console.log(
      `📋 [PlanetProvider] Providing metadata for ${metadata.planetIds.length} planets`
    );

    return metadata;
  }

  /**
   * Build a single planet with Wikipedia description
   * Private method - internal implementation detail
   */
  private async buildPlanet(apiData: SolarSystemPlanetResponse): Promise<Planet> {
    const name = apiData.englishName;

    // Fetch description from Wikipedia (non-blocking, can fail gracefully)
    const description = await this.wikipediaClient.getDescription(name, 'Planet');

    // Map API data to Planet domain model
    return mapPlanet(apiData, description || undefined);
  }
}
