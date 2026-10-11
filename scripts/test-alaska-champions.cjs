const test = require('node:test'), assert = require('node:assert/strict');
const { readState } = require('./validate-champion-imports.cjs');
const { normalizeChampionRecords } = require('../lib/champion-state-data.ts');
const { validateChampionState } = require('../lib/champion-validation.ts');
const { filterChampionRecords } = require('../lib/champion-explorer-index.ts');
const { emptySelection, championHref, readChampionSelection } = require('../lib/champion-links.ts');
const { championMapViewport, championMapViewForState } = require('../lib/champion-map-view.ts');
const { championStateHref } = require('../lib/champion-state-pages.ts');
const { records, coordinates } = readState('AK');
const audit = require('../lib/data/alaska-source-audit.json');

test('Alaska preserves the explicitly reported historical champion and leaves unsupported fields unknown', () => {
  assert.equal(records.length, 1);
  const tree = records[0];
  assert.equal(tree.id, 'ak-uaf-black-spruce');
  assert.equal(tree.commonName, 'Black Spruce');
  assert.equal(tree.scientificName, 'Picea mariana');
  assert.deepEqual([tree.height, tree.circumference, tree.crown, tree.points, tree.measured], [71, 45, null, null, null]);
  assert.match(tree.status, /Historical Alaska state champion.*2003/);
  assert.equal(tree.publicAccess, undefined);
  assert.equal(tree.publicCoordinates, undefined);
  assert.equal(tree.nominated, undefined);
  assert.equal(tree.sourceTreeId, undefined);
  assert.equal(audit.originalPublicationYear, 2003);
  assert.equal(audit.republicationDate, '2010-08-19');
  assert.match(tree.notes, /not a complete Alaska register/);
  assert.deepEqual(validateChampionState('AK', records, coordinates).errors, []);
  assert.deepEqual(coordinates, { Fairbanks: { lat: 64.836531, lng: -147.651745 } });
  assert.equal(audit.placeGeoid, '0224230');
  const trees = normalizeChampionRecords('AK', records);
  assert.equal(filterChampionRecords(trees, {...emptySelection, publicOnly:true}).length, 0);
  assert.equal(filterChampionRecords(trees, {...emptySelection, region:'alaska'}).length, 1);
  assert.equal(championStateHref('AK'), '/champion-trees/alaska');
  assert.equal(readChampionSelection(new URL(championHref({state:'AK',selectedId:tree.id}), 'https://example.com').searchParams).selectedId, tree.id);
});

test('Alaska, Hawaiʻi and contiguous US views partition all results and handle partial geography loads', () => {
  const groups = [{state:'AK'}, {state:'HI'}, {state:'WY'}];
  const views = ['mainland', 'alaska', 'hawaii'].map(view => championMapViewport(groups, view));
  assert.deepEqual(views.map(view => view.groups[0].state), ['WY', 'AK', 'HI']);
  assert.equal(views.flatMap(view => view.groups).length, groups.length);
  for (const view of views) { assert.equal(view.canSwitch, true); assert.equal(view.availableViews.length, 3); }
  assert.equal(championMapViewport([{state:'AK'}], 'mainland').view, 'alaska');
  assert.equal(championMapViewport([{state:'AK'}, {state:'HI'}], 'mainland').view, 'alaska');
  assert.equal(championMapViewForState('AK'), 'alaska');
  assert.equal(championMapViewForState('HI'), 'hawaii');
  assert.equal(championMapViewForState('WY'), 'mainland');
  assert.equal(championMapViewport([], 'alaska').canSwitch, false);
});
