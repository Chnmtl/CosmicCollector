/**
 * Extracted Star Mapper
 * Transforms stars.json (from extractStars.js) into Star domain models
 * Pure function - no side effects, easy to test
 * 
 * This mapper handles the output from our star extraction pipeline:
 * star_full_data.json -> extractStars.js -> stars.json -> this mapper -> Star model
 */

import { Star, StarData } from '../../models/Star';
import { STAR_GAME_DATA } from '../../data/gameData';
import { getDefaultImageForType } from '../../utils/imageResolver';
import { Rarity } from '../../models/CosmicObject';

/**
 * Star data structure from stars.json (output of extractStars.js)
 */
export interface ExtractedStarData {
  name: string;
  baseName: string | null;
  designation: string | null;
  rarity: Rarity;
  constellation: string | null;
  url: string | null;
  properties: {
    constellation?: string;
    apparent_magnitude_v?: string;
    absolute_magnitude_mv?: string;
    evolutionary_stage?: string;
    spectral_type?: string;
    u_b_color_index?: string;
    b_v_color_index?: string;
    distance?: string;
    mass?: string;
    radius?: string;
    luminosity?: string;
    gravity_logg_cgs?: string;
    temperature?: string;
    age?: string;
    [key: string]: any; // Allow other properties
  };
  lore: string;
}

/**
 * Parse a numeric value with unit from a string
 * Examples:
 * - "40,000 K" -> 40000
 * - "25.3 ± 5.3 M☉" -> 25.3
 * - "2.24 - 2.26" -> 2.25 (average)
 * - "-6.23" -> -6.23
 */
function parseNumericValue(value: string | undefined): number | undefined {
  if (!value || typeof value !== 'string') return undefined;

  // Remove units and extra text
  const cleaned = value
    .replace(/[KLRMly☉⊙°pc\s]/g, '') // Remove common units and spaces
    .replace(/±.*$/, '') // Remove uncertainty
    .replace(/\([^)]*\)/, '') // Remove parentheses
    .trim();

  // Handle ranges (e.g., "2.24-2.26")
  if (cleaned.includes('-') && !cleaned.startsWith('-')) {
    const parts = cleaned.split('-').map(p => parseFloat(p));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return (parts[0] + parts[1]) / 2; // Return average
    }
  }

  // Handle commas in numbers (e.g., "40,000")
  const noCommas = cleaned.replace(/,/g, '');
  const num = parseFloat(noCommas);
  
  return isNaN(num) ? undefined : num;
}

/**
 * Parse distance in light-years from string
 * Examples: "1,080 ± 40 ly" -> 1080
 */
function parseDistance(distStr: string | undefined): number | undefined {
  if (!distStr) return undefined;
  return parseNumericValue(distStr);
}

/**
 * Parse mass in solar masses from string
 * Examples: "25.3 ± 5.3 M☉" -> 25.3
 */
function parseMass(massStr: string | undefined): number | undefined {
  if (!massStr) return undefined;
  return parseNumericValue(massStr);
}

/**
 * Parse radius in solar radii from string
 * Examples: "13.72 ± 0.49 R☉" -> 13.72
 */
function parseRadius(radiusStr: string | undefined): number | undefined {
  if (!radiusStr) return undefined;
  return parseNumericValue(radiusStr);
}

/**
 * Parse temperature in Kelvin from string
 * Examples: "40,000 K" -> 40000
 */
function parseTemperature(tempStr: string | undefined): number | undefined {
  if (!tempStr) return undefined;
  return parseNumericValue(tempStr);
}

/**
 * Parse age in years from string with unit conversion
 * Examples: "2.2 - 3.56 Myr" -> 2,890,000 years (average, converted from million years)
 */
function parseAge(ageStr: string | undefined): number | undefined {
  if (!ageStr) return undefined;

  const cleaned = ageStr.trim();
  
  // Extract numeric value
  const numericPart = cleaned.replace(/[a-zA-Z\s]/g, '');
  const num = parseNumericValue(numericPart);
  if (num === undefined) return undefined;

  // Convert based on unit
  if (/gyr/i.test(cleaned)) {
    return num * 1_000_000_000; // Billion years
  } else if (/myr/i.test(cleaned)) {
    return num * 1_000_000; // Million years
  } else if (/kyr/i.test(cleaned)) {
    return num * 1_000; // Thousand years
  }
  
  return num; // Already in years
}

/**
 * Parse apparent or absolute magnitude from string
 * Examples: "2.24 - 2.26" -> 2.25, "-6.23" -> -6.23
 */
function parseMagnitude(magStr: string | undefined): number | undefined {
  if (!magStr) return undefined;
  return parseNumericValue(magStr);
}

/**
 * Generate a human-readable description for a star
 */
function generateDescription(data: ExtractedStarData): string {
  const parts: string[] = [];
  const { name, constellation, properties } = data;
  const { spectral_type, evolutionary_stage, distance } = properties;

  // Intro
  if (constellation) {
    parts.push(`${name} is a ${evolutionary_stage || 'star'} located in the constellation ${constellation}.`);
  } else {
    parts.push(`${name} is a fascinating ${evolutionary_stage || 'star'}.`);
  }

  // Spectral class
  if (spectral_type) {
    parts.push(`With a spectral classification of ${spectral_type}, it exhibits distinctive stellar characteristics.`);
  }

  // Distance
  if (distance) {
    const distValue = parseDistance(distance);
    if (distValue && distValue > 1000) {
      parts.push(`Located approximately ${Math.round(distValue).toLocaleString()} light-years away, it shines as a beacon in the night sky.`);
    } else if (distValue) {
      parts.push(`At a distance of about ${Math.round(distValue)} light-years, it is relatively close to our solar system.`);
    }
  }

  return parts.join(' ');
}

/**
 * Generate interesting facts about the star
 */
function generateFacts(data: ExtractedStarData): string[] {
  const facts: string[] = [];
  const { properties } = data;

  // Temperature fact
  if (properties.temperature) {
    const temp = parseTemperature(properties.temperature);
    if (temp && temp > 30000) {
      facts.push(`🔥 Blazing hot with surface temperatures exceeding ${Math.round(temp / 1000)},000 K`);
    } else if (temp && temp > 10000) {
      facts.push(`🔥 Surface temperature of approximately ${Math.round(temp / 1000)}  ,000 K`);
    }
  }

  // Mass fact
  if (properties.mass) {
    const mass = parseMass(properties.mass);
    if (mass && mass > 20) {
      facts.push(`⭐ Massive star with over ${Math.floor(mass)} times the Sun's mass`);
    } else if (mass && mass > 10) {
      facts.push(`⭐ Heavy star at ${mass.toFixed(1)} solar masses`);
    }
  }

  // Radius fact
  if (properties.radius) {
    const radius = parseRadius(properties.radius);
    if (radius && radius > 100) {
      facts.push(`📏 Enormous size, over ${Math.floor(radius)} times larger than the Sun`);
    } else if (radius && radius > 10) {
      facts.push(`📏 Large radius of ${radius.toFixed(1)} solar radii`);
    }
  }

  // Age fact
  if (properties.age) {
    const ageValue = parseAge(properties.age);
    if (ageValue && ageValue < 10_000_000) {
      facts.push(`👶 Very young star, only ${(ageValue / 1_000_000).toFixed(1)} million years old`);
    } else if (ageValue && ageValue < 100_000_000) {
      facts.push(`🕰️ Young star at ${Math.floor(ageValue / 1_000_000)} million years`);
    }
  }

  // Magnitude fact
  if (properties.apparent_magnitude_v) {
    const appMag = parseMagnitude(properties.apparent_magnitude_v);
    if (appMag !== undefined && appMag < 2) {
      facts.push(`✨ One of the brightest stars visible from Earth`);
    }
  }

  return facts;
}

/**
 * Maps extracted star data (from stars.json) to Star domain model
 * Combines:
 * - Extracted astronomical data from Wikipedia
 * - Game design data (updated rarity, loot) from gameData.ts
 * 
 * @param extractedData - Star data from stars.json
 * @returns Complete Star domain model
 */
export function mapExtractedStar(extractedData: ExtractedStarData): Star {
  const { name, baseName, designation, constellation, url, properties, lore } = extractedData;

  // Get game data (may override rarity from extracted data)
  const gameData = STAR_GAME_DATA[baseName || name];
  
  // Use game data rarity if available, otherwise use extracted rarity
  const rarity = gameData?.rarity || extractedData.rarity;
  // Loot system will be added later
  const loot: string[] = gameData?.loot || [];

  // Build star-specific data
  const starData: StarData = {
    constellation: properties.constellation || constellation || undefined,
    apparentMagnitude: parseMagnitude(properties.apparent_magnitude_v),
    absoluteMagnitude: parseMagnitude(properties.absolute_magnitude_mv),
    spectralClass: properties.spectral_type,
    distance: parseDistance(properties.distance),
    mass: parseMass(properties.mass),
    radius: parseRadius(properties.radius),
    temperature: parseTemperature(properties.temperature),
    age: parseAge(properties.age),
    lifecycle: properties.evolutionary_stage,
  };

  // Generate ID (sanitize for use as identifier)
  const id = `star-${(baseName || name).toLowerCase().replace(/[^a-z0-9]/g, '-')}${designation ? `-${designation.toLowerCase()}` : ''}`;

  // Display name includes designation if present
  const displayName = designation ? `${name} ${designation}` : name;

  // Build complete star object
  const star: Star = {
    // Base cosmic object properties
    id,
    name: displayName,
    type: 'Star',
    subtype: starData.lifecycle || starData.spectralClass || 'Star',
    rarity,
    imageUrl: getDefaultImageForType('Star'),
    loot,
    description: lore || generateDescription(extractedData),
    facts: generateFacts(extractedData),
    source: 'static',
    lastUpdated: new Date(),
    discovered: false,

    // Star-specific data
    starData,
  };

  return star;
}
