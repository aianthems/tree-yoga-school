const { readState } = require('./validate-champion-imports.cjs');
const { championStates } = require('../lib/champion-states.ts');
const { normalizeChampionRecords, normalizeChampionCoordinates } = require('../lib/champion-state-data.ts');
const { townKey, stateNames, placeName } = require('../lib/champion-trees.ts');
const { sameChampionSpecies } = require('../lib/champion-species.ts');
const states = Object.keys(championStates).sort((a,b) => championStates[a].recordOrder - championStates[b].recordOrder);
const batches = states.map(state => normalizeChampionRecords(state, readState(state).records));
const trees = batches.flat();
const coordinates = Object.assign({}, ...states.map(state => normalizeChampionCoordinates(state, readState(state).coordinates)));
function legacyResults(trees, s) {
 const words = s.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 return trees.filter(t => (!s.state || t.state === s.state) && (!s.species || sameChampionSpecies(t.scientificName, s.species)) && (!s.county || t.county === s.county) && (!s.town || townKey(t) === s.town) && (!s.genus || t.scientificName.split(' ')[0] === s.genus) && (!s.locationsOnly || Boolean(t.location || t.publicCoordinates)) && (!s.publicOnly || t.publicAccess === true) && words.every(word => `${stateNames[t.state]} ${t.state} ${t.mapTown || ''} ${t.commonName} ${t.scientificName} ${t.town} ${t.county} ${t.location || ''} ${t.notes || ''} ${t.sourceVariety || ''} ${t.status || ''}`.toLowerCase().includes(word))).sort((a,b) => {
  if(s.sort === 'height') return (b.height??-1)-(a.height??-1)||a.sourceRow-b.sourceRow;
  if(s.sort === 'points') return (b.points??-1)-(a.points??-1)||a.sourceRow-b.sourceRow;
  if(s.sort === 'town') return placeName(a).localeCompare(placeName(b))||a.commonName.localeCompare(b.commonName);
  return a.commonName.localeCompare(b.commonName)||a.sourceRow-b.sourceRow;
 });
}
function legacyClusters(places, spacing=44) {
 const clusters=[];
 for(const p of places) {
  const found=clusters.find(c => Math.hypot(c.x-p.x,c.y-p.y)<spacing);
  if(found)found.places.push(p.value); else clusters.push({x:p.x,y:p.y,places:[p.value]});
 }
 return clusters.map(c=>c.places);
}
function projectedPlaces(zoom) {
 return Object.entries(coordinates).sort(([a],[b])=>a.localeCompare(b)).map(([value,{lat,lng}])=> {
  const size=256*2**zoom, sin=Math.sin(lat*Math.PI/180);
  return {value,x:(lng+180)/360*size,y:(.5-Math.log((1+sin)/(1-sin))/(4*Math.PI))*size};
 });
}
module.exports={batches,trees,coordinates,legacyResults,legacyClusters,projectedPlaces};
