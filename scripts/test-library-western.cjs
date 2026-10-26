const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {trees,getTree}=require('../lib/trees.ts');const {westernLibraryTrees: additions}=require('../lib/tree-library-western.ts');const {libraryTreeForSpecies}=require('../lib/champion-trees.ts');const {discoverLibraryTrees,emptyLibrarySelection}=require('../lib/tree-library-discovery.ts');const {discoveryPages}=require('../lib/site-seo.ts');const {treeComparisons,comparisonsForTree,comparisonImage,comparisonReviewDate,additionalComparisonReferences}=require('../lib/tree-comparisons.ts');const {relatedLibraryTrees}=require('../lib/tree-library-related.ts');const photos=require('./fixtures/tree-library-western-photo-sources.json');
const result=patch=>discoverLibraryTrees(trees,{...emptyLibrarySelection,...patch}).map(t=>t.slug);
test('five western species have complete credited content and generated profile/practice/map connections',()=>{
 assert.equal(trees.length,84);assert.equal(new Set(trees.map(t=>t.slug)).size,84);assert.equal(additions.length,5);
 for(const t of additions){
  assert.equal(t.identity.length,3);assert.equal(t.energies.length,3);assert.equal(t.practice.length,4);assert.ok(t.detailImages.length);assert.ok(t.seasons&&t.reflection&&t.principles);
  assert.equal(libraryTreeForSpecies(t.scientificName.toUpperCase()).slug,t.slug);
  for(const path of [`/trees/${t.slug}`,`/practice/${t.slug}`])assert.ok(discoveryPages.some(p=>p.path===path));
  for(const im of [t,...t.detailImages]){assert.ok(fs.existsSync('public'+im.image));const p=photos.find(p=>p.image===im.image);assert.ok(p);assert.deepEqual(im.credit,p.credit);assert.doesNotMatch(im.credit.license,/NC|ND/);assert.ok(im.imageAlt&&im.imageWidth>0&&im.imageHeight>0);}
 }
 assert.equal(photos.length,17);
});
test('western discovery distinguishes scale leaves from broadleaf evergreen foliage and keeps names searchable',()=>{
 assert.ok(result({foliage:'scales',query:'western red cedar'}).includes('western-redcedar'));
 assert.deepEqual(result({query:'madrone',foliage:'needles'}),[]);
 assert.ok(result({query:'madrona',foliage:'broad',arrangement:'alternate',lobes:'unlobed',bark:'peeling'}).includes('pacific-madrone'));
 for(const [q,slug] of [['coastal redwood','coast-redwood'],['Douglas fir','douglas-fir'],['Oregon pine','douglas-fir'],['giant arborvitae','western-redcedar'],['western yellow pine','ponderosa-pine']])assert.ok(result({query:q}).includes(slug));
 const pine=relatedLibraryTrees(getTree('douglas-fir'),trees);assert.ok(pine.some(x=>x.reason==='Same botanical family · Pinaceae'));
});
test('aspen companion comparisons preserve existing sources and link both profiles and practices',()=>{
 assert.equal(treeComparisons.length,8);
 for(const slug of ['quaking-aspen-bigtooth-aspen','quaking-aspen-eastern-cottonwood']){
  const pair=treeComparisons.find(p=>p.slug===slug);assert.ok(pair);assert.equal(pair.features.length,2);assert.equal(pair.slugs[0],'aspen');
  assert.equal(comparisonReviewDate(slug),'October 26, 2026');assert.ok(additionalComparisonReferences(slug).length>=2);
  for(const species of pair.slugs){assert.ok(getTree(species));assert.ok(comparisonsForTree(species).includes(pair));assert.ok(discoveryPages.some(p=>p.path===`/practice/${species}`));}
  for(const feature of pair.features)for(const name of feature.images){const im=comparisonImage(name);assert.ok(fs.existsSync('public'+im.image));assert.doesNotMatch(im.credit.license,/NC|ND/);}
 }
 assert.equal(comparisonReviewDate('white-oak-bur-oak'),'October 10, 2026');
 const template=fs.readFileSync('app/compare-trees/[slug]/page.tsx','utf8');assert.ok(template.includes('comparisonReviewDate(pair.slug)'));assert.ok(template.includes('tree.sourceLabel ??'));
});
