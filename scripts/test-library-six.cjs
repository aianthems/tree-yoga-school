const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {plainsLibraryTrees}=require('../lib/tree-library-plains.ts');const {trees}=require('../lib/trees.ts');const {sixLibraryTrees}=require('../lib/tree-library-six.ts');const {libraryTreeForSpecies}=require('../lib/champion-trees.ts');const {championSpeciesOptions,sameChampionSpecies}=require('../lib/champion-species.ts');const {filterLibraryTrees}=require('../lib/tree-library-search.ts');const {discoveryPages}=require('../lib/site-seo.ts');const {championHref,readChampionSelection}=require('../lib/champion-links.ts');const {championStates}=require('../lib/champion-states.ts');
test('twelve recent profiles have complete content, attributed local photographs and public practice routes',()=>{
 assert.equal(trees.length,52);assert.equal(new Set(trees.map(t=>t.slug)).size,52);assert.equal(sixLibraryTrees.length,6);assert.equal(plainsLibraryTrees.length,6);
 for(const t of [...sixLibraryTrees,...plainsLibraryTrees]){
  assert.equal(t.identity.length,3);assert.equal(t.energies.length,3);assert.equal(t.practice.length,4);assert.ok(t.seasons);assert.ok(t.reflection);assert.ok(t.principles);
  assert.ok(discoveryPages.some(p=>p.path===`/trees/${t.slug}`));assert.ok(discoveryPages.some(p=>p.path===`/practice/${t.slug}`));
  for(const im of [t,...t.detailImages]){
   assert.ok(fs.existsSync('public'+im.image));assert.ok(im.imageWidth>0&&im.imageHeight>0);assert.ok(im.imageAlt);assert.ok(im.credit.photographer);assert.match(im.credit.license,/CC.?BY|Public domain/);assert.doesNotMatch(im.credit.license,/NC|ND/);assert.match(im.credit.sourceUrl,/^https:\/\/(plants.ces.ncsu.edu\/plants\/|commons.wikimedia.org\/wiki\/)/);
  }
 }
});
test('every matching champion can link back and Library species links include capitalization variants without synonyms',()=>{
 const records=Object.values(championStates).flatMap(c=>c.recordFiles.flatMap(f=>require('../lib/data/'+f)));
 for(const t of [...sixLibraryTrees,...plainsLibraryTrees]){
  const matches=records.filter(r=>sameChampionSpecies(r.scientificName,t.scientificName));assert.ok(matches.length>0);
  for(const r of matches)assert.equal(libraryTreeForSpecies(r.scientificName).slug,t.slug);
  const selection=readChampionSelection(new URL(championHref({species:t.scientificName}),'https://example.com').searchParams);assert.equal(selection.species,t.scientificName);
  assert.equal(libraryTreeForSpecies(t.scientificName.toUpperCase()).slug,t.slug);
 }
 assert.equal(libraryTreeForSpecies('Juniperus silicicola'),undefined);assert.ok(!sameChampionSpecies('Catalpa bignonioides','Catalpa speciosa'));
 const options=championSpeciesOptions([{scientificName:'Juniperus virginiana',commonName:'Eastern redcedar'},{scientificName:'Juniperus Virginiana',commonName:'Red cedar'},{scientificName:'Juniperus silicicola',commonName:'Southern redcedar'}]);assert.equal(options.length,2);assert.equal(options.find(o=>sameChampionSpecies(o.scientificName,'Juniperus virginiana')).count,2);
});
test('new common-name aliases find their intended Library profiles',()=>{
 for(const [q,slug] of [['red cedar','eastern-redcedar'],['cigar tree','northern-catalpa'],['cucumber tree','cucumber-magnolia'],['necklace poplar','eastern-cottonwood'],['bitter hickory','bitternut-hickory'],['dogwood','flowering-dogwood'],['hedge apple','osage-orange'],['chinquapin oak','chinkapin-oak'],['Kentucky coffee tree','kentucky-coffeetree'],['red elm','slippery-elm'],['white walnut','butternut']])assert.ok(filterLibraryTrees(trees,q,'').some(t=>t.slug===slug));
});
