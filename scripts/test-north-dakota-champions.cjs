const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, f);
const rows = require('../lib/data/north-dakota-champion-trees.json'), points = require('../lib/data/north-dakota-county-points.json'), audit = require('../lib/data/north-dakota-import-audit.json'), fixture = require('./fixtures/north-dakota-champions.json');
const { championStates, championRegions } = require('../lib/champion-states.ts');
const { validateChampionState } = require('../lib/champion-validation.ts');
const { normalizeChampionRecords } = require('../lib/champion-state-data.ts');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');
const { sourceWarnings, townKey } = require('../lib/champion-trees.ts');
test('North Dakota follows the published first-place section and reconciles all announced additions', () => {
  assert.equal(rows.length, 87); assert.equal(fixture.length, 87); assert.equal(new Set(rows.map(t => t.id)).size, 87);
  assert.equal(audit.sourceRecords, 137); assert.equal(audit.excludedSecondPlace, 50); assert.equal(audit.olderChampions, 82);
  assert.match(audit.lastPublished, /^2026-05-27/); assert.equal(audit.announcementChampionsReconciled.length, 13);
  for (const excluded of audit.excluded) assert.ok(!rows.some(t => t.sourceTreeId === excluded.sourceNode));
  for (const f of fixture) {
    const t = rows.find(t => t.sourceTreeId === f.sourceNode);
    assert.equal(t.commonName, f.commonName); assert.equal(t.scientificName, f.scientificName); assert.equal(t.measured, f.measured); assert.equal(t.points, f.points);
  }
  const river = rows.find(t => t.commonName === 'Birch, River');
  assert.deepEqual([river.circumference, river.height, river.crown, river.points], [60.6, 58, 59.5, 133.6]);
  assert.match(sourceWarnings(river).join(' '), /60.6 inches.*60.7 inches/);
  const norway = rows.find(t => t.commonName === 'Spruce, Norway'); assert.equal(norway.crown, 48); assert.match(sourceWarnings(norway).join(' '), /38.5/);
  const miyabe = rows.find(t => t.commonName === 'Maple, Miyabe'); assert.equal(miyabe.measured, '2023-06'); assert.equal(miyabe.county, 'Cass');
  const juneberry = rows.find(t => t.commonName === 'Juneberry'); assert.equal(juneberry.scientificName, 'Ameliancher alnifolia'); assert.equal(juneberry.circumference, 89); assert.ok(sourceWarnings(juneberry).some(s => /published points.*calculated/i.test(s)));
  const red = rows.find(t => t.commonName === 'Maple, Red'); assert.deepEqual([red.scientificName, red.height, red.points], ['Acer rubra', 20, 107]); assert.ok(sourceWarnings(red).some(s => /calculated/.test(s)));
});
test('North Dakota maps only supported county matches and omits individual locations and personal fields', () => {
  assert.deepEqual(validateChampionState('ND', rows, points).errors, []);
  assert.equal(Object.keys(points).length, 15); assert.equal(rows.filter(t => t.county).length, 80);
  const trees = normalizeChampionRecords('ND', rows);
  for (const tree of trees) {
    assert.equal(tree.mapPrecision, 'county'); assert.equal(tree.location, null); assert.equal(tree.publicAccess, undefined); assert.equal(tree.publicCoordinates, undefined);
    assert.equal(Object.hasOwn(tree, 'owner'), false); assert.equal(Object.hasOwn(tree, 'nominator'), false);
    if (!tree.county) assert.ok(!points[tree.county]);
    const evidence = audit.reconciliation.find(r => r.sourceNode === tree.sourceTreeId);
    if (evidence.geographyEvidence.includes('exact scientific-name')) assert.ok(tree.sourceReviewNotes.some(s => /all three measurements/.test(s)));
  }
  assert.deepEqual(trees.filter(t => !t.county).map(t => t.id).sort(), [...championStates.ND.unmappedIds].sort());
  assert.ok(championRegions.midwest.states.includes('ND'));
  const selection = readChampionSelection(new URL(championHref({ state: 'ND', selectedId: trees[0].id }), 'https://example.com').searchParams);
  assert.equal(selection.state, 'ND'); assert.equal(selection.selectedId, trees[0].id);
  assert.equal(townKey(trees[0]), 'ND:county:Burleigh');
  assert.doesNotMatch(JSON.stringify(rows), /Owner:|Nominator:|\d{3}-\d{3}-\d{4}|@ndsu\.edu/);
});
