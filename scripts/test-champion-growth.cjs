const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { championStates } = require('../lib/champion-states.ts');
const { librarySpecies, libraryTreeForSpecies } = require('../lib/champion-trees.ts');
const { loadChampionStates, championDownloadConcurrency } = require('../lib/champion-loader.ts');
const tick = () => new Promise(resolve => setImmediate(resolve));

test('all Library scientific names resolve regardless of source capitalization and preserve source names', () => {
  for (const [name, profile] of Object.entries(librarySpecies)) {
    assert.equal(libraryTreeForSpecies(name.toUpperCase()), profile);
    assert.equal(libraryTreeForSpecies(` ${name.toLowerCase()} `), profile);
  }
  const records = Object.values(championStates).flatMap(c => c.recordFiles.flatMap(f => require('../lib/data/' + f)));
  for (const [id, slug] of [['vt-42', 'eastern-redbud'], ['me-2020-19', 'yellow-birch'], ['me-2020-29', 'cedar'], ['me-2020-120', 'eastern-redcedar']]) {
    const record = records.find(t => t.id === id);
    assert.ok(record);
    assert.equal(libraryTreeForSpecies(record.scientificName).slug, slug);
    assert.equal(librarySpecies[record.scientificName], undefined);
  }
  assert.equal(libraryTreeForSpecies('Betula lenta'), undefined); // no synonym inference
});

test('state downloads stay bounded, publish immediately and continue after failure', async () => {
  const states = Object.keys(championStates);
  const started = [], success = [], failed = [], releases = [];
  let active = 0, peak = 0;
  const load = loadChampionStates(states, code => {
    started.push(code); active++; peak = Math.max(peak, active);
    return new Promise((resolve, reject) => releases.push(() => {
      active--;
      if (code === states[0]) reject(Error('offline')); else resolve({ trees: [], coordinates: {} });
    }));
  }, code => success.push(code), code => failed.push(code));
  assert.equal(started.length, championDownloadConcurrency);
  releases.shift()(); await tick();
  assert.deepEqual(failed, [states[0]]);
  assert.equal(started.length, championDownloadConcurrency + 1);
  releases.shift()(); await tick();
  assert.equal(success.length, 1); // does not await the remaining registers
  while (releases.length) { releases.shift()(); await tick(); }
  await load;
  assert.equal(peak, championDownloadConcurrency);
  assert.equal(started.length, states.length);
  assert.equal(success.length, states.length - 1);
});

test('changing filters stops queued obsolete downloads while caching active successes', async () => {
  const states = Object.keys(championStates), started = [], cached = [], releases = [];
  let disposed = false;
  const load = loadChampionStates(states, code => {
    started.push(code);
    return new Promise(resolve => releases.push(() => resolve({ trees: [], coordinates: {} })));
  }, code => cached.push(code), () => assert.fail(), () => !disposed);
  disposed = true;
  for (const release of releases) release();
  await load;
  assert.equal(started.length, championDownloadConcurrency);
  assert.deepEqual(cached.sort(), started.sort());
  let calls = 0;
  await loadChampionStates([], async () => { calls++; }, () => assert.fail(), () => assert.fail());
  await loadChampionStates(states, async () => { calls++; }, () => assert.fail(), () => assert.fail(), () => false);
  assert.equal(calls, 0);
});

test('shared coverage and region copy follow the registry and README stays synchronized', () => {
 const {championCoverage,championMapDescription,championRegionCoverage,championRegions}=require('../lib/champion-states.ts');
 const {discoveryPages}=require('../lib/site-seo.ts');
 assert.deepEqual(championCoverage,{states:Object.keys(championStates).length,listed:Object.values(championStates).reduce((n,s)=>n+s.expectedRecords,0),mapped:Object.values(championStates).reduce((n,s)=>n+s.expectedMapped,0)});
 assert.ok(championMapDescription.includes(`${championCoverage.states} states`));assert.equal(discoveryPages.find(p=>p.path==='/champion-trees').description,championMapDescription);
 for(const [region,config] of Object.entries(championRegions))for(const state of config.states.filter(s=>s in championStates))assert.ok(championRegionCoverage(region).includes(championStates[state].name));
 const check=require('node:child_process').spawnSync(process.execPath,['scripts/sync-coverage-readme.cjs','--check'],{encoding:'utf8'});assert.equal(check.status,0,check.stderr);
});
