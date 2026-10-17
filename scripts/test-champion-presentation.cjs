const fs = require('node:fs');
const ts = require('typescript');
const assert = require('node:assert/strict');
const test = require('node:test');
const { createHash } = require('node:crypto');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, f);
const { championStates } = require('../lib/champion-states.ts');
const { normalizeChampionRecords } = require('../lib/champion-state-data.ts');
const { townKey } = require('../lib/champion-trees.ts');
const { championPresentation, championResultSummary, championLocationDescription } = require('../lib/champion-presentation.ts');

test('result labels preserve the reviewed text for every source record in all 50 states', () => {
  // Captured independently from the pre-refactor JSX renderer at c5623fa.
  const fixture = require('./fixtures/champion-presentation.json');
  assert.deepEqual(Object.keys(fixture), Object.keys(championStates));
  for (const [state, config] of Object.entries(championStates)) {
    const rows = normalizeChampionRecords(state, config.recordFiles.flatMap(f => require('../lib/data/' + f)));
    const coordinates = Object.fromEntries(Object.entries(require('../lib/data/' + config.coordinateFile))
      .map(([key, value]) => [`${state}:${config.coordinatePrecision === 'county' ? 'county:' : ''}${key}`, value]));
    const labels = rows.map(tree => [tree.id, renderToStaticMarkup(React.createElement(React.Fragment, null,
      championResultSummary(tree, Boolean(coordinates[townKey(tree)])))),
      championPresentation(tree.state).locationHeading, championLocationDescription(tree)]);
    assert.equal(rows.length, fixture[state].records, state);
    assert.equal(createHash('sha256').update(JSON.stringify(labels)).digest('hex'), fixture[state].sha256, state);
  }
});

test('measurement units, date meanings and geographic exceptions remain explicit', () => {
  assert.equal(championPresentation('IL').circumferenceField, 'circumferenceFeet');
  assert.equal(championPresentation('IL').circumferenceLabel, 'circumference · feet');
  assert.equal(championPresentation('NH').circumferenceLabel, 'circumference · as published');
  for (const state of ['ID', 'NV']) assert.equal(championPresentation(state).crownField, 'spread');
  assert.equal(championPresentation('CT').countyLabel, 'Planning Region');
  assert.equal(championPresentation('MI').measurementDateLabel, 'Verification date:');
  assert.equal(championPresentation('SC').measurementDateLabel, 'Date shown by Clemson:');
  assert.equal(championPresentation('WV').measurementDateLabel, 'Last inspection (year):');
  assert.equal(championPresentation('VT').measurementDateLabel, 'Data collected:');
  for (const state of ['ME', 'MD', 'VA']) assert.equal(championPresentation(state).measurementDateLabel, 'Last measured (year):');
  assert.equal(championPresentation('MA').measurementDateLabel, 'Measured:');
  assert.equal(championPresentation('LA').locationHeading, 'Parish published by Louisiana Forestry Association');
  assert.equal(championResultSummary({ state: 'NC', status: 'Champion', publicAccess: false }, true), 'Champion · public access not authorized');
  assert.equal(championResultSummary({ state: 'KS', status: 'Champion' }, false), 'Champion · place not mapped');
});
