const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, f);
const rows = require('../lib/data/mississippi-champion-trees.json'), points = require('../lib/data/mississippi-county-points.json'), audit = require('../lib/data/mississippi-import-audit.json');
const { championStates, championRegions } = require('../lib/champion-states.ts');
const { validateChampionState } = require('../lib/champion-validation.ts');
const { normalizeChampionRecords } = require('../lib/champion-state-data.ts');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');
const notes = require('../lib/champion-register-notes.json');
test('Mississippi retains the sole MS national-register row and discloses source disagreement', () => {
 assert.equal(rows.length, 1); const tree = rows[0];
 assert.deepEqual([tree.id, tree.sourceTreeId, tree.state, tree.scientificName, tree.commonName, tree.county], ['ms-5821', '5821', 'MS', 'Cornus drummondii', 'Roughleaf Dogwood', 'Tunica']);
 assert.deepEqual([tree.circumference, tree.height, tree.crown, tree.points, tree.diameter], [39, 30, 34, 78, 12.41]);
 assert.equal(tree.measured, '2016'); assert.equal(tree.nominated, '2016');
 assert.match(tree.status, /2024/); assert.match(tree.sourceReviewNotes.join(' '), /30 feet.*28 feet/);
 assert.equal(audit.sourceRows, 547); assert.equal(audit.stateFilter, 'State == MS');
 assert.deepEqual(audit.includedIds, ['5821']); assert.equal(audit.countyGeoid, '28143');
 assert.match(notes.MS.flat().join(' '), /not a complete Mississippi state register/);
});
test('Mississippi uses only a county point and works in Southeast filters and shared record links', () => {

 assert.deepEqual(points.Tunica, { lat: 34.652201, lng: -90.37177 });
 assert.equal(Object.keys(points).length, 51);
 const historical = require('../lib/data/mississippi-historical-champion-trees.json');
 assert.deepEqual(validateChampionState('MS', [...rows, ...historical], points).errors, []);
 const [tree] = normalizeChampionRecords('MS', rows);
 assert.equal(tree.mapPrecision, 'county'); assert.equal(tree.location, null); assert.equal(tree.town, '');
 assert.equal(tree.publicAccess, undefined); assert.equal(tree.publicCoordinates, undefined);
 assert.doesNotMatch(JSON.stringify(rows), /Todd Matthews|Measurer\(s\)/);
 assert.ok(championRegions.southeast.states.includes('MS'));
 const selected = readChampionSelection(new URL(championHref({ state: 'MS', selectedId: tree.id }), 'https://example.com').searchParams);
 assert.equal(selected.state, 'MS'); assert.equal(selected.selectedId, 'ms-5821'); assert.equal(championStates.MS.expectedRecords, 164);
});

const historical = require('../lib/data/mississippi-historical-champion-trees.json');
const historicalAudit = require('../lib/data/mississippi-historical-import-audit.json');
const { sourceWarnings, townKey } = require('../lib/champion-trees.ts');
const { filterChampionRecords } = require('../lib/champion-explorer-index.ts');
const { emptySelection } = require('../lib/champion-links.ts');
const { createHash } = require('node:crypto');
test('Mississippi scan rows keep historical dates, original units, designations and county-only access', () => {
 assert.equal(historical.length, 163);
 assert.deepEqual(Object.fromEntries([3,4,5,6,7,8,9,10].map(page => [page,historical.filter(t=>t.sourcePage===page).length])), {3:20,4:23,5:19,6:25,7:25,8:20,9:11,10:20});
 assert.equal(historicalAudit.introductoryChampionCount,164);
 assert.equal(historicalAudit.transcribedTableRows,163);
 assert.match(historicalAudit.countDiscrepancy,/No missing record/);
 assert.equal(historical.filter(t=>t.sourceDesignation==='*').length,4);
 assert.equal(historical.filter(t=>t.sourceDesignation==='**').length,10);
 assert.equal(historical.filter(t=>t.sourceDesignation==='***').length,2);
 assert.equal(createHash('sha256').update(fs.readFileSync('public/data/mississippi-champions-2000-transcription.pdf')).digest('hex'),historicalAudit.publicTranscriptionSha256);
 assert.equal(createHash('sha256').update(fs.readFileSync(historicalAudit.transcriptionFile)).digest('hex'),historicalAudit.transcriptionSha256);
 const normalized=normalizeChampionRecords('MS',historical);
 for(const t of normalized) {
  assert.equal(t.historical,true); assert.equal(t.sourceEdition,'October 2000'); assert.equal(t.measured,null);
  assert.match(t.status,/Historical champion record.*October 2000/);
  assert.ok(t.sourcePage>=3 && t.sourcePage<=10);
  assert.ok(t.sourceUrl.endsWith('#page='+t.sourcePage));
  assert.equal(t.publicAccess,undefined); assert.equal(t.publicCoordinates,undefined); assert.equal(t.location,null); assert.equal(t.town,'');
  assert.equal(t.mapPrecision,'county'); assert.ok(points[t.county]); assert.equal(townKey(t),'MS:county:'+t.county);
  assert.ok(t.sourceMeasurements && t.sourceMeasurements.crown.includes(' ft '));
 }
 assert.doesNotMatch(JSON.stringify(historical),/Mark Simmons|John Palmer|lerickson@|601-/);
 const cypress=historical.find(t=>t.commonName==='Baldcypress');
 assert.deepEqual([cypress.circumference,cypress.height,cypress.crown,cypress.points],[556,70,60,641]);
 const pine=historical.find(t=>t.commonName==='Spruce Pine');
 assert.equal(pine.height,154); assert.match(pine.sourceReviewNotes.join(' '),/152-foot Black Willow/);
 const durand=historical.find(t=>t.commonName==='Durand Oak');
 assert.equal(durand.points,269.75); assert.ok(sourceWarnings(durand).some(n=>n.includes('271.75')));
 for(const id of historicalAudit.possibleDuplicateRows) assert.match(historical.find(t=>t.id===id).sourceReviewNotes.join(' '),/Possible duplicate source listing/);
});
test('Mississippi source selections preserve the newer deep link and separate historical dogwoods', () => {
 const trees=normalizeChampionRecords('MS',[...rows,...historical]);
 assert.equal(new Set(trees.map(t=>t.id)).size,164);
 const old=filterChampionRecords(trees,{...emptySelection,state:'MS',query:'October 2000'});
 const newer=filterChampionRecords(trees,{...emptySelection,state:'MS',query:'2024'});
 assert.equal(old.length,163); assert.ok(old.every(t=>t.historical));
 assert.deepEqual(newer.map(t=>t.id),['ms-5821']);
 const dogwoods=trees.filter(t=>t.scientificName==='Cornus drummondii');
 assert.deepEqual(dogwoods.map(t=>t.county),['Tunica','Washington']);
 assert.ok(dogwoods[1].sourceReviewNotes.some(n=>n.includes('not merged')));
 assert.deepEqual(filterChampionRecords(trees,{...emptySelection,state:'MS',publicOnly:true}),[]);
 for(const tree of [dogwoods[0],old[0]]) {
  const selection=readChampionSelection(new URL(championHref({state:'MS',selectedId:tree.id}),'https://example.com').searchParams);
  assert.equal(selection.selectedId,tree.id);
 }
});
