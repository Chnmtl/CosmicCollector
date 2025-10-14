import { CelestialObject, CelestialObjectType, Rarity } from '../types';
import {
  RARITY_COLORS,
  RARITY_ACCENT_COLORS,
  TYPE_ICONS,
  TYPE_BACKGROUNDS,
  TYPE_PANEL_OVERLAY,
  CARD_TEXT_COLOR,
  FRONT_CARD_STATS,
} from './constants';

/**
 * Get rarity gradient colors for card border
 */
export const getRarityColors = (rarity: Rarity): [string, string] => {
  return RARITY_COLORS[rarity] || RARITY_COLORS.Common;
};

/**
 * Get rarity accent color for text/stats
 */
export const getRarityAccentColor = (rarity: Rarity): string => {
  return RARITY_ACCENT_COLORS[rarity] || RARITY_ACCENT_COLORS.Common;
};

/**
 * Get emoji icon for celestial object type
 */
export const getTypeIcon = (type: CelestialObjectType): string => {
  return TYPE_ICONS[type] || '✨';
};

/**
 * Get background color for celestial object type
 */
export const getTypeBackground = (type: CelestialObjectType): string => {
  return TYPE_BACKGROUNDS[type] || '#0f0f0f';
};

/**
 * Get panel overlay color for readability
 */
export const getTypePanelOverlay = (type: CelestialObjectType): string => {
  return TYPE_PANEL_OVERLAY[type] || 'rgba(255,255,255,0.14)';
};

/**
 * Get text color for cards (consistent light color)
 */
export const getCardTextColor = (type: CelestialObjectType): string => {
  return CARD_TEXT_COLOR;
};

/**
 * Format stats for display on card
 * Converts the flexible stats object into an array of key-value pairs
 */
export interface FormattedStat {
  key: string;
  value: string;
  displayKey: string;
}

export const formatStats = (object: CelestialObject): FormattedStat[] => {
  if (!object.stats) return [];

  return Object.entries(object.stats)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => ({
      key,
      // Special formatting for boolean and number types
      value: typeof value === 'boolean' 
        ? (value ? 'Yes' : 'No') 
        : String(value),
      displayKey: formatStatKey(key),
    }));
};

/**
 * Get stats for front card (key stats only - Pokemon style)
 */
export const getFrontCardStats = (object: CelestialObject): FormattedStat[] => {
  const allStats = formatStats(object);
  const priorityKeys = FRONT_CARD_STATS[object.type] || [];

  // Filter stats based on priority keys, preserve order
  const frontStats = priorityKeys
    .map((key) => allStats.find((stat) => stat.key === key))
    .filter((stat): stat is FormattedStat => stat !== undefined);

  // If we have fewer than 2 stats, just take the first 2 from all stats
  if (frontStats.length < 2) {
    return allStats.slice(0, 2);
  }

  // Return max 3 stats for front
  return frontStats.slice(0, 3);
};

/**
 * Get stats for back card (all remaining stats)
 */
export const getBackCardStats = (object: CelestialObject): FormattedStat[] => {
  const allStats = formatStats(object);
  const frontStats = getFrontCardStats(object);
  const frontKeys = new Set(frontStats.map((s) => s.key));

  // Return all stats not on front
  return allStats.filter((stat) => !frontKeys.has(stat.key));
};

/**
 * Format stat key for display (capitalize, add spaces)
 */
export const formatStatKey = (key: string): string => {
  return key
    .split(/(?=[A-Z])|_/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get description or lore (prefer description)
 */
export const getCardDescription = (object: CelestialObject): string => {
  return object.description || object.lore || 'A mysterious celestial object.';
};

/**
 * Get short flavor text (prefer lore for front card)
 */
export const getCardFlavorText = (object: CelestialObject): string => {
  // Use lore for short text, fallback to truncated description
  if (object.lore && object.lore.length <= 150) {
    return object.lore;
  }
  
  const text = object.lore || object.description || 'A mysterious celestial object.';
  
  // Truncate if too long
  if (text.length > 150) {
    return text.substring(0, 147) + '...';
  }
  
  return text;
};

/**
 * Filter celestial objects by type and rarity
 */
export const filterObjects = (
  objects: CelestialObject[],
  typeFilter: CelestialObjectType | 'All',
  rarityFilter: Rarity | 'All'
): CelestialObject[] => {
  return objects.filter((obj) => {
    const typeMatch = typeFilter === 'All' || obj.type === typeFilter;
    const rarityMatch = rarityFilter === 'All' || obj.rarity === rarityFilter;
    return typeMatch && rarityMatch;
  });
};

/**
 * Sort celestial objects
 */
export type SortOption = 'name' | 'rarity' | 'type' | 'date' | 'xp';
export type SortDirection = 'asc' | 'desc';

const RARITY_ORDER: Record<Rarity, number> = {
  Common: 0,
  Rare: 1,
  Epic: 2,
  Legendary: 3,
};

export const sortObjects = (
  objects: CelestialObject[],
  sortBy: SortOption,
  direction: SortDirection = 'asc'
): CelestialObject[] => {
  const sorted = [...objects].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'rarity':
        comparison = RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'date':
        const dateA = a.discoveredAt ? new Date(a.discoveredAt).getTime() : 0;
        const dateB = b.discoveredAt ? new Date(b.discoveredAt).getTime() : 0;
        comparison = dateA - dateB;
        break;
      case 'xp':
        comparison = a.xp - b.xp;
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

/**
 * Search celestial objects by name
 */
export const searchObjects = (
  objects: CelestialObject[],
  query: string
): CelestialObject[] => {
  if (!query.trim()) return objects;

  const lowerQuery = query.toLowerCase().trim();

  return objects.filter((obj) =>
    obj.name.toLowerCase().includes(lowerQuery) ||
    obj.type.toLowerCase().includes(lowerQuery) ||
    (obj.subtype && obj.subtype.toLowerCase().includes(lowerQuery))
  );
};
