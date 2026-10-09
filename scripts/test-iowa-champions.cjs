const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const { readState, validateImports } = require('./validate-champion-imports.cjs');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');
const { librarySpecies } = require('../lib/champion-trees.ts');

test('Iowa includes the official active champions and keeps a missing county searchable', () => {
  const { records, coordinates } = readState('IA');
  assert.equal(records.length, 67);
  assert.equal(new Set(records.map(t => t.id)).size, 67);
  assert.equal(Object.keys(coordinates).length, 36);
  assert.deepEqual(records.filter(t => !t.county).map(t => t.id), ['ia-220']);
  assert.deepEqual(validateImports(['IA']).errors, []);
  for (const t of records) {
    assert.equal(t.publicCoordinates, undefined);
    assert.equal(t.location, null);
    assert.equal(t.measured, null);
    assert.notEqual(t.publicAccess, true);
    const selected = readChampionSelection(new URL(championHref({ state: 'IA', selectedId: t.id }), 'https://example.com').searchParams);
    assert.equal(selected.state, 'IA'); assert.equal(selected.selectedId, t.id);
  }
  for (const point of Object.values(coordinates)) {
    assert.ok(point.lat > 40 && point.lat < 44);
    assert.ok(point.lng > -97 && point.lng < -90);
  }
});
test('Iowa preserves scores and ambiguous crown values while converting source feet explicitly', () => {
  const { records } = readState('IA');
  const serviceberry = records.find(t => t.commonName === 'Allegheny Serviceberry');
  assert.equal(serviceberry.circumference, 13.5);
  assert.equal(serviceberry.crown, 17.5);
  assert.equal(serviceberry.points, 56.955);
  const catalpa = records.find(t => t.scientificName === 'Catalpa ovata');
  assert.equal(catalpa.crown, null);
  assert.match(catalpa.notes, /35, 46.5/);
  assert.match(serviceberry.notes, /converted to inches/);
});
test('four new Library profiles resolve to practices, map links, and credited local images', () => {
  const { trees } = require('../lib/trees.ts');
  const { discoveryPages } = require('../lib/site-seo.ts');
  for (const name of ['Quercus palustris', 'Quercus bicolor', 'Acer negundo', 'Celtis occidentalis']) {
    const t = trees.find(t => t.scientificName === name);
    assert.ok(t); assert.equal(librarySpecies[name].slug, t.slug);
    assert.equal(t.identity.length, 3); assert.equal(t.energies.length, 3); assert.equal(t.practice.length, 4);
    assert.ok(discoveryPages.some(p => p.path === '/practice/' + t.slug));
    assert.ok(discoveryPages.some(p => p.path === '/trees/' + t.slug));
    for (const image of [t, ...t.detailImages]) {
      assert.ok(fs.existsSync(require('node:path').join(__dirname, '../public', image.image)));
      assert.ok(image.imageWidth > 0 && image.imageHeight > 0);
      assert.ok(image.credit.licenseUrl && image.credit.sourceUrl);
    }
  }
});
