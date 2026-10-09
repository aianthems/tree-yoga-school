const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { trees } = require('../lib/trees.ts');
const { filterLibraryTrees, libraryThemes } = require('../lib/tree-library-search.ts');
const slugs = (q, theme = '') => filterLibraryTrees(trees, q, theme).map(t => t.slug);

test('search accepts common names, botanical names, aliases, whitespace, and punctuation', () => {
  assert.deepEqual(slugs('red ash'), ['green-ash']);
  assert.deepEqual(slugs('yellow oak'), ['black-oak']);
  assert.deepEqual(slugs('sweet gum'), ['sweetgum']);
  assert.deepEqual(slugs('moss-cap oak'), ['bur-oak']);
  assert.deepEqual(slugs('Fraxinus pennsylvanica', 'Renewal'), ['green-ash']);
  assert.deepEqual(slugs('bur oak', 'Spaciousness'), ['bur-oak']);
  assert.deepEqual(slugs('hop-hornbeam'), ['american-hophornbeam']);
  assert.deepEqual(slugs('leverwood'), ['american-hophornbeam']);
  assert.deepEqual(slugs('red birch'), ['river-birch']);
  assert.deepEqual(slugs('Juglans nigra'), ['black-walnut']);
  assert.deepEqual(slugs('American linden'), ['american-basswood']);
  assert.deepEqual(slugs('basswood', 'Generosity'), ['american-basswood']);
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


const { discoveryPages, pageMetadata, siteOrigin } = require('../lib/site-seo.ts');
test('sitemap covers every content collection exactly once on the production origin', () => {
  const sitemap = require('../app/sitemap.ts').default();
  const paths = discoveryPages.map(page => page.path);
  assert.equal(new Set(paths).size, paths.length);
  for (const { slug } of trees) {
    assert.ok(paths.includes(`/trees/${slug}`));
    assert.ok(paths.includes(`/practice/${slug}`));
  }
  for (const { slug } of require('../lib/tree-visits.ts').treeVisits) assert.ok(paths.includes(`/tree-visits/${slug}`));
  for (const { slug } of require('../lib/intro-lessons.ts').introLessons) assert.ok(paths.includes(`/lessons/${slug}`));
  for (const { slug } of require('../lib/book-chapters.ts').bookChapters) assert.ok(paths.includes(`/book/${slug}`));
  for (const { day } of require('../lib/beginner-journey.ts').beginnerJourney) assert.ok(paths.includes(`/begin-here/seven-days/${day}`));
  assert.equal(sitemap.length, paths.length);
  for (const entry of sitemap) {
    assert.equal(new URL(entry.url).origin, siteOrigin);
    assert.ok(!/[?#]/.test(entry.url));
    assert.ok(!entry.url.includes('/api/'));
    assert.equal(entry.lastModified, undefined);
  }
});
test('each page has its own canonical, social URL and full-size preview', () => {
  for (const page of discoveryPages) {
    const metadata = pageMetadata(page.path, page.title, page.description);
    assert.equal(metadata.alternates.canonical, siteOrigin + page.path);
    assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
    assert.equal(metadata.openGraph.title, page.title);
    assert.equal(metadata.twitter.card, 'summary_large_image');
    const image = metadata.openGraph.images[0];
    assert.equal(image.width, 1200);
    assert.equal(image.height, 630);
    assert.equal(new URL(image.url).searchParams.get('path'), page.path);
    assert.deepEqual(metadata.twitter.images[0], image);
  }
});
test('robots advertises the production sitemap and leaves content crawlable', () => {
  const robots = require('../app/robots.ts').default();
  assert.equal(robots.sitemap, siteOrigin + '/sitemap.xml');
  assert.equal(robots.rules.allow, '/');
  assert.deepEqual(robots.rules.disallow, ['/api/', '/social-preview']);
});
