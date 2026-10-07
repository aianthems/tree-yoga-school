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
