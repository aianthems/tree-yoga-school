const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {championStates}=require('../lib/champion-states.ts');
const {championStatePages,championStateHref,championStateFromSlug,stateLibrarySpecies,stateNotableRecords}=require('../lib/champion-state-pages.ts');
const {normalizeChampionRecords}=require('../lib/champion-state-data.ts');
const {formatChampionDate}=require('../lib/champion-trees.ts');
const {championHref,readChampionSelection}=require('../lib/champion-links.ts');
const {trees}=require('../lib/trees.ts');const {treeVisits}=require('../lib/tree-visits.ts');const {discoveryPages}=require('../lib/site-seo.ts');
const notes=require('../lib/champion-register-notes.json');
test('every supported state has a unique readable destination, metadata, and sitemap entry',()=>{
 assert.equal(championStatePages.length,Object.keys(championStates).length);assert.equal(new Set(championStatePages.map(p=>p.slug)).size,Object.keys(championStates).length);
 for(const page of championStatePages){assert.equal(championStateFromSlug(page.slug),page.state);assert.match(page.slug,/^[a-z]+(?:-[a-z]+)*$/);const entry=discoveryPages.find(p=>p.path===championStateHref(page.state));assert.ok(entry);assert.ok(entry.title.includes(page.name));assert.ok(entry.description.includes(String(championStates[page.state].expectedRecords)));}
 assert.equal(championStateFromSlug('district-of-columbia'),undefined);assert.equal(championStateFromSlug('CA'),undefined);assert.equal(championStateHref('INVALID'),'/champion-trees');
});
test('shared register notes cover every state and resolve every source field',()=>{
 assert.deepEqual(new Set(Object.keys(notes)),new Set(Object.keys(championStates)));
 for(const [state,paragraphs] of Object.entries(notes)){assert.ok(paragraphs.length);for(const paragraph of paragraphs)for(const part of paragraph)if(typeof part!=='string')assert.notEqual(championStates[state].source[part.field],undefined,`${state}:${part.field}`);}
 const ohio=notes.OH.flat().filter(p=>typeof p==='string').join('');assert.doesNotMatch(ohio,/DCR’s champion score|What makes a champion/);
 assert.match(notes.WA.flat().filter(p=>typeof p==='string').join(''),/unmapped/);
});
test('state previews use only positive finite heights, preserve records, and sort ties consistently',()=>{
 const records=[{id:'b',height:10},{id:'a',height:10},{id:'c',height:30},{id:'zero',height:0},{id:'blank',height:null},{id:'bad',height:NaN},{id:'inf',height:Infinity}];const before=records.map(r=>r.id);
 assert.deepEqual(stateNotableRecords(records).map(r=>r.id),['c','a','b']);assert.deepEqual(records.map(r=>r.id),before);assert.deepEqual(stateNotableRecords([]),[]);
});
test('state species counts match scientific names across capitalization, without merging synonyms or cultivars',()=>{
 const library=trees.filter(t=>t.slug==='willow-oak');const rows=[{scientificName:'Quercus phellos'},{scientificName:'QUERCUS PHELLOS'},{scientificName:'Quercus phellos High Tower'},{scientificName:'Quercus alba'}];
 assert.equal(stateLibrarySpecies(rows,library)[0].count,2);assert.deepEqual(stateLibrarySpecies([],trees),[]);
});
test('every actual state preview and represented species links to a valid filtered record or practice',()=>{
 for(const [state,config] of Object.entries(championStates)){
  const rows=normalizeChampionRecords(state,config.recordFiles.flatMap(f=>require('../lib/data/'+f)));
  for(const row of stateNotableRecords(rows)){assert.equal(row.state,state);assert.notEqual(formatChampionDate(row.measured),'Invalid Date');const selection=readChampionSelection(new URL(championHref({state,selectedId:row.id}),'https://example.com').searchParams);assert.equal(selection.state,state);assert.equal(selection.selectedId,row.id);}
  for(const {tree,count} of stateLibrarySpecies(rows,trees)){assert.ok(count>0);assert.ok(discoveryPages.some(p=>p.path===`/practice/${tree.slug}`));}
  const visits=treeVisits.filter(v=>v.state===state);for(const visit of visits)assert.ok(discoveryPages.some(p=>p.path===`/tree-visits/${visit.slug}`));
 }
});
