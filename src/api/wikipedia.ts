import { WikipediaExtract } from './types';

const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';

export async function fetchPlanetLore(planetName: string): Promise<string | undefined> {
  try {
    const url = new URL(WIKIPEDIA_API);
    url.searchParams.set('action', 'query');
    url.searchParams.set('format', 'json');
    url.searchParams.set('prop', 'extracts');
    url.searchParams.set('exintro', 'true');
    url.searchParams.set('explaintext', 'true');
    url.searchParams.set('titles', `${planetName} (planet)`);
    url.searchParams.set('origin', '*');

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.warn(`Wikipedia API error for ${planetName}: ${response.status}`);
      return undefined;
    }

    const data: WikipediaExtract = await response.json();
    const pages = data.query?.pages;

    if (!pages) return undefined;

    const pageId = Object.keys(pages)[0];
    const extract = pages[pageId]?.extract;

    if (!extract) return undefined;

    // Return first 2 sentences for brevity
    const sentences = extract.split('. ').slice(0, 2).join('. ');
    return sentences + (sentences.endsWith('.') ? '' : '.');
  } catch (error) {
    console.error(`Failed to fetch lore for ${planetName}:`, error);
    return undefined;
  }
}
