const test=require('node:test');
const assert=require('node:assert/strict');
const {readState,validateImports}=require('./validate-champion-imports.cjs');
const {normalizeChampionRecords,normalizeChampionCoordinates}=require('../lib/champion-state-data.ts');
const {championRegions}=require('../lib/champion-states.ts');
const {townKey,sourceWarnings,libraryTreeForSpecies}=require('../lib/champion-trees.ts');
const {filterChampionRecords}=require('../lib/champion-explorer-index.ts');
const {emptySelection,championHref,readChampionSelection}=require('../lib/champion-links.ts');
const fixture=require('./fixtures/california-champions-2026-10-11.json');
const {records:rows,coordinates:points}=readState('CA');
const records=normalizeChampionRecords('CA',rows);
test('California retains every public listing ID, decimal value and explicit designation',()=>{
 assert.equal(rows.length,264);assert.equal(new Set(rows.map(r=>r.sourceTreeId)).size,264);
 for(const [i,r] of rows.entries()){
  const f=fixture[i];
  assert.equal(r.sourceTreeId,String(f.bt_id));
  assert.deepEqual([r.scientificName,r.commonName,r.circumference,r.height,r.crown,r.points,r.measured],[f.accepted_scientific,f.common,f.circumference,f.height,f.crown_width,f.points,f.date_measured]);
  assert.equal(r.stateChampionCode,f.state_champion);assert.equal(r.nationalChampionCode,f.national_champion);
  assert.equal(r.status.includes('Co-champion'),Boolean(f.co_champion));
  assert.ok(r.sourceUrl.endsWith('/bt-tree-detail/'+f.bt_id));
 }
 assert.equal(rows.filter(r=>r.stateChampionCode===1).length,263);
 assert.equal(rows.filter(r=>r.nationalChampionCode===1).length,178);
 assert.equal(rows.filter(r=>r.status.includes('Co-champion')).length,36);
 const only=rows.find(r=>r.id==='ca-229');assert.equal(only.status,'Co-champion');
 assert.ok(sourceWarnings(only).some(s=>s.includes('both unset')));
 assert.equal(rows.find(r=>r.id==='ca-43').notes.includes('year-only legacy'),true);
});
test('California respects missing and hidden geography without importing exact positions or contacts',()=>{
 const coords=normalizeChampionCoordinates('CA',points);
 assert.equal(Object.keys(points).length,46);assert.equal(records.filter(r=>coords[townKey(r)]).length,258);
 assert.deepEqual(rows.filter(r=>!r.county).map(r=>r.id),['ca-43','ca-44','ca-89','ca-137','ca-142','ca-148']);
 for(const r of records){assert.equal(r.location,null);assert.equal(r.town,'');assert.equal(r.publicCoordinates,undefined);assert.equal(r.publicAccess,undefined);assert.equal(r.mapPrecision,'county');}
 for(const id of ['ca-527','ca-528']){const r=rows.find(r=>r.id===id);assert.equal(r.sourceCounty,'Toulumne');assert.equal(r.county,'Tuolumne');assert.ok(sourceWarnings(r).some(s=>s.includes('Toulumne')));}
 assert.equal(fixture.find(r=>r.bt_id===528).hidden,1);assert.equal(rows.find(r=>r.id==='ca-528').publicCoordinates,undefined);
 for(const r of [...rows,...fixture])for(const k of ['latitude','longitude','nom_contact_id','nominator_names','measurer_names','photo_link'])assert.equal(r[k],undefined);
 for(const p of Object.values(points)){assert.ok(p.lat>32&&p.lat<42.1);assert.ok(p.lng>-125&&p.lng<-114);}
 assert.deepEqual(validateImports(['CA']).errors,[]);
});
test('California works in West filters, searches, record links and existing library matches',()=>{
 assert.ok(championRegions.west.states.includes('CA'));
 assert.equal(filterChampionRecords(records,{...emptySelection,state:'CA'}).length,264);
 assert.ok(filterChampionRecords(records,{...emptySelection,state:'CA',query:'FREMONT COTTONWOOD'}).some(r=>r.id==='ca-229'));
 assert.equal(filterChampionRecords(records,{...emptySelection,state:'CA',publicOnly:true}).length,0);
 const s=readChampionSelection(new URL(championHref({state:'CA',region:'west',selectedId:'ca-229'}),'https://treeyogaschool.com').searchParams);
 assert.equal(s.state,'CA');assert.equal(s.selectedId,'ca-229');
 assert.equal(libraryTreeForSpecies('Robinia pseudoacacia').slug,'black-locust');
});
