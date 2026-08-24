# Cosmic Collector: AI Coding Agent Instructions

## Project Overview
React Native + Expo app (TypeScript) — a collectible-card game over real astronomical data. Three screens (Explore, Collection, Missions). State lives in Zustand stores persisted to AsyncStorage.

The catalog is **fetched at runtime, not hardcoded**: 8 planets and 60 moons from the Solar System OpenData API, plus 80 stars from a local dataset. There is no `celestialObjects.ts`.

## Architecture & Data Flow
Data flows through four layers. Respect the boundaries — each layer has one job:

```
api/clients/   → services/providers/ → services/mappers/ → CatalogService → store/
HTTP only        fetch + cache         API → domain        orchestration     UI state
```

- **`src/api/clients/`** — `SolarSystemClient`, `WikipediaClient`. HTTP only; no domain knowledge, no caching.
- **`src/services/providers/`** — one per object type. Calls a client, consults `cacheService` (24h AsyncStorage TTL), delegates shaping to a mapper.
- **`src/services/mappers/`** — pure functions, API response → domain model. No side effects, no I/O. This is where game data (`src/data/gameData.ts`) and API data are merged.
- **`src/services/CatalogService.ts`** — orchestrates providers and their dependencies (moons need planet IDs, so planets load first; moons and stars then load in parallel). Exported as a singleton.
- **`src/store/`** — `playerStore` (XP, level, energy), `collectionStore` (discoveries, filters), `inventoryStore` (loot).
- **`src/models/`** — domain types. `CosmicObject` is the base; `Planet`, `Moon`, `Star` extend it with a typed `*Data` field.

## Developer Workflows
- **Run**: `npm run android` / `npm run ios` / `npm run web`
- **Typecheck**: `npx tsc --noEmit` — must pass before committing
- **Bundle check**: `npx expo export --platform android` — catches unresolved asset requires
- **API key**: the Solar System API needs a bearer token in `.env` as `EXPO_PUBLIC_SOLAR_SYSTEM_API_KEY`. `EXPO_PUBLIC_*` is inlined at bundle time, so **restart the dev server** after changing it; a reload will not do. Expired tokens return `403` on every call.

## Project-Specific Patterns
- **Rarity**: Common / Rare / Epic / Legendary. Drives XP, discovery chance and card colors. Values in `src/utils/gameBalance.ts`, colors in `src/utils/constants.ts`.
- **Images**: never hardcode an asset path in a mapper. Use `src/utils/imageResolver.ts` — `getMoonImage(name)`, `getPlanetImage(name)`, `getDefaultImageForType(type)`. Metro needs literal require paths, so the moon/planet maps are static and generated; add new art by adding both the file and its map entry.
- **Energy**: max 10, refills 1 per 5 min. Logic in `playerStore` and `ExploreScreen`.
- **Filtering**: `CollectionScreen` filters by type and rarity via `RarityFilter` / `TypeFilter`.

## Conventions
- All code typed; add domain types under `src/models/`, not a global `types/` folder.
- PascalCase components, camelCase functions and variables.
- Barrel `index.ts` files re-export each folder — add new modules to them.
- Mappers stay pure. Put I/O in a provider or client instead.

## Adding a New Object Type
1. Add the type to `CosmicObjectType` in `src/models/CosmicObject.ts` and a model file beside it.
2. Add a default image to `assets/defaults/` and register it in `TYPE_DEFAULT_IMAGES`.
3. Write a mapper in `src/services/mappers/` (pure) and a provider in `src/services/providers/` (fetch + cache).
4. Register the provider in `CatalogService.loadAll()` — add it to the parallel `Promise.all` if it has no dependencies.
5. Add a cache key in `cacheService.ts` and clear it in `clearAllCaches()`.

---
For unclear or missing conventions, ask the user before making structural changes.
