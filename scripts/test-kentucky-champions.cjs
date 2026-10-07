const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const records = require('../lib/data/kentucky-champion-trees.json');
const coordinates = require('../lib/data/kentucky-county-points.json');
const { championRegions, stateNames, townKey } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');

test('Kentucky source IDs, co-champions and county markers survive sharing', () => {
  assert.equal(records.length, 107);
  assert.equal(new Set(records.map(t => t.id)).size, 107);
  assert.equal(Object.keys(coordinates).length, 57);
  assert.equal(stateNames.KY, 'Kentucky');
  assert.ok(championRegions.southeast.states.includes('KY'));
  for (const t of records) {
    assert.ok(coordinates[t.county]);
    assert.equal(townKey(t), `KY:county:${t.county}`);
    assert.equal(t.publicCoordinates, undefined);
    const selection = readChampionSelection(new URL(championHref({state:'KY', selectedId:t.id}), 'https://example.com').searchParams);
    assert.equal(selection.state, 'KY');
    assert.equal(selection.selectedId, t.id);
  }
  assert.equal(records.filter(t => t.status === 'State co-champion').length, 14);
  assert.equal(records.filter(t => t.scientificName === 'Acer rubrum').length, 2);
  assert.equal(records.filter(t => t.publicAccess === false).length, 61);
  assert.equal(records.filter(t => t.publicAccess === true).length, 0);
});

test('Kentucky retains source discrepancies without inventing dates or scores', () => {
  const byId = id => records.find(t => t.id === `ky-${id}`);
  for (const id of [126, 128, 127]) {
    assert.equal(byId(id).measured, null);
    assert.match(byId(id).sourceReviewNotes.join(' '), /rather than a date/);
  }
  assert.equal(byId(25).measured, '2025-07-17');
  assert.equal(byId(1).points, 327);
  assert.equal(byId(1).measured, '2025');
  assert.match(byId(21).sourceReviewNotes.join(' '), /without state champions/);
  assert.equal(byId(108).county, 'McLean');
  assert.equal(byId(108).sourceCounty, 'McLean/ State Co-Champion');
  assert.equal(byId(57).county, 'Woodford');
});
