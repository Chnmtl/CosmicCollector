/**
 * Game Data Configuration
 * Defines game-specific properties for cosmic objects
 * This is the source of truth for all game balance and design decisions
 * 
 * Real scientific data comes from APIs, game design data comes from here.
 * 
 * Note: XP rewards, energy costs, and discovery chances are calculated
 * from rarity using utility functions in utils/gameBalance.ts
 */

import { Rarity } from '../models/CosmicObject';

// ============================================================================
// PLANET GAME DATA
// ============================================================================

export interface PlanetGameData {
  rarity: Rarity;
  loot: string[];
  specialAbility?: string;
}

export const PLANET_GAME_DATA: Record<string, PlanetGameData> = {
  Mercury: {
    rarity: 'Common',
    loot: ['Mercury Core', 'Solar Wind Particles', 'Cratered Rock'],
  },
  Venus: {
    rarity: 'Rare',
    loot: ['Sulfuric Acid Clouds', 'Volcanic Rock', 'Greenhouse Gases'],
  },
  Earth: {
    rarity: 'Rare',
    loot: ['Water', 'Organic Matter', 'Rare Earth Elements', 'Life Forms'],
    specialAbility: 'Increases XP gain by 10% for 1 hour',
  },
  Mars: {
    rarity: 'Common',
    loot: ['Iron Oxide', 'Martian Soil', 'Polar Ice', 'Ancient Water'],
  },
  Jupiter: {
    rarity: 'Legendary',
    loot: ['Hydrogen Gas', 'Great Red Spot Matter', 'Jovian Moons', 'Magnetic Field Energy'],
    specialAbility: 'Doubles loot drops for next 3 discoveries',
  },
  Saturn: {
    rarity: 'Epic',
    loot: ['Ring Particles', 'Titan Methane', 'Icy Moons', 'Hydrogen Helium Mix'],
    specialAbility: 'Grants random rare loot',
  },
  Uranus: {
    rarity: 'Rare',
    loot: ['Methane Ice', 'Tilted Magnetic Field', 'Blue-Green Crystals', 'Icy Moons'],
  },
  Neptune: {
    rarity: 'Epic',
    loot: ['Dark Spot Energy', 'Supersonic Winds', 'Methane Clouds', 'Triton Ice'],
  },
};

// ============================================================================
// MOON GAME DATA
// ============================================================================

export interface MoonGameData {
  rarity: Rarity;
  loot: string[];
}

export const MOON_GAME_DATA: Record<string, MoonGameData> = {
  Moon: {
    rarity: 'Common',
    loot: ['Lunar Regolith', 'Moon Rocks', 'Helium-3'],
  },
  Io: {
    rarity: 'Epic',
    loot: ['Volcanic Sulfur', 'Tidal Heat', 'Plasma Torus'],
  },
  Europa: {
    rarity: 'Legendary',
    loot: ['Subsurface Ocean', 'Ice Crystals', 'Potential Life'],
  },
  Ganymede: {
    rarity: 'Epic',
    loot: ['Magnetosphere Data', 'Ice Water', 'Ancient Surface'],
  },
  Callisto: {
    rarity: 'Rare',
    loot: ['Ancient Craters', 'Ice Rock Mix', 'Subsurface Ocean'],
  },
  Titan: {
    rarity: 'Legendary',
    loot: ['Methane Lakes', 'Organic Molecules', 'Thick Atmosphere'],
  },
  Enceladus: {
    rarity: 'Epic',
    loot: ['Water Geysers', 'Organic Compounds', 'Icy Plumes'],
  },
  Triton: {
    rarity: 'Rare',
    loot: ['Nitrogen Geysers', 'Retrograde Orbit', 'Frozen Nitrogen'],
  },
};

// ============================================================================
// STAR GAME DATA
// ============================================================================
// Note: Stars are loaded from stars.json which already contains rarity
// This configuration is optional and can override/extend the static data
// For now, we use empty loot arrays - loot system will be added later

export interface StarGameData {
  rarity: Rarity;
  loot: string[];
}

export const STAR_GAME_DATA: Record<string, StarGameData> = {
  // Stars use rarity from stars.json by default
  // Add entries here only if you want to override rarity or add custom loot
  // Example:
  // 'Sirius': {
  //   rarity: 'Legendary',
  //   loot: [],
  // },
};

// ============================================================================
// GALAXY GAME DATA
// ============================================================================

export interface GalaxyGameData {
  rarity: Rarity;
  loot: string[];
}

export const GALAXY_GAME_DATA: Record<string, GalaxyGameData> = {
  'Milky Way': {
    rarity: 'Epic',
    loot: ['Spiral Arm Dust', 'Black Hole Data', 'Stellar Nursery'],
  },
  Andromeda: {
    rarity: 'Legendary',
    loot: ['Galaxy Collision Data', 'Dark Matter', 'Trillion Stars'],
  },
  Triangulum: {
    rarity: 'Epic',
    loot: ['Spiral Galaxy Data', 'Star Formation', 'Cosmic Gas'],
  },
  'Whirlpool Galaxy': {
    rarity: 'Legendary',
    loot: ['Perfect Spiral', 'Interacting Galaxies', 'Starburst Regions'],
  },
};

// ============================================================================
// NEBULA GAME DATA
// ============================================================================

export interface NebulaGameData {
  rarity: Rarity;
  loot: string[];
}

export const NEBULA_GAME_DATA: Record<string, NebulaGameData> = {
  'Orion Nebula': {
    rarity: 'Epic',
    loot: ['Star Formation Dust', 'Protoplanetary Disk', 'Cosmic Gas'],
  },
  'Crab Nebula': {
    rarity: 'Legendary',
    loot: ['Supernova Remnant', 'Pulsar Energy', 'Neutron Star Data'],
  },
  'Eagle Nebula': {
    rarity: 'Epic',
    loot: ['Pillars of Creation', 'Stellar Nursery', 'Cosmic Dust'],
  },
  'Ring Nebula': {
    rarity: 'Rare',
    loot: ['Planetary Nebula', 'White Dwarf Core', 'Ionized Gas'],
  },
};

// ============================================================================
// BLACK HOLE GAME DATA
// ============================================================================

export interface BlackHoleGameData {
  rarity: Rarity;
  loot: string[];
}

export const BLACK_HOLE_GAME_DATA: Record<string, BlackHoleGameData> = {
  'Sagittarius A*': {
    rarity: 'Legendary',
    loot: ['Event Horizon Data', 'Hawking Radiation', 'Galactic Center'],
  },
  'M87*': {
    rarity: 'Legendary',
    loot: ['First Image Data', 'Supermassive Core', 'Relativistic Jet'],
  },
  'Cygnus X-1': {
    rarity: 'Epic',
    loot: ['Stellar Black Hole', 'X-Ray Emissions', 'Accretion Disk'],
  },
};

// ============================================================================
// EXOPLANET GAME DATA
// ============================================================================

export interface ExoplanetGameData {
  rarity: Rarity;
  loot: string[];
}

export const EXOPLANET_GAME_DATA: Record<string, ExoplanetGameData> = {
  'Kepler-186f': {
    rarity: 'Legendary',
    loot: ['Earth-Size Planet', 'Habitable Zone', 'Rocky Surface'],
  },
  'TRAPPIST-1e': {
    rarity: 'Legendary',
    loot: ['Seven Planet System', 'Potentially Habitable', 'Rocky World'],
  },
  'Proxima Centauri b': {
    rarity: 'Epic',
    loot: ['Nearest Exoplanet', 'Red Dwarf Orbit', 'Rocky Composition'],
  },
  'HD 189733 b': {
    rarity: 'Rare',
    loot: ['Blue Planet', 'Glass Rain', 'Hot Jupiter'],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get game data for any cosmic object by name and type
 */
export function getGameData(
  name: string,
  type: 'Planet' | 'Moon' | 'Star' | 'Galaxy' | 'Nebula' | 'BlackHole' | 'Exoplanet'
): PlanetGameData | MoonGameData | StarGameData | GalaxyGameData | NebulaGameData | BlackHoleGameData | ExoplanetGameData | null {
  switch (type) {
    case 'Planet':
      return PLANET_GAME_DATA[name] || null;
    case 'Moon':
      return MOON_GAME_DATA[name] || null;
    case 'Star':
      return STAR_GAME_DATA[name] || null;
    case 'Galaxy':
      return GALAXY_GAME_DATA[name] || null;
    case 'Nebula':
      return NEBULA_GAME_DATA[name] || null;
    case 'BlackHole':
      return BLACK_HOLE_GAME_DATA[name] || null;
    case 'Exoplanet':
      return EXOPLANET_GAME_DATA[name] || null;
    default:
      return null;
  }
}
