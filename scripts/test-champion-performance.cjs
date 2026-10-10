const test=require('node:test');
const assert=require('node:assert/strict');
const {trees,batches,coordinates,legacyResults,legacyClusters,projectedPlaces}=require('./champion-performance-fixture.cjs');
const {filterChampionRecords,sortChampionRecords}=require('../lib/champion-explorer-index.ts');
const {championSpeciesOptions,championSpeciesOptionsForBatches}=require('../lib/champion-species.ts');
const {clusterChampionPlaces}=require('../lib/champion-marker-clusters.ts');
const {emptySelection}=require('../lib/champion-links.ts');
const {townKey}=require('../lib/champion-trees.ts');

test('indexed filters and reusable sorted registers preserve all result IDs and order',()=>{
 const cases=[{}, {query:'oak'},{query:'  WHITE   OAK '},{query:'not-a-tree-zzzz'}, {query:'private'}, {query:'dead'}, {query:'oregon'}, {state:'WA'}, {state:'OR',query:'douglas'}, {genus:'Pinus'}, {species:'  QUERCUS ALBA '}, {publicOnly:true}, {locationsOnly:true}, {publicOnly:true,locationsOnly:true}, ...trees.filter((_,i)=>i%467===0).flatMap(t=>[{town:townKey(t)},{county:t.county,state:t.state},{species:t.scientificName,query:t.state}])];
 for(const sort of ['name','town','height','points']) {
  const ordered=sortChampionRecords(trees,sort);
  for(const patch of cases) {
   const selection={...emptySelection,...patch,sort};
   const matches=filterChampionRecords(trees,selection), included=new Set(matches);
   assert.deepEqual(ordered.filter(t=>included.has(t)).map(t=>t.id),legacyResults(trees,selection).map(t=>t.id),JSON.stringify(selection));
  }
 }
 assert.equal(filterChampionRecords(trees,emptySelection).length,7759);
});
test('cached state species summaries equal full regrouping after every register arrival',()=>{
 for(let i=1;i<=batches.length;i++) {
  const arrived=batches.slice(0,i);
  assert.deepEqual(championSpeciesOptionsForBatches(arrived),championSpeciesOptions(arrived.flat().filter(t=>t.scientificName!=='Not supplied by source')));
 }
 // Returning cached summaries must not let aggregate counts mutate a state.
 assert.deepEqual(championSpeciesOptionsForBatches([batches[0]]),championSpeciesOptions(batches[0].filter(t=>t.scientificName!=='Not supplied by source')));
});
test('spatial-grid clusters preserve greedy anchors, membership, boundaries and every place',()=>{
 for(const zoom of [4,7,10,14]) {
  const places=projectedPlaces(zoom);
  assert.deepEqual(clusterChampionPlaces(places),legacyClusters(places));
  assert.equal(clusterChampionPlaces(places).flat().length,places.length);
 }
 const edge=[{x:-44,y:0,value:0},{x:0,y:0,value:1},{x:-.001,y:0,value:2},{x:44,y:0,value:3},{x:43.999,y:0,value:4}];
 assert.deepEqual(clusterChampionPlaces(edge),legacyClusters(edge));
 let seed=12;
 for(let round=0;round<20;round++) {
  const places=Array.from({length:500},(_,value)=>{seed=(seed*1664525+1013904223)>>>0;const x=seed%1000-500;seed=(seed*1664525+1013904223)>>>0;return{x,y:seed%1000-500,value};});
  assert.deepEqual(clusterChampionPlaces(places),legacyClusters(places));
 }
});
test('map place groups account for every mapped record and leave undisclosed locations unplotted',()=>{
 const mapped=trees.filter(t=>coordinates[townKey(t)]);
 const eligible=trees.filter(t=>t.town||t.mapPrecision==='county');
 const keys=new Set(eligible.map(townKey));
 assert.equal(mapped.length,7320);
 assert.ok(mapped.every(t=>keys.has(townKey(t))));
 assert.equal(trees.length-mapped.length,439);
});
