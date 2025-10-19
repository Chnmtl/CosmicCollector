import { CosmicObject } from './CosmicObject';

/**
 * Star-specific data structure
 * To be populated from future star API integration
 */

export type StarType = 
  | 'Main Sequence' 
  | 'Red Giant' 
  | 'White Dwarf' 
  | 'Neutron Star' 
  | 'Red Supergiant'
  | 'Blue Supergiant';

export interface StarData {
  // Physical properties
  luminosity?: number; // in solar luminosities
  temperature?: number; // in Kelvin
  mass?: number; // in solar masses
  radius?: number; // in solar radii
  age?: number; // in billions of years
  
  // Position
  constellation?: string;
  distanceFromEarth?: number; // in light years
  
  // Spectral classification
  spectralClass?: string; // "G2V", "M1V", etc.
  
  // Discovery
  discoveredBy?: string;
  discoveryDate?: string;
}

/**
 * Complete Star interface
 */
export interface Star extends CosmicObject {
  type: 'Star';
  subtype: StarType;
  starData: StarData;
}

/**
 * Type guard
 */
export function isStar(obj: CosmicObject): obj is Star {
  return obj.type === 'Star';
}
