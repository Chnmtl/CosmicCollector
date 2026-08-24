/**
 * Mapper Utility Functions
 * Shared helper functions for mapping API data to domain models
 * DRY Principle: Reusable logic extracted here
 */

import { Rarity } from '../../models/CosmicObject';
import { PlanetType } from '../../models/Planet';
import { MoonType } from '../../models/Moon';
import { SolarSystemPlanetResponse } from '../../api/types';

// ============================================================================
// PLANET UTILITIES
// ============================================================================

/**
 * Determine planet type/subtype based on name
 * @param name - Planet name
 * @returns Planet type classification
 */
export function getPlanetType(name: string): PlanetType {
  if (['Mercury', 'Venus', 'Earth', 'Mars'].includes(name)) {
    return 'Rocky';
  }
  if (['Jupiter', 'Saturn'].includes(name)) {
    return 'Gas Giant';
  }
  if (['Uranus', 'Neptune'].includes(name)) {
    return 'Ice Giant';
  }
  return 'Rocky'; // default
}

/**
 * Planet atmospheres (not available from API)
 */
export const PLANET_ATMOSPHERES: Record<string, string> = {
  Mercury: 'Minimal (traces of O, Na, H, He)',
  Venus: 'CO₂ 96.5%, N₂ 3.5%',
  Earth: 'N₂ 78%, O₂ 21%, Ar 1%',
  Mars: 'CO₂ 95.1%, N₂ 2.6%, Ar 1.9%',
  Jupiter: 'H₂ ~90%, He ~10%',
  Saturn: 'H₂ ~96%, He ~3%',
  Uranus: 'H₂ 83%, He 15%, CH₄ 2%',
  Neptune: 'H₂ 80%, He 19%, CH₄ 1.5%',
};

/**
 * Which planets have rings (not available from API)
 */
export const PLANET_RINGS: Record<string, boolean> = {
  Mercury: false,
  Venus: false,
  Earth: false,
  Mars: false,
  Jupiter: true,
  Saturn: true,
  Uranus: true,
  Neptune: true,
};

// ============================================================================
// MOON UTILITIES
// ============================================================================

/**
 * Determine moon type based on orbital characteristics
 * @param apiData - Moon data from Solar System API
 * @returns Moon type classification
 */
export function getMoonType(apiData: SolarSystemPlanetResponse): MoonType {
  const eccentricity = apiData.eccentricity || 0;
  const inclination = apiData.inclination || 0;
  const radius = apiData.meanRadius || 0;

  // Regular moons: Nearly circular orbits close to planet's equator
  if (eccentricity < 0.05 && inclination < 5) {
    return 'Regular';
  }

  // Captured asteroids: Small bodies with highly irregular orbits
  if (radius < 50 && (eccentricity > 0.1 || inclination > 10)) {
    return 'Captured Asteroid';
  }

  // Irregular moons: Everything else (elongated or tilted orbits)
  return 'Irregular';
}

/**
 * Calculate moon rarity based on size when not in game data
 * @param radius - Moon radius in km
 * @returns Rarity level
 */
export function calculateMoonRarity(radius: number): Rarity {
  if (radius >= 1700) return 'Legendary'; // Large moons (Ganymede, Titan, etc.)
  if (radius >= 750) return 'Epic';       // Medium moons (Europa, Triton, etc.)
  if (radius >= 100) return 'Rare';       // Small moons
  return 'Common';                         // Tiny moons
}
