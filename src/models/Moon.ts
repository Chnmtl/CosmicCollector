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
  mass?: number; // in kilograms (kg)
  density?: number; // in g/cm³
  gravity?: number; // in m/s²
  
  // Orbital properties
  orbitalPeriod?: number; // in Earth days
  distanceFromPlanet?: number; // in kilometers
  eccentricity?: number; // orbital shape: 0=circle, 1=parabola (used for moon type classification)
  inclination?: number; // orbital tilt in degrees (used for moon type classification)
  
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
