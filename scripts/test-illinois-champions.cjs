const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const records = require('../lib/data/illinois-champion-trees.json');
const points = require('../lib/data/illinois-county-points.json');
const audit = require('../lib/data/illinois-import-audit.json');
const { townKey, championRegions, sourceWarnings, stateNames } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection, emptySelection } = require('../lib/champion-links.ts');

test('Illinois includes populated source records, preserves co-champions, and maps counties', () => {
  assert.equal(records.length, 124);
  assert.equal(new Set(records.map(t => t.id)).size, 124);
  assert.equal(new Set(records.map(t => t.scientificName)).size, 106);
  assert.equal(audit.sourceRows, 202);
  assert.equal(audit.excludedRows.length, 78);
  assert.equal(records.filter(t => t.status === 'Illinois co-champion').length, 18);
  assert.equal(Object.keys(points).length, 47);
  assert.equal(stateNames.IL, 'Illinois');
  assert.ok(championRegions.midwest.states.includes('IL'));
  for (const tree of records) {
    assert.ok(!audit.excludedRows.some(row => row.sourceTreeId === tree.sourceTreeId));
    assert.equal(tree.id, 'il-' + tree.sourceTreeId);
    assert.equal(townKey(tree), 'IL:county:' + tree.county);
    assert.equal(tree.measured, null);
    assert.equal(tree.publicAccess, undefined);
    assert.equal(tree.publicCoordinates, undefined);
    assert.equal(tree.location, null);
    const point = points[tree.county];
    assert.ok(point.lat > 36.9 && point.lat < 42.6 && point.lng > -91.6 && point.lng < -87.4);
    for (const field of ['height', 'crown', 'points']) assert.ok(Number.isFinite(tree[field]) && tree[field] >= 0);
    const selection = { ...emptySelection, state: 'IL', region: 'midwest', county: tree.county, town: townKey(tree), species: tree.scientificName, selectedId: tree.id };
    assert.deepEqual(readChampionSelection(new URL(championHref(selection), 'https://example.com').searchParams), selection);
  }
});

test('Illinois preserves source units, combined years, missing values, and unusual forms', () => {
  const boxelder = records.find(t => t.id === 'il-2');
  assert.deepEqual([boxelder.circumferenceFeet, boxelder.circumference, boxelder.height, boxelder.crown, boxelder.points], [6, 72, 82, 52, 167]);
  assert.equal(sourceWarnings(boxelder).length, 0);
  for (const tree of records.filter(t => t.circumferenceFeet !== null)) assert.equal(tree.circumference, Math.round(tree.circumferenceFeet * 12 * 100000) / 100000);
  assert.equal(records.find(t => t.id === 'il-10').yearListed, '1999 / 2022');
  const silverbell = records.find(t => t.id === 'il-96');
  assert.equal(silverbell.circumference, null);
  assert.equal(silverbell.circumferenceFeet, null);
  assert.ok(sourceWarnings(silverbell).some(note => note.includes('not inferred')));
  assert.ok(sourceWarnings(records.find(t => t.id === 'il-126')).some(note => note.includes('non-typical')));
  assert.equal(records.find(t => t.id === 'il-5').county, 'St. Clair');
  assert.equal(records.find(t => t.id === 'il-5').sourceCounty, 'Saint Clair');
  assert.equal(readChampionSelection(new URLSearchParams('state=il')).state, 'IL');
});
