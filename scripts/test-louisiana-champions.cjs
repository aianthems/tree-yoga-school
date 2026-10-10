const test = require('node:test');
const assert = require('node:assert/strict');
const { readState } = require('./validate-champion-imports.cjs');
const { normalizeChampionRecords } = require('../lib/champion-state-data.ts');
const { placeName, sourceWarnings } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');
const { championRegions } = require('../lib/champion-states.ts');
const { records, coordinates } = readState('LA');
const fixture = require('./fixtures/louisiana-champions-2026-10-10.json');

test('Louisiana preserves all published rows except the explicitly deceased Winged Elm', () => {
  assert.equal(fixture.length, 116);
  assert.equal(records.length, 115);
  assert.equal(new Set(records.map(r => r.id)).size, 115);
  assert.ok(!records.some(r => r.commonName === 'Winged Elm'));
  assert.equal(records.filter(r => r.status.startsWith('Co-champion')).length, 37);
  for (const r of records) {
    const source = fixture[r.sourceRow - 1];
    assert.equal(r.commonName, source[1]);
    assert.equal(r.points, Number(source[8]));
    assert.equal(r.scientificName, 'Not supplied by source');
    assert.equal(r.measured, null);
    assert.equal(r.publicAccess, undefined);
    assert.match(r.sourceReviewNotes.join(' '), /Older.*2021.*2025 and 2026/);
  }
});
test('Louisiana measurements handle fractional inches, missing punctuation and source discrepancies', () => {
  const water = records.find(r => r.commonName === 'Water Oak' && r.county === 'Avoyelles');
  assert.equal(water.circumference, 213.5);
  const ash = records.find(r => r.commonName === 'Green Ash');
  assert.equal(ash.circumference, 134.7);
  const tallow = records.find(r => r.commonName === 'Tallowtree');
  assert.equal(tallow.crown, 71);
  assert.equal(tallow.points, 229);
  assert.match(tallow.sourceReviewNotes.join(' '), /71 inches.*71 feet/);
  const holly = records.find(r => r.commonName === 'Carolina Holly');
  assert.equal(holly.circumference, 42);
  assert.equal(holly.points, 21);
  assert.ok(sourceWarnings(holly).some(w => w.includes('differ')));
});
test('Louisiana uses parish names, all 34 area points and shareable South Central selections', () => {
  assert.equal(Object.keys(coordinates).length, 34);
  const normalized = normalizeChampionRecords('LA', records);
  for (const r of normalized) {
    assert.ok(coordinates[r.county]);
    assert.equal(placeName(r), `${r.county} Parish`);
    assert.equal(r.publicCoordinates, undefined);
  }
  assert.ok(championRegions['south-central'].states.includes('LA'));
  const href = championHref({ state: 'LA', region: 'south-central', selectedId: records[0].id });
  const selection = readChampionSelection(new URL(href, 'https://example.com').searchParams);
  assert.equal(selection.state, 'LA');
  assert.equal(selection.region, 'south-central');
  assert.equal(selection.selectedId, records[0].id);
});
