export type CelestialObjectType = 'Star' | 'Planet' | 'Galaxy' | 'Exoplanet' | 'Nebula' | 'BlackHole' | 'Moon';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface CelestialObject {
  id: string;
  name: string;
  type: CelestialObjectType;
  // legacy emoji/icon or small local asset key. Prefer `image_url` for remote images.
  image: string;
  // Remote image URL (photograph or illustration). Matches common API fields.
  image_url?: string;
  // short typed subtype (e.g. "Red Supergiant", "Gas Giant", "Super-Earth")
  subtype?: string;
  // human readable description (long form). Replaces/augments `lore`.
  description?: string;
  rarity: Rarity;
  xp: number;
  loot: string[];
  // legacy short flavor text (kept for backward compatibility)
  lore: string;
  // API-friendly top-level numeric fields for easy filtering / sorting
  distance_ly?: number | null; // distance in light years when applicable
  mass_solar?: number | null; // mass in solar masses when applicable
  radius_solar?: number | null; // radius in solar radii when applicable
  temperature_k?: number | null; // temperature in Kelvin
  discovered_by?: string | null;
  constellation?: string | null;
  facts?: string[];
  source?: string;
  // keep a flexible stats object for UI/legacy values (strings with units)
  stats: {
    size?: string;
    distance?: string;
    temperature?: string;
    mass?: string;
    age?: string;
    specialty?: string;
    orbit?: string;
    hostStar?: string;
    // Planet-specific stats (from API data)
    type?: string; // Rocky, Gas Giant, Ice Giant
    diameter?: string; // Planet diameter in km
    moons?: number; // Number of moons
    moonNames?: string[]; // Names of all moons
    gravity?: string; // Surface gravity in m/s²
    distanceFromSun?: string; // Distance from sun in million km
    dayLength?: string; // Length of one day (hours or days)
    yearLength?: string; // Orbital period in days
    surfaceTemperature?: string; // Average surface temperature
    atmosphere?: string; // Atmospheric composition
    density?: string; // Density in g/cm³
    rings?: boolean; // Whether the planet has rings
    discoveredBy?: string; // Who discovered it
    discoveryDate?: string; // When it was discovered
  };
  discovered: boolean;
  discoveredAt?: Date;
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  energy: number;
  maxEnergy: number;
  lastEnergyRefill: Date;
  totalDiscovered: number;
  discoveredByType: Record<CelestialObjectType, number>;
}

export interface GameState {
  userProgress: UserProgress;
  discoveredObjects: CelestialObject[];
  availableObjects: CelestialObject[];
  isExploring: boolean;
  lastExploreTime: Date | null;
}

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
  targetType?: CelestialObjectType;
}