import { CosmicObject } from './CosmicObject';

/**
 * Star-specific data structure
 */

// Formal Name (wikipedia page name)

export interface StarData {
  // Observational properties
  constellation?: string; // e.g., "Canis Major", "Orion"
  apparentMagnitude?: number; // How bright it appears from Earth (lower = brighter)
  absoluteMagnitude?: number; // Intrinsic brightness at 10 parsecs
  
  // Spectral classification
  spectralClass?: string; // e.g., "G2V", "M5V", "O9.5 Ia"
  
  // Physical properties
  distance?: number; // in light-years
  mass?: number; // in solar masses (M☉)
  radius?: number; // in solar radii (R☉)
  temperature?: number; // in Kelvin
  age?: number; // in years
  
  // Lifecycle stage 
  lifecycle?: string; // e.g., "Main Sequence", "Red Giant", "White Dwarf", "Supergiant"
}

/**
 * Complete Star interface
 * Combines base CosmicObject with star-specific astronomical data
 */
export interface Star extends CosmicObject {
  type: 'Star';
  subtype: string; // Used for lifecycle or special classification (flexible)
  starData: StarData;
}
