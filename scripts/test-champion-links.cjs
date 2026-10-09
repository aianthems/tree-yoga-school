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

test('South Carolina champions preserve missing values, county precision and shared selections', () => {
  const records = require('../lib/data/south-carolina-champion-trees.json');
  const coordinates = require('../lib/data/south-carolina-county-points.json');
  const { championRegions, sourceDates, stateNames, townKey } = require('../lib/champion-trees.ts');
  assert.equal(records.length, 196);
  assert.equal(new Set(records.map(t => t.id)).size, 196);
  assert.equal(new Set(records.map(t => t.scientificName)).size, 190);
  assert.equal(Object.keys(coordinates).length, 35);
  assert.equal(records.filter(t => t.nationalFlag).length, 11);
  assert.equal(records.filter(t => t.measured === null).length, 12);
  assert.equal(stateNames.SC, 'South Carolina');
  assert.match(sourceDates.SC, /October 7, 2026/);
  assert.deepEqual(championRegions.southeast.states, ['NC', 'SC', 'TN', 'GA', 'KY', 'AL', 'FL']);
  for (const t of records) {
    assert.equal(t.status, 'State Champ');
    assert.equal(t.id, `sc-${t.sourceRow}`);
    assert.equal(t.publicAccess, undefined);
    assert.equal(t.publicCoordinates, undefined);
    assert.equal(t.location, null);
    assert.ok(coordinates[t.county]);
    assert.equal(townKey({ ...t, state: 'SC', mapPrecision: 'county' }), `SC:county:${t.county}`);
    const selection = { ...emptySelection, region: 'southeast', state: 'SC', county: t.county, species: t.scientificName, selectedId: t.id };
    assert.deepEqual(read(championHref(selection)), selection);
  }
  const incomplete = records.find(t => t.id === 'sc-250');
  assert.equal(incomplete.points, null);
  assert.equal(incomplete.circumference, null);
  assert.equal(incomplete.height, 35);
  assert.equal(incomplete.crown, 44.75);
  // Distinct source-designated champions must not be deduplicated by species.
  assert.equal(records.filter(t => t.scientificName === 'Taxodium distichum').length, 2);
});

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
  assert.equal(count, 5502);
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
  assert.equal(treeVisits.length, 11);
  assert.equal(new Set(treeVisits.map(v => v.slug)).size, 11);
  assert.equal(treeVisits.filter(v => v.championId).length, 8);
  assert.deepEqual(treeVisits.filter(v => !v.championId).map(v => v.state), ["SC", "FL", "IL"]);
  for (const visit of treeVisits) {
    for (const field of ['arrival', 'walking', 'access', 'pause', 'kind', 'checked']) assert.ok(visit[field], `${visit.slug}: ${field}`);
    const record = records.find(tree => tree.id === visit.championId);
    if (visit.championId) {
      assert.ok(record, visit.championId);
      assert.equal(record.scientificName, visit.scientificName);
      assert.equal(record.state || "MA", visit.state);
    } else {
      assert.ok(Object.hasOwn(require("../lib/champion-trees.ts").stateNames, visit.state));
      assert.equal(visit.checked, "2026-10-09");
    }
    assert.ok(visit.sources.length >= 2);
    if (visit.practice.href.startsWith('/trees/')) {
      const slug = visit.practice.href.split('/')[2].split('#')[0];
      assert.ok(require('../lib/trees.ts').trees.some(t => t.slug === slug));
      assert.ok(visit.practice.href.endsWith('#practice'));
    } else assert.equal(visit.practice.href, '/lessons/first-five-minutes');
    const selection = read(championHref(visit.championId ? { state: visit.state, selectedId: visit.championId } : { state: visit.state }));
    if (visit.championId) assert.equal(selection.selectedId, visit.championId);
    else { assert.equal(selection.selectedId, null); assert.equal(selection.species, ""); }
    assert.equal(selection.state, visit.state);
    for (const source of visit.sources) if (source.href.startsWith('/')) assert.ok(fs.existsSync(path.join(__dirname, '../public', source.href)));
  }
  assert.equal(championSpeciesOptions(records).reduce((total, option) => total + option.count, 0), records.length);
});


const { townKey, placeName, championRegions } = require('../lib/champion-trees.ts');
test('West Virginia selections and county places survive sharing', () => {
  const selection = { ...emptySelection, region: 'mid-atlantic', state: 'WV', county: 'Randolph', town: 'WV:county:Randolph', species: 'Abies balsamea', selectedId: 'wv-2025-conifers-10' };
  assert.deepEqual(read(championHref(selection)), selection);
  assert.ok(championRegions['mid-atlantic'].states.includes('WV'));
  assert.equal(placeName({ state: 'WV', mapPrecision: 'county', county: 'Randolph' }), 'Randolph County');
});
test('West Virginia includes only audited score leaders, ties and mapped counties', () => {
  const records = require('../lib/data/west-virginia-champion-trees.json');
  const points = require('../lib/data/west-virginia-county-points.json');
  const audit = require('../lib/data/west-virginia-import-audit.json');
  assert.equal(records.length, 159);
  assert.equal(new Set(records.map(t => t.id)).size, 159);
  assert.equal(Object.keys(points).length, 35);
  assert.equal(audit.sourceFiles.flowering.records + audit.sourceFiles.conifers.records, 533);
  assert.equal(audit.selection.length, 157);
  assert.equal(audit.selection.filter(group => group.selectedRows.length === 2).length, 2);
  const selected = new Map(audit.selection.flatMap(group => group.selectedRows.map(row => [`wv-2025-${row.replace(':', '-')}`, group.maximumPublishedPoints])));
  assert.equal(selected.size, records.length);
  for (const tree of records) {
    assert.equal(tree.state, 'WV');
    assert.equal(tree.points, selected.get(tree.id));
    assert.equal(tree.mapPrecision, 'county');
    assert.ok(points[tree.county]);
    assert.ok(points[tree.county].lat > 37 && points[tree.county].lat < 41);
    assert.ok(points[tree.county].lng > -83 && points[tree.county].lng < -77);
    assert.equal(tree.location, null);
    assert.equal(tree.publicAccess, undefined);
    assert.equal(tree.publicCoordinates, undefined);
    assert.match(tree.measured, /^\d{4}$/);
    assert.match(tree.sourceUrl, /^https:\/\/wvforestry.com\/pdf\/bigtree\/2025-(Flowering|Conifers)-Common.xlsx$/);
  }
  // A close runner-up is not a tie; legacy labels do not override the selection.
  for (const excluded of ['wv-2025-conifers-11', 'wv-2025-flowering-148', 'wv-2025-flowering-156', 'wv-2025-flowering-201', 'wv-2025-flowering-103', 'wv-2025-flowering-101']) {
    assert.ok(!selected.has(excluded));
  }
  assert.equal(records.find(t => t.id === 'wv-2025-flowering-8').county, 'Pendleton');
  assert.equal(records.find(t => t.commonName === 'Fraser Fir').county, 'Pocahontas');
  const dawn = records.find(t => t.commonName === 'Dawn Redwood');
  assert.equal(dawn.circumference, 193);
  assert.ok(dawn.sourceReviewNotes.some(note => note.includes("193 @ 5 1/2'")));
});
test('Virginia retains separate city and county map identities and shareable regional filters', () => {
  const county = { state: 'VA', town: 'Fairfax', county: 'Fairfax', mapPrecision: 'county' };
  const city = { ...county, town: 'City of Fairfax', county: 'Fairfax City' };
  assert.equal(placeName(county), 'Fairfax County');
  assert.equal(placeName(city), 'Fairfax City');
  assert.notEqual(townKey(county), townKey(city));
  assert.ok(championRegions['mid-atlantic'].states.includes('VA'));
  const parsed = read(championHref({ region: 'mid-atlantic', state: 'VA', species: 'Acer rubrum', selectedId: 'va-3009' }));
  assert.equal(parsed.state, 'VA');
  assert.equal(parsed.region, 'mid-atlantic');
  assert.equal(parsed.selectedId, 'va-3009');
});
test('Virginia snapshot has unique source IDs and a geographic point for every record', () => {
  const records = require('../lib/data/virginia-champion-trees.json');
  const points = require('../lib/data/virginia-county-points.json');
  assert.equal(records.length, 369);
  assert.equal(new Set(records.map(t => t.id)).size, 369);
  for (const tree of records) {
    assert.equal(tree.state, 'VA');
    assert.equal(tree.id, `va-${tree.sourceRow}`);
    assert.ok(tree.sourceUrl.endsWith(`Key=${tree.sourceRow}`));
    assert.ok(points[tree.county]);
    assert.ok(points[tree.county].lat > 36 && points[tree.county].lat < 40);
    assert.ok(points[tree.county].lng > -84 && points[tree.county].lng < -75);
    assert.match(tree.measured, /^\d{4}$/);
    assert.equal(tree.publicAccess, undefined);
    assert.equal(tree.publicCoordinates, undefined);
  }
  const redMaple = records.find(t => t.id === 'va-3009');
  assert.equal(redMaple.points, 357);
  assert.equal(redMaple.height, 99);
  assert.equal(redMaple.circumference, 237);
  assert.equal(redMaple.crown, 85);
});

test('North Carolina preserves official designations, access and distinct source rows', () => {
  const records = [...require('../lib/data/north-carolina-champion-trees.json'), ...require('../lib/data/north-carolina-co-champion-trees.json')];
  const points = require('../lib/data/north-carolina-county-points.json');
  assert.equal(records.length, 346);
  assert.equal(new Set(records.map(t => t.id)).size, 346);
  assert.equal(records.filter(t => t.publicAccess).length, 238);
  assert.equal(records.filter(t => t.status === 'State co-champion').length, 181);
  assert.equal(Object.keys(points).length, 76);
  assert.equal(records.filter(t => t.sourceTreeId === '727').length, 1);
  for (const id of ['75', '330', '682']) assert.equal(records.filter(t => t.sourceTreeId === id).length, 2);
  assert.equal(records.find(t => t.sourceRow === 69).sourceTreeId, null);
  for (const t of records) {
    assert.equal(t.measured, null);
    assert.equal(t.location, null);
    assert.equal(t.publicCoordinates, undefined);
    assert.ok(points[t.county]);
    assert.ok(points[t.county].lat > 33 && points[t.county].lat < 37);
    assert.ok(points[t.county].lng > -85 && points[t.county].lng < -75);
    const selection = { ...emptySelection, state: 'NC', county: t.county, town: `NC:county:${t.county}`, selectedId: t.id, publicOnly: t.publicAccess };
    assert.deepEqual(read(championHref(selection)), selection);
  }
});



test("related Library suggestions stay relevant, unique and limited for every profile", () => {
  const { trees } = require("../lib/trees.ts");
  const { relatedLibraryTrees } = require("../lib/tree-library-related.ts");
  const before = trees.map(tree => tree.slug);
  for (const tree of trees) {
    const related = relatedLibraryTrees(tree, trees);
    assert.ok(related.length > 0 && related.length <= 3);
    assert.equal(new Set(related.map(item => item.tree.slug)).size, related.length);
    for (const item of related) {
      assert.notEqual(item.tree.slug, tree.slug);
      assert.ok(item.tree.scientificName.split(" ")[0] === tree.scientificName.split(" ")[0] || item.tree.themes.some(theme => tree.themes.includes(theme)) || (new Set(["Pinus", "Picea", "Tsuga", "Larix"]).has(tree.scientificName.split(" ")[0]) && new Set(["Pinus", "Picea", "Tsuga", "Larix"]).has(item.tree.scientificName.split(" ")[0])));
    }
  }
  assert.deepEqual(trees.map(tree => tree.slug), before);
  const oak = trees.find(tree => tree.slug === "bur-oak");
  assert.ok(relatedLibraryTrees(oak, trees).every(item => item.tree.scientificName.startsWith("Quercus ")));
  assert.deepEqual(relatedLibraryTrees(oak, [oak]), []);
});
