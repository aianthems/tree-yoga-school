const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const { readJourneyProgress, setJourneyDay, nextJourneyDay } = require('../lib/journey-progress.ts');
test('missing, corrupt and unsupported local progress never opts a visitor in', () => {
  for (const value of [null, '', 'bad json', 'null', '[]', '{"version":2,"completed":[1]}', '{"version":1}']) assert.equal(readJourneyProgress(value), null);
});
test('stored completion is normalized to seven valid unique day numbers', () => {
  const progress = readJourneyProgress(JSON.stringify({version:1,completed:[7,2,2,0,8,1.5,'3',null,1],reflection:'not retained'}));
  assert.deepEqual(progress, {version:1,completed:[1,2,7]});
  assert.equal(nextJourneyDay(progress), 3);
  assert.deepEqual(readJourneyProgress(JSON.stringify(progress)), progress);
});
test('completion, undo, reset and finishing all seven days preserve an honest next step', () => {
  let progress = {version:1,completed:[]};
  assert.equal(nextJourneyDay(progress),1);
  progress = setJourneyDay(progress,3,true);
  assert.equal(nextJourneyDay(progress),1);
  for (let day=1;day<=7;day++) progress=setJourneyDay(progress,day,true);
  assert.equal(nextJourneyDay(progress),null);
  assert.deepEqual(setJourneyDay(progress,3,false).completed,[1,2,4,5,6,7]);
  assert.equal(nextJourneyDay(setJourneyDay(progress,3,false)),3);
  assert.equal(setJourneyDay(progress,9,true),progress);
  assert.equal(nextJourneyDay({version:1,completed:[]}),1);
});
