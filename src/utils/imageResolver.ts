/**
 * Image Resolver
 * Responsibility: map a cosmic object onto its bundled artwork.
 *
 * Metro requires every asset path to be a literal, so the moon lookup below is
 * a generated static map rather than a dynamic require. Any object without its
 * own artwork falls back to the default image for its type.
 */

import { CosmicObjectType } from '../models';

/** Result of require() on an image asset, as accepted by <Image source>. */
export type ImageAsset = number;

/** Default artwork, one per cosmic object type. */
export const TYPE_DEFAULT_IMAGES: Record<CosmicObjectType, ImageAsset> = {
  Star: require('../../assets/defaults/star.png'),
  Planet: require('../../assets/defaults/planet.png'),
  Moon: require('../../assets/defaults/moon.png'),
  Galaxy: require('../../assets/defaults/galaxy.png'),
  Exoplanet: require('../../assets/defaults/exoplanet.png'),
  Nebula: require('../../assets/defaults/nebula.png'),
  BlackHole: require('../../assets/defaults/blackhole.png'),
};

/**
 * Per-planet artwork, keyed by slugify(englishName).
 * Only Earth has a real photograph so far; the rest use the Planet default.
 */
const PLANET_IMAGES: Record<string, ImageAsset> = {
  earth: require('../../assets/planets/earth.png'),
};
/**
 * Per-moon artwork, keyed by slugify(englishName).
 * Covers 43 of the 60 moons the catalog loads; the rest use the Moon default.
 */
const MOON_IMAGES: Record<string, ImageAsset> = {
  amalthea: require('../../assets/moons/amalthea.png'),
  ariel: require('../../assets/moons/ariel.png'),
  belinda: require('../../assets/moons/belinda.png'),
  caliban: require('../../assets/moons/caliban.png'),
  callisto: require('../../assets/moons/callisto.png'),
  cressida: require('../../assets/moons/cressida.png'),
  desdemona: require('../../assets/moons/desdemona.png'),
  despina: require('../../assets/moons/despina.png'),
  dione: require('../../assets/moons/dione.png'),
  elara: require('../../assets/moons/elara.png'),
  enceladus: require('../../assets/moons/enceladus.png'),
  epimetheus: require('../../assets/moons/epimetheus.png'),
  europa: require('../../assets/moons/europa.png'),
  galatea: require('../../assets/moons/galatea.png'),
  ganymede: require('../../assets/moons/ganymede.png'),
  halimede: require('../../assets/moons/halimede.png'),
  himalia: require('../../assets/moons/himalia.png'),
  hyperion: require('../../assets/moons/hyperion.png'),
  iapetus: require('../../assets/moons/iapetus.png'),
  io: require('../../assets/moons/io.png'),
  janus: require('../../assets/moons/janus.png'),
  juliet: require('../../assets/moons/juliet.png'),
  larissa: require('../../assets/moons/larissa.png'),
  mimas: require('../../assets/moons/mimas.png'),
  moon: require('../../assets/moons/moon.png'),
  naiad: require('../../assets/moons/naiad.png'),
  nereid: require('../../assets/moons/nereid.png'),
  oberon: require('../../assets/moons/oberon.png'),
  pandora: require('../../assets/moons/pandora.png'),
  phoebe: require('../../assets/moons/phoebe.png'),
  portia: require('../../assets/moons/portia.png'),
  prometheus: require('../../assets/moons/prometheus.png'),
  puck: require('../../assets/moons/puck.png'),
  rhea: require('../../assets/moons/rhea.png'),
  rosalind: require('../../assets/moons/rosalind.png'),
  sycorax: require('../../assets/moons/sycorax.png'),
  tethys: require('../../assets/moons/tethys.png'),
  thalassa: require('../../assets/moons/thalassa.png'),
  thebe: require('../../assets/moons/thebe.png'),
  titan: require('../../assets/moons/titan.png'),
  titania: require('../../assets/moons/titania.png'),
  triton: require('../../assets/moons/triton.png'),
  umbriel: require('../../assets/moons/umbriel.png'),
};

/**
 * Normalizes a body name into a lookup key.
 * Strips accents and okinas so 'Hiʻiaka' and 'Hiiaka' resolve alike.
 */
export function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // combining marks left by NFD
    .replace(/[\u02bb\u02bc\u2018\u2019\u0027]/g, '') // okina / apostrophes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Returns the default artwork for a cosmic object type. */
export function getDefaultImageForType(type: CosmicObjectType): ImageAsset {
  return TYPE_DEFAULT_IMAGES[type] ?? TYPE_DEFAULT_IMAGES.Planet;
}

/** Returns this moon's own artwork if we have it, otherwise the Moon default. */
export function getMoonImage(name: string): ImageAsset {
  return MOON_IMAGES[slugify(name)] ?? TYPE_DEFAULT_IMAGES.Moon;
}

/** Returns this planet's own artwork if we have it, otherwise the Planet default. */
export function getPlanetImage(name: string): ImageAsset {
  return PLANET_IMAGES[slugify(name)] ?? TYPE_DEFAULT_IMAGES.Planet;
}

/** True when the named moon has dedicated artwork rather than the default. */
export function hasMoonImage(name: string): boolean {
  return slugify(name) in MOON_IMAGES;
}
