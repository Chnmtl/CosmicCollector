/**
 * Game Balance Utilities
 * Calculates game values based on rarity and other properties
 */

import { Rarity } from '../models/CosmicObject';

/**
 * Calculate XP reward based on rarity
 */
export function calculateXpReward(rarity: Rarity): number {
  const XP_MAP: Record<Rarity, number> = {
    Common: 10,
    Rare: 25,
    Epic: 50,
    Legendary: 100,
  };
  return XP_MAP[rarity];
}

/**
 * Calculate energy cost for exploration
 * Currently all explorations cost 1 energy
 */
export function calculateEnergyCost(): number {
  return 1; // Fixed cost for all explorations
}

/**
 * Calculate discovery chance based on rarity
 * Lower rarity = higher chance
 */
export function calculateDiscoveryChance(rarity: Rarity): number {
  const CHANCE_MAP: Record<Rarity, number> = {
    Common: 0.40,    // 40% chance
    Rare: 0.25,      // 25% chance
    Epic: 0.10,      // 10% chance
    Legendary: 0.02, // 2% chance
  };
  return CHANCE_MAP[rarity];
}
