const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { loadChampionStates } = require('../lib/champion-loader.ts');
const { stateNames, librarySpecies, championRegions, townKey } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');

test('successful states publish before a slow state; failures preserve successes and retry only missing states', async () => {
  const cache = {}, failed = [], calls = [];
  let resolveTN;
  const pending = new Promise(resolve => { resolveTN = resolve; });
  const payload = { trees: [], coordinates: {} };
  const load = loadChampionStates(['TN', 'MA', 'NH'], async code => {
    calls.push(code);
    if (code === 'TN') return pending;
    if (code === 'NH') throw Error('offline');
    return payload;
  }, (code, value) => { cache[code] = value; }, code => failed.push(code));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(cache.MA, payload);
  assert.equal(cache.TN, undefined);
  assert.deepEqual(failed, ['NH']);
  resolveTN(payload); await load;
  assert.equal(cache.TN, payload);
  const missing = ['TN', 'MA', 'NH'].filter(code => !cache[code]);
  await loadChampionStates(missing, async code => { calls.push(code); return payload; }, (code, value) => { cache[code] = value; }, () => assert.fail());
  assert.deepEqual(calls, ['TN', 'MA', 'NH', 'NH']);
  assert.deepEqual(Object.keys(cache).sort(), ['MA', 'NH', 'TN']);
});

test('Tennessee keeps all source entries and leaves the unmatched county unmapped', () => {
  const records = require('../lib/data/tennessee-champion-trees.json');
  const points = require('../lib/data/tennessee-county-points.json');
  assert.equal(records.length, 183);
  assert.equal(new Set(records.map(t => t.id)).size, 183);
  assert.equal(new Set(records.map(t => t.scientificName)).size, 164);
  assert.equal(records.filter(t => points[t.county]).length, 182);
  assert.equal(Object.keys(points).length, 38);
  const unmapped = records.filter(t => !points[t.county]);
  assert.equal(unmapped[0].county, 'Lafayette');
  assert.ok(unmapped[0].sourceReviewNotes.length);
  assert.equal(records.filter(t => t.scientificName === 'Liriodendron tulipifera').length, 2);
  for (const t of records) {
    assert.equal(t.state, 'TN');
    assert.equal(t.measured, null);
    assert.equal(t.location, null);
    assert.equal(t.publicAccess, undefined);
    assert.equal(t.publicCoordinates, undefined);
    assert.equal(townKey(t), `TN:county:${t.county}`);
    if (points[t.county]) {
      assert.ok(points[t.county].lat > 34 && points[t.county].lat < 37);
      assert.ok(points[t.county].lng > -91 && points[t.county].lng < -81);
    }
    const selection = readChampionSelection(new URL(championHref({ state: 'TN', selectedId: t.id }), 'https://example.com').searchParams);
    assert.equal(selection.state, 'TN'); assert.equal(selection.selectedId, t.id);
  }
  assert.equal(stateNames.TN, 'Tennessee');
  assert.ok(championRegions.southeast.states.includes('TN'));
});

test('all twenty added profiles have matching map links and local credited images', () => {
  const { trees } = require('../lib/trees.ts');
  assert.equal(trees.length, 58);
  for (const name of ['Ulmus americana', 'Fraxinus americana', 'Cercis canadensis', 'Taxodium distichum', 'Liriodendron tulipifera', 'Sassafras albidum', 'Nyssa sylvatica', 'Metasequoia glyptostroboides', 'Carpinus caroliniana', 'Carya ovata', 'Acer saccharinum', 'Prunus serotina', 'Ostrya virginiana', 'Betula nigra', 'Juglans nigra', 'Tilia americana', 'Fraxinus pennsylvanica', 'Quercus velutina', 'Liquidambar styraciflua', 'Quercus macrocarpa']) {
    const tree = trees.find(t => t.scientificName === name);
    assert.ok(tree); assert.equal(librarySpecies[name].slug, tree.slug);
    assert.equal(tree.identity.length, 3); assert.equal(tree.energies.length, 3); assert.equal(tree.practice.length, 4);
    assert.ok(tree.detailImages.length);
    for (const im of [tree, ...tree.detailImages]) {
      assert.ok(fs.existsSync('public' + im.image)); assert.ok(im.credit.photographer); assert.ok(im.credit.licenseUrl);
    }
  }
});

