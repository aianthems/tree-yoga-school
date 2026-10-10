const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const rows=require('../lib/data/washington-champion-trees.json'),fixture=require('./fixtures/washington-champions.json'),points=require('../lib/data/washington-county-points.json');
const {championStates,championRegions}=require('../lib/champion-states.ts');
const {normalizeChampionRecords,normalizeChampionCoordinates}=require('../lib/champion-state-data.ts');
const {townKey,sourceWarnings}=require('../lib/champion-trees.ts');
const {championHref,readChampionSelection}=require('../lib/champion-links.ts');
test('Washington imports all explicit champions and co-champions with original values',()=>{
 assert.equal(fixture.length,292);assert.equal(fixture.filter(f=>f.values[2]==='PV').length,13);
 const chosen=fixture.filter(f=>f.values[2]!=='PV');assert.equal(rows.length,279);const counts={};
 for(const [i,r] of rows.entries()){
  const f=chosen[i],v=f.values;assert.equal(r.id,`wa-r${f.row}`);assert.equal(r.sourceRow,f.row);
  assert.equal(r.scientificName,v[0]);assert.equal(r.commonName,v[1]);assert.deepEqual([r.circumference,r.height,r.crown,r.points],v.slice(3));
  assert.ok(r.status.endsWith(`(${v[2]})`));counts[v[2]]=(counts[v[2]]||0)+1;
  assert.equal(r.measured,null);assert.equal(r.publicAccess,undefined);assert.equal(r.location,null);assert.equal(r.publicCoordinates,undefined);
 }
 assert.deepEqual(counts,{'NC-C':7,SC:166,'SC-C':79,NC:27});
 assert.equal(new Set(rows.map(r=>r.id)).size,279);assert.equal(rows.filter(r=>r.nationalFlag).length,34);
 const hemlocks=rows.filter(r=>r.scientificName==='Tsuga heterophylla');assert.equal(hemlocks.length,2);assert.deepEqual(hemlocks.map(r=>r.points),[549,527]);
});
test('Washington unknown geography stays unmapped and works in state/West links',()=>{
 const normalized=normalizeChampionRecords('WA',rows),coords=normalizeChampionCoordinates('WA',points);
 assert.equal(normalized.filter(r=>coords[townKey(r)]).length,1);assert.equal(championStates.WA.unmappedIds.length,278);
 assert.deepEqual(normalized.filter(r=>!coords[townKey(r)]).map(r=>r.id),[...championStates.WA.unmappedIds]);
 assert.ok(rows.filter(r=>!r.county).every(r=>r.town===''&&!r.location));assert.ok(championRegions.west.states.includes('WA'));
 const link=championHref({state:'WA',region:'west',selectedId:rows[0].id});const parsed=readChampionSelection(new URL(link,'https://treeyogaschool.com').searchParams);
 assert.equal(parsed.state,'WA');assert.equal(parsed.region,'west');assert.equal(parsed.selectedId,rows[0].id);
});
test('Only the exactly matching silver fir receives the attributed historical county',()=>{
 const firs=rows.filter(r=>r.scientificName==='Abies amabilis');assert.equal(firs.length,2);
 assert.equal(firs[0].points,446);assert.equal(firs[0].county,'');assert.equal(firs[1].points,444);assert.equal(firs[1].county,'Clallam');
 assert.deepEqual([firs[1].circumference,firs[1].height,firs[1].crown,firs[1].points],[212,222,38,444]);
 assert.ok(sourceWarnings(firs[1]).some(n=>n.includes('2020')&&n.includes('2915')&&n.includes('historical')));
 assert.deepEqual(Object.keys(points),['Clallam']);assert.ok(points.Clallam.lat>47&&points.Clallam.lat<49);assert.ok(points.Clallam.lng>-125&&points.Clallam.lng<-122);
 const safe=JSON.stringify(fixture);assert.ok(!safe.includes('Nominator'));assert.ok(!safe.includes('Steve Sillett'));
});
