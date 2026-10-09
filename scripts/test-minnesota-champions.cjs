const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const records=require('../lib/data/minnesota-champion-trees.json');
const points=require('../lib/data/minnesota-county-points.json');
const audit=require('../lib/data/minnesota-import-audit.json');
const {championRegions,townKey}=require('../lib/champion-trees.ts');
const {championHref,readChampionSelection,emptySelection}=require('../lib/champion-links.ts');
test('Minnesota retains every listed champion and all co-champions',()=>{
 assert.equal(records.length,62);assert.equal(new Set(records.map(r=>r.id)).size,62);
 assert.equal(new Set(records.map(r=>r.scientificName)).size,51);
 assert.equal(audit.completeRegisterRetrieved,true);
 assert.deepEqual(audit.emptySpecies,['Northern mountain ash','Mountain maple']);
 assert.equal(records.filter(r=>r.status==='Co-champion').length,20);
 for(const r of records){
  assert.equal(r.points,r.circumference+r.height+r.crown/4);
  assert.equal(r.status,records.filter(other=>other.scientificName===r.scientificName).length>1?'Co-champion':'State champion');
 }
});
test('Minnesota county links preserve source years and ownership without inventing tree locations or access',()=>{
 assert.equal(Object.keys(points).length,28);assert.ok(championRegions.midwest.states.includes('MN'));
 assert.equal(records.filter(r=>r.publicAccess===false).length,24);assert.equal(records.filter(r=>r.publicAccess===true).length,0);
 for(const r of records){
  assert.equal(r.measured,null);assert.match(r.yearListed,/^\d{4}$/);assert.equal(r.publicCoordinates,undefined);
  assert.equal(r.publicAccess,r.notes.startsWith('Ownership: Private.')?false:undefined);
  const p=points[r.county];assert.ok(p.lat>43&&p.lat<50&&p.lng>-98&&p.lng<-89);
  assert.equal(townKey(r),'MN:county:'+r.county);
  const selection={...emptySelection,state:'MN',region:'midwest',county:r.county,selectedId:r.id};
  assert.deepEqual(readChampionSelection(new URL(championHref(selection),'https://example.com').searchParams),selection);
 }
 assert.ok(records.some(r=>r.sourceCounty==='Fairibault'&&r.county==='Faribault'));
});
