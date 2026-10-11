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
 assert.deepEqual(validateChampionState('MS', rows, points).errors, []);
 assert.deepEqual(points, { Tunica: { lat: 34.652201, lng: -90.37177 } });
 const [tree] = normalizeChampionRecords('MS', rows);
 assert.equal(tree.mapPrecision, 'county'); assert.equal(tree.location, null); assert.equal(tree.town, '');
 assert.equal(tree.publicAccess, undefined); assert.equal(tree.publicCoordinates, undefined);
 assert.doesNotMatch(JSON.stringify(rows), /Todd Matthews|Measurer\(s\)/);
 assert.ok(championRegions.southeast.states.includes('MS'));
 const selected = readChampionSelection(new URL(championHref({ state: 'MS', selectedId: tree.id }), 'https://example.com').searchParams);
 assert.equal(selected.state, 'MS'); assert.equal(selected.selectedId, 'ms-5821'); assert.equal(championStates.MS.expectedRecords, 1);
});
