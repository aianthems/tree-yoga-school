const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const rows = require('../lib/data/idaho-champion-trees.json');
const fixture = require('./fixtures/idaho-champions-2019.json');
const points = require('../lib/data/idaho-county-points.json');
const { championRegions, championCoverage } = require('../lib/champion-states.ts');
const { normalizeChampionRecords, normalizeChampionCoordinates } = require('../lib/champion-state-data.ts');
const { townKey, sourceWarnings } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');
const num = value => Number(value.replace(/["”'’]/g, ''));

test('Idaho preserves all 121 state records across 117 taxa, without national comparison rows', () => {
  assert.equal(rows.length,121);
  assert.equal(new Set(rows.map(r=>r.scientificName)).size,117);
  assert.equal(new Set(rows.map(r=>r.id)).size,121);
  assert.deepEqual([...new Set(rows.map(r=>r.sourcePage))],Array.from({length:17},(_,i)=>i+2));
  for (const [i,r] of rows.entries()) {
    const f=fixture[i];
    assert.equal(r.scientificName,f.scientificName);
    assert.equal(r.commonName,f.commonName);
    assert.equal(r.sourcePage,f.page);assert.equal(r.sourceRow,f.row);
    assert.deepEqual([r.diameter,r.circumference,r.height,r.crownPoints,r.points],f.measurements.map(num));
    assert.equal(r.crown,r.crownPoints*4);
    assert.equal(r.measured,null);
    assert.equal(r.nominated,f.nominationYears[0]);
  }
  for (const name of ['Abies grandis','Acer glabrum var. douglasii','Pinus ponderosa var. ponderosa','Salix exigua var. exigua']) {
    const pair=rows.filter(r=>r.scientificName===name);
    assert.equal(pair.length,2); assert.ok(pair.every(r=>r.status.includes('co-champion')));
  }
  const birch=rows.filter(r=>r.scientificName==='Betula pendula');
  assert.equal(birch.length,1);assert.equal(birch[0].points,218);assert.equal(birch[0].county,'Washington');
  assert.equal(rows.filter(r=>r.nationalFlag).length,1);
  assert.equal(rows.find(r=>r.scientificName==='Thuja plicata').points,867);
  assert.equal(rows.find(r=>r.id==='id-p12-r3').circumference,233);
});

test('Idaho preserves source spelling and flags county conflicts instead of silently changing them',()=>{
  const adams=rows.find(r=>r.sourceCounty==='Adam');
  assert.equal(adams.county,'Adams');assert.ok(sourceWarnings(adams).some(n=>n.includes('Adams')));
  const willow=rows.find(r=>r.scientificName==='Salix alba var. tristis');
  assert.equal(willow.county,'Idaho');assert.ok(sourceWarnings(willow).some(n=>n.includes('confirmation')));
  assert.ok(rows.some(r=>r.scientificName==='Betula papyifera var. subcordata'));
  assert.ok(rows.some(r=>r.scientificName==='Alnus incana spp. tenuifolia'));
});

test('Idaho supports state, West, and record links using county geography without private locations',()=>{
  const records=normalizeChampionRecords('ID',rows),coordinates=normalizeChampionCoordinates('ID',points);
  assert.equal(Object.keys(points).length,29);
  assert.equal(records.filter(r=>coordinates[townKey(r)]).length,121);
  for (const r of records) {assert.equal(r.mapPrecision,'county');assert.equal(r.publicAccess,undefined);assert.equal(r.publicCoordinates,undefined);assert.equal(r.location,null);assert.equal(r.town,'');}
  for (const p of Object.values(points)) {assert.ok(p.lat>42&&p.lat<49);assert.ok(p.lng>-117.3&&p.lng<-111);}
  assert.ok(championRegions.west.states.includes('ID'));
  assert.equal(championCoverage.states,50);
  const href=championHref({state:'ID',region:'west',selectedId:rows[0].id});
  const selected=readChampionSelection(new URL(href,'https://treeyogaschool.com').searchParams);
  assert.equal(selected.state,'ID');assert.equal(selected.selectedId,rows[0].id);
});
