const test = require('node:test'), assert = require('node:assert/strict');
const { readState } = require('./validate-champion-imports.cjs');
const { championRegions } = require('../lib/champion-states.ts');
const { validateChampionState } = require('../lib/champion-validation.ts');
const { normalizeChampionRecords, normalizeChampionCoordinates } = require('../lib/champion-state-data.ts');
const { townKey, sourceWarnings } = require('../lib/champion-trees.ts');
const { championHref, readChampionSelection, emptySelection } = require('../lib/champion-links.ts');
const { filterChampionRecords } = require('../lib/champion-explorer-index.ts');
const fixture = require('./fixtures/wyoming-champions.json'), audit = require('../lib/data/wyoming-import-audit.json');
const { records: rows, coordinates: points } = readState('WY');
test('Wyoming includes all 57 source-designated register entries with original scores and reconciled details', () => {
  assert.equal(rows.length,57); assert.equal(fixture.length,57); assert.equal(audit.detailChecks.length,57);
  assert.ok(audit.detailChecks.every(r=>r.listingMatchesDetail && /^[a-f0-9]{64}$/.test(r.detailSha256)));
  rows.forEach((r,i)=>{
    const f=fixture[i]; assert.equal(r.sourceUrl,f.sourceUrl); assert.equal(r.commonName,f.commonName); assert.equal(r.scientificName,f.scientificName); assert.equal(r.sourceCounty,f.sourceCounty);
    assert.deepEqual([r.circumference,r.height,r.crown,r.points],f.values.map(v=>Number(v.replace(/["']/g,''))));
  });
  const cottonwood=rows.find(t=>t.id==='wy-eastern-cottonwood');
  assert.deepEqual([cottonwood.circumference,cottonwood.height,cottonwood.crown,cottonwood.points],[497,70,100,388]);
  assert.ok(sourceWarnings(cottonwood).some(n=>/592 points/.test(n)));
  assert.equal(rows.filter(t=>sourceWarnings(t).some(n=>/differ by more than one point/.test(n))).length,8);
  assert.ok(rows.some(t=>t.scientificName==='Malus spp.')); assert.ok(rows.some(t=>t.scientificName==="Populus sargentii 'Dode'"));
});
test('Wyoming maps every documented county without inventing measurement dates or visiting access', () => {
  assert.deepEqual(validateChampionState('WY',rows,points).errors,[]); assert.equal(Object.keys(points).length,15);
  const trees=normalizeChampionRecords('WY',rows), coords=normalizeChampionCoordinates('WY',points);
  for(const t of trees){
    assert.equal(t.mapPrecision,'county'); assert.ok(coords[townKey(t)]); assert.equal(t.measured,null); assert.equal(t.publicAccess,undefined); assert.equal(t.publicCoordinates,undefined); assert.equal(t.location,null); assert.equal(t.town,'');
    for(const field of ['owner','nominator','address','lat','long']) assert.equal(Object.hasOwn(t,field),false);
  }
  for(const p of Object.values(points)){assert.ok(p.lat>41&&p.lat<45.1);assert.ok(p.lng>-111.1&&p.lng<-104);}
  assert.equal(filterChampionRecords(trees,{...emptySelection,state:'WY',publicOnly:true}).length,0);
  assert.equal(filterChampionRecords(trees,{...emptySelection,region:'west'}).length,57);
  assert.ok(championRegions.west.states.includes('WY'));
  const parsed=readChampionSelection(new URL(championHref({state:'WY',selectedId:'wy-eastern-cottonwood'}),'https://example.com').searchParams);
  assert.equal(parsed.state,'WY');assert.equal(parsed.selectedId,'wy-eastern-cottonwood');
});
