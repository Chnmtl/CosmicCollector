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
 * Responsibility: Make HTTP requests to Solar System API
 */
export class SolarSystemClient {
  private readonly baseUrl = 'https://api.le-systeme-solaire.net/rest/bodies';
  private readonly apiKey = API_KEY;

  /**
   * Fetch all planets from the API
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
   * Fetch moons filtered by valid planet IDs (server-side only)
   * Uses multiple `filter[]` + `satisfy=any` to ask the API for moons that orbit
   * any of the provided planet IDs. Returns top 60 by `meanRadius`.
   *
   * Minimal defensive checks: empty-array early return + ID normalization.
   *
   * @param validPlanetIds - Array of planet IDs to filter moons by (API ids like "jupiter")
   * @returns Top 60 moons sorted by size (largest first)
   */
  async getMoons(validPlanetIds: string[]): Promise<SolarSystemPlanetResponse[]> {
    console.log('🌙 [SolarSystemClient] Fetching moons...');

    // Minimal defensive checks
    if (!Array.isArray(validPlanetIds) || validPlanetIds.length === 0) {
      console.log('   No validPlanetIds provided — returning empty array');
      return [];
    }

    const ids = validPlanetIds.map(id => String(id).trim().toLowerCase()).filter(Boolean);

    // Build server-side filter query: bodyType=Moon + multiple aroundPlanet.planet filters + satisfy=any
    const filters = [
      'filter[]=bodyType,eq,Moon',
      ...ids.map(id => `filter[]=aroundPlanet.planet,eq,${encodeURIComponent(id)}`),
      'satisfy=any',
    ];
    const url = `${this.baseUrl}?${filters.join('&')}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Solar System API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const moons = Array.isArray(data.bodies) ? data.bodies : [];
    console.log(`   Server-filtered: received ${moons.length} moons for ${ids.join(',')}`);

    const validMoons = moons
      .filter((m: SolarSystemPlanetResponse) => m && m.id && Number.isFinite(m.meanRadius) && m.meanRadius > 0)
      .map((m: SolarSystemPlanetResponse) => ({ ...m, id: String(m.id) }));

    // Dedupe by id (keep the largest if duplicates occur)
    const seen = new Map<string, SolarSystemPlanetResponse>();
    for (const m of validMoons) {
      const existing = seen.get(m.id);
      if (!existing || (m.meanRadius || 0) > (existing.meanRadius || 0)) seen.set(m.id, m);
    }

    const result = Array.from(seen.values())
      .sort((a, b) => (b.meanRadius || 0) - (a.meanRadius || 0))
      .slice(0, 60);

    console.log(`✅ [SolarSystemClient] Returning top ${result.length} moons by size (server-filtered)`);
    if (result.length > 0) {
      console.log(
        `   Size range: ${result[0].meanRadius}km (${result[0].englishName}) to ` +
        `${result[result.length - 1].meanRadius}km (${result[result.length - 1].englishName})`
      );
    }

    return result;
  }
}
