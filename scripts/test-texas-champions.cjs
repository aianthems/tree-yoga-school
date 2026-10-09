const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const rows=require('../lib/data/texas-champion-trees.json');const points=require('../lib/data/texas-county-points.json');const audit=require('../lib/data/texas-import-audit.json');const fixture=require('./fixtures/texas-champions-2026-10-09.json');
const {formatChampionDate,championRegions,townKey}=require('../lib/champion-trees.ts');const {normalizeChampionCoordinates}=require('../lib/champion-state-data.ts');const {championHref,readChampionSelection}=require('../lib/champion-links.ts');
test('Texas imports the complete deduplicated champion union with exact source values and codes',()=>{
 assert.equal(rows.length,232);assert.equal(new Set(rows.map(r=>r.id)).size,232);
 assert.equal(rows.filter(r=>[1,2].includes(r.stateChampionCode)).length,229);assert.equal(rows.filter(r=>[1,2].includes(r.nationalChampionCode)).length,54);
 assert.equal(rows.filter(r=>[1,2].includes(r.stateChampionCode)&&[1,2].includes(r.nationalChampionCode)).length,51);
 assert.equal(rows.filter(r=>r.stateChampionCode===2).length,49);assert.equal(rows.filter(r=>r.nationalChampionCode===2).length,14);
 rows.forEach((r,i)=>{
  const s=fixture[i];assert.equal(r.id,`tx-${s.TreeID}`);assert.equal(r.sourceTreeId,String(s.TreeID));
  assert.equal(r.commonName,s.AlphaSpeciesAKA.trim());assert.equal(r.scientificName,s.LatinName.trim());assert.equal(r.county,s.CountyName.trim());
  for(const [key,source] of [['circumference','Circumference'],['height','TreeHeight'],['crown','Spread'],['points','TreeIndex'],['stateChampionCode','StateChampion'],['nationalChampionCode','NationalChampion']])assert.equal(r[key],s[source]);
  assert.equal(formatChampionDate(r.measured),s.MeasurementDateString);assert.equal(r.nominated,s.NominationDateString);assert.equal(r.certified,s.CertificationDateString);
  assert.equal(r.status,{1:'State champion',2:'State co-champion'}[s.StateChampion]||'State title not listed');
  assert.equal(r.nationalFlag,{1:'National champion',2:'National co-champion'}[s.NationalChampion]||'');
 });
 assert.equal(audit.totalRegistry,661);assert.equal(audit.included,232);assert.equal(audit.overlap,51);
});
test('Texas uses only county markers and preserves ownership without inferring public visiting access',()=>{
 const normalized=normalizeChampionCoordinates('TX',points);assert.equal(Object.keys(points).length,79);assert.equal(rows.filter(r=>normalized[townKey(r)]).length,232);
 assert.equal(rows.filter(r=>r.publicAccess===false).length,152);assert.equal(rows.filter(r=>r.accessDetails.startsWith('Public ownership')).length,72);assert.equal(rows.filter(r=>r.accessDetails.startsWith('Ownership and')).length,8);
 rows.forEach((r,i)=>{
  assert.equal(r.publicCoordinates,undefined);assert.notEqual(r.publicAccess,true);assert.equal(r.location,fixture[i].PublicOrPrivate===1?fixture[i].OrganizationName:null);
  assert.equal(r.mapPrecision,'county');assert.equal(r.town,'');
  for(const forbidden of ['LatDec','LongDec','Display','OrganizationName'])assert.ok(!Object.hasOwn(r,forbidden));
  const s=readChampionSelection(new URL(championHref({region:'south-central',state:'TX',selectedId:r.id}),'https://example.com').searchParams);assert.equal(s.state,'TX');assert.equal(s.selectedId,r.id);assert.equal(s.region,'south-central');
 });
 for(const p of Object.values(points))assert.ok(p.lat>25 && p.lat<37 && p.lng>-107 && p.lng<-93);
 assert.ok(championRegions['south-central'].states.includes('TX'));
});
test('champion dates display source year, month and day precision without inventing dates',()=>{
 assert.equal(formatChampionDate(null),'Not listed');assert.equal(formatChampionDate('2002'),'2002');assert.equal(formatChampionDate('2025-04'),'April 2025');assert.equal(formatChampionDate('2006-10-17'),'October 17, 2006');
});
