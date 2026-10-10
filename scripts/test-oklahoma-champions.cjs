const test = require('node:test');
const assert = require('node:assert/strict');
const { readState, validateImports } = require('./validate-champion-imports.cjs');
const { normalizeChampionRecords } = require('../lib/champion-state-data.ts');
const { championRegions } = require('../lib/champion-states.ts');
const { championHref, readChampionSelection, emptySelection } = require('../lib/champion-links.ts');
const { townKey, sourceWarnings } = require('../lib/champion-trees.ts');
const source = require('./fixtures/oklahoma-champions-2026-10-10.json');
const { records, coordinates } = readState('OK');

test('Oklahoma selects designated champions and excludes death records without promoting undefined entries', () => {
  assert.equal(source.length, 213);
  assert.equal(source.filter(r => r.Champion_Status === 'Yes').length, 83);
  assert.equal(records.length, 79);
  assert.deepEqual(records.map(r => r.sourceRow), source.filter(r => r.Champion_Status === 'Yes' && r.DDR === null && r.Dead_NF !== 'Dead').map(r => r.OBJECTID));
  assert.equal(records.filter(r => r.commonName === 'River Birch').length, 2);
  for (const deadId of [27, 152, 193, 280]) assert.ok(!records.some(r => r.sourceRow === deadId));
  assert.deepEqual(validateImports(['OK']).errors, []);
});
test('Oklahoma preserves missing scores, source names, explicit dates, and access classifications', () => {
  assert.equal(records.filter(r => r.points === null).length, 4);
  assert.equal(records.filter(r => r.measured !== null).length, 1);
  const dated = records.find(r => r.measured !== null);
  assert.equal(dated.commonName, 'River Birch');
  assert.equal(dated.measured, '2026-01-15');
  for (const r of records) {
    const row = source.find(x => x.OBJECTID === r.sourceRow);
    assert.equal(r.scientificName, (row.Genus_Species || 'Not supplied by source').trim());
    assert.equal(r.points, row.Pts);
    assert.equal(r.publicAccess, row.PublicAccess === 'Yes' ? true : row.PublicAccess === 'No' ? false : undefined);
    assert.equal(r.publicCoordinates, undefined);
  }
  const pawpaw = records.find(r => r.commonName === 'Pawpaw');
  assert.ok(sourceWarnings(pawpaw).some(note => note.includes('points differ')));
});
test('Oklahoma county records participate in shared links and South Central filtering', () => {
  assert.equal(Object.keys(coordinates).length, 27);
  assert.ok(championRegions['south-central'].states.includes('OK'));
  for (const tree of normalizeChampionRecords('OK', records)) {
    assert.ok(coordinates[tree.county]);
    const selection = { ...emptySelection, state: 'OK', region: 'south-central', county: tree.county, town: townKey(tree), species: tree.scientificName, selectedId: tree.id };
    const url = new URL(championHref(selection), 'https://treeyogaschool.com');
    assert.deepEqual(readChampionSelection(url.searchParams), selection);
  }
});
