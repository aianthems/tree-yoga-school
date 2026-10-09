const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { siteOrigin, discoveryPages, pageMetadata, isIndexableDeployment } = require('../lib/site-seo.ts');
const robots = require('../app/robots.ts').default;
const sitemap = require('../app/sitemap.ts').default;
const officialOrigin = 'https://treeyogaschool.com';
function inEnvironment(environment, callback) {
  const before = process.env.VERCEL_ENV;
  if (environment === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = environment;
  try { callback(); } finally {
    if (before === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = before;
  }
}
test('all sitemap and canonical/social URLs use the independently specified official origin', () => {
  assert.equal(siteOrigin, officialOrigin);
  assert.equal(sitemap().length, 131);
  assert.equal(new Set(sitemap().map(entry => entry.url)).size, 131);
  for (const entry of sitemap()) {
    assert.equal(new URL(entry.url).origin, officialOrigin);
    assert.equal(entry.lastModified, undefined);
  }
  for (const page of discoveryPages) {
    const m = pageMetadata(page.path, page.title, page.description);
    assert.equal(m.alternates.canonical, officialOrigin + page.path);
    assert.equal(m.openGraph.url, officialOrigin + page.path);
    for (const image of [...m.openGraph.images, ...m.twitter.images]) assert.equal(new URL(image.url).origin, officialOrigin);
  }
});
test('production allows public indexing and advertises the official sitemap', () => {
  inEnvironment('production', () => {
    assert.deepEqual(robots(), {rules:{userAgent:'*',allow:'/',disallow:['/api/','/social-preview']},sitemap:officialOrigin+'/sitemap.xml'});
    assert.deepEqual(pageMetadata('/trees/oak', 'Oak', 'Practice').robots, {index:true,follow:true});
  });
});
test('nonproduction Vercel environments block robots and emit noindex without advertising a sitemap', () => {
  for (const environment of ['preview', 'development', 'staging']) inEnvironment(environment, () => {
    assert.deepEqual(robots(), {rules:{userAgent:'*',disallow:'/'}});
    assert.deepEqual(pageMetadata('/', 'Tree Yoga School', 'Practice').robots, {index:false,follow:false});
    assert.equal(pageMetadata('/', 'Tree Yoga School', 'Practice').alternates.canonical, officialOrigin + '/');
  });
  assert.equal(isIndexableDeployment(undefined), true);
});
test('public app and metadata source files contain no legacy origin or hard-coded indexing override', () => {
  function inspect(directory) {
    for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
      const file=path.join(directory,entry.name);
      if (entry.isDirectory()) inspect(file);
      else if (/\.(tsx?|mjs)$/.test(entry.name)) assert.ok(!fs.readFileSync(file,'utf8').includes('tree-yoga-school.vercel.app'), `${file} contains the legacy domain`);
    }
  }
  inspect(path.join(__dirname,'../app'));
  inspect(path.join(__dirname,'../lib'));
  const layout=fs.readFileSync(path.join(__dirname,'../app/layout.tsx'),'utf8');
  assert.ok(layout.includes('metadataBase: new URL(siteOrigin)'));
  assert.ok(!layout.includes('index: true'));
});
