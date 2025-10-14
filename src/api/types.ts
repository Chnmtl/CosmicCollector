export interface SolarSystemPlanetResponse {
  id: string;
  name: string;
  englishName: string;
  isPlanet: boolean;
  moons: Array<{ moon: string; rel: string }> | null;
  semimajorAxis: number; // km
  perihelion: number; // km
  aphelion: number; // km
  eccentricity: number;
  inclination: number; // degrees
  mass: { massValue: number; massExponent: number };
  vol: { volValue: number; volExponent: number };
  density: number; // g/cm³
  gravity: number; // m/s²
  escape: number; // m/s
  meanRadius: number; // km
  equaRadius: number; // km
  polarRadius: number; // km
  flattening: number;
  dimension: string;
  sideralOrbit: number; // days
  sideralRotation: number; // hours
  aroundPlanet: { planet: string } | null;
  discoveredBy: string;
  discoveryDate: string;
  alternativeName: string;
  axialTilt: number; // degrees
  avgTemp: number; // Kelvin
  mainAnomaly: number; // degrees
  argPeriapsis: number; // degrees
  longAscNode: number; // degrees
}

export interface NASAImageResult {
  collection: {
    items: Array<{
      data: Array<{
        title: string;
        description: string;
        date_created: string;
        keywords?: string[];
      }>;
      links?: Array<{
        href: string;
        rel: string;
        render?: string;
      }>;
    }>;
  };
}

export interface WikipediaExtract {
  query?: {
    pages?: {
      [key: string]: {
        extract?: string;
      };
    };
  };
}

export interface ProcessedPlanetData {
  id: string;
  name: string;
  type: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xpReward: number;
  energyCost: number;
  discoveryChance: number;
  emoji: string;
  lore: string;
  loot: string[];
  image?: string;
  diameter?: number;
  moons?: number;
  moonNames?: string[];
  gravity?: number;
  distanceFromSun?: number;
  dayLength?: number;
  yearLength?: number;
  surfaceTemperature?: number;
  atmosphere?: string;
  density?: number;
  rings?: boolean;
  discoveredBy?: string;
  discoveryDate?: string;
}
