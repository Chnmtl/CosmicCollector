import { SolarSystemPlanetResponse, ProcessedPlanetData } from './types';

const API_BASE_URL = 'https://api.le-systeme-solaire.net/rest/bodies';
const API_KEY = '09955a09-b6ba-40a1-8b77-b3fe56ac1f74';

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

const PLANET_EMOJIS: Record<string, string> = {
  Mercury: '☿️',
  Venus: '♀️',
  Earth: '🌍',
  Mars: '♂️',
  Jupiter: '♃',
  Saturn: '🪐',
  Uranus: '♅',
  Neptune: '♆',
};

const PLANET_RARITIES: Record<string, 'Common' | 'Rare' | 'Epic' | 'Legendary'> = {
  Mercury: 'Common',
  Venus: 'Rare',
  Earth: 'Rare',
  Mars: 'Common',
  Jupiter: 'Legendary',
  Saturn: 'Epic',
  Uranus: 'Rare',
  Neptune: 'Epic',
};

const PLANET_LOOT: Record<string, string[]> = {
  Mercury: ['Mercury Core', 'Solar Wind Particles', 'Cratered Rock'],
  Venus: ['Sulfuric Acid Clouds', 'Volcanic Rock', 'Greenhouse Gases'],
  Earth: ['Water', 'Organic Matter', 'Rare Earth Elements', 'Life Forms'],
  Mars: ['Iron Oxide', 'Martian Soil', 'Polar Ice', 'Ancient Water'],
  Jupiter: ['Hydrogen Gas', 'Great Red Spot Matter', 'Jovian Moons', 'Magnetic Field Energy'],
  Saturn: ['Ring Particles', 'Titan Methane', 'Icy Moons', 'Hydrogen Helium Mix'],
  Uranus: ['Methane Ice', 'Tilted Magnetic Field', 'Blue-Green Crystals', 'Icy Moons'],
  Neptune: ['Dark Spot Energy', 'Supersonic Winds', 'Methane Clouds', 'Triton Ice'],
};

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

export async function fetchPlanetaryData(): Promise<ProcessedPlanetData[]> {
  try {
    // console.log('🌍 [Solar System API] Starting fetch from:', API_BASE_URL);
    
    // Fetch moon names first
    const moonNameMap = await fetchAllMoonNames();
    
    const response = await fetch(`${API_BASE_URL}?filter[]=isPlanet,eq,true`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // console.log('🌍 [Solar System API] Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Solar System API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const planets: SolarSystemPlanetResponse[] = data.bodies || [];

    // console.log(`🌍 [Solar System API] Received ${planets.length} total bodies from API`);

    // Filter and process only the 8 main planets
    const filteredPlanets = planets.filter((planet) => PLANET_NAMES.includes(planet.englishName));
    // console.log(`🌍 [Solar System API] Filtered to ${filteredPlanets.length} main planets:`, 
    //   filteredPlanets.map(p => p.englishName));

    const processedPlanets = filteredPlanets.map((planet) => processPlanetData(planet, moonNameMap));

    return processedPlanets;
  } catch (error) {
    console.error('Failed to fetch planetary data:', error);
    throw error;
  }
}

function processPlanetData(planet: SolarSystemPlanetResponse, moonNameMap: Record<string, string>): ProcessedPlanetData {
  const name = planet.englishName;
  const rarity = PLANET_RARITIES[name] || 'Common';
  const emoji = PLANET_EMOJIS[name] || '🌑';

  // Calculate XP and energy based on rarity
  const xpReward = rarity === 'Common' ? 10 : rarity === 'Rare' ? 25 : rarity === 'Epic' ? 50 : 100;
  const energyCost = rarity === 'Common' ? 1 : rarity === 'Rare' ? 2 : rarity === 'Epic' ? 3 : 4;
  const discoveryChance = rarity === 'Common' ? 0.7 : rarity === 'Rare' ? 0.5 : rarity === 'Epic' ? 0.3 : 0.1;

  // Determine planet type (Rocky/Gas Giant)
  const type = ['Mercury', 'Venus', 'Earth', 'Mars'].includes(name) ? 'Rocky Planet' : 'Gas Giant';

  // Determine atmosphere composition
  let atmosphere = 'None';
  if (name === 'Venus') atmosphere = 'CO2, N2 (toxic)';
  else if (name === 'Earth') atmosphere = 'N2, O2 (breathable)';
  else if (name === 'Mars') atmosphere = 'CO2 (thin)';
  else if (['Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(name)) atmosphere = 'H2, He (thick)';

  // Determine if planet has rings
  const rings = ['Saturn', 'Jupiter', 'Uranus', 'Neptune'].includes(name);

  // Convert moon IDs to English names using the lookup map
  const moonNames = planet.moons?.map(m => {
    // Extract the actual moon ID from the rel URL (most reliable method)
    // e.g., "https://.../bodies/lune" -> "lune"
    const moonId = m.rel.split('/').pop() || '';
    const englishName = moonNameMap[moonId];
    if (!englishName) {
      console.warn(`⚠️ [${name}] Moon ID "${moonId}" not found in lookup map, using fallback "${m.moon}"`);
    }
    return englishName || m.moon; // Fallback to the original name if not found
  }) || [];

  // Log raw API data for this planet
  // console.log(`📊 [${name}] Raw API data:`, {
  //   meanRadius: planet.meanRadius,
  //   moons: planet.moons?.length || 0,
  //   moonIds: planet.moons?.map(m => m.rel.split('/').pop()) || [],
  //   moonEnglishNames: moonNames,
  //   gravity: planet.gravity,
  //   semimajorAxis: planet.semimajorAxis,
  //   sideralRotation: planet.sideralRotation,
  //   sideralOrbit: planet.sideralOrbit,
  //   avgTemp: planet.avgTemp,
  //   density: planet.density,
  //   discoveredBy: planet.discoveredBy,
  //   discoveryDate: planet.discoveryDate,
  // });

  const processed = {
    id: planet.id,
    name: name,
    type: type,
    rarity: rarity,
    xpReward: xpReward,
    energyCost: energyCost,
    discoveryChance: discoveryChance,
    emoji: emoji,
    lore: `${name}, the ${ordinalPosition(PLANET_NAMES.indexOf(name) + 1)} planet from the Sun.`,
    loot: PLANET_LOOT[name] || [],
    diameter: planet.meanRadius ? planet.meanRadius * 2 : undefined,
    moons: planet.moons ? planet.moons.length : 0,
    moonNames: moonNames,
    gravity: planet.gravity,
    distanceFromSun: planet.semimajorAxis,
    dayLength: planet.sideralRotation,
    yearLength: planet.sideralOrbit,
    surfaceTemperature: planet.avgTemp,
    atmosphere: atmosphere,
    density: planet.density,
    rings: rings,
    discoveredBy: planet.discoveredBy || 'Known since antiquity',
    discoveryDate: planet.discoveryDate || 'Ancient times',
  };

  // console.log(`✅ [${name}] Processed data:`, processed);

  return processed;
}

function ordinalPosition(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
