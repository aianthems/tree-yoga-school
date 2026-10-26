const assert = require('node:assert/strict');
const test = require('node:test');
const { buildRegionData } = require('./sync-library-regions.cjs');
const data = require('../lib/tree-library-region-data.json');
const { trees } = require('../lib/trees.ts');
const { championStates, championRegions } = require('../lib/champion-states.ts');
const { discoverLibraryTrees, emptyLibrarySelection, libraryHref, readLibrarySelection } = require('../lib/tree-library-discovery.ts');
const { regionalRecordsHref } = require('../lib/tree-library-regions.ts');
test('eight disjoint Library regions cover all fifty states using the record explorer geography', () => {
  assert.equal(data.regions.length, 8);
  const codes = data.regions.flatMap(region => region.states.map(state => state.code));
  assert.equal(codes.length, 50); assert.equal(new Set(codes).size, 50);
  assert.deepEqual([...codes].sort(), Object.keys(championStates).sort());
  for (const region of data.regions) assert.deepEqual(region.states.map(state => state.code), championRegions[region.value].states);
});
test('generated membership matches exact species records in every state and stays current', () => {
  assert.deepEqual(data, buildRegionData());
  assert.deepEqual(Object.keys(data.species), trees.map(tree => tree.slug));
});
test('regional discovery includes documented planted species and intersects other filters', () => {
  assert.ok(data.species['giant-sequoia']['new-england'].includes('RI'));
  for (const region of data.regions) {
    const selection = { ...emptyLibrarySelection, region: region.value, view: 'compact' };
    const matches = discoverLibraryTrees(trees, selection);
    assert.deepEqual(new Set(matches.map(tree => tree.slug)), new Set(trees.filter(tree => data.species[tree.slug][region.value]?.length).map(tree => tree.slug)));
    assert.deepEqual(readLibrarySelection(new URL(libraryHref(selection), 'https://example.com').searchParams), selection);
    for (const tree of matches) {
      assert.ok(discoverLibraryTrees(trees, { ...selection, query: tree.scientificName }).some(match => match.slug === tree.slug));
      const href = new URL(regionalRecordsHref(tree.scientificName, region.value), 'https://example.com');
      assert.equal(href.searchParams.get('region'), region.value); assert.equal(href.searchParams.get('species'), tree.scientificName);
    }
  }
});
