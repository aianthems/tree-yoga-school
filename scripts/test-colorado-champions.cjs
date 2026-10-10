const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const rows = require('../lib/data/colorado-champion-trees.json');
const fixture = require('./fixtures/colorado-champions-2026-10-10.json');
const points = require('../lib/data/colorado-county-points.json');
const audit = require('../lib/data/colorado-import-audit.json');
const { championRegions } = require('../lib/champion-states.ts');
const { normalizeChampionRecords, normalizeChampionCoordinates } = require('../lib/champion-state-data.ts');
const { townKey, libraryTreeForSpecies } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');

test('every Colorado entry preserves the reviewed source measurements, position and missing fields', () => {
  assert.equal(rows.length, 846);
  assert.equal(new Set(rows.map(r => r.id)).size, 846);
  for (const [i, r] of rows.entries()) {
    const f = fixture[i], v = f.values;
    assert.deepEqual([r.sourceRow, r.sourceAlphabeticalRow], [f.countyRow, f.alphabeticalRow]);
    assert.deepEqual([r.commonName, r.scientificName, r.sourceVariety], [v[1], `${v[2]} ${v[3]}`, v[4]]);
    assert.deepEqual([r.diameter, r.circumference, r.height, r.crown, r.points], v.slice(5, 10));
    assert.equal(r.sourcePosition, v[10] === null ? null : String(v[10]));
    assert.equal(r.location, v[11] === '[street address omitted]' ? null : v[11]);
    assert.equal(r.sourceCounty, v[0]);
    assert.equal(r.measured, null);
    assert.equal(r.publicAccess, undefined);
    assert.equal(r.publicCoordinates, undefined);
    assert.equal(r.nationalFlag, undefined);
  }
  assert.equal(rows.filter(r => /^1T?$/.test(r.sourcePosition)).length, 354);
  const missing = rows.filter(r => r.sourcePosition === null);
  assert.equal(missing.length, 1); assert.equal(missing[0].height, null); assert.equal(missing[0].points, null);
  assert.ok(rows.some(r => r.sourcePosition === '7'));
  assert.equal(audit.workbookDifferences.length, 1);
  assert.equal(audit.workbookDifferences[0].countyVariety, 'Hot Wings');
  assert.equal(audit.workbookDifferences[0].alphabeticalVariety, 'GarAnn Hot Wings');
});
test('Colorado maps only to approximate counties and source addresses remain omitted', () => {
  const normalized = normalizeChampionRecords('CO', rows);
  const coordinates = normalizeChampionCoordinates('CO', points);
  assert.equal(Object.keys(points).length, 45);
  assert.equal(normalized.filter(r => coordinates[townKey(r)]).length, 846);
  for (const p of Object.values(points)) { assert.ok(p.lat > 37 && p.lat < 41); assert.ok(p.lng > -109.1 && p.lng < -102); }
  const moffat = rows.find(r => r.sourceCounty === 'Moffatt');
  assert.equal(moffat.county, 'Moffat'); assert.ok(points.Moffat);
  assert.ok(!JSON.stringify(rows).includes('655 Struthers'));
  assert.ok(!JSON.stringify(fixture).includes('655 Struthers'));
  assert.equal(rows.filter(r => r.sourceReviewNotes.some(n => n.includes('street address'))).length, 1);
});
test('Colorado participates in regional discovery, share links and reciprocal species lookup', () => {
  assert.ok(championRegions.west.states.includes('CO'));
  const href = championHref({ region: 'west', state: 'CO', species: 'Quercus macrocarpa' });
  const selection = readChampionSelection(new URLSearchParams(href.split('?')[1]));
  assert.equal(selection.region, 'west'); assert.equal(selection.state, 'CO');
  for (const r of rows.filter(r => r.scientificName === 'Quercus macrocarpa')) assert.equal(libraryTreeForSpecies(r.scientificName).slug, 'bur-oak');
});
