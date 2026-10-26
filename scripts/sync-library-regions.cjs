const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, f);
const { trees } = require('../lib/trees.ts');
const { championStates, championRegions } = require('../lib/champion-states.ts');
function buildRegionData() {
  const regions = ['new-england', 'mid-atlantic', 'southeast', 'midwest', 'south-central', 'west', 'alaska', 'pacific'].map(key => ({ value: key, label: key === 'pacific' ? 'Hawaiʻi' : championRegions[key].name, states: championRegions[key].states.map(code => ({ code, name: championStates[code].name })) }));
  const records = Object.fromEntries(Object.entries(championStates).map(([code, state]) => [code, state.recordFiles.flatMap(file => JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/data', file), 'utf8')))]));
  const species = {};
  for (const tree of trees) {
    species[tree.slug] = {};
    for (const region of regions) {
      const states = region.states.filter(({ code }) => records[code].some(record => record.scientificName.trim().toLowerCase() === tree.scientificName.trim().toLowerCase())).map(state => state.code);
      if (states.length) species[tree.slug][region.value] = states;
    }
  }
  return { regions, species };
}
if (require.main === module) {
  const file = path.join(__dirname, '../lib/tree-library-region-data.json');
  const content = JSON.stringify(buildRegionData(), null, 2) + '\n';
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) { console.error('Regional Library data is stale. Run npm run sync:library-regions.'); process.exitCode = 1; }
    else console.log('Regional Library data matches all state registers.');
  } else fs.writeFileSync(file, content);
}
module.exports = { buildRegionData };
