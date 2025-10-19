import { CosmicObject, CosmicObjectType, Rarity } from '../models';
import { calculateXpReward } from './gameBalance';

/**
 * Calculate rarity statistics from discovered objects
 */
export interface RarityStats {
  Common: number;
  Rare: number;
  Epic: number;
  Legendary: number;
}

export const calculateRarityStats = (
  objects: CosmicObject[]
): RarityStats => {
  const stats: RarityStats = {
    Common: 0,
    Rare: 0,
    Epic: 0,
    Legendary: 0,
  };

  objects.forEach((obj) => {
    if (obj.rarity in stats) {
      stats[obj.rarity]++;
    }
  });

  return stats;
};

/**
 * Calculate type statistics from discovered objects
 */
export type TypeStats = Record<CosmicObjectType, number>;

export const calculateTypeStats = (
  objects: CosmicObject[]
): TypeStats => {
  const stats: TypeStats = {
    Star: 0,
    Planet: 0,
    Moon: 0,
    Galaxy: 0,
    Exoplanet: 0,
    Nebula: 0,
    BlackHole: 0,
  };

  objects.forEach((obj) => {
    if (obj.type in stats) {
      stats[obj.type as CosmicObjectType]++;
    }
  });

  return stats;
};

/**
 * Calculate collection completion percentage
 */
export const calculateCompletionPercentage = (
  discovered: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((discovered / total) * 100);
};

/**
 * Calculate type completion stats
 */
export interface TypeCompletion {
  type: CosmicObjectType;
  discovered: number;
  total: number;
  percentage: number;
}

export const calculateTypeCompletion = (
  discoveredObjects: CosmicObject[],
  allObjects: CosmicObject[]
): TypeCompletion[] => {
  const types: CosmicObjectType[] = [
    'Star',
    'Planet',
    'Moon',
    'Galaxy',
    'Exoplanet',
    'Nebula',
    'BlackHole',
  ];

  return types.map((type) => {
    const discovered = discoveredObjects.filter((obj) => obj.type === type).length;
    const total = allObjects.filter((obj) => obj.type === type).length;
    const percentage = calculateCompletionPercentage(discovered, total);

    return {
      type,
      discovered,
      total,
      percentage,
    };
  });
};

/**
 * Calculate rarity completion stats
 */
export interface RarityCompletion {
  rarity: Rarity;
  discovered: number;
  total: number;
  percentage: number;
}

export const calculateRarityCompletion = (
  discoveredObjects: CosmicObject[],
  allObjects: CosmicObject[]
): RarityCompletion[] => {
  const rarities: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary'];

  return rarities.map((rarity) => {
    const discovered = discoveredObjects.filter((obj) => obj.rarity === rarity).length;
    const total = allObjects.filter((obj) => obj.rarity === rarity).length;
    const percentage = calculateCompletionPercentage(discovered, total);

    return {
      rarity,
      discovered,
      total,
      percentage,
    };
  });
};

/**
 * Calculate total XP earned from discovered objects
 */
export const calculateTotalXP = (objects: CosmicObject[]): number => {
  return objects.reduce((total, obj) => total + calculateXpReward(obj.rarity), 0);
};

/**
 * Get most recent discoveries (sorted by discovery date)
 */
export const getRecentDiscoveries = (
  objects: CosmicObject[],
  limit: number = 5
): CosmicObject[] => {
  return [...objects]
    .filter((obj) => obj.discoveredAt)
    .sort((a, b) => {
      const dateA = a.discoveredAt ? new Date(a.discoveredAt).getTime() : 0;
      const dateB = b.discoveredAt ? new Date(b.discoveredAt).getTime() : 0;
      return dateB - dateA; // Newest first
    })
    .slice(0, limit);
};

/**
 * Get rarest discovered objects
 */
const RARITY_VALUE: Record<Rarity, number> = {
  Common: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
};

export const getRarestDiscoveries = (
  objects: CosmicObject[],
  limit: number = 5
): CosmicObject[] => {
  return [...objects]
    .sort((a, b) => RARITY_VALUE[b.rarity] - RARITY_VALUE[a.rarity])
    .slice(0, limit);
};
