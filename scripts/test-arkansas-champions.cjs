const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const { readState, validateImports } = require('./validate-champion-imports.cjs');
const { championHref, readChampionSelection } = require('../lib/champion-links.ts');
const { championRegions, championStates } = require('../lib/champion-states.ts');
const { librarySpecies, sourceWarnings } = require('../lib/champion-trees.ts');
test('Arkansas covers every register page and preserves repeated species and unmapped records', () => {
 const {records,coordinates} = readState('AR');
 assert.equal(records.length,125); assert.equal(Object.keys(coordinates).length,50);
 assert.deepEqual(Array.from({length:9},(_,i)=>records.filter(t=>t.sourcePage===i+1).length),[15,15,15,15,15,15,15,15,5]);
 assert.deepEqual(records.filter(t=>!t.county).map(t=>t.id),['ar-43890']);
 assert.equal(records.filter(t=>t.scientificName==='Quercus velutina').length,3);
 assert.equal(records.filter(t=>t.scientificName==='Quercus nigra').length,3);
 assert.equal(records.filter(t=>t.scientificName==='Vaccinium arboreum').length,2);
 assert.deepEqual(validateImports(['AR']).errors,[]);
 assert.ok(championRegions.southeast.states.includes('AR'));
 for(const t of records){assert.equal(t.publicCoordinates,undefined);assert.equal(t.location,null);assert.equal(t.measured,null);assert.equal(readChampionSelection(new URL(championHref({state:'AR',selectedId:t.id}),'https://example.com').searchParams).selectedId,t.id);}
 for(const point of Object.values(coordinates)){assert.ok(point.lat>32&&point.lat<37);assert.ok(point.lng>-95&&point.lng<-89);}
});
test('Arkansas retains nuanced access and explains source unit and naming inconsistencies', () => {
 const {records} = readState('AR');const byId = id=>records.find(t=>t.sourceTreeId===id);
 assert.equal(records.filter(t=>t.publicAccess===true).length,33);
 assert.equal(records.filter(t=>t.publicAccess===undefined).length,7);
 assert.equal(byId('43877').publicAccess,false);assert.equal(byId('43877').visibleFromPublic,'yes');
 assert.equal(byId('43880').accessDetails,'Private, but access allowed');assert.equal(byId('43880').publicAccess,true);
 assert.equal(byId('43800').accessDetails,'Public with limited access');assert.equal(byId('43800').points,668);
 assert.equal(byId('43881').scientificName,'Cunninghamia lanceolata');assert.equal(byId('52547').scientificName,'Vaccinium arboreum');
 assert.equal(byId('43900').scientificName,'Ginkgo biloba');assert.match(byId('43900').sourceReviewNotes.join(' '),/Maidenhair/);
 assert.equal(byId('43895').circumference,104);assert.equal(byId('43984').crown,12);
 assert.match(sourceWarnings(byId('43895')).join(' '),/unit punctuation/);
 assert.equal(byId('43932').points,358);assert.equal(byId('43950').points,195);
 for(const sci of ['Quercus palustris','Acer negundo','Celtis occidentalis','Betula nigra']) assert.ok(librarySpecies[sci]);
 const audit=require('../lib/data/arkansas-import-audit.json');
 const crypto=require('node:crypto');
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(require('node:path').join(__dirname,'fixtures/arkansas-champions-2026-10-09.tsv'))).digest('hex'),audit.extractSha256);
 assert.equal(championStates.AR.expectedMapped,124);
});
