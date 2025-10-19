/**
 * Card Helper Utilities
 * 
 * Provides helper functions for card UI components including:
 * - Color schemes (rarity colors, type backgrounds)
 * - Icons and visual elements
 * - Filtering and sorting cosmic objects
 * - Search functionality
 */

import { CosmicObject, CosmicObjectType, Rarity } from '../models';
import {
  RARITY_COLORS,
  RARITY_ACCENT_COLORS,
  TYPE_ICONS,
  TYPE_BACKGROUNDS,
  TYPE_PANEL_OVERLAY,
  CARD_TEXT_COLOR,
} from './constants';

// ============================================================================
// Visual Helper Functions
// ============================================================================

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
 * Get emoji icon for cosmic object type
 */
export const getTypeIcon = (type: CosmicObjectType): string => {
  return TYPE_ICONS[type] || '✨';
};

/**
 * Get background color for a cosmic object type
 */
export const getTypeBackground = (type: CosmicObjectType): string => {
  return TYPE_BACKGROUNDS[type] || '#0f0f0f';
};

/**
 * Get panel overlay color for readability
 */
export const getTypePanelOverlay = (type: CosmicObjectType): string => {
  return TYPE_PANEL_OVERLAY[type] || 'rgba(255,255,255,0.14)';
};

/**
 * Get text color for cards (consistent light color)
 */
export const getCardTextColor = (type: CosmicObjectType): string => {
  return CARD_TEXT_COLOR;
};

// ============================================================================
// Data Manipulation Functions
// ============================================================================

/**
 * Filter cosmic objects by type and rarity
 */
export const filterObjects = (
  objects: CosmicObject[],
  typeFilter: CosmicObjectType | 'All',
  rarityFilter: Rarity | 'All'
): CosmicObject[] => {
  return objects.filter((obj) => {
    const typeMatch = typeFilter === 'All' || obj.type === typeFilter;
    const rarityMatch = rarityFilter === 'All' || obj.rarity === rarityFilter;
    return typeMatch && rarityMatch;
  });
};

/**
 * Sort cosmic objects
 */
export type SortOption = 'name' | 'rarity' | 'type' | 'date';
export type SortDirection = 'asc' | 'desc';

const RARITY_ORDER: Record<Rarity, number> = {
  Common: 0,
  Rare: 1,
  Epic: 2,
  Legendary: 3,
};

export const sortObjects = (
  objects: CosmicObject[],
  sortBy: SortOption,
  direction: SortDirection = 'asc'
): CosmicObject[] => {
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
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

/**
 * Search cosmic objects by name
 */
export const searchObjects = (
  objects: CosmicObject[],
  query: string
): CosmicObject[] => {
  if (!query.trim()) return objects;

  const lowerQuery = query.toLowerCase().trim();

  return objects.filter((obj) =>
    obj.name.toLowerCase().includes(lowerQuery) ||
    obj.type.toLowerCase().includes(lowerQuery) ||
    (obj.subtype && obj.subtype.toLowerCase().includes(lowerQuery))
  );
};
