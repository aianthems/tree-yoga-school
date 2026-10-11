const test = require('node:test');
const assert = require('node:assert/strict');
const {readState,validateImports} = require('./validate-champion-imports.cjs');
const {normalizeChampionRecords,normalizeChampionCoordinates} = require('../lib/champion-state-data.ts');
const {championRegions} = require('../lib/champion-states.ts');
const {townKey,sourceWarnings} = require('../lib/champion-trees.ts');
const {filterChampionRecords} = require('../lib/champion-explorer-index.ts');
const {emptySelection,championHref,readChampionSelection} = require('../lib/champion-links.ts');
const fixture = require('./fixtures/arizona-champions-2023.json');
const audit = require('../lib/data/arizona-import-audit.json');
const {records:rows,coordinates:points} = readState('AZ');
const records=normalizeChampionRecords('AZ',rows);

test('Arizona accounts for the entire appendix without duplicate tree IDs or re-ranking',()=>{
 assert.equal(fixture.length,143);assert.equal(rows.length,139);
 assert.equal(new Set(rows.map(r=>r.sourceTreeId)).size,139);
 for(const r of rows){
  const f=fixture.find(f=>f.sourceRow===r.sourceRow);
  assert.deepEqual([r.scientificName,r.commonName,r.sourceTreeId,r.status],[f.scientificName,f.commonName,f.sourceTreeId,f.status]);
  assert.deepEqual([r.circumference,r.height,r.crown,r.points],f.measurements.map(Number));
  assert.equal(r.measured,f.measured==='N/A'?null:f.measured);
 }
 assert.deepEqual(audit.duplicateGroups.map(d=>d.rows),[[4,76],[14,141],[16,48],[28,142]]);
 assert.deepEqual(new Set([...rows.map(r=>r.sourceRow),...audit.duplicateGroups.flatMap(d=>d.rows)]),new Set(fixture.map(f=>f.sourceRow)));
 const cork=rows.find(r=>r.sourceTreeId==='AZ0098');
 assert.equal(cork.sourceRow,76);assert.equal(cork.measured,'2022');
 assert.deepEqual([cork.circumference,cork.height,cork.crown,cork.points],[58,39,28,104]);
 assert.ok(sourceWarnings(cork).some(s=>s.includes('measured 2004')));
 assert.equal(rows.find(r=>r.sourceTreeId==='6360').status,'National Champion, Witness, Heritage');
 assert.equal(rows.find(r=>r.sourceTreeId==='4394').status,'State Champion, Witness, Heritage');
 assert.ok(rows.some(r=>r.status==='National Co-Champion'));
 assert.ok(sourceWarnings(rows.find(r=>r.sourceTreeId==='AZ0033')).some(s=>s.includes('differ by more than one point')));
});
test('Arizona preserves undisclosed geography and uses county points without access claims',()=>{
 const coords=normalizeChampionCoordinates('AZ',points);
 assert.equal(Object.keys(points).length,11);
 assert.equal(records.filter(r=>coords[townKey(r)]).length,138);
 const missing=rows.find(r=>r.sourceTreeId==='AZ0142');assert.equal(missing.county,'');assert.equal(missing.measured,null);
 for(const r of records){assert.equal(r.mapPrecision,'county');assert.equal(r.location,null);assert.equal(r.publicCoordinates,undefined);assert.equal(r.publicAccess,undefined);}
 for(const p of Object.values(points)){assert.ok(p.lat>31&&p.lat<37);assert.ok(p.lng>-115&&p.lng<-109);}
 assert.deepEqual(validateImports(['AZ']).errors,[]);
});
test('Arizona is searchable, included in the West and available through shared record links',()=>{
 assert.ok(championRegions.west.states.includes('AZ'));
 assert.equal(filterChampionRecords(records,{...emptySelection,state:'AZ'}).length,139);
 assert.equal(filterChampionRecords(records,{...emptySelection,state:'AZ',query:'Cork Oak'})[0].id,'az-az0098');
 assert.equal(filterChampionRecords(records,{...emptySelection,state:'AZ',publicOnly:true}).length,0);
 const s=readChampionSelection(new URL(championHref({state:'AZ',region:'west',selectedId:'az-az0098'}),'https://treeyogaschool.com').searchParams);
 assert.equal(s.state,'AZ');assert.equal(s.selectedId,'az-az0098');
});
