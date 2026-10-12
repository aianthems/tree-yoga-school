const assert = require('node:assert/strict'), test = require('node:test'), fs = require('node:fs'), ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { championStates } = require('../lib/champion-states.ts');
const { sourceReviews, reviewQueue, snapshotEvidence, registerLink } = require('../lib/champion-source-reviews.ts');
test('review tracker covers every register once and keeps plans separate from completed checks', () => {
  assert.deepEqual(sourceReviews.map(r => r.state).sort(), Object.keys(championStates).sort());
  for (const r of sourceReviews) {
    assert.ok(['first','routine'].includes(r.priority));
    assert.match(r.nextReviewOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Date(r.nextReviewOn).toISOString().slice(0,10), r.nextReviewOn);
    assert.ok(r.reviewEveryDays > 0 && r.reason);
    assert.ok(r.lastReviewedOn === null || /^\d{4}-\d{2}-\d{2}$/.test(r.lastReviewedOn));
    if (r.lastReviewedOn) { assert.ok(['unchanged','updated','blocked','needs-follow-up'].includes(r.outcome)); assert.match(r.evidenceUrl, /^https:\/\//); assert.ok(r.notes); }
    else { assert.equal(r.outcome, null); assert.equal(r.evidenceUrl, null); }
    assert.match(registerLink(r.state), /^https:\/\//);
  }
});
test('small due batches prioritize limited and old coverage without treating retrieval as measurement', () => {
  assert.equal(reviewQueue('2026-10-11').length, 0);
  assert.deepEqual(reviewQueue('2026-10-12').map(r=>r.state), ['AK','AZ','HI','ID','LA']);
  assert.equal(reviewQueue('2026-10-12',50).length, 9);
  assert.equal(reviewQueue('2027-01-12',50).length, 50);
  assert.deepEqual(snapshotEvidence('MS'), {label:'Supplied',date:'October 11, 2026'});
  assert.deepEqual(snapshotEvidence('OH'), {label:'Screenshot capture',date:'October 9, 2026'});
  assert.deepEqual(snapshotEvidence('MA'), {label:'Retrieval date',date:'Not documented'});
  assert.deepEqual(snapshotEvidence('PA'), {label:'Retrieval date',date:'Not documented'});
  assert.deepEqual(snapshotEvidence('ID'), {label:'Retrieved',date:'October 11, 2026'});
});
