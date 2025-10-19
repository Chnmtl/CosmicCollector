import { SolarSystemPlanetResponse } from './types';
import { mapApiToPlanet } from '../services/apiMapper';
import { Planet } from '../models/Planet';

const API_BASE_URL = 'https://api.le-systeme-solaire.net/rest/bodies';
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
 * The 8 main planets in our solar system
 * Used to filter API results to only include these planets
 */
const PLANET_NAMES = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
];

// Cache for moon name lookups
let moonNameCache: Record<string, string> | null = null;

async function fetchAllMoonNames(): Promise<Record<string, string>> {
  if (moonNameCache) {
    // console.log('🌙 [Moon Names] Using cached moon names');
    return moonNameCache;
  }

  try {
    // console.log('🌙 [Moon Names] Fetching all moon names from API...');
    
    const response = await fetch(
      `${API_BASE_URL}?filter[]=bodyType,eq,Moon&data=id,englishName`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch moon names: ${response.status}`);
    }

    const data = await response.json();
    const moons = data.bodies || [];

    // Build lookup map: moon id -> English name
    const moonMap: Record<string, string> = {};
    moons.forEach((moon: { id: string; englishName: string }) => {
      moonMap[moon.id] = moon.englishName;
    });

    // console.log(`🌙 [Moon Names] Successfully fetched ${moons.length} moon names`);
    // console.log('🌙 [Moon Names] Sample mappings:', {
    //   lune: moonMap.lune,
    //   io: moonMap.io,
    //   europe: moonMap.europe,
    //   titan: moonMap.titan,
    // });

    moonNameCache = moonMap;
    return moonMap;
  } catch (error) {
    console.error('Failed to fetch moon names:', error);
    // Return empty map on error - we'll fall back to French names
    return {};
  }
}

/**
 * Fetch planetary data from Solar System API and convert to Planet models
 * @returns Array of Planet objects using new model structure
 */
export async function fetchPlanetaryData(): Promise<Planet[]> {
  try {
    console.log('🌍 [Solar System API] Starting fetch from:', API_BASE_URL);
    
    // Fetch moon names first
    const moonNameMap = await fetchAllMoonNames();
    
    const response = await fetch(`${API_BASE_URL}?filter[]=isPlanet,eq,true`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('🌍 [Solar System API] Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Solar System API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const planets: SolarSystemPlanetResponse[] = data.bodies || [];

    console.log(`🌍 [Solar System API] Received ${planets.length} total bodies from API`);

    // Filter and process only the 8 main planets
    const filteredPlanets = planets.filter((planet) => PLANET_NAMES.includes(planet.englishName));
    console.log(`🌍 [Solar System API] Filtered to ${filteredPlanets.length} main planets:`, 
      filteredPlanets.map(p => p.englishName));

    // Use new mapper to convert API data to Planet models
    const planetModels: Planet[] = filteredPlanets.map((apiPlanet) => {
      return mapApiToPlanet(apiPlanet, moonNameMap, undefined, undefined);
    });
    
    console.log(`✅ [Solar System API] Mapped ${planetModels.length} planets to new model structure`);

    return planetModels;
  } catch (error) {
    console.error('Failed to fetch planetary data:', error);
    throw error;
  }
}
