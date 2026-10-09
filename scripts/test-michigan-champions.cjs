const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const records = require('../lib/data/michigan-champion-trees.json');
const points = require('../lib/data/michigan-county-points.json');
const audit = require('../lib/data/michigan-import-audit.json');
const { townKey, championRegions, sourceWarnings, stateNames } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection, emptySelection } = require('../lib/champion-links.ts');

test('Michigan includes only highest-score leaders, with exact ties and one magnolia category', () => {
  assert.equal(audit.sourceRows, 667);
  assert.equal(records.length, 122);
  assert.equal(audit.candidates.length, 667);
  assert.equal(audit.candidates.filter(r => !r.included).length, 545);
  assert.equal(new Set(audit.candidates.map(r => r.category)).size, 120);
  const included = new Set(records.map(r => r.sourceTreeId));
  const groups = new Map();
  for (const row of audit.candidates) {
    groups.set(row.category, [...(groups.get(row.category) || []), row]);
  }
  for (const rows of groups.values()) {
    const highest = Math.max(...rows.map(r => r.points));
    for (const row of rows) {
      assert.equal(row.included, row.points === highest);
      assert.equal(included.has(row.sourceTreeId), row.points === highest);
    }
  }
  assert.equal(included.size, 122);
  assert.equal(records.filter(r => r.status === 'Michigan score-based tied leader').length, 4);
  assert.ok(included.has('1271') && included.has('1679') && included.has('2672') && included.has('2687'));
  assert.equal(records.filter(r => /magnolia\s*x\s*soulangeana/i.test(r.scientificName)).length, 1);
  assert.ok(included.has('2443'));
  assert.ok(!included.has('1334'), 'Variety metadata must not promote a smaller horse chestnut');
  assert.ok(!included.has('1955'), 'Variety metadata must not promote a smaller European beech');
});

test('Michigan maps county areas and preserves dates, measurements, and qualified names', () => {
  assert.equal(stateNames.MI, 'Michigan');
  assert.ok(championRegions.midwest.states.includes('MI'));
  assert.equal(Object.keys(points).length, 38);
  for (const tree of records) {
    assert.equal(tree.id, 'mi-' + tree.sourceTreeId);
    assert.equal(townKey(tree), 'MI:county:' + tree.county);
    assert.equal(tree.location, null);
    assert.equal(tree.publicCoordinates, undefined);
    assert.equal(tree.publicAccess, undefined);
    assert.ok(tree.commonName && tree.scientificName);
    const point = points[tree.county];
    assert.ok(point.lat > 41.6 && point.lat < 48.4 && point.lng > -90.5 && point.lng < -82.1);
    for (const field of ['circumference', 'height', 'crown', 'points']) assert.ok(Number.isFinite(tree[field]) && tree[field] >= 0);
    const selection = { ...emptySelection, state: 'MI', region: 'midwest', county: tree.county, town: townKey(tree), species: tree.scientificName, selectedId: tree.id };
    assert.deepEqual(readChampionSelection(new URL(championHref(selection), 'https://example.com').searchParams), selection);
  }
  const butternut = records.find(t => t.id === 'mi-1679');
  assert.deepEqual([butternut.circumference, butternut.height, butternut.crown, butternut.points, butternut.measured], [228.6, 42, 57.5, 285, '2020-09-14']);
  assert.ok(sourceWarnings(butternut).some(n => n.includes('lost branches')));
  assert.equal(records.filter(t => t.measured && t.measured < '2016-10-09').length, 5);
  assert.ok(sourceWarnings(records.find(t => t.id === 'mi-1993')).some(n => n.includes('ten years')));
  assert.equal(records.find(t => t.id === 'mi-2644').measured, null);
  assert.ok(sourceWarnings(records.find(t => t.id === 'mi-2443')).some(n => n.includes('Common name')));
});
