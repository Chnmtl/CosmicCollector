/**
 * Solar System API Response Type
 * Contains only the fields we actually use from the API
 */
export interface SolarSystemPlanetResponse {
  id: string;
  englishName: string;
  moons: Array<{ moon: string; rel: string }> | null;
  semimajorAxis: number; // km - distance from sun/planet
  mass: { massValue: number; massExponent: number };
  density: number; // g/cm³
  gravity: number; // m/s²
  meanRadius: number; // km
  sideralOrbit: number; // days - orbital period
  sideralRotation: number; // hours - rotation period
  avgTemp: number; // Kelvin
  discoveredBy: string;
  discoveryDate: string;
  // Moon-specific fields
  eccentricity?: number; // orbital shape (for moon type classification)
  inclination?: number; // orbital tilt in degrees (for moon type classification)
  aroundPlanet?: { planet: string; rel: string }; // parent planet for moons
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
