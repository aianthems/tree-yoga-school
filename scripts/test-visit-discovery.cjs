const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { treeVisits } = require('../lib/tree-visits.ts');
const { visitPreviews, visitTypes, filterVisits, readVisitSelection, visitHref, emptyVisitSelection } = require('../lib/tree-visit-discovery.ts');
const visits = visitPreviews(treeVisits);
test('all current guides have a browse category, species name, and real guide and practice routes', () => {
  assert.equal(visits.length, 14);
  for (const visit of visits) {
    assert.ok(visitTypes.some(type => type.value === visit.type), visit.slug);
    assert.notEqual(visit.species, visit.scientificName);
    assert.ok(fs.existsSync('app/tree-visits/[slug]/page.tsx'));
    assert.match(visit.practiceHref, /^\/practice\/[a-z-]+$/);
    assert.ok(!('arrival' in visit));
  }
  for (const type of visitTypes) assert.ok(filterVisits(visits, { ...emptyVisitSelection, type: type.value }).length);
});
test('filters intersect and reset restores all guides in editorial order', () => {
  assert.deepEqual(filterVisits(visits, { state: 'MA', species: 'Platanus occidentalis', type: 'sidewalk' }).map(v => v.slug), ['sunderland-buttonball']);
  assert.equal(filterVisits(visits, { state: 'MA', species: 'Platanus occidentalis', type: 'campus' }).length, 0);
  assert.equal(filterVisits(visits, { ...emptyVisitSelection, species: 'Taxodium distichum' }).length, 2);
  assert.deepEqual(filterVisits(visits, emptyVisitSelection).map(v => v.slug), treeVisits.map(v => v.slug));
});
test('shared selections round-trip and unknown URL filters recover safely', () => {
  const selection = { state: 'MA', species: 'Platanus occidentalis', type: 'sidewalk' };
  assert.deepEqual(readVisitSelection(new URLSearchParams(visitHref(selection).split('?')[1]), visits), selection);
  assert.deepEqual(readVisitSelection(new URLSearchParams('state=XX&species=unknown&type=private'), visits), emptyVisitSelection);
  assert.equal(visitHref(emptyVisitSelection), '/tree-visits');
});
