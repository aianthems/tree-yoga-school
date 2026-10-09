const assert = require('node:assert/strict');
const test = require('node:test');
const { readState, validateImports } = require('./validate-champion-imports.cjs');
const { championStates } = require('../lib/champion-states.ts');
const { buildChampionDataset, normalizeChampionRecords } = require('../lib/champion-state-data.ts');
const { validateChampionState } = require('../lib/champion-validation.ts');
const { townKey } = require('../lib/champion-trees.ts');

test('all state imports satisfy the common integrity and mapping checks', () => {
  const report = validateImports();
  assert.deepEqual(report.errors, []);
  assert.equal(report.results.length, 32);
});
test('source refresh checks reject lost rows, duplicate IDs, invalid values and missing geography', () => {
  const { records, coordinates } = readState('MN');
  assert.ok(validateChampionState('MN', records.slice(1), coordinates).errors.some(error => error.includes('expected 62 records')));
  const corrupt = structuredClone(records); corrupt[1].id = corrupt[0].id; corrupt[0].height = 'unknown'; corrupt[0].state = 'OH';
  const errors = validateChampionState('MN', corrupt, {}).errors.join('\n');
  for (const expected of ['duplicate ID', 'finite number or null', 'wrong source state', 'unmapped records changed']) assert.ok(errors.includes(expected));
});
test('shared normalization preserves source records and explicit unmapped exceptions', () => {
  const { records, coordinates } = readState('OH'); const before = structuredClone(records);
  const normalized = normalizeChampionRecords('OH', records);
  assert.deepEqual(records, before);
  const grayBirch = normalized.find(tree => !tree.county);
  assert.ok(grayBirch);
  assert.ok(championStates.OH.unmappedIds.includes(grayBirch.id));
  assert.equal(grayBirch.publicAccess, undefined);
  assert.equal(townKey(grayBirch), 'OH:county:');
  assert.deepEqual(validateChampionState('OH', records, coordinates).errors, []);
});
test('the assembled dataset keeps every row, stable order and per-state coordinate prefixes', () => {
  const datasets = Object.fromEntries(Object.keys(championStates).map(state => [state, readState(state)]));
  const dataset = buildChampionDataset(datasets);
  assert.equal(dataset.trees.length, Object.values(championStates).reduce((sum, config) => sum + config.expectedRecords, 0));
  assert.equal(new Set(dataset.trees.map(tree => tree.id)).size, dataset.trees.length);
  for (const state of Object.keys(championStates)) {
    const config = championStates[state];
    const expected = config.recordFiles.flatMap(file => require('../lib/data/' + file)).map(tree => tree.id);
    assert.deepEqual(dataset.trees.filter(tree => tree.state === state).map(tree => tree.id), expected);
    for (const key of Object.keys(datasets[state].coordinates)) assert.ok(dataset.coordinates[`${state}:${config.coordinatePrecision === 'county' ? 'county:' : ''}${key}`]);
  }
});
test('server dataset bindings match the registry files and every manifest count', () => {
  const Module = require('node:module');
  const originalLoad = Module._load;
  let server;
  try {
    Module._load = function(request, ...args) { return request === 'server-only' ? {} : originalLoad.call(this, request, ...args); };
    server = require('../lib/champion-tree-data.ts');
  } finally { Module._load = originalLoad; }
  const expected = buildChampionDataset(Object.fromEntries(Object.keys(championStates).map(state => [state, readState(state)])));
  assert.deepEqual(server.championTrees, expected.trees);
  assert.deepEqual(server.townCoordinates, expected.coordinates);
  for (const entry of server.championManifest) {
    assert.equal(entry.listed, championStates[entry.state].expectedRecords);
    assert.equal(entry.mapped, championStates[entry.state].expectedMapped);
  }
});
