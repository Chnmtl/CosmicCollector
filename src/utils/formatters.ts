/**
 * Formatting utilities for displaying cosmic data
 */

/**
 * Format large numbers in scientific notation with superscripts
 * Example: 5.975154e+24 → 5.98 × 10²⁴
 */
export function formatScientificNumber(value: number, decimals: number = 2): string {
  if (value === 0) return '0';
  
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = value / Math.pow(10, exponent);
  
  // Use superscript digits for exponent
  const superscriptExponent = exponent.toString().split('').map(char => {
    if (char === '-') return '⁻';
    const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    return superscripts[parseInt(char)] || char;
  }).join('');
  
  return `${mantissa.toFixed(decimals)} × 10${superscriptExponent}`;
}

/**
 * Convert Kelvin to Celsius and format with symbol
 * Example: 288 K → 15°C
 */
export function kelvinToCelsius(kelvin: number): string {
  const celsius = kelvin - 273.15;
  return `${celsius.toFixed(0)}°C`;
}

/**
 * Format mass value with proper unit
 * Handles both Earth masses and Moon masses
 */
export function formatMass(mass: number, unit: 'Earth' | 'Moon' = 'Earth'): string {
  // If mass is very large (scientific notation), format it properly
  if (mass > 1e10 || mass < 1e-10) {
    return `${formatScientificNumber(mass)} ${unit} masses`;
  }
  
  // For reasonable numbers, show with appropriate decimals
  if (mass < 0.001) {
    return `${mass.toExponential(2)} ${unit} masses`;
  } else if (mass < 1) {
    return `${mass.toFixed(3)} ${unit} masses`;
  } else if (mass < 10) {
    return `${mass.toFixed(2)} ${unit} masses`;
  } else {
    return `${mass.toFixed(1)} ${unit} masses`;
  }
}

/**
 * Format diameter with proper thousand separators
 */
export function formatDiameter(km: number): string {
  return `${km.toLocaleString()} km`;
}

/**
 * Format distance with appropriate unit
 */
export function formatDistance(km: number, context: 'sun' | 'planet' | 'earth' = 'sun'): string {
  if (context === 'earth') {
    // For stars, use light years
    return `${km.toFixed(1)} light years`;
  } else if (context === 'sun') {
    // For planets, use millions of km
    const millions = km / 1000000;
    return `${millions.toFixed(1)} million km`;
  } else {
    // For moons, use regular km
    return `${km.toLocaleString()} km`;
  }
}

/**
 * Format temperature based on value
 * For high temperatures (stars), keep in Kelvin
 * For low temperatures (planets/moons), convert to Celsius
 */
export function formatTemperature(kelvin: number): string {
  // Stars have very high temperatures (>5000 K), keep in Kelvin
  if (kelvin > 5000) {
    return `${kelvin.toLocaleString()} K`;
  }
  // Planets/moons have lower temperatures, convert to Celsius
  return kelvinToCelsius(kelvin);
}

/**
 * Format orbital period with appropriate unit
 * Handles negative values (retrograde orbits)
 */
export function formatOrbitalPeriod(days: number): string {
  // Handle retrograde orbits (negative period indicates retrograde)
  const isRetrograde = days < 0;
  const absDays = Math.abs(days);
  
  let formattedPeriod: string;
  
  if (absDays < 1) {
    formattedPeriod = `${(absDays * 24).toFixed(1)} hours`;
  } else if (absDays < 365) {
    formattedPeriod = `${absDays.toFixed(0)} Earth days`;
  } else {
    const years = absDays / 365.25;
    formattedPeriod = `${years.toFixed(1)} Earth years`;
  }
  
  return isRetrograde ? `${formattedPeriod} (retrograde)` : formattedPeriod;
}

/**
 * Format rotation period with appropriate unit
 */
export function formatRotationPeriod(hours: number): string {
  if (hours < 1) {
    return `${(hours * 60).toFixed(0)} minutes`;
  } else if (hours < 48) {
    return `${hours.toFixed(1)} hours`;
  } else {
    const days = hours / 24;
    return `${days.toFixed(1)} Earth days`;
  }
}

// ============================================================================
// General formatting functions
// ============================================================================

/**
 * Format stat key for display (capitalize, add spaces)
 * Example: "distanceFromSun" → "Distance From Sun"
 */
export function formatStatKey(key: string): string {
  return key
    .split(/(?=[A-Z])|_/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format boolean values for display
 */
export function formatBoolean(value: boolean): string {
  return value ? 'Yes' : 'No';
}

/**
 * Truncate text to a specific length with ellipsis
 * Useful for card displays with limited space
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
