# 🌌 Cosmic Collector

A React Native (Expo) collectible-card game built on **real astronomical data**. Explore the universe, discover celestial objects, and complete your collection — every card is a real body with real measurements, pulled from live APIs rather than hardcoded.

**Catalog: 148 objects** — 8 planets and 60 moons from the [Solar System OpenData API](https://api.le-systeme-solaire.net/), plus 80 stars from a dataset compiled from Wikipedia.

<!-- TODO: add a screenshot here — e.g. ![Cosmic Collector](docs/screenshot.png) -->

## Screens

| Screen | What it does |
|---|---|
| **Explore** | Spend energy to discover a random object, weighted by rarity. Animated card reveal with particle effects on rare finds. |
| **Collection** | Grid of everything discovered, filterable by type and rarity, with completion stats. |
| **Missions** | Nine achievements tracking discoveries, types collected and level milestones. |

Cards flip to reveal the object's real scientific data — mass, radius, gravity, orbital period, surface temperature, spectral class, distance — alongside a description and themed loot.

## Architecture

The data layer is the substance of this project. It is built in four stages so that adding a new object type means adding a provider and a mapper, not editing existing code:

```
API clients      →  providers        →  mappers          →  catalog service  →  Zustand stores
(HTTP only)         (fetch + cache)     (API → domain)      (orchestration)     (UI state)

SolarSystemClient   PlanetProvider      mapPlanet          CatalogService      playerStore
WikipediaClient     MoonProvider        mapMoon                                collectionStore
                    StarProvider        mapExtractedStar                       inventoryStore
```

Notable pieces:

- **Server-side filtering.** `SolarSystemClient.getMoons()` asks the API for exactly the moons it needs — multiple `filter[]` parameters with `satisfy=any` — then dedupes and returns the top 60 by mean radius, instead of downloading every body and filtering on the device.
- **Dependency-ordered loading.** `CatalogService` loads planets first, then fans out to moons (which need planet IDs) and stars in parallel.
- **24-hour AsyncStorage cache** per object type, so the app is usable offline after first launch.
- **Descriptions** are fetched from the Wikipedia REST API and merged into objects at map time.
- **Star pipeline.** `scripts/extractStars.js` turns a source spreadsheet into `src/data/stars.json`; `mapExtractedStar` parses the messy string values ("25.3 ± 5.3 M☉", "2.2 - 3.56 Myr") into numbers.

## Tech stack

React Native 0.81 · Expo 54 · React 19 · TypeScript 5.9 · Zustand 5 · AsyncStorage · Expo Linear Gradient · React Native Animated

## Getting started

**Prerequisites:** Node.js 18+, and an Android/iOS emulator or the Expo Go app.

```bash
git clone https://github.com/Chnmtl/CosmicCollector.git
cd CosmicCollector
npm install

# The Solar System API requires a bearer token (free, but mandatory).
# Generate one at https://api.le-systeme-solaire.net/generatekey.html
cp .env.example .env      # then paste your key into .env

npm run android   # or: npm run ios / npm run web
```

> **Note:** `EXPO_PUBLIC_*` variables are baked in at bundle time. After changing `.env`, restart the dev server — a hot reload will not pick up a new key. An expired token shows up as `403` on every request.

## Project structure

```
src/
├── api/clients/      SolarSystemClient, WikipediaClient  — HTTP only
├── models/           Domain types: CosmicObject, Planet, Moon, Star
├── services/
│   ├── providers/    Fetch + cache per object type
│   ├── mappers/      API response → domain model (pure functions)
│   ├── CatalogService.ts
│   └── cacheService.ts
├── store/            Zustand: player, collection, inventory
├── components/       Cards (flip, front, back, compact), filters, tab bar
├── screens/          Explore, Collection, Missions
├── data/             Star dataset + mission and game-balance data
└── utils/            Constants, formatters, image resolver, stats
scripts/extractStars.js   Spreadsheet → stars.json
```

## Artwork

Cards use bundled artwork resolved by `src/utils/imageResolver.ts`: dedicated images for 43 of the 60 moons and for Earth, and a generated default image per object type (star, planet, moon, galaxy, exoplanet, nebula, black hole) for everything else.

## Roadmap

- Artwork for the remaining moons and the seven other planets
- Better Wikipedia description matching — some objects resolve to poor or wrong articles
- Additional object types: galaxies, nebulae, exoplanets and black holes (models and defaults exist; providers do not yet)
- Sound effects and daily challenges

## License

MIT — see [LICENSE](LICENSE).

## Author

**Cihan Mutlu** — [github.com/Chnmtl](https://github.com/Chnmtl)
