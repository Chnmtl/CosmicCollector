import { CosmicObject, CosmicObjectData } from './CosmicObject';

/**
 * Planet-specific data structure
 * Extends CosmicObject with planetary properties
 */

export type PlanetType = 'Rocky' | 'Gas Giant' | 'Ice Giant' | 'Dwarf Planet';

export interface PlanetData {
  // Physical properties (from API)
  diameter?: number; // in kilometers
  mass?: number; // in Earth masses
  density?: number; // in g/cm³
  gravity?: number; // in m/s²
  
  // Orbital properties
  distanceFromSun?: number; // in kilometers
  orbitalPeriod?: number; // in Earth days (year length)
  rotationPeriod?: number; // in hours (day length)
  
  // Environmental
  surfaceTemperature?: number; // in Kelvin (stored internally, displayed as Celsius)
  atmosphere?: string; // Composition description
  
  // Features
  moons?: number; // Count of moons
  moonNames?: string[]; // Names of moons
  rings: boolean; // Has ring system
  
  // Discovery info
  discoveredBy?: string;
  discoveryDate?: string;
}

/**
 * Complete Planet interface combining base object + planet-specific data
 */
export interface Planet extends CosmicObject {
  type: 'Planet';
  subtype: PlanetType; // More specific than optional string
  planetData: PlanetData;
}
