/**
 * Catalog Service
 * Responsibility: Orchestrate all providers and build complete cosmic object catalog
 * 
 * Single Responsibility Principle: Only handles provider coordination
 * Open/Closed Principle: Can add new providers without modifying existing logic
 * 
 * This is the main entry point for loading all cosmic objects.
 * It manages dependencies between providers (e.g., moons need planet metadata).
 */

import { CosmicObject } from '../models/CosmicObject';
import { SolarSystemClient } from '../api/clients/SolarSystemClient';
import { WikipediaClient } from '../api/clients/WikipediaClient';
import { PlanetProvider } from './providers/PlanetProvider';
import { MoonProvider } from './providers/MoonProvider';
import { StarProvider } from './providers/StarProvider';
import { PlanetCache, MoonCache, StarCache } from './cacheService';

export class CatalogService {
  private solarSystemClient: SolarSystemClient;
  private wikipediaClient: WikipediaClient;
  private planetProvider: PlanetProvider;
  private moonProvider: MoonProvider;
  private starProvider: StarProvider;

  constructor() {
    console.log('🏗️ [CatalogService] Initializing...');

    // Initialize API clients (shared across providers)
    this.solarSystemClient = new SolarSystemClient();
    this.wikipediaClient = new WikipediaClient();

    // Initialize providers with dependency injection
    this.planetProvider = new PlanetProvider(
      this.solarSystemClient,
      this.wikipediaClient
    );
    this.moonProvider = new MoonProvider(
      this.solarSystemClient,
      this.wikipediaClient
    );
    this.starProvider = new StarProvider();

    console.log('✅ [CatalogService] Initialized');
  }

  /**
   * Load all cosmic objects from all providers
   * Handles provider dependencies and orchestration
   * 
   * Flow:
   * 1. Load planets (independent)
   * 2. Extract planet metadata
   * 3. Load moons (depends on planet metadata) and stars (independent) in parallel
   * 4. Future: Load other object types in parallel
   * 5. Combine into single catalog
   * 
   * @returns Map of all cosmic objects (id -> object)
   */
  async loadAll(): Promise<Map<string, CosmicObject>> {
    console.log('📚 [CatalogService] Loading cosmic catalog...');

    try {
      // Step 1: Load planets (independent provider)
      const planets = await this.planetProvider.fetchAll();
      console.log(`   ✅ Loaded ${planets.length} planets`);

      // Step 2: Get planet metadata for dependent providers
      const planetMetadata = await this.planetProvider.getMetadata();
      console.log(`   📋 Extracted metadata for ${planetMetadata.planetIds.length} planets`);

      // Step 3: Load moons (depends on planets) and stars (independent) in parallel
      const [moons, stars] = await Promise.all([
        this.moonProvider.fetchAll(
          planetMetadata.planetIds,
          planetMetadata.planetNameMap
        ),
        this.starProvider.fetchAll(),
      ]);
      console.log(`   ✅ Loaded ${moons.length} moons`);
      console.log(`   ✅ Loaded ${stars.length} stars`);

      // Step 4: Future - Load other independent providers in parallel
      // When adding exoplanets, nebulae, etc., add them here:
      // const [exoplanets, nebulae] = await Promise.all([
      //   this.exoplanetProvider.fetchAll(),
      //   this.nebulaProvider.fetchAll(),
      // ]);

      // Step 5: Build catalog (combine all objects)
      const catalog = new Map<string, CosmicObject>();

      // Add all objects to catalog
      [...planets, ...moons, ...stars].forEach((obj) => {
        catalog.set(obj.id, obj);
      });

      console.log(`✅ [CatalogService] Catalog loaded: ${catalog.size} total objects`);
      console.log(`   Breakdown: ${planets.length} planets, ${moons.length} moons, ${stars.length} stars`);

      return catalog;
    } catch (error) {
      console.error('❌ [CatalogService] Failed to load catalog:', error);
      throw error;
    }
  }

  /**
   * Clear all caches and force fresh data on next load
   * Useful for debugging or when data needs to be refreshed
   */
  async clearAllCaches(): Promise<void> {
    console.log('🧹 [CatalogService] Clearing all caches...');

    await Promise.all([
      PlanetCache.clear(),
      MoonCache.clear(),
      StarCache.clear(),
      // Future: ExoplanetCache.clear(), etc.
    ]);

    console.log('✅ [CatalogService] All caches cleared');
  }
}

// Export singleton instance for easy import
// This ensures only one instance exists across the app
export const catalogService = new CatalogService();
