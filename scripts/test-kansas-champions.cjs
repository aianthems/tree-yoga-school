const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const rows = require('../lib/data/kansas-champion-trees.json');
const points = require('../lib/data/kansas-place-points.json');
const audit = require('../lib/data/kansas-import-audit.json');
const { championRegions, townKey } = require('../lib/champion-trees.ts');
const { normalizeChampionCoordinates } = require('../lib/champion-state-data.ts');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');
test('Kansas retains every row, dates, co-champions and explicit unmapped places', () => {
  assert.equal(rows.length, 148); assert.equal(new Set(rows.map(r => r.id)).size, 148);
  assert.deepEqual(rows.map(r => r.sourceRow), Array.from({length:148}, (_,i)=>i+1));
  assert.equal(rows.filter(r => r.status === 'State co-champion').length, 4);
  assert.equal(Object.keys(points).length, 60);
  const normalized = normalizeChampionCoordinates('KS', points);
  assert.equal(rows.filter(r => normalized[townKey(r)]).length, 134);
  assert.deepEqual(rows.filter(r => !normalized[townKey(r)]).map(r=>r.id), audit.unmapped.map(r=>r.id));
  assert.ok(championRegions.midwest.states.includes('KS'));
  for(const r of rows) {
    assert.equal(r.state, 'KS'); assert.equal(r.county, ''); assert.equal(r.location, null);
    assert.equal(r.publicAccess, undefined); assert.equal(r.publicCoordinates, undefined);
    assert.match(r.measured, /^\d{4}-\d{2}-\d{2}$/);
    const selection=readChampionSelection(new URL(championHref({state:'KS', selectedId:r.id}),'https://example.com').searchParams);
    assert.equal(selection.state,'KS');assert.equal(selection.selectedId,r.id);
  }
});
test('Kansas preserves unequal co-champion scores, source spelling and separate nomination dates', () => {
  const catalpas=rows.filter(r=>r.scientificName==='Catalpa speciosa');
  assert.deepEqual(catalpas.map(r=>r.points),[318,320]);
  assert.ok(catalpas.every(r=>r.status==='State co-champion'));
  const chokecherry=rows.find(r=>r.scientificName==='Prunus virginiana');
  assert.equal(chokecherry.nominated,'2026');assert.equal(chokecherry.measured,'2020-03-13');
  assert.ok(rows.some(r=>r.scientificName==='Psueotsuga menziesii'));
  assert.ok(rows.every(r=>!Object.hasOwn(r,'nominator')));
});
