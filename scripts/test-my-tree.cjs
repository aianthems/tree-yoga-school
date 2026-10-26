const test=require('node:test'),assert=require('node:assert/strict');
require('./sync-library-regions.cjs');
const {readMyTree}=require('../lib/my-tree.ts');
test('My Tree restores versioned species and journal entries across sessions',()=>{
 const entry={id:'one',slug:'pine',date:'2026-10-26',observation:'New needles\nSoft light',reflection:'Return soon'};
 const value={version:1,slug:'pine',notes:[entry]};assert.deepEqual(readMyTree(JSON.stringify(value),['pine']),value);
 assert.deepEqual(readMyTree(null,['pine']),{version:1,slug:'',notes:[]});
 const switched={...value,slug:'maple'};assert.deepEqual(readMyTree(JSON.stringify(switched),['pine','maple']).notes,[entry]);
});
test('My Tree rejects unreadable versions and does not accept invalid species or entries',()=>{
 for(const raw of ['broken','null','{}','{"version":2,"slug":"pine","notes":[]}'])assert.throws(()=>readMyTree(raw,['pine']));
 assert.deepEqual(readMyTree(JSON.stringify({version:1,slug:'missing',notes:[null,{}, {id:'x',slug:'pine',date:'wrong',observation:'x',reflection:''}]}),['pine']),{version:1,slug:'',notes:[]});
});
