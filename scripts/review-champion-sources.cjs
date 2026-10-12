// Offline queue: reads existing metadata; never fetches, imports, or starts CI.
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { reviewQueue, sourceReviews } = require('../lib/champion-source-reviews.ts');
const { championStates } = require('../lib/champion-states.ts');
const args = process.argv.slice(2);
const asOf = args[0] || new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf) || Number.isNaN(Date.parse(asOf))) throw Error('Use an ISO review date: YYYY-MM-DD');
const batch = reviewQueue(asOf);
console.log(`Source review queue as of ${asOf}: ${sourceReviews.filter(r => r.nextReviewOn <= asOf).length} due; showing up to five.`);
for (const review of batch) console.log(`${review.state} · ${championStates[review.state].name} · ${review.nextReviewOn} · ${review.reason}`);
if (!batch.length) console.log('No reviews due. Existing source snapshots remain unchanged.');
