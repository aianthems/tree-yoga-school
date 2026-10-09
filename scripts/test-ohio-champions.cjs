const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const records = require('../lib/data/ohio-champion-trees.json');
const points = require('../lib/data/ohio-county-points.json');
const audit = require('../lib/data/ohio-import-audit.json');
const { townKey, championRegions, sourceWarnings, stateNames } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection, emptySelection } = require('../lib/champion-links.ts');
test('Ohio includes all 127 native rows and all 126 non-native rows', () => {
  assert.equal(records.length, 253);
  assert.equal(audit.nativeCoverage, 'complete');
  assert.equal(audit.completeNativeRegisterRetrieved, true);
  assert.equal(records.filter(r => r.sourceUrl === audit.sourceUrls[0]).length, 127);
  assert.equal(records.filter(r => r.sourceUrl === audit.sourceUrls[1]).length, 126);
  assert.equal(new Set(records.map(r => r.id)).size, 253);
  const chestnut = records.find(r => r.scientificName === 'Castanea mollissima');
  assert.deepEqual([chestnut.circumference, chestnut.height, chestnut.crown, chestnut.points], [158.6, 55, 57.5, 228]);
  const elm = records.find(r => r.scientificName === 'Ulmus americana');
  assert.equal(elm.points, 333);
  assert.equal(elm.circumference + elm.height + elm.crown / 4, 261);
  assert.ok(sourceWarnings(elm).some(w => w.includes('333') && w.includes('261')));
});
test('Ohio county areas and shared filter URLs preserve access uncertainty', () => {
  assert.equal(stateNames.OH, 'Ohio');
  assert.ok(championRegions.midwest.states.includes('OH'));
  assert.equal(Object.keys(points).length, 67);
  for (const tree of records) {
    assert.equal(townKey(tree), 'OH:county:' + tree.county);
    assert.equal(tree.location, null);
    assert.equal(tree.measured, null);
    assert.equal(tree.publicCoordinates, undefined);
    assert.equal(tree.publicAccess, undefined);
    const point = points[tree.county];
    if (tree.county) assert.ok(point.lat > 38 && point.lat < 42 && point.lng > -85 && point.lng < -80);
    else {
      assert.equal(tree.commonName, "Gray Birch");
      assert.equal(point, undefined);
      assert.ok(sourceWarnings(tree).some(w => w.includes("county blank")));
    }
    const selection = { ...emptySelection, state: 'OH', region: 'midwest', county: tree.county, town: townKey(tree), species: tree.scientificName, selectedId: tree.id };
    assert.deepEqual(readChampionSelection(new URL(championHref(selection), 'https://example.com').searchParams), selection);
  }
});

test('Ohio native screenshot pagination covers 1–127 without gaps or species deduplication', () => {
  const native = records.filter(r => r.sourceUrl === audit.sourceUrls[0]);
  assert.equal(audit.nativePublishedTotal, 127);
  assert.equal(audit.nonNativeCoverage, 'complete');
  assert.deepEqual(native.map(r => r.sourceRow), Array.from({length:127}, (_, i) => i + 1));
  assert.deepEqual([1,2,3,4,5,6].map(page => native.filter(r => r.sourcePage === page).length), [25,25,25,25,25,2]);
  assert.deepEqual(audit.screenshots.filter(s => s.category === 'native').map(s => [s.firstRow, s.lastRow]), [[1,25],[26,50],[51,75],[76,100],[101,125],[126,127]]);
  for (const species of ['Fraxinus nigra', 'Asimina triloba', 'Quercus coccinea', 'Crataegus coccinea var. pringlei']) {
    assert.equal(native.filter(r => r.scientificName === species).length, 2, species);
  }
  assert.equal(native.filter(r => !r.county).length, 1);
  assert.equal(records.filter(r => points[r.county]).length, 252);
  assert.deepEqual(native.slice(-2).map(r => [r.commonName, r.points, r.height, r.county]), [['Yellow Buckeye',301,104,'Hamilton'],['Yellow-poplar',390,176,'Preble']]);
  assert.equal(native.find(r => r.commonName === 'Blackhaw').points, 65.75);
  assert.equal(native.find(r => r.commonName === 'Virginia Pine').points, 191.87);
  assert.equal(native.find(r => r.commonName === 'Eastern Hemlock').height, 141.6);
  assert.equal(native.find(r => r.commonName === 'Willow Oak').circumference, 217.5);
  assert.equal(native.find(r => r.commonName === 'American Basswood').id, 'oh-2406e11cee8f');
});

test('Ohio non-native pagination preserves all 126 published rows and repeated entries', () => {
 const rows = records.filter(r => r.sourceUrl === audit.sourceUrls[1]);
 assert.equal(audit.completeRegisterRetrieved, true);
 assert.equal(audit.nonNativePublishedTotal, 126);
 assert.deepEqual(rows.map(r => r.sourceRow), Array.from({length:126}, (_,i) => i+1));
 assert.deepEqual([1,2,3,4,5,6].map(p => rows.filter(r => r.sourcePage === p).length), [25,25,25,25,25,1]);
 assert.deepEqual(audit.screenshots.filter(s => s.category === 'non-native').map(s => [s.firstRow,s.lastRow]), [[1,25],[26,50],[51,75],[76,100],[101,125],[126,126]]);
 for (const name of ['Common Apple','Hedge Maple','Western Red Cedar']) assert.equal(rows.filter(r => r.commonName === name).length,2);
 assert.equal(rows.find(r => r.commonName === 'Weeping Willow').points,373.254);
 assert.equal(rows.find(r => r.commonName === 'Japanese Raisintree').height,45.4);
 assert.deepEqual([rows.at(-1).commonName,rows.at(-1).points,rows.at(-1).county],['Yulan Magnolia',59,'Franklin']);
 assert.ok(rows.every(r => points[r.county]));
});
