const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'), ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const rows=require('../lib/data/new-mexico-champion-trees.json');
const fixture=require('./fixtures/new-mexico-champions-2020.json');
const points=require('../lib/data/new-mexico-county-points.json');
const {normalizeChampionRecords,normalizeChampionCoordinates}=require('../lib/champion-state-data.ts');
const {championRegions}=require('../lib/champion-states.ts');
const {townKey}=require('../lib/champion-trees.ts');
test('NM includes only explicit state designations, preserving source numbers and dates',()=>{
 assert.equal(fixture.length,144); const selected=fixture.filter(f=>f.values[1]==='STATE CHAMPION'); assert.equal(selected.length,37); assert.equal(rows.length,37);
 for(const [i,r] of rows.entries()){
  const f=selected[i],v=f.values;
  assert.equal(r.id,`nm-p${f.page}-r${f.row}`); assert.equal(r.commonName,v[0]); assert.equal(r.scientificName,v[3]);
  assert.deepEqual([r.height,r.circumference,r.crown,r.points],v.slice(4,8).map(x=>Number(x.replace(/["']/g,''))));
  assert.equal(r.nominated,v[8]); assert.equal(r.measured,f.remeasured); assert.equal(r.nationalFlag,v[2]||undefined);
  assert.equal(r.sourceCounty,v[9]); assert.equal(r.publicAccess,f.privateProperty?false:undefined); assert.equal(r.location,null); assert.ok(!f.reportedDead);
 }
 assert.equal(rows.filter(r=>r.measured).length,1); assert.equal(rows.find(r=>r.commonName==='Arizona Alder').measured,'2012-04-20');
 assert.equal(rows.filter(r=>r.nationalFlag==='NATIONAL CHAMPION').length,6); assert.equal(rows.filter(r=>r.nationalFlag==='NOMINEE').length,2);
 assert.equal(rows.filter(r=>r.nationalFlag==='NATIONAL CHAMPION - DECERT').length,1);
 assert.ok(!rows.some(r=>r.nationalFlag==='PAST NATIONAL CHAMPION'));
 assert.equal(rows.find(r=>r.commonName==='Alligator Juniper').circumference,239);
});
test('NM review notes expose consent and county conflicts without personal information',()=>{
 assert.equal(rows.filter(r=>r.sourceReviewNotes.some(n=>n.includes('formally nominate'))).length,2);
 assert.ok(rows.find(r=>r.commonName==='Tree-of-Heaven').sourceReviewNotes.some(n=>n.includes('Catron')&&n.includes('Socorro')));
 assert.ok(rows.find(r=>r.nationalFlag?.includes('DECERT')).sourceReviewNotes.some(n=>n.includes('DECERT')));
 const data=JSON.stringify(rows); assert.ok(!data.includes('32.'));
 assert.ok(!data.includes('Nominator')); assert.ok(!data.includes('Street')); assert.ok(rows.every(r=>!r.publicCoordinates));
});
test('NM state and West filters map every record to one of 16 county points',()=>{
 const normalized=normalizeChampionRecords('NM',rows),coords=normalizeChampionCoordinates('NM',points);
 assert.equal(Object.keys(points).length,16); assert.equal(normalized.filter(r=>coords[townKey(r)]).length,37);
 assert.ok(points['Doña Ana']); assert.ok(championRegions.west.states.includes('NM'));
 for(const r of normalized) assert.equal(r.mapPrecision,'county');
 for(const p of Object.values(points)){assert.ok(p.lat>31&&p.lat<37);assert.ok(p.lng>-110&&p.lng<-103);}
});
