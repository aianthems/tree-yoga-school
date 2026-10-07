const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

// Run the same TypeScript URL helpers used by the server pages and client explorer.
require.extensions[".ts"] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename);
};
const { championHref, emptySelection, readChampionSelection } = require("../lib/champion-links.ts");
const read = href => readChampionSelection(new URL(href, "https://example.com").searchParams);

test("the default view has a clean URL", () => {
  assert.equal(championHref(emptySelection), "/champion-trees");
  assert.deepEqual(read("/champion-trees"), emptySelection);
});

test("every filter survives sharing, including punctuation and Unicode", () => {
  const selection = { ...emptySelection, region: "mid-atlantic", state: "MD", query: "oak & café + park", county: "Prince George's", town: "MD:county:Prince George's", genus: "Quercus", species: "Quercus alba", publicOnly: true, locationsOnly: true, sort: "height", selectedId: "md-123-a" };
  assert.deepEqual(read(championHref(selection)), selection);
});

test("unknown or prototype-like regions, states and sorts fall back safely", () => {
  for (const bad of ["constructor", "__proto__", "missing"]) {
    const parsed = read(`/champion-trees?state=${bad}&region=${bad}&sort=${bad}&public=false&location=false`);
    assert.deepEqual(parsed, emptySelection);
  }
});

test("a valid explicit state wins over a conflicting region", () => {
  const parsed = read("/champion-trees?state=ma&region=mid-atlantic&sort=points");
  assert.equal(parsed.state, "MA");
  assert.equal(parsed.region, "");
  assert.equal(parsed.sort, "points");
});

test("Library links retain exact scientific names rather than broad text searches", () => {
  for (const name of ["Acer saccharum", "Quercus rubra", "Larix laricina"]) {
    const parsed = read(championHref({ species: name }));
    assert.equal(parsed.species, name);
    assert.equal(parsed.query, "");
    assert.equal(parsed.genus, "");
  }
});

test("every current record ID survives URL encoding unchanged", () => {
  const dataDir = path.join(__dirname, "../lib/data");
  let count = 0;
  for (const filename of fs.readdirSync(dataDir).filter(name => name.endsWith("champion-trees.json"))) {
    for (const tree of JSON.parse(fs.readFileSync(path.join(dataDir, filename), "utf8"))) {
      assert.equal(read(championHref({ selectedId: tree.id })).selectedId, tree.id);
      count++;
    }
  }
  assert.equal(count, 2354);
});

const { championSpeciesOptions } = require('../lib/champion-species.ts');
const { treeVisits } = require('../lib/tree-visits.ts');
test('familiar species names group exact botanical categories without merging cultivars', () => {
  const options = championSpeciesOptions([
    { scientificName: 'Acer rubrum', commonName: 'Maple, Red' },
    { scientificName: 'Acer rubrum', commonName: 'Red Maple' },
    { scientificName: 'Acer rubrum October Glory', commonName: 'October Glory red maple' },
    { scientificName: 'Ginkgo biloba', commonName: 'Ginkgo biloba' },
    { scientificName: 'Ginkgo biloba', commonName: 'Maidenhair tree' },
    { scientificName: 'Ulmus americana', commonName: 'Elm, American' },
  ]);
  assert.equal(options.length, 4);
  assert.deepEqual(options.find(x => x.scientificName === 'Acer rubrum'), { scientificName: 'Acer rubrum', name: 'Red maple', count: 2 });
  assert.equal(options.find(x => x.scientificName === 'Ginkgo biloba').name, 'Maidenhair tree');
  assert.equal(options[0].name, 'American elm');
  assert.deepEqual(options, championSpeciesOptions([
    { scientificName: 'Ulmus americana', commonName: 'Elm, American' },
    { scientificName: 'Ginkgo biloba', commonName: 'Maidenhair tree' },
    { scientificName: 'Ginkgo biloba', commonName: 'Ginkgo biloba' },
    { scientificName: 'Acer rubrum October Glory', commonName: 'October Glory red maple' },
    { scientificName: 'Acer rubrum', commonName: 'Red Maple' },
    { scientificName: 'Acer rubrum', commonName: 'Maple, Red' },
  ]));
});
test('visit guides resolve to the intended existing trees and real practice routes', () => {
  const dataDir = path.join(__dirname, '../lib/data');
  const records = fs.readdirSync(dataDir).filter(name => name.endsWith('champion-trees.json')).flatMap(name => JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8')));
  for (const visit of treeVisits) {
    const record = records.find(tree => tree.id === visit.championId);
    assert.ok(record, visit.championId);
    assert.equal(record.scientificName, visit.scientificName);
    assert.equal(record.state || "MA", visit.state);
    assert.ok(visit.sources.length >= 2);
    assert.ok(['/trees/sycamore#practice', '/lessons/first-five-minutes'].includes(visit.practice.href));
    for (const source of visit.sources) if (source.href.startsWith('/')) assert.ok(fs.existsSync(path.join(__dirname, '../public', source.href)));
  }
  assert.equal(championSpeciesOptions(records).reduce((total, option) => total + option.count, 0), records.length);
});
