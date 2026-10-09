const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const records=require('../lib/data/wisconsin-champion-trees.json');
const points=require('../lib/data/wisconsin-county-points.json');
const audit=require('../lib/data/wisconsin-import-audit.json');
const {championRegions,townKey}=require('../lib/champion-trees.ts');
const {championHref,readChampionSelection,emptySelection}=require('../lib/champion-links.ts');
test('Wisconsin preserves every published row from both official filtered map layers',()=>{
 assert.equal(records.length,57);assert.equal(new Set(records.map(r=>r.id)).size,57);
 assert.deepEqual(audit.layers.map(l=>l.count),[47,10]);assert.equal(audit.completePublicRegisterRetrieved,true);
 assert.equal(records.filter(r=>r.notes.includes('DNR map display: Township.')).length,10);
 for(const species of ['Taxodium distichum','Populus deltoides','Ulmus americana']) assert.equal(records.filter(r=>r.scientificName===species).length,2);
 const tupelo=records.find(r=>r.commonName==='Black Tupelo');assert.deepEqual([tupelo.circumference,tupelo.height,tupelo.crown,tupelo.points],[63.5,39,44.5,113.625]);
});
test('Wisconsin county markers and access labels do not turn location sharing into visiting permission',()=>{
 assert.equal(Object.keys(points).length,21);assert.ok(championRegions.midwest.states.includes('WI'));
 assert.equal(records.filter(r=>r.publicAccess===false).length,28);assert.equal(records.filter(r=>r.publicAccess===true).length,0);
 for(const r of records){assert.equal(r.measured,null);assert.equal(r.location,null);assert.equal(r.publicCoordinates,undefined);const p=points[r.county];assert.ok(p.lat>42&&p.lat<48&&p.lng>-93&&p.lng<-86);assert.equal(townKey(r),'WI:county:'+r.county);
 const selection={...emptySelection,state:'WI',region:'midwest',county:r.county,selectedId:r.id};assert.deepEqual(readChampionSelection(new URL(championHref(selection),'https://example.com').searchParams),selection);
 assert.ok(!Object.keys(r).some(k=>/owner|latitude|longitude|geometry/i.test(k)));}
 assert.ok(records.some(r=>r.sourceCounty==='milwaukee'&&r.county==='Milwaukee'));
});
