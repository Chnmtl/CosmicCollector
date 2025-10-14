import { NASAImageResult } from './types';

const NASA_IMAGES_API = 'https://images-api.nasa.gov/search';

export async function fetchPlanetImage(planetName: string): Promise<string | undefined> {
  try {
    const response = await fetch(
      `${NASA_IMAGES_API}?q=${encodeURIComponent(planetName)}&media_type=image`
    );

    if (!response.ok) {
      console.warn(`NASA Images API error for ${planetName}: ${response.status}`);
      return undefined;
    }

    const data: NASAImageResult = await response.json();
    const items = data.collection?.items || [];

    // Find first item with an image link
    for (const item of items) {
      if (item.links && item.links.length > 0) {
        return item.links[0].href;
      }
    }

    return undefined;
  } catch (error) {
    console.error(`Failed to fetch image for ${planetName}:`, error);
    return undefined;
  }
}
