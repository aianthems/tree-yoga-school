const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { treeVisits } = require('../lib/tree-visits.ts');
const { visitPreviews, visitTypes, filterVisits, readVisitSelection, visitHref, emptyVisitSelection } = require('../lib/tree-visit-discovery.ts');
const visits = visitPreviews(treeVisits);
test('all current guides have a browse category, species name, and real guide and practice routes', () => {
  assert.equal(visits.length, 19);
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
test('New England outings expose source-backed access and licensed destination photographs', () => {
  const batch = treeVisits.filter(visit => visit.outing);
  assert.equal(batch.length, 5);
  assert.deepEqual(batch.map(visit => visit.state), ['NH', 'NH', 'VT', 'MA', 'ME']);
  assert.equal(filterVisits(visits, { ...emptyVisitSelection, state: 'NH' }).length, 3);
  assert.equal(filterVisits(visits, { ...emptyVisitSelection, state: 'ME' }).length, 1);
  for (const visit of batch) {
    assert.equal(visit.checked, '2026-10-12');
    assert.ok(visit.outing.distance && visit.outing.terrain && visit.outing.fee);
    assert.ok(visit.sources.length >= 3);
    assert.ok(visit.photoLink || visit.destinationPhotos?.length);
    for (const photo of visit.destinationPhotos || []) {
      assert.ok(fs.existsSync(`public${photo.image}`));
      assert.match(photo.photographer, /National Park Service/);
      assert.match(photo.license, /Public domain/i);
      assert.ok(photo.width > 0 && photo.height > 0);
      assert.match(photo.sourceUrl, /^https:\/\/commons.wikimedia.org\/wiki\/File:Gifford_Woods/);
    }
  }
  assert.match(batch.find(v => v.slug === 'the-rocks-woodland').walking, /weekdays April 1–November 20/);
  assert.match(batch.find(v => v.slug === 'arnold-hemlock-hill').walking, /not wheelchair accessible/i);
});
