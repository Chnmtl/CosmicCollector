import { NASAImageResult } from './types';

const NASA_IMAGES_API = 'https://images-api.nasa.gov/search';
const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1/page/summary';

/**
 * Fetches high-quality planet/celestial object image from Wikipedia
 * 
 * @param objectName - Name of the celestial object (e.g., "Jupiter", "Mars")
 * @returns Image URL or undefined if not found
 */
export async function fetchImageFromWikipedia(objectName: string): Promise<string | undefined> {
  try {
    console.log(`🖼️ [Wikipedia] Fetching image for: ${objectName}`);
    
    const response = await fetch(
      `${WIKIPEDIA_API}/${encodeURIComponent(objectName)}`,
      {
        headers: {
          'User-Agent': 'CosmicCollectorApp/1.0 (Educational purpose; contact: github.com/Chnmtl)',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(`📛 [Wikipedia] API error for ${objectName}: ${response.status}`);
      return undefined;
    }

    const data = await response.json();
    
    console.log(`🔍 [Wikipedia] Response for ${objectName}:`, {
      hasOriginalImage: !!data.originalimage,
      hasThumbnail: !!data.thumbnail,
      originalImageUrl: data.originalimage?.source,
      thumbnailUrl: data.thumbnail?.source,
    });
    
    // Try to get original image first (full resolution)
    if (data.originalimage && data.originalimage.source) {
      console.log(`✅ [Wikipedia] Found image for ${objectName}:`, data.originalimage.source);
      return data.originalimage.source;
    }
    
    // Fallback to thumbnail if original not available
    if (data.thumbnail && data.thumbnail.source) {
      console.log(`✅ [Wikipedia] Found thumbnail for ${objectName}:`, data.thumbnail.source);
      return data.thumbnail.source;
    }

    console.warn(`⚠️ [Wikipedia] No image found for ${objectName}`);
    return undefined;
  } catch (error) {
    console.error(`❌ [Wikipedia] Failed to fetch image for ${objectName}:`, error);
    return undefined;
  }
}

/**
 * Fetches planet image from NASA Images API
 * (Currently unused, kept for future use)
 */
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
