const fs = require("fs");
const path = require("path");

const fullPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "star_full_data.json"
);
const basicPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "star_basic_data.json"
);
const outPath = path.join(__dirname, "..", "src", "data", "stars.json");

function safeReadJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    console.error("Failed to read or parse JSON:", p, e.message);
    process.exit(1);
  }
}

const full = safeReadJSON(fullPath);
const basic = safeReadJSON(basicPath);

// Flatten basic curated list into name->entries map
function normalizeName(name) {
  if (!name) return "";
  return name.toLowerCase().replace(/\s+/g, " ").replace(/[()]/g, "").trim();
}

function baseNameFromBasic(basicName) {
  if (!basicName) return "";
  // remove parenthetical alternate names: "Alnitak (Zeta Orionis)" -> "Alnitak"
  const m = basicName.match(/^([^()]+)(\s*\(|$)/);
  const base = m ? m[1].trim() : basicName;
  return normalizeName(base);
}

const curatedMap = new Map();
Object.values(basic).forEach((arr) => {
  if (!Array.isArray(arr)) return;
  arr.forEach((item) => {
    const rawName = item.name || "";
    const base = baseNameFromBasic(rawName);
    const alt = normalizeName(rawName);
    const entries = curatedMap.get(base) || [];
    entries.push(Object.assign({}, item, { _rawName: rawName, _altName: alt }));
    curatedMap.set(base, entries);

    // also index by alt full name (with parentheses stripped earlier) to be safe
    if (alt !== base) {
      const e2 = curatedMap.get(alt) || [];
      e2.push(Object.assign({}, item, { _rawName: rawName, _altName: alt }));
      curatedMap.set(alt, e2);
    }
  });
});

function findCuratedForStar(star, designation) {
  const tryNames = [];
  if (star.name_traditional)
    tryNames.push(normalizeName(star.name_traditional));
  if (star.name_bayer) tryNames.push(normalizeName(star.name_bayer));
  if (star.name_greek) tryNames.push(normalizeName(star.name_greek));
  if (star.url) tryNames.push(normalizeName(star.url));

  for (const n of tryNames) {
    if (!n) continue;
    const entries = curatedMap.get(n);
    if (!entries) continue;
    // prefer entry with matching designation
    if (designation) {
      const normalizedDesignation = String(designation)
        .toLowerCase()
        .replace(/\s+/g, "");
      const match = entries.find(
        (e) =>
          e.designation &&
          String(e.designation).toLowerCase().replace(/\s+/g, "") ===
            normalizedDesignation
      );
      if (match) return match;
    }
    // fallback to first entry without designation or first general
    const noDesig = entries.find((e) => !e.designation);
    if (noDesig) return noDesig;
    if (entries.length > 0) return entries[0];
  }

  // If not found by keys, try substring matching (basic name contains our chosen name)
  const primary = (
    star.name_traditional ||
    star.name_bayer ||
    star.name_greek ||
    ""
  ).toLowerCase();
  for (const [key, entries] of curatedMap.entries()) {
    if (!primary) continue;
    if (key.includes(primary) || primary.includes(key)) {
      if (designation) {
        const normalizedDesignation = String(designation)
          .toLowerCase()
          .replace(/\s+/g, "");
        const match = entries.find(
          (e) =>
            e.designation &&
            String(e.designation).toLowerCase().replace(/\s+/g, "") ===
              normalizedDesignation
        );
        if (match) return match;
      }
      const noDesig = entries.find((e) => !e.designation);
      if (noDesig) return noDesig;
      return entries[0];
    }
  }

  return null;
}

function chooseDisplayName(star) {
  return star.name_traditional || star.name_bayer || star.name_greek || null;
}

function pickProperties(system, component) {
  const props = {};
  // start with common system-level keys
  if (system) {
    const keys = Object.keys(system);
    keys.forEach((k) => {
      props[k] = system[k];
    });
  }
  // overlay component-specific keys (component preferred)
  if (component) {
    const keys = Object.keys(component);
    keys.forEach((k) => {
      props[k] = component[k];
    });
  }
  // Post-process certain fields

  // Convert asymmetric uncertainties like (+66,200 / −57,600) to ± with smaller value
  function normalizeAsymmetricUncertainty(s) {
    if (typeof s !== "string") return s;
    // Match pattern like (+X / −Y) or (+X / -Y)
    const asymMatch = s.match(/\((\+[0-9.,]+)\s*\/\s*[−-]([0-9.,]+)\)/);
    if (asymMatch) {
      const plusVal = parseFloat(asymMatch[1].replace(/[+,]/g, ""));
      const minusVal = parseFloat(asymMatch[2].replace(/,/g, ""));
      if (!isNaN(plusVal) && !isNaN(minusVal)) {
        // Use the smaller value (more conservative)
        const smaller = Math.min(plusVal, minusVal);
        // Format with commas if original had them
        const formatted = asymMatch[1].includes(",")
          ? smaller.toLocaleString("en-US")
          : smaller.toString();
        return s.replace(/\([^)]+\)/, "± " + formatted);
      }
    }
    return s;
  }

  function normRangeDash(s) {
    if (typeof s !== "string") return s;
    // Only normalize range dashes, not minus signs in negative numbers
    // Replace "to" with dash, and em/en dashes with regular dash
    let result = s.replace(/\bto\b/gi, "-");
    // Replace em/en dashes but be careful not to touch minus signs at start or after spaces
    result = result.replace(/([0-9])\s*[–—]\s*([0-9])/g, "$1 - $2");
    return result.trim();
  }

  // Normalize ranges for all string properties, but preserve negative signs
  Object.keys(props).forEach((k) => {
    if (typeof props[k] === "string") {
      // Don't normalize properties that might have negative numbers at the start
      // to avoid turning "-1.06" into "- 1.06"
      const skipNormalization = [
        "u_b_color_index",
        "b_v_color_index",
        "absolute_magnitude_mv",
        "apparent_magnitude_v",
      ].includes(k);

      if (!skipNormalization) {
        props[k] = normRangeDash(props[k]);
      }
    }
  });

  function parseDistanceToLy(raw) {
    if (!raw || typeof raw !== "string") return raw;
    const s = raw.replace(/\u2212/g, "-");
    // prefer explicit 'ly' values
    const lyMatch = s.match(/([0-9,\.\s\-–—±()+\/]+)\s*ly/i);
    if (lyMatch) {
      let part = lyMatch[1];
      part = part.replace(/\([^)]*pc[^)]*\)/gi, ""); // drop pc parentheses
      part = normRangeDash(part);
      part = part.replace(/\s+/g, " ").replace(/,\s*/g, ",");
      return part.trim() + " ly";
    }

    // if only pc present, convert to ly
    const pcMatch = s.match(/([0-9.,\s\-–—]+)\s*pc(?!.*ly)/i);
    if (pcMatch) {
      let p = pcMatch[1].replace(/,/g, "").trim();
      p = p.replace(/[–—]/g, "-");
      if (p.includes("-")) {
        const parts = p
          .split("-")
          .map((x) => parseFloat(x.trim()))
          .filter((n) => !isNaN(n));
        if (parts.length === 2) {
          const a = (parts[0] * 3.26156).toFixed(2);
          const b = (parts[1] * 3.26156).toFixed(2);
          return a + " - " + b + " ly";
        }
      } else {
        const n = parseFloat(p);
        if (!isNaN(n)) return (n * 3.26156).toFixed(2) + " ly";
      }
    }

    // fallback: if neither ly nor pc, return as-is
    return s;
  }

  function parseAgeToMyr(raw) {
    if (!raw || typeof raw !== "string") return raw;
    let s = raw.replace(/\u2212/g, "-");
    s = s.replace(/\band\b/gi, "-");
    s = s.replace(/\s*\(approx\.?\)\s*/gi, "");
    s = s.replace(/\s*~\s*/g, "");
    s = s.replace(/\s*to\s*/gi, "-");
    s = s.replace(/\s+/g, " ");
    // preserve parenthetical uncertainty and ranges
    // find unit
    const unitMatch = s.match(/(gyr|myr|yr|ky)/i);
    const unit = unitMatch ? unitMatch[0].toLowerCase() : null;
    // extract range or single
    const clean = s.replace(/(gyr|myr|yr|ky)/gi, "").trim();
    if (clean.includes("-")) {
      // preserve full range, including uncertainties
      return (
        clean + " " + (unit ? unit.charAt(0).toUpperCase() + unit.slice(1) : "")
      );
    } else {
      // preserve full value, including uncertainties
      return (
        clean + " " + (unit ? unit.charAt(0).toUpperCase() + unit.slice(1) : "")
      );
    }
  }

  function pickRadius(raw) {
    if (!raw || typeof raw !== "string") return raw;
    // examples: "13.72 ± 0.49 (equatorial); 11.25 ± 0.19 (polar) R☉"
    // prefer equatorial if present, else first numeric value
    const s = raw.replace(/\u2212/g, "-");
    // split on semicolon or full-width comma, but NOT regular comma (used in numbers)
    const parts = s.split(/[;，]/).map((p) => p.trim());
    let chosen = null;
    for (const p of parts) {
      if (/equator|equatorial/i.test(p)) {
        chosen = p;
        break;
      }
    }
    if (!chosen) chosen = parts[0];
    // Keep uncertainty values - extract value with uncertainty and unit
    const m = chosen.match(/([0-9.,]+(?:\s*±\s*[0-9.,]+)?(?:\s*\([^)]+\))?)/);
    return m ? m[0].trim() + " R☉" : raw;
  }

  function pickTemperature(raw) {
    if (!raw || typeof raw !== "string") return raw;
    const s = raw.replace(/\u2212/g, "-");
    // Split on semicolon or full-width comma, but NOT regular comma (used in numbers like 40,000)
    const parts = s.split(/[;，]/).map((p) => p.trim());
    // Prefer equatorial, else first value
    let chosen = parts.find((p) => /equator|equatorial/i.test(p)) || parts[0];
    // If chosen part does not have unit, try to append from original string
    if (!/K/.test(chosen) && /K/.test(s)) chosen += " K";
    // Keep the full numeric value with commas and uncertainties
    // Just ensure proper formatting
    return chosen.trim();
  }

  // Apply parsing rules to known properties
  if (props.distance) {
    try {
      props.distance = parseDistanceToLy(String(props.distance));
    } catch (e) {}
  }
  // Age: display as-is, preserve original unit (no conversion)
  if (props.age) {
    props.age = component?.age || system?.age || props.age;
    props.age = normRangeDash(props.age);
  }
  if (props.radius) {
    try {
      props.radius = pickRadius(String(props.radius));
    } catch (e) {}
  }
  if (props.temperature) {
    try {
      props.temperature = pickTemperature(String(props.temperature));
    } catch (e) {}
  }

  // Normalize ranges, convert asymmetric uncertainties, and normalize Unicode characters
  [
    "apparent_magnitude_v",
    "absolute_magnitude_mv",
    "luminosity",
    "mass",
    "radius",
    "temperature",
    "age",
    "distance",
    "gravity_logg_cgs",
    "u_b_color_index",
    "b_v_color_index",
  ].forEach((k) => {
    if (props[k] && typeof props[k] === "string") {
      let v = props[k];
      // Convert asymmetric uncertainties to ± with smaller value
      v = normalizeAsymmetricUncertainty(v);
      // Replace "to" with dash for ranges
      v = v.replace(/\bto\b/gi, "-");
      // Replace em/en dashes in ranges (between numbers) with regular dash
      v = v.replace(/([0-9])\s*[–—]\s*([0-9])/g, "$1 - $2");
      // Normalize Unicode minus sign (U+2212) and en-dash (U+2013) to ASCII hyphen-minus
      v = v.replace(/[−–]/g, "-");
      // Clean up spacing
      v = v.trim();
      props[k] = v;
    }
  });

  return props;
}

const out = [];
const stars = Array.isArray(full.stars) ? full.stars : [];

for (const s of stars) {
  const baseDisplay = chooseDisplayName(s);
  const baseNormalized = normalizeName(
    baseDisplay || s.name_bayer || s.name_greek || ""
  );
  const constellation =
    s.system && s.system.constellation ? s.system.constellation : null;
  const url = s.url || null;

  // If star has no components, include it as a single star
  if (!Array.isArray(s.components) || s.components.length === 0) {
    const curated = findCuratedForStar(s, null);
    const rarity = curated ? curated.rarity : null;
    const name =
      baseDisplay ||
      s.name_bayer ||
      s.name_greek ||
      baseNormalized ||
      "Unknown";
    const properties = pickProperties(s.system, null);

    out.push({
      name: name,
      baseName: baseDisplay || s.name_bayer || s.name_greek || null,
      designation: null,
      rarity: rarity || "Common",
      constellation: constellation || null,
      url: url,
      properties: properties,
      lore: "",
    });
    continue;
  }

  // For star systems, only include the designated component (from curated data)
  // Find the curated entry for this star system
  const curatedEntry = findCuratedForStar(s, null);
  let targetDesignation = null;
  if (curatedEntry && curatedEntry.designation) {
    targetDesignation = curatedEntry.designation;
  }

  if (targetDesignation) {
    const comp = s.components.find((c) => c.designation === targetDesignation);
    if (comp) {
      const curated = findCuratedForStar(s, targetDesignation);
      const rarity = curated ? curated.rarity : null;
      const name =
        baseDisplay ||
        s.name_traditional ||
        s.name_bayer ||
        s.name_greek ||
        baseNormalized ||
        "Unknown";
      const shortDesignation = targetDesignation
        ? String(targetDesignation).replace(name, "").trim()
        : targetDesignation;
      const properties = pickProperties(s.system, comp);

      out.push({
        name: name,
        baseName: baseDisplay || s.name_bayer || s.name_greek || null,
        designation: shortDesignation || null,
        rarity: rarity || "Common",
        constellation: constellation || null,
        url: url,
        properties: properties,
        lore: "",
      });
    }
  }
}

// Write output file
fs.writeFileSync(outPath, JSON.stringify({ stars: out }, null, 2), "utf8");
console.log("Wrote", out.length, "star records to", outPath);

// Print a couple of samples for quick validation
const sample = out.slice(0, 8).map((s) => ({
  name: s.name,
  designation: s.designation,
  rarity: s.rarity,
  constellation: s.constellation,
}));
console.log("Sample:", sample);
