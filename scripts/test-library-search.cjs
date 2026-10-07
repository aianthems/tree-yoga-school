const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { trees } = require('../lib/trees.ts');
const { filterLibraryTrees, libraryThemes } = require('../lib/tree-library-search.ts');
const slugs = (q, theme = '') => filterLibraryTrees(trees, q, theme).map(t => t.slug);

test('search accepts common names, botanical names, aliases, whitespace, and punctuation', () => {
  assert.deepEqual(slugs('  MUSCLEWOOD  '), ['american-hornbeam']);
  assert.deepEqual(slugs('blue-beech'), ['american-hornbeam']);
  assert.deepEqual(slugs('Carpinus caroliniana'), ['american-hornbeam']);
  assert.deepEqual(slugs('white cedar'), ['cedar']);
  assert.deepEqual(slugs('tulip-poplar'), ['tulip-tree']);
  assert.deepEqual(slugs('white elm'), ['american-elm']);
  assert.deepEqual(slugs('American ash'), ['white-ash']);
  assert.deepEqual(slugs('baldcypress'), ['bald-cypress']);
  assert.deepEqual(slugs('redbud', 'Joy'), ['eastern-redbud']);
  assert.deepEqual(slugs('tupelo'), ['blackgum']);
  assert.deepEqual(slugs('maple'), ['maple', 'red-maple', 'silver-maple']);
  assert.deepEqual(slugs('Acer'), ['maple', 'red-maple', 'silver-maple']);
});
test('theme and name intersect, empty results recover, and reset restores original order', () => {
  assert.deepEqual(slugs('musclewood', 'Quiet Strength'), ['american-hornbeam']);
  assert.deepEqual(slugs('musclewood', 'Patience'), []);
  assert.deepEqual(slugs('no such tree'), []);
  assert.deepEqual(slugs(''), trees.map(t => t.slug));
  assert.deepEqual(slugs('   '), trees.map(t => t.slug));
});
test('every offered theme comes from current profiles and returns exact matches', () => {
  const themes = libraryThemes(trees);
  assert.equal(themes.length, new Set(themes).size);
  for (const theme of themes) {
    const expected = trees.filter(t => t.themes.includes(theme));
    assert.ok(expected.length);
    assert.deepEqual(filterLibraryTrees(trees, '', theme), expected);
  }
});
