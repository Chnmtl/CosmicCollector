import { CosmicObject } from './CosmicObject';

/**
 * Moon-specific data structure
 */

export type MoonType = 'Regular' | 'Irregular' | 'Captured Asteroid';

export interface MoonData {
  // Parent relationship
  parentPlanetId: string;
  parentPlanetName: string;
  
  // Physical properties
  diameter?: number; // in kilometers
  mass?: number; // in Earth's moon masses
  density?: number; // in g/cm³
  gravity?: number; // in m/s²
  
  // Orbital properties
  orbitalPeriod?: number; // in Earth days
  distanceFromPlanet?: number; // in kilometers
  
  // Surface
  surfaceType?: string; // "Icy", "Rocky", "Volcanic", etc.
  surfaceTemperature?: number; // in Kelvin
  atmosphere?: string;
  
  // Discovery
  discoveredBy?: string;
  discoveryDate?: string;
}

/**
 * Complete Moon interface
 */
export interface Moon extends CosmicObject {
  type: 'Moon';
  subtype: MoonType;
  moonData: MoonData;
}

/**
 * Type guard
 */
export function isMoon(obj: CosmicObject): obj is Moon {
  return obj.type === 'Moon';
}
