const test = require('node:test');
const assert = require('node:assert/strict');
const { readState } = require('./validate-champion-imports.cjs');
const { normalizeChampionRecords, normalizeChampionCoordinates } = require('../lib/champion-state-data.ts');
const { championRegions } = require('../lib/champion-states.ts');
const { townKey, sourceWarnings } = require('../lib/champion-trees.ts');
const { championSpeciesOptions, championSpeciesOptionsForBatches } = require('../lib/champion-species.ts');
const { filterChampionRecords } = require('../lib/champion-explorer-index.ts');
const { emptySelection, championHref, readChampionSelection } = require('../lib/champion-links.ts');
const fixture = require('./fixtures/nevada-champions-2023.json');
const { records: rows, coordinates: points } = readState('NV');
const records = normalizeChampionRecords('NV', rows);

test('Nevada retains every printed row and original measurements, including co-champions', () => {
  assert.equal(rows.length, 223);
  assert.equal(new Set(rows.map(r => r.id)).size, 223);
  assert.equal(rows.filter(r => r.status.includes('co-champion')).length, 12);
  assert.deepEqual([1,2,3,4,5,6].map(page => rows.filter(r => r.sourcePage === page).length), [41,42,42,42,42,14]);
  for (const [i,r] of rows.entries()) {
    const f = fixture[i];
    assert.equal(r.commonName, f.commonName);
    assert.equal(r.scientificName, f.scientificName);
    assert.equal(r.sourcePage, f.page); assert.equal(r.sourceRow, f.row);
    assert.deepEqual([r.circumference,r.height,r.crown,r.crownPoints,r.points], f.measurements.map(Number));
    assert.equal(r.measured, null);
    assert.equal(r.nationalFlag, undefined);
  }
  const pine = rows.find(r => r.scientificName === 'Pinus monticola');
  assert.deepEqual([pine.circumference,pine.height,pine.crown,pine.crownPoints,pine.points], [336,154,73,18,508]);
  assert.equal(rows.find(r => r.commonName === 'Bristlecone Pine').points, 523);
  assert.equal(rows.filter(r => r.commonName.toLowerCase() === 'golden chain tree').length, 2);
});

test('Nevada maps all records to counties, documenting Pine interpretation without publishing owners', () => {
  const coordinates = normalizeChampionCoordinates('NV', points);
  assert.equal(Object.keys(points).length, 7);
  assert.equal(records.filter(r => coordinates[townKey(r)]).length, 223);
  assert.equal(rows.filter(r => r.sourceCounty === 'Pine').length, 8);
  for (const r of records) {
    assert.equal(r.mapPrecision, 'county'); assert.equal(r.location, null); assert.equal(r.town, '');
    assert.equal(r.publicAccess, undefined); assert.equal(r.publicCoordinates, undefined);
    assert.equal(r.owner, undefined); assert.equal(r.ownership, undefined);
    if (r.sourceCounty === 'Pine') { assert.equal(r.county, 'White Pine'); assert.ok(sourceWarnings(r).some(n => n.includes('White Pine'))); }
  }
  for (const p of Object.values(points)) { assert.ok(p.lat > 35 && p.lat < 42); assert.ok(p.lng > -120 && p.lng < -114); }
  assert.ok(championRegions.west.states.includes('NV'));
  const selected = readChampionSelection(new URL(championHref({state:'NV',region:'west',selectedId:rows[0].id}), 'https://treeyogaschool.com').searchParams);
  assert.equal(selected.state,'NV'); assert.equal(selected.selectedId,rows[0].id);
});

test('incomplete Nevada botanical labels remain searchable without merging unrelated species or inventing genera', () => {
  const incomplete = records.filter(r => r.scientificNameIncomplete);
  assert.equal(incomplete.length,128);
  const options = championSpeciesOptions(records);
  assert.deepEqual(championSpeciesOptionsForBatches([records]), options);
  assert.ok(!options.some(o => o.scientificName === 'americana' || o.scientificName === "'Pendula'"));
  assert.ok(options.some(o => o.scientificName === 'Pinus monticola'));
  const query = filterChampionRecords(records,{...emptySelection,query:'American Hazelnut'});
  assert.equal(query.length,1); assert.equal(query[0].scientificName,'americana');
  assert.equal(filterChampionRecords(records,{...emptySelection,genus:'americana'}).length,0);
  assert.equal(filterChampionRecords(records,{...emptySelection,species:'americana'}).length,0);
  assert.ok(filterChampionRecords(records,{...emptySelection,genus:'Pinus'}).every(r => !r.scientificNameIncomplete));
  assert.ok(incomplete.every(r => sourceWarnings(r).some(n => n.includes('incomplete'))));
});
