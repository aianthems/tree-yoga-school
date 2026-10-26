const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, f);
const { trees, getTree } = require('../lib/trees.ts');
const { newEnglandLibraryTrees: additions } = require('../lib/tree-library-new-england.ts');
const { discoverLibraryTrees, emptyLibrarySelection } = require('../lib/tree-library-discovery.ts');
const { discoveryPages } = require('../lib/site-seo.ts');
const { libraryTreeForSpecies } = require('../lib/champion-trees.ts');
const photos = require('./fixtures/tree-library-new-england-photo-sources.json');
const result = patch => discoverLibraryTrees(trees, { ...emptyLibrarySelection, ...patch }).map(t => t.slug);
test('six New England additions integrate complete profiles, outdoor routes, map lookup and credited photography', () => {
  assert.equal(additions.length, 6);
  assert.equal(trees.length, 79);
  assert.equal(new Set(trees.map(t => t.slug)).size, trees.length);
  for (const t of additions) {
    assert.equal(getTree(t.slug), t);
    assert.equal(libraryTreeForSpecies(t.scientificName).slug, t.slug);
    assert.equal(t.identity.length, 3); assert.equal(t.energies.length, 3); assert.equal(t.practice.length, 4);
    assert.ok(t.detailImages.length); assert.ok(t.seasons); assert.ok(t.reflection); assert.ok(t.principles);
    for (const route of [`/trees/${t.slug}`, `/practice/${t.slug}`]) assert.ok(discoveryPages.some(p => p.path === route), route);
    for (const im of [t, ...t.detailImages]) {
      assert.ok(fs.existsSync('public' + im.image));
      const source = photos.find(p => p.image === im.image); assert.ok(source);
      assert.deepEqual(im.credit, source.credit);
      assert.doesNotMatch(im.credit.license, /NC|ND/);
      assert.ok(im.imageWidth > 0 && im.imageHeight > 0 && im.imageAlt);
    }
  }
});
test('new identification filters preserve alternate Katsura shoots and distinguish leaf teeth from lobes', () => {
  for (const arrangement of ['opposite', 'alternate']) assert.ok(result({ query: 'katsura', foliage: 'broad', arrangement, lobes: 'unlobed' }).includes('katsura'));
  assert.deepEqual(result({ query: 'bigtooth', lobes: 'lobed' }), []);
  assert.deepEqual(result({ query: 'bigtooth', arrangement: 'alternate', lobes: 'unlobed' }), ['bigtooth-aspen']);
  for (const slug of ['red-pine', 'jack-pine', 'white-spruce', 'black-spruce']) {
    assert.ok(result({ foliage: 'needles' }).includes(slug));
    assert.ok(!result({ foliage: 'broad' }).includes(slug));
  }
  for (const [query, slug] of [['Norway pine','red-pine'], ['weeping katsura','katsura'], ['Picea laxa','white-spruce'], ['big-toothed poplar','bigtooth-aspen']]) assert.ok(result({ query }).includes(slug));
});
