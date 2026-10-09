const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { championStates, championRegions } = require('../lib/champion-states.ts');
const { validateChampionState } = require('../lib/champion-validation.ts');
const root = path.resolve(__dirname, '..');
function readState(state) {
  const config = championStates[state];
  return { records: config.recordFiles.flatMap(file => JSON.parse(fs.readFileSync(path.join(root, 'lib/data', file), 'utf8'))), coordinates: JSON.parse(fs.readFileSync(path.join(root, 'lib/data', config.coordinateFile), 'utf8')) };
}
function validateImports(states = Object.keys(championStates)) {
  const errors = [], results = [], globalIds = new Set(), orders = new Set();
  for (const [state, config] of Object.entries(championStates)) {
    if (orders.has(config.recordOrder)) errors.push(`Duplicate record order: ${state}`);
    orders.add(config.recordOrder);
    if (config.importer && !fs.existsSync(path.join(root, 'scripts', config.importer))) errors.push(`Missing importer: ${state}`);
    if (config.auditFile && !fs.existsSync(path.join(root, 'lib/data', config.auditFile))) errors.push(`Missing import audit: ${state}`);
    if (!config.sourceDate || !Object.entries(config.source).some(([key,value]) => key.endsWith('Url') && typeof value === 'string' && /^(https?:\/\/|\/data\/)/.test(value))) errors.push(`Missing provenance: ${state}`);
  }
  for (const [region, config] of Object.entries(championRegions)) for (const state of config.states) if (!Object.hasOwn(championStates, state)) errors.push(`Unknown ${state} in ${region}`);
  for (const state of states) {
    if (!Object.hasOwn(championStates, state)) { errors.push(`Unknown state: ${state}`); continue; }
    try {
      const data = readState(state);
      const result = validateChampionState(state, data.records, data.coordinates);
      results.push(result); errors.push(...result.errors);
      for (const tree of data.records) {
        if (globalIds.has(tree.id)) errors.push(`Duplicate ID across registers: ${tree.id}`);
        globalIds.add(tree.id);
      }
    } catch (error) { errors.push(`${state}: ${error.message}`); }
  }
  return { results, errors };
}
module.exports = { readState, validateImports };
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--state')) { console.error('Usage: npm run validate:champions -- [--state MN]'); process.exitCode = 1; }
  else {
    const report = validateImports(args.length ? [args[1].toUpperCase()] : undefined);
    for (const result of report.results) console.log(`${result.state}: ${result.listed} records; ${result.mapped} mapped`);
    if (report.errors.length) { console.error(report.errors.join('\n')); process.exitCode = 1; }
    else console.log(`Validated ${report.results.length} states successfully.`);
  }
}
