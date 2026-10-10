// CPU-only profiling; does not measure browser rendering, network, map tiles or phones.
const {performance}=require('node:perf_hooks');
const {trees,batches,legacyResults,legacyClusters,projectedPlaces}=require('./champion-performance-fixture.cjs');
const {filterChampionRecords,sortChampionRecords}=require('../lib/champion-explorer-index.ts');
const {championSpeciesOptions,championSpeciesOptionsForBatches}=require('../lib/champion-species.ts');
const {clusterChampionPlaces}=require('../lib/champion-marker-clusters.ts');
const {emptySelection}=require('../lib/champion-links.ts');
function medianMs(fn) {
 for(let i=0;i<5;i++)fn();
 const times=Array.from({length:21},()=>{const start=performance.now();fn();return performance.now()-start;}).sort((a,b)=>a-b);
 return +times[10].toFixed(3);
}
const selections=['oak','white oak','pine','public','county','massachusetts','douglas',''].map(query=>({...emptySelection,query}));
const ordered=sortChampionRecords(trees,'name');
const optimizedFilter=()=>{for(const selection of selections){const included=new Set(filterChampionRecords(trees,selection));ordered.filter(t=>included.has(t));}};
const places=projectedPlaces(10);
const arrivals=Array.from({length:batches.length},(_,i)=>batches.slice(0,i+1));
const report={date:new Date().toISOString(),runtime:process.version,states:batches.length,records:trees.length,places:places.length,method:'21-run median after 5 warmups. CPU-only Node timings; excludes React, DOM, Leaflet marker reconciliation, downloads and tiles. Search measures 8 successive queries with a cached register and unchanged sort. Species measures a 39-arrival sequence after state summaries are cached. Clusters use Web Mercator projection at zoom 10.',milliseconds:{eightQueries:{before:medianMs(()=>{for(const s of selections)legacyResults(trees,s);}),after:medianMs(optimizedFilter)},speciesArrivalSequence:{before:medianMs(()=>{for(const arrived of arrivals)championSpeciesOptions(arrived.flat().filter(t=>t.scientificName!=='Not supplied by source'));}),after:medianMs(()=>{for(const arrived of arrivals)championSpeciesOptionsForBatches(arrived);})},clustering:{before:medianMs(()=>legacyClusters(places)),after:medianMs(()=>clusterChampionPlaces(places))}}};
process.stdout.write(JSON.stringify(report,null,2)+'\n');
