import { CosmicObject } from './CosmicObject';

/**
 * Other cosmic object types (to be expanded with future APIs)
 */

// ============================================================================
// GALAXY
// ============================================================================

export type GalaxyType = 'Spiral' | 'Elliptical' | 'Irregular' | 'Lenticular';

export interface GalaxyData {
  distanceFromEarth?: number; // in light years
  diameter?: number; // in light years
  numberOfStars?: number;
  constellation?: string;
  discoveredBy?: string;
  discoveryDate?: string;
}

export interface Galaxy extends CosmicObject {
  type: 'Galaxy';
  subtype: GalaxyType;
  galaxyData: GalaxyData;
}

// ============================================================================
// NEBULA
// ============================================================================

export type NebulaType = 'Emission' | 'Reflection' | 'Dark' | 'Planetary' | 'Supernova Remnant';

export interface NebulaData {
  distanceFromEarth?: number; // in light years
  size?: number; // in light years
  constellation?: string;
  composition?: string;
  discoveredBy?: string;
  discoveryDate?: string;
}

export interface Nebula extends CosmicObject {
  type: 'Nebula';
  subtype: NebulaType;
  nebulaData: NebulaData;
}

// ============================================================================
// BLACK HOLE
// ============================================================================

export type BlackHoleType = 'Stellar' | 'Supermassive' | 'Intermediate' | 'Primordial';

export interface BlackHoleData {
  mass?: number; // in solar masses
  distanceFromEarth?: number; // in light years
  constellation?: string;
  discoveredBy?: string;
  discoveryDate?: string;
}

export interface BlackHole extends CosmicObject {
  type: 'BlackHole';
  subtype: BlackHoleType;
  blackHoleData: BlackHoleData;
}

// ============================================================================
// EXOPLANET
// ============================================================================

export type ExoplanetType = 'Super-Earth' | 'Hot Jupiter' | 'Ice Giant' | 'Rocky' | 'Gas Dwarf';

export interface ExoplanetData {
  hostStarName?: string;
  distanceFromEarth?: number; // in light years
  mass?: number; // in Earth masses
  radius?: number; // in Earth radii
  orbitalPeriod?: number; // in days
  discoveredBy?: string;
  discoveryDate?: string;
  discoveryMethod?: string; // "Transit", "Radial Velocity", etc.
}

export interface Exoplanet extends CosmicObject {
  type: 'Exoplanet';
  subtype: ExoplanetType;
  exoplanetData: ExoplanetData;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isGalaxy(obj: CosmicObject): obj is Galaxy {
  return obj.type === 'Galaxy';
}

export function isNebula(obj: CosmicObject): obj is Nebula {
  return obj.type === 'Nebula';
}

export function isBlackHole(obj: CosmicObject): obj is BlackHole {
  return obj.type === 'BlackHole';
}

export function isExoplanet(obj: CosmicObject): obj is Exoplanet {
  return obj.type === 'Exoplanet';
}
