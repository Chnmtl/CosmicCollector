export type CelestialObjectType = 'Star' | 'Planet' | 'Galaxy' | 'Exoplanet' | 'Nebula' | 'BlackHole';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface CelestialObject {
  id: string;
  name: string;
  type: CelestialObjectType;
  image: string;
  rarity: Rarity;
  xp: number;
  loot: string[];
  lore: string;
  stats: {
    size?: string;
    distance?: string;
    temperature?: string;
    mass?: string;
    age?: string;
    specialty?: string;
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