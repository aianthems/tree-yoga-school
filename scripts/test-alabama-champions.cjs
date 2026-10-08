const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const records = require('../lib/data/alabama-champion-trees.json');
const coordinates = require('../lib/data/alabama-county-points.json');
const { stateNames, townKey, championRegions } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection, emptySelection } = require('../lib/champion-links.ts');
test('Alabama retains every table row and resolves county markers and shared selections', () => {
  assert.equal(records.length, 145);
  assert.equal(new Set(records.map(t => t.id)).size, 145);
  assert.equal(new Set(records.map(t => t.scientificName)).size, 134);
  assert.equal(Object.keys(coordinates).length, 49);
  assert.equal(stateNames.AL, 'Alabama');
  assert.ok(championRegions.southeast.states.includes('AL'));
  for (const tree of records) {
    assert.equal(tree.measured, null);
    assert.equal(tree.publicAccess, undefined);
    assert.equal(tree.location, null);
    assert.match(tree.yearCrowned, /^\d{4}$/);
    assert.match(tree.remeasureDue, /^\d{4}$/);
    assert.ok(tree.sourcePage >= 3 && tree.sourcePage <= 9);
    const p = coordinates[tree.county];
    assert.ok(p && p.lat > 30 && p.lat < 35.1 && p.lng > -89 && p.lng < -84.8);
    assert.equal(townKey(tree), `AL:county:${tree.county}`);
    const selection = { ...emptySelection, state: 'AL', region: 'southeast', county: tree.county, town: townKey(tree), species: tree.scientificName, selectedId: tree.id };
    assert.deepEqual(readChampionSelection(new URL(championHref(selection), 'https://example.com').searchParams), selection);
  }
});
test('Alabama preserves source scores, historical deadlines, repeated species and wrapped names', () => {
  const cypress = records.find(t => t.scientificName === 'Taxodium distichum');
  assert.deepEqual([cypress.circumference, cypress.height, cypress.crown, cypress.points, cypress.yearCrowned, cypress.remeasureDue], [423,105,43,538,'2020','2025']);
  assert.equal(records.find(t => t.scientificName === 'Carya aquatica').remeasureDue, '2016');
  assert.ok(records.some(t => t.scientificName === 'Carya carolinae-septentrionalis'));
  assert.equal(records.filter(t => t.scientificName === 'Populus deltoides').length, 2);
  assert.equal(records.filter(t => t.scientificName === 'Quercus laurifolia').length, 2);
  assert.ok(records.find(t => t.scientificName === 'Magnolia viginiana').sourceReviewNotes.length);
  assert.equal(readChampionSelection(new URLSearchParams('state=al')).state, 'AL');
  assert.equal(readChampionSelection(new URLSearchParams('state=AL&region=midwest')).region, '');
});
