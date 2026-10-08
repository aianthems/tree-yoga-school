const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const test = require('node:test');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const records = require('../lib/data/indiana-champion-trees.json');
const coordinates = require('../lib/data/indiana-county-points.json');
const audit = require('../lib/data/indiana-import-audit.json');
const { stateNames, sourceDates, townKey, championRegions, sourceWarnings } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection, emptySelection } = require('../lib/champion-links.ts');

test('Indiana imports only populated source rows and preserves co-champions and county precision', () => {
  assert.equal(records.length, 93);
  assert.equal(new Set(records.map(t => t.id)).size, 93);
  assert.equal(Object.keys(coordinates).length, 40);
  assert.equal(records.filter(t => t.status === 'State co-champion').length, 10);
  assert.equal(audit.sourceRows, 95);
  assert.deepEqual(audit.excludedRows.map(t => t.scientificName), ['Acer saccharum', 'Prunus nigra']);
  assert.equal(stateNames.IN, 'Indiana');
  assert.match(sourceDates.IN, /October 8, 2026/);
  assert.ok(championRegions.midwest.states.includes('IN'));
  for (const t of records) {
    assert.equal(t.state, 'IN');
    assert.equal(t.mapPrecision, 'county');
    assert.equal(t.measured, null);
    assert.equal(t.location, null);
    assert.equal(t.publicAccess, undefined);
    assert.equal(t.publicCoordinates, undefined);
    for (const key of ['circumference', 'height', 'crown', 'points']) assert.ok(Number.isFinite(t[key]));
    const point = coordinates[t.county];
    assert.ok(point && point.lat > 37 && point.lat < 42 && point.lng > -89 && point.lng < -84);
    assert.equal(townKey(t), `IN:county:${t.county}`);
    const expected = 'in-' + crypto.createHash('sha256').update([t.scientificName, t.county, t.commonName].join('|')).digest('hex').slice(0, 12);
    assert.equal(t.id, expected);
    const selection = { ...emptySelection, state: 'IN', region: 'midwest', county: t.county, town: townKey(t), species: t.scientificName, selectedId: t.id };
    assert.deepEqual(readChampionSelection(new URL(championHref(selection), 'https://example.com').searchParams), selection);
  }
});

test('Indiana retains source discrepancies and separate trees in the same species', () => {
  const maples = records.filter(t => t.scientificName === 'Acer saccharinum');
  assert.equal(maples.length, 1);
  assert.deepEqual([maples[0].circumference, maples[0].height, maples[0].crown, maples[0].points], [361, 103, 106, 490.5]);
  for (const species of ['Carya glabra', 'Magnolia tripetala', 'Diospyros virginiana', 'Cercis canadensis', 'Sassafras albidum']) {
    const trees = records.filter(t => t.scientificName === species);
    assert.equal(trees.length, 2);
    assert.equal(new Set(trees.map(t => t.county)).size, 2);
    assert.ok(trees.every(t => t.status === 'State co-champion'));
  }
  assert.ok(records.filter(t => t.scientificName === 'Magnolia tripetala').every(t => sourceWarnings(t).some(note => note.includes('without a current champion'))));
  assert.ok(records.filter(t => t.sourceCounty === 'St Joseph').every(t => t.county === 'St. Joseph'));
  assert.ok(records.filter(t => t.sourceCounty === 'Laporte').every(t => t.county === 'LaPorte'));
  assert.equal(readChampionSelection(new URLSearchParams('state=in')).state, 'IN');
  assert.equal(readChampionSelection(new URLSearchParams('state=IN&region=southeast')).region, '');
});
