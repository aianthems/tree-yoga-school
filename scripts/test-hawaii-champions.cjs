const test = require('node:test'), assert = require('node:assert/strict');
const { readState } = require('./validate-champion-imports.cjs');
const { championStates, championRegions } = require('../lib/champion-states.ts');
const { normalizeChampionRecords } = require('../lib/champion-state-data.ts');
const { validateChampionState } = require('../lib/champion-validation.ts');
const { filterChampionRecords } = require('../lib/champion-explorer-index.ts');
const { emptySelection, championHref, readChampionSelection } = require('../lib/champion-links.ts');
const { championMapViewport } = require('../lib/champion-map-view.ts');
const { championStateHref, championStateFromSlug } = require('../lib/champion-state-pages.ts');
const fixture = require('./fixtures/hawaii-champions.json');
const audit = require('../lib/data/hawaii-import-audit.json');
const notes = require('../lib/champion-register-notes.json');
const { records, coordinates } = readState('HI');

test('Hawaiʻi includes exactly the eleven national champions with independent PDF measurements and dated coverage', () => {
  assert.equal(records.length, 11);
  assert.deepEqual(records.map(r => r.sourceTreeId), fixture.map(r => r.id));
  for (const [i, tree] of records.entries()) {
    const check = fixture[i];
    assert.deepEqual([tree.circumference, tree.height, tree.crown, tree.points], check.pdfMeasurements);
    assert.deepEqual([tree.scientificName, tree.sourceCounty, tree.measured, tree.nominated], [check.sourceFields[0], ...check.sourceFields.slice(2)]);
    assert.match(tree.status, /National champion.*2024 register/);
    assert.equal(tree.publicAccess, undefined);
    assert.equal(tree.publicCoordinates, undefined);
    assert.equal(tree.location, null);
    assert.equal(tree.town, '');
  }
  assert.deepEqual([...new Set(records.map(r => r.measured))].sort(), ['2016', '2017']);
  assert.equal(audit.sourceRows, 547);
  assert.equal(audit.pdfMeasurementChecks, 11);
  assert.match(audit.sourceSha256, /^[a-f0-9]{64}$/);
  assert.match(notes.HI.flat().join(' '), /not a complete Hawaiʻi state register/);
  assert.doesNotMatch(JSON.stringify(records), /Measurer\(s\)|Okumura|Magnacca|Keanaaina/);
});

test('Hawaiʻi normalizes only documented locations and keeps unclassified access out of the public filter', () => {
  assert.deepEqual(validateChampionState('HI', records, coordinates).errors, []);
  assert.deepEqual(coordinates, { Hawaii: { lat: 19.597764, lng: -155.502443 }, Honolulu: { lat: 21.461365, lng: -158.201974 } });
  assert.deepEqual(audit.countyCounts, { Hawaii: 8, Honolulu: 3 });
  const lonomea = records.find(r => r.sourceTreeId === '5866');
  assert.equal(lonomea.sourceCounty, 'O‘ahu');
  assert.equal(lonomea.county, 'Honolulu');
  assert.match(lonomea.sourceReviewNotes.join(' '), /O‘ahu County.*Honolulu County/);
  const kolea = records.find(r => r.sourceTreeId === '6013');
  assert.equal(kolea.commonName, 'Kōlea Lau Nui');
  assert.match(kolea.sourceReviewNotes.join(' '), /K\?lea Lau Nui/);
  const normalized = normalizeChampionRecords('HI', records);
  assert.equal(filterChampionRecords(normalized, { ...emptySelection, publicOnly: true }).length, 0);
  assert.equal(filterChampionRecords(normalized, { ...emptySelection, region: 'pacific' }).length, 11);
  assert.deepEqual(championRegions.pacific.states, ['HI']);
  assert.equal(championStates.HI.expectedMapped, 11);
  const selected = readChampionSelection(new URL(championHref({ state: 'HI', region: 'pacific', selectedId: lonomea.id }), 'https://example.com').searchParams);
  assert.equal(selected.selectedId, 'hi-5866');
  assert.equal(selected.region, 'pacific');
  assert.equal(championStateHref('HI'), '/champion-trees/hawaii');
  assert.equal(championStateFromSlug('hawaii'), 'HI');
});

test('disconnected map views retain all groups across switches and automatically frame single-geography searches', () => {
  const places = [{ state: 'HI', key: 'Hawaii' }, { state: 'HI', key: 'Honolulu' }, { state: 'WY', key: 'Sheridan' }, { state: 'MA', key: 'Boston' }];
  const mainland = championMapViewport(places, 'mainland'), hawaii = championMapViewport(places, 'hawaii');
  assert.equal(mainland.canSwitch, true);
  assert.deepEqual(mainland.groups.map(r => r.key), ['Sheridan', 'Boston']);
  assert.deepEqual(hawaii.groups.map(r => r.key), ['Hawaii', 'Honolulu']);
  assert.equal(mainland.groups.length + hawaii.groups.length, places.length);
  assert.equal(championMapViewport(hawaii.groups, 'mainland').view, 'hawaii');
  assert.equal(championMapViewport(mainland.groups, 'hawaii').view, 'mainland');
  assert.equal(championMapViewport([], 'mainland').canSwitch, false);
  assert.equal(places.length, 4);
});
