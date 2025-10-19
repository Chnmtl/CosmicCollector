/**
 * API Mapper Service
 * Converts API responses to our domain models
 * Combines real API data with game design data
 * 
 * Data Sources:
 * - Real Scientific Data: From Solar System API, Wikipedia API, NASA Images API
 * - Game Design Data: From src/data/gameData.ts (rarity, loot, etc.)
 * - Game Balance: Calculated from rarity using src/utils/gameBalance.ts
 */

import { Planet, PlanetData, PlanetType } from '../models/Planet';
import { Moon, MoonData, MoonType } from '../models/Moon';
import { SolarSystemPlanetResponse } from '../api/types';
import { Rarity } from '../models/CosmicObject';
import { PLANET_GAME_DATA, getGameData } from '../data/gameData';
import { calculateXpReward, calculateEnergyCost, calculateDiscoveryChance } from '../utils/gameBalance';

// ============================================================================
// HARDCODED DATA (Not available from API)
// ============================================================================

const PLANET_ATMOSPHERES: Record<string, string> = {
  Mercury: 'Minimal (traces of O, Na, H, He)',
  Venus: 'CO₂ 96.5%, N₂ 3.5%',
  Earth: 'N₂ 78%, O₂ 21%, Ar 1%',
  Mars: 'CO₂ 95.1%, N₂ 2.6%, Ar 1.9%',
  Jupiter: 'H₂ ~90%, He ~10%',
  Saturn: 'H₂ ~96%, He ~3%',
  Uranus: 'H₂ 83%, He 15%, CH₄ 2%',
  Neptune: 'H₂ 80%, He 19%, CH₄ 1.5%',
};

const PLANET_RINGS: Record<string, boolean> = {
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
// HELPER FUNCTIONS
// ============================================================================

function determinePlanetType(name: string): PlanetType {
  if (['Mercury', 'Venus', 'Earth', 'Mars'].includes(name)) {
    return 'Rocky';
  } else if (['Jupiter', 'Saturn'].includes(name)) {
    return 'Gas Giant';
  } else if (['Uranus', 'Neptune'].includes(name)) {
    return 'Ice Giant';
  }
  return 'Rocky'; // default
}

// ============================================================================
// MAPPING FUNCTIONS
// ============================================================================

/**
 * Maps Solar System API response to our Planet model
 * Combines API data (real) with game design data (from gameData.ts)
 */
export function mapApiToPlanet(
  apiData: SolarSystemPlanetResponse,
  moonNameMap: Record<string, string>,
  imageUrl?: string,
  description?: string
): Planet {
  const name = apiData.englishName;
  
  // Get game design data from centralized configuration
  const gameData = PLANET_GAME_DATA[name];
  
  if (!gameData) {
    console.warn(`⚠️ No game data found for planet: ${name}. Using defaults.`);
  }
  
  const rarity = gameData?.rarity || 'Common';
  const loot = gameData?.loot || [];
  
  // Calculate game balance values from rarity
  const xpReward = calculateXpReward(rarity);
  const energyCost = calculateEnergyCost();
  const discoveryChance = calculateDiscoveryChance(rarity);
  
  // Extract moon names using lookup map
  const moonNames = apiData.moons?.map(m => {
    const moonId = m.rel.split('/').pop() || '';
    const englishName = moonNameMap[moonId];
    if (!englishName) {
      console.warn(`⚠️ [${name}] Moon ID "${moonId}" not found in lookup map`);
    }
    return englishName || m.moon;
  }) || [];
  
  // Build planet-specific data
  const planetData: PlanetData = {
    diameter: apiData.meanRadius ? apiData.meanRadius * 2 : undefined,
    mass: apiData.mass ? apiData.mass.massValue * Math.pow(10, apiData.mass.massExponent) : undefined,
    density: apiData.density,
    gravity: apiData.gravity,
    distanceFromSun: apiData.semimajorAxis,
    orbitalPeriod: apiData.sideralOrbit,
    rotationPeriod: apiData.sideralRotation,
    surfaceTemperature: apiData.avgTemp,
    atmosphere: PLANET_ATMOSPHERES[name],
    moons: apiData.moons ? apiData.moons.length : 0,
    moonNames: moonNames,
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
    subtype: determinePlanetType(name),
    rarity: rarity,
    imageUrl: imageUrl,
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

/**
 * Maps Solar System API moon response to our Moon model
 * (To be implemented when moon API integration is added)
 */
export function mapApiToMoon(
  apiData: SolarSystemPlanetResponse,
  parentPlanetId: string,
  parentPlanetName: string,
  imageUrl?: string,
  description?: string
): Moon {
  const name = apiData.englishName;
  
  // Determine moon type based on characteristics
  let moonType: MoonType = 'Regular';
  if (apiData.eccentricity && apiData.eccentricity > 0.25) {
    moonType = 'Irregular';
  }
  
  // Build moon-specific data
  const moonData: MoonData = {
    parentPlanetId: parentPlanetId,
    parentPlanetName: parentPlanetName,
    diameter: apiData.meanRadius ? apiData.meanRadius * 2 : undefined,
    mass: apiData.mass ? apiData.mass.massValue * Math.pow(10, apiData.mass.massExponent) : undefined,
    density: apiData.density,
    gravity: apiData.gravity,
    orbitalPeriod: apiData.sideralOrbit,
    distanceFromPlanet: apiData.semimajorAxis,
    surfaceTemperature: apiData.avgTemp,
    discoveredBy: apiData.discoveredBy,
    discoveryDate: apiData.discoveryDate,
  };
  
  // Get game design data from centralized configuration
  const gameData = getGameData(name, 'Moon');
  
  // Determine rarity (use game data if available, otherwise calculate based on size)
  let rarity: Rarity = gameData?.rarity || 'Common';
  if (!gameData) {
    // Fallback: Calculate based on size for moons not in game data
    if (apiData.meanRadius && apiData.meanRadius > 1500) {
      rarity = 'Epic'; // Large moons like Titan, Ganymede
    } else if (apiData.meanRadius && apiData.meanRadius > 500) {
      rarity = 'Rare';
    }
  }
  
  const loot = gameData?.loot || [`${name} Dust`, 'Ice Crystals', 'Moon Rock'];
  
  const moon: Moon = {
    id: apiData.id,
    name: name,
    type: 'Moon',
    subtype: moonType,
    rarity: rarity,
    imageUrl: imageUrl,
    loot: loot,
    description: description || `${name}, a moon orbiting ${parentPlanetName}.`,
    facts: [],
    source: 'api',
    lastUpdated: new Date(),
    discovered: false,
    moonData: moonData,
  };
  
  return moon;
}
