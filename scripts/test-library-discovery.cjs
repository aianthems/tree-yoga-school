const assert=require('node:assert/strict'),test=require('node:test'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {trees}=require('../lib/trees.ts');
const {treeIdentification,identificationOptions}=require('../lib/tree-identification.ts');
const {practiceCategories,treePracticeCategories,emptyLibrarySelection,readLibrarySelection,libraryHref,discoverLibraryTrees,hasLibraryFilters}=require('../lib/tree-library-discovery.ts');
const result=(patch={})=>discoverLibraryTrees(trees,{...emptyLibrarySelection,...patch});
const slugs=patch=>result(patch).map(t=>t.slug);
test('discovery sorts the full Library alphabetically without mutating source order',()=>{
 const before=trees.map(t=>t.slug), az=result();
 assert.equal(az.length,63);assert.deepEqual(az.map(t=>t.name),[...trees].map(t=>t.name).sort((a,b)=>a.localeCompare(b,'en')));
 assert.deepEqual(result({sort:'za'}).map(t=>t.slug),az.map(t=>t.slug).reverse());
 assert.deepEqual(result({sort:'scientific'}).map(t=>t.scientificName),trees.map(t=>t.scientificName).sort((a,b)=>a.localeCompare(b,'en')));
 assert.deepEqual(trees.map(t=>t.slug),before);
});
test('six broad practice categories cover every tree while retaining detailed profile themes',()=>{
 assert.equal(practiceCategories.length,6);
 for(const tree of trees)assert.ok(treePracticeCategories(tree).length,tree.slug);
 for(const category of practiceCategories){const expected=trees.filter(t=>category.themes.some(theme=>t.themes.includes(theme)));assert.ok(expected.length);assert.deepEqual(new Set(slugs({practice:category.value})),new Set(expected.map(t=>t.slug)));}
 assert.deepEqual(slugs({query:'pitch pine',practice:'steadiness'}),['pitch-pine']);
 assert.deepEqual(slugs({query:'pitch pine',practice:'curiosity'}),[]);
});
test('URL selections round-trip every filter, sort and view, including punctuation',()=>{
 const selection={query:'oak & maple / Quercus',practice:'steadiness',foliage:'broad',arrangement:'alternate',lobes:'lobed',bark:'furrowed',sort:'za',view:'compact'};
 const href=libraryHref(selection);assert.ok(href.startsWith('/trees?'));assert.deepEqual(readLibrarySelection(new URL(href,'https://example.com').searchParams),selection);
 assert.deepEqual(readLibrarySelection(new URLSearchParams('practice=bad&foliage=bad&arrangement=bad&lobes=bad&bark=bad&sort=bad&view=bad')),emptyLibrarySelection);
 assert.equal(libraryHref(emptyLibrarySelection),'/trees');assert.equal(hasLibraryFilters(emptyLibrarySelection),false);
 assert.equal(hasLibraryFilters({...emptyLibrarySelection,sort:'za',view:'compact'}),false);
 for(const key of ['query','practice','foliage','arrangement','lobes','bark'])assert.equal(hasLibraryFilters({...emptyLibrarySelection,[key]:'active'}),true);
});
test('all profiles have sourced identification metadata and every option is reachable',()=>{
 assert.deepEqual(new Set(Object.keys(treeIdentification)),new Set(trees.map(t=>t.slug)));
 for(const tree of trees){const traits=treeIdentification[tree.slug];assert.equal(traits.sourceUrl,tree.sourceUrl);assert.ok(traits.foliage.length);for(const key of Object.keys(identificationOptions))for(const value of traits[key])assert.ok(identificationOptions[key].some(o=>o.value===value),`${tree.slug}:${key}:${value}`);}
 for(const [key,options] of Object.entries(identificationOptions))for(const option of options)assert.ok(slugs({[key]:option.value}).length,`${key}:${option.value}`);
});
test('observable filters intersect, preserve variable shapes, and avoid confusing leaflets with leaves',()=>{
 assert.deepEqual(slugs({foliage:'broad',arrangement:'opposite',lobes:'lobed'}),['boxelder','maple','red-maple','silver-maple']);
 assert.deepEqual(slugs({bark:'smooth',query:'musclewood'}),['american-hornbeam']);
 assert.deepEqual(slugs({bark:'patchwork'}),['sycamore']);
 assert.ok(slugs({lobes:'lobed'}).includes('sassafras'));assert.ok(slugs({lobes:'unlobed'}).includes('sassafras'));
 assert.ok(slugs({foliage:'needles'}).includes('dawn-redwood'));assert.ok(slugs({foliage:'needles'}).includes('pitch-pine'));
 assert.ok(slugs({foliage:'scales'}).includes('eastern-redcedar'));assert.ok(slugs({foliage:'needles'}).includes('eastern-redcedar'));
 assert.ok(slugs({arrangement:'opposite',query:'ash'}).includes('white-ash'));assert.equal(slugs({arrangement:'whorled',query:'butternut'}).length,0);
 assert.deepEqual(slugs({foliage:'needles',bark:'patchwork'}),[]);assert.equal(result().length,63);
});
