/**
 * Planet Mapper
 * Transforms Solar System API data into Planet domain models
 * Pure function - no side effects, easy to test
 */

import { Planet, PlanetData } from '../../models/Planet';
import { SolarSystemPlanetResponse } from '../../api/types';
import { PLANET_GAME_DATA } from '../../data/gameData';
import { getPlanetType, PLANET_ATMOSPHERES, PLANET_RINGS } from './utils';
import { getPlanetImage } from '../../utils/imageResolver';

/**
 * Maps Solar System API response to Planet domain model
 * Combines:
 * - Real scientific data from API
 * - Game design data (rarity, loot) from gameData.ts
 * - Description from Wikipedia (optional)
 * 
 * @param apiData - Raw planet data from Solar System API
 * @param description - Optional description from Wikipedia
 * @returns Complete Planet domain model
 */
export function mapPlanet(
  apiData: SolarSystemPlanetResponse,
  description?: string
): Planet {
  const name = apiData.englishName;

  // Get game design data from centralized configuration
  const gameData = PLANET_GAME_DATA[name];

  if (!gameData) {
    console.warn(`⚠️ [mapPlanet] No game data found for planet: ${name}. Using defaults.`);
  }

  const rarity = gameData?.rarity || 'Common';
  const loot = gameData?.loot || [];

  // Build planet-specific data
  const planetData: PlanetData = {
    diameter: apiData.meanRadius ? apiData.meanRadius * 2 : undefined,
    mass: apiData.mass
      ? apiData.mass.massValue * Math.pow(10, apiData.mass.massExponent)
      : undefined,
    density: apiData.density,
    gravity: apiData.gravity,
    distanceFromSun: apiData.semimajorAxis,
    orbitalPeriod: apiData.sideralOrbit,
    rotationPeriod: apiData.sideralRotation,
    surfaceTemperature: apiData.avgTemp,
    atmosphere: PLANET_ATMOSPHERES[name],
    moons: apiData.moons ? apiData.moons.length : 0,
    rings: PLANET_RINGS[name] || false,
    discoveredBy: apiData.discoveredBy || 'Known since antiquity',
    discoveryDate: apiData.discoveryDate || 'Ancient times',
  };

  // Build complete planet object
  const planet: Planet = {
    // Base cosmic object properties
    id: apiData.id,
    name: name,
    type: 'Planet',
    subtype: getPlanetType(name),
    rarity: rarity,
    imageUrl: getPlanetImage(name),
    loot: loot,
    description: description || `${name}, a fascinating world in our solar system.`,
    facts: [],
    source: 'api',
    lastUpdated: new Date(),
    discovered: false,

    // Planet-specific data
    planetData: planetData,
  };

  return planet;
}
