import { CelestialObjectType, Rarity } from '../types';

/**
 * Visual constants for celestial objects and cards
 */

// Rarity color gradients for card borders
export const RARITY_COLORS: Record<Rarity, [string, string]> = {
  Common: ['#66bb6a', '#388e3c'],
  Rare: ['#4fc3f7', '#0288d1'],
  Epic: ['#ba68c8', '#7b1fa2'],
  Legendary: ['#ffb74d', '#ef6c00'],
};

// Rarity accent colors (for stats, text highlights)
export const RARITY_ACCENT_COLORS: Record<Rarity, string> = {
  Common: '#4CAF50',
  Rare: '#2196F3',
  Epic: '#9C27B0',
  Legendary: '#FF9800',
};

// Type emoji icons
export const TYPE_ICONS: Record<CelestialObjectType, string> = {
  Star: '⭐',
  Planet: '🪐',
  Moon: '🌕',
  Galaxy: '🌌',
  Exoplanet: '🌎',
  Nebula: '☁️',
  BlackHole: '⚫',
};

// Type background colors (darker themed for contrast)
export const TYPE_BACKGROUNDS: Record<CelestialObjectType, string> = {
  Star: '#2f2a00',       // darker yellow-brown
  Planet: '#002f4f',     // darker blue
  Moon: '#2b2b2b',       // darker gray
  Galaxy: '#2f003f',     // darker purple
  Exoplanet: '#00331f',  // darker green
  Nebula: '#3f0016',     // darker maroon
  BlackHole: '#000000',  // true black
};

// Translucent panel colors for readability over type backgrounds
export const TYPE_PANEL_OVERLAY: Record<CelestialObjectType, string> = {
  Star: 'rgba(255,255,255,0.14)',
  Planet: 'rgba(255,255,255,0.14)',
  Moon: 'rgba(255,255,255,0.14)',
  Galaxy: 'rgba(255,255,255,0.14)',
  Exoplanet: 'rgba(255,255,255,0.14)',
  Nebula: 'rgba(255,255,255,0.14)',
  BlackHole: 'rgba(255,255,255,0.06)', // lighter for black hole
};

// Text color for cards (always light for dark backgrounds)
export const CARD_TEXT_COLOR = '#ffffff';

// Stats to show on front card (Pokemon-style: key stats only)
// Maps celestial type to the stat keys that should appear on front
export const FRONT_CARD_STATS: Record<CelestialObjectType, string[]> = {
  Star: ['distance', 'temperature', 'mass'],
  // Planets show their API-fetched stats on front (type, diameter, moons)
  // If those don't exist, fallback to legacy stats (distance, size, temperature)
  Planet: ['type', 'diameter', 'moons', 'surfaceTemperature', 'distance', 'size', 'temperature'],
  Moon: ['distance', 'size', 'temperature'],
  Galaxy: ['distance', 'size', 'mass'],
  Exoplanet: ['distance', 'size', 'temperature'],
  Nebula: ['distance', 'size', 'temperature'],
  BlackHole: ['distance', 'mass', 'specialty'],
};

// Card dimensions
export const CARD_DIMENSIONS = {
  COMPACT: {
    width: 150,
    height: 200,
  },
  FULL: {
    width: 320,
    height: 480,
  },
};

// Animation durations (in ms)
export const ANIMATION_DURATION = {
  FLIP: 400,
  ENTRANCE: 300,
  STAGGER: 50,
  SPRING: {
    damping: 15,
    stiffness: 150,
  },
};

// Grid layout
export const GRID_CONFIG = {
  CARD_TARGET_WIDTH: 220,  // Target width for responsive columns
  MAX_COLUMNS: 6,
  MIN_COLUMNS: 2,
  HORIZONTAL_PADDING: 40,
};

// Filter options
export const FILTER_OPTIONS: Array<CelestialObjectType | 'All'> = [
  'All',
  'Star',
  'Planet',
  'Moon',
  'Galaxy',
  'Exoplanet',
  'Nebula',
  'BlackHole',
];

export const RARITY_OPTIONS: Array<Rarity | 'All'> = [
  'All',
  'Common',
  'Rare',
  'Epic',
  'Legendary',
];
