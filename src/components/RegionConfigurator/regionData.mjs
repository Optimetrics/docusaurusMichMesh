// Where the Region Configurator's data comes from, and how it's checked.
// Shared by the component (in the browser) and scripts/sync-region-data.mjs
// (in Node), so both read and validate the data the same way. README.md in
// this folder explains the whole flow.

// The single source of truth: the data/ folder of the Michigan regions RFC.
export const RFC_REPO = 'MichMesh/MC-Regional-Infrastructure-Planning';
export const RFC_REF = 'main';
export const RFC_FILES = {
  countySubregions: 'data/county-subregions.json',
  localRegions: 'data/local-regions.json',
  places: 'data/places.json',
};

export const rawUrl = (path, ref = RFC_REF) => `https://raw.githubusercontent.com/${RFC_REPO}/${ref}/${path}`;

// Fetches the three files from the RFC repo, as-is.
export async function fetchRfcData({ref = RFC_REF, signal} = {}) {
  const entries = await Promise.all(
    Object.entries(RFC_FILES).map(async ([key, path]) => {
      const res = await fetch(rawUrl(path, ref), {signal, cache: 'no-cache'});
      if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
      return [key, await res.json()];
    }),
  );
  return Object.fromEntries(entries);
}

// Turns the raw RFC files into what the configurator needs, or throws if they
// don't have the expected shape. The component falls back to the bundled
// snapshot when this throws, so a bad change upstream can't break the page.
export function normalize(raw) {
  const subregionDefs = raw?.countySubregions?.subregions;
  const localDefs = raw?.localRegions?.regions;
  const placeDefs = raw?.places?.places;
  if (!subregionDefs || !Array.isArray(localDefs) || !placeDefs) {
    throw new Error('region data is missing subregions, regions or places');
  }

  const subregions = {}; // 'mi-west' -> 'West Michigan'
  const counties = {}; // 'Kent' -> 'mi-west'
  for (const [name, def] of Object.entries(subregionDefs)) {
    subregions[name] = def.label || name;
    for (const c of def.counties || []) counties[c.name] = name;
  }
  if (Object.keys(counties).length < 80) throw new Error('region data has too few counties');

  const valid = (r) => typeof r.tag === 'string' && subregions[r.subregion];
  const toLocal = (r) => ({
    tag: r.tag,
    name: r.name || r.tag,
    subregion: r.subregion,
    suggestedCounties: (r.suggestedCounties || []).filter((c) => counties[c] === r.subregion),
  });
  // Only regions repeaters carry today are offered. Proposed ones are shown as
  // a note so nobody invents a clashing tag.
  const locals = localDefs.filter((r) => valid(r) && r.status === 'in-use').map(toLocal);
  const proposed = localDefs.filter((r) => valid(r) && r.status === 'proposed').map(toLocal);

  const places = {};
  for (const [place, county] of Object.entries(placeDefs)) {
    if (counties[county]) places[place] = county;
  }

  return {subregions, counties, locals, proposed, places};
}
