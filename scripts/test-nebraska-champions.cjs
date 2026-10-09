const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m,f) => m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const rows = require('../lib/data/nebraska-champion-trees.json');
const points = require('../lib/data/nebraska-place-points.json');
const audit = require('../lib/data/nebraska-import-audit.json');
const fixture = require('./fixtures/nebraska-champions-2026-10-09.json');
const {championRegions,townKey} = require('../lib/champion-trees.ts');
const {normalizeChampionCoordinates} = require('../lib/champion-state-data.ts');
const {championHref,readChampionSelection} = require('../lib/champion-links.ts');
const date = v => {
 if (/^\d{4}$/.test(v)) return v;
 const [month,day,year]=v.split('/');
 return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
};
test('Nebraska retains every source name, measurement, score and date with correct units and precision', () => {
 assert.equal(rows.length,90); assert.equal(new Set(rows.map(r=>r.id)).size,90);
 rows.forEach((r,i) => {
  const [common,scientific,circ,height,crown,score,nominated,measured]=fixture[i];
  assert.equal(r.sourceRow,i+1);assert.equal(r.commonName,common);assert.equal(r.scientificName,scientific);
  const inches = circ.endsWith('"');
  assert.ok(Math.abs(r.circumference-parseFloat(circ)*(inches?1:12))<1e-9);
  assert.equal(r.height,Number(height));assert.equal(r.crown,Number(crown));assert.equal(r.points,Number(score));
  assert.equal(r.measured,date(measured));assert.equal(r.nominated,date(nominated));
  assert.equal(r.status,'Listed in Nebraska champion register');assert.equal(r.county,'');
  assert.equal(r.publicAccess,undefined);assert.equal(r.publicCoordinates,undefined);
 });
 assert.equal(rows[85].circumference,124);
 assert.equal(rows[16].circumference,446.4);
 assert.equal(rows[65].circumference,117.864);
 assert.equal(rows.filter(r=>r.commonName.startsWith('Pine, Jack')).length,3);
 assert.equal(rows[3].measured,'2006-10-17');assert.equal(rows[0].measured,'2002');
 // Published inconsistencies and spellings must not be silently repaired.
 assert.equal(rows[54].points,267);assert.equal(rows[26].scientificName,'Pseudotsugo menziesii');
 assert.equal(rows[88].scientificName,'Liridendron tulipifera');
});
test('Nebraska geography, source links and shareable selection preserve unmapped records', () => {
 const normalized=normalizeChampionCoordinates('NE',points);
 assert.equal(Object.keys(points).length,42);assert.equal(rows.filter(r=>normalized[townKey(r)]).length,83);
 assert.deepEqual(rows.filter(r=>!normalized[townKey(r)]).map(r=>r.id),audit.unmapped.map(r=>r.id));
 assert.ok(championRegions.midwest.states.includes('NE'));
 for(const r of rows) {
  assert.equal(r.sourceUrl,'https://nfs.unl.edu/registry/');
  const selection=readChampionSelection(new URL(championHref({state:'NE',selectedId:r.id}),'https://example.com').searchParams);
  assert.equal(selection.state,'NE');assert.equal(selection.selectedId,r.id);
 }
 for(const p of Object.values(points)) assert.ok(p.lat>40 && p.lat<43.1 && p.lng>-104.1 && p.lng<-95);
 const text=JSON.stringify(rows);
 assert.ok(!text.includes('41.758882'));assert.ok(!text.includes('Raymond Yost'));assert.ok(!text.includes('Gary Johnson'));assert.ok(!text.includes('Maureen'));
});
