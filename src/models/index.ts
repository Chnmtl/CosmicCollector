/**
 * Central export point for all domain models
 */

// Base types
export * from './CosmicObject';

// Specific types
export * from './Planet';
export * from './Moon';
export * from './Star';
export * from './OtherObjects';

// Union type of all possible cosmic objects
import type { Planet } from './Planet';
import type { Moon } from './Moon';
import type { Star } from './Star';
import type { Galaxy, Nebula, BlackHole, Exoplanet } from './OtherObjects';

export type AnyCosmicObject = 
  | Planet 
  | Moon 
  | Star 
  | Galaxy 
  | Nebula 
  | BlackHole 
  | Exoplanet;
