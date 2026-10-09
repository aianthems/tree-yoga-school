const assert = require('node:assert/strict');
const test = require('node:test');
const { readState, validateImports } = require('./validate-champion-imports.cjs');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');
const { championRegions } = require('../lib/champion-states.ts');
test('Missouri retains the entire MDC register, county geography and source access labels', () => {
  const { records, coordinates } = readState('MO');
  assert.equal(records.length, 151);
  assert.equal(Object.keys(coordinates).length, 59);
  assert.equal(records.filter(t => t.publicAccess).length, 51);
  assert.equal(records.filter(t => t.publicAccess === false).length, 100);
  assert.deepEqual(validateImports(['MO']).errors, []);
  assert.ok(championRegions.midwest.states.includes('MO'));
  assert.notDeepEqual(coordinates['St. Louis'], coordinates['St. Louis City']);
  for (const t of records) {
    assert.equal(t.publicCoordinates, undefined);
    assert.equal(t.measured, null);
    if (!t.publicAccess) assert.equal(t.location, null);
    assert.match(t.notes, /Current title and condition are unconfirmed/);
    assert.equal(readChampionSelection(new URL(championHref({state:'MO',selectedId:t.id}), 'https://example.com').searchParams).selectedId, t.id);
  }
  const first = records.find(t => t.id === 'mo-1');
  assert.equal(first.points, 61); assert.equal(first.circumference, 15);
  assert.equal(first.height, 30); assert.equal(first.crown, 31);
  assert.equal(first.commonName, 'Alder, common');
  assert.equal(first.location, 'Holly Ridge Natural Area');
  assert.ok(records.some(t => t.scientificName === 'Sideroxylon lanuginosum' && t.commonName === 'Common name not listed'));
  for (const point of Object.values(coordinates)) {
    assert.ok(point.lat > 35 && point.lat < 41);
    assert.ok(point.lng > -96 && point.lng < -89);
  }
});
