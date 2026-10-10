const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {treeComparisons,comparisonImage,comparisonsForTree}=require('../lib/tree-comparisons.ts');
const {getTree}=require('../lib/trees.ts');
const {discoveryPages}=require('../lib/site-seo.ts');
test('six complete comparisons resolve both species and every licensed local feature photograph',()=>{
 assert.equal(treeComparisons.length,6);assert.equal(new Set(treeComparisons.map(p=>p.slug)).size,6);
 for(const pair of treeComparisons){
  assert.equal(pair.slugs.length,2);assert.notEqual(...pair.slugs);assert.equal(pair.features.length,3);
  assert.ok(discoveryPages.some(p=>p.path===`/compare-trees/${pair.slug}`));
  for(const slug of pair.slugs){assert.ok(getTree(slug));assert.ok(comparisonsForTree(slug).includes(pair));}
  for(const f of pair.features){assert.equal(f.clues.length,2);assert.equal(f.images.length,2);assert.ok(f.note);
   for(const name of f.images){const im=comparisonImage(name);assert.ok(fs.existsSync('public'+im.image));assert.ok(im.imageWidth>0&&im.imageHeight>0);assert.ok(im.imageAlt);assert.ok(im.credit.photographer);assert.match(im.credit.license,/CC.?BY|Public domain|CC0/);assert.doesNotMatch(im.credit.license,/NC|ND/);assert.match(im.credit.sourceUrl,/^https:\/\//);}
  }
 }
 assert.equal(comparisonsForTree('pine').length,0);assert.throws(()=>comparisonImage('unknown.webp'));
});
