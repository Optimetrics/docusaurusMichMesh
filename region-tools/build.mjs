import fs from 'fs';
import * as topojson from 'topojson-client';
import { geoMercator, geoPath, geoCentroid } from 'd3-geo';

const us = JSON.parse(fs.readFileSync('node_modules/us-atlas/counties-10m.json'));
const ref = JSON.parse(fs.readFileSync('county-subregions.json'));
const OUT = 'static/regions'; fs.mkdirSync(OUT, {recursive:true});

const meta = {
  'mi-west':    {name:'West Michigan',        short:'MI-WEST',    color:'#2b8a3e'},
  'mi-central': {name:'Central Michigan',     short:'MI-CENTRAL', color:'#e67700'},
  'mi-east':    {name:'Southeast Michigan',   short:'MI-EAST',    color:'#c92a2a'},
  'mi-north':   {name:'Northern Michigan',    short:'MI-NORTH',   color:'#1971c2'},
  'mi-upper':   {name:'Upper Peninsula',      short:'MI-UPPER',   color:'#6741d9'},
};

// Michigan county geometries from the topology
const miGeoms = us.objects.counties.geometries.filter(g => String(g.id).startsWith('26'));
const missing = miGeoms.filter(g => !ref.counties[g.id]).map(g=>g.id);
if (missing.length) throw new Error('counties without assignment: '+missing);

const index = { title: 'Michigan MeshCore Region Map', regions: [] };
const features = [];
for (const [tag, m] of Object.entries(meta)) {
  const geoms = miGeoms.filter(g => ref.counties[g.id].subregion === tag);
  const merged = topojson.merge(us, geoms);          // dissolve county borders
  const counties = geoms.map(g => ref.counties[g.id].name).sort();
  const feature = { type:'Feature', id: tag, properties: {
      id: tag, name: m.name, short_name: m.short, region_type: 'Michigan Subregion',
      kind: 'subregion', boundary_basis: 'Nielsen DMA county groupings with adjustments (RFC-001 Addendum B)',
      notes: ref.subregions[tag].basis, counties, county_count: counties.length,
      draft: true, source: 'US Census county boundaries via us-atlas (10m)',
      coordinator: 'MichMesh Discord' }, geometry: merged };
  fs.writeFileSync(`${OUT}/${tag}.geojson`, JSON.stringify({type:'FeatureCollection', features:[feature]}));
  index.regions.push({ id: tag, name: m.name, short_name: m.short, region_type: 'Michigan Subregion',
    coordination_status: 'proposed', coordination_label: 'Reference assignment (RFC-001 Addendum B)',
    file: `${tag}.geojson` });
  features.push({feature, color: m.color});
}
// state outline for context
const state = topojson.merge(us, miGeoms);
fs.writeFileSync(`${OUT}/mi.geojson`, JSON.stringify({type:'FeatureCollection', features:[{type:'Feature', id:'mi', properties:{id:'mi', name:'Michigan', short_name:'MI', region_type:'State', kind:'state'}, geometry: state}]}));
index.regions.unshift({ id:'mi', name:'Michigan (statewide)', short_name:'MI', region_type:'State Region',
  coordination_status:'political_boundaries', coordination_label:'State boundary', file:'mi.geojson', optional:true, visible:false });
fs.writeFileSync(`${OUT}/index.json`, JSON.stringify(index, null, 2));

// --- static SVG preview (no tiles) ---
const W=680, H=720;
const proj = geoMercator().fitExtent([[16,16],[W-16,H-16]], {type:'FeatureCollection', features: features.map(f=>f.feature)});
const path = geoPath(proj);
let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" width="100%" font-family="system-ui, sans-serif">
<title>Michigan MeshCore subregions reference map</title><desc>Five proposed subregions drawn from county groupings</desc>`;
// county borders faint
for (const g of miGeoms) {
  const f = topojson.feature(us, g);
  svg += `<path d="${path(f)}" fill="none" stroke="#ffffff" stroke-width="0.6" opacity="0.9"/>`;
}
for (const {feature, color} of features) {
  svg += `<path d="${path(feature)}" fill="${color}" fill-opacity="0.55" stroke="${color}" stroke-width="1.6"/>`;
}
for (const g of miGeoms) {
  const f = topojson.feature(us, g);
  svg += `<path d="${path(f)}" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.7"/>`;
}
// labels
const labelPos = {'mi-west':null,'mi-central':null,'mi-east':null,'mi-north':null,'mi-upper':null};
for (const {feature} of features) {
  const [x,y] = proj(geoCentroid(feature));
  const m = meta[feature.id];
  svg += `<text x="${x}" y="${y}" text-anchor="middle" font-size="15" font-weight="700" fill="#111" stroke="#fff" stroke-width="3" paint-order="stroke">${m.short}</text>`;
}
// legend
let ly = 24;
svg += `<text x="20" y="${ly}" font-size="16" font-weight="700" fill="#111">Michigan MeshCore subregions — reference assignment (draft)</text>`;
ly += 10;
for (const [tag,m] of Object.entries(meta)) {
  ly += 20;
  svg += `<rect x="20" y="${ly-12}" width="14" height="14" fill="${m.color}" fill-opacity="0.55" stroke="${m.color}"/>`;
  svg += `<text x="40" y="${ly}" font-size="13" fill="#222">${tag} — ${m.name} (${ref.subregions[tag].counties.length} counties)</text>`;
}
svg += `</svg>`;
fs.writeFileSync('static/regions/preview.svg', svg);
console.log('regions:', index.regions.map(r=>r.id).join(', '));
