const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const rows = require('../lib/data/montana-champion-trees.json');
const fixture = require('./fixtures/montana-champions-2024.json');
const points = require('../lib/data/montana-county-points.json');
const audit = require('../lib/data/montana-import-audit.json');
const { championRegions } = require('../lib/champion-states.ts');
const { normalizeChampionRecords, normalizeChampionCoordinates } = require('../lib/champion-state-data.ts');
const { townKey, sourceWarnings } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');

test('Montana preserves all table entries, published measurements and source designations', () => {
  assert.equal(rows.length, 174);
  assert.equal(fixture.filter(f => f.native).length, 81);
  assert.equal(fixture.filter(f => !f.native).length, 93);
  assert.deepEqual([...new Set(rows.map(r => r.sourcePage))], [12,13,14,15,16,17,18,19,20,21,22]);
  assert.equal(new Set(rows.map(r => r.id)).size, 174);
  for (const [i,r] of rows.entries()) {
    const f=fixture[i], v=f.values;
    assert.equal(r.sourcePage, f.page); assert.equal(r.sourceRow, f.row);
    assert.ok(r.sourceUrl.endsWith(`#page=${f.page}`));
    assert.equal(r.scientificName, v[1].replaceAll('*','').replace(/-\s+(?=[a-z])/g,''));
    assert.deepEqual([r.diameter,r.circumference,r.height],v.slice(4,7).map(Number));
    assert.equal(r.points, Number(v[3].match(/^\d+/)[0]));
    assert.equal(r.crown, v[7]==='7.' ? null : Number(v[7]));
    assert.equal(r.measured, v[9].match(/\d{4}/g).at(-1));
    assert.ok(r.notes.includes(`Published year history: ${v[9]}.`));
    assert.equal(Boolean(r.nationalFlag), f.national);
    assert.equal(r.status.includes('co-champion'),v[1].includes('*'));
    assert.equal(r.status.endsWith('Urban'),v[2].endsWith('U'));
    assert.equal(r.notes.includes('designates naturalized'),/[∆Δ]/.test(v[2]));
  }
  // A parenthesized national comparison alone must never become a national title.
  assert.ok(rows.some((r,i) => /\(\d+\)/.test(fixture[i].values[3]) && !r.nationalFlag));
  assert.equal(rows.filter(r => r.nationalFlag).length,audit.nationalBadges);
});
test('Montana ambiguity and source name mismatches are visible without guessed corrections', () => {
  const ambiguous=rows.find(r => r.crown===null);
  assert.equal(ambiguous.commonName,'Norway Maple');
  assert.ok(sourceWarnings(ambiguous).some(n => n.includes('“7.”')));
  const scarlet=rows.find(r => r.commonName==='Scarlet Oak');
  assert.equal(scarlet.scientificName,'Quercus rubra');
  assert.ok(sourceWarnings(scarlet).some(n => n.includes('identification')));
  const spelling=rows.find(r => r.sourceCounty==='Ravvalli');
  assert.equal(spelling.county,'Ravalli');
  assert.ok(rows.some(r => r.scientificName.includes('saccharumi')));
});
test('Montana works in state and West filters with county-only geography', () => {
  const normalized=normalizeChampionRecords('MT',rows), coordinates=normalizeChampionCoordinates('MT',points);
  assert.equal(Object.keys(points).length,15);
  assert.equal(normalized.filter(r => coordinates[townKey(r)]).length,174);
  for (const r of normalized) { assert.equal(r.mapPrecision,'county'); assert.equal(r.publicAccess,undefined); assert.equal(r.publicCoordinates,undefined); assert.equal(r.location,null); }
  for (const p of Object.values(points)) { assert.ok(p.lat>44 && p.lat<49); assert.ok(p.lng>-116.1 && p.lng<-104); }
  assert.ok(championRegions.west.states.includes('MT'));
  const href=championHref({state:'MT',region:'west',selectedId:rows[0].id});
  const selected=readChampionSelection(new URL(href,'https://treeyogaschool.com').searchParams);
  assert.equal(selected.state,'MT'); assert.equal(selected.region,'west'); assert.equal(selected.selectedId,rows[0].id);
});
