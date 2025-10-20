import { WikipediaExtract } from '../types';

/**
 * Wikipedia API HTTP Client
 * Responsibility: Fetch descriptions and summaries from Wikipedia only
 * Single Responsibility Principle: Only handles HTTP communication with Wikipedia
 */
export class WikipediaClient {
  private readonly baseUrl = 'https://en.wikipedia.org/w/api.php';
  private readonly requestTimeout = 10000; // 10 seconds

  /**
   * Get description for a cosmic object from Wikipedia
   * Uses a 2-step strategy:
   * 1. Try with type suffix first (e.g., "Mercury (planet)") - avoids disambiguation pages
   * 2. If not found, try direct name (e.g., "Earth", "Mars")
   * 
   * @param name - Object name (e.g., "Earth", "Moon", "Jupiter")
   * @param type - Object type (e.g., "Planet", "Moon") - optional but recommended
   * @returns Description string or null if not found
   */
  async getDescription(name: string, type?: string): Promise<string | null> {
    console.log(
      `📖 [WikipediaClient] Fetching description for: "${name}" (type: ${type || 'none'})`
    );

    // Strategy 1: Try with type suffix first (avoids disambiguation pages)
    if (type) {
      const typeTitle = `${name} (${type.toLowerCase()})`;
      console.log(`   🔍 Trying: "${typeTitle}"`);
      
      const typeResult = await this.fetchByTitle(typeTitle);
      if (typeResult) {
        console.log(`   ✅ Found with type: ${typeTitle}`);
        return typeResult;
      }
      console.log(`   ❌ Not found with type suffix`);
    }

    // Strategy 2: Try direct name as fallback
    console.log(`   🔍 Trying direct name: "${name}"`);
    const directResult = await this.fetchByTitle(name);
    
    if (directResult) {
      console.log(`   ✅ Found with direct name`);
      return directResult;
    }

    console.warn(`⚠️ [WikipediaClient] No description found for "${name}"`);
    return null;
  }

  /**
   * Fetch Wikipedia page extract by title
   * @param title - Wikipedia page title
   * @returns Extracted summary or null if not found
   */
  private async fetchByTitle(title: string): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        prop: 'extracts',
        exintro: 'true',
        explaintext: 'true',
        titles: title,
        origin: '*'
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        headers: {
          'User-Agent': 'CosmicCollectorApp/1.0 (Educational; github.com/Chnmtl)',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const data: WikipediaExtract = await response.json();
      const pages = data.query?.pages;
      
      if (!pages) {
        return null;
      }

      const page = pages[Object.keys(pages)[0]];
      
      if (page.missing !== undefined || !page.extract) {
        return null;
      }

      // Extract and format summary
      return this.extractSummary(page.extract);
    } catch (error) {
      // Handle timeout and other errors silently
      return null;
    }
  }

  /**
   * Extract first 2-3 sentences from Wikipedia text
   * Limits to ~300 characters max for card display
   * 
   * @param text - Full Wikipedia extract
   * @returns Formatted summary (2-3 sentences, max 300 chars)
   */
  private extractSummary(text: string): string {
    const sentences = text.split(/(?<=[.!?])\s+/);
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
  }
}
