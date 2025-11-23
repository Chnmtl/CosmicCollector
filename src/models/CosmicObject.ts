/**
 * Base interface for all cosmic objects in the game.
 * Contains common properties shared by all celestial objects.
 */

export type CosmicObjectType = 
  | 'Star' 
  | 'Planet' 
  | 'Moon' 
  | 'Galaxy' 
  | 'Exoplanet' 
  | 'Nebula' 
  | 'BlackHole';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export type DataSource = 'api' | 'static' | 'hybrid';

/**
 * Core interface - all cosmic objects inherit from this
 */
export interface CosmicObject {
  // Identity
  id: string;
  name: string;
  type: CosmicObjectType;
  
  // Classification
  rarity: Rarity;
  subtype?: string; // "Gas Giant", "Red Supergiant", "Spiral Galaxy", etc.
  
  // Visual representation
  imageUrl?: string | number; // string for URI, number for require() result
  
  // Game mechanics (loot only - XP/energy/discoveryChance calculated from rarity)
  loot: string[];
  
  // Content
  description: string; // Main long-form description (from Wikipedia or curated)
  facts?: string[]; // Interesting facts array
  
  // Metadata
  source: DataSource; // Where this data came from
  lastUpdated?: Date; // When API data was last fetched
  
  // Discovery state (player-specific, managed separately in store)
  discovered: boolean;
  discoveredAt?: Date;
}

/**
 * Helper type: Cosmic object without player-specific state
 * Used for data layer (immutable catalog)
 */
export type CosmicObjectData = Omit<CosmicObject, 'discovered' | 'discoveredAt'>;

/**
 * Helper type: Only the discovery state
 * Used for storing player progress efficiently
 */
export interface DiscoveryRecord {
  objectId: string;
  discoveredAt: Date;
}

/**
 * Mission interface for game objectives
 */
export interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: {
    xp: number;
    loot?: string[];
  };
  completed: boolean;
  type: 'discover' | 'collect' | 'level';
  targetType?: CosmicObjectType;
}
