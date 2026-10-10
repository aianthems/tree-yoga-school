const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const rows=require('../lib/data/oregon-champion-trees.json'),fixture=require('./fixtures/oregon-champions.json'),points=require('../lib/data/oregon-county-points.json');
const {championStates,championRegions}=require('../lib/champion-states.ts');
const {normalizeChampionRecords,normalizeChampionCoordinates}=require('../lib/champion-state-data.ts');
const {townKey,sourceWarnings}=require('../lib/champion-trees.ts');
const {championHref,readChampionSelection}=require('../lib/champion-links.ts');
test('Oregon preserves all designated champions and excludes pending trees without re-ranking',()=>{
 assert.equal(fixture.length,167);assert.equal(fixture.filter(f=>f.values[2]==='PV').length,35);
 const chosen=fixture.filter(f=>f.values[2]!=='PV');assert.equal(rows.length,132);
 const counts={};
 for(const [i,r] of rows.entries()){
  const f=chosen[i],v=f.values;assert.equal(r.id,`or-r${f.row}`);assert.equal(r.sourceRow,f.row);
  assert.equal(r.scientificName,v[0]);assert.equal(r.commonName,v[1]);assert.deepEqual([r.circumference,r.height,r.crown,r.points],v.slice(3));
  assert.ok(r.status.endsWith(`(${v[2]})`));counts[v[2]]=(counts[v[2]]||0)+1;
  assert.equal(r.measured,null);assert.equal(r.publicAccess,undefined);assert.equal(r.location,null);assert.equal(r.publicCoordinates,undefined);
 }
 assert.deepEqual(counts,{SC:62,NC:52,'NC-C':5,'SC-C':13});
 assert.equal(rows.find(r=>r.scientificName==='Abies amabilis').points,318); // larger PV row remains excluded
 assert.equal(new Set(rows.map(r=>r.id)).size,132);
 assert.equal(rows.filter(r=>r.nationalFlag).length,57);
});
test('Oregon keeps 131 unknown locations searchable and supports the West filter and links',()=>{
 const normalized=normalizeChampionRecords('OR',rows),coords=normalizeChampionCoordinates('OR',points);
 assert.equal(normalized.filter(r=>coords[townKey(r)]).length,1);assert.equal(championStates.OR.unmappedIds.length,131);
 assert.deepEqual(normalized.filter(r=>!coords[townKey(r)]).map(r=>r.id),[...championStates.OR.unmappedIds]);
 assert.ok(rows.filter(r=>!r.county).every(r=>r.town===''&&!r.location));
 assert.ok(championRegions.west.states.includes('OR'));
 const link=championHref({state:'OR',region:'west',selectedId:rows[0].id});
 const parsed=readChampionSelection(new URL(link,'https://treeyogaschool.com').searchParams);assert.equal(parsed.state,'OR');assert.equal(parsed.selectedId,rows[0].id);
});
test('Oregon historical mapping is exact, attributed and separate from published measurements',()=>{
 const r=rows.find(r=>r.county);assert.equal(r.scientificName,'Chamaecyparis lawsoniana');assert.equal(r.county,'Coos');
 assert.deepEqual([r.circumference,r.height,r.crown,r.points],[522,242,35,773]);
 assert.ok(sourceWarnings(r).some(n=>n.includes('2012')&&n.includes('PDF page 58')&&n.includes('historical')));
 assert.deepEqual(Object.keys(points),['Coos']);assert.ok(points.Coos.lat>42&&points.Coos.lat<44);assert.ok(points.Coos.lng>-125&&points.Coos.lng<-123);
 const safe=JSON.stringify(fixture);assert.ok(!safe.includes('Donald Denniston'));assert.ok(!safe.includes('Nominator'));
});
