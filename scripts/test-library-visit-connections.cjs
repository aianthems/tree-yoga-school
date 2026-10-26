const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {trees}=require('../lib/trees.ts');
const {visitConnectionTrees: additions}=require('../lib/tree-library-visit-connections.ts');
const {treeVisits}=require('../lib/tree-visits.ts');
const {visitPreviews}=require('../lib/tree-visit-discovery.ts');
const {libraryTreeForSpecies}=require('../lib/champion-trees.ts');
const {discoverLibraryTrees,emptyLibrarySelection}=require('../lib/tree-library-discovery.ts');
const {discoveryPages}=require('../lib/site-seo.ts');
const photos=require('./fixtures/tree-library-visit-connections-photo-sources.json');
const result=patch=>discoverLibraryTrees(trees,{...emptyLibrarySelection,...patch}).map(t=>t.slug);
test('four additions complete matching species, visit and outdoor practice routes in both directions',()=>{
 assert.equal(trees.length,79);assert.equal(additions.length,4);
 for(const tree of additions){
  assert.equal(libraryTreeForSpecies(tree.scientificName.toUpperCase()).slug,tree.slug);
  assert.equal(tree.identity.length,3);assert.equal(tree.energies.length,3);assert.equal(tree.practice.length,4);assert.ok(tree.detailImages.length);
  for(const route of [`/trees/${tree.slug}`,`/practice/${tree.slug}`])assert.ok(discoveryPages.some(p=>p.path===route));
  assert.equal(tree.visitSlugs.length,1);
  for(const slug of tree.visitSlugs){
   const visit=treeVisits.find(v=>v.slug===slug);assert.ok(visit);assert.equal(visit.scientificName,tree.scientificName);assert.equal(visit.librarySlug,tree.slug);
   assert.equal(visit.practice.href,`/trees/${tree.slug}#practice`);assert.equal(visit.practice.title,tree.practiceTitle);
   assert.equal(visitPreviews([visit])[0].practiceHref,`/practice/${tree.slug}`);
   assert.ok(discoveryPages.some(p=>p.path===`/tree-visits/${slug}`));
  }
 }
 const template=fs.readFileSync('app/trees/[slug]/page.tsx','utf8');assert.ok(template.includes('tree.visitSlugs?.includes(visit.slug)'));assert.ok(template.includes('Places to visit this species'));
});
test('new species photos are licensed local assets with source provenance and visible attribution records',()=>{
 const attribution=fs.readFileSync('public/images/trees/ATTRIBUTION.md','utf8');assert.equal(photos.length,9);
 for(const tree of additions)for(const im of [tree,...tree.detailImages]){
  assert.ok(fs.existsSync('public'+im.image));assert.ok(im.imageWidth>0&&im.imageHeight>0&&im.imageAlt);
  const p=photos.find(p=>p.image===im.image);assert.ok(p);assert.deepEqual(p.credit,im.credit);assert.ok(p.originalUrl.startsWith('https://'));
  assert.doesNotMatch(im.credit.license,/NC|ND/);assert.ok(attribution.includes(im.image.split('/').pop()));
 }
});
test('compound leaves, lobed aralia, evergreen foliage and aliases use appropriate discovery choices',()=>{
 assert.deepEqual(result({query:'yellowwood',arrangement:'opposite'}),[]);
 assert.deepEqual(result({query:'yellowwood',arrangement:'alternate',lobes:'unlobed'}),['american-yellowwood']);
 assert.deepEqual(result({query:'castor aralia',arrangement:'alternate',lobes:'lobed'}),['castor-aralia']);
 assert.deepEqual(result({query:'live oak',lobes:'unlobed'}),['southern-live-oak']);
 for(const foliage of ['needles','scales'])assert.ok(result({query:'giant sequoia',foliage}).includes('giant-sequoia'));
 for(const [query,slug] of [['Sierra redwood','giant-sequoia'],['Cladrastis lutea','american-yellowwood'],['Kalopanax pictus','castor-aralia']])assert.ok(result({query}).includes(slug));
 assert.ok(additions.find(t=>t.slug==='castor-aralia').practiceIntroduction.includes('no-touch'));
});
