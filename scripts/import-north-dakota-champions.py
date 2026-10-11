"""Import the published North Dakota StoryMap; reconcile, never union, older records.
Usage: python scripts/import-north-dakota-champions.py STORY.json OLD.html META.json COUNTIES.zip COUSUBS.zip NEWS.html
Raw inputs may contain personal details. Outputs omit them and all tree coordinates.
"""
import csv, hashlib, html, io, json, re, sys, zipfile
from html.parser import HTMLParser
from pathlib import Path
from datetime import datetime, timezone
ROOT = Path(__file__).resolve().parents[1]
STORY = 'https://storymaps.arcgis.com/stories/a6b45a88a67347a3b77cd60cc02432bf'
OLD = 'https://www.ag.ndsu.edu/smallgrains/ndfs/about-north-dakota-forestry/champion-trees-of-north-dakota'

class Table(HTMLParser):
    def __init__(self): super().__init__(); self.rows = []; self.row = None; self.cell = None
    def handle_starttag(self, tag, attrs):
        if tag == 'tr': self.row = []
        if tag in ('td', 'th') and self.row is not None: self.cell = ''
        if tag == 'br' and self.cell is not None: self.cell += ' '
    def handle_data(self, data):
        if self.cell is not None: self.cell += data
    def handle_endtag(self, tag):
        if tag in ('td', 'th') and self.cell is not None: self.row.append(' '.join(self.cell.split())); self.cell = None
        if tag == 'tr' and self.row is not None: self.rows.append(self.row); self.row = None

def clean(text): return html.unescape(re.sub('<[^>]+>', '', text)).strip()
def feet(text):
    text = text.strip().replace('’', "'").replace('′', "'").replace('“', '"').replace('”', '"')
    if not text: return None
    m = re.fullmatch(r"(?:(\d+(?:\.\d+)?)'\s*)?(?:(\d+(?:\.\d+)?)\")?", text)
    if m and any(m.groups()): return float(m[1] or 0) + float(m[2] or 0) / 12
    return float(text)
def measurements(values): return [round(feet(values[0]) * 12, 6), feet(values[1]), feet(values[2])]
def gazetteer(path):
    with zipfile.ZipFile(path) as z: text = z.read(z.namelist()[0]).decode('utf-8-sig')
    return [{k.strip(): v.strip() for k, v in r.items()} for r in csv.DictReader(io.StringIO(text), delimiter='|') if r['USPS'] == 'ND']
def month_date(value):
    if not value: return None
    month, year = value.split()
    months = {'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6, 'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12}
    return f"{year}-{months[month.lower()[:3]]:02d}"
def build(paths):
    story_path, old_path, meta_path, county_path, subdiv_path, news_path = map(Path, paths)
    story = json.loads(story_path.read_text()); nodes = story['nodes']; meta = json.loads(meta_path.read_text())
    assert meta['access'] == 'public'
    root_children = nodes[story['root']]['children']
    # Only tours in the published story graph, not orphaned or draft nodes.
    tours = [nodes[k] for k in root_children if nodes[k]['type'] == 'tour']
    assert len(tours) == 2 and [len(t['data']['places']) for t in tours] == [87, 50]
    def texts(key):
        n = nodes[key]
        return [clean(n.get('data', {}).get('text', ''))] + [s for child in n.get('children', []) for s in texts(child)]
    parser = Table(); parser.feed(old_path.read_text()); old = []; common = sci = ''
    for row in parser.rows:
        if len(row) < 10 or row[2] not in ('Champion', 'Runner-Up'): continue
        common = row[0] or common; sci = row[1] or sci
        try: old_values = measurements(row[3:6])
        except ValueError: old_values = None  # Malformed legacy units cannot support an exact match.
        old.append(dict(common=common, sci=sci, status=row[2], values=old_values, measured=row[7], location=row[9], points=float(row[6])))
    assert len(old) == 129 and sum(r['status'] == 'Champion' for r in old) == 82
    counties = gazetteer(county_path); subdivisions = gazetteer(subdiv_path)
    county_names = {r['GEOID']: r['NAME'].removesuffix(' County') for r in counties}
    county_points = {r['NAME'].removesuffix(' County'): dict(lat=float(r['INTPTLAT']), lng=float(r['INTPTLONG'])) for r in counties}
    cities = {r['NAME'].removesuffix(' city'): county_names[r['GEOID'][:5]] for r in subdivisions if r['NAME'].endswith(' city')}
    def general_place(location):
        cs = [name for name in county_points if re.search(r'\b' + re.escape(name) + r' County\b', location)]
        ts = [name for name in cities if re.search(r'\b' + re.escape(name) + r',?\s+(?:ND|North Dakota)\b', location)]
        if 'Valley City' in location: ts.append('Valley City')
        if 'Edgewood Golf Course, Fargo' in location: ts.append('Fargo')
        if 'ndsu campus' in location.lower() or 'north dakota state university campus' in location.lower(): ts.append('Fargo')
        if 'Dazey on Hwy' in location: ts.append('Dazey')
        ts = sorted(set(ts)); cs = sorted(set(cs + [cities[t] for t in ts]))
        return (ts[0] if len(ts) == 1 else '', cs[0] if len(cs) == 1 else '')
    records = []; fixture = []; reconciliation = []; excluded = []
    for place in tours[1]['data']['places']:
        excluded.append(dict(sourceNode=place['id'], commonName=texts(place['title'])[0], reason='Separate second-place section; not a first-place champion'))
    for index, place in enumerate(tours[0]['data']['places'], 1):
        lines = [s for key in place['contents'] for s in texts(key) if s]
        common = texts(place['title'])[0]; sci = lines[0].split('|')[0].strip(); native = lines[0].split('|')[-1].strip()
        assert 'Champion' in lines, (common, 'Missing explicit designation')
        score = float(next(s.split('=')[1] for s in lines if s.startswith('Total Points')))
        fields = dict(re.findall(r'^(Circumference|Height|Average Crown Spread|Date Measured):\s*([^\n]*)', '\n'.join(lines), re.M))
        values = measurements([fields[k] for k in ('Circumference', 'Height', 'Average Crown Spread')])
        location = next(s.split('Owner:')[0].strip() for s in lines if 'Owner:' in s)
        town, county = general_place(location); warnings = []; evidence = 'Published StoryMap general place'
        if common == 'Maple, Miyabe' and location == 'NDSU FM Parking Lot':
            town, county = 'Fargo', cities['Fargo']
            evidence = 'May 2026 announcement identifies the matching Miyabe maple on the NDSU campus in Fargo'
            warnings.append('The May 2026 official announcement identifies this matching Miyabe maple on the NDSU campus in Fargo. Its county is matched from Census municipality geography.')
        # Scientific spelling variants are retained in outputs; aliases only support review matching.
        match_sci = {'Ameliancher alnifolia': 'Amelanchier alnifolia'}.get(sci, sci)
        historical = [r for r in old if ({'Cataloa speciosa': 'Catalpa speciosa'}.get(r['sci'], r['sci'])) == match_sci and r['values'] is not None and all(abs(a-b) < .00001 for a,b in zip(r['values'], values))]
        if not county and len(historical) == 1:
            town, county = general_place(historical[0]['location'])
            if county:
                evidence = '2024 table exact scientific-name and three-measurement match'
                warnings.append('The StoryMap gives no general town/county label for this record. Its general place is recovered from the 2024 table by matching the scientific name and all three measurements. This historical match does not verify current tree condition or access.')
        if town and county: evidence += '; Census 2025 county subdivision identifies municipality county'
        previous = [r for r in old if ({'Cataloa speciosa': 'Catalpa speciosa'}.get(r['sci'], r['sci'])) == match_sci and r['status'] == 'Champion']
        changed = not any(r['values'] is not None and all(abs(a-b) < .00001 for a,b in zip(r['values'], values)) for r in previous)
        reconciliation.append(dict(sourceNode=place['id'], commonName=common, scientificName=sci, previousChampionMeasurements=[r['values'] for r in previous], currentMeasurements=values, noExactLegacyMeasurementMatch=changed, town=town, county=county, geographyEvidence=evidence if county else 'No supported general place match; left unmapped'))
        if common == 'Birch, River': warnings.append('The StoryMap lists circumference as 5 feet 0.6 inches (60.6 inches); the May 2026 announcement gives 60.7 inches. This record follows the published StoryMap and preserves its 133.6 points.')
        if common == 'Spruce, Norway': warnings.append('The StoryMap lists 48 feet of crown spread; the 2024 table lists 38.5 feet for the same circumference, height, and measurement month. The current StoryMap value is preserved.')
        if common == 'Maple, Miyabe': warnings.append('The StoryMap gives June 2023 as the measurement date. The May 2026 announcement names this tree among 2025 additions; announcement year is not substituted for measurement date.')
        if 'spp.' in sci: warnings.append('The source gives a genus-only botanical label. No species identity is inferred.')
        if sci in ('Ameliancher alnifolia', 'Betula alleganiensis', 'Carya illinoensis', 'Acer rubra'): warnings.append('The scientific name is retained exactly as published, including the source spelling; no botanical correction is inferred.')
        if not county: warnings.append('The published general place could not be matched using supported town/county evidence. This record remains searchable without a marker; tree coordinates are not imported.')
        raw_measurements = {k: fields[k] for k in ('Circumference', 'Height', 'Average Crown Spread')}
        fixture.append(dict(sourceNode=place['id'], commonName=common, scientificName=sci, designation='Champion', nativeLabel=native, rawMeasurements=raw_measurements, measured=month_date(fields.get('Date Measured', '')), points=score))
        records.append(dict(id='nd-' + place['id'].lower(), state='ND', sourceTreeId=place['id'], sourceRow=index, sourceUrl=STORY,
            commonName=common, scientificName=sci, town=town, county=county, location=None, measured=month_date(fields.get('Date Measured', '')),
            circumference=values[0], height=values[1], crown=values[2], points=score, status='North Dakota champion · published StoryMap', sourceReviewNotes=warnings,
            notes=f"Published North Dakota Forest Service StoryMap, retrieved October 11, 2026. Source classification: {native}. Source measurement date: {fields.get('Date Measured', '') or 'not listed'}. Original measurements: circumference {raw_measurements['Circumference']}; height {raw_measurements['Height']}; average crown spread {raw_measurements['Average Crown Spread']}. Names, scores and measurement dates preserved. Current condition and visiting access unverified. Marker represents an approximate county, not the individual tree. Exact tree coordinates, addresses, owners and nominators omitted."))
    fixture_path = ROOT / 'scripts/fixtures/north-dakota-champions.json'
    if fixture_path.exists(): assert fixture == json.loads(fixture_path.read_text()), 'Published register changed; review the fixture before importing'
    else: fixture_path.write_text(json.dumps(fixture, ensure_ascii=False, indent=2) + '\n')
    news = clean(news_path.read_text())
    announced = [('Chokecherry, Amur', 62.4), ('Poplar, Balsam', 233.6), ('Cottonwood, Smooth-Bark', 261.8), ('Locust, Black', 139.9), ('Walnut, Black', 176.4), ('Boxelder', 224.6), ('Cedar, Eastern Red', 88.5), ('Mayday Tree', 50.9), ('Maple, Miyabe', 56.1), ('Maple, Red', 107), ('Birch, River', 133.6), ('Crabapple', 119.1), ('Oak, Swamp White', 136.5)]
    for common, score in announced:
        row = next(r for r in records if r['commonName'] == common)
        assert row['points'] == score and str(score).removesuffix('.0') + ' points' in news, common
    used = {r['county']: county_points[r['county']] for r in records if r['county']}
    published = next(k.split(':')[1] for k in meta['typeKeywords'] if k.startswith('smpublisheddate:'))
    audit = dict(registerUrl=STORY, olderRegisterUrl=OLD, retrieved='October 11, 2026', lastPublished=datetime.fromtimestamp(int(published)/1000, timezone.utc).isoformat(),
        announcementUrl='https://www.ndsu.edu/ndfs/news/2026-04-30-new-champion-trees-crowned-2025', announcementDate='May 1, 2026', announcementChampionsReconciled=[name for name, score in announced], sourceRecords=137, includedChampions=len(records), excludedSecondPlace=len(excluded), olderChampions=82, mappedRecords=sum(bool(r['county']) for r in records),
        sourceHashes={p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in map(Path, paths)}, reconciliation=reconciliation, excluded=excluded,
        sourcePriority='Published StoryMap is the official current register. Older table and 2026 announcement are cross-checks, not additional champions to union. Draft resources and geometry are not used.',
        privacy='Raw owner, nominator, contact, address, photograph and individual tree geometry fields are omitted. Public ownership does not establish permission to visit.')
    for name, data in [('north-dakota-champion-trees.json', records), ('north-dakota-county-points.json', used), ('north-dakota-import-audit.json', audit)]:
        (ROOT / 'lib/data' / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(records=len(records), mapped=audit['mappedRecords'], unmapped=[r['id'] for r in records if not r['county']], counties=len(used), changed=sum(r['noExactLegacyMeasurementMatch'] for r in reconciliation))))
if __name__ == '__main__': build(sys.argv[1:])
