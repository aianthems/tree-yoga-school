// Generate only current coverage; historical import snapshots stay unchanged.
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {championCoverage}=require('../lib/champion-states.ts');
const {trees}=require('../lib/trees.ts');const {treeVisits,treeVisitStateCount}=require('../lib/tree-visits.ts');const {treeComparisons}=require('../lib/tree-comparisons.ts');
const file=path.join(__dirname,'../README.md');const before=fs.readFileSync(file,'utf8');
const block=`<!-- coverage:start -->\n- Champion Map: **${championCoverage.states} states**, **${championCoverage.listed.toLocaleString('en-US')} listed records**, and **${championCoverage.mapped.toLocaleString('en-US')} records with approximate map points**.\n- Tree Library: **${trees.length} species profiles** and **${treeComparisons.length} photographic comparisons**.\n- Trees to Visit: **${treeVisits.length} guides across ${treeVisitStateCount} states**.\n\nGenerated from the state registry and content collections. Run \`npm run sync:coverage\` after content changes; builds check for stale counts.\n<!-- coverage:end -->`;
const after=before.replace(/<!-- coverage:start -->[\s\S]*?<!-- coverage:end -->/,block).replace(/and a \d+-species Tree Library\./,`and a ${trees.length}-species Tree Library.`);
if(!before.includes('<!-- coverage:start -->'))throw Error('README coverage markers are missing');
if(process.argv.includes('--check')){if(after!==before){console.error('README coverage is stale. Run npm run sync:coverage.');process.exitCode=1;}}
else {fs.writeFileSync(file,after);console.log('README current coverage synchronized.');}
