import { WikipediaExtract } from './types';

const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Fetches lore/description for celestial objects from Wikipedia API
 * Simple 2-step strategy:
 * 1. Try with type suffix first (e.g., "Mercury (planet)") - avoids disambiguation pages
 * 2. If not found, try direct name (e.g., "Earth", "Mars")
 */
export async function fetchPlanetLore(
  objectName: string,
  objectType?: string
): Promise<string | undefined> {
  try {
    console.log(`📖 [Wikipedia] Fetching lore for: "${objectName}" (type: ${objectType || 'none'})`);

    // Strategy 1: Try with type suffix first (avoids disambiguation pages)
    if (objectType) {
      const typeTitle = `${objectName} (${objectType.toLowerCase()})`;
      console.log(`   🔍 Trying: "${typeTitle}"`);
      const typeLore = await fetchFromWikipedia(typeTitle);
      if (typeLore) {
        console.log(`   ✅ Found with type: ${typeTitle}`);
        return typeLore;
      }
      console.log(`   ❌ Not found with type suffix`);
    }

    // Strategy 2: Try direct name as fallback
    console.log(`   🔍 Trying direct name: "${objectName}"`);
    const directLore = await fetchFromWikipedia(objectName);
    if (directLore) {
      console.log(`   ✅ Found with direct name`);
      return directLore;
    }

    console.warn(`⚠️ No lore found for "${objectName}"`);
    return undefined;
  } catch (error) {
    console.error(`❌ Error fetching lore for "${objectName}":`, error);
    return undefined;
  }
}

/**
 * Fetch from Wikipedia with a title
 */
async function fetchFromWikipedia(title: string): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const url = new URL(WIKIPEDIA_API);
    url.searchParams.set('action', 'query');
    url.searchParams.set('format', 'json');
    url.searchParams.set('prop', 'extracts');
    url.searchParams.set('exintro', 'true');
    url.searchParams.set('explaintext', 'true');
    url.searchParams.set('titles', title);
    url.searchParams.set('origin', '*');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'CosmicCollectorApp/1.0 (Educational; github.com/Chnmtl)',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return undefined;

    const data: WikipediaExtract = await response.json();
    const pages = data.query?.pages;
    if (!pages) return undefined;

    const page = pages[Object.keys(pages)[0]];
    if (page.missing !== undefined || !page.extract) return undefined;

    const extract = page.extract;

    // Extract first 2-3 sentences
    const sentences = extract.split(/(?<=[.!?])\s+/);
    
    // Build result by adding complete sentences until we hit the limit
    let result = '';
    for (let i = 0; i < Math.min(3, sentences.length); i++) {
      const testResult = result + (result ? ' ' : '') + sentences[i];
      
      // If adding this sentence exceeds 300 chars, stop at previous sentence
      if (testResult.length > 300 && i > 0) {
        break;
      }
      
      result = testResult;
      
      // If we have at least 2 complete sentences and length is reasonable, we can stop
      if (i >= 1 && result.length >= 150) {
        break;
      }
    }
    
    return result.trim();
  } catch (error) {
    return undefined;
  }
}
