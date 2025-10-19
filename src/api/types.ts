/**
 * Solar System API Response Type
 * Contains only the fields we actually use from the API
 */
export interface SolarSystemPlanetResponse {
  id: string;
  englishName: string;
  moons: Array<{ moon: string; rel: string }> | null;
  semimajorAxis: number; // km - distance from sun
  mass: { massValue: number; massExponent: number };
  density: number; // g/cm³
  gravity: number; // m/s²
  meanRadius: number; // km
  sideralOrbit: number; // days - orbital period
  sideralRotation: number; // hours - rotation period
  avgTemp: number; // Kelvin
  discoveredBy: string;
  discoveryDate: string;
  // Optional for moons
  eccentricity?: number; // for determining moon type (regular vs irregular)
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
        missing?: any;
      };
    };
    search?: Array<{
      title: string;
      snippet?: string;
    }>;
  };
}

export interface WikipediaImageResponse {
  title: string;
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  extract?: string;
}
