/**
 * Star Provider
 * Responsibility: Load stars from static extracted data (stars.json), build Star objects
 * 
 * Single Responsibility Principle: Only handles star data loading and building
 * Open/Closed Principle: Can be extended without modifying existing code
 * 
 * Data Flow: star_full_data.json -> extractStars.js -> stars.json -> this provider -> Star models
 */

import { Star } from '../../models/Star';
import { mapExtractedStar, ExtractedStarData } from '../mappers/mapExtractedStar';
import { StarCache } from '../cacheService';
import starsData from '../../data/stars.json';

export class StarProvider {
  constructor() {}

  /**
   * Fetch all stars from static data (with caching)
   * Returns all stars from stars.json with full data
   */
  async fetchAll(): Promise<Star[]> {
    // Check cache first
    const cached = await StarCache.get();
    if (cached && cached.length > 0) {
      console.log(`📦 [StarProvider] Using cached stars (${cached.length})`);
      return cached as Star[];
    }

    console.log('🌟 [StarProvider] Loading stars from static data...');

    // Load from stars.json
    const extractedStars = (starsData as any).stars as ExtractedStarData[];
    console.log(`✅ [StarProvider] Loaded ${extractedStars.length} stars from static data`);

    // Map to Star domain models
    const stars = extractedStars.map((extractedStar) => 
      mapExtractedStar(extractedStar)
    );

    // Log completeness statistics
    this.logCompletenessStats(stars);

    // Cache results
    await StarCache.set(stars);
    console.log(`💾 [StarProvider] Cached ${stars.length} stars`);

    return stars;
  }

  /**
   * Log data completeness statistics
   */
  private logCompletenessStats(stars: Star[]): void {
    if (stars.length === 0) return;

    console.log('\n📊 Star Data Completeness:');

    const fields = [
      { key: 'spectralClass', label: 'Spectral Class' },
      { key: 'constellation', label: 'Constellation' },
      { key: 'apparentMagnitude', label: 'Apparent Magnitude' },
      { key: 'absoluteMagnitude', label: 'Absolute Magnitude' },
      { key: 'distance', label: 'Distance' },
      { key: 'mass', label: 'Mass' },
      { key: 'radius', label: 'Radius' },
      { key: 'temperature', label: 'Temperature' },
      { key: 'age', label: 'Age' },
      { key: 'lifecycle', label: 'Lifecycle' },
    ];

    fields.forEach(({ key, label }) => {
      const count = stars.filter((s) => {
        const value = (s.starData as any)[key];
        return value !== null && value !== undefined;
      }).length;
      
      const percentage = ((count / stars.length) * 100).toFixed(1);
      const bar = '█'.repeat(Math.floor(count / stars.length * 20));
      
      console.log(`   ${label.padEnd(20)}: ${count.toString().padStart(3)}/${stars.length} (${percentage}%) ${bar}`);
    });
  }
}
