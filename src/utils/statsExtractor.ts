import { CosmicObject } from "../models";
import { Planet } from "../models/Planet";
import { Moon } from "../models/Moon";
import { Star } from "../models/Star";
import {
  formatMass,
  formatTemperature,
  formatDiameter,
  formatDistance,
  formatOrbitalPeriod,
  formatRotationPeriod,
} from "./formatters";

/**
 * Extracts and formats stats from any CosmicObject type
 * Returns a key-value object ready for display on card backs
 * 
 * This function will expand as new object types are added:
 * - Nebula
 * - Black Hole
 * - Exoplanet
 * - etc.
 */
export const getObjectStats = (
  object: CosmicObject
): Record<string, string | number | boolean> => {
  const stats: Record<string, string | number | boolean> = {};

  // Type-specific data extraction
  if (object.type === "Planet" && "planetData" in object) {
    const planet = object as Planet;
    const data = planet.planetData;

    if (data.diameter) stats["Diameter"] = formatDiameter(data.diameter);
    if (data.mass) stats["Mass"] = formatMass(data.mass, "Earth");
    if (data.gravity) stats["Gravity"] = `${data.gravity} m/s²`;
    if (data.distanceFromSun)
      stats["Distance from Sun"] = formatDistance(data.distanceFromSun, "sun");
    if (data.orbitalPeriod)
      stats["Orbital Period"] = formatOrbitalPeriod(data.orbitalPeriod);
    if (data.rotationPeriod)
      stats["Rotation Period"] = formatRotationPeriod(data.rotationPeriod);
    if (data.surfaceTemperature)
      stats["Temperature"] = formatTemperature(data.surfaceTemperature);
    if (data.atmosphere) stats["Atmosphere"] = data.atmosphere;
    if (data.moons !== undefined) stats["Moons"] = data.moons;
    stats["Rings"] = data.rings;
    if (data.discoveredBy) stats["Discovered By"] = data.discoveredBy;
  } else if (object.type === "Moon" && "moonData" in object) {
    const moon = object as Moon;
    const data = moon.moonData;

    // Moon Classification (first for prominence)
    if (object.subtype) stats["Moon Type"] = object.subtype; // Regular, Irregular, or Captured Asteroid
    
    // Physical properties
    if (data.diameter) stats["Diameter"] = formatDiameter(data.diameter);
    if (data.mass) stats["Mass"] = formatMass(data.mass, "Moon");
    if (data.density) stats["Density"] = `${data.density.toFixed(2)} g/cm³`;
    if (data.gravity) stats["Gravity"] = `${data.gravity.toFixed(2)} m/s²`;
    
    // Orbital properties
    if (data.distanceFromPlanet)
      stats["Distance from Planet"] = formatDistance(
        data.distanceFromPlanet,
        "planet"
      );
    if (data.orbitalPeriod)
      stats["Orbital Period"] = formatOrbitalPeriod(data.orbitalPeriod);
    
    // Discovery info
    if (data.discoveredBy) stats["Discovered By"] = data.discoveredBy;
    if (data.discoveryDate) stats["Discovery Date"] = data.discoveryDate;
    
    // Note: Eccentricity and Inclination are used internally for moon type classification only
    // Note: Surface temperature not available for moons in API
  } else if (object.type === "Star" && "starData" in object) {
    const star = object as Star;
    const data = star.starData;

    if (data.mass) stats["Mass"] = `${data.mass} Solar masses`;
    if (data.radius) stats["Radius"] = `${data.radius} Solar radii`;
    if (data.temperature)
      stats["Temperature"] = formatTemperature(data.temperature);
    if (data.luminosity)
      stats["Luminosity"] = `${data.luminosity} Solar luminosities`;
    if (data.age) stats["Age"] = `${data.age} billion years`;
    if (data.distanceFromEarth)
      stats["Distance"] = `${data.distanceFromEarth} light years`;
    if (data.constellation) stats["Constellation"] = data.constellation;
  }
  // Future: Add Nebula, Black Hole, Exoplanet, etc.

  return stats;
};
