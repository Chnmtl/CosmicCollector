/**
 * Moon Mapper
 * Transforms Solar System API data into Moon domain models
 * Pure function - no side effects, easy to test
 */

import { Moon, MoonData } from '../../models/Moon';
import { SolarSystemPlanetResponse } from '../../api/types';
import { MOON_GAME_DATA } from '../../data/gameData';
import { getMoonType, calculateMoonRarity } from './utils';

/**
 * Maps Solar System API response to Moon domain model
 * Combines:
 * - Real scientific data from API
 * - Game design data (rarity, loot) from gameData.ts
 * - Parent planet name from planetNameMap
 * - Description from Wikipedia (optional)
 * 
 * @param apiData - Raw moon data from Solar System API
 * @param planetNameMap - Map from planet ID to English name
 * @param description - Optional description from Wikipedia
 * @returns Complete Moon domain model
 */
export function mapMoon(
  apiData: SolarSystemPlanetResponse,
  planetNameMap: Record<string, string>,
  description?: string
): Moon {
  const name = apiData.englishName;
  const radius = apiData.meanRadius || 0;

  // Get game design data from centralized configuration
  const gameData = MOON_GAME_DATA[name];

  // Extract parent planet info from aroundPlanet field
  // API returns planet ID (e.g., "jupiter", "terre")
  let planetId = apiData.aroundPlanet?.planet || 'unknown';

  // Handle if it's a URL - extract the last part
  if (planetId.includes('/')) {
    planetId = planetId.split('/').pop() || 'unknown';
  }

  const parentPlanetName = planetNameMap[planetId] || planetId;

  // Debug logging for moon parent planet mapping
  if (!planetNameMap[planetId] && planetId !== 'unknown') {
    console.warn(
      `⚠️ [mapMoon] No English name found for planet ID "${planetId}" for moon "${name}"`
    );
    console.warn(`   Available planet IDs in map:`, Object.keys(planetNameMap));
  }

  // Determine rarity - use game data if available, otherwise calculate from size
  const rarity = gameData?.rarity || calculateMoonRarity(radius);
  const loot = gameData?.loot || [`${name} Dust`, 'Ice Crystals', 'Moon Rock'];

  // Build moon-specific data
  const moonData: MoonData = {
    parentPlanetId: planetId,
    parentPlanetName: parentPlanetName,
    diameter: radius ? radius * 2 : undefined,
    mass: apiData.mass
      ? apiData.mass.massValue * Math.pow(10, apiData.mass.massExponent)
      : undefined,
    density: apiData.density,
    gravity: apiData.gravity || undefined,
    orbitalPeriod: apiData.sideralOrbit,
    distanceFromPlanet: apiData.semimajorAxis,
    eccentricity: apiData.eccentricity,
    inclination: apiData.inclination,
    discoveredBy: apiData.discoveredBy,
    discoveryDate: apiData.discoveryDate,
  };

  // Build complete moon object
  const moon: Moon = {
    // Base cosmic object properties
    id: apiData.id,
    name: name,
    type: 'Moon',
    subtype: getMoonType(apiData),
    rarity: rarity,
    imageUrl: undefined, // Will be added later if needed
    loot: loot,
    description:
      description || `${name}, a ${getMoonType(apiData).toLowerCase()} moon orbiting ${parentPlanetName}.`,
    facts: [],
    source: 'api',
    lastUpdated: new Date(),
    discovered: false,

    // Moon-specific data
    moonData: moonData,
  };

  return moon;
}
