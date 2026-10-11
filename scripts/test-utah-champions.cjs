const test = require('node:test'), assert = require('node:assert/strict');
const { readState } = require('./validate-champion-imports.cjs');
const { championStates, championRegions } = require('../lib/champion-states.ts');
const { validateChampionState } = require('../lib/champion-validation.ts');
const { normalizeChampionRecords, normalizeChampionCoordinates } = require('../lib/champion-state-data.ts');
const { townKey } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection, emptySelection } = require('../lib/champion-links.ts');
const { filterChampionRecords } = require('../lib/champion-explorer-index.ts');
const fixture = require('./fixtures/utah-champions.json'), audit = require('../lib/data/utah-import-audit.json');
const { records: rows, coordinates: points } = readState('UT');
test('Utah retains every explicit state champion and source measurements without ranking species', () => {
  assert.equal(fixture.length, 250); assert.equal(audit.directoryRecords, 250);
  const champs = fixture.filter(r => r['State Champ Status'] === '1');
  assert.equal(rows.length, champs.length);
  assert.deepEqual(audit.excluded, [{sourceTreeId:'313',status:'0'},{sourceTreeId:'95',status:'2'}]);
  assert.ok(!rows.some(t => ['ut-313','ut-95'].includes(t.id)));
  assert.equal(rows.filter(t => /source also labels co-champion/.test(t.status)).length,3);
  for (const f of champs) {
    const t = rows.find(r => r.sourceTreeId === f['Tree ID']); assert.ok(t);
    assert.equal(t.commonName, f['Common Name']); assert.equal(t.scientificName, f['Scientific Name']);
    assert.equal(t.measured, f['Measurement Year']); assert.equal(t.sourceUrl, f.url);
    for (const [k, source] of Object.entries({circumference:'Circumference',height:'Height',crown:'Spread',points:'Total Points'})) assert.equal(t[k], Number(f[source]));
    assert.equal(t.publicAccess, ['Yes','Y'].includes(f['Public Access']));
  }
  const yellow = rows.filter(t => t.commonName === 'Yellow Buckeye'); assert.equal(yellow.length, 2);
  assert.deepEqual(yellow.map(t => t.points), [200,209]); assert.ok(yellow.every(t => t.stateChampionCode === 1));
  assert.equal(rows.find(t => t.id === 'ut-9').measured, '2026');
  assert.ok(rows.find(t => t.id === 'ut-9').sourceReviewNotes.some(n => n.includes('2026-10')));
});
test('Utah uses approximate documented Census places, preserves access filters and omits sensitive location fields', () => {
  assert.deepEqual(validateChampionState('UT', rows, points).errors, []);
  const trees = normalizeChampionRecords('UT', rows), coords = normalizeChampionCoordinates('UT', points);
  const mapped = trees.filter(t => coords[townKey(t)]);
  assert.equal(mapped.length, audit.mappedRecords);
  assert.deepEqual(trees.filter(t => !coords[townKey(t)]).map(t => t.id).sort(), [...championStates.UT.unmappedIds].sort());
  for (const t of trees) {
    assert.equal(t.location, null); assert.equal(t.publicCoordinates, undefined);
    for (const k of ['owner','nominator','measuredBy','fullAddress','lat','long','geometry_x','geometry_y']) assert.equal(Object.hasOwn(t,k), false);
  }
  assert.ok(trees.filter(t => !coords[townKey(t)]).every(t => t.sourceReviewNotes.some(n => /No unambiguous/.test(n))));
  for (const p of Object.values(points)) { assert.ok(p.lat > 37 && p.lat < 42.1); assert.ok(p.lng > -114.1 && p.lng < -109); }
  assert.equal(filterChampionRecords(trees,{...emptySelection,state:'UT',publicOnly:true}).length,audit.publicAccessRecords);
  assert.equal(trees.find(t => t.id === 'ut-327').publicAccess, false);
  assert.ok(championRegions.west.states.includes('UT'));
  const parsed = readChampionSelection(new URL(championHref({state:'UT',selectedId:'ut-9'}),'https://example.com').searchParams);
  assert.equal(parsed.state,'UT'); assert.equal(parsed.selectedId,'ut-9');
});
