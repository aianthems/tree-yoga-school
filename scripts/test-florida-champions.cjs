const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const records = require('../lib/data/florida-champion-trees.json');
const points = require('../lib/data/florida-county-points.json');
const audit = require('../lib/data/florida-import-audit.json');
const { townKey, championRegions } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection, emptySelection } = require('../lib/champion-links.ts');
test('Florida imports unique designated champions and excludes other statuses',()=>{
 assert.equal(records.length,311);assert.equal(new Set(records.map(t=>t.id)).size,311);
 assert.equal(audit.sourceRows,600);assert.equal(audit.excludedRows.length,287);
 assert.deepEqual(audit.duplicateRows.map(r=>r.sourceTreeId),['155','1270']);
 assert.equal(records.filter(t=>t.status.includes('Co-Champion')).length,48);
 assert.deepEqual(records.filter(t=>t.points===0).map(t=>t.id).sort(),['fl-272','fl-930']);
 assert.ok(records.filter(t=>t.points===0).every(t=>t.sourceReviewNotes?.length));
 assert.equal(Object.keys(points).length,47);assert.ok(championRegions.southeast.states.includes('FL'));
 for(const t of records){
  assert.ok(['Florida Champion','Florida Co-Champion','National Champion','National Co-Champion'].includes(t.status));
  assert.equal(t.measured,null);assert.equal(t.publicAccess,undefined);assert.equal(t.publicCoordinates,undefined);
  assert.equal(t.id,'fl-'+t.sourceTreeId);assert.equal(townKey(t),'FL:county:'+t.county);
  const p=points[t.county];assert.ok(p&&p.lat>24&&p.lat<31.1&&p.lng>-88&&p.lng<-79);
  for(const k of ['height','circumference','crown','points'])assert.ok(Number.isFinite(t[k])&&t[k]>=0);
  const selection={...emptySelection,state:'FL',region:'southeast',county:t.county,town:townKey(t),species:t.scientificName,selectedId:t.id};
  assert.deepEqual(readChampionSelection(new URL(championHref(selection),'https://example.com').searchParams),selection);
 }
});
test('Florida preserves published measurements and co-champion records',()=>{
 const oak=records.find(t=>t.id==='fl-1270');assert.deepEqual([oak.circumference,oak.height,oak.crown,oak.points],[438,78,160.5,556]);
 for(const id of ['fl-254','fl-1070'])assert.equal(records.find(t=>t.id===id).status,'National Co-Champion');
 assert.ok(!records.some(t=>['fl-262','fl-78','fl-66'].includes(t.id)));
 assert.equal(readChampionSelection(new URLSearchParams('state=fl')).state,'FL');
});
