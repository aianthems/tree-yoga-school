const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const records = require('../lib/data/ohio-champion-trees.json');
const points = require('../lib/data/ohio-county-points.json');
const audit = require('../lib/data/ohio-import-audit.json');
const { townKey, championRegions, sourceWarnings, stateNames } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection, emptySelection } = require('../lib/champion-links.ts');
test('Ohio accurately labels screenshot coverage and preserves visible records', () => {
  assert.equal(records.length, 25);
  assert.equal(audit.coverage, 'partial');
  assert.equal(audit.completeRegisterRetrieved, false);
  assert.equal(records.filter(r => r.sourceUrl === audit.sourceUrls[0]).length, 7);
  assert.equal(records.filter(r => r.sourceUrl === audit.sourceUrls[1]).length, 18);
  assert.equal(new Set(records.map(r => r.id)).size, 25);
  const chestnut = records.find(r => r.scientificName === 'Castanea mollissima');
  assert.deepEqual([chestnut.circumference, chestnut.height, chestnut.crown, chestnut.points], [158.6, 55, 57.5, 228]);
  const elm = records.find(r => r.scientificName === 'Ulmus americana');
  assert.equal(elm.points, 333);
  assert.equal(elm.circumference + elm.height + elm.crown / 4, 261);
  assert.ok(sourceWarnings(elm).some(w => w.includes('333') && w.includes('261')));
});
test('Ohio county areas and shared filter URLs preserve access uncertainty', () => {
  assert.equal(stateNames.OH, 'Ohio');
  assert.ok(championRegions.midwest.states.includes('OH'));
  assert.equal(Object.keys(points).length, 15);
  for (const tree of records) {
    assert.equal(townKey(tree), 'OH:county:' + tree.county);
    assert.equal(tree.location, null);
    assert.equal(tree.measured, null);
    assert.equal(tree.publicCoordinates, undefined);
    assert.equal(tree.publicAccess, undefined);
    const point = points[tree.county];
    assert.ok(point.lat > 38 && point.lat < 42 && point.lng > -85 && point.lng < -80);
    const selection = { ...emptySelection, state: 'OH', region: 'midwest', county: tree.county, town: townKey(tree), species: tree.scientificName, selectedId: tree.id };
    assert.deepEqual(readChampionSelection(new URL(championHref(selection), 'https://example.com').searchParams), selection);
  }
});
