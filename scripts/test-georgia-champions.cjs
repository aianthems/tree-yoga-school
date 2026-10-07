const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const records = require('../lib/data/georgia-champion-trees.json');
const coordinates = require('../lib/data/georgia-county-points.json');
const audit = require('../lib/data/georgia-import-audit.json');
const { townKey, placeName, championRegions, stateNames } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');

test('Georgia preserves source identities and leaves missing counties unmapped', () => {
  assert.equal(records.length, 403);
  assert.equal(new Set(records.map(t => t.id)).size, 403);
  assert.equal(Object.keys(coordinates).length, 99);
  assert.equal(records.filter(t => coordinates[t.county]).length, 398);
  assert.equal(audit.listRows, 407);
  assert.deepEqual(Object.keys(audit.duplicateIds).sort(), ['1673', '1950']);
  assert.equal(stateNames.GA, 'Georgia');
  assert.ok(championRegions.southeast.states.includes('GA'));
  for (const tree of records) {
    assert.equal(tree.id, `ga-${tree.sourceTreeId}`);
    assert.equal(townKey(tree), `GA:county:${tree.county}`);
    assert.equal(tree.publicAccess, undefined);
    assert.equal(tree.publicCoordinates, undefined);
    assert.equal(tree.location, null);
    assert.match(tree.sourceUrl, /^https:\/\/gatrees.org\/champion_tree\//);
    if (!tree.county) {
      assert.equal(coordinates[tree.county], undefined);
      assert.equal(placeName(tree), 'County not listed');
    }
    if (tree.measured) assert.match(tree.measured, /^\d{4}-\d{2}-\d{2}$/);
    const state = readChampionSelection(new URL(championHref({ state: 'GA', region: 'southeast', selectedId: tree.id }), 'https://example.com').searchParams);
    assert.equal(state.state, 'GA');
    assert.equal(state.region, 'southeast');
    assert.equal(state.selectedId, tree.id);
  }
});

test('Georgia retains published measurements, dates and conflicting duplicate notes', () => {
  const liveOak = records.find(t => t.id === 'ga-1426');
  assert.equal(liveOak.height, 78);
  assert.equal(liveOak.circumference, 440);
  assert.equal(liveOak.crown, 161);
  assert.equal(liveOak.points, 558);
  assert.equal(liveOak.measured, '2019-08-15');
  const pecan = records.find(t => t.id === 'ga-1950');
  assert.equal(pecan.sourceUrl, 'https://gatrees.org/champion_tree/1950-2/');
  assert.equal(pecan.county, 'Newton');
  assert.equal(pecan.measured, '2025-06-04');
  assert.ok(pecan.sourceReviewNotes.some(note => note.includes('Repeated summary rows differ')));
  assert.ok(records.filter(t => t.sourceCounty === 'Dekalb').every(t => t.county === 'DeKalb'));
});
