const test = require('node:test');
const assert = require('node:assert/strict');
const { readState } = require('./validate-champion-imports.cjs');
const { normalizeChampionRecords, normalizeChampionCoordinates } = require('../lib/champion-state-data.ts');
const { championRegions } = require('../lib/champion-states.ts');
const { townKey, sourceWarnings, libraryTreeForSpecies } = require('../lib/champion-trees.ts');
const { emptySelection, championHref, readChampionSelection } = require('../lib/champion-links.ts');
const { filterChampionRecords } = require('../lib/champion-explorer-index.ts');
const fixture = require('./fixtures/south-dakota-champions.json');
const { records: rows, coordinates: points } = readState('SD');
const records = normalizeChampionRecords('SD', rows);

test('South Dakota keeps all 60 published rows and their decimal measurements without deriving titles', () => {
  assert.equal(rows.length, 60);
  assert.equal(new Set(rows.map(r => r.id)).size, 60);
  for (const [i, r] of rows.entries()) {
    const f = fixture[i];
    assert.deepEqual([r.commonName, r.scientificName, r.town, r.county], [f.commonName, f.scientificName, f.town, f.county]);
    assert.equal(r.sourceRow, i + 1);
    assert.deepEqual([r.height, r.crown, r.points], f.measurements.slice(1).map(v => Number(v.replace("'", ''))));
    assert.equal(r.measured, null);
    assert.equal(r.nationalFlag, undefined);
    assert.equal(r.status, 'South Dakota published Big Tree Register');
  }
  const cottonwood = rows.find(r => r.commonName === 'Cottonwood');
  assert.deepEqual([cottonwood.town,cottonwood.county,cottonwood.circumference,cottonwood.height,cottonwood.crown,cottonwood.points], ['Columbia','Brown',402,120,100,547]);
  const aspen = rows.find(r => r.commonName === 'Aspen, Quaking');
  assert.deepEqual([aspen.circumference,aspen.height,aspen.crown,aspen.points], [75,50,26.25,131.563]);
  assert.equal(rows.find(r => r.commonName === 'Ash, Green').scientificName, 'Fraxius pennsylvanica');
  assert.equal(rows.find(r => r.commonName === 'Honeylocust').scientificName, 'Gleditsia triancanthos');
  assert.equal(rows.find(r => r.commonName === 'Crabapple').scientificName, 'Malus sp.');
});

test('South Dakota flags inconsistent scores and preserves sycamore inches without guessing feet', () => {
  const flagged = records.filter(r => sourceWarnings(r).some(w => w.includes('differ by more than one point')));
  assert.deepEqual(flagged.map(r => r.sourceRow), [6,17,23,53]);
  const sycamore = rows.find(r => r.commonName === 'Sycamore, American');
  assert.equal(sycamore.circumference,11);
  assert.equal(sycamore.points,253);
  assert.ok(sourceWarnings(sycamore).some(w => w.includes('no feet mark')));
});

test('South Dakota maps to 23 county points and searches published communities without implying access', () => {
  const coordinates = normalizeChampionCoordinates('SD', points);
  assert.equal(Object.keys(points).length, 23);
  assert.equal(records.filter(r => coordinates[townKey(r)]).length, 60);
  for (const r of records) {
    assert.equal(r.mapPrecision,'county');
    assert.equal(townKey(r),`SD:county:${r.county}`);
    assert.equal(r.location,null);
    assert.equal(r.publicAccess,undefined);
    assert.equal(r.publicCoordinates,undefined);
  }
  assert.equal(filterChampionRecords(records,{...emptySelection,state:'SD',query:'Sioux Falls'}).length,15);
  assert.equal(filterChampionRecords(records,{...emptySelection,state:'SD',query:'Columbia'})[0].id,'sd-r12');
  assert.equal(filterChampionRecords(records,{...emptySelection,state:'SD',publicOnly:true}).length,0);
  assert.ok(championRegions.midwest.states.includes('SD'));
  for (const p of Object.values(points)) { assert.ok(p.lat > 42 && p.lat < 46); assert.ok(p.lng > -105 && p.lng < -96); }
  const selected = readChampionSelection(new URL(championHref({state:'SD',region:'midwest',selectedId:'sd-r12'}),'https://treeyogaschool.com').searchParams);
  assert.equal(selected.state,'SD');assert.equal(selected.selectedId,'sd-r12');
  assert.equal(libraryTreeForSpecies('Populus deltoides').slug,'eastern-cottonwood');
});
