import { SolarSystemPlanetResponse } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_SOLAR_SYSTEM_API_KEY;

// Validate API key is available
if (!API_KEY) {
  throw new Error(
    'EXPO_PUBLIC_SOLAR_SYSTEM_API_KEY is not defined. ' +
    'Please create a .env file with your API key. ' +
    'See .env.example for reference.'
  );
}

/**
 * Solar System API HTTP Client
 * Responsibility: Make HTTP requests to Solar System API only
 * Single Responsibility Principle: Only handles HTTP communication
 */
export class SolarSystemClient {
  private readonly baseUrl = 'https://api.le-systeme-solaire.net/rest/bodies';
  private readonly apiKey = API_KEY;

  /**
   * Fetch all planets from the API
   * Returns the 8 main planets (Mercury through Neptune)
   * The API's isPlanet=true filter excludes dwarf planets automatically
   */
  async getPlanets(): Promise<SolarSystemPlanetResponse[]> {
    console.log('🌍 [SolarSystemClient] Fetching planets...');
    
    const response = await fetch(
      `${this.baseUrl}?filter[]=isPlanet,eq,true`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Solar System API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const planets = data.bodies || [];
    
    console.log(`✅ [SolarSystemClient] Received ${planets.length} planets`);
    return planets;
  }

  /**
   * Fetch moons filtered by valid planet IDs
   * Returns top 60 moons by size, only those orbiting the provided planets
   * 
   * @param validPlanetIds - Array of planet IDs to filter moons by
   * @returns Top 60 moons sorted by size (largest first)
   */
  async getMoons(validPlanetIds: string[]): Promise<SolarSystemPlanetResponse[]> {
    console.log('🌙 [SolarSystemClient] Fetching moons...');
    console.log(`   Valid planet IDs for filtering:`, validPlanetIds);
    
    const response = await fetch(
      `${this.baseUrl}?filter[]=bodyType,eq,Moon`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Solar System API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const allMoons = data.bodies || [];
    console.log(`   Received ${allMoons.length} total moons from API`);

    // Filter moons that orbit our valid planets
    const filteredMoons = allMoons.filter((moon: SolarSystemPlanetResponse) => {
      if (!moon.aroundPlanet?.planet) return false;

      // Extract planet ID from aroundPlanet field
      // API returns either just ID ("jupiter") or URL ending with ID
      const planetId = moon.aroundPlanet.planet.includes('/')
        ? moon.aroundPlanet.planet.split('/').pop() || ''
        : moon.aroundPlanet.planet;

      return validPlanetIds.includes(planetId);
    });

    console.log(`   Filtered to ${filteredMoons.length} moons of valid planets`);

    // Sort by size (largest first) and take top 60
    const topMoons = filteredMoons
      .filter((moon: SolarSystemPlanetResponse) => moon.meanRadius > 0)
      .sort((a: SolarSystemPlanetResponse, b: SolarSystemPlanetResponse) => 
        b.meanRadius - a.meanRadius
      )
      .slice(0, 60);

    console.log(`✅ [SolarSystemClient] Returning top ${topMoons.length} moons by size`);
    
    if (topMoons.length > 0) {
      console.log(
        `   Size range: ${topMoons[0].meanRadius}km (${topMoons[0].englishName}) to ` +
        `${topMoons[topMoons.length - 1].meanRadius}km (${topMoons[topMoons.length - 1].englishName})`
      );
    }

    return topMoons;
  }
}
